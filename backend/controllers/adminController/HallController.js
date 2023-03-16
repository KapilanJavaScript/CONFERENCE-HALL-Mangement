const asyncHandler = require("express-async-handler");
const Conferencehall = require("../../models/conferencehallModel");
const Bookhall = require("../../models/bookHallModel");
const moment = require("moment/moment");

// @desc    add hall
// @route   /admin/conferencehall/update
// @access  Private admin
const addHall = asyncHandler(async (req, res) => {
  const { hallNumber, hallName, hallCapacity, hallLocation, hallEmail } =
    req.body;

  if (
    !hallNumber ||
    !hallName ||
    !hallCapacity ||
    !hallLocation ||
    !hallEmail
  ) {
    res.status(400).json({ error: "Please fill all the fields" });
    // throw new Error("Please fill all the fields");
  }
  const ConferencehallExists = await Conferencehall.findOne({ hallEmail });

  if (ConferencehallExists && !ConferencehallExists.isDeleted) {
    res.status(400).json({ error: "Conference hall already exists" });
  }
  const addData = {
    hallNumber,
    hallName,
    hallCapacity,
    hallLocation,
    hallEmail,
    createdBy: req.user._id,
  };

  if (ConferencehallExists && ConferencehallExists.isDeleted) {
    const updatedData = {
      hallNumber,
      hallName,
      hallCapacity,
      hallLocation,
      hallEmail,
      updatedBy: req.user._id,
      isDeleted: false,
    };

    const UpdatedValue = await Conferencehall.findByIdAndUpdate(
      ConferencehallExists._id,
      updatedData,
      {
        new: true,
      }
    );
    // console.log(UpdatedValue);
    res
      .status(201)
      .json({ UpdatedValue, message: "Conference Hall added successfully" });
  }

  const conferenceHall = await Conferencehall.create(addData);

  if (conferenceHall) {
    res
      .status(201)
      .json({ conferenceHall, message: "Conference Hall added successfully" });
  } else {
    res.status(400);
    throw new error("Invalid hall data");
  }
});

// @desc    update hall
// @route   /locaiton/updatehall/:id
// @access  Private
const updateHall = asyncHandler(async (req, res) => {
  const { hallNumber, hallName, hallCapacity, hallLocation, hallEmail } =
    req.body;

  if (
    !hallNumber ||
    !hallName ||
    !hallCapacity ||
    !hallLocation ||
    !hallEmail
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const conferenceHall = await Conferencehall.findById(req.params.id);

  if (!conferenceHall && !conferenceHall.isDeleted) {
    res.status(400);
    throw new Error("Conference hall Not Found");
  }

  const addData = {
    hallNumber,
    hallName,
    hallCapacity,
    hallLocation,
    hallEmail,
    updatedBy: req.user._id,
  };

  const UpdatedValue = await Conferencehall.findByIdAndUpdate(
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
    throw new error("Invalid conference Hall data");
  }
});

// @desc    delete hall
// @route   /conferencehall/deletehall/:id
// @access  Private
const deleteHall = asyncHandler(async (req, res) => {
  const conferenceHall = await Conferencehall.findById(req.params.id);

  if (!conferenceHall) {
    res.status(400);
    throw new Error("Conference hall Not Found");
  }
  if (conferenceHall.isDeleted) {
    res.status(400);
    throw new Error("Conference hall Not Found");
  }

  const removehallData = {
    deletedBy: req.user._id,
    isDeleted: true,
  };

  const UpdatedValue = await Conferencehall.findByIdAndUpdate(
    req.params.id,
    removehallData,
    {
      new: true,
    }
  );

  if (UpdatedValue) {
    // console.log("-------------", UpdatedValue);
    res.status(201).send({ UpdatedValue, message: "conference hall deleted" });
  } else {
    res.status(400);
    throw new error("Invalid data");
  }
});

// @desc    get hall
// @route   /conferencehall/gethall/
// @access  Private
const getHall = asyncHandler(async (req, res) => {
  const location = req.query.location;
  const capacity = req.query.capacity;

  // {location && capacity ? console.log("true") : console.log("false")}
  let conferenceHall;
  const gt = [];
  const lt = [];
  // console.log('js.172', req.query)
  if (location && capacity) {
    conferenceHall = await Conferencehall.find({
      isDeleted: false,
      hallLocation: location,
    }).sort({ hallCapacity: 1 });
    conferenceHall.forEach((ele) => {
      {
        ele.hallCapacity >= capacity ? gt.push(ele) : lt.push(ele);
      }
    });
    if (conferenceHall) {
      res.status(200).json({ConferenceHallDataApi: [...gt,...lt.reverse()] });
      // console.log(gt,lt)
    } else {
      res.status(400);
      throw new error("Invalid data");
    }
  } else {
    conferenceHall = await Conferencehall.find({ isDeleted: false });
    if (conferenceHall) {
      res.status(200).json(conferenceHall);
      // console.log(gt,lt)
    } else {
      res.status(400);
      throw new error("Invalid data");
    }
  }
});

// @desc    get hall
// @route   /conferencehall/gethall/
// @access  Private
const getBookHall = asyncHandler(async (req, res) => {
  const conferenceHall = await Conferencehall.findById(req.params.id);
  if (conferenceHall) {
    // console.log("-------------", location);
    res.status(200).json(conferenceHall);
  } else {
    res.status(400).json({ message: "Hall not found" });
  }
});

// @desc    monthlyReport
// @route   /users/conferencehall/viewbookhalls
// @access  Private
const monthlyReport = asyncHandler(async (req, res) => {
  let searchDate = req.params.date || new Date()
  let reqDate = new Date(searchDate);
  let firstDay = new Date(reqDate.getFullYear(), reqDate.getMonth(), 1);
  let lastDay = new Date(reqDate.getFullYear(), reqDate.getMonth() + 1, 0);

  const bookHall = await Bookhall.find({
    isDeleted: false,
    date: {
      $gte: moment(firstDay,"YYYY-MM-DD").format("yyyy-MM-DD"),
      $lte: moment(lastDay,"YYYY-MM-DD").format("yyyy-MM-DD"),
    },
  });
// console.log(bookHall);
  if (!bookHall) {
    res.status(400);
    throw new Error("No schedules Booked");
  }

  const conferenceHall = await Conferencehall.find({ isDeleted: false });
  if (!conferenceHall) {
    res.status(400);
    throw new error("Invalid data");
  }

// console.log('confernce Hall', bookHall, conferenceHall);
  res.status(201).json({bookHall,conferenceHall, message:`monthly reports of ${moment(req.params.date,"YYYY-MM-DD").format("YYYY MMMM")}`  });
});

//Exports the function
module.exports = {
  addHall,
  updateHall,
  deleteHall,
  getHall,
  monthlyReport,
  getBookHall,
};
