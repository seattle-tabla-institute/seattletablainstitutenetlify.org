import { defineConfig } from "astro/config";
import markdoc from "@astrojs/markdoc";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [react(), markdoc(), keystatic()]
});
