---
title: "Feature Specification: Phase 4: claude-start-claim"
description: "Deliver the Claude start claim when the wrapper swapped the start prompt, even with the Claude relaunch switch off, while the master and concern kill switches still silence the hook."
trigger_phrases:
  - "claude start claim"
  - "phase 4 claude start claim"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: claude-start-claim

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
| **Phase** | 4 of 7 |
| **Predecessor** | 003-goal-resolver-prepare |
| **Successor** | 005-opencode-continuation-hop |
| **Handoff Criteria** | Phase 004 is Complete, every acceptance row is Met, and `validate.sh 004-claude-start-claim --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Goals and running workflows survive a session hop on every runtime specification.

**Scope Boundary**: Only the Claude startup claim path in `compact-pointer.mjs` and its tests. No wrapper change, no README change and no other runtime.

**Dependencies**:
- Phase 003 completes first.
- The shared hook flag resolver reports which switch decided.
- The existing `claude-adapters.test.cjs` sandbox and start-claim helpers.

**Deliverables**:
- The startup claim decision that survives the Claude enable switch being off.
- A test that fails before the change and passes after it.
- The existing claim guards still passing.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Claude start hook returns before it reads a startup payload when the Claude relaunch switch is off (`SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`). The wrapper has already replaced the start prompt with `/goal <slice>` and exported `SKILLED_LOOP_CLAIM_SEED`, so a manual cross-runtime claim started with `claude` begins on the goal and never claims the note. The hand-over is lost with no message.

### Purpose
With the Claude relaunch switch off, a startup that carries the wrapper's claim seed still delivers the claim, and the master and concern kill switches still keep the hook silent.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
X7 measurement, 2026-11-12, Claude start hook with a startup payload:
SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0 -> exit 0, empty stdout
SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=1 -> exit 0, 1,477 characters on stdout, starting with the goal-start lead
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deliver the startup claim when the Claude enable switch is off, the seed is set and the payload source is `startup`.
- Keep the master switch and the concern kill switch ahead of the claim path.
- Add a test that fails before the change and passes after it.
- Keep every existing claim guard unchanged.

### Out of Scope
- `.skilled/hooks/session-relaunch/README.md` line 179 - phase 007 owns the documentation update.
- The prompt swap in `skilled-loop` - the finding rejects a wrapper guard because it loses the native goal.
- The cleared Claude goal, the shared goal off switch and the resend reminder - decision D4 rules them out.
- The relaunch record format and any new module - decision D3 keeps both unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Modify | Let the startup claim branch run when only the Claude enable switch is off, while the master and concern kill switches still return early. |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | Add the concern-off start-claim test and keep the existing claim guards. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The new test `compact-pointer delivers the start claim with the Claude enable switch off` in `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` proves that with `SYSTEM_SESSION_RELAUNCH_ENABLED=1`, `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`, a valid `SKILLED_LOOP_CLAIM_SEED` and a `startup` payload, `compact-pointer.mjs` exits 0 and writes a SessionStart `additionalContext` that holds the seed, the claim command for the note and the `/speckit:resume` line, and it logs `goal-start-claim`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The existing claim tests in `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` keep their behavior: no seed, a source other than `startup`, a bad seed, `AI_SESSION_CHILD=1`, `SESSION_RELAUNCH_GOAL=0`, `SYSTEM_SESSION_RELAUNCH_DISABLED=1` and a runtime started from the loop session shell all exit 0 with empty stdout, and the existing start-claim case still delivers its claim. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test --test-name-pattern 'Claude enable switch off' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0, and the same test failed before the source change.
- **SC-002**: `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- **SC-003**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared hook flag resolver | It must name the switch that decided so the runtime switch can be told apart from a kill switch | Read the decision reason, or compare the runtime flag while the master and kill checks stay first |
| Dependency | Phase 003 handoff | Phase 004 cannot start until 003 is Complete | Wait for 003 to pass strict validation and every acceptance row |
| Risk | The claim widens past the intended case and ignores a kill switch | High | Keep the guard test with `SYSTEM_SESSION_RELAUNCH_DISABLED=1` and run the whole `compact-pointer` suite |
| Risk | The new test passes for the wrong reason | Medium | Assert the exact seed, claim command, resume line and log event, as the existing start-claim test does |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: the change moves one branch in a hook that runs once per session start.
- **NFR-P02**: N/A: no added per-turn work.

### Security
- **NFR-S01**: N/A: the hook reads no credential.
- **NFR-S02**: N/A: the hook stores no data.

### Reliability
- **NFR-R01**: N/A: the hook runs no service.
- **NFR-R02**: N/A: the hook serves no request path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: empty stdin or a payload that is not an object exits 0 with empty stdout, as it does today.
- Maximum input: N/A: the change adds no size limit and copies the seed the wrapper built.
- Failure path: `SYSTEM_SESSION_RELAUNCH_DISABLED=1` or `SYSTEM_HOOKS_DISABLED=1` exits 0 with empty stdout even when the seed is set.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two files, one branch decision in one adapter |
| Risk | 8/25 | Kill-switch precedence and a silent lost hand-over |
| Research | 6/20 | The finding is verified and the failing path is reproduced |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
