import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Search from "../../components/Search/Search";
import History from "../../components/History/History";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateContext";

import SettingsIcon from "@material-ui/icons/Settings";
import HistoryIcon from "@material-ui/icons/History";
import IconButton from "@material-ui/core/IconButton";
import ClearAllIcon from "@material-ui/icons/ClearAll";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import { Avatar } from "@material-ui/core";

import "./Home.css";

function Home() {
  const [{ openAIKey, history, model }, dispatch] = useStateValue();
  const [key, setKey] = useState(openAIKey || ""); // will be initialized with the current value of the key in the context
  const [gptModel, setGptModel] = useState(model || "gpt-4");
  const [open, setOpen] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  const handleClickOpenHistory = () => {
    setOpenHistory(true);
  };

  const handleCloseHistory = () => {
    setOpenHistory(false);
  };

  const handleKeyChange = event => {
    setKey(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setKey(openAIKey); // reset the key state to the current value in the context
    setGptModel(model); // reset the model state to the current value in the context
    setOpen(false);
  };

  const handleSave = () => {
    dispatch({
      type: actionTypes.SET_OPENAI_KEY,
      openAIKey: key,
    });
    dispatch({
      type: actionTypes.SET_GPT_MODEL,
      model: gptModel,
    });
    // Save the OpenAI key to local storage
    localStorage.setItem("openAIKey", key);
    localStorage.setItem("gptModel", gptModel);
    setOpen(false);
  };

  const handleClearHistory = () => {
    // Clear the search history from the state
    dispatch({ type: actionTypes.CLEAR_HISTORY });

    // Remove the search history from local storage
    localStorage.removeItem("searchHistory");

    // Close the history dialog
    handleCloseHistory();
  };

  const handleLoginOpen = async () => {
    const rest_api_key = process.env.REACT_APP_KAKAO_REST_KEY; //REST API KEY
    const redirect_uri = process.env.REACT_APP_KAKAO_REDIRECT; //Redirect URI

    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    try {
      const response = await fetch(redirect_uri, {
        method: "GET",
      });
      if (response.ok || response.status === 400) {
        window.location.href = kakaoURL;
      } else {
        console.log(
          "Failed to reach redirect_uri, staying on the current page."
        );
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  const handleModelChange = event => {
    setGptModel(event.target.value);
  };

  useEffect(() => {
    setKey(openAIKey);
    setGptModel(model);
  }, [openAIKey, model]);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    const GPT = localStorage.getItem("gptModel") || "gpt-4";
    const savedKey = localStorage.getItem("openAIKey") || "sk-";

    dispatch({
      type: actionTypes.INIT_STATE,
      openAIKey: savedKey,
      model: GPT,
      history: savedHistory,
    });

    dispatch({ type: actionTypes.CLEAR_ERROR });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
      <div className="home__header">
        <div className="home__headerLeft">
          <Link to="#" onClick={handleClickOpen}>
            <SettingsIcon />
          </Link>
        </div>
        <div className="home__headerRight">
          <Link to="#" onClick={handleClickOpenHistory}>
            <HistoryIcon />
          </Link>
          <Link to="#" onClick={handleLoginOpen}>
            <Avatar />
          </Link>
        </div>
      </div>

      <div className="home__body">
        <img src="logo2.png" alt="Logo" />
        <div className="home__inputContainer">
          <Search hideButtons />
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your OpenAI key (GPT-4 preferable):
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            defaultValue={openAIKey}
            id="key"
            label="OpenAI Key"
            type="text"
            onChange={handleKeyChange}
            fullWidth
          />

          <DialogContentText>Please choose GPT model: </DialogContentText>
          <Select native value={gptModel} onChange={handleModelChange}>
            <option value={"gpt-4"}>gpt-4</option>
            <option value={"gpt-3.5-turbo"}>gpt-3.5-turbo</option>
          </Select>

          {/* <DialogContentText>Please select K: </DialogContentText>
          <Slider
            style={{ width: "50vh", margin: "0 auto" }}
            aria-label="K"
            defaultValue={numResults}
            onChangeCommitted={onNumResultsChange}
            // getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="md"
        open={openHistory}
        onClose={handleCloseHistory}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Search History
          <IconButton style={{ float: "right" }} onClick={handleClearHistory}>
            <ClearAllIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ maxHeight: "60vh", maxWidth: "80vw" }}>
          <History searchHistory={history} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistory} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
