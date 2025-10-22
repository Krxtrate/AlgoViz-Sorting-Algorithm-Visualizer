import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BarChart3, Layers } from "lucide-react";

interface StatsPanelProps {
  comparisons: number;
  swaps: number;
  timeElapsed: number;
}

export const StatsPanel = ({ comparisons, swaps, timeElapsed }: StatsPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comparisons</CardTitle>
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{comparisons}</div>
          <p className="text-xs text-muted-foreground mt-1">Total comparisons made</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Swaps</CardTitle>
          <Layers className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{swaps}</div>
          <p className="text-xs text-muted-foreground mt-1">Array element swaps</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Elapsed</CardTitle>
          <Clock className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(timeElapsed / 1000).toFixed(2)}s</div>
          <p className="text-xs text-muted-foreground mt-1">Total execution time</p>
        </CardContent>
      </Card>
    </div>
  );
};
