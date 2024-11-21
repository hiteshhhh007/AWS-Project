import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import useGalleryStore from '@/store/galleryStore';
import { CalendarIcon, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const sortOptions = [
  { value: 'date', label: 'Upload Date' },
  { value: 'name', label: 'File Name' },
];

export default function FilterBar() {
  const {
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    setDateRange,
  } = useGalleryStore();

  const [dateRange, setLocalDateRange] = useState({ from: null, to: null });

  const handleDateSelect = (range) => {
    setLocalDateRange(range);
    if (range.from && range.to) {
      setDateRange({ start: range.from, end: range.to });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="w-10 h-10"
        >
          <ArrowUpDown className={cn(
            "h-4 w-4 transition-transform",
            sortOrder === 'desc' && "rotate-180"
          )} />
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date Range</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
