---
title: "Feature Specification: Phase 9: research-fixes-and-core-consolidation"
description: "The research run after phase 008 verified eleven bugs and ten drift items in the session relaunch loop and found the adapters repeating decisions the core should own. This phase fixes them, moves those decisions into the core and adds a conformance suite across the adapters."
trigger_phrases:
  - "research fixes and core consolidation"
  - "phase 9 research fixes"
  - "session relaunch conformance suite"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: research-fixes-and-core-consolidation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `worktrees/148-session-relaunch-deep-review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-review-3-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the session-relaunch suites and the Pi suite pass with no failures and recursive strict validation of the parent prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Session relaunch loop specification.

**Scope Boundary**: The verified findings in `../research/research.md` section 1, its architecture recommendation and the phase 008 drift it names. The deep-loop projection bug in section 2 belongs to system-deep-loop and stays out.

**Dependencies**:
- `../research/research.md`, the merged DeepSeek V4.1 Flash max and Luna max fast research run, five iterations each, with the orchestrator's verification table.

**Deliverables**:
- One failing-first test per code fix in `.skilled/hooks/session-relaunch/`, the wrapper and the OpenCode plugin.
- Shared nudge, note-state and kill-target helpers in the core, used by every adapter that repeated them.
- `tests/adapter-conformance.test.cjs`, mirrored in the Pi vitest suite.
- Corrected README, command, environment, catalog and packet records.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research found real defects past phase 008. The Claude Stop hook falls back to its `bash -c` shell as the kill target, and it re-arms over live background tasks once a killer has died. A spec-folder value reaches the note frontmatter unchecked, and the nudge prints a placeholder that `prepare` rejects. A spaced `status : open` key is duplicated on update. `consume` drops a valid `none` and reports success for a missing or broken note, so the wrapper launches a claim that cannot succeed and can lose the Gate 3 answer. A symlinked handoffs folder passes containment, an incomplete record is approved, the OpenCode plugin reads notes by two rules, and the Claude window resolver ignores settings above a subdirectory cwd. The docs lag the code in ten places. Five adapters also carry their own copies of the same decisions, which is how several of these drifted.

### Purpose
Every verified finding is fixed with a test that fails without the fix, each shared decision has one owner in the core, and a conformance suite fails when an adapter drifts from the others.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Code: Claude kill target and the background-task guard (A1, B4); spec-folder normalization and the empty field (C1, C2, C3); spaced frontmatter keys (D2); consume note state and the `none` fallback (D3, L3, L2); the symlinked handoffs folder (L1); incomplete records (D1); one note-state rule in the OpenCode plugin (B1); the window resolver walk (E1).
- Architecture: `CLI_COMMAND`, `normalizeSpecFolder`, `specFolderInput`, `seedInstructions` and `nudgeDecision` in `nudge.cjs`; `noteState` and `resolveKillerTarget` in `relaunch-core.cjs`; Claude, Codex, Hermes, Pi and OpenCode moved onto them; the conformance suite.
- Docs: G1 to G7, C3 and L4 from the research table.

### Out of Scope
- The deep-loop projection bug that rejected the Luna lineage. It belongs to system-deep-loop.
- Tightening the killer to direct children only. An in-process runtime started through a shim runs below the loop's direct child, and the killer must still reach it.
- Live relaunch runs. Every fix narrows a path the unit and wrapper tests reach.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | `noteState`, `resolveKillerTarget`, incomplete-record decline, spaced keys |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | Shared nudge helpers, empty spec-folder field, symlink-safe directory mode |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modify | Settings walk up to the repository root |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | Consume note state, broken-note answer, real handoffs directory |
| `.skilled/bin/skilled-loop` | Modify | Relaunch only an open note; decline an incomplete record |
| `claude/`, `codex/shared.mjs`, `hermes/context-nudge.mjs`, `pi/session-relaunch.ts`, `.opencode/plugins/session-relaunch.js` | Modify | Use the shared helpers; Claude kill target and background guard |
| `tests/*.test.cjs`, `tests/adapter-conformance.test.cjs`, `pi/session-relaunch.test.ts`, `.opencode/plugins/tests/session-relaunch.test.cjs` | Create and modify | Failing-first tests and the conformance table |
| Session-relaunch READMEs, `handoff.md`, `ENV-REFERENCE.md`, the feature catalog entry | Modify | Doc drift |
| `../002-pi-opencode-adapters/implementation-summary.md`, `../spec.md`, `../goal.md`, `../research/` | Create and modify | G6 record, nine phases, research artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each verified code finding has a test that fails on the pre-phase sources and passes after the fix. |
| REQ-002 | No adapter sends the model a claim command with a placeholder path, and no adapter writes an unchecked spec folder into a note. |
| REQ-003 | The wrapper never relaunches a claim for a note that is not open. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The decisions every nudge adapter repeated live once in the core, and one conformance table runs through every adapter. |
| REQ-005 | The READMEs, the command, the environment reference, the catalog entry and the packet records describe what the code does. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The pre-phase sources fail the new tests, and the phase sources pass every session-relaunch suite and the Pi suite.
- **SC-002**: Recursive strict validation of the parent prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stricter wrapper stops a hop it used to start | Medium | It stops only for a note the fresh session could not claim, and it prints the manual command |
| Risk | A malformed seed now adds nothing, so the model sees the bare seed | Low | The seed still names the note, and a placeholder claim command could never run |
| Dependency | `CLAUDE_PID` set by Claude Code | Low | Without it the walk to the loop's direct child still finds the runtime |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The nudge reads its state file only once the ratio reaches the threshold, as before.

### Security
- **NFR-S01**: A note reached through a linked handoffs folder is refused, and the nudge never changes the mode of a link target.

### Reliability
- **NFR-R01**: Every arm path leaves the record pending when no process below the loop can be found.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A spec folder with a line break: dropped, and the field prints empty.
- A note whose frontmatter no longer parses: consume still carries a single valid answer for the manual command.

### Error Scenarios
- Consume fails or prints no JSON: the wrapper prints the manual command and exits 1 instead of launching a seed without its Gate 3 answer.
- `CLAUDE_PID` names a process outside the loop: the Stop hook walks to the loop's direct child.

### State Transitions
- An armed record whose killer died while background tasks run: the record stays armed and no killer starts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Four library files, the CLI, the wrapper, five adapters, ten suites and the docs |
| Risk | 9/25 | The wrapper and the kill target change behavior; both narrow it |
| Research | 4/20 | The research run located each defect |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose "Phase 009 incl. architecture" and merge after phase 009.
<!-- /ANCHOR:questions -->

---
