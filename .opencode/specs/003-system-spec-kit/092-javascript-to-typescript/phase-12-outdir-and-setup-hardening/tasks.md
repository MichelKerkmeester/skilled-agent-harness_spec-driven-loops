# Tasks: Phase 11 — outDir Migration + Setup Hardening + README Alignment

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-L
> **Level:** 3+
> **Created:** 2026-02-07

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[P]` | Parallelizable |

**Task Format:**
```
T### [W-L] [P?] Description (file path) [effort] {deps: T###}
```

---

## Stream A: Setup Hardening (5 files)

- [x] T357 [W-L] Remove placeholder API keys from `opencode.json` [15m] {deps: none}
  - Removed `VOYAGE_API_KEY: "YOUR_VOYAGE_API_KEY_HERE"` and `OPENAI_API_KEY: "YOUR_OPENAI_API_KEY_HERE"`
  - Changed `EMBEDDINGS_PROVIDER` from `"auto"` to `"hf-local"`
  - Updated `_NOTE_` documentation keys to match new defaults

- [x] T358 [W-L] [P] Harden `install-code-mode.sh` with cache cleanup [15m] {deps: none}
  - Added `rm -rf ~/.npm/_npx/*` to clear stale npx cache (content-hashed dirs)
  - Prevents `ERR_DLOPEN_FAILED` from cached isolated-vm native modules

- [x] T359 [W-L] [P] Harden `install-spec-kit-memory.sh` with cache cleanup [15m] {deps: none}
  - Removed placeholder API keys from generated config
  - Added HF model cache cleanup: `rm -rf node_modules/@huggingface/transformers/.cache`
  - Set `EMBEDDINGS_PROVIDER: "hf-local"` as default

- [x] T360 [W-L] [P] Enhance `retry-manager.ts` native module error handling [30m] {deps: none}
  - Added detection for `ERR_DLOPEN_FAILED` error pattern
  - Enhanced error messages with Node.js version diagnostic info

- [x] T361 [W-L] Update root `package.json` scripts and entry points [15m] {deps: none}
  - Updated script paths to reference `dist/` compiled output

---

## Stream B: outDir Refactor (~50 files)

### B1: TypeScript Configuration

- [x] T362 [W-L] Add `"outDir": "dist/"` to `shared/tsconfig.json` [10m] {deps: none}
- [x] T363 [W-L] [P] Add `"outDir": "dist/"` to `mcp_server/tsconfig.json` [10m] {deps: none}
- [x] T364 [W-L] [P] Add `"outDir": "dist/"` to `scripts/tsconfig.json` [10m] {deps: none}

### B2: Path Resolution

- [x] T365 [W-L] Update `mcp_server/core/config.ts` path resolution for `dist/` [30m] {deps: T363}
  - `SERVER_DIR = path.join(__dirname, '..', '..')` (resolves from `dist/core/`)
  - `LIB_DIR = path.join(__dirname, '..', 'lib')` (resolves to `dist/lib/`)

- [x] T366 [W-L] [P] Update `scripts/core/config.ts` path resolution for `dist/` [30m] {deps: T364}

- [x] T367 [W-L] Fix __dirname in 3 scripts (workflow.ts, cleanup-orphaned-vectors.ts, content-filter.ts) [30m] {deps: T364}

- [x] T368 [W-L] Update `vector-index.ts` + `vector-index-impl.js` import paths [20m] {deps: T365}

- [x] T369 [W-L] [P] Update `mcp_server/scripts/reindex-embeddings.ts` paths [10m] {deps: T365}

### B3: Package Entry Points

- [x] T370 [W-L] Update 5 package.json files with `dist/` main entry points [30m] {deps: T362-T364}

- [x] T371 [W-L] Create 8 cross-workspace re-export barrels [45m] {deps: T370}
  - `@spec-kit/shared` and `@spec-kit/mcp-server` package barrels

### B4: Test Updates

- [x] T372 [W-L] Update ~30 test files with `dist/` path references [60m] {deps: T365-T371}

### B5: Cleanup

- [x] T373 [W-L] Delete ~1400 compiled `.js` files from source directories [15m] {deps: T372}

- [x] T374 [W-L] Add `**/dist/` patterns to `.gitignore` [5m] {deps: T373}

- [x] T375 [W-L] Verify `tsc --build` and test suite pass after cleanup [15m] {deps: T374}

---

## Stream C: README Alignment (43 files)

- [x] T376 [W-L] Update `mcp_server/README.md` — 5 edits [30m] {deps: T375}
  - Structure tree: `.ts` sources + `dist/` compiled output
  - Quick start: added `tsc` compilation step
  - Path resolution note for TypeScript imports

- [x] T377 [W-L] [P] Update `mcp_server/INSTALL_GUIDE.md` — 23 edits [90m] {deps: T375}
  - All `context-server.js` → `dist/context-server.js` (14 instances)
  - Architecture diagram: TS→JS compilation flow
  - Install procedure: added `tsc` step
  - Config examples: removed placeholder keys
  - Tool count: 14 → 22
  - Added compilation troubleshooting section

- [x] T378 [W-L] [P] Update `system-spec-kit/README.md` — 12 edits [45m] {deps: T375}
  - Script paths to `dist/`
  - Directory tree: added shared/, hooks/, utils/, providers/, dist/
  - Fixed tool name: `memory_causal_why` → `memory_drift_why`

- [x] T379 [W-L] Batch update 40 sub-module READMEs [120m] {deps: T375}
  - 16 READMEs under `scripts/`
  - 24 READMEs under `mcp_server/` (excluding README.md and INSTALL_GUIDE.md)

---

## Stream C+: Post-Discovery Config Fix (5 files)

- [x] T380 [W-L] Fix `.claude/mcp.json` — entry point + placeholder keys + provider [15m] {deps: T379}
  - `context-server.js` → `dist/context-server.js`
  - Removed `VOYAGE_API_KEY`, `OPENAI_API_KEY` placeholder values
  - `EMBEDDINGS_PROVIDER`: `"auto"` → `"hf-local"`
  - Updated `_NOTE_` keys, removed `_NOTE_7_LOCAL_EMBEDDINGS` (`@xenova` reference)

- [x] T381 [W-L] [P] Fix `.vscode/mcp.json` — identical changes [15m] {deps: T379}

- [x] T382 [W-L] [P] Fix `mcp_server/INSTALL_GUIDE.md` — config + troubleshooting [45m] {deps: T379}
  - Fixed 2 OpenCode config examples (removed placeholders, set `hf-local`)
  - Added HuggingFace cache corruption troubleshooting section
  - Added native module version mismatch troubleshooting section
  - Fixed 5 `generate-context.js` paths → `scripts/dist/memory/generate-context.js`

- [x] T383 [W-L] [P] Fix `mcp_server/README.md` — HF cache troubleshooting [15m] {deps: T379}
  - Added `Failed to parse ONNX model` symptom
  - Added in-project `node_modules/@huggingface/transformers/.cache` path
  - Kept global `~/.cache/huggingface/` as secondary fix

- [x] T384 [W-L] [P] Fix `install_guides/README.md` — entry points + config + troubleshooting [30m] {deps: T379}
  - Fixed 5 `context-server.js` paths → `dist/context-server.js`
  - Fixed config example: removed `"auto"` + placeholder key, set `"hf-local"`
  - Fixed env var example: `auto` → `hf-local`
  - Rewrote provider docs: `hf-local` as default, not auto-detection
  - Fixed troubleshooting: HF cache fix instead of Ollama-first advice

---

## Phase 11 Verification

- [x] T385 [W-L] Verify no placeholder API keys across all config/doc files [5m] {deps: T380-T384}
  - `grep "YOUR_VOYAGE_API_KEY_HERE\|YOUR_OPENAI_API_KEY_HERE"` → 0 matches

- [x] T386 [W-L] Verify all entry points include `dist/` prefix [5m] {deps: T380-T384}
  - `grep "context-server.js"` → all show `dist/context-server.js`

- [x] T387 [W-L] Verify no `"auto"` as EMBEDDINGS_PROVIDER in config files [5m] {deps: T380-T384}

- [x] T388 [W-L] Verify troubleshooting sections present [5m] {deps: T382-T383}
  - `ERR_DLOPEN_FAILED` in INSTALL_GUIDE ✓
  - `transformers/.cache` in INSTALL_GUIDE ✓ and README.md ✓

- [x] T389 [W-L] Verify no `@xenova/transformers` references in config files [5m] {deps: T380-T381}

---

## Completion Criteria

- [x] All 33 tasks (T357-T389) marked `[x]`
- [x] No `[B]` blocked tasks
- [x] 7-point grep verification passes
- [x] MCP server starts via `node dist/context-server.js`
- [x] No setup failure patterns remain in any config or documentation file

---

## Cross-References

- **Spec:** See `spec.md`
- **Plan:** See `plan.md`
- **Checklist:** See `checklist.md`
- **Decision Record:** See `decision-record.md`
- **Parent Tasks:** `092-javascript-to-typescript/tasks.md`
