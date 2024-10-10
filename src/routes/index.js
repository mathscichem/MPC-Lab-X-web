/**
 * @file src/routes/index.js
 * @description Routes configuration.
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/home");
});

router.get("/about", (req, res) => {
  res.render("pages/about");
});

router.get("/dashboard", (req, res) => {
  res.render("pages/dashboard");
});

router.use("/", require("./auth"));

router.use("/user", require("./user"));

router.use("/classrooms", require("./class"));

router.get("/404", (req, res) => {
  res.render("pages/404", { path: req.query.path || "/" });
});

router.get("/403", (req, res) => {
  res.render("pages/403", { path: req.query.path || "/" });
});

router.get("*", (req, res) => {
  res.redirect(`/404?path=${req.path}`);
});

module.exports = router;
