const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");

// @desc    register a user
// @route   /users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    employeeId,
    employeeName,
    email,
    location,
    mobileNumber,
    password,
    confirmPassword,
  } = req.body;

  if (
    !employeeName ||
    !email ||
    !password ||
    !location ||
    !employeeId ||
    !mobileNumber ||
    !confirmPassword
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const re = /^(\+\d{2})?[-. ]?\d{3}[-. ]?\d{3}[-. ]?\d{4}$/;
  if (!re.test(mobileNumber)) {
    res.status(400);
    throw new Error("enter valid phone number");
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  if (!password.length > 7) {
    res.status(400);
    throw new Error("Password should contain 7 characters");
  }

  if (password !== confirmPassword || password.includes("password") === true) {
    res.status(400);
    throw new Error("Password incorrect");
  }

  //hasspassword
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    employeeId,
    employeeName,
    email,
    location,
    mobileNumber,
    password: hassedPassword,
  });

  if (user) {
    res.status(201).json({
      _id:user._id,
      employeeId,
      employeeName,
      email,
      location,
      mobileNumber,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new error("Invalid user data");
  }
});

// @desc    Login a user
// @route   /users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  const user = await User.findOne({ email });

  // Check user and passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id:user._id,
      employeeId:user.employeeId,
      employeeName:user.employeeName,
      email:user.email,
      location:user.location,
      mobileNumber:user.mobileNumber,
      isAdmin:user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc    Get current user
// @route   /users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    employeeId: req.user.employeeId,
    employeeName: req.user.employeeName,
    email: req.user.email,
    location: req.user.location,
    mobileNumber: req.user.mobileNumber,
    isAdmin: req.user.isAdmin,
  };
  res.status(200).json(user);
});

// @desc    changepassword for user
// @route   /users/changepassword
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword, confirmpassword } = req.body;
  const user = await User.findById(req.user._id);
  if (user && (await bcrypt.compare(oldpassword, user.password))) {
    if (oldpassword !== newpassword && newpassword === confirmpassword) {
      //hasspassword
      const salt = await bcrypt.genSalt(10);
      const hassedPassword = await bcrypt.hash(newpassword, salt);
      const userData = await User.findByIdAndUpdate(
        req.user._id,
        { password: hassedPassword },
        { new: true }
      );

      res
        .status(200)
        .json({ ...userData, message: "Your password sucessfully changed" });
    } else {
      res.status(401);
      throw new Error(
        "New password must same as Confirm password and New password cannot be same as Old password"
      );
    }
  } else {
    res.status(401);
    throw new Error("Old password is wrong!");
  }
});

// @desc    update for user
// @route   /users/update
// @access  Private
const update = asyncHandler(async (req, res) => {
  const { employeeId, employeeName, location, mobileNumber } = req.body;
  if (!employeeName || !location || !employeeId || !mobileNumber) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const re = /^(\+\d{2})?[-. ]?\d{3}[-. ]?\d{3}[-. ]?\d{4}$/;
  if (!re.test(mobileNumber)) {
    res.status(400);
    throw new Error("enter valid phone number");
  }
  const UpdatedValue = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  if (UpdatedValue) {
    res.status(200).json({
      employeeId: UpdatedValue.employeeId,
      employeeName: UpdatedValue.employeeName,
      email: UpdatedValue.email,
      location: UpdatedValue.location,
      mobileNumber: UpdatedValue.mobileNumber,
      isAdmin: UpdatedValue.isAdmin,
      message: "Updated successfully",
    });
  } else {
    res.status(400);
    throw new error("Invalid user data");
  }
});


// @desc    Get current user
// @route   /users/me
// @access  Private
const getUser = asyncHandler(async (req, res) => {

  const userData = await User.find({ isDeleted: false }).select('-password');
  if (userData) {
    // console.log("-------------", location);
    res.status(200).json(userData);
  } else {
    res.status(400);
    throw new error("Invalid data");
  }
});
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SERCET, { expiresIn: "1d" });
};

//Exports the function
module.exports = {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  update,
  getUser
};
