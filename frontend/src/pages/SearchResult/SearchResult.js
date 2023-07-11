import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@material-ui/core/CircularProgress"; // import the loading circle

import CloseIcon from "@material-ui/icons/Close";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import useSearch from "../../hooks/useSearch/useSearch";
import { useStateValue } from "../../StateContext";

import Search from "../../components/Search/Search";
import SearchOption from "../../components/SearchOption/SearchOption";

import KakaoMap from "../../components/KakaoMap/KakaoMap";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";

import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";

import "./SearchResult.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SearchResult() {
  const [{ term }] = useStateValue();
  const { data, loading, fetchData, error } = useSearch();

  // Add a new piece of state for the selected tab
  const [selectedTab, setSelectedTab] = useState("All");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loadingStarted, setLoadingStarted] = useState(false);
  // Add a new piece of state for tracking tab clicks
  const [tabClickCount, setTabClickCount] = useState(0);

  // Use a function to set selectedTab state and increase tabClickCount
  const setSelectedTabAndUpdateClickCount = newTab => {
    setSelectedTab(newTab);
    setTabClickCount(prevCount => prevCount + 1);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    // dispatch({
    //   type: actionTypes.SET_ERROR,
    //   error: null,
    // });
  };

  useEffect(() => {
    if (term) {
      fetchData(term);
    }
  }, [term, fetchData]);

  useEffect(() => {
    if (loading) {
      setLoadingStarted(true);
    } else if (loadingStarted && !error) {
      setOpenSuccess(true);
    }
  }, [loading, error, loadingStarted]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" }); // Use 'auto' to override ongoing scrolls
  }, [tabClickCount]); // Use tabClickCount as dependency

  // useMemo to memoize the calculation of filtered data
  const filteredData = useMemo(() => {
    switch (selectedTab) {
      default:
        console.log("Data: ", data);
        return data || [];
    }
  }, [data, selectedTab]);

  return (
    <div className="searchResult">
      <div className="searchResult__header">
        <Link to="/">
          <img
            className="searchResult__logo pulse"
            src="logo_search.png"
            alt="Logo"
          />
        </Link>

        <div className="searchResult__headerBody">
          <Search hideButtons loading={loading} />

          <div className="searchResult__options">
            <div className="searchResult__optionsLeft">
              <SearchOption
                title="All"
                icon={<SearchIcon />}
                setSelectedTab={setSelectedTabAndUpdateClickCount}
                activeTab={selectedTab}
                loading={loading}
              />
            </div>
            {/* <div className="searchResult__optionsRight">
              <SearchOption title="Settings" />
            </div> */}
          </div>
        </div>
      </div>
      {!term && (
        <div className="searchResult__items">
          <div
            className="searchResult__itemsCount"
            style={{ whiteSpace: "pre-line" }}
          >
            {error}
          </div>
        </div>
      )}
      {term && (
        <div className="searchResult__items">
          {loading ? (
            <div>
              <p className="searchResult__itemsCount">Loading...</p>
              <CircularProgress /> {/* Loading circle */}
            </div>
          ) : (
            <>
              {filteredData &&
              Array.isArray(filteredData) &&
              filteredData.length > 0 ? (
                <>
                  <p
                    className="searchResult__itemsCount"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    About{" "}
                    {Array.isArray(filteredData) ? filteredData.length : 0}{" "}
                    results for {term}
                    <br />
                    <br />
                    {selectedTab === "All" && (
                      <>
                        <button className="searchResult__itemLink">
                          카카오맵 - 클릭하면서 장소를 구경하세요
                          <ArrowDropDownIcon />
                        </button>

                        <KakaoMap places={filteredData} />

                        <Divider
                          style={{ marginTop: "16px", marginBottom: "16px" }}
                          variant="middle"
                        />
                      </>
                    )}
                    {data?.map((query, index) => (
                      <Chip
                        style={{ marginRight: "10px", marginBottom: "10px" }}
                        key={index}
                        label={query.place_name.trim()} // Remove leading and trailing whitespaces
                        variant="outlined"
                      />
                    ))}
                  </p>
                </>
              ) : (
                <a className="searchResult__itemTitle">
                  <h2>
                    No results found.
                    <br />
                    Check OpenAI API Key.
                    <br />
                    {!!error ? `${error}` : ""}
                  </h2>
                </a>
              )}
            </>
          )}
        </div>
      )}
      <Snackbar
        open={openSuccess}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration={5000}
        onClose={() => {
          handleCloseError();
          setOpenSuccess(false);
        }}
      >
        <Alert
          onClose={() => {
            handleCloseError();
            setOpenSuccess(false);
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          Click the marker to see the location!
          <br />
          지도에서 파란 마커를 클릭해서 정보를 보세요 :)
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={!!error} // <-- the snackbar is open when there is an error
        autoHideDuration={5000} // <-- the snackbar will automatically close after 3 seconds
        onClose={handleCloseError} // <-- you need a function to close the snackbar
        message={error} // <-- the error message will be displayed in the snackbar
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseError}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
