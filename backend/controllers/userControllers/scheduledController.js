const asyncHandler = require("express-async-handler");
const Bookhall = require("../../models/bookHallModel");
const Conferencehall = require("../../models/conferencehallModel");
const User = require("../../models/userModel");
const moment = require("moment/moment");

// @desc    viewbookhall
// @route   /users/conferencehall/viewbookhall
// @access  User Private
const viewBookedHall = asyncHandler(async (req, res) => {
  const page = req.query.page;
  const date = req.query.date;
  // console.log(date,"--",moment(date).format("yyyy-MM-DD"));
  // const mDate = moment(date).format("YYYY-MM-DD")
  const limitPerPage = 5;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("Invalid user");
  }

  const bookedhall = await Bookhall.find({
    hostedById: req.user._id,
    isDeleted: false,
    date: { $eq: date },
  }).sort({ updatedAt: -1 });
  if (!bookedhall) {
    res.status(400);
    throw new Error("Hall not found exists");
  }
  console.log(date,"date format 'YYYY-MM-DD'")
  const pageCount = Math.ceil(bookedhall.length / limitPerPage);
  
  if (pageCount > 1) {
    const bookedhallExists = await Bookhall.find({
      hostedById: req.user._id,
      isDeleted: false,
      date: { $eq: date },
    })
      .sort({ updatedAt: -1 })
      .skip(page * limitPerPage)
      .limit(limitPerPage);

    res.status(201).json({ bookedhallExists, pageCount });
  } else {
    res.status(201).json({ bookedhallExists: bookedhall, pageCount });
  }
});

// @desc    updatebookhall
// @route   /users/conferencehall/updatebookhall
// @access  User Private
const updateBookedHall = asyncHandler(async (req, res) => {
  const {
    noOfCandidates,
    members,
    date,
    title,
    description,
    priority,
    from,
    to,
  } = req.body;

  if (
    !noOfCandidates ||
    !members ||
    !date ||
    !title ||
    !description ||
    !priority ||
    !from ||
    !to
  ) {
    res.status(400);
    throw new Error("Please fill all the fields Back");
  }

  const id = req.params.id;
  const bookHall = await Bookhall.findById(id);
  if (!bookHall) {
    return res.status(400).json({ message: "Booked Hall not found" });
  }
  // console.log(`${bookHall.hostedById} !== ${req.user._id}`,typeof(bookHall.hostedById),'----',typeof(String(req.user._id)))
  if (bookHall.hostedById !== String(req.user._id)) {
    return res.status(400).json({ message: "Unauthorised Access" });
  }
  let DATADate = date;
  const checkingHallAvail = await Bookhall.find({
    _id: { $nin: bookHall._id },
    isDeleted: false,
    hallId: bookHall.hallId,
  });
  // console.log(checkingHallAvail)

  let flag = true;
  if (checkingHallAvail.length > 0) {
    const checkingTimeDiff = await Bookhall.find({
      _id: { $nin: bookHall._id },
      isDeleted: false,
      hallId: bookHall.hallId,
      // date: { $all: DATADate },
      date: { $in: DATADate },
    });
    // console.log(date,"checkingTimeDiff", checkingTimeDiff);

    if (checkingTimeDiff?.length > 0) {
      checkingTimeDiff.forEach((data) => {
        // (x > b && y < b) CONDITION
        if (
          new Date(`0001-01-01, ${data.from}`) <=
            new Date(`0001-01-01, ${from}`) &&
          new Date(`0001-01-01, ${from}`) <= new Date(`0001-01-01, ${data.to}`)
        ) {
          flag = false;
          res.status(400);
          throw new Error("Time is Already taken");
        }
        if (
          new Date(`0001-01-01, ${data.from}`) <=
            new Date(`0001-01-01, ${to}`) &&
          new Date(`0001-01-01, ${to}`) <= new Date(`0001-01-01, ${data.to}`)
        ) {
          flag = false;
          res.status(400);
          throw new Error("Time is Already taken");
        }
        if (
          new Date(`0001-01-01, ${from}`) <=
            new Date(`0001-01-01, ${data.from}`) &&
          new Date(`0001-01-01, ${data.from}`) <= new Date(`0001-01-01, ${to}`)
        ) {
          flag = false;
          res.status(400);
          throw new Error("Time is Already taken");
        }
        if (
          new Date(`0001-01-01, ${from}`) <=
            new Date(`0001-01-01, ${data.to}`) &&
          new Date(`0001-01-01, ${data.to}`) <= new Date(`0001-01-01, ${to}`)
        ) {
          flag = false;
          res.status(400);
          throw new Error("Time is Already taken");
        }
      });
    }
  }

  if (flag) {
    const data = {
      ...req.body,
      updatedBy: req.user._id,
    };
    const updatedBookedHall = await Bookhall.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (updatedBookedHall) {
      res.status(200).json({ message: "Successfully updated" });
    }
  }
});

// @desc    cancelbookhall
// @route   /users/conferencehall/cancelbookhall
// @access  User Private
const cancelBookedHall = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const bookHall = await Bookhall.findById(id);
  if (!bookHall) {
    return res.status(400).json({ message: "Booked Hall not found" });  
  }
  // console.log(`${bookHall.hostedById} !== ${req.user._id}`,typeof(bookHall.hostedById),'----',typeof(String(req.user._id)))
  if (bookHall.hostedById !== String(req.user._id)) {
    return res.status(400).json({ message: "Unauthorised Access" });
  }

  const datetod = bookHall.date.filter(
    (ele) =>
      new Date(
        `${moment(ele, "YYYY-MM-DD").format("YYYY MM DD")}, ${bookHall.to}`
      ) < new Date()
  );

  if (JSON.stringify(datetod) === JSON.stringify(bookHall.date)) {
    res.status(400);
    throw new Error("The booked hall already conducted.");
  }

  if (datetod.length > 0) {
    const cancelledBookHall = await Bookhall.findByIdAndUpdate(
      id,
      { date: datetod, updatedBy: req.user._id },
      { new: true }
    );
    if (cancelledBookHall) {
      res.status(200).json({
        message: "The future scheduled dates were successfully cancelled.",
      });
    }
  } else {
    const cancelledBookHall = await Bookhall.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedBy: req.user._id },
      { new: true }
    );
    if (cancelledBookHall.isDeleted) {
      res.status(202).json({ message: "Booked Hall Cancelled" });
    }
  }
});

//Exports the function
module.exports = {
  viewBookedHall,
  updateBookedHall,
  cancelBookedHall,
};
