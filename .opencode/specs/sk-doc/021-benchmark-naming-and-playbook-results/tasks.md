---
title: "Tasks: One dated benchmark convention and a home for playbook results"
description: "Task breakdown and status for declaring the grammar, building the writer, renaming 78 folders and backfilling their reports."
trigger_phrases:
  - "benchmark naming tasks"
  - "playbook results tasks"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/021-benchmark-naming-and-playbook-results"
    last_updated_at: "2026-07-27T11:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Renamed 78 run folders, backfilled their reports, wrote the packet docs"
    next_safe_action: "Decide the two deferred questions: plural roots and the uppercase source map"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: One Dated Benchmark Convention And A Home For Playbook Results

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` outstanding, `[~]` deliberately deferred.
- Each task names the evidence that settles it, not an intention to check later.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Establish the grammar and its single carve-out.
- [x] T-002 Capture the link-checker baseline before anything moves. Result: `85 broken` across 7202 files.
- [x] T-003 Enumerate every run folder in scope. Result: 78 across 16 benchmark roots.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Declare the grammar in `create-benchmark/SKILL.md` sections 6 and 10.
- [x] T-005 Replace the run-label table in the skill-benchmark storage guide.
- [x] T-006 Relax `RUN_LABEL_RE` to accept the field separator, keeping the frozen-anchor refusal.
- [x] T-007 Derive paths in `render-serving-snapshot.cjs` instead of hardcoding labels.
- [x] T-008 Add the results-storage contract to `create-manual-testing-playbook/SKILL.md`.
- [x] T-009 Emit `results.csv`, `failed-runs.md`, `findings-and-recommendations.md`, `README.md` and `source.md` from `build-report.cjs`.
- [x] T-010 Derive the outputs directory when no `--outputs-dir` is given.
- [x] T-011 Scaffold `benchmark/reports/` with an index in `init_skill.py`, for hub and standalone skills alike.
- [x] T-012 Append the index row from the same path that writes the report.
- [x] T-013 Freeze the old-to-new mapping as a generated artifact.
- [x] T-014 Rename all 78 folders and repair path-shaped references repo-wide, spec packets included.
- [x] T-015 Backfill the companions each folder's record supports.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-016 Link checker returns to the captured baseline. Result: `85 broken`, identical set.
- [x] T-017 Lane C suite shows no new failures. Result: 259 passed, the same 11 pre-existing failures.
- [x] T-018 Label validator accepts the grammar and still refuses dots, underscores, uppercase and `baseline`.
- [x] T-019 A run with no `--outputs-dir` lands in the dated reports path with six files and an index row.
- [x] T-020 No live reference to an old folder name survives. Result: 0 live, 1093 in historical records by design.
- [x] T-021 Packet passes `validate.sh --strict`. Result: `Errors: 0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Every run folder matches the grammar or is the documented carve-out; a playbook run produces a durable
folder without the operator choosing a path; no backfilled file asserts a finding its record does not
contain; and the link checker is no worse than where it started.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- [`spec.md`](./spec.md) for requirements and scope.
- [`plan.md`](./plan.md) for the phase order and why it is that order.
- [`checklist.md`](./checklist.md) for verification evidence.
- [`assets/rename-map.json`](./assets/rename-map.json) for the frozen mapping.
<!-- /ANCHOR:cross-refs -->
