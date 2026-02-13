# Implementation Summary: Phase 11 — outDir Migration + Setup Hardening + README Alignment

> **Parent Spec:** 092-javascript-to-typescript/
> **Status:** Complete
> **Completed:** 2026-02-07

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.0 -->

---

## What Was Done

Phase 11 completed three streams of work plus a retroactive fix stream:

### Stream A: Setup Hardening

**Problem solved:** MCP server startup failures caused by placeholder API keys, corrupted model caches, and native module version mismatches.

**Changes:**
1. **`opencode.json`** — Removed `VOYAGE_API_KEY: "YOUR_VOYAGE_API_KEY_HERE"` and `OPENAI_API_KEY: "YOUR_OPENAI_API_KEY_HERE"`. Changed `EMBEDDINGS_PROVIDER` from `"auto"` to `"hf-local"`. Updated documentation notes.
2. **`install-code-mode.sh`** — Added `rm -rf ~/.npm/_npx/*` to clear stale npx cache with compiled native modules (content-hashed dirs make targeted deletion impossible).
3. **`install-spec-kit-memory.sh`** — Removed placeholder API keys from generated config. Added HF model cache cleanup (`rm -rf node_modules/@huggingface/transformers/.cache`). Set `"hf-local"` as default.
4. **`retry-manager.ts`** — Added detection for `ERR_DLOPEN_FAILED` error pattern with Node.js version diagnostic info.
5. **Root `package.json`** — Updated script paths to reference `dist/` compiled output.

### Stream B: outDir Refactor

**Problem solved:** ~1400 compiled `.js` artifacts polluting source directories alongside `.ts` files.

**Changes:**
1. **3 tsconfig files** — Added `"outDir": "dist/"` (shared, mcp_server, scripts).
2. **Path resolution** — Updated `config.ts` files in mcp_server and scripts to resolve correctly from `dist/core/` at runtime (`SERVER_DIR = path.join(__dirname, '..', '..')`).
3. **Script __dirname fixes** — Updated 3 scripts (workflow.ts, cleanup-orphaned-vectors.ts, content-filter.ts).
4. **Module imports** — Updated vector-index.ts, vector-index-impl.js, reindex-embeddings.ts.
5. **Package barrels** — Created 8 cross-workspace re-export barrels for `@spec-kit/shared` and `@spec-kit/mcp-server`.
6. **Entry points** — Updated 5 package.json files to point `main` at `dist/`.
7. **Tests** — Updated ~30 test files with new `dist/` path references.
8. **Cleanup** — Deleted ~1400 compiled files from source dirs. Added `**/dist/` to `.gitignore`.

### Stream C: README Alignment

**Problem solved:** 43 READMEs referencing pre-TypeScript file names, structures, and tool counts.

**Changes (by agent delegation):**
- **Agent 1 — `mcp_server/README.md`** (5 edits): Structure tree with `.ts` sources + `dist/`, quick start `tsc` step, path resolution note.
- **Agent 2 — `mcp_server/INSTALL_GUIDE.md`** (23 edits): 14 entry point path fixes, TS→JS architecture diagram, `tsc` install step, config examples fixed, tool count 14→22, compilation troubleshooting.
- **Agent 3 — `system-spec-kit/README.md`** (12 edits): Script paths to `dist/`, expanded directory tree, tool name fix (`memory_causal_why` → `memory_drift_why`).
- **Batch update** — 40 sub-module READMEs across `scripts/` and `mcp_server/`.

### Stream C+: Post-Discovery Config Fix

**Problem solved:** `.claude/mcp.json`, `.vscode/mcp.json`, and `install_guides/README.md` still had the broken patterns that Stream A fixed in `opencode.json`.

**Changes:**
1. **`.claude/mcp.json`** — `context-server.js` → `dist/context-server.js`; removed `VOYAGE_API_KEY`/`OPENAI_API_KEY` placeholders; `"auto"` → `"hf-local"`; removed `_NOTE_7_LOCAL_EMBEDDINGS` (`@xenova` reference); updated notes.
2. **`.vscode/mcp.json`** — Identical changes.
3. **`mcp_server/INSTALL_GUIDE.md`** — Fixed 2 config examples; added HuggingFace cache corruption troubleshooting; added native module version mismatch troubleshooting; fixed 5 `generate-context.js` paths → `scripts/dist/memory/generate-context.js`.
4. **`mcp_server/README.md`** — Added `Failed to parse ONNX model` symptom; added in-project cache path; kept global cache as secondary.
5. **`install_guides/README.md`** — Fixed 5 entry point paths; fixed config example; rewrote provider docs (hf-local default); fixed troubleshooting (HF cache instead of Ollama-first).

---

## Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| D11-1 | `hf-local` default (not `auto`) | Placeholder keys cause auto-detection failures; explicit safe default |
| D11-2 | Per-workspace `dist/` (supersedes D2) | Migration complete; separation is now beneficial |
| D11-3 | Full npx cache clear (not targeted) | Content-hashed directories prevent targeted deletion |
| D11-4 | In-project HF cache as primary fix | Actual corruption is in `node_modules/`, not `~/.cache/` |
| D11-5 | Stream C+ retroactive fix | Config files actively broken; same fix pattern as Stream A |

---

## What's Different Now

| Before Phase 11 | After Phase 11 |
|-----------------|---------------|
| Compiled `.js` files alongside `.ts` sources | All compiled output in `dist/` directories |
| `EMBEDDINGS_PROVIDER: "auto"` with placeholder keys | `EMBEDDINGS_PROVIDER: "hf-local"` with no placeholders |
| READMEs reference `.js` files and old structure | READMEs reference `.ts` sources and `dist/` output |
| Install scripts don't clean caches | Install scripts clean HF model cache + npx cache |
| `context-server.js` as entry point | `dist/context-server.js` as entry point |
| Troubleshooting only mentions global HF cache | Troubleshooting covers in-project + global cache |
| 14 tools documented | 22 tools documented |
| No `ERR_DLOPEN_FAILED` guidance | Native module troubleshooting section added |

---

## Verification Results

All 7 verification checks pass:

| # | Check | Result |
|---|-------|--------|
| 1 | No placeholder API keys | 0 matches across all config/doc files |
| 2 | All entry points include `dist/` | Verified in .claude/mcp.json, .vscode/mcp.json, INSTALL_GUIDE, install_guides/README |
| 3 | No `"auto"` as EMBEDDINGS_PROVIDER | 0 matches in config files |
| 4 | All `generate-context.js` paths correct | All 5 show `scripts/dist/memory/generate-context.js` |
| 5 | Troubleshooting sections present | `ERR_DLOPEN_FAILED` + `transformers/.cache` in INSTALL_GUIDE |
| 6 | HF cache in README.md | `transformers/.cache` in troubleshooting |
| 7 | No `@xenova` references | 0 matches in config files |

---

## Files Changed (Total Count)

| Stream | Files | Edits |
|--------|------:|------:|
| A: Setup Hardening | 5 | ~20 |
| B: outDir Refactor | ~50 | ~200 |
| C: README Alignment | 43 | ~120 |
| C+: Config Fix | 5 | ~30 |
| **Total** | **~103** | **~370** |

---

## Cross-References

- **Spec:** See `spec.md`
- **Plan:** See `plan.md`
- **Tasks:** See `tasks.md`
- **Checklist:** See `checklist.md`
- **Decision Record:** See `decision-record.md`
