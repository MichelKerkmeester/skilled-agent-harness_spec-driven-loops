---
title: "Feature Specification: Phase 8: command-and-playbook"
description: "Phase 8 plans the /create:goal command surface and the mode's manual testing playbook for packet-goal authoring."
trigger_phrases:
  - "/create:goal command assets"
  - "sk-create-goal runtime mirrors"
  - "goal-authoring manual testing playbook"
  - "goal command argument hint"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: command-and-playbook

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
| **Branch** | `worktrees/068-create-goal-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-hub-routing-integration |
| **Successor** | 009-verification-and-closeout |
| **Handoff Criteria** | All four command mirrors resolve, and the playbook package validator reports PASS. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Create the sk-create-goal sk-doc mode that authors packet goals specification.

**Scope Boundary**: Add the `/create:goal` router and assets, command metadata and index entries, four runtime mirrors, and the mode's manual testing playbook. Do not build the mode or change hub routing in this phase (specs/sk-doc/060-create-goal-mode/spec.md:85-108, 127-129).

**Dependencies**:
- Phase 004 must settle the operation vocabulary before the argument hint is finalized. The parent assigns the question of adding a goal as an operation to that phase (specs/sk-doc/060-create-goal-mode/spec.md:157-159).
- Phase 007 must meet its outgoing check that real requests reach the mode through both routing stages (specs/sk-doc/060-create-goal-mode/spec.md:147-149).
- The command and playbook workflows own their respective authoring shapes and validation steps (.skilled/skills/sk-doc/sk-create-command/SKILL.md:170-181, 329-365; .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:150-175, 421-490).

**Deliverables**:
- A `/create:goal` router with `:auto` and `:confirm` workflow YAML assets and one presentation asset.
- A `command-metadata.json` entry, a create-command index row, and four resolving runtime mirrors.
- A playbook root and eight per-feature scenario files for the required goal-authoring cases.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent packet reserves `/create:goal`, its runtime mirrors and a manual testing playbook for this phase, with command resolution and a passing playbook validator as the outgoing check (specs/sk-doc/060-create-goal-mode/spec.md:100-108, 127-149). The command must preserve the mode boundary between writing packet files and setting a session objective, while its argument hint depends on operations Phase 004 has not settled in the current scaffold (specs/sk-doc/060-create-goal-mode/spec.md:94-98, 157-159; specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:42-48).

### Purpose

Give operators a resolvable command and a reproducible playbook for the mode's packet-goal authoring work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `.skilled/commands/create/goal.md` and the three assets through `sk-create-command`, keeping workflow routing separate from presentation (.skilled/skills/sk-doc/sk-create-command/SKILL.md:170-181, 329-365).
- Add the `/create:goal` entry to `.skilled/skills/sk-doc/command-metadata.json` with `ownerMode: sk-create-goal` and an argument hint that uses Phase 004's settled operations plus `:auto` and `:confirm` (.skilled/skills/sk-doc/command-metadata.json:359-391; specs/sk-doc/060-create-goal-mode/spec.md:157-159).
- Add the command row to `.skilled/commands/create/README.txt` and create mirrors at `.claude/commands/create/goal.md`, `.codex/prompts/create-goal.md`, `.pi/prompts/create-goal.md` and `.cursor/commands/create-goal.md` (.skilled/commands/create/README.txt:28-40, 44-60; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:19-23).
- Author a root playbook and eight deterministic scenarios through `sk-create-manual-testing-playbook`, using its root-index and per-feature file contract (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:150-175, 216-263, 316-337).
- Cover the top-level goal, phase parent with nested child goals, adding a goal to a packet that has none, cutting an over-budget parent, refusing a leftover placeholder, detecting an unbound phase, routing “set the goal” away from the mode, and resending the parent after a child change (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:3-8, 31, 41-45; specs/sk-doc/060-create-goal-mode/goal.md:58-67).

### Out of Scope
- Building or registering `sk-create-goal`; parent scope assigns mode construction and hub routing to other phases (specs/sk-doc/060-create-goal-mode/spec.md:85-92, 104-108, 127-129).
- Setting or binding a session objective. The parent explicitly leaves chat objectives with the goal hooks (specs/sk-doc/060-create-goal-mode/spec.md:94-98).
- Running the playbook scenarios against a real packet. Phase 009 owns the end-to-end authoring proof (specs/sk-doc/060-create-goal-mode/spec.md:127-129).
- Editing the goal template, system-spec-kit validator, other phases or parent packet files (specs/sk-doc/060-create-goal-mode/spec.md:94-98).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/create/goal.md` | Create | Thin `/create:goal` router authored through `sk-create-command`. |
| `.skilled/commands/create/assets/create-goal-auto.yaml` | Create | Autonomous command workflow. |
| `.skilled/commands/create/assets/create-goal-confirm.yaml` | Create | Checkpointed command workflow. |
| `.skilled/commands/create/assets/create-goal-presentation.txt` | Create | User-facing prompts and result wording. |
| `.skilled/skills/sk-doc/command-metadata.json` | Modify | Add one `/create:goal` entry owned by `sk-create-goal`. |
| `.skilled/commands/create/README.txt` | Modify | Add the command index row. |
| `.skilled/commands/README.txt` | Modify | Add the `/create:goal` row to the repo-wide index and raise the create count from 12 to 13. |
| `.claude/commands/create/goal.md` | Create | Claude Code command mirror. |
| `.codex/prompts/create-goal.md` | Create | Codex prompt mirror. |
| `.pi/prompts/create-goal.md` | Create | Pi prompt mirror. |
| `.cursor/commands/create-goal.md` | Create | Cursor command mirror. |
| `.hermes/prompts/create-goal.md` | Create | Hermes prompt mirror, generated by `sync-prompts-hermes.cjs`. |
| `.hermes/skills/sk-create-goal/SKILL.md` | Create | Hermes skill copy of the new mode, generated by `sync-skills-hermes.cjs`. |
| `.hermes/skills/sk-doc/SKILL.md` | Regenerate | Hermes skill copy of the hub after phase 007 changes it. |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md` | Create | Playbook root and scenario index. |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/top-level-goal.md` | Create | Top-level packet goal scenario. |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/phase-parent-and-nested-child-goals.md` | Create | Phase-parent and nested-child scenario. |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/add-goal-to-packet-without-goal.md` | Create | Add a goal to a packet with no goal file. |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/cut-over-budget-parent.md` | Create | Reduce an over-budget parent without losing a criterion. |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md` | Create | Refuse a goal with a leftover placeholder. |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/detect-unbound-phase.md` | Create | Detect a phase missing from the parent binding. |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/route-session-goal-away.md` | Create | Route “set the goal” away from packet-goal authoring. |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/resend-parent-after-child-change.md` | Create | Update and resend a parent after a child changes its decisions or criteria. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Author the router and its auto, confirm and presentation assets through `sk-create-command`; both mode suffixes must resolve to their matching workflow asset (.skilled/skills/sk-doc/sk-create-command/SKILL.md:313-327, 329-365). |
| REQ-002 | Add exactly one `/create:goal` metadata entry with `ownerMode: sk-create-goal`; its argument hint must include every operation settled by Phase 004 and both suffixes, and stay within the command contract's 140-character limit (.skilled/skills/sk-doc/command-metadata.json:359-363; .skilled/skills/sk-doc/sk-create-command/SKILL.md:202-219; specs/sk-doc/060-create-goal-mode/spec.md:157-159). |
| REQ-003 | Add the command index row and create all four runtime mirrors; each mirror must resolve to a file. Also add the row to the repo-wide `.skilled/commands/README.txt` and raise its create count, so `command-catalog-mirror-check.cjs` prints `STATUS=OK`. Also regenerate the Hermes prompt and skill copies with their generators, never by hand, so `sync-prompts-hermes.cjs --check` and `sync-skills-hermes.cjs --check` pass; CI's command-tree-parity job runs both (operator-approved amendment, 2026-09-26) (.github/workflows/command-tree-parity.yml:65-66; .skilled/commands/create/README.txt:28-30, 44-60; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:19-23). |
| REQ-004 | Create a playbook root that indexes exactly eight per-feature scenarios, covers every required behavior, and passes the operator-contract package validator (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:150-175, 251-263, 447-490). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Include a deterministic scenario showing that “set the goal” is not routed to packet-goal authoring; session objectives remain outside this mode (specs/sk-doc/060-create-goal-mode/spec.md:94-98, 157-159). |
| REQ-006 | Include a deterministic scenario showing that a child change affecting a parent decision or criterion updates the parent first and resends the parent chat slice (specs/sk-doc/060-create-goal-mode/goal.md:58-67). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** Phase 004's settled operation list, **When** the `/create:goal` metadata entry is parsed, **Then** its owner is `sk-create-goal` and its argument hint contains every operation plus `:auto` and `:confirm`.
- **SC-002**: **Given** the four named runtime destinations, **When** each path is checked with `test -f`, **Then** every mirror resolves and the create-command index has one `/create:goal` row.
- **SC-003**: **Given** the playbook package, **When** `validate-playbook-package.cjs` runs on its root, **Then** it reports `PASS` and counts eight scenarios.
- **SC-004**: **Given** the eight required scenario files, **When** the root playbook index and package validator are checked, **Then** each scenario appears once and the validator reports no package violations.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 operation vocabulary is not present in its current scaffold (specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:42-48, 89-103; specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/tasks.md:34-61). | High: guessing the operations would make the hint and command routing wrong. | Read the accepted Phase 004 output before authoring the router or metadata; keep the operation list UNKNOWN until then (specs/sk-doc/060-create-goal-mode/spec.md:157-159). |
| Dependency | Phase 007 must prove reachability through both routing stages (specs/sk-doc/060-create-goal-mode/spec.md:147-149). | High: a command may exist while the mode is still unreachable. | Confirm the prior handoff evidence before running command-authoring workflow. |
| Risk | Router and presentation text drift apart. | Medium: prompts or outcomes could be duplicated or routed incorrectly. | Follow the router/presentation boundary and check the mode targets for both suffixes (.skilled/skills/sk-doc/sk-create-command/SKILL.md:325-365). |
| Risk | A valid-looking playbook omits a required scenario or fails its package contract. | Medium: Phase 009 would inherit incomplete manual coverage. | Index eight scenarios, check the index-to-file mapping and require the package validator's affirmative `PASS` output (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:251-263, 447-490). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. This phase plans documentation and command surfaces, not a runtime performance change.

### Security
- **NFR-S01**: The command must use only the tools its workflow requires, following the command author's least-privilege contract (.skilled/skills/sk-doc/sk-create-command/SKILL.md:202-220).
- **NFR-S02**: The playbook must use fixture packets and repository documents only; production credentials and production packets are outside this phase.

### Reliability
- **NFR-R01**: Each runtime mirror must resolve to a file before the outgoing handoff.
- **NFR-R02**: The playbook package validator must report `PASS` with all eight scenarios indexed (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:447-490).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or whitespace-only authoring input: the command must follow the required-input gate defined by `sk-create-command` and must not infer an operation from unrelated context (.skilled/skills/sk-doc/sk-create-command/SKILL.md:223-244).
- Parent durable-slice limit: the parent scenario must stay at or below 4,000 characters and preserve all completion criteria (.skilled/skills/system-spec-kit/references/validation/validation-rules.md:683-722).
- Leftover placeholder: the scenario must reject the goal before the command reports a usable result (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:7, 41-45).

### Error Scenarios
- Phase 004 operation list is missing: stop command authoring and record the operation set as UNKNOWN rather than inventing tokens (specs/sk-doc/060-create-goal-mode/spec.md:157-159).
- A phase is absent from the parent binding: the scenario must surface the omitted phase, which the current validator does not detect on its own (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:7, 44).
- A command mirror does not resolve: the outgoing handoff is blocked until the exact mirror path works (specs/sk-doc/060-create-goal-mode/spec.md:149).

### State Transitions
- “Set the goal” is session intent, not packet-file authoring, and must route away from the mode (specs/sk-doc/060-create-goal-mode/spec.md:94-98, 157-159).
- If a child change alters parent decisions or criteria, update the parent first and resend its chat slice (specs/sk-doc/060-create-goal-mode/goal.md:58-67).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | Not rescored | This child phase inherits Level 2 and the named parent scope. |
| Risk | Not rescored | Command and playbook implementation remain unexecuted. |
| Research | Not rescored | The command and playbook contracts and both goal audits are the cited inputs. |
| **Total** | **Not rescored** | No new level decision is made in this child phase. |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- UNKNOWN: Which exact operation tokens did Phase 004 settle? The current Phase 004 spec and task files still contain planning scaffolds (specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:42-48, 89-103; specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/tasks.md:34-61). Resolve this from Phase 004's accepted output before finalizing the argument hint, as the parent assigns that decision to Phase 004 (specs/sk-doc/060-create-goal-mode/spec.md:157-159).
<!-- /ANCHOR:questions -->

---
