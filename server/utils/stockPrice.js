import dotenv from 'dotenv'
dotenv.config();
import axios from 'axios';


const getLivePrice = async (ticker) => {
    try {
        console.log("Fetching live price for ticker:", ticker);
        const response = await axios(`https://api.twelvedata.com/price?symbol=${ticker}&apikey=63e4ae1a77f74c9e9f857be35e333bcb`);
        console.log(response.data.price)
        return response.data.price;
    } catch (error) {
        console.error("Error fetching live stock price:", error);
        throw error;
    }
}

// Utility to get prices for multiple tickers
export const getMultiplePrices = async (tickers) => {
    const pricePromises = tickers.map(ticker => getLivePrice(ticker));
    return Promise.all(pricePromises);
}


export default getLivePrice;
