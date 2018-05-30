const expect = require('expect');
const request = require('supertest');
var {ObjectId} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
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
