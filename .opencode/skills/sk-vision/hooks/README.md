# sk-vision host adapters

## 1. OVERVIEW

The skill drives four coding hosts. Two attach tools **in-process**, two attach them **over MCP** — which is why the layout below is not one-shape-per-host.

| Host | Attach model | Source in `hooks/` | Host load path |
|------|--------------|--------------------|----------------|
| **OpenCode** | in-process JS plugin | `opencode/sk-vision.ts` (built to `sk-vision.js`) | `.opencode/plugins/sk-vision.js` → symlink |
| **Pi** | in-process TS extension | `pi/sk-vision.ts` | `.pi/extensions/sk-vision.ts` → symlink |
| **Devin** | MCP (stdio) | `devin/mcp_config.json` | `.devin/mcp_config.json` → symlink |
| **Cursor** | MCP (stdio) | `cursor/mcp.json` (portable reference) | `.claude/mcp.json` entry, via the `.cursor/mcp.json → .mcp.json` chain |

All four sources are also mirrored into the shared hook hub at `.opencode/hooks/sk-vision/{pi,opencode,cursor,devin}` (per-file symlinks back to these sources), so the fleet sees every host's entry in one place.

---

## 2. WHY CURSOR AND DEVIN DIFFER FROM PI AND OPENCODE

Cursor and Devin have no in-process plugin API. They attach tools only through the **Model Context Protocol**, so both launch one shared server — `../vision-runtime/src/mcp/server.ts`, built to `../vision-runtime/dist/mcp-server.js` — that exposes the same 13 `sk_vision_*` tools. There is no per-host adapter *code* for them; the "adapter" is the MCP config that names the server.

- **Devin** loads a dedicated `.devin/mcp_config.json`, so the skill owns `devin/mcp_config.json` and `.devin/mcp_config.json` symlinks to it — the same own-the-source pattern as Pi and OpenCode.
- **Cursor** reads `.cursor/mcp.json`, which in this repo is a symlink into the shared `.claude/mcp.json` (alongside the other MCP servers). The skill cannot own that shared file, so `cursor/mcp.json` here is the **portable** sk-vision entry: the exact block to drop into any Cursor MCP config, and a mirror of what already lives in `.claude/mcp.json`.

> **Cursor env scope.** Cursor reads `.cursor/mcp.json` (in this repo a symlink to `.mcp.json`), NOT `.claude/mcp.json`. Cursor honors a per-server `env` block only from its own config scope, so to set a server env (e.g. `SK_VISION_MODEL`) for a dispatched cursor-agent, author the `env` in the Cursor-scope config (`.cursor/mcp.json` / the `.mcp.json` it points to), or use an `envFile`. Setting it only in `.claude/mcp.json` has no effect on Cursor.

The MCP server stays in `vision-runtime/` rather than under `hooks/` because it needs the MCP SDK dependency, which resolves inside the runtime package.

---

## 3. GUARANTEED VISION FOR TEXT-ONLY MODELS

A text-only model cannot see an attached image, so sk-vision makes the read a guarantee for those models — but only the two in-process hosts can enforce it.

- **OpenCode & Pi (in-process, enforced).** The auto-inspect hook classifies the active model with the shared `../vision-runtime/src/model-modality.ts` allowlist, plus any model whose host-declared input modality omits `image` (Pi exposes that via `ctx.model.input`; a model that declares no image input is authoritatively blind). For a text-only model it **awaits the full analysis** before the model reads the message; every other model keeps the non-blocking grace so submission never stalls on the GPU. Extend the list without a rebuild via `SK_VISION_TEXT_ONLY_MODELS` (comma-separated substrings), or force it for every model with `SK_VISION_FORCE=1`.
- **Cursor & Devin (MCP, best-effort).** MCP cannot see the active model or force a tool call, so there is no hard guarantee here — only a rule telling the model to inspect images itself. The skill owns the rule text: `cursor/vision-rule.md` is wired as an always-on Cursor rule through the `.cursor/rules/sk-vision.md` symlink, and `devin/vision-rule.md` is a drop-in for Devin Knowledge, because Devin has no repo-owned always-on rule slot the skill can symlink into.

---

## 4. FRESH-CHECKOUT NOTE

`vision-runtime/dist/mcp-server.js` and `opencode/sk-vision.js` are gitignored build artifacts. Run `bun run build` in `vision-runtime/` before the OpenCode plugin or the Cursor/Devin MCP server can launch.
