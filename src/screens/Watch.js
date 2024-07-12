import react from "react";
import { SafeAreaView, View,Text, StyleSheet, StatusBar} from "react-native";
import { ImageBackground } from "react-native";
import {Feather} from '@expo/vector-icons'
import IconText from "../../src/components/IconText";
import moment from "moment";
const Watch = ({watchData}) =>{
    const {container, cityName, cityText, imageLayout}= styles
    const {height,fullName,age}= watchData
    return (
        <SafeAreaView style= { container}>
            <ImageBackground 
            source = {require('../../assets/city.jpg')}
            style={ imageLayout}>

                <Text style= {[ cityName, cityText]}>{age}</Text>
                <Text style= {[ cityName, cityText]}>{fullName}</Text>
                <Text style= {[ cityName, cityText]}>{height}</Text>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        
    },
    imageLayout:{
        flex:1
    },
    cityName:{
        fontSize: 40,

    },
    countryName:{  
        fontSize: 40,
    },
    cityText:{
        justifyContent: 'center',
        alignSelf: 'center',
        fontWeight:'bold',
        color:'white'

    },
    populationWrapper:{
        justifyContent: 'center',
        marginTop: 30,
    },
    populationText:{
        fontSize:25,
        marginLeft:7.5,
        color: 'red',
        
    },
    riseSetWrapper:{
        justifyContent:'space-around',
        marginTop: 30
    },
    riseSetText:{
        fontSize: 20,
        color: 'white',
    },
    rowLayout:{
        flexDirection: 'row',   
        alignItems:'center'
    }

})
export default Watch