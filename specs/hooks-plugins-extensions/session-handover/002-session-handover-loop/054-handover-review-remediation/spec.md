---
title: "Feature Specification: Phase 54: handover-review-remediation"
description: "Fix the four P2 findings of the handover and history deep review: three hook docs that drifted from code, and a withdraw-on-prompt wrapper copied into five adapters whose OpenCode and Pi copies swallowed errors."
trigger_phrases:
  - "handover review remediation"
  - "phase 54 handover review remediation"
  - "withdrawOnPrompt shared helper"
  - "withdraw on prompt error logging"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 54: handover-review-remediation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `worktrees/440-handover-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 54 of 55 |
| **Predecessor** | 053-handover-and-history-deep-review |
| **Successor** | 055-cross-checkout-root-pinning |
| **Handoff Criteria** | Every adapter withdraws on a prompt through one helper that logs its failures, the three doc drifts are gone, and the hand-over suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 54** of the session handover loop. It fixes the four P2 findings the deep review in 053 raised. The operator asked for the edits to run on DeepSeek Flash; Devin's quota was spent, so they ran on Mistral Vibe's `deepseek-flash` row.

**Scope Boundary**: The withdraw module, the five adapters' prompt withdrawal, and the hook docs the findings name. The relaunch-log event names stay as they are.

**Dependencies**:
- The review report at `../053-handover-and-history-deep-review/review/review-report.md`.

**Deliverables**:
- `withdrawOnPrompt` in `lib/withdraw.cjs`, with tests, called by the Claude, Codex, OpenCode, Pi and Vibe adapters.
- Corrected `state-files.md`, `troubleshooting.md` and `history/README.md`, and the helper named in `lib/README.md` and `handoff-protocol.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each runtime adapter carried its own copy of the code that withdraws a hand-over when the operator sends a prompt. The OpenCode and Pi copies dropped a failed withdrawal without a log line, so the failure left no trace. Three hook docs also disagreed with the code: `state-files.md` left Vibe out of the runtimes a prompt withdraws on, `troubleshooting.md` gave one cause of a stale killer lock where the code acts on two, and the history README did not say how the search `files` filter matches.

### Purpose
One withdraw-on-prompt helper that every adapter calls and that logs its failures, and docs that say what the code does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A shared `withdrawOnPrompt` helper and its tests.
- The five adapters' prompt withdrawal.
- The three doc corrections and two doc lines naming the helper.

### Out of Scope
- Unifying the `withdrawn` and `arm-cancelled` log event names.
- Comparing the `claude/`, `pi/` and `lib/` READMEs against code, which the review left unread.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/lib/withdraw.cjs` | Modify | Add `withdrawOnPrompt` |
| `.skilled/hooks/session-handover/tests/withdraw.test.cjs` | Modify | Four helper tests |
| `.skilled/hooks/session-handover/{claude,codex,vibe,pi}/` adapters, `.opencode/plugins/session-handover.js` | Modify | Call the helper |
| `.skilled/hooks/session-handover/state-files.md`, `troubleshooting.md`, `history/README.md` | Modify | Doc corrections |
| `.skilled/hooks/session-handover/lib/README.md`, `handoff-protocol.md` | Modify | Name the helper |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A failed prompt withdrawal is logged on every runtime | The helper logs `context-nudge-error` when the withdrawal throws; a test proves it |
| REQ-002 | No regression | Node suite and hooks vitest config pass with no fewer passing tests than the baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every adapter calls the shared helper | No adapter calls `withdrawHandOver` directly |
| REQ-004 | The three doc drifts are corrected | Each doc line matches the code it describes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The node suite passes 1055 of 1055, up from 1051, and the hooks vitest config passes 509 of 509.
- **SC-002**: The Pi adapter typechecks with no error the original did not have.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A changed log event name would break log readers | Operators lose a known event | Each adapter keeps its own success event |
| Dependency | Devin quota | The chosen executor could not run | Operator switched to Vibe `deepseek-flash` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---
