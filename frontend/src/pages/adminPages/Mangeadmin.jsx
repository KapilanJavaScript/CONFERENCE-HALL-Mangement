import React from "react";
import AdminHeader from "../../components/adminComponents/AdminHeader";
import { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Mangeadmin() {
  const { token } = useSelector((state) => state);
  const [selectOptions, setSelectOptions] = useState("");
  const [selectUser, setSelectUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token == null) {
      return navigate("/login");
    }
    if (!isAdmin || !selectOptions) {
      AdminOptions(token);
      getAdmin(token);
    } else {
      setIsLoading(false);
      // setIsLoading(true);
    }
    // eslint-disable-next-line
  }, [token, isAdmin]);

  // useEffect(() => {
  //   // console.log("--------");
  //   AdminOptions(token);
  //   // getAdmin(token);
  // }, [isAdmin]);

  const AdminOptions = async ({ token }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`/admin/users/getuser`, config);
      // console.log(response, "user---------");
      const reactSelectOptions = response.data.map((data) => {
        return { key: data._id, value: data._id, label: data.employeeName };
      });
      // console.log(reactSelectOptions);
      setSelectOptions(reactSelectOptions);
    } catch (error) {
      toast.warning(error.response.data.message);
      return navigate("/");
    }
  };

  const handleUserSelect = (e) => {
    // console.log(e);
    if (e !== null) {
      setSelectUser(e);
    } else {
      setSelectUser("");
    }
  };

  const handleAdmin = async () => {
    try {
      const tokenId = token.token;
      const id = selectUser.value;
      if (selectUser === "") {
        toast.warning("Please Select a User");
      } else {
        const config = {
          headers: {
            authorization: `Bearer ${tokenId}`,
          },
        };
        const response = await axios.put(
          `/admin/users/addadmin/${id}`,
          "_",
          config
        );

        // console.log(response.status);
        if (response.status === 201) {
          setSelectUser("");
          const filterSelectOP = selectOptions.filter(
            (data) => data.key !== id
          );
          setSelectOptions(filterSelectOP);
          getAdmin(token);
          if (response.status === 200 || 201) {
            toast.success(response.data);
          }
        }
      }
    } catch (error) {
      return error.message;
    }
  };

  const getAdmin = async ({ token }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`/admin/users/getadmin`, config);
      // console.log("Admin---", response.data);
      setIsAdmin(response.data);
    } catch (err) {
      return err.message;
    }
  };

  const deleteAdmin = async (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const tokenId = token.token;
          const id = e.target.value;
          // console.log(tokenId, "-----js.52-----", id);
          const config = {
            headers: {
              authorization: `Bearer ${tokenId}`,
            },
          };
          const response = await axios.put(
            `/admin/users/removeadmin/${id}`,
            "_",
            config
          );
          if (response.data) {
            // console.log("remove admin", response);
            const filterAdminTab = isAdmin.filter((data) => data._id !== id);
            setIsAdmin(filterAdminTab);
            setSelectUser("");
            AdminOptions(token);
            if (response.status === 200 || 201) {
              toast.success(response.data);
            }
          }
        } catch (error) {
          return error.message;
        }
      }
    });
  };

  return (
    <>
      <AdminHeader />
      {isLoading && <Spinner />}

      <div className="container">
        {/* <div className="btn btn-light mt-3"><IoIosArrowBack/> Back</div> */}
        <div className="row mx-2 mt-5">
          <h1 className="col fs-1 fs-md-3 fs-sm-4">Mange Admin</h1>
          <div className="col d-flex justify-content-end">
            {/* <!-- Search --> */}
            {/* <div className="input-group-lg pe-4 pe-sm-2">
              <input
                type="text"
                placeholder="Search"
                className="form-control "
              />
            </div> */}

            {/* <!-- Modal --> */}
            <div className="">
              <button
                type="button"
                className="btn btn-primary btn-lg rounded-pill d-flex align-items-center fs-sm-4"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                onClick={() => setSelectUser("")}
              >
                <span className=" pe-2">+</span>
                <span className="pe-1">Add</span>
                <span className="">Admin</span>
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
                <div
                  className="modal-dialog modal-lg "
                  style={{ "marginTop": "10vh" }}
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="staticBackdropLabel">
                        Add Admin
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => setSelectUser("")}
                      ></button>
                    </div>
                    <div className="modal-body text-start">
                      <div className="col-md-12">
                        <label className="labels">Select Employee</label>
                        <div>
                          <Select
                            // defaultValue={[Data[2], Data[3]]}
                            // isMulti
                            value={selectUser}
                            placeholder="Select for person to be added as admin"
                            name="admin"
                            options={selectOptions}
                            className="basic-single "
                            classNamePrefix="select"
                            isClearable="true"
                            onChange={handleUserSelect}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <label className="labels">
                          Please search here with name
                        </label>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => setSelectUser("")}
                      >
                        {" "}
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleAdmin}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Table */}
          {isAdmin !== null ? (
            <div className="table-responsive-md">
              <table className="table table-striped table-bordered table-hover mt-5 text-center">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Employee_ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isAdmin.map((data, i) => {
                    return (
                      <React.Fragment key={data._id}>
                        <tr>
                          <th scope="row">{i + 1}</th>
                          <td>{data.employeeId}</td>
                          <td>{data.employeeName}</td>
                          <td>{data.email}</td>
                          <td>
                            <div>
                              <button
                                className="btn btn-danger"
                                onClick={deleteAdmin}
                                value={data._id}
                              >
                                Remove
                              </button>
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

export default Mangeadmin;
