// Impporting Installed Modules
const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken")

// Using (mongoose.Schema) to patternize the look of database.
const studentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }

    }]
});

// Generating Token ----------

// "generateAuthToken" function to create a "JWT" Token and also to store it into database.
// We use "methods" method when we are working with an instance of any class, models, or any thing.
studentSchema.methods.generateAuthToken = async function () {
    try {
        // In (jwt.sign()) method we have to give 2 arguments, 1st one should be the {"Payload" means in this we have to put something unique like user_id or email_id} and 2nd one should be ("SECRET_KEY").
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);

        // Storing a generated token.
        // Below, in the arguments 1st token is from the "studentSchema" above and the 2nd token is the one which we have generated means above variable.
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }
    catch (error) {
        res.send(`Error: ${e}`)
    }

}

// Bycrypting = Middleware ---------------

studentSchema.pre("save", async function (next) {

    // [this.isModified("password")] does not change the password when we are changing the other datas.
    if (this.isModified("password")) {
        // "this.password" means the password that user have given while filing the registration form. 
        // (12) in the arguments is the level of security we want for our database.
        this.password = await bycrpt.hash(this.password, 12);
        this.confirmpassword = await bycrpt.hash(this.password, 12)
    }
    next();
})

// Creating a Collection --------------

// Creating a Model and storing the fetched data which is inside "studentSchema" into (Register) Class and the "Student" is the name of collection inside the model.
const Register = new mongoose.model("Student", studentSchema);

// Exporting Register Class.
module.exports = Register;


