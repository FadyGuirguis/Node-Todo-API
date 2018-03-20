const {MongoClient, ObjectID} =require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect');
  }
  console.log('connection successful');

  // db.collection('Todos').insertOne({
  //   text: 'do something',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log("Unable to insert", err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
    name: 'fady',
    age: 20,
    location: 'Cairo'
  }, (err, result) => {
    if (err) {
      return console.log("Unable to insert", err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  db.close();
});
