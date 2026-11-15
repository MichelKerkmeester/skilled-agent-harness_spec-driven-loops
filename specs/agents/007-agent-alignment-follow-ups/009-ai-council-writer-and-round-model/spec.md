---
title: "Feature Specification: Phase 9: ai-council-writer-and-round-model"
description: "The ai-council agent names three different owners for its artifact writes, asks a completion question it can never answer YES, loops rounds it cannot resume and runs 816 lines against a 600-line cap. This phase plans the fixes and stops for the operator to name the one writer."
trigger_phrases:
  - "ai council writer and round model"
  - "phase 9 ai council writer and round model"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: ai-council-writer-and-round-model

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
| **Phase** | 9 of 14 |
| **Predecessor** | 008-orchestrate-routing-and-retry |
| **Successor** | 010-deep-loop-leaf-state-and-status |
| **Handoff Criteria** | The operator has named the one writer of `ai-council/**` artifacts, every owned finding has a shipped fix or a recorded no-fix with command output behind it, `.skilled/agents/ai-council.md` is at or below 600 lines and the roster, mirror and compiled-contract checks pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the agent alignment follow-ups packet. The build cannot start until the operator answers the writer question in section 10.

**Scope Boundary**: The `ai-council` agent and its four runtime copies, its record in `agent-registry.json` and the generated roster rows that record feeds, the `deep-ai-council` reference and playbook files that cite the agent's sections or copy its rules, the council runtime-parity test and the compiled `/deep:ai-council` contract. The `persist-artifacts.cjs` helper, `orchestrate-session.cjs`, the append gateway and the `/deep:ai-council` workflow YAML files do not change in this phase.

**Dependencies**:
- Phase 6 adds the untrusted-content rule to this agent, because it has WebFetch, and may remove the copied "Daemon-free retrieval" paragraph. Both change the line count this phase must bring under 600.
- Phase 8 edits `.skilled/agents/orchestrate.md`. This phase rewrites that file's generated roster block through the registry, so it runs after phase 8 lands.
- The operator's answer to the writer question.

**Deliverables**:
- One named writer of `ai-council/**` artifacts, stated the same way in the agent, the registry and the generated rosters
- A Q11 the agent can answer YES with its own tools, and no claim that the append gateway refreshes `ai-council-state.jsonl`
- One round per invocation with the caller owning the loop and the resume, and a stated `max_rounds` default
- Depth 1 as the default, lenses in place of unrunnable CLI vantages, no temperature instruction and one threshold table
- An agent file at or below 600 lines, with sections 12 to 17 moved into the `deep-ai-council` references and every citation repointed
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`ai-council.md` says it is the sole writer of `ai-council/**` (line 739), while the registry tells `@orchestrate` to run `persist-artifacts.cjs` after the agent returns (`agent-registry.json:44`) and `/deep:ai-council` persists each seat through its own script (`orchestrate-session.cjs:417`). Its Q11 asks for an append-gateway receipt the agent cannot get with Bash denied, and for a projection refresh the gateway never performs for this mode, so the agent can never claim completion. It loops rounds and resumes from a state log that only its caller writes, after it returns. It also defaults to fan-out when a dispatch forgets the depth marker, lists CLI vantages it cannot run, sets a sampling temperature by prompt, leaves two score bands undefined and runs 816 lines against a 600-line cap.

### Purpose
Every owned finding ends as a shipped fix or a recorded decision, and the agent can finish a council run without breaking a rule it states.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from the worktree root at `c1dbb1bcc4`. Each `$` line is a label with short paths. `scratch/measure.sh` holds the exact commands, and `bash scratch/measure.sh` reproduces this block, with rg's file order free to vary. Long lines are cut with `cut -c1-N`. Em dashes in tool output are rendered as hyphens.

```text
$ git diff --quiet 09f1d6499a HEAD -- .skilled/agents/ai-council.md .claude/agents/ai-council.md .skilled/agents/agent-registry.json; echo "exit=$?"
exit=0
# ai-council-1
$ sed -n 405p;569,570p ai-council.md | cut -c1-170
  The calling workflow records every state event (`round_start` + `seat_returned` x N + `deliberation_synthesized` + `round_end` + `council_complete`) through the append 
If ANY answer is NO -> DO NOT CLAIM COMPLETION
Fix verification gaps first. For Q11 specifically: re-run the missing writer calls, record each `artifact_written` event through the append gateway (exit 0 receipt), and 
$ rg -c refresh ai-council.md
9
$ rg -c "exit 0 receipt" ai-council.md
2
$ sed -n 255,275p append-mode-event.ts | rg -n "mode ===|return null"
6:  if (mode === 'deep-research' || mode === 'research') {
13:  if (mode === 'deep-review' || mode === 'review') {
20:  return null;
$ sed -n 77,78p deep-ai-council-auto.yaml
    file: no projection contract is registered for this mode, so `projectionRefreshed` comes back
    false and the legacy file is left untouched. Exit 0 therefore means the event is durable in
# ai-council-2
$ sed -n 403p;739p ai-council.md | cut -c1-150
- **Persist `ai-council/**` artifacts with Write and Edit BEFORE claiming completion.** Write each file in the shape §12 gives; the named writers of `
**Single writer authority:** The LEAF council is the sole writer authority for `ai-council/**` artifacts. The dispatching parent does not write to cou
$ sed -n 44p agent-registry.json | cut -c1-190
      "notes": "Planning-only multi-strategy architect (max 3 strategies). Post-dispatch responsibility: when @orchestrate dispatches at Depth 1, run `node .skilled/skills/system-deep-loop/d
$ sed -n 169p deep-ai-council-auto.yaml | cut -c1-170
          contract: "Per-seat stepwise persistence (GAP-32/GAP-36). Each seat is persisted as it returns via persist-artifacts.cjs --seat (lib/persist-artifacts.cjs#persi
$ rg -n "persistSeatStepwise\(packetSpecFolder|const persisted = |--agent., .plan" orchestrate-session.cjs
240:  return ['run', '--agent', 'plan', '--model', model, seatPrompt];
417:  const persisted = persistSeat(packetSpecFolder, persistedSeat, { round: context.round_number || 1 });
$ sed -n 160p;181p deep-ai-council-auto.yaml | cut -c1-120
          - route_fields: { mode: ai-council, target_agent: "@ai-council", execution: multi_topic_session_round, state_s
            target_agent: ai-council
$ rg -n "fs.writeFileSync\(targetPath|fs.appendFileSync\(statePath|writeStateJsonl\(packetRoot" persist-artifacts.cjs (lib)
522:  fs.writeFileSync(targetPath, content, 'utf8');
699:    () => writeStateJsonl(packetRoot, rendered.stateLog, { round_id: roundId, timestamp: DEFAULT_TIMESTAMP }),
735:  fs.appendFileSync(statePath, `${JSON.stringify(metadataEvent(event))}\n`, 'utf8');
# ai-council-3
$ sed -n 668p;678p;685p ai-council.md | cut -c1-150
   Each "record ... through the append gateway" below is done by the calling workflow (`append-mode-event.cjs --mode ai-council`, exit 0 receipt); thi
   8. Convergence check (per §15 two-of-three-agree rule). If NOT converged: increment `current_round`, then repeat from step 3 with the updated round
3. **Resume after interruption**: read the state log and resume from the next incomplete event. If `round_start` exists without matching `round_end`, 
$ rg -n max_rounds ai-council.md | cut -c1-110
652:- `ai-council-config.json`: `{spec_folder, current_round, max_rounds, seats_per_round, convergence_signal,
729:- `max_rounds` reached without convergence: emit `council_complete` with `convergence:false` and recommend
$ rg -n "DEFAULT_MAX_ROUNDS = " persist-artifacts.cjs (lib); sed -n 21p deep-ai-council-auto.yaml
39:const DEFAULT_MAX_ROUNDS = 3;
  max_rounds_per_topic: "[MAX_ROUNDS_PER_TOPIC] - Default: 3."
# ai-council-4
$ sed -n 16p;59p;63p ai-council.md
  task: allow
The AI Council is a LEAF when another agent dispatches it, and may dispatch council seats only when the operator invokes it directly.
- Otherwise, operate at Depth 0.
$ for f in .skilled/agents/*.md; do rg -l "^  task: allow" $f; done
.skilled/agents/ai-council.md
.skilled/agents/orchestrate.md
$ rg -n "fallback when no nesting|operate as Depth 0" depth-dispatch.md
96:Depth 0 is the fallback when no nesting evidence exists.
142:4. If no nesting evidence exists, operate as Depth 0.
# ai-council-5
$ sed -n 10p;110,111p;241p;244p;394p ai-council.md | cut -c1-120
  bash: deny
| `cli-opencode` | External AI vantage | Need code-generation, refactoring, or implementation-plan contrast | OpenCode e
| `cli-claude-code` | External AI vantage | Need deep code reasoning, structured decomposition, or edge-case analysis | 
If this runtime cannot actually invoke that external system, state that your answer is a simulated vantage lens, not ext
Operate at temperature <TEMP>, using <deterministic | balanced | exploratory> reasoning.
- Seek distinct AI vantage points such as `cli-opencode`, `cli-claude-code`, `cli-opencode`, and native `@deep-research`
$ rg -n "^\| Strategy \| Temp" ai-council.md seat-diversity-patterns.md
.skilled/agents/ai-council.md:148:| Strategy | Temp | Reasoning Lens | Best For |
.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md:51:| Strategy | Temp | Reasoning Lens | Best For |
# ai-council-6
$ rg -n "15 point|25\+|within 10|<10 point" ai-council.md scoring-rubric.md | cut -c1-130
.skilled/agents/ai-council.md:337:   - Required when scores are within 15 points, when assumptions conflict, or when the leading p
.skilled/agents/ai-council.md:343:2. **Adversarial cross-critique** is required when seats are within 15 points; skip only when on
.skilled/agents/ai-council.md:348:   - If two seats score within 10 points -> merge complementary elements.
.skilled/agents/ai-council.md:356:**When:** Required when strategies are within 15 points of each other after initial scoring, whe
.skilled/agents/ai-council.md:380:| Clear winner (>15 point lead) | Adopt winner, note alternatives |
.skilled/agents/ai-council.md:381:| Close race (<10 point spread) | Merge best elements from top 2 |
.skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md:149:- scores are within 15 points;
.skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md:170:- strategies are within 15 points after 
.skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md:174:Skip only when one seat leads by 25+ poi
.skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md:265:| Clear winner (>15 point lead) | Adopt 
.skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md:266:| Close race (<10 point spread) | Merge 
# ai-council-7 and across-6
$ wc -l ai-council.md; sed -n 62p agent-template.md | cut -c1-80
     816 .skilled/agents/ai-council.md
Production agent files should stay at or below **600 lines**. If an agent needs 
$ rg -n "^## 1[2-8]\. " ai-council.md | cut -c1-60
631:## 12. OUTPUT PROTOCOL - `ai-council/` SUBFOLDER CONVENT
664:## 13. INVOCATION CONTRACT - FIRST-CALL VS SUBSEQUENT VS
691:## 14. STATE SCHEMA - JSONL EVENT TYPES
724:## 15. CONVERGENCE SIGNAL - 2/3 AGREEMENT RULE
737:## 16. COUNCIL PERSISTENCE PROTOCOL
784:## 17. ROLLBACK FOR OPERATORS
799:## 18. HOOK-INJECTED CONTEXT ROUTING
$ sed -n 748p;788p ai-council.md | cut -c1-110
**The calling workflow records state through the append gateway** (shown for reference; this agent never runs 
Then move the round artifacts into `ai-council/failed/round-NNN-<timestamp>/`, and record an `artifact_superse
$ sed -n 631,798p ai-council.md | wc -l
168
$ rg -n "§1[2-8]" deep-ai-council/ (agent-section citations, changelog excluded)
references/structure/output-schema.md:142:- Agent body: `.skilled/agents/ai-council.md` §8 OUTPUT FORMAT and §
references/structure/folder-layout.md:81:- Agent body: `.skilled/agents/ai-council.md` §12 OUTPUT PROTOCOL (th
references/structure/folder-layout.md:87:- Decision records: ADR-002 (folder layout), ADR-004 (validator polic
references/convergence/convergence-signals.md:75:- Agent body: `.skilled/agents/ai-council.md` §16
manual-testing-playbook/depth-and-failure-handling/resume-after-interrupted-state.md:30:- Expected execution p
manual-testing-playbook/depth-and-failure-handling/resume-after-interrupted-state.md:42:2. Read `.skilled/agen
manual-testing-playbook/depth-and-failure-handling/resume-after-interrupted-state.md:68:Update `state-format.m
manual-testing-playbook/writer-library-contract/out-of-scope-write-rejection.md:30:- Expected execution proces
manual-testing-playbook/writer-library-contract/out-of-scope-write-rejection.md:41:1. Read `.skilled/agents/ai
references/structure/state-format.md:134:This follows agent body §14 and ADR-001 in the internal design notes.
references/structure/state-format.md:242:- Agent body: `.skilled/agents/ai-council.md` §14
references/convergence/failure-handling.md:284:- Agent body: `.skilled/agents/ai-council.md` §10 FAILURE HANDL
references/patterns/seat-diversity-patterns.md:284:- Agent body: `.skilled/agents/ai-council.md` §3 and §16.
references/patterns/command-wiring.md:185:- Agent body §16: `.skilled/agents/ai-council.md`
$ rg -n "§1[2-9]" .skilled .claude/agents (no node_modules, runtime/data, retrieval/fixtures, benchmark/reports) | rg -i council | cut -c1-90
.claude/agents/ai-council.md:388:- **Persist `ai-council/**` artifacts with Write and Edit
.claude/agents/ai-council.md:663:   8. Convergence check (per §15 two-of-three-agree rule)
.skilled/agents/ai-council.md:403:- **Persist `ai-council/**` artifacts with Write and Edi
.skilled/agents/ai-council.md:678:   8. Convergence check (per §15 two-of-three-agree rule
.skilled/skills/system-deep-loop/deep-ai-council/changelog/v1.1.0.0.md:117:External toolin
.skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/depth-and-failure
.skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/depth-and-failure
.skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/depth-and-failure
.skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/writer-library-co
.skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/writer-library-co
.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signal
.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/failure-handling.m
.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md:185
.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patter
.skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md:81:
.skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md:87:
.skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md:142
.skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:134:
.skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:242:
.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/multi-ai-council/council-output
$ (same search) | wc -l
20
$ rg -l "(ai-council\.md.?|[Aa]gent body|[Aa]gent) §[0-9]+" deep-ai-council/ | wc -l
15
$ sed -n 49p agent-registry.json | cut -c1-120
          "reason": "Twelve files in the deep-ai-council skill cite this agent's sections 3 to 17 by number, so the sect
$ rg -n "COUNCIL PERSISTENCE PROTOCOL|Single writer authority|threshold scores" multi-ai-council-runtime-parity.vitest.ts
83:    expect(canonicalBody).toContain('deep-ai-council threshold scores');
96:    expect(codex).toContain('COUNCIL PERSISTENCE PROTOCOL');
97:    expect(codex).toContain('Single writer authority');
# baselines
$ node .skilled/bin/sync-agent-roster.cjs --check
agent-roster: OK
exit=0
$ node .skilled/bin/check-agent-mirror-sync.cjs | tail -1
agent-mirror-sync: 11 agent(s) checked - all comparable mirrors in sync - OK
exit=0
$ node compile-command-contracts.cjs --command deep/ai-council | diff -q - deep-ai-council.contract.markdown
exit=0
$ ls .skilled/skills/system-spec-kit/runtime/node_modules/.bin/vitest
No such file or directory
```

What the block shows, finding by finding:
- **ai-council-1**: reproduced. Q11 at line 570 asks for an "exit 0 receipt" from a gateway the agent cannot call (Bash denied at line 10, and line 405 says so). It also asks the agent to confirm a refreshed `ai-council-state.jsonl`, but `append-mode-event.ts:255-275` returns no projection contract for this mode and `deep-ai-council-auto.yaml:77-78` says the file is left untouched. Nine agent lines claim that refresh.
- **ai-council-2**: reproduced, and wider than the report. Three writers are named, not two. The agent claims sole authority (line 739). The registry assigns `persist-artifacts.cjs` to `@orchestrate` (line 44). `/deep:ai-council` writes seats through `orchestrate-session.cjs:417` and dispatches its seats as `opencode run --agent plan` (line 240), never `@ai-council`. The helper also writes `ai-council-state.jsonl` directly (lib lines 522, 699 and 735), which agent lines 406 and 714 forbid. The operator answered A on 2026-11-14: the agent stays the one writer.
- **ai-council-3**: reproduced. Step 8 at line 678 loops inside the agent, while line 668 says only the caller records events, after the agent returns. So resume at line 685 reads a log that holds none of the current run. `max_rounds` has no default in the agent (lines 652 and 729). The helper and the workflow both default it to 3.
- **ai-council-4**: reproduced. `ai-council` is the only registry LEAF with `task: allow`, and line 63 makes Depth 0 fan-out the default. `depth-dispatch.md:96` and `:142` carry the same default.
- **ai-council-5**: reproduced. Lines 110-111 list two CLI skills as vantages the agent cannot run with Bash denied, and line 241 already has each seat declare itself simulated. Line 244 sets a temperature by prompt, which a prompt cannot do. The same Temp column is in `seat-diversity-patterns.md:51`. Line 394 lists `cli-opencode` twice.
- **ai-council-6**: reproduced. Critique is required within 15 points and skippable only at 25 or more (line 343), so a 15 to 24 lead has no rule. The matrix (lines 380-381) leaves a 10 to 15 spread undefined. `scoring-rubric.md` copies both gaps.
- **ai-council-7**: partly reproduced. 816 lines against the 600 cap holds, and sections 14, 16 and 17 describe a script and a file move the agent never performs (lines 748 and 788). Moving sections 12 to 17 removes lines 631 to 798, which is 168 lines and leaves 648, not "about 250". Across `.skilled/` and `.claude/agents/`, 20 lines that mention the council carry a §12 to §19 number. Seventeen are live citations of sections 12 to 17: thirteen lines in nine `deep-ai-council` files and four self-references in the two agent files (`.skilled` lines 403 and 678, `.claude` lines 388 and 663). Three are excluded: `changelog/v1.1.0.0.md:117` cites playbook §17, the fixture `council-output-full.md:160` is recorded past output and `folder-layout.md:87` names "the helper/schema/§17/parity ADRs", an ADR label the build reads before deciding. `folder-layout.md:81` already cites ROLLBACK as §18, which is wrong today. Fifteen `deep-ai-council` files cite some agent section by number. The registry reason says twelve files.
- **across-6 (ai-council part)**: partly reproduced, with the same evidence as ai-council-7.
- The two council tests did not run as a baseline: `system-spec-kit/runtime` has no `node_modules` in this worktree.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- ai-council-2: state one writer of `ai-council/**` artifacts in the agent, the registry notes and the generated rosters, once the operator names it
- ai-council-1: rewrite Q11 and its fix line so the agent can answer YES with its own tools, and remove every claim that the gateway refreshes `ai-council-state.jsonl`
- ai-council-3: run one round per invocation with the caller owning the loop and the resume, and state the `max_rounds` default of 3
- ai-council-4: make Depth 1 the default and dispatch seats only when the prompt states operator invocation, in the agent and in `depth-dispatch.md`
- ai-council-5: call the two CLI rows lenses and drop the Temp column, the seat prompt's temperature line and the duplicate `cli-opencode`, in the agent and in `seat-diversity-patterns.md`
- ai-council-6: replace the scattered score thresholds with one table of contiguous bands, in the agent and in `scoring-rubric.md`
- ai-council-7 and across-6: bring the agent to 600 lines or fewer by moving sections 12 to 17 into the `deep-ai-council` references and cutting the remaining lines named in `plan.md`, then repoint every citation

### Out of Scope
- Changing `persist-artifacts.cjs`, `orchestrate-session.cjs` or the append gateway - the findings are about what the agent and the registry say, and the operator's answer decides which text changes, not which code
- The `/deep:ai-council` route claim that names `@ai-council` (`deep-ai-council-auto.yaml:160` and `:181`) while seats run as `opencode run --agent plan` - it is the command's contract, recorded under section 10 for the operator
- The untrusted-content rule for this agent - phase 6 owns it as across-4
- Historical text in `deep-ai-council/changelog/` and the test fixture `council-output-full.md:160` - they record past output, not a live link

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/ai-council.md` | Modify | Writer statement, Q11, round model, depth default, lenses, thresholds, the section move and the cuts |
| `.claude/agents/ai-council.md` | Modify | The same edits by hand, matched by content because its line numbers run about 15 lower |
| `.pi/agents/ai-council.md`, `.codex/agents/ai-council.toml`, `.dsh/agents/ai-council.patch.yml` | Regenerate | The three sync scripts |
| `.skilled/agents/agent-registry.json` | Modify | The `ai-council` notes for the named writer and the `templateExceptions` reason with the real citation count |
| `.skilled/agents/orchestrate.md`, `.skilled/agents/README.txt` | Regenerate | Their generated blocks, through `sync-agent-roster.cjs`, when the notes or summary change |
| `.claude/agents/orchestrate.md` and the orchestrate pi, codex and dsh copies | Modify, Regenerate | The `.claude` agent-files row by hand, the other three by the sync scripts |
| `.skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md`, `state-format.md`, `output-schema.md` | Modify | Receive section 12 to 14 content that is not already there, and repoint citations |
| `.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md`, `failure-handling.md`, `depth-dispatch.md` | Modify | Receive section 15 and 17 content, repoint citations and change the depth default |
| `.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md`, `seat-diversity-patterns.md` | Modify | Receive section 16 content, repoint citations and drop the Temp column |
| `.skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md` | Modify | The one threshold table |
| `.skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/depth-and-failure-handling/resume-after-interrupted-state.md`, `writer-library-contract/out-of-scope-write-rejection.md` | Modify | Repoint citations and restate what the resume scenario checks |
| `.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md` and `changelog/` | Modify, Create | A version and changelog entry for the reference changes, if the hub version rule requires one |
| `.skilled/skills/system-spec-kit/runtime/tests/multi-ai-council-runtime-parity.vitest.ts` | Modify | The strings at lines 96-97, and lines 71-72 and 93-95 under writer answer B or C |
| `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown` | Regenerate | It records a hash of the agent and of the moved-to references |
| `.skilled/skills/system-spec-kit/runtime/` trigger-index outputs | Regenerate | The corpus manifest hash moves with every edited document |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

REQ-001, REQ-002, REQ-004 and REQ-010 follow the operator's writer answer, A (the agent), recorded in section 10 on 2026-11-14. The rest hold under any answer.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One writer of `ai-council/**` artifacts is named, and the agent, the registry notes and the generated rosters name the same one. | `rg -c --include-zero 'persist-artifacts' .skilled/agents/agent-registry.json` prints `0`, and `rg -c --include-zero '^  (write\|edit): deny' .skilled/agents/ai-council.md` prints `0` |
| REQ-002 | Q11 and its fix line ask only for what the agent can do with its own tools: the artifact set written with Write and Edit, and every event named in order. | `rg -c --include-zero 'exit 0 receipt' .skilled/agents/ai-council.md` prints `0`, down from 2 at lines 570 and 668 |
| REQ-003 | No text says the append gateway refreshes `ai-council-state.jsonl`. | `rg -c --include-zero 'refresh' .skilled/agents/ai-council.md` prints `0`, down from 9, and `rg -n 'gateway refreshes\|refreshed by the append gateway\|refreshes the read-only' .skilled/skills/system-deep-loop/deep-ai-council/references` prints nothing |
| REQ-004 | The agent runs one round per invocation, and the caller owns the round loop and the resume. | `rg -c --include-zero 'repeat from step 3' .skilled/agents/ai-council.md` prints `0` and `rg -n 'one round per invocation' .skilled/agents/ai-council.md` prints 1 line or more |
| REQ-005 | The agent copies, the rosters and the compiled contract agree with the edited files, and the council tests pass. | `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0, the compiled-contract diff exits 0 and the council vitest suites print 0 failures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The agent states that `max_rounds` defaults to 3. | `rg -n 'max_rounds. defaults to 3' .skilled/agents/ai-council.md .skilled/skills/system-deep-loop/deep-ai-council/references` prints 1 line or more |
| REQ-007 | Depth 1 is the default. Seats are dispatched only when the prompt states operator invocation. | `rg -c --include-zero 'Otherwise, operate at Depth 0' .skilled/agents/ai-council.md` prints `0`, and `rg -c --include-zero 'fallback when no nesting\|operate as Depth 0' .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md` prints `0` |
| REQ-008 | The two CLI rows are lenses, no table carries a Temp column, the seat prompt sets no temperature and line 394 lists each vantage once. | `rg -c --include-zero 'External AI vantage\|temperature <TEMP>' .skilled/agents/ai-council.md` prints `0`, `rg -c --include-zero '^\| Strategy \| Temp' .skilled/agents/ai-council.md .skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md` prints `:0` for each file and `rg -c 'AI Vantage Target' .skilled/agents/ai-council.md` still prints 1 or more because `lib/persist-artifacts.cjs:173` parses that column |
| REQ-009 | One threshold table with contiguous lead bands replaces the scattered thresholds, in the agent and in `scoring-rubric.md`. | `rg -c --include-zero 'within 15 points\|>15 point lead\|<10 point spread\|within 10 points\|25\+ points' .skilled/agents/ai-council.md .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md` prints `:0` for each file, and `rg -c 'Lead of 15 to 24'` on the same two files prints 1 for each |
| REQ-010 | The agent is at or below 600 lines, sections 12 to 17 live in the `deep-ai-council` references and no citation points at a moved or renumbered section. | `wc -l < .skilled/agents/ai-council.md` prints 600 or less, `rg -n '§1[2-9]' .skilled/agents/ai-council.md .claude/agents/ai-council.md .skilled/skills/system-deep-loop/deep-ai-council -g '!**/changelog/**'` prints no citation of a moved or renumbered agent section and `rg -c --include-zero 'Twelve files' .skilled/agents/agent-registry.json` prints `0` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each owned finding id has a row in `implementation-summary.md` with the command that shows it fixed, or the recorded reason no fix shipped.
- **SC-002**: `wc -l < .skilled/agents/ai-council.md` prints 600 or less after phase 6 has landed its addition to the same file.
- **SC-003**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's writer answer | Resolved 2026-11-14: A, the agent | REQ-001, REQ-002, REQ-004 and REQ-010 build to answer A |
| Dependency | Phase 6 edits the same agent file | Its added rule moves the line count and the line numbers this plan quotes | Phase 1 of `tasks.md` re-measures `wc -l` and every quoted line after phase 6 lands |
| Risk | Removing sections 12 to 17 renumbers sections 18 and 19, so an old `§13` link would point at RELATED RESOURCES | High | The citations are repointed in the same commit as the move, and the REQ-010 search runs before the commit |
| Risk | The runtime-parity test asserts strings the move removes | Medium | The test is edited in the same commit, and the council suites run before and after |
| Risk | Moving only the agent text leaves `scoring-rubric.md` and `seat-diversity-patterns.md` contradicting it | Medium | Both copies are in scope under REQ-008 and REQ-009 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The phase changes documents and one test, and no service runs.
- **NFR-P02**: N/A. No throughput path changes.

### Security
- **NFR-S01**: The agent's write boundary stays `ai-council/**` or narrows to none. No change widens it.
- **NFR-S02**: N/A here. The untrusted-content rule for WebFetch output is phase 6's.

### Reliability
- **NFR-R01**: Under every writer answer, a council run can reach a YES on all eleven self-check questions without a tool the agent lacks.
- **NFR-R02**: N/A. No uptime target applies.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a dispatch prompt with no depth line runs Depth 1, processes seats in context and dispatches nothing.
- Maximum input: a run that reaches `max_rounds` of 3 without convergence ends with `council_complete` and `convergence:false`, and the caller passes `--not-converged` if the helper writes.
- Failure path: a citation left pointing at a moved section number makes the REQ-010 search print a line, and the build stops before the commit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | One agent and its four copies, the registry, eleven skill files, one test and four generated outputs |
| Risk | 13/25 | The writer contract binds the agent, a helper and a command, and two tests assert its strings |
| Research | 12/20 | The writer question is open. The rest is reproduced |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Operator answer, 2026-11-14: A, the agent.** The agent stays the one writer of `ai-council/**` artifacts, and the registry drops its `persist-artifacts.cjs` step. The B and C rows below are kept as the record of what was weighed.
- **The question was: who owns `ai-council/**` artifact writes, the agent, `persist-artifacts.cjs` or the command workflow?** What each one does today:
  - **A) The agent.** It writes with Write and Edit (`ai-council.md:403`, `:741`) and claims sole authority (`:739`). It runs no script and names state events for a caller to record (`:405`, `:668`).
  - **B) `persist-artifacts.cjs`.** It parses a finished council report and writes the whole set: config, strategy, state log, deliberation, report and each seat (`lib/persist-artifacts.cjs:687-720`). Every file goes through `fs.writeFileSync` (`:522`). It also writes `ai-council-state.jsonl` directly (`:699`, `:735`) and appends `artifact_written` events itself, not through the gateway. The registry tells `@orchestrate` to run it after the agent returns (`agent-registry.json:44`). It defaults `max_rounds` to 3 (`:39`) and assumes convergence unless given `--not-converged` (`:1055`).
  - **C) The command workflow.** `/deep:ai-council` runs `orchestrate-session.cjs`, which dispatches each seat as `opencode run --agent plan` (`:240`) and persists it with `persistSeatStepwise` (`:416-417`). The workflow states that contract at `deep-ai-council-auto.yaml:169`. This path never dispatches `@ai-council`.
- **Which requirements change with each answer:**
  - **A**: REQ-001 keeps the agent as writer, scopes "sole writer" to runs that dispatch `@ai-council`, and removes the post-dispatch helper step from the registry notes. REQ-002 makes Q11 "artifact set written with Write and Edit, and every event named in order". REQ-004 resumes from the artifacts on disk. REQ-010 moves section 16 to `command-wiring.md` and drops the line 96-97 test strings.
  - **B**: REQ-001 sets `write` and `edit` to deny in the agent and drops Write and Edit from the `.claude` tools, and the codex sandbox becomes read-only. The agent returns the report only, and the registry names the helper for every dispatcher. REQ-002 makes Q11 "the report carries every section `output-schema.md` marks required". REQ-004 has the caller rerun an interrupted round. REQ-010 deletes the agent's persistence text instead of moving it, and test lines 71-72, 93-95 and 96-97 change.
  - **C**: REQ-001 makes the same permission changes as B. A direct `@ai-council` dispatch writes nothing, and the registry routes persisted runs to `/deep:ai-council`, which touches phase 8's routing work. REQ-002 and REQ-004 match B. REQ-010 matches B.
- Noticed outside this folder and not changed: the `/deep:ai-council` workflow's route proof names `target_agent ai-council` (`deep-ai-council-auto.yaml:160`, `:181`), but its seats run as `opencode run --agent plan` (`orchestrate-session.cjs:240`). This matters most if the answer is C.
<!-- /ANCHOR:questions -->

---
