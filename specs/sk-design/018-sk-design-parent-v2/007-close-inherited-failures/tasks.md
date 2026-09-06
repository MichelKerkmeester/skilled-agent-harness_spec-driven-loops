---
title: "Tasks: close every gate this packet left red"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: close every gate this packet left red

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T###` is a stable task id. `[P]` marks a task that may run in parallel with its neighbours; tasks
without it are ordered. A task is `[x]` only when its stated evidence was observed, never because it
looked done.

All tasks below are complete. Evidence is named per task rather than summarised at the end.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Confirm the rename landed, so the fixtures move once onto final mode names
- [x] **T002** Re-run every red gate and read its output, to confirm the diagnosis still holds
- [x] **T003** Check which benchmark reports reference the fixture ids being moved
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T004** Create the design hub playbook tree with its three categories
- [x] **T005** Move all four fixtures as renames, ids preserved
- [x] **T006** Repoint `SD-007` from a cross-hub pair to chart-versus-diagram
- [x] **T007** Rewrite `SD-007`'s narrative so its objective, signals and delta text match the new pair
- [x] **T008** Repair the gate invocation path in all four moved fixtures; it was relative to the old hub
- [x] **T009** Write the design hub playbook index, naming the strict invocation
- [x] **T010** Correct `sk-doc`'s index: scenario ranges, per-scenario rows and the holdout summary
- [x] **T011** Rename the `Pass / Fail` heading in `SD-CR-001` to the form the parser matches
- [x] **T012** Fill the empty `trigger_phrases` in the learning-overlay summary
- [x] **T013** Open the `decisions` anchor that was closed but never opened
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T014** `validate-playbook-topology --strict` on both hubs
- [x] **T015** `validate-compiled-routing-scenarios --strict`
- [x] **T016** `validate.sh --strict` across the router-unification packet
- [x] **T017** Fleet metadata, leaf-manifest and derived freshness, `skill_graph_validate`
- [x] **T018** Compiled-routing guard and the chart corpus checker
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] `sk-doc` typed-gold gate: 28 valid, 0 blocked, from 28 valid and 4 blocked
- [x] `sk-design` typed-gold gate: 4 valid, 0 blocked, on a corpus that did not exist
- [x] Compiled-routing scenario validator: 1 pass, 0 fail
- [x] Router-unification packet: 25 of 25, from 23
- [x] Four fixtures moved as renames with their ids intact
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`: the frozen scope and the REQ ids these tasks satisfy
- `plan.md`: the architecture, the rollback, and the decision records
- `acceptance-criteria.md`: the rows that decide whether this packet may close
- `implementation-summary.md`: what actually shipped, with the commit
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

A command counts as evidence only after its output and exit status were read. A green run lies in
several ways: a stale build, a wrong path, a silent no-op and an assertion-free check all exit 0.
Every gate below was required to print its own result line, and `--strict` was used on every gate that offers it. Without it the typed-gold gate prints
`verdict=FAIL` and exits 0, which is how four blocked fixtures read as a pass for the whole packet
before the closing phase.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] The rename landed first, so no fixture was touched twice
- [x] The ids were checked against the 2026-07-21 benchmark reports before any file moved
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] No routing metadata changed; the fixtures moved to the hub whose manifest already listed their mode
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] `validate-playbook-topology --strict` sk-doc: `verdict=PASS valid=28 blocked=0`
- [x] `validate-playbook-topology --strict` sk-design: `verdict=PASS valid=4 blocked=0`
- [x] `validate-compiled-routing-scenarios --strict`: `pass=1 fail=0`
- [x] `validate.sh --strict` on 019/015: 25 of 25
- [x] Fleet metadata 13/13, leaf manifests 13 fresh, derived 13 fresh 0 stale
- [x] `skill_graph_validate`: 0 errors
- [x] `check-corpus.cjs --render`: `RESULT: PASSED`
- [x] Compiled-routing guard: all hubs fresh
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] All four fixtures moved, not only the three that moved cleanly
- [x] The gate invocation path inside each moved fixture repaired; it pointed at a sibling the new hub
      does not have, which no gate would have caught
- [x] Both indexes corrected, not only the receiving one: `sk-doc`'s ranges and holdout summary named
      scenarios it no longer holds
- [x] `SD-007`'s prose rewritten alongside its frontmatter; a repointed contract with the old narrative
      would have read as a contradiction
- [x] The changed meaning stated in the fixture and in the design hub's index, so a reader of the
      2026-07-21 reports is not misled
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] No credential, token or key added, moved or logged
- [x] No new network call, and no dependency installed
- [x] File moves stay inside the repository; nothing is written outside it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] `spec.md` records why a cross-hub fixture validates under neither hub
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Four fixtures live under the hub whose manifest lists their mode
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Before | After |
|------|--------|-------|
| `validate-playbook-topology --strict` sk-doc | `valid=28 blocked=4`, exit 1 | `valid=28 blocked=0`, exit 0 |
| `validate-playbook-topology --strict` sk-design | no corpus | `valid=4 blocked=0`, exit 0 |
| `validate-compiled-routing-scenarios --strict` | `pass=0 fail=1`, exit 1 | `pass=1 fail=0`, exit 0 |
| `validate.sh --strict` on 019/015 | 23 of 25 | 25 of 25 |

Every gate this packet left red is closed. Nothing was deleted to get there.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] Each fixture now sits under a hub whose leaf manifest lists the mode it declares
- [x] The class contract holds: every required file present, every forbidden file absent
- [x] Router paths resolve to leaves that exist on disk
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable in the runtime sense: this phase moves files and metadata and adds no code path on a
hot loop. The one measured quantity is advisor score, recorded per phrase in
`acceptance-criteria.md` rather than as a performance number.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] One commit, so the shared branch has no broken intermediate state
- [x] Both playbook gates run per hub, and the design hub's index names the strict invocation
- [x] Rollback named in `plan.md` and reachable by a single revert
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] Moves recorded as renames, so authorship and history survive
- [x] Historical records left as written; only live references rewritten
- [x] No document claims a result that was not observed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder, taking the first `RESULT:` line
- [x] Generated metadata regenerated after the last document edit
- [x] No spec document still carries template prose
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | [x] Approved | 2026-09-06 |
| Claude Code | Implementer | [x] Approved | 2026-09-06 |
| `validate.sh --strict` | Automated gate | [x] Approved | 2026-09-06 |
<!-- /ANCHOR:sign-off -->
