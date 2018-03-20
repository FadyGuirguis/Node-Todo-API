const {MongoClient, ObjectID} =require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect');
  }
  console.log('connection successful');

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
  //   console.log(result.result);
  // });
  //deleteOne
  db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
    console.log(result.result);
  });
  //findOneAndDelelete
  // db.collection('Todos').findOneAndDelete({text: 'eat lunch'}).then((result) => {
  //   console.log(result);
  // });
  db.close();
});
