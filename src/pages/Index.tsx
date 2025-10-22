import { useState, useMemo } from "react";
import { Code2, Plus, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SnippetCard } from "@/components/SnippetCard";
import { SnippetDialog } from "@/components/SnippetDialog";
import { SearchBar } from "@/components/SearchBar";
import { toast } from "sonner";

interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
}

const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: "1",
    title: "useLocalStorage Hook",
    description: "Custom React hook for managing localStorage with state synchronization",
    code: `function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}`,
    language: "JavaScript",
    tags: ["react", "hooks", "localStorage"],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Binary Search Algorithm",
    description: "Efficient O(log n) search algorithm for sorted arrays",
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
    language: "Python",
    tags: ["algorithm", "search", "binary-search"],
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    title: "Debounce Function",
    description: "Utility function to limit the rate at which a function can fire",
    code: `function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
    language: "TypeScript",
    tags: ["utility", "performance", "debounce"],
    createdAt: new Date("2024-02-01"),
  },
];

const Index = () => {
  const [snippets, setSnippets] = useState<Snippet[]>(INITIAL_SNIPPETS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");

  const languages = useMemo(() => {
    return Array.from(new Set(snippets.map((s) => s.language))).sort();
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      const matchesSearch =
        searchQuery === "" ||
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLanguage = languageFilter === "all" || snippet.language === languageFilter;

      return matchesSearch && matchesLanguage;
    });
  }, [snippets, searchQuery, languageFilter]);

  const handleSave = (snippetData: Omit<Snippet, "id" | "createdAt">) => {
    if (editingSnippet) {
      setSnippets((prev) =>
        prev.map((s) =>
          s.id === editingSnippet.id
            ? { ...snippetData, id: s.id, createdAt: s.createdAt }
            : s
        )
      );
      toast.success("Snippet updated successfully!");
      setEditingSnippet(null);
    } else {
      const newSnippet: Snippet = {
        ...snippetData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setSnippets((prev) => [newSnippet, ...prev]);
      toast.success("Snippet created successfully!");
    }
  };

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
    toast.success("Snippet deleted successfully!");
  };

  const handleNewSnippet = () => {
    setEditingSnippet(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CodeVault</h1>
                <p className="text-sm text-muted-foreground">Your Personal Snippet Library</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open("https://github.com", "_blank")}
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>
              <Button onClick={handleNewSnippet} className="gap-2">
                <Plus className="w-4 h-4" />
                New Snippet
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            languageFilter={languageFilter}
            onLanguageFilterChange={setLanguageFilter}
            languages={languages}
          />
        </div>

        {filteredSnippets.length === 0 ? (
          <div className="text-center py-16">
            <Code2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No snippets found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || languageFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first code snippet"}
            </p>
            <Button onClick={handleNewSnippet}>
              <Plus className="w-4 h-4 mr-2" />
              Create Snippet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <SnippetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editingSnippet={editingSnippet}
      />
    </div>
  );
};

export default Index;
