---
title: "Feature Specification: Phase 54: v4-0-0-13-changelog-opencode"
description: "The unreleased v4.0.0.13 changelog described the OpenCode 1 and 2 work as one line among many, so the release's second headline read like a minor fix. This phase makes that work prominent: the section moves up to sit right after In-Session Handover, carries eight items including the live two-version testing, and the description, intro, Why This Release, glance list and Upgrade Notes name it. It changes one changelog file."
trigger_phrases:
  - "v4 0 0 13 changelog opencode"
  - "phase 54 v4 0 0 13 changelog opencode"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 54: v4-0-0-13-changelog-opencode

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-22 |
| **Branch** | `worktrees/198-v4-0-0-13-changelog-opencode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 54 of 54 |
| **Predecessor** | 053-final-commit-live-proof |
| **Successor** | None |
| **Handoff Criteria** | The changelog names the OpenCode 1 and 2 work and its testing in the description, intro, Why This Release, glance list, section body and Upgrade Notes; `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers; the round 3 read-only review verdict is recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 54** of the OpenCode v1 and v2 dual compatibility packet. It is a docs phase over the unreleased v4.0.0.13 changelog.

**Scope Boundary**: `.skilled/changelog/skilled/v4.0.0.13.md` and nothing else. No plugin, hook, runtime, skill or other doc is edited, and no suite is changed.

**Dependencies**:
- `../053-final-commit-live-proof/`, whose live 17-plugin matrix on OpenCode 1.19.3 and 2.0.32 at `dfdc523af5` supplies the testing claim the changelog now repeats.
- The released-tree suite counts, rerun for this phase, in four rows: plugins 516, hook node 886 over 30 files, hook vitest 452 and battery unit 51. The dispatch audit count is not a row of its own, because the tests it covers already sit inside the hook vitest row and listing it counted them twice.
- The `sk-create-changelog` contract, which owns the structure, the glance-list ceiling and the rule that test counts are dropped by default.

**Deliverables**:
- `.skilled/changelog/skilled/v4.0.0.13.md`, with the OpenCode section promoted and the testing item carrying its suite table.
- This phase's four docs, filled from the scaffold.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
v4.0.0.13 made OpenCode 2 a headline change: every plugin, agent, command and the config run on OpenCode 1 and 2 from one source. The unreleased changelog did not read that way. The OpenCode section sat below the environment and framework-standard sections, its one-line mention gave no room for the live two-version proof, and the frontmatter, intro, Why This Release, glance list and Upgrade Notes either skipped the work or named it in passing. A reader deciding whether to upgrade would have taken it for a minor compatibility fix.

### Purpose
Make the OpenCode 1 and 2 work, and the testing behind it, a prominent part of the v4.0.0.13 changelog, without changing any behaviour the file describes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Moving the OpenCode section up to sit right after In-Session Handover and filling it with eight H4 items: plugins on both versions, shared agents/commands/config, dispatch follows the version, side-by-side install, one default model, version-aware guards, tested live on both versions, and what still differs.
- Naming the OpenCode work in the frontmatter description, the intro, Why This Release, the glance list and Upgrade Notes.
- Merging the glance list from 14 bullets to the template's ceiling of 12, and adding three OpenCode upgrade notes.
- Correcting the plugin count from sixteen to 17, which matches `.opencode/plugins/`.
- A recorded deviation: the testing item keeps a suite table, with counts rerun on the release tree, although the template drops test counts by default.

### Out of Scope
- Any code or behaviour change - this phase edits one changelog file.
- Suites, CI workflows and the two-version proof - 053 ran the proof and every count here was rerun for accuracy, not as a new gate.
- The Resident Memory section's `037-advisor-daemon-memory/002-lighter-advisor-launcher` pointer, which predates this edit and was left as found.
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` beyond the phase map and handoff rows for this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modify | Promoted OpenCode section with eight items, OpenCode named in the description, intro, Why This Release, glance list and Upgrade Notes, plus the testing suite table |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 054 and the 053 to 054 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The OpenCode section sits right after In-Session Handover and carries eight H4 items, the last two of which are the live two-version testing and what still differs. | `.skilled/changelog/skilled/v4.0.0.13.md` shows the section at that position with eight `####` headings under it. |
| REQ-002 | The description, intro, Why This Release, glance list and Upgrade Notes all name the OpenCode work, and the glance list holds 12 bullets after merging related ones. | The frontmatter description and each named section mention OpenCode 1 and 2, and `What's New at a Glance` lists 12 bullets. |
| REQ-003 | Every factual claim was checked against the release tree, and the P1 findings the two review rounds raised are fixed rather than waived. | The plugin count reads 17, the hook node count reads 886 over 30 files, the `OPENCODE_DB` sentence reads in the right direction, the dash-and-bash claim is either recorded or removed, the sk-vision tools gate is stated, and 323 is described as an audit-time count. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The testing item carries the suite table with counts rerun on the release tree, kept because the operator asked for the testing to be shown, and recorded as a deviation from the template. | The table's four rows read plugins 516, hook node 886 over 30 files, hook vitest 452 and battery unit 51, with no dispatch audit row of its own, and `implementation-summary.md` records the deviation. |
| REQ-005 | The changelog passes both content validators. | `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers. |
| REQ-006 | A separate read-only reviewer checks the file, with each round's findings fixed and the round 3 verdict recorded. | `implementation-summary.md` records round 1's 2 P1s, round 2's 3 P1s, round 3's 1 P1 and its P2s, and the narrow read-only check that passed the changed sentences. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader who opens the changelog meets the OpenCode 1 and 2 work right after the handover, as the release's second headline rather than a compatibility note.
- **SC-002**: The testing claim is concrete: the two-version live run and the four suite counts are stated on the page, and each count matches the release tree.
- **SC-003**: Both validators pass, and no claim in the file lacks a record behind it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The live matrix in `053/scratch/live-runs/results-matrix.md` | High | The testing item repeats 053's 17-of-17 result on 1.19.3 and 2.0.32 and cites the same versions |
| Dependency | The release-tree suite counts | High | Every count was rerun before it was written; the stale 872 hook node count was replaced with 886 |
| Risk | A changelog claim outruns its evidence | High | Three read-only review rounds checked each claim, and every P1 they raised was fixed |
| Risk | Promoting the section crowds out the release's other headline | Med | The glance list was merged to the template's 12-bullet ceiling rather than grown, so every topic keeps a line |
| Risk | Test counts drift from the template's default | Low | The table is kept as a recorded deviation, with the operator's request as its reason, and the counts are the release tree's |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for the edit. The round 3 verdict is recorded: FAIL on 1 P1, fixed in one more brief, then a narrow read-only check of the changed sentences returned PASS with one P2, also fixed.
<!-- /ANCHOR:questions -->

---
