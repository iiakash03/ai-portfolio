import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {toast} from "sonner";
import { useStockSuggestions } from '../components/hooks/useStockSuggestion';

interface AddHoldingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (holding: { ticker: string; quantity: number; purchasePrice: number }) => void;
}

export function AddHoldingDialog({ open, onOpenChange, onAdd }: AddHoldingDialogProps) {
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { suggestions, isLoading: loadingSuggestions, fetchSuggestions,setSuggestions } = useStockSuggestions();

  const onTickerChange = (value: string) => {
    const sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setTicker(sanitizedValue);
    fetchSuggestions(sanitizedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticker || !quantity || !purchasePrice) {
      toast("Missing information Please fill in all field destructive");
      return;
    }

    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(purchasePrice);

    if (quantityNum <= 0 || priceNum <= 0) {
      toast("Invalid values Quantity and price must be positive numbers destructive");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onAdd({
        ticker: ticker.toUpperCase(),
        quantity: quantityNum,
        purchasePrice: priceNum,
      });

      // Reset form
      setTicker("");
      setQuantity("");
      setPurchasePrice("");
      onOpenChange(false);
    } catch (error) {
      toast(
        `Failed to add holding. Please try again.${error instanceof Error ? ` ${error.message}` : ""}`,
        { 
          style: { background: "#f87171", color: "#fff" } // optional: style for destructive variant
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Holding</DialogTitle>
          <DialogDescription>
            Add a new stock or investment to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ticker" className="text-right">
                Ticker
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="ticker"
                  placeholder="e.g. AAPL"
                  value={ticker}
                  onChange={(e) => onTickerChange(e.target.value)}
                  className="w-full"
                  maxLength={10}
                />
                {loadingSuggestions && (
                  <div className="absolute right-2 top-2">
                    {/* Add a loading spinner here */}
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div className="absolute w-full bg-white mt-1 rounded-md shadow-lg border z-50 max-h-48 overflow-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.symbol}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex justify-between items-center"
                        onClick={() => {
                          setTicker(suggestion.symbol);
                          setSuggestions([]);
                        }}
                      >
                        <span className="font-medium">{suggestion.symbol}</span>
                        <span className="text-sm text-gray-500">{suggestion.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Number of shares"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-3"
                min="0"
                step="0.01"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="Purchase price per share"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="col-span-3"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Holding"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}