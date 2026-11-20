# Dogfood log: /deep:research --depth-mode=expansive, fan-out opus + deepseek

> Kept from the conductor's session scratchpad. Paths under `D/` named the conductor's scratch evidence, which was not kept; the packet paths (`R/`, `SPEC/`) still resolve.

Run on the integration worktree at `d4420e9510d` (clean at start). Spec folder
`specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode` (`SPEC`).
`D` below means this scratch directory (`scratchpad/dogfood-research/`), `R` the packet's
`research/` directory. The previous review dogfood is `scratchpad/dogfood/dogfood-log.md` (`PREV`).
The conductor followed `.skilled/commands/deep/research.md` and `deep-research.yaml` step by step
under `:auto`; deviations are named where they happen.

## Setup and invocation

Invocation (as the operator would type it):

```
/deep:research:auto "<D/research-topic.txt>" --spec-folder=SPEC --restart --depth-mode=expansive \
  --executors='<D/fanout-config.json>' --concurrency=2
```

The matrix: opus = `cli-claude-code`, `claude-opus-5-5`, effort medium, configDir
`~/.claude-account2`, `sandboxMode: danger-full-access`; deepseek = `cli-opencode`,
`llmgateway/deepseek-v4.1-flash-1017`, effort max. Budget left at default so the mode sizes itself.

### S1. The archive folder is `research_archive/`, not `research-archive/`

- `resolveArtifactRoot(SPEC, 'research')` returns `artifactArchiveRoot: SPEC/research_archive`
  (underscore). Review uses `review-archive` (hyphen). The brief said `research-archive/`.
- I followed the resolver, because the YAML archives to `{state_paths.archive_root}`
  (`deep-research.yaml:235`, `:359-366`). `research_archive/20261117T103614Z` (generation 1) already
  lives there.
- Friction: the two sibling loops spell their archive folder differently. An operator who looks for
  `research-archive/` after a review run finds nothing.

### S2. The dry-run preview works and shows what it promised, except the topic

- `step_fanout_dry_run_preview` (`deep-research.yaml:278-313`) ran `fanout-run.cjs --preview`
  (`D/preview.out`, `D/preview.err`, exit 0). It wrote nothing (`git status` empty after).
- **Confirmed from the preview**: opus `claude -p <prompt:digest> --model claude-opus-5-5
  --permission-mode bypassPermissions --output-format text --effort medium`, `config_dir
  ~/.claude-account2`, sandbox `danger-full-access`. Deepseek `opencode run --standalone -m
  llmgateway/deepseek-v4.1-flash-1017#max --format json --auto <prompt:digest>`, effort max.
- **Not confirmable from the preview**: the topic text. Every prompt is a digest. I rendered the
  prompts read-only through the exported `buildLoopPrompt` (`D/render-prompt.cjs`): the topic is in
  both prompts verbatim (`D/prompt-opus.txt` 46,309 chars, `D/prompt-deepseek.txt` 46,552 chars).
  A `--preview-prompt` or a printed topic digest beside the topic file's digest would close this.
- Preview oddities:
  - The opencode entry's `effective_config.permissionMode` reads `acceptEdits`. That is the Claude
    permission resolution passed through, although opencode has no permission flag. Claude, Devin
    and dsh each pass their own `--permission-mode` values (`fanout-run.cjs:2582`, `:3026-3030`,
    `:3316`).
  - `FATAL WARN: lineage deepseek runs with --auto ...` is printed for a warning that is not fatal
    (`D/preview.err`). Same banner as `PREV` F-block.
  - `aggregate_budget.upper_bound.estimated_cost_units` is 20 while each `per_lineage` entry says
    `estimated_cost_units: 60`. The two numbers use different units of "estimated" with no label.
  - The opencode entry shows `stdin: "<input>"` while the prompt digest also sits in argv, so it is
    unclear which channel carries the prompt.
  - Before the seed, both lineages show `iterations: 10` and "got no seed share", as the docs say
    (`research.md:145`). Expected, but the stderr line "2 lineages share 0 open seed nodes" reads
    like a fault on a dry run.
- The `dry_run_halt` line (`D/dry-run-halt.jsonl`) was **written by me with `echo`**, from the
  YAML's `default_halt_event` template. No script emits it: the halt hook is prose the conductor
  executes (`deep-research.yaml:107`). So the dry run's "halt" is only as reliable as the conductor.

### S3. Budget sizing at the default

- Six seeds dealt round-robin give each CLI lineage 3 nodes, and
  `expansiveBudget` gives `min(24, max(10, 2 x 1 x (3 + 3 - 1))) = 10`
  (`frontier-admit.cjs:469-476`), which equals the CLI floor. Any seed count from 1 to 6 gives
  every CLI lineage exactly 10 here, so "the mode sizes itself" is a constant for a 2-lineage run.
- Node cap is half the budget, 5 per lineage, so 2 growth slots past the 3 seeds.

## Restart, seed and spawn

### S4. `--restart` archived the old packet intact

- `bind_prior_lineage` read generation 2, session `2026-11-17T10:36:36.000Z` (`D/prior-lineage.json`).
- `research/` moved to `SPEC/research_archive/20261120T011847Z/`. Every one of the 80 tracked
  `research/` files exists there, and the generation-1 archive `research_archive/20261117T103614Z/`
  is untouched (`git diff` empty on it).
- As in `PREV` F5, the fan-out parent never runs `step_create_config`, so nothing records the new
  generation (3) or its parent session. The lineage chain the restart promises does not exist on the
  fan-out path. Not fixed since the review.

### S5. Seeds: 6 admitted, 0 pruned

- I wrote `R/frontier-seed.json` (6 sub-questions, 226 to 368 characters, under the 500 cap) and ran
  `frontier-admit.cjs seed ... --max-iterations-source default` (`D/seed.out`, `D/seed.err`):
  `admitted F-1-001..F-1-006, pruned []`.
- Seed quality: each seed is one of the topic's Q1-Q6, so they are good by construction. Research
  admission checks only that `question`, `scope` and `evidence` are non-empty strings: the
  prior-art seed's scope "web sources on agentic deep-research ..." passed the relevance check,
  which shows that relevance is a shape check for research, not a scope check.
- **Judgment call on order**: nodes are dealt round-robin in code-unit id order with opus first,
  so I placed the web question (Q6, prior art) at F-1-005 to land on opus, whose `claude -p` has
  web tools. The deal in `R/orchestration-status.log` confirmed opus = F-1-001, F-1-003, F-1-005
  and deepseek = F-1-002, F-1-004, F-1-006. An operator who does not know the dealing rule cannot
  steer a web-only question to a web-capable lineage.
- `PREV` F6 is still open: the parent seed prints `budget after seed 16 iterations, 2 growth slots`
  (the single-executor figure), while each lineage runs 10 (`D/fanout.err`). Here the growth figure
  happens to match (cap 5 - 3 seeds = 2 per lineage), the iteration figure does not.

### S6. Spawn

- Inputs written with the file-write tool to `R/fanout-research-topic.txt` and
  `R/fanout-config.json`, as `step_fanout_spawn` says. Runner launched at 01:19:42 UTC with
  `AI_SESSION_CHILD=1` exported, through `D/launch.sh`.
- Process tree: runner 39805 re-executes itself as a `node --import ...` child 39812, which owns the
  lineage processes opus 44925 and deepseek 44931 (`D/captured.pids`). A watchdog that kills "the
  runner PID" and its direct children does not reach the lineage CLIs; my watchdog kills 39805 and
  39812, and I would kill the two lineage PIDs by hand.
- The per-lineage budget lines are right: `lineage opus budget 10 iterations, derived from its seed
  share` (`D/fanout.err`).

### S7. Q5b checked independently before the lineages answer it

- I ran the shipped `checkLineageCompletion` (`lineage-timestamp-window.ts:183`) with the research
  terminal set over all 380 committed research lineage state logs, with the widest window so only
  presence and order are judged (`D/check-completion.mjs`, `D/completion-check.txt`).
- Result: 282 complete, 80 `no_terminal_event`, 10 `stale_terminal_event` (terminal row with no
  parseable stamp), 8 `no_iteration_records`. 84 of the 98 failures have a `research.md` on disk,
  and 32 have `status: complete` in their config.
- The 12 newest committed lineages (2026-11-15/16) all pass. The operator's "3 of 12" is a sample
  I could not reproduce; across the corpus the miss rate is 26%.

## Run progress

### P1. Both lineages ran clean on the first attempt (runner exit 0, `status: ok`)

- Runner 01:19:43 to 01:39:52 UTC, **20.1 min** (`D/fanout.out`, `R/orchestration-status.log`).
- **deepseek** (cli-opencode, `llmgateway/deepseek-v4.1-flash-1017#max`): 10 iterations,
  01:19:43 to 01:33:28, **13.7 min**, stop `maxIterationsReached` (`synthesis_complete` row at
  01:32:00). Passes took 33 s to 98 s (iteration file mtimes 02:22:49 to 02:30:50 local).
- **opus** (cli-claude-code, `claude-opus-5-5`, medium, `bypassPermissions`): 5 iterations,
  01:19:43 to 01:39:52, **20.1 min**, stop `converged` (`synthesis_complete` at 01:37:08). Passes
  took 2 to 5 min.
- Setup inside each lineage (spawn to first state row): opus 1.3 min to its config row and 6.3 min
  to iteration 1; deepseek 1.7 min to config and 3.3 min to iteration 1. That is far below the
  "8-11 minute setup" the topic quotes.
- No provider failure and no retry. Cost: deepseek's opencode JSON log
  (`R/lineages/deepseek/logs/fanout-lineage.out`) sums to **$0.326** over 164 steps (482,143 input,
  76,769 output, 36,774 reasoning, 34.7 M cache-read tokens; tools: 121 shell, 37 write, 32 read,
  4 webfetch, 4 edit), about $0.033 per iteration. Opus's `--output-format text` log is its 3.8 KB
  final answer and carries no token or cost data, as in `PREV` P9.

### P2. Pass quality: deepseek did real work this time, but its ratio is a constant

- Unlike `PREV` P6 (20-60 s rubber stamps), every deepseek pass cites 11 to 22 distinct file:line
  locations and runs 636 to 1,126 words (`R/lineages/deepseek/iterations/`).
- But every deepseek iteration reports `newInfoRatio: 1` (`R/lineages/deepseek/deep-research-state.jsonl`),
  10 of 10. Opus's ratios fall 0.93, 0.88, 0.75, 0.83, 0.55. A self-reported ratio that never
  moves cannot drive convergence, so deepseek could only ever stop on the iteration cap.

### P3. Frontier growth (admitted and pruned, and why)

- **opus**: 0 growth proposals. Each seed was marked answered after one pass, then one revisit of
  F-1-001 and one blocked-stop recovery pass.
- **deepseek**: 7 proposals. 2 admitted at depth 2 under F-1-002 (F-2-007 partial-run summary,
  F-2-008 per-node dashboard spend). 5 pruned with reason `fanout` (F-2-009 to F-2-013 under F-1-004
  and F-1-006): the lineage node cap is 5 (half its 10-iteration budget), and 3 seeds + 2 growth
  filled it at iteration 1. The pruned ones were good questions (for example F-2-012 "measured setup
  time per executor kind"). The cap, not relevance, decided what the run studied.
- The prune reason `fanout` names the run-wide node cap as well as the per-parent child cap
  (`frontier-admit.cjs:774-781`), so the store cannot tell the operator which cap bit.
- F-1-006 (cost and latency) closed `exhausted/budget` in the reducer's projection after one
  pass: the depth-1 band (50% of 10 = 5 visits) was spent across the three seeds.

### P4. Node store and registry disagree on every node

- After the run, `R/lineages/*/frontier-nodes.jsonl` shows every seed `open`, and no closes at all.
- The reducer projection in each lineage's `findings-registry.json` says opus F-1-001, F-1-003 and
  F-1-005 are `answered`, and deepseek's F-1-002, F-1-004, F-2-007 and F-2-008 `answered`, F-1-006
  `exhausted/budget`.
- In research the only close the workflow writes to the store is the stuck close
  (`deep-research.yaml:1528`). Answered and budget states live only in the reducer's projection, so
  the file named "the node store" is stale for every node that finished normally. The frontier veto
  reads the projection (`convergence.cjs:1559`, `:1749`), so behavior is right; the store misleads.
- This also explains why opus could stop `converged` at iteration 5 while its store shows three open
  nodes: the projection had none open, so the `frontierOpen` veto (`convergence.cjs:1206-1218`)
  correctly did not fire.

### P5. Deepseek left its partition after its frontier drained

- Iterations 1-7 worked deepseek's own nodes. Iterations 8, 9 and 10 took their focus straight from
  the topic: "Q1 restraint", "Q5 design questions", "Q6 prior art". Those are opus's F-1-001,
  F-1-003 and F-1-005.
- Cause: once the projection holds no open node, Next Focus falls back to the topic text, and the
  topic names all six questions. The partition only bounds the frontier, not the topic.
- `fanout-merge.cjs` reported `frontier_partition_guard.passed: true` (`D/merge.out`): the guard
  checks node ids, so topic-driven work on another lineage's question is invisible to it.
- Effect: Q1, Q5 and Q6 got a second, cheaper view. Useful for cross-checking, but it is unbudgeted
  duplicate work. Deepseek's prior-art pass made 4 `webfetch` calls and cites 4 URLs (Anthropic's
  multi-agent research post, LangChain open_deep_research, two arXiv papers); opus's cites 15.

### P6. Opus stopped converged after a blocked stop

- Iteration 5 is a `blocked_stop` recovery: `source_diversity_guard`, `evidence_depth_guard` and
  `uncovered_questions` blocked the stop although all three nodes were answered
  (`R/lineages/opus/iterations/iteration-005.md`). Opus traced the cause itself: the graph guards
  read only the optional `graphEvents` (`iteration-graph-upsert.cjs:122`), not the mandatory finding
  rows. This costs one recovery iteration per lineage that follows the mandatory contract.
- The `blocked_stop` row carries `stopReason: "legacy-blocked-stop"` and a whole-second stamp
  (`01:34:29.000Z`), while opus's iteration rows carry milliseconds.
- Deepseek recorded no `blocked_stop`, `stuckRecovery` or any convergence row: its ratio of 1 never
  reached a stop candidate, so the guards never ran.

## Synthesis on the fan-out root

### Y1. `step_fanout_merge` worked

- `fanout-merge.cjs --loop-type research` exit 0, 2 lineages, 192 key findings,
  `frontier_partition_guard.passed: true` (`D/merge.out`). The partition guard missed P5's topic
  drift, as noted.
- `fanout-attribution.md` lists opus "Convergence 0.55" and deepseek "1": the last ratio, labeled
  as convergence.

### Y2. `step_emit_resource_map` failed on the fan-out root: no root config

- The `if_present` command exited 3 with `ENOENT ... research/deep-research-config.json`
  (`D/resmap.err`), because `emitFanoutResourceMap` requires a root config
  (`reduce-state.cjs:1816-1819`) and the fan-out path writes none.
- The `:auto` setup is supposed to persist the config (`research.md:88`). But under `--restart`,
  `step_apply_lifecycle_request` would then archive that fresh config with the old packet, and
  `bind_prior_lineage` would read the new session as the "prior" one. **This is a contract
  contradiction.** Across the corpus, 104 of 192 committed fan-out research roots have neither a root
  config nor a resource map.
- **Judgment call:** I wrote the root config late, from the skill's template
  (`deep-research/assets/deep-research-config.json`). It holds generation 3, the parent session
  `2026-11-17T10:36:36.000Z`, `lineageMode: restart` and the fan-out matrix. The rerun then
  emitted `R/resource-map.md` from 15 delta files (`D/resmap2.out`).
- Both lineages hit the lineage-side twin of this defect: the single-loop `if_absent` command
  (`deep-research.yaml:2155`) carries no `{reducer_artifact_arg}`. Deepseek's map failed with
  ENOENT; opus added `--artifact-dir` by hand.

### Y3. `step_compile_research`, closeout and config status

- I wrote `R/research.md` from both lineage syntheses and iterations.
- `step_convergence_report` ran as written. The closeout emitted
  `deep_research.synthesis_complete` (`totalIterations: 15`) and the gateway appended it with a
  receipt (`D/closeout.out`). The root row carries `lineageId` = the *prior* session
  (`2026-11-17T10:36:36.000Z`), apparently taken from `parentSessionId`. That looks like a field
  mix-up worth checking.
- `step_update_config_status` set the late root config to `complete`.
- The dashboard refresh and the terminal heartbeat skip on fan-out by design, so the root has **no
  dashboard**, as in `PREV` P7.

### Y4. Deviations from the workflow (recorded)

- I skipped `step_writeback_spec_findings` and its validation (they edit `SPEC/spec.md`), and
  `phase_save --full-auto` (it writes continuity into packet docs). The brief is report-only with a
  clean tree.
- I restored the settle-time metadata refresh's rewrite of `SPEC/description.json` **and**
  `SPEC/graph-metadata.json` (176-line diff in `D/metadata-refresh.diff`).

## Did the fixes since the review behave live?

| Fix | Live result |
|-----|-------------|
| Fatal-failure stderr line (`f2de4f588c5`) | **Not exercised.** No lineage failed, so no terminal `failed` event fired. The code path is at `fanout-run.cjs:4185-4196`. |
| Completion check (`a6c1332a331`, `1ea09919553`) | **Behaved, but it is weak for research.** Both lineages passed on `synthesis_complete`. Research's terminal set accepts any synthesis row, including `synthesis_incomplete` (`fanout-run.cjs:1248-1251`). Deepseek wrote no convergence or stop-gate row at all and still passed, the same gap `PREV` P6 named for review, which review closed with `terminal_gates`. |
| Dry-run preview (`30c88ac2e2a`, `99a12d54838`, `377055592a5`) | **Worked.** It confirmed model, effort, sandbox, permission and config dir per lineage and wrote nothing. The topic text is not shown (digest only), so I confirmed it by rendering the prompt. Oddities are in S2. |
| No `description.json` rewrite (`4c6a3a41f03`) | **Review only, by design.** The research fan-out still rewrote `description.json` and `graph-metadata.json` at settle (`metadata_refresh_ok` x2 in `R/orchestration-status.log`), and the rewrite degraded both files. |
| Log rotation on resume (`600d84b1677`) | **Not exercised.** There was no failed attempt and no resume. `fanout-lineage.out/.err` exist once per lineage, and no `.1` file exists. |
| `--sandbox-mode` / `sandboxMode` for cli-claude-code | **Worked.** `bypassPermissions` in the preview and the live argv; opus ran Bash and recorded state. |
| Per-lineage budget lines | **Worked**: `lineage opus budget 10 iterations, derived from its seed share`. |

## Lineage differences, side by side

| Aspect | opus (cli-claude-code, claude-opus-5-5, medium) | deepseek (cli-opencode, llmgateway deepseek-v4.1-flash-1017, max) |
|---|---|---|
| Wall clock | 20.1 min, 5 iterations | 13.7 min, 10 iterations |
| Per iteration | 2 to 5 min | 0.5 to 1.6 min |
| Stop | converged after 1 blocked stop (graph guards) | maxIterationsReached; no stop machinery ran |
| Ratio | 0.93, 0.88, 0.75, 0.83, 0.55 | 1.0 on all 10 |
| Growth proposals | 0 | 7 (2 admitted, 5 pruned by the node cap) |
| Partition discipline | stayed on its 3 nodes | drifted into opus's Q1, Q5 and Q6 at iterations 8-10 |
| Citations per pass | 46 in iteration 1 | 11 to 22 |
| Web | 15 URLs | 4 URLs (4 `webfetch` calls) |
| Resource map | worked around the missing `--artifact-dir` | failed with ENOENT and reported it |
| Cost data | none (text output) | $0.326, 164 steps |
| Workflow hygiene | self-reported one `sed -i` and one shell-redirect write against the prompt pack's rules | no self-report |

## Top frictions

1. The fan-out root has no config, so the resource map fails, the config status cannot be set and the
   restart lineage chain is lost (Y2, S4).
2. The resource-map step drops the lineage artifact dir; both lineages hit it (Y2).
3. Expansive partitioning leaks: a drained lineage works other lineages' questions from the topic
   (P5).
4. The node cap prunes growth at iteration 1, and the derived budget is a constant 10 for any
   2-lineage research run (P3, S3).
5. The research completion check accepts a lineage that ran no stop machinery (fix table).
6. The node store says every node is open after a converged run (P4).
7. The research fan-out still rewrites and degrades packet metadata outside `research/` (Y4).
8. No root dashboard, and no per-lineage status in the summary (Y3).

## Commit

- Commit `adade6c293e` (amended from `b37964ab6d5` to correct backlog rows 2 and 9) on `worktrees/455-expansive-depth-integration` (subject 71 characters, no
  attribution lines). It holds 244 files: `research/` (root, both lineages, raw logs, the backlog)
  and `research_archive/20261120T011847Z/` (69 renames plus files git did not pair).
- The YAML's `step_stage_artifact_dir` command exited 1, because its exclude pathspec names the
  gitignored `.legacy-projection-watermarks` and git refuses an ignored path even in an exclude.
  Everything else staged; the step's `on_fail` is a warning.
- The repo's pre-commit gate `[gate:spec-remint]` re-derived `SPEC/graph-metadata.json` and staged it
  into the commit (`D/commit.out`). It correctly drops the archived root `research/` paths, but it
  also drops the trigger phrases `depth-mode expansive` and `frontier veto`, the same loss as the
  runner's settle-time refresh. `description.json` was not touched. I did not fight the hook.
- The hook asked for no dsh mirror sync. The tree was clean after the commit. All captured PIDs
  (39805, 39806, 39812, 44925 and 44931) had exited by themselves; none was killed, and the 180-minute
  watchdog never fired.
