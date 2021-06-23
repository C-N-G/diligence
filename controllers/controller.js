const { exec } = require("child_process");
const util = require('../lib/util.js')
let controller = {};

controller.post = function(req, res, next) {

  let status = util.read_status();

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
  util.write_status(status);

  

  setTimeout(() => {
    cmd = "pm2 start macbot & pm2 start website"
    execute_command(cmd)
    console.log("starting server services")
    status = {state: "ready"}
    util.write_status(status);
  }, duration);


  res.redirect('/home');

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

module.exports = controller