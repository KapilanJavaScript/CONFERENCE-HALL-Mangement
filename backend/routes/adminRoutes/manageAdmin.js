const express = require("express");
const router = express.Router();
const {
  addAdmin,
  removeAdmin,
  getAdmin,
  getUser
} = require("../../controllers/adminController/AdminController");
const { protectAdmin } = require("../../middleware/authAdminMiddleware");

router
  .put("/addadmin/:id", protectAdmin, addAdmin)
  .put("/removeadmin/:id", protectAdmin, removeAdmin)
  .get("/getadmin", protectAdmin, getAdmin)
  .get("/getuser", protectAdmin, getUser)

module.exports = router;
