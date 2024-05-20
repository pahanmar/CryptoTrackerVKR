import React from "react";
import { Text, View, Image, Pressable } from 'react-native';
import styles from './styles';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


const PortfileCoinItem = ({marketCoin, amount}) => {
    const { 
        id,
        name,
        current_price, 
        price_change_percentage_24h, 
        symbol, 
        image
    } = marketCoin;

    const navigation =useNavigation();

    const percentageColor = price_change_percentage_24h < 0 ? '#ea3943' : '#16c784'

    return (
        <Pressable
            style={styles.coinContainer}
            onPress={()=>{

            }}
            >
            <Image source={{uri: image}}
                style={{
                    height: 30,
                    width: 30,
                    marginRight: 10,
                    alignSelf: "center"
                }}
            />
            <View>
                <Text style={styles.title}>{name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.text}>{symbol.toUpperCase()}</Text>
                    <AntDesign
                        name={price_change_percentage_24h < 0 ? 'caretdown' : 'caretup'}
                        size={12}
                        color={percentageColor}
                        style={{ alignSelf: 'center' }} />
                    <Text style={styles.text}>{price_change_percentage_24h.toFixed(2)}%</Text>
                </View>
            </View>
            <View style={{ marginLeft: 'auto',alignItems: 'flex-end'}}>
                <Text style={styles.title}>${amount * current_price}</Text>
                <Text style={styles.text}>{amount}</Text>
            </View>
        </Pressable>
    );
}

export default PortfileCoinItem