const { exec } = require("child_process")
let controller = {};

controller.post = function(req, res, next) {
  const duration = parseInt(req.body.shutdownDuration)
  console.log(duration)
}

module.exports = controller