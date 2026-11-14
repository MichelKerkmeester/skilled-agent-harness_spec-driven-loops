---
title: "Feature Specification: Phase 13: context-markdown-design-fixes"
description: "Three agents carry instructions they cannot follow. @context is told to Read a 5.2 MB index with no Bash to run its lookup, @markdown binds a template before it has read one and may self-score its DQI. @design names four paths but routes only two. This phase fixes the eleven review findings for these agents, ten in full and one in part."
trigger_phrases:
  - "context markdown design fixes"
  - "phase 13 context markdown design fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: context-markdown-design-fixes

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
| **Phase** | 13 of 14 |
| **Predecessor** | 012-review-agent-gates |
| **Successor** | 014-prompt-improver-model-eligibility |
| **Handoff Criteria** | Every requirement in section 4 holds on `.skilled/agents/` and on each generated or hand-edited runtime copy, the roster check prints `agent-roster: OK` and the mirror check exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the agent alignment follow-ups packet.

**Scope Boundary**: The three agent files `context.md`, `markdown.md` and `design.md` under `.skilled/agents/`, the `.claude/agents/` fork of each and the Pi, Codex and harness copies the sync scripts regenerate. The agent template, the registry, `orchestrate.md` and every skill file stay as they are.

**Dependencies**:
- Phase 006 lands first. It owns the untrusted-content rule that `context.md` lacks, the self-score rule that sets how an unscored output reports DQI and the decision on the "Daemon-free retrieval" paragraph at `context.md:77`, next to this phase's `:79` edit.
- Phase 008 lands first. It edits `orchestrate.md`, whose line 560 checks that a Context Package carries the Nested Dispatch Status section this phase keeps.

**Deliverables**:
- `context.md` that reaches trigger phrases with the tools it holds, states its corpus recipe as Grep parameters and cites only `path:line`
- `markdown.md` that binds the template after reading it, names its DQI scorer and lists commands once
- `design.md` that routes all four of its paths and keeps its NEVER rules over a dispatch prompt
- Runtime copies of all three that match, with the roster and mirror checks green
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A read-only review of the eleven agent files found eleven problems in these three agents, and at `c1dbb1bcc4` ten reproduce in full and one in part. `context.md` tells the agent three times to Read `trigger-index.json`, a 5,207,554-byte file whose phrase map starts at line 18893, and the lookup CLI that reads it needs `node`, which a Bash-denied agent cannot run. It also hands the agent a shell recipe with exit codes, a template that asks for record IDs no lexical search produces and a status line that never changes. `markdown.md` emits `BINDING: template=` before step 5 reads the template and allows a self-assigned DQI that `sk-create-quality-control` forbids. It lists a `memory` tool it is not granted and repeats its command list three times. `design.md` names four paths and routes two, lets a dispatch prompt override a NEVER rule and leaves its edit scope against `@code` unstated.

### Purpose
Each agent can do what its file tells it to do with the tools it holds, and each of the eleven findings ends as a shipped fix or a recorded part with no edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git rev-parse --short HEAD
c1dbb1bcc4
$ git diff --stat 09f1d6499a HEAD -- .skilled/agents/context.md .skilled/agents/markdown.md .skilled/agents/design.md | wc -l
0
$ wc -l .skilled/agents/context.md .skilled/agents/markdown.md .skilled/agents/design.md
     438 .skilled/agents/context.md
     307 .skilled/agents/markdown.md
     244 .skilled/agents/design.md
     989 total
$ wc -c -l .skilled/skills/system-spec-kit/runtime/data/trigger-index.json
  159975 5207554 .skilled/skills/system-spec-kit/runtime/data/trigger-index.json
$ rg -n '"paths": \[|"phrases": \{' <trigger-index.json>
12:  "paths": [
18893:  "phrases": {
$ rg -n -o 'Read.{0,6}\.skilled/skills/system-spec-kit/runtime/data/trigger-index\.json' .skilled/agents/context.md
73:Read` on `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json
79:Read `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json
183:Read `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json
$ rg -n -o 'bash: deny' .skilled/agents/context.md
10:bash: deny
$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "agent registry step"  (results counted)
exit=0
results=5
exact .skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md
token-overlap specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/implementation-summary.md
token-overlap specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/plan.md
token-overlap specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/spec.md
token-overlap specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/tasks.md
$ rg -n --no-config -i --glob '*.md' --glob '!**/z_archive/**' --glob '!**/scratch/**' '^\s*- "[^"]*agent registry step' specs .skilled/skills .skilled/hooks .skilled/changelog/skilled
.skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md:7:  - "agent registry step"
exit=0
$ rg -n -o 'rg --no-config --fixed-strings|Add .-C 2. and .--json.|Exit .1. is a clean no-hit' .skilled/agents/context.md
206:rg --no-config --fixed-strings
207:Add `-C 2` and `--json`
209:Exit `1` is a clean no-hit
$ rg -n -o 'Record #\[ID\]|memory ID' .skilled/agents/context.md
252:Record #[ID]
253:Record #[ID]
355:memory ID
379:memory ID
$ rg -n -o '_No sub-agents dispatched \(policy\)_|Nested Dispatch Status says no sub-agents were dispatched' .skilled/agents/context.md
270:_No sub-agents dispatched (policy)_
359:Nested Dispatch Status says no sub-agents were dispatched
$ rg -n -o 'includes Nested Dispatch Status section' .skilled/agents/orchestrate.md
560:includes Nested Dispatch Status section
$ rg -n '^## [0-9]' .skilled/agents/context.md
37:## 0. ILLEGAL NESTING AND WRITE BOUNDARY (HARD BLOCK)
49:## 1. CORE WORKFLOW
63:## 2. CAPABILITY SCAN
133:## 3. HOOK-INJECTED CONTEXT ROUTING
141:## 4. RETRIEVAL PARAMETERS
167:## 5. RETRIEVAL STRATEGY
216:## 6. NESTING ENFORCEMENT DETAILS
241:## 7. OUTPUT FORMAT
315:## 8. INTEGRATION WITH ORCHESTRATOR
350:## 9. OUTPUT VERIFICATION
375:## 10. RULES & CONSTRAINTS
413:## 11. ANTI-PATTERNS
433:## 12. RELATED RESOURCES
$ rg -n -o 'BEFORE any state read or workflow step|BINDING: template=|LOAD TEMPLATE|LOAD sk-doc' .skilled/agents/markdown.md
118:BEFORE any state read or workflow step
126:BINDING: template=
140:LOAD sk-doc
141:LOAD TEMPLATE
$ rg -c template_path .skilled/commands/create
exit=1
$ rg -n -o 'BEFORE any state read or workflow step' .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md
281:BEFORE any state read or workflow step
598:BEFORE any state read or workflow step
$ rg -n -o 'DQI=<manual-score>|extract_structure' .skilled/agents/markdown.md
252:DQI=<manual-score>
$ rg -n -o 'Never claim a DQI score without running or reading .extract_structure.py. output' .skilled/skills/sk-doc/sk-create-quality-control/SKILL.md
99:Never claim a DQI score without running or reading `extract_structure.py` output
$ python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py <file>  (type and dqi.total read from the JSON)
.skilled/skills/sk-doc/sk-create-agent/README.md exit=0 type=readme dqi.total=99
.skilled/commands/create/assets/create-agent-auto.yaml exit=0 type=command dqi.total=41
$ rg -n -o '^\| .memory. ' .skilled/agents/markdown.md
170:| `memory` 
$ sed -n 6,19p .skilled/agents/markdown.md | rg -c memory
exit=1
$ rg -n '^tools:' .claude/agents/markdown.md
5:tools: Read, Write, Edit, Bash, Grep, Glob
$ rg -n -o 'thirteen valid' .skilled/agents/markdown.md
101:thirteen valid
$ sed -n 50,67p .skilled/agents/markdown.md | rg -c '^- ./create:'
13
$ sed -n 207,223p .skilled/agents/markdown.md | rg -c '^\| ./create:'
13
$ ls .skilled/commands/create/*.md | rg -cv README
13
$ rg -n -o 'which of the four a request is|-> (MEASURE|DECIDE)|DECIDE, MEASURE, or both|Decide measure-versus-decide|/design:(chart|diagram)' .skilled/agents/design.md
24:which of the four a request is
58:-> MEASURE
65:-> DECIDE
73:-> MEASURE
130:/design:chart
132:/design:diagram
171:DECIDE, MEASURE, or both
183:Decide measure-versus-decide
$ rg -n -o '"(workflowMode|command)": "[^"]+"' .skilled/skills/sk-design/mode-registry.json
13:"workflowMode": "sk-design-md-generator"
34:"command": "/design:extract"
49:"workflowMode": "sk-design-diagram"
70:"command": "/design:diagram"
105:"workflowMode": "sk-design-chart"
126:"command": "/design:chart"
$ rg -n -o 'follow the prompt and report the conflict|Write a Style Reference from a brief alone' .skilled/agents/design.md
87:follow the prompt and report the conflict
192:Write a Style Reference from a brief alone
$ rg -n -o '^\s+(write|edit): allow|to an interface|.code. implements the values this agent decides|hands the author gates to .sk-code-quality.' .skilled/agents/design.md
8:  write: allow
9:  edit: allow
65:to an interface
97:hands the author gates to `sk-code-quality`
134:`code` implements the values this agent decides
$ rg -n -o 'pause and ask the user' .skilled/skills/sk-design/sk-design-diagram/SKILL.md
67:pause and ask the user
$ rg -n -o 'Ask the user questions when the next safe step is clear' .skilled/agents/design.md
197:Ask the user questions when the next safe step is clear
$ node .skilled/bin/sync-agent-roster.cjs --check
agent-roster: OK
exit=0
$ node .skilled/bin/check-agent-mirror-sync.cjs > out.txt
exit=0
$ rg -o 'all comparable mirrors in sync' out.txt
all comparable mirrors in sync
$ bash specs/agents/007-agent-alignment-follow-ups/013-context-markdown-design-fixes/scratch/negative-checks.sh
REQ-001 context: 3 3 3 3 3
REQ-002 design: 2 2 2 2 2
REQ-004 context: 3 3 3 3 3
REQ-005 context: 4 4 4 4 4
REQ-006 context: 2 2 2 2 2
REQ-008 markdown: 1 1 1 1 1
REQ-009 markdown: 1 1 1 1 1
REQ-010 markdown: 1 1 1 1 1
exit=0
```
<!-- /ANCHOR:measured-behavior -->

### Finding Classification

| Finding | Class | Evidence |
|---------|-------|----------|
| context-1 | reproduced | Read of the index at `context.md:73`, `:79` and `:183`. The file is 159,975 lines and 5,207,554 bytes, and its phrase map starts at line 18893. The report's 159,371 lines is now 159,975. The lookup CLI runs through `node` and Bash is denied at `:10`, so the CLI is not an instruction this agent can follow |
| context-2 | reproduced | Shell recipe at `:206`, `--json` at `:207` and exit codes at `:209`, with Bash denied at `:10` |
| context-3 | reproduced | `Record #[ID]` at `:252-253` and `memory ID` at `:355` and `:379` |
| context-4 | partly reproduced | The constant status line at `:270` and its checklist item at `:359` hold. §6 restates §0 `:41-45`, §2 `:88` and §10 `:408`, except one clause at `:226`. Dropping the whole Nested Dispatch Status section does not hold up: its `Boundary:` line reports refused requests, a caller can check it and `orchestrate.md:560` requires the section |
| markdown-1 | reproduced | Bindings at `markdown.md:118` come before step 5 at `:141`. `BINDING: template=` is at `:126`, and no `/create:*` workflow passes `template_path` |
| markdown-2 | reproduced | `DQI=<manual-score>` at `:252`, no scorer named, against `sk-create-quality-control/SKILL.md:99` |
| markdown-3 | reproduced | `memory` row at `:170`. The frontmatter at `:6-19` and the `.claude` tool list grant no such tool |
| markdown-4 | reproduced | Thirteen commands at `:52-64`, again in §5 and counted at `:101`. All three agree with the 13 files on disk today, so this is a drift risk, not a current error |
| design-1 | reproduced | Four paths at `design.md:24`, branches only to MEASURE and DECIDE at `:58-73`, `:171` and `:183`. Chart and diagram appear only at `:129-132` |
| design-2 | reproduced | `:87` follows the prompt over `:192` NEVER |
| design-3 | reproduced | Write and edit allowed at `:8-9`, an interface change routed here at `:64-65`, against `:134`. `:97` names no command |

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace every Read of `trigger-index.json` in `context.md` with one trigger-phrase Grep lane defined once in §2, and restate the §5 corpus recipe as Grep parameters with no exit codes
- Make the Context Package cite `path:line`, remove its constant status line and fold §6 into §0
- Move `BINDING: template=` to after step 5 in `markdown.md`, name `extract_structure.py` as the DQI source, delete the `memory` row and list the `/create:*` commands once
- Add CHART and DIAGRAM branches and a Step 2c to `design.md`, carry four paths through its output and gates, keep NEVER rules over the prompt and state its decide-path edit scope with the quality-gate command
- Hand-edit the `.claude/agents/` fork of each file and regenerate the Pi, Codex and harness copies. `.opencode/agents` links to `.skilled/agents` and each `.cursor/agents` file links into `.claude/agents`, so neither needs its own edit

### Out of Scope
- `orchestrate.md:560` - the Nested Dispatch Status section stays, so the check stays true. The file belongs to phase 008
- The untrusted-content sentence for `context.md` and the "Daemon-free retrieval" paragraph at `context.md:77` - phase 006 owns both rules
- The `design` record in `agent-registry.json`, its summary at `agent-template.md:731` and the registry's `context` record that names "Trigger index lookup" - they describe the agents and do not instruct them, and the registry and template belong to other phases
- `agent-template.md:281`, which sets the bind-before-read timing every agent copies - phase 006 owns the template
- `sk-design-diagram/SKILL.md:67`, which asks the user before the first diagram - this phase only says what the LEAF agent does in its place

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/context.md` | Modify | Trigger lane, Grep recipe, `path:line` citations, status line, §6 fold and renumber |
| `.skilled/agents/markdown.md` | Modify | Template binding, DQI source, `memory` row, single command list |
| `.skilled/agents/design.md` | Modify | Four-way routing, Step 2c, NEVER precedence, decide-path edit scope |
| `.claude/agents/context.md`, `markdown.md`, `design.md` | Modify | Hand-edit to match, keeping the `.claude` path convention and frontmatter |
| `.pi/agents/<name>.md`, `.codex/agents/<name>.toml`, `.dsh/agents/<name>.patch.yml` for the three agents | Regenerate | Output of the three sync scripts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

`AG` below means each of `.skilled/agents/<name>.md`, `.claude/agents/<name>.md`, `.pi/agents/<name>.md`, `.codex/agents/<name>.toml` and `.dsh/agents/<name>.patch.yml`. A check on `AG` holds in all five. The `.dsh` copies indent the agent text by six spaces, so a pattern on `AG` anchors with `^\s*`, never a bare `^`. `scratch/negative-checks.sh` runs every negative check on `AG` at once, and at `c1dbb1bcc4` each one matched in all five copies.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | context-1: no line in `context.md` tells the agent to Read `trigger-index.json`. §2 defines the trigger lane once as a Grep for declared `trigger_phrases` entries in `*.md` under `specs`, `.skilled/skills`, `.skilled/hooks` and `.skilled/changelog/skilled`, skipping `z_archive` and `scratch`. It says the lane finds exact declared phrases only, without the CLI's token-overlap ranking | `rg -c 'Read.{0,6}\.skilled/skills/system-spec-kit/runtime/data/trigger-index\.json' AG` exits 1 for context in all five, and `rg -c 'trigger_phrases' .skilled/agents/context.md` prints 1 or more |
| REQ-002 | design-1: the routing tree has CHART and DIAGRAM branches to `sk-design-chart` and `sk-design-diagram`, and a Step 2c names each packet's corpus check with `--extra <dir>` and `validate-flowchart.sh` for ASCII output. §5, §6 ALWAYS and §7 name four paths. Step 2c says that where the diagram packet would ask the user, the agent returns the open style-guide question as remaining work | `rg -c -- '-> (CHART|DIAGRAM)' .skilled/agents/design.md` prints 2, `rg -c '^### Step 2c' .skilled/agents/design.md` prints 1, `rg -c 'check-corpus\.cjs|check-diagram-corpus\.cjs' .skilled/agents/design.md` prints 2 or more, and `rg -c 'DECIDE, MEASURE, or both|measure-versus-decide' AG` exits 1 for design in all five |
| REQ-003 | The rosters and every runtime copy agree after the edits, and each agent file stays at or below 600 lines | `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`. `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and prints `all comparable mirrors in sync`. `wc -l` prints 600 or less for each of the three files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | context-2: §5 Layer 3 states the corpus search as Grep tool parameters that both the OpenCode and the Claude Code Grep tool expose. A case flag that is not common to both becomes an inline `(?i)` in the pattern. It drops the `rg` command line, the `--json` instruction and the exit-code sentence | `rg -c 'rg --no-config|--json|Exit .1. is a clean no-hit' AG` exits 1 for context in all five |
| REQ-005 | context-3: the Memory Context template lines and the two citation rules name `path:line` and no record or memory ID | `rg -c 'Record #|memory ID' AG` exits 1 for context in all five |
| REQ-006 | context-4, the part that holds: the constant status line and its checklist item are gone. The Nested Dispatch Status section keeps its `Boundary:` and `Note:` lines, so the package keeps six sections. §6 is deleted after its one uncovered clause moves into §0, and §7 to §12 become §6 to §11 | `rg -c '_No sub-agents dispatched|NESTING ENFORCEMENT DETAILS' AG` exits 1 for context in all five, `rg -c '^### Nested Dispatch Status' .skilled/agents/context.md` prints 1, and `rg -c '^## [0-9]+\. ' .skilled/agents/context.md` prints one fewer than the T002 baseline, which is 13 at `c1dbb1bcc4` |
| REQ-007 | markdown-1: §0b binds `command`, `target`, `output`, `mode` and `specFolder` before any read. Step 5 of the core workflow emits `BINDING: template=` once it has read the template | `sed -n '/^### Setup BINDING Emission/,/^---/p' .skilled/agents/markdown.md \| rg -c '^BINDING: '` prints 5, and `rg -c 'LOAD TEMPLATE.*BINDING: template=' .skilled/agents/markdown.md` prints 1 |
| REQ-008 | markdown-2: a markdown output's DQI comes from `python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py <file>` and its `dqi.total`. The manual-score fallback is gone. An output the scorer does not fit, such as YAML, reports the form phase 006 sets for unscored outputs | `rg -c 'extract_structure\.py' .skilled/agents/markdown.md` prints 1 or more, and `rg -c 'manual-score' AG` exits 1 for markdown in all five |
| REQ-009 | markdown-3: the Tools table lists only tools the frontmatter grants | `rg -c '^\s*\| .memory. ' AG` exits 1 for markdown in all five |
| REQ-010 | markdown-4: §0 and §0b refer to the §5 table rather than listing or counting the commands. §5 keeps its 13 rows | `rg -c 'thirteen' AG` exits 1 for markdown in all five, `sed -n '/^### Invocation and Scope Gate/,/^### Canonical/p' .skilled/agents/markdown.md \| rg -c '^- ./create:'` prints 0, and `sed -n '/^## 5\./,/^## 6\./p' .skilled/agents/markdown.md \| rg -c '^\| ./create:'` prints 13 |
| REQ-011 | design-2: the Step 1 conflict sentence names the §6 NEVER rules as the exception the prompt cannot override | `rg -n 'report the conflict' .skilled/agents/design.md` prints one line, and that line contains `NEVER` |
| REQ-012 | design-3: the decide path edits only files the request names and runs `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files <those paths>` before it reports. When the request names no file, it returns values and `@code` implements them | `rg -c 'quality-gate\.cjs --files' .skilled/agents/design.md` prints 1 or more, and `rg -c 'names no file' .skilled/agents/design.md` prints 1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every acceptance command in section 4 prints what its row says, run on the final tree.
- **SC-002**: The `implementation-summary.md` verification table has one row per finding id, context-1 to context-4, markdown-1 to markdown-4 and design-1 to design-3, each with its command and output.
- **SC-003**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 sets the untrusted-content rule, the self-score rule and the boilerplate decision | REQ-008's unscored-output form and the lines next to `context.md:77` wait for it | Build after 006 lands, and take its wording as written. If 006 has not settled the unscored form, REQ-008 ships the scorer half only and the rest stays open |
| Dependency | Phase 008 edits `orchestrate.md` first | None if the Nested Dispatch Status section stays | REQ-006 keeps the section, and verification re-runs the `orchestrate.md` search from Measured Behavior |
| Risk | The trigger Grep finds fewer documents than the CLI, and can match a quoted bullet in a document body that is not a `trigger_phrases` entry | Medium. The CLI returned 5 results for `agent registry step` and the Grep returned 1, because the CLI adds token-overlap matches | §2 says the lane finds exact declared phrases only and that a hit is confirmed by reading the frontmatter, and the §5 corpus recipe stays as the wider fallback |
| Risk | A hand edit to a `.claude` fork drifts from its source | Low | The mirror check compares the `.claude` and Pi copies, and the `rg` checks in section 4 also cover `.codex` and `.dsh`, which the mirror check does not compare |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does phase 006 add the untrusted-content sentence to `context.md` itself, or hand that to this phase? Default: 006 adds it. If it is handed over, this phase copies 006's sentence verbatim and adds no wording of its own.
- What does an output the DQI scorer does not fit report? Phase 006's self-score rule decides. This phase plans `DQI=n/a` with the reason, because `extract_structure.py` scored a YAML workflow as type `command` with 41, and waits on 006 before it ships that half.
- Should `@design` edit interface files on the decide path at all? Decision taken for planning: yes, only the files the request names, with the quality gate run on them, because the frontmatter grants write and `design.md:41` and `:97` already assume it. The operator can narrow it to values-only, which turns REQ-012 into a deletion of the write route.
- Should `agent-template.md:281` allow a binding to be emitted after a read when its value comes from that read? REQ-007 departs from the template timing for one binding. The template belongs to phase 006.
<!-- /ANCHOR:questions -->

---
