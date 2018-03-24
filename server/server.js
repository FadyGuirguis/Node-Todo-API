var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

 var app = express();

 app.use(bodyParser.json());

 app.post('/todos', (req, res) => {
   var newTodo = new Todo({
     text: req.body.text
   });
   newTodo.save().then((doc) => {
     res.send({doc});
   }, (err) => {
     res.status(400).send(err);
   });
 });

 app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
     res.send({
       todos
     });
   }).catch((err) => {
     res.status(400).send(err);
   });
 });

 app.get('/todos/:id', (req, res) => {
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
 });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })

  module.exports = {app};
