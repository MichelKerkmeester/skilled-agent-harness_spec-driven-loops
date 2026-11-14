---
title: "Feature Specification: Phase 3: orchestrate-task-package-agent-names"
description: "The orchestrator's task template types eight agent names by hand while the registry schedules ten, so a task package filled from the template cannot name the design or prompt-improver agent. The roster check passes because it does not read that line. This phase removes the hand-typed list."
trigger_phrases:
  - "orchestrate task package agent names"
  - "phase 3 orchestrate task package agent names"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: orchestrate-task-package-agent-names

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
| **Phase** | 3 of 4 |
| **Predecessor** | 002-deepseek-harness-persona-probe |
| **Successor** | 004-agent-authoring-registry-step |
| **Handoff Criteria** | The task template holds no hand-typed agent list, and the roster and mirror checks exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the agent alignment follow-ups packet.

**Scope Boundary**: The one `Agent:` line inside the fenced task template of `.skilled/agents/orchestrate.md`, and the runtime copies of that file. The registry, the three generated blocks and the roster script do not change.

**Dependencies**:
- None. This phase changes a different artifact from phases 1, 2 and 4 and can run at any point.

**Deliverables**:
- The `Agent:` line names no agent by hand and points at the generated routing table
- The six runtime copies of `orchestrate.md` regenerated
- The roster check and the mirror check both passing
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Line 211 of `.skilled/agents/orchestrate.md` is the `Agent:` line of the template the orchestrator fills for every task it delegates. It lists eight agent names typed by hand. The registry schedules ten, so `@design` and `@prompt-improver` are missing from the one place the orchestrator picks an agent for a task. The predecessor packet generated three rosters in the same file from the registry and left this line out, and `sync-agent-roster.cjs --check` prints `agent-roster: OK` because it never reads the line.

### Purpose
The task template cannot disagree with the registry about which agents exist, because it no longer carries its own list.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 211p .skilled/agents/orchestrate.md
├─ Agent: @code | @context | @markdown | @deep-research | @deep-review | @ai-council | @review | @debug
$ node -e 'const r=require("./.skilled/agents/agent-registry.json");const a=r.agents.filter(x=>typeof x.priority==="number").map(x=>"@"+x.name);console.log(a.length, a.join(" "))'
10 @context @deep-research @ai-council @markdown @review @deep-review @code @debug @design @prompt-improver
$ node .skilled/bin/sync-agent-roster.cjs --check
agent-roster: OK
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the eight names on the `Agent:` line with a bracketed instruction to name one agent from the generated routing table in section 2 of the same file
- Check that the `Subagent Type:` line below it, which says `the Agent line without the @`, still reads correctly against the new line
- Regenerate the runtime copies of `orchestrate.md` with the mirror sync the repository already has
- Run the roster check and the mirror check from the final state

### Out of Scope
- A fourth generated block or a generated line - the pointer leaves nothing to generate, and a block marker inside a code fence would be copied into every task package as literal text
- Changing `agent-registry.json` or `sync-agent-roster.cjs` - neither is wrong
- The other placeholder lines of the task template - only the `Agent:` line holds a roster
- Changing which agents the orchestrator may dispatch - the routing table already lists all ten

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/orchestrate.md` | Modify | The `Agent:` line of the task template |
| `.claude/agents/orchestrate.md`, `.codex/agents/`, `.pi/agents/`, `.cursor/agents/`, `.devin/agents/`, `.dsh/agents/` | Regenerate | Runtime copies of the changed file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `Agent:` line of the task template names no agent by hand. | `rg -c '^├─ Agent: @code . @context' .skilled/agents/orchestrate.md` prints no line |
| REQ-002 | The line tells the orchestrator where the valid names are. | `rg -c '^├─ Agent: \[.*routing table' .skilled/agents/orchestrate.md` prints 1 |
| REQ-003 | The generated routing table the line points at names the two agents the hand-typed list left out. | `rg -c '@design' .skilled/agents/orchestrate.md` and `rg -c '@prompt-improver' .skilled/agents/orchestrate.md` each print 3, the count before the change |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The roster check and the agent mirror check pass from the final state. | `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, and `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync` and exits 0 |
| REQ-005 | Only the one line changes in `orchestrate.md`. | `git diff --numstat` against the commit before the edit reports 1 line added and 1 line removed for `.skilled/agents/orchestrate.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sed -n 211p .skilled/agents/orchestrate.md` prints a line that starts `├─ Agent: [` and holds no `@code`.
- **SC-002**: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and exits 0.
- **SC-003**: `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The command that writes the runtime copies of an agent file | The mirror check fails in CI when a copy is stale | T002 finds that command before the edit, from `.skilled/bin/agent-mirror-crosswalk.md` and the `/doctor:runtime-mirrors` command, and T004 runs it |
| Risk | An orchestrator picks an agent less reliably from a pointer than from a list on the line itself | Med | The routing table sits in the same file and carries the task type for each agent, which the hand-typed list never did. The alternative in section 7 stays open if a run shows a wrong pick |
| Risk | The outline or shared-block check in the roster script fails on the edited file | Low | The edit is inside a fenced block and touches no heading. REQ-004 runs the check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How should the line stop drifting: a pointer, or a line the roster script writes from the registry? Decision at planning: the pointer. It changes one existing value and adds no code. The generated line would add a fourth block kind to `sync-agent-roster.cjs` and its test, and no failure of the pointer is known that would justify it. Operator answer: the pointer (2026-11-14).
- The alternative not taken, kept in case a run shows a wrong pick: the script finds the line by its `├─ Agent: ` prefix inside the fence, with no marker comments, writes the ten names in priority order, and `--check` fails when the line differs. Files to Change then gains `.skilled/bin/sync-agent-roster.cjs` and `.skilled/bin/sync-agent-roster.vitest.ts`.
- Corrections made during implementation, 2026-11-14. The generated routing table sits in section 2 of `orchestrate.md`, not section 3 as the plan first said. The search `rg -c '^├─ Agent: @code'` also matches an example task at line 405 of the file, so it printed 2 before the change and 1 after. The acceptance search is now `'^├─ Agent: @code . @context'`, which matches only the template line. The local `main` ref in the worktree is stale, so line counts are taken against the commit before the edit.
<!-- /ANCHOR:questions -->

---
