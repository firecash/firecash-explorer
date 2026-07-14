// vite.config.ts
import { reactRouter } from "file:///root/work/firecash-explorer/node_modules/@react-router/dev/dist/vite.js";
import tailwindcss from "file:///root/work/firecash-explorer/node_modules/@tailwindcss/vite/dist/index.mjs";
import { defineConfig } from "file:///root/work/firecash-explorer/node_modules/vite/dist/node/index.js";
import svgr from "file:///root/work/firecash-explorer/node_modules/vite-plugin-svgr/dist/index.js";
import tsconfigPaths from "file:///root/work/firecash-explorer/node_modules/vite-tsconfig-paths/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    svgr({
      include: "**/*.svg",
      svgrOptions: {
        /* svgr options? */
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvcm9vdC93b3JrL2ZpcmVjYXNoLWV4cGxvcmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvcm9vdC93b3JrL2ZpcmVjYXNoLWV4cGxvcmVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9yb290L3dvcmsvZmlyZWNhc2gtZXhwbG9yZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyByZWFjdFJvdXRlciB9IGZyb20gXCJAcmVhY3Qtcm91dGVyL2Rldi92aXRlXCI7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy92aXRlXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHN2Z3IgZnJvbSBcInZpdGUtcGx1Z2luLXN2Z3JcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB0YWlsd2luZGNzcygpLFxuICAgIHJlYWN0Um91dGVyKCksXG4gICAgdHNjb25maWdQYXRocygpLFxuICAgIHN2Z3Ioe1xuICAgICAgaW5jbHVkZTogXCIqKi8qLnN2Z1wiLFxuICAgICAgc3Znck9wdGlvbnM6IHtcbiAgICAgICAgLyogc3ZnciBvcHRpb25zPyAqL1xuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUSxTQUFTLG1CQUFtQjtBQUNsUyxPQUFPLGlCQUFpQjtBQUN4QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsWUFBWTtBQUFBLElBQ1osWUFBWTtBQUFBLElBQ1osY0FBYztBQUFBLElBQ2QsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLE1BQ1QsYUFBYTtBQUFBO0FBQUEsTUFFYjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
