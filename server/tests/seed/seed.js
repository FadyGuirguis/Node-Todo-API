var {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken')

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');



const user1ID = new ObjectId();
const user2ID = new ObjectId();

const testUsers = [
  {
    _id: user1ID,
    email: 'userone@gmail.com',
    password: 'useronepassword',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: user1ID, access: 'auth'},
        process.env.JWT_SECRET).toString()
      }
    ]
  },
  {
    _id: user2ID,
    email: 'usertwo@gmail.com',
    password: 'usertwopassword',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: user2ID, access: 'auth'},
        process.env.JWT_SECRET).toString()
      }
    ]
  }
]

const testTodos = [
  {
    _id: new ObjectId(),
    text: 'first todo',
    _creator: user1ID
  },
  {
    _id: new ObjectId(),
    text: 'second todo',
    _creator: user1ID
  },
  {
    _id: new ObjectId(),
    text: 'third todo',
    _creator: user2ID
  }
];

const populateUsers = (done) => {
  User.remove({})
  .then(() => {
    var user1 = new User(testUsers[0]).save();
    var user2 = new User(testUsers[1]).save();

    return Promise.all([user1, user2]);
  }).then(() => {
    done();
  });
}

const populateTodos = (done) => {
  Todo.remove({})
  .then(() => {
      Todo.insertMany(testTodos);
      done();
  });

};

module.exports = {
  testUsers,
  testTodos,
  populateUsers,
  populateTodos,
}
