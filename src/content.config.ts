import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      icon: image().optional(),
      repository: z.string().url().optional(),
      site: z.string().url().optional(),
      contributors: z.array(z.string()).min(1),
      languages: z.array(z.string()).min(1),
      pdf: z.string().url().optional(),
      articles: z.array(reference("articles")).optional(),
    }),
});

const articles = defineCollection({
  loader: glob({ base: "./src/content/articles", pattern: "**/*.yml" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      href: z.string().url(),
      cover: image().optional(),
      content: z.string(),
      pubDate: z.coerce.date(),
      source: z.string(),
      project: reference("projects").optional(),
    }),
});

export const collections = { blog, projects, articles };
