import { SearchModal } from "@/components/ui/search-modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button } from "./button";
import { SearchIcon } from "lucide-react";

export function SearchModalButton() {
  const [open, setOpen] = useState(false);
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        <Button onClick={() => setOpen(true)} variant="outline">
          <SearchIcon />
          Search...
        </Button>
        <SearchModal open={open} onOpenChange={setOpen} />
      </div>
    </QueryClientProvider>
  );
}
