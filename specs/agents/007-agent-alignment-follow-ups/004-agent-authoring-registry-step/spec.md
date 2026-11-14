---
title: "Feature Specification: Phase 4: agent-authoring-registry-step"
description: "The agent authoring skill tells an author to run the roster check and never tells them to add the registry record the check requires. A new agent file therefore fails the check with an error the skill does not explain. This phase adds the registry step to the workflow."
trigger_phrases:
  - "agent authoring registry step"
  - "phase 4 agent authoring registry step"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: agent-authoring-registry-step

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-orchestrate-task-package-agent-names |
| **Successor** | None |
| **Handoff Criteria** | The creation workflow names the registry record, and a throwaway agent file with a record passes the roster check |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the agent alignment follow-ups packet.

**Scope Boundary**: The ordered creation workflow in `sk-create-agent/SKILL.md` and the packet's version and changelog. The registry, the roster script, the agent template and the eleven agent files do not change.

**Dependencies**:
- None. This phase changes a different artifact from phases 1 to 3 and can run at any point.

**Deliverables**:
- One workflow step that names `agent-registry.json`, the fields a record needs and the command that rewrites the rosters
- The error an author sees without the record, quoted in that step
- The packet version and its changelog entry
- One recorded check with a throwaway agent file, removed again
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Step 13 of the ordered creation workflow in `sk-create-agent/SKILL.md` tells an author to run `node .skilled/bin/sync-agent-roster.cjs --check` after adding an agent file. No step tells them to add a record for the agent to `.skilled/agents/agent-registry.json`. A new agent file with no record fails that check and CI with `agent file without a registry record: <name>`. The skill does not name the registry anywhere, so an author who follows it exactly ends on an error it never mentions.

### Purpose
An author who follows the creation workflow in order adds the registry record before the check, and the check passes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c 'agent-registry' .skilled/skills/sk-doc/sk-create-agent/SKILL.md || echo 0
0
$ cp .skilled/agents/context.md .skilled/agents/zz-probe.md; node .skilled/bin/sync-agent-roster.cjs --check; echo "exit=$?"; rm .skilled/agents/zz-probe.md
agent file without a registry record: zz-probe
agent-roster: FAIL (1 problem(s))
exit=1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one step to the ordered creation workflow, before the validation step, that tells the author to add a record to `.skilled/agents/agent-registry.json` and names the fields a record carries
- Tell the author in the same step to run `node .skilled/bin/sync-agent-roster.cjs` so the generated rosters pick the new agent up
- Quote the error text `agent file without a registry record` where the validation step names the check
- Bump the packet version and add the changelog entry the hub's version rule requires
- Prove the step with a throwaway agent file and a throwaway record, both removed before the phase closes

### Out of Scope
- Changing `sync-agent-roster.cjs` to create a record itself - a record carries a task type, a tier and dispatchers that only the author can decide
- Editing `assets/agent-template.md` - it already names the check, and the template describes the file, not the registry
- The `/create:agent` workflow assets - they point at this skill for the steps, and T002 records whether they restate them
- Adding or retiring an agent

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` | Modify | The registry step, the error text and the version |
| `.skilled/skills/sk-doc/sk-create-agent/changelog/` | Create | One entry for the new packet version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The ordered creation workflow has a step, before the validation step, that tells the author to add a record to `.skilled/agents/agent-registry.json`. | `rg -c 'agent-registry' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` prints 1 or more, up from 0 |
| REQ-002 | The step names every field a registry record carries today. | Each key printed by `node -e 'console.log(Object.keys(require("./.skilled/agents/agent-registry.json").agents[0]).join(" "))'` appears in the step |
| REQ-003 | An agent file added with a record as the step describes passes the roster check. | With a throwaway file and record in place and the rosters rewritten, `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`. Both are removed afterwards and the check prints `agent-roster: OK` again |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The skill quotes the error an author sees without the record. | `rg -c 'agent file without a registry record' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` prints 1 |
| REQ-005 | The packet's version and its newest changelog entry agree, and the hub's version check passes. | The newest file name under `sk-create-agent/changelog/` matches `rg -n '^version:' .skilled/skills/sk-doc/sk-create-agent/SKILL.md`, and the hub's version check exits 0 |
| REQ-006 | The throwaway probe leaves no residue. | `git status --short .skilled/agents` prints no line after T008 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c 'agent-registry' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` prints 1 or more, up from 0.
- **SC-002**: `scratch/probe.txt` shows the roster check failing without the record and printing `agent-roster: OK` with it.
- **SC-003**: `git status --short .skilled/agents` prints no line from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `sk-doc` hub's version rule and its checks | A version that disagrees with the changelog fails CI | T003 reads the rule in `.skilled/skills/sk-doc/SKILL.md` before the edit and T009 runs the checks it names |
| Risk | The throwaway record or the rewritten rosters are left in the tree | High | T008 removes the file and the record, reruns the roster write and checks `git status --short .skilled/agents` prints no line |
| Risk | The step lists registry fields that later change | Low | REQ-002 reads the field names from the registry at implementation time, and the step points at an existing record as the pattern to copy |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the registry step a new step or a sentence added to step 13? Decision: a new step before validation. Step 13 validates, and an author needs the record to exist before the check runs.
- Do the `/create:agent` workflow assets restate the creation steps? UNKNOWN until T002 reads them. A search of both files for `agent-registry` and `sync-agent-roster` printed no line on 2026-11-14. If they restate the steps, that is reported as a follow-up and not changed here.
- Answers, 2026-11-14. The `/create:agent` workflow assets do not restate the creation steps. They run their own six-step workflow and never run the roster check, so the command can still produce an agent file that fails it. That is reported as a follow-up. The hub's vocabulary check fails with `drift=6` before and after this phase, so REQ-005 is judged on the version check, which passes.
<!-- /ANCHOR:questions -->

---
