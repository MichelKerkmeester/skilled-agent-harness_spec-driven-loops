# Research: a simpler, cheaper, parity-safe expansive-depth deep loop

Generation 3 of this packet's research, an expansive-depth fan-out of two lineages. The
ranked, conductor-verified backlog built from it is `improvement-backlog.md` in this folder.

## 1. Executive Summary

The question was what would make the expansive-depth research and review modes, and the
deep-loop runtime behind them, simpler, cheaper, easier to operate and identical across CLI
runtimes, ranked by value over effort.

The answer is that the expensive problems are seams between pieces that already exist, not
missing subsystems.

- **The fan-out path skips steps the rest of the workflow relies on.** The root has no config,
  so its resource map cannot be emitted, its status cannot be marked complete, and a restart
  records no generation. A lineage's resource-map command drops the lineage directory.
  Both lineages and the root hit this in this run.
- **The stop machinery wastes iterations on contract mismatches.** The graph stop guards read
  only the optional `graphEvents`, so a lineage that writes the mandatory finding rows still
  needs a recovery iteration. Research counts stuck passes across the whole lineage, while
  review counts per node.
- **Recovery has no first-class path.** A finished lineage cannot be skipped on re-dispatch,
  one failed lineage cannot be rerun by name, and the run summary does not say which lineage
  failed.
- **Parity mostly exists as data and leaks at the hand-built edges.** The single-executor
  review dispatcher still hardcodes `acceptEdits` for Claude. The preview also prints the Claude
  permission resolution, `acceptEdits`, for opencode, which has no permission flag.

Prior art agrees with the existing order: a safety cap first and termination in routing.
It adds two practices worth borrowing: observable-repetition stuck detection, and an
`eval_set`-style re-entrant fan-out that is a no-op on completed work.

## 2. Research Topic

The verbatim topic is `fanout-research-topic.txt` in this folder. Its six questions were seeded
as the six depth-1 frontier nodes F-1-001 to F-1-006 (`frontier-seed.json`,
`frontier-nodes.jsonl`).

## 3. Scope and Method

- The code was read at `d4420e9510d`. The fan-out review's findings in `../review/review-report.md`
  and their fix commits `a424fb6cd8a..d4420e9510d` were treated as closed, not re-reported.
- Two lineages ran under `fanout-run.cjs` with expansive depth. The seed was dealt round-robin:
  - `opus` (cli-claude-code `claude-opus-5-5`, effort medium, `bypassPermissions`): F-1-001
    (restraint), F-1-003 (open design questions) and F-1-005 (prior art).
  - `deepseek` (cli-opencode `llmgateway/deepseek-v4.1-flash-1017#max`): F-1-002 (operator UX),
    F-1-004 (cross-CLI parity) and F-1-006 (cost and latency).
- Evidence is code file:line at the tip, the committed review runs under `../review/` and
  `../review-archive/`, the live playbook logs, and web sources for Q6 only.
- The conductor re-checked the top-ranked claims against the code. The marks are in
  `improvement-backlog.md`.

## 4. Lineages and Frontier

| Lineage | Iterations | Stop | Wall clock | Growth |
|---------|-----------|------|-----------|--------|
| opus | 5 | converged (after one blocked stop) | 20.1 min | none proposed |
| deepseek | 10 | maxIterationsReached | 13.7 min | 7 proposed: 2 admitted at depth 2, 5 pruned by the node cap |

- In the reducer projection, opus answered all three of its nodes. Deepseek answered F-1-002,
  F-1-004, F-2-007 and F-2-008. F-1-006 closed `exhausted/budget` when the depth-1 band was spent.
- Deepseek reported `newInfoRatio` 1.0 on every pass. Once its frontier drained, it spent
  iterations 8-10 on the topic's Q1, Q5 and Q6, which belonged to opus. Those three questions
  therefore have two independent answers, compared in section 13.

## 5. Q1 Restraint: what can be deleted or collapsed

- **Frontier projection, twice.** Each reducer projects the frontier on its own:
  `deep-research/scripts/reduce-state.cjs:2453-2534` and `runtime/scripts/reduce-state.cjs:1960-2030`.
  A single `projectFrontier` in `frontier-admit.cjs` would replace both. Value H, effort M.
  The risk is the 63 + 96 + 47 frontier test assertions. [opus]
- **Three node-marker parsers.** `convergence.cjs:1359-1395`, the research reducer near `:2491`
  and `frontier-admit.cjs:1014` each parse "Frontier node <id>". Keep one, in
  `frontier-admit.cjs`. The anchored copy renders no block for a reworded focus that the other
  two still count. [opus]
- **Fifteen inline `node -e` programs in the YAMLs.** Seven are in research and eight in review,
  for example `deep-research.yaml:534-630` and `:858-905`. Every CLI lineage must transcribe them,
  which is the main source of cross-runtime variance. Move them to one runtime script. [opus]
- **Six single-executor YAML branches that differ by one argument.** They are at
  `deep-research.yaml:1762-1837` and the same shape in review. Collapse them to one branch that
  routes through `buildLineageCommand`. That deletes the hand-built `runClaude` and `runCodex`
  in `dispatch-iteration.cjs`, where the review Claude branch hardcodes `acceptEdits`. About 300
  runtime lines and 100 lines per YAML. [deepseek]
- **Smaller deletions**:
  - 24 config-key aliases (`fanout-run.cjs:1374-1407`); the token-named ones actually count
    iterations.
  - The expired legacy-name migration (`deep-research.yaml:489-504`).
  - Eight `is*BinaryAvailable` probes, which one table can replace.
  - The `scripts/append-mode-event.cjs` cwd fallbacks, once gateway steps pin
    `working_directory`.
  - The 19 print-only `bookkeeping_log` templates.
  - The duplicated seed and preview steps in `deep-research.yaml`.

  [opus, deepseek]

## 6. Q2 Operator UX

- **Recovery.** A finished lineage gets a fresh session on re-dispatch, because
  `readStoredLineageSessionId` refuses a complete config (`fanout-run.cjs:772`). It then fails the
  completion check. Rerunning one lineage needs the internal `--allow-single-lineage` flag and a
  hand-edited matrix. [opus, deepseek]
- **Summary.** `orchestration-summary.json` has counts and `failure_classes` but no label,
  status or rerun command per lineage, although the pool computes them. [deepseek]
- **Discoverability.** The `--depth-mode` cell in `research.md:107` still runs to 486 words,
  which `review.md` already collapsed to a pointer. The dry run prints `frontier_scope: []` for an
  unseeded expansive run, which looks the same as "dealt no nodes". [deepseek]
- **Dashboards.** Research publishes band spend but not per-node visits. The two reducers' frontier
  sections have drifted. Per-iteration latency cannot be attributed, because no host-measured
  `durationMs` reaches the iteration row. [deepseek]
- **Question intake.** Questions arrive by two paths. The legacy key questions duplicate the
  frontier questions in different words, so 3 of 11 stay "open" after their frontier twins were
  answered. Next Focus once copied a closing instruction verbatim
  ("Close F-2-008 as answered ..."). [deepseek]

## 7. Q3 Cross-CLI Parity

- **The contract already exists as data.** `EXECUTOR_KIND_FLAG_SUPPORT` and
  `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` are in `executor-config.ts:112-170`. Two derived facts
  are not published: whether the sandbox is preventive or only compensating, and whether effort
  goes on a flag or is baked into the model id. Put both in `effective_config` and the preview.
  [deepseek]
- **Drift sits in the hand-built single-executor paths**: the review Claude branch's hardcoded
  `acceptEdits` at `dispatch-iteration.cjs:379`, and kind-specific branches in the shared worker
  (`fanout-run.cjs:4664-4695`). [deepseek]
- **Log shape is not at parity, despite deepseek's claim.** cli-claude-code runs with
  `--output-format text`, so its lineage log holds only the final answer and no token or cost
  data. The opencode JSON log carries both (`lineages/*/logs/fanout-lineage.out`).
  [conductor, from this run]

## 8. Q4 Cost and Latency

- **Measured in this run.**
  - Setup, from spawn to the lineage config, took 1.3 to 1.7 min. Opus reached its first
    iteration at 6.3 min, deepseek at 3.3 min.
  - Opus passes took 2 to 5 min, deepseek passes 0.5 to 1.6 min.
  - Deepseek cost $0.326 for 10 iterations (164 steps, 34.7 M cache-read tokens). Opus logged no
    cost.
- **Measured in the committed review runs**: 1.5 to 3.7 min per iteration [deepseek]. The doc's
  "seven to eight minutes an iteration" (`deep-review/references/protocol/loop-protocol.md:464`)
  is stale in both directions, and the topic's "8-11 minute setup" did not reproduce.
- **The 50/35/15 split and the node cap decide coverage before relevance does.**
  - With 3 nodes per lineage, the derived budget is a constant 10 for any 2-lineage research
    run (`frontier-admit.cjs:469-476`).
  - The node cap of 5 filled at iteration 1, so 5 of deepseek's 7 proposals were pruned `fanout`.
  - The depth-1 band of 5 visits closed F-1-006 after one pass.

  [deepseek, conductor]
- **Cache re-read is the cost shape.** Each added iteration re-reads about 6 M cached tokens on the
  opencode route [deepseek]. A cheaper model changes the multiplier, not the shape.

## 9. Q5 Open Design Questions

- **(a) Per-node stuck counting for research: yes.**
  - `nodeScoped` is review-only (`convergence.cjs:1774-1778`).
  - Research's reducer projection publishes no `activeNodeId`, which review's does at
    `runtime/scripts/reduce-state.cjs:2026`. The research stuck branch therefore closes the node
    named by its own focus-marker regex (`deep-research.yaml:1520-1536`; the topic's `:1488` is
    stale).
  - Under breadth-first rotation, three low passes on three different nodes close the third node
    after one visit.
  - Fix: publish `activeNodeId` in the research projection, then drop the `loopType === 'review'`
    gate.

  [opus, deepseek agree]
- **(b) Completion check: not a resume or extend break, but a re-dispatch break.**
  - The check is window-scoped to the current attempt (`lineage-timestamp-window.ts:183-241`),
    every new attempt writes a fresh closeout row, and `--extend` is refused with fan-out
    (`deep-research.yaml:372-382`).
  - What breaks is re-dispatching a lineage that is already complete. It gets a new session,
    halts at `completed-session` with no new terminal row, and fails `stale_terminal_event`.
  - Retroactively, the rule fails 98 of the 380 committed research lineage logs (26%). 80 have no
    terminal row, and 84 of the 98 still have a `research.md` (conductor count;
    opus counted 78 of 343, deepseek 31 of 104 with narrower filters).
  - Right rule: keep the post-attempt check strict, and add a pre-spawn classifier that skips a
    lineage whose config is `complete` and whose artifacts pass `completionFromArtifacts`.

  [opus, deepseek, conductor]
- **(c) Pivot admission: cheap enough to try.**
  - Admit an accepted pivot as a synthetic depth-2 `frontier_proposal` under the last-worked node.
  - That answers D-011-10's three reasons:
    - Scope: it inherits the parent's scope, so relevance passes.
    - Budget: depth 1 is drained at pivot time, so its remainder carries to depth 2.
    - Order: the `frontierOpen` veto restores the intended `frontier_drained` before
      `all_dimensions_clean`.
  - Fall back to D-011-10 when admission prunes it.
  - Deepseek adds reserving one node slot, because this run showed the node cap filling at
    iteration 1.

  [opus, deepseek]

## 10. Q6 Prior Art

- **Frontier growth.**
  - dzhng/deep-research, GPT Researcher and Static-DRA grow trees from breadth and depth scalars.
  - GPT Researcher halves breadth per level with a floor of 2.
  - None of them runs per-proposal admission checks.

  Sources: https://github.com/jamisonl/deep-research,
  https://docs.gptr.dev/docs/gpt-researcher/gptr/deep_research,
  https://docs.gptr.dev/blog/2025/02/26/deep-research and https://arxiv.org/html/2512.03887v2.
  [opus]
- **Stuck detection.**
  - OpenHands detects observable repetition: the same action and observation 4+ times, a
    ping-pong over 6+ cycles, repeated errors, monologues.
  - It is on by default with hard-coded thresholds.

  Sources: https://docs.openhands.dev/sdk/guides/agent-stuck-detector and
  https://github.com/OpenHands/software-agent-sdk/issues/762. [opus]
- **Stop rules.**
  - LangGraph's `recursion_limit` (default 25) is a safety cap, and termination belongs in
    routing, which matches the terminal-cap-first order here.
  - Anthropic's multi-agent research system puts effort-scaling rules in the prompt, costs about
    15x the tokens of chat, resumes from the failure point, and warns that vague briefs duplicate
    work.

  Sources: https://langchain-ai.github.io/langgraph/how-tos/recursion-limit and
  https://www.anthropic.com/engineering/multi-agent-research-system. [opus, deepseek]
- **Multi-executor fan-out.**
  - Inspect's `eval_set` is a no-op on a complete log directory, and `eval_retry` resumes only
    interrupted tasks: the re-entrant shape recommended in 9(b).

  Sources: https://inspect.aisi.org.uk/eval-sets.html,
  https://inspect.aisi.org.uk/reference/inspect_eval-retry.html and
  https://hawk.metr.org/user-guide/eval-set-config-reference/. [opus]
- **Breadth from perspectives and evaluation before expansion.**
  - STORM (https://arxiv.org/abs/2402.14207) seeds from distinct perspectives.
  - Tree of Thoughts (https://arxiv.org/abs/2305.10601) evaluates candidates before expanding them.
  - LangChain Open Deep Research (https://github.com/langchain-ai/open_deep_research) publishes
    per-researcher limits and a cost table.

  [deepseek]

## 11. Recommendations

The ranked list, with value, effort, risk and the conductor's CONFIRMED or PLAUSIBLE mark for each
of the top ten, is `improvement-backlog.md`. The top five:

1. Make `step_emit_resource_map` pass the lineage artifact directory.
2. Write a root config on the fan-out path.
3. Feed the graph stop guards from the mandatory finding rows.
4. Resolve the Claude permission mode in the single-executor review dispatcher.
5. Publish a per-lineage status and rerun command in the run summary.

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Lineage(s) |
|----------|-------------------|----------|------------|
| Merge the two reducers wholesale | Their registries, dashboards and answered predicates differ; only the frontier projection is shared | both reducers' frontier sections | opus, deepseek |
| Widen the strict research terminal set to legacy names | Loosens the live check to fix a pre-spawn classification problem | `fanout-run.cjs:1248-1251` | opus, deepseek |
| Delete `frontier-admit.cjs` | It is the one shared home of the frontier rules; the duplication sits around it | `frontier-admit.cjs` | deepseek |
| A full MCTS (LATS-style) frontier | 10 to 24 iterations are too shallow to repay branching overhead | run budgets | deepseek |
| A cheaper model as the main cost lever | The cost shape is cache re-read and wall clock | deepseek lineage log | deepseek |
| Skip the context ladder in fan-out children to save setup time | Setup measured 1.3 to 1.7 min to config in this run, not 3 to 10 | `orchestration-status.log`, lineage config rows | conductor |
| Retroactive `graphEvents` for write-once iterations | Iterations are write-once | iteration contract | opus |
| Co-STORM's session model as a stop rule | No automatic stop; sessions end on user request | https://arxiv.org/pdf/2408.15232v1.pdf | opus |

## Divergence Map

- Saturated directions: none recorded by either reducer.
- Pivots taken: none, because the convergence mode was `default`.
- Pivot failures and overrides: none.
- Remaining frontier: no open node in either projection. F-1-006 closed `exhausted/budget`.
  F-2-009 to F-2-013 were pruned by the node cap without being studied:
  - F-2-009: an effective-config preflight contract
  - F-2-010: one dispatch value for every executor kind
  - F-2-011: joining receipt durations to iterations
  - F-2-012: measured setup per kind
  - F-2-013: single-executor builder drift

## 12. Open Questions

- Pre-spawn classification (9b) is traced through code, not reproduced. A two-lineage fixture with
  one lineage already complete would confirm it.
- Does a vendored layout run gateway steps from `runtime/`? The answer gates deleting the
  `append-mode-event.cjs` cwd fallbacks.
- Pivot admission (9c) is a design, not yet tested against the band carry in
  `frontier-admit.cjs:360-396`.
- The pruned depth-2 questions F-2-009 to F-2-013 were never studied.

## 13. Cross-Lineage Agreement and Conflict

- **Agree**:
  - per-node research stuck counting
  - completion check strict live and tolerant before spawn
  - a first-class one-lineage rerun
  - a single frontier projection
  - the two reducers not merged wholesale
- **Conflict on log-shape parity.** Deepseek says log shape is uniform. The committed opus log is
  a 3.8 KB text answer with no token data, so the conductor sides against it.
- **Conflict on setup cost.** Deepseek measured 3 to 10 min per lineage in committed runs. This run
  measured 1.3 to 1.7 min to config and 3.3 to 6.3 min to the first iteration. Both are reported.
- **Deepseek's answers to Q1, Q5 and Q6 came from outside its partition** and match opus's in
  direction. They are weaker on prior art: 4 sources against opus's 15.

## 14. Quality Guards

- Every recommendation cites file:line or a URL.
- The conductor confirmed each top-ten claim at the tip and recorded its mark.
- External sources answer Q6 only.
- The resource map is `resource-map.md` in this folder, built from 15 lineage delta files.

## 15. References

- Lineage syntheses: `lineages/opus/research.md`, `lineages/deepseek/research.md`.
- Lineage iterations: `lineages/opus/iterations/` (5), `lineages/deepseek/iterations/` (10).
- Merge: `findings-registry.json`, `deep-research-findings-registry.json`, `fanout-attribution.md`.
- Run ledger and summary: `orchestration-status.log`, `orchestration-summary.json`.
- Resource map: `resource-map.md`.
- The prior generation is archived at `../research_archive/20261120T011847Z/`.

## 16. Run Notes

- The run stopped at different points per lineage: opus `converged` after one blocked stop, and
  deepseek `maxIterationsReached`. The root stop reason passed to closeout is `converged`, the
  latest lineage stop.
- Three workflow steps were not run, so packet docs stay unchanged:
  - the spec.md findings write-back (`step_writeback_spec_findings` and its validation)
  - the continuity save (`phase_save`)
  - the dashboard refresh, which the workflow skips on fan-out
- The root `deep-research-config.json` was written late by the conductor, after the archive step.
  The fan-out path writes none, and without it the resource map cannot be emitted.

## 17. Convergence Report

- Stop reason: converged (opus); maxIterationsReached (deepseek)
- Total iterations: 15 (opus 5, deepseek 10)
- Questions answered: 5 of 6 depth-1 nodes answered in the projection, with F-1-006 closed by budget
  after a substantive pass; 2 of 2 admitted depth-2 nodes answered
- Remaining questions: none open in either projection
- Last 3 iteration summaries: opus run 5, blocked-stop recovery (0.55); deepseek run 9, Q5 design
  questions (1.0); deepseek run 10, Q6 prior art (1.0)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
