import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ControlPanelProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onShuffle: () => void;
  speed: number;
  onSpeedChange: (value: number[]) => void;
  arraySize: number;
  onArraySizeChange: (value: number[]) => void;
  algorithm: string;
  onAlgorithmChange: (value: string) => void;
  disabled?: boolean;
}

export const ControlPanel = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  onShuffle,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  algorithm,
  onAlgorithmChange,
  disabled = false,
}: ControlPanelProps) => {
  return (
    <Card className="animate-slide-up">
      <CardContent className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {!isRunning ? (
            <Button onClick={onStart} disabled={disabled} className="gap-2">
              <Play className="w-4 h-4" />
              Start
            </Button>
          ) : (
            <Button onClick={onPause} variant="secondary" className="gap-2">
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}
          <Button onClick={onReset} variant="outline" disabled={isRunning} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button onClick={onShuffle} variant="outline" disabled={isRunning} className="gap-2">
            <Shuffle className="w-4 h-4" />
            Shuffle
          </Button>
        </div>

        {/* Algorithm Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <Select value={algorithm} onValueChange={onAlgorithmChange} disabled={isRunning}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bubble">Bubble Sort</SelectItem>
              <SelectItem value="quick">Quick Sort</SelectItem>
              <SelectItem value="merge">Merge Sort</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Speed Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Speed</label>
            <span className="text-sm text-muted-foreground">{speed}ms</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={onSpeedChange}
            min={10}
            max={1000}
            step={10}
            disabled={isRunning}
            className="w-full"
          />
        </div>

        {/* Array Size Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Array Size</label>
            <span className="text-sm text-muted-foreground">{arraySize}</span>
          </div>
          <Slider
            value={[arraySize]}
            onValueChange={onArraySizeChange}
            min={5}
            max={100}
            step={5}
            disabled={isRunning}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
