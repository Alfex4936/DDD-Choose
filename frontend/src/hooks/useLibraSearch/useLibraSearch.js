import { useState, useEffect } from "react";
import { useStateValue } from "../../StateContext";
import { actionTypes } from "../../reducer";

import init, {
  // get_places,
  get_interests,
  get_places_by_gpt,
} from "dingdongdang";

export const useLibraSearch = term => {
  console.log("useLibraSear rending");
  const [{ numResults, openAIKey }, dispatch] = useStateValue();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect for error
  useEffect(() => {
    if (error) {
      dispatch({ type: actionTypes.SET_ERROR, error: error });
    }
  }, [error, dispatch]);

  // useEffect for fetchData
  useEffect(() => {
    init()
      .then(async () => {
        // Use the module after it has been initialized.
        console.log("wasm module initialized");

        // Call other wasm functions here. For example:
        if (term && openAIKey) {
          setLoading(true);
          try {
            let place_keywords = await get_interests(openAIKey, term);
            console.log(place_keywords);

            const jsonObject = JSON.parse(place_keywords);
            const content = jsonObject.choices[0].message.content;
            console.log(content);

            let places = await get_places_by_gpt(content);
            places["queries"] = content;

            console.log(places);
            setData(places);

            dispatch({ type: actionTypes.ADD_HISTORY, history: term });
            setError(null); // clear any previous error
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        } else {
          setError("Invalid search query or OpenAI Key");
        }
      })
      .catch(err => {
        console.error("Error during wasm initialization", err);
        setError("Error during wasm initialization");
      });
  }, [numResults, term, openAIKey]); // Pass the required dependencies

  return { data, loading, error };
};

export default useLibraSearch;
