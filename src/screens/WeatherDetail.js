import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WeatherBG from "../assets/detailWeatherBG.jpg";
import { Box, Typography, Grid, Button } from "@mui/material";
import { CiCloudOn } from "react-icons/ci";
import { FaSun } from "react-icons/fa";
import { FaCloudRain } from "react-icons/fa";
import { FaRegSnowflake } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

const WeatherDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location?.state?.cityData) {
      navigate("/");
    }
  }, []);

  const cityData = location?.state?.cityData[0];

  const getDate = (date) => {
    const dateObj = new Date(date);
    const dayIndex = dateObj.getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = days[dayIndex];
    const dayOfMonth = dateObj.getDate();
    return `${dayOfWeek} ${dayOfMonth}`;
  };

  const inRound = (item) => {
    return Math.round(item);
  };

  const SVGType = (rainPercent, snowPercent) => {
    if (snowPercent > 50) return <FaRegSnowflake size={60} color="black" />;
    if (rainPercent < 10) return <FaSun size={60} color="gold" />;
    if (rainPercent >= 10 && rainPercent <= 50)
      return <CiCloudOn size={60} color="black" />;
    return <FaCloudRain size={60} color="black" />;
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${WeatherBG})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Button
        onClick={() => navigate("/")}
        variant="outlined"
        sx={{
          cursor: "pointer",
          position: "absolute",
          color: "white",
          top: 10,
          left: 6,
          textDecoration: "underline",
          zIndex: 2,
        }}
      >
        Go back
      </Button>
      <Typography
        sx={{
          color: "white",
          fontSize: 40,
          marginLeft: 16,
          paddingTop: 4,
          zIndex: 2,
        }}
      >
        {cityData?.city_name}, {cityData?.country_code}{" "}
        <CiLocationOn size={36} />
      </Typography>

      {/* Blur glass effect */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40%",
          backdropFilter: "blur(40px)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: 2,
          zIndex: 2,
        }}
      >
        <Grid container justifyContent="space-around" alignItems="center">
          <Grid item xs={12} md={2} textAlign="center">
            <Typography sx={{ fontSize: 60, color: "white" }}>
              {inRound(cityData?.data[0]?.temp)}°C
            </Typography>
            <Typography
              sx={{
                fontSize: 20,
                color: "white",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                borderRadius: 20,
                padding: 1,
              }}
            >
              {getDate(cityData?.data[0]?.date)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={1} textAlign="center">
            <CiCloudOn size={80} />
            <Typography sx={{ fontSize: 20 }}>
              {inRound(cityData?.data[0]?.wind_spd)} mph (wind)
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                overflowX: "auto",
              }}
            >
              {cityData?.data?.map((item, index) => (
                <React.Fragment key={index}>
                  {index !== 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        padding: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 16,
                          color: "white",
                          bgcolor: "rgba(0, 0, 0, 0.5)",
                          borderRadius: 20,
                          paddingX: 2,
                          paddingY: "4px",
                        }}
                      >
                        {getDate(item?.date).slice(0, 3)}
                      </Typography>
                      <Typography>
                        {SVGType(item?.clouds, item?.snow)}
                      </Typography>
                      <Typography sx={{ fontSize: 20, color: "black" }}>
                        {inRound(item?.temp)}°C
                      </Typography>
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default WeatherDetail;
