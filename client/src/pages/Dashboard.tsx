import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Plus, LogOut, DollarSign, BarChart3 } from "lucide-react";
import { AddHoldingDialog } from "@/components/AddHoldingDialog";
import { HoldingsTable } from "@/components/HoldingsTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiInsights } from "@/components/AiInsights"; // Assuming you have an AI insights component

// Mock data - replace with real data from your backend

interface NewHolding {
	ticker: string;
	quantity: number;
	purchasePrice: number;
    currentPrice?: number; // Optional, can be set later
    createdAt?: string; // Optional, can be set later
}

interface Holding extends NewHolding {
  id: string;
  createdAt: string;
  currentPrice: number;
}

const Dashboard = () => {

    const navigate = useNavigate();
    const [showInsights, setShowInsights] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
	const [holdings, setHoldings] = useState<Holding[]>([]);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    useEffect(() => {
        
        if (!localStorage.getItem("token")) {
            toast("You are not logged in Please log in to access your dashboard");
            navigate("/");
        }

        setIsLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/portfolio/getportfolio`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => {
            if (res.status === 200) {
                // Assuming the response contains an array of holdings
                setHoldings(res.data);
            } else {
                toast("Failed to fetch portfolio data Please try again later");
            }
        })
        .catch((error) => {
            console.error("Error fetching portfolio data:", error);
            toast("Error fetching portfolio data Please try again later");
        }).finally(() => {
            setIsLoading(false);
        });

    }, []);


	// Calculate portfolio metrics
	const totalValue = holdings.reduce(
		(sum, holding) => sum + holding.quantity * (holding.currentPrice ?? 0),
		0
	);

	const totalCost = holdings.reduce(
		(sum, holding) => sum + holding.quantity * holding.purchasePrice,
		0
	);

	const totalGainLoss = totalValue - totalCost;
	const totalGainLossPercent =
		totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

	const handleAddHolding = (newHolding: NewHolding) => {
		const holding = {
			...newHolding,
			currentPrice: newHolding.purchasePrice, // Mock current price same as purchase
		};

		

        axios
        .post(`${import.meta.env.VITE_API_URL}/portfolio/addStock`, holding, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => {
            if (res.status === 200) {
            setHoldings((prev) => [
                ...prev,
                { ...holding, id: res.data.id, createdAt: res.data.createdAt },
            ]);
            toast(`Holding successfully added: ${newHolding.ticker}`);
            } else {
            toast("Failed to add holding. Please try again later.");
            }
        })
        .catch((error) => {
            console.error("Error adding holding:", error);
            toast("Error adding holding. Please try again later.");
        });

        setIsAddDialogOpen(false);
    }

	const handleDeleteHolding = (id: string) => {
        axios
            .delete(`${import.meta.env.VITE_API_URL}/portfolio/deleteStock/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }, 
            })
            .then((res) => {
                if (res.status === 200) {
                    setHoldings((prev) => prev.filter((h) => h.id !== id));
                    toast("Holding successfully removed from portfolio");
                } else {
                    toast("Failed to remove holding. Please try again later.");
                }
            })
            .catch((error) => {
                console.error("Error removing holding:", error);
                toast("Error removing holding. Please try again later.");
            }
        );
	};

	const handleLogout = () => {
		toast("Logged out You have been successfully logged out");
		// TODO: Implement actual logout logic
        localStorage.removeItem("token");
        
        navigate("/")
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
			{/* Header */}
			<div className="border-b bg-card">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="bg-primary rounded-full p-2">
								<TrendingUp className="h-5 w-5 text-primary-foreground" />
							</div>
							<h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
						</div>
						<Button variant="outline" onClick={handleLogout}>
							<LogOut className="h-4 w-4 mr-2" />
							Logout
						</Button>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				{/* Portfolio Overview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Portfolio Value
							</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								$
								{totalValue.toLocaleString("en-US", {
									minimumFractionDigits: 2,
								})}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Gain/Loss
							</CardTitle>
							{totalGainLoss >= 0 ? (
								<TrendingUp className="h-4 w-4 text-green-600" />
							) : (
								<TrendingDown className="h-4 w-4 text-red-600" />
							)}
						</CardHeader>
						<CardContent>
							<div
								className={`text-2xl font-bold ${
									totalGainLoss >= 0
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								$
								{Math.abs(totalGainLoss).toLocaleString("en-US", {
									minimumFractionDigits: 2,
								})}
							</div>
							<Badge
								variant={
									totalGainLoss >= 0 ? "secondary" : "destructive"
								}
								className="mt-1"
							>
								{totalGainLoss >= 0 ? "+" : ""}
								{totalGainLossPercent.toFixed(2)}%
							</Badge>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Holdings</CardTitle>
							<BarChart3 className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{holdings.length}</div>
							<p className="text-xs text-muted-foreground">
								Active positions
							</p>
						</CardContent>
					</Card>
				</div>

                {/* AI Insights Section */}
                <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
                    <Button variant="outline" onClick={() => setShowInsights((prev) => !prev)}>
                    {showInsights ? "Hide" : "View"} AI Insights
                    </Button>
                </div>
                {showInsights && (
                    <div className="border rounded-md bg-white shadow p-4">
                    <AiInsights />
                    </div>
                )}
                </div>


				{/* Holdings Section */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Your Holdings</CardTitle>
								<CardDescription>
									Manage your investment portfolio
								</CardDescription>
							</div>
							<Button onClick={() => setIsAddDialogOpen(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Add Holding
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<HoldingsTable
                            loading={isLoading}
							holdings={holdings}
							onDelete={handleDeleteHolding}
						/>
					</CardContent>
				</Card>
			</div>

			<AddHoldingDialog
				open={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
				onAdd={handleAddHolding}
			/>
		</div>
	);
};


export default Dashboard;