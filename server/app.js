const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo')(session);
const rules = require('./rules');
const process = require('process');
const cors = require('cors')
process.setMaxListeners(0);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(session({
  secret: 'qux-tool',
  key: 'qux', // cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 30days
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    db: 'qux',
    host: 'localhost',
    port: 27017
  })
}));
app.use('/api', rules)
app.use('/uploads', express.static('uploads'))
app.use('/', express.static('public'))
app.listen(3001, () => {
  console.log('QUX-tool Server is running at http://localhost:3001')
})
