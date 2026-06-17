const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    username: String,
    content: String,
    postImage: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: {
        type: Number,
        default: 0
    },
    saved: {
        type: Boolean,
        default: false
    },
    comments: [
    {
        username: String,
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
],
createdAt: {
    type: Date,
    default: Date.now
}
});

module.exports = mongoose.model("Post", postSchema);