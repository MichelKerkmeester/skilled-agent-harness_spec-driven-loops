---
title: "Feature Specification: Budget and chat-slice handoff"
description: "Goal authoring needs a repeatable way to bring phase-parent goals under the 4,000-character durable-slice cap without losing criteria or handing the wrong slice to a runtime."
trigger_phrases:
  - "goal budget handoff"
  - "budget and chat slice"
  - "goal.cjs packet"
  - "over-budget parent goal"
  - "chat slice handoff"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: budget-and-chat-slice-handoff

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | worktrees/068-create-goal-mode |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 9 |
| **Predecessor** | 004-parent-and-nested-goal-authoring |
| **Successor** | 006-goal-conformance-check |
| **Handoff Criteria** | An over-budget fixture is cut to within the 4,000-character budget with its completion-criterion count unchanged. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Create the sk-create-goal sk-doc mode that authors packet goals specification.

**Scope Boundary**: Author the mode's budget and runtime handoff reference, plus its temporary budget fixture proof. Do not change system-spec-kit or runtime goal state (specs/sk-doc/060-create-goal-mode/spec.md:86,94-99).

**Dependencies**:
- Phase 004 hands off a parent and children with every phase bound, verified by a fixture packet (specs/sk-doc/060-create-goal-mode/spec.md:145).

**Deliverables**:
- .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md, with a read-only budget check, the ordered trimming rule, the chat-slice distinction and runtime handoff matrix (specs/sk-doc/060-create-goal-mode/spec.md:89,104).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Goal authors need a repeatable way to budget a phase-parent directive while retaining every completion criterion. The parent goal log records a first measurement of 4,820 durable characters, about 1,900 characters of fixed template text and about 900 characters across nine binding rows, followed by a cut to 3,735 without dropping a criterion (specs/sk-doc/060-create-goal-mode/goal.md:136). The existing goal system also exposes separate chat and objective projections, so a handoff that treats them as the same string can give an operator the wrong payload (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:4-9,20-31, .skilled/hooks/goal/lib/goal-slice.cjs:96-118).

### Purpose
Give sk-create-goal a sourced procedure for measuring and fitting parent goals while printing the chat slice the operator needs to hand to a runtime.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md as the phase's retained deliverable (specs/sk-doc/060-create-goal-mode/spec.md:86,89,104).
- Document the read-only packet command, its durable-character count and budget fields, and the 4,000-character parent limit (.skilled/hooks/goal/bin/goal.cjs:203-216, .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-28).
- Follow the set-string playbook's cut order, preserve criterion count, and split a packet if the parent still cannot fit (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71).
- Explain that chat_slice is the handoff text and differs from objective_slice, which is assembled for a runtime bind (.skilled/hooks/goal/lib/goal-slice.cjs:66-79,96-118, .skilled/hooks/goal/bin/goal.cjs:208-216).
- Document the runtime handoff matrix and state that this mode prints the chat slice and stops, without calling bind or set (.skilled/hooks/goal/goal-plugin.md:151-170, specs/sk-doc/060-create-goal-mode/goal.md:51-54).

### Out of Scope
- Changing system-spec-kit templates, budget settings, renderers, validators or the set-string playbook. The parent packet leaves those changes out of scope (specs/sk-doc/060-create-goal-mode/spec.md:94-99).
- Binding a packet goal, setting a session objective or updating runtime state. The parent decision keeps those responsibilities with the goal hooks (specs/sk-doc/060-create-goal-mode/goal.md:49-54).
- Building the goal mode, its conformance checker, its command or its playbook, which belong to other phases (specs/sk-doc/060-create-goal-mode/spec.md:121-129).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md | Create | Record the budget measurement, cut order, projection distinction, runtime matrix and fixture proof for phase 005 (specs/sk-doc/060-create-goal-mode/spec.md:86,89,104). |
| .skilled/skills/sk-doc/sk-create-goal/SKILL.md and .skilled/skills/sk-doc/sk-create-goal/references/README.md | Modify | Load `budget-and-handoff.md` at the budget and handoff steps and list it in the index. Operator-approved amendment, 2026-09-26. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The reference names `node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace <repo root>` and requires packet_durable_chars and packet_budget as the measured result. The parent and top-level budget is 4,000 durable characters (.skilled/hooks/goal/bin/goal.cjs:203-216, .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-28). |
| REQ-002 | The reference gives the playbook's ordered cuts, preserves the completion-criterion count, shortens criterion wording without dropping a criterion, and splits the packet if the parent still exceeds budget (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71). |
| REQ-003 | The over-budget fixture finishes with packet_budget=ok and packet_durable_chars at or below the configured budget, with the before-and-after completion-criterion counts equal (specs/sk-doc/060-create-goal-mode/spec.md:146). |
| REQ-004 | The handoff describes chat_slice and objective_slice as distinct projections, prints the chat slice, and contains no call to goal.cjs bind or goal.cjs set (.skilled/hooks/goal/lib/goal-slice.cjs:66-79,96-118, .skilled/hooks/goal/bin/goal.cjs:203-216, specs/sk-doc/060-create-goal-mode/goal.md:51-54). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The runtime matrix names Claude Code, Codex, OpenCode, Pi, Cursor and Devin, and records each surface's role and evidence limits (.skilled/hooks/goal/README.md:75-84, .skilled/hooks/goal/goal-plugin.md:151-170). |
| REQ-006 | The reference decides that the current fixed-text cost is not an amendment to system-spec-kit on this evidence, and names D4 as the escalation path only if a future goal cannot satisfy the current contract after the defined cuts (specs/sk-doc/060-create-goal-mode/goal.md:49-54,136, .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71). |
| REQ-007 | `SKILL.md` loads `references/budget-and-handoff.md` at its budget and chat-slice steps, and `references/README.md` lists it, so the reference is reachable from the workflow. |

> Acceptance criteria for these requirements live in acceptance-criteria.md,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The temporary over-budget fixture reports packet_budget=over before trimming and packet_budget=ok after trimming, with the completion-criterion count unchanged (specs/sk-doc/060-create-goal-mode/spec.md:146).
- **SC-002**: The reference names all six runtime surfaces and states that the mode prints chat_slice and stops without a bind or set action (.skilled/hooks/goal/README.md:75-84, .skilled/hooks/goal/goal-plugin.md:151-170, specs/sk-doc/060-create-goal-mode/goal.md:51-54).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004's fully bound parent/child fixture (specs/sk-doc/060-create-goal-mode/spec.md:145) | Without the incoming fixture, phase 005 cannot start from the agreed parent authoring contract. | Check the phase 004 handoff before implementing the reference. |
| Risk | Cutting a criterion can make completion look easier while removing a real gate (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:68-71, .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:96-105). | The fixture can appear under budget while silently changing what completion means. | Count criteria before and after and require equality, shorten wording only. |
| Risk | Sending objective_slice where the operator needs chat_slice can omit packet prose or pass a different payload (.skilled/hooks/goal/lib/goal-slice.cjs:96-118, .skilled/hooks/goal/bin/goal.cjs:208-216). | The operator may set a different session objective from the printed file content. | Label both fields and identify chat_slice as the handoff payload. |
| Risk | The manifest budget can be unknown if the configuration cannot be read (.skilled/hooks/goal/lib/goal-slice.cjs:277-285,384-387). | A character count without a known cap cannot prove the fixture fits. | Treat packet_budget=unknown as a failed proof and resolve the manifest/configuration issue. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Reuse the packet command's reported measurement. Do not add a second budget counter (.skilled/hooks/goal/bin/goal.cjs:203-216, .skilled/hooks/goal/lib/goal-slice.cjs:268-285,399-428).
- **NFR-P02**: No response-time target is introduced. Acceptance is based on the printed budget state and count comparison.

### Security
- **NFR-S01**: Keep the temporary fixture under the explicit workspace passed to --workspace. The packet command accepts that scope flag (.skilled/hooks/goal/bin/goal.cjs:33-75).
- **NFR-S02**: Use only the packet read action for this handoff. Do not call actions that bind or set runtime goal state (.skilled/hooks/goal/bin/goal.cjs:153-173,203-216,233-246, specs/sk-doc/060-create-goal-mode/goal.md:51-54).

### Reliability
- **NFR-R01**: Treat exactly 4,000 durable characters as within budget and a value above 4,000 as over. The budget check uses a strict greater-than comparison (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:24-26,63, .skilled/hooks/goal/lib/goal-slice.cjs:384-387).
- **NFR-R02**: Treat packet_budget=unknown as unverified rather than as a pass (.skilled/hooks/goal/lib/goal-slice.cjs:277-285,384-387).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: If the fixture has no readable goal.md, the packet command fails instead of returning a budget result (.skilled/hooks/goal/bin/goal.cjs:203-207).
- Maximum length: Exactly 4,000 durable characters is within budget. The first over-budget case is any count greater than 4,000 (.skilled/hooks/goal/lib/goal-slice.cjs:384-387).
- Phase children: The configured parent budget does not apply to phase children (.skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-28).
- Invalid format: If the manifest does not yield a positive integer budget, the budget is unknown and the proof must fail closed (.skilled/hooks/goal/lib/goal-slice.cjs:277-285).

### Error Scenarios
- External service failure: No external service is part of this phase. The evidence comes from local packet files and the CLI.
- Network timeout: No network call is part of the phase. Retry behavior is not in scope.
- Concurrent access: Keep the fixture isolated to one temporary directory and remove it after the proof.

### State Transitions
- Partial completion: If a cut has not brought the parent within budget, continue in playbook order and rerun the packet command (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71).
- Session expiry: No session state is bound or set. The mode prints the handoff and stops (specs/sk-doc/060-create-goal-mode/goal.md:51-54).

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One retained reference and one temporary fixture, within the phase-005 deliverable boundary (specs/sk-doc/060-create-goal-mode/spec.md:86,89,104). |
| Risk | 7/25 | Main risks are criterion loss and projection confusion, both have observable checks (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:68-71, .skilled/hooks/goal/lib/goal-slice.cjs:96-118). |
| Research | 5/20 | The goal audit and repository sources define the budget, projections and runtime surfaces (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:4-9,20-31, .skilled/hooks/goal/goal-plugin.md:151-170). |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for this phase's plan. The fixed-text cost decision is recorded in REQ-006. An unresolved conflict with the current contract would be escalated under parent decision D4 (specs/sk-doc/060-create-goal-mode/goal.md:52-54).
<!-- /ANCHOR:questions -->

---
