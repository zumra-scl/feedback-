const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "feedback_secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/auth"));
app.use("/customers", require("./routes/customers"));
app.use("/tickets", require("./routes/tickets"));
app.use("/feedback", require("./routes/feedback"));

app.get("/", (req, res) => {
  res.redirect("/tickets");
});

app.listen(3000, () => {
  console.log("Server running");
});
