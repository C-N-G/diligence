const express = require('express')
const auth = require('./controllers/auth')
const users = require('./controllers/users')
const controller = require('./controllers/controller')
const util = require('./lib/util.js')

const app = express()
const port = 1444

session = require('express-session')

app.use(session({
  secret: 'diligence',
  resave: false,
  saveUninitialized: false,
  cooke: {maxAge: 3600000}
}))

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.set('view engine', 'pug')
app.set('views', './pages')

app.use(auth.intercept)

app.get('/login', (req, res, next) => {
  res.render('login', { title: 'Hey', message: 'Hello there!' })
})
app.get('/home', (req, res, next) => {
  res.render('home')
})
app.get('/users', (req, res, next) => {
  res.render('users')
})

app.post('/login', auth.authenticate)

app.get('/api/users', users.get);
app.post('/api/users', users.post);
app.put('/api/users', users.put);
app.delete('/api/users', users.delete);

app.post('/api/controller', controller.post);

// app.use(express.static(path.join(__dirname, 'public'))) // static folder setup 

app.listen(port, () => {
  console.log(`Diligence app listening at http://localhost:${port}`)
})

let status = {state: 'ready'}
util.write_status(status)
