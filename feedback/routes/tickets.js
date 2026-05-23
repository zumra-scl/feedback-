const express = require("express");
const router = express.Router();

const db = require("../db/db");

const statusMap = {
  open: 1,
  "working on": 2,
  done: 3,
  closed: 4,
};

router.use((req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
});

router.get("/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT
      support_ticket.id,
      support_ticket.arrived,
      customer.name AS customer,
      support_ticket.description,
      ticket_status.description AS status,
      support_ticket.handled
    FROM support_ticket
    JOIN customer ON support_ticket.customer_id = customer.id
    JOIN ticket_status ON support_ticket.status = ticket_status.id
    ORDER BY support_ticket.arrived DESC
  `);

  res.render("tickets", {
    tickets: rows,
    active: "tickets",
  });
});

router.get("/view", async (req, res) => {
  const id = req.query.id;

  const [ticketRows] = await db.query(
    `
    SELECT
      support_ticket.id,
      support_ticket.arrived,
      customer.name AS customer,
      support_ticket.description,
      ticket_status.description AS status,
      support_ticket.handled
    FROM support_ticket
    JOIN customer ON support_ticket.customer_id = customer.id
    JOIN ticket_status ON support_ticket.status = ticket_status.id
    WHERE support_ticket.id = ?
  `,
    [id],
  );

  const [messages] = await db.query(
    `
    SELECT *
    FROM support_message
    WHERE ticket_id = ?
    ORDER BY created_at ASC
  `,
    [id],
  );

  res.render("ticket", {
    ticket: ticketRows[0],
    messages,
    active: "tickets",
  });
});

router.post("/reply", async (req, res) => {
  const { ticket_id, message } = req.body;

  await db.query(
    `
    INSERT INTO support_message (ticket_id, from_user, body, reply_to, created_at)
    VALUES (?, ?, ?, NULL, NOW())
  `,
    [ticket_id, req.session.user.id, message],
  );

  res.redirect("/tickets/view?id=" + ticket_id);
});

router.post("/status", async (req, res) => {
  const { ticket_id, status } = req.body;

  const statusId = statusMap[status];

  await db.query(
    `
    UPDATE support_ticket
    SET status = ?
    WHERE id = ?
  `,
    [statusId, ticket_id],
  );

  if (status === "closed") {
    await db.query(
      `
      UPDATE support_ticket
      SET handled = NOW()
      WHERE id = ?
    `,
      [ticket_id],
    );
  }

  res.redirect("/tickets/view?id=" + ticket_id);
});

module.exports = router;
