---
title: "Tasks: Phase 005 — Consumer-specific merges + synthesis hooks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "consumer merges synthesis tasks"
  - "fanout merge research review tasks"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Phase 005 — Consumer-specific merges + synthesis hooks

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
## Phase 1: Merge script

- [ ] T001 Author `fanout-merge.cjs` (`--loop-type research|review`) reading every `{artifact_dir}/lineages/{label}/` registry, iterations and state log
- [ ] T002 Research merge: content-hash dedup plus cross-model attribution into the consolidated `deep-research-findings-registry.json` consumed by `step_compile_research`
- [ ] T003 Review merge: severity rollup with strongest-restriction (any-lineage active P0 forces merged FAIL) into the consolidated `deep-review-findings-registry.json`
- [ ] T004 Write `{artifact_dir}/fanout-attribution.md` with per-lineage convergence, iterations, salvage events and model attribution
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Synthesis hooks

- [ ] T005 Add `step_fanout_merge` at the top of each `phase_synthesis`, gated on `config.fanout`, across the 4 deep-loop YAMLs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Unit: research dedup/attribution and review rollup plus strongest-restriction (A clean, B P0 yields merged FAIL)
- [ ] T007 Integration: 2-lineage fixture to merged registry to existing synthesis with the canonical report unchanged in shape
- [ ] T008 Run `validate.sh` for this folder
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
