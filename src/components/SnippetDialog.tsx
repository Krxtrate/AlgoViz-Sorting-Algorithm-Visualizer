import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
}

interface SnippetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (snippet: Omit<Snippet, "id" | "createdAt">) => void;
  editingSnippet?: Snippet | null;
}

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", 
  "Go", "Rust", "PHP", "Swift", "Kotlin", "HTML", "CSS", "SQL"
];

export const SnippetDialog = ({ open, onOpenChange, onSave, editingSnippet }: SnippetDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (editingSnippet) {
      setTitle(editingSnippet.title);
      setDescription(editingSnippet.description);
      setCode(editingSnippet.code);
      setLanguage(editingSnippet.language);
      setTags(editingSnippet.tags.join(", "));
    } else {
      setTitle("");
      setDescription("");
      setCode("");
      setLanguage("JavaScript");
      setTags("");
    }
  }, [editingSnippet, open]);

  const handleSave = () => {
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSave({
      title,
      description,
      code,
      language,
      tags: tagsArray,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingSnippet ? "Edit Snippet" : "New Snippet"}</DialogTitle>
          <DialogDescription>
            {editingSnippet ? "Update your code snippet" : "Add a new code snippet to your collection"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., React Custom Hook"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this code does"
            />
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="code">Code</Label>
            <Textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="font-mono text-sm min-h-[200px]"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., react, hooks, custom"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title || !code}>
            {editingSnippet ? "Update" : "Save"} Snippet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
