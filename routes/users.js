const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("GET /wiki");
});

router.get("/:id", (req, res, next) => {
  res.send("GET /wiki");
});

router.post("/", (req, res, next) => {
  res.send("GET /wiki");
});

router.put("/", (req, res, next) => {
  res.send("GET /wiki");
});

router.delete("/", (req, res, next) => {
  res.send("GET /wiki");
});

module.exports = router;
