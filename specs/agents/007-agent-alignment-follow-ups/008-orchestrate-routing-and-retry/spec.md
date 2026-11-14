---
title: "Feature Specification: Phase 8: orchestrate-routing-and-retry"
description: "The orchestrator sends deep work to a leaf that refuses it without command-created state, keeps five retry passages with three different escalation points, names two owners for spec docs and loads each agent definition twice. It also runs to 910 lines against the 600-line cap. This phase fixes each of the seven owned findings and moves reference material into a system-spec-kit reference."
trigger_phrases:
  - "orchestrate routing and retry"
  - "phase 8 orchestrate routing and retry"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: orchestrate-routing-and-retry

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 14 |
| **Predecessor** | 007-code-agent-retry-and-status |
| **Successor** | 009-ai-council-writer-and-round-model |
| **Handoff Criteria** | Each owned finding has a shipped fix or a recorded no-fix decision, `wc -l < .skilled/agents/orchestrate.md` prints 600 or less and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the agent alignment follow-ups packet.

**Scope Boundary**: `.skilled/agents/orchestrate.md`, its runtime copies, the `deep-research` record in `.skilled/agents/agent-registry.json` and one new reference in `system-spec-kit` with its three registration surfaces. The leaf agents, the dispatch guard and the deep-loop commands do not change.

**Dependencies**:
- Phase 6 (`006-shared-agent-contract`). Its budget rule replaces the split footer at `orchestrate.md:816` and `:833`, and its self-score rule decides what the `Quality score ≥ 70` checklist item becomes.
- Phase 7 (`007-code-agent-retry-and-status`). Its `FAIL` and `BLOCKED` definitions are what the single retry ladder counts.
- The operator's answer on the spec-doc owner, for REQ-004 only.

**Deliverables**:
- Deep work routed to the `/deep:*` commands, with a `Deep Route:` line that carries only registry fields
- One retry ladder, one spec-doc owner and one definition load per dispatch
- Measurable gates only, and current text for the action agents, the `@code` example and the save rule
- `orchestrate.md` at or below 600 lines, the moved sections in `system-spec-kit/references/workflows/orchestrator-dispatch.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The orchestrator routes an "Evidence / iterative investigation" request to `@deep-research` and tells itself to dispatch that leaf at depth 1. The leaf refuses: it hard-blocks with `Status: error` when the config, state and strategy files that only `/deep:research` creates are missing. The same file gives five retry passages with three escalation points, after 2 rejections, after 2 retries and after 3 failures. It names `@markdown` and the main agent as the spec-doc writer, asks the runtime to load each definition by name after pasting it into the prompt, sends read-only leaves to write `scratch/` files and gates on a score it assigns itself, a clock and a context percentage it cannot read. At 910 lines it is 310 over the 600-line cap the agent template sets.

### Purpose
Every dispatch rule in `orchestrate.md` names a route the target accepts, a count a command can check and one owner, in a file of 600 lines or less.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Saved as `scratch/measured-behavior.txt`. Run from the worktree root at `c1dbb1bcc4`.

```text
$ git diff --quiet 09f1d6499a HEAD -- .skilled/agents/; echo "agents-changed-since-review=$?"
agents-changed-since-review=0
$ wc -l .skilled/agents/orchestrate.md .claude/agents/orchestrate.md
     910 .skilled/agents/orchestrate.md
     898 .claude/agents/orchestrate.md
    1808 total
$ sed -n 62p .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md | cut -c1-70
Production agent files should stay at or below **600 lines**. If an ag
# orchestrate-1
$ sed -n 80p orchestrate.md | cut -c1-70
| 2 | Evidence / iterative investigation | `@deep-research` | LEAF | `
$ sed -n 140p orchestrate.md | cut -c1-150
**For `/deep:*` requests, resolve the target leaf agent directly from the Priority table above (registry-backed) and dispatch that leaf at depth 1.** 
$ sed -n 113,116p .skilled/agents/deep-research.md | cut -c1-110
**HARD BLOCK -- Missing or unreadable state**:
- If `deep-research-config.json`, `deep-research-state.jsonl`, or `deep-research-strategy.md` is missing, unre
- Do not create replacement config, state, strategy, dashboard, or registry files.
- Return an iteration completion report with `Status: error`, naming the missing or corrupt state file(s), and
$ grep -n "\"taskType\"" .skilled/agents/agent-registry.json | sed -n "2p;6p" | cut -c1-75
28:      "taskType": "Evidence / iterative investigation",
87:      "taskType": "Deep-loop iterative code-audit pass (`/deep:review` o
$ sed -n 233p orchestrate.md | cut -c1-170
**`Deep Route:` resolution rule (registry-backed, not judgment):** You MUST resolve `mode`, `target_agent`, and `execution` for any of the 4 `@deep-*`/`@ai-council` agent
$ node -e (each mode-registry mode with its agent, command and execution field)
research deep-research /deep:research no-execution-field
review deep-review /deep:review no-execution-field
ai-council ai-council /deep:ai-council no-execution-field
# orchestrate-2
$ sed -n "602p;624p;627p;645,647p;661p;693p;728p" orchestrate.md | cut -c1-110
STOP (do not synthesize rejected output) → provide specific feedback stating exactly what failed → retry with 
| 50-69  | NEEDS REVISION | Auto-retry (up to 2x) |
**Auto-Retry:** Score < 70 → execute verification actions above → provide specific feedback → retry with revis
1. **RETRY (Attempts 1-2):** Provide additional context from other sub-agents, clarify success criteria, re-di
2. **REASSIGN (Attempt 3):** Try different agent type (e.g., @general-purpose instead of @context), or surface
3. **ESCALATE (After 3+ failures):** Report to user with complete attempt history, all partial findings, and s
Isolate failures to prevent cascading issues. States: CLOSED (normal) → OPEN (3 consecutive failures, 60s cool
After 3 failed attempts on the same error, prepare a diagnostic summary and prompt the user to dispatch `@debu
| Sub-agent failures   | 2+              | Consider debug delegation                          |
$ sed -n 602p orchestrate.md | grep -o "escalate to user after 2 rejections"
escalate to user after 2 rejections
# orchestrate-4
$ sed -n "444p;461p;499p" orchestrate.md | cut -c1-130
**Action:** Route actual `/create:*` component commands, scoped markdown authoring, and spec-doc creation through `@markdown` or a
**Action:** The main agent writes spec-folder docs directly using `spec-authoring-card.md` and the level's `templates/core/*.md.tm
   - REJECT output
# orchestrate-5
$ sed -n "152p;153p" orchestrate.md | cut -c1-130
2. **INCLUDE** the agent file's content in the delegation prompt (or a focused summary for large files)
3. **SET** `subagent_type` to the agent's own name, for example `subagent_type: "context"`, so the runtime loads that agent's own 
# orchestrate-6
$ sed -n 781p orchestrate.md | cut -c1-100; sed -n 43p .skilled/agents/context.md
- **Pattern C (10-20):** Agents write to `[spec-folder]/scratch/agent-N-[topic].md`, return 3-line s
- NEVER emit a file path for @context to write later, even when the orchestrator asks for "file-based" output.
# orchestrate-7
$ sed -n "555p;634p;687p;789p;854p;876p" orchestrate.md | cut -c1-110
□ Quality score ≥ 70 (see Scoring Dimensions below)
| **Mid-execution**  | Every 5 tasks or 10 tool calls | Progress checkpoint (Score ≥ 70, soft - warning only) 
| Sub-agent no response (2 min) | Report timeout, offer retry or reassign                   |
| Step 9 (SYNTHESIZE) | Context approaching 80%?              | Stop collecting, synthesize what we have  |
| **Available for results** | **~150K tokens** | **Must be shared across ALL agent returns** |
**Default workflow budget:** 50,000 tokens (if not specified)
# orchestrate-8
$ sed -n "406p;452p;535p" orchestrate.md; sed -n 129p .skilled/agents/code.md | cut -c1-90
├─ Skills: sk-code code-review mode (findings-first baseline + router-selected surface evidence)
**Action:** Mandate sub-agents to run `/speckit:save` or `save context`.
- @general-purpose, @review, @debug
| **Excluded** | `sk-code`'s code-review mode | Always excluded inside @code | Review-side
$ frontmatter write permission of three leaves
context write=deny
review write=deny
prompt-improver write=deny
# consumers and baselines
$ rg -n "Deep Route:|target_agent=" .opencode/hooks/task-dispatch/lib/dispatch-guard.cjs | cut -c1-100
135:  const deepRouteMatch = /(?:^|\n)\s*Deep Route:[^\n]*?\bmode=([a-z0-9-]+)/i.exec(text);
260: * the target. Parse the prompt's "Agent: @<name>" / "Deep Route: ... target_agent=@<name>"
271:  const deepRouteMatch = /target_agent=@?([a-z0-9-]+)/i.exec(text);
$ rg -c "execution" .opencode/hooks/task-dispatch/lib/dispatch-guard.cjs || echo 0
0
$ node .skilled/bin/sync-agent-roster.cjs --check; echo exit=$?
agent-roster: OK
exit=0
$ node .skilled/bin/check-agent-mirror-sync.cjs >/dev/null; echo exit=$?
exit=0
$ node --test .opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs | grep -E "^. (pass|fail)"
ℹ pass 5
ℹ fail 0
$ node --test .opencode/plugins/tests/system-deep-loop-guard.test.cjs | grep -E "^. (pass|fail)"
ℹ pass 1
ℹ fail 0
$ node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/system-spec-kit | tail -1
Result: NO FINDINGS (1 UNKNOWN)
```

Recounts. The retry rules sit in five passages: `:602`, `:624` with `:627`, `:645-647`, `:661` and `:693` with `:728`. They escalate after 2 rejections, after 2 score retries and after 3 failures, and they offer `@debug` at 2 failures (`:728`) and at 3 (`:693`). The report counted three ladders. The line count is 910, so the cap needs 310 lines out. The registry holds three modes, not four, and none has an `execution` field.

### Finding Status

| Finding | Status | Evidence |
|---------|--------|----------|
| orchestrate-1 | reproduced | `orchestrate.md:80` and `:140` against `deep-research.md:113-116`. The `@deep-review` row (`:84`) already names `/deep:review`, but `:140` sends it to the leaf too |
| orchestrate-2 | reproduced | five passages, three escalation points, listed above |
| orchestrate-4 | operator answered 2026-11-14: the main agent | `:444` names `@markdown`, `:461` names the main agent and `:499` rejects the other route. Section 10 holds the question |
| orchestrate-5 | reproduced | `:152` includes the content and `:153` loads it by name. The doubled prompt is inferred from the runtimes loading a named agent's body. A dispatch transcript would confirm it |
| orchestrate-6 | reproduced | `:781` against `context.md:43`. `review` and `prompt-improver` are also `write: deny` |
| orchestrate-7 | reproduced | `:555`, `:634`, `:687`, `:789` and `:876` against `:854` |
| orchestrate-8 | reproduced | `:535`, `:406` against `code.md:129`, and `:452` against three `write: deny` leaves |
| across-6 (orchestrate part) | reproduced | 910 lines against `agent-template.md:62` |
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Route `/deep:research` and `/deep:review` requests to their commands and drop `execution` from the `Deep Route:` line (orchestrate-1)
- Replace the five retry passages with one ladder that counts `FAIL` and `BLOCKED` as phase 7 defines them (orchestrate-2)
- Name one spec-doc owner across Rules 2, 2b, 5 and 6, once the operator answers (orchestrate-4)
- Include a definition's content only when `subagent_type` is `general-purpose` (orchestrate-5)
- Keep read-only leaves out of file-based collection (orchestrate-6)
- Remove or replace the five unmeasurable gates (orchestrate-7)
- Correct the action-agent list, the `@code` example and the save mandate (orchestrate-8)
- Move the decomposition aids and the budget tables to a `system-spec-kit` reference and bring the file to 600 lines or less (across-6)

### Out of Scope
- The split footer at `:816` and `:833` and the self-score rule - phase 6 owns them (orchestrate-3 and across-2)
- `code.md` statuses - phase 7 owns them, and this phase only reads its definitions
- The dispatch guard in `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs` - it parses `mode=` and `target_agent=`, both kept, and it never reads `execution`
- `context.md:342`, which says "1-4 agents" where `orchestrate.md:771` says "1-3" - `context.md` belongs to phase 13
- The stale `subagent_type: "general"` claim in `.skilled/skills/system-deep-loop/runtime/feature-catalog/validation/mk-deep-loop-guard.md:31` - noticed, outside every owned finding

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/orchestrate.md` | Modify | All seven fixes and the section moves |
| `.skilled/agents/agent-registry.json` | Modify | The `deep-research` `taskType`, which generates the routing row at `:80` |
| `.claude/agents/orchestrate.md` | Modify | Hand-edited fork, frontmatter kept |
| `.pi/agents/orchestrate.md`, `.codex/agents/orchestrate.toml`, `.dsh/agents/orchestrate.patch.yml` | Regenerate | The three sync scripts |
| `.skilled/agents/README.txt` | Regenerate, if the roster changes it | `sync-agent-roster.cjs` |
| `.skilled/skills/system-spec-kit/references/workflows/orchestrator-dispatch.md` | Create | The moved sections |
| `.skilled/skills/system-spec-kit/leaf-manifest.json`, `leaf-aliases.json`, `ROUTER.md` | Modify | Register the reference on the DISPATCH route |
| `.skilled/skills/system-spec-kit/runtime/` trigger-index outputs | Regenerate | The new reference is in the corpus |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `/deep:research` or `/deep:review` request runs its command, and the orchestrator never dispatches a deep-loop leaf itself. The `deep-research` routing row names `/deep:research`. | `rg -n 'dispatch that leaf at depth 1' .skilled/agents/orchestrate.md` prints nothing, `sed -n '/BEGIN GENERATED: routing-table/,/END GENERATED/p' .skilled/agents/orchestrate.md \| rg -c '/deep:research'` prints 1 and `sync-agent-roster.cjs --check` prints `agent-roster: OK` |
| REQ-002 | The `Deep Route:` line carries only fields the mode registry holds and keeps the two the dispatch guard parses. | `rg -n 'execution=\|execution semantics\|any of the 4' .skilled/agents/orchestrate.md` prints nothing, `rg -c 'mode=<workflowMode>; target_agent=' .skilled/agents/orchestrate.md` prints 1 and the guard test prints `pass 1` and `fail 0` |
| REQ-003 | One retry ladder states the attempt count, the reassign step, the `@debug` offer and the escalation. Every other failure passage points to it. | `rg -n 'after 2 rejections\|up to 2x\|after 2 retries\|Attempts 1-2\|60s cooldown' .skilled/agents/orchestrate.md` prints nothing and `rg -c '^### Retry Ladder$' .skilled/agents/orchestrate.md` prints 1 |
| REQ-004 | Rules 2, 2b, 5 and 6 name one spec-doc writer: the main agent, as the operator answered on 2026-11-14. `:461` stays, and the `@markdown` route at `:444` and the rejection at `:499` go. | `rg -c 'main agent writes spec-folder docs directly' .skilled/agents/orchestrate.md` prints 1 or more, `rg -c --include-zero 'spec-doc creation through .@markdown.' .skilled/agents/orchestrate.md` prints 0, and Rule 6's correct-routing cell names the main agent |
| REQ-005 | The runtime copies, the roster and the pinned sections stay in step. | `sync-agent-roster.cjs --check` prints `agent-roster: OK`, `check-agent-mirror-sync.cjs` exits 0 and `node --test .opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs` prints `pass 5` and `fail 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | A dispatch includes the definition's content only when `subagent_type` is `general-purpose`. The `Agent Loading Protocol` heading stays, because five `cli-*` skills cite it by name. | `rg -n 'INCLUDE.*general-purpose' .skilled/agents/orchestrate.md` prints the step 2 line and `rg -c 'Agent Loading Protocol' .skilled/agents/orchestrate.md` prints 1 or more |
| REQ-007 | File-based collection asks only write-capable leaves to write. A read-only leaf returns its summary and the orchestrator writes the file. | `rg -n 'Pattern C' .skilled/agents/orchestrate.md .skilled/skills/system-spec-kit/references/workflows/orchestrator-dispatch.md` prints a line that names `@context` as returning, not writing |
| REQ-008 | Every remaining gate is one the orchestrator can measure. The ≥ 70 checklist item follows phase 6's self-score rule. | `rg -n -i '50,000 tokens\|~150K\|\(2 min\)\|approaching 80%\|Score ≥ 70' .skilled/agents/orchestrate.md` prints nothing |
| REQ-009 | The action-agent list, the `@code` example and the save mandate match the agents they name. | `rg -n '@general-purpose, @review, @debug\|code-review mode \(findings-first\|Mandate sub-agents to run' .skilled/agents/orchestrate.md` prints nothing |
| REQ-010 | `orchestrate.md` and its Claude fork are 600 lines or less, and each moved section leaves a one-line pointer to the reference. | `wc -l < .skilled/agents/orchestrate.md` and `wc -l < .claude/agents/orchestrate.md` each print 600 or less, and `rg -c 'orchestrator-dispatch.md' .skilled/agents/orchestrate.md` prints 1 or more |
| REQ-011 | The new reference is reachable on the `system-spec-kit` DISPATCH route and the skill check stays clean. | `rg -c 'orchestrator-dispatch.md' .skilled/skills/system-spec-kit/leaf-manifest.json .skilled/skills/system-spec-kit/leaf-aliases.json .skilled/skills/system-spec-kit/ROUTER.md` prints 1 or more per file and `sk-skill-check.cjs` prints `Result: NO FINDINGS` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every command in the acceptance column of section 4 prints what it names, run from the final tree.
- **SC-002**: `wc -l < .skilled/agents/orchestrate.md` prints 600 or less.
- **SC-003**: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 6 and 7 land first | The budget section and the ladder counts change under this phase | Phase 1 re-runs the measurement after both land and rebuilds the move list from the new line numbers |
| Dependency | The operator's spec-doc answer | Resolved 2026-11-14: the main agent | REQ-004 builds with the other ten REQs |
| Risk | A moved or renamed heading breaks a pinned test | High | `### Code Review Marker`, the Quality Gate table and `Agent Loading Protocol` stay in `orchestrate.md`, and both plugin tests run after each edit |
| Risk | The `Deep Route:` edit breaks the dispatch guard | Medium | `mode=` and `target_agent=` stay. The guard test runs before and after |
| Risk | The new reference is unreachable from the router | Medium | It is registered on all three surfaces, and `sk-skill-check.cjs` runs before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The phase changes agent prose and runs no service.
- **NFR-P02**: The orchestrator loads 600 lines or fewer of its own definition, down from 910.

### Security
- **NFR-S01**: No agent gains a permission. `git diff -- .skilled/agents/*.md` shows no change inside any frontmatter `permission:` block.
- **NFR-S02**: The rule that keeps external CLI executors opt-in (Rule 7) keeps every one of its seven numbered items.

### Reliability
- **NFR-R01**: The two plugin tests keep their baseline counts, `pass 5` and `pass 1`, with `fail 0`.
- **NFR-R02**: The mirror check exits 0 after every agent edit, before the next edit starts.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a `/deep:research` request with no packet state runs the command, which creates the state, so the leaf never sees a missing file.
- Maximum input: a 10 to 20 agent wave that includes `@context`, `@review` or `@prompt-improver` collects their 3-line summaries in the orchestrator's reply and writes no file from those leaves.
- Failure path: a rule still names `@markdown` as the spec-doc writer after the edit. The REQ-004 search prints a nonzero `@markdown` count and the build stops before the commit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One agent file, its four runtime copies, one registry record, one new reference and three registration files |
| Risk | 12/25 | Two plugin tests pin sections, and a dispatch guard parses the `Deep Route:` line |
| Research | 6/20 | The findings are reproduced. Only the post-phase-6 line numbers remain to measure |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is `orchestrate.md:461` ("The main agent writes spec-folder docs directly") deliberate? What the sources say: `spec-authoring-card.md` names no writer. It addresses whoever writes ("You write one packet, in one folder") and allows writes only to the packet folder. `speckit/plan.md:107` and `speckit/implement.md:93` say the workflow follows the card when it writes spec docs, and `speckit/README.txt:222` says "Main agent owns planning". `speckit-implement.yaml:178` routes component authoring to `@markdown for actual /create:* command execution; otherwise main-agent/direct sk-doc + system-spec-kit`. `markdown.md:65` accepts "Orchestrator-dispatched spec folder documentation authoring". So the speckit workflows back `:461`, and `@markdown` accepts the `:444` route too.
  - **Operator answer, 2026-11-14:** yes, deliberate. The main agent owns spec-folder docs, so `:461` stays and the `@markdown` route at `:444` and the rejection at `:499` go. REQ-004 is unblocked.
- Which skill owns the moved sections? Decision for this plan: `system-spec-kit`, because its DISPATCH route already loads `agent-io-contract.md` and `parallel-dispatch-config.md`. The operator can name another owner before the build.
<!-- /ANCHOR:questions -->

---
