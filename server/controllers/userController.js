//modules
var {ObjectId} = require('mongodb');
const _ = require('lodash');

//internal files
var {Todo} = require('../models/todo');
var {User} = require('../models/user');

module.exports.postUser = (req, res) => {
  var user = new User(_.pick(req.body, ['email', 'password']));
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send({user});
  }).catch((err) => {
    res.status(400).send({err});
  });
};

module.exports.getMe = (req, res) => {
  var token = req.header('x-auth');
  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    res.send({user});
  }).catch((err) => {
    res.status(401).send({});
  });
};

module.exports.login = (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password)
  .then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({user});
    });
  }).catch((err) => {
    res.status(400).send({err: 'wrong email or password'});
  });
};
