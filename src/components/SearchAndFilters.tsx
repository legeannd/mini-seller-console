import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { LeadStatus } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchAndFiltersProps {
  searchQuery: string;
  statusFilter: LeadStatus | "All";
  sortByScore: boolean;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: LeadStatus | "All") => void;
  onSortChange: (sortByScore: boolean) => void;
}

export function SearchAndFilters({
  searchQuery,
  statusFilter,
  sortByScore,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
}: SearchAndFiltersProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    onSearchChange(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearchChange]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 max-w-md">
        <Input
          type="text"
          placeholder="Search by name or company..."
          value={localSearchQuery}
          onChange={handleSearchInputChange}
          className="w-full"
        />
      </div>

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={sortByScore ? "default" : "outline"}
          onClick={() => onSortChange(!sortByScore)}
          className="whitespace-nowrap"
        >
          Sort by Score
        </Button>
      </div>
    </div>
  );
}
