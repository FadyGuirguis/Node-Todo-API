const {MongoClient, ObjectID} =require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect');
  }
  console.log('connection successful');

//   db.collection("Todos").findOneAndUpdate({
//     _id: new ObjectID("5ab17f0579314da2f6960e65")
//   }, {
//     $set: {
//       completed: true
//     }
//   }, {
//     returnOriginal: false
//   }
// ).then((result) => {
//   console.log(result);
// });

db.collection("Users").findOneAndUpdate({
  name: 'michael'
}, {
  $set: {
    name: 'mike'
  },
  $inc: {
    age: 1
  }
}, {
  returnOriginal: false
}
).then((result) => {
console.log(result);
});


  db.close();
});
