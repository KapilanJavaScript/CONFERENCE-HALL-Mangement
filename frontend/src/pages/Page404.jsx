import React from "react";
import AdminHeader from "../components/adminComponents/AdminHeader";
import "./style/404.css";

function Page404() {


  return (
    <>
      <div className="">
        <AdminHeader />
      </div>
      <div className="row notfound container1">

      <div className="col d-flex justify-content-center align-items-center mt-5 me-sm-2">
        <h1 className="first-four">4</h1>
        <div className="cog-wheel1">
          <div className="cog1">
            <div className="top"></div>
            <div className="down"></div>
            <div className="left-top"></div>
            <div className="left-down"></div>
            <div className="right1-top"></div>
            <div className="right1-down"></div>
            <div className="left"></div>
            <div className="right1"></div>
          </div>
        </div>

        <div className="cog-wheel2">
          <div className="cog2">
            <div className="top"></div>
            <div className="down"></div>
            <div className="left-top"></div>
            <div className="left-down"></div>
            <div className="right1-top"></div>
            <div className="right1-down"></div>
            <div className="left"></div>
            <div className="right1"></div>
          </div>
        </div>
        <h1 className="second-four">4</h1>
      </div>
      </div>
      <div className="col d-flex justify-content-center align-items-top">
        <p className="wrong-para fw-bold">Uh Oh! Page not found!</p>
      </div>
    </>
  );
}

export default Page404;
