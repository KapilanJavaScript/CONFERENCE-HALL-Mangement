import AdminHeader from "./adminComponents/AdminHeader";
import Spinner from "./Spinner";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const { user } = useSelector((state) => state);

  useEffect(() => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    setCheckingStatus(false);
  }, [user]);

  if(checkingStatus){
     return <Spinner/>
  }
  
  return loggedIn ? <AdminHeader/> : <Navigate to='/login' />
}

export default Header
