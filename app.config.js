import "dotenv/config";

export default () => ({
    expo: {
      name: "weather-app",
      slug: "weather-app",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      ios: {
        "supportsTablet": true
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        package: "com.kevin0129.weatherapp"
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      extra: {
        apikey: process.env.API_KEY
      },
      runtimeVersion: {
        policy: "appVersion"
      },
    }
});