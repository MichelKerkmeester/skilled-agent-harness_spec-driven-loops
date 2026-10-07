---
title: "Tasks: 054 Program Close-out — Parent Rollup + CI Gate + Memory Reindex"
description: "Task breakdown for the program close-out phase, reconstructed from spec.md. The original tasks.md was never written."
trigger_phrases:
  - "054 program closeout tasks"
  - "smart-routing benchmark CI gate tasks"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: 054 Program Close-out — Parent Rollup + CI Gate + Memory Reindex

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

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

- [ ] T001 Capture the parent `graph-metadata.json` state: children 001-005 only, stale child statuses, `derived.status` `in_progress`, `last_active_child_id` null
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Rollup

- [ ] T002 Reconcile each child's `status:` frontmatter (001-004 say `in_progress` but shipped)
- [ ] T003 Run `backfill-graph-metadata.js` so `children_ids` auto-derives 006 onward from disk
- [ ] T004 Set `last_active_child_id` explicitly
- [ ] T005 Flip the parent `status` complete LAST, keeping the full Level-3 doc set while `SPECKIT_LEVEL: 3` is pinned
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: CI gate

- [ ] T006 Add `.github/workflows/smart-routing-benchmark.yml` modeled on `routing-registry-drift.yml`
- [ ] T007 Add Job 1 — `npx vitest run` globbing all drift guards
- [ ] T008 Add Job 2 — loop the 10 Mode-A targets asserting `verdict === "PASS"` (the sk-code hub asserts its baseline `aggregateScore`, not PASS); Mode-B excluded
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Memory reindex (strictly last)

- [ ] T009 Probe daemon health (`memory_health --warm-only`; exit 75 means retry; single-writer guard)
- [ ] T010 Backfill `--all --active-only`
- [ ] T011 Run `memory_index_scan --force` and poll to completion (`failed=0`)
- [ ] T012 Only after the migration lands on the canonical branch
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

- [ ] T013 `validate.sh --strict` on the parent PASSES; `children_ids` equals the on-disk count; `last_active_child_id` non-null
- [ ] T014 CI job green on a clean tree; a perturbed child router turns the drift guard and that target's Mode-A red
- [ ] T015 Reindex `STATUS=OK` with `failed=0`; the 054 trigger phrase resolves to the renamed tree
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
