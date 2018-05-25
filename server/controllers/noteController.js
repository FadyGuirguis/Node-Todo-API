//modules
var {ObjectId} = require('mongodb');

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
