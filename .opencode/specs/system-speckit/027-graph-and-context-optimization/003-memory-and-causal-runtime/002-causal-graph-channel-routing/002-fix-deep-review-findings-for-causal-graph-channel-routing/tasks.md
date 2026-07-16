---
title: "Tasks: 002 Deep-Review Remediation"
description: "21 batches across 4 tiers, each one cli-codex dispatch. Update as each batch lands."
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing/002-fix-deep-review-findings-for-causal-graph-channel-routing"
    last_updated_at: "2026-05-11T11:30:00Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "All T1-T4 batches closed"
    next_safe_action: "Packet ready for parent closure"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 002 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 3 -->

Legend: `[ ]` = pending, `[~]` = in-flight, `[x]` = done.

## Tier 1 — Release Blockers

- [x] **T1.1** Wire `invalidateEntityDensityCache()` into `memory-save.ts` post-commit branch (P1-C-001 / REQ-T1-001)
- [x] **T1.2** Wire `invalidateEntityDensityCache()` into `memory-bulk-delete.ts` post-commit branch (P1-C-001 / REQ-T1-002)
- [x] **T1.3** Integration test + resource-map P1 fixes (P1-002, P1-003, P2-015, P2-TR-002, P2-TR-005, REQ-T1-003, REQ-T1-004)

## Tier 2a — Code Polish

- [x] **T2a.1** `entity-density.ts` reliability cluster (P2-008, P2-010, P2-011, P2-C-001, P2-021, ADV-003, F10-004, S7-001)
- [x] **T2a.2** `entity-density.vitest.ts` rebuild-after-success-failure test (P2-C-002)
- [x] **T2a.3** `query-router.ts` pre-computed intent dedup (P1-001 downgraded)
- [x] **T2a.4** `query-router.ts` JSDoc + module header + flag self-gate (P2-003, P2-017, P2-018, P2-019, P2-020)
- [x] **T2a.5** `query-router.ts` env-flag tightening (ADV-001 / REQ-T2-003)
- [x] **T2a.6** `query-router.ts` routingReasons label + clamp + safeGetDb warn-once (P2-009, P2-012, P2-013)
- [x] **T2a.7** `routing-telemetry.ts` ChannelName + ring-buffer rename + Set dedup (P2-001, P2-002, F10-005)
- [x] **T2a.8** `memory-crud-health.ts` try/catch fallback (P2-004)
- [x] **T2a.9** Shared test helpers + dedup + withFeatureFlag wire-up (P2-022, P2-023, ADV-002)

## Tier 2b — Doc Polish

- [x] **T2b.1** `001/spec.md` Status field (F10-001)
- [x] **T2b.2** `001/plan.md` Definition of Done (F10-002)
- [x] **T2b.3** `001/handover.md` completion_pct (F10-003)
- [x] **T2b.4** `001/implementation-summary.md` test counts + Q2 answer (P2-TR-001, P2-TR-006)
- [x] **T2b.5** `001/checklist.md` CHK-052 evidence (P2-TR-007)
- [x] **T2b.6** `001/scratch/live-smoke-results.md` line ref (P2-TR-003)
- [x] **T2b.7** Feature catalog + playbook (P2-016, P2-TR-004, P2-14)

## Tier 3 — Metadata

- [x] **T3.1** `001/graph-metadata.json` key_files dedup (F10-006)

## Tier 4 — Quality Gate

- [x] **T4.1** `npm run build` + full vitest baseline-vs-post (REQ-T2-004, REQ-T2-005)
- [x] **T4.2** `validate.sh --strict` exit 0 (SC-003)
- [x] **T4.3** Fill `002/implementation-summary.md` with closing-status table + verification table
- [x] **T4.4** Optional: single `@review` agent confirmation pass

---

<!-- ANCHOR:notation -->
## TASK NOTATION

`[ ]` means pending, `[~]` means in-flight, and `[x]` means complete with evidence.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

T1 prepared the release-blocker closure path by wiring cache invalidation and fixing resource-map drift.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

T2a and T2b completed source, test, documentation, and traceability remediation.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

T3 and T4 complete metadata cleanup, strict validation, targeted tests, and synthesis.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

The packet is complete when strict validation exits 0 and targeted vitest passes 91 tests across 4 files.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `plan.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
