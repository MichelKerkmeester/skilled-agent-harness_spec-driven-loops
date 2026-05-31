---
title: "001 Code-Graph Consistency Remediation"
description: "Nine surgical fixes across the code-graph indexer, SQLite layer, query handler, context resolver and doctor diagnostic YAML close nine consistency-and-resilience findings from a prior deep-research pass. Per-file persistence is now atomic, concurrent writers wait instead of throwing, read queries get a stable snapshot, touch-only files no longer trigger reindex. The doctor workflow no longer calls a handler with the wrong contract."
trigger_phrases:
  - "code graph consistency remediation"
  - "atomic per-file persistence fix"
  - "sqlite busy timeout code graph"
  - "candidate manifest untracked files"
  - "doctor code graph workflow fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/001-fix-code-graph-consistency` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings`

### Summary

Nine consistency-and-resilience defects in the code-graph surface had been identified by a prior deep-research pass (findings F-002-A2-01 through F-002-A2-03, F-014-C4-01 through F-014-C4-04 plus F-004-A4-02 through F-004-A4-03). The defects ranged from partial-write hazards when a crash interrupted a multi-phase file persistence to the doctor diagnostic YAML calling a handler with the wrong contract and receiving empty results in autonomous mode.

Nine surgical fixes landed across five files. Per-file structural persistence in `persistIndexedFileResult` is now wrapped in a single `db.transaction(...)` that rolls back all four write phases on any throw. `initDb()` now sets `PRAGMA busy_timeout = 5000` so concurrent writers wait up to 5 seconds instead of throwing `SQLITE_BUSY`. Multi-SELECT query operations get a stable snapshot via a read transaction. Touch-only mtime drift no longer triggers reindex because content hash is checked before declaring a file stale. HEAD-drift that touches no index-tracked file no longer escalates to a full scan. A candidate manifest persists count and digest so newly added untracked files are discovered on the next `detectState` call. The doctor YAML Phase 1 analysis now derives stale and missed sets from `code_graph_status` plus a filesystem walk, which is what the fallback path in the YAML had always done, rather than calling `detect_changes({})` which returns affected symbols, not stale files. Subject resolution now returns a typed discriminated result so DB errors are distinct from absent rows. Three metadata getters gained `*WithDiagnostics()` companions that distinguish absent, corrupt-JSON or invalid-shape reads.

Six new vitest files covering 20 targeted tests pin the new behaviors and ship alongside the product edits.

### Added

- `*WithDiagnostics()` companions for `getLastDetectorProvenanceSummary`, `getLastGraphEdgeEnrichmentSummary` and `getLastGoldVerification` returning a discriminated `MetadataReadResult<T>` with `absent`, `resolved`, `corrupt` or `invalid-shape` states
- Candidate manifest stored under `code_graph_metadata.candidate_manifest` recording file count and sha256 digest for untracked-file discovery on `detectState`
- `classifyHeadDriftScope` helper in `ensure-ready.ts` that filters raw HEAD diffs through the indexed-file set before escalating to full scan
- Six new vitest files: `code-graph-atomic-persistence`, `code-graph-busy-timeout`, `code-graph-stale-mtime-vs-hash`, `code-graph-candidate-manifest`, `code-graph-metadata-shape` and `code-graph-resolve-subject-typed` (20 tests total)
- Typed `ResolveSubjectResult` internal discriminated union (`resolved`, `unresolved`, `unavailable`) in `code-graph-context.ts`

### Changed

- `persistIndexedFileResult` in `ensure-ready.ts` now wraps four storage operations in a single `db.transaction(...)`. Per-file scope keeps the lock window short.
- `initDb()` in `code-graph-db.ts` now sets `PRAGMA busy_timeout = 5000` immediately after `new Database(...)`, before WAL and foreign-key pragmas
- Multi-SELECT operations (`calls_from`, `calls_to`, `imports_from`, `imports_to` and transitive BFS) in `query.ts` now run inside a read transaction for a stable snapshot
- `isFileStale()` and `ensureFreshFiles()` in `code-graph-db.ts` now compare content hash on mtime drift. A touch with unchanged content is fresh.
- Doctor YAML Phase 1 Analysis rewritten around `code_graph_status` plus filesystem walk. The `detect_changes({})` call is removed.

### Fixed

- Partial-write hazard: a crash between the `replaceNodes` and `replaceEdges` phases of `persistIndexedFileResult` left rows half-applied. Transaction wrap eliminates the hazard.
- `SQLITE_BUSY` throw on concurrent scan invocations. Writers now wait up to 5 seconds for the write lock.
- Read-query snapshot skew: a concurrent index pass could shift the result set mid-flight across the multi-SELECT operations. Read transaction eliminates this.
- Gratuitous reindex on `git checkout` of touched-but-unchanged files. Hash check before declaring stale prevents the unnecessary scan.
- Full scan triggered by HEAD pointer changes that touched no indexed file. HEAD-scope filter keeps freshness at `fresh` when the diff is out of index scope.
- Doctor YAML calling `detect_changes({})` expecting stale/missed file lists but receiving affected-symbols output. Primary path now uses the correct handlers.
- Silent `null` from `resolveSubjectToRef` on DB error was indistinguishable from an absent row. The `unavailable` typed state surfaces DB failures to callers and emits a `console.warn`.

### Verification

| Check | Result |
|-------|--------|
| Targeted vitest (6 new files) | 20 of 20 tests passed. atomic-persistence x3, busy-timeout x3, stale-mtime-vs-hash x3, candidate-manifest x3, metadata-shape x6, resolve-subject-typed x2. |
| Code-graph full suite | 191 of 201 passed. 10 failures are pre-existing (4 indexer tsconfig path-format, 4 siblings-readiness mock, 1 scan readiness mock, 1 sibling-readiness mock) and unaffected by this packet. |
| TypeScript typecheck | `tsc --noEmit -p tsconfig.json` exit 0. Clean. |
| `npm run stress` | 193 of 195 pass. 2 failures (`gate-d-benchmark-memory-search` and `python-compat-stress`) are pre-existing flakes from uncommitted parallel-track edits in `skill_advisor/` and are not from code-graph scope. |
| Inline finding markers | 9 markers verified via grep across the 5 target files (32 total occurrences). |
| `validate.sh --strict` (this packet) | Errors: 0, Warnings: 4. Parity with sibling 004 worked-pilot at 0 errors / 4 warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts` | Modified | F-002-A2-01 atomic persistence wrap. F-014-C4-02 HEAD-scope filter. F-014-C4-03 candidate manifest. |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | F-002-A2-02 busy_timeout pragma. F-014-C4-01 hash-before-stale. F-004-A4-03 metadata diagnostics companions. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | Modified | F-002-A2-03 snapshot-stable read transaction around multi-SELECT operations. |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified | F-004-A4-02 typed `ResolveSubjectResult` internal discriminated union. |
| `.opencode/commands/doctor/assets/doctor_code-graph.yaml` | Modified | F-014-C4-04 Phase 1 Analysis redefined around `code_graph_status` plus filesystem walk. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts` (NEW) | Created | F-002-A2-01 atomic-write boundary test. 3 cases: success, mid-tx rollback, finalize rollback. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts` (NEW) | Created | F-002-A2-02 busy retry under contention. 3 cases: pragma set, secondary inheritance, bounded. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts` (NEW) | Created | F-014-C4-01 touch-only mtime drift is fresh. 3 cases: touch-only fresh, real change stale, missing-stored stale. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts` (NEW) | Created | F-014-C4-03 manifest persistence and drift detection. 3 cases: round-trip, absent, overwrite. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts` (NEW) | Created | F-004-A4-03 absent vs corrupt-JSON vs invalid-shape distinction. 6 cases across 3 getters. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts` (NEW) | Created | F-004-A4-02 typed unavailable state. 2 cases: no warn on absent, no warn on no-nodes. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts` | Modified | Added `transaction` mock to `createDb()` and inline mock for F-002-A2-03 wrapping. |
| `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | Modified | Updated broad-stale fixture to use real content drift (post-F-014-C4-01) instead of mtime-only drift. |

### Follow-Ups

- Commit and push the staged changes to `origin main`. This is the final step listed in the checklist and the only open item.
- Consider surfacing the `unavailable` subject-resolution kind through the MCP tool envelope so external `code_graph_context` consumers see the discriminated state, not just `null`.
- Add metrics-level visibility into SQLite contention duration so operators tuning latency can distinguish a 50ms wait from a 4500ms wait under `busy_timeout`.
