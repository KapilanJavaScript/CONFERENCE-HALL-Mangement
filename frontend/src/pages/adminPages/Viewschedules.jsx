import "../../index.css";
import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import InputIcon from "react-multi-date-picker/components/input_icon";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import UserHeader from "../../components/userComponents/UserHeader";

function Viewschedules() {
  const { token } = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedHall, setBookedHall] = useState(null);
  const [selectOptions, setSelectOptions] = useState("");
  const [conferenceHall, setConferenceHall] = useState([]);
  const [conferenceHallAll, setConferenceHallAll] = useState([]);
  const [modalHallData, setmodalHallData] = useState(null);
  const [viewModalHallData, setViewModalHallData] = useState(null);
  const [requestedHall, setRequestedHall] = useState([]);
  const [requestedHallTableData, setRequestedHallTableData] = useState([]);
  const [viewModalReqHallData, setViewModalReqHallData] = useState([]);
  const [filterDate, setFilterdate] = useState(
    moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD")
  );
  const [pageCount, setPageCount] = useState(0);
  const [pageNum, setPageNum] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    if (token == null) {
      navigate("/login");
    }
    if (!conferenceHallAll) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
    getHallAllData();
    getRequestedHallsTableData();
    getBookedHall();
    // eslint-disable-next-line
  }, [token, pageCount, pageNum, filterDate]);

  const getHallAllData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      };
      const response = await axios.get(`/admin/conferencehall/gethall`, config);
      setConferenceHallAll(response.data);
    } catch (error) {
      // console.log(error);
      toast.error("someting Went Wrong");

      navigate("/login");
    }
  };

  const getHall = async (data) => {
    const tokenId = token.token;
    const id = data.hallId;
    const config = {
      headers: {
        Authorization: `Bearer ${tokenId}`,
      },
    };
    const response = await axios.get(
      `/admin/conferencehall/gethall/${id}`,
      config
    );
    let hallData = response.data;
    setConferenceHall(hallData);
    setViewModalHallData(data);
  };

  const getBookedHall = async () => {
    setIsLoading(true);
    try {
      const tokenId = token.token;
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.get(
        `/users/conferencehall/viewbookedhall?date=${filterDate}&page=${pageNum}`,
        config
      );
      const hallData = response.data.bookedhallExists;
      if (response.status === 200 || 201) {
        setIsLoading(false);
        setBookedHall(hallData);
        setPageCount(response.data.pageCount);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const cancelBookedHall = async (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const tokenId = token.token;
          const id = e;
          const config = {
            headers: {
              Authorization: `Bearer ${tokenId}`,
            },
          };
          const response = await axios.put(
            `/users/conferencehall/cancelbookedhall/${id}`,
            "_",
            config
          );
          // console.log(typeof response.status);
          if (response.status === 202) {
            const UpdatedbookedHall = bookedHall.filter(
              (data) => data._id !== id
            );
            setBookedHall(UpdatedbookedHall);
            toast.success(response.data.message);
          } else {
            toast.success(response.data.message);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    });
  };

  // React User Select
  const userOption = async () => {
    const tokenId = token.token;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.get(`/users/getuser`, config);
      // console.log(response, "user---------");
      const reactSelectOptions = response.data.map((data) => {
        return {
          key: data._id,
          value: data.employeeName,
          label: data.employeeName,
        };
      });
      setSelectOptions(reactSelectOptions);
      // setmodalHallData(data);
    } catch (error) {
      // console.log("js.42 error", error);
      toast.error("someting Went Wrong");
    }
  };

  // React User Selected Option
  const handleModalUserSelect = (e) => {
    if (e.length > 0) {
      const membersName = e.map((ele) => ({
        memberName: ele.value,
        memberId: ele.key,
      }));
      setmodalHallData((prev) => ({
        ...prev,
        members: membersName,
        noOfCandidates: e.length,
      }));
    } else {
      setmodalHallData((prev) => ({
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
      // console.log(Date);
      setmodalHallData((prev) => ({ ...prev, date: Date }));
    } else {
      setmodalHallData((prev) => ({ ...prev, date: null }));
    }
  }
  const handleModalDropdownchange = (e) => {
    // console.log(e.target.value, "priority-----");
    setmodalHallData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleModalTime1Change = (e) => {
    // setTime((prev) => ({ ...prev, from: e }));
    const fromTime = `${e.hour}:${e.minute}`;
    setmodalHallData((prev) => ({ ...prev, from: fromTime }));
  };

  const handleModalTime2Change = (e) => {
    // setTime((prev) => ({ ...prev, to: e }));
    const toTime = `${e.hour}:${e.minute}`;
    setmodalHallData((prev) => ({ ...prev, to: toTime }));
  };
  const handleModalChange = (e) => {
    // console.log(e)
    setmodalHallData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
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
      } = modalHallData;
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
        console.log("first");
        return toast.error("Fill all the Field");
      }
      const tokenId = token.token;
      const { _id } = modalHallData;
      const matchHall = bookedHall.find(
        (data) => data._id === modalHallData._id
      );
      const momDate = date.map((data) =>
        moment(data, "YYYY-MM-DD").format("YYYY-MM-DD")
      );
      if (new Date(`0001-01-01, ${to}`) <= new Date(`0001-01-01, ${from}`)) {
        return toast.error("End time must be greater than Start Time");
      }
      if (modalHallData === matchHall) {
        return toast.warning("Please change the fields before updating.");
      } else {
        const Data = {
          noOfCandidates,
          members,
          date: momDate,
          title,
          description,
          priority,
          from,
          to,
        };
        const config = {
          headers: {
            Authorization: `Bearer ${tokenId}`,
          },
        };
        const responseBookhall = await axios.put(
          `/users/conferencehall/updatebookedhall/${_id}`,
          Data,
          config
        );
        if (responseBookhall.status === 201 || 200) {
          // console.log(responseBookhall.data.updatedBookedHall);
          getBookedHall();
          toast.success(responseBookhall.data.message);
          document.getElementById("updateBookedHallClose").click();
        } else {
          console.log(responseBookhall);
        }
      }
    } catch (error) {
      toast.warning(error.response.data.message);
    }
  };

  const getRequestedHallsData = async (data) => {
    try {
      const tokenId = token.token;
      const { _id } = data;
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const responseRequestedhall = await axios.get(
        `/users/conferencehall/getrequesthall/${_id}`,
        config
      );
      setRequestedHall(responseRequestedhall.data);
      // console.log(responseRequestedhall.data)
    } catch (error) {
      // console.log(error);
      toast.error("someting Went Wrong");
    }
  };

  const getRequestedHallsTableData = async (data) => {
    try {
      const tokenId = token.token;
      const { _id } = token;
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const responseRequestedhall = await axios.get(
        `/users/conferencehall/getrequesthalluser/${_id}`,
        config
      );
      setRequestedHallTableData(responseRequestedhall.data);
      // console.log(responseRequestedhall)
    } catch (error) {
      // console.log(error);
      toast.error("someting Went Wrong");
    }
  };

  const getReqHall = async (data) => {
    try {
      const tokenId = token.token;
      const id = data.hallId;
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.get(
        `/admin/conferencehall/gethall/${id}`,
        config
      );
      let hallData = response.data;
      setConferenceHall(hallData);
      setViewModalReqHallData(data);
    } catch (error) {
      // console.log(error);
      toast.error("someting Went Wrong");
    }
  };
  const cancelRequestedHall = async (_id) => {
    try {
      const tokenId = token.token;
      console.log(tokenId);
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.put(
        `/users/conferencehall/cancelrequesthall/${_id}`,
        "_",
        config
      );
      const id = response.data.requestedHalls._id;
      const UpdatedbookedHall = requestedHallTableData.filter(
        (data) => data._id !== id
      );
      setRequestedHallTableData(UpdatedbookedHall);
      toast.success(response.data.message);
    } catch (error) {
      // console.log(error);
      toast.error("someting Went Wrong");
    }
  };
  const declineReqHall = async (_id) => {
    try {
      const tokenId = token.token;
      console.log(tokenId);
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.put(
        `/users/conferencehall/declinerequestedhall/${_id}`,
        "_",
        config
      );
      // const id = response.data.requestedHalls._id
      // const UpdatedbookedHall = requestedHallTableData.filter((data) => data._id !== id);
      // getRequestedHallsData(UpdatedbookedHall);
      toast.success(response.data.message);
    } catch (error) {
      // console.log(error);
      toast.error("someting Went Wrong");
    }
  };

  const acceptReqHall = async (_id) => {
    try {
      const tokenId = token.token;
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.put(
        `/users/conferencehall/acceptrequestedhall/${_id}`,
        "_",
        config
      );
      // console.log(response);
      toast.success(response.data.message);
      if (response.status === 200 || 201) {
        getBookedHall();
      }
    } catch (error) {
      // console.log(error);
      toast.error("someting Went Wrong");
    }
  };

  const handlePageClick = (e) => {
    // console.log(e)
    setPageNum(e.selected);
  };

  //FILTER Date Change
  const handleDateChange = (e) => {
    // console.log(e)
    const Date = `${e.year}-${e.month.number}-${e.day}`;
    const mDate = moment(Date, "YYYY-MM-DD").format("YYYY-MM-DD");
    setFilterdate(mDate);
    setPageNum(0);
  };
  return (
    <>
      <UserHeader />
      {isLoading && <Spinner />}
      <div className="container">
        <div className="row mx-2 mt-5">
          <h1 className="col fs-2 fs-md-3 fs-sm-4">Booking History</h1>
          <div className="col d-flex justify-content-end">
            {/* <!-- Search --> */}
            {/* <div className="input-group-lg pe-4 pe-sm-2">
              <input
                type="text"
                placeholder="Search"
                className="form-control "
              />
            </div> */}
            <div className="d-flex align-items-center  mb-2">
              <div className="me-2"></div>
              <DatePicker
                containerClassName="custom-container"
                placeholder="Select Date"
                disableYearPicker
                showOtherDays
                weekStartDayIndex={1}
                format="YYYY-MM-DD"
                maxDate={new Date(new Date().getFullYear() + 1, 11)}
                calendarPosition={`${"bottom"}-${"center"}`}
                fixMainPosition={true}
                fixRelativePosition={true}
                render={<InputIcon />}
                mapDays={({ date }) => {
                  let isWeekend = [0, 6].includes(date.weekDay.index);
                  if (isWeekend)
                    return {
                      disabled: true,
                      style: {
                        color: "#ccc",
                      },
                    };
                }}
                value={filterDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
          {/* Table */}
          {bookedHall?.length > 0 ? (
            <div className="table-responsive-md">
              <table className="table table-striped table-bordered table-hover mt-5 text-center">
                <thead>
                  <tr>
                    <th scope="col">Hall Name</th>
                    {/* <th scope="col">Booked By</th> */}
                    <th scope="col">No.Of Candidates</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Title</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Actions</th>
                    <th scope="col">Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedHall.map((data, i) => {
                    let hallName = [];
                    conferenceHallAll.filter(
                      (ele) =>
                        ele._id === data.hallId && hallName.push(ele.hallName)
                    );
                    return (
                      <React.Fragment key={data._id}>
                        <tr>
                          <td>{hallName[0]}</td>
                          {/* <td>{user?.employeeName}</td> */}
                          <td>{data.noOfCandidates}</td>
                          <td className="">
                            <div className="ms-2 overflow-date">
                              {data.date.length > 0 &&
                                data.date.map((ele, i) => {
                                  return (
                                    <React.Fragment key={i}>
                                      <span>
                                        {moment(ele, "YYYY-MM-DD").format(
                                          "MMM Do YY"
                                        )}
                                      </span>
                                    </React.Fragment>
                                  );
                                })}
                            </div>
                          </td>
                          <td>
                            <div>
                              <span className="me-2">
                                From{" "}
                                {moment(data.from, "HH-mm-ss").format(
                                  "hh:mm A"
                                )}
                              </span>
                              <span className="">
                                To{" "}
                                {moment(data.to, "HH-mm-ss").format("hh:mm A")}
                              </span>
                            </div>
                          </td>
                          <td>{data.title}</td>
                          <td
                            className={
                              data.priority === "High"
                                ? "text-danger"
                                : data.priority === "Medium"
                                ? "text-warning"
                                : data.priority === "Low"
                                ? "text-primary"
                                : "text"
                            }
                          >
                            {data.priority}
                          </td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <div>
                                {/* <!-- Modal --> */}
                                <div className="me-2">
                                  <button
                                    type="button"
                                    className="btn btn-primary d-flex align-items-center fs-sm-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#viewBookedHall"
                                    onClick={() => getHall(data)}
                                  >
                                    <span className="">View</span>
                                  </button>

                                  <div
                                    className="modal fade"
                                    id="viewBookedHall"
                                    // data-bs-backdrop="static"
                                    data-bs-keyboard="false"
                                    tabIndex="-1"
                                    aria-labelledby="viewBookedHallLabel"
                                    aria-hidden="true"
                                  >
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                      {!viewModalHallData ? (
                                        <Spinner />
                                      ) : (
                                        <div className="modal-content">
                                          <div className="border">
                                            <div className="modal-header d-flex align-items-center">
                                              <span className="d-flex flex-column">
                                                <h5
                                                  className="text-start mb-0"
                                                  id="viewBookedHallLabel"
                                                >
                                                  Title:{" "}
                                                  {!viewModalHallData
                                                    ? ""
                                                    : viewModalHallData.title}
                                                </h5>
                                                {/* <p className=" ms-2 fw-light fst-italic">
                                                  -
                                                  {!viewModalHallData
                                                    ? ""
                                                    : viewModalHallData.hostedByName}
                                                </p> */}
                                              </span>
                                              <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                                // onClick={}
                                              ></button>
                                            </div>
                                          </div>
                                          <form>
                                            <div className="modal-body text-start">
                                              <div className="row mb-4">
                                                <div className="col">
                                                  <div className="me-2 fw-bolder text-center">
                                                    <span>Hall Name</span>
                                                  </div>
                                                  <input
                                                    type="text"
                                                    id="hallName"
                                                    value={
                                                      conferenceHall.hallName
                                                    }
                                                    className="form-control text-center border-0 bg-light"
                                                    placeholder="hallName"
                                                    readOnly={true}
                                                  />
                                                </div>
                                                <div className="col">
                                                  <div className="me-2 fw-bolder text-center">
                                                    <span>Hall Email</span>
                                                  </div>
                                                  <input
                                                    type="text"
                                                    id="hallName"
                                                    value={
                                                      conferenceHall.hallEmail
                                                    }
                                                    className="form-control text-center border-0 bg-light"
                                                    placeholder="hallName"
                                                    readOnly={true}
                                                  />
                                                </div>
                                                <div className="col">
                                                  <div className="me-2 fw-bolder text-center">
                                                    <span>Priority</span>
                                                  </div>
                                                  <input
                                                    type="text"
                                                    id="priority"
                                                    value={
                                                      viewModalHallData.priority
                                                    }
                                                    className={`form-control text-center border-0 bg-light ${
                                                      viewModalHallData.priority ===
                                                      "High"
                                                        ? "text-danger"
                                                        : viewModalHallData.priority ===
                                                          "Medium"
                                                        ? "text-warning"
                                                        : viewModalHallData.priority ===
                                                          "Low"
                                                        ? "text-dark"
                                                        : "text-light"
                                                    }`}
                                                    placeholder="priority"
                                                    readOnly={true}
                                                  />
                                                </div>
                                              </div>
                                              {/* React Date picker */}
                                              <div className="col d-flex align-items-center mb-4 ">
                                                {/* Date */}
                                                <div className="d-flex flex-column align-items-center justify-content-center col-md-6 fs-5">
                                                  <div className="me-2 fw-bolder">
                                                    <span>Date</span>
                                                  </div>
                                                  <div className="col-md-7">
                                                    <select
                                                      className="form-select text-center  bg-light border-0"
                                                      size={
                                                        viewModalHallData.date
                                                          .length > 3
                                                          ? 4
                                                          : viewModalHallData
                                                              .date.length
                                                      }
                                                      aria-label="size 3 select example"
                                                    >
                                                      {viewModalHallData.date.map(
                                                        (data, i) => {
                                                          return (
                                                            <option
                                                              value={moment(
                                                                data,
                                                                "YYYY-MM-DD"
                                                              ).format(
                                                                "YYYY-MM-DD"
                                                              )}
                                                              key={i}
                                                            >
                                                              {moment(
                                                                data,
                                                                "YYYY-MM-DD"
                                                              ).format(
                                                                "MMM Do YY"
                                                              )}
                                                            </option>
                                                          );
                                                        }
                                                      )}
                                                    </select>
                                                  </div>
                                                </div>
                                                {/* Time */}
                                                <div className="d-flex flex-column align-items-center justify-content-center  col-md-6">
                                                  <div className="mb-2 fs-5 fw-bolder">
                                                    <span>Time</span>
                                                  </div>
                                                  <div className="row">
                                                    <div className="col">
                                                      <input
                                                        type="text"
                                                        id="From"
                                                        value={`From  ${moment(
                                                          viewModalHallData.from,
                                                          "HH-mm-ss"
                                                        ).format("hh:mm A")}`}
                                                        className="form-control text-center border-0 bg-light"
                                                        placeholder="to"
                                                        readOnly
                                                      />
                                                    </div>
                                                    <div className="col">
                                                      <input
                                                        type="text"
                                                        id="From"
                                                        value={`To  ${moment(
                                                          viewModalHallData.to,
                                                          "HH-mm-ss"
                                                        ).format("hh:mm A")}`}
                                                        className="form-control text-center border-0 bg-light "
                                                        placeholder="to"
                                                        readOnly
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                                {/* Priority */}
                                                {/* <div className=" col d-flex align-items-center justify-content-center ">
                                                <span className="me-3">
                                                  Priority
                                                </span>
                                                <div className="form-outline ">
                                                  <input
                                                    type="text"
                                                    id="title"
                                                    value={viewModalHallData.priority}
                                                    className="form-control"
                                                    placeholder="Enter Meeting Title"
                                                    readOnly
                                                    required={true}
                                                  />
                                                </div>
                                              </div> */}
                                              </div>
                                              <div className="d-flex align-items-center justify-content-center mb-2 fs-5 fw-bolder">
                                                <span className="me-3 ">
                                                  No of Candidates
                                                </span>
                                                <span>
                                                  {
                                                    viewModalHallData.noOfCandidates
                                                  }
                                                </span>
                                              </div>
                                              <div className=" d-flex flex-row align-items-center justify-content-center mb-4 ">
                                                <div className="col-md-5">
                                                  <select
                                                    className="form-select text-center "
                                                    size={
                                                      viewModalHallData.members
                                                        .length
                                                    }
                                                    aria-label="size 3 select example"
                                                  >
                                                    {viewModalHallData.members.map(
                                                      (data, i) => {
                                                        return (
                                                          <option
                                                            value={
                                                              data.memberName
                                                            }
                                                            key={i}
                                                          >
                                                            {data.memberName}
                                                          </option>
                                                        );
                                                      }
                                                    )}
                                                  </select>
                                                </div>
                                              </div>
                                              {/* Description */}
                                              <div className="d-flex flex-column mb-1">
                                                <span className="mb-2 fs-5 fw-bolder d-flex justify-content-center">
                                                  Description
                                                </span>
                                                <div className="form-outline  mb-0">
                                                  <textarea
                                                    type="text"
                                                    id="description"
                                                    value={
                                                      viewModalHallData.description
                                                    }
                                                    className="form-control bg-light"
                                                    placeholder="Enter Meeting subject or Reason"
                                                    // onChange={handleModalChange}
                                                    required={true}
                                                    readOnly
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
                                              >
                                                Close
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                {/* <!-- Modal --> */}
                                <div className="">
                                  <button
                                    type="button"
                                    className="btn btn-warning d-flex align-items-center"
                                    data-bs-toggle="modal"
                                    id={data._id}
                                    data-bs-target="#updateBookedHall"
                                    onClick={() => (
                                      // eslint-disable-next-line
                                      setmodalHallData(data), userOption()
                                    )}
                                  >
                                    <span className="">Update</span>
                                  </button>

                                  <div
                                    className="modal fade"
                                    id="updateBookedHall"
                                    data-bs-backdrop="static"
                                    data-bs-keyboard="false"
                                    tabIndex="-1"
                                    aria-labelledby="updateBookedHallLabel"
                                    aria-hidden="true"
                                  >
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                      {!modalHallData ? (
                                        <Spinner />
                                      ) : (
                                        <div className="modal-content">
                                          <div className="border">
                                            <div className="modal-header">
                                              <h5
                                                className="modal-title"
                                                id="updateBookedHallLabel"
                                              >
                                                Reschedule Hall
                                              </h5>
                                              <button
                                                type="button"
                                                className="btn-close d-flex justify-content-end"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                                // onClick={}
                                              ></button>
                                            </div>
                                          </div>
                                          <form>
                                            <div className="modal-body text-start">
                                              {/* React Date picker */}
                                              <div className="row row-cols-lg-3 row-cols-md-1 d-flex align-items-center mb-4">
                                                {/* Date */}
                                                <div className="d-flex align-items-center  mb-2">
                                                  <div className="me-1">
                                                    <span>Date</span>
                                                  </div>
                                                  <DatePicker
                                                    containerClassName="custom-container"
                                                    placeholder="Select Date"
                                                    multiple
                                                    disableYearPicker
                                                    showOtherDays
                                                    minDate={new Date()}
                                                    maxDate={
                                                      new Date(
                                                        new Date().getFullYear() +
                                                          1,
                                                        11
                                                      )
                                                    }
                                                    weekStartDayIndex={1}
                                                    format="YYYY/MM/DD"
                                                    calendarPosition={`${"bottom"}-${"center"}`}
                                                    fixMainPosition={true}
                                                    fixRelativePosition={true}
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
                                                    value={
                                                      modalHallData.date
                                                      // ? modalHallData.date.map(
                                                      //     (ele) =>
                                                      //       moment(
                                                      //         ele
                                                      //       ).format(
                                                      //         "YYYY-MM-DD"
                                                      //       )
                                                      //   )
                                                      // : ""
                                                    }
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
                                                      value={
                                                        new Date(
                                                          `0001-01-01, ${modalHallData.from}`
                                                        )
                                                      }
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
                                                      value={
                                                        new Date(
                                                          `0001-01-01, ${modalHallData.to}`
                                                        )
                                                      }
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
                                                <div className="d-flex align-items-center mb-2 ">
                                                  <span className="me-2">
                                                    Priority
                                                  </span>
                                                  <div className="form-outline ">
                                                    <select
                                                      className="form-select"
                                                      aria-label="Default select example"
                                                      placeholder="Select Priority"
                                                      id="priority"
                                                      value={
                                                        modalHallData.priority
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
                                                      // defaultValue={[Data[2], Data[3]]}
                                                      isMulti
                                                      value={modalHallData.members.map(
                                                        (ele) => ({
                                                          key: ele.memberId,
                                                          value: ele.memberName,
                                                          label: ele.memberName,
                                                        })
                                                      )}
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
                                                        modalHallData.noOfCandidates
                                                      }
                                                      className="form-control"
                                                      placeholder="No. Of Candidates"
                                                      readOnly
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
                                                    value={modalHallData.title}
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
                                                      modalHallData.description
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
                                                id="updateBookedHallClose"
                                              >
                                                Close
                                              </button>
                                              <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={handleModalSubmit}
                                              >
                                                Reschedule
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <button
                                  className="btn btn-danger ms-2"
                                  onClick={() => cancelBookedHall(data._id)}
                                  value={data._id}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                          <td>
                            {data.requestedHalls.length > 0 ? (
                              <div>
                                <button
                                  className="btn btn-secondary"
                                  type="button"
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#offcanvasRight"
                                  aria-controls="offcanvasRight"
                                  onClick={() => getRequestedHallsData(data)}
                                >
                                  Req
                                </button>

                                <div
                                  className="offcanvas offcanvas-end offcanvas-wh"
                                  tabIndex="-1"
                                  id="offcanvasRight"
                                  aria-labelledby="offcanvasRightLabel"
                                >
                                  <div className="offcanvas-header">
                                    <h5 id="offcanvasRightLabel">
                                      Requested Halls
                                    </h5>
                                    <button
                                      type="button"
                                      className="btn-close text-reset"
                                      data-bs-dismiss="offcanvas"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div className="offcanvas-body">
                                    {requestedHall && requestedHall.length > 0
                                      ? requestedHall.map((ele) => (
                                          <div
                                            className={`card text-start mb-3  
                                            ${
                                              ele.priority === "High"
                                                ? "border border-danger border-2"
                                                : ele.priority === "Medium"
                                                ? "border border-warning border-2"
                                                : ele.priority === "Low"
                                                ? "border border-light border-2"
                                                : "border border-0"
                                            }
                                            `}
                                            key={ele._id}
                                          >
                                            <div
                                              className={`card-header d-flex justify-content-between 
                                            ${
                                              ele.priority === "High"
                                                ? " card-bg-red "
                                                : ele.priority === "Medium"
                                                ? " card-bg-yellow "
                                                : ele.priority === "Low"
                                                ? " bg-light "
                                                : "border border-0"
                                            }`}
                                            >
                                              <span>
                                                Requested By:
                                                <span className="fw-bold">
                                                  {ele.hostedByName}
                                                </span>
                                              </span>
                                              <span>
                                                Requested Date:
                                                <span className="fw-bold">
                                                  {moment(
                                                    ele.date,
                                                    "YYYY-MM-DD"
                                                  ).format("YYYY-MM-DD")}
                                                </span>
                                              </span>
                                            </div>
                                            <div className="card-body ">
                                              <div className=" d-flex justify-content-between align-items-center">
                                                <h6 className="card-title fw-bold ">
                                                  Title: {ele.title}
                                                </h6>
                                                <p>
                                                  {moment(
                                                    ele.from,
                                                    "HH-mm-ss"
                                                  ).format("hh:mm A")}
                                                  -
                                                  {moment(
                                                    ele.to,
                                                    "HH-mm-ss"
                                                  ).format("hh:mm A")}
                                                </p>
                                              </div>
                                              <div className="card-text">
                                                <div className="row mb-2">
                                                  <div className="col">
                                                    <span className="fw-bold">
                                                      Priority:{" "}
                                                    </span>
                                                    <span>{ele.priority}</span>
                                                  </div>
                                                  <div className="col text-end">
                                                    <span className="fw-bold">
                                                      No. Of Candidates:{" "}
                                                    </span>
                                                    <span>
                                                      {ele.noOfCandidates}
                                                    </span>
                                                  </div>
                                                </div>
                                                <span className="fw-bold d-flex justify-content-center border-bottom">
                                                  Meeting Description:
                                                </span>
                                                <div
                                                  className="overflow-hidden"
                                                  style={{ height: "8vh" }}
                                                >
                                                  <span className="text-dark ms-2 lh-base ">
                                                    {ele.description}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="card-body text-end">
                                              <button
                                                className="btn btn-success me-2 btn-sm"
                                                onClick={() =>
                                                  acceptReqHall(ele._id)
                                                }
                                              >
                                                Accept
                                              </button>
                                              <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                  declineReqHall(ele._id)
                                                }
                                              >
                                                Decline
                                              </button>
                                            </div>
                                          </div>
                                        ))
                                      : "."}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              "--"
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <div className="mt-5 ">
                <h3 className="mt-5  d-flex  justify-content-center">
                  No History Found..
                </h3>
                <h2 className=" d-flex  justify-content-center">
                  <Link to={"/"} className="text-warning">
                    Book Now!
                  </Link>
                </h2>
              </div>
            </>
          )}
          {pageCount > 1 && (
            <div className="d-flex justify-content-center">
              <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
                forcePage={pageNum}
                // value={pageNum}
              />
            </div>
          )}
          {requestedHallTableData.length > 0 && (
            <>
              <div className="col fs-4 mt-3">Requested Halls</div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover mt-3 text-center">
                  <thead>
                    <tr>
                      <th scope="col">Hall Name</th>
                      <th scope="col">Title</th>
                      <th scope="col">Date</th>
                      <th scope="col">Time</th>
                      <th scope="col">No.Of Candidates</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestedHallTableData.map((data, i) => {
                      let hallName = [];
                      conferenceHallAll.filter(
                        (ele) =>
                          ele._id === data.hallId && hallName.push(ele.hallName)
                      );
                      return (
                        <React.Fragment key={data._id}>
                          <tr>
                            <td>{hallName[0]}</td>
                            <td>{data.title}</td>
                            <td className="">
                              <div className="ms-2 overflow-date">
                                <span>
                                  {moment(data.date, "YYYY-MM-DD").format(
                                    "MMM Do YY"
                                  )}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div>
                                <span className="me-2">
                                  {moment(data.from, "HH-mm-ss").format(
                                    "hh:mm A"
                                  )}
                                </span>
                                <span className="me-1">-</span>
                                <span className="">
                                  {moment(data.to, "HH-mm-ss").format(
                                    "hh:mm A"
                                  )}
                                </span>
                              </div>
                            </td>
                            <td>{data.noOfCandidates}</td>
                            <td
                              className={
                                data.priority === "High"
                                  ? "text-danger"
                                  : data.priority === "Medium"
                                  ? "text-warning"
                                  : data.priority === "Low"
                                  ? "text-primary"
                                  : "text"
                              }
                            >
                              {data.priority}
                            </td>
                            <td>
                              {data.isAccepted ? (
                                <span className="text-success">Accepted</span>
                              ) : data.isDeclined ? (
                                <span className="text-danger">Declined</span>
                              ) : (
                                "--"
                              )}
                            </td>
                            {/* <td>{data.isDeclined ? <span className="text-danger">Declined</span> : '--'}</td> */}
                            <td>
                              <div className="d-flex justify-content-center">
                                <div>
                                  {/* <!-- Modal --> */}
                                  <div className="me-2">
                                    <button
                                      type="button"
                                      className="btn btn-primary d-flex align-items-center fs-sm-4"
                                      data-bs-toggle="modal"
                                      data-bs-target="#viewRequestedHall"
                                      onClick={() => getReqHall(data)}
                                    >
                                      <span className="">View</span>
                                    </button>

                                    <div
                                      className="modal fade"
                                      id="viewRequestedHall"
                                      // data-bs-backdrop="static"
                                      data-bs-keyboard="false"
                                      tabIndex="-1"
                                      aria-labelledby="viewRequestedHallLabel"
                                      aria-hidden="true"
                                    >
                                      <div className="modal-dialog modal-lg modal-dialog-centered">
                                        {viewModalReqHallData !== null && (
                                          <div className="modal-content">
                                            <div className="border">
                                              <div className="modal-header d-flex align-items-center">
                                                <span className="d-flex flex-column">
                                                  <h5
                                                    className="text-start mb-0"
                                                    id="viewBookedHallLabel"
                                                  >
                                                    Title:{" "}
                                                    {!viewModalReqHallData
                                                      ? ""
                                                      : viewModalReqHallData.title}
                                                  </h5>
                                                  <p className=" ms-2 fw-light fst-italic">
                                                    -
                                                    {!viewModalReqHallData
                                                      ? ""
                                                      : viewModalReqHallData.hostedByName}
                                                  </p>
                                                </span>
                                                <button
                                                  type="button"
                                                  className="btn-close"
                                                  data-bs-dismiss="modal"
                                                  aria-label="Close"
                                                  // onClick={}
                                                ></button>
                                              </div>
                                            </div>
                                            <form>
                                              <div className="modal-body text-start">
                                                <div className="row mb-4">
                                                  <div className="col">
                                                    <div className="me-2 fw-bolder text-center">
                                                      <span>Hall Name</span>
                                                    </div>
                                                    <input
                                                      type="text"
                                                      id="hallName"
                                                      value={
                                                        conferenceHall.hallName
                                                      }
                                                      className="form-control text-center border-0 bg-light"
                                                      placeholder="hallName"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                  <div className="col">
                                                    <div className="me-2 fw-bolder text-center">
                                                      <span>Hall Email</span>
                                                    </div>
                                                    <input
                                                      type="text"
                                                      id="hallName"
                                                      value={
                                                        conferenceHall.hallEmail
                                                      }
                                                      className="form-control text-center border-0 bg-light"
                                                      placeholder="hallName"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                  <div className="col">
                                                    <div className="me-2 fw-bolder text-center">
                                                      <span>Priority</span>
                                                    </div>
                                                    <input
                                                      type="text"
                                                      id="priority"
                                                      value={
                                                        viewModalReqHallData.priority
                                                      }
                                                      className={`form-control text-center border-0 bg-light ${
                                                        viewModalReqHallData.priority ===
                                                        "High"
                                                          ? "text-danger"
                                                          : viewModalReqHallData.priority ===
                                                            "Medium"
                                                          ? "text-warning"
                                                          : viewModalReqHallData.priority ===
                                                            "Low"
                                                          ? "text-dark"
                                                          : "text-light"
                                                      }`}
                                                      placeholder="priority"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                {/* React Date picker */}
                                                <div className="col d-flex align-items-center mb-4 ">
                                                  {/* Date */}
                                                  <div className="d-flex flex-column align-items-center justify-content-center col-md-6 fs-5">
                                                    <div className="me-2 fw-bolder">
                                                      <span>Date</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                      <input
                                                        type="text"
                                                        id="From"
                                                        value={` ${moment(
                                                          viewModalReqHallData.date,
                                                          "YYYY-MM-DD"
                                                        ).format("MMM Do YY")}`}
                                                        className="form-control text-center border-0 bg-light"
                                                        placeholder="to"
                                                        readOnly
                                                      />
                                                    </div>
                                                  </div>
                                                  {/* Time */}
                                                  <div className="d-flex flex-column align-items-center justify-content-center  col-md-6">
                                                    <div className="mb-2 fs-5 fw-bolder">
                                                      <span>Time</span>
                                                    </div>
                                                    <div className="row">
                                                      <div className="col">
                                                        <input
                                                          type="text"
                                                          id="From"
                                                          value={`From  ${moment(
                                                            viewModalReqHallData.from,
                                                            "HH-mm-ss"
                                                          ).format("hh:mm A")}`}
                                                          className="form-control text-center border-0 bg-light"
                                                          placeholder="to"
                                                          readOnly
                                                        />
                                                      </div>
                                                      <div className="col">
                                                        <input
                                                          type="text"
                                                          id="From"
                                                          value={`To  ${moment(
                                                            viewModalReqHallData.to,
                                                            "HH-mm-ss"
                                                          ).format("hh:mm A")}`}
                                                          className="form-control text-center border-0 bg-light "
                                                          placeholder="to"
                                                          readOnly
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center mb-2 fs-5 fw-bolder">
                                                  <span className="me-3 ">
                                                    No of Candidates
                                                  </span>
                                                  <span>
                                                    {
                                                      viewModalReqHallData.noOfCandidates
                                                    }
                                                  </span>
                                                </div>
                                                <div className=" d-flex flex-row align-items-center justify-content-center mb-4 ">
                                                  <div className="col-md-5">
                                                    <select
                                                      className="form-select text-center "
                                                      size={
                                                        viewModalReqHallData.noOfCandidates
                                                      }
                                                      aria-label="size 3 select example"
                                                    >
                                                      {viewModalReqHallData.members &&
                                                        viewModalReqHallData.members.map(
                                                          (data, i) => {
                                                            return (
                                                              <option
                                                                value={
                                                                  data.memberName
                                                                }
                                                                key={i}
                                                                className="bg-light"
                                                              >
                                                                {
                                                                  data.memberName
                                                                }
                                                              </option>
                                                            );
                                                          }
                                                        )}
                                                    </select>
                                                  </div>
                                                </div>
                                                {/* Description */}
                                                <div className="d-flex flex-column mb-1">
                                                  <span className="mb-2 fs-5 fw-bolder d-flex justify-content-center">
                                                    Description
                                                  </span>
                                                  <div className="form-outline  mb-0">
                                                    <textarea
                                                      type="text"
                                                      id="description"
                                                      value={
                                                        viewModalReqHallData.description
                                                      }
                                                      className="form-control bg-light"
                                                      placeholder="Enter Meeting subject or Reason"
                                                      // onChange={handleModalChange}
                                                      required={true}
                                                      readOnly
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
                                                >
                                                  Close
                                                </button>
                                              </div>
                                            </form>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div></div>
                                <div>
                                  {data.isAccepted || data.isDeclined ? (
                                    ""
                                  ) : (
                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        cancelRequestedHall(data._id)
                                      }
                                      value={data._id}
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Viewschedules;
