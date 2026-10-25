---
title: "Feature Specification: Phase 1: model-effort-atomic-replay"
description: "A relaunch whose record carries a new model but no effort keeps the effort chosen for the old model. This phase makes model and effort replay as one set in the wrapper and at arm time, with Hermes exempt."
trigger_phrases:
  - "model effort atomic replay"
  - "phase 1 model effort atomic replay"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: model-effort-atomic-replay

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 9 (wave 1) |
| **Predecessor** | None |
| **Successor** | ../002-consume-locked-withdraw/spec.md |
| **Handoff Criteria** | The two failing-first tests (AC-001, AC-004) pass, the four regression guards stay green, the full relaunch suite is green and the live hop logs, control included, sit under `scratch/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Model and effort move as one set on a relaunch specification.

**Scope Boundary**: Model and effort replay in the wrapper live settings block and in `armLocked`. Provider logic, the Cursor reader, the manual command template and consume stay out.

**Dependencies**:
- None. This is wave 1; phases 002, 004 and 003 follow it on the same wrapper path, in the wave order the parent `../spec.md` sets.

**Deliverables**:
- The effort rule in `.skilled/bin/skilled-loop` and in `relaunch-core.cjs`
- Two failing-first tests (AC-001, AC-004), four regression guards (AC-002, AC-003, AC-007, AC-008), a live hop proof per runtime with a no-effort control, and the answer to the Claude `/model` logging question

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The wrapper takes the live model at `.skilled/bin/skilled-loop:789-800` and the live effort separately at `:814-823`. When a consumed record carries a live model but no live effort, `SKILLED_LOOP_EFFORT` keeps the launch value, so the relaunch starts on the new model with the effort chosen for the old one. The arm path in `relaunch-core.cjs` (`armLocked`, merge at `:806-816`) merges key by key, so an arm with a new model and no effort also keeps the effort recorded for the old model. A stale effort can break a launch: `gpt-6-luna` returns HTTP 400 for effort `minimal` on Codex. This is the defect this phase fixes, in the wrapper and at arm time.

The case that prompted the work, a Claude session launched as Sonnet low and switched to Opus medium, already relaunches as Opus medium today. Every main-chain assistant entry in a current Claude transcript carries `effort` beside `requestedModel`, the wrapper takes a live effort when one is present (`skilled-loop:814-823`), and the session running `prepare` is mid-turn, so an assistant entry after the switch always exists. That case stays as a regression guard (AC-002) and as the live proof (AC-005), not as the defect.

Two inputs bound the rule. `SKILLED_LOOP_MODEL` is unset at first launch (`skilled-loop:473`), so a launch with no `--model` flag has an empty launch model, and after each hop line 793 overwrites it with the live model. An empty launch model therefore proves no switch. Hermes always records a live model (`hermes/session-end-arm.mjs:104-107`) but never an effort (session-relaunch README line 42: effort comes only from the launch flag), so a rule that drops the effort whenever the model changes without one would drop `--reasoning` on every Hermes hop.

Claude's live values come from `readClaudeSettings` (`context-usage.cjs:153-173`), which reads the last main-chain assistant entry, so a `/model` or `/effort` switch with no later assistant turn is invisible to it.

### Purpose
A relaunched session starts on an effort taken from the same entry as its model, or on the runtime default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The live settings block in `.skilled/bin/skilled-loop` (about lines 785-830)
- The settings merge in `armLocked` in `relaunch-core.cjs` (about lines 800-820)
- Tests in `skilled-loop.test.cjs` and `relaunch-core.test.cjs`
- The replay lines in the session-relaunch README (lines 37-45)
- The investigation of whether Claude Code logs a `/model` or `/effort` switch before the next turn

### Out of Scope
- The Pi and Hermes provider block at `skilled-loop:801-812` - it already moves provider with model
- The Cursor reader - a separate reader with its own behavior
- The manual command template - phase 003 owns it
- Consume - phase 002 owns it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | One function holds the effort rule: drop the launch effort when a non-empty launch model differs from the live model and no live effort comes with it; Hermes exempt |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | An arm with a new model and no effort removes the recorded effort |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modify | The AC-001 table across Claude, Codex and Pi, plus the AC-002, AC-003, AC-007 and AC-008 guards |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | One arm test |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Replay rule and, if found, the Claude switch limit |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modify (conditional) | Only if Claude logs a switch entry before the next turn |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | When `SKILLED_LOOP_MODEL` was non-empty before the live override and the accepted live model differs from it, the relaunch effort is the live effort or none, on every runtime except Hermes. |
| REQ-002 | When the live model equals the launch model and no live effort exists, the launch effort stands. |
| REQ-003 | An arm with a new model and no effort leaves the record with no `effort` field. |
| REQ-004 | Claude, Codex and Pi each render the chosen effort in their own flag, or none. |
| REQ-007 | When `SKILLED_LOOP_MODEL` was empty before the live override, the launch effort stands, because an empty launch model proves no switch. |
| REQ-008 | Hermes is exempt from REQ-001: a Hermes hop with a live model and no live effort keeps the launch `--reasoning` value. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The provider block is unchanged; existing provider tests pass unedited. |
| REQ-006 | The Claude `/model` and `/effort` logging question is answered with transcript evidence. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The AC-001 and AC-004 tests fail on the code before the change and pass after it. The AC-002, AC-003, AC-007 and AC-008 tests are regression guards: they pass before the change and after it.
- **SC-002**: Live hops on Claude, Codex and Pi show the receiver on the switched model with the matching effort flag, and a control record with its effort field removed relaunches with no effort flag.

### Acceptance Scenarios

- **AC-001** **Given** a launch with a non-empty model and effort `low` and a consumed record with a different model and no effort, **When** the wrapper relaunches, **Then** the arguments carry the new model and no effort flag, in a table test with one row each for Claude (`claude-sonnet-5-5` to `claude-opus-5-5`, no `--effort`), Codex (no `-c model_reasoning_effort`) and Pi (no `--thinking`). Verify: new table test in `skilled-loop.test.cjs`, red before, green after.
- **AC-002** **Given** the same launch and a record with the new model and effort `medium`, **When** it relaunches, **Then** Claude gets `--effort medium`, Codex `-c model_reasoning_effort="medium"` and Pi `--thinking medium`. Verify: table guard across the three runtimes, green before and after.
- **AC-003** **Given** a record with live model equal to the launch model and no live effort, **When** it relaunches, **Then** the launch effort stands. Verify: guard test, green before and after.
- **AC-004** **Given** an armed record with model A and effort high, **When** `armLocked` runs with settings `{ model: B }`, **Then** the written record has model B and no effort. Verify: `relaunch-core.test.cjs` test, red before, green after.
- **AC-005** **Given** a live Claude session launched through the wrapper as Sonnet low and switched to Opus medium, **When** it hops, **Then** the receiver process arguments show the Opus model and `--effort medium`, and a control hop whose record had its `effort` field removed relaunches on Opus with no `--effort`. Verify: harness run, receiver args and `relaunch.log` hop line for both hops saved under `scratch/`. Codex (`gpt-6-luna`) and Pi (`openai/gpt-6-luna`) hops recorded the same way.
- **AC-006** **Given** a `/model` or `/effort` switch with no later assistant turn, **When** the transcript tail is read, **Then** the finding (entry and reader change, or documented limit) is in the implementation summary. Verify: quoted transcript lines.
- **AC-007** **Given** a launch with no `--model` flag and `--effort low`, and a consumed record with a live model and no effort, **When** the wrapper relaunches, **Then** the arguments carry the live model and the launch effort `low`. Verify: guard test in `skilled-loop.test.cjs`, green before and after.
- **AC-008** **Given** a Hermes launch with a model and `--reasoning high`, and a consumed record with a different live model and no effort, **When** the wrapper relaunches, **Then** the arguments carry the live model and `--reasoning high`. Verify: guard test in `skilled-loop.test.cjs`, green before and after.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live Claude, Codex and Pi CLIs for AC-005 | The live proof cannot run | Record the blocker; the unit tests still gate the logic |
| Risk | The Claude switch may not reach the transcript before exit | Med | The investigation item decides; the live proof may need a turn after the switch |
| Risk | Codex rejects some efforts per model | Med | Dropping the flag is the safe fallback |
| Risk | Phases 002 to 004 rebase on this change | Low | Keep the diff small and inside the live settings block |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The change adds no new file reads or processes to the relaunch path.
- **NFR-P02**: The relaunch suite runtime stays within its current range.

### Security
- **NFR-S01**: A live effort still passes `effort_is_valid` before it reaches an argument list.
- **NFR-S02**: Record writes stay atomic through `atomicWriteFile`.

### Reliability
- **NFR-R01**: A rejected or missing effort leads to a launch with no effort flag, never a failed launch.
- **NFR-R02**: Existing provider tests pass unedited.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty live model: the launch model and launch effort stand.
- Empty launch model (no `--model` at first launch): no switch is proven, so the launch effort stands.
- Hermes with a live model and no effort: the launch `--reasoning` value stands.
- Live model equal to the launch model with no effort: the launch effort stands.
- Invalid live effort with a changed model: the warning prints and no effort flag is passed.

### Error Scenarios
- Invalid live model: the launch model stays, so the launch effort may stand.
- Codex rejects an effort for a model: dropping the flag avoids the HTTP 400.
- Two arms in a row: each arm applies the rule against the record it reads under the lock.

### State Transitions
- Arm with the same model and no effort: the recorded effort stays.
- Switch with no later assistant turn: invisible to `readClaudeSettings` unless the investigation finds an entry.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two code files, two test files, one README, under 100 LOC |
| Risk | 10/25 | Relaunch arguments on three runtimes |
| Research | 8/20 | One live transcript investigation |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does Claude Code write a session JSONL entry when `/model` or `/effort` switches before the next assistant turn? The investigation item answers it.
<!-- /ANCHOR:questions -->

---


