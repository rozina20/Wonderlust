const express = require("express");
const router = express();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLogged,isOwner,validateListing} = require("../middleware.js");

const listingCantroller = require("../controller/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
  .route("/")
  .get( wrapAsync (listingCantroller.index)) //index route
  .post(
    isLogged ,//create route
    upload.single('listing[image]') ,
    validateListing,
    wrapAsync(listingCantroller.createListing)
);

//new route
router.get("/new",isLogged,listingCantroller.rendernewForm);

router
  .route("/:id")
  .get(wrapAsync (listingCantroller.showlisting)) //show route
  .put(
    isLogged,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingCantroller.updateListing)) //update route
  .delete( isLogged,  //delete route
    wrapAsync(listingCantroller.deleteListing)
);

//edit route
router.get("/:id/edit",isLogged,isOwner,
    wrapAsync (listingCantroller.renderEdit));

module.exports = router;