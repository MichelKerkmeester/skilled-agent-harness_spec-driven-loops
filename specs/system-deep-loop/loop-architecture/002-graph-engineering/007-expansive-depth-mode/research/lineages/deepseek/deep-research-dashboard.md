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

Read the code at HEAD b8003a7df42. The spec folder is specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode (SPEC below). Inputs: SPEC/scratch/dogfood-review-gen2.md and SPEC/scratch/dogfood-research-gen3.md (the conductor logs of the previous fan-out review and research), and the previous research with its improvement-backlog.md, now the newest folder under SPEC/research_archive/. Commits adade6c293e..07cf5f92b61 built backlog rows 1-11, 14, 16b, 18a and 19-26: build on them and do not re-report them. Every recommendation names one concrete change, cites file:line (or a source URL for prior art), and states value, effort (S/M/L) and risk. This lineage's frontier share is F-1-002 (cross-CLI execution contract), F-1-004 (frontier economics), F-1-006 (bookkeeping false alarms), so it reports on those three questions and does not re-report a delivered backlog row.

Q2 Cross-CLI execution contract: across native, cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe, where do permission and sandbox, effort, output format (cli-claude-code still uses --output-format text, so it reports no tokens or cost), session resume, failure classes, log shape and prompt channel still differ in fanout-run.cjs LINEAGE_COMMAND_ADAPTERS, runtime/lib/deep-loop/executor-config.ts and dispatch-iteration.cjs (runClaude, runCodex)? What single adapter contract and conformance test would remove the differences, including the agent and command mirrors (.claude .codex .pi .dsh .vibe .opencode against .skilled)?

Q4 Frontier economics: the node cap and growth slots (5 of 7 proposals pruned at iteration 1 last run), the depth-band split, duplicate work, and whether and in which order to build the held backlog rows 12 (one projectFrontier), 13 (one executor path), 29 (alias and dead-probe deletion) and 30 (per-node research dashboard).

Q6 Bookkeeping that fires on a healthy run: the synthesis_incomplete alarm when a finding is refined into an earlier id (runtime/scripts/synthesis-closeout.cjs:373), the research commit step that fails on an ignored pathspec exclude (deep-research.yaml:2158), the closeout lineageId taken from the parent session, and any other invariant or warning this run shows firing without a real fault.

Report only: change no code or doc outside your own lineage directory.
- Started: 2026-11-20T12:59:15.913Z
- Status: COMPLETE
- Iteration: 6 of 10
- Session ID: fanout-deepseek-1795179440509-6d2wms
- Parent Session: 2026-11-20T12:56:45.419Z
- Lifecycle Mode: new
- Generation: 4
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Frontier node F-1-002 (depth 1, scope fanout-run.cjs LINEAGE_COMMAND_ADAPTERS, runtime/lib/deep-loop/executor-config.ts, runtime/scripts/dispatch-iteration.cjs, .claude .codex .pi .dsh .vibe .opencode mirrors against .skilled): Cross-CLI execution contract: where do permission and sandbox, effort, output format, session resume, failure classes, log shape and prompt channel still differ across LINEAGE_COMMAND_ADAPTERS, executor-config.ts and dispatch-iteration.cjs, and what single adapter contract and conformance test (agent and command mirrors included) would remove the differences? | cross-cli | 0.79 | 7 | complete |
| 2 | Frontier node F-1-004 (depth 1, scope frontier-admit.cjs, convergence.cjs, deep-research reduce-state.cjs, the newest SPEC/research_archive improvement-backlog.md): Frontier economics: how should the node cap, growth slots, depth-band split and duplicate work change (5 of 7 proposals pruned at iteration 1 last run), and should held backlog rows 12 (one projectFrontier), 13 (one executor path), 29 (alias and dead-probe deletion) and 30 (per-node research dashboard) be built, in which order? | frontier-economics | 0.70 | 5 | complete |
| 3 | Frontier node F-1-006 (depth 1, scope runtime/scripts/synthesis-closeout.cjs, .skilled/commands/deep/assets/deep-research.yaml step_stage_artifact_dir, this run's orchestration-status.log and state logs): Bookkeeping that fires on a healthy run: the synthesis_incomplete alarm on a finding refined into an earlier id, the research commit step failing on an ignored pathspec exclude, the closeout lineageId taken from the parent session, and any other invariant or warning this run shows firing without a real fault. | bookkeeping | 0.75 | 6 | complete |
| 4 | Frontier node F-1-002 (depth 1, scope fanout-run.cjs LINEAGE_COMMAND_ADAPTERS, runtime/lib/deep-loop/executor-config.ts, runtime/scripts/dispatch-iteration.cjs, .claude .codex .pi .dsh .vibe .opencode mirrors against .skilled): Cross-CLI execution contract: where do permission and sandbox, effort, output format, session resume, failure classes, log shape and prompt channel still differ across LINEAGE_COMMAND_ADAPTERS, executor-config.ts and dispatch-iteration.cjs, and what single adapter contract and conformance test (agent and command mirrors included) would remove the differences? | cross-cli | 0.60 | 4 | insight |
| 5 | Frontier node F-2-007 (depth 2, scope runtime/tests/stress/cli-adapter, package.json, CI workflow files): Is the cli-adapter stress suite part of any default test or CI gate, and which matrix cells remain pending at HEAD? | adapter-tests | 0.75 | 4 | complete |
| 6 | Frontier node F-2-008 (depth 2, scope runtime/lib/deep-loop/executor-audit.ts, runtime/scripts/fanout-run.cjs): Does any runner path read EXECUTOR_SESSION_ENV_BY_KIND and persist a provider session id for a --only-lineage rerun, or is it detection-only? | rerun-identity | 0.75 | 4 | complete |

- iterationsCompleted: 6
- keyFindings: 30
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Cross-CLI execution contract: where do permission and sandbox, effort, output format, session resume, failure classes, log shape and prompt channel still differ across LINEAGE_COMMAND_ADAPTERS, executor-config.ts and dispatch-iteration.cjs, and what single adapter contract and conformance test (agent and command mirrors included) would remove the differences?
- [x] Frontier economics: how should the node cap, growth slots, depth-band split and duplicate work change (5 of 7 proposals pruned at iteration 1 last run), and should held backlog rows 12 (one projectFrontier), 13 (one executor path), 29 (alias and dead-probe deletion) and 30 (per-node dashboard) be built, in which order?
- [x] Bookkeeping that fires on a healthy run: the synthesis_incomplete alarm on a finding refined into an earlier id, the research commit step failing on an ignored pathspec exclude, the closeout lineageId taken from the parent session, and any other invariant or warning this run shows firing without a real fault.
- [x] Is the cli-adapter stress suite part of any default test or CI gate, and which matrix cells remain pending at HEAD?
- [x] Does any runner path read EXECUTOR_SESSION_ENV_BY_KIND and persist a provider session id for a --only-lineage rerun, or is it detection-only?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▅▅▆▆▆▄▃▂▂▃▅▆▇▇▇▇
- score sparkline: █▇▆▅▅▅▆▆▆▄▃▂▂▃▅▆▇▇▇▇
- Last 3 ratios: 0.60 -> 0.75 -> 0.75
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.75
- coverageBySources: {"code":112}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Adding a new mirror-drift checker.** Both existing gates pass at HEAD, and the crosswalk documents the absent command trees as sanctioned. Building another checker adds a second source of truth for a surface that is already green. (iteration 1)
- **Reading `--output-format json` support from the CLI help only.** The adapters are already pinned to live-verified flags in comments; a help probe would not prove the runner reads the resulting log shape, which is the actual gap. (iteration 1)
- **Treating the stress matrix as already conformant because it names all 14 rows.** The names exist, but the rows do not include the four differences this iteration found, and the non-codex cells are declared pending. (iteration 1)
- Grepping `fanout-run.cjs` for a per-kind session-id capture that could feed a rerun: only `readStoredLineageSessionId`, which reads the lineage's own config, exists. No provider session id is stored for a retry. (iteration 1)
- Looking for a shared `resolveSandboxMode` in the single-executor branches: each branch computes its own, which is the root of Finding 1. (iteration 1)
- **A larger run-wide node cap as the fix for "5 of 7 pruned".** Raising the cap spends more iterations on the same first-worked branch; the pruned questions were good, but the run had no budget to work them. The defect is allocation, not the number. (iteration 2)
- **Building row 12 alone and leaving the dashboard for later.** The dashboard is the surface that would have shown the band closes and the partition drift; splitting it from the shared projection leaves the operator with the same blind spot. (iteration 2)
- **Ranking proposals by model-written value or confidence.** The runner cannot audit a self-asserted score, which is the honesty problem this packet is about. Sorting by parent depth and live-child count is deterministic and checkable. (iteration 2)
- Looking for a cross-lineage question comparison in `fanout-merge.cjs`: the partition guard compares node ids only, so question overlap has no check anywhere. (iteration 2)
- Looking for a per-band cap in `readCaps`: only `maxDepth`, `maxChildrenPerNode`, `maxRootChildren` and `maxFrontierNodes` exist. Band shares are consumed by the reducer, never by admission. (iteration 2)
- **Deleting the `structured_state_findings_partially_reflected_in_registry` invariant.** The invariant is right that a count mismatch matters; the defect is that the count ignores a documented refinement transition. Deleting the check would hide a real loss. (iteration 3)
- **Fixing the commit step by adding the ignored path to `.gitignore` again.** It is already there; the exclude is the redundant half. (iteration 3)
- **Treating the `Trusted evidence yield` line as a harmless informational message.** It is emitted only on the legacy-compatibility path, which is the path every CLI lineage takes; leaving it names a missing field as a permanent warning. (iteration 3)
- Looking for a `lineageId` field in this lineage's config: only `sessionId` and `parentSessionId` exist, so the closeout has to infer one. (iteration 3)
- Searching for refinement handling in `synthesis-closeout.cjs`: there is none, which is the finding. The reducer owns the concept and the closeout does not read it. (iteration 3)
- **Deriving the contract from the CLI help text at test time.** The adapters are pinned to live-verified flags, and a help probe cannot prove the runner reads the log shape the flag produces. (iteration 4)
- **One test per adapter kind written by hand.** That is the current `expectSuccessArgs` shape; it duplicates the builder and drifts with it. (iteration 4)
- **Treating the contract as documentation only.** The point is that the builder and the test read one table; a prose table with no consumer is another document to rot. (iteration 4)
- Looking for a capability record already shipped under another name: `EXECUTOR_KIND_FLAG_SUPPORT` is the closest, and it answers "is the field accepted", not "how is it carried". (iteration 4)
- **Adding another CI workflow for the validator.** The existing deep-loop workflow already installs and runs the suite; one added step is enough. (iteration 5)
- **Rewriting the validator to import the tests instead of listing them.** `vitest list` is the supported discovery surface; the parser, not the mechanism, is wrong. (iteration 5)
- **Treating `CLI_ADAPTER_STRESS_MATRIX` as the live matrix.** The overlay is the live object and the audit proves it; the seed table is documentation of the phase-one state. (iteration 5)
- Grepping workflows for `cli-adapter` or `validate-playbook-package`: only the sk-doc validator appears, which is a different path and a different package. (iteration 5)
- **Adding resume flags to all eight adapters at once.** Four kinds report no session id in a parseable shape, and the two unconfirmed envs would need live probes; per-kind capture is the only honest path. (iteration 6)
- **Persisting the env value as the rerun identity.** The env is the parent's provider session, not the child's, and the recursion guard deliberately reads it to refuse dispatch; storing it would conflate the guard with resume. (iteration 6)
- **Treating `session_id` in the preview as a provider id.** It is the SPECKIT session used for artifact scoping, as `buildLineageDispatch` shows. (iteration 6)
- Grepping for `--resume` or `exec resume` in `fanout-run.cjs` and `dispatch-iteration.cjs`: no match. The absence is the finding. (iteration 6)
- Looking for a log parser that extracts a session id: none exists; the only log parsers are cost and quota. (iteration 6)

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
- Budget depth2: 2 of 4.5 iterations spent
- Budget depth3: 0 of 4 iterations spent

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
