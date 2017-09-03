var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var goalSchema = new Schema({
    name: String,
    notes: String,
    date: String,
    points: Number,
    award: String,
    createdate: String,
    active: Boolean,
    complete: Boolean
}, {
    timestamps: true
});

var taskSchema = new Schema({
    "name": String,
    "notes": String,
    "freq": String,
    "points": Number,
    "count": Number,
    "createdate": String,
    "active": Boolean
}, {
    timestamps: true
});

var rewardSchema = new Schema({
    "name": String,
    "notes": String,
    "points": Number,
    "count": Number,
    "createdate": String,
    "active": Boolean
}, {
    timestamps: true
});

var trackingSchema = new Schema({
    "rpoints": Number,
    "cheeves": Number,
    "trophies": Number,
    "ltrpoints": Number,
    "ltgoals": Number,
    "ltgoalsTarget": Number,
    "ltcomps": Number,
    "ltcompsTarget": Number,
    "lttasks": Number,
    "lttasksTarget": Number,
    "ltperfs": Number,
    "ltperfsTarget": Number,
    "ltrewards": Number,
    "ltrewardsTarget": Number,
    "ltclaims": Number,
    "ltclaimsTarget": Number,
    "ltarcs": Number,
    "ltarcsTarget": Number,
    "ltacts": Number,
    "ltactsTarget": Number,
    "lttrops": Number,
    "lttropsTarget": Number,
    "ltrests": Number,
    "ltcopies": Number,
    "ltedits": Number,
    "ltdels": Number
}, {
    timestamps: true
});

var userSchema = new Schema({
    username: String,
    password: String,
    admin:   {
        type: Boolean,
        default: false
    },
    goals:[goalSchema],
    tasks:[taskSchema],
    rewards:[rewardSchema],
    tracking:[trackingSchema]
}, {
    timestamps: true,
    versionKey: false
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);