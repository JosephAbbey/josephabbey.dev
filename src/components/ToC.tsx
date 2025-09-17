import type { MarkdownHeading } from "astro";

export default function ({ headings }: { headings: MarkdownHeading[] }) {
  const filtered = headings.filter(
    (heading) => heading.depth === 2 || heading.depth === 3,
  );
  return (
    <ul>
      {filtered.map((heading) =>
        heading.depth === 2 ? (
          <li key={heading.slug} className="ml-4 list-none">
            <a href={`#${heading.slug}`} className="hover:underline">
              {heading.text}
            </a>
          </li>
        ) : (
          <li key={heading.slug} className="ml-8 list-none">
            <a href={`#${heading.slug}`} className="hover:underline">
              {heading.text}
            </a>
          </li>
        ),
      )}
    </ul>
  );
}
