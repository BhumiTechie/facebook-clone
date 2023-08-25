var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn, function (req, res, next) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (foundUser) {
      res.render("profile", { foundUser })
    })
});

router.get('/login',function(req,res,next){
  res.render('login');
})

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err){                   
      return next(err);
    }
    res.redirect('/login');
  });
});

router.post('/login', passport.authenticate("local",{
   successRedirect: "/profile",
   failureRedirect:"/login"
}),
function(req,res,next){});

router.post('/register', function (req, res, next) {
  userModel.findOne({username: req.body.username})
  .then(function(foundUser){
    if(foundUser){
      res.send("username already exists");
    }
    else{
      var newuser = new userModel({
        username: req.body.username,
        age: req.body.age,
        email: req.body.email,
        image: req.body.image,
      });
      userModel.register(newuser, req.body.password)
        .then(function (u) {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/profile");
          })
        });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect("/login");       
  }
}
module.exports = router;