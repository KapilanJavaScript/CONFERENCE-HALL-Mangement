import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../../components/adminComponents/AdminHeader";
import Spinner from "../../components/Spinner";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function Mangehall() {
  const { token } = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(true);
  const [locationOptions, setLocationOptions] = useState(null);
  const [selectedlocation, setSelectedlocation] = useState("");
  // const [tableData, setTableData] = useState([]);
  const [conferenceHallTable, setConferenceHallTable] = useState([]);
  const [conferenceHall, setConferenceHall] = useState({
    _id: "",
    hallNumber: "",
    hallName: "",
    hallCapacity: "",
    hallEmail: "",
    hallLocation: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (token === null) {
      return navigate("/login");
    }
    if (!locationOptions) {
      userData(token);
      locationData();
      getConferenceHall(token);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [token, isLoading, conferenceHallTable, locationOptions]);

  const userData = async (token) => {
    try {
      const tokenId = token.token;
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.get(`/users/me`, config);
      // console.log("----------", response.data);
      if (!response.data.isAdmin) {
        toast.warning("Unauthorized");
        return navigate("/");
      }
    } catch (err) {
      console.log(err.response.message);
    }
  };

  const getConferenceHall = async ({ token }) => {
    // console.log(token);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get("/admin/conferencehall/gethall", config);
    // console.log(response);
    setConferenceHallTable(response.data);
  };

  const locationData = async () => {
    try {
      const response = await axios.get("/admin/location/getlocation");
      const Location = response.data.map((data) => {
        return { key: data._id, value: data.location, label: data.location };
      });
      setLocationOptions(Location);
    } catch (error) {
      console.log(error);
    }
  };

  const handlelocation = (e) => {
    setSelectedlocation({ hallLocation: e.value });
  };

  const handleChange = (e) => {
    setConferenceHall((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const { hallNumber, hallName, hallCapacity, hallEmail } = conferenceHall;
    const { hallLocation } = selectedlocation;
    if (
      !hallNumber ||
      !hallName ||
      !hallCapacity ||
      !hallEmail ||
      !hallLocation
    ) {
      return toast.error("Please Fill all the field");
    }

    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!re.test(hallEmail)) {
      return toast.error("enter valid email id");
    }
    const submittedData = {
      hallNumber,
      hallName,
      hallCapacity,
      hallEmail,
      hallLocation,
    };
    console.log(submittedData);
    const tokenId = token.token;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.put(
        "/admin/conferencehall/addhall",
        submittedData,
        config
      );
      console.log(response);
      if (response.status === 201) {
        getConferenceHall(token);
        setConferenceHall({
          hallNumber: "",
          hallName: "",
          hallCapacity: "",
          hallEmail: "",
          hallLocation: "",
        });
        setSelectedlocation("");
      }
      toast.success(response.data.message);
      document.getElementById("closeModal").click();
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 400) {
        return toast.warning(error.response.data.error);
      }
    }
  };

  const deleteHall = async (e) => {
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
          console.log(e.target.value);
          const tokenId = token.token;
          const id = e.target.value;
          const config = {
            headers: {
              Authorization: `Bearer ${tokenId}`,
            },
          };
          const response = await axios.put(
            `/admin/conferencehall/deletehall/${id}`,
            "_",
            config
          );
          const conferenceHall = conferenceHallTable.filter(
            (data) => data._id !== id
          );
          setConferenceHallTable(conferenceHall);
          if (response.status === 201 || 200) {
            toast.success(response.data.message);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
    // try {
    //   console.log(e.target.value);
    //   const tokenId = token.token;
    //   const id = e.target.value;
    //   const config = {
    //     headers: {
    //       Authorization: `Bearer ${tokenId}`,
    //     },
    //   };
    //   const response = await axios.put(
    //     `/admin/conferencehall/deletehall/${id}`,
    //     "_",
    //     config
    //   );
    //   const conferenceHall = conferenceHallTable.filter(
    //     (data) => data._id !== id
    //   );
    //   setConferenceHallTable(conferenceHall);
    // } catch (error) {
    //   console.log(error)
    // }
  };

  const updateHall = async (e) => {
    const { hallNumber, hallName, hallCapacity, hallEmail, _id } =
      conferenceHall;
    const { hallLocation } = selectedlocation;
    if (
      !_id ||
      !hallNumber ||
      !hallName ||
      !hallCapacity ||
      !hallEmail ||
      !hallLocation
    ) {
      return toast.error("Please Fill all the field");
    }

    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!re.test(hallEmail)) {
      return toast.error("enter valid email id");
    }
    const submittedData = {
      hallNumber,
      hallName,
      hallCapacity,
      hallEmail,
      hallLocation,
    };

    const id = _id;
    const tokenId = token.token;
    // console.log(id,submittedData,tokenId)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      };
      const response = await axios.put(
        `/admin/conferencehall/updatehall/${id}`,
        submittedData,
        config
      );
      // console.log(response);
      if (response.status === 201) {
        getConferenceHall(token);
      }
      toast.success("Hall Updated Successfully");
      document.getElementById("closeUpdateModal").click();
    } catch (error) {
      if (error.response.status === 400) {
        return toast.warning(error.response.data.error);
      }
      console.log(error.response.status);
      if (error.response.status === 401) {
        toast.warning(error.response.data.message);
        document.getElementById("closeUpdateModal").click();
        return navigate("/");
      }
    }
  };

  return (
    <>
      <AdminHeader />
      {isLoading && <Spinner />}

      <div className="container">
        {/* <div className="btn btn-light mt-3"><IoIosArrowBack/> Back</div> */}
        <div className="row mx-2 mt-5">
          <h1 className="col fs-1 fs-md-3 fs-sm-4">Mange Hall</h1>
          {}
          <div className="col d-flex justify-content-end">
            <>
              {/* <!-- Search --> */}
              {/* <div className="input-group-lg pe-4 pe-sm-2">
              <input
                type="text"
                placeholder="Search"
                className="form-control "
              />
            </div> */}
            </>

            {/* <!-- Modal --> */}
            <div className="">
              <button
                type="button"
                className="btn btn-primary btn-lg rounded-pill d-flex align-items-center fs-sm-4"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                onClick={() => {
                  setConferenceHall({
                    hallNumber: "",
                    hallName: "",
                    hallCapacity: "",
                    hallEmail: "",
                    hallLocation: "",
                  });
                  setSelectedlocation("");
                }}
              >
                <span className=" pe-2">+</span>
                <span className="pe-1">Add</span>
                <span className="">Hall</span>
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
                <div className="modal-dialog modal-lg"
                  style={{ "marginTop": "10vh" }}
                  >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="staticBackdropLabel">
                        Add Hall
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => {
                          setConferenceHall({
                            hallNumber: "",
                            hallName: "",
                            hallCapacity: "",
                            hallEmail: "",
                            hallLocation: "",
                          });
                          setSelectedlocation("");
                        }}
                      ></button>
                    </div>
                    <form>
                      <div className="modal-body text-start">
                        <div className="row gy-2 d-flex flex-row align-items-center mb-4">
                          <div className=" col-auto d-flex align-items-center">
                            <span className="me-3">Hall Number</span>
                            <div className="form-outline ">
                              <input
                                type="number"
                                id="hallNumber"
                                value={conferenceHall.hallNumber}
                                className="form-control"
                                placeholder="Enter Hall Number"
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-auto d-flex flex-row align-items-center">
                            <span className="me-3 ">Hall_Name</span>
                            <div className=" form-outline ">
                              <input
                                type="text"
                                id="hallName"
                                value={conferenceHall.hallName}
                                className="form-control"
                                placeholder="Enter Hall Name"
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <span className="me-2">Hall Mail_Id</span>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="email"
                              id="hallEmail"
                              value={conferenceHall.hallEmail}
                              className="form-control"
                              placeholder="Enter Hall Mail Id"
                              onChange={handleChange}
                              required={true}
                            />
                          </div>
                        </div>
                        <div className=" row  gy-2 d-flex flex-row align-items-center mb-2 ">
                          <div className=" col-auto d-flex align-items-center ">
                            <span className="me-3">Hall Capacity</span>
                            <div className="form-outline  ">
                              <input
                                type="number"
                                id="hallCapacity"
                                value={conferenceHall.hallCapacity}
                                className="form-control"
                                placeholder="Enter Hall Capacity"
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          {/* <div className="d-flex flex-row align-items-center mb-2"> */}
                          <div className=" col-auto d-flex align-items-center ">
                            <span className="me-3 col-5">Hall location</span>
                            <div className=" col-8">
                              <Select
                                placeholder="Select Location"
                                name="colors"
                                id="hallLocation"
                                value={
                                  selectedlocation === ""
                                    ? ""
                                    : {
                                        key: selectedlocation.hallLocation,
                                        value: selectedlocation.hallLocation,
                                        label: selectedlocation.hallLocation,
                                      }
                                }
                                options={locationOptions}
                                className="basic-single "
                                classNamePrefix="select"
                                onChange={handlelocation}
                                required
                              />
                            </div>
                          </div>
                          {/* </div> */}
                        </div>
                      </div>

                      {/* Review Table Button*/}
                      {/* <div className=" d-flex justify-content-end mb-4 mx-3">
                        <button
                          type="button"
                          className="btn btn-danger rounded-pill"
                          onClick={handleSubmitTab}
                          disabled={tableData.length < 4 ? false : true}
                        >
                          + add
                        </button>
                      </div> */}
                      {/* Review Table */}
                      {/* <div>
                        {tableData.length > 0 && (
                          <div className="mx-3">
                            <table className="table table-striped table-bordered table-hover text-center">
                              <thead>
                                <tr>
                                  <th scope="col">hallNumber</th>
                                  <th scope="col">hallName</th>
                                  <th scope="col">hallCapacity</th>
                                  <th scope="col">hallEmail</th>
                                  <th scope="col">hallLocation</th>
                                  <th scope="col"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {tableData.map((data, i) => {
                                  return (
                                    <React.Fragment key={i}>
                                      <tr>
                                        <td>{data.hallNumber}</td>
                                        <td>{data.hallName}</td>
                                        <td>{data.hallCapacity}</td>
                                        <td>{data.hallEmail}</td>
                                        <td>{data.hallLocation}</td>
                                        <td>
                                          <div>
                                            <button
                                              className="btn btn-close"
                                              onClick={deleteTabData}
                                              value={data.hallEmail}
                                            ></button>
                                          </div>
                                        </td>
                                      </tr>
                                    </React.Fragment>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div> */}

                      <div className="modal-footer d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-danger"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          id="closeModal"
                          onClick={() => {
                            setConferenceHall({
                              hallNumber: "",
                              hallName: "",
                              hallCapacity: "",
                              hallEmail: "",
                              hallLocation: "",
                            });
                            setSelectedlocation("");
                          }}
                        >
                          {" "}
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Table */}
          {conferenceHallTable.length > 0 ? (
            <div className="table-responsive-md">
              <table className="table table-striped table-bordered table-hover mt-5 text-center">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">HallNumber</th>
                    <th scope="col">HallName</th>
                    <th scope="col">HallCapacity</th>
                    <th scope="col">HallEmail</th>
                    <th scope="col">HallLocation</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {conferenceHallTable.map((data, i) => {
                    return (
                      <React.Fragment key={data._id}>
                        <tr>
                          <th scope="row">{i + 1}</th>
                          <td>{data.hallNumber}</td>
                          <td>{data.hallName}</td>
                          <td>{data.hallCapacity}</td>
                          <td>{data.hallEmail}</td>
                          <td>{data.hallLocation}</td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              {/* <!-- Modal --> */}
                              <button
                                type="button"
                                className="btn btn-warning d-flex align-items-center me-2 "
                                data-bs-toggle="modal"
                                data-bs-target="#UpdateModal"
                                value={data._id}
                                onClick={() => {
                                  setConferenceHall(data);
                                  setSelectedlocation({
                                    hallLocation: data.hallLocation,
                                  });
                                }}
                              >
                                <span className="">Update</span>
                              </button>

                              <div
                                className="modal fade"
                                id="UpdateModal"
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabIndex="-1"
                                aria-labelledby="UpdateModalLabel"
                                aria-hidden="true"
                              >
                                <div
                                  className="modal-dialog modal-lg"
                                  style={{ "marginTop": "10vh" }}
                                >
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5
                                        className="modal-title"
                                        id="UpdateModalLabel"
                                      >
                                        Update Hall
                                      </h5>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <form>
                                      <div className="modal-body text-start">
                                        <div className="row gy-2 d-flex flex-row align-items-center mb-4">
                                          <div className=" col-auto d-flex align-items-center">
                                            <span className="me-3">
                                              Hall Number
                                            </span>
                                            <div className="form-outline ">
                                              <input
                                                type="number"
                                                id="hallNumber"
                                                value={
                                                  conferenceHall.hallNumber
                                                }
                                                className="form-control"
                                                placeholder="Enter Hall Number"
                                                onChange={handleChange}
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="col-auto d-flex flex-row align-items-center">
                                            <span className="me-3">
                                              Hall_Name
                                            </span>
                                            <div className=" form-outline ">
                                              <input
                                                type="text"
                                                id="hallName"
                                                value={conferenceHall.hallName}
                                                className="form-control"
                                                placeholder="Enter Hall Name"
                                                onChange={handleChange}
                                                required
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                          <span className="me-2">
                                            Hall Mail_Id
                                          </span>
                                          <div className="form-outline flex-fill mb-0">
                                            <input
                                              type="email"
                                              id="hallEmail"
                                              value={conferenceHall.hallEmail}
                                              className="form-control"
                                              placeholder="Enter Hall Mail Id"
                                              onChange={handleChange}
                                              required={true}
                                              disabled
                                              readOnly
                                            />
                                          </div>
                                        </div>
                                        <div className=" row gy-2 d-flex flex-row align-items-center mb-2 ">
                                          <div className=" col-auto d-flex align-items-center ">
                                            <span className="me-3">
                                              Hall Capacity
                                            </span>
                                            <div className="form-outline  ">
                                              <input
                                                type="number"
                                                id="hallCapacity"
                                                value={
                                                  conferenceHall.hallCapacity
                                                }
                                                className="form-control"
                                                placeholder="Enter Hall Capacity"
                                                onChange={handleChange}
                                                required
                                              />
                                            </div>
                                          </div>
                                          {/* <div className="d-flex flex-row align-items-center mb-2"> */}
                                          <div className=" col-auto d-flex align-items-center " >
                                            <span className="me-3 col-5 ">
                                              Hall location
                                            </span>
                                            <div className=" col-8 ">
                                              <Select
                                                placeholder="Select Location"
                                                name="colors"
                                                id="hallLocation"
                                                value={
                                                  selectedlocation === ""
                                                    ? ""
                                                    : {
                                                        key: selectedlocation.hallLocation,
                                                        value:
                                                          selectedlocation.hallLocation,
                                                        label:
                                                          selectedlocation.hallLocation,
                                                      }
                                                }
                                                options={locationOptions}
                                                className="basic-single "
                                                classNamePrefix="select"
                                                onChange={handlelocation}
                                                required
                                              />
                                            </div>
                                          </div>
                                          {/* </div> */}
                                        </div>
                                      </div>
                                      <>
                                        {" "}
                                        {/* Review Table Button*/}
                                        {/* <div className=" d-flex justify-content-end mb-4 mx-3">
                        <button
                          type="button"
                          className="btn btn-danger rounded-pill"
                          onClick={handleSubmitTab}
                          disabled={tableData.length < 4 ? false : true}
                        >
                          + add
                        </button>
                      </div> */}
                                        {/* Review Table */}
                                        {/* <div>
                        {tableData.length > 0 && (
                          <div className="mx-3">
                            <table className="table table-striped table-bordered table-hover text-center">
                              <thead>
                                <tr>
                                  <th scope="col">hallNumber</th>
                                  <th scope="col">hallName</th>
                                  <th scope="col">hallCapacity</th>
                                  <th scope="col">hallEmail</th>
                                  <th scope="col">hallLocation</th>
                                  <th scope="col"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {tableData.map((data, i) => {
                                  return (
                                    <React.Fragment key={i}>
                                      <tr>
                                        <td>{data.hallNumber}</td>
                                        <td>{data.hallName}</td>
                                        <td>{data.hallCapacity}</td>
                                        <td>{data.hallEmail}</td>
                                        <td>{data.hallLocation}</td>
                                        <td>
                                          <div>
                                            <button
                                              className="btn btn-close"
                                              onClick={deleteTabData}
                                              value={data.hallEmail}
                                            ></button>
                                          </div>
                                        </td>
                                      </tr>
                                    </React.Fragment>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div> */}
                                      </>
                                      <div className="modal-footer d-flex justify-content-center">
                                        <button
                                          type="button"
                                          className="btn btn-danger"
                                          data-bs-dismiss="modal"
                                          id="closeUpdateModal"
                                          aria-label="Close"
                                        >
                                          Close
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-success"
                                          onClick={updateHall}
                                          value={data._id}
                                        >
                                          submit
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <button
                                  className="btn btn-danger"
                                  onClick={deleteHall}
                                  value={data._id}
                                >
                                  Remove
                                </button>
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
          ) : (
            <>
              <h1 className="mt-5">No Records Found!</h1>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Mangehall;
