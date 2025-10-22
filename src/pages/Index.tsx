import { useState, useEffect, useRef } from "react";
import { Brain, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlgorithmVisualizer } from "@/components/AlgorithmVisualizer";
import { ControlPanel } from "@/components/ControlPanel";
import { StatsPanel } from "@/components/StatsPanel";
import { bubbleSort, quickSort, mergeSort, SortStep } from "@/utils/sortingAlgorithms";
import { toast } from "sonner";

const generateRandomArray = (size: number): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
};

const Index = () => {
  const [arraySize, setArraySize] = useState(30);
  const [array, setArray] = useState<number[]>(generateRandomArray(30));
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const generatorRef = useRef<AsyncGenerator<SortStep> | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleShuffle = () => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    resetStats();
    toast.success("Array shuffled!");
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    handleShuffle();
  };

  const resetStats = () => {
    setComparingIndices([]);
    setSortedIndices([]);
    setSwappingIndices([]);
    setComparisons(0);
    setSwaps(0);
    setTimeElapsed(0);
  };

  const handleArraySizeChange = (value: number[]) => {
    const newSize = value[0];
    setArraySize(newSize);
    const newArray = generateRandomArray(newSize);
    setArray(newArray);
    resetStats();
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeElapsed(Date.now() - startTimeRef.current);
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStart = async () => {
    if (isRunning) return;

    setIsRunning(true);
    resetStats();
    startTimer();

    switch (algorithm) {
      case "bubble":
        generatorRef.current = bubbleSort(array);
        break;
      case "quick":
        generatorRef.current = quickSort(array);
        break;
      case "merge":
        generatorRef.current = mergeSort(array);
        break;
    }

    await runSortingSteps();
  };

  const runSortingSteps = async () => {
    if (!generatorRef.current) return;

    let prevComparingLength = 0;
    let prevSwappingLength = 0;

    while (isRunning) {
      const { value, done } = await generatorRef.current.next();

      if (done) {
        stopTimer();
        setIsRunning(false);
        toast.success("Sorting complete!");
        break;
      }

      setArray(value.array);
      setComparingIndices(value.comparingIndices);
      setSwappingIndices(value.swappingIndices);
      setSortedIndices(value.sortedIndices);

      if (value.comparingIndices.length > 0 && prevComparingLength === 0) {
        setComparisons((prev) => prev + 1);
      }

      if (value.swappingIndices.length > 0 && prevSwappingLength === 0) {
        setSwaps((prev) => prev + 1);
      }

      prevComparingLength = value.comparingIndices.length;
      prevSwappingLength = value.swappingIndices.length;

      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    stopTimer();
    toast.info("Sorting paused");
  };

  const getAlgorithmInfo = () => {
    switch (algorithm) {
      case "bubble":
        return {
          name: "Bubble Sort",
          complexity: "O(n²)",
          description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        };
      case "quick":
        return {
          name: "Quick Sort",
          complexity: "O(n log n)",
          description: "Divides array into smaller sub-arrays using a pivot element and recursively sorts them.",
        };
      case "merge":
        return {
          name: "Merge Sort",
          complexity: "O(n log n)",
          description: "Divides array into halves, recursively sorts them, and then merges the sorted halves.",
        };
      default:
        return { name: "", complexity: "", description: "" };
    }
  };

  const algorithmInfo = getAlgorithmInfo();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-primary glow-primary">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AlgoViz</h1>
                <p className="text-sm text-muted-foreground">Interactive Sorting Algorithm Visualizer</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Algorithm Info */}
        <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">{algorithmInfo.name}</h2>
              <p className="text-sm text-muted-foreground">{algorithmInfo.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Time Complexity:</span>
              <code className="px-3 py-1 bg-secondary rounded-lg font-mono text-sm text-primary font-semibold">
                {algorithmInfo.complexity}
              </code>
            </div>
          </div>
        </div>

        {/* Stats */}
        <StatsPanel comparisons={comparisons} swaps={swaps} timeElapsed={timeElapsed} />

        {/* Visualizer */}
        <AlgorithmVisualizer
          array={array}
          comparingIndices={comparingIndices}
          sortedIndices={sortedIndices}
          swappingIndices={swappingIndices}
        />

        {/* Controls */}
        <ControlPanel
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onShuffle={handleShuffle}
          speed={speed}
          onSpeedChange={(value) => setSpeed(value[0])}
          arraySize={arraySize}
          onArraySizeChange={handleArraySizeChange}
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
        />

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground animate-fade-in">
          <p>Hover over bars to see their values • Adjust speed and array size for different visualizations</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
