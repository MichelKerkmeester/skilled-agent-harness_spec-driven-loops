---
title: "Verification Checklist: standalone save second-writer guard"
description: "Verification checklist for generate-context Step 11.5 daemon liveness detection, direct-index skip behavior, and operator guidance."
trigger_phrases:
  - "standalone save second writer checklist"
  - "Step 11.5 daemon guard verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented standalone save daemon guard"
    next_safe_action: "Run staged verification"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Standalone Save Second-Writer Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md.
- [x] CHK-002 [P0] Required files read before editing.
- [x] CHK-003 [P1] Sibling 009 Level 2 structure reviewed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `daemon-detect.ts` is dependency-free and synchronous.
- [x] CHK-011 [P0] Workflow stale-lock cleanup and daemon detection share `isProcessAlive`.
- [x] CHK-012 [P0] Step 11.5 checks daemon liveness before importing indexing.
- [x] CHK-013 [P0] Daemon-up path skips `initializeIndexingRuntime()` and `reindexSpecDocs()`.
- [x] CHK-014 [P1] Daemon-down path keeps existing direct indexing behavior.
- [x] CHK-015 [P1] No daemon, launcher, sibling 009/010/012, DB, or SQLite pragma files changed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `npm run build` passes from the scripts workspace.
- [x] CHK-021 [P0] Detector vitest covers live PID, dead PID, and missing lease.
- [x] CHK-022 [P0] Step 11.5 vitest proves daemon-up skip does not call the indexing runtime.
- [x] CHK-023 [P1] Step 11.5 vitest covers contention diagnostic fallback.
- [x] CHK-024 [P1] Shared-config scripts vitest behavior recorded. (per implementation-summary: daemon-detect + workflow-step115-daemon-guard, 6 tests PASS.)
- [x] CHK-025 [P1] Strict spec validation exits 0. (PASS 2026-05-29 — validate.sh --strict exit 0.)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: standalone save second writer.
- [x] CHK-FIX-002 [P0] Producer inventory: Step 9 canonical docs are written before Step 11.5 indexing.
- [x] CHK-FIX-003 [P0] Consumer inventory: daemon-up freshness is delegated to MCP `memory_index_scan`.
- [x] CHK-FIX-004 [P0] Adversarial: lease acquisition was not added at the wrong layer.
- [x] CHK-FIX-005 [P1] Generic skip warning hardened for known contention signatures.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced.
- [x] CHK-031 [P0] No new network or external command surface.
- [x] CHK-032 [P1] No data files modified or recovered.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist/implementation-summary authored.
- [x] CHK-041 [P1] Status set to implemented.
- [x] CHK-042 [P1] `/memory:save` operator guidance updated.
- [x] CHK-043 [P2] Out-of-scope bans documented.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet created under `007-mcp-daemon-reliability/013-standalone-save-second-writer-guard`.
- [x] CHK-051 [P1] No `030-*` folder created or used.
- [x] CHK-052 [P1] No `description.json` or `graph-metadata.json` generated.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-29 (scripts vitest recorded + strict validation PASS)
<!-- /ANCHOR:summary -->

