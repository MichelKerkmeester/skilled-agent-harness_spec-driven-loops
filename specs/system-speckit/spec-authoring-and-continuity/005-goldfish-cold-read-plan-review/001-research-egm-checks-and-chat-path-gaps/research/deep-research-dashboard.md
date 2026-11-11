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
- Topic: How can this repository make sure that a deep loop (research, review or council) started through natural conversation follows its proper workflow and does not skip steps? An incident record is at specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/incident-chat-started-loop.md and the driver the session had to write is at specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/single-executor-driver.py. Read both first. Then read .skilled/commands/deep/research.md, .skilled/commands/deep/assets/deep-research-auto.yaml and deep-research-presentation.txt, .skilled/skills/system-deep-loop/SKILL.md and its deep-research/SKILL.md, runtime/scripts/fanout-run.cjs, verify-iteration.cjs, fanout-merge.cjs and synthesis-closeout.cjs, AGENTS.md Gate 4 and PLAN-WORKFLOW LOCK, and .skilled/repo-rules/delegation-and-orchestration.md. Establish which workflow steps are enforced by code and which only by prose, why a fan-out lineage runs all its iterations in one process, and what would have caught the incident. Recommend the smallest set of changes to existing files that keeps a chat-started loop on its workflow, and say what not to build. Prefer changing an existing line or making an existing script refuse or report over a new command, agent, hook or document.
- Started: 2026-11-11T20:11:35Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-11-11T20:11:35Z
- Parent Session: 2026-11-11T19:50:01Z
- Lifecycle Mode: restart
- Generation: 3
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Enforcement map: which single-executor steps are code-enforced vs prose-only, and why a fan-out lineage runs every iteration in one process | - | 0.88 | 8 | complete |
| 2 | What are the candidate fixes, their cost, their cost on the seven runtimes, and their behaviour in a dispatched child? | - | 0.85 | 9 | complete |
| 3 | The smallest set of changes to existing files that keeps a chat-started loop on its workflow, its application to deep-review and ai-council, and what should not be built | enforcement-design | 0.79 | 9 | complete |
| 4 | Adversarial verification of the recommended one-lineage refusal: which legitimate callers the predicate would wrongly refuse, and what that forces in the change set | enforcement | 0.73 | 8 | complete |
| 5 | The change set as exact edits, and a correction to the fixture cost | implementation-shape | 0.89 | 7 | complete |

- iterationsCompleted: 5
- keyFindings: 41
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which lines in the command doc, the workflow YAML, the skills and AGENTS.md allowed or invited the bypass in the incident, and which steps of the single-executor path are enforced by code as opposed to prose? Cite file and line.
- [x] Why does a fan-out lineage run all its iterations in one process, is that by design, and does anything record or report that a lineage's iterations did not each get a fresh context?
- [x] Which existing checks could have caught the incident before or after the run (verify-iteration.cjs, dispatch receipts, config status, lock, fanout-run's success report, validate.sh), and why did each not fire?
- [x] What are the candidate fixes (a runner that owns the single-executor loop, fanout-run refusing or labelling a one-lineage run, a completion check on receipts and config status, wording in the command doc or AGENTS.md, a hook), what does each cost and break, and how does each behave on the seven runtimes and in a dispatched child?
- [x] What is the smallest set of changes to existing files that keeps a chat-started loop on its workflow, how does it apply to deep-review and ai-council, and what should not be built?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▇▆▆▆▅▄▄▃▃▂▂▁▂▄▅▇█
- score sparkline: █▇▇▇▆▆▆▅▄▄▃▃▂▂▁▂▄▅▇█
- Last 3 ratios: 0.79 -> 0.73 -> 0.89
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.89
- coverageBySources: {"code":76,"other":20}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **"`fanout-merge.cjs`'s `status: ok` is a workflow verdict."** It is a merge verdict: refusals are limited to reducer-provenance and near-line pairs, and `status: 'ok'` is emitted unconditionally once the registry writes succeed. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1530] (iteration 1)
- **"`validate.sh` would have caught it."** It validates packet document structure. A run that skipped `phase_init` and `phase_save` leaves the packet documents untouched, which is exactly the state validation accepts. (iteration 1)
- **"The 2,539-line YAML is the enforcement."** Verified false: the YAML contains commands and prose, but nothing validates that `phase_init` or `phase_save` ran. Its checks fire only for a session already walking its steps. (iteration 1)
- **"The lock catches non-workflow runs."** A lock only reports contention against a lock; a run that never calls `loop-lock.cjs` leaves nothing to contend with. Absence of a lock is not an observable the current code tests. (iteration 1)
- Looking for a council-side fan-out guard in `deep-ai-council/SKILL.md`: the mode document contains no fan-out or workflow-fidelity language; the council inherits whatever `orchestrate-session.cjs` and `fanout-run.cjs` do. (iteration 1)
- Searching for a packet-level workflow receipt comparable to `dispatch-receipts/`: receipts exist per *iteration dispatch* under the lineage, not per workflow phase. There is no phase receipt to look for, so "check the receipt" is not available for `phase_init`. (iteration 1)
- **`fanoutConfigSchema.executors` minimum of two.** Wrong layer and expensive: it is the shared parse contract for tests, resume and the reducer, and single-entry arrays are used there for reasons unrelated to the policy. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:533] (iteration 2)
- **A gateway precondition ("iteration record requires a live lock").** Fires on the incident's path, but reaches every lineage, every mode and every resume, and is designed to be non-blocking — it cannot stop a run. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:494] (iteration 2)
- **A hook as the enforcement surface.** Six runtime-specific adapters, all prompt-time context injection; reproduces prose at maximum cost. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53] (iteration 2)
- **A post-run completion assertion hosted anywhere in the runtime scripts.** Nothing in the incident's route calls a runtime script at the end, so a new assertion in any of them would inherit the same "not reached" property as every check iteration 1 mapped. (iteration 2)
- **Labelling instead of refusing, by itself.** `fanout-run.cjs` already emits a summary the incident's session read; it read "succeeded" and moved on. A new label in the same object is not more visible than the fields already there. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4273] (iteration 2)
- **Promoting `render-command-contract.cjs` into the runner.** It renders command *contracts* from a manifest of legacy bodies; it never parses step blocks or executes a step. Sharing its importer would not shorten the driver. (iteration 2)
- **A packet-level "did this run walk the workflow" receipt to check afterwards.** The only receipt writer in the repository is the YAML dispatch step (`receiptDir` bound at eight places in the research YAML alone), so receipts mark the single-executor path and are legitimately absent on fan-out. Building a fan-out receipt would be a new artifact, not an existing check. (iteration 3)
- **Escalating the already-computed timestamp anomaly** (iteration 2's change 3). The classifier only reports records outside the lineage's dispatch window, so intra-window in-process iteration cannot trigger it, and the non-empty summary fold already exists. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:5] (iteration 3)
- **Keying the guard to the documented flags** (`--executor`, `--executors`, `--count`). The script is entered through `--fanout-config-json`, which none of those flags describe; a flag-level guard is bypassable by construction. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:229] (iteration 3)
- **Requiring two entries in the YAML's `skip_when` instead of in the script.** It would have to be written twice (research and review), would leave the direct script call untouched — which is exactly how the incident happened — and `skip_when` fails open. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223] (iteration 3)
- **Using `fanout-run.cjs`'s `status` field as a workflow verdict.** Already ruled out in iteration 2 and re-confirmed here at the exit-code line: the code is a function of `fulfilled`/`rejected` only. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4272] (iteration 3)
- **A distinct-base-label guard** ("refuse when fewer than two labels are declared"). It runs before replica expansion in effect, so it would refuse a single `--executor X --count 5`, which the presentation asset documents as native fan-out. [SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:71] (iteration 4)
- **Guarding resume** by re-validating a persisted `fanout.executors`. No code reads that field; adding a reader would create the surface it is meant to police. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223] (iteration 4)
- **Reusing the YAML's `cli-deepseek-harness` refusal as the only enforcement**, i.e. making single-lineage fan-out a per-executor-kind rule in the workflow instead of a runner rule. It is one layer above the direct script call that caused the incident, so the incident's route would still be open. (iteration 4)
- **Searching for a resume path that reconstructs the fan-out matrix.** `rg` over `.skilled/` for readers of a persisted `fanout.executors` returns only tests and playbooks; `deep-research-auto.yaml` references `config.fanout` only at its three spawn/skip guards. There is no reconstruction path to guard, and none to break. (iteration 4)
- **Treating the one-entry in-tree packet as a counter-example that invalidates change 1.** It is the incident shape with a different executor; under the policy in the docs it was never legal. It becomes the change's one real cost, not its refutation. (iteration 4)
- **Pricing the escape flag from the stress suite alone** (iteration 4's Finding 5). The unit suite spawns with a one-entry matrix too, so the cost estimate was low and the test template better than the one assumed. (Finding 3) (iteration 5)
- **Searching the rule docs for a numeric fan-out trigger.** `rg -i 'fan-out|fanout|lineage'` over `delegation-and-orchestration.md` returns three lines, none of them a trigger definition. There is no second enforcement sentence to align and none to break. (iteration 5)
- **Touching `.skilled/repo-rules/delegation-and-orchestration.md` or `AGENTS.md` for the trigger.** The rule file never states the trigger; adding a second statement would create the drift the change exists to remove. (Finding 5) (iteration 5)

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
[All tracked questions are resolved]

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
