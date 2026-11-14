---
title: "Feature Specification: Phase 6: shared-agent-contract"
description: "Five rules every agent shares are each stated in several places that disagree: tool budgets sit below what the mandatory steps cost, checklists ship pre-ticked, the canonical refusal is used by two of ten LEAF agents, the untrusted-content rule is in two of eleven files and one boilerplate paragraph is copied six times. This phase gives each rule one source and one owner."
trigger_phrases:
  - "shared agent contract"
  - "phase 6 shared agent contract"
  - "agent tool call budget"
  - "canonical refuse line"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: shared-agent-contract

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 14 |
| **Predecessor** | 005-alignment-report-fixes |
| **Successor** | 007-code-agent-retry-and-status |
| **Handoff Criteria** | Every requirement in section 4 holds with its command output recorded, the roster, mirror and contract-drift checks pass, and phases 7 to 14 can edit the same agent files on top of this phase's text |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the agent alignment follow-ups packet. Phases 7 to 14 depend on it, because each of them edits agent files this phase changes first.

**Scope Boundary**: The shared rules the review found under "Across agents" and the agent findings that are one instance of them: code-5, review-1, review-5, deep-research-1, deep-review-1, orchestrate-3 and debug-3. The surfaces are the agent template, the eleven agent files and their runtime copies, the `/deep:research` and `/deep:review` workflow assets, the two deep-loop mode packets and the compiled deep-command contracts. The self-score rule is written here and applied by later phases.

**Dependencies**:
- The review report in `../scratch/agent-review/agents-review.out.md` and the ownership map `../scratch/agent-review/finding-to-phase.tsv`.
- Phase 5, whose roster and mirror routine this phase reuses.

**Deliverables**:
- One budget rule in the agent template, the three fast-path caps removed, and the deep-loop budgets read from the run config alone
- The orchestrator's split rule and footer reading the target agent's own budget
- One self-attested-output rule in the template, and the 31 pre-ticked boxes in three agents made honest
- The canonical refusal line in all ten LEAF agents and stated once in the template
- The untrusted-content rule in the template and in the eight LEAF agents that lack it
- The copied "Daemon-free retrieval" sentence and the "Layer 1" wording removed where they say nothing

**Hand-offs**: the self-score rule is applied to `code.md` section 6 by phase 7, to the `orchestrate.md` quality score by phase 8, to the `review.md` advisory score by phase 12 and to the `markdown.md` DQI by phase 13. Self-reported `durationMs` stays with phase 10 (deep-research-4).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rules every agent shares have no single home, so each agent file carries its own copy and the copies disagree. Tool budgets are the costly case. The fast paths of `code`, `review` and `debug` cap a run at 5 calls when their mandatory steps need 6 to 8. `deep-research` caps an iteration at 12 while its iteration prompt says 24. `deep-review` caps at 13 while its mandatory steps need 16. The orchestrator tells every leaf to stop above 12 whatever that leaf's own budget says. A leaf that obeys any of these either breaches the cap or skips its verification. The other shared rules drift the same way. Three agents ship ticked checklists. Eight of ten LEAF agents lack the refusal line the template calls mandatory. Eight lack the untrusted-content rule, and one sentence that instructs nothing is copied into six files.

### Purpose
Each shared rule has one source with a named owner, every agent file agrees with it, and a command can show the agreement.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run in the worktree at `c1dbb1bcc4`. The full capture is `scratch/baseline.txt`.

```text
$ git diff --quiet 09f1d6499a HEAD -- .skilled/agents/ .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md; echo "exit=$?"
exit=0
$ wc -l .skilled/agents/{ai-council,code,context,debug,deep-research,deep-review,design,orchestrate,prompt-improver,review}.md
     816 .skilled/agents/ai-council.md
     539 .skilled/agents/code.md
     438 .skilled/agents/context.md
     648 .skilled/agents/debug.md
     599 .skilled/agents/deep-research.md
     600 .skilled/agents/deep-review.md
     244 .skilled/agents/design.md
     910 .skilled/agents/orchestrate.md
     399 .skilled/agents/prompt-improver.md
     462 .skilled/agents/review.md
    5655 total
$ rg -n 'Max 5 tool calls' .skilled/agents/ | cut -c1-90
.skilled/agents/code.md:114:Max 5 tool calls. Minimum deliverable: RETURN line with verifi
.skilled/agents/debug.md:153:**If dispatched with `Complexity: low`:** Keep all 5 phases i
.skilled/agents/review.md:63:**If dispatched with `Complexity: low`:** LOAD STANDARDS stil
$ rg -n 'hard max 12|\| Write outputs|max 13 calls|Respect max 13' .skilled/agents/deep-research.md .skilled/agents/deep-review.md | cut -c1-110
.skilled/agents/deep-research.md:183:**Budget**: Target 8-11 total tool calls, hard max 12. Reserve enough cal
.skilled/agents/deep-research.md:413:| Write outputs | 2-3 | 3 |
.skilled/agents/deep-review.md:506:3. Exceed tool budget (max 13 calls).
.skilled/agents/deep-review.md:580:| Exceeding budget | Timeout risks losing iteration work | Respect max 13 c
$ rg -n -o '`(scan|verify|adjudicate)`: [0-9-]+ tool calls' .skilled/agents/deep-review.md
388:`scan`: 9-11 tool calls
389:`verify`: 11-13 tool calls
390:`adjudicate`: 8-10 tool calls
$ rg -n 'tool_call_budget|maxToolCallsPerIteration"|Soft max 12|Max 24 tool|default: 12|max 12 tool|\(max 12\)|Max 12 tool' .skilled/commands/deep/assets .skilled/skills/system-deep-loop --glob '!**/fixtures/**' --glob '!**/changelog/**' --glob '!**/benchmark/**' | cut -c1-120 | sort
.skilled/commands/deep/assets/deep-research-auto.yaml:98:  tool_call_budget: { target: 12, max: 24 }
.skilled/commands/deep/assets/deep-research-confirm.yaml:114:  tool_call_budget: { target: 12, max: 24 }
.skilled/commands/deep/assets/deep-review-auto.yaml:90:  tool_call_budget: { target: 9, soft_max: 12, hard_max: 13 }
.skilled/commands/deep/assets/deep-review-confirm.yaml:89:  tool_call_budget: { target: 9, soft_max: 12, hard_max: 13 }
.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:12:  "maxToolCallsPerIteration": 24,
.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:307:- **Tool call count**: tracked a
.skilled/skills/system-deep-loop/deep-research/SKILL.md:104:3. Respect the LEAF-agent constraint: no sub-dispatch, no ne
.skilled/skills/system-deep-loop/deep-research/SKILL.md:206:3. **Exceed TCB** -- Target 8-11 tool calls per iteration (m
.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:18:  "maxToolCallsPerIteration": 12,
.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:94:- Target 9 tool calls. Soft max 12,
.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:310:- Target 8-11 tool calls per itera
.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:708:3. Respect the LEAF-agent constrai
.skilled/skills/system-deep-loop/deep-review/SKILL.md:246:3. **Exceed TCB**, Target 8-11 tool calls per iteration (max 1
.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts:160:    expect(researchRendered).toContain('Ma
$ sed -n 36p .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl
- Target 3-5 research actions. Max {max_tool_calls_per_iteration} tool calls total.
$ rg -n -o "MUST SPLIT.*|more than 12 tool calls|\*\*Tool Calls\*\*.*" .skilled/agents/ | cut -c1-110
.skilled/agents/orchestrate.md:816:MUST SPLIT | Split into agents of ≤8 tool calls each         |
.skilled/agents/orchestrate.md:833:more than 12 tool calls
.skilled/agents/context.md:150:**Tool Calls** | 10-20 for thorough mode |
.skilled/agents/markdown.md:182:**Tool Calls**     | 8-25 for normal mode, depending on package size
$ rg -c '\[x\]' .skilled/agents/
.skilled/agents/deep-research.md:19
.skilled/agents/deep-review.md:9
.skilled/agents/debug.md:3
$ rg -n 'Rubric Score|Advisory score: XX|Quality score ≥ 70|^DQI=' .skilled/agents/ | cut -c1-90
.skilled/agents/orchestrate.md:555:□ Quality score ≥ 70 (see Scoring Dimensions below)
.skilled/agents/review.md:254:**One vocabulary.** Every format below states its verdict in
.skilled/agents/review.md:261:`## PR Review: [Title]` → Summary (`Recommendation: [APPROVE
.skilled/agents/code.md:339:**Rubric Score:** <0-100 plus optional compact breakdown>
.skilled/agents/markdown.md:246:DQI=<score>
$ rg -n 'All LEAF agents must use this exact string' .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md
307:All LEAF agents must use this exact string when asked to dispatch, invoke the Task tool, or delegate outside their boundary:
$ rg -c -F 'REFUSE: nested Task tool dispatch is forbidden for LEAF agents.' .skilled/agents/ .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md
.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md:3
.skilled/agents/deep-review.md:1
.skilled/agents/markdown.md:1
$ rg -l -i 'untrusted' .skilled/agents/
.skilled/agents/deep-research.md
.skilled/agents/deep-review.md
$ rg -n 'Daemon-free retrieval' .skilled/agents/ | cut -c1-60
.skilled/agents/review.md:105:**Daemon-free retrieval:** eve
.skilled/agents/deep-research.md:362:**Daemon-free retrieval
.skilled/agents/ai-council.md:133:**Daemon-free retrieval:**
.skilled/agents/deep-review.md:288:- **Daemon-free retrieval
.skilled/agents/context.md:77:**Daemon-free retrieval:** eve
.skilled/agents/debug.md:369:**Daemon-free retrieval:** ever
$ rg -n 'Layer 1|Layer-1' .skilled/agents/{code,debug,review}.md | cut -c1-110
.skilled/agents/debug.md:155:**If dispatched with a Context Package** (from @context or orchestrator): Skip th
.skilled/agents/code.md:116:**If dispatched with a Context Package** (from @context or orchestrator): Skip Lay
.skilled/agents/review.md:65:**If dispatched with a Context Package** (from @context or orchestrator): Skip th
.skilled/agents/review.md:461:- `.skilled/agents/context.md`: the optional Context Package provider that lets
$ rg -c '^#+ .*Layer 1' .skilled/agents/{code,debug,review,context}.md
.skilled/agents/context.md:1
$ for c in ai-council research review; do node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/$c | diff -q - .skilled/commands/deep/assets/compiled/deep-$c.contract.markdown >/dev/null; echo "deep/$c diff-exit=$?"; done
deep/ai-council diff-exit=0
deep/research diff-exit=0
deep/review diff-exit=0
$ node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs; echo "exit=$?"
[CONTRACT DRIFT] OK commands=3
exit=0
$ (cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/prompt-pack.vitest.ts tests/unit/compile-command-contracts.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/fanout-review-focus.vitest.ts) | rg 'Test Files|Tests '
 Test Files  4 passed (4)
      Tests  43 passed (43)
$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check 2>&1 | tail -2
  note: manifest hash differs (index bbb6ae6687a662e5c5efb72917f818085afbb796e0a8ee98878d1a4ee4a05a89, corpus 600338f777690170f23e82aa83075debe944c2af2df1a6ade77615fc4343d083); no lookup answer depends on it
  regenerate: node generate-trigger-index.mjs
$ node .skilled/bin/sync-agent-roster.cjs --check | tail -1
agent-roster: OK
$ node .skilled/bin/check-agent-mirror-sync.cjs >/dev/null 2>&1; echo "exit=$?"
exit=0
$ node .skilled/bin/check-agent-mirror-sync.cjs 2>&1 | rg -o 'all comparable mirrors in sync|OK$'
all comparable mirrors in sync
OK
$ bash .skilled/skills/sk-doc/scripts/check-frontmatter-versions.sh 2>&1 | tail -1
[gate] 5569 files | ok=2976  skip-no-frontmatter=2593
$ bash .skilled/skills/sk-doc/scripts/check-frontmatter-versions.sh >/dev/null 2>&1; echo "exit=$?"
exit=0
```

**Recounted minimums.** The convention is one tool call per named read, write, edit or command in the written steps. Both deep leaves have Bash, so a shell that batches reads could go lower. The steps name each action as its own call, and this count follows them.

- `deep-research`, 12 calls. Step 1 (`:97`) reads config, state log and strategy: 3. Step 2 (`:118`) checks that `iteration-NNN.md` is absent: 1. Step 5 (`:170`) runs at least 3 research actions: 3. Step 6 (`:198`) writes the iteration file: 1. Step 8 (`:252`) writes the record file and runs the gateway: 2. Step 9 (`:300`) writes the delta: 1. Step 11 (`:321`) reads the refreshed projection: 1. That is 12, the reviewer's count, against a hard max of 12 with no slack. Step 10 (`:315`) adds 1 when `progressiveSynthesis` is true, and the optional registry and ideas reads add up to 2. The write phase alone costs 4 calls against the table's 3 at `:413`.
- `deep-review`, 16 calls. Step 1 (`:143`) checks that the next iteration file is absent: 1. Step 2 (`:152`) reads the state log, registry, strategy and config: 4. Step 4 (`:166`) runs at least 3 analysis actions: 3. Step 6 (`:187`) reads `sk-code-review/SKILL.md` and the doctrine file it names: 2. Step 7 (`:210`) writes the iteration file: 1. Step 8 (`:222`) edits the strategy: 1. Step 9 (`:232`) writes the record file and runs the gateway: 2. Step 10 (`:259`) writes the delta: 1. Step 11 (`:266`) reads the refreshed projection: 1. That is 16. The reviewer's 15 leaves out the Step 1 check. All three budget profiles at `:388-390` end below 16.
- `code` fast path, 6 calls. The steps read the sk-code `SKILL.md` (`:66`), read the target before editing it, make the edit, run `quality-gate.cjs` (`:72`), read at least the universal-floor checklist (`:77`) and run the verification command (`:84`). A named spec folder adds 3 reads (`:65`).
- `review` fast path, 8 calls. LOAD STANDARDS reads the sk-code `SKILL.md` and `sk-code-review/SKILL.md` and runs the resolver (`:47-49`). Step 5 reads `review-core.md` (`:55`), and three checklists load "on every review" (`:198`). That is 7 before the reviewed file is read once.
- `debug` fast path, 6 calls. Phase 1 reads the failing file (`:180`). Phase 2 reads the test files and the runner or build config (`:224`) and greps the call path (`:225`). Phase 5 edits and runs the tests (`:329`). That is 6, or 7 when the runner config and the build config are separate files.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Finding Classification

| Finding | Class | Evidence |
|---------|-------|----------|
| across-1 | reproduced | 5-call caps at `code.md:114`, `review.md:63` and `debug.md:153`, deep caps at `deep-research.md:183` and `deep-review.md:506`, split footer at `orchestrate.md:833` |
| across-2 | partly reproduced | 31 ticked boxes in three files. Only `debug.md:419-421` is returned to the caller. The `deep-research.md:549` and `deep-review.md:540` lists are pre-return checklists the caller never sees, so the "caller can check nothing" half holds for `debug` alone. The four self-scores exist at the lines above |
| across-3 | reproduced | the template requires the string at `agent-template.md:307`, and 2 of 10 LEAF agents carry it |
| across-4 | reproduced, and wider than reported | 2 of 11 agents carry the rule. The report named five that lack it, and `design`, `prompt-improver`, `markdown` and `orchestrate` lack it too |
| across-5 | reproduced | the sentence is in six files, and `code`, `debug` and `review` say "Layer 1" with no Layer 1 heading |
| code-5 | reproduced | `code.md:114` caps at 5 against a recount of 6 |
| review-1 | reproduced | `review.md:63` caps at 5 against a recount of 8 |
| review-5 | reproduced | `review.md` has no `untrusted` match |
| deep-research-1 | reproduced | `deep-research.md:183` hard max 12 against `deep-research-auto.yaml:98` max 24 and the rendered prompt's `Max 24` |
| deep-review-1 | reproduced | `deep-review.md:506` max 13 against a recount of 16, and the config says 12 |
| orchestrate-3 | reproduced | `orchestrate.md:816` and `:833` against `context.md:150` (10-20) and `markdown.md:182` (8-25) |
| debug-3 | reproduced | `debug.md:419-421` ticks three boxes in the returned report with no command or exit code |

### In Scope
- Write the budget rule once in the agent template, remove the three fast-path caps and point each deep leaf at its iteration prompt's budget line
- Make `maxToolCallsPerIteration` in each mode's run config the only deep-loop budget, rendered into both iteration prompts, and delete or repoint every restated number
- Make the orchestrator's split threshold and footer defer to the target agent's own `Tool Calls` budget
- Write the self-attested-output rule once in the template, untick the two deep checklists and give `debug`'s returned verification lines a command and an exit code
- Put the canonical refusal line in every LEAF agent, the untrusted-content rule in every LEAF agent, and remove the copied sentence and the "Layer 1" wording

### Out of Scope
- Applying the self-score rule to `code.md` section 6, the `review.md` advisory score, the `orchestrate.md` quality score and the `markdown.md` DQI - phases 7, 12, 8 and 13 own those findings
- Adding a `Tool Calls` row to the eight agents that state no budget - no finding asks for it, and the orchestrator's 12-call default covers them
- The untrusted-content rule in `orchestrate.md` - it runs as the operator-facing session, where the repository's own rule to treat file and tool content as data already binds, and the file is 310 lines over the cap
- Shrinking `ai-council`, `debug` and `orchestrate` below 600 lines - across-6 is split to phases 9, 11 and 8. This phase only keeps them from growing
- The `orchestrate.md:330` heuristic "agent needs ≤3 tool calls" for `low` complexity - it classifies a task and caps nothing, and phase 8 owns that file's routing text
- The blocked-stop-session test fixture that records a budget of 12 - it is the record of a past session, not a producer

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modify | The budget rule, the self-attested-output rule, the untrusted-content rule and one refusal block |
| `.skilled/agents/code.md`, `review.md`, `debug.md` | Modify | Fast-path cap, "Layer 1" wording, refusal line, untrusted rule. `debug` also loses the copied sentence and gets its verification lines |
| `.skilled/agents/deep-research.md`, `deep-review.md` | Modify | Budget pointer, checklists unticked, copied sentence. `deep-review` loses its budget profiles. `deep-research` gains the refusal line |
| `.skilled/agents/context.md`, `ai-council.md`, `design.md`, `prompt-improver.md`, `markdown.md` | Modify | Refusal line where missing, untrusted rule, copied sentence where present |
| `.skilled/agents/orchestrate.md` | Modify | Split threshold row and footer |
| `.claude/agents/` forks of the eleven agents | Modify | Hand-edited to match |
| `.pi/agents/`, `.codex/agents/`, `.dsh/agents/` | Regenerate | The three sync generators |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml` | Modify | Remove `tool_call_budget` |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml` | Modify | Remove `tool_call_budget`, pass `max_tool_calls_per_iteration` to the prompt pack |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json`, `prompt-pack-iteration.md.tmpl` | Modify | Budget 24, rendered from config |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md`, `references/protocol/loop-protocol.md`, `changelog/v1.15.13.0.md` | Modify, Create | Repoint the numbers, raise the mode version |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md`, `references/protocol/loop-protocol.md`, `changelog/v1.11.15.0.md` | Modify, Create | Repoint the numbers, raise the mode version |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts`, `tests/fanout-review-focus.vitest.ts` | Modify | Both render the review pack with their own variables, so both pass the budget, and the first asserts it |
| `.skilled/skills/system-spec-kit/runtime/` trigger-index outputs | Regenerate | The skill and spec docs this phase edits move the manifest hash |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown`, `deep-ai-council.contract.markdown` | Regenerate | Their source digests change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The agent template states the budget rule once: the `Tool Calls` row is the agent's one budget, it covers the mandatory steps, a fast path or a dispatcher never sets a lower cap, and a deep-loop leaf takes its budget from the iteration prompt. (across-1) | `rg -c 'row is the agent.s one budget' .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` prints 1 |
| REQ-002 | No agent fast path carries a tool-call cap. (code-5, review-1, across-1) | `rg -c 'Max 5 tool calls' .skilled/agents/ .claude/agents/ .pi/agents/ .codex/agents/ .dsh/agents/` exits 1 with no output |
| REQ-003 | The deep-research budget comes from `maxToolCallsPerIteration` alone. The agent file names the 12-call floor and the prompt's `Max N` line and no other number, and no YAML, skill or protocol doc restates a value. (deep-research-1) | `rg -n --glob '!**/changelog/**' 'hard max 12\|approaching 12\|8-11\|\(max 12\)\|default: 12\|max 12 tool\|tool_call_budget' .skilled/agents/deep-research.md .skilled/commands/deep/assets/deep-research-*.yaml .skilled/skills/system-deep-loop/deep-research/` exits 1, and the prompt-pack suite still asserts `Max 24 tool calls total.` for research |
| REQ-004 | The deep-review budget comes from `maxToolCallsPerIteration` alone, set to 24, rendered into the review iteration prompt, and no agent, YAML, skill or protocol doc restates a value. (deep-review-1) | `rg -n 'max 13\|hard max 13\|Soft max 12\|\(max 12\)\|Max 12 tool\|tool_call_budget\|[0-9]+-[0-9]+ (tool )?calls' .skilled/agents/deep-review.md .skilled/commands/deep/assets/deep-review-*.yaml .skilled/skills/system-deep-loop/deep-review/SKILL.md .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md .skilled/skills/system-deep-loop/deep-review/assets/` exits 1, and the prompt-pack suite asserts `Max 24 tool calls total.` for review |
| REQ-005 | The orchestrator splits work and tells a leaf to stop by the target agent's own `Tool Calls` budget, with 12 as the default for an agent that states none. (orchestrate-3) | `rg -c 'more than 12 tool calls' .skilled/agents/orchestrate.md` exits 1, and `rg -c 'Tool Calls. budget' .skilled/agents/orchestrate.md` prints 2 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The agent template states the self-attested-output rule once: a checklist ships unticked, a returned verification line carries a command and an exit code, and a self-assigned score never decides a status. (across-2) | `rg -c 'checklist in an agent file ships unticked' .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` prints 1 |
| REQ-007 | No agent file ships a ticked box. (across-2) | `rg -c '\[x\]' .skilled/agents/` exits 1 with no output |
| REQ-008 | The `debug` success report verifies with commands and exit codes, not ticked boxes. (debug-3) | `rg -c 'Exit Code' .skilled/agents/debug.md` prints 3, against no match at the base, and `rg -c '\[x\]' .skilled/agents/debug.md` exits 1 |
| REQ-009 | Every LEAF agent carries the canonical refusal line, and the template states it once in its rules section plus once in its copyable skeleton. (across-3) | `rg -l -F 'REFUSE: nested Task tool dispatch is forbidden for LEAF agents.' .skilled/agents/ \| wc -l` prints 10, and the same search on the template prints a count of 2 |
| REQ-010 | Every LEAF agent and the template carry the untrusted-content rule. (across-4, review-5) | `rg -l -i 'untrusted' .skilled/agents/ \| wc -l` prints 10, and `rg -c -i 'untrusted' .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` prints 2 or more |
| REQ-011 | The "Daemon-free retrieval" sentence is gone and `deep-review` keeps its rule never to block an iteration on retrieval. (across-5) | `rg -c 'Daemon-free' .skilled/agents/` exits 1, and `rg -c -i 'never block an iteration on retrieval' .skilled/agents/deep-review.md` prints 1 |
| REQ-012 | No agent without a Layer 1 refers to one. (across-5) | `rg -n 'Layer 1\|Layer-1' .skilled/agents/code.md .skilled/agents/debug.md .skilled/agents/review.md` exits 1 |
| REQ-013 | No touched agent grows past the cap: an agent at or under 600 lines stays at or under 600, and an agent already over it does not grow. | `wc -l` prints at most 600 for each touched agent, and at most 816, 648 and 910 for `ai-council`, `debug` and `orchestrate` |
| REQ-014 | The runtime copies agree with the canonical agents. | `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` ends `OK`, each with exit 0 |
| REQ-015 | The compiled deep-command contracts, the deep-loop tests and the doc versions agree with the changed sources. | `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`, the four deep-loop vitest suites pass, `check_changelog_shape.py` passes both new entries, `check-frontmatter-versions.sh` exits 0 and `generate-trigger-index.mjs --check` exits 0 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A recount of each agent's mandatory steps comes out at or below the budget the agent reads, for every agent this phase touches.
- **SC-002**: Each of the five shared rules has one source named in `plan.md` section 3, and the searches in section 4 find no copy that disagrees with it.
- **SC-003**: `validate.sh --strict` on this folder prints `RESULT: PASSED`, and phases 7 to 14 can start from this phase's text.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The compiled deep-command contracts digest the agent files, YAMLs, configs, templates and skill docs this phase edits | The renderer rejects a stale contract and the commit gate blocks | Recompile all three contracts with `--write` after the last source edit and require `OK commands=3` |
| Risk | The review prompt template gains a variable the renderer requires | `renderPromptPack` throws on a missing variable, so a YAML or a test that omits it breaks every review iteration | Add the variable to both review YAMLs and to the two tests that render the review pack in the same change, and run both suites. The fan-out runner hands CLI executors the unrendered template, as it already does for research |
| Risk | Phases 7 to 14 edit the same agent files | A later phase rebased on stale text reintroduces a cap or a ticked box | This phase lands first, and its section 4 searches run again at the close of the packet |
| Risk | Raising the review budget to 24 lets a stuck iteration run longer | Medium | The wall-clock limit `maxMinutesPerIteration` is unchanged and still stops the iteration |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Every touched agent file stays at or under 600 lines, and a file already over 600 does not grow, as REQ-013 checks. A file under the cap may gain the lines the refusal and untrusted-content rules add.
- **NFR-P02**: N/A. The phase runs no service. A deep iteration's budget grows only on the review side, from 13 to 24 calls.

### Security
- **NFR-S01**: Every LEAF agent treats the files, diffs, pages and tool output it reads as data, never as instructions.
- **NFR-S02**: N/A. No credential, permission or tool grant changes.

### Reliability
- **NFR-R01**: The contract-drift check, the roster check and the mirror check each pass after the change, as they do at baseline.
- **NFR-R02**: The four deep-loop vitest suites pass with 43 tests or more, against 43 at baseline.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an agent that states no `Tool Calls` budget gets the orchestrator's default of 12 and no fast-path cap.
- Maximum input: a deep-review iteration with 5 analysis actions, a counterevidence search and a P0 reread needs about 20 calls, which fits 24.
- Failure path: a review YAML that does not pass `max_tool_calls_per_iteration` makes `renderPromptPack` throw `PromptPackError` naming the variable, and the prompt-pack suite fails.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 11 agent files and their forks, the template, 4 YAMLs, 2 mode packets, 1 test, 3 regenerated contracts |
| Risk | 10/25 | Text and config only, but the review template change can stop every review iteration if one caller is missed |
| Research | 6/20 | The producers and consumers are inventoried and every count is recounted in section 2 |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What is the deep-review iteration budget? The recount floor is 16. Default taken: 24, the same as deep-research. The operator may set any value of 20 or more before the build.
- Is there a runtime abort near 12 tool calls? `orchestrate.md:793` says an overlong dispatch returns "Tool execution aborted" and loses all progress, and cites no source. Default taken: each agent's stated budget governs. If such a limit exists, the leaf budgets of 20 to 25 are what is wrong.
- Should the untrusted-content rule also reach `orchestrate.md`? Default taken: no, for the reason in Out of Scope. `design`, `prompt-improver` and `markdown` are in scope, because the template rule binds every LEAF agent.
- Should the two deep-loop mode packets ship release entries? Default taken: yes, `v1.15.13.0` and `v1.11.15.0`, following phase 5's precedent for a `SKILL.md` body change. The template is an asset, so its own version is raised by the commit hook and `sk-create-agent` gets no release.
<!-- /ANCHOR:questions -->

---
