const pbkdf2 = require('pbkdf2')
const crypto = require('crypto')
const util = require('../lib/util.js')

let users = {};

users.get = function(req, res, next) {
  res.send(util.read_users())
}

users.post = function(req, res, next) {
  let users = util.read_users();
  const salt = crypto.randomBytes(16).toString('hex');
  let password = req.body.password;
  const hash = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex');
  password = hash;

  users.push({username: req.body.username, password: password, salt: salt})
  util.write_users(users)

  console.log(`added new user with name:${req.body.username} password: ${password} salt: ${salt}`)
  res.redirect("/home")
}

users.put = function(req, res, next) {

}

users.delete = function(req, res, next) {

}

module.exports = users;