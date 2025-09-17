// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
// import remarkEmbedder from "@remark-embedder/core";
// import oembedTransformer from "@remark-embedder/transformer-oembed";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import { ExternalLink } from "lucide-react";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://www.josephabbey.dev",
  prefetch: true,

  image: {
    domains: ["raw.githubusercontent.com"],
  },

  markdown: {
    shikiConfig: {
      theme: "catppuccin-mocha",
    },
    remarkPlugins: [
      remarkMath,
      // [remarkEmbedder, { transformers: [oembedTransformer] }],
    ],
    rehypePlugins: [
      rehypeAccessibleEmojis,
      rehypeKatex,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["nofollow"],
        },
      ],
    ],
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Inter",
        cssVariable: "--font-inter",
      },
    ],
  },

  integrations: [mdx(), sitemap(), react()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});