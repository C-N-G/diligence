const path = require('path');
const fs = require('fs');
const pbkdf2 = require('pbkdf2')
const crypto = require('crypto')

let users = {};

users.get = function(req, res, next) {
  res.send(read_users())
}

users.post = function(req, res, next) {
  let users = read_users();
  const salt = crypto.randomBytes(16).toString('hex');
  let password = req.body.password;
  const hash = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex');
  password = hash;

  users.push({username: req.body.username, password: password, salt: salt})
  write_users(users)

  console.log(`added new user with name:${req.body.username} password: ${password} salt: ${salt}`)
  res.redirect("/home.html")
}

users.put = function(req, res, next) {

}

users.delete = function(req, res, next) {

}

function read_users() {
  let filePath = path.join(__dirname, '/data', 'users.json')
  const users = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(users)
}

function write_users(users) {
  let filePath = path.join(__dirname, '/data', 'users.json')
  fs.writeFileSync(filePath, JSON.stringify(users), 'utf8')
}

module.exports = users;