---
title: "Feature Specification: Phase 52: duplicate-hop-title-numbers"
description: "A relaunched session's name could gain a second number instead of having its number replaced, so the operator saw a session titled ENGINE LIMITS (2) (4). The wrapper removed a trailing number only when it equalled the number its hop count predicted for the sender, and a wrapper started from a looped shell inherited that shell's hop count, so numbers both stacked and skipped."
trigger_phrases:
  - "duplicate hop title numbers"
  - "phase 52 duplicate hop title numbers"
  - "stacked hop number in session name"
  - "name_stem hop suffix"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 52: duplicate-hop-title-numbers

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/438-duplicate-hop-title-numbers` |
| **Parent Spec** | ../spec.md |
| **Phase** | 52 of 52 |
| **Predecessor** | 051-handover-doc-alignment-3 |
| **Successor** | None |
| **Handoff Criteria** | Every receiver of a named loop carries one hop number, a fresh wrapper starts at hop 0, and the hand-over suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 52** of the session handover loop. It fixes relaunched session names that gain a second number instead of having the first one replaced, and hop numbers that skip.

**Scope Boundary**: The name stem the wrapper computes before it numbers a hop, the hop count a fresh wrapper starts from, the wrapper tests that cover both and the two hand-over docs that describe them. The runtimes' own title behaviour stays as it is.

**Dependencies**:
- The live-name carry the wrapper already has: `prepare` records the sender's live name and `consume` prints it.

**Deliverables**:
- A `name_stem` in `.skilled/bin/skilled-loop` that strips every trailing ` (<digits>)`.
- A fresh wrapper that clears an inherited `SKILLED_LOOP_HOPS` with the other loop variables.
- Wrapper tests for both, and `runtime-behavior.md` and the README stating the new rules.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After several hops the operator saw a session titled `ENGINE LIMITS (2) (4)`. The wrapper names each receiver `<stem> (<hops + 1>)` and stripped a trailing number from the sender's name only when it equalled the number the hop count predicted for the sender, so any other number stayed and the receiver's number landed beside it. A wrapper started from a looped session's shell also inherited that loop's `SKILLED_LOOP_HOPS`, so its first receiver was numbered from the outer count.

### Purpose
Every receiver of a named loop carries exactly one hop number, counted from 0 for each fresh wrapper.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
A fresh loop started as `skilled-loop claude -n "ENGINE LIMITS" go`, hop counter 0, driven through three hops by the test harness stub. Each stub session reports the name it was launched with, except that the third session reports the name of the session before it. Old code:

```text
session 1: hops=0 launched as "ENGINE LIMITS" (-n)
session 2: hops=1 launched as "ENGINE LIMITS (2)"
session 3: hops=2 launched as "ENGINE LIMITS (3)"
session 4: hops=3 launched as "ENGINE LIMITS (2) (4)"
```

On the same old code, a loop launched as `-n "ENGINE LIMITS (2)"` named its receivers `ENGINE LIMITS (2) (2)`, `(2) (3)` and `(2) (4)`. A wrapper launched with that name and `SKILLED_LOOP_HOPS=2` in its environment named its first receiver `ENGINE LIMITS (2) (4)`, skipping 3, and one started with `SKILLED_LOOP_HOPS=10` did not relaunch at all because the hop cap of 10 was already reached.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `name_stem` strip every trailing ` (<digits>)` from a name, on the hop path and the manual claim path.
- Clear `SKILLED_LOOP_HOPS` at a fresh launch with the other loop variables, so the count starts at 0.
- Change the test that kept `Phase (7) (2)`, rewrite the tests that injected a hop count, and add tests for both rules.
- State both rules in `runtime-behavior.md` and the README.

### Out of Scope
- Why a real sender's live name lagged a hop - the operator's hop records live in the primary checkout, which this phase did not read.
- The `SKILLED_LOOP_HOPS` integer check after the reset - it no longer fires but is harmless, so it stays.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | `name_stem` strips every trailing number, and the launch reset clears `SKILLED_LOOP_HOPS` |
| `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modify | Name and hop-count tests for the new rules |
| `.skilled/hooks/session-handover/runtime-behavior.md` | Modify | States the strip rule for Claude and Pi |
| `.skilled/hooks/session-handover/README.md` | Modify | States that a fresh wrapper ignores an inherited hop count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A hop whose sender name carries any trailing number launches the receiver with only the receiver's number | Test `a hop replaces a number on the sender name that the hop count does not predict` gives `ENGINE LIMITS (4)` and fails on the old code with `ENGINE LIMITS (2) (4)` |
| REQ-002 | A numbered launch name is never numbered twice | Test `a numbered launch name is numbered by the hop, never twice` gives `ENGINE LIMITS (2)` then `(3)` and fails on the old code with `(2) (2)` |
| REQ-003 | A fresh wrapper starts its hop count at 0 | Test `a fresh launch starts the hop count at 0 whatever its shell carries` with `SKILLED_LOOP_HOPS=10` gives `X (2)` and fails on the old code, which did not relaunch |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Text in brackets that is not all digits stays in the name | Test `text in brackets that is not a number stays part of the name` gives `Fix (auth) (2)` |
| REQ-005 | The manual claim command carries the bare stem | Test `the manual command drops a number on the sender name` passes |
| REQ-006 | No hand-over suite regresses | The node suite and the hooks vitest config pass in full |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three-hop reproduction above names session 4 `ENGINE LIMITS (4)`.
- **SC-002**: The node suite prints `pass 1051` and `fail 0`, and vitest prints `509 passed`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The sender's live name from `prepare` | Without it the stem comes from `SKILLED_LOOP_NAME`, which goes through the same strip | None needed |
| Risk | A name whose own text ends in a bracketed number, such as `Phase (7)`, loses that number on the first hop | Low | The operator chose never-stack over keeping such numbers; text that is not all digits is kept |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What made the real sender's live name show an earlier session's number? UNKNOWN. The operator's hop records and relaunch log for that loop would show which name each `prepare` recorded. The fix holds either way.
<!-- /ANCHOR:questions -->

---
