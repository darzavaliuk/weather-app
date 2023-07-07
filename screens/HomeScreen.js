import {StatusBar, Text, View} from "react-native";
import * as React from "react";
import {useState} from "react";

export default function HomeScreen() {
    const [loading, setLoading] = useState(true)

    return (
        <View className="flex-1 relative">
            <StatusBar style="dark"/>
            {loading ? <Text>Loading</Text> : <Text>Not Loading</Text>}
        </View>
    );
}
