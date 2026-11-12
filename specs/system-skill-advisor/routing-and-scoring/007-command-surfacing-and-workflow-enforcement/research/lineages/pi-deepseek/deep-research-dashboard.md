---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: How should the skill advisor surface slash commands (all 45 under .skilled/commands, not only /doctor) so a model either runs the matching command workflow by itself or asks the user first, and how does a request typed as plain chat with no slash command still reach the proper command workflow on every runtime? Work through the ten research angles in section 3 of specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md: inventory, scoring, output contract, run or ask, invocation mechanics, chat-only users, skill and command linkage, measurement, prior art, failure modes. Start from the advisor runtime in .skilled/skills/system-skill-advisor (command-bridges, scorer projection and fusion, render.ts), the commands tree, AGENTS.md gates 2 and 4, and the prior packets 003-doctor-command-surfacing and system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review. Cite path:line for every claim and name evidence that contradicts a recommendation as well as evidence that supports it.
- Started: 2026-11-12T09:30:02.000Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-pi-deepseek-1794475749931-e4ukfw
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Angle 1 inventory: commands tree vs bridge inventory in both directions, per-runtime enablement, and the one runnable-string path in render.ts | inventory | 1.00 | 9 | complete |
| 2 | Angle 2 scoring: command projection population, lane weights, slash-only command keywords, plain-phrase boost coverage and the read-only/mutating confidence cliff | scoring | 1.00 | 9 | complete |
| 3 | Angle 3 output contract: public strict schema, both brief sentence forms, doctor-only runnable labelling, and the real token budget of the emitted brief | output-contract | 1.00 | 9 | complete |
| 4 | Angle 4 run-or-ask: frontmatter write capability, the 25 [:auto|:confirm] hints, doctor mutating taxonomy (15 read-only / 2 add-only / 18 mutates), and the existing blast-radius ladder as the policy vocabulary | run-or-ask | 1.00 | 8 | complete |
| 5 | Angle 5 invocation mechanics: per-runtime command mirrors, seven brief adapters versus a six-row doc table, and the two universal fallbacks (name-and-ask, load-and-follow) | invocation | 1.00 | 8 | complete |
| 6 | Angle 6 chat-only users: brief advisory contract, AGENTS.md as sole root doc and binding surface, 1-of-14 skill command pointers, runner refusal limits, and the three-layer mechanism | chat-only | 1.00 | 9 | complete |
| 7 | Angle 7 skill and command linkage: three incompatible linkage carriers, 18 of 19 ownerMode resolutions, create/agent and speckit/plan routers that bypass skills, and why skill-to-command implication is unsound | linkage | 1.00 | 8 | complete |
| 8 | Angle 8 measurement: four corpora, doctor-only command expectations (17 of 35 bridges covered), chat-style share of 63 of 78 rows, 19 control rows, and the missing command-level metrics | measurement | 1.00 | 8 | complete |
| 9 | Angle 9 prior art from the shipped runtime mirrors: three-surface convergence, a static Cursor routing rule whose dynamic adapter is dormant, Devin inheritance, and the generated-fence anti-drift pattern | prior-art | 1.00 | 7 | insight |
| 10 | Angle 10 failure modes: ungated child sessions in the advisor path, existing over-trigger and default_target guards, the brief-command-advisor cycle, budget headroom, dormant delivery, and ownerMode dead references | failure-modes | 1.00 | 8 | complete |

- iterationsCompleted: 10
- keyFindings: 83
- openQuestions: 1
- resolvedQuestions: 8

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 8/9
- [x] Why do plain planning and research prompts return zero recommendations, and what do the no-slash penalty and the mutating-command gate cost in recall versus what they buy in precision?
- [x] What must the advisor_recommend output contract carry (kind, runnable, brief wording, token budget) for a model to act on a surfaced command instead of a raw bridge id?
- [x] Which commands are safe to start without asking, which need a question first, and where should that run-or-ask policy live?
- [x] Can a model start a slash command by itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what fallback exists where it cannot?
- [x] Which mechanism actually brings a plain-chat request onto the command workflow on every runtime: advisor brief, AGENTS.md gate, hook, skill-to-command pointer, or runner refusal?
- [x] Which command workflows never load the mode SKILL.md their metadata names, and should a skill recommendation imply its command?
- [x] Which benchmark rows and metrics separate a missed command from a wrongly started one?
- [x] What prior art exists for routing free text to a packaged workflow, and which failure modes (over-trigger, command/skill ambiguity, child sessions starting commands, loops, brief budget) must a design guard against?
- [ ] Which of the 45 commands in .skilled/commands have an active advisor bridge, which bridges point at retired or unmatched names, and what would one drift-proof inventory require? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] Which of the 45 commands in .skilled/commands have an active advisor bridge, which bridges point at retired or unmatched names, and what would one drift-proof inventory require?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"code":1,"other":56}
- WARNING event: novelty_signal_inert metric=newInfoRatio run=10 window=3 sparkline=▄▄▄ — newInfoRatio held flat at 1 across 3 iterations — the novelty signal is uninformative, so convergence and "not exhausted" claims derived from it are untrustworthy.
- Advisory event: trend_flatline metric=score run=10 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Counting commands by recursive `find`: reports 90 vs the real 45 because the doctor fixture tree contains SKILL/ROUTER markdown. Rejected as an inventory method; group-level enumeration is the reliable count. (iteration 1)
- None. The three bridge sources are readable and the diff is complete at the id/command level. What remains open is the *authority* question (which source wins when they disagree), which needs the drift-guard tests, not more enumeration. (iteration 1)
- Treating the 62 bridge entries as "62 commands": entries over-count doctor subcommands and under-count five shipped commands. Rejected; command strings, not ids, are the unit that must be covered. (iteration 1)
- "Enablement is the whole story": if the 22 disabled bridges were enabled, plain prose would still not match, because their keywords are slash strings and their only plain-phrase path is the 8-row table. Enablement widens typed-slash recall only. (iteration 2)
- "The advisor deliberately abstains on commands": contradicted by the doctor family, which is fully enabled, read-only-flagged where appropriate, and renders runnable strings. Abstention is a property of non-doctor commands, not of commands as a class. (iteration 2)
- Searching for a separate "no-slash penalty" constant: there is none. The effect the spec describes is produced by the *absence* of a plain-language key on command projections plus the explicit lane's slash-only boost table, not by a negative constant. Recorded so later iterations do not hunt for a penalty that does not exist. (iteration 2)
- "Emit the command only when the skill is a command owner": this is what the doctor companion line already does, and it cannot express the mapping for non-doctor commands because no non-doctor id has a command string to give. (iteration 3)
- "Raise the token cap to make room for commands": contradicted by the measurement — the routing head is ~13 tokens of an 80-token budget, and the one overrun comes from a directive appended outside the cap. Raising the cap would grow the directive budget, not the command payload. (iteration 3)
- None unresolved. The single open thread is that `workflowMode` exists publicly but is unpopulated for command bridges; whether it is the intended carrier is a question for the skill-linkage angle, not this one. (iteration 3)
- Deriving risk from `allowed-tools`: Bash is declared by all 45 commands, so the signal is constant. (iteration 4)
- Deriving risk from the command name: `/doctor:install` is read-only by manifest and `/doctor:env` mutates, so names invert the truth on real examples. (iteration 4)
- Putting the policy in `AGENTS.md` as a second list: there are already four hand-maintained sources (three metadata hubs, `allow-list.json`, `_routes.yaml`, `scoring-compatibility.json`); a fifth would drift the same way. (iteration 4)
- Searching for a `risk`, `writes`, or `danger` field in command metadata: none exists under any name. The only risk vocabulary in the tree is doctor's `mutating`. (iteration 4)
- "Give the model the slash string and it will invoke it": no runtime exposes slash commands as model tools, and no repository rule instructs the model to type one. (iteration 5)
- "Runtime parity is a per-runtime brief problem": one renderer feeds all transports, so divergence lives in command mirroring and DSH's missing documentation row, not in the brief. (iteration 5)
- Looking for a model-invocable command mechanism in the hooks: the adapters only inject context or notices; none can dispatch a command. (iteration 5)
- A fifth inventory or a command registry: four hand-maintained sources already exist and iteration 1-2 showed the drift between them. (iteration 6)
- A new gate: Gate 2 already occupies the per-turn slot; a second gate would compete for the same prefix budget. (iteration 6)
- Hook-level enforcement of commands: the hook contract is fail-open by design and every adapter returns `{}` on failure. (iteration 6)
- Looking for an existing "command discovery" rule elsewhere in the ruleset: none. The closest text (`PLAN-WORKFLOW LOCK`, `sk-git` rule 16) forbids substitution but assumes the workflow is already named. (iteration 6)
- Relying on skill-to-command pointers alone: 1 of ~14 skills has one, and pointers cannot trigger discovery. (iteration 6)
- Inferring a command from a skill recommendation: unsound for 13 skills with no command pointer and for the 27 commands with no skill pointer. (iteration 7)
- Searching for a single canonical command→skill field: there is none. The three existing carriers (`skill_agent`, `ownerMode`, `allow-list.skillId`) are the whole vocabulary, and only `allow-list.skillId` covers commands without metadata. (iteration 7)
- Treating metadata `choreography` as the executed path: contradicted by `/create:agent`, whose router loads only assets, and by `/speckit:plan`, which loads reference cards rather than the SKILL.md. (iteration 7)
- A new benchmark harness: the doctor slice already has the exact shape (prose prompt → command id, `expected_second`, controls), and a second harness would duplicate its fixtures. (iteration 8)
- Looking for a command-level metric anywhere in the captured baseline or the bench files: none. `scorer-bench.ts` and the baseline both speak skill ids only. (iteration 8)
- Measuring command surfacing through the existing skill metrics: a command-only regression leaves all five baseline metrics unchanged, which is the failure this iteration exists to prevent. (iteration 8)
- Copying a command list into each runtime's static rule by hand: the tree already proves that pattern drifts (iteration 1's four sources) and already has a generator for the one block that stays in sync. (iteration 9)
- Searching for a non-Cursor static routing rule: none exists; Codex, Pi and DSH receive `AGENTS.md` directly and have no rules folder. (iteration 9)
- Treating hook delivery as the parity guarantee: one runtime documents its adapter as dormant under the tested build. (iteration 9)
- A separate "command loop breaker" subsystem: the cycle is one command calling the advisor, so a depth counter at the brief boundary is enough. (iteration 10)
- Relying on the ambiguity brief form for command ties: it takes two skill labels and has no slot for a command string. (iteration 10)
- Searching for an existing depth counter or re-entry guard in the hook stack: none. The only cycle protection in the tree is the fan-out lineage's own tool budget. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
None of the nine key questions remains open. Two carry-forward uncertainties are recorded for synthesis: whether doctor YAML workflows load their `skill_agent` skill (iteration 7 edge case), and whether the child-session brief is delivered in practice on each runtime (this iteration's missing dependency).

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
