---
title: "Feature Specification: Phase 57: v4-0-0-13-reliability-fixes"
description: "The v4.0.0.13 changelog named the release's reliability work in one glance bullet, so a reader upgrading from v4.0.0.12 could not see the advisor queue, the hand-off count lock, the goal record fixes, the worktree provisioning or the smaller repairs. This phase adds a Reliability Fixes section with five items, widens that glance bullet in place, and adds the goal-session workspace upgrade note. It changes one changelog file."
trigger_phrases:
  - "v4 0 0 13 reliability fixes"
  - "phase 57 v4 0 0 13 reliability fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 57: v4-0-0-13-reliability-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-22 |
| **Branch** | `worktrees/202-v4-0-0-13-reliability-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 57 of 57 |
| **Predecessor** | 056-command-folder-guard-and-readme-baseline |
| **Successor** | None |
| **Handoff Criteria** | The v4.0.0.13 changelog carries a Reliability Fixes section with five items covering the fixes since v4.0.0.12, its glance bullet names the same work at the 12-bullet ceiling, and the goal-session workspace upgrade note is present; `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers; the round 3 read-only review returned PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 57** of the OpenCode v1 and v2 dual compatibility packet. It is a docs phase over the unreleased v4.0.0.13 changelog, run after 054 gave that release its OpenCode headline.

**Scope Boundary**: `.skilled/changelog/skilled/v4.0.0.13.md` and nothing else. No plugin, hook, runtime, skill or other doc is edited, and no suite is changed.

**Dependencies**:
- The 25 commits since tag v4.0.0.12 that carry these fixes, across five groups: advisor lookups, the hand-off count lock, goal records, worktree provisioning, and the smaller repairs.
- The `sk-create-changelog` contract, which owns the section grammar, the 12-bullet glance ceiling and the rule that test counts are dropped by default.
- `054-v4-0-0-13-changelog-opencode/`, whose paragraph on the four hand-off note faults already covers the one commit this phase drops.

**Deliverables**:
- `.skilled/changelog/skilled/v4.0.0.13.md`, with a new `## Reliability Fixes` section of five H4 items, the merged glance bullet and the goal-session workspace upgrade note.
- This phase's four docs, filled from the scaffold.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
v4.0.0.13 shipped a run of reliability fixes between tag v4.0.0.12 and the release: advisor lookups that queued without a deadline, a hand-off count that two hooks could overwrite at once, a corrupt goal record that revived a stale goal, worktrees missing their package trees, and a set of smaller repairs. The changelog mentioned none of them. The one glance bullet said state and CI were sturdier, which a reader could not turn into a single thing the release fixed, and nothing warned that goal session actions now need a workspace argument.

### Purpose
Add the user-visible fixes since v4.0.0.12 to the v4.0.0.13 changelog as their own section, so the release notes describe what an upgrading reader will notice.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `## Reliability Fixes` section between the last existing release section and Upgrade Notes, with five H4 items: advisor lookups that queue and give up on time, hand-off counts that stop racing, a corrupt goal record that reads as no goal, fresh worktrees that build what they need, and the smaller fixes across the stack.
- Widening the existing glance bullet to "State, locks and CI are sturdier." so it names advisor lookups, the hand-off count lock, the goal record, worktree provisioning, the git pre-commit installer and the OpenCode session-cleanup guards, while the glance list stays at its 12-bullet ceiling.
- A new upgrade note, "Pass a workspace to goal session actions.", for scripts that call the goal session actions.
- Three one-change writing briefs and three separate read-only fact-check rounds, whose findings are fixed rather than waived.

### Out of Scope
- Commit `ecd8873efa`, which names handoff notes by the full session id, because the live-proof paragraph already covers that fault among its four.
- Any behaviour change: this phase describes commits that already landed and edits one changelog file.
- Code, suites and CI workflows.
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` beyond the phase map and handoff rows for this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modify | New Reliability Fixes section with five items, the merged glance bullet and the goal-session workspace upgrade note |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 057 and the 056 to 057 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `## Reliability Fixes` section sits between the last existing release section and Upgrade Notes, with five H4 items covering advisor lookups, the hand-off count lock, goal records, worktree provisioning and the smaller fixes. | `.skilled/changelog/skilled/v4.0.0.13.md` shows the section at that position with five `####` headings under it, one per group. |
| REQ-002 | The glance bullet names the same work without growing the list past 12 bullets. | The bullet reads "State, locks and CI are sturdier." and names advisor lookups, the hand-off count lock, the goal record, worktree provisioning, the git pre-commit installer and the OpenCode session-cleanup guards; `What's New at a Glance` still lists 12 bullets. |
| REQ-003 | Every claim matches its commit, with no behaviour asserted beyond what the code does. | Each item's sentences trace to its group's commits, including that a lock is taken over only from a dead owner or an unreadable owner record past the stale window, that the 2.2 ms figure describes one source file's signature check on a repeat lookup, and that the two excluded package trees stay out on purpose. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The goal-session workspace requirement is stated where an upgrader will see it. | Upgrade Notes carries "Pass a workspace to goal session actions.", naming `--workspace` and the repo root it takes. |
| REQ-005 | The changelog passes both content validators. | `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers. |
| REQ-006 | A separate read-only reviewer checks the file, each round's findings are fixed, and the round 3 verdict is recorded. | `implementation-summary.md` records round 1's FAIL on one P1 and two P2s, round 2's FAIL on one P1 and one P2, and round 3's PASS with no findings. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader upgrading from v4.0.0.12 can name the reliability fixes this release carries without reading the commit log.
- **SC-002**: The glance list still fits the template's 12-bullet ceiling, so the new work costs no other topic its line.
- **SC-003**: Both validators pass, and every sentence in the section traces to a commit in its group.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The 25 commits since tag v4.0.0.12 | High | Each item was written from its group's commit messages and code, and the read-only rounds checked the claims against them |
| Dependency | The `sk-create-changelog` contract | Med | The section follows its grammar and keeps the 12-bullet ceiling by widening an existing bullet rather than adding one |
| Risk | A changelog claim outruns its commit | High | Three read-only rounds checked every sentence, and the two rounds that failed had their findings fixed before the next round |
| Risk | A fix the reader must act on stays buried in a section body | Med | The goal-session workspace change is repeated in Upgrade Notes, where an upgrader looks for changes to their own scripts |
| Risk | A dropped commit leaves a gap in the story | Low | The dropped commit's fault already appears in the live-proof paragraph, so the release notes cover it once rather than twice |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator asked on 2026-10-22 for the missing fixes to be added, and the round 3 read-only review returned PASS with no findings.
<!-- /ANCHOR:questions -->

---
