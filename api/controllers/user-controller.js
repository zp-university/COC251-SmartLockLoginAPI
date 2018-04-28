'use strict'

const mongoose = require('mongoose');
const Device = mongoose.model('Device');
const UserToken = mongoose.model('UserToken');
const User = mongoose.model('User');
const UserDevice = mongoose.model('UserDevice');

exports.userDeviceAdd = function(args, res, next) {
    UserToken.findOne({_id: args.auth.tid}, {}, function(err, userToken) {
        if(err || !userToken) {
            let response = {message: "Error: Internal server error"};
            res.writeHead(500, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else {
            Device.findOne({uuid: args.body.uuid}, {}, function(err, device) {
                if(err || !device) {
                    let response = {message: "Error: Internal server error"};
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                } else {
                    let userDevice = new UserDevice({
                        user: userToken.user,
                        device: device._id
                    });

                    UserDevice.findOneAndUpdate({user: userToken.user}, userDevice, {
                        new: true,
                        upsert: true
                    }, function(err, task) {
                        if(err || !task) {
                            console.log(3);
                            let response = {message: "Error: Internal server error"};
                            res.writeHead(500, {"Content-Type": "application/json"});
                            return res.end(JSON.stringify(response));
                        } else {
                            device._id = null;
                            device.__v = null;
                            var response = device;
                            res.writeHead(200, {"Content-Type": "application/json"});
                            return res.end(JSON.stringify(response));
                        }
                    });
                }
            });
        }
    })
};

exports.userDeviceLock = function(args, res, next) {
    UserToken.findOne({_id: args.auth.tid}, {}, function(err, userToken) {
        if(err || !userToken) {
            console.log(1);
            let response = {message: "Error: Internal server error"};
            res.writeHead(500, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else {
            UserDevice.findOne({user: userToken.user}, {}, function(err, userDevice) {
                if(err || !userDevice) {
                    console.log(2);
                    let response = {message: "Error: Internal server error"};
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                } else {
                    Device.findOne({_id: userDevice.device}, {}, function(err, device) {
                        if(err || !device) {
                            console.log(3);
                            let response = {message: "Error: Internal server error"};
                            res.writeHead(500, {"Content-Type": "application/json"});
                            return res.end(JSON.stringify(response));
                        } else {
                            device.locked = args.body.locked;
                            device.save(function (err, newDevice) {
                                if (err || !newDevice) {
                                    console.log(4);
                                    let response = {message: "Error: Internal server error"};
                                    res.writeHead(500, {"Content-Type": "application/json"});
                                    return res.end(JSON.stringify(response));
                                } else {
                                    let response = newDevice;
                                    res.writeHead(200, {"Content-Type": "application/json"});
                                    return res.end(JSON.stringify(response));
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.userGetDevice = function(args, res, next) {
    UserToken.findOne({_id: args.auth.tid}, {}, function(err, userToken) {
        if(err || !userToken) {
            let response = {message: "Error: Internal server error"};
            res.writeHead(500, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else {
            UserDevice.findOne({user: userToken.user}, {}, function(err, userDevice) {
                if(err || !userDevice) {
                    let response = {message: "Error: Internal server error"};
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                } else {
                    Device.findOne({_id: userDevice.device}, {}, function(err, device) {
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
        }
    });
};