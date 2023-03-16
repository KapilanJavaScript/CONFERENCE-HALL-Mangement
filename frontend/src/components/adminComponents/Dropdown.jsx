import "../../index.css";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetUser } from "../../features/auth/authSlice";

function Dropdown({user}) {
  const { token } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(resetUser());
    navigate("/login");
  };

  return (
    <>
      <div className="dropdown">
        <button
          className="btn "
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <div className="d-inline-flex align-items-center ">
            <FaUserCircle className="me-2 fs-3 fs-sm-5 fs-md-4" />
            <span className="me-2 overflow fs-5">{token !== null ? `${user?.employeeName || token.employeeName}` : '__'}</span>
          </div>
        </button>
        <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton1">
          <li>
            <Link to="/profile" className="dropdown-item">
              Account
            </Link>
          </li>
          <li>
            <button className="btn dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Dropdown;
