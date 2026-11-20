# Research: trustworthy, runtime-identical fan-out orchestration

Generation 4 of this packet's research: an expansive-depth fan-out of two lineages, `opus`
(cli-claude-code, `claude-opus-5-5`, effort medium) and `deepseek` (cli-opencode,
`llmgateway/deepseek-v4.1-flash-1017`, effort max). Code read at `b8003a7df42`. The ranked,
conductor-checked backlog built from this run is `improvement-backlog.md` in this folder. The
lineage reports are `lineages/opus/research.md` and `lineages/deepseek/research.md`.

## 1. Executive Summary

The question was what would make the deep-loop fan-out orchestration trustworthy and identical
across CLI runtimes, ranked by value over effort, after the round 3 and round 4 fixes.

- **The fan-out now runs clean end to end.** The root config, the root resource map, the
  node store closes and the per-lineage outcome all worked live. Both lineages stopped
  `converged` on `all_questions_answered` within their own share, because the strategy now holds
  only frontier questions, and neither drifted into the other's questions. The new
  `frontier_drained` candidate never had to form.
- **Honesty signals exist but nothing reads them.** Each ledger frame carries the gateway's own
  `receipt.committed_at`. In this run the state-row timestamps were also gateway-minted, because
  neither model wrote one. But a model that does write a UTC stamp still has it kept as the
  row's `timestamp` (`legacy-compatibility.ts:908-916`). Over 678 committed lineages, three
  runner-side rules flag 85 passes (2.4%): a future stamp, zero reads with zero findings, and a
  batched commit with no tool calls (opus, iteration 4).
- **Cross-CLI parity is still a set of unpublished per-adapter choices.** Prompt channel (argv,
  stdin or file), log format (text or JSON), cost source, effort surface, sandbox surface and
  resume differ per kind, and `--sandbox-mode` round-trips for only three of eight kinds in the
  single-executor dispatcher (`dispatch-iteration.cjs:421`, `:538`, `:902`). Both lineages
  independently propose one adapter capability record with a table-driven conformance test.
- **Orchestration still has operator gaps.** SIGHUP and SIGKILL orphan lineage CLIs (only SIGINT
  and SIGTERM are forwarded), a quota rerun points at the same exhausted provider, progress rows
  say a lineage is alive but not how far along it is, and the root keeps no dashboard.
- **Several checks fire on healthy runs.** The commit step's ignored-path exclude fails every
  run, every research record warns "Trusted evidence yield was absent", a refinement trips the
  synthesis invariant, and the closeout scopes its row to the parent session while every
  iteration row is scoped to the run.

## 2. Research Topic

The verbatim topic is `fanout-research-topic.txt`. It asks six questions: Q1 lineage honesty,
Q2 the cross-CLI execution contract, Q3 orchestration robustness, Q4 frontier economics, Q5
prior art, Q6 bookkeeping that fires on a healthy run. Built backlog rows 1-11, 14, 16b, 18a and
19-26 are excluded.

## 3. Scope and Method

- Six depth-1 seeds, one per question, dealt round-robin: opus took F-1-001 (Q1), F-1-003 (Q3)
  and F-1-005 (Q5, the web question); deepseek took F-1-002 (Q2), F-1-004 (Q4) and F-1-006 (Q6).
- Each lineage admitted two depth-2 children, which filled its node cap of 5 at iteration 1.
  Nothing was pruned.
- Opus calibrated its honesty rules against 678 committed lineages and 3,588 passes. Deepseek
  ran the agent-mirror and command-tree parity gates and the cli-adapter bijection validator.
- The conductor's own measurements of this run are in `../scratch/dogfood-research-gen4.md`.

## 4. Lineages and Frontier

| Lineage | Nodes | Iterations | Stop | Wall clock |
|---------|-------|------------|------|------------|
| opus | F-1-001, F-1-003, F-1-005, F-2-006 (per-runtime log shapes), F-2-007 (honesty thresholds) | 5 | converged, `all_questions_answered`, graph `STOP_ALLOWED` on the first attempt | 23.1 min |
| deepseek | F-1-002, F-1-004, F-1-006, F-2-007 (adapter stress suite gating), F-2-008 (rerun identity) | 6 | converged, `all_questions_answered`, after one graph block the lineage caused by skipping two upserts | 16.0 min |

The two lineages minted the same id, F-2-007, for different questions. The merge namespaces
node ids by lineage (`deepseek:F-2-007`), so nothing collided in the merged registry.

## 5. Q1 Lineage honesty (opus F-1-001, F-2-007)

- **The stamp is the strongest signal.** The gen2 review deepseek lineage ran from -36 s to
  +126 s against its commits. 17 corpus lineages are future-stamped, with skew that grows during
  the run. No Claude or research lineage skews by more than 1 s. Recent research rows carry no
  model stamp, so that zero shows how the gateway stamps rows, not that the passes were honest.
- **Calls and reads per pass come from the runner's own JSON log.** Gen2's stamped passes made
  3-14 calls with 0-7 reads, and its real passes 33-112. Duration alone misclassifies, since
  real passes ran in as little as 33 s.
- **The record's own `toolsUsed` and `sourcesQueried` are claims.** They list 2-3 tool names
  against 8-69 logged calls.
- **Weighing.** A flagged pass should count like a `thought` iteration: no stuck move, no stop
  vote, no node visit and no node answered alone (`convergence.cjs:1464`, `:1785-1788`). The
  merge keeps its findings but not its coverage, and the attribution's "Convergence" column,
  which prints the last self-reported ratio, becomes a "flagged passes" count.
- **Limits.** No cli-claude-code lineage has a JSON log, so the reads and batched rules are
  unmeasured on Claude until it moves to `stream-json`.

## 6. Q2 Cross-CLI execution contract (deepseek F-1-002, F-2-007, F-2-008; opus F-2-006)

- `--sandbox-mode` round-trips for three of eight kinds; `runCodex`, `runLineageBuiltin` and
  `runDeepseekHarness` hardcode `workspace-write` (`dispatch-iteration.cjs:421`, `:538`, `:902`).
- The prompt travels over argv for claude, cursor, opencode and pi, stdin for codex and dsh, and
  a file for vibe, and no field publishes it.
- Cost reads only opencode's `step_finish.part.cost` (`fanout-salvage.cjs:76`). Claude and Cursor
  request text output (`fanout-run.cjs:2709`, `:2930`).
- `needs_input` detection reads a text transcript tail (`cli-guards.cjs:186`), so JSON-log kinds
  cannot be classified.
- "Session resume" is artifact resume only. No builder passes a resume flag, and
  `EXECUTOR_SESSION_ENV_BY_KIND` is read only by the recursion guard.
- The cli-adapter stress suite is gated in `npm test` and CI, but its bijection validator finds
  0 of 126 tests, because `vitest list` now prefixes `[serial] ` and the parser keeps only lines
  that start with the test directory (`validate-playbook-package.cjs:120-121`).
- The agent mirrors pass both sync gates. A fan-out inlines the `.skilled` persona, so mirrors
  do not diverge a fan-out.
- **The contract.** Both lineages converge on one per-kind capability record (binary, prompt
  channel, log format, cost source, effort surface, sandbox surface, resume) beside
  `EXECUTOR_KIND_FLAG_SUPPORT`, with a table-driven conformance test over fixture logs. Opus
  frames it as an Inspect `ModelAPI`-shaped adapter with `parseLog` and `classifyFailure`.

## 7. Q3 Orchestration robustness (opus F-1-003)

- **Kill.** A plain SIGTERM to the outer pid does reach the lineages, which narrows the gen3
  claim. SIGKILL, SIGHUP and group kills do not (`fanout-run.cjs:70-100` forwards SIGINT and
  SIGTERM only). Proposed: SIGHUP in the handler list, a parent-death watch in the TSX child,
  and a `--stop` that terminates the ledger's live `spawned` groups.
- **Quota.** The rerun command reuses the same argv (`fanout-run.cjs:1267-1277`), so it points at
  the exhausted provider. Proposed: `--lineage-override`, valid only with `--only-lineage`.
- **Re-entrancy.** Only `spawned` ledger rows guard a second runner. Proposed: an `O_EXCL` runner
  lock at the base directory.
- **Live view.** Progress rows carry `duration_ms` and gauges only (`fanout-run.cjs:2206-2223`).
  Proposed: iterations, last commit, node counts and flagged passes per row, and a read-only
  `--status` table that doubles as the root dashboard.
- **Dealing.** Dealing is round-robin by node id (`fanout-run.cjs:354-364`). Proposed: a seed
  `needs: ["web"]` field dealt to a lineage whose web search is not disabled.

## 8. Q4 Frontier economics (deepseek F-1-004)

- A band's spend is summed across its nodes, so one node's revisits can close a barely examined
  sibling (`frontier-admit.cjs:360`, `:386`).
- Growth slots are one run-wide cap filled in delta order (`frontier-admit.cjs:515`, `:828`). In
  this run both lineages' first iteration proposed two children and filled the cap.
- Cross-lineage duplicate questions are invisible to admission and to the merge guard. A root
  question digest added to each lineage's known texts would prune them as `dedupe`.
- **Held rows.** Deepseek orders them 30 with 12, then 13 after the capability record, then 29.
  Opus orders 13 first (it is half built and drifting), then 29, then 12 and 30. They agree that
  13 must come before 29, and disagree on whether 13 waits for the capability record. The
  conductor sides with deepseek: collapsing the executor branches without the record can
  reintroduce the sandbox substitution of section 6.

## 9. Q5 Prior art (opus F-1-005)

- Inspect records tool events in the harness, not from the model
  (https://inspect.aisi.org.uk/reference/inspect_ai.event.html), and normalizes providers behind
  `ModelAPI` (https://inspect.aisi.org.uk/extensions-model-api.html). Its eval sets match the
  rerun behaviour already built (https://inspect.aisi.org.uk/eval-sets.html).
- Claude Code headless `stream-json` reports cost and tool events
  (https://code.claude.com/docs/en/headless).
- OpenHands' stuck detector flags repeated event shapes
  (https://docs.openhands.dev/sdk/guides/agent-stuck-detector).
- LangGraph clears a timed-out attempt's pending writes before a retry
  (https://docs.langchain.com/oss/python/langgraph/durable-execution).
- AutoGen's `ExternalTermination` stops a team from outside the loop; it is folded into the
  `--stop` proposal.

## 10. Q6 Bookkeeping that fires on a healthy run (deepseek F-1-006)

- The `synthesis_incomplete` alarm is a count mismatch: the reducer folds a `refines` row into its
  target, and the closeout counts distinct ids (`synthesis-closeout.cjs:373`).
- The commit step excludes `.legacy-projection-watermarks`, which `.gitignore:449` already ignores,
  and `git add` refuses it (`deep-research.yaml:2158`). This run reproduced it at the root.
- The closeout scopes the terminal row's `lineageId` to `parentSessionId`
  (`synthesis-closeout.cjs:291-294`), while every iteration row is scoped to the run's own id.
  This run's deepseek ledger shows both scopes in one stream.
- Every research record warns "Trusted evidence yield was absent and remains explicitly zero"
  (`legacy-compatibility.ts:714`).
- An iteration with findings but no answered question writes no graph evidence, and the evidence
  guards then report `notEvaluated` as a pass (`upsert.cjs:357`, `:481`).
- The reducer reports 238 `keyFindings` for opus against 39 delta `finding` rows, so merged
  "key findings" totals overstate the evidence.

## 11. Recommendations

The ranked list, with the conductor's code check of the top ten, is `improvement-backlog.md`.
The highest-value items are the gateway-clock stamp with the model value kept as a claim, a
per-pass evidence reader beside the cost reader, the adapter capability record with its
conformance test, Claude on `stream-json`, kill semantics with `--stop`, and the removal of the
four healthy-run alarms.

## Eliminated Alternatives

- Pass duration as a standalone honesty signal: real passes ran in 33 s.
- A minimum-reads threshold: it flags real passes that rely on carried context.
- Raising the run-wide node cap: it spends more iterations on the first-worked branch.
- Ranking proposals by a model-written score: the runner cannot audit a self-asserted score.
- Deleting the `synthesis_incomplete` invariant: the mismatch is real for a lost finding.
- An Agent SDK `PostToolUse` audit hook: it writes into the operator's Claude config dir, and
  `stream-json` gives the same events.

## Divergence Map

- Convergence mode was `default` in both lineages: 0 pivots, 0 failures, 0 audited overrides.
- Saturated directions: none.
- Remaining frontier: none. All 10 nodes (5 per lineage) are answered in both the projection and
  the node store.

## 12. Open Questions

- Do Pi and Devin have a JSON event mode?
- What is the false-positive rate of the reads and batched rules on Claude, once it logs JSON?
- Does resume leave orphan iteration files after a killed attempt?
- Should a band close keep a per-node floor of one visit, or a fraction of the band share?
- Does the root question digest belong to `fanout-run.cjs` at deal time or to `frontier-admit.cjs`?

## 13. Cross-Lineage Agreement and Conflict

- **Agree:** one adapter capability record and a conformance test (opus #10, deepseek #1); Claude
  cost needs a JSON log (opus #7, deepseek #7); resume is artifact-only (opus #20, deepseek #13);
  the merge guard sees only node ids (both).
- **Conflict:** the held-row order (section 8).
- **Self-correction:** opus narrowed the gen3 kill claim (SIGTERM does reach the lineages).

## 14. Quality Guards

- Opus stopped on its first stop attempt with no blocker. Deepseek's first stop was blocked by
  `source_diversity_guard` and `uncovered_questions`, because it had skipped the graph upsert for
  iterations 4 and 5. It reran the upserts, and the next attempt was allowed.
- Neither lineage recorded a `blocked_stop` row for that attempt, so the block is visible only in
  deepseek's own report.

## 15. References

- `lineages/opus/research.md`, `lineages/deepseek/research.md`, their `iterations/` and `deltas/`
- `fanout-attribution.md`, `orchestration-summary.json`, `orchestration-status.log`
- `resource-map.md` (root, emitted from both lineages' deltas)
- `../scratch/dogfood-research-gen3.md`, `../scratch/dogfood-review-gen2.md`,
  `../research_archive/20261120T125555Z/improvement-backlog.md`

## 16. Run Notes

- Runner 12:57:20 to 13:20:25 UTC, exit 0, both lineages `succeeded` on attempt 1.
- Provider cost: deepseek $0.342242, opus unknown (text log), total unknown.
- `step_writeback_spec_findings` and `phase_save` were skipped: the run is report only.

## 17. Convergence Report

- Stop reason: converged
- Total iterations: 11 (opus 5, deepseek 6)
- Questions answered: 10 / 10
- Remaining questions: 0
- Last 3 iteration summaries: opus 5: per-runtime log shapes (0.79); deepseek 5: adapter stress gating (0.75); deepseek 6: rerun identity (0.75)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
