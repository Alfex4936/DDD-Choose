export const initialState = {
  term: "",
  numResults: 5,
  openAIKey: "sk-",
  error: null,
  history: [],
  model: "gpt-4",
  profileImageUrl: "",
};

export const actionTypes = {
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_NUM_RESULTS: "SET_NUM_RESULTS",
  SET_OPENAI_KEY: "SET_OPENAI_KEY",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  ADD_HISTORY: "ADD_HISTORY",
  SET_GPT_MODEL: "SET_GPT_MODEL",
  CLEAR_HISTORY: "CLEAR_HISTORY",
  INIT_STATE: "INIT_STATE",
  SET_PROFILE_IMAGE_URL: "SET_PROFILE_IMAGE_URL",
};

const reducer = (state, action) => {
  console.log(action); // Good for debugging

  switch (action.type) {
    case actionTypes.INIT_STATE:
      return {
        ...state,
        openAIKey: action.openAIKey,
        model: action.model,
        history: action.history,
      };
    case actionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        term: action.term,
      };
    case actionTypes.SET_NUM_RESULTS:
      return {
        ...state,
        numResults: action.numResults,
      };
    case actionTypes.SET_OPENAI_KEY: // <-- new case
      return {
        ...state,
        openAIKey: action.openAIKey,
      };
    case actionTypes.SET_ERROR: // <-- new case
      return {
        ...state,
        error: action.error,
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null, // reset error to null
      };
    case actionTypes.CLEAR_HISTORY:
      return {
        ...state,
        history: [],
      };
    case actionTypes.ADD_HISTORY:
      // Add new history to the existing history array
      const newHistory = [...state.history, action.history];
      // Stringify the array and store it in localStorage
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));

      return {
        ...state,
        history: newHistory,
      };
    case actionTypes.SET_HISTORY:
      return {
        ...state,
        history: action.history,
      };
    case actionTypes.SET_GPT_MODEL:
      return {
        ...state,
        model: action.model,
      };
    case actionTypes.SET_PROFILE_IMAGE_URL:
      return {
        ...state,
        profileImageUrl: action.profileImageUrl,
      };
    default:
      return state;
  }
};

export default reducer;
