const express = require("express");
const router = express.Router();
const {
  viewBookedHall,
  updateBookedHall,
  cancelBookedHall,
} = require("../../controllers/userControllers/scheduledController");
const { protect } = require("../../middleware/authMiddleware");

router
  .get("/viewbookedhall", protect, viewBookedHall)
  .put("/updatebookedhall/:id", protect, updateBookedHall)
  .put("/cancelbookedhall/:id", protect, cancelBookedHall)

module.exports = router;
