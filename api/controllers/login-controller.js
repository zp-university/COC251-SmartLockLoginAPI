'use strict'

var auth = require("../helpers/auth");

var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.loginPost = function (args, res, next) {
    var username = args.body.username;
    var password = args.body.password;

    User.findOne({username: username}, function (err, task) {
        //Return incorrect credentials if user doesn't exist or password is incorrect
        if (err) {
            var response = {message: "Error: Internal server error"};
            res.writeHead(500, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else if (task == null || password !== task.password) {
            var response = {message: "Error: Credentials incorrect"};
            res.writeHead(403, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else {
            var tokenString = auth.issueToken(task.id, function (err, tokenString) {
                if(err || !tokenString) {
                    var response = {message: "Error: Internal server error"};
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                } else {
                    var response = {token: tokenString};
                    res.writeHead(200, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                }
            });
        }
    });
};

exports.signupPost = function (args, res, next) {

    var user = new User({
        username: args.body.username,
        password: args.body.password,
        email: args.body.email,
        firstname: args.body.firstname,
        lastname: args.body.lastname
    });

    //Check if
    User.findOne({$or: [{username: user.username}, {email: user.email}]}, function(err, task) {
        if (err) {
            var response = {message: "Error: Internal server error"};
            res.writeHead(500, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else if (task) {
            var response = {message: "Error: Email or Username already registered by another user"};
            res.writeHead(409, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else {
            user.save(function(err, task) {
                if(err) {
                    var response = {message: "Error: Internal server error"};
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                } else {
                    var tokenString = auth.issueToken(task.id, function (err, tokenString) {
                        if(err || !tokenString) {
                            var response = {message: "Error: Internal server error"};
                            res.writeHead(500, {"Content-Type": "application/json"});
                            return res.end(JSON.stringify(response));
                        } else {
                            var response = {token: tokenString};
                            res.writeHead(200, {"Content-Type": "application/json"});
                            return res.end(JSON.stringify(response));
                        }
                    });
                }
            });
        }
    })
};