---
title: "Feature Specification: Phase 18: runner-gaps"
description: "Decide whether the conversation runner should gain the adapters and session actions that six recommended scenarios need, before any of them is built."
trigger_phrases:
  - "conversation runner gaps"
  - "phase 18 runner gaps"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: runner-gaps

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P3 |
| **Status** | Draft |
| **Created** | 2026-11-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-cli-devin |
| **Successor** | None |
| **Handoff Criteria** | The operator has decided build or no-build for each gap, recorded in the packet decision record |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the conversation adoption build. It is a decision phase: it designs runner extensions and builds nothing until the operator approves one.

**Scope Boundary**: A design note in this phase folder. No runner, adapter or playbook change.

**Dependencies**:
- The runner `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs`, its adapters and its closed set of session actions
- Any gap the other phases record when a scenario cannot be expressed

**Deliverables**:
- `scratch/runner-gaps-design.md`: per gap, the adapter or action needed, its feasibility from a live probe and its cost
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six scenarios meet Q2 but the runner cannot play them: its runtimes are claude-code, opencode, codex, pi and devin, and its only session actions are send, restart and compact. Cursor, Hermes and Aside have no adapter, OpenCode fork has no action, and Orca and Chrome DevTools recovery restart a product process rather than the runtime session.

### Purpose
Give the operator a costed build-or-skip choice per gap, so these scenarios either get a runnable path or stay manual on purpose.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c '```json conversation' .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/session-continuity/continue-same-session.md .skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/session-continuity/resume-captured-session-id.md .skilled/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md .skilled/skills/cli-orca/manual-testing-playbook/runtime/runtime-stopped-recovery.md .skilled/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/recovery-and-failure/dead-session.md
.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/session-continuity/continue-same-session.md:0
.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/session-continuity/resume-captured-session-id.md:0
.skilled/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md:0
.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md:0
.skilled/skills/cli-orca/manual-testing-playbook/runtime/runtime-stopped-recovery.md:0
.skilled/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/recovery-and-failure/dead-session.md:0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Probe each missing runtime's interactive screens the way the five existing adapters were probed
- Sketch a `fork` action and a product-restart action against the runner's action contract
- Cost each gap and recommend build or skip

### Out of Scope
- Building any adapter or action - that needs the operator's yes and its own phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/session-continuity/continue-same-session.md` | Read | CU-015, CU-016 and the Cursor goal hook: needs a cursor adapter |
| `.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/session-continuity/resume-captured-session-id.md` | Read | HERMES-011: needs a hermes adapter |
| `.skilled/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md` | Read | ASD-005: needs an Aside adapter |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md` | Read | CO-020: needs a `fork` session action |
| `.skilled/skills/cli-orca/manual-testing-playbook/runtime/runtime-stopped-recovery.md` | Read | Orca runtime-stopped recovery: needs a product-process restart action |
| `.skilled/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/recovery-and-failure/dead-session.md` | Read | Chrome DevTools dead-session recovery: needs a product-process restart action |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every gap has a recommendation | `scratch/runner-gaps-design.md` lists all six with needed change, probe evidence, cost and build-or-skip |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The operator decides | Each decision is recorded in the packet `decision-record.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The design note names a build-or-skip recommendation for all six gaps
- **SC-002**: `validate.sh --strict` prints `RESULT: PASSED` for this phase
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Cursor, Hermes and Aside installed and signed in for the probes | A gap cannot be costed | Record it as unprobed and recommend skip |
| Risk | Scope grows into building adapters | High | This phase writes a design note only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is a cursor or hermes adapter worth its maintenance for one or two scenarios each? Decided by the operator after the design note.
- The 2026-11-03 OpenCode and Pi live runs added four gaps for this decision:
  - **Pi tabbed question dialogs.** Pi can put several questions in one dialog, with a tab per question and a Submit tab. The runner answers the first tab only, so DIA-003, SD-004 and SCG-010 failed `UNEXPECTED_QUESTION` on Pi and now run without Pi. Should the runner answer each tab from the turn's `questions`?
  - **OpenCode keeps no scrollback.** Its `screen.txt` and `history.txt` hold only the final frame, so a check that needs earlier text must read the session database (`~/.local/share/opencode/opencode.db`). Should the runner export the session transcript as turn evidence?
  - **OpenCode does not send `/doctor:skill-advisor`.** Its command palette shows "No matching commands", so DOC-367 never reached the model and now runs on Claude Code only. Whether this is an OpenCode product gap or a command-registration gap is unconfirmed.
  - **Scenario `env` is literal.** The runner passes `env` values to tmux without expansion, so a scenario cannot put a `gh` write-guard shim on OpenCode's `PATH`. DOC-410 is therefore not run on OpenCode. Should `env` expand `$CONVERSATION_SCRATCH`, or should setup be able to set the subject's `PATH`?
<!-- /ANCHOR:questions -->

---
