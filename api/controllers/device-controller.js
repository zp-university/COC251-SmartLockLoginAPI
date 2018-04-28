'use strict'

const auth = require("../helpers/auth");

const mongoose = require('mongoose');
const Device = mongoose.model('Device');
const DeviceToken = mongoose.model('DeviceToken');

exports.deviceRegister = function (args, res, next) {

    let device = new Device({
        name: args.body.name,
        uuid: args.body.uuid
    });

    device.save(function(err, task) {
        if(err || !task) {
            let response = {message: "Error: Internal server error"};
            res.writeHead(500, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else {
            auth.issueToken(task.id, false, function (err, tokenString) {
                if (err || !tokenString) {
                    let response = {message: "Error: Internal server error"};
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                } else {
                    let response = {token: tokenString};
                    res.writeHead(200, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                }
            });
        }
    });
};

exports.deviceGetDevice = function(args, res, next) {
    DeviceToken.findOne({_id: args.auth.tid}, {}, function(err, deviceToken) {
        if(err || !deviceToken) {
            let response = {message: "Error: Internal server error"};
            res.writeHead(500, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else {
            Device.findOne({_id: deviceToken.device}, {}, function(err, device) {
                if(err || !device) {
                    let response = {message: "Error: Internal server error"};
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                } else {
                    let response = device;
                    res.writeHead(200, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                }
            });
        }
    });
};