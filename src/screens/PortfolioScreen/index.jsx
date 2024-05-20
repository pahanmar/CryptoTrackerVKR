import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useWatchlist } from '../../contexts/WatchlistContext';
import CoinItem from '../../components/CoinItem';
import { getWatchlistedCoins } from '../../services/requests';
import PortfileCoinItem from '../../components/PortfileCoinItem';

const PortfolioScreen = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const transformCoinIds = () => [ 'bitcoin', 'ethereum', 'tether' ].join('%2C');

  const fetchWatchlistedCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const watchlistedCoinsData = await getWatchlistedCoins(1, transformCoinIds());
    console.log(watchlistedCoinsData)
    setCoins(watchlistedCoinsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchWatchlistedCoins()
  }, [])

  return (
    <FlatList 
      data={coins}
      renderItem={({ item }) => <PortfileCoinItem amount={1} marketCoin={item} />}
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