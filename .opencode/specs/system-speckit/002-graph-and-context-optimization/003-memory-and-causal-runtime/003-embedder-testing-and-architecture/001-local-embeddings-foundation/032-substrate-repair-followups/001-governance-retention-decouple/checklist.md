---
title: "Checklist: Governance Retention Decouple"
description: "Verification checklist with evidence for ADR-002 Option A."
trigger_phrases:
  - "governance retention decouple checklist"
  - "ephemeral TTL checklist"
  - "ADR-002 Option A evidence"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/001-governance-retention-decouple"
    last_updated_at: "2026-05-14T11:10:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Checklist filled with PASS/FAIL evidence."
    next_safe_action: "Investigate llama-cpp provider separately if top-3 search proof is mandatory."
---

# Verification Checklist: Governance Retention Decouple

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| [P0] | Hard blocker | Cannot claim code behavior without completion |
| [P1] | Required | Must complete or document blocker |
| [P2] | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
  - Evidence: ADR-002 Option A requirements recorded in packet spec.
- [x] CHK-002 [P0] Source and ADR context read.
  - Evidence: `scope-governance.ts`, `memory-save.ts`, and ADR-002 read before editing.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Source governance helper updated.
  - Evidence: `DEFAULT_EPHEMERAL_TTL_MS` added and non-governed ephemeral path computes TTL.
- [x] CHK-011 [P0] Dist mirror updated.
  - Evidence: ignored dist JS contains the same constant and runtime logic.
- [x] CHK-012 [P1] Explicit TTL-only ephemeral case preserved.
  - Evidence: Case C vitest passes with caller `deleteAfter` unchanged.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Focused vitest passes.
  - Evidence: 1 file passed, 3 tests passed.
- [x] CHK-021 [P0] Existing governance tests pass.
  - Evidence: 4 files passed, 30 tests passed.
- [x] CHK-022 [P1] Live save path checked.
  - Evidence: handler returned id `3372`, and row inspection required non-null `delete_after`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Ephemeral retention no longer requires full governance fields.
  - Evidence: vitest Case B and live save id `3372`.
- [x] CHK-031 [P0] Explicit full-governance behavior still works.
  - Evidence: vitest Case A.
- [x] CHK-032 [P1] Requested top-3 search check attempted and blocker documented.
  - Evidence: `memory_search` failed because llama-cpp could not initialize Metal for query embeddings.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Governance enforcement remains active for scope/provenance fields.
  - Evidence: only retention-only ephemeral inputs bypass governance; scoped/provenance inputs still trigger validation.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Plan completed.
  - Evidence: `plan.md`.
- [x] CHK-051 [P1] Tasks completed.
  - Evidence: `tasks.md`.
- [x] CHK-052 [P1] Implementation summary completed.
  - Evidence: `implementation-summary.md`.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Sandbox removed.
  - Evidence: `.opencode/specs/_sandbox/999-001-verify` removed with `rmdir`.
- [x] CHK-061 [P1] No out-of-scope source files modified.
  - Evidence: code changes are limited to source governance helper, dist mirror, and the new vitest.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Status | Evidence |
|----------|--------|----------|
| Focused tests | PASS | 3/3 passed |
| Regression tests | PASS | 30/30 passed |
| Live save | PASS | id `3372`, no E085 |
| Live search | FAIL | llama-cpp Metal context failure before results |
| Cleanup | PASS | id deleted and sandbox removed |

<!-- /ANCHOR:summary -->
