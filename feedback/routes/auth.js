const express = require("express");
const router = express.Router();

const db = require("../db/db");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { identifier } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM system_user WHERE id = ? OR email = ?",
    [identifier, identifier],
  );

  const user = rows[0];

  if (!user || user.admin != 1) {
    return res.send("Only admin can login");
  }

  req.session.user = {
    id: user.id,
    name: user.fullname,
    admin: user.admin,
  };

  res.redirect("/tickets");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
