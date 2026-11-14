---
title: "Feature Specification: Phase 2: deepseek-harness-persona-probe"
description: "The DeepSeek Harness dispatch rule requires inlining the agent persona, and the harness documents name no read tool. Nobody has run a harness child with a read-only persona, so whether it reads files is unknown. This phase runs one probe and one control and records the verdict."
trigger_phrases:
  - "deepseek harness persona probe"
  - "phase 2 deepseek harness persona probe"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: deepseek-harness-persona-probe

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-fanout-persona-tool-mapping |
| **Successor** | 003-orchestrate-task-package-agent-names |
| **Handoff Criteria** | `scratch/verdict.md` holds one `verdict:` line backed by the control and probe reports |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the agent alignment follow-ups packet.

**Scope Boundary**: One read-only `dsh` dispatch shape with the inlined `context` persona, and rule 7 of the harness skill. The agent files, the harness patches and the fan-out runner do not change.

**Dependencies**:
- None from the other phases. The phase needs `dsh` at its pinned version and the key variable of one roster route set in the environment.

**Deliverables**:
- One recorded control run without a tool-mapping line
- One recorded probe run with a tool-mapping line that names the harness's own tools
- One recorded verdict: `no-line-needed`, `needs-line` or `unresolved`
- On `needs-line` only: the requirement and its literal text in rule 7 of the harness skill
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Rule 7 of `cli-deepseek-harness/SKILL.md` requires every dispatch to inline the agent persona, and the personas name Read, Grep and Glob. The harness documents name four tools, `bash`, `write`, `edit` and `subagent`, and none of them is a read tool. The predecessor packet marked the harness `needs the line` from that absence alone, with no run behind it. An orchestrator that inlines a read-only persona today cannot tell whether the child will read its files or return at exit 0 having read nothing.

### Purpose
One live control and one live probe show whether a harness child given a read-only persona reads the file it is asked to read, and the harness skill says what the runs showed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c -i 'tool mapping' .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md || echo 0
0
$ rg -n -o 'Harness tool names are lowercase \([^)]*\)' .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md
61:Harness tool names are lowercase (`bash`, `write`, `edit`, `subagent`)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the tool names the harness gives the model, read from the harness itself and not from the documents
- Save a control prompt with the child-dispatch preamble, the `context` persona and one read task, and a probe prompt that adds a tool-mapping line above the persona
- Run each prompt once through the documented read-only dispatch shape and judge each by the `FILES READ:` line of its final message
- Record the verdict with both report files, the `dsh` version and the route used
- On `needs-line` only, add the tool-mapping requirement and its literal text to rule 7, with the packet version and changelog entry the hub's version rule requires

### Out of Scope
- Changing `context.md` or any other agent file - the persona is correct for the runtimes that have its tools
- Changing the fan-out runner's harness lineage - it passes a generated persona patch, a different path from an inlined persona
- Changing the canonical persona-injection contract - it already states the rule for every CLI whose tools differ
- A write dispatch - the question is whether a read-only persona reads

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/` | Create | Baseline, two prompts, two reports and the verdict |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` | Modify, on `needs-line` only | Tool-mapping requirement in rule 7 and the version |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/changelog/` | Create, on `needs-line` only | One entry for the new packet version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The control run, with the `context` persona and no mapping line, is recorded and judged by its final message. | `rg -c '^FILES READ:' scratch/dsh-control-report.txt` prints 1 |
| REQ-002 | The probe run, with a mapping line that names the harness's own tools, is recorded and judged the same way. | `rg -c '^FILES READ:' scratch/dsh-probe-report.txt` prints 1 |
| REQ-003 | Each run counts only when it exited 0 and its last `final` event has `reason.kind` `completed`. | `scratch/verdict.md` states the exit code and the reason kind of both runs |
| REQ-004 | The verdict is one of three words and follows from the two reports: `no-line-needed` when the control names the file, `needs-line` when only the probe names it, `unresolved` when neither does. | `rg -c '^verdict: ' scratch/verdict.md` prints 1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | On `needs-line`, rule 7 requires the mapping line above an inlined persona and gives the literal text. On the other two verdicts the skill is not edited. | On `needs-line`: `rg -c -i 'tool mapping' .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` prints 1 or more. Otherwise: `git diff --stat main -- .skilled/skills/cli-external-orchestration` prints nothing |
| REQ-006 | Neither dispatch reads a key from the repository root or carries a credential in its prompt. | Both runs start in a scratch directory outside the checkout with `DSH_HOME` set inside it, and a search of both prompts for `api_key` and `token=` prints no line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c '^verdict: ' scratch/verdict.md` prints 1.
- **SC-002**: `scratch/dsh-control-report.txt` and `scratch/dsh-probe-report.txt` each end with a `FILES READ:` line.
- **SC-003**: On `needs-line`, `rg -c -i 'tool mapping' .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` prints 1 or more, up from 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `dsh` at the pinned version and one roster route's key variable set | No live run, so no verdict | T002 runs the availability and version checks from the skill. A missing key marks the run tasks `[B]` and names the variable to the operator. No `.env` file is opened |
| Risk | One run each way is one sample, and the Codex failure this finding came from was intermittent | Med | The verdict file states the sample size. `no-line-needed` is recorded as observed once, not as proven |
| Risk | A dispatch started in the checkout root reads the root `.env` | High | Both runs use a scratch cwd outside the checkout and a fresh `DSH_HOME`, as rules 4 and 2 of the skill's NEVER list require |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which tools does the harness give the model for reading? UNKNOWN from the documents. Decision: T003 reads them from the harness, and the probe's mapping line is written from that list.
- What happens on `unresolved`? Decision: the phase records both reports and stops. Neither rule text nor a guess is added, and the operator is asked how to proceed.
<!-- /ANCHOR:questions -->

---
