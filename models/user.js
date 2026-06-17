const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    profileImage: {
    type: String,
    default: "/images/default_img.jpg"
},
bio: {
    type: String,
    default: "Hey there! I am using ThoughtStream."
},

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
],
followRequests: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
]
});

const User = mongoose.model("User", userSchema);

module.exports = User;