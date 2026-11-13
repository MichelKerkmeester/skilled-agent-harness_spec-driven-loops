---
title: "Feature Specification: Phase 7: goal-handover-docs"
description: "Four statements in the relaunch README and one missing flag row in the hook example still describe the behaviour from before phases 003 and 004, so an operator reads a rule the code no longer follows."
trigger_phrases:
  - "goal handover docs"
  - "phase 7 goal handover docs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: goal-handover-docs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/358-handover-goal-resume` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-skilled-loop-command |
| **Successor** | None |
| **Handoff Criteria** | Phase 007 is Complete, every acceptance row is Met, and `validate.sh 007-goal-handover-docs --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Goals and running workflows survive a session hop on every runtime specification.

**Scope Boundary**: Four statements in `.skilled/hooks/session-relaunch/README.md` and one flag row in `.skilled/hooks/hook-flags.env.example`. No source file, no test file and no command file. No other section of either document.

**Dependencies**:
- Phases 003 and 004 are Complete, because this phase documents what they shipped.
- The four guard suites in `REQ-005` pass before the first edit.
- The phase brief in `scratch/finding.md` holds the shipped behaviour.

**Deliverables**:
- The start-claim sentence that says the claim arrives with the Claude enable switch off.
- One commented `SESSION_RELAUNCH_GOAL=0` row in the example flags.
- A known-race statement for a Claude goal continuation during the arm.
- One statement that explains why a phase child differs between Claude and the record runtimes.
- A guard run that shows the four shipped behaviours did not change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The relaunch README still says the Claude start claim arrives only while the switch is on, which hides the shipped fix in phase 004. It also omits the Claude goal-continuation race and the phase-child goal difference, and `hook-flags.env.example` has no `SESSION_RELAUNCH_GOAL` row, so a copied flag file cannot turn the goal carry-over off.

### Purpose
An operator who reads the two documents learns what the relaunch and goal layers do now, in the four places where the shipped behaviour and the prose disagree.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
for p in 'SESSION_RELAUNCH_GOAL' 'only while the switch is on' 'phase child' 'known race'; do printf '%-28s hook-flags=%s readme=%s\n' "$p" "$(rg -c "$p" .skilled/hooks/hook-flags.env.example || echo 0)" "$(rg -c "$p" .skilled/hooks/session-relaunch/README.md || echo 0)"; done
SESSION_RELAUNCH_GOAL        hook-flags=0 readme=8
only while the switch is on  hook-flags=0 readme=1
phase child                  hook-flags=0 readme=0
known race                   hook-flags=0 readme=0

node .skilled/hooks/goal/bin/goal.cjs packet specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/007-goal-handover-docs | rg '^packet_budget='
packet_budget=unknown
```

The example file holds no goal switch. The README states the old switch rule once, states the phase-child case zero times and states the race zero times. This packet is a phase child, so its goal command reports `packet_budget=unknown`, not `ok` and not `over`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the start-claim sentence in `README.md` so it says the claim arrives with the Claude enable switch off, and name the guards that still silence it.
- Add one commented `SESSION_RELAUNCH_GOAL=0` row to `hook-flags.env.example`, in a block that says the switch is on by default.
- Add a known-race statement to `README.md` §3 for a Claude goal continuation during the arm.
- Add one statement to `README.md` that explains why Claude refuses a phase-child goal and Pi and OpenCode bind it.
- Keep the four guard suites passing with no assertion change.

### Out of Scope
- `.skilled/commands/speckit/handoff.md` line 127 - phase 001 owns that half of the documentation drift.
- Any source, test or command file - the work package names no test, and this phase records what shipped.
- The cleared Claude goal, the shared goal off switch and the resend reminder - decision D4 rules them out.
- The relaunch record format and a new module - decision D3 keeps both unchanged.
- The rest of `README.md` and the rest of `hook-flags.env.example` - scope lock.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/README.md` | Modify | Fix the start-claim sentence, add the known race in §3 and add the phase-child statement. |
| `.skilled/hooks/hook-flags.env.example` | Modify | Add the commented `SESSION_RELAUNCH_GOAL` row and its block note. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `README.md` §3 `### Goal In A Claude Receiver` says the startup claim is delivered when the concern is on and the Claude enable switch holds `0`, because the wrapper already replaced the start prompt. The same sentence names the master switch, the concern kill switch, `SESSION_RELAUNCH_GOAL=0`, `AI_SESSION_CHILD=1` and a runtime started from the loop session's shell as the cases that stay silent. Test `compact-pointer delivers the start claim with the Claude enable switch off` in `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` asserts the delivery, and test `compact-pointer adds no start claim for a dispatched child, a switched-off goal or a disabled hook` asserts the guards. |
| REQ-002 | `hook-flags.env.example` holds one commented `SESSION_RELAUNCH_GOAL=0` row in its own session-relaunch goal block. The block says the switch is on by default and `0` turns the carry-over off, so the row cannot be read as a disable flag. Test `goalSwitchOn is on unless the operator turns it off` in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` asserts that unset, `1`, `true`, `yes` and `on` are on and `0`, `false`, `no` and `off` are off. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `README.md` §3 records the Claude goal-continuation race. It says no `UserPromptSubmit` fires for the continuation, the killer's 3 s idle wait usually lands in the continuation's first API call and the hop proceeds, the hop is lost with `killer-timeout` only when writes stay under 3 s apart for 30 s, a continuation tool call longer than 3 s can be killed mid-run and that work is not in the note, and a disarmed record does not arm again. Test `killer times out on an active transcript, unarms and releases its lock` in `.skilled/hooks/session-relaunch/tests/killer.test.cjs` asserts the timeout path. |
| REQ-004 | `README.md` carries one paragraph that begins `A phase child` and states why a phase-child goal differs. A phase child carries no slice budget, so the goal command reports `packet_budget=unknown`. Claude sets its goal only from a slice whose budget is `ok`, so a Claude receiver keeps the claim seed and sets no goal. Pi and OpenCode bind the packet itself and do bind a phase-child goal. Test `a phase child goal carries no budget, matching the validator` in `.skilled/hooks/goal/lib/goal-slice.test.cjs` and test `refuses a slice whose budget cannot be checked` in `.skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` assert the two sides. |
| REQ-005 | The guards keep passing with no assertion change. `node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`, `node --test .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs`, `node --test .skilled/hooks/session-relaunch/tests/killer.test.cjs` and `node --test .skilled/hooks/goal/lib/goal-slice.test.cjs` each exit 0. Test `compact-pointer delivers the claim at the start of a goal-command receiver` still asserts the seed, the claim command and the resume line, and test `killer signals an idle target and releases its lock` still asserts the 3 s idle path. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n 'only while the switch is on' .skilled/hooks/session-relaunch/README.md` prints no line, and `rg -n 'even while the Claude enable switch is off' .skilled/hooks/session-relaunch/README.md` prints one line.
- **SC-002**: `rg -n 'SESSION_RELAUNCH_GOAL=0' .skilled/hooks/hook-flags.env.example` prints one line.
- **SC-003**: `rg -n 'Known Race: A Claude Goal Continuation' .skilled/hooks/session-relaunch/README.md` prints one line.
- **SC-004**: `rg -n '^A phase child' .skilled/hooks/session-relaunch/README.md` prints one line, and the packet's own goal command prints `packet_budget=unknown`.
- **SC-005**: The four guard suites in `REQ-005` exit 0 and `validate.sh 007-goal-handover-docs --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 and phase 004 Complete | The documents would describe a behaviour that is not in the tree | Wait for both acceptance documents to read `Closeable: Yes` |
| Dependency | The four guard suites | A statement would have no test behind it | Run each suite before the first edit and after the last |
| Risk | A sentence describes the plan rather than the shipped code | High | Every statement names the test that pins it, and the test runs in `REQ-005` |
| Risk | A new line promises a fix that decision D4 rules out | Medium | Check the D4 list in the scope section before the phase closes |
| Risk | The docs phase is read as permission to change code | High | The scope names two files, and `git diff` over the code and test paths prints no line |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: the change adds prose to two files and runs no service.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: neither document holds a credential.
- **NFR-S02**: N/A: neither document stores data.

### Reliability
- **NFR-R01**: N/A: no runtime behaviour changes.
- **NFR-R02**: N/A: no request path changes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: N/A: neither document parses input.
- Maximum input: a phase-child goal over 4,000 characters still reports `packet_budget=unknown`, so the statement must name the missing budget, never the length.
- Failure path: a sentence and a guard test disagree. The test wins and the sentence changes before the phase closes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Two documents, four statements and one flag row |
| Risk | 4/25 | Operator-facing prose only, with no code path changed |
| Research | 4/20 | The finding is verified and the four guard tests are named |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
