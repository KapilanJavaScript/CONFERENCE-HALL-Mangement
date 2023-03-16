import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/adminComponents/AdminHeader";
import Spinner from "../../components/Spinner";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import { toast } from "react-toastify";

function Viewmore() {
  const { token } = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(true);
  const [conferenceHall, setConferenceHall] = useState(null);
  const [bookedHall, setBookedHall] = useState([]);
  const [selectOptions, setSelectOptions] = useState("");
  const [modalHallData, setmodalHallData] = useState(null);
  const [modalHallRequestData, setModalHallRequestData] = useState({
    date: [],
    noOfCandidatesRequest: "",
    membersRequest: [],
    dateRequest: "",
    titleRequest: "",
    descriptionRequest: "",
    priorityRequest: "",
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

  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    if (token == null) {
      navigate("/login");
    }

    if (!conferenceHall && !bookedHall.length > 0) {
      getHall(token);
      getBookedHall(token);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [token, isLoading, conferenceHall]);

  const getHall = async ({ token }) => {
    try {
      
      const id = params.id;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `/admin/conferencehall/gethall/${id}`,
        config
      );
      setConferenceHall(response.data);
    } catch (error) {
      toast.error(error.response.data.message)
      
    }
  };

  const getBookedHall = async ({ token }) => {
    try {
      
      const id = params.id;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `/users/conferencehall/viewbookhall/${id}`,
        config
      );
      setBookedHall(response.data.bookHallExists);
      // console.log(response.data.bookHallExists);
    } catch (error) {
      toast.error(error.response.data.message)
      
    }
  };
  // console.log(bookedHall);
  // console.log(conferenceHall);

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
      setSelectOptions(reactSelectOptions);
    } catch (error) {
      toast.error(error.response.data.message)
      // console.log("js.42 error", error);
    }
  };

  const handleRequestDateChange = (e) => {
    setModalHallRequestData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // React User Selected Option
  const handleRequestModalUserSelect = (e) => {
    if (e.length > 0) {
      setModalHallRequestData((prev) => ({
        ...prev,
        membersRequest: e,
        noOfCandidatesRequest: e.length,
      }));
    } else {
      setModalHallRequestData((prev) => ({
        ...prev,
        membersRequest: [],
        noOfCandidatesRequest: "",
      }));
    }
  };

  const handleRequestModalDropdownchange = (e) => {
    // console.log(e.target.value, "priority-----");
    setModalHallRequestData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const handleRequestModalChange = (e) => {
    // console.log(e)
    setModalHallRequestData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleRequestModalSubmit = async () => {
    // console.log( modalHallRequestData.dateRequest,"false")
    try {
      if (
        !modalHallRequestData.membersRequest ||
        !modalHallRequestData.noOfCandidatesRequest ||
        !modalHallRequestData.titleRequest ||
        !modalHallRequestData.descriptionRequest ||
        modalHallRequestData.priorityRequest === "" ||
        modalHallRequestData.priorityRequest === "false" ||
        modalHallRequestData.dateRequest === "false" ||
        modalHallRequestData.dateRequest === ""
      ) {
        return toast.warning("Please! Fill all the field");
      }
      const membersName = modalHallRequestData.membersRequest.map((e) => ({
        memberName: e.value,
        memberId: e.key,
      }));
      let mem = [
        ...membersName,
        { memberName: token.employeeName, memberId: token._id },
      ];
      const requestData = {
        hostedByName: token.employeeName,
        hostedById: token._id,
        noOfCandidates: mem.length,
        members: mem,
        title: modalHallRequestData.titleRequest,
        description: modalHallRequestData.descriptionRequest,
        priority: modalHallRequestData.priorityRequest,
        date: modalHallRequestData.dateRequest,
      };
      // console.log(requestData);
      const tokenId = token.token;
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.put(
        `/users/conferencehall/requesthall/${modalHallRequestData._id}`,
        requestData,
        config
      );
      if (response.status === 201 || 200) {
        toast.success("Hall Requested Successfully");
        setModalHallRequestData({
          ...modalHallRequestData,
          noOfCandidatesRequest: "",
          membersRequest: [],
          dateRequest: "false",
          titleRequest: "",
          descriptionRequest: "",
          priorityRequest: "",
        });
        document.getElementById("closeModal1").click();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // console.log(error.data.message);
      toast.error(error.response.data.message);
    }
  };
  // Book Hall
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
      // console.log("modalFormData", modalFormData);
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
      const GMTdate =
        date.length > 0
          ? date.map((ele) => String(`${moment(ele).format("YYYY-MM-DD")}`))
          : String(`${moment(date).format("YYYY-MM-DD")}`);
      const fromTime = `${from.hour}:${from.minute}`;
      const toTime = `${to.hour}:${to.minute}`;
      if (GMTdate.includes(moment(new Date()).format("YYYY-MM-DD"))) {
        if (
          new Date(`${moment(new Date()).format("YYYY-MM-DD")}, ${fromTime}`) <=
          new Date()
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
      const { _id } = conferenceHall;
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
        getBookedHall(token);
      }
    } catch (error) {
      // console.log(error);
      toast.warning(error.response.data.message);
    }
  };
  return (
    <>
      <AdminHeader />
      {isLoading && <Spinner />}
      <div className="container">
        {/* <div className="btn btn-light mt-3"><IoIosArrowBack/> Back</div> */}
        <div className="row mx-2 mt-5">
          <h1 className="col fs-3 fs-md-3 fs-sm-4">
            <span>
              <Link to="/" className="text-decoration-none">
                Dashboard
              </Link>
            </span>
            <span>{">"}viewmore</span>
          </h1>
          <div className=" d-flex justify-content-end">
            {/* <!-- Search --> */}
            {/* <div className="input-group-lg pe-4 pe-sm-2">
              <input
                type="text"
                placeholder="Search"
                className="form-control "
              />
            </div> */}
            {/* <!-- Modal --> */}
            <div className="">
              <button
                type="button"
                className="btn btn-primary btn-lg  d-flex align-items-center fs-sm-4"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                onClick={() => userOption()}
              >
                <span className="">Book Hall</span>
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
                        <h5 className="modal-title" id="staticBackdropLabel">
                          Book Hall
                        </h5>
                        <button
                          type="button"
                          className="btn-close d-flex justify-content-end "
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          id="closeModal"
                          onClick={() =>
                            setModalFormData({
                              noOfCandidates: "",
                              members: [],
                              date: new Date(),
                              title: "",
                              description: "",
                              priority: "",
                              from: "",
                              to: "",
                            })
                          }
                        ></button>
                      </div>
                    </div>
                    <form>
                      <div className="modal-body text-start">
                        {/* React Date picker */}
                        <div className="row row-cols-lg-3 row-cols-md-1 d-flex align-items-center mb-4">
                          {/* Date */}
                          <div className="d-flex align-items-center mb-2">
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
                              calendarPosition={`${"bottom"}-${"center"}`}
                              fixMainPosition={true}
                              fixRelativePosition={true}
                              render={<InputIcon />}
                              minDate={new Date()}
                              plugins={[<DatePanel sort="date" />]}
                              mapDays={({ date }) => {
                                let isWeekend = [0, 6].includes(
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
                              onChange={handleModalDataChange}
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
                                plugins={[<TimePicker hideSeconds />]}
                                onChange={handleModalTime1Change}
                              />
                            </div>
                            <div>
                              <DatePicker
                                disableDayPicker
                                placeholder="To"
                                containerClassName="custom-timecontainer"
                                format="hh:mm A"
                                value={modalFormData.to}
                                plugins={[<TimePicker hideSeconds />]}
                                onChange={handleModalTime2Change}
                              />
                            </div>
                          </div>
                          {/* Priority */}
                          <div className="  d-flex align-items-center  mb-2">
                            <span className="me-3">Priority</span>
                            <div className="form-outline ">
                              <select
                                className="form-select"
                                aria-label="Default select example"
                                placeholder="Select Priority"
                                id="priority"
                                onChange={handleModalDropdownchange}
                                value={modalFormData.priority}
                              >
                                <option label="Select Priority" value={false}>
                                  Select Priority
                                </option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row row-cols-lg-2 row-cols-md-1 row-cols-sm-1 d-flex flex-row align-items-center mb-4">
                          {/* member */}
                          <div className="col d-flex align-items-center col-md-7 me-lg-5 mb-2">
                            <span className="me-4">Members</span>
                            <div className="col-md-10 ">
                              <Select
                                // defaultValue={[Data[2], Data[3]]}
                                isMulti
                                value={modalFormData.members}
                                placeholder="Select candidate for meeting"
                                name="admin"
                                options={selectOptions}
                                className="basic-single "
                                classNamePrefix="select"
                                isClearable={true}
                                onChange={handleModalUserSelect}
                              />
                            </div>
                          </div>
                          {/* NO of Candidates */}
                          <div className=" col-md-3 col-sm-5">
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
                          <span className="me-lg-5 me-md-4">Title</span>
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
                          <span className="me-lg-2 me-md-2">Description</span>
                          <div className="form-outline flex-fill mb-0">
                            <textarea
                              type="textarea"
                              id="description"
                              value={modalFormData.description}
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
                              date: new Date(),
                              title: "",
                              description: "",
                              priority: "",
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

          <form>
            <div className="modal-body text-start">
              <div className="row mb-4 d-flex justify-content-center">
                <div className="card col-lg-5 border border-dark shadow">
                  <div className="card-body ">
                    <span className="card-text d-flex justify-content-start">
                      <span>Hall_Name :</span>
                      <span className="ms-2">
                        {!conferenceHall ? "" : conferenceHall.hallName}
                      </span>
                    </span>
                    <span className="card-text d-flex justify-content-start">
                      <span>Hall_Email :</span>
                      <span className="ms-2">
                        {!conferenceHall ? "" : conferenceHall.hallEmail}
                      </span>
                    </span>
                    <span className="card-text d-flex justify-content-start">
                      <span>Hall_Locaiton : </span>
                      <span className="ms-2">
                        {!conferenceHall ? "" : conferenceHall.hallLocation}
                      </span>
                    </span>
                    <span className="card-text d-flex justify-content-start">
                      <span>Hall_Capacity : </span>
                      <span className="ms-2">
                        {!conferenceHall ? "" : conferenceHall.hallCapacity}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              {/* Table */}
              {bookedHall.length > 0 ? (
                <div className="table-responsive-md">
                  <table className="table table-striped table-bordered table-hover my-5 text-center">
                    <thead>
                      <tr>
                        <th scope="col">BookedBy</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookedHall.map((data, i) => {
                        return (
                          <React.Fragment key={data._id}>
                            <tr>
                              <td>{data.hostedByName}</td>
                              <td
                                className={`${
                                  data.priority === "High"
                                    ? "text-danger"
                                    : data.priority === "Medium"
                                    ? "text-warning"
                                    : data.priority === "Low"
                                    ? "text-dark"
                                    : "text-light"
                                }`}
                              >
                                {data.priority}
                              </td>
                              <td className="">
                                <div className="ms-2 overflow-date2">
                                  {data.date.length > 0 &&
                                    data.date.map((ele, i) => {
                                      return (
                                        <React.Fragment key={i}>
                                          <span>
                                            {moment(ele, "YYYY-MM-DD").format(
                                              "MMM Do YY"
                                            )}
                                            {/* {moment(ele).format("YYYY-MM-DD")} */}
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
                                    {moment(data.to, "HH-mm-ss").format(
                                      "hh:mm A"
                                    )}
                                  </span>
                                </div>
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
                                        onClick={() => setmodalHallData(data)}
                                      >
                                        <span className="">view</span>
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
                                          {!modalHallData ? (
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
                                                      {" "}
                                                      Title:{" "}
                                                      {!modalHallData
                                                        ? ""
                                                        : modalHallData.title}
                                                    </h5>
                                                    <p className=" ms-2 fw-light fst-italic">
                                                      -
                                                      {!modalHallData
                                                        ? ""
                                                        : modalHallData.hostedByName}
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
                                                        modalHallData.priority
                                                      }
                                                      className={`form-control text-center border-0 bg-light ${
                                                        modalHallData.priority ===
                                                        "High"
                                                          ? "text-danger"
                                                          : modalHallData.priority ===
                                                            "Medium"
                                                          ? "text-warning"
                                                          : modalHallData.priority ===
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
                                                          modalHallData.date
                                                            .length > 3
                                                            ? 4
                                                            : modalHallData.date
                                                                .length
                                                        }
                                                        aria-label="size 3 select example"
                                                      >
                                                        {modalHallData.date.map(
                                                          (data, i) => {
                                                            return (
                                                              <option
                                                                value={moment(
                                                                  data
                                                                )
                                                                  .utc()
                                                                  .format(
                                                                    "YYYY-MM-DD"
                                                                  )}
                                                                key={i}
                                                              >
                                                                {moment(data)
                                                                  .utc()
                                                                  .format(
                                                                    "YYYY-MM-DD"
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
                                                            modalHallData.from,
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
                                                            modalHallData.to,
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
                                                    value={modalHallData.priority}
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
                                                      modalHallData.noOfCandidates
                                                    }
                                                  </span>
                                                </div>
                                                <div className=" d-flex flex-row align-items-center justify-content-center mb-4 ">
                                                  <div className="col-md-5">
                                                    <select
                                                      className="form-select text-center "
                                                      size={
                                                        modalHallData.members
                                                          .length
                                                      }
                                                      aria-label="size 3 select example"
                                                    >
                                                      {modalHallData.members.map(
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
                                                        modalHallData.description
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
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {data.hostedById !== token._id && (
                                    <div>
                                      <button
                                        type="button"
                                        className="btn btn-danger d-flex align-items-center fs-sm-4"
                                        data-bs-toggle="modal"
                                        data-bs-target="#RequestModal"
                                        onClick={() => [
                                          setModalHallRequestData({
                                            ...data,
                                            noOfCandidatesRequest: "",
                                            membersRequest: [],
                                            dateRequest: "",
                                            titleRequest: "",
                                            descriptionRequest: "",
                                            priorityRequest: "",
                                          }),
                                          userOption(),
                                        ]}
                                      >
                                        <span className="">Request</span>
                                      </button>

                                      <div
                                        className="modal fade"
                                        id="RequestModal"
                                        data-bs-backdrop="static"
                                        data-bs-keyboard="false"
                                        tabIndex="-1"
                                        aria-labelledby="RequestModalLabel"
                                        aria-hidden="true"
                                      >
                                        <div className="modal-dialog modal-lg modal-dialog-centered">
                                          <div className="modal-content">
                                            <div className="border">
                                              <div className="modal-header">
                                                <h5
                                                  className="modal-title"
                                                  id="RequestModalLabel"
                                                >
                                                  Request Hall
                                                </h5>
                                                <button
                                                  type="button"
                                                  className="btn-close d-flex justify-content-end"
                                                  data-bs-dismiss="modal"
                                                  aria-label="Close"
                                                  onClick={() =>
                                                    setModalHallRequestData({
                                                      ...modalHallRequestData,
                                                      noOfCandidatesRequest: "",
                                                      membersRequest: [],
                                                      dateRequest:
                                                        "select a date",
                                                      titleRequest: "",
                                                      descriptionRequest: "",
                                                      priorityRequest: "",
                                                    })
                                                  }
                                                ></button>
                                              </div>
                                            </div>
                                            <div>
                                              <div className="modal-body text-start">
                                                <div className=" d-flex align-items-center mb-4">
                                                  <div className="row row-cols-lg-2 row-cols-sm-1 d-flex align-items-center">
                                                    {/* Time */}
                                                    <div className=" d-flex align-items-center mb-3">
                                                      <div className=" me-2">
                                                        <input
                                                          type="text"
                                                          id="From"
                                                          value={`From  ${moment(
                                                            modalHallRequestData.from,
                                                            "HH-mm-ss"
                                                          ).format("hh:mm A")}`}
                                                          className="form-control text-center"
                                                          placeholder="to"
                                                          readOnly
                                                        />
                                                      </div>
                                                      <div>
                                                        <input
                                                          type="text"
                                                          id="From"
                                                          value={`To  ${moment(
                                                            modalHallRequestData.to,
                                                            "HH-mm-ss"
                                                          ).format("hh:mm A")}`}
                                                          className="form-control text-center"
                                                          placeholder="to"
                                                          readOnly
                                                        />
                                                      </div>
                                                    </div>
                                                    <div className=" d-flex align-items-center">
                                                      {/* Date */}
                                                      <div className=" d-flex align-items-center  mb-2 me-2">
                                                        <div className="me-3">
                                                          <span>Date</span>
                                                        </div>
                                                        <div className="form-outline ">
                                                          <select
                                                            className="form-select"
                                                            aria-label="Default select example"
                                                            placeholder="Date"
                                                            id="dateRequest"
                                                            onChange={
                                                              handleRequestDateChange
                                                            }
                                                            value={
                                                              modalHallRequestData.dateRequest
                                                            }
                                                          >
                                                            <option
                                                              label={
                                                                "select a date"
                                                              }
                                                              value="false"
                                                            >
                                                              select a date
                                                            </option>
                                                            {modalHallRequestData
                                                              .date.length >
                                                              0 &&
                                                              modalHallRequestData.date.map(
                                                                (ele, i) => {
                                                                  // console.log(ele);
                                                                  return (
                                                                    <React.Fragment
                                                                      key={i}
                                                                    >
                                                                      <option
                                                                        value={moment(
                                                                          ele
                                                                        ).format(
                                                                          "YYYY-MM-DD"
                                                                        )}
                                                                      >
                                                                        {moment(
                                                                          ele
                                                                        ).format(
                                                                          "YYYY-MM-DD"
                                                                        )}
                                                                      </option>
                                                                    </React.Fragment>
                                                                  );
                                                                }
                                                              )}
                                                          </select>
                                                        </div>
                                                      </div>

                                                      {/* Priority */}
                                                      <div className="  d-flex align-items-center  mb-2">
                                                        <span className="me-3">
                                                          Priority
                                                        </span>
                                                        <div className="form-outline ">
                                                          <select
                                                            className="form-select"
                                                            aria-label="Default select example"
                                                            placeholder="Select Priority"
                                                            id="priorityRequest"
                                                            value={
                                                              modalHallRequestData.priorityRequest
                                                            }
                                                            onChange={
                                                              handleRequestModalDropdownchange
                                                            }
                                                          >
                                                            <option
                                                              label="Select Priority"
                                                              value={"false"}
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
                                                        value={
                                                          modalHallRequestData.membersRequest
                                                        }
                                                        placeholder="Select candidate for meeting"
                                                        name="admin"
                                                        options={selectOptions}
                                                        className="basic-single "
                                                        classNamePrefix="select"
                                                        isClearable={true}
                                                        onChange={
                                                          handleRequestModalUserSelect
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
                                                          modalHallRequestData.noOfCandidatesRequest
                                                            ? modalHallRequestData.noOfCandidatesRequest
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
                                                  <span className="me-lg-5 me-md-4 me-2">
                                                    Title
                                                  </span>
                                                  <div className="form-outline flex-fill ms-lg-2">
                                                    <input
                                                      type="text"
                                                      id="titleRequest"
                                                      value={
                                                        modalHallRequestData.titleRequest
                                                      }
                                                      className="form-control"
                                                      placeholder="Enter Meeting Title"
                                                      onChange={
                                                        handleRequestModalChange
                                                      }
                                                      required={true}
                                                    />
                                                  </div>
                                                </div>
                                                {/* Description */}
                                                <div className="d-flex flex-row mb-1">
                                                  <span className="me-2">
                                                    Description
                                                  </span>
                                                  <div className="form-outline flex-fill mb-0">
                                                    <textarea
                                                      type="textarea"
                                                      id="descriptionRequest"
                                                      value={
                                                        modalHallRequestData.descriptionRequest
                                                      }
                                                      className="form-control"
                                                      placeholder="Enter Meeting subject or Reason"
                                                      onChange={
                                                        handleRequestModalChange
                                                      }
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
                                                  id="closeModal1"
                                                  onClick={() =>
                                                    setModalHallRequestData({
                                                      ...modalHallRequestData,
                                                      noOfCandidatesRequest: "",
                                                      membersRequest: [],
                                                      dateRequest: "false",
                                                      titleRequest: "",
                                                      descriptionRequest: "",
                                                      priorityRequest: "",
                                                    })
                                                  }
                                                >
                                                  Close
                                                </button>
                                                <button
                                                  type="button"
                                                  className="btn btn-success"
                                                  onClick={
                                                    handleRequestModalSubmit
                                                  }
                                                >
                                                  Request Hall
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
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
                  <div className="mt-5 d-flex flex-column justify-content-center align-items-center">
                    <h3>Not yet scheduled!</h3>
                    <h1 className="text-warning">Book Now!</h1>
                  </div>
                </>
              )}
              {/* Form under table */}
              {/* <div>
                {" "}
                React Date picker
                <div className="col d-flex align-items-center mb-4">
                  Date
                  <div className="d-flex align-items-center  col-md-5">
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
                      calendarPosition={`${"bottom"}-${"center"}`}
                      fixMainPosition={true}
                      fixRelativePosition={true}
                      render={<InputIcon />}
                      plugins={[<DatePanel sort="date" />]}
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
                      // // value={modalFormData.date}
                      // onchange={handleModalDataChange}
                    />
                  </div>
                  Time
                  <div className="d-flex align-items-center mx-2">
                    <div className="me-2">
                      <span>Time</span>
                    </div>
                    <div className=" me-2">
                      <DatePicker
                        disableDayPicker
                        placeholder="From"
                        containerClassName="custom-timecontainer"
                        format="hh:mm A"
                        // value={searchForm.from}
                        plugins={[<TimePicker hideSeconds />]}
                        // onChange={
                        //   handleModalTime1Change
                        // }
                      />
                    </div>
                    <div>
                      <DatePicker
                        disableDayPicker
                        placeholder="To"
                        containerClassName="custom-timecontainer"
                        format="hh:mm A"
                        // value={searchForm.to}
                        plugins={[<TimePicker hideSeconds />]}
                        // onChange={
                        //   handleModalTime2Change
                        // }
                      />
                    </div>
                  </div>
                  Priority
                  <div className=" col d-flex align-items-center justify-content-center ">
                    <span className="me-3">Priority</span>
                    <div className="form-outline ">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        placeholder="Select Priority"
                        id="priority"
                        // onChange={
                        //   handleModalDropdownchange
                        // }
                      >
                        <option
                          label="Select Priority"
                          // value={false}
                        >
                          Select Priority
                        </option>
                        <option
                        // value="high"
                        >
                          High
                        </option>
                        <option
                        // value="medium"
                        >
                          Medium
                        </option>
                        <option
                        // value="low"
                        >
                          Low
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col d-flex flex-row align-items-center mb-4">
                  member
                  <div className="col d-flex align-items-center col-md-7 me-5">
                    <span className="me-4">Members</span>
                    <div className="col-md-10 ">
                      <Select
                        // defaultValue={[Data[2], Data[3]]}
                        isMulti
                        // value={modalFormData.members}
                        placeholder="Select candidate for meeting"
                        name="admin"
                        // options={selectOptions}
                        className="basic-single "
                        classNamePrefix="select"
                        isClearable={true}
                        // onChange={handleModalUserSelect}
                      />
                    </div>
                  </div>
                  NO of Candidates
                  <div className="col col-md-3">
                    <div className="form-outline flex-fill">
                      <input
                        type="number"
                        id="noOfCandidates"
                        // value={
                        //   modalFormData.noOfCandidates
                        //     ? modalFormData.noOfCandidates
                        //     : ""
                        // }
                        className="form-control"
                        placeholder="No. Of Candidates"
                        disabled={true}
                        required={true}
                      />
                    </div>
                  </div>
                </div>
                Title
                <div className="d-flex flex-row align-items-center mb-4">
                  <span className="me-lg-5 me-md-4">Title</span>
                  <div className="form-outline flex-fill ms-lg-2">
                    <input
                      type="text"
                      id="title"
                      // value={modalFormData.title}
                      className="form-control"
                      placeholder="Enter Meeting Title"
                      // onChange={handleModalChange}
                      required={true}
                    />
                  </div>
                </div>
                Description
                <div className="d-flex flex-row mb-1">
                  <span className="me-lg-2 me-md-2">Description</span>
                  <div className="form-outline flex-fill mb-0">
                    <textarea
                      type="textarea"
                      id="description"
                      // value={modalFormData.description}
                      className="form-control"
                      placeholder="Enter Meeting subject or Reason"
                      // onChange={handleModalChange}
                      // required={true}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-success"
                    // onClick={handleModalSubmit}
                  >
                    Book Hall
                  </button>
                </div>
              </div> */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Viewmore;
