import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register, reset } from "../../features/auth/authSlice";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdLocationPin, MdAccountBox, MdError } from "react-icons/md";
import { GrMail } from "react-icons/gr";
import { FaRegEyeSlash, FaIdCard } from "react-icons/fa";
import loginpic from "../../images/loginPage.png";
import { BsFillTelephoneFill } from "react-icons/bs";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

function Register() {
  const { token, isSuccess, message, isError } = useSelector((state) => state);
  const [locationOptions, setLocationOptions] = useState(null);
  const [selectedlocation, setSelectedlocation] = useState({ location: null });
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [userData, setUserdata] = useState({
    employeeId: "",
    employeeName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isErrormsg, setIsErrormsg] = useState(null);

  const {
    employeeId,
    employeeName,
    email,
    mobileNumber,
    password,
    confirmPassword,
  } = userData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserdata((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const locationData = async () => {
    try {
      const response = await axios.get("/admin/location/getlocation");
      // console.log('--------',response)
      const Location = response.data.map((data) => {
        return { key: data._id, value: data.location, label: data.location };
      });
      setLocationOptions(Location);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handlelocation = (e) => {
    setSelectedlocation({ location: e.value });
  };

  useEffect(() => {
    if (!locationOptions) {
      locationData();
      // console.log("true");
    } else {
      setIsLoading(false);
      // console.log("false");
    }
  }, [locationOptions]);

  useEffect(() => {
    if (message) {
      setIsErrormsg(message);
    }
    if (isSuccess || token) {
      console.log(token);
      navigate("/");
    }
    // console.log('object');
    dispatch(reset());
  }, [dispatch, isSuccess, message, navigate, token]);

  const onFormSubmit = (e) => {
    try {
      e.preventDefault();
      // console.log(selectedlocation.location);
      const re = /^(\+\d{2})?[-. ]?\d{3}[-. ]?\d{3}[-. ]?\d{4}$/;
      if (!re.test(mobileNumber)) {
        return setIsErrormsg("enter valid phone number");
      }

      if (
        selectedlocation.location === null ||
        selectedlocation.location === ""
      ) {
        setIsErrormsg("Please Fill out all the field");
      } else {
        if (!password.length > 7) {
          return setIsErrormsg("Use 8 characters or more for your password");
        }
        if (password !== confirmPassword) {
          return setIsErrormsg("passwords didn’t match. Try again.");
        }
        const registerData = {
          employeeId,
          employeeName,
          email,
          mobileNumber,
          password,
          confirmPassword,
          location: selectedlocation.location,
        };
        dispatch(register(registerData));
      }
    } catch (error) {
      toast.error(error.response.data.message);
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

  return isLoading ? (
    <Spinner />
  ) : (
    <section className="vh-100 bg-white">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div
              className="card p-5 shadow-lg"
              style={{ borderRadius: "25px" }}
            >
              <div className="container card-body p-md-3 m-sm-4 m-md-4">
                <div className="row">
                  {/* Form LOGIN */}
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <h1 className="text-center fw-bolder mb-5 mx-1 mx-md-4 mt-4 ">
                      Sign Up
                    </h1>

                    <form
                      className="mx-1 mx-md-4 "
                      onSubmit={onFormSubmit}
                      // noValidate
                    >
                      {/* Emp ID */}
                      <div className="d-flex flex-row align-items-center mb-4">
                        <span className="me-3">
                          <FaIdCard />
                        </span>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            id="employeeId"
                            value={employeeId}
                            className="form-control"
                            placeholder="Enter Employee Id"
                            onChange={handleChange}
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
                            value={employeeName}
                            className="form-control"
                            placeholder="Enter your Name"
                            onChange={handleChange}
                            // onInvalid={()=>this.setCustomValidity('Please Enter valid email')}
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="d-flex flex-row align-items-center mb-4">
                        <span className="me-3">
                          <GrMail />
                        </span>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="email"
                            id="email"
                            value={email}
                            className="form-control"
                            placeholder="Enter a valid email address"
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
                            typeof="number"
                            id="mobileNumber"
                            value={mobileNumber}
                            className="form-control"
                            placeholder="Enter your Phone Number"
                            onChange={handleChange}
                            maxLength="10"
                            minLength="10"
                            required
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="d-flex flex-row align-items-center mb-4 ">
                        <span className="me-3">
                          <MdLocationPin />
                        </span>
                        <div className="form-outline flex-fill mb-0">
                          <div>
                            <Select
                              placeholder="Select Location"
                              // defaultValue={{
                              //   label: selectedlocation.location,
                              //   value: selectedlocation.location,
                              // }}
                              name="colors"
                              id="location"
                              options={locationOptions}
                              className="basic-single "
                              classNamePrefix="select"
                              onChange={handlelocation}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Password */}
                      <div className="d-flex flex-row align-items-center mb-4">
                        <span className="me-3">
                          <RiLockPasswordFill />
                        </span>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type={showPassword1 ? "text" : "password"}
                            id="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={handleChange}
                            minLength="7"
                            required
                          />
                        </div>
                        <span onClick={onShowPassword1} className="btn">
                          {" "}
                          <FaRegEyeSlash />
                        </span>
                      </div>

                      {/* Confirm Password */}
                      <div className="d-flex flex-row align-items-center mb-4">
                        <span className="me-3">
                          <RiLockPasswordFill />
                        </span>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type={showPassword2 ? "text" : "password"}
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            placeholder="Confirm password"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <span onClick={onShowPassword2} className="btn">
                          {" "}
                          <FaRegEyeSlash />
                        </span>
                      </div>
                      <div className="ms-4">
                        <p className="text-danger">
                          {(isErrormsg || isError) && (
                            <span>
                              <MdError className="me-1" />
                            </span>
                          )}
                          {isError || isErrormsg}
                        </p>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button className="btn btn btn-primary">
                          Register
                        </button>
                      </div>

                      <div className="text-center align-items-center  mt-4 ">
                        <p className="small fw-bold mt-2 pt-1 mb-0">
                          Already have an account?
                          <Link
                            to="/login"
                            className="link-danger ms-2 text-decoration-none"
                          >
                            Login
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>

                  {/* PIC */}
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src={loginpic} className="img-fluid" alt="login pic" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
