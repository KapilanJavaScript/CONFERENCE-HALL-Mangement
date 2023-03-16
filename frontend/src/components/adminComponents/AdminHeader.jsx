import { Link } from "react-router-dom";
import spanlogo from "../../images/span-logo.png";
import Sidebar from "./Sidebar";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { resetUser } from "../../features/auth/authSlice";

function AdminHeader() {
  const { token } = useSelector((state) => state);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token === null) {
      navigate("/login");
    }
    if (!user) {
      userData(token);
    } 
    // eslint-disable-next-line
  }, [user, token]);

  const userData = async ({ token }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`/users/me`, config);
      setUser(response.data);
    } catch (error) {
      console.log(error);
      if (error.response.status === 500) {
        dispatch(resetUser());
        navigate("/login");
      }
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light sticky-top bg-light shadow ">
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
      </nav>
    </>
  );
}

export default AdminHeader;
