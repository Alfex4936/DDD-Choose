import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HandleAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // extract the token from the URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      // save the token in local storage
      localStorage.setItem("jwt", token);
      console.log(token);

      // redirect the user to the Home page
      navigate("/");
    } else {
      console.error("No token in URL");
    }
  }, [location, navigate]);

  return null; // or you can return a loading spinner or a message while the token is being fetched
};

export default HandleAuth;
