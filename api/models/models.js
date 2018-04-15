/*jslint node:true, es5:true, nomen: true, plusplus: true */
/*globals module */
/*globals require */


//limit the scope
(function(){
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var user = new Schema({
        username        : {type : String},
        password        : {type : String},
        email           : {type : String},
        firstName       : {type : String},
        lastName        : {type : String}
    });

    var token = new Schema({
        user                : {type : Schema.Types.ObjectId, ref: 'User'}
    });

    module.exports.User    = mongoose.model('User', user);
    module.exports.Token   = mongoose.model('Token', token);

    module.exports.getId = function (id) {
        "use strict";
        try {
            return mongoose.Types.ObjectId(id);
        } catch (ex) {
            console.log(ex);
            return null;
        }
    };
}());