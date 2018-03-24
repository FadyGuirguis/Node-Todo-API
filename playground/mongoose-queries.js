const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5ab3a15075520c247c2935c963';

// Todo.find({
//   _id: id
// })
// .then((todos) => {
//   console.log(todos);
// });

Todo.findById(id).then((todo) => {
  console.log(todo);
}).catch((err) => {
  console.log('an error occured');
});
