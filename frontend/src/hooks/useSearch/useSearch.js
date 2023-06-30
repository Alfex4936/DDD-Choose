import { useState, useEffect } from "react";
import { useStateValue } from "../../StateContext";
import { actionTypes } from "../../reducer";

import init, {
  // get_places,
  get_interests,
  get_places_by_gpt,
} from "dingdongdang";

export const useLibraSearch = term => {
  const [{ numResults, openAIKey, model }, dispatch] = useStateValue();
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
    let isCancelled = false;

    async function fetchData() {
      try {
        await init();
        console.log("wasm module initialized");

        if (term && openAIKey) {
          console.log("TERM: " + term + " MODEL: " + model);
          setLoading(true);
          try {
            let place_keywords = await get_interests(openAIKey, model, term);
            if (isCancelled) return; // check cancellation after every async operation

            console.log(place_keywords);

            const jsonObject = JSON.parse(place_keywords);
            const content = jsonObject.choices[0].message.content;
            console.log(content);

            let places = await get_places_by_gpt(content);
            if (isCancelled) return; // check cancellation after every async operation

            places["queries"] = content;

            console.log(places);
            if (!isCancelled) {
              setData(places);
              dispatch({ type: actionTypes.ADD_HISTORY, history: term });
              setError(null); // clear any previous error
            }
          } catch (error) {
            if (!isCancelled) setError(error.message);
          } finally {
            if (!isCancelled) setLoading(false);
          }
        } else {
          if (!isCancelled) setError("Invalid search query or OpenAI Key");
        }
      } catch (err) {
        console.error("Error during wasm initialization", err);
        if (!isCancelled) setError("Error during wasm initialization");
      }
    }

    fetchData();

    return () => {
      isCancelled = true; // set cancellation flag on cleanup
    };
  }, [numResults, term, openAIKey, dispatch]);

  return { data, loading, error };
};

export default useLibraSearch;