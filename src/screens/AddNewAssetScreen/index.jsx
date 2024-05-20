import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";
import styles from "./styles";
import { useRecoilState } from "recoil";
import { allPortfolioBoughtAssetsInStorage } from "../../atoms/PortfolioAssets";
import { getAllCoins, getBalance, getDetailedCoinData } from "../../services/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import uuid from 'react-native-uuid';
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { getValueForToStorage, saveToStorage } from "../PortfolioScreen";

const AddNewAssetScreen = () => {
  const [text, onChangeText] = React.useState('');
  const [token, setToken] = React.useState('btc');
  const navigation = useNavigation()
  const tokens = ['btc', 'eth', 'usdt']

  return (
    <SafeAreaView style={{
      padding: 15
    }}>
      <SegmentedControl
        values={tokens}
        selectedIndex={tokens.indexOf(token)}
        onChange={(event) => {
          setToken(tokens[event.nativeEvent.selectedSegmentIndex])
        }}
      />
      
      <TextInput
        placeholder='Address'
        onChangeText={onChangeText}
        value={text}
        style={{
          height: 40,
          borderWidth: 1,
          padding: 10,
          backgroundColor: 'white',
          borderRadius: 5,
          marginTop: 15
        }}
      />
        
      <Pressable style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 15,
        borderRadius: 5,
        elevation: 3,
        backgroundColor: 'black',
      }} onPress={async () => {
        if (text.length == 0) return

        const value = await getBalance(token, text)

        if (!isNaN(value)) {
          Alert.alert(
            'Is this correct',
            `This address has ${value} of ${token.toUpperCase()}\nAdd it?`,
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

                  data.push({
                    token: token,
                    address: text,
                    amount: value
                  })

                  await saveToStorage('portfolio', JSON.stringify(data))
                  navigation.goBack()
                }
              }
            ],
            {
              cancelable: true,
              onDismiss: () => {},
            },
          );

          return
        }

        alert('Invalid address')
      }}>
        <Text style={{
          fontSize: 16,
          lineHeight: 21,
          fontWeight: 'bold',
          letterSpacing: 0.25,
          color: 'white',
        }}>Add {token.toUpperCase()}</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default AddNewAssetScreen;
