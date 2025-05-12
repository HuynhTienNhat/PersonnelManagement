const express  = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect("mongodb+srv://huynhtiennhat0403:admin@mycluster.nqkdjxc.mongodb.net/crud")

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String
})

const userModel = mongoose.model("User", userSchema);

const user1 = new userModel({
    name: "Nguyen Van A",
    age: 20,
    email: "nguyenvanA@gmail.com"
})

user1.save().then(() => {
    console.log("User saved successfully");
}).catch((err) => {
    console.log("Error saving user: ", err);
})

app.listen(3001, () => {
    console.log("Server is running on port 3001");
})