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
- Topic: How can a natural-chat session get the protection of the spec-kit command workflows without the user typing a command, while staying flexible? Today the skill advisor recommends a skill or command in a hook brief, and a recommendation is not automatic use: a chat session that writes files loads AGENTS.md, the system-spec-kit SKILL.md, the authoring card, the packet templates and validate.sh, and never loads .skilled/commands/speckit/assets/speckit-plan.yaml, speckit-implement.yaml or speckit-complete.yaml.
- Started: 2026-11-11T19:27:28Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-auto-workflow-deepseek-1794425203015-h5r9ra
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
| 1 | Inventory of workflow-only checks vs the chat path | inventory | 0.85 | 9 | complete |
| 2 | Where a plan only its author can follow passes the chat path | failure-path | 0.90 | 10 | complete |
| 3 | Mechanism A - a gate in AGENTS.md that routes a write request into workflow steps | mechanism-agents-md | 0.80 | 9 | complete |
| 4 | Mechanism B - one shared step reference both paths read | mechanism-shared-reference | 0.85 | 9 | complete |
| 5 | Mechanism C - a hook that injects the relevant step at prompt or tool time | mechanism-hook | 0.90 | 9 | complete |
| 6 | Mechanism D - enforcement carried by templates and validate.sh | mechanism-validator | 0.85 | 9 | complete |
| 7 | Mechanism E - the session invokes the command itself when the advisor is confident | mechanism-advisor | 0.85 | 9 | insight |
| 8 | Delivery across seven runtimes and in a dispatched child | runtime-matrix | 0.80 | 8 | complete |
| 9 | Token cost per turn, Level 1 lightness and the one-sentence opt-out | cost-and-lightness | 0.75 | 10 | complete |
| 10 | Ranking, recommendation, smallest change set and what not to build | recommendation | 0.60 | 10 | insight |

- iterationsCompleted: 10
- keyFindings: 92
- openQuestions: 1
- resolvedQuestions: 7

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 7/8
- [x] Which checks exist only in the speckit command workflows and are absent from the natural-chat write path, and which are already duplicated there?
- [x] How does each candidate mechanism behave across the seven runtimes and in a dispatched child with no user present?
- [x] How does each mechanism keep Level 1 and trivial edits light, and how does a user opt out in one sentence?
- [x] What is the token cost per turn of each mechanism, measured from file sizes?
- [x] Where does a plan only its author can follow get through on the chat path today, and what is the smallest change that stops it?
- [x] How do the mechanisms rank, which one should be recommended, and what is the smallest set of changes to existing files?
- [x] What should not be built?
- [ ] For each candidate mechanism (AGENTS.md gate, shared step reference, hook injection, template and validate.sh enforcement, advisor-driven command invocation), what does it cost and what does it break? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] For each candidate mechanism (AGENTS.md gate, shared step reference, hook injection, template and validate.sh enforcement, advisor-driven command invocation), what does it cost and what does it break?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇▇█▇▆▆▇▇██▇▇▇▇▆▆▅▄▃▁
- score sparkline: ▇▇█▇▆▆▇▇██▇▇▇▇▆▆▅▄▃▁
- Last 3 ratios: 0.80 -> 0.75 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":66,"other":42}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None. The inventory resolved cleanly. (iteration 1)
- Reading `speckit-complete.yaml` line by line this iteration: the complete workflow composes the plan and implement steps, so its step bodies would duplicate findings 2-5 at 1444 lines of cost. Its router-level contract was enough for the inventory; the composed workflow is the same checks in one run. (iteration 1)
- Treating the router Markdown files as check carriers: both routers explicitly disclaim dispatch, step logic and artifact writes and delegate to the YAML [SOURCE: .skilled/commands/speckit/implement.md:13]. (iteration 1)
- "The authoring card already says one action per section": §5's acceptance is about content under headings, not about decisions inside a section [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:106]. (iteration 2)
- "The validator will catch it once the status is no longer Draft": true for tokens, false for prose. A plan with every token filled and every anchor present can still leave a decision open, so status escalation does not close this hole. (iteration 2)
- Proposing a new `plan-decisions.md` artifact: the packet's own reversal-cost order puts a new file above editing an existing line, and the plan template's seven anchors leave no room for a second plan document at Level 1. (iteration 2)
- Proposing that `PLACEHOLDER_FILLED` evaluate prose: the rule is a token scanner over five files by construction [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:326]; broadening it into prose judgment would duplicate the document's purpose in a text validator. (iteration 2)
- "Make the gate a HARD BLOCK": a hard block on a write that a user asked for turns every documentation edit into a workflow decision, and it contradicts the §6 trivial-edit exemption the framework sells as its low-friction path. (iteration 3)
- "Write the gate and let each runtime mirror pick it up": false for Cursor, which reads only its own rule file plus the generated pointer. Any mechanism that relies on `AGENTS.md` alone has a known blind runtime. (iteration 3)
- Proposing that Cursor be given a full `AGENTS.md` copy: the repository treats divergence between runtimes as drift, and the Cursor README names a single generator for the one generated block [SOURCE: .cursor/README.md:72]. A copy would need a second sync mechanism to stay true. (iteration 3)
- Proposing the gate be written inside the repo-local block: that would fix this repository and ship nothing, which cannot answer a question about every chat session. (iteration 3)
- "A new card section is enough": it is enough to instruct, and not enough to change behavior for a model that never opens the card under the fallback branch. (iteration 4)
- "The card is already loaded on every write because `SKILL.md` says so": the machine router's score threshold disproves it. The claim is a routing intention, not a load guarantee, and the fallback path carries a checklist instead of the card. (iteration 4)
- Creating a new "shared step reference" file: the card already occupies that role for both paths, and a second document would have to be linked from `SKILL.md`, `ROUTER.md`, two routers and two YAMLs to reach the same readers. (iteration 4)
- Putting the card in `LOADING_LEVELS.ALWAYS`: it is a one-line change but it charges every invocation, including read-only turns, for a step that only matters when a plan is written. (iteration 4)
- "Inject the whole step list": the injection channels are designed for short, bounded text — the advisor brief is one line plus a fixed directive, and the spec-gate notice is three sentences. A multi-step list would either be truncated or dominate the turn. (iteration 5)
- "Use the deny channel to force the step": a deny on the first write stops the turn and hands the model a reason string, which turns every documentation write into a failed call. That is the blocked-turn behavior the spec-gate design deliberately avoids by delivering at the prompt and not at the turn. (iteration 5)
- A new hook concern for the workflow step: the hub's cost is a core plus seven adapters plus a kill-switch row [SOURCE: .skilled/hooks/README.md:45], which puts it above every mechanism that edits an existing line. (iteration 5)
- A prompt-time-only hook: Cursor's prompt channel is dormant under the tested CLI build, so the mechanism would miss one of the seven runtimes entirely. (iteration 5)
- "Make the rule a WARNING so it does not regrade": a warning never fails `--strict` and the framework's own instruction is to fix every warning as a failure, so the practical difference is whatever the reader chooses to do. (iteration 6)
- "The validator already catches bad plans": it catches missing files, unfilled tokens, unpaired anchors and unmet acceptance rows. Every one of those is a shape, and a vague plan has the right shape. (iteration 6)
- A new validator rule for plan decisions: it is a script plus a registry row plus documentation, and its judgment would still be a regex over prose. (iteration 6)
- Adding a required plan anchor at the current template version: it regrades every existing v2.4 plan document and would ship a corpus-wide failure. (iteration 6)
- Relying on the validator for ordering: sequence is not in its input, so no rule can express "plan before code". (iteration 6)
- "Let the session type the command": a session cannot inject a user turn; it can only follow the command's contract, which is the YAML read. (iteration 7)
- "Teach the advisor to recommend commands": the bridge schema is slash-marker keyed across 62 generated entries, so this is a generator change plus a scoring-lane change, not a text edit. (iteration 7)
- Auto-executing in `auto` mode from chat: it skips the folder-choice gate, which iteration 1 established is the chat path's strongest existing check. (iteration 7)
- Auto-executing the workflow in `confirm` mode from chat: four unrequested approval prompts is a worse experience than the problem being solved. (iteration 7)
- Gating auto-invocation on advisor confidence: the ceiling is 0.95 and ties are common, so the gate would fire on ambiguity rather than resolve it. (iteration 7)
- "Runtimes without a command surface are out of scope": they are four of seven for the command mechanism, and Devin is one of the runtimes the repository explicitly supports. (iteration 8)
- "The hook covers the child because adapters exist": the core no-ops for a child before any state read, so adapter presence is not delivery. (iteration 8)
- Choosing a mechanism per runtime: seven variants is a maintenance surface the repository's own mirror-drift rules exist to prevent [SOURCE: .cursor/README.md:72]. (iteration 8)
- Treating the child case as a separate design: the child is already handled by Gate 3's exemption and the workflow's own clause, so the mechanism only has to not break it. (iteration 8)
- "Assume prompt caching makes resident context free": the cache discounts repeated prefixes on some providers, but the window still holds the tokens and the discount is not a property the framework can rely on across seven runtimes. (iteration 9)
- "Measure by line count": lines misrank the files. `validation-rules.md` is long but only read on failure, while `plan.md.tmpl` is short and loaded on every plan write, so bytes and load frequency together decide the cost. (iteration 9)
- Proposing a Level 1 opt-out phrase rather than a level branch: a phrase requires the reader to know the phrase; a level branch is what `use_checklist_for_verification_level_2_plus` already does. (iteration 9)
- Proposing a per-turn injection of the workflow's steps: 16.3k tokens per turn would dominate every session, and the workflow is a procedure for one moment, not a per-turn fact. (iteration 9)
- "Rank by cost alone": mechanism D is free and weakest on the check that matters, so a single-axis ranking inverts the answer. (iteration 10)
- "Rank by enforcement alone": the only enforcing mechanism is the validator, and it cannot express the failure. Enforcement is capped by what the mechanism can see, not by how hard it blocks. (iteration 10)
- Recommending a combination of B and C as co-equal: two carriers for one check double the maintenance and the model's attention cost for no additional enforcement. (iteration 10)
- Recommending mechanism D as the primary carrier: it cannot read judgment, and the one check that matters most here is a judgment. (iteration 10)
- Recommending the fourth candidate by default: it is optional and belongs to the operator's choice of visibility, not to the minimum. (iteration 10)

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
Follow up on: **The honest limit of the recommendation is that it lowers frequency, not the ceiling.** A fill-note clause and a keyword fix are instructions; neither proves a plan was read by anyone but its author. The one thing th...

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
