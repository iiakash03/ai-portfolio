import prisma from "../../prisma/client.js";

const getPortfolioByUserId = async (userId) => {
    try {
        console.log("Fetching portfolio for user ID:", userId); // Debugging line to check userId
        const portfolio = await prisma.holding.findMany({
            where: { userId },
        });
        return portfolio;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        throw new Error("Failed to fetch portfolio");
    }
} 

const addStockService= async (userId, stockSymbol, quantity, purchasePrice) => {
    try {
        console.log("Adding stock to portfolio for user ID:", userId, "Stock:", stockSymbol, "Quantity:", quantity, "Purchase Price:", purchasePrice); // Debugging line to check input values
        const stock = await prisma.holding.create({
            data: {
                userId,
                ticker: stockSymbol,
                quantity,
                purchasePrice,
            },
        });
        return stock;
    } catch (error) {
        console.error("Error adding stock to portfolio:", error);
        throw new Error("Failed to add stock to portfolio");
    }
}

const updateStockService = async (userId, stockSymbol, quantity, purchasePrice,stockId) => {
    try {
        console.log("Updating stock for user ID:", userId, "Stock:", stockSymbol, "Quantity:", quantity, "Purchase Price:", purchasePrice); // Debugging line to check input values
        const stock = await prisma.holding.update({
            where: { id: stockId},
            data: { quantity, purchasePrice },
        });
        return stock;
    } catch (error) {
        console.error("Error updating stock in portfolio:", error);
        throw new Error("Failed to update stock in portfolio");
    }
};

const deleteStockService = async (stockId) => {
    try {
        // Debugging line to check input values
        const stock = await prisma.holding.delete({
            where: { id: stockId },
        });
        return stock;
    } catch (error) {
        console.error("Error deleting stock from portfolio:", error);
        throw new Error("Failed to delete stock from portfolio");
    }
};  


export { getPortfolioByUserId, addStockService, updateStockService, deleteStockService };