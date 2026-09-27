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

- [x] T003 Launch the two-lineage fan-out through `/deep:review:auto` (`review/deep-review-config.json`). Evidence: `fanout-run.cjs` exit 0, summary `total 2, succeeded 2, failed 0`.
- [x] T004 [P] Run the `mimo` lineage for three iterations (`review/lineages/mimo/`). Evidence: three iteration records, `synthesis_complete` with `stopReason: maxIterationsReached`, lineage verdict CONDITIONAL (1 P1, 6 P2).
- [x] T005 [P] Run the `deepseek` lineage for three iterations (`review/lineages/deepseek/`). Evidence: three iteration records on attempt 2 (attempt 1 had already written them; no duplicates), `synthesis_complete`, lineage verdict PASS (5 P2).
- [x] T006 Merge both lineages and write the report (`review/review-report.md`). Evidence: `fanout-merge.cjs` exit 0, 2 lineages, 12 findings; report carries the ten sections and the Planning Packet.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Count iteration records per lineage and read each terminal stop reason. Evidence: mimo 3 and deepseek 3 `"type":"iteration"` records, both `maxIterationsReached`.
- [x] T008 Open every cited line behind each P0 and P1 finding and mark it confirmed, refuted or unverified. Evidence: no P0. The one P1 (R1-P1-001) was confirmed in code at `.pi/extensions/pi-cache-optimizer/index.ts:8201-8213` and downgraded to P2, because the schema (`:7985-7986`) and README line 130 publish interior hashes as opt-in; the code predates this packet. F002, R2-P2-002, F003, R2-P2-001 and R1-P2-003 were also opened and confirmed.
- [x] T009 Confirm the close recorded `synthesis_complete` and the run wrote only under `review/`. Evidence: root `deep-review-state.jsonl` holds `synthesis_complete`, verdict PASS, without a root dashboard. Containment flagged 54 out-of-scope dirty paths on the mimo lineage, preserved and not reverted; they are another session's in-flight files plus this session's parent `spec.md` edit, inferred from the file set.
- [x] T010 Run `validate.sh --strict --recursive` on the packet and require `RESULT: PASSED`. Evidence: exit 0, all eight folders `RESULT: PASSED` with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
