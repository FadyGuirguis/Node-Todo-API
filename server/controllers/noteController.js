//modules
var {ObjectId} = require('mongodb');
const _ = require('lodash');

//internal files
var {Todo} = require('../models/todo');
var {User} = require('../models/user');

module.exports.postNote = (req, res) => {
  var newTodo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  newTodo.save().then((doc) => {
    res.send({doc});
  }, (err) => {
    res.status(400).send(err);
  });
}

module.exports.getNotes = (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({
      todos
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
}

module.exports.getNote = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send({
      error: 'todo not found'
    });
  }
  Todo.findOne({
    _id: req.params.id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send({
        error: 'todo not found'
      });
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send({});
  });
}

module.exports.deleteNote = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send({
      error: 'todo not found'
    });
  }
  Todo.findOneAndRemove({
    _id: req.params.id,
    _creator: req.user._id
  })
  .then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send({err});
  })
}

module.exports.editNote = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send({
      error: 'todo not found'
    });
  }

  var body = _.pull(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

    Todo.findOneAndUpdate({
      _id: req.params.id,
      _creator: req.user._id
    },
      {
        $set: body
      }, {
        new: true
      }).then((todo) => {
        if (!todo) {
          return res.status(404).send();
        }
        res.send({todo});
      }).catch((err) => {
        res.status(400).send({err});
      })
}
