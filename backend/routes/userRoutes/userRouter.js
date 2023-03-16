const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  update,
  getUser
} = require("../../controllers/userControllers/userController");
const { protect } = require("../../middleware/authMiddleware");
// const { protectAdmin } = require("../../middleware/authAdminMiddleware");

router
  .post("/", registerUser)
  .post("/login", loginUser)
  .get("/me", protect, getMe)
  .put('/changepassword', protect, changePassword)
  .put('/update',protect,update)
  .get('/getuser',protect,getUser)

module.exports = router;
