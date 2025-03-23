const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
        // default:
        // "https://images.unsplash.com/photo-1618886487325-f665032b6352?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJlJTIwaW1hZ2VzfGVufDB8fDB8fHww",
        // set: (v) =>
        // v === ""
        // ?"https://images.unsplash.com/photo-1618886487325-f665032b6352?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJlJTIwaW1hZ2VzfGVufDB8fDB8fHww"
        // :v,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews :[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    Owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
   geometry:{
    type:{
        type:String,
        enum:['Point'],
        required:true,
    },
    coordinates:{
        type:[Number],
        required:true,
    }
   }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;