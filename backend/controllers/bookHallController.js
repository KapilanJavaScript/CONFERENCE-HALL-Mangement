const asyncHandler = require("express-async-handler");
const Bookhall = require("../models/bookHallModel");
const Conferencehall = require("../models/conferencehallModel");
const moment = require("moment/moment");

// @desc    bookhall
// @route   /users/conferencehall/bookhall
// @access  Private
const bookHall = asyncHandler(async (req, res) => {
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
  let DATADate = date;
  // console.log(DATADate);
  const hallExists = await Conferencehall.findById(req.params.id);

  if (!hallExists) {
    res.status(400);
    throw new Error("Hall not found exists");
  }
  // const date = dateData.map(data=>(moment(data).format()))
  const checkingHallAvail = await Bookhall.find({
    isDeleted: false,
    hallId: req.params.id,
  });
  // console.log(checkingHallAvail);
  let flag = true;
  if (checkingHallAvail.length > 0) {
    const checkingTimeDiff = await Bookhall.find({
      isDeleted: false,
      hallId: req.params.id,
      date: { $in: DATADate },
    });
    // console.log(DATADate)
      if (checkingTimeDiff?.length > 0) {
        checkingTimeDiff.forEach((data) => {
          // (x < b && y < b) CONDITION
          if (
            new Date(`0001-01-01, ${data.from}`) <=
              new Date(`0001-01-01, ${from}`) &&
            new Date(`0001-01-01, ${from}`) <=
              new Date(`0001-01-01, ${data.to}`)
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
            new Date(`0001-01-01, ${data.from}`) <=
              new Date(`0001-01-01, ${to}`)
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
    const bookHallData = await Bookhall.create({
      hallId: hallExists._id,
      hallName: hallExists.hallName,
      hostedByName: req.user.employeeName,
      hostedById: req.user._id,
      noOfCandidates,
      members,
      date,
      from,
      to,
      title,
      description,
      priority,
    });
    if (bookHallData) {
      res.status(201).json({ bookHallData });
    } else {
      res.status(400);
      throw new error("Invalid user data");
    }
  }
});

// @desc    viewbookhall
// @route   /users/conferencehall/viewbookhall
// @access  Private
const viewBookHall = asyncHandler(async (req, res) => {
 
  const hallExists = await Conferencehall.findById(req.params.id);

  if (!hallExists) {
    res.status(400);
    throw new Error("Hall not found exists");
  }
  const bookHallExists = await Bookhall.find({
    hallId: req.params.id,
    isDeleted: false,
    date:{$gte: moment(new Date(),"YYYY-MM-DD").format("yyyy-MM-DD")}
  });

  if (!bookHallExists) {
    res.status(400);
    throw new Error("No schedules Booked");
  }

  res.status(201).json({ bookHallExists });
});


// @desc    viewbookhalltd
// @route   /users/conferencehall/viewbookhall
// @access  Private
const viewBookHalltd = asyncHandler(async (req, res) => {
  // const bookHall = await Bookhall.find({
  //   hostedById: req.params.id,
  //   isDeleted: false,
  //   date:{$eq: moment(new Date()).format("yyyy-MM-DD")}
  // });
  // let datetod = []
  // bookHall.forEach((ele, i) => {
  //   if (
  //     Number(moment(ele.data).format("YYYYMMDD")) ===
  //     Number(moment(new Date()).format("YYYYMMDD"))
  //   ) {
  //     if (
  //       new Date(`${moment(ele.data).format("YYYY MM DD")}, ${ele.from}`) >
  //       new Date()
  //     ) {
  //       datetod.push(ele)
  //     }else{
  //       datetod = ele.date.filter(
  //         (eleDt, i) =>
  //           Number(moment(eleDt).format("YYYYMMDD")) <
  //           Number(moment(new Date()).format("YYYYMMDD"))
  //       );
  //     }
  //   }
  // });
  // if (!bookHall) {
  //   res.status(400);
  //   throw new Error("No schedules Booked");
  // }
  const bookedHallMembersList = await Bookhall.find({
    isDeleted: false,
    date: {$eq: moment(new Date()).format("yyyy-MM-DD")},
    members: { $all: [{ $elemMatch : { memberId: req.params.id }}] }
  });
  let datetodMem = []
  bookedHallMembersList.forEach((ele, i) => {
    if (
      Number(moment(ele.data).format("YYYYMMDD")) ===
      Number(moment(new Date()).format("YYYYMMDD"))
    ) {
      if (
        new Date(`${moment(ele.data).format("YYYY MM DD")}, ${ele.to}`) >
        new Date()
      ) {
        datetodMem.push(ele)
      }
      // else{
      //   datetodMem = ele.date.filter(
      //     (eleDt, i) =>
      //       Number(moment(eleDt).format("YYYYMMDD")) <
      //       Number(moment(new Date()).format("YYYYMMDD"))
      //   );
      // }
    }
  });
  res.status(201).json({ bookHall:  datetodMem });
});



//Exports the function
module.exports = {
  bookHall,
  viewBookHall,
  viewBookHalltd,
};
