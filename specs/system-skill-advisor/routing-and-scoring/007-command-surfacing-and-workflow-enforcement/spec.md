---
title: "Feature Specification: Research how the skill advisor should surface slash commands and how native chat reaches the proper command workflow without the user typing a command"
description: "The advisor recommends skills but surfaces only doctor commands as runnable lines, and plain chat prompts for planning or research get no recommendation at all. This packet researches how every command gets surfaced and how a chat-only user still lands on the proper command workflow."
trigger_phrases:
  - "command surfacing and workflow enforcement"
  - "research how the skill advisor should surface slash"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Research how the skill advisor should surface slash commands and how native chat reaches the proper command workflow without the user typing a command

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository ships 45 slash commands that own complete workflows, but the skill advisor tells the model about skills, not commands. Only `/doctor:*` commands reach the model as a runnable line. Every other command arrives as a raw bridge id such as `command-spec-kit`, or not at all, and no rule says whether the model should run a surfaced command or ask first. A user who chats without typing a command therefore gets a hand-rolled approach where a command workflow exists.

### Purpose
Produce an evidence-backed design for an advisor that surfaces every command with a run-or-ask decision, and for a mechanism that brings a chat-only request onto the proper command workflow.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"plan a new feature for the login page"}' --format json
recommendations: []
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"research how our retrieval scoring works in depth"}' --format json
recommendations: []
```
The second line of each pair is the `skillId` list extracted from the JSON reply, run on 2026-11-12 in this worktree.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run a 30-iteration `/deep:research` fan-out, 10 iterations on each of three executors, over the ten research angles below.
- Record what the advisor represents, scores and renders for commands today, with `file:line` evidence.
- Recommend a command inventory, an output contract and a run-or-ask policy the advisor can carry.
- Recommend how a chat-only request reaches the proper command workflow on each runtime.
- Name the benchmark rows that would prove the recommended behavior.

### Research Angles
1. **Inventory.** Commands are described by three sources, `command-metadata.json` in three hubs, the bridge `allow-list.json` and `doctor/_routes.yaml`. Which commands have no active bridge, which bridges point at retired names, and what one drift-proof inventory needs.
2. **Scoring.** Why plain planning and research prompts return no recommendation, how command intent competes with skill intent in fusion, and what the no-slash penalty and the mutating-command gate cost in recall and buy in precision.
3. **Output contract.** `advisor_recommend` has no kind or runnable field and the brief prints raw bridge ids outside the doctor family. What the model must see inside the 80 to 120 token brief to act on a command.
4. **Run or ask.** Which commands are safe to start without asking and which need a question first, judged by what the command writes, costs and can undo, and where that policy should live.
5. **Invocation mechanics.** Whether a model can start a slash command itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what the fallback is where it cannot.
6. **Chat-only users.** Which mechanism brings a request typed as plain chat onto the command workflow: the advisor brief, a gate in `AGENTS.md`, a hook, the skill pointing at its command, or a refusal in the runner. Include the evidence for workflows being hand-rolled today.
7. **Skill and command linkage.** Commands whose workflow never loads the mode `SKILL.md` their metadata names, skills with no command front door, and whether a skill recommendation should imply its command.
8. **Measurement.** The benchmark and fixture rows needed for every command group and for chat-style prompts, and the metrics that separate a missed command from a wrongly started one.
9. **Prior art.** How other agent harnesses route a free-text request to a packaged workflow, from their public documentation.
10. **Failure modes.** Over-triggering, ambiguity between a command and a skill, a dispatched child session starting commands by itself, loops, and the brief budget.

### Out of Scope
- Implementing any advisor, hook, command or `AGENTS.md` change - this packet ends at `research/research.md`, and the build is planned from it afterwards.
- Changing how skills are scored against each other - that is settled by the sibling packets in this sub-track.
- Repairing the Pi 1.5.2 extension loading failure - it is fixed in its own packet and worktree.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Loop state, three lineage directories, merged findings and `research.md`, written by the `/deep:research` workflow |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Modify | Packet documents for this research run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research runs through the `/deep:research:auto` workflow as a three-lineage fan-out, never a hand-rolled loop | `ls research/lineages` lists three lineage directories and each holds iteration files |
| REQ-002 | A merged synthesis exists and answers all ten angles | `research/research.md` exists and `rg -c '^## ' research/research.md` prints at least 10 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each lineage runs 10 iterations on its named model | Each lineage state log holds 10 iteration records, or a recorded convergence or failure reason |
| REQ-004 | Every recommendation in the synthesis cites repository evidence | Each recommendation in `research/research.md` carries at least one `[SOURCE: path:line]` tag that resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` states, for each of the 45 commands, whether the advisor should surface it and whether the model runs it or asks first.
- **SC-002**: `research/research.md` names one recommended mechanism for chat-only requests, with the alternatives it rejected and why.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `codex`, `pi` and `opencode1` binaries with live provider credentials | A lineage that cannot reach its model writes nothing | Auth pre-flight before launch, and a failed lineage is recorded as a finding instead of replaced by another model |
| Risk | Three models restate the framing in the angles instead of testing it | Med | The angles ask questions and name no preferred design, and the synthesis keeps disagreements between lineages visible |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How strict the run-or-ask default should be is the one decision the research returned to the operator. See `research/research.md` section 13.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md`, which stays the source of truth.

- All 45 commands should be surfaced. Today 22 of 62 bridge rows are off in the TypeScript scorer and five commands have no bridge under their own name.
- Non-doctor command projections carry slash strings as their only keywords, so plain chat cannot match them.
- The recommendation needs four new fields: `kind`, `command`, `policy` and `ownerSkillId`. The brief renders them inside the existing token cap.
- The policy derives from a risk class carried in command metadata. Only doctor routes declare one today.
- Chat-only requests reach a command through three layers: the brief names the command and policy, one sentence in Gate 2 binds the behaviour, and the command file is the workflow body.
- Measurement needs a command-routing harness with recall, precision, unsafe-run and ask metrics per command.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
