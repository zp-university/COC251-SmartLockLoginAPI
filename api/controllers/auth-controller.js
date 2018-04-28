'use strict'

const auth = require("../helpers/auth");

const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.loginPost = function (args, res, next) {
    let username = args.body.username;
    let password = args.body.password;

    User.findOne({username: username}, function (err, task) {
        //Return incorrect credentials if user doesn't exist or password is incorrect
        if (err || !task) {
            let response = {message: "Error: Internal server error"};
            res.writeHead(500, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else if (task == null || password !== task.password) {
            let response = {message: "Error: Credentials incorrect"};
            res.writeHead(403, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else {
            auth.issueToken(task.id, true, function (err, tokenString) {
                if(err || !tokenString) {
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

exports.signupPost = function (args, res, next) {

    let user = new User({
        username: args.body.username,
        password: args.body.password,
        email: args.body.email,
        firstname: args.body.firstname,
        lastname: args.body.lastname
    });

    //Check if
    User.findOne({$or: [{username: user.username}, {email: user.email}]}, function(err, task) {
        if (err) {
            let response = {message: "Error: Internal server error"};
            res.writeHead(500, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else if (task) {
            let response = {message: "Error: Email or Username already registered by another user"};
            res.writeHead(409, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(response));
        } else {
            user.save(function(err, task) {
                if(err) {
                    let response = {message: "Error: Internal server error"};
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify(response));
                } else {
                    auth.issueToken(task.id, true, function (err, tokenString) {
                        if(err || !tokenString) {
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
        }
    });
};