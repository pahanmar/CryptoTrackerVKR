import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useWatchlist } from '../../contexts/WatchlistContext';
import CoinItem from '../../components/CoinItem';
import { getWatchlistedCoins } from '../../services/requests';
import PortfileCoinItem from '../../components/PortfileCoinItem';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
  await SecureStore.setItemAsync(key, value)
}

async function getValueFor(key) {
  return await SecureStore.getItemAsync(key)
}

const fullNames = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'usdt': 'tether'
}

let m = new Map()

const PortfolioScreen = () => {
  const [port, setPort] = useState([])
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0)

  const transformCoinIds = () => [ 'bitcoin', 'ethereum', 'tether' ].join('%2C');

  const loadPort = async () => {
    const data = JSON.parse(await getValueFor('portfolio') ?? '[]')

    if (data.length == 0) {
      data.push({
        token: 'btc',
        address: '3AZHcgLnJL5C5xKo33mspyHpQX7x4H5bBw',
        amount: 0.05
      })
      
      data.push({
        token: 'btc',
        address: '3AZHcgLnJL5C5xKo33mspyHpQX7x4H5bBw',
        amount: 0.25
      })

      data.push({
        token: 'eth',
        address: '0x68F5a55c79CDE3BA8256d1720dbfDC435231F397',
        amount: 0.1
      })
    }

    setPort(data)
  }

  useEffect(() => {
    loadPort()
  }, [])

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
    <FlatList 
      data={port}
      renderItem={({ item }) => <PortfileCoinItem amount={item.amount} marketCoin={m.get(item.token)} />}
      refreshControl={
        <RefreshControl 
          refreshing={loading}
          tintColor="white"
          onRefresh={fetchWatchlistedCoins}
        />
      }
    />
  )
};

export default PortfolioScreen;