import React from "react";
import { Text, View, Image, Pressable } from 'react-native';
import styles from './styles';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


const CoinItem = ({marketCoin}) => {
    const { 
        id,
        name,
        current_price, 
        market_cap_rank, 
        price_change_percentage_24h, 
        symbol, 
        market_cap,
        image
    } = marketCoin;

    const navigation =useNavigation();

    const percentageColor = price_change_percentage_24h < 0 ? '#ea3943' : '#16c784'

    const normalSizeMarketCap = (market_cap) =>{
        if (market_cap > 1_000_000_000_000){
            return `${Math.floor(market_cap/1_000_000_000_000)} T`
        } if (market_cap > 1_000_000_000){
            return `${Math.floor(market_cap/1_000_000_000)} B`
        } if (market_cap > 1_000_000){
            return `${Math.floor(market_cap/1_000_000)} M`
        }
        if (market_cap > 1_000){
            return `${Math.floor(market_cap/1_000)} K`
        } 
        return 10
    };
    return (
        <Pressable
            style={styles.coinContainer}
            onPress={()=>navigation.navigate("CoinDetailedScreen", {coinId:id})}
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
                    <View style={styles.rankContainer}>
                        <Text style={styles.rank}>{market_cap_rank}</Text>
                    </View>
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
                <Text style={styles.title}>{current_price}</Text>
            <Text style={styles.text}> MCap {normalSizeMarketCap(market_cap)}</Text>
            </View>
        </Pressable>
    );
}

export default CoinItem