---
title: "Feature Specification: Phase 14: prompt-improver-model-eligibility"
description: "The prompt-improver agent tells Opus and Fable to refuse its only job, yet none of its dispatchers pass a model and the Claude tree pins none, so a session on those models can dispatch it into a refusal. Its output contract also offers a test result it can never produce, and it names a caller and a command spelling the registry does not use."
trigger_phrases:
  - "prompt improver model eligibility"
  - "phase 14 prompt improver model eligibility"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: prompt-improver-model-eligibility

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-context-markdown-design-fixes |
| **Successor** | None |
| **Handoff Criteria** | prompt-improver-2 and prompt-improver-3 ship with the command outputs behind them. prompt-improver-1 ships the outcome the operator picked. The mirror and roster checks pass on the final tree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the agent alignment follow-ups packet. It owns the three `## prompt-improver` findings of the 2026-11-14 agent review.

**Scope Boundary**: The `@prompt-improver` agent and its runtime copies, the `sk-prompt` skill's agent contract section and its changelog, and for outcome A of prompt-improver-1 only the two `/prompt:improve` workflow files, the agents README and the mirror crosswalk. The agent's section 0 nesting boundary is not edited here, because phase 006 owns the canonical refusal wording for every LEAF agent.

**Dependencies**:
- Phase 006 (shared agent contract) decides the canonical refusal string and the budget rules. This phase builds after 006 lands, re-reads `prompt-improver.md` and reuses that string for any refusal it keeps.
- The operator's answer to the open question in section 7, recorded 2026-11-14 as outcome A. prompt-improver-1 builds to it. prompt-improver-2 and prompt-improver-3 do not wait.

**Deliverables**:
- The model eligibility rule moved to the dispatch side, or dropped, as the operator decides
- A `TEST` field that the agent always fills with `NOT RUN`, in the agent and in the skill's copy of its contract
- The registry's caller and command names in the agent, and no Integration ID table
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Section 0.1 of `prompt-improver.md` denies Opus and Fable on any route and tells an ineligible model to refuse the work. The `/prompt:improve` workflow dispatches the agent with no model, and the Claude tree pins none for it, so a Claude session on Opus that does not pass a model can dispatch the agent into a refusal of its only job. The `TEST` field of its output offers a summary of a run the agent is forbidden to make, and its caller tables name `@general-purpose` and `/prompt-improve` where the registry names `orchestrate` and `/prompt:improve`.

### Purpose
The agent states only what it can do: the dispatcher owns the model choice or the rule is gone, `TEST` reads `NOT RUN` and every caller it names is one the registry names.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from the worktree root at `c1dbb1bcc4`. The review's line numbers were taken at `09f1d6499a`. The diff below prints nothing, so they still hold.
```text
$ git diff --stat 09f1d6499a c1dbb1bcc4 -- .skilled/agents/prompt-improver.md .claude/agents/prompt-improver.md
(no output)
$ wc -l .skilled/agents/prompt-improver.md .claude/agents/prompt-improver.md
     399 .skilled/agents/prompt-improver.md
     384 .claude/agents/prompt-improver.md

## prompt-improver-1
$ sed -n '53,54p;73p' .skilled/agents/prompt-improver.md
| any route | Opus | No | Denied under no circumstances |
| any route | Fable | No | Denied under no circumstances |
An ineligible model that finds itself acting as this agent must refuse the prompt-improve work, name the rule that denied it, and name an eligible (model, route) pair in its place. It must not do the work anyway with a caveat.
$ sed -n 14,16p .skilled/agents/README.txt
Model and effort: no agent file here pins a model. Dispatched routes pass model and effort
  explicitly; manual invocation inherits the runtime default, so a silent tree means no pin,
  not an unowned setting.
$ rg -n '^model' .claude/agents/prompt-improver.md .pi/agents/prompt-improver.md .dsh/agents/prompt-improver.patch.yml .codex/agents/prompt-improver.toml
.codex/agents/prompt-improver.toml:6:model = "gpt-6-luna"
.codex/agents/prompt-improver.toml:7:model_reasoning_effort = "high"
$ rg -c -i model .skilled/commands/prompt/assets/prompt_improve_auto.yaml .skilled/commands/prompt/assets/prompt_improve_confirm.yaml
(no output, exit 1: no line in either file names a model)
$ sed -n 85p .skilled/commands/prompt/assets/prompt_improve_auto.yaml
      - "dispatch_mode AGENT: dispatch Task(subagent_type=prompt-improver) with raw_task, task_type, complexity_hint, constraints; capture FRAMEWORK, CLEAR_SCORE, TEST, CHANGES, RATIONALE, ENHANCED_PROMPT, ESCALATION_NOTES."
$ sed -n 106p .skilled/commands/prompt/assets/prompt_improve_confirm.yaml
      - "dispatch_mode AGENT: dispatch Task(subagent_type=prompt-improver) with raw_task, task_type, complexity_hint, constraints; capture FRAMEWORK, CLEAR_SCORE, TEST, CHANGES, RATIONALE, ENHANCED_PROMPT, ESCALATION_NOTES."
$ git log -S'Denied under no circumstances' --format='%h %ad %s' --date=short -- .skilled/agents/prompt-improver.md .opencode/agents/prompt-improver.md
f2ed64975c 2026-09-11 feat(agents): gate prompt-improver on eligible model and route pairs
$ git show -s --format=%B f2ed64975c   (first paragraph and trailer)
Context: this agent produced weaker output on some models, and the failure was
not a property of the model alone but of the pairing with the route it arrived
through.
Spec: sk-prompt/009-prompt-improver-model-eligibility

## prompt-improver-2
$ sed -n '40p;84p;177p;204p;231p' .skilled/agents/prompt-improver.md
- NEVER execute the prompt it constructs. This agent returns a dispatch-ready package; the caller dispatches it.
4. **VALIDATE** → Apply the CLEAR screen, repair up to 3 cycles if the prompt misses the threshold, record the quick test result or NOT RUN, and verify that no unsupported repo, policy, integration, or completion claim slipped in
    │   └─► Run the thorough checklist + quick test + CLEAR screening
- Never execute, test, or claim completion of the enhanced prompt's underlying task.
TEST: <ran: summary of old vs new on 2-3 inputs | NOT RUN>
$ sed -n '9,10p;16p' .skilled/agents/prompt-improver.md
  edit: deny
  bash: deny
  task: deny

## prompt-improver-3
$ rg -n 'general-purpose|/prompt-improve\b' .skilled/agents/prompt-improver.md
102:| `INT-CALLER-GENERAL` | `@general-purpose` | Primary caller/orchestrator may dispatch this specialist and then dispatch the returned prompt elsewhere; this agent does not call back or delegate |
103:| `INT-CMD-PROMPT-IMPROVER` | `/prompt-improve` via `.skilled/commands/prompt/improve.md` | Command surface routes prompt-improvement work to inline or agent flow; returned output must remain the exact structured package |
118:| `@general-purpose` | `INT-CALLER-GENERAL` | Primary caller/orchestrator that may dispatch this specialist for a prompt package |
124:| `/prompt-improve` | `INT-CMD-PROMPT-IMPROVER` | Shared prompt-improvement command surface with inline vs agent routing | `.skilled/commands/prompt/improve.md` |
205:- Never invoke, simulate, or claim results from `/prompt-improve`, target CLIs, skills, MCP tools, or caller agents.
281:caller_agent: <@general-purpose|other caller>           # optional
282:command_surface: </prompt-improve|other command>       # optional
397:(the related-resources line naming the `/prompt-improve` command surface)
$ node -e '...agent-registry.json, prompt-improver dispatchers'
/prompt:improve, orchestrate
$ ls .codex/prompts/prompt-improve.md .pi/prompts/prompt-improve.md .cursor/commands/prompt-improve.md
.codex/prompts/prompt-improve.md
.cursor/commands/prompt-improve.md
.pi/prompts/prompt-improve.md
$ rg -c 'INT-[A-Z-]+|Integration ID' .skilled/agents/prompt-improver.md
17
$ rg -l 'INT-(CALLER-GENERAL|CMD-PROMPT-IMPROVER|SKILL-PROMPT-IMPROVER|SKILL-SK-DOC|TARGET-CLI|MCP-CALLER-SUPPLIED|RUNTIME-MIRRORS)' .skilled .claude .codex .pi .dsh | sort
.claude/agents/prompt-improver.md
.codex/agents/prompt-improver.toml
.dsh/agents/prompt-improver.patch.yml
.pi/agents/prompt-improver.md
.skilled/agents/prompt-improver.md
.skilled/skills/sk-prompt/changelog/v3.0.10.0.md

## mirror baseline
$ node .skilled/bin/check-agent-mirror-sync.cjs | tail -1   (the tool prints two long dashes, written here as hyphens)
agent-mirror-sync: 11 agent(s) checked - all comparable mirrors in sync - OK   (exit 0)
$ node .skilled/bin/sync-agent-roster.cjs --check
agent-roster: OK
```
<!-- /ANCHOR:measured-behavior -->

### Finding Classification

| Finding | Class | Evidence |
|---------|-------|----------|
| prompt-improver-1 | Operator answered A, 2026-11-14 | The deny rows and the refusal rule hold at `prompt-improver.md:53-54` and `:73`. No dispatcher passes a model and the Claude, Pi and harness copies pin none. The Codex copy pins `gpt-6-luna`, an eligible pair, so the claim "no agent pins a model" holds for every tree except `.codex`. Whether a Claude Code dispatch with no model runs on the parent session's model is inferred, not measured. The deny rows came from `f2ed64975c` as operator policy, so the fix followed the operator's answer in section 7: outcome A |
| prompt-improver-2 | Reproduced | `:231` offers `ran: summary of old vs new`, while `:40` and `:204` forbid running or testing the prompt and the frontmatter denies `bash` and `task`. `:84` and `:177` still tell the agent to run the quick test |
| prompt-improver-3 | Partly reproduced | `@general-purpose` at `:102`, `:118` and `:281` is not a registry dispatcher. `/prompt-improve` is the Codex, Cursor and Pi spelling of the command, not a dead name, but the canonical agent should use `/prompt:improve` as the registry does. No file outside the agent and one old changelog reads an `INT-*` id. The table is not dead on its own, though: `:171`, `:233` and `:334` tell the agent to cite Integration IDs, so those lines go with it |

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Settle prompt-improver-1 by the operator's outcome. Outcome A keeps the policy and moves the model choice to the dispatch side. Outcome B drops the policy
- Fix the agent's `TEST` field to `NOT RUN` and remove the two lines that tell it to run the quick test, in the agent and in the skill's copy of the agent contract
- Replace `@general-purpose` with `@orchestrate` and `/prompt-improve` with `/prompt:improve` in the agent
- Delete the Integration Touchpoint table and the three lines and table columns that cite its ids
- Regenerate every runtime copy of the agent and record the skill change in a new `sk-prompt` changelog entry

### Out of Scope
- The agent's section 0 nesting boundary at `:36-43` - phase 006 owns the canonical refusal wording for every LEAF agent
- A machine check that rejects an ineligible model at dispatch - packet `sk-prompt/009` found no model signal to read at dispatch time
- The drift between the DeepSeek Harness row of `SKILL.md:244` and `prompt-improver.md:62`, and the crosswalk's stale `gpt-5.5` - outside the owned findings, reported to the orchestrator
- The `cli-*` executor skills and `cli-prompt-quality-card.md` that also dispatch the agent - they inherit the Claude pin under outcome A and need no text change

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/prompt-improver.md` | Modify | Section 0.1, the `TEST` field and the two quick-test lines, the caller and command names, the Integration ID table, columns and citing lines |
| `.claude/agents/prompt-improver.md` | Modify | Hand-edited to match. Outcome A also adds `model: sonnet` to its frontmatter |
| `.pi/agents/prompt-improver.md`, `.codex/agents/prompt-improver.toml`, `.dsh/agents/prompt-improver.patch.yml` | Regenerate | By the three sync scripts |
| `.skilled/skills/sk-prompt/SKILL.md` | Modify | The Model Eligibility subsection, its canonical-home line, the agent output block's `TEST` field and the version |
| `.skilled/skills/sk-prompt/changelog/v4.0.5.0.md` | Create | The entry for the skill change |
| `.skilled/commands/prompt/assets/prompt_improve_auto.yaml`, `prompt_improve_confirm.yaml` | Modify | Outcome A only: the AGENT dispatch passes `model=sonnet` |
| `.skilled/agents/README.txt`, `.skilled/bin/agent-mirror-crosswalk.md` | Modify | Outcome A only: name the new Claude pin where both list the pins |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every runtime copy of the agent agrees with the canonical file after each edit, and the agent stays at or below 600 lines. | `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync` and exits 0, `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, and `wc -l .skilled/agents/prompt-improver.md` prints 600 or less |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Outcome A, the operator's answer of 2026-11-14 in section 7: the dispatcher chooses an eligible model and the agent no longer carries the table. | `rg -c 'Denied under no circumstances' .skilled/agents/prompt-improver.md` prints 0 or exits 1, the same search on `.skilled/skills/sk-prompt/SKILL.md` prints 2, `rg -n '^model: sonnet' .claude/agents/prompt-improver.md` prints one line and `rg -c 'subagent_type=prompt-improver, model=sonnet'` prints 1 for each workflow file. |
| REQ-003 | The agent's `TEST` field is always `NOT RUN`, and no line tells the agent to run the quick test. | `rg -n '^TEST: ' .skilled/agents/prompt-improver.md` prints one line ending `NOT RUN` with no `ran:` in it, `rg -c 'quick test' .skilled/agents/prompt-improver.md` prints 0 or exits 1, and `rg -c 'ran: summary' .skilled/skills/sk-prompt/SKILL.md` prints 0 or exits 1 |
| REQ-004 | The agent names only the registry's callers and the canonical command spelling. | `rg -c 'general-purpose\|/prompt-improve\b' .skilled/agents/prompt-improver.md` exits 1, and `rg -c '/prompt:improve' .skilled/agents/prompt-improver.md` prints 1 or more |
| REQ-005 | The Integration Touchpoint table and every line that cites its ids are gone. | `rg -c 'INT-[A-Z]\|Integration ID' .skilled/agents/prompt-improver.md` exits 1 |
| REQ-006 | The `sk-prompt` change ships with a version and a changelog entry that agree. | `sed -n 5p .skilled/skills/sk-prompt/SKILL.md` prints `version: 4.0.5.0`, and `check_changelog_shape.py` on `v4.0.5.0.md` prints `pass=1 fail=0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every acceptance command in section 4 prints its expected output on the final tree, with REQ-002 checked against the outcome the operator picked.
- **SC-002**: Under outcome A, a `@prompt-improver` dispatch from a Claude Code session on Opus with a trivial `raw_task` returns a structured package, not a refusal.
- **SC-003**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 edits the same agent file for the canonical refusal | A build before 006 lands would conflict on the same lines | Build after 006, re-read the file and re-run the Measured Behavior commands before the first edit |
| Dependency | The operator's answer on the deny rows | Resolved 2026-11-14: outcome A | REQ-002 builds to outcome A |
| Risk | A Claude Code dispatch with no model may already run on the default subagent model, not the parent's | High: prompt-improver-1 would not reproduce on Claude Code, and outcome A's pin would add nothing there | The first REQ-002 task runs the Opus probe of SC-002 before any edit and records the result |
| Risk | Outcome A pins a model in one tree only | Medium: an OpenCode or Pi session on Opus still reaches the agent's backstop refusal | The backstop names an eligible pair, so the caller can re-dispatch, and the operator sees this limit in the question |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Operator answer, 2026-11-14: A.** Keep the rule and move it to the dispatcher. REQ-002 is unblocked and builds outcome A.
- The question was: are the Opus and Fable deny rows deliberate policy that stays? `git log -S` finds them added by `f2ed64975c` on 2026-09-11, packet `sk-prompt/009-prompt-improver-model-eligibility`. Its stated reason: "this agent produced weaker output on some models, and the failure was not a property of the model alone but of the pairing with the route it arrived through". That packet's spec calls it a view the operator holds and ranks it P0. A) Keep it and move the choice to the dispatcher: the workflow passes `model=sonnet`, the Claude copy pins `model: sonnet`, the table lives in `sk-prompt` `SKILL.md` only and the agent keeps a one-line backstop refusal in phase 006's canonical form. B) Drop it: section 0.1 and the skill's Model Eligibility subsection are deleted. Recommended: A, because the git record shows a deliberate operator decision.
- Does a Claude Code `Task` dispatch with no `model` run on the parent session's model? Not measured, because a leaf cannot dispatch. The build answers it with the SC-002 probe before any REQ-002 edit.
<!-- /ANCHOR:questions -->

---
