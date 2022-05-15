const mongoose = require("mongoose");

// Using (mongoose.connect) method to connect our (app.js) with our local MongoDB database. 
mongoose.connect("mongodb://localhost:27017/HogwartsRegistration", {
    // Below, are the errors that will eventually occur when we proceed with our code. That's why, We are making the below error (true) so that it won't occur in the future. Also called (Deprecation Warnings)
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    console.log(`Connection Successful`);

}).catch((e) => {
    console.log(`Connection Failed ${e}`);
})