import react from "react"
import {View, Text} from 'react-native'
import {Feather} from '@expo/vector-icons'

const RowText= (props) =>{
    const {messageOne, messageTwo, containerStyles, messageOneStyles, messageTwoStyles}=props
    return(
        <View style= {containerStyles}>
            <Text style={messageOneStyles}>{messageOne}</Text>
            <Text style={messageTwoStyles}>{messageTwo}</Text>
        </View>
    )
}


export default RowText