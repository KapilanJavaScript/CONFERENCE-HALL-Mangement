const express = require("express");
const router = express.Router();
const {
  addHall,
  deleteHall,
  updateHall,
  getHall,
  getBookHall,
  monthlyReport
} = require("../../controllers/adminController/HallController");
const { protectAdmin } = require("../../middleware/authAdminMiddleware");
const {protect} = require("../../middleware/authMiddleware")

router
  .put("/addhall", protectAdmin, addHall)
  .put("/updatehall/:id", protectAdmin, updateHall)
  .put("/deletehall/:id", protectAdmin, deleteHall)
  .get("/gethall",protect, getHall)
  .get("/gethall/:id",protect, getBookHall)
  .get("/viewallbookhalls/:date",protectAdmin, monthlyReport)


module.exports = router;
