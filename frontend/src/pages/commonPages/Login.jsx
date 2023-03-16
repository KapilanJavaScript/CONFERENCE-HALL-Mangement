import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdError } from "react-icons/md";
import { GrMail } from "react-icons/gr";
import { FaRegEyeSlash } from "react-icons/fa";
import { login, reset } from "../../features/auth/authSlice";
import loginpic from "../../images/loginPage.png";
// import {FcGoogle} from 'react-icons/fc'

function Login() {
  const { token, isSuccess, message } = useSelector((state) => state);
  const [isErrormsg, setIsErrormsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserdata] = useState({
    email: "",
    password: "",
  });
  const { email, password } = userData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserdata((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  useEffect(() => {
    if (message) {
      setIsErrormsg('Email or Password is incorrect');
      // console.log(message);
    }
    if (isSuccess || token) {
      // console.log(token);
      navigate("/");
    }

    dispatch(reset());
  }, [dispatch, isSuccess, message, navigate, token]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };
  const onShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(showPassword ? false : true);
  };

  return (
    <>
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
                        Sign In
                      </h1>

                      <form className="mx-1 mx-md-4" onSubmit={onFormSubmit}>
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

                        <div className="d-flex flex-row align-items-center mb-4">
                          <span className="me-3">
                            <RiLockPasswordFill />
                          </span>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              value={password}
                              className="form-control"
                              placeholder="Enter password"
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <span onClick={onShowPassword} className="btn">
                            {" "}
                            <FaRegEyeSlash />
                          </span>
                        </div>
                        <div className="ms-4">
                          <p className="text-danger">
                            {isErrormsg && (
                              <span>
                                <MdError className="me-1" />
                              </span>
                            )}
                            {isErrormsg}
                          </p>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button className="btn btn-primary">Login</button>
                        </div>

                        <div className="text-center mt-4 pt-2">
                          <p className="small fw-bold mt-2 pt-1 mb-0 ">
                            Don't have an account?
                            <Link
                              to="/register"
                              className="link-danger ms-2 text-decoration-none"
                            >
                              Register
                            </Link>
                          </p>
                        </div>

                        {/* Google auth */}
                        {/* <div className="mt-5 mb-4">
                        <p className="text-center fw-bold mx-3 mb-0 ms-5">Or</p>
                      </div>

                      <div className="d-flex  align-items-center justify-content-center justify-content-lg-start ms-5">
                        <p className="mb-0 ms-2">Sign in with</p>
                        <Link  to={'https://accounts.google.com/AccountChooser?oauth=1&amp;continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Flegacy%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAM8mFXpzSkOXMDylVT8KlCgZAR8I_oslDaEgBthxIGrwxAMc9NHegu82DMAkDIJXQs_WCZ3tA3IQrJC3muyQ1vlt0CTcfJ9Ims5QkbnYMKbnhElJ7YthOOB98PGxx_SajPJKdo8EZXUYEEZLNI9Dy2K4V3xdhebO5BzlZ47WO1wHtDSs5noRVxcdq1xkmpf5ttzYOGCZ5PV2DAxLUVJP-3EzpRS2MvDvKUqmZN6lazUCwpyO0WVInPushl8Xyqfu7SsfAHtBAX7CC_bMpHQ6Wn_Z4_7wnKs64He2zTM5Cw-IumL7kTjEhTYTxPkYvw-Ep6iW5e1j0ZolYJzW0S8EKPkYufETNhFWvNF84SHSqiK0UShcZS2Ha9EO9TaXIWB7y0dyOIlSzcnP7RpK9qc9Gp7wXwR5EFPZPsS7ChozrYldWgqTkzGQyz2Zr_B-Tp9WAq1XVed%26as%3DS-250643445%253A1672915941287328%26client_id%3D407408718192.apps.googleusercontent.com%23'}>
                          <FcGoogle className="" />
                        </Link>
                      </div> */}
                      </form>
                    </div>
                    {/* PIC */}
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src={loginpic}
                        className="img-fluid"
                        alt="HomePage Login.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
