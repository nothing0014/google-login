const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
require("./config/passport");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const port = process.env.PORT || 8080;

//連結mongoDB
mongoose
  .connect("mongodb://localhost:27017/GoogleDB")
  .then(() => {
    console.log("connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

//設定middleware跟排版引擎
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//設定Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  return res.render("./index", { user: req.user });
});

app.listen(port, () => {
  console.log("server is running on port 8080.");
});
