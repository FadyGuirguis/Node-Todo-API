//modules
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');

//interna files
require('./config/config');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var noteController = require('./controllers/noteController');

var app = express();

app.use(bodyParser.json());

//routes
app.post('/todos', noteController.postNote);

app.get('/todos', noteController.getNotes);

app.get('/todos/:id', noteController.getNote);

app.delete('/todos/:id', noteController.deleteNote);

app.patch('/todos/:id', noteController.editNote);


app.listen(3000, () => {
  console.log("Server running on port 3000");
})

module.exports = {app};
