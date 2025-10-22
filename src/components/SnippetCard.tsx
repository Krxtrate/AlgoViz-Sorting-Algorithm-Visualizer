import { Code2, Copy, Pencil, Trash2, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
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

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
}

export const SnippetCard = ({ snippet, onEdit, onDelete }: SnippetCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 hover:glow-primary animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{snippet.title}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {snippet.language}
          </Badge>
        </div>
        <CardDescription>{snippet.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="bg-code-bg rounded-md p-4 relative overflow-x-auto">
          <pre className="text-sm text-foreground/90">
            <code>{snippet.code}</code>
          </pre>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border/50 pt-4">
        <span className="text-xs text-muted-foreground">
          {new Date(snippet.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="hover:text-primary"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(snippet)}
            className="hover:text-primary"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(snippet.id)}
            className="hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
