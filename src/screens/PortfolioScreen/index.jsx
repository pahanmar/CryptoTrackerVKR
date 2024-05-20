import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable, StyleSheet } from 'react-native';
import { useWatchlist } from '../../contexts/WatchlistContext';
import CoinItem from '../../components/CoinItem';
import { getBalance, getWatchlistedCoins } from '../../services/requests';
import PortfileCoinItem from '../../components/PortfileCoinItem';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused, useNavigation } from '@react-navigation/native';





const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    marginTop: 15
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  }
});

export async function saveToStorage(key, value) {
  await SecureStore.setItemAsync(key, value)
}

export async function getValueForToStorage(key) {
  return await SecureStore.getItemAsync(key)
}

let m = new Map()

const PortfolioScreen = () => {
  const navigation =useNavigation();
  const isFocused = useIsFocused();

  const [port, setPort] = useState([])
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0)
  const [updatedCache, setUpdatedCache] = useState(false)

  const transformCoinIds = () => [ 'bitcoin', 'ethereum', 'tether' ].join('%2C');

  const loadPort = async (cache) => {
    const data = JSON.parse(await getValueForToStorage('portfolio') ?? '[]')
    setPort(data)

    if (cache) {
      updateCache() 
    }
  }

  const updateCache = async (force) => {
    const lastUpdated = await getValueForToStorage('lastUpdated')
    const shouldUpdate = !lastUpdated || Math.abs(Date.now() - new Date(parseInt(lastUpdated))) / 36e5 > 10;

    if (!force && !shouldUpdate) return

    console.log('Updating cache', lastUpdated)

    const data = JSON.parse(await getValueForToStorage('portfolio') ?? '[]')
    const promises = []

    for (const point of data) {
      promises.push(new Promise(async (resolve, reject) => {
        point.amount = await getBalance(point.token, point.address)
        resolve()
      }))
    }

    setLoading(true)
    await Promise.all(promises)
    await saveToStorage('portfolio', JSON.stringify(data))
    await saveToStorage('lastUpdated', Date.now().toString())

    setLoading(false)
    setPort(data)

    setUpdatedCache(!!force)
  }

  useEffect(() => {
    if (!isFocused) return
    loadPort(true)
  }, [isFocused])

  const fetchWatchlistedCoins = async () => {
    const watchlistedCoinsData = await getWatchlistedCoins(1, transformCoinIds());

    for (const d of watchlistedCoinsData) {
      m.set(d.symbol, d)
    }

    setCounter(counter + 1)
  };

  useEffect(() => {
    fetchWatchlistedCoins()
  }, [])

  return (
    <View style={{ padding: 15 }}>
    { port.length == 0 && <View>
      <Text style={{ color: 'white' }}>No assets, get gut</Text>
    </View>}
    <FlatList 
      data={port}
      renderItem={({ item, index }) => <PortfileCoinItem refresh={loadPort} amount={item.amount} address={item.address} index={index} marketCoin={m.get(item.token)} />}
    />
    <Pressable style={styles.button} onPress={() => navigation.navigate("AddNewAssetScreen")}>
      <Text style={styles.text}>Add</Text>
    </Pressable>
    <Pressable style={styles.button} disabled={loading || updatedCache} onPress={() => updateCache(true)}>
      <Text style={{
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: loading || updatedCache ? 'gray' : 'white',
      }}>Update</Text>
    </Pressable>
    </View>
    
    
  )
};

export default PortfolioScreen;