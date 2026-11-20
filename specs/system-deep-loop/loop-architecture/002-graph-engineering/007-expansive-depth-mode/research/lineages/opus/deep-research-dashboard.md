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
- Topic: What changes would make the deep-loop fan-out orchestration trustworthy and identical across CLI runtimes, ranked by value over effort, given what the last two expansive dogfood runs taught?

Read the code at HEAD b8003a7df42. The spec folder is specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode (SPEC below). Inputs: SPEC/scratch/dogfood-review-gen2.md and SPEC/scratch/dogfood-research-gen3.md (the conductor logs of the previous fan-out review and research), and the previous research with its improvement-backlog.md, now the newest folder under SPEC/research_archive/. Commits adade6c293e..07cf5f92b61 built backlog rows 1-11, 14, 16b, 18a and 19-26: build on them and do not re-report them. Every recommendation names one concrete change, cites file:line (or a source URL for prior art), and states value, effort (S/M/L) and risk.

Q1 Lineage honesty: one lineage wrote 9 of 12 review passes 20-60 s apart, most with zero findings, and reported newInfoRatio 1.0 on all 10 research passes; model-written timestamps were placeholders, whole minutes or future-dated. Which runner-side signals (pass duration, cited locations, tool calls, repeated sources, gateway receipt time) would detect an unexamined pass or a false stamp without trusting the model, and how should convergence and fanout-merge.cjs weigh such a pass?

Q2 Cross-CLI execution contract: across native, cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe, where do permission and sandbox, effort, output format (cli-claude-code still uses --output-format text, so it reports no tokens or cost), session resume, failure classes, log shape and prompt channel still differ in fanout-run.cjs LINEAGE_COMMAND_ADAPTERS, runtime/lib/deep-loop/executor-config.ts and dispatch-iteration.cjs (runClaude, runCodex)? What single adapter contract and conformance test would remove the differences, including the agent and command mirrors (.claude .codex .pi .dsh .vibe .opencode against .skilled)?

Q3 Orchestration robustness: process tree and kill semantics (the runner re-executes itself, so killing the runner pid misses the lineage CLIs), mid-run provider quota and --only-lineage reruns, re-entrancy, the ledger as the only live view, capability-aware dealing of frontier nodes (a web question to a lineage with web tools) and a root dashboard for a fan-out.

Q4 Frontier economics: the node cap and growth slots (5 of 7 proposals pruned at iteration 1 last run), the depth-band split, duplicate work, and whether and in which order to build the held backlog rows 12 (one projectFrontier), 13 (one executor path), 29 (alias and dead-probe deletion) and 30 (per-node research dashboard).

Q5 Prior art: how multi-agent orchestrators and eval harnesses (for example Inspect eval sets, OpenHands, LangGraph, the Claude Agent SDK, AutoGen) verify worker honesty, normalize heterogeneous executors and rerun partial failures. This is the only question that needs the web; cite source URLs, and never put personal data such as an email address in a search query or request.

Q6 Bookkeeping that fires on a healthy run: the synthesis_incomplete alarm when a finding is refined into an earlier id (runtime/scripts/synthesis-closeout.cjs:373), the research commit step that fails on an ignored pathspec exclude (deep-research.yaml:2158), the closeout lineageId taken from the parent session, and any other invariant or warning this run shows firing without a real fault.

Report only: change no code or doc outside your own lineage directory.

- Started: 2026-11-20T12:59:05.039Z
- Status: COMPLETE
- Iteration: 5 of 10
- Session ID: fanout-opus-1795179440509-6d2wms
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Frontier node F-1-001 (depth 1, scope .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs, convergence.cjs, fanout-merge.cjs, append-mode-event.cjs, the dogfood logs under SPEC/scratch): Lineage honesty: which runner-side signals (pass duration, cited file:line count, tool calls, repeated sources, gateway receipt time against the model-written timestamp) would flag an unexamined pass or a false stamp without trusting the model, and how should convergence.cjs and fanout-merge.cjs weigh such a pass? | lineage-honesty | 0.89 | 9 | complete |
| 2 | Frontier node F-1-003 (depth 1, scope .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs, frontier dealing, .skilled/commands/deep/assets/deep-research.yaml fan-out steps): Orchestration robustness: what changes fix the process tree and kill semantics (the runner re-executes itself), mid-run provider quota and --only-lineage reruns, re-entrancy, the ledger as the only live view, capability-aware dealing of frontier nodes and a root dashboard for a fan-out? | orchestration-robustness | 0.81 | 8 | complete |
| 3 | Frontier node F-1-005 (depth 1, scope web sources on multi-agent orchestration and eval harnesses, compared against .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs): Prior art: how do multi-agent orchestrators and eval harnesses (Inspect eval sets, OpenHands, LangGraph, the Claude Agent SDK, AutoGen) verify worker honesty, normalize heterogeneous executors and rerun partial failures, and which idea fits this runner? Cite source URLs; no personal data in any query. | prior-art | 0.71 | 7 | complete |
| 4 | Frontier node F-1-001 (depth 1, scope .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs, convergence.cjs, fanout-merge.cjs, append-mode-event.cjs, the dogfood logs under SPEC/scratch): Lineage honesty: which runner-side signals (pass duration, cited file:line count, tool calls, repeated sources, gateway receipt time against the model-written timestamp) would flag an unexamined pass or a false stamp without trusting the model, and how should convergence.cjs and fanout-merge.cjs weigh such a pass? | lineage-honesty | 0.75 | 8 | complete |
| 5 | Frontier node F-2-006 (depth 2, scope .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs, fanout-run.cjs LINEAGE_COMMAND_ADAPTERS): Which per-runtime JSON log shapes (claude stream-json, codex --json, opencode, pi, devin, cursor, vibe) expose timestamped tool-call events that one passEvidence extractor could bucket by gateway commit time? | cross-cli-contract | 0.79 | 7 | complete |

- iterationsCompleted: 5
- keyFindings: 238
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Lineage honesty: which runner-side signals (pass duration, cited file:line count, tool calls, repeated sources, gateway receipt time against the model-written timestamp) would flag an unexamined pass or a false stamp without trusting the model, and how should convergence.cjs and fanout-merge.cjs weigh such a pass?
- [x] Orchestration robustness: what changes fix the process tree and kill semantics (the runner re-executes itself), mid-run provider quota and --only-lineage reruns, re-entrancy, the ledger as the only live view, capability-aware dealing of frontier nodes and a root dashboard for a fan-out?
- [x] Prior art: how do multi-agent orchestrators and eval harnesses (Inspect eval sets, OpenHands, LangGraph, the Claude Agent SDK, AutoGen) verify worker honesty, normalize heterogeneous executors and rerun partial failures, and which idea fits this runner? Cite source URLs; no personal data in any query.
- [x] Which per-runtime JSON log shapes (claude stream-json, codex --json, opencode, pi, devin, cursor, vibe) expose timestamped tool-call events that one passEvidence extractor could bucket by gateway commit time?
- [x] What unexamined-pass thresholds flag the gen2 review deepseek stamps without flagging the gen3 research deepseek passes or any opus pass, and does the observed ratio change any committed lineage stop iteration?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▅▅▄▃▂▁▁▁▂▂▂▃▃▃▄▄
- score sparkline: █▇▇▆▅▅▄▃▂▁▁▁▂▂▂▃▃▃▄▄
- Last 3 ratios: 0.71 -> 0.75 -> 0.79
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.79
- coverageBySources: {"code":49,"code.claude.com":2,"docs.langchain.com":2,"docs.openhands.dev":2,"github.com":1,"inspect.aisi.org.uk":4,"microsoft.github.io":2,"other":11}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Pass duration as a standalone signal:** real deepseek passes run as short as 33 s (finding 5). (iteration 1)
- **The record's `toolsUsed` and `sourcesQueried`:** both are model-authored (finding 6). (iteration 1)
- None. (iteration 1)
- **A run-level lock through `loop-lock.cjs`.** That lock is per-loop and per-artifact-dir, and the lineages already hold their own. A runner lock at the base directory is simpler (finding 4). (iteration 2)
- **Treating a quota hit as retryable.** That would burn the same allowance again. The current non-retryable class is right; only the rerun path is missing. (iteration 2)
- **AutoGen's text-mention termination as a model:** a stop the model announces itself is exactly the self-report this work is trying to avoid. (iteration 3)
- **Inspect `working_time` as a pass-duration signal:** its own docs say it can undercount overlapped work, and iteration 1 already found duration alone weak. (iteration 3)
- Claude Agent SDK hooks: a `PostToolUse` hook could keep an audit trail [SOURCE: https://code.claude.com/docs/en/agent-sdk/hooks]. Installing one means writing into the operator's Claude config dir, though, and stream-json gives the same events without that write. Dropped in favour of finding 2. (iteration 3)
- **A minimum-reads threshold:** it flags real context-carried passes (finding 5). (iteration 4)
- **Finding-id novelty as an observed ratio:** ids are minted fresh on every pass. (iteration 4)
- **Mirrors as a source of fan-out divergence:** the persona is inlined from `.skilled` (finding 7). (iteration 5)

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
<!-- ANCHOR:frontier -->
## 6B. FRONTIER
- Frontier size: 5 nodes (0 open, 0 active, 5 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 1
- Budget depth1: 4 of 5 iterations spent
- Budget depth2: 1 of 4.5 iterations spent
- Budget depth3: 0 of 5 iterations spent

<!-- /ANCHOR:frontier -->
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
