import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import HandleAuth from "./pages/HandleAuth/HandleAuth";
import SearchResult from "./pages/SearchResult/SearchResult";

import "./App.css";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          {/* Home (the one with the search on) */}
          <Route path="/" element={<Home />} />

          {/* SearchPage (The results page) */}
          <Route path="search" element={<SearchResult />} />

          <Route path="oauth" element={<HandleAuth />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
