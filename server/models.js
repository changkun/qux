const uuid = require('node-uuid');
const db = require('./db');
const ObjectId = require('mongodb').ObjectId;

function User(user) {
  this.email = user.email;
  this.username  = user.username;
  this.password = user.password;
  this.occupation = user.occupation;
  this.company = user.company;
}
function Info(info) {
  const date = new Date()
  this.create_at = date.toISOString();
  this.age = info.age;
  this.gender = info.gender;
  this.nationality = info.nationality;
  this.email = info.email;
  this.occupation = info.occupation;
}
function Participant(participant) {
  this.info = participant.info;
  this.questionaire= participant.questionaire;
}
function Project(project) {
  this.id = uuid.v1();
  this.uuid = uuid.v1();
  this.image = project.image;
  this.name = project.name;
  this.description = project.description;
  this.duration = project.duration;
  this.create_at = project.create_at;
  this.participants = [];
}

User.prototype.save = function(callback) {
  const user = {
      email: this.email,
      username: this.username,
      password: this.password,
      occupation: this.occupation,
      company: this.company,
      projects:[]
  };
  db.open((err, db) => {
    if (err) return callback(err);
    db.collection('users', (err, collection) => {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.insert(user, {
        safe: true
      }, (err, result) => {
        db.close();
        if (err) return callback(err);
        callback(null, result.ops[0])
      });
    });
  });
}
User.prototype.editInfo = function(userid, callback) {
  db.open((err, db) => {
    if (err) return callback(err, null);
    db.collection('users', (err, collection) => {
      if (err) {
        db.close();
        return callback(err, null);
      }
      const where = { '_id': {'$eq': new ObjectId(userid) } };
      const set = {
        $set: {
          email : this.email,
          username : this.username,
          password : this.password,
          occupation : this.occupation,
          company: this.company
        }
      }
      collection.update(where, set, (err, result) => {
        db.close()
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      })
    })
  })
}
User.getById = (userid, callback) => {
  db.open((err, db) => {
    if (err) return callback(err);
    db.collection('users', (err, collection) => {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.findOne({
        _id: new ObjectId(userid)
      }, (err, user) => {
        db.close();
        if (err) return callback(err);
        callback(null, user); //success, return user info
      })
    })
  })
}
User.getByEmail = (email, callback) => {
  db.open((err, db) => {
    if (err) return callback(err);
    db.collection('users', (err, collection) => {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.findOne({
        email: email
      }, (err, user) => {
        db.close();
        if (err) return callback(err);
        callback(null, user); //success, return user info
      })
    })
  })
}
User.getByUsername = (username) => {
  db.open((err, db) => {
    if (err) return callback(err);
    db.collection('users', (err, collection) => {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.findOne({
        username: username
      }, (err, user) => {
        db.close();
        if (err) return callback(err);
        callback(null, user); //success, return user info
      })
    })
  })
}
User.addProject = (project, user, callback) => {
  db.open((err, db) => {
    if (err) return callback(err);
    const collection = db.collection('users');
    const where = { 'email': {'$eq': user.email } };
    const set = { $push: { projects: project} };
    collection.update(where, set, (err, result) => {
        db.close();
        if (err) {
            console.log('error: ' + err);
            return;
        }
        callback(result);
    });
  });
}
User.getProjectById = (id, callback) => {
  db.open((err, db) => {
    if (err) return callback(err);
    db.collection('users', (err, collection) => {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.find(
          {'projects.id': id},
          {projects: {$elemMatch: {id: id}}, _id: 0}
      ).toArray((err, projects) => {
          db.close();
          if (err) return callback(err);
          callback(projects);
        }
      );
      });
  });
}
User.deleteProject = (id, email, callback) => {
  db.open(function (err, db) {
    if (err) return callback(err);
    db.collection('users', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      if (id != null) {
          collection.update(
              {'email':email},
              {$pull:{'projects':{'id':id}}}
          );
      }
      else {
          collection.update(
              {'email':email},
              {$pull:{'projects':{}}}
          );
      }
      db.close();
      callback('update finish');
      });
  });
}
User.editProject = (id, email, p, callback) => {
  db.open(function (err, db) {
    if (err) return callback(err);
    db.collection('users', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.update(
        {
          email: email,
          projects: { $elemMatch: { id: id } }
        }, { 
          $set: { 
            "projects.$.name" : p.name,
            "projects.$.image" : p.image,
            "projects.$.create_at": p.create_at,
            "projects.$.description" : p.description,
            "projects.$.duration" : p.duration
          } 
        }
      );
      db.close();
      callback("update finish");
    });
  });
}
User.getProjectByUUId = (uuid, callback) => {
  db.open((err, db) => {
    if (err) return callback(err);
    db.collection('users', (err, collection) => {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.find(
          {"projects.uuid":uuid},
          {projects: {$elemMatch: {uuid: uuid}}, _id: 0}
      ).toArray((err, projects) => {
          db.close();
          if (err) return callback(err);
          callback(projects);
        }
      );
    });
  });
}
User.addQuestionaire = (uuid, participant, callback) => {
  db.open(function (err, db) {
    if (err) return callback(err);
    var collection = db.collection('users');
    var where={
        "projects.uuid": uuid
        // {projects: {$elemMatch: {uuid: uuid}}, _id: 0}
    };
    var set = {$push:{"projects.$.participants": participant}};
    collection.update(where, set, function(err, result) {
        db.close();
        if(err) {
          console.log('error: '+ err);
          return;
        }
        callback(result);
    });
  });
}

module.exports = {
  User: User,
  Info: Info,
  Participant: Participant,
  Project: Project
}