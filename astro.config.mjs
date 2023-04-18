import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://rohannelson.com",
  integrations: [mdx(), partytown()]
});