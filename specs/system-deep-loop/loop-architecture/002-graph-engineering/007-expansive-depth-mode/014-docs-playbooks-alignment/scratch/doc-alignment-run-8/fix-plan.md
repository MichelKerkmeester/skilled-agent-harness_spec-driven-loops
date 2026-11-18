# Fix plan

Target: topic expansive-depth; head: c10bb24f3e58dbd2fb01eb518d6e1d85da4caab7

## In scope

### docs:.claude/agents

- [x] L1-1 P1 .claude/agents/deep-research.md:165 The doc tells the leaf that the orchestrator flags single-weak-source answers during convergence quality checks. The code never evaluates that guard: `evaluateResearchQualityGuards` hardcodes `singleW [handed off]
  fix: **Source diversity**: Aim for >=2 independent sources per key finding. The orchestrator flags single-weak-source answers -> **Source diversity**: Aim for >=2 independent sources per answered question. The source-diversity guard fails a question

### docs:.pi/agents

- [x] L1-2 P1 .pi/agents/deep-research.md:173 Same stale source-diversity claim as the .claude mirror: the doc says the orchestrator flags single-weak-source answers, but `evaluateResearchQualityGuards` hardcodes `singleWeakSource = guardOutcome( [handed off]
  fix: **Source diversity**: Aim for >=2 independent sources per key finding. The orchestrator flags single-weak-source answers -> **Source diversity**: Aim for >=2 independent sources per answered question. The source-diversity guard fails a question

### docs:.skilled/agents

- [x] L1-3 P1 .skilled/agents/deep-research.md:181 The canonical agent definition carries the same stale claim: it says the orchestrator flags single-weak-source answers, but `evaluateResearchQualityGuards` hardcodes `singleWeakSource = guardOutcome(' [handed off]
  fix: **Source diversity**: Aim for >=2 independent sources per key finding. The orchestrator flags single-weak-source answers -> **Source diversity**: Aim for >=2 independent sources per answered question. The source-diversity guard fails a question

### docs:.skilled/commands

- [ ] C1 P2 .skilled/commands/deep/assets/deep-review.yaml:2612 The NEVER list forbids `modify_config_after_initialization` outright, but this workflow rewrites the config after init in the two steps this topic adds: `step_extend_completed_run` writes `maxIteratio
- [ ] L2-1 P2 .skilled/commands/deep/assets/deep-research.yaml:2378 The NEVER list still forbids `modify_config_after_initialization` outright, but the workflow rewrites the config after init in the two steps this topic adds: `step_extend_completed_run` (line 467) wri

### docs:.skilled/skills

- [ ] C2 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:302 The review Frontier Node Store row shape is given as a closed list that omits `budget`, but `admitProposals` writes an optional `budget` field onto an admitted row for either target and the budget adm
  fix: {nodeId, parentId, depth, scope, question, status, reason, iteration, dedupeKey} -> {nodeId, parentId, depth, scope, question, status, reason, iteration, dedupeKey} plus an optional `budget`
- [x] C3 P2 .skilled/skills/system-deep-loop/deep-research/README.md:122 The README tells the reader the legal-stop gates check "that one weak source does not carry a finding", but `evaluateResearchQualityGuards` hardcodes `singleWeakSource = guardOutcome('notEvaluated', [ [handed off]
  fix: that sources are diverse and that one weak source does not carry a finding -> that sources are diverse, counting the distinct sources behind the findings that answer each question
- [ ] L4-1 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:16 The page enumerates the admission caps as "depth, fan-out, budget, dedupe and cycle". `checkProposal` runs six checks in one fixed order and records the first failing check's name as the prune reason:
  fix: under depth, fan-out, budget, dedupe and cycle caps -> under relevance, dedupe, depth, fan-out, budget and cycle caps
- [ ] L4-2 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:38 The list of gates that decide before the frontier veto omits the consecutive-failure halt. convergence.cjs returns STOP/error/`consecutiveFailures` once the count reaches `CONSECUTIVE_FAILURE_LIMIT` (
  fix: The iteration cap, the anti-convergence floor, stuck recovery, pause, -> The iteration cap, consecutive failures, the anti-convergence floor, stuck recovery, pause,
- [ ] L4-3 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:487 The catalog's `--depth-mode` summary lists the gates that decide before the frontier veto as "the iteration cap, the floor, stuck recovery, pause, convergence off and the max-iterations policy" and om
  fix: the iteration cap, the floor, stuck recovery, pause, convergence off and the max-iterations policy decide before the fro -> the iteration cap, consecutive failures, the floor, stuck recovery, pause, convergence off and the max-iterations policy
- [ ] L6-2 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:63 The Validation table credits `runtime/tests/unit/frontier-admit-review.vitest.ts` with "Review admission into the node store and debt entries", but that file contains no debt or `searchDebt` assertion
  fix: Review admission into the node store and debt entries. -> Review admission into the node store.
- [ ] L6-3 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md:25 The doc says the config records "the four configured dimensions", but `reviewDimensions` is written from `{review_dimensions_normalized}`, which is the canonical four plus every configured custom name
  fix: the four configured dimensions -> the configured dimensions
- [ ] L6-4 P2 .skilled/skills/system-deep-loop/deep-research/references/state/state-format.md:81 The frontier node store row shape is given as a closed list that omits `budget`, but `admitProposals` writes an optional `budget` field onto an admitted row and the budget admission check reads it bac
  fix: {nodeId, parentId, depth, scope, question, status, reason, iteration, dedupeKey} -> {nodeId, parentId, depth, scope, question, status, reason, iteration, dedupeKey} plus an optional `budget`
- [ ] L7-2 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:463 The sentence says `step_read_state` sets `next_dimension` to the active frontier node's next uncovered dimension, with no exception. The workflow puts a traceability branch ahead of the frontier branc
  fix: and sets `next_dimension` to that node's next uncovered dimension, so the iteration reviews depth the node has not spent -> and, unless the last iteration under the cap still owes core traceability protocols, sets `next_dimension` to that node'
- [ ] L8-1 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md:43 The Minimum Iterations Floor section states the floor unconditionally: "Once a stop candidate exists, a run below `minIterations` returns CONTINUE with `reasonDetail` `minIterationsNotReached`." The c
  fix: Once a stop candidate exists, a run below `minIterations` returns CONTINUE with `reasonDetail` `minIterationsNotReached` -> Once a stop candidate exists, a run below `minIterations` returns CONTINUE with `reasonDetail` `minIterationsNotReached`
- [ ] L7-1 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md:43 The section 2 PACKET FILES table lists eight packet files and has no row for `frontier-nodes.jsonl`, the node store an expansive run keeps. The doc's own description calls it the reference for deep-re

## Pre-existing or outside the scope

