//modules
var {ObjectId} = require('mongodb');
const _ = require('lodash');

//internal files
var {Todo} = require('../models/todo');
var {User} = require('../models/user');

module.exports.postNote = (req, res) => {
  var newTodo = new Todo({
    text: req.body.text
  });
  newTodo.save().then((doc) => {
    res.send({doc});
  }, (err) => {
    res.status(400).send(err);
  });
}

module.exports.getNotes = (req, res) => {
  Todo.find().then((todos) => {
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
  Todo.findById(req.params.id).then((todo) => {
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
  Todo.findByIdAndRemove(req.params.id)
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

    Todo.findByIdAndUpdate(req.params.id,
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
