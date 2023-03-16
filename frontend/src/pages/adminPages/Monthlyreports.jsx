import Spinner from "../../components/Spinner";
import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/adminComponents/AdminHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import DatePicker from "react-multi-date-picker";
import moment from "moment";
import InputIcon from "react-multi-date-picker/components/input_icon";

function Monthlyreports() {
  const { token } = useSelector((state) => state);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedHalls, setBookedHalls] = useState([]);
  const [bookedHallsReports, setBookedHallsReports] = useState({
    hallCount: [],
    hostedByCount: [],
  });
  const [searchDate, setSearchDate] = useState(new Date());
  const [datePicker, setDatePicker] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && !token?.isAdmin) {
      navigate("/");
    }
    if (
      bookedHallsReports.hallCount.length === 0 ||
      bookedHallsReports.hostedByCount.length === 0
    ) {
      setIsLoading(false);
    }
    if (!user) {
      userData(token);
    }
    getbookedHallsReports(token);
    // eslint-disable-next-line
  }, [searchDate, user]);

  const userData = async ({ token }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`/users/getuser`, config);
      // console.log("----------", response.data);
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getbookedHallsReports = async ({ token }) => {
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `/admin/conferencehall/viewallbookhalls/${searchDate}`,
        config
      );
      // console.log(response);
      if (response.status === 200 || 201) {
        setIsLoading(false);
        setBookedHalls((prev) => ({
          ...prev,
          bookedHalls: response.data.bookHall,
          conferenceHalls: response.data.conferenceHall,
        }));
        tableData(response.data.bookHall);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const handleSearchDate = (e) => {
    const date = `${e.year}-${e.month.name}`;
    setDatePicker(e);
    setSearchDate(date);
  };

  const tableData = (bookHall) => {
    let noOfMeeting = {};
    let noOfMeestingsHosted = {};
    let hallCount = [];
    let hostedByCount = [];

    bookHall.forEach((ele) => {
      noOfMeeting[ele.hallId] = [];
      const hallId = Object.keys(noOfMeeting);
      hallId.forEach((datae) => {
        hallCount[datae] = bookHall.filter((data) => data.hallId === datae);
      });
    });
    bookHall.forEach((ele) => {
      noOfMeestingsHosted[ele.hostedById] = [];
      const hostedById = Object.keys(noOfMeestingsHosted);
      hostedById.forEach((datae) => {
        hostedByCount[datae] = bookHall.filter(
          (data) => data.hostedById === datae
        );
      });
    });
    setBookedHallsReports((prev) => ({
      ...prev,
      hallCount,
      hostedByCount,
    }));
  };
  const findingHallNames = (data) => {
    const HallName = bookedHalls.conferenceHalls.filter(
      (ele) => ele._id === data
    );
    let result = {
      name: HallName[0].hallName,
      number: HallName[0].hallNumber,
    };
    return result;
  };

  return (
    <>
      <AdminHeader />
      {isLoading && <Spinner />}

      <div className="container">
        <div className="row mx-2 mt-5">
          <div>
            <h1 className="col fs-2 fs-md-3 fs-sm-4 mb-4">Monthly Reports</h1>
            <div className="col-lg-3 col-md-3">
              <DatePicker
                containerClassName="custom-container"
                placeholder="Select a Month"
                onlyMonthPicker
                disableYearPicker
                render={<InputIcon />}
                maxDate={new Date(new Date().getFullYear() + 1, 11)}
                format="MMMM YYYY"
                value={datePicker}
                onChange={handleSearchDate}
              />
            </div>
          </div>
          {bookedHalls.bookedHalls?.length > 0 ? (
            <div>
              <div className="row">
                <div className="col">
                  <div className="table-responsive-md ">
                    <table className="table table-striped table-bordered table-hover mt-3 text-center">
                      <thead>
                        <tr>
                          <th scope="col">Hall Number</th>
                          <th scope="col">Hall Name</th>
                          <th scope="col">No. Of Meetings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(bookedHallsReports.hallCount).length > 0 &&
                          Object.keys(bookedHallsReports.hallCount).map(
                            (data) => {
                              let hall = findingHallNames(data);
                              return (
                                <React.Fragment key={data}>
                                  <tr>
                                    <td>{hall.number}</td>
                                    <td>{hall.name}</td>
                                    <td>
                                      {
                                        bookedHallsReports.hallCount[data]
                                          .length
                                      }
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            }
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col">
                  <div className="table-responsive-md">
                    <table className="table table-striped table-bordered table-hover mt-3 text-center">
                      <thead>
                        <tr>
                          <th scope="col">HostedBy</th>
                          <th scope="col">No. Of Meetings</th>
                          {/* <th scope="col">Hall Name</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(bookedHallsReports?.hostedByCount).length >
                          0 &&
                          Object.keys(bookedHallsReports?.hostedByCount).map(
                            (data) => {
                              const hostBy = user?.find(
                                (id) => id._id === data
                              );
                              return (
                                <React.Fragment key={data}>
                                  <tr>
                                    <td>
                                      <div id="headingOne">
                                        <a
                                          // className="btn btn-primary"
                                          data-bs-toggle="collapse"
                                          href={`#collapseExample${data}`}
                                          role="button"
                                          aria-expanded="false"
                                          aria-controls="collapseExample"
                                        >
                                          {hostBy?.employeeName}
                                        </a>
                                      </div>
                                    </td>
                                    <td>
                                      {
                                        bookedHallsReports.hostedByCount[data]
                                          .length
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan="6" className="p-0  ">
                                      <div
                                        className="collapse "
                                        id={`collapseExample${data}`}
                                      >
                                        <div className="card card-body">
                                          {bookedHallsReports.hostedByCount[
                                            data
                                          ].map((ele) => {
                                            let hallName = [];
                                            bookedHalls.conferenceHalls.filter(
                                              (dataHall) =>
                                                dataHall._id === ele.hallId &&
                                                hallName.push(dataHall.hallName)
                                            );
                                            return (
                                              <div key={ele._id}>
                                                <div className="card mb-2 ">
                                                  <div className="card-body">
                                                    <h5 className="card-title">
                                                      Title: {ele.title}
                                                    </h5>
                                                    <h6 className="card-subtitle mb-2 text-muted row">
                                                      <div className="col text-end">
                                                        Priority: {ele.priority}
                                                      </div>
                                                      <div className="col text-start">
                                                        HallName : {hallName[0]}
                                                      </div>
                                                    </h6>
                                                    <span className="fw-bold d-flex justify-content-center border-bottom">
                                                      Meeting Description:
                                                    </span>
                                                    <p
                                                      className="card-text overflow-hidden"
                                                      style={{ height: "8vh" }}
                                                    >
                                                      {ele.description}
                                                    </p>
                                                    <div>
                                                      <span className="card-link">
                                                        <span className="me-1 fw-bold">
                                                          Date:
                                                        </span>
                                                        {ele.date.map(
                                                          (date) => {
                                                            // console.log(
                                                            //   date,
                                                            //   moment(
                                                            //     date
                                                            //   ).format(
                                                            //     "MMM Do YY"
                                                            //   )
                                                            // );
                                                            return (
                                                              <span
                                                                className="me-1"
                                                                key={date}
                                                              >
                                                                {moment(
                                                                  date
                                                                ).format(
                                                                  "MMM Do YY"
                                                                )}{" "}
                                                              </span>
                                                            );
                                                          }
                                                        )}
                                                      </span>
                                                      <span className="card-link">
                                                        <div>
                                                          <span className="me-2">
                                                            <span className="fw-bold">
                                                              From{" "}
                                                            </span>
                                                            {moment(
                                                              ele.from,
                                                              "HH-mm-ss"
                                                            ).format("hh:mm A")}
                                                          </span>
                                                          <span className="">
                                                            <span className="fw-bold">
                                                              To{" "}
                                                            </span>
                                                            {moment(
                                                              ele.to,
                                                              "HH-mm-ss"
                                                            ).format("hh:mm A")}
                                                          </span>
                                                        </div>
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            }
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 ">
                <h3 className="mt-5  d-flex  justify-content-center">
                  No Schedules Booked on
                  <span>
                    ,{moment(searchDate, "YYYY-MM-DD").format("MMMM-YYYY")}
                  </span>
                </h3>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Monthlyreports;
