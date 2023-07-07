import React from 'react';
import { View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

export default function SplashScreen() {
    const navigation = useNavigation();

    function onAnimationFinish() {
        navigation.navigate('Home');
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            <View style={{ flex: 1 }}>
                <LottieView
                    source={require('../assets/weather-icon.json')}
                    autoPlay
                    loop={false}
                    speed={3}
                    onAnimationFinish={onAnimationFinish}
                />
            </View>
        </View>
    );
}