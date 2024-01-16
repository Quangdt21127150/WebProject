const express = require("express");

const authController = require("../controllers/auth.controller");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/user.model");
const { EventEmitter } = require("events");

const myEmitter = new EventEmitter();

const router = express.Router();
require("dotenv").config();

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      myEmitter.setMaxListeners(15);
      const user = await User.findByUsername(profile.emails[0].value);

      if (!user) {
        console.log("Adding new Google account");
        const user = new User(profile.emails[0].value, "?", "?", "?", "?", "?");
        await user.signup();
      } else {
        console.log("Google User already exist in DB");
      }
      return done(null, profile);
    }
  )
);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.signup);

router.get("/login", authController.getLogin);

router.post("/login", authController.login);

router.get(
  "/gg",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/gg/auth",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/auth/success");
  }
);

router.get("/auth/success", authController.googleLogin);

router.post("/logout", authController.logout);

module.exports = router;
