---
title: "Tasks: Phase 003 — Per-lineage spawn + sub-packet isolation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "per-lineage spawn isolation tasks"
  - "fanout spawn subpacket tasks"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Phase 003 — Per-lineage spawn + sub-packet isolation

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
## Phase 1: Spawn path

- [ ] T001 Spawn the existing deep-loop command per lineage with a single synthesized `config.executor` (`fanout-pool.cjs`)
- [ ] T002 Pass `--max-iterations {lineage.iterations ?? default}` and `SPECKIT_FANOUT_LINEAGE_ID={label}` to each lineage command
- [ ] T003 Capture each lineage's stdout to `{sub-packet}/logs/iter-NNN.out`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Artifact isolation

- [ ] T004 Add the `--artifact-dir-override` branch to `step_resolve_artifact_root` in the two research-loop YAMLs (`deep_start-research-loop_{auto,confirm}.yaml`)
- [ ] T005 Add the same override branch to the two review-loop YAMLs (`deep_start-review-loop_{auto,confirm}.yaml`)
- [ ] T006 Verify the recursion guard: distinct kinds safe, same-kind replicas scoped via `SPECKIT_<KIND>_STATE_DIR`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Integration test: the pool spawns a stub command twice into two `lineages/{label}/` trees
- [ ] T008 Assert distinct trees and distinct sessionIds with no lock contention
- [ ] T009 Run `validate.sh` for this folder
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
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
