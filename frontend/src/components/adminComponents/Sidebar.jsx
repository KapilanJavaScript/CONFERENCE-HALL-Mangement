import { Link, useHref } from "react-router-dom";
import spanlogo from "../../images/span-logo.png";

function Sidebar({user}) {
  const path = useHref();

  return (
    <>
      <button
        className="btn"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h4 className="offcanvas-title " id="offcanvasExampleLabel">
            <img
              id="spanlogo"
              src={spanlogo}
              alt="Span Enterprises"
              draggable="false"
              height="50"
            />
          </h4>
          <button
            type="button"
            className="btn-close text-reset justify-content-end"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="">
          <ul
            className="list-group list-group-flush"
            data-bs-dismiss="offcanvas"
          >
            <li className="list-group-item "></li>
            <Link
              className={`list-group-item ${
                path === "/" ? "textColor fw-bold" : "list-group-item-action"
              }`}
              to="/"
            >
              Dashboard
            </Link>
            <Link
              className={`list-group-item ${
                path === "/viewbooking"
                  ? "textColor fw-bold"
                  : "list-group-item-action"
              }`}
              to="/viewbooking"
            >
              View Booking
            </Link>
            {user?.isAdmin  && (
              <>
                <Link
                  className={`list-group-item ${
                    path === "/managehall"
                      ? "textColor fw-bold"
                      : "list-group-item-action"
                  }`}
                  to="/managehall"
                >
                  Manage Hall
                </Link>
                <Link
                  className={`list-group-item ${
                    path === "/manageadmin"
                      ? "textColor fw-bold"
                      : "list-group-item-action"
                  }`}
                  to="/manageadmin"
                >
                  Manage Admin
                </Link>
                <Link
                  className={`list-group-item ${
                    path === "/admin/monthlyreports"
                      ? "textColor fw-bold"
                      : "list-group-item-action"
                  }`}
                  to="/admin/monthlyreports"
                >
                  Monthly reports
                </Link>
              </>
            )}
            {/* <Link className={`list-group-item ${path === "/addteam" ? "textColor" : "list-group-item-action"}`} to='/addteam'>Add Team Info</Link> */}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
