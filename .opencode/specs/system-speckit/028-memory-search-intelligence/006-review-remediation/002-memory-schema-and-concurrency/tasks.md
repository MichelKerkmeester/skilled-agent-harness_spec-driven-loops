---
title: "Tasks: Memory Schema and Concurrency Remediation"
description: "PENDING task list for the derived-id, in-lock embedding and retention spare-only fixes."
trigger_phrases:
  - "028 memory schema concurrency tasks"
  - "derived-id consolidation retention tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation/002-memory-schema-and-concurrency"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING memory-schema-and-concurrency tasks"
    next_safe_action: "Confirm the cited facts"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-tasks-006-002-memory-schema-and-concurrency"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Memory Schema and Concurrency Remediation

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `rule_version` hashing at `content-id.ts:67` and live default at `causal-edges.ts:125`.
- [ ] T002 Confirm the `BEGIN IMMEDIATE` boundary and embedding call at `consolidation.ts:684,701`.
- [ ] T003 Confirm the pre-tx snapshot and in-tx apply at `memory-retention-sweep.ts:539-542,612`.
- [ ] T004 Capture the test baseline for the affected suites.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Align the v40 backfill rule_version with the live default and reconcile skew (P1-2). **ABSORBED → 016/008-causal-graph-hygiene-and-entity-linker-noise (verify-first-then-close, closed 2026-07-04): the derived_id identity fix was already present (code hashes the correct rule version); phase 008 shipped + ran the `backfill-derived-causal-edge-ids` migration as a verified no-op (live dry-run = 0 candidates, i.e. already backfilled). No re-fix — verification confirmed correct code.**
- [x] T006 [P] Move the semantic-edge embedding pass out of `BEGIN IMMEDIATE` with a refreshed maintenance handle (P1-4). **ABSORBED → 016/008 (verify-first-then-close, closed 2026-07-04): phase 008 verified the semantic-edge embedding already runs outside the consolidation `BEGIN IMMEDIATE` lock and added a lock/guard test. No restructure — the code was already correct.**
- [x] T007 [P] Re-validate the spare axes inside the retention transaction before delete (P1-5). **ABSORBED → 016/009-learning-feedback-loop-repair (verify-first-then-close, closed 2026-07-04): phase 009 verified the fresh in-transaction row is already revalidated before DELETE (`memory-retention-sweep.ts` revalidateSpareOnlyRetention) and added the concurrent-protection interleaving test. No logic change — verification only.**
- [x] T008 Keep all three features default-off with no default-on path change. **Confirmed by the absorbing phases: no default-on path change introduced.**
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add an identity-parity test across migration and live `derived_id`. **ABSORBED → 016/008 (twin-identity test landed there).**
- [x] T010 Add a lock-behavior test for the consolidation embedding pass. **ABSORBED → 016/008 (lock/concurrency guard test landed there).**
- [x] T011 Add a forced-interleaving test for the retention spare-only delete. **ABSORBED → 016/009 (interleaving test landed there).**
- [x] T012 Run strict validation for this child folder. **Superseded by the 016 program's recursive `validate.sh --strict` closeout (phase 013 REQ-006).**
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Migration-safety and concurrency test evidence is recorded.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Source review**: See `../../archive/review-report.md`
<!-- /ANCHOR:cross-refs -->
