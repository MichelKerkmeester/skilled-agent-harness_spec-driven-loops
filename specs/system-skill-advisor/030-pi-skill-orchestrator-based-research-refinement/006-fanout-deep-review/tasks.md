---
title: "Tasks: Two-Model Deep Review of the Advisor Refinements"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fan-out deep review tasks"
importance_tier: "normal"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Two-Model Deep Review of the Advisor Refinements

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Write the review manifest from the phase 2 to 5 commits (`goal-file-manifest.txt`). Evidence: 38 repo-relative paths from commits `bc111f2af5`, `3a33a5ea47`, `e18d6073b8`, `ed22403e09`, `852e7cb6c2`, `a8e92f05ca` and `e1e4b1227a`, minus generated files; every entry is a real file, none duplicated, and the plugin is listed at its tracked `.opencode/plugins/` path because `.skilled/plugins` is a symlink.
- [x] T002 Ping both models through the route the fan-out builds: `llmgateway/mimo-v2.6-pro` at `high` and `llmgateway/deepseek-v4.1-flash` at `max`. Evidence: `pi -p --offline --no-tools` replied `OK` from each, in 3 and 5 seconds, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Launch the two-lineage fan-out through `/deep:review:auto` (`review/deep-review-config.json`).
- [ ] T004 [P] Run the `mimo` lineage for three iterations (`review/lineages/mimo/`).
- [ ] T005 [P] Run the `deepseek` lineage for three iterations (`review/lineages/deepseek/`).
- [ ] T006 Merge both lineages and write the report (`review/review-report.md`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Count iteration records per lineage and read each terminal stop reason.
- [ ] T008 Open every cited line behind each P0 and P1 finding and mark it confirmed, refuted or unverified.
- [ ] T009 Confirm the close recorded `synthesis_complete` and the run wrote only under `review/`.
- [ ] T010 Run `validate.sh --strict --recursive` on the packet and require `RESULT: PASSED`.
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
