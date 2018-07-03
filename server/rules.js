const express = require('express')
const chalk = require('chalk')
const router = express.Router()
const models = require('./models')
const validator = require("email-validator")
const assign = require('lodash/assign')
const uuid = require('uuid')
const bcrypt = require('bcryptjs')

const sleep = function sleep(second) {
  return new Promise((resolve) => {
    setTimeout(resolve, second * 1000)
  })
}

/**
 * General settings
 */
router.all('*', (req, res, next) => {
  console.log(`${chalk.green(req.method)} ${chalk.gray(req.url)}`)
  if (Object.keys(req.query).length) {
    console.log(`query:  ${JSON.stringify(req.query)}`)
  }
  if (Object.keys(req.body).length) {
    console.log(`body:   ${JSON.stringify(req.body)}`)
  }
  sleep(1).then(next)
  // next()
})

/**
 * Create a new user
 * POST: /auth/register
 * REQUIRED: email, username, password, occupation
 * OPTIONAL: company
 * RETURN: 
 *   {
 *     'success': true or false
 *     'reason': null or reason
 *     'user': data
 *   }
 */
router.post('/auth/register', (req, res, next) => {
  let message = {
    'success': false,
    'reason': null,
    'user': null
  }

  if (req.body.username === undefined || req.body.username.length < 2 ) {
    message.reason = 'Username is empty!';
    res.end(JSON.stringify(message));
    return;
  }

  if (req.body.email === undefined || req.body.email.length < 2) {
    message.reason = 'Email is empty';
    res.end(JSON.stringify(message));
    return;
  }

  if (!validator.validate(req.body.email)) {
    message.reason = 'Your email is not validate!';
    res.end(JSON.stringify(message));
    return;
  }

  if (req.body.password === undefined || req.body.password.length < 8) {
    message.reason = 'Password is too weak!';
    res.end(JSON.stringify(message));
    return;
  }

  if (req.body.occupation === undefined || req.body.occupation.length < 2) {
    message.reason = 'Occupation is empty';
    res.end(JSON.stringify(message));
    return;
  }

  models.User.getByEmail(req.body.email, (err, user) => {
    if (user) {
      message.reason = 'Email already existed';
      res.end(JSON.stringify(message));
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash_password = bcrypt.hashSync(req.body.password, salt);

    const newUser = new models.User({
      username: req.body.username,
      password: hash_password,
      email: req.body.email,
      occupation: req.body.occupation,
      company: req.body.company,
    });
    newUser.save((err, user) => {
      if (err) {
        message.reason = err;
        res.end(JSON.stringify(message));
        return;
      }
      req.session.user = user;
      message.success = true;
      message.reason = 'successfully registred';
      message.user = user;
      // TODO: email for successfully registred
      res.end(JSON.stringify(message));
    });
  })
});

/**
 * Edit a user infomation
 * POST: /auth/edit
 * REQUIRED: userid
 * RETURN: 
 *   {
 *     'success': true or false
 *     'reason': null or reason
 *     'user': new data
 *   }
 */
router.post('/auth/edit', (req, res, next) => {
  let message = {
    'success': false,
    'reason': null,
    'user': null
  }

  if (req.body.username === undefined || req.body.username.length < 2 ) {
    message.reason = 'Username is too short!';
    res.end(JSON.stringify(message));
    return;
  }

  if (!validator.validate(req.body.email)) {
    message.reason = 'Your email is not valid!';
    res.end(JSON.stringify(message));
    return;
  }

  if (req.body.password === null) {
    message.reason = 'You must input password for saving changes!';
    res.end(JSON.stringify(message));
    return;
  }

  if (req.body.password.length < 8) {
    message.reason = 'Password is too weak, please set it longer!';
    res.end(JSON.stringify(message));
    return;
  }

  if (req.body.occupation === undefined || req.body.occupation.length < 2) {
    message.reason = 'Occupation is empty';
    res.end(JSON.stringify(message));
    return;
  }
  const userid = req.body.userid

  models.User.getById(userid, (err, user) => {
    if (user) {
      const salt = bcrypt.genSaltSync(10);
      const hash_password = bcrypt.hashSync(req.body.password, salt);

      const newUserInfo = new models.User({
        username: req.body.username,
        password: hash_password,
        email: req.body.email,
        occupation: req.body.occupation,
        company: req.body.company,
      });
      newUserInfo.editInfo(userid, (err, result) => {
        if (err) {
          message.reason = err;
          message.success = false;
          res.end(JSON.stringify(message));
          return;
        }
        req.session.user = user;
        message.success = true;
        message.reason = 'Account information has been updated';
        message.user = user;
        res.end(JSON.stringify(message));
      })
    } else {
      message.success = false;
      message.reason = 'System error';
      res.end(JSON.stringify(message));
    }
  })
});

/**
 * Delete account
 */

router.post('/auth/destroy', (req, res, next) => {
  const userid = req.body.userid

  console.log(userid)

  models.User.getById(userid, (err, user) => {
    if (user) {

      const newUserInfo = new models.User({
        email: `${user.email}:invalid`,
      });

      newUserInfo.editInfo(userid, (err, result) => {
        if (err) {
          message.reason = err;
          message.success = false;
          res.end(JSON.stringify(message));
          return;
        }
        req.session.destroy();
        let message = {
          'success': true,
          'reason': 'Your account has been destroyed.'
        };
        res.end(JSON.stringify(message));
      })
    } else {
      req.session.destroy();
      let message = {
        'success': true,
        'reason': 'Your account has been destroyed.'
      };
      res.end(JSON.stringify(message));
    }
  })
});

/**
 * Login for a user
 * POST: /auth/login
 * REQUIRED: email, password
 * RETURN:
 *   {
 *     'success': true or false
 *     'reason': null or reason
 *     'user': data
 *   }
 */
router.post('/auth/login', (req, res, next) => {
  console.log('login with ', req.body);
  let message = {
    'success': false,
    'reason': null,
    'user': null
  };
  models.User.getByEmail(req.body.email, (err, user) => {
    if (!user) {
      message.reason = 'User doesn\'t exists';
      res.end(JSON.stringify(message));
      return;
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      message.reason = 'Wrong password';
      res.end(JSON.stringify(message));
      return;
    }

    req.session.user = user;
    message.success = true;
    message.reason = 'Successfully Logedin';
    message.user = user;
    res.end(JSON.stringify(message));
  });
});
/**
 * Logout for a user
 * GET: /auth/logout
 * RETURN:
 *  {
 *    'success': true or false
 *    'reason': null or reason
 *  }
 */
router.get('/auth/logout', (req, res, next) => {
  req.session.destroy();
  let message = {
    'success': true,
    'reason': 'You just loged out.'
  };
  res.end(JSON.stringify(message));
});

/**
 * Request questionaire information
 * GET: /questionaire?code=uuid
 * RETURN:
 *  {
 *     'success': true or false
 *     'reason': null or reason
 *     'project': project detail
 *  }
 */
router.get('/questionaire', (req, res, next) => {
  if (req.query.code === undefined) {
    res.json({
      'success': false,
      'reason': 'Please specify questionaire code',
      'project': null
    });
    return;
  }
  models.User.getProjectByUUId(req.query.code, (project) => {
    if (project.length > 0) {
      const proj = project[0].projects[0];

      let today = new Date();
      let start = new Date(proj['create_at']);
      let end = start.setTime(start.getTime() + 3600 * 1000 * 24 * proj['duration'])
      if (today > end) {
        res.json({
          'success': false,
          'reason': 'Sorry, the project you try to access has outdated',
          'project': null,
        })
        return;
      }

      proj.participants = null; // don't send participants information
      res.json({
        'success': true,
        'reason': null,
        'project': proj,
      });
      return;
    } else {
      res.json({
        'success': false,
        'reason': 'You are accessing an user study project. Please specify a valid questionaire code',
        'project': null
      })
      return;
    }
  });
})
/**
 * submit for questionaire
 * POST: /questionaire?code=uuid
 * REQUIRED: answers
 * OPTIONAL: age, gender, nationality, occupation (can be null)
 * RETURN:
 *  {
 *    'success': true
 *    'reason': thanks
 *  }
 */
router.post('/questionaire', (req, res, next) => {
  var info = new models.Info({
    age: parseInt(req.body.info.age),
    gender: req.body.info.gender,
    nationality: req.body.info.nationality,
    email: req.body.info.email,
    occupation: req.body.info.occupation
  });
  var answers = req.body.answers;
  var participant = new models.Participant({
    info: info,
    questionaire: answers
  });
  console.log(participant)
  models.User.addQuestionaire(req.body.code, participant, () => {
    res.json({
      'success': true,
      'reason': 'Thanks for participating!'
    });
  });
})


/**
 * fetch all projects of a user
 * GET: /projects
 * REQUIRED: login
 * RETURN: 
 *   {
 *     'success': true or false
 *     'reason':  null or not loged in
 *     'projects': all projects
 *   }
 */
router.get('/projects', (req, res, next) => {
  var message = {
    'success': false,
    'reason': null,
    'projects': null
  }
  if (!req.session.user) {
    message.reason = 'please login'
    res.end(JSON.stringify(message));  
    return;
  }
  models.User.getByEmail(req.session.user.email, (err, user) => {
    if (user) {
      message.success = true;
      message.projects = user.projects;
    } else { // not possible?
      message.success = false;
      message.reason = 'no sure..';
    }
    res.end(JSON.stringify(message));
  });
})

/**
 * Create a new project for a logged in user
 * POST: /projects/create
 * REQUIRED: name, description, duration
 * OPTIONAL: image
 * RETURN: 
 *   {
 *     'success': true or false
 *     'reason': null or reason
 *   }
 */
router.post('/projects/create', (req, res, next) => {
  var message = {
    'success': false,
    'reason': null,
    'projects': null
  }
  if (!req.session.user) {
    message.reason = 'Please login'
    res.end(JSON.stringify(message));
    return;
  }
  if (req.body.name === undefined || req.body.name.length < 2) {
    message.reason = 'Project name is too short';
    res.end(JSON.stringify(message));
    return;
  }
  if (req.body.description === undefined || req.body.description.length < 2) {
    message.reason = 'Project description is too short';
    res.end(JSON.stringify(message));
    return;
  }
  if (req.body.create_at === undefined) {
    message.reason = 'Starting time error';
    res.end(JSON.stringify(message));
    return;
  }
  if (req.body.duration === undefined || parseInt(req.body.duration) < 2) {
    message.reason = 'Project duration is too short';
    res.end(JSON.stringify(message));
    return;
  }
  
  models.User.getByEmail(req.session.user.email, (err, user) => {
    if (!user) {
      // not possible?
    }
    var newProject = new models.Project({
      image: req.body.image,
      name: req.body.name,
      create_at: req.body.create_at,
      description: req.body.description,
      duration: parseInt(req.body.duration)
    });
    models.User.addProject(newProject, user, (result) => {
      models.User.getByEmail(req.session.user.email, (err, user) => {
        if (user) {
          message.success = true;
          message.projects = user.projects;
        } else { // not possible?
          message.success = false;
          message.reason = 'no sure..';
        }
        res.end(JSON.stringify(message));
      });
    });
  });
})

/**
 * Upload project image
 */
router.post('/projects/upload', function(req, res) {
  let message = {
    'success': true,
    'reason': 'Uploading success',
    'url': null
  }
  let image = req.files.file;
  let url = `/uploads/${uuid()}.jpg`;
  image.mv(__dirname + url, function(error) {
    if (error) {
      return res.status(500).send(error);
    }
    message.url = url;
    res.end(JSON.stringify(message))
  })
});

/**
 * Edit a project for a logged in user
 * POST: /projects/edit
 * REQUIRED: name, description, duration
 * OPTIONAL: image
 * RETURN: 
 *   {
 *     'success': true or false
 *     'reason': null or reason
 *   }
 */
router.post('/projects/edit', (req, res, next) => {
  var message = {
    'success': false,
    'reason': null
  };
  if (!req.session.user) {
    message.reason = 'please login'
    res.end(JSON.stringify(message));
    return;
  }
  if (req.body.id === undefined) {
    message.reason = 'project id is empty';
    res.end(JSON.stringify(message));
    return;
  }
  if (req.body.name === undefined || req.body.name.length < 2) {
    message.reason = 'project name is empty';
    res.end(JSON.stringify(message));
    return;
  }
  if (req.body.description === undefined || req.body.description.length < 2) {
    message.reason = 'project description is empty';
    res.end(JSON.stringify(message));
    return;
  }
  if (req.body.duration === undefined || parseInt(req.body.duration) < 2) {
    message.reason = 'project duration is emtpy';
    res.end(JSON.stringify(message));
    return;
  }
  var id = req.body.id;
  var email =  req.body.email;
  var newProject = new models.Project({
    image: req.body.image,
    name: req.body.name,
    description: req.body.description,
    create_at: req.body.create_at,
    duration: parseInt(req.body.duration)
  });
  console.log(newProject)
  models.User.editProject(id, req.session.user.email, newProject, (result) => {
    message.success = true;
    message.reason = result;
    res.end(JSON.stringify(message));
  });
})

/**
 * Delete a project for a logged in user
 * POST: /projects/delete
 * REQUIRED: id
 * OPTIONAL: image
 * RETURN: 
 *   {
 *     'success': true or false
 *     'reason': null or reason
 *   }
 */
router.post('/projects/delete', (req, res, next) => {
  var message = {
    'success': false,
    'reason': null
  };
  if (!req.session.user) {
    message.reason = 'please login'
    res.end(JSON.stringify(message));
    return;
  }
  if (req.body.id === undefined) {
    message.reason = 'project id is empty';
    res.end(JSON.stringify(message));
    return;
  }
  models.User.deleteProject(req.body.id, req.session.user.email, (result) => {
    message.success = true;
    message.reason = result;
    res.end(JSON.stringify(message));
  })
})

/**
 * Get a project for a logged in user
 * POST: /projects/:id
 * REQUIRED: id
 * OPTIONAL: image
 * RETURN: 
 *   {
 *     'success': true or false
 *     'reason': null or reason
 *     'project': project info
 *   }
 */
router.get('/projects/:id', (req, res, next) => {
  var message = {
    'success': false,
    'reason': null,
    'project': null
  };
  if (!req.session.user) {
    message.reason = 'please login'
    res.end(JSON.stringify(message));
    return;
  }
  models.User.getProjectById(req.params.id, (projects) => {
    message.success = true;
    message.project = projects[0].projects[0];
    res.json(message);
  });
});


router.get('/notifications', (req, res) => {
  const data = mock({
    system: [],
  })
  return res.json(data.system)
})

router.all('*', (req, res) => {
  res.status(404).json({ message: '404 Not found.' })
})
module.exports = router
