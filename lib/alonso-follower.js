var Hook = require('hook.io').Hook
  , os = require('os')
  , spawn = require('child_process').spawn
  , util = require('util')

var Follower = exports.Follower = function(options) {
  var self = this;
  Hook.call(this, options);

  self.hostname = self.hostname || os.hostname();

  self.on('hook::ready', function () {
    self._watch(self.path);
  });
}

util.inherits(Follower, Hook);

Follower.prototype.type = "Follower";

Follower.prototype.tail = null;

Follower.prototype._watch = function(path) {
  var self = this
  self.tail = spawn("tail", ["--follow=name", "--lines=0", path]);

  self.tail.stdout.on("data", function(data) {
    self._send(path, data.toString('utf8'));
  });

  self.tail.stdout.on("exit", function(data) {
    self.emit("follower::stopped", {
      "path": path,
      "hostname": self.hostname,
      "pid": self.tail.pid
    });
  });

  self.emit("follower::started", {
    "path": path,
    "hostname": self.hostname,
    "pid": self.tail.pid
  });
};

Follower.prototype._send = function(path, message) {
  var self = this;

  self.emit("follower::message::recieved", {
    "path": path,
    "hostname": self.hostname,
    "message": message,
    "date": new Date().getTime()
  });
};
