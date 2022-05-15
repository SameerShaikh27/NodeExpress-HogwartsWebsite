// Installed Modules
require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Locally Imported Functions or Modules
const port = process.env.PORT || 3000;
const Register = require("./models/registry");
const Message = require("./models/registryMessage");
const auth = require("./middleware/auth");
const { log } = require('console');
require("./db/connections");

// Parsing the details that we have fetched from the registration page which is in json into string.
app.use(express.json());
// (express.urlencoded) is used to parse incoming requests from the user with urlencoded payloads..
app.use(express.urlencoded({ extended: false }));
// Below, we are using "cookieParser" as a middleware to parse cookies and extract the "JWT" token out of it.
app.use(cookieParser());

// Below, Joining the path of a current directory with the files that we are using and which are in different directories.
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
const static_path = path.join(__dirname, "../public/images");
const css_path = path.join(__dirname, "../public/css");

// Start ----

// Below, we are changing the view engine (template engine) from "html" to "hbs".
app.set("view engine", "hbs");

// Below, we are using the files inside the "views" folder. (templates_path) is the pathe of that folder.
app.set("views", templates_path);

// Here we are registering the partials file and also providing the exact path of those files.
hbs.registerPartials(partials_path);

// (express.static) is necessary if we are using a static files such as images, css, or javascript files.
app.use(express.static(static_path));
app.use(express.static(css_path));

// End -------


// Routing. Start -------- 

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/blog", auth, async (req, res) => {
    res.render("blog");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.post("/contact", async (req, res) => {
    try {
        // Fetching the user details from the registration page and storing it to the variables.
        const storeMessage = new Message({
            name: req.body.name,
            email_id: req.body.email_id,
            phone_number: req.body.phone_number,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zip,
            message: req.body.message,
        });

        // Saving details which is inside the (registerStudent) variable.
        const storedMessage = await storeMessage.save();
        // Redirecting user to the index page.
        res.status(201).render("contact");

    }

    catch (error) {
        res.status(400).send(error);
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {

        // Fetching the password and the confirm password from the registration page.
        const password = req.body.password;
        const conpassword = req.body.confirmpassword;

        if (password === conpassword) {
            // Fetching the user details from the registration page and storing it to the variables.
            const registerStudent = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                confirmpassword: conpassword

            });

            // Generating a "JWT" Token and storing it to the database.
            const token = await registerStudent.generateAuthToken();

            // Storing the already created "JWT" Token in the localStorage (Client Side).
            // (res.cookie) is an inbuilt nodejs method to store "jwt" token into our browsers cookie.
            const tknCookies = await res.cookie("jwt", token, {
                expires: new Date(Date.now() + 60000),
                httpOnly: true
            });

            // Saving details which is inside the (registerStudent) variable.
            const registered = await registerStudent.save();
            // Redirecting user to the index page.
            res.status(201).render("index");
        }
        else {
            res.send("Passwords are not matching!!");
        }

    }
    catch (error) {
        res.status(400).send(error);
    }

});


app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        // Below we are comparing the email that user have registered during registrating form with the email that user have just putted in the login form. 
        const useremail = await Register.findOne({ email });

        // Comparing or verifying the "password" given by user while logging in with the password stored in our database. 
        const hashedPassword = await bycrpt.compare(password, useremail.password);

        // Ussing "useremail", because it is an instance of class "Register". 
        const token = await useremail.generateAuthToken();

        const tknCookies = await res.cookie("jwt", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true
        });

        // (hashedPassword) is the variable we have used above to compare the passwords.
        if (hashedPassword) {
            res.status(201).render("index");
        }
        else {
            res.send("Your Email or Password is Wrong");
        }

    }
    catch (error) {
        res.status(400).send(`Errorrrrrrrr ${error}`);
    }
});

app.get("/logout", auth, async (req, res) => {
    try {
        // Clearing "JWT" from the cookie.
        res.clearCookie("jwt");

        await req.user.save();
        res.render("login");
    }
    catch (error) {
        res.status(500).send(`Error in Logout Function ${error}`);
    }
});


app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});