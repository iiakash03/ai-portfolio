import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface Holding {
  id: string;
  ticker: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  createdAt: string;
}

interface HoldingsTableProps {
  holdings: Holding[];
  onDelete: (id: string) => void;
  loading?: boolean; // Optional loading state
}

const formatPrice = (price: number | undefined): string => {
  if (typeof price !== 'number') return '$0.00';
  return `$${price.toFixed(2)}`;
};

export function HoldingsTable({ holdings, onDelete, loading }: HoldingsTableProps) {
    if (loading) {
        return (
        <div className="text-center py-8">
            <p className="text-muted-foreground">Loading holdings...</p>
        </div>
        );
    }
  if (holdings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No holdings yet. Add your first investment!</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Purchase Price</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Market Value</TableHead>
            <TableHead className="text-right">Gain/Loss</TableHead>
            <TableHead className="text-right">%</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => {
            const marketValue = holding.quantity * (holding.currentPrice || 0);
            const totalCost = holding.quantity * (holding.purchasePrice || 0);
            const gainLoss = marketValue - totalCost;
            const gainLossPercent = totalCost === 0 ? 0 : (gainLoss / totalCost) * 100;
            const isGain = gainLoss >= 0;

            return (
              <TableRow key={holding.id}>
                <TableCell className="font-medium">{holding.ticker}</TableCell>
                <TableCell className="text-right">{holding.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatPrice(holding.purchasePrice)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(holding.currentPrice)}
                </TableCell>
                <TableCell className="text-right">
                  ${marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className={`text-right ${isGain ? 'text-green-600' : 'text-red-600'}`}>
                  <div className="flex items-center justify-end gap-1">
                    {isGain ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    ${Math.abs(gainLoss).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={isGain ? "secondary" : "destructive"}>
                    {isGain ? '+' : ''}{gainLossPercent.toFixed(2)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Holding</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {holding.ticker} from your portfolio? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(holding.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}