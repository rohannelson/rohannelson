import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import icon from "astro-icon";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://rohannelson.com",
  integrations: [mdx(), react(), icon()],
  output: "server",
  adapter: cloudflare(),
});
