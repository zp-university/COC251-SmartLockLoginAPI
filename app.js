"use strict";

var app = require("express")();
var swaggerTools = require("swagger-tools");
var YAML = require("yamljs");

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var dbUser = process.env.DB_USER;
var dbPass = process.env.DB_PASS;
var dbHost = process.env.DB_HOST;
var dbPort = process.env.DB_PORT;
var dbName = process.env.DB_NAME;

mongoose.connect('mongodb://' + dbUser + ':' + dbPass + '@' + dbHost + ':' + dbPort + '/' + dbName);
var model = require('./api/models/models');

var auth = require("./api/helpers/auth");
var swaggerConfig = YAML.load("./api/swagger/swagger.yaml");

swaggerTools.initializeMiddleware(swaggerConfig, function (middleware) {
    //Serves the Swagger UI on /docs
    app.use(middleware.swaggerMetadata()); // needs to go BEFORE swaggerSecurity

    app.use(
        middleware.swaggerSecurity({
            //manage token function in the 'auth' module
            Bearer: auth.verifyToken
        })
    );

    var routerConfig = {
        controllers: "./api/controllers",
        useStubs: false
    };

    app.use(middleware.swaggerRouter(routerConfig));

    app.use(middleware.swaggerUi());

    app.listen(3000, function () {
        console.log("Started server on port 3000");
    });
});
