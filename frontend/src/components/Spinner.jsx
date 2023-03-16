import ClockLoader from "react-spinners/ClockLoader";
import "./Styles/Spinner.css";

function Spinner() {
  return (
    <div className="loader vh-100 vw-100 d-flex justify-content-center align-items-center">
      {/* <div className="border border-warning border-3 py-5 px-1"> */}
        <ClockLoader color="#FFB52E" size={60} speedMultiplier={1} />
      </div>
    // </div>
  );
}

export default Spinner;
