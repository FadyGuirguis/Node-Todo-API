const expect = require('expect');
const request = require('supertest');
var {ObjectId} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {testUsers, testTodos, populateUsers, populateTodos} =
require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
      var text = 'test text';
      request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.doc.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(4);
          expect(todos[3].text).toBe(text);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });


  it('should not create todo with invalid data', (done) => {
    request(app)
    .post('/todos')
    .send({

    })
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(3);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });


});

describe('GET /todos', () => {

  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(3);
    })
    .end(done);
  });

});

describe('GET /todos:id', () => {

  it('should return todo doc', (done) => {
    request(app)
    .get('/todos/' + testTodos[0]._id.toHexString())
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(testTodos[0].text)
    })
    .end(done);
  });

  it('should return 404 for todo not found', (done) => {
    request(app)
    .get('/todos/' + new ObjectId().toHexString())
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/' + new ObjectId().toHexString() + "11")
    .expect(404)
    .end(done);
  });

});

describe('DELETE /todos:id', () => {

  it('should delete a todo', (done) => {
    request(app)
    .delete('/todos/' + testTodos[0]._id.toHexString())
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(testTodos[0].text)
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  it('should return 404 for todo not found', (done) => {
    request(app)
    .delete('/todos/' + new ObjectId().toHexString())
    .expect(404)
    .end(done);
  });

});

describe('PATCH /todos:id', () => {

  it('should set date if todo is completed', (done) => {
    var text = 'edited note';
    request(app)
    .patch('/todos/' + testTodos[0]._id.toHexString())
    .send({
      text,
      completed: true
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.doc.text).toBe(text);
      expect(res.body.doc.completed).toBeTruthy();
      expect(res.body.doc.completedAt).toBeInstanceOf(Date);
    })
    .end((err, res) => {
      Todo.findOne({_id: testTodos[0]._id.toHexString() })
      .then((todo) => {

        expect(todo.text).toBe(text);
        expect(todo.completed).toBeTruthy();
        expect(todo.completedAt).toBeInstanceOf(Date);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  it('should nullify date if todo is not completed', (done) => {
    var text = 'edited note';
    request(app)
    .patch('/todos/' + testTodos[0]._id.toHexString())
    .send({
      text,
      completed: false
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.doc.text).toBe(text);
      expect(res.body.doc.completed).toBeFalsy();
      expect(res.body.doc.completedAt).toBeNull();
    })
    .end((err, res) => {
      Todo.findOne({_id: testTodos[0]._id.toHexString() })
      .then((todo) => {

        expect(todo.text).toBe(text);
        expect(todo.completed).toBeFalsy();
        expect(todo.completedAt).toBeNull();
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });



});

describe('GET /users/me', () => {

  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', testUsers[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.user._id).toBe(testUsers[0]._id.toHexString());
      expect(res.body.user.email).toBe(testUsers[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

});

describe('POST /users', () => {

  it('should create user', (done) => {
    var email = 'fady97sameh@gmail.com';
    var password = 'password';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body.user._id).toBeTruthy();
      expect(res.body.user.email).toBe(email);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findOne({email})
      .then((user) => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  it('should return 400 if invalid email', (done) => {
    var email = 'fady97samehgmail.com';
    var password = 'password';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('should return 400 if password shorter than 8 characters', (done) => {
    var email = 'fady97sameh@gmail.com';
    var password = 'pass';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('should return 400 if eamil in use', (done) => {
    var email = testUsers[0].email;
    var password = 'password';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

});
