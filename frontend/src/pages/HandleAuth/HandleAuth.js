import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStateValue } from "../../StateContext";
import { actionTypes } from "../../reducer";

const HandleAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, dispatch] = useStateValue(); // Access dispatch from the context

  useEffect(() => {
    // extract the token from the URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const pic = queryParams.get("pic");

    if (token) {
      // save the token in local storage
      localStorage.setItem("jwt", token);
      console.log(token);

      // save the pic URL in the context if it exists
      if (pic) {
        dispatch({
          type: actionTypes.SET_PROFILE_IMAGE_URL,
          profileImageUrl: pic,
        });
      }

      // redirect the user to the Home page
      navigate("/");
    } else {
      console.error("No token in URL");
    }
  }, [location, navigate, dispatch]);

  return null; // or you can return a loading spinner or a message while the token is being fetched
};

export default HandleAuth;
