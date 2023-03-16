const asyncHandler = require("express-async-handler");
const Location = require("../../models/locationModel");

// @desc    add location
// @route   /locaiton/update
// @access  Private
const addLocation = asyncHandler(async (req, res) => {
  const { location } = req.body;

  if (!location) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const locationExists = await Location.findOne({ location });

  if (locationExists) {
    res.status(400);
    throw new Error("Location already exists");
  }

  const addData = {
    location,
    createdBy: req.user._id,
  };

  const addlocation = await Location.create(addData);

  if (addlocation) {
    res.status(201).send(addlocation);
  } else {
    res.status(400);
    throw new error("Invalid user data");
  }
});

// @desc    update location
// @route   /locaiton/update/:id
// @access  Private
const updateLocation = asyncHandler(async (req, res) => {
  const { location } = req.body;
  const locationId = await Location.findById(req.params.id);

  if (!locationId) {
    res.status(400);
    throw new Error("Location Not Found");
  }

  if (!location) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const locationExists = await Location.findOne({ location });

  if (locationExists) {
    res.status(400);
    throw new Error("Location already exists");
  }

  const addData = {
    location,
    updatedBy: req.user._id,
  };

  const UpdatedValue = await Location.findByIdAndUpdate(
    req.params.id,
    addData,
    {
      new: true,
    }
  );

  if (UpdatedValue) {
    // console.log("-------------", UpdatedValue);
    res.status(201).send(UpdatedValue);
  } else {
    res.status(400);
    throw new error("Invalid user data");
  }
});

// @desc    delete location
// @route   /locaiton/delete/:id
// @access  Private
const deleteLocation = asyncHandler(async (req, res) => {
  const locationId = await Location.findById(req.params.id);

  if (!locationId) {
    res.status(400);
    throw new Error("Location Not Found");
  }

  const addData = {
    deletedBy: req.user._id,
    isDeleted: true,
  };

  const UpdatedValue = await Location.findByIdAndUpdate(
    req.params.id,
    addData,
    {
      new: true,
    }
  );

  if (UpdatedValue) {
    // console.log("-------------", UpdatedValue);
    res.status(201).send(UpdatedValue);
  } else {
    res.status(400);
    throw new error("Invalid user data");
  }
});

const getLocation = asyncHandler(async (req, res) => {
  const location = await Location.find({ isDeleted: false })
  if (location) {
    // console.log("-------------", location);
    res.status(200).json(location);
  } else {
    res.status(400);
    throw new error("Invalid user data");
  }
  
});

//Exports the function
module.exports = {
  addLocation,
  updateLocation,
  deleteLocation,
  getLocation,
};
