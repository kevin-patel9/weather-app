import { BrowserRouter, Route, Routes } from "react-router-dom";
import WeatherSearch from "./screens/WeatherSearch";
import WeatherDetail from "./screens/WeatherDetail";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WeatherSearch />} />
        <Route path="/weatherDetails" element={<WeatherDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
