import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://rohannelson.com",
  integrations: [mdx(), react()],
  output: "server",
  adapter: cloudflare()
});