
require("dotenv").config();

const mongoose = require("mongoose");
const allListing = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderLust";


const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = "pk.eyJ1IjoiYW50YXJhOTA5MyIsImEiOiJjbHl0b2g2cnQwNHowMm5zbGs3MDRzOWhoIn0.ZNZtDP5KjotnyDpCnFpp2g";
console.log(mapToken);
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
  await Listing.deleteMany({});

  for (let listing of allListing) {
    let response = await geocodingClient.forwardGeocode({
      query: listing.location,
      limit: 1,
    }).send();
    listing.geometry = response.body.features[0].geometry;
  }

  const updatedData = allListing.map((obj) => ({
    ...obj, Owner:"669359750f86d796cfe017f9"}));

  await Listing.insertMany(updatedData);
  console.log("Data was initialized");
};

initDB();
