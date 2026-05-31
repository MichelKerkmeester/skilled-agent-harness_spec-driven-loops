---
title: "Memory-Indexer Storage-Boundary Remediation"
description: "Closes the P1 constitutional README storage-boundary gap and 13 P2 advisories from the 005 deep review. Introduces isIndexableConstitutionalMemoryPath() as an SSOT predicate and wires it into every storage-layer mutation surface."
trigger_phrases:
  - "constitutional readme storage boundary fix"
  - "isIndexableConstitutionalMemoryPath"
  - "memory indexer review remediation"
  - "E_MEMORY_INDEX_SCOPE_EXCLUDED"
  - "checkpoint readme poisoning"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/001-fix-memory-indexer-storage-boundary` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The 005-memory-indexer-invariants deep review found that parser and discovery correctly excluded constitutional README files from indexing, but storage-layer mutation paths did not share that rule. A poisoned checkpoint or a pre-existing DB row could therefore survive a restore with `importance_tier='constitutional'` intact, which is incorrect behavior.

This phase added `isIndexableConstitutionalMemoryPath()` as a single-source-of-truth (SSOT) predicate in `mcp_server/lib/utils/index-scope.ts` and wired it into checkpoint restore, SQL update, post-insert metadata, the cleanup CLI, memory save, memory parser and discovery. A new regression test (`checkpoint-restore-readme-poisoning.vitest.ts`) first failed against the old guard and then passed once checkpoint restore adopted the shared predicate. Phase 2 added stable `E_MEMORY_INDEX_SCOPE_EXCLUDED` error codes and walker observability fields. Phase 3 closed 13 documentation and fixture advisories.

### Added

- `isIndexableConstitutionalMemoryPath()` SSOT predicate in `mcp_server/lib/utils/index-scope.ts`
- Regression test `mcp_server/tests/checkpoint-restore-readme-poisoning.vitest.ts` for poisoned checkpoint replay
- `warnings` and `capExceeded` fields on memory and code-graph scan responses
- Stable error code `E_MEMORY_INDEX_SCOPE_EXCLUDED` returned on save-time scope rejection
- Shared SQLite fixture builder `mcp_server/tests/fixtures/memory-index-db.ts`
- Repair / Verify / Rollback subsection in `mcp_server/README.md`

### Changed

- `mcp_server/lib/storage/checkpoints.ts`: checkpoint restore now downgrades constitutional README rows using the shared predicate
- `mcp_server/lib/search/vector-index-mutations.ts`: SQL update guard replaced with rule-file-only predicate
- `mcp_server/lib/storage/post-insert-metadata.ts`: metadata tier preservation now goes through the shared predicate
- `mcp_server/handlers/memory-save.ts`: save-time validation emits stable excluded-path error code
- `mcp_server/handlers/memory-index-discovery.ts`: discovery filtering and walker warnings updated to SSOT predicate
- `mcp_server/scripts/memory/cleanup-index-scope-violations.ts`: excluded-path policy derived from SSOT instead of inline SQL fragments

### Fixed

- Poisoned checkpoint rows for constitutional README were preserved as `importance_tier='constitutional'` after restore. Checkpoint restore now correctly downgrades them to `important`.
- Memory save path issued a generic error on scope rejection. The handler now returns `E_MEMORY_INDEX_SCOPE_EXCLUDED` with `canonicalPath` so clients can distinguish policy rejection from runtime failure.
- Shared fixture builder extracted for three vitest files that previously duplicated SQLite setup, reducing fixture drift risk.

### Verification

| Check | Result |
|-------|--------|
| Baseline focused suite before edits | PASS. 8 tests. exit 0. |
| Checkpoint poisoning test before T4 | FAIL as expected. Constitutional tier preserved. exit 1. |
| Checkpoint restore focused suite after T4 | PASS. 2 files. 4 tests. exit 0. |
| Runtime focused suite | PASS. 9 files. 25 tests. exit 0. |
| `npm run typecheck` in `mcp_server` | PASS. exit 0. |
| `npm run build` in `system-spec-kit` | PASS. exit 0. |
| Strict validator for `005-memory-indexer-invariants` | FAIL strict. exit 2. warnings 2: template header deviations and continuity freshness. |
| Strict validator for this remediation packet | FAIL. exit 2. Template structure gaps in `plan.md`, `tasks.md`, `checklist.md`. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Modified | Adds `isIndexableConstitutionalMemoryPath()` SSOT predicate. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | Modified | Downgrades constitutional README rows during restore. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` | Modified | Uses rule-file-only predicate for SQL update guard. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts` | Modified | Uses rule-file-only predicate before tier preservation. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Adds stable excluded-path error code and SSOT tier guard. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Modified | Adds discovery metadata and SSOT constitutional filtering. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified | Surfaces walker warnings and cap metadata. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` | Modified | Routes fallback metadata through guarded post-insert helper. |
| `.opencode/skills/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts` | Modified | Derives excluded rows from SSOT helpers instead of inline SQL. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/memory-index-db.ts` | Created (NEW) | Shared SQLite fixture builder. Migrates three existing test files. |

### Follow-Ups

- Strict packet validation is not green. Runtime remediation is tested, typechecked and built, but `validate.sh --strict` exits 2 due to template structure gaps in `plan.md`, `tasks.md` and `checklist.md`.
- T25 remains open. The final validator task was not marked complete because the validator did not pass.
- P2-002 is only partially closed. The 005 checklist has current-packet path cleanup, but a full every-row `file:line` normalization is still needed as part of the template repair pass.
