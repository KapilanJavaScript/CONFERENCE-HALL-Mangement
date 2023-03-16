import profileImg from "../../images/profile.jpg";
import "../style/profile.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdLocationPin, MdAccountBox } from "react-icons/md";
import { FaRegEyeSlash, FaIdCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import UserHeader from "../../components/userComponents/UserHeader";

function Profile() {
  const { token } = useSelector((state) => state);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationOptions, setLocationOptions] = useState(null);
  const [selectedlocation, setSelectedlocation] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [modalData, setModalData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (token == null) {
      navigate("/login");
    }
    if (!user && !locationOptions) {
      userData(token);
      locationData();
    } else {
      setIsLoading(false);
      setSelectedlocation({ location: user.location });
    }
    // eslint-disable-next-line
  }, [token, isLoading, user]);

  const userData = async ({ token }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`/users/me`, config);
      // console.log("----------", response.data);
      setUser(response.data);
    } catch (error) {
      toast.error(error.response.data.message)
      // console.log(error);
    }
  };

  const locationData = async () => {
    try {
      const response = await axios.get("/admin/location/getlocation");
      const Location = response.data.map((data) => {
        return { key: data._id, value: data.location, label: data.location };
      });
      setLocationOptions(Location);
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message)
    }
  };

  const handlelocation = (e) => {
    // console.log(e);
    if (e !== null) {
      setSelectedlocation({ location: e.value });
    }else{
      setSelectedlocation("")
    }
  };

  const handleChange = (e) => {
    setUser((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onFormSubmit = async (e) => {
    try {
      e.preventDefault();
      const userToken = token.token;
      // console.log("after Submit", user);
      // console.log("after Submit location",selectedlocation)
      if (
        user.employeeId === "" ||
        user.employeeName === "" ||
        user.mobileNumber === "" ||
        selectedlocation.location === null
      ) {
        console.log(selectedlocation)
        toast.error("Make sure fill all the field");
      } else {
        const re = /^(\+\d{2})?[-. ]?\d{3}[-. ]?\d{3}[-. ]?\d{4}$/;
        if (re.test(user.mobileNumber)) {
          const config = {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          };
          const updatedData = {
            employeeId: user.employeeId,
            employeeName: user.employeeName,
            mobileNumber: user.mobileNumber,
            location: selectedlocation.location,
          };
          // console.log('updating data',updatedData)
          const response = await axios.put(
            `/users/update`,
            updatedData,
            config
          );
          if (response.status === 200 || 201) {
            toast.success("Updated Succesfully");
          }
        } else {
          toast.error("Please Enter vaild Phone Number");
        }
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  const handleModalChange = (e) => {
    setModalData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChangePassword = async () => {
    try {
      const userToken = token.token;
      if (
        modalData.oldpassword === "" ||
        modalData.newpassword === "" ||
        modalData.confirmpassword === ""
      ) {
        toast.error("Make sure fill all the field");
      } else {
        if (modalData.newpassword === modalData.confirmpassword) {
          const config = {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          };
          // console.log('updating data',updatedData)
          const response = await axios.put(
            `/users/changepassword`,
            modalData,
            config
          );
          console.log(response);
          if(response.status === 200){
            setModalData({
              oldpassword: "",
              newpassword: "",
              confirmpassword: "",
            });
  
            toast.success("Updated Succesfully");

          }
        } else {
          toast.error("New password should be same as Confirm Password");
        }
      }
    } catch (error) {
      toast.error(error.response.data.message)
      // console.log(error);
    }
  };

  const onShowPassword1 = (e) => {
    e.preventDefault();
    setShowPassword1(showPassword1 ? false : true);
  };
  const onShowPassword2 = (e) => {
    e.preventDefault();
    setShowPassword2(showPassword2 ? false : true);
  };
  const onShowPassword3 = (e) => {
    e.preventDefault();
    setShowPassword3(showPassword3 ? false : true);
  };

  return (
    <>
      {isLoading && <Spinner />}
      <UserHeader/> 
      <div className="d-flex justify-content-center mt-5 p-5">
        {/* <UserHeader/> */}
        <div className="">
          {/* <div className="card main mt-5 p-5"> */}
          <div className="card-body">
            {/* <div className="bg-white "> */}
            <div className="container bg-body shadow-lg rounded p-3 mb-5">
              <div className="">
                <div className="row">
                  <div className="col border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                      <img
                        className="rounded-circle mt-5"
                        width="150px"
                        src={profileImg}
                        alt="profile images"
                      />
                      <span className="font-weight-bold">
                        {user?.employeeName}
                      </span>
                      <span className="text-black-50">{user?.email}</span>
                      <span> </span>
                    </div>
                  </div>
                  <div className="col-md-5 border-right">
                    <div className="p-3 py-5 ">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right">Profile Settings</h4>
                      </div>
                      <div className="row mt-4">
                        {/* Emp ID */}
                        <div className="d-flex flex-row align-items-center mb-4">
                          <span className="me-3">
                            <FaIdCard />
                          </span>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="employeeId"
                              value={user !== null && user.employeeId}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter Employee Id"
                              required
                            />
                          </div>
                        </div>

                        {/* Name */}
                        <div className="d-flex flex-row align-items-center mb-4">
                          <span className="me-3">
                            <MdAccountBox />
                          </span>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="employeeName"
                              value={user !== null && user.employeeName}
                              className="form-control"
                              placeholder="Enter your Name"
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div className="d-flex flex-row align-items-center mb-4">
                          <span className="me-3">
                            <BsFillTelephoneFill />
                          </span>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="mobileNumber"
                              value={user !== null && user.mobileNumber}
                              className="form-control"
                              placeholder="Enter your Phone Number"
                              onChange={handleChange}
                              maxLength="10"
                              minLength="10"
                              required
                            />
                          </div>
                        </div>

                        {/* location */}
                        <div className="d-flex flex-row align-items-center mb-3 ">
                          <span className="me-3">
                            <MdLocationPin />
                          </span>
                          <div className="form-outline flex-fill mb-0">
                            <div>
                              <Select
                                placeholder="Select Location"
                                value={
                                  selectedlocation === ""
                                    ? ""
                                    : {
                                        label: selectedlocation?.location,
                                        value: selectedlocation?.location,
                                      }
                                }
                                name="colors"
                                id="location"
                                options={locationOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={handlelocation}
                                // isClearable={true}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-5 ">
                        <div className="col">
                          <button
                            type="text"
                            className="form-control btn btn-primary profile-button"
                            onClick={onFormSubmit}
                          >
                            Update
                          </button>
                        </div>
                        <div className="col ">
                          <button
                            type="button"
                            className="form-control btn btn-primary profile-button"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop"
                          >
                            Change password
                          </button>

                          {/* <!-- Modal --> */}
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
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id="staticBackdropLabel"
                                  >
                                    Change Password
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body mx-5 px-2">
                                  {/* <div className="col-md-12">
                                    <label className="labels">
                                      Old password
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter your Password"
                                      id="oldpassword"
                                      value={modalData.oldpassword}
                                      onChange={handleModalChange}
                                    />
                                  </div> */}
                                  {/* <div className="col-md-12">
                                    <label className="labels">
                                      New Password
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="New Password"
                                      id="newpassword"
                                      value={modalData.newpassword}
                                      onChange={handleModalChange}
                                    />
                                  </div> */}
                                  {/* <div className="col-md-12">
                                    <label className="labels">
                                      Confirm Password
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Confirm Password"
                                      id="confirmpassword"
                                      value={modalData.confirmpassword}
                                      onChange={handleModalChange}
                                    />
                                  </div> */}
                                  {/* Old Password */}
                                  <div className="d-flex flex-row align-items-center mb-4">
                                    <span className="me-3">
                                      <RiLockPasswordFill />
                                    </span>
                                    <div className="form-outline flex-fill mb-0">
                                      <input
                                        type={
                                          showPassword3 ? "text" : "password"
                                        }
                                        id="oldpassword"
                                        className="form-control"
                                        placeholder="Enter Old Password"
                                        value={modalData.oldpassword}
                                        onChange={handleModalChange}
                                        required
                                      />
                                    </div>
                                    <span
                                      onClick={onShowPassword3}
                                      className="btn"
                                    >
                                      {" "}
                                      <FaRegEyeSlash />
                                    </span>
                                  </div>
                                  {/* new Password */}
                                  <div className="d-flex flex-row align-items-center mb-4">
                                    <span className="me-3">
                                      <RiLockPasswordFill />
                                    </span>
                                    <div className="form-outline flex-fill mb-0">
                                      <input
                                        type={
                                          showPassword1 ? "text" : "password"
                                        }
                                        id="newpassword"
                                        className="form-control"
                                        placeholder="Enter New Password"
                                        value={modalData.newpassword}
                                        onChange={handleModalChange}
                                        required
                                      />
                                    </div>
                                    <span
                                      onClick={onShowPassword1}
                                      className="btn"
                                    >
                                      {" "}
                                      <FaRegEyeSlash />
                                    </span>
                                  </div>

                                  {/* Confirm Password */}
                                  <div className="d-flex flex-row align-items-center mb-2">
                                    <span className="me-3">
                                      <RiLockPasswordFill />
                                    </span>
                                    <div className="form-outline flex-fill mb-0">
                                      <input
                                        type={
                                          showPassword2 ? "text" : "password"
                                        }
                                        id="confirmpassword"
                                        className="form-control"
                                        value={modalData.confirmpassword}
                                        placeholder="Enter Confirm password"
                                        onChange={handleModalChange}
                                        required
                                      />
                                    </div>
                                    <span
                                      onClick={onShowPassword2}
                                      className="btn"
                                    >
                                      {" "}
                                      <FaRegEyeSlash />
                                    </span>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={handleChangePassword}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
