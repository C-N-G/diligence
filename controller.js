const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');
let controller = {};

controller.post = function(req, res, next) {

  let status = read_status();

  if (status.state == "waiting") {
    res.send(`
<p>services are already offline</p><br>
<p>services will return on ${status.returnTime}</p>
    `)
    return
  }

  let duration = parseInt(req.body.shutdownDuration) * 60 * 1000
  
  let cmd = "pm2 stop macbot & pm2 stop website"
  execute_command(cmd)
  console.log("stopping server services")
  let returnTime = get_return_time(duration);
  status = {state: "waiting", returnTime: returnTime}
  write_status(status);

  

  setTimeout(() => {
    cmd = "pm2 start macbot & pm2 start website"
    execute_command(cmd)
    console.log("starting server services")
    status = {state: "ready"}
    write_status(status);
  }, duration);


  res.redirect('/home.html');

}

function execute_command(cmd) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

function get_return_time(duration) {
  let returnTime = new Date (Date.now() + duration);
  return returnTime.toString();
}

function read_status() {
  let filePath = path.join(__dirname, '/data', 'status.json')
  const status = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(status)
}

function write_status(status) {
  let filePath = path.join(__dirname, '/data', 'status.json')
  fs.writeFileSync(filePath, JSON.stringify(status), 'utf8')
}

module.exports = controller