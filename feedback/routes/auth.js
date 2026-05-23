const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../db/db");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    console.log("LOGIN BODY:", req.body);

    const [rows] = await db.query(
      "SELECT * FROM system_user WHERE id = ? OR email = ?",
      [identifier, identifier],
    );

    const user = rows[0];

    if (!user) {
      return res.send("User not found");
    }

    console.log("LOGIN USER:", user);

    if (!password) {
      return res.send("Password missing");
    }

    if (!user.password) {
      return res.send("User has no password in DB");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send("Wrong password");
    }

    if (user.admin != 1) {
      return res.send("Only admin can login");
    }

    req.session.user = {
      id: user.id,
      name: user.fullname,
      admin: user.admin,
    };

    return res.redirect("/tickets");
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.send("Server error");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
