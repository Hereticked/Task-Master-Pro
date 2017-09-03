var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');
var _ = require('lodash'); // used for updating embedded documents

router.use(bodyParser.json());

// Get list of all users with only basic account info (admin only)
router.get('/list', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    
    var myQuery = User.find();
    // exclude all but basic account information
    myQuery.select('-goals -tasks -rewards -tracking');

    myQuery.exec(function (err, User) {
        if (err) return next(err);
        res.json(User);
    });
    
});

// Get full profile of one user (admin only)
router.get('/profile/:userId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    User.findById(req.params.userId)
        .exec(function (err, User) {
        if (err) return next(err);
        res.json(User);
    });
});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
        req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        if(req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            user.lastname = req.body.lastname;
        }
        user.save(function(err,user) {
            passport.authenticate('local')(req, res, function () {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                return res.status(200).json({status: 'Registration Successful!'});
            });
        });
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (!user) {
      console.log(err);
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      var newDate = new Date().getTime();
      var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
        userId: user._id,
        authDate: newDate
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

// Get and post to users' goals
router.route('/:userId/goals')

.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
    User.findById(req.params.userId)
        .exec(function (err, User) {
        if (err) return next(err);
        res.json(User.goals);
    });
})

.post(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);
        User.goals.push(req.body);
        User.save(function (err, User) {
            if (err) return next(err);
            console.log('Posted goal!');
            res.json({Msg: "Done!"});
        });
    });
});

// Get, update and delete individual goal
router.route('/:userId/goals/:goalId')

.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
    User.findById(req.params.userId)
        .exec(function (err, User) {
        if (err) return next(err);
        res.json(User.goals.id(req.params.goalId));
    });
})

.put(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);

        var goal = User.goals.id(req.params.goalId);
        _.merge(goal, req.body);
        
        User.save(function (err, User) {
            if (err) return next(err);
            console.log('Updated goal!');
            res.json({Msg: "Done!"});
        });
    });
})

.delete(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);
        User.goals.id(req.params.goalId).remove();
        User.save(function (err, resp) {
            if (err) return next(err);
            console.log('Deleted goal!');
            res.json({Msg: "Done!"});
        });
    });
});

// Get and post to users' tasks
router.route('/:userId/tasks')

.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
    User.findById(req.params.userId)
        .exec(function (err, User) {
        if (err) return next(err);
        res.json(User.tasks);
    });
})

.post(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);
        User.tasks.push(req.body);
        User.save(function (err, User) {
            if (err) return next(err);
            console.log('Posted task!');
            res.json({Msg: "Done!"});
        });
    });
});

// Get, update and delete individual task
router.route('/:userId/tasks/:taskId')

.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
    User.findById(req.params.userId)
        .exec(function (err, User) {
        if (err) return next(err);
        res.json(User.tasks.id(req.params.taskId));
    });
})

.put(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);

        var task = User.tasks.id(req.params.taskId);
        _.merge(task, req.body);
        
        User.save(function (err, User) {
            if (err) return next(err);
            console.log('Updated task!');
            res.json({Msg: "Done!"});
        });
    });
})

.delete(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);
        User.tasks.id(req.params.taskId).remove();
        User.save(function (err, resp) {
            if (err) return next(err);
            console.log('Deleted task!');
            res.json({Msg: "Done!"});
        });
    });
});

// Get and post to users' rewards
router.route('/:userId/rewards')

.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
    User.findById(req.params.userId)
        .exec(function (err, User) {
        if (err) return next(err);
        res.json(User.rewards);
    });
})

.post(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);
        User.rewards.push(req.body);
        User.save(function (err, User) {
            if (err) return next(err);
            console.log('Posted reward!');
            res.json({Msg: "Done!"});
        });
    });
});

// Get, update and delete individual reward
router.route('/:userId/rewards/:rewardId')

.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
    User.findById(req.params.userId)
        .exec(function (err, User) {
        if (err) return next(err);
        res.json(User.rewards.id(req.params.rewardId));
    });
})

.put(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);

        var reward = User.rewards.id(req.params.rewardId);
        _.merge(reward, req.body);
        
        User.save(function (err, User) {
            if (err) return next(err);
            console.log('Updated reward!');
            res.json({Msg: "Done!"});
        });
    });
})

.delete(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);
        User.rewards.id(req.params.rewardId).remove();
        User.save(function (err, resp) {
            if (err) return next(err);
            console.log('Deleted reward!');
            res.json({Msg: "Done!"});
        });
    });
});

// Get, post and update users' tracking
router.route('/:userId/tracking')

.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
    User.findById(req.params.userId)
        .exec(function (err, User) {
        if (err) return next(err);
        res.json(User.tracking[0]);
    });
})

.post(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);
        User.tracking.push(req.body);
        User.save(function (err, User) {
            if (err) return next(err);
            console.log('Posted tracking!');
            res.json({Msg: "Done!"});
        });
    });
})

.put(function (req, res, next) {
    User.findById(req.params.userId, function (err, User) {
        if (err) return next(err);

        var track = User.tracking[0];
        _.merge(track, req.body);
        
        User.save(function (err, User) {
            if (err) return next(err);
            console.log('Updated tracking!');
            res.json({Msg: "Done!"});
        });
    });
});

module.exports = router;