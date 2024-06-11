import { useCallback, useState } from "react";
import { useStateValue } from "../../StateContext";
import { actionTypes } from "../../reducer";

import init, { get_interests, get_places_by_gpt } from "dingdongdang";

export const useSearch = () => {
  const [{ openAIKey, model }, dispatch] = useStateValue();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async term => {
      let isCancelled = false;

      try {
        if (term && openAIKey) {
          await init();
          //console.log("wasm module initialized");

          //console.log("TERM: " + term + " MODEL: " + model);
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

      return () => {
        isCancelled = true; // set cancellation flag on cleanup
      };
    },
    [openAIKey, model, dispatch]
  );

  return { data, loading, error, fetchData };
};

export default useSearch;
