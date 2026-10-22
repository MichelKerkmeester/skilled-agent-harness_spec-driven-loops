---
title: "Feature Specification: Phase 60: v4-0-0-13-changelog-rewrite"
description: "The v4.0.0.13 changelog told the release as a handover story, so OpenCode 2 plugin support read as a footnote. This phase rewrites the file so both headlines carry equal weight, cuts it from 4149 words to 3359 and gives it the tighter marketing voice of the v4.0.0.0 changelog. The changelog file is the only product change."
trigger_phrases:
  - "v4 0 0 13 changelog rewrite"
  - "phase 60 v4 0 0 13 changelog rewrite"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 60: v4-0-0-13-changelog-rewrite

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
| **Branch** | `worktrees/205-v4-0-0-13-changelog-rewrite` |
| **Parent Spec** | ../spec.md |
| **Phase** | 60 of 60 |
| **Predecessor** | 059-cross-cli-map-refresh |
| **Successor** | None |
| **Handoff Criteria** | The v4.0.0.13 changelog opens with the handover and OpenCode 1 and 2 support as equal headlines, runs to 3359 words with both headline sections at six H4 items and keeps its glance list at 12 bullets. `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers. The round 3 read-only review returned PASS. The commit is pushed to main and CI is green on it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 60** of the OpenCode v1 and v2 dual compatibility packet. It is the last docs phase over the unreleased v4.0.0.13 changelog, run after 057 gave that release its Reliability Fixes section and 059 brought the cross-CLI map back in line with the tree.

**Scope Boundary**: `.skilled/changelog/skilled/v4.0.0.13.md`, this phase's four docs and the parent packet's phase-map and handoff rows. No code, hook, skill, suite or CI workflow is touched and no other changelog is edited. The new default model stays out because phase 058 owns that switch, and it had not landed on main when this phase was written, so the rewrite keeps `llmgateway/deepseek-v4.1-flash` as the stated default.

**Dependencies**:
- The changelog as 057 left it, which is the only fact source the writers were allowed to use.
- The `sk-create-changelog` contract, which owns the section grammar, the 12-bullet glance ceiling and the voice rules.
- The v4.0.0.0 changelog, which the operator named as the style exemplar.
- `cli-pi` on the llmgateway transport, which carried the three writing briefs.

**Deliverables**:
- `.skilled/changelog/skilled/v4.0.0.13.md`, retitled and rewritten to 3359 words with both headlines leading.
- This phase's four docs, filled with the rewrite, its review record and the two open delivery tasks.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.0.0.13 changelog described the release mostly as the handover, and the imbalance started at the top. The title, the description and the opening paragraphs all led with sessions handing themselves over, while OpenCode 2 plugin support, the other half of the release, arrived later and read as a smaller item. The file also ran to 4149 words, longer than a reader deciding whether to upgrade will spend. The v4.0.0.0 changelog was the operator's example of the voice that works: direct, short sentences, one idea per paragraph.

### Purpose
Rewrite the same facts into a changelog where the handover and OpenCode 1 and 2 support carry equal weight, at about four fifths of the length, in the marketing voice of v4.0.0.0.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Retitling the file to "v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 1 and 2", then rebuilding the description, the opening paragraphs, Why This Release and the glance order so both headlines lead.
- Cutting In-Session Handover from 8 H4 items and 805 words to 6 items and 605 words, and OpenCode 1 and 2 from 8 items and 941 words to 6 items and 697 words, which includes merging the two round-1 headings.
- Holding the glance list at 12 bullets, with the first six alternating between handover and OpenCode.
- Cutting each remaining section by about a quarter to a third, for 4149 words down to 3359.
- Three parallel writers, one assembly, one polish pass and three read-only review rounds whose findings were fixed.

### Out of Scope
- Any code, hook, skill, suite or CI workflow.
- Any changelog other than `.skilled/changelog/skilled/v4.0.0.13.md`.
- The new default model, which phase 058 is switching.
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` beyond the phase map and handoff rows for this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modify | Retitled rewrite at 3359 words, with both headlines equal and the glance list held at 12 |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 060 and the 059 to 060 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The changelog leads with both headlines. | The title reads "v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 1 and 2", and the description, the opening paragraphs, Why This Release, the glance order and both sections give the handover and OpenCode 1 and 2 support equal weight. |
| REQ-002 | The rewrite is shorter and both headline sections are tighter. | The file runs to 3359 words from 4149, In-Session Handover carries 6 H4 items at 605 words from 8 at 805, OpenCode 1 and 2 carries 6 at 697 from 8 at 941, and every other section is cut by about a quarter to a third. |
| REQ-003 | No claim outruns the previous changelog. | Every fact, number, path, command and name in the rewrite is stated or directly implied in the version 057 left, the spec-folder line keeps "phases 032 and 033", and both versions are still described as defaulting to `llmgateway/deepseek-v4.1-flash`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The glance list fits the template. | `What's New at a Glance` lists 12 bullets, the first six alternate handover and OpenCode, and no other topic loses its line. |
| REQ-005 | Separate read-only reviewers check the file and their findings are fixed. | `implementation-summary.md` records round 1's FAIL on 2 P1s and many P2s, round 2's FAIL on 1 P1 and 4 P2s and round 3's PASS with 2 P2s, and every P1 was fixed before the next round began. |
| REQ-006 | The changelog passes both content validators. | `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader meets the handover and OpenCode 1 and 2 support as two headlines of the same size, in the title and on the first screen.
- **SC-002**: The file is about four fifths of its previous length while keeping every fact a reader would act on.
- **SC-003**: Both validators pass and the round 3 read-only review returns PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The changelog as 057 left it | High | Writers were told to use only facts already in that file, and three read-only rounds checked every sentence against it |
| Dependency | Three writers working at once | Med | Each writer got one part of the file, and one assembly pass plus one polish pass joined them into a single voice |
| Risk | A headline claim outruns the evidence | High | The title was rewritten after round 1 caught "Sessions That Never Run Out" overstating the handover |
| Risk | Cutting for length loses a fact a reader needs | High | Ten round-1 P2s were restored and every fact dropped on purpose is recorded in `implementation-summary.md` |
| Risk | The style pass makes the file say more than the source | Med | Round 2 caught live-test and side-by-side claims that had spread to agents, commands and config, and the fix limited them to the 17 plugins and the two versions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator asked on 2026-10-22 for the rewrite and gave the v4.0.0.0 changelog as the voice to match. The two open tasks are delivery, not decisions.
<!-- /ANCHOR:questions -->

---
