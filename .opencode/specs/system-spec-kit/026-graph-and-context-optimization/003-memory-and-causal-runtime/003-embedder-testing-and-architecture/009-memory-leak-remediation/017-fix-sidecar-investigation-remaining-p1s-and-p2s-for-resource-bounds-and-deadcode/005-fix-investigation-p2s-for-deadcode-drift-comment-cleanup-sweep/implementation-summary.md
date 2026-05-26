---
title: "Implementation Summary: Investigation P2 Cleanup Sweep"
description: "Completion record for 34 closed and 34 deferred P2 cleanup findings across embedder surfaces."
trigger_phrases:
  - "arc 010 003 005 summary"
  - "p2 cleanup implementation summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "completed-34-of-68-p2-cleanups"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts"
    session_dedup:
      fingerprint: "sha256:0100030050100030050100030050100030050100030050100030050100030050"
      session_id: "010-003-005-p2-cleanup"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Closed safe cleanup findings and deferred behavior-changing findings."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Investigation P2 Cleanup Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Completed |
| **completion_pct** | 50 |
| **Spec Folder** | 005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep |
| **Completed** | 2026-05-23 |
| **Level** | 2 |
| **Findings Closed** | 34 |
| **Findings Deferred** | 34 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet closed the safe half of the P2 cleanup backlog without changing runtime behavior. The implementation removes dead barrel exports, stale comments, single-call helper noise, duplicate row-shape conversion, and type drift; anything that would alter process lifecycle, env policy, public response shape, or test-only APIs is documented as deferred.

### Batch Closure

| Batch | Surface | Closed | Deferred | Notes |
|-------|---------|--------|----------|-------|
| 1 | `reindex.ts` | 12 | 4 | Job row aliases, status SQL, shard metadata, comment dividers, batch helper cleanup |
| 2 | `sidecar-client.ts` | 5 | 8 | Public JSDoc and unused type export cleanup; env/public-shape changes deferred |
| 3 | `ensure-rerank-sidecar.cjs` | 2 | 11 | Export pruning and timeout parser split; filesystem/env/lifecycle changes deferred |
| 4 | `execution-router.ts` | 3 | 5 | Type export and provider normalization cleanup; signal/cache/direct adapter redesign deferred |
| 5 | `sidecar-worker.ts` | 4 | 4 | Shared input type, request envelope validation, and dead fallback cleanup |
| 6 | `index.ts`, `schema.ts`, registry | 8 | 2 | Barrel cleanup and schema helper-chain cleanup; shared/test-live registry exports deferred |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | Close safe reindex cleanup findings |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modified | Close docs/type export findings |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modified | Prune unused exports and split timeout parsing |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modified | Cleanup execution-policy type export and provider normalization |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` | Modified | Cleanup shared input type, base request, parse assertion, and input fallback |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts` | Modified | Remove stale comments and unused barrel re-exports |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts` | Modified | Inline single-call helper chain |
| `<this-folder>/*.md` | Modified | Record closure/defer status and handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was scaffolded with the official `create.sh` flow and validated before implementation. Each source file was read in full, then the cleanup was applied surface by surface with current-source importer checks. Regression verification ran after source edits, and docs were finalized after closure/defer classification.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Kept test-live exports | Test files were out of scope, and breaking regression tests to remove test-only APIs would violate the packet contract. |
| Deferred behavior-changing P2s | Env policy, signal handling, filesystem durability, credential cache, public response shape, and fallback changes need dedicated hardening packets. |
| Closed stale findings by absence | Some registry findings pointed at helpers/branches removed by earlier sibling packets; current-source absence is valid closure evidence. |
| Used equivalent CJS vitest command | The user-provided command path references missing `node_modules` and a config path from the wrong cwd; the installed Vitest binary and `.opencode` cwd produced the intended test run. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` after scaffold | PASS, exit 0 |
| `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | PASS on rerun, 4 files and 40 tests. First run hit F48 random-id monotonic flake. |
| `cd .opencode/skills/system-spec-kit && node node_modules/vitest/vitest.mjs run .opencode/bin/lib/ensure-rerank-sidecar.vitest.ts --config .opencode/vitest.config.bin.ts` | Command path failed: missing `node_modules/vitest/vitest.mjs`. |
| `cd .opencode && node skills/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs run bin/lib/ensure-rerank-sidecar.vitest.ts --config vitest.config.bin.ts` | PASS, 1 file, 11 passed, 5 skipped. |
| `cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server` | PASS, exit 0 |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/lib/embedders` | PASS, 12 files scanned, 0 findings |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` after final docs | PASS, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **34 findings deferred.** These require behavior changes, test rewrites, shared/Python-side changes, or public API changes outside this cleanup-only packet.
2. **Literal CJS test command is not runnable in this checkout.** The equivalent command from `.opencode` with the installed Vitest binary passes.
3. **No commit performed.** The branch remains dirty with unrelated pre-existing changes outside this packet.
<!-- /ANCHOR:limitations -->

---

## Commit Handoff

Changed or created files for this packet:

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/lib/ensure-rerank-sidecar.cjs`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/plan.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/tasks.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/checklist.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/decision-record.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/implementation-summary.md`

Suggested commit:

`chore(010/003/005): close 34 of 68 P2 cleanup findings across embedder surfaces`

PACKET-010-003-005 DONE: 34 closed, 34 deferred, regression PASS, EXIT=0
