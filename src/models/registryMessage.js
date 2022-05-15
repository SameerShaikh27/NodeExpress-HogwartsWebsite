// Impporting Installed Modules
const mongoose = require("mongoose");


// Using (mongoose.Schema) to patternize the look of database.
const messagesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});


// Creating a Collection --------------

// Creating a Model and storing the fetched data which is inside "studentSchema" into (Register) Class and the "Student" is the name of collection inside the model.
const Messages = new mongoose.model("studentMessage", messagesSchema);

// Exporting Register Class.
module.exports = Messages;