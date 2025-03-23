if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env);

const express= require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expresserror = require("./utils/expresserror.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

const listingsrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");
const dbUrl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//to parse the data
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",() =>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret : "mysuperSecretecode",
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly:true, //to prevent cross scripying attack
    },
};

main()
   .then((res)=>{
    console.log("monoose is listening!");
   })
   .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/",(req,res)=>{
//     res.send("port is listening!");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demoUser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     })

//    let regUser = await User.register(fakeUser,"helloworld");
//    res.send(regUser);
// })

app.use("/listings",listingsrouter);
app.use("/listings/:id/reviews",reviewrouter);
app.use("/",userrouter);

app.all("*",(req,res,next)=>{
    next(new expresserror(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("port is listening!");
});

