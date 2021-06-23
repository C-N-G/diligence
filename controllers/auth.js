const pbkdf2 = require('pbkdf2')
const util = require('../lib/util.js')

let auth = {};

auth.intercept = function (req, res, next) {

  if (req.session.authenticated) {
    next()
    return
  } else {
    req.session.authenticated = false;
    if (req.path == "/login") {
      next()
      return
    } else {
      res.redirect("/login")
    }
  }

}

auth.authenticate = function(req, res, next) {
  
  const users = util.read_users()

  let i = 0;
  for (i; i < users.length; i++) {

    let password = req.body.password;
    let hash = pbkdf2.pbkdf2Sync(password, users[i].salt, 1, 32, 'sha512').toString('hex');
    password = hash;

    if (users[i].username === req.body.username && users[i].password === password) {
      req.session.authenticated = true;
      console.log(`login successful with name: ${req.body.username}`)
      res.redirect('/home')
      return
    }
  }

  console.log(`login failed with name: ${req.body.username}`)
  res.redirect('/login')

}

module.exports = auth;