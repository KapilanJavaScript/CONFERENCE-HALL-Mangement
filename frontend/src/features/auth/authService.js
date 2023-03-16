import axios from "axios";
//resigter User

const registerAPI = async (userData) => {
  const response = await axios.post(`/users`, userData);
  // console.log('REGISTERED');
  return response.data;
};

const logIn = async (userData) => {
  const response = await axios.post(`/users/login`, userData);
  // console.log('LOGINED');
  return response.data;
};




const authService = {
  registerAPI,
  logIn,
};

export default authService;
