import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import useGalleryStore from "@/store/galleryStore";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBar() {
  const { setSearchQuery } = useGalleryStore();
  const debouncedSearch = useDebounce((value) => setSearchQuery(value), 300);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-9"
        placeholder="Search gallery by image content or tags..."
        onChange={(e) => debouncedSearch(e.target.value)}
        aria-label="Search gallery"
      />
    </div>
  );
}
