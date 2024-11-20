import { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import useGalleryStore from '@/store/galleryStore';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TagFilter() {
  const { images, selectedTags, toggleTag } = useGalleryStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique tags from all images
  const allTags = Array.from(new Set(
    images?.flatMap(image => image.tags || []) || []
  )).sort();

  const filteredTags = allTags.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagClick = useCallback((tag) => {
    toggleTag(tag);
  }, [toggleTag]);

  if (!allTags.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Filter by Tags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            aria-label="Filter tags"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-4">
            {filteredTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="mr-2 cursor-pointer hover:bg-primary/90"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
            {filteredTags.length === 0 && (
              <p className="text-sm text-muted-foreground">No tags found</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
