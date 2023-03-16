const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");

// @desc    add admin
// @route   /users/addadmin/:id
// @access  Private
const addAdmin = asyncHandler(async (req, res) => {
  const adminId = await User.findById(req.params.id);
  // console.log(req.user.employeeName);
  if (!adminId) {
    res.status(400);
    throw new Error("User Not Found");
  }

  const UpdatedValue = await User.findByIdAndUpdate(
    req.params.id,
    { isAdmin: true },
    { new: true }
  );

  if (UpdatedValue) {
    // console.log("-------------", UpdatedValue);
    res.status(201).send("Admin added");
  } else {
    res.status(400);
    throw new error("Invalid user data");
  }
});

// @desc    remove location
// @route   /users/removeadmin/:id
// @access  Private
const removeAdmin = asyncHandler(async (req, res) => {
  const AdminId = await User.findById(req.params.id);

  if (!AdminId) {
    res.status(400);
    throw new Error("Admin Not Found");
  }

  const UpdatedValue = await User.findByIdAndUpdate(
    req.params.id,
    { isAdmin: false },
    { new: true }
  );

  if (UpdatedValue) {
    // console.log("-------------", UpdatedValue);
    res.status(201).send("admin removed");
  } else {
    res.status(400);
    throw new error("Invalid user data");
  }
});

// @desc    get location
// @route   /users/getadmin
// @access  Private
const getAdmin = asyncHandler(async (req, res) => {   
  try {
    const admin = await User.find({ isAdmin: true, isDeleted: false }).select('-password');
    res.status(200).json(admin);
  
  } catch (error) {
    throw new Error(error)
  }
});

// @desc    get location
// @route   /users/getuser
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.find({ isAdmin: false, isDeleted: false }).select('-password');
  res.status(200).json(user);
});

//Exports the function
module.exports = {
  addAdmin,
  removeAdmin,
  getAdmin,
  getUser
};
