import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    useEffect(() => {

      if (!currentUser) return;

      const checkLogin = async () => {
        try {
          const response = await axios.get('http://localhost:8800/api/auth/validate', {
            params: { userid: currentUser?.id },  // Pass the user ID as query param if needed
            withCredentials: true
          });
          if (!response.data.valid) {
            navigate("/login");
          }
        } catch (error) {
          if (error.response && !error.response.data.valid) {
            console.log("User is not logged in, navigating to login...");
            navigate("/login");
          } else {
            console.log("An unexpected error occurred: ", error);
          }
        } finally {
          setLoading(false);  // Stop loading once check is done
        }
      };

      // Call checkLogin on component mount
      checkLogin();
    }, [currentUser, navigate]);

    if (loading) {
      return null;  // You can return a loading indicator here if you prefer
    }

  return (
    <div className="home">
      <Stories />
      <Share />
      <Posts />
    </div>
  );
}

export default Home;
