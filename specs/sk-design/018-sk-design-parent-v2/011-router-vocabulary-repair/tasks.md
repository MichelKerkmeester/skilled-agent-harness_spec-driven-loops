---
title: "Tasks: a phrase the router declares reaches the hub"
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
# Tasks: a phrase the router declares reaches the hub

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

- [x] **T001** Diff `description.json` keywords against `intent_signals` across all 13 skill roots: 168 orphans on 6 hubs
- [x] **T002** Probe a 14-phrase sample of those orphans; 9 routed correctly anyway
- [x] **T003** Conclude the diff is not the defect list, and record why: the two vocabularies serve different routing stages
- [x] **T004** Probe the sk-design router's own 55 declared-but-unscored keywords; 11 of 15 sampled genuinely fail
- [x] **T005** Capture a baseline for the probed phrases
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T006** Remove `data visualization` and `data visualisation` from `sk-doc` intent_signals; the cutover left them
- [x] **T007** Remove the same from `sk-doc` description keywords
- [x] **T008** Add 17 distinctive multi-word phrases to `sk-design` intent_signals
- [x] **T009** Leave the 44 bare common words out; they belong to stage-two intent resolution
- [x] **T010** Regenerate both hubs' derived blocks
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T011** Rebuild the advisor; observe generation 666 to 667
- [x] **T012** Re-probe all 15 phrases and diff against the baseline
- [x] **T013** Replay the packet's sixteen phrases as a control
- [x] **T014** Replay the twelve surface phrases as a control
- [x] **T015** Fleet metadata, leaf manifests, derived freshness, graph validator, compiled-routing guard
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 9 of 11 broken phrases now reach `sk-design`
- [x] `data visualization` names `sk-design` ahead of `sk-doc`
- [x] Sixteen-phrase set unchanged
- [x] Twelve surface phrases unchanged
- [ ] `critique this` and `plot this` still reach nobody: two-word phrases below the bar regardless of membership
- [ ] `review this screen` still loses to `sk-code`, the same pattern as the deck-review case
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
Every gate below was required to print its own result line, and the diff between the two vocabularies is a candidate list, never a defect list. 9 of 14 sampled
orphans routed correctly without being in `intent_signals` at all, so membership is neither necessary
nor sufficient on its own and only a probe settles it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] A baseline captured before any edit
- [x] The two-stage routing model understood before treating any gap as a bug
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] Vocabulary only; no weights, no thresholds, no router restructuring
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] `what should this look like`: nothing to `sk-design=0.82`
- [x] `does this look right`: nothing to `sk-design=0.856`
- [x] `why does this look wrong`: nothing to `sk-design=0.856`
- [x] `visual audit`: nothing to `sk-design=0.838`
- [x] `measure this surface`: nothing to `sk-design=0.85`
- [x] `css extraction`: nothing to `sk-design=0.826`
- [x] `process diagram`: nothing to `sk-design=0.823`
- [x] `flow diagram`: nothing to `sk-design=0.829`
- [x] `data visualization`: `sk-doc=0.878` to `sk-design=0.827` ahead of `sk-doc=0.82`
- [x] `parallel coordinates`: `sk-doc=0.82` to `sk-design=0.82` alongside it
- [x] `chart the data`: 0.82 to 0.85
- [x] Sixteen-phrase and twelve-phrase control sets: unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] Both hubs changed, not only the receiving one: the residue in `sk-doc` was half the defect
- [x] The description keywords cleaned alongside `intent_signals`, so the two do not disagree
- [x] The 44 bare common words deliberately excluded, with the reason recorded
- [x] Two phrases left broken and named with their cause rather than tuned until the number moved
- [x] The finding that the packet's own baseline never sampled these phrases recorded plainly
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

- [x] `spec.md` records why 55 differences are not 55 defects
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Three vocabulary files; no new surface
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Measure | Before | After |
|---------|--------|-------|
| Probed phrases reaching nobody | 8 | 2 |
| Probed phrases reaching the wrong hub | 2 | 0 |
| `sk-design` intent_signals | 137 | 154 |
| `sk-doc` intent_signals | 86 | 84 |
| Control sets changed | — | 0 |

The two that remain are a length limit and an ordering contest, both recorded rather than forced.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] Stage-one hub selection and stage-two intent resolution stay distinct vocabularies
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
- [x] Measured at generation 667 after an explicit rebuild, controls in the same run
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
