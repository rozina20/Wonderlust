const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
};

module.exports.showlisting = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author"
        },
    })
    .populate("Owner");
    if(!listing){
        req.flash("error","listing you requested does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing})
};

module.exports.rendernewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing = async(req,res,next)=>{
    let response = await geocodingClient
        .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
    .send();

    let url =  req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.Owner = req.user._id;
    newListing.image = {url,filename};
    
    newListing.geometry = response.body.features[0].geometry;

   await newListing.save();
   req.flash("success","new listing created");
   res.redirect("/listings");
};

module.exports.renderEdit = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested does not exist!");
        res.redirect("/listings");
    }

    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImage});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated");
    res.redirect("/listings");
};


module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};
    