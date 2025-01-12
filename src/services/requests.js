import Axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'
import { ethers } from "ethers";
import satoshiBitcoin from "satoshi-bitcoin";

const instance = Axios.create()
const axios = setupCache(instance)

const coingeckoApiKey = 'CG-HVRcQdbQFyLHDxFotvgU2brv'
const blockchypherApiKey = 'ba701dbfaa584e0bafd97c64a6d700b2'
const erc20Key = 'J83KEJW64MN51TFB77NT7U5FRIX61Y744W'

const printAxiosError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  console.log(error.config);
}

const debugRequest = (request) => {
  if (false) console.log(request, request.cached)
}

export const getDetailedCoinData = async (coinId) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`, {
      headers: {
        'x-cg-demo-api-key': coingeckoApiKey
      }
    })

    debugRequest(response)
    return response.data;
  } catch (e) {
    printAxiosError(e);
  }
}

export const getCoinMarketChart = async (coinId, selectedRange) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${selectedRange}&interval=daily`, {
      headers: {
        'x-cg-demo-api-key': coingeckoApiKey
      }
    })
    
    debugRequest(response)
    return response.data;
  } catch (e) {
    printAxiosError(e)
  }
}

export const getMarketData = async (pageNumber = 1) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${pageNumber}&sparkline=false&price_change_percentage=24h`, {
      headers: {
        'x-cg-demo-api-key': coingeckoApiKey
      }
    })
    
    debugRequest(response)
    return response.data;
  } catch (e) {
    printAxiosError(e)
  }
}

export const getWatchlistedCoins = async (pageNumber = 1, coinIds) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=50&page=${pageNumber}&sparkline=false&price_change_percentage=24h`, {
      headers: {
        'x-cg-demo-api-key': coingeckoApiKey
      }
    });
    
    debugRequest(response)
    return response.data;
  } catch (e) {
    printAxiosError(e);
  }
}

export const getAllCoins = async () => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/list?include_platform=false`, {
      headers: {
        'x-cg-demo-api-key': coingeckoApiKey
      }
    })
    
    debugRequest(response)
    return response.data;
  } catch (e) {
    printAxiosError(e);
  }
}

export const getCandleChartData = async (coinId, days = 1) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`, {
      headers: {
        'x-cg-demo-api-key': coingeckoApiKey
      }
    })
    
    debugRequest(response)
    return response.data;
  } catch (e) {
    printAxiosError(e);
  }
}

const contracts = {
  'usdt': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  'usdc': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
}

export const getBalance = async (symbol, address) => {
  try{
    if (symbol == 'eth' || symbol == 'btc') {
      const response = await axios.get(`https://api.blockcypher.com/v1/${symbol}/main/addrs/${address}?${blockchypherApiKey}`)
      debugRequest(response)

      const balance = response.data.balance


      if (symbol == 'eth') {
        return ethers.formatEther(balance.toString())
      } else {
        return satoshiBitcoin.toBitcoin(balance.toString())
      }
    } else {
      const contract = contracts[symbol]

      if (!contract) {
        console.log(`Unknown symbol ${symbol}`)
        return null
      }

      const response = await axios.get(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contract}&address=${address}&tag=latest&apikey=${erc20Key}`)

      const s = response.data.result.toString()
      const l = s.length

      return s.slice(0, l - 6) + '.' + s.slice(l - 6, l)
    }
  }catch (e) {
    printAxiosError(e);
  }
}