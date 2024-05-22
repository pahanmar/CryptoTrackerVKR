import React from "react";
import { Text, View, Image, Pressable, Alert } from 'react-native';
import styles from './styles';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { getValueForToStorage, saveToStorage } from "../../screens/PortfolioScreen";

function capDigits(n) {
    return Math.floor(n * 1000000) / 1000000
}

const PortfileCoinItem = ({marketCoin, amount, address, index, refresh}) => {
    if (!marketCoin) return <View></View>

    const { 
        name,
        current_price, 
        price_change_percentage_24h, 
        symbol, 
        image
    } = marketCoin;

    const navigation =useNavigation();

    const percentageColor = price_change_percentage_24h < 0 ? '#ea3943' : '#16c784'

    const totalBalance = () =>{
        console.log(capDigits(parseFloat(amount) * current_price))
        return capDigits(parseFloat(amount) * current_price)
    }
    return (
        <Pressable
            style={styles.coinContainer}
            onPress={()=>{
                Alert.alert(
                    'Delete this address',
                    'Are you sure?',
                    [
                      {
                        text: 'No',
                        onPress: () => {
        
                        },
                        style: 'cancel',
                      },
                      {
                        text: 'Yes',
                        onPress: async () => {
                          const data = JSON.parse(await getValueForToStorage('portfolio') ?? '[]')
                        
                          data.splice(index, 1)
                          await saveToStorage('portfolio', JSON.stringify(data))
                          refresh()
                        }
                      }
                    ],
                    {
                      cancelable: true,
                      onDismiss: () => {},
                    },
                  );
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
                <Text style={styles.title}>${capDigits(parseFloat(amount) * current_price) }</Text>
                <Text style={styles.text}>{capDigits(amount)}</Text>
            </View>
        </Pressable>
    );
}

export default PortfileCoinItem