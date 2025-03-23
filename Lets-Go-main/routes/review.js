const express = require("express");
const router = express.Router({mergeParams:true});
const reviews = require("../models/reviews");
const wrapAsync = require("../utils/wrapAsync.js");
const expresserror = require("../utils/expresserror.js");
const Review = require ("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview, isLogged,isAuthor} = require("../middleware.js");

const  reviewController = require("../controller/reviews.js");

//reviews
router.post("/", isLogged,validateReview, wrapAsync (reviewController.createReview));

//delete review route
router.delete("/:reviewid", isLogged,isAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;