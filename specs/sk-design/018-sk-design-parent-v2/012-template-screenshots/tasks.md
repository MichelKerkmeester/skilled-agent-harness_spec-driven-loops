---
title: "Tasks: every form can be judged without opening a browser"
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
# Tasks: every form can be judged without opening a browser

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

- [x] **T001** Confirm a headless browser is available and already a corpus-checker dependency
- [x] **T002** Probe one render and read the frame rather than trusting the byte count
- [x] **T003** Try to force a deterministic colour scheme across three flag combinations and the new headless mode
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T004** Write the renderer: mirror the source layout, settle budget, per-file timeout
- [x] **T005** Add a `--check` mode answering whether every source is covered
- [x] **T006** Render `sk-design-chart`: 36 sources
- [x] **T007** Render `sk-design-diagram`: 39 sources, 1 transient failure
- [x] **T008** Diagnose the failure as a spawn race, not a broken document, by rendering it alone
- [x] **T009** Add a bounded retry matching the corpus checker's own guard
- [x] **T010** Move the output out of `assets/` after the leaf manifest grew from 181 to 256
- [x] **T011** Document regeneration and the host-theme property in both mode READMEs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T012** `--check` both modes: 0 missing
- [x] **T013** Confirm the leaf manifest hash returned to its pre-change value
- [x] **T014** Read a rendered chart and a rendered diagram directly
- [x] **T015** Corpus checker, fleet metadata, leaf and derived freshness, playbook gates, compiled-routing guard
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 36 chart and 39 diagram screenshots, mirroring the source layout
- [x] `--check` reports 0 missing for both modes
- [x] Leaf manifest hash unchanged: screenshots are not routable resources
- [x] A read frame confirms the settle budget works
- [x] Both READMEs carry the regeneration command and the theme caveat
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
Every gate below was required to print its own result line, and a byte count is not evidence that a screenshot is correct. A mid-animation capture has a plausible
size and shows a broken-looking chart, so a frame from each mode was opened and read.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] A browser confirmed present, and one render read before writing the script
- [x] The colour-scheme question settled by testing four approaches, not assumed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] No template modified; the renderer only opens what is already shipped
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] `--check` sk-design-chart: sources 36, missing 0
- [x] `--check` sk-design-diagram: sources 39, missing 0
- [x] Leaf manifest hash: `ec5c48a2ca9a...`, identical before and after
- [x] A chart frame read: bars at full height, labels placed, data table rendered
- [x] A diagram frame read: full org chart with legend and gap callout
- [x] `check-corpus.cjs --render`: `RESULT: PASSED`
- [x] Fleet metadata 13/13, leaf manifests 13 fresh, derived 13 fresh, graph 0 errors
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] Both modes rendered, not only the one that was asked about first
- [x] The one failure diagnosed rather than skipped; it was a spawn race and the retry now covers it
- [x] The leaf-surface mistake caught by a gate and corrected by moving the directory, with the hash
      verified back to its original value
- [x] The colour-scheme limitation established by testing four approaches before documenting it
- [x] A coverage check shipped alongside the images, because coverage is the property that rots
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

- [x] Both mode READMEs carry the regeneration command and why the theme follows the host
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Screenshots sit beside `assets/`, deliberately outside the routable leaf surface
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Result |
|------|--------|
| `--check` sk-design-chart | 36 sources, 0 missing |
| `--check` sk-design-diagram | 39 sources, 0 missing |
| Leaf manifest hash | Unchanged by the addition |
| `check-corpus.cjs --render` | `RESULT: PASSED` |
| Fleet metadata / leaf / derived | 13/13, 13 fresh, 13 fresh |
| Compiled-routing guard | All hubs fresh |

75 pictures, one command to regenerate, and a check that says when one is missing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] Screenshots are outside the leaf surface, so a picture never becomes a resource a mode loads
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
- [x] A frame from each mode read directly before the set was accepted
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
