---
title: "Tasks: Phase 004 — Salvage sweep + coverage-graph per-sessionId"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "salvage coverage graph tasks"
  - "fanout salvage coverage isolation tasks"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Phase 004 — Salvage sweep + coverage-graph per-sessionId

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
## Phase 1: Salvage sweep

- [ ] T001 Sweep each lineage sub-loop with `post-dispatch-validate.ts#validateIterationOutputs` (`fanout-pool.cjs`)
- [ ] T002 On `iteration_file_missing/empty`, parse `{sub-packet}/logs/iter-NNN.out` (opencode `--format json` text parts, else raw) and write the missing `iterations/iteration-NNN.md`
- [ ] T003 Append the `salvaged_from_stdout` event, re-validate, and record a failed marker when the file is still missing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Coverage isolation

- [ ] T004 Confirm each lineage's own `session_id` scopes `convergence.cjs` and coverage writes (PK/UNIQUE already include session_id); no schema change, WAL and the existing writer lock
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Unit: missing md plus stdout yields a salvaged artifact; still-missing records the failed marker
- [ ] T006 Integration: two lineages with distinct sessionIds over a shared `deep-loop-graph.sqlite`, with an explicit no-collision assertion
- [ ] T007 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

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
