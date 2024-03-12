import { BrowserRouter, Route, Routes } from "react-router-dom";
import WeatherSearch from "./screens/WeatherSearch";
import WeatherDetail from "./screens/WeatherDetail";
import "./App.css";
import { createContext, useState } from "react";

export const Weather = createContext();

const App = () => {
  const [alreadySearchData, setAlreadySearchData] = useState([]);

  return (
    <Weather.Provider value={{ alreadySearchData, setAlreadySearchData }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WeatherSearch />} />
          <Route path="/weatherDetails" element={<WeatherDetail />} />
        </Routes>
      </BrowserRouter>
    </Weather.Provider>
  );
};

export default App;
