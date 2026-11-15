---
title: "Feature Specification: Phase 3: manual-claim-live-settings"
description: "The manual claim command the wrapper prints after a consume replays a template built from the first launch, so it drops the sender's live model and effort."
trigger_phrases:
  - "manual claim live settings"
  - "phase 3 manual claim live settings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: manual-claim-live-settings

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 9 (wave 4, after 004) |
| **Predecessor** | ../002-consume-locked-withdraw/spec.md |
| **Successor** | ../004-manual-claim-goal-binding/spec.md |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and the hook suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the research remediation packet. It makes the printed manual claim command carry the live model and effort. The build order is the wave order in `../spec.md`, so this phase is built last of the wrapper phases, after 004 is Complete.

**Scope Boundary**: The wrapper's post-consume manual command prints in `.skilled/bin/skilled-loop` and their tests. The live reader, the relaunch argument path and goal export stay out.

**Dependencies**:
- Phase 001 effort rule for live values
- Phase 004 Complete, since both touch the manual command

**Deliverables**:
- A manual template rebuilt and re-exported after each hop's live settings, so the wrapper's prints and the in-session hop-cap command both start from the current hop's settings
- A per-print rebuild for the early-exit prints that run before the live values are read
- Three failing-first wrapper tests that pass after the change, plus one regression guard

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The printed manual claim command replays a template built once, before the loop starts: `SKILLED_LOOP_MANUAL_TEMPLATE=$(build_manual_command_template)` at `.skilled/bin/skilled-loop:637`, built from the first launch arguments (`build_manual_command_template` at `:402-420`, printed by `print_manual_command` at `:42-70`). A manual claim therefore starts on the first launch's model and effort even when the consumed record holds the sender's live ones. Cursor never arms (`.skilled/hooks/session-relaunch/README.md:193`), so its live reader `cursorSelectedModel` (`relaunch-core.cjs:585-603`) only helps if the manual command uses the record's values.

### Purpose
A manual claim printed after a consume starts the receiver on the sender's live model and effort, and prints exactly what it prints today when the record holds none.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rebuild the manual template from the consumed live model and effort before each `print_manual_command` call that follows `consume_record`
- After each hop's live settings block, rebuild the template from the current settings and re-export `SKILLED_LOOP_MANUAL_TEMPLATE`, so the in-session hop-cap command (`session-relaunch.cjs:516`) is current
- Apply `model_is_valid` and the phase 001 effort rule to the live values, and run `find_manual_template_conflict` on the rebuilt template
- Tests in `skilled-loop.test.cjs`, and for Cursor in `session-relaunch-cli.test.cjs`

### Out of Scope
- The live reader `cursorSelectedModel` - it already returns the value; this phase only consumes it
- The relaunch argument path - phase 001 owns it
- Goal export in the manual command - phase 004 owns it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | Rebuild the template from live values before post-consume manual prints, and re-export it after each hop's live settings |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modify | Add the three failing-first tests |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | Cursor reader coverage near lines 2368-2419, if the Cursor test needs it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A manual command printed after consume carries the consumed live model when it passes `model_is_valid`. |
| REQ-002 | It carries the effort chosen by the phase 001 rule, in the runtime's own flag. |
| REQ-003 | With no live values it prints exactly what it prints today. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A Cursor record's live model from `cursorSelectedModel` reaches the printed command. |
| REQ-005 | The template conflict warning still fires for a carried value that holds the placeholder. |
| REQ-006 | After a hop that switched model, a later manual command with no live values carries the current hop's model, in the wrapper's print and in the exported template the session's hop-cap command reads. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three new wrapper tests (AC-001, AC-002, AC-005) fail before the change and pass after it; the AC-004 regression guard passes before and after.
- **SC-002**: The existing manual command tests pass unedited.

### Acceptance Scenarios

- **Given** a Claude launch on Sonnet low and a consumed record with Opus medium on a declined hop, **When** the manual command prints, **Then** it holds the Opus model and `--effort medium` and not Sonnet (AC-001).
- **Given** a Cursor run whose record holds a live model, **When** the manual command prints, **Then** it holds `--model <that model>` (AC-002).
- **Given** a record with no live values, **When** the manual command prints, **Then** it equals the pre-change output (AC-003).
- **Given** a live model that fails the model check, **When** the command prints, **Then** it keeps the launch model (AC-004).
- **Given** a Sonnet launch whose first hop switched to Opus, **When** a later hop declines with no live values, **Then** the manual command holds Opus, not Sonnet (AC-005).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 effort rule | Effort choice undefined | Build after 001 and reuse its rule |
| Risk | The exported template is also read by the CLI's hop-cap print | Med | Re-export it after each hop's live settings so that print is current, never leave the startup value in place |
| Risk | `build_manual_command_template` resets the global `launch_arguments` through `build_relaunch_arguments` | Med | Run every rebuild in a command substitution, and on the hop path before `:829`, which rebuilds `launch_arguments` anyway |
| Risk | Shell quoting of rebuilt arguments | Med | Use the existing `shell_quote_argument` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rebuild adds no extra node process beyond the one `print_manual_command` already runs.

### Security
- **NFR-S01**: A live value reaches the command only after `model_is_valid` or the effort check accepts it.
- **NFR-S02**: Every rebuilt argument is quoted with `shell_quote_argument`.

### Reliability
- **NFR-R01**: A record with no live values yields byte-identical output to today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No live model or effort: the current hop's template is used unchanged, which on the first hop is the startup template.
- Live model fails `model_is_valid`: the launch model stays.
- Live value holds the handoff placeholder: the conflict warning fires and the plain command prints.

### Error Scenarios
- Consume fails and `consumed_record_json` is empty: no live values, startup template.
- Live effort the runtime does not accept: no effort flag, per the phase 001 rule.

### State Transitions
- Interrupted relaunch printing for the relaunched note: uses the values of that hop's consumed record.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One wrapper script and two test files |
| Risk | 10/25 | Shell quoting and printed command output |
| Research | 4/20 | Code paths already mapped |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. The early-exit prints at `:711`, `:717`, `:726` and `:746` run before the live values are read at `:789`, so the helper reads them per print rather than relying on that later block.
<!-- /ANCHOR:questions -->

---


