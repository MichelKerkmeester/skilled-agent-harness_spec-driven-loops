---
title: "Feature Specification: Phase 61: v4-0-0-13-changelog-trim-and-simplify"
description: "The v4.0.0.13 changelog still carried two topics the operator wanted for later releases, and its wording leaned on internal jargon. This phase drops the Resident Memory and MCP Tooling topics, replaces the jargon with plain words, applies the operator's mid-task framing rule that OpenCode 2 is the expected and recommended version with OpenCode 1 as temporary backwards compatibility, reorders every section by user impact and cuts the file from 3359 words to 2961. The changelog file is the only product change."
trigger_phrases:
  - "v4 0 0 13 changelog trim and simplify"
  - "phase 61 v4 0 0 13 changelog trim"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 61: v4-0-0-13-changelog-trim-and-simplify

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
| **Branch** | `worktrees/206-v4-0-0-13-changelog-trim` |
| **Parent Spec** | ../spec.md |
| **Phase** | 61 of 61 |
| **Predecessor** | 060-v4-0-0-13-changelog-rewrite |
| **Successor** | None |
| **Handoff Criteria** | The v4.0.0.13 changelog no longer mentions the Resident Memory or MCP Tooling topics, its jargon is replaced with plain words, its sections and bullets are ordered by user impact with the handover leading and OpenCode 2 named before OpenCode 1, and its glance list holds 11 payoff bullets. The file runs to 2961 words from 3359. `validate_document.py` reports VALID with 0 issues, `hvr_scan.py` reports 0 hard blockers and a grep for the removed topics returns no hits. Three read-only review rounds ran: round 1 returned FAIL with four P1 findings, all fixed; round 2 returned PASS with four P2 findings, three fixed by hand and the fourth carried by this records update; round 3 returned FAIL with one P1, fixed by hand along with one P2. The commit, push and CI run remain open |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 61** of the OpenCode v1 and v2 dual compatibility packet. It is the closing docs phase over the unreleased v4.0.0.13 changelog, run after the rewrite gave both headline sections equal weight.

**Scope Boundary**: `.skilled/changelog/skilled/v4.0.0.13.md`, this phase's four docs and the parent packet's phase-map and handoff rows. No code, hook, skill, suite or CI workflow is touched and no other changelog is edited. The new default model stays out because that switch was not on main when this phase was written.

**Dependencies**:
- The rewritten changelog as the previous version left it, which is the only fact source the writers were allowed to use.
- The `sk-create-changelog` contract, which owns the section grammar, the glance ceiling and the voice rules.
- The operator's 2026-10-22 request, which named the two topics to drop, the jargon to replace and the impact order to apply.
- DeepSeek v4.1 flash at max thinking, which wrote the section drafts and the assembly.
- The operator's mid-task framing rule: OpenCode 2 is the version the framework expects and recommends, and OpenCode 1 support is temporary backwards compatibility while users move over, with no removal date.

**Deliverables**:
- `.skilled/changelog/skilled/v4.0.0.13.md`, trimmed to 2961 words with the removed topics, the plain wording, the impact order and a new Reliability Fixes item, `Saved State and Test Suites Hold Up`, that keeps the facts the trim almost lost.
- This phase's four docs, filled with the work, its verification record and the open delivery tasks.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.0.0.13 changelog had grown to 3359 words and still described work the operator did not want in this release. The Resident Memory topic covered the local model server's idle unload, orphan reaping, leftover-process counts and separate launcher, and the MCP Tooling topic covered ClickUp and Figma's 24 findings and a fresh Code Mode install. Both belonged to their own spec folders, and four spec-folder line entries pointed readers at them. The wording also leaned on internal jargon such as hop, reap, fingerprint, provision, bridge and dual export, and the sections were not ordered by what a reader gains first.

### Purpose
Cut the same release story to its user-facing payoff, in plain words, with the handover leading and OpenCode 2 presented as the version the framework expects and recommends, OpenCode 1 following as temporary backwards compatibility.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Removing the Resident Memory and MCP Tooling topics everywhere they appeared, including the four spec-folder line entries for `system-skill-advisor/037-advisor-daemon-memory`, `system-speckit/049` phases 032 and 033, and `mcp-tooling/023` and `024`.
- Replacing jargon with plain words, among them hop, reap, fingerprint, provision, bridge and dual export.
- Reordering sections, H4 items and bullets by user impact, with the handover leading and OpenCode 2 named first wherever both versions appear in prose.
- Applying the operator's mid-task framing rule: OpenCode 2 is the version the framework expects and recommends, and OpenCode 1 support is temporary backwards compatibility while users move over, with no removal date. The DeepSeek fix pass carried it into the title, the trigger phrase, the H2 heading, a new `Move to OpenCode 2` upgrade note, and reworded `Pin OpenCode 1` as a fallback step.
- Rewriting the glance list to 11 payoff bullets and cutting the file from 3359 words to 2961.
- Four parallel section drafts in `scratch/draft-a.md` to `scratch/draft-d.md` plus one assembly pass, then both content validators and three read-only review rounds.
- Restoring facts the first review found missing, as the `Saved State and Test Suites Hold Up` Reliability Fixes item: the deep-loop log keeps every row on rebuild and five suites now run in CI.
- Keeping the deliberate exception in Environment Settings, where the note that `/doctor:env` keeps the Code Mode provider keys hidden stays because it is a settings fact, not the removed install topic.

### Out of Scope
- Any code, hook, skill, suite or CI workflow.
- Any changelog other than `.skilled/changelog/skilled/v4.0.0.13.md`.
- The new default model `deepseek-v4.1-flash-1017`, because that switch was not on main yet.
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` beyond the phase map and handoff rows for this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modify | Trimmed, plainly worded, impact-ordered release note at 2961 words with the two topics removed, the glance list at 11 bullets and OpenCode 2 framed as the expected version |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 061 and the 060 to 061 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The two unwanted topics are gone. | The Resident Memory topic (idle unload, orphan reaping, leftover-process counts, separate launcher) and the MCP Tooling topic (ClickUp and Figma's 24 findings, fresh Code Mode install) appear nowhere in the file, and the four spec-folder line entries for `system-skill-advisor/037-advisor-daemon-memory`, `system-speckit/049` phases 032 and 033, and `mcp-tooling/023` and `024` are removed. |
| REQ-002 | The wording is plain. | No hop, reap, fingerprint, provision, bridge or dual export remains as jargon, and each is replaced by the everyday word that says the same thing. |
| REQ-003 | The file leads with user impact. | Sections, H4 items and bullets are ordered by what a reader gains, with the handover leading and OpenCode 2 named before OpenCode 1 wherever both appear in prose. |
| REQ-004 | The file is shorter and the glance list is rewritten. | The file runs to 2961 words from 3359, and `What's New at a Glance` holds 11 payoff bullets. |
| REQ-007 | OpenCode 2 is framed as the expected version, with OpenCode 1 as temporary backwards compatibility. | The title reads 'v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 2', the trigger phrase reads 'opencode 2 plugin support', the H2 reads 'OpenCode 2, With OpenCode 1 Still Supported', OpenCode 2 is named first wherever both versions appear in prose, a `Move to OpenCode 2` upgrade note exists and `Pin OpenCode 1` reads as a fallback step, with no removal date for OpenCode 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The changelog passes both content validators. | `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers. |
| REQ-006 | Read-only reviewers check the trimmed file and the final state is recorded. | Separate read-only DeepSeek v4.1 flash reviews at max thinking ran three rounds. Round 1 returned FAIL with four P1 findings, all fixed by a DeepSeek fix pass that also applied eleven P2s; round 2 returned PASS with four P2 findings, three fixed by hand and the fourth carried by the records update; round 3 returned FAIL with one P1, where reordering the versions had attached 'its two built-ins included' to OpenCode 1, fixed by hand as '42 on OpenCode 2, its two built-ins included, and 40 on OpenCode 1', plus one P2 on 'a session's sub-agent hand-off count' and the restoration of the config-shape sentence's cause and effect. The two remaining P2s are recorded, not fixed. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader meets the handover first, then OpenCode 2 as the version the framework expects and recommends with OpenCode 1 as temporary backwards compatibility, and meets no removed topic or internal jargon on the way.
- **SC-002**: The file is about seven eighths of its previous length while keeping every fact a reader would act on.
- **SC-003**: Both validators report 0 issues and 0 hard blockers, a grep for the removed topics returns no hits, and the findings of three review rounds are either fixed or recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The rewritten changelog as the previous version left it | High | Writers were told to use only facts already in that file, and both validators plus the review checked every sentence against it |
| Dependency | Four writers working at once | Med | Each writer got one section, and one assembly pass joined them into a single voice and order |
| Risk | Removing a topic also removes a fact a reader needs | High | The cut was limited to the two named topics and their spec-folder line entries, and the review read the whole file for lost context |
| Risk | The plain-word pass changes a technical name | Med | Only the jargon words changed; paths, commands, setting names and product names were left as written |
| Risk | The reorder buries a smaller fix | Med | The glance list was rewritten to 11 payoff bullets so each remaining topic keeps its line |
| Risk | The trim drops a fact a reader needs | High | The first review caught two lost facts, and both were restored in the new `Saved State and Test Suites Hold Up` Reliability Fixes item before round 2 |
| Risk | Reordering the versions attaches a detail to the wrong version | High | Round 3 caught 'its two built-ins included' sitting on OpenCode 1; it was fixed by hand to read '42 on OpenCode 2, its two built-ins included, and 40 on OpenCode 1' |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator asked on 2026-10-22 to drop two topics, simplify the wording and reorder by impact, and added the OpenCode 2 framing rule mid-task. The open tasks are delivery, not decisions.
<!-- /ANCHOR:questions -->

---
