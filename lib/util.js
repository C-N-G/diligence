const path = require('path')
const fs = require('fs')
module.exports = {
  read_users() {
    let filePath = path.join(__dirname, '/../data', 'users.json')
    const users = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(users)
  },

  write_users(users) {
    let filePath = path.join(__dirname, '/../data', 'users.json')
    fs.writeFileSync(filePath, JSON.stringify(users), 'utf8')
  },

  read_status() {
    let filePath = path.join(__dirname, '/../data', 'status.json')
    const status = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(status)
  },
  
  write_status(status) {
    let filePath = path.join(__dirname, '/../data', 'status.json')
    fs.writeFileSync(filePath, JSON.stringify(status), 'utf8')
  }
}