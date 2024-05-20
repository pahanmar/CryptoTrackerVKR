import React, { Suspense, useEffect, useState } from "react";
import { View, Text } from "react-native";
import PortfolioAssetsList from "./components/PortfolioAssetsList";
import{getBalance} from '../../services/requests'

const PortfolioScreen = () => {
  const [ balance, setBalance ] = useState(null)

  const fetchBalance = async () => {
    const balanceInfo = await getBalance('btc', '3AZHcgLnJL5C5xKo33mspyHpQX7x4H5bBw');
    if (!balanceInfo) return

    setBalance(balanceInfo)
  };

  useEffect(() => {
    fetchBalance()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View>

        <Text style={{color:"white", padding: 20}}>Balance: {balance}</Text>
      </View>
    </View>
  );
};

export default PortfolioScreen;
