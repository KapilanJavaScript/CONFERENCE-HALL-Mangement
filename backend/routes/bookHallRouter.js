const express = require("express");
const router = express.Router();
const {
  bookHall,
  viewBookHall,
  viewBookHalltd
} = require("../controllers/bookHallController");
const { protect } = require("../middleware/authMiddleware")


router
  .post("/bookhall/:id", protect, bookHall)
  .get("/viewbookhall/:id", protect, viewBookHall)
  .get("/viewbookhalltd/:id", protect, viewBookHalltd)

module.exports = router;
