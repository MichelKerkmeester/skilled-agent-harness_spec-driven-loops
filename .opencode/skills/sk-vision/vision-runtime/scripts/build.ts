import { mkdir, cp, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const dist = resolve(root, "dist");
const runtime = resolve(root, "python", "runtime.py");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// Bundle the plugin for the OpenCode plugin runtime (Bun-compatible).
await Bun.build({
  entrypoints: [resolve(root, "src/plugin.ts")],
  outdir: dist,
  target: "bun",
  format: "esm",
  define: {
    "process.env.SK_VISION_VERSION": JSON.stringify("0.1.0"),
  },
});

// Bundle the MCP stdio server so the MCP-only hosts (Cursor, Devin) can launch
// the 13 tools independently of the in-process plugin. Kept in the package because
// it needs the MCP SDK dependency that resolves inside vision-runtime.
await Bun.build({
  entrypoints: [resolve(root, "src/mcp/server.ts")],
  outdir: dist,
  target: "bun",
  format: "esm",
  naming: "mcp-server.[ext]",
});

// Ship the Python runtime alongside so the plugin can find it without the repo.
const pyDist = resolve(dist, "python");
await mkdir(pyDist, { recursive: true });
await cp(runtime, resolve(pyDist, "runtime.py"));

// Also bundle the skill-owned OpenCode adapter that lives beside the Pi adapter
// under hooks/. It emits a loadable sk-vision.js next to its source so
// .opencode/plugins/sk-vision.js can symlink into the skill's hooks/ dir,
// symmetric with how the Pi adapter is loaded from hooks/pi.
const hooksOpencode = resolve(root, "..", "hooks", "opencode");
await Bun.build({
  entrypoints: [resolve(hooksOpencode, "sk-vision.ts")],
  outdir: hooksOpencode,
  target: "bun",
  format: "esm",
  define: {
    "process.env.SK_VISION_VERSION": JSON.stringify("0.1.0"),
  },
});

console.log("built dist/plugin.js + dist/mcp-server.js + dist/python/runtime.py + hooks/opencode/sk-vision.js");