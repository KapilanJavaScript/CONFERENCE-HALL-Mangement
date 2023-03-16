const express = require("express");
const router = express.Router();
const {
  addRequestHall,
  getrequestHall,
  getRequestHallByUser,
  cancelrequestHall,
  declinerequestHall,
  acceptrequestHall
} = require("../../controllers/userControllers/requestController");
const { protect } = require("../../middleware/authMiddleware");

router
  .put("/requesthall/:id", protect, addRequestHall)
  .get("/getrequesthall/:id", protect, getrequestHall)
  .get("/getrequesthalluser/:id", protect, getRequestHallByUser)
  .put("/cancelrequesthall/:id", protect, cancelrequestHall)
  .put("/declinerequestedhall/:id", protect, declinerequestHall)
  .put("/acceptrequestedhall/:id", protect, acceptrequestHall)

module.exports = router;
