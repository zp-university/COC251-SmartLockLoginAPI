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

    var userToken = new Schema({
        user            : {type : Schema.Types.ObjectId, ref: 'User'}
    });

    var userDevice = new Schema({
        user            : {type : Schema.Types.ObjectId, ref: 'User'},
        device          : {type : Schema.Types.ObjectId, ref: 'Device'}
    });

    var device = new Schema({
        name            : {type : String},
        uuid            : {type : String},
        created         : {type : Date, default: Date.now},
        locked          : {type : Boolean, default: true}
    });

    var deviceToken = new Schema({
        device          : {type : Schema.Types.ObjectId, ref: 'Device'}
    });

    module.exports.User         = mongoose.model('User', user);
    module.exports.UserToken    = mongoose.model('UserToken', userToken);
    module.exports.UserDevice   = mongoose.model('UserDevice', userDevice);
    module.exports.Device       = mongoose.model('Device', device);
    module.exports.DeviceToken  = mongoose.model('DeviceToken', deviceToken);

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