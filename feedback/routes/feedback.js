const express = require("express");
const router = express.Router();

const db = require("../db/db");

router.get("/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT
      feedback.arrived,
      system_user.fullname,
      feedback.guest_name,
      feedback.guest_email,
      feedback.feedback,
      feedback.handled
    FROM feedback
    LEFT JOIN system_user
      ON feedback.from_user = system_user.id
    ORDER BY feedback.arrived DESC
  `);

  res.render("feedback", { feedback: rows });
});

router.get("/feedback", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM feedback");
  res.render("feedback", { feedback: rows });
});

module.exports = router;
