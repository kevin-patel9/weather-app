import { Box, Button, TextField, Typography } from "@mui/material";
import WeatherBG from "../assets/weatherBG.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const WeatherSearch = () => {
  const [cityName, setCityName] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [error, setError] = useState("");
  const [cityData, setCityData] = useState([]);
  const [alreadySearchData, setAlreadySearchData] = useState([{}]);

  useEffect(() => {
    // if we have already searched the city, reuse previous data
    const THIRTY_MINUTES = 30 * 60 * 1000;

    const currentTime = new Date();

    const filteredData = alreadySearchData.filter((item) => {
      // Check if the city name matches partially and the data is not older than 30 minutes
      const cityNameLowerCase = cityName.toLowerCase();

      const isMatchingCity = item?.data?.city_name
        ?.toLowerCase()
        .includes(cityNameLowerCase);

      const isWithin30Minutes =
        currentTime - new Date(item?.fetchTime) <= THIRTY_MINUTES;

      return isMatchingCity && isWithin30Minutes;
    });

    if (filteredData.length !== 0) {
      setCityData(filteredData);
    } else if (cityName) {
      const getResponse = async () => {
        try {
          const response = await axios.get(
            `https://api.weatherbit.io/v2.0/history/energy?city=${cityName},IN&start_date=2024-03-2&end_date=2024-03-12&threshold=63&units=I&key=8ff6b1c427824112b02b9f92f1485bbb&tp=daily`
          );
          setCityData([response.data]);
          setAlreadySearchData((prev) => [
            ...prev,
            { data: response.data, fetchTime: new Date() },
          ]);
        } catch (error) {
          setError("Failed to fetch data");
        }
      };
      getResponse();
    }
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
          onChange={(e) => setCityName(e.target.value)}
          id="outlined-basic"
          label="Enter a city"
          variant="outlined"
          sx={{
            background: "white",
            input: {
              color: "black",
              borderBottom: "1px solid black",
            },
            width: "120%",
            marginBottom: 2,
          }}
        />
        <Button
          onClick={() => setRefetch(!refetch)}
          variant="outlined"
          sx={{
            borderColor: "white",
            color: "black",
            width: "12rem",
          }}
        >
          Get Weather
        </Button>
        <Link to="/weatherDetails" state={{ cityData }}>
          {/* Moved the Link outside of the Button */}
        </Link>
      </Box>
    </Box>
  );
};

export default WeatherSearch;
