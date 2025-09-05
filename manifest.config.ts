import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  content_scripts: [
    {
      js: ["src/content/main.ts"],
      matches: ["https://www.twitch.tv/s17n"],
    },
  ],
  permissions: [],
});
