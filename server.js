#!/bin/env node

// DEPS
var express = require('express')
var feed2csv = require(__dirname + '/app')

///////////////
/// Config
///////////////
var App = function() {
    this.server = express();

    // API
    this.server.post('/feed2csv', function(req, res) {
        feed2csv.fromFormData(req, res);
    });

    // Frontend
    this.server.use(express.static(__dirname + '/public'));
}
App.prototype.start = function() {
    var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
    var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
    this.server.listen(port, ipaddress);
    console.log((new Date()) + ': Magic happens at ' + ipaddress + ":" + port);
}

///////////////
/// Fire it up
///////////////
var BoomPPC = new App();
BoomPPC.start();