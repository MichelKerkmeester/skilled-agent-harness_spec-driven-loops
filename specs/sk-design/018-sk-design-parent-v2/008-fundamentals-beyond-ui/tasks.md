---
title: "Tasks: fundamentals covers every surface, not only UI"
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
# Tasks: fundamentals covers every surface, not only UI

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

- [x] **T001** Capture a baseline for twelve phrases: three dead surfaces, two weak ones, and seven controls
- [x] **T002** Measure how UI-bound the contract is: 46 UI mentions against 1 non-UI
- [x] **T003** Read the systems and references to decide what is genuinely screen-only
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T004** Rename the H1 and rewrite the frontmatter description to name the surfaces
- [x] **T005** Add the opening paragraph that says most of this is not about screens
- [x] **T006** Add the surfaces table: five surfaces, what applies, what changes, what does not
- [x] **T007** Name the two screen-only references explicitly
- [x] **T008** Reframe the hierarchy section from "everything on screen" to "everything on the surface"
- [x] **T009** Extend the keyword block with surface vocabulary
- [x] **T010** Add 17 entries to the hub's `intent_signals`, which is the only file the advisor reads
- [x] **T011** Extend the router's VALUES and REVIEW keyword lists to match
- [x] **T012** Regenerate the derived block and the leaf manifest
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T013** Rebuild the advisor; observe generation 665 to 666
- [x] **T014** Replay the twelve surface phrases and diff against the baseline
- [x] **T015** Replay the sixteen packet phrases and confirm no owner changed
- [x] **T016** Probe the one phrase that still loses its ordering, across four rephrasings
- [x] **T017** Fleet metadata, leaf manifests, derived freshness, graph validator, router contract, playbook gate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Three previously-dead surface phrases route above the bar
- [x] Two weak phrases improved
- [x] Every control unchanged, including both canvas modes
- [x] No owner changed anywhere in the sixteen-phrase set
- [ ] `design review of this slide deck` reaches the hub at 0.9107 but `sk-code` still wins at 0.9379
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
Every gate below was required to print its own result line, and the controls were replayed in the same run as the new phrases, not afterwards, because the real risk
of widening a sibling's vocabulary is stealing a phrase that already routed correctly.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] A baseline captured before any edit; vocabulary changes cannot be undone for measurement purposes
- [x] The screen-only references identified by reading them, not by assuming from their names
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] No code changed; this phase edits a contract and two vocabulary surfaces
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] `how should this slide be laid out`: nothing to `sk-design=0.9059`
- [x] `margins for a print layout`: nothing to `sk-design=0.8962`
- [x] `document layout hierarchy`: nothing to `sk-design=0.9112`
- [x] `type scale for a printed report`: 0.858 to 0.95
- [x] `presentation deck spacing`: 0.82 to 0.9059
- [x] Controls: padding 0.82, contrast 0.95, chart 0.8461, diagram 0.82, flowchart 0.82, extract 0.9067, all unchanged
- [x] Sixteen-phrase set: three cells moved, no owner changed, nothing below baseline
- [x] Fleet 13/13, leaf manifests 13 fresh, derived 13 fresh, graph 0 errors, router contract 0 issues
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] Vocabulary added to `intent_signals`, not `description.json`, which moves no score
- [x] The router's own keyword lists extended in the same change, so the two do not drift
- [x] The hierarchy section reframed, not only the title; it was the most surface-agnostic technique
      in the file and the one most tied to screen language
- [x] Both canvas modes replayed as controls, which is where a widened sibling vocabulary would do
      its damage
- [x] The one phrase that still loses its ordering probed across four rephrasings and recorded with
      its cause, rather than fixed by inflating this hub's weights
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

- [x] `spec.md` records which references are screen-only and why the mode was broadened rather than forked
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Three files changed; no new mode, no new reference, no new directory
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Measure | Baseline | After |
|---------|----------|-------|
| Surface phrases reaching nobody | 3 | 0 |
| `type scale for a printed report` | 0.858 | 0.95 |
| `presentation deck spacing` | 0.82 | 0.9059 |
| Controls changed | — | 0 |
| Sixteen-phrase owners changed | — | 0 |

One phrase remains behind another hub in its ordering while still clearing the bar, recorded with its
cause rather than resolved by changing a hub this phase does not own.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] One mode carries the shared judgment; the per-surface table is what keeps it specific
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
- [x] Replay taken at generation 666 after an explicit rebuild, with controls in the same run
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
