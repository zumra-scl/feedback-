const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  const page = req.path.split("/")[1];
  res.locals.active = page || "customers";
  next();
});

app.use("/customers", require("./routes/customers"));
app.use("/tickets", require("./routes/tickets"));
app.use("/feedback", require("./routes/feedback"));

app.get("/", (req, res) => {
  res.redirect("/customers");
});

app.listen(3000, () => {
  console.log("Server running");
});
