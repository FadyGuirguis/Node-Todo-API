const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'fady';
var hashed;
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    hashed = hash;
    bcrypt.compare(password, hashed, (err, res) => {
      console.log(res);
    });
  });
});


// var data = {
//   name: 'fady97sameh',
//   id: 4
// };
//
// var token = jwt.sign(data, 'salt');
// console.log(token);
//
// var decoded = jwt.verify(token, 'salt');
// console.log(decoded);

// var message = 'My name is fady';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
