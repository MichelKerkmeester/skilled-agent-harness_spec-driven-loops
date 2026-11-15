---
title: "Feature Specification: Phase 5: subagent-guard-cancel-consume"
description: "A Claude sub-agent shares its parent's session id, yet the sub-agent guard denies only claim, complete, keep and prepare. This phase adds cancel and consume to the denial pattern so a sub-agent cannot withdraw or take the parent's prepared hand-over."
trigger_phrases:
  - "subagent guard cancel consume"
  - "phase 5 subagent guard cancel consume"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: subagent-guard-cancel-consume

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
| **Branch** | `worktrees/351-session-relaunch-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-claude-window-unknown |
| **Successor** | 006-append-lock-stale-reclaim |
| **Handoff Criteria** | `node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with a denied `cancel` case and a denied `consume` case. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Remediate the eight findings of the in-session handover review of the session relaunch loop specification.

**Scope Boundary**: One regular expression in `subagent-guard.mjs` and its test. No other hook changes.

**Dependencies**:
- None.

**Deliverables**:
- The two added commands and two test cases that fail today.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Claude sub-agent guard builds `LIFECYCLE_COMMAND` at `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:18` from four subcommands only: `claim`, `complete`, `keep` and `prepare`. A sub-agent shares its parent's session id, so a sub-agent that runs `session-relaunch.cjs cancel` withdraws the parent's prepared hand-over, and one that runs `consume` takes the parent's relaunch record.

### Purpose
Deny `cancel` and `consume` to a sub-agent alongside the four commands the guard already denies, so only the parent session can withdraw or consume its own hand-over.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n 'LIFECYCLE_COMMAND' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs
18:const LIFECYCLE_COMMAND = /session-relaunch\.cjs['"]?\s+(claim|complete|keep|prepare)\b/;
55:  return LIFECYCLE_COMMAND.test(command);
```

Line 18 lists `claim`, `complete`, `keep` and `prepare` and omits `cancel` and `consume`. `deniesRelaunchCommand` starts at line 45 and returns `LIFECYCLE_COMMAND.test(command)` at line 55.
<!-- /ANCHOR:measured-behavior -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `cancel` to the subcommand alternation in `LIFECYCLE_COMMAND`.
- Add `consume` to the subcommand alternation in `LIFECYCLE_COMMAND`.
- Add a denied `cancel` case to the guard test file.
- Add a denied `consume` case to the guard test file.

### Out of Scope
- The denial wording and the envelope shape, because finding 5 changes only the command list.
- Other hooks and the relaunch CLI, because finding 5 names one guard and its test.
- The `history` read path, because it reads the hop history and does not act on the hand-over note.
- The README guard paragraph, because the review finding names only the guard and its test.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/session-relaunch/claude/subagent-guard.mjs | Modify | Add `cancel` and `consume` to `LIFECYCLE_COMMAND` |
| .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs | Modify | Add a denied `cancel` case and a denied `consume` case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A sub-agent Bash call that runs `session-relaunch.cjs cancel` receives a `PreToolUse` deny. Verify: `node --test --test-name-pattern 'denies cancel' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0. |
| REQ-002 | A sub-agent Bash call that runs `session-relaunch.cjs consume` receives a `PreToolUse` deny. Verify: `node --test --test-name-pattern 'denies consume' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The guard suite exits 0 with the four existing denied commands and the two new ones. Verify: `node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0. |
| REQ-004 | The existing silent cases stay silent, including `history`, an unrelated Bash command, a main-session call and a non-Bash call. Verify: `node --test --test-name-pattern 'stays silent' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0. |
| REQ-005 | The guard denies `hand-over` to a sub-agent, because that command writes a hop-history line and fires a notice for the parent's open note and only the wrapper calls it. Verify: `node --test --test-name-pattern 'denies hand-over' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test --test-name-pattern 'denies cancel' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 and the sub-agent receives a deny envelope.
- **SC-002**: `node --test --test-name-pattern 'denies consume' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 and the sub-agent receives a deny envelope.
- **SC-003**: `node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with no failing case.
- **SC-004**: `rg -n 'LIFECYCLE_COMMAND' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints line 18 with `(claim|complete|keep|prepare|cancel|consume)`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `node` with the built-in test runner | The proof commands cannot run | Run the named test file with the repository Node binary |
| Risk | The widened alternation denies a harmless command that mentions a lifecycle subcommand | Med | Keep the `session-relaunch.cjs` prefix and the `\b` boundary, and keep the silent cases in the suite |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: The change adds two alternatives to one regular expression and runs no service or request path.
- **NFR-P02**: N/A: No throughput target applies to a local `PreToolUse` hook.

### Security
- **NFR-S01**: N/A: The change reads no credential and adds no authentication path.
- **NFR-S02**: N/A: No data store or transport changes.

### Reliability
- **NFR-R01**: N/A: No uptime target applies to a local hook.
- **NFR-R02**: N/A: The guard still exits 0 on every path, proven by the guard suite.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: An empty command, a payload with no `agent_id` or a whitespace-only `agent_id` stays silent and exits 0.
- Maximum input: A long command line that mentions several lifecycle subcommands is denied on the first match and produces one deny envelope.
- Failure path: Stdin that is not valid JSON stays silent and exits 0, and a disabled relaunch concern stays silent.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One hook file, one test file and two added alternatives |
| Risk | 3/25 | One permission predicate, no schema, API or record-format change |
| Research | 2/20 | The guard and its test are read in full, and finding 5 names the change |
| **Total** | **9/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None
<!-- /ANCHOR:questions -->
