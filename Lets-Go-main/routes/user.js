const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userControl = require("../controller/users.js");

router 
  .route("/signup")
  .get(userControl.renderSignupForm)
  .post( wrapAsync(userControl.signup)
);

router 
  .route("/login")
  .get(userControl.renderLoginForm)
  .post(saveRedirectUrl,
    passport.authenticate("local",
    { failureRedirect:"/login",
    failureFlash:true}),
   userControl.Login
);

router.get("/logout",userControl.logout);

module.exports = router;
