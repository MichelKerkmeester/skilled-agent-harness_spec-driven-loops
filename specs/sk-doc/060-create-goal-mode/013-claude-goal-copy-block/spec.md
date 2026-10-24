---
title: "Feature Specification: Phase 13: claude-goal-copy-block"
description: "Claude Code sets a goal when the operator types the native /goal command, yet the agent sent the chat slice as plain chat text that the operator had to select by hand. This phase adds one rule: on Claude Code the slice goes out as one fenced code block that holds the slice and nothing else."
trigger_phrases:
  - "claude goal copy block"
  - "phase 13 claude goal copy block"
  - "goal chat slice fenced block"
  - "copyable goal slice"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: claude-goal-copy-block

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-24 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-goal-send-and-dedupe |
| **Successor** | None |
| **Handoff Criteria** | Every surface that states how the goal is sent names the Claude Code fence rule or points to the one that does, the two Claude playbook scenarios test it, and the YAML files parse. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Create the sk-create-goal sk-doc mode specification. The operator asked for it on 2026-10-24, after phase 012 gave the send rule one home: on Claude Code the goal's chat slice is always sent as one copyable fenced code block. The operator named only Claude Code.

**Scope Boundary**: How the agent presents the chat slice in chat on Claude Code. The `chat_slice` that `goal.cjs packet` prints, the `packet_budget=ok` gate, the 4,000 limit and what the slice contains stay unchanged. No code changes.

**Dependencies**:
- Phase 012 shipped, so `references/budget-and-handoff.md` section 4 is the one full send rule.

**Deliverables**:
- One sentence in `AGENTS.md`, the full rule in `budget-and-handoff.md` section 4 and the Claude Code row of its section 5 matrix.
- The same rule in the set-string playbook, five speckit YAMLs, two create-goal YAMLs and the create-goal presentation text.
- A pass criterion in the Claude goal scenario and the top-level goal scenario.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Claude Code sets a goal when the operator types the native `/goal` command. The agent sent the parent goal's `chat_slice` as plain chat text, so the operator had to select it by hand and markdown rendering could alter it, for example by turning a line start into a list or a heading.

### Purpose
On Claude Code the operator copies the whole slice with one click and pastes byte-exact text into `/goal`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The fence rule in `AGENTS.md`, `budget-and-handoff.md`, the set-string playbook and every workflow YAML that tells the agent to print or send the slice.
- A pass criterion in the two playbook scenarios that cover the Claude send.

### Out of Scope
- Codex, OpenCode, Pi, Cursor and Devin - the operator named only Claude Code, and the Codex matrix row now says it does not take the fence.
- `goal.cjs`, `goal-slice.cjs` and every other code file - the rule is about presentation in chat.
- The hooks goal README and `goal-plugin.md` - they describe the host contract and defer to `AGENTS.md` and `budget-and-handoff.md` section 4.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | One sentence in the goal posture rule |
| `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md` | Modify | Section 4 paragraph, Claude Code and Codex rows of the section 5 matrix |
| `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modify | Resend step names the fence |
| `.skilled/commands/speckit/assets/speckit-{plan,implement,complete}.yaml` | Modify | `bind_by_runtime.claude-code` and `resend.payload` |
| `.skilled/commands/speckit/assets/speckit-resume-{auto,confirm}.yaml` | Modify | Resend reminder |
| `.skilled/commands/create/assets/create-goal-{auto,confirm}.yaml` | Modify | `step_print_slice` action |
| `.skilled/commands/create/assets/create-goal-presentation.txt` | Modify | Fence in place of the dividers on Claude Code |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` | Modify | CC-029 pass criterion and command |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/manual-testing-playbook.md` | Modify | CC-029 summary signal |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/top-level-goal.md` | Modify | SCG-001 pass criterion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | On Claude Code the goal's chat slice is sent as one fenced code block that holds the slice and nothing else. The fence cannot be broken by the slice, so a slice that holds three backticks gets a longer fence. Every other send rule stays. | `rg -n "one fenced code block that holds the slice and nothing else"` finds the rule in `AGENTS.md`, `budget-and-handoff.md`, the playbook and each send-instructing YAML. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The operator can test the rule: the Claude goal scenario and the top-level goal scenario each carry a pass criterion for it. | CC-029 and SCG-001 name the criterion, and both playbook packages validate with 0 violations. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All seven changed YAML files parse, and `validate_document.py` reports 0 issues on each changed `.md` file outside its by-design skip.
- **SC-002**: `validate.sh` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 012 send rule | Low: the rule would have no single home | Section 4 of `budget-and-handoff.md` already is that home |
| Risk | `AGENTS.md` loads on every runtime | Medium | One sentence, scoped to Claude Code, inside the existing goal posture bullet |
| Risk | The fence is read as added content | Low | The sentence says the fence is presentation and every rule for the slice still holds |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should Codex take the same fence? The operator named only Claude Code, so it does not for now.
<!-- /ANCHOR:questions -->

---


