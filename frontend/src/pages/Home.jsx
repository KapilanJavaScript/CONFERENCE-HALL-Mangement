import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { BiSearchAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import moment from "moment/moment";
import "../index.css";
import UserHeader from "../components/userComponents/UserHeader";

function Home() {
  const { token } = useSelector((state) => state);
  const [todaybookedHall, setTodayBookedHall] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [locationOptions, setLocationOptions] = useState(null);
  const [selectOptions, setSelectOptions] = useState("");
  const [view, setView] = useState(false);
  const [modalHallData, setmodalHallData] = useState([]);
  const [searchForm, setSearchForm] = useState({
    hallLocation: "",
    hallCapacity: "",
    date: new Date(),
    from: "",
    to: "",
  });
  const [modalFormData, setModalFormData] = useState({
    noOfCandidates: "",
    members: [],
    date: new Date(),
    title: "",
    description: "",
    priority: "",
    from: "",
    to: "",
  });
  const [conferenceHall, setConferenceHall] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      return navigate("/login");
    }
    if (!locationOptions || !conferenceHall) {
      setIsLoading(true);
      locationData();
      getHall(token);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [token, isLoading, locationOptions, conferenceHall]);

  const getHall = async () => {
    setIsLoading(true);
    const capacity =
      searchForm.hallCapacity === "" ? "1" : searchForm.hallCapacity;
    const location =
      searchForm.hallLocation === "" ? "Coimbatore" : searchForm.hallLocation;
    try {
      const id = token._id;
      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      };
      const response = await axios.get(
        `/admin/conferencehall/gethall?capacity=${capacity}&location=${location}`,
        config
      );

      const responseTodaySchedule = await axios.get(
        `/users/conferencehall/viewbookhalltd/${id}`,
        config
      );
      // console.log(responseTodaySchedule);
      if (response.status === 200 || 201) {
        setIsLoading(false);
        if (responseTodaySchedule.data.bookHall.length > 2) {
          let todaysEvent = responseTodaySchedule.data.bookHall.slice(0, 2);
          setTodayBookedHall(todaysEvent);
          setView(true);
        } else {
          setTodayBookedHall(responseTodaySchedule.data.bookHall);
        }
        setConferenceHall(response.data.ConferenceHallDataApi);
      }
    } catch (error) {
      // toast.error(error.response?.data.message);
      setIsLoading(false);
// console.log(error);
      navigate("/login");
    }
  };

  // const getTodaysEvent = async () => {
  //   try {
  //     const id = token._id;
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token.token}`,
  //       },
  //     };
  //     const response = await axios.get(
  //       `/users/conferencehall/viewbookhalltd/${id}`,
  //       config
  //     );
  //     // console.log(response);
  //     setTodayBookedHall(response.data.bookHall);
  //     console.log(response.data.bookHall,conferenceHall);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   // setBookedHall(response.data);
  // };

  const locationData = async () => {
    try {
      const response = await axios.get("/admin/location/getlocation");
      const Location = response.data.map((data) => {
        return { key: data._id, value: data.location, label: data.location };
      });
      setLocationOptions(Location);
      const tokenLocation = token.location;
      // setSelectedlocation({ hallLocation: tokenLocation });
      setSearchForm((prevState) => ({
        ...prevState,
        hallLocation: tokenLocation,
      }));
    } catch (error) {
      toast.error(error.response?.data.message);
      // console.log(error);
    }
  };

  const handlelocation = (e) => {
    // setSelectedlocation({ hallLocation: e.value });
    setSearchForm((prev) => ({ ...prev, hallLocation: e.value }));
  };

  // React User Select
  const userOption = async (data) => {
    const tokenId = token.token;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.get(`/users/getuser`, config);
      const reactSelectOptions = [];
      response.data.forEach((data) => {
        if (data._id !== token._id) {
          reactSelectOptions.push({
            key: data._id,
            value: data.employeeName,
            label: data.employeeName,
          });
        }
      });
      setmodalHallData(data);
      setSelectOptions(reactSelectOptions);

      // setModalFormData({...modalFormData, date:new Date()})
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log("js.42 error", error);
    }
  };

  // React User Selected Option
  const handleModalUserSelect = (e) => {
    if (e.length > 0) {
      setModalFormData((prev) => ({
        ...prev,
        members: e,
        noOfCandidates: e.length,
      }));
    } else {
      setModalFormData((prev) => ({
        ...prev,
        members: [],
        noOfCandidates: "",
      }));
    }
  };

  function handleModalDataChange(e) {
    if (e.length > 0) {
      const Date = e.map(
        (data) => `${data.year}-${data.month.number}-${data.day}`
      );
      setModalFormData((prev) => ({ ...prev, date: Date }));
    } else {
      setModalFormData((prev) => ({ ...prev, date: null }));
    }
  }
  const handleModalDropdownchange = (e) => {
    // console.log(e.target.value, "priority-----");
    setModalFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleModalTime1Change = (e) => {
    // setTime((prev) => ({ ...prev, from: e }));
    setModalFormData((prev) => ({ ...prev, from: e }));
  };

  const handleModalTime2Change = (e) => {
    // setTime((prev) => ({ ...prev, to: e }));
    setModalFormData((prev) => ({ ...prev, to: e }));
  };
  const handleModalChange = (e) => {
    // console.log(e)
    setModalFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleModalSubmit = async () => {
    try {
      const {
        noOfCandidates,
        members,
        date,
        title,
        description,
        priority,
        from,
        to,
      } = modalFormData;
      if (
        !noOfCandidates ||
        !members.length > 0 ||
        !date ||
        !title.trim() ||
        !description.trim() ||
        priority === "false" ||
        !priority ||
        !from ||
        !to
      ) {
        // console.log("modalFormData", modalFormData);
        return toast.error("Fill all the Field");
      }
      const fromTime = `${from.hour}:${from.minute}`;
      const toTime = `${to.hour}:${to.minute}`;
      const GMTdate =
        date.length > 0
          ? date.map((ele) =>
              String(`${moment(ele, "YYYY-MM-DD").format("YYYY-MM-DD")}`)
            )
          : String(`${moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")}`);
      if (
        GMTdate.includes(moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"))
      ) {
        if (
          new Date(
            `${moment(new Date(), "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            )}, ${fromTime}`
          ) <= new Date()
        ) {
          return toast.error("Start time must be greater than real time");
        }
      }
      if (
        new Date(`0001-01-01, ${toTime}`) <= new Date(`0001-01-01, ${fromTime}`)
      ) {
        return toast.error("End time must be greater than Start Time");
      }
      const membersName = members.map((e) => ({
        memberName: e.value,
        memberId: e.key,
      }));
      const tokenId = token.token;
      // console.log(modalHallData);
      const { _id } = modalHallData;
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      let mem = [
        ...membersName,
        { memberName: token.employeeName, memberId: token._id },
      ];

      const Data = {
        ...modalFormData,
        noOfCandidates: mem.length,
        date: GMTdate,
        from: fromTime,
        to: toTime,
        members: mem,
      };
      // console.log("Submit----------------------", Data);

      const responseBookhall = await axios.post(
        `/users/conferencehall/bookhall/${_id}`,
        Data,
        config
      );
      if (responseBookhall.status === 201 || 200) {
        // console.log(responseBookhall);
        toast.success("Hall Booked");
        setModalFormData({
          noOfCandidates: "",
          members: [],
          date: null,
          title: "",
          description: "",
          priority: "false",
          from: "",
          to: "",
        });
        document.getElementById("closeModal").click();
      } else {
        // console.log(responseBookhall);
        console.log("responseBookhall", responseBookhall.data);
      }
    } catch (error) {
      // console.log(error.response.data.message);
      toast.warning(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    setSearchForm((prev) => ({ ...prev, hallCapacity: e.target.value }));
  };
  const handleSearch = (e) => {
    e.preventDefault();
    // console.log(searchForm);
    getHall(token);
  };

  return (
    <>
      <UserHeader />
      {isLoading && <Spinner />}

      <div className="container">
        {/* {console.log(todaybookedHall)} */}
        {todaybookedHall.length > 0 && (
          <>
            <h3 className="mt-3 mb-1 ">Today's Schedules</h3>
            <div className="row row-cols-lg-2 row-cols-md-2 row-cols-sm-1 d-flex justify-content-center">
              {todaybookedHall.map((event, i) => {
                let hallName = [];
                conferenceHall.filter(
                  (ele) =>
                    ele._id === event.hallId && hallName.push(ele.hallName)
                );
                // console.log(todaybookedHall)
                return (
                  <React.Fragment key={i}>
                    <div className="col-md-6">
                      <div className="card shadow m-1">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2 ">
                            <div className="row mb-2">
                              <div className="col-7">
                                <span className="fw-bold"> Meeting Title:</span>
                                <span className="text-dark ms-2">
                                  {event.title}
                                </span>
                              </div>

                              <div className="col text-end">
                                <span className="fw-bold"> Time:</span>
                                <span className="ms-2">
                                  {moment(event.from, "HH-mm-ss").format(
                                    "hh:mm A"
                                  )}
                                </span>
                                <span className="">
                                  -
                                  {moment(event.to, "HH-mm-ss").format(
                                    "hh:mm A"
                                  )}
                                </span>
                              </div>
                              <div className="">
                                <span className="fw-bold">
                                  {" "}
                                  Meeting hallName:
                                </span>
                                <span className="text-dark ms-2">
                                  {hallName[0]}
                                </span>
                              </div>
                            </div>
                          </h6>
                          <span className="card-text ">
                            <span className="fw-bold d-flex justify-content-center border-bottom">
                              Meeting Description:
                            </span>
                            <div
                              className="overflow-hidden"
                              style={{ height: "6vh" }}
                            >
                              <span className="text-dark ms-2 lh-base ">
                                {event.description}
                              </span>
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              {view && (
                <div className="col-md-6 d-flex justify-content-center mt-3 ">
                  <Link to={"/viewschedules"}>View More</Link>
                </div>
              )}
            </div>
          </>
        )}
        <div className="row mx-2 mt-4">
          <h1 className="col fs-1 fs-md-3 fs-sm-4 mb-4">Book Hall</h1>
          <br></br>
          <p className="m-0">Search for hall suggestions..</p>
          <form onSubmit={handleSearch}>
            <div className="d-md-flex align-items-md-center ">
              <div className="col-md-3 m-1">
                <Select
                  placeholder="Select Location"
                  name="colors"
                  id="hallLocation"
                  value={
                    searchForm.hallLocation === ""
                      ? ""
                      : {
                          key: searchForm.hallLocation,
                          value: searchForm.hallLocation,
                          label: searchForm.hallLocation,
                        }
                  }
                  options={locationOptions}
                  className="basic-single "
                  classNamePrefix="select"
                  onChange={handlelocation}
                  required
                />
              </div>
              <div className="col-md-3 m-1 d-flex align-items-center">
                <div>
                  <input
                    type="number"
                    id="hallCapacity"
                    value={searchForm.hallCapacity}
                    className="form-control"
                    placeholder="No. of Candidates"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <button
                    className="btn fs-6"
                    onClick={() => {
                      window.scroll({
                        top: 290,
                        left: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    <span className="me-2">
                      <BiSearchAlt />
                    </span>
                    <span> Search..</span>
                  </button>
                </div>
              </div>
              {/* <div className="col mx-2">
              <button className="btn btn-success">
                <span className="me-2">
                  <BiSearchAlt />
                </span>
                <span> Search..</span>
              </button>
            </div> */}
            </div>
          </form>
        </div>
        <div className="row mx-2 mt-5 second">
          <p className="col fs-3 fs-md-5 fs-sm-5 ">Suggested Hall</p>
          <div className="">
            <div className="row row-cols-lg-2 row-cols-md-2 row-cols-sm-1 d-flex justify-content-center">
              <>
                {conferenceHall.length > 0 ? (
                  conferenceHall.map((data, i) => {
                    return (
                      <React.Fragment key={data._id}>
                        <div className="col-md-6">
                          <div className="card shadow rounded-4 m-1">
                            <div className="card-body">
                              <span className="card-text">
                                <span>Hall_Name : </span>
                                {data.hallName}
                              </span>
                              <br></br>
                              <span className="card-text">
                                <span>Hall_Email : </span>
                                {data.hallEmail}
                              </span>
                              <br></br>
                              <span className="card-text">
                                <span>Hall_Capacity : </span>
                                {data.hallCapacity}
                              </span>
                              <div className="d-flex justify-content-end">
                                <Link
                                  to={`/halls/viewmore/${data._id}`}
                                  className="btn btn-secondary me-2"
                                >
                                  View more
                                </Link>
                                {/* <!-- Modal --> */}
                                <div className="">
                                  <button
                                    type="button"
                                    className="btn btn-primary d-flex align-items-center fs-sm-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#staticBackdrop"
                                    onClick={() => {
                                      userOption(data);
                                    }}
                                  >
                                    <span className="">Book</span>
                                  </button>

                                  <div
                                    className="modal fade"
                                    id="staticBackdrop"
                                    data-bs-backdrop="static"
                                    data-bs-keyboard="false"
                                    tabIndex="-1"
                                    aria-labelledby="staticBackdropLabel"
                                    aria-hidden="true"
                                  >
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                      <div className="modal-content">
                                        <div className="border">
                                          <div className="modal-header">
                                            <h5
                                              className="modal-title"
                                              id="staticBackdropLabel"
                                            >
                                              Book Hall
                                            </h5>
                                            <button
                                              type="button"
                                              className="btn-close d-flex justify-content-end"
                                              id="closeModal"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                              onClick={() =>
                                                setModalFormData({
                                                  noOfCandidates: "",
                                                  members: [],
                                                  date: new Date(),
                                                  title: "",
                                                  description: "",
                                                  priority: "false",
                                                  from: "",
                                                  to: "",
                                                })
                                              }
                                            ></button>
                                          </div>
                                        </div>
                                        <form>
                                          <div className="modal-body text-start">
                                            <div className="row mb-4 d-flex justify-content-center">
                                              <div className="card col-lg-5 border border-dark">
                                                <div className="card-body">
                                                  <span className="card-text d-flex justify-content-start">
                                                    <span>Hall_Name :</span>
                                                    <span className="ms-2">
                                                      {!modalHallData
                                                        ? ""
                                                        : modalHallData.hallName}
                                                    </span>
                                                  </span>
                                                  <span className="card-text d-flex justify-content-start">
                                                    <span>Hall_Email :</span>
                                                    <span className="ms-2">
                                                      {!modalHallData
                                                        ? ""
                                                        : modalHallData.hallEmail}
                                                    </span>
                                                  </span>
                                                  <span className="card-text d-flex justify-content-start">
                                                    <span>
                                                      Hall_Locaiton :{" "}
                                                    </span>
                                                    <span className="ms-2">
                                                      {!modalHallData
                                                        ? ""
                                                        : modalHallData.hallLocation}
                                                    </span>
                                                  </span>
                                                  <span className="card-text d-flex justify-content-start">
                                                    <span>
                                                      Hall_Capacity :{" "}
                                                    </span>
                                                    <span className="ms-2">
                                                      {!modalHallData
                                                        ? ""
                                                        : modalHallData.hallCapacity}
                                                    </span>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            {/* React Date picker */}
                                            <div className="row row-cols-lg-3 row-cols-md-1 d-flex align-items-center mb-4">
                                              {/* Date */}
                                              <div className="d-flex align-items-center  mb-2">
                                                <div className="me-2">
                                                  <span>Date</span>
                                                </div>
                                                <DatePicker
                                                  containerClassName="custom-container"
                                                  placeholder="Select Date"
                                                  multiple
                                                  disableYearPicker
                                                  showOtherDays
                                                  weekStartDayIndex={1}
                                                  format="YYYY/MM/DD"
                                                  minDate={new Date()}
                                                  maxDate={
                                                    new Date(
                                                      new Date().getFullYear() +
                                                        1,
                                                      11
                                                    )
                                                  }
                                                  calendarPosition={`${"bottom"}-${"center"}`}
                                                  fixMainPosition={true}
                                                  fixRelativePosition={true}
                                                  render={<InputIcon />}
                                                  plugins={[
                                                    <DatePanel sort="date" />,
                                                  ]}
                                                  mapDays={({ date }) => {
                                                    let isWeekend = [
                                                      0, 6,
                                                    ].includes(
                                                      date.weekDay.index
                                                    );
                                                    if (isWeekend)
                                                      return {
                                                        disabled: true,
                                                        style: {
                                                          color: "#ccc",
                                                        },
                                                      };
                                                  }}
                                                  value={modalFormData.date}
                                                  onChange={
                                                    handleModalDataChange
                                                  }
                                                />
                                              </div>
                                              {/* Time */}
                                              <div className="d-flex align-items-center mb-2">
                                                <div className="me-2">
                                                  <span>Time</span>
                                                </div>
                                                <div className=" me-2">
                                                  <DatePicker
                                                    disableDayPicker
                                                    placeholder="From"
                                                    containerClassName="custom-timecontainer"
                                                    format="hh:mm A"
                                                    value={modalFormData.from}
                                                    plugins={[
                                                      <TimePicker
                                                        hideSeconds
                                                      />,
                                                    ]}
                                                    onChange={
                                                      handleModalTime1Change
                                                    }
                                                  />
                                                </div>
                                                <div>
                                                  <DatePicker
                                                    disableDayPicker
                                                    placeholder="To"
                                                    containerClassName="custom-timecontainer"
                                                    format="hh:mm A"
                                                    value={modalFormData.to}
                                                    plugins={[
                                                      <TimePicker
                                                        hideSeconds
                                                      />,
                                                    ]}
                                                    onChange={
                                                      handleModalTime2Change
                                                    }
                                                  />
                                                </div>
                                              </div>
                                              {/* Priority */}
                                              <div className="d-flex align-items-center mb-2">
                                                <span className="me-3">
                                                  Priority
                                                </span>
                                                <div className="form-outline ">
                                                  <select
                                                    className="form-select"
                                                    aria-label="Default select example"
                                                    placeholder="Select Priority"
                                                    id="priority"
                                                    value={
                                                      modalFormData.priority
                                                    }
                                                    onChange={
                                                      handleModalDropdownchange
                                                    }
                                                  >
                                                    <option
                                                      label="Select Priority"
                                                      value={false}
                                                    >
                                                      Select Priority
                                                    </option>
                                                    <option value="High">
                                                      High
                                                    </option>
                                                    <option value="Medium">
                                                      Medium
                                                    </option>
                                                    <option value="Low">
                                                      Low
                                                    </option>
                                                  </select>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row row-cols-lg-2 row-cols-md-1 d-flex flex-row align-items-center mb-4">
                                              {/* member */}
                                              <div className="col d-flex align-items-center col-md-7 me-lg-5 me-md-5 mb-2">
                                                <span className="me-4">
                                                  Members
                                                </span>
                                                <div className="col-md-10 ">
                                                  <Select
                                                    isMulti
                                                    value={
                                                      modalFormData.members
                                                    }
                                                    placeholder="Select candidate for meeting"
                                                    name="admin"
                                                    options={selectOptions}
                                                    className="basic-single "
                                                    classNamePrefix="select"
                                                    isClearable={true}
                                                    onChange={
                                                      handleModalUserSelect
                                                    }
                                                  />
                                                </div>
                                              </div>
                                              {/* NO of Candidates */}
                                              <div className="col-md-3 col-sm-5">
                                                <div className="form-outline flex-fill">
                                                  <input
                                                    type="number"
                                                    id="noOfCandidates"
                                                    value={
                                                      modalFormData.noOfCandidates
                                                        ? modalFormData.noOfCandidates
                                                        : ""
                                                    }
                                                    className="form-control"
                                                    placeholder="No. Of Candidates"
                                                    disabled={true}
                                                    required={true}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            {/* Title */}
                                            <div className="d-flex flex-row align-items-center mb-4">
                                              <span className="me-lg-5 me-md-4">
                                                Title
                                              </span>
                                              <div className="form-outline flex-fill ms-lg-2">
                                                <input
                                                  type="text"
                                                  id="title"
                                                  value={modalFormData.title}
                                                  className="form-control"
                                                  placeholder="Enter Meeting Title"
                                                  onChange={handleModalChange}
                                                  required={true}
                                                />
                                              </div>
                                            </div>
                                            {/* Description */}
                                            <div className="d-flex flex-row mb-1">
                                              <span className="me-lg-2 me-md-2">
                                                Description
                                              </span>
                                              <div className="form-outline flex-fill mb-0">
                                                <textarea
                                                  type="textarea"
                                                  id="description"
                                                  value={
                                                    modalFormData.description
                                                  }
                                                  className="form-control"
                                                  placeholder="Enter Meeting subject or Reason"
                                                  onChange={handleModalChange}
                                                  required={true}
                                                ></textarea>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="modal-footer d-flex justify-content-end">
                                            <button
                                              type="button"
                                              className="btn btn-danger"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                              onClick={() =>
                                                setModalFormData({
                                                  noOfCandidates: "",
                                                  members: [],
                                                  date: null,
                                                  title: "",
                                                  description: "",
                                                  priority: "false",
                                                  from: "",
                                                  to: "",
                                                })
                                              }
                                            >
                                              Close
                                            </button>
                                            <button
                                              type="button"
                                              className="btn btn-success"
                                              onClick={handleModalSubmit}
                                            >
                                              Book Hall
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                ) : (
                  <>
                    <h1>Service not available</h1>
                  </>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
