const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db/db");

router.get("/", async (req, res) => {
  const [users] = await db.query("SELECT * FROM system_user");
  res.render("users", { users });
});

router.get("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM system_user WHERE id = ?", [
    req.params.id,
  ]);
  const express = require("express");
  const router = express.Router();
  const bcrypt = require("bcrypt");
  const db = require("../db/db");

  router.use((req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    next();
  });

  router.get("/", async (req, res) => {
    const [users] = await db.query("SELECT * FROM system_user");

    res.render("users", {
      users,
      active: "users",
    });
  });

  router.get("/:id", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM system_user WHERE id = ?", [
      req.params.id,
    ]);

    const user = rows[0];

    res.render("user-edit", {
      user,
      active: "users",
    });
  });

  router.post("/:id", async (req, res) => {
    const { fullname, email, password } = req.body;
    const id = req.params.id;

    if (password && password.trim() !== "") {
      const hash = await bcrypt.hash(password, 10);

      await db.query(
        "UPDATE system_user SET fullname=?, email=?, password=? WHERE id=?",
        [fullname, email, hash, id],
      );
    } else {
      await db.query("UPDATE system_user SET fullname=?, email=? WHERE id=?", [
        fullname,
        email,
        id,
      ]);
    }

    res.redirect("/users");
  });

  module.exports = router;
  const user = rows[0];
  res.render("user-edit", { user });
});

router.post("/:id", async (req, res) => {
  const { fullname, email, password } = req.body;
  const id = req.params.id;

  if (password && password.trim() !== "") {
    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE system_user SET fullname=?, email=?, password=? WHERE id=?",
      [fullname, email, hash, id],
    );
  } else {
    await db.query("UPDATE system_user SET fullname=?, email=? WHERE id=?", [
      fullname,
      email,
      id,
    ]);
  }

  res.redirect("/users");
});

module.exports = router;
