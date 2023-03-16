import React from "react";
import { Link, useHref } from "react-router-dom";

function AdminList() {
  const path = useHref();
  return (
    <div>
      <nav className="navbar navbar-light bg-light navbar-expand-md border-top shadow">
        <div className="container d-flex justify-content-end">
          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navcol-1"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navcol-1">
            <ul className="nav navbar-nav w-100 justify-content-between">
              <li className="nav-item border-start">
                <Link
                  className={`nav-link ${
                    path === "/" ? "text-dark fw-bold" : "text-muted"
                  }`}
                  to="/"
                >
                  Book Hall
                </Link>
              </li>
              <li className="nav-item border-start border-1">
                <Link
                  className={`nav-link ${
                    path === "/viewbooking"
                      ? "text-dark  fw-bold"
                      : "text-muted"
                  }`}
                  to="/viewbooking"
                >
                  View Booking
                </Link>
              </li>
              <li className="nav-item border-start border-1">
                <Link
                  className={`nav-link ${
                    path === "/managehall" ? "text-dark  fw-bold" : "text-dark"
                  }`}
                  to="/managehall"
                >
                  Manage Hall
                </Link>
              </li>
              <li className="nav-item border-start border-1">
                <Link
                  className={`nav-link ${
                    path === "/manageadmin" ? "text-dark  fw-bold" : "text-dark"
                  }`}
                  to="/manageadmin"
                >
                  Manage Admin
                </Link>
              </li>
              <li className="nav-item border-start border-1">
                <Link
                  className={`nav-link ${
                    path === "/admin/monthlyreports"
                      ? "text-dark  fw-bold"
                      : "text-dark"
                  }`}
                  to="/admin/monthlyreports"
                >
                  Monthly reports
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default AdminList;
