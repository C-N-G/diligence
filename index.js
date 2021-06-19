const express = require('express')
const path = require('path')
const fs = require('fs');
const auth = require('./auth')
const users = require('./users')
const controller = require('./controller')

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

app.use(auth.intercept)

app.post('/login.html', auth.authenticate)

app.get('/api/users', users.get);
app.post('/api/users', users.post);
app.put('/api/users', users.put);
app.delete('/api/users', users.delete);

app.post('/api/controller', controller.post);

app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
  console.log(`Diligence app listening at http://localhost:${port}`)
})

let status = {state: 'ready'}
write_status(status)
function write_status(status) {
  let filePath = path.join(__dirname, '/data', 'status.json')
  fs.writeFileSync(filePath, JSON.stringify(status), 'utf8')
}
