import { Box, Button, TextField, Typography } from "@mui/material";
import WeatherBG from "../assets/weatherBG.jpg";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Weather } from "../App";

const WeatherSearch = () => {
  const [cityName, setCityName] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const { alreadySearchData, setAlreadySearchData } = useContext(Weather);
  const navigate = useNavigate();

  useEffect(() => {
    const THIRTY_MINUTES = 30 * 60 * 1000;
    const currentTime = new Date();

    const filteredData = alreadySearchData.filter((item) => {
      const cityNameLowerCase = cityName.toLowerCase();
      const isMatchingCity = item?.data?.city_name
        ?.toLowerCase()
        .includes(cityNameLowerCase);
      const isWithin30Minutes =
        currentTime - new Date(item?.fetchTime) <= THIRTY_MINUTES;
      return isMatchingCity && isWithin30Minutes;
    });

    if (cityName && filteredData.length !== 0) {
      setLoader(true);
      navigate("/weatherDetails", {
        state: { cityData: [filteredData[0].data] },
      });
      setLoader(false);
    } else if (cityName) {
      const getResponse = async () => {
        setLoader(true);
        try {
          // can hide the url in env
          const response = await axios.get(
            `https://api.weatherbit.io/v2.0/history/energy?city=${cityName}&start_date=2024-03-5&end_date=2024-03-12&threshold=63&units=M&key=8ff6b1c427824112b02b9f92f1485bbb&tp=daily`
          );
          const newData = { data: response.data, fetchTime: new Date() };
          setAlreadySearchData((prev) => [...prev, newData]);
          navigate("/weatherDetails", {
            state: { cityData: [response.data] },
          });
        } catch (error) {
          console.error("Failed to fetch data:", error);
          setError("Failed to fetch data");
        }
        setLoader(false);
      };
      getResponse();
    }else if (!cityName && refetch)
      setError("Please enter city name")

  }, [refetch]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${WeatherBG})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          top: 40,
          left: "52%",
          transform: "translateX(-50%)",
          fontSize: 42,
          fontWeight: 800,
        }}
      >
        Weather Forecast
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          onChange={(e) => {
            setCityName(e.target.value);
            setError("");
          }}
          id="outlined-basic"
          placeholder="Enter a city"
          variant="outlined"
          sx={{
            background: "white",
            input: {
              color: "black",
              borderBottom: "1px solid black",
            },
            width: "140%",
          }}
        />
        {error && (
          <Typography
            sx={{
              fontSize: "12px",
              color: "#800000",
              fontWeight: "600",
              width: "120%",
            }}
          >
            {error}
          </Typography>
        )}
        <Button
          onClick={() => {
            setRefetch(!refetch);
            setError("");
          }}
          variant="outlined"
          sx={{
            borderColor: "white",
            color: "black",
            width: "12rem",
            marginTop: 2,
          }}
        >
          Get Weather
        </Button>

        {loader && (
          <Box
            sx={{ display: "flex", gap: 4, alignItems: "center", marginTop: 2 }}
          >
            <CircularProgress color="inherit" />
            <Typography>Fetching data...</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WeatherSearch;
