const asyncHandler = require("express-async-handler");
const Bookhall = require("../../models/bookHallModel");
const Requesthall = require("../../models/requestedHallModel");
const moment = require("moment/moment");
const { Error } = require("mongoose");

// @desc    addRequestHall
// @route   /users/conferencehall/requesthall/:id
// @access  User Private
const addRequestHall = asyncHandler(async (req, res) => {
  const {
    noOfCandidates,
    members,
    date,
    title,
    description,
    priority,
    hostedByName,
    hostedById,
  } = req.body;

  if (
    !noOfCandidates ||
    !members ||
    !date ||
    !title ||
    !description ||
    !priority
  ) {
    res.status(400);
    throw new Error("Please fill all the fields Back");
  }

  const id = req.params.id;
  const bookHall = await Bookhall.findById(id);
  if (!bookHall) {
    return res.status(400).json({ message: "Booked Hall not found" });
  }
  let dateformat = [];
  bookHall.date.map((data) => {
    dateformat.push(moment(data,"YYYY-MM-DD").format("YYYY-MM-DD"));
  });
  // console.log(
  //   dateformat,
  //   "---------------",
  //   String(moment(req.body.date,"YYYY-MM-DD").format("YYYY-MM-DD"))
  // );
  if (dateformat.includes(String(moment(req.body.date,"YYYY-MM-DD").format("YYYY-MM-DD")))) {
    const requestHall = await Requesthall.create({
      ...req.body,
      bookHallId: bookHall._id,
      hallId: bookHall.hallId,
      hallName: bookHall.hallName,
      hostedById: hostedById,
      hostedByName: hostedByName,
      from: bookHall.from,
      to: bookHall.to,
    });
    if (requestHall) {
      const updatebookhall = await Bookhall.findByIdAndUpdate(
        id,
        {
          $push: { requestedHalls: requestHall._id },
        },
        { new: true }
      );

      res
        .status(200)
        .json({ requestHall, updatebookhall, message: "Successfully created" });
    }
  }
});

// @desc    getrequestHall
// @route   /users/conferencehall/getrequesthall/:id
// @access  User Private
const getrequestHall = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const bookHall = await Bookhall.findById(id, { isRequested: true });
  if (!bookHall) {
    return res.status(400).json({ message: "Booked Hall not found" });
  }
  const requestedHalls = await Requesthall.find({
    bookHallId: id,
    isDeleted: false,
    isDeclined: false,
    isAccepted: false,
  });
  if (requestedHalls) {
    res.status(200).json(requestedHalls);
  } else {
    throw new Error({ message: "Requested Hall Not Found" });
  }
});

// @desc    cancelrequestHall
// @route   /users/conferencehall/getrequesthall/:id
// @access  User Private
const cancelrequestHall = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const removehallData = {
    deletedBy: req.user._id,
    isDeleted: true,
  };

  const requestedHalls = await Requesthall.findByIdAndUpdate(
    id,
    removehallData
  );
  const { bookHallId } = requestedHalls;

  const bookHall = await Bookhall.findByIdAndUpdate(bookHallId, {
    $pull: { requestedHalls: id },
  });

  if ((requestedHalls, bookHall)) {
    res
      .status(200)
      .json({ requestedHalls, bookHall, message: "Canceled successfully" });
  } else {
    throw new Error({ message: "Requested Hall Not Found" });
  }
});

// @desc    declinerequestHall
// @route   /users/conferencehall/getrequesthall/:id
// @access  User Private
const declinerequestHall = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const removehallData = {
    declinedBy: req.user._id,
    isDeclined: true,
  };

  const requestedHalls = await Requesthall.findByIdAndUpdate(
    id,
    removehallData
  );
  const { bookHallId } = requestedHalls;

  const bookHall = await Bookhall.findByIdAndUpdate(bookHallId, {
    $pull: { requestedHalls: id },
  });

  if ((requestedHalls, bookHall)) {
    res
      .status(200)
      .json({ requestedHalls, bookHall, message: "Denied Requested Hall" });
  } else {
    throw new Error({ message: "Requested Hall Not Found" });
  }
});

// @desc    declinerequestHall
// @route   /users/conferencehall/getrequesthall/:id
// @access  User Private
const acceptrequestHall = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const accepthallData = {
    acceptedBy: req.user._id,
    isAccepted: true,
  };

  const requestedHalls = await Requesthall.findByIdAndUpdate(
    id,
    accepthallData,
    { new: true }
  );
  const {
    bookHallId,
    noOfCandidates,
    members,
    date,
    title,
    description,
    priority,
    from,
    to,
    hallId,
    hallName,
    hostedByName,
    hostedById,
  } = requestedHalls;

  const bookHallData = await Bookhall.create({
    hallId,
    hallName,
    hostedByName,
    hostedById,
    noOfCandidates,
    members,
    date: [date],
    from,
    to,
    title,
    description,
    priority,
  });
  const BookHallData = await Bookhall.findById(bookHallId);
  // console.log(BookHallData)
  let BookHallDel = [];
  if (BookHallData.date.length > 1) {
    let dateUp = BookHallData.date.filter(
      (ele) => String(ele) !== String(date)
    );
    BookHallDel = await Bookhall.findByIdAndUpdate(bookHallId, {
      date: dateUp,
      $pull: { requestedHalls: id },
    });
    // console.log("BookHallDel TR", BookHallDel);
  } else {
    BookHallDel = await Bookhall.findByIdAndUpdate(bookHallId, {
      $pull: { requestedHalls: id },
      isDeleted: true,
      deletedBy: req.user._id,
    });
    // console.log("BookHallDel FA", BookHallDel);
  }
  if ((requestedHalls, BookHallDel, bookHallData)) {
    res.status(200).json({
      requestedHalls,
      BookHallDel,
      bookHallData,
      message: "Accepted Requested Hall",
    });
  } else {
    throw new Error({ message: "Requested Hall Not Found" });
  }
});

// @desc    getrequestHall
// @route   /users/conferencehall/getrequesthall/:id
// @access  User Private
const getRequestHallByUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const requestedHalls = await Requesthall.find({
    hostedById: id,
    isDeleted: false,
    date: { $gte: moment(new Date(),"YYYY-MM-DD").format("yyyy-MM-DD") },
  });
  if (requestedHalls) {
    res.status(200).json(requestedHalls);
    // console.log(requestedHalls)
  } else {
    throw new Error({ message: "Requested Hall Not Found" });
  }
});

//Exports the function
module.exports = {
  addRequestHall,
  getrequestHall,
  getRequestHallByUser,
  cancelrequestHall,
  declinerequestHall,
  acceptrequestHall,
};
