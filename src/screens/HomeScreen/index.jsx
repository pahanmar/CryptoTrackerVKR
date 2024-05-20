import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";
import CoinItem from "../../components/CoinItem";
import { getMarketData } from "../../services/requests";

const HomeScreen = () => {
  const [coins, setCoins] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCoins = async (pageNumber) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData(pageNumber);

    if (!coinsData) {
      setError('Failed to fetch coin data')
      return
    }

    setCoins((existingCoins) => [...existingCoins, ...coinsData]);
    setLoading(false);
  };

  const refetchCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData();
    setCoins(coinsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  if (error.length > 0) {
    return <View>
      <Text>{error}</Text>
    </View>
  }

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={{ fontFamily: 'DroidSans', color: "white", fontSize: 25, letterSpacing: 1, paddingHorizontal: 20, paddingBottom: 5 }}>Cryptoassets</Text>
        <Text style={{color: 'lightgrey', fontSize: 12, paddingHorizontal: 10}}>Powered by CoinGecko</Text>
      </View>
      <FlatList
        data={coins}
        renderItem={({ item }) => <CoinItem marketCoin={item} />}
        onEndReached={() => fetchCoins(coins.length / 50 + 1)}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor="white"
            onRefresh={refetchCoins}
          />
        }
      />
    </View>
  );
};

export default HomeScreen;
