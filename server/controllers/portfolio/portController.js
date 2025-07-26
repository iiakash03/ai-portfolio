import {getPortfolioByUserId,addStockService,updateStockService,deleteStockService} from '../../services/portfolio/portService.js';
import { getMultiplePrices } from '../../utils/stockPrice.js';



const getPortFolio = async (req, res) => {
    try{
        const userId=req.user.id; // Assuming req.user is set by isAuthenticated middleware
        const portfolio = await getPortfolioByUserId(userId);
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
        const tickers=portfolio.map(stock => stock.ticker);
        const prices = await getMultiplePrices(tickers);

        console.log("Prices fetched for tickers:", tickers, "Prices:", prices); // Debugging line to check fetched prices

        portfolio.forEach((stock, index) => {
            stock.currentPrice = prices[index];
            stock.currentValue = stock.quantity * prices[index];
            stock.pnl= (prices[index] - stock.purchasePrice) * stock.quantity;
        });

        console.log("Portfolio fetched successfully:", portfolio); // Debugging line to check portfolio data

        res.status(200).json(portfolio);
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const addStockController = async (req, res) => {
    try {
        const { ticker, quantity, purchasePrice} = req.body;
        const userId = req.user.id; // Assuming req.user is set by isAuthenticated middleware

        console.log("Adding stock for user ID:", userId, "Stock:", ticker, "Quantity:", quantity, "Purchase Price:", purchasePrice); // Debugging line to check input values

        // Validate input
        if (!ticker || !quantity) {
            return res.status(400).json({ message: "Stock symbol and quantity are required" });
        }

        await addStockService(userId, ticker, quantity, purchasePrice);

        res.status(200).json({ message: "Stock added successfully" });
    } catch (error) {
        console.error("Error adding stock:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateStockController = async (req, res) => {
    try {
        const stockId = req.params.id; // Assuming the stock ID is passed in the URL
        const { ticker, quantity, purchasePrice } = req.body;
        const userId = req.user.id; // Assuming req.user is set by isAuthenticated middleware

        console.log("Updating stock for user ID:", userId, "Stock:", ticker, "Quantity:", quantity, "Purchase Price:", purchasePrice); // Debugging line to check input values

        await updateStockService(userId, ticker, quantity, purchasePrice,stockId);

        res.status(200).json({ message: "Stock updated successfully" });
    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteStockController = async (req, res) => {
    try {
        const stockId = req.params.id; // Assuming the stock ID is passed in the URL
        const { ticker } = req.body;
        const userId = req.user.id; // Assuming req.user is set by isAuthenticated middleware  
        console.log("Deleting stock for user ID:", userId, "Stock:", ticker); // Debugging line to check input values
        await deleteStockService(stockId);
        res.status(200).json({ message: "Stock deleted successfully" });
    } catch (error) {
        console.error("Error deleting stock:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const insightsController = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming req.user is set by isAuthenticated middleware
        const portfolio = await getPortfolioByUserId(userId);
        if (!portfolio || portfolio.length === 0) {
            return res.status(404).json({ message: "Portfolio not found or empty" });
        }
        const insights = await generateInsights(portfolio);
        res.status(200).json({ insights });
    } catch (error) {
        console.error("Error generating insights:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export { getPortFolio, addStockController, updateStockController, deleteStockController, insightsController };