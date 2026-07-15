---
title: "Implementation Summary: Causal Edge Tombstones"
description: "Completed implementation evidence for tombstone-backed causal edge deletion and orphan cleanup."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/002-causal-edge-tombstones"
    last_updated_at: "2026-06-10T07:10:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented tombstone-backed causal edge deletion"
    next_safe_action: "Proceed to metadata-edge promoter phase"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-004-research-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-causal-edge-tombstones |
| **Completed** | 2026-06-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Active causal-edge deletion now leaves an audit trail before the active row disappears. The active `causal_edges` table stays simple for graph reads, while `causal_edge_tombstones` preserves enough restore metadata to diagnose or reverse a bad cleanup inside a retention workflow.

### Tombstone Sweep Foundation

`lib/causal/sweep.ts` now centralizes read-before-delete behavior. It snapshots matching active edges, writes tombstones with a monotonic lifecycle generation per source/target/relation, hard-deletes by active edge id, and clears graph caches after durable deletes.

### Delete Path Integration

Every active production delete path now routes through the sweep helper directly or through the updated causal-edge storage wrappers. This includes single memory delete, folder/tier bulk delete, stale memory-index cleanup, manual unlink, health orphan repair, CLI cleanup, vector-index mutation cleanup, checkpoint scoped restore cleanup, and correction undo cleanup.

### Health Reporting

`memory_health` now reports orphan causal edges with endpoint state before repair. Confirmed auto-repair tombstones and deletes orphan active rows, records repaired/tombstoned counts, and leaves unconfirmed health reads non-destructive.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/sweep.ts` | Created | Central tombstone-then-delete helper and tombstone schema setup. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modified | Added additive v32 tombstone migration and compatibility footprint. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modified | Routed storage delete helpers and orphan cleanup through tombstones. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` | Modified | Replaced mutation cleanup raw causal-edge delete with sweep helper. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | Modified | Tombstones active causal edges during scoped restore cleanup. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/learning/corrections.ts` | Modified | Tombstones correction-owned edge deletes during undo. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | Modified | Passes delete reason and restore context into causal cleanup. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Modified | Passes bulk delete reason and restore context into causal cleanup. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Reports orphan edge samples and tombstones on confirmed repair. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Modified | Manual unlink records tombstone reason and restore context. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified | Stale cleanup tombstones with scan-specific context before memory-row delete. |
| `.opencode/skills/system-spec-kit/mcp_server/cli.ts` | Modified | CLI bulk delete preserves helper semantics and restore context. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-edge-tombstones.vitest.ts` | Created | Covers single delete, bulk delete, manual unlink, and health orphan repair tombstones. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts` | Modified | Updates minimal compatible footprint for tombstone schema. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Modified | Pins terminal schema version 32 and verifies v32 migration. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change shipped as an additive schema migration and wrapper-level routing update. Existing active-edge reads keep using `causal_edges` without tombstone filters, while deletion paths now snapshot first and then hard-delete inside the same SQLite transaction where practical.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Keep active edges hard-deleted | Active graph reads stay fast and simple; audit lives in a separate tombstone table. |
| Store restore metadata as compact JSON | The fixed tombstone columns stay small while restore workflows still get anchors, evidence, strength, creator, timestamps, command, and context. |
| Use v32 additive migration | Existing active edges survive migration and only gain tombstone history when a post-migration delete occurs. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `npm run build` | PASS: `tsc --build && node scripts/finalize-dist.mjs` exited 0. |
| `npm exec vitest run tests/*causal*.vitest.ts tests/secret-scrubber.vitest.ts tests/vector-index-schema-compatibility.vitest.ts tests/vector-index-schema-migration-refinements.vitest.ts tests/vector-index-schema-incremental-foundation.vitest.ts` | PASS: 16 files, 325 tests. |
| `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <modified code files>` | PASS: no output, exit 0. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server` | FAIL outside scope: only pre-existing `lib/storage/canonical-fingerprint.ts` and `lib/storage/memo.ts` are missing module headers. |
| Strict spec validation | PASS: strict validation passed with 0 errors and 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. Historical active edges have no tombstone history for deletes that happened before v32. Audit begins at the first post-migration delete.
2. The alignment drift checker still reports two out-of-scope module-header defects in files not touched by this phase.
<!-- /ANCHOR:limitations -->

---
