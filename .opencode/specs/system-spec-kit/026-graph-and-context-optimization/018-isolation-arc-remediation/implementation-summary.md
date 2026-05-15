---
status: in-progress
spec: 018-isolation-arc-remediation
track: system-spec-kit/026-graph-and-context-optimization
updated: 2026-05-15
---

# Implementation Summary

This is a multi-phase remediation packet for isolation-arc findings from the 017 deep-review. Phase summaries append here as each scoped remediation lands.

## Phase A+B — Path Validation + Atomic Write

Files modified:
- `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-boundary-path-validation.vitest.ts`
- `.opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts`

Findings closed:
- P0-1/4: path traversal risk in boundary wrapper marker reads
- P0-2/5: directory traversal risk in readiness marker writes
- P0-3: marker read/write race handling
- P1-5: no atomic write pattern for readiness marker

Code walkthrough:
- `code-graph-boundary.ts` now computes a fixed marker base directory for `system-code-graph/mcp_server/database/`, validates the marker path with `validateMarkerPath()`, logs and returns `null` for validation failures, and retries once after a `SyntaxError` before falling back to missing-marker semantics.
- `readiness-marker.ts` now validates marker writes against the fixed code-graph database base directory before any `writeFileSync` call. Out-of-bounds writes log and return without throwing through the daemon path.
- Marker writes now use a temp file named `<marker>.tmp.<pid>` followed by `renameSync()` to publish atomically. Rename failures trigger best-effort temp cleanup and skip the marker write.

Verification results:
- `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit` passed.
- `cd .opencode/skills/system-code-graph/mcp_server && ../node_modules/typescript/bin/tsc --noEmit` passed. The requested `npx tsc --noEmit` command in this directory resolves to the deprecated `tsc` shim because the local `.bin/tsc` symlink is broken; the installed TypeScript compiler itself passes cleanly.
- `npx vitest run tests/code-graph-boundary-path-validation.vitest.ts --reporter=default` passed: 5/5 tests.
- `npx vitest run tests/readiness-marker-atomic-write.vitest.ts --reporter=default` passed: 5/5 tests.
- `npx vitest run tests/structural-contract.vitest.ts tests/session-bootstrap.vitest.ts --reporter=default` passed: 18/18 tests.
- Hard import audit returned no `system-code-graph` imports from `system-spec-kit/mcp_server`.

## Phase C — CI Isolation Check

File added:
- `.github/workflows/isolation-check.yml`

What it checks:
- Runs on pull requests targeting `main` when `.opencode/skills/system-spec-kit/mcp_server/**` or `.opencode/skills/system-spec-kit/shared/**` changes.
- Fails if TypeScript or JavaScript source under `system-spec-kit/mcp_server/` imports from `system-code-graph`, excluding `dist/`, `node_modules/`, `tests/`, and `stress_test/`.
- Fails on the same source scope for imports from `system-skill-advisor`, giving both extracted skills automated isolation enforcement.
- Prints boundary guidance for `system-code-graph` matches: use `mcp_server/lib/code-graph-boundary.ts` or `@spec-kit/shared` types instead of cross-skill source imports.

Smoke test result:
- Current source audit passed clean for both `system-code-graph` and `system-skill-advisor` import patterns.
- A synthetic violation provided over stdin was caught by the same ripgrep pattern without writing outside the approved Phase C paths.
- The source tree audit returned clean after the synthetic check.

## Phase D — MCP Subprocess Env Allowlist

Files modified:
- `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-boundary-env-allowlist.vitest.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-isolation-arc-remediation/implementation-summary.md`

Finding closed:
- P1-FINDING-004 from 017 deep-review: broad environment passing in the MCP subprocess boundary wrapper.

Code walkthrough:
- Replaced the broad `processEnv()` passthrough with exported `buildSubprocessEnv()`.
- The subprocess env now keeps only OS and Node startup basics, Homebrew path hints, and project-owned namespace prefixes: `SPECKIT_`, `MEMORY_`, `CODE_GRAPH_`, `SPEC_KIT_`, `COCOINDEX_`, `EMBEDDINGS_`, `MK_CODE_INDEX_`, and `MK_SPEC_MEMORY_`.
- Caller extras are applied last so explicit subprocess overrides still win on key collision.
- Added direct allowlist coverage for dropped secret or unknown variables, preserved basics, preserved namespace variables, and extras override behavior.

Verification results:
- `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit 2>&1 | tail -5` passed with no diagnostics.
- `npx vitest run tests/code-graph-boundary-env-allowlist.vitest.ts --reporter=default 2>&1 </dev/null | tail -5` passed: 7/7 tests.
- `npx vitest run tests/code-graph-boundary-path-validation.vitest.ts --reporter=default 2>&1 </dev/null | tail -5` passed: 5/5 tests.
- Hard import audit returned no `system-code-graph` imports from `system-spec-kit/mcp_server`.

## Phase E — Move compact-merger + budget-allocator to @spec-kit/shared

Files moved:
- `.opencode/skills/system-spec-kit/mcp_server/lib/context/compact-merger.ts` -> `.opencode/skills/system-spec-kit/shared/compact-merger.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/context/budget-allocator.ts` -> `.opencode/skills/system-spec-kit/shared/budget-allocator.ts`

Importers updated:
- 2 importers in `system-spec-kit/mcp_server/` now import `mergeCompactBrief` from `@spec-kit/shared/compact-merger`.

Shared package exports:
- `@spec-kit/shared/compact-merger`
- `@spec-kit/shared/budget-allocator`
- Barrel exports from `@spec-kit/shared` for `mergeCompactBrief`, budget allocation helpers, and their public types.

Dependency boundary note:
- `compact-merger.ts` no longer imports from `mcp_server/lib/context/shared-payload.ts`. It carries the compact payload envelope shape it returns, keeping `@spec-kit/shared` independent of MCP server source while avoiding a broad move of the 1k-line shared-payload contract.

Verification results:
- `cd .opencode/skills/system-spec-kit/shared && npm run build 2>&1 | tail -10` passed.
- `cd .opencode/skills/system-spec-kit/shared && npx tsc --noEmit 2>&1 | tail -10` passed with no diagnostics.
- `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit 2>&1 | tail -10` passed with no diagnostics.
- Hard import audit returned no stale `../lib/context/compact-merger` or `../lib/context/budget-allocator` imports from `system-spec-kit/mcp_server`.
- `npx vitest run tests/structural-contract.vitest.ts tests/session-bootstrap.vitest.ts tests/code-graph-boundary-path-validation.vitest.ts --reporter=default 2>&1 </dev/null | tail -8` passed: 23/23 tests across 3 files.
- Cross-skill isolation audit returned no `system-code-graph` imports from `system-spec-kit/mcp_server`.

## Phase F — Structural-Contract Coverage Diff

File added:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-isolation-arc-remediation/review/coverage-diff.md`

Finding closed:
- P1-FINDING-003 from 017 deep-review: no verification that the rewritten `structural-contract.vitest.ts` preserves original intent.

Coverage verdict:
- **REWRITE PRESERVES INTENT - NO ACTION**

Coverage counts:
- Pre-rewrite: 16 tests at `.opencode/skills/system-code-graph/mcp_server/tests/structural-contract.vitest.ts` from `0dba8febf^` (`ff91ddfe4`), 534 LOC.
- Post-rewrite: 16 tests at `.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts` from `0dba8febf`, 290 LOC.
- Preserved: 1
- Renamed: 6
- Replaced: 1
- Removed: 8 cross-skill, 0 vocabulary-drift, 0 duplicate, 0 genuine coverage loss
- New: 8

Risk classification:
- Cross-skill scenarios: 8 removed tests covered code-graph indexer and scan-handler internals. They cannot be replicated in a pure spec-kit unit without reintroducing the dependency arc; coverage is delegated to the code-graph suite if exact regression protection is still needed.
- Vocabulary drift: 0.
- Duplicates: 0 exact duplicates found. Related code-graph coverage exists for incremental scan option forwarding and DB-layer duplicate symbol handling.
- Genuine coverage loss: 0 for structural-contract intent.

Full matrix:
- `review/coverage-diff.md`
