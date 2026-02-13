# Verification Checklist: Phase 11 — outDir Migration + Setup Hardening + README Alignment

> **Parent Spec:** 092-javascript-to-typescript/

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level3plus-govern | v2.0 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence format:** When marking `[x]`, provide evidence on the next line:
```
- [x] CHK-NNN [Px] Description
  - **Evidence**: [verification output / grep result]
```

---

## Stream A: Setup Hardening

- [x] CHK-300 [P0] `opencode.json` — no placeholder API keys
  - **Evidence**: `grep "YOUR_.*_KEY_HERE" opencode.json` → 0 matches

- [x] CHK-301 [P0] `opencode.json` — `EMBEDDINGS_PROVIDER` set to `"hf-local"` (not `"auto"`)
  - **Evidence**: Line 26: `"EMBEDDINGS_PROVIDER": "hf-local"`

- [x] CHK-302 [P0] `install-spec-kit-memory.sh` — no placeholder API keys in generated config
  - **Evidence**: Script generates config with `"EMBEDDINGS_PROVIDER": "hf-local"` and no API key entries

- [x] CHK-303 [P1] `install-code-mode.sh` — npx cache cleanup step included
  - **Evidence**: Script includes `rm -rf ~/.npm/_npx/*`

- [x] CHK-304 [P1] `retry-manager.ts` — handles `ERR_DLOPEN_FAILED`
  - **Evidence**: Enhanced error detection for native module failures

---

## Stream B: outDir Refactor

- [x] CHK-305 [P0] All 3 tsconfig files have `"outDir": "dist/"` configured
  - **Evidence**: shared/tsconfig.json, mcp_server/tsconfig.json, scripts/tsconfig.json all include `"outDir": "dist/"`

- [x] CHK-306 [P0] `tsc --build` produces output only in `dist/` directories
  - **Evidence**: Compiled .js files only in `dist/` subdirectories, not alongside `.ts` sources

- [x] CHK-307 [P0] `mcp_server/core/config.ts` resolves paths correctly from `dist/core/`
  - **Evidence**: `SERVER_DIR = path.join(__dirname, '..', '..')` resolves to mcp_server root from dist/core/

- [x] CHK-308 [P0] All 5 package.json entry points reference `dist/` compiled output
  - **Evidence**: `"main"` fields point to `dist/` paths

- [x] CHK-309 [P0] All test suites pass after outDir migration
  - **Evidence**: `test:cli`, `test:embeddings`, `test:mcp` all pass

- [x] CHK-310 [P0] ~1400 compiled artifacts removed from source directories
  - **Evidence**: `git status` shows deleted `.js` files from source dirs

- [x] CHK-311 [P1] `.gitignore` includes `**/dist/` patterns
  - **Evidence**: `.gitignore` updated with dist exclusion patterns

---

## Stream C: README Alignment

- [x] CHK-312 [P0] `mcp_server/README.md` — structure tree shows `.ts` sources + `dist/`
  - **Evidence**: 5 edits applied (structure tree, quick start, path resolution)

- [x] CHK-313 [P0] `mcp_server/INSTALL_GUIDE.md` — all entry points reference `dist/context-server.js`
  - **Evidence**: 14 instances updated, all `context-server.js` references now include `dist/`

- [x] CHK-314 [P0] `system-spec-kit/README.md` — directory tree and script paths updated
  - **Evidence**: 12 edits applied, tool name fixed (`memory_drift_why`)

- [x] CHK-315 [P1] All 40 sub-module READMEs updated for TS sources + `dist/` output
  - **Evidence**: Batch update across 16 `scripts/` + 24 `mcp_server/` READMEs

---

## Stream C+: Post-Discovery Config Fix

- [x] CHK-316 [P0] `.claude/mcp.json` — entry point includes `dist/`, no placeholder keys, `hf-local`
  - **Evidence**: `grep "context-server.js" .claude/mcp.json` → shows `dist/context-server.js`; `grep "YOUR_" .claude/mcp.json` → 0 matches; `grep '"auto"' .claude/mcp.json` → 0 matches

- [x] CHK-317 [P0] `.vscode/mcp.json` — identical fixes verified
  - **Evidence**: Same grep verification as CHK-316, all pass

- [x] CHK-318 [P0] `mcp_server/INSTALL_GUIDE.md` — config examples fixed + troubleshooting added
  - **Evidence**: 0 placeholder keys; HF cache corruption section present; native module mismatch section present; 5 `generate-context.js` paths updated

- [x] CHK-319 [P1] `mcp_server/README.md` — HF cache troubleshooting covers in-project cache
  - **Evidence**: `grep "transformers/.cache" mcp_server/README.md` → match in troubleshooting

- [x] CHK-320 [P1] `install_guides/README.md` — all 5 entry points fixed + config examples + troubleshooting
  - **Evidence**: `grep "context-server.js" install_guides/README.md` → all show `dist/`; `grep '"auto"' install_guides/README.md` → 0 matches

---

## Phase 11 Quality Gate

- [x] CHK-321 [P0] No `YOUR_VOYAGE_API_KEY_HERE` or `YOUR_OPENAI_API_KEY_HERE` in any config/doc file
  - **Evidence**: Verified across .claude/mcp.json, .vscode/mcp.json, INSTALL_GUIDE.md — 0 matches

- [x] CHK-322 [P0] All `context-server.js` references include `dist/` prefix
  - **Evidence**: Verified across all config and documentation files

- [x] CHK-323 [P0] No `"auto"` as `EMBEDDINGS_PROVIDER` value in config files
  - **Evidence**: .claude/mcp.json and .vscode/mcp.json both use `"hf-local"`

- [x] CHK-324 [P0] All `generate-context.js` paths include `scripts/dist/memory/`
  - **Evidence**: All 5 occurrences in INSTALL_GUIDE.md show `scripts/dist/memory/generate-context.js`

- [x] CHK-325 [P1] Troubleshooting sections cover HF cache + native module issues
  - **Evidence**: `ERR_DLOPEN_FAILED` and `transformers/.cache` present in INSTALL_GUIDE.md troubleshooting

- [x] CHK-326 [P1] No `@xenova/transformers` references in config files
  - **Evidence**: `grep "xenova" .claude/mcp.json .vscode/mcp.json` → 0 matches

- [x] CHK-327 [P2] Parent `tasks.md` and `checklist.md` updated with Phase 11 completion
  - **Evidence**: Retroactive spec folder documentation created

---

## Verification Summary

| Category | Total | Verified | Priority Breakdown |
|----------|------:|--------:|-------------------|
| Setup Hardening | 5 | 5/5 | 3 P0, 2 P1 |
| outDir Refactor | 7 | 7/7 | 6 P0, 1 P1 |
| README Alignment | 4 | 4/4 | 3 P0, 1 P1 |
| Config Fix (C+) | 5 | 5/5 | 3 P0, 2 P1 |
| Quality Gate | 7 | 7/7 | 4 P0, 2 P1, 1 P2 |
| **TOTAL** | **28** | **28/28** | **19 P0, 7 P1, 2 P2** |

**Verification Date**: 2026-02-07

---

## Cross-References

- **Spec:** See `spec.md`
- **Plan:** See `plan.md`
- **Tasks:** See `tasks.md`
- **Decision Record:** See `decision-record.md`
- **Parent Checklist:** `092-javascript-to-typescript/checklist.md`
