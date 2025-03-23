const Listing = require("./models/listing");
const Review = require("./models/reviews");
const expresserror = require("./utils/expresserror.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLogged = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must logged in to creating listing");
        return res.redirect("/login");
    }

    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.Owner.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permission to edit!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errMsg);
    }else
    {
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errMsg);
    }else
    {
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the auther of these review!");
        return res.redirect(`/listings/${id}`);
    }

    next();

};



