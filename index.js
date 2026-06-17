require("dotenv").config();
const mongoose = require("mongoose")
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("./cloudConfig");
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("MongoDB Atlas connected");
})
.catch((err) => {
    console.log("MongoDB connection error:", err);
});
//add real image upload 

const upload = multer({ dest: "uploads/" });


const Post = require("./models/post");
const User = require("./models/user");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const path = require("path");
const {v4: uuidv4 } = require('uuid'); // v4 is verrsion 4 for creating these ids

const methodOverride = require('method-override');
// add time stamp
function timeAgo(date) {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "Just now";

    let minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    let hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    let days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;

    let weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

    let months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    let years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
}


app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
//user
// let users = [];
passport.use(new LocalStrategy(async (username, password, done) => {

    try{

        const user = await User.findOne({ username });

        if (!user) {
            return done(null, false);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return done(null, false);
        }

        return done(null, user);

    }
    catch(err){
        return done(err);
    }

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {

    try{

        const user = await User.findById(id);

        done(null, user);

    }
    catch(err){
        done(err);
    }

});

function isLoggedIn(req, res , next){
    if(req.isAuthenticated()){
        return next();

    }
    res.redirect("/login");
}

async function isOwner(req,res,next){
    let {id} = req.params;

    let post = await Post.findById(id);
    if(!post){
        return res.send("Post not found");

    }
    if(post.owner && post.owner.equals(req.user._id)){
        return next();

    }
    res.send("You are not allowed to edit or delte this post");
}
//sign up 
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {

    let { username, password } = req.body;

    try{

        const existingUser = await User.findOne({ username });

        if(existingUser){
            return res.send("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.redirect("/login");

    }
    catch(err){

        console.log(err);

        res.send("Signup error");

    }

});
//login
app.get("/login", (req, res) => {
    res.render("login.ejs", { error: req.query.error });
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login?error=Invalid username or password"
}));
//logout
app.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.send("Logout error");
        }

        res.redirect("/login");
    });
});


//posts
// let posts = [
//     {
//         id: uuidv4(),
//         username: "apnacollege",
//         content: `Consistency is more important than motivation in software development.

// Even small improvements every day can create massive long-term success.`,
//         image:"/images/dog.jpg",
//         likes: 0,
//         comments: [
//    {
//       username: "alex",
//       text: "Amazing post!"
//    },
//    {
//       username: "sara",
//       text: "Very informative."
//    }
// ],
//         saved: false,
//     },
//     {
//         id: uuidv4(),
//         username : "shradhakhapra",
//         content : `Building real-world projects is the fastest way to improve programming skills.

// Projects teach debugging, logic building, and problem-solving together.`,
//         image:"/images/cat.jpg",
//         likes: 0,
//         comments: [],
//         saved: false
//     },
//     {
//         id: uuidv4(),
//         username : "apnacollege",
//         content : `Artificial Intelligence is transforming the future of technology.

// Developers who continuously learn new skills will always stay ahead.`,
//         image:"/images/mouse.jpg",
//         likes: 0,
//         comments: [],
//         saved: false
//     },
//     {
//         id: uuidv4(),
//         username : "Nikita",
//         content : `Debugging is not just fixing errors.

// It is the process where developers truly understand how systems work internally.`,
//         image:"/images/lion.jpg",
//         likes: 0,
//         comments: [],
//         saved: false
//     },
// ];

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/posts");
    } else {
        res.redirect("/login");
    }
});

app.get("/posts", isLoggedIn, async (req, res) => {
    let { q } = req.query;

    let filter = {};

    if (q && q.trim() !== "") {
        filter = {
            $or: [
                { username: { $regex: q.trim(), $options: "i" } },
                { content: { $regex: q.trim(), $options: "i" } }
            ]
        };
    }

    let posts = await Post.find(filter)
        .populate("owner")
        .sort({ createdAt: -1 });

    res.render("index.ejs", { 
        posts, 
        currentUser: req.user,
        timeAgo,
        searchQuery: q
    });
});
//adding new post
app.get("/posts/new",isLoggedIn,(req, res) => {
    res.render("new.ejs");
});
// now add the new post into posts array
app.post("/posts", isLoggedIn, upload.single("image"), async (req, res) => {
    let { content } = req.body;

    let postImageUrl = "";

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "ThoughtStream/posts"
        });

        fs.unlinkSync(req.file.path);

        postImageUrl = result.secure_url;
    }

    await Post.create({
        username: req.user.username,
        content,
        postImage: postImageUrl,
        owner: req.user._id,
        likes: 0,
        saved: false,
        comments: []
    });

    res.redirect("/posts");
});

// SHOW COMMENTS PAGE
app.get("/posts/:id/comments",isLoggedIn, async (req, res) => {
    let { id } = req.params;

    let post = await Post.findById(id).populate("owner");

    res.render("comment.ejs", { post , timeAgo });
});

//show an individual post by id 
app.get("/posts/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;

    let post = await Post.findById(id).populate("owner");

    res.render("show.ejs", { post, currentUser: req.user, timeAgo});
});

// patch request
app.patch("/posts/:id", isLoggedIn,isOwner, async (req, res) => {
    let { id } = req.params;
    let { content } = req.body;

    await Post.findByIdAndUpdate(id, { content });

    res.redirect("/posts");
});
//post-action
// LIKE ROUTE
app.post("/posts/:id/like", async (req, res) => {
    let { id } = req.params;

    let post = await Post.findById(id);
    post.likes++;
    await post.save();

    res.redirect("/posts");
});
// SAVE ROUTE
app.post("/posts/:id/save", async (req, res) => {
    let { id } = req.params;

    let post = await Post.findById(id);
    post.saved = !post.saved;
    await post.save();

    res.redirect("/posts");
});
// COMMENT ROUTE

// ADD COMMENT

app.post("/posts/:id/comments", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    let { comment } = req.body;

    let post = await Post.findById(id);

    post.comments.push({
        username: req.user.username,
        text: comment
    });

    await post.save();

    res.redirect(`/posts/${id}/comments`);
});
// edit form 
app.get("/posts/:id/edit",isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    let post = await Post.findById(id);

    res.render("edit.ejs", { post });
});
// adding delete button
app.delete("/posts/:id",isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;

    await Post.findByIdAndDelete(id);

    res.redirect("/posts");
});
//profile
app.get("/profile/edit", isLoggedIn, (req, res) => {
    res.render("editProfile.ejs", { user: req.user });
});
app.post("/profile/edit", isLoggedIn, upload.single("profileImage"), async (req, res) => {
    let { bio } = req.body;

    let updateData = { bio };

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "ThoughtStream/profile"
        });

        fs.unlinkSync(req.file.path);

        updateData.profileImage = result.secure_url;
    }

    await User.findByIdAndUpdate(req.user._id, updateData);

    res.redirect(`/users/${req.user._id}`);
});
//following
app.get("/users/:id/following", isLoggedIn, async (req, res) => {
    let { id } = req.params;

    let profileUser = await User.findById(id).populate("following");

    if (!profileUser) {
        return res.send("User not found");
    }

    res.render("following.ejs", {
        profileUser,
        users: profileUser.following,
        title: "Following"
    });
});
//follower
app.get("/users/:id/followers", isLoggedIn, async (req, res) => {
    let { id } = req.params;

    let profileUser = await User.findById(id).populate("followers");

    if (!profileUser) {
        return res.send("User not found");
    }

    res.render("following.ejs", {
        profileUser,
        users: profileUser.followers,
        title: "Followers"
    });
});
app.get("/users/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;

    let profileUser = await User.findById(id)
        .populate("followers")
        .populate("following")
        .populate("followRequests");

    if (!profileUser) {
        return res.send("User not found");
    }

    let userPosts = await Post.find({ owner: id })
        .populate("owner")
        .sort({ createdAt: -1 });

    res.render("profile.ejs", {
        profileUser,
        userPosts,
        currentUser: req.user,
        timeAgo
    });
});
app.get("/profile/requests", isLoggedIn, async (req, res) => {
    let user = await User.findById(req.user._id).populate("followRequests");

    res.render("requests.ejs", {
        user,
        requests: user.followRequests
    });
});
// follower
app.post("/users/:id/follow-request", isLoggedIn, async (req, res) => {
    let { id } = req.params;

    if (String(id) === String(req.user._id)) {
        return res.redirect(`/users/${id}`);
    }

    let profileUser = await User.findById(id);

    if (!profileUser.followRequests.includes(req.user._id)) {
        profileUser.followRequests.push(req.user._id);
        await profileUser.save();
    }

    res.redirect(`/users/${id}`);
});
//accept request 
app.post("/users/:id/accept-request/:requestUserId", isLoggedIn, async (req, res) => {
    let { id, requestUserId } = req.params;

    let profileUser = await User.findById(id);
    let requestUser = await User.findById(requestUserId);

    profileUser.followRequests = profileUser.followRequests.filter(
        userId => String(userId) !== String(requestUserId)
    );

    if (!profileUser.followers.includes(requestUserId)) {
        profileUser.followers.push(requestUserId);
    }

    if (!requestUser.following.includes(id)) {
        requestUser.following.push(id);
    }

    await profileUser.save();
    await requestUser.save();

    res.redirect(`/users/${id}`);
});
//reject request 
app.post("/users/:id/reject-request/:requestUserId", isLoggedIn, async (req, res) => {
    let { id, requestUserId } = req.params;

    let profileUser = await User.findById(id);

    profileUser.followRequests = profileUser.followRequests.filter(
        userId => String(userId) !== String(requestUserId)
    );

    await profileUser.save();

    res.redirect(`/users/${id}`);
});







app.listen(port, () =>{
    console.log("Listening to port : 8080");
});