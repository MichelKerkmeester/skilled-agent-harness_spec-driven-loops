---
title: "Feature Specification: Phase 24: goal-rebind-claude-codex-hermes-probes"
description: "The goal-persistence design rests on four behaviors nobody has run: whether Claude runs a slash command given as its start prompt, whether a start hook can make Claude run it, whether Codex accepts a goal created from seed or hook context, and whether Hermes keeps a goal when HERMES_SPEC_FOLDER is exported. This phase runs each one, records the output and names the build path phase 27 takes."
trigger_phrases:
  - "goal rebind probes"
  - "phase 24 goal rebind claude codex hermes probes"
  - "claude goal as start prompt"
  - "session start hook goal command"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 24: goal-rebind-claude-codex-hermes-probes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-24 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 of 29 |
| **Predecessor** | 023-relaunch-cancel-and-test-isolation |
| **Successor** | 025-goal-binding-record-and-launcher |
| **Handoff Criteria** | Every probe has a recorded run and a verdict, and the summary names the phase 27 path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of the session relaunch loop specification.

**Scope Boundary**: Four read-only probes and their written verdicts. No tracked file outside this folder changes, and no hook, plugin or relaunch code is written here.

**Dependencies**:
- Phase 023, which closed the relaunch gate this work builds on.
- A fresh operator yes before any probe uses a bypass flag. The approval from the earlier live run covered that run only.

**Deliverables**:
- Four probe records under scratch/ with the command, the output and the exit status.
- A verdict per probe in the implementation summary, and the path phase 27 follows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After a hand-over the new session has a new session id, and each runtime keeps its goal under the id of the session that set it, so the new session finds none. The fix design depends on four behaviors that were read from code and docs and never run: Claude running a slash command given as its start prompt, a Claude start hook making `/goal` run, Codex accepting a goal created from seed or hook context, and Hermes keeping a goal when `HERMES_SPEC_FOLDER` is exported before launch. Building phase 27 on an unrun claim risks a hook that silently does nothing.

### Purpose
Every unverified claim in the goal-persistence design is run once, so phase 27 builds on observed behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Probe A: start `claude "/goal <short text>"` and observe whether the goal is set as a command or sent as plain text.
- Probe B: add a throwaway SessionStart hook that tries to make Claude run `/goal <text>` and observe whether it runs, is shown as context only, or is ignored.
- Probe C: ask Codex, through its start prompt and through hook context, to create a goal and observe whether one is created and what limit applies.
- Probe D: export `HERMES_SPEC_FOLDER` and start two Hermes sessions with different ids to see whether the second one shows the goal bound.
- A negative control per probe that could have contradicted it, such as a plain-text start prompt or a hook that returns nothing.
- A verdict per probe and the phase 27 path it selects.

### Out of Scope
- Any change to a hook, plugin, core or wrapper - the probes use throwaway files under scratch/ and the session scratchpad, and the build is phases 25 to 27
- Probing Pi, OpenCode, Devin or Cursor - they use the shared goal core and the plugin, which a unit test can prove
- Asking the operator to rotate or reveal a key - a probe that cannot run for lack of credentials is recorded as SKIP

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scratch/probe-a-claude-start-prompt.md | Create | Command, transcript, exit status and negative control for probe A |
| scratch/probe-b-claude-start-hook.md | Create | The throwaway hook, its output and the negative control for probe B |
| scratch/probe-c-codex-goal.md | Create | Codex runs and the limit they show |
| scratch/probe-d-hermes-spec-folder.md | Create | The two-session Hermes run |
| implementation-summary.md | Modify | One verdict per probe and the phase 27 path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the four probes ends with a recorded run: the command, the output and the exit status, saved under scratch/ |
| REQ-002 | Each probe has a negative control that could have contradicted it, run and recorded beside it |
| REQ-003 | The implementation summary gives one verdict per probe (confirmed, refuted or inconclusive), says what each run cannot show, and names the phase 27 path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Probes run without bypass flags first, and a bypass flag waits for a fresh operator yes |
| REQ-005 | No tracked file outside this folder changes, and no goal record, hook or process is left behind |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four recorded runs and four negative controls exist, and the summary holds four verdicts.
- **SC-002**: Phase 27 names one path (a start hook sends the command, the start prompt is the command, or the seed asks for the fenced slice) with the probe that selected it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude, Codex and Hermes credentials on this machine | A probe cannot run | Record SKIP with the exact reason and mark that verdict inconclusive |
| Risk | A probe leaves a goal set in a real session | Med | Run each in a throwaway directory and clear the goal before the probe ends |
| Risk | A runtime changes its slash-command handling after the probe | Low | Each record carries the runtime version it ran on |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each probe finishes in minutes, and a hung probe is stopped and recorded as inconclusive.
- **NFR-P02**: The probes run one at a time so their output cannot mix.

### Security
- **NFR-S01**: No credential is printed, logged or written, and `coder/.env` is never opened.
- **NFR-S02**: A bypass flag runs only after a fresh operator yes.

### Reliability
- **NFR-R01**: A probe that fails to start is recorded as it ran, not retried until it passes.
- **NFR-R02**: A refuted or inconclusive probe is a valid result and blocks nothing but the path it would have selected.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A goal text over the runtime limit: the probe records the refusal rather than trimming the text.
- An empty goal text: recorded as the runtime reports it.

### Error Scenarios
- The hook errors: the probe records that the session still started.
- The runtime asks for approval: the probe records the question and stops that run.

### State Transitions
- A second Hermes session reuses the first id: the probe confirms the ids differ before reading the result.
- A goal already set in the probe session: the probe clears it first so the result is not inherited.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Four runtimes, no tracked code |
| Risk | 8/25 | Real CLIs and a bypass question |
| Research | 10/20 | Four unrun claims to settle |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- If probe B is refuted, which of the two fallback paths does the operator want first: the start prompt as the command, or the seed that asks the receiver to send the fenced slice? The seed path needs no new hook, so this phase recommends it as the floor.
<!-- /ANCHOR:questions -->

---
