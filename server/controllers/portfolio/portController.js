import {getPortfolioByUserId,addStockService} from '../../services/portfolio/portService.js';



const getPortFolio = async (req, res) => {
    try{
        const userId=req.user.id; // Assuming req.user is set by isAuthenticated middleware
        const portfolio = await getPortfolioByUserId(userId);
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
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

export { getPortFolio, addStockController };