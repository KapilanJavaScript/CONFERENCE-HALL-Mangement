import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Register from "./pages/commonPages/Register";
import Login from "./pages/commonPages/Login";
import "./index.css";
import Profile from "./pages/commonPages/Profile";
import Mangehall from "./pages/adminPages/Mangehall";
import Mangeadmin from "./pages/adminPages/Mangeadmin";
import Viewschedules from "./pages/adminPages/Viewschedules";
import PrivateRoute from "./components/PrivateRoute";
import Viewmore from "./pages/commonPages/Viewmore";
import Monthlyreports from "./pages/adminPages/Monthlyreports";
import Page404 from "./pages/Page404";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/managehall" element={<Mangehall />} />
          <Route path="/viewbooking" element={<Viewschedules />} />
          <Route path="/manageadmin" element={<Mangeadmin />} />
          <Route path="/halls/viewmore/:id" element={<Viewmore />} />
          <Route path="/admin/monthlyreports" element={<Monthlyreports />} />
          <Route path="/halls/viewmore/*" element={<Page404 />} />
          <Route path="/halls/*" element={<Page404 />} />
          <Route path="/admin/*" element={<Page404 />} />
          <Route path="/*" element={<Page404 />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
