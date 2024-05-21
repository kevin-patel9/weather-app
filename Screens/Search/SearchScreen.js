import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, SafeAreaView, View, ScrollView, FlatList, TouchableOpacity } from "react-native";
import { getWeatherDetails } from "../../Api/WeatherApi";
import { CityList, selectedLocality } from "../../common/localityList";
import { Dropdown } from "react-native-element-dropdown";
import { dateConversion, dayTime } from "./components/DateConversion";
import { Feather, Ionicons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";

const SearchScreen = () => {
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedArea, setSelectedArea] = useState({ label: "", value: "", localityId: "" });
    const [weatherToShow, setWeatherToShow] = useState();
    const [storePrevWeather, setStorePrevWeather] = useState([]);
    const [connection, setConnection] = useState(false);
    const [day] = useState(dayTime());

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setConnection(state.isConnected);
        });

        return () => {
            unsubscribe();
        }
    },[]);

    const fetchWeatherData = useCallback(async () => {
        if (!selectedArea?.localityId) return;
    
        // Check if the locality has been searched before
        const cachedData = storePrevWeather.find(
            data => data.localityId === selectedArea?.localityId
        );
    
        if (cachedData) {
            setWeatherToShow(cachedData);
            return;
        }
    
        // Fetch new data if the locality Id has not been searched before
        const response = await getWeatherDetails(selectedArea?.localityId);
        const newResponse = {
            ...response,
            localityId: selectedArea?.localityId,
            currentDate: new Date(),
            city: selectedCity?.label
        };
    
        setWeatherToShow(newResponse);
        // cache the previous searched data
        setStorePrevWeather([...storePrevWeather, newResponse]);
    
        // Set a timeout to remove the cached data after 4 minutes
        setTimeout(() => {
            setStorePrevWeather(prevState =>
                prevState.filter(data => data.localityId !== selectedArea?.localityId)
            );
        }, 4 * 60 * 1000);
    }, [selectedArea]);

    // trigger if locality area selected
    useEffect(() => {
        if (selectedArea?.localityId)
            fetchWeatherData();
    }, [selectedArea, fetchWeatherData]);

    // get the area list of selected city
    const objList = selectedLocality[selectedCity?._index];
    const LocalityList = objList && Object.values(objList);

    const selectedAreaName = selectedArea?.label;

    return (
        <SafeAreaView style={styles.screenTexture}>
            <StatusBar backgroundColor="#100f19" />
            {!connection &&
                <View style={styles.banner}>
                    <Text style={styles.text}>Connection lost</Text>
                </View>
            }
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Dropdown
                    style={styles.cityDropdownField}
                    data={CityList}
                    search
                    searchPlaceholder="Search..."
                    fontFamily={"poppinsRegular"}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select City"
                    value={CityList}
                    onChange={(item) => {
                        setSelectedCity(item);
                    }}
                    renderSelectedItem={(item, unSelect) => (
                        <TouchableWithoutFeedback onPress={() => unSelect && unSelect(item)}>
                            <View>
                                <Text style={styles.text}>{item.label}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />
                {LocalityList?.length > 0 &&
                    <Dropdown
                        style={styles.localAreaField}
                        data={LocalityList[0]}
                        fontFamily={"poppinsRegular"}
                        search
                        searchPlaceholder="Search..."
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select the area"
                        value={LocalityList[0]}
                        onChange={(item) => {
                            setSelectedArea(item);
                        }}
                        renderSelectedItem={(item, unSelect) => (
                            <TouchableWithoutFeedback onPress={() => unSelect && unSelect(item)}>
                                <View>
                                <Text style={styles.text}>{item.label}</Text>
                                <Entypo name="cross" size={16} color="white" />
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    />
                }
                <Text style={{ color: "white", fontFamily: "poppinsMedium" }}>
                    {weatherToShow?.city}
                </Text>
                <Text style={[styles.headerText, 
                        { 
                            marginBottom: 20, color: "white", fontFamily: "poppinsMedium"
                        }
                    ]}
                    >
                    {selectedAreaName?.length > 19 ? 
                        <>{selectedAreaName?.slice(0, 18)}...</>
                        :
                        selectedAreaName
                    }
                </Text>

                <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
                    <Text style={[styles.text, { fontSize: 60 }]}>
                        {Math.ceil(weatherToShow?.locality_weather_data?.temperature) || 0}
                    </Text>
                    <View>
                        <Text style={[styles.text, styles.headerText]}>°C</Text>
                        <Text style={[styles.text, styles.headerText]}>Fog</Text>
                    </View>
                </View>
                <Text style={styles.text}>{dateConversion()}</Text>

                <FlatList
                    data={day}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ gap: 20, paddingVertical: 16 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ color: "white", marginBottom: 16 }}>{item}</Text>
                            {item.includes("am") ? (
                                <Feather name="sun" size={20} color="#ffd83d" />
                            ) : (
                                <Ionicons name="moon" size={20} color="#ffd83d" />
                            )}
                        </View>
                    )}
                />
                <View style={{ borderWidth: 0.2, borderColor: "grey" }} />

                <View style={{ marginTop: 20 }}>
                    <Text style={styles.text}>Weather details</Text>
                    {weatherToShow?.locality_weather_data?.temperature ? 
                    <>
                        <View style={styles.weatherDetails}>
                            <View>
                                <Text style={[styles.titleText, styles.centerText]}>Feels Like</Text>
                                <Text style={[styles.weatherValueText, styles.text, styles.centerText]}>
                                    {Math.ceil(2+weatherToShow?.locality_weather_data?.temperature)}°C
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.titleText, styles.centerText]}>Humidity</Text>
                                <Text style={[styles.weatherValueText, styles.text, styles.centerText]}>
                                    {Math.floor(weatherToShow?.locality_weather_data?.humidity)}%
                                </Text>
                            </View>
                        </View>
                        <View style={styles.weatherDetails}>
                            <View>
                                <Text style={[styles.titleText, styles.centerText]}>Wind direction</Text>
                                <Text style={[styles.weatherValueText, styles.text, styles.centerText]}>
                                    {weatherToShow?.locality_weather_data?.wind_direction}%
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.titleText, styles.centerText]}>
                                    Wind speed
                                </Text>
                                <Text style={[styles.weatherValueText, styles.text, styles.centerText]}>
                                    {weatherToShow?.locality_weather_data?.wind_speed} m/s
                                </Text>
                            </View>
                        </View>
                    </>
                    :
                        <Text style={styles.fetchStatusText}>
                            Data Not Available to Fetch
                        </Text>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    screenTexture: {
        paddingTop: 56, 
        padding: 20, 
        flex: 1, 
        backgroundColor: "#100f19"
    },
    headerText: {
        fontSize: 30,
    },
    titleText: {
        color: "lightgrey"
    },  
    text: {
        color: "white",
        fontFamily: "poppinsRegular"
    },
    centerText: {
        textAlign: "center"
    },
    fetchStatusText: {
        fontSize: 24, 
        textAlign: "center", 
        fontFamily: "poppinsBold", 
        color: "white",
        marginTop: 40
    },
    weatherValueText: {
        fontSize: 26
    },
    weatherDetails: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    cityDropdownField: {
        height: 46,
        borderWidth: 1, 
        paddingLeft: 8, 
        borderRadius: 8, 
        backgroundColor: "white"
    },
    localAreaField: { 
        borderWidth: 1, 
        paddingLeft: 8, 
        borderRadius: 8, 
        marginVertical: 20, 
        backgroundColor: "white"  ,
        height: 46
    },
    banner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ff4444',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 18,
    }
})
