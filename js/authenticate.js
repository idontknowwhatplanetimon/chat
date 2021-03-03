const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const db = require("../db");
const router = express.Router();

passport.use(new LocalStrategy(
	function(username, password, done) {
		db.users.findByUsername(username, function(err, user) {
			if (err) return done(err);
			if (!user) return done(null, false);
			if (user.password !== password) return done(null, false);
			done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	db.users.findById(id, function(err, user) {
		if (err) return done(err);
		done(null, user);
	});
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(passport.initialize());
router.use(passport.session());

router.use(function(req, res, next) {
	req.isLoggedIn = req.user ? true : false;
	next();
});

router.post(
	"/login",
	passport.authenticate(
		"local",
		{ successRedirect: "/chat", failureRedirect: "/" }
	)	
);

module.exports = router;
