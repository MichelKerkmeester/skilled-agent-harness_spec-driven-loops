# Phase 11: outDir Migration + Setup Hardening + README Alignment

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-L
> **Tasks:** T357–T389
> **Milestone:** M11 (Production-Ready Build Pipeline)
> **SYNC Gate:** SYNC-011
> **Depends On:** Phase 10 (clean `tsc --build` with 0 errors)
> **Session:** 6

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3plus-govern | v2.0 -->

---

## Goal

Harden the MCP server setup pipeline, separate compiled output into `dist/` directories, and align all documentation with the post-TypeScript-migration reality. After Phase 11, new users can install and run the system without hitting preventable startup failures.

## Context

Phase 10 achieved a clean `tsc --build` (0 errors across 3 workspaces). However, three categories of problems remained:

1. **Setup failures**: Users copying config examples from `opencode.json` or docs hit MCP startup crashes because placeholder API keys (`YOUR_VOYAGE_API_KEY_HERE`) were treated as real keys by the auto-detection logic, corrupted HuggingFace ONNX caches caused Protobuf parsing failures, and native modules compiled for older Node.js versions triggered `ERR_DLOPEN_FAILED`.

2. **Build artifact pollution**: Compiled `.js` files lived alongside `.ts` sources in the same directories (~1400 artifacts), making `git status` noisy and source navigation confusing.

3. **Documentation drift**: 43 READMEs still referenced `.js` file names, pre-TypeScript directory structures, old tool counts (14 instead of 22), and missing `tsc` compilation steps.

## Scope

### In Scope

| Stream | Area | Files | Description |
|--------|------|------:|-------------|
| **A** | Setup Hardening | 5 | Fix MCP startup failure patterns in config and install scripts |
| **B** | outDir Refactor | ~50 | Migrate compiled output to `dist/`, update all path references |
| **C** | README Alignment | 43 | Update all READMEs to reflect TS migration + outDir changes |

### Out of Scope

- Converting remaining 33 `.js`-only test files to `.ts` (separate future effort)
- Changing the MCP server's runtime API or behavior
- Creating new features or tools
- Updating project-level docs (CLAUDE.md, AGENTS.md, PUBLIC_RELEASE.md)

## Files Modified

### Stream A (Setup Hardening)
- `opencode.json` (anobel.com) — removed placeholder API keys, set `EMBEDDINGS_PROVIDER: "hf-local"`
- `install_guides/install_scripts/install-code-mode.sh` — added HF/npx cache cleanup
- `install_guides/install_scripts/install-spec-kit-memory.sh` — added HF cache cleanup, removed placeholder keys
- `mcp_server/lib/providers/retry-manager.ts` — enhanced native module error handling
- Root `package.json` — updated dependencies/scripts

### Stream B (outDir Refactor)
- 3 tsconfig files (shared, mcp_server, scripts) — added `"outDir": "dist/"`
- `mcp_server/core/config.ts`, `scripts/core/config.ts` — updated path resolution for `dist/`
- 3 scripts __dirname fixes (workflow.ts, cleanup-orphaned-vectors.ts, content-filter.ts)
- `mcp_server/lib/search/vector-index.ts` + `vector-index-impl.js` — updated import paths
- `mcp_server/scripts/reindex-embeddings.ts` — path updates
- 8 cross-workspace re-export barrels → `@spec-kit/shared` / `@spec-kit/mcp-server`
- 5 entry point files (package.json updates) — point to `dist/` compiled output
- `.gitignore` — added `**/dist/` patterns
- ~30 test files (path updates)
- ~1400 compiled files deleted from source dirs

### Stream C (README Alignment)
- 16 READMEs under `scripts/`
- 27 READMEs under `mcp_server/`

### Stream C+ (Post-Phase 11 Documentation Fix)
- `.claude/mcp.json` — fixed entry point + placeholder keys + provider default
- `.vscode/mcp.json` — identical fixes
- `mcp_server/INSTALL_GUIDE.md` — fixed config examples, added troubleshooting sections, fixed script paths
- `mcp_server/README.md` — improved HuggingFace cache troubleshooting
- `install_guides/README.md` — fixed 5 entry point paths, config examples, troubleshooting

## Exit Criteria

- [x] `tsc --build` exits with 0 errors (all 3 workspaces)
- [x] MCP server starts via `node dist/context-server.js`
- [x] No placeholder API keys in any config file
- [x] All `context-server.js` references include `dist/` prefix
- [x] All `generate-context.js` references include `scripts/dist/memory/` prefix
- [x] No `@xenova/transformers` references (replaced by `@huggingface/transformers`)
- [x] All 43 READMEs reflect TypeScript sources + `dist/` output
- [x] Install scripts include cache cleanup for HF and native modules
- [x] `EMBEDDINGS_PROVIDER` defaults to `"hf-local"` everywhere (not `"auto"`)

---

## Cross-References

- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Parent Plan:** `092-javascript-to-typescript/plan.md`
- **Phase 10 Spec:** `phase-11-type-error-remediation/spec.md` (prerequisite)
- **Phase 8 Spec:** `phase-9-documentation-updates/spec.md` (initial README pass)
