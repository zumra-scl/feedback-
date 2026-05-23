const express = require("express");
const router = express.Router();

const db = require("../db/db");



router.get("/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT
      customer.id AS customer_id,
      customer.name AS customer_name,
      system_user.id,
      system_user.fullname,
      system_user.email,
      system_user.admin
    FROM system_user
    LEFT JOIN customer
      ON system_user.customer_id = customer.id
    ORDER BY customer.name, system_user.fullname
  `);

  res.render("customers", {
    users: rows,
    active: "customers",
  });
});

module.exports = router;
