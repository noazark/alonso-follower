#!/usr/bin/env node

var Follower = require('../lib/alonso-follower').Follower;

// TODO: CLI configuration

var follower = new Follower({
    name: "follower",
    debug: true
});

follower.start();