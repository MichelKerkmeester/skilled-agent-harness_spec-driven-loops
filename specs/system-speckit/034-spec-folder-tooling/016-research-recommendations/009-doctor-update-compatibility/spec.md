---
title: "Feature Specification: External-user compatibility path for /doctor:update"
description: "External users cannot detect or repair pre-v4 spec folders because `/doctor:update` covers only `.skilled/` units and no workflow calls `upgrade-legacy`. A separate approved action and a read-only compatibility check wire the path that users need."
trigger_phrases:
  - "doctor update compatibility"
  - "phase 9 doctor update compatibility"
  - "external repo upgrade path"
  - "pre-v4 repo upgrade"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: External-user compatibility path for /doctor:update

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 16 |
| **Predecessor** | 008-legacy-era-report |
| **Successor** | 010-upgrade-reversibility |
| **Handoff Criteria** | A user can run `/doctor:update check` to see spec folder era and compatibility, then run a separate action to move old layouts and apply upgrades without involving the release transaction |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Research recommendations specification. Phase 8 builds the era report. This phase uses it to show external users what upgrade path their repo needs, and provides the gated actions to run it safely outside the release transaction.

**Scope Boundary**: `/doctor:update check` gains a read-only compatibility section. A new action YAML file provides the separate approval and execution for layout move and `upgrade-legacy --apply`.

**Dependencies**:
- Phase 8's era report module (`repo-era.mjs`).
- Phase 5's fixed healer (so doctor never ships a healer writing rejected phrases).
- Phase 6's evidence-gated provenance (so doctor never ships invented template versions).
- Phase 10's before-image manifest. This phase depends on 010 and ships after it, so the action's `upgrade-legacy --apply` always has an undo record (parent D2, amended 2026-10-08).
- `upgrade-legacy.mjs` existing behavior: fail-closed apply, per-packet baseline recording, v3 layout detection.

**Deliverables**:
- A read-only compatibility section in `/doctor:update check` showing layout, era signals and repair stages.
- A separate action YAML file for layout move and `upgrade-legacy --apply`.
- A path map preview and collision-check command for users to inspect before approval.
- Updated `/doctor:update` documentation showing the external-user workflow.

**Changelog**:
- When this phase closes, a changelog entry will be recorded by the parent phase (see parent spec.md for changelog location).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`upgrade-legacy.mjs` exists and ships tests but no workflow, hook, or command calls it. `/doctor:update` is a release engine scoped to `.skilled/` units (root, skill, command, directory) with no spec-corpus step. Its route still carries the trigger phrase "spec-kit version migration" but the actual path does not exist. External users cannot detect what era their repo is in, and even if they could, they have no safe way to run the layout move and upgrade because the release transaction covers only `.skilled/` units and would fail on specs changes.

### Purpose
Show external users whether their repo needs a v3 layout move and spec folder upgrade, and provide a safe, gated path to run both outside the release transaction, with preview and collision checking mandatory before apply.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A read-only compatibility section in `/doctor:update check` that calls the era report (Phase 8) and shows layout and pre-v4 signal counts (repair stage recommendations are a research deferral).
- A separate action YAML file that users can run after approval, with steps: layout move preview and collision check, layout move execution, `upgrade-legacy --apply` with baseline recording.
- A before-image manifest requirement for `upgrade-legacy --apply` (Phase 10 writes it on dirty tree; Phase 9 uses existing behavior).
- Documentation showing the external-user workflow: check compatibility, review preview, approve action, run apply.

### Out of Scope
- Changing how `/doctor:update apply` works for `.skilled/` units.
- Automating the layout move or upgrade without explicit user approval.
- Modifying `upgrade-legacy.mjs` core logic (Phase 10 handles reversibility).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/assets/doctor-update-check.yaml` | Modify | Add compatibility section that calls era report and shows findings |
| `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml` | Create | New action for layout move and upgrade outside release transaction |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Update route to include the spec-kit version migration action |
| `.skilled/commands/doctor/update.md` | Modify | Add documentation for external-user compatibility path |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modify | Show compatibility menu option and results |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Add a path map collision-check function (reusable) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `/doctor:update check` shows layout (v3 vs v4) and era signal counts (Phase 10 will add upgrade dry-run summary and error-to-warning transitions as a later enhancement) |
| REQ-002 | A separate action provides layout move and `upgrade-legacy --apply` with explicit user approval required |
| REQ-003 | The layout move step shows a path map preview and collision check before execution |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The external-user documentation names the exact command sequence and warnings (mandatory clean tree or before-image) |
| REQ-005 | The action logs every step and names the rollback procedure |
| REQ-006 | The `/doctor:update` command parser detects partial or complete moves and handles appropriately: show both layouts and recommend finishing the move for partial moves; skip the move step for complete moves |
| REQ-007 | The spec-kit CLI test suite passes with no new failure |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An external user can run `/doctor:update check`, see their repo's layout and era state, and then run the compatibility action without touching the `.skilled/` release engine.
- **SC-002**: The path map preview catches collisions before move execution and provides a clear diff for user review.
- **SC-003**: A repo that starts in v3 layout and runs the action ends with all packets passing strict validation and no manual repairs needed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 8 era report (`repo-era.mjs`) | Compatibility check cannot show signals without it | Phase 8 is a blocker; Phase 9 waits on Phase 8 closure |
| Dependency | Phase 5 healer fix (no rejected phrases) | Doctor ships a tool that violates validator rules | Phase 5 and Phase 6 are blockers; Phase 9 waits on both |
| Risk | Wrong path map can strand a repo | High | Preview step with collision check is mandatory before any move. Path map must be reviewable and correctable. |
| Risk | Concurrent modifications during move or upgrade | High | User must have a clean tree (committed or before-image) before running. The action logs every step so interrupted runs are resumable. |
| Dependency | Phase 10 reversibility (before-image manifest, dry-run downgrade list) | The action would run `--apply` with no undo record | Phase 10 is a blocker; Phase 9 waits on Phase 10 closure |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Usability
- **NFR-U01**: The compatibility check output is under 50 lines, showing only actionable signals, not raw counts.
- **NFR-U02**: The action menu option is clear that approval is required before execution starts.

### Safety
- **NFR-S01**: The layout move is reversible: git history plus a before-image manifest (Phase 10 design) allow recovery from interrupted runs.
- **NFR-S02**: On a dirty tree, the action writes a before-image manifest before the first change, or refuses.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Layout Detection
- Repo with both `.opencode/specs` and `specs/` (partially moved): Show both and recommend completing the move.
- Repo with only `specs/` and old-era packets: Show layout as v4 but era signals as pre-v4, recommend upgrade without move.

### Approval and Execution
- User approves action but tree becomes dirty before execution: Action writes before-image manifest (Phase 10 design) or refuses to start.
- User cancels layout move after preview: All state is rolled back; no packets are modified.
- User cancels upgrade after layout move is complete: Baseline is not written; next run does a full revalidation.

### Error Scenarios
- Collision detected in path map: Action prints the exact collisions and halts. User must resolve and retry.
- `upgrade-legacy --apply` fails on a packet: Baseline is written for what was repaired; user reruns to continue.
- A packet is still failing after upgrade: Action reports the packet and suggests running `upgrade-legacy --include-archive` or manual review.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Five files to modify (check YAML, routes, update.md, presentation, upgrade-legacy.mjs), one new action YAML file, reuse era report from Phase 8, path map collision check is straightforward. |
| Risk | 10/25 | Risky because a wrong path map can corrupt a repo, but mitigated by preview and collision check. User approval is explicit. |
| Research | 3/20 | Research (Phase 14) already designed the workflow and safety measures. Implementation is straightforward. |
| **Total** | **28/70** | **Level 2 - Planning** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the compatibility action refuse to run if `/doctor:update check` found any `.skilled/` units that need updating? (Answer: Yes, to avoid mixing transactions.)
- How much detail should the path map collision check show? (Answer: Every collision with before/after paths, so user can manually resolve if needed.)
<!-- /ANCHOR:questions -->
