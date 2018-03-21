var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('../db/mongoose');
var {Todo} = require('../models/todo');
var {User} = require('../models/user');

 var app = express();

 app.use(bodyParser.json());

 app.post('/todos', (req, res) => {
   console.log(res);
 })

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  })
