import {
    StyleSheet,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    KeyboardAvoidingView, BackHandler
} from "react-native";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import AnimatedLoader from "react-native-animated-loader";
import {debounce} from "lodash";
import {fetchLocations, fetchWeatherForecast} from "../utils/weather";
import {getData, storeData} from '../utils/storage';
import {theme} from '../utils/thene';
import {weatherImages} from '../constant/constant';

export default function HomeScreen() {
    const [showSearch, toggleSearch] = useState(false);
    const [loading, setLoading] = useState(true)
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({})
    const {location, current} = weather;

    const handleLocation = loc => {
        setLoading(true);
        toggleSearch(false);
        setLocations([]);
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            setLoading(false);
            setWeather(data);
            storeData('city', loc.name);
        })
    }

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        fetchMyWeatherData();
    }, []);

    const fetchMyWeatherData = async () => {
        let myCity = await getData('city');
        let cityName = 'Minsk';
        if (myCity) {
            cityName = myCity;
        }
        fetchWeatherForecast({
            cityName,
            days: '7'
        }).then(data => {
            setWeather(data);
            setLoading(false);
        })

    }
    const handleSearch = search => {
        if (search && search.length > 2)
            fetchLocations({cityName: search}).then(data => {
                setLocations(data);
            })
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

    return (
        <View className="flex-1 relative bg-blue-400">
            <StatusBar barStyle="light-content"/>
            {loading ? <View className="flex-1 flex-row justify-center items-center">
                <AnimatedLoader
                    overlayColor={theme.bgWhite(0.75)}
                    source={require("../assets/loader.json")}
                    visible={true}
                    animationStyle={styles.lottie}
                />
            </View> : <KeyboardAvoidingView style={{flex: 1}} behavior="height" keyboardVerticalOffset={-200}>
                <View style={{height: '10%'}} className="mx-6 mt-4 relative z-50">
                    <View
                        className="flex-row justify-end items-center rounded-full"
                        style={{backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent'}}>
                        {
                            showSearch ? (
                                <TextInput
                                    onChangeText={handleTextDebounce}
                                    placeholder="Search city"
                                    placeholderTextColor={'lightgray'}
                                    className="pl-6 h-10 pb-1 flex-1 text-base text-black"
                                />
                            ) : null
                        }
                        <TouchableOpacity
                            onPress={() => toggleSearch(!showSearch)}
                            className="rounded-full p-3 m-1"
                            style={{backgroundColor: theme.bgWhite(0.3)}}>
                            {
                                showSearch ? (
                                    <Image
                                        source={require('../assets/close.png')}
                                        style={{ width: 20, height: 20 }}
                                    />
                                ) : (
                                    <Image
                                        source={require('../assets/search.png')}
                                        style={{ width: 20, height: 20 }}
                                    />
                                )
                            }
                        </TouchableOpacity>
                    </View>

                    {
                        locations.length > 0 && showSearch ? (
                            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl ">
                                {
                                    locations.map((loc, index) => {
                                        let showBorder = index + 1 !== locations.length;
                                        let borderClass = showBorder ? ' border-b-2 border-b-gray-400' : '';
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => handleLocation(loc)}
                                                className={"flex-row items-center border-0 p-3 px-4 mb-1 " + borderClass}>

                                                <Text
                                                    className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        ) : null
                    }

                </View>

                <View className="mx-4 flex justify-around flex-1 mb-4">
                    <View className="flex">
                        <Text className="text-white text-center text-3xl font-bold">
                            {location?.name}
                        </Text>
                        <Text className="text-xs text-center font-semibold text-gray-300">
                            {location?.country}
                        </Text>
                    </View>
                    <View className="flex-row justify-center">
                        <Image
                            source={weatherImages[current?.condition?.text || 'other']}
                            className="w-52 h-52"/>

                    </View>

                    <View className="space-y-0">
                        <Text className="text-center font-bold text-white text-6xl ml-5">
                            {current?.temp_c}&#8451;
                        </Text>
                        <Text className="text-center text-white text-xl tracking-widest">
                            {current?.condition?.text}
                        </Text>
                    </View>

                    <View className="flex-row justify-between mx-4">
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require('../assets/weather-icons/wind.png')} className="w-6 h-6"/>
                            <Text className="text-white font-semibold text-base">{current?.wind_kph}km</Text>
                        </View>
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require('../assets/weather-icons/drop.png')} className="w-6 h-6"/>
                            <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
                        </View>
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require('../assets/weather-icons/sun.png')} className="w-6 h-6"/>
                            <Text className="text-white font-semibold text-base">
                                {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                            </Text>
                        </View>

                    </View>
                </View>

                <View className="mb-2 space-y-3">
                    <View className="flex-row items-center mx-5 space-x-2">
                        <Text className="text-white text-base">Daily forecast</Text>
                    </View>
                    <ScrollView
                        horizontal
                        contentContainerStyle={{paddingHorizontal: 15}}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            weather?.forecast?.forecastday?.map((item, index) => {
                                const date = new Date(item.date);
                                const options = {weekday: 'long'};
                                let dayName = date.toLocaleDateString('en-US', options);
                                dayName = dayName.split(',')[0];

                                return (
                                    <View
                                        key={index}
                                        className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                                        style={{backgroundColor: theme.bgWhite(0.15)}}
                                    >
                                        <Image
                                            // source={{uri: 'https:'+item?.day?.condition?.icon}}
                                            source={weatherImages[item?.day?.condition?.text || 'other']}
                                            className="w-11 h-11"/>
                                        <Text className="text-white">{dayName}</Text>
                                        <Text className="text-white text-xl font-semibold">
                                            {item?.day?.avgtemp_c}&#176;
                                        </Text>
                                    </View>
                                )
                            })
                        }

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>}
        </View>

    );
}

const styles = StyleSheet.create({
        lottie: {
            width: 100,
            height: 100
        }
    })
;
