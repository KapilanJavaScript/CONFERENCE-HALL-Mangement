import { Link } from "react-router-dom";
import spanlogo from "../../images/span-logo.png";
import Sidebar from "../adminComponents/Sidebar";
import Dropdown from "../adminComponents/Dropdown";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useHref } from "react-router-dom";
import axios from "axios";
import { resetUser } from "../../features/auth/authSlice";

function UserHeader() {
  const { token } = useSelector((state) => state);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const path = useHref();

  useEffect(() => {
    if (token === null) {
      navigate("/login");
    }
    if (!user && token !== null) {
      userData(token);
    }
    // eslint-disable-next-line
  }, [user, token]);

  const userData = async ( {token}) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`/users/me`, config);
      setUser(response.data);
      
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      // console.log(error);
      if (error.response.status === 500 || 401) {
        dispatch(resetUser());
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    dispatch(resetUser());
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light sticky-top bg-light shadow ">
        {true ? (
          <div className="container">
            {/* LOGO */}
            <div className="vw-100 d-flex justify-content-between align-items-center">
              <Sidebar user={user} />
              <Link
                className="navbar-brand d-flex justify-content-center"
                to="/"
              >
                <img
                  id="spanlogo"
                  src={spanlogo}
                  alt="Span Enterprises"
                  draggable="false"
                  height="60"
                />
              </Link>
              <Dropdown user={user} />
            </div>
          </div>
        ) : (
          <>
            <div className="container">
              <Link className="navbar-brand" to="/">
                <img
                  id="spanlogo"
                  src={spanlogo}
                  alt="Span Enterprises"
                  draggable="false"
                  height="60"
                />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        path === "/" ? "text-dark fw-bold" : "fw-bold fa-normal"
                      }`}
                      to="/"
                    >
                      Book Hall
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        path === "/viewbooking" ?"text-dark fw-bold" : "fw-bold fa-normal"
                      }`}
                      to="/viewbooking"
                    >
                      View Booking
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <span
                      className={`nav-link ${
                        path === "/profile" ?"text-dark fw-bold" : "fw-bold fa-normal"
                      }`}
                      //  href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Account
                    </span>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link to="/profile" className="dropdown-item">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          className="btn dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
}

export default UserHeader;
