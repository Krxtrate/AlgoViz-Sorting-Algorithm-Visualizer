import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  languageFilter: string;
  onLanguageFilterChange: (value: string) => void;
  languages: string[];
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  languageFilter,
  onLanguageFilterChange,
  languages,
}: SearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search snippets by title, description, or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={languageFilter} onValueChange={onLanguageFilterChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="All Languages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
