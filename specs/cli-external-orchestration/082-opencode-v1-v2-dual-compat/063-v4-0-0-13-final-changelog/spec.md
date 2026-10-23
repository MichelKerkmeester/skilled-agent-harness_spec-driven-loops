---
title: "Feature Specification: Phase 63: v4-0-0-13-final-changelog"
description: "The v4.0.0.13 changelog was trimmed and reordered before the release, but it still named the previous DeepSeek default, described dispatch as preferring an earlier opencode, and carried suite counts from before the final tree. This phase makes the file match what actually ships: `llmgateway/deepseek-v4.1-flash-1017` as the default on both OpenCode versions, Pi, Hermes and the deep-loop fan-out runtime, dispatch that takes the first `opencode2` anywhere on PATH, and suite counts refreshed from reruns on this tree. The changelog file is the only product change."
trigger_phrases:
  - "v4 0 0 13 final changelog"
  - "phase 63 v4 0 0 13 final changelog"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 63: v4-0-0-13-final-changelog

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-23 |
| **Branch** | `worktrees/208-v4-0-0-13-final-changelog` |
| **Parent Spec** | ../spec.md |
| **Phase** | 63 of 63 |
| **Predecessor** | 062-opencode-2-primary-v1-fallback |
| **Successor** | None |
| **Handoff Criteria** | `.skilled/changelog/skilled/v4.0.0.13.md` names `llmgateway/deepseek-v4.1-flash-1017` as the default for both OpenCode versions, Pi, Hermes and the deep-loop fan-out runtime, with Pi's blackhole workers at `high`; says dispatch takes the first `opencode2` anywhere on PATH and uses `opencode` only when no `opencode2` is installed; carries the new `Expect OpenCode 2 when both are installed` and older-`deepseek-v4.1-flash` upgrade notes; shows suite counts of 533 plugins, 914 hook node tests and 461 hook vitest tests with 55 battery unit tests unchanged; and keeps its title and 11 glance bullets. `validate_document.py` reports VALID with 0 issues, `hvr_scan.py` reports 0 hard blockers and a read-only review returns VERDICT: PASS. The commit, push and CI run remain open. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 63** of the OpenCode v1 and v2 dual compatibility packet. It is the closing docs phase over the unreleased v4.0.0.13 changelog, run after phase 061 trimmed and reordered the file and phases 058 and 062 changed the facts the file had to state.

**Scope Boundary**: `.skilled/changelog/skilled/v4.0.0.13.md`, this phase's four docs and the parent packet's phase-map and handoff rows. No code, hook, skill, suite or CI workflow is touched and no other changelog is edited. No tag or release is created here; the orchestrator creates them.

**Dependencies**:
- The changelog as phase 061 left it, which is the base the seven exact replacements were applied to.
- Phase 058, commit `5b5f56720f`, which moved the default to `llmgateway/deepseek-v4.1-flash-1017`, LLM Gateway's 2026-10-17 release, on both OpenCode versions, Pi, Hermes and the deep-loop fan-out runtime, with Pi's blackhole workers at `high`.
- Phase 062, commit `4505c338b1`, which made dispatch take the first `opencode2` anywhere on PATH and use `opencode` only when no `opencode2` is installed, with the fan-out runtime choosing the same way.
- The `sk-create-changelog` contract, which owns the section grammar, the glance ceiling and the voice rules.
- The reruns on this tree, which produced the suite counts the table now shows.

**Deliverables**:
- `.skilled/changelog/skilled/v4.0.0.13.md`, updated with the new default model, the dispatch preference, the two new upgrade notes and the refreshed suite table.
- This phase's four docs, filled with the work, its verification record and the open delivery tasks.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.0.0.13 changelog had been trimmed and reordered, but it still described the release as it stood before two later changes landed. It named `llmgateway/deepseek-v4.1-flash` as the default in the model item, the dispatch glance bullet and the llmgateway upgrade note, even though `llmgateway/deepseek-v4.1-flash-1017` is now the default on both OpenCode versions, Pi, Hermes and the deep-loop fan-out runtime. It described dispatch as preferring an earlier `opencode` on PATH, while dispatch now takes the first `opencode2` anywhere and falls back to `opencode` only when no `opencode2` is installed. Its suite table also carried counts from before the final tree.

### Purpose
Bring the changelog to the state the release will actually ship, so a reader meets the default model, the dispatch behavior and the suite counts that are true on this tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The default DeepSeek model item, `#### One Default Model on Both Versions`, the dispatch glance bullet and the llmgateway upgrade note now name `llmgateway/deepseek-v4.1-flash-1017`, LLM Gateway's 2026-10-17 release, as the default for both OpenCode versions, Pi, Hermes and the deep-loop fan-out runtime, with Pi's blackhole workers at `high`.
- A new upgrade note saying how to pin the older `deepseek-v4.1-flash`.
- Dispatch wording that takes the first `opencode2` anywhere on PATH and uses `opencode` only when no `opencode2` is installed, with the fan-out runtime picking the same way.
- A new upgrade note named `Expect OpenCode 2 when both are installed`, placed after `Move to OpenCode 2`.
- The suite table refreshed from reruns on this tree: plugins 516 to 533, hook node tests 886 to 914, hook vitest 452 to 461 and battery unit tests 55 unchanged.
- Rechecking the plugin count (17) and the 12 `.markdown` files, both unchanged.
- One writer brief with seven exact replacements, both content validators and one read-only review.
- This phase's four docs and the parent packet's phase-map and handoff rows.

### Out of Scope
- Any code, hook, skill, suite or CI workflow.
- Any changelog other than `.skilled/changelog/skilled/v4.0.0.13.md`.
- Any tag or release, which the orchestrator creates after this phase.
- Fixing the two P2 review findings, which are recorded rather than fixed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modify | Final pre-release update: new default model, `opencode2` dispatch preference, two upgrade notes and refreshed suite counts |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 063 and the 062 to 063 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The changelog names the new default model everywhere it states the default. | The `#### One Default Model on Both Versions` item, the dispatch glance bullet and the llmgateway upgrade note all name `llmgateway/deepseek-v4.1-flash-1017`, LLM Gateway's 2026-10-17 release, as the default for both OpenCode versions, Pi, Hermes and the deep-loop fan-out runtime, with Pi's blackhole workers at `high`. A new upgrade note says how to pin the older `deepseek-v4.1-flash`. |
| REQ-002 | Dispatch is described as preferring `opencode2` anywhere on PATH. | The dispatch wording says dispatch takes the first `opencode2` anywhere on PATH and uses `opencode` only when no `opencode2` is installed, and the fan-out runtime picks the same way. A new `Expect OpenCode 2 when both are installed` upgrade note sits after `Move to OpenCode 2`. |
| REQ-003 | The suite table reflects reruns on this tree. | The table shows plugins at 533 from 516, hook node tests at 914 from 886, hook vitest tests at 461 from 452 and battery unit tests at 55 unchanged. The plugin count of 17 and the 12 `.markdown` files are rechecked and unchanged. |
| REQ-004 | The previous phase's title and glance shape survive. | The title remains 'v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 2' and the glance list holds 11 bullets. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The changelog passes both content validators. | `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers. |
| REQ-006 | A separate read-only review checks the final file. | One separate read-only DeepSeek v4.1 flash 1017 session at max thinking returns VERDICT: PASS with no P0 or P1 and two P2s: 'runs OpenCode 2 whenever it is installed' at lines 17 and 39 compresses away the `OPENCODE_BIN` override that line 99 states, and OpenCode 1 is named before OpenCode 2 inside two clauses at lines 99 and 172 without inverting the recommendation. Both are recorded and not fixed. |
| REQ-007 | This phase's records match the final state. | All four docs replace every scaffold placeholder, carry status In Progress and list the commit-and-push and CI confirmation as the only open tasks. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader meets the default model, the dispatch behavior and the suite counts that are true on this tree, with no stale count or previous default left behind.
- **SC-002**: The changelog keeps its title, its 11 glance bullets and its voice while gaining only the facts this phase needed to add.
- **SC-003**: Both validators report 0 issues and 0 hard blockers, and the one review returns PASS with its two P2s recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 058, commit `5b5f56720f`, which changed the default model | High | The changelog names the value that commit set, and the review checked it against the prose |
| Dependency | Phase 062, commit `4505c338b1`, which changed dispatch | High | The dispatch wording and the new upgrade note describe that behavior, and the `OPENCODE_BIN` override remains stated at line 99 |
| Dependency | Reruns on this tree for the suite counts | Med | The table was refreshed from those runs rather than carried over from an earlier tree |
| Risk | The new default is stated in one place but missed in another | Med | The writer brief listed all three places as exact replacements, and a grep for the old id after the edit confirmed the result |
| Risk | The dispatch wording reads as an absolute rule | Med | The review flagged that 'runs OpenCode 2 whenever it is installed' compresses away the `OPENCODE_BIN` override; recorded as a P2 rather than fixed |
| Risk | A refresh changes a count that was already right | Low | The plugin count of 17 and the 12 `.markdown` files were rechecked and left unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The facts came from phases 058 and 062, the reruns on this tree and the review. The open tasks are delivery, not decisions.
<!-- /ANCHOR:questions -->

---
