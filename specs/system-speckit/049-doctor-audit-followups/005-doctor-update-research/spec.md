---
title: "Feature Specification: Phase 5: doctor-update research"
description: "Six iterations of deep research into whether /doctor:update, its three workflows and the release-update engine are complete, correct and safe, ending in a ranked list of the fixes that remain."
trigger_phrases:
  - "doctor update research"
  - "doctor update perfection"
  - "release-update engine research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: doctor-update research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-doctor-scripts-conformance |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` exists with a ranked remediation list, and this folder validates strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the doctor audit follow-ups. Phases 002 and 004 changed the release-update engine and the update workflows. This phase checks the result with fresh eyes before anyone builds on it.

**Scope Boundary**: Research only. The run writes under `research/` and these packet docs, and changes no command, workflow or script.

**Dependencies**:
- Phase 004 committed, so the engine and workflows under study are the current ones.

**Deliverables**:
- `research/research.md`, the synthesis with a ranked remediation list.
- `research/iterations/iteration-001.md` through `iteration-006.md` and their state records.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:update` updates an operator's framework copy to a newer release while keeping their customizations. It spans a thin router, three workflow YAML files, a presentation contract and a 2,000-line engine. Phases 002 and 004 fixed many defects in it, but nobody has yet checked the whole surface end to end against its own contract and against real operator scenarios.

### Purpose
A ranked, evidence-backed list of every remaining defect, gap and drift in `/doctor:update`, precise enough to plan the fixes from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.skilled/commands/doctor/update.md`, the router.
- `.skilled/commands/doctor/assets/doctor-update-check.yaml`, `doctor-update-align.yaml`, `doctor-update-apply.yaml` and `doctor-update-presentation.txt`.
- `.skilled/commands/doctor/scripts/release-update.cjs` and `tests/release-update.test.cjs`.
- The contracts these must meet: `sk-doc/sk-create-command`, and the engine behaviour the workflows promise.

### Out of Scope
- Fixing anything found. The fixes are planned from `research.md` in a later phase.
- The other doctor commands. Phase 004 covered their scripts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Research state, iterations and synthesis |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | Packet docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Six research iterations run: five by cli-codex `gpt-6-luna` at max reasoning on the fast tier, the sixth by a fresh Claude Opus 5.5 at xhigh | `research/iterations/` holds six iteration files, and each state record names its executor |
| REQ-002 | A fresh agent writes the synthesis | `research/research.md` exists, written by an agent that ran none of the iterations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every finding cites the file and line it rests on | Spot checks of the top findings resolve against the tree |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research.md` ranks each remaining defect by severity, with evidence and a proposed fix.
- **SC-002**: The packet validates strict with `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex CLI signed in with access to `gpt-6-luna` | No Luna iterations | The dispatch fails closed, and the run stops and reports it |
| Risk | An iteration writes outside `research/` | Low | The dispatch's write-containment check reports any out-of-scope path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at start. The research run records its own open questions in `research/deep-research-strategy.md`.
- Deep-research topic: is /doctor:update perfected? audit the whole /doctor:update surface end to end: the router .skilled/commands/doctor/update.md, the workflows doctor-update-check.yaml, doctor-update-align.yaml and doctor-update-apply.yaml, doctor-update-presentation.txt, the engine .skilled/commands/doctor/scripts/release-update.cjs and its tests. find every remaining defect, gap, unsafe path and drift: workflow promises the engine does not keep, engine behaviour the workflows do not describe, real operator scenarios that break (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback, customized skills), sk-create-command contract violations, missing tests. rank the fixes that would make it perfect. ground every claim in file and line evidence from this repository.

Research context: deep-research is active for this topic. `research/research.md` remains canonical.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
<!-- checksum: sha256:7113ce3c0f1e96ce468878008f39ffaee6ccdfedcec179813e60ec6b132cc2ed -->
Deep-research findings (abridged. `research/research.md` is canonical):

- Not perfected: 26 findings, 0 P0, 5 P1, 21 P2. The engine's core invariants hold and its suite passes 56 of 56.
- DU-01 (P1): a partial decision set drops the release change of every undecided file and records the release as the unit's base.
- DU-02 (P1): an interrupted apply strands `.skilled/release/.apply.lock`, which then blocks rollback, re-apply and dry-run.
- DU-03 (P1): a copied or vendored tree cannot name the upstream, because no routed action passes `--remote`.
- DU-04 (P1): `record-base` accepts any named release, so a tree a release behind can report current.
- DU-05 (P1): the startup approval is not bound to the plan apply runs, so a newer tag can be applied unseen.
- Fix order: DU-01 and DU-02, then the copied-tree cluster (DU-03, DU-07, DU-08, DU-04), then DU-05, then the P2 list.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


