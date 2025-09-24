import {
  CommandInput,
  CommandList,
  CommandItem,
  CommandDialog,
  CommandEmpty,
} from "./command";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface PagefindResult {
  url: string;
  title: string;
  excerpt: string;
  image?: {
    src: string;
    alt: string;
  };
}

export function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");

  const {
    data: results = [],
    isFetching: loading,
    isError,
  } = useQuery<PagefindResult[]>({
    queryKey: ["pagefind-search", query],
    enabled: !!query,
    queryFn: async () => {
      // @ts-ignore
      const pagefind = await import("/pagefind/pagefind.js");
      pagefind.init();
      const res = await pagefind.search(query);
      const data = await Promise.all(res.results.map((r: any) => r.data()));
      return data.map((d: any) => ({
        url: d.url,
        title: d.meta.title || d.url,
        excerpt: d.excerpt,
        image: d.meta.image && {
          src: d.meta.image,
          alt: d.meta.image_alt || d.meta.title,
        },
      }));
    },
  });

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  return (
    <CommandDialog
      showCloseButton
      shouldFilter={false}
      open={open}
      onOpenChange={onOpenChange}
    >
      <CommandInput
        placeholder="Search..."
        value={query}
        onValueChange={setQuery}
        autoFocus
      />
      <CommandList>
        <CommandEmpty>
          {loading && <div className="p-4 text-center">Searching...</div>}
          {isError && (
            <div className="p-4 text-center text-red-500">Search failed.</div>
          )}
          {!loading && results.length === 0 && query && !isError && (
            <div className="p-4 text-center">No results found.</div>
          )}
        </CommandEmpty>
        {results.map((result) => (
          <CommandItem key={result.url}>
            <a
              href={result.url}
              className="hover:bg-muted block rounded p-2"
              target="_blank"
              rel={
                result.url.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              {result.image && (
                <img
                  src={result.image.src}
                  alt={result.image.alt}
                  className="float-left mr-4 h-32 w-32 rounded object-cover"
                />
              )}
              <h1 className="font-semibold">{result.title}</h1>
              <div
                className="text-muted-foreground text-sm"
                // Handle the mark element
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              ></div>
            </a>
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
