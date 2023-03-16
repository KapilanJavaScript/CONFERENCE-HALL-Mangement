const express = require("express");
const router = express.Router();
const {
  addLocation,
  deleteLocation,
  updateLocation,
  getLocation,
} = require("../../controllers/adminController/LocationController");
const { protectAdmin } = require("../../middleware/authAdminMiddleware");
const {protect} = require("../../middleware/authMiddleware")

router
  .post("/addlocation", protectAdmin, addLocation)
  .put("/updatelocation/:id", protectAdmin, updateLocation)
  .put("/deletelocation/:id", protectAdmin, deleteLocation)
  .get("/getlocation", getLocation);

module.exports = router;
