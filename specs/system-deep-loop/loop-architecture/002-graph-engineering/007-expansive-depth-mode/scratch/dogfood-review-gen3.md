# Dogfood log: live verification of rounds 5 and 6, /deep:review fan-out, generation 3

> Kept from the conductor's session scratchpad. Paths under `D/` name the conductor's scratch
> evidence, which is not kept; the packet paths (`R/`, `SPEC/`) still resolve.

Run on the integration worktree `/Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration`
at `555487146e2` (clean at start, `git status --porcelain` empty). Spec folder
`specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode` (`SPEC`).
`D` is the scratch directory `scratchpad/live-verify/`, `R` the packet's `review/` directory. The
models for this log are `SPEC/scratch/dogfood-research-gen3.md` and `dogfood-review-gen2.md` (`GEN2`).
The conductor followed `.skilled/commands/deep/research.md`, `review.md` and their YAMLs step by step
under `:auto`; deviations are named where they happen. Nothing in `17a9ddbcb68..555487146e2` had run
live before this log.

## Setup

### S1. Every script resolves inside the worktree

- `realpath` of `fanout-run.cjs`, `append-mode-event.cjs`, `frontier-admit.cjs`, `fanout-merge.cjs`,
  `convergence.cjs`, `workflow-steps.cjs` and `review-research-paths.cjs` all resolve under the
  worktree. `runtime/node_modules/@spec-kit/shared` resolves to the worktree's `system-spec-kit/shared`.
- `resolveArtifactRoot` returned the worktree's `research/`, `research_archive/`, `review/` and
  `review-archive/` (`D/partA/*-artifact-root.json`).
- The coverage-graph database is `runtime/database/deep-loop-graph.sqlite` in the worktree
  (`coverage-graph-db.ts:151`, `DEEP_LOOP_COVERAGE_DB_DIR` unset). It is gitignored
  (`.gitignore:149`), so `git status` cannot see a write to it; the checksum list covers it.

## Part A: dry runs write nothing

### A1. Baseline

- `git status --porcelain`: empty (`D/partA/status-before.txt`, 0 bytes).
- SHA-256 of every file under `SPEC/research/`, `SPEC/review/` and `runtime/database/`: 805 files
  (`D/partA/sums-before.txt`). The packet's `description.json`, `graph-metadata.json` and `spec.md`
  hashed separately (`D/partA/meta-before.txt`).
- A marker file touched in `D/partA/` before the first step, to catch new files anywhere in the
  worktree with `find -newer`, ignored files included.

### A2. Research dry run

Invocation: `/deep:research:auto "How far can an operator trust what a fan-out deep-loop lineage
reports about its own passes?" --spec-folder=SPEC --executors='<matrix>' --concurrency=2 --dry-run`.
No `--restart` and the default depth, because only a halt at `step_fanout_spawn` can print the
script's halt line: `--restart` halts at `step_apply_lifecycle_request` and `--depth-mode=expansive`
at `step_frontier_seed`, and both of those print the workflow's composed `default_halt_event`.

Steps as executed:

1. `context_loading`: the pattern file written with the file-write tool into a `mktemp -d` dir, the
   ripgrep recipe exited 1 (clean no-hit), the dir removed.
2. `step_resolve_artifact_root`: the resolver command, read-only.
3. `step_bind_reducer_artifact_arg`: `""`. `step_bind_convergence_write_arg`: `dry_run == true`, so
   `convergence_write_arg = --read-only`.
4. `step_fanout_dry_run_preview`: inputs written with the file-write tool into a second `mktemp -d`
   dir, `fanout-run.cjs ... --preview` exit 0 (`D/partA/research-preview.out`, `.err`), dir removed.
5. `step_apply_lifecycle_request`, the two refusal steps and `step_frontier_seed` skipped by their
   `skip_when` / `enabled_when`.
6. `step_fanout_spawn` (boundary `child-spawn`): halt, printing the preview's `dry_run_halt` verbatim:

```
{"type":"event","event":"dry_run_halt","mode":"research","boundary":"child-spawn","step":"step_fanout_spawn","timestamp":"2026-11-20T19:01:54.039Z","detail":"fanout-run --preview previewed 2 lineage(s) (opus, deepseek), spawned none and wrote nothing"}
```

- `topic_digest` `b25bbf4a...cf6d3a8` equals the conductor's SHA-256 of the topic, whitespace
  collapsed and trimmed.
- opus: `claude -p <prompt:digest> --model claude-opus-5-5 --permission-mode bypassPermissions
  --output-format stream-json --verbose --effort medium`, config dir `~/.claude-account2`,
  `sandboxEnforcement: none`.
- deepseek: `opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json
  --auto <prompt:digest>`, `sandboxMode: workspace-write`, `permissionMode: null`,
  `sandboxEnforcement: compensating`. stderr: `WARN: lineage deepseek runs with --auto and
  external_directory denied: file tools outside the working directory are refused, but Bash is not
  confined and can still write anywhere, so the lineageDir write boundary is prompt-only for Bash.`
- Both lineages show `iterations: null` and fresh `fanout-<label>-<ms>-<rand>` session ids. The opencode
  entry still shows `stdin: "<input>"` beside the prompt digest in argv (gen 3 S2, unchanged).

### A3. Review dry run

Invocation: `/deep:review:auto "17a9ddbcb68..555487146e2 -- .skilled/skills/system-deep-loop
.skilled/commands/deep" --spec-folder=SPEC --executors='<matrix>' --concurrency=2 --dry-run`,
target type `files`, again without `--restart` and at the default depth for the same reason.

The same six steps ran (`D/partA/review-preview.out`, `.err`, exit 0). The halt line, from the script:

```
{"type":"event","event":"dry_run_halt","mode":"review","boundary":"child-spawn","step":"step_fanout_spawn","timestamp":"2026-11-20T19:02:40.556Z","detail":"fanout-run --preview previewed 2 lineage(s) (opus, deepseek), spawned none and wrote nothing"}
```

- `topic_digest: null`, as documented for review.
- The lineage commands and effective configs match A2: opus `bypassPermissions`, `stream-json
  --verbose`; deepseek `workspace-write`, `permissionMode: null`, `sandboxEnforcement: compensating`,
  and the same `WARN:` line.

### A4. Result: zero writes, both loops

- `git status --porcelain` after both runs: empty (`D/partA/status-after.txt`).
- The 805-file checksum list is identical (`diff` exit 0), and the three packet docs check `OK`.
- `find <worktree> -newer marker -not -path './.git/*'`: 0 entries, ignored files included.
- **The `--read-only` convergence call was not exercised.** `step_bind_convergence_write_arg` has no
  boundary, so it ran and bound `--read-only`. But no documented dry run reaches
  `step_graph_convergence`: a fan-out run halts at `step_fanout_spawn`, before `phase_init`, and a
  single-executor run halts at `step_create_directories` (`review.md` Dry-Run Flag; `deep-review.yaml:491`).
  The binding is correct and unreachable. The conductor did not hand-run `convergence.cjs`.

## Part B: one live fan-out review

Invocation, as the operator would type it:

```
/deep:review :auto "17a9ddbcb68..555487146e2 -- .skilled/skills/system-deep-loop .skilled/commands/deep" \
  --spec-folder=SPEC --restart --depth-mode=expansive --max-iterations=8 --executors='<matrix>' --concurrency=2
```

Bound setup: target type `files` (gen 2's range-plus-pathspec form), dimensions bound with the pre-bound
marker `review_dimensions: correctness,security,traceability,maintainability,cross-cli-parity`,
`max_iterations 8` with `max_iterations_source flag`, threshold 0.10, convergence mode `default`, stop
policy `convergence`, lineage mode `restart`, focus empty.

### B1. Restart: `prior-lineage` returned nothing to chain to

- `workflow-steps.cjs prior-lineage review/deep-review-config.json review/deep-review-state.jsonl`
  printed `priorSessionId: null`, `priorGeneration: 0` (`D/partB/prior-lineage.json`). Gen 2's root
  never had a config (`GEN2` F5), and the command reads only the config. The root state log's only
  session id was `"review"`, the folder name.
- So the root config got `generation: 1`, `parentSessionId: null`, `lineageMode: restart`. The chain
  to gen 2 is lost on this one hop because of the legacy input; the next restart has a config to read.
- `review/` moved to `SPEC/review-archive/20261120T190404Z/`: all 199 tracked files exist there, and
  the two older archives are untouched. The inputs below were written only after the move.

### B2. Seeds: 6 admitted, 0 pruned; the parent budget line ignores the flag

- `R/frontier-seed.json` holds the six brief areas, questions 150 to 249 characters (whole objects
  371 to 546 with scope and evidence). Pilot SHA `555487146e2`. No merge was marked
  `merge-no-own-diff`: the six seeds are areas, not commit batches.
- `frontier-admit.cjs seed ... --max-iterations-source flag` exit 0: `admitted F-1-001..F-1-006`,
  then `budget after seed 7 iterations, 0 growth slots; warning: ... node cap of 3 at a budget of 7`.
- **New defect.** The seed reads `maxIterations` from the root config, which on fan-out does not exist
  yet: `step_frontier_seed` (`deep-review.yaml:366-389`) runs before `step_fanout_root_config`
  (`:423`), and the seed command carries no iteration value, so `seedBudget` falls back to the loop
  default 7 (`frontier-admit.cjs:503`). The flag value 8 is invisible to it.
- Deal: opus F-1-001, F-1-003, F-1-005; deepseek F-1-002, F-1-004, F-1-006.

### B3. `--max-iterations=8` never reached the lineages

- stderr: `lineage opus budget 24 iterations, derived from its seed share`, the same for deepseek.
  Both lineage configs say `maxIterations: 24`, and opus ran all 24.
- **New defect.** `step_fanout_spawn_cli` passes no iteration bound (`deep-review.yaml:452-464`),
  `FANOUT_FLAGS` has none (`fanout-run.cjs:31-38`), and `expansiveLineageBudgets` sizes every lineage
  without a matrix `iterations` value (`fanout-run.cjs:389-401`). The presentation says "any other
  source is kept as given" (`deep-review-presentation.txt:83`); live, a flag source is dropped. The
  root config's `maxIterations: 8` is the only place the value survives. The conductor did not add
  `iterations` to the operator's matrix.

### B4. `cross-cli-parity` was dropped, as documented

- The fan-out binds the canonical four in every lineage: `deep-review.yaml:54`, the root config's
  `reviewDimensions` (`:443`) and the prompt's `review_dimensions: all` (`fanout-run.cjs:2245`). Both
  lineage configs list the four. Documented, so not a defect, but the operator gets no warning.

### B5. Root config and spawn

- The root config was written with the file-write tool from the template at 19:05:10 UTC, before
  the runner started (19:05:36). Its lineage block is B1's.
- Launched through `D/partB/launch.sh` with `AI_SESSION_CHILD=1` and `</dev/null`. Captured pids
  (`D/partB/captured.pids`): runner 16370, re-exec TSX child 16389, claude 23092, opencode wrapper
  23094 and its `opencode.exe serve` 23097, plus the conductor's watchdog subshell 16371.
- The live argv matched the dry-run preview: claude `--model claude-opus-5-5 --permission-mode
  bypassPermissions --output-format stream-json --verbose --effort medium`; opencode `run --standalone
  -m llmgateway/deepseek-v4.1-flash-1017#max --format json --auto`. `lineages/deepseek/invocation-metadata.json`
  records `sandboxMode: workspace-write`, `permissionMode: null`, `sandboxEnforcement: compensating`.
- Every captured pid exited by itself (runner at 19:45:06). None was killed; the 180-minute watchdog
  never fired. The conductor ended its own watchdog subshell after the runner exited.

### B6. `--status` and the progress rows

Three calls of `fanout-run.cjs --base-artifact-dir R --status` (`D/partB/status-{1,2,3}.txt`), each
read-only and instant:

```
19:07:12  opus      running  0   unknown                   0/3/3  0   2026-11-20T19:06:40.846Z
          deepseek  running  0   unknown                   0/3/3  0   2026-11-20T19:06:44.383Z
19:19:39  opus      running  4   2026-11-20T19:18:37.430Z  0/4/4  0   2026-11-20T19:18:40.874Z
          deepseek  running  2   2026-11-20T19:18:30.582Z  0/4/4  1   2026-11-20T19:18:46.025Z
19:29     opus      running  14  2026-11-20T19:28:36.160Z  0/4/4  0
          deepseek  running  16  2026-11-20T19:28:42.713Z  0/4/4  15
```

- The `progress` rows (63 of the ledger's 69 rows) now carry `iterations`, `lastCommitAt`, `nodes` and
  `flaggedPasses`, every 60 s per lineage. Gen 4's "progress rows carry no progress" is fixed.
- The flagged-pass count rose live, which is the first signal an operator gets that a lineage is
  stamping. It is the most useful column.
- `nodes answered` stays 0 for the whole run in both lineages. Review writes no `answered` close to the
  node store: the only review closes are `active` and the stuck `exhausted` (`deep-review.yaml:1516`,
  `:1622`). The column is meaningless for review.

### B7. `--stop` on a throwaway fan-out

- Scratch spec folder `D/stoptest/throwaway-spec/`, run from `cwd = D/stoptest` with a relative
  `--spec-folder`, because an absolute spec folder must sit inside the repo (`cli-guards.cjs:107`).
  Two cheap `cli-opencode` deepseek lineages (a one-lineage matrix is refused), research loop type.
  `--preview` first (exit 0, nothing written), then live.
- Both `spawned` rows landed at 19:06:46.7; `--stop` (the launch argv plus `--stop`) at 19:06:51 printed
  `{"status":"ok","stopped":[{"label":"cheap-a","pid":30232},{"label":"cheap-b","pid":30234}],"survivors":[]}`,
  exit 0. The runner exited 143 one second later.
- All six captured pids were gone: runner, re-exec child, both opencode wrappers and both
  `opencode.exe` grandchildren (`D/stoptest/pids.txt`).
- The ledger holds a runner row `{"event":"stopped","signal":"SIGTERM"}` with no label, then one
  `stopped` row per lineage with `rerun_command ... --only-lineage cheap-a` (and `cheap-b`).
- Frictions: the runner printed no stdout JSON on stop (`run.out` empty); `orchestration-summary.json`
  still listed both lineages as `"status": "running"` (`fanout-run.cjs:4405-4435`), which live-confirms
  OPUS-F003-P1-001 below; the `rerun_command` repeats the relative paths, so it works only from the
  launch directory. The scratch folder was deleted afterwards.
- SIGHUP and parent death: **not exercised**. Signalling a captured pid before the watchdog would break
  the hygiene rule.

## Run progress

### P1. Outcome: opus succeeded at the cap, deepseek rejected after converging

- Runner 19:05:36 to 19:45:06 UTC, **39.5 min**, exit 2, `status: partial`, 1 succeeded, 1 failed.
- **opus**: 24 iterations, 19:05:37 to 19:45:06 (**39.5 min**), stop `maxIterationsReached`.
- **deepseek**: 16 iterations, 19:05:37 to 19:30:20 (**24.7 min**). Its own log ends `terminal_gates`
  (all three gates pass, `converged`) and `synthesis_complete`, verdict PASS. The runner then rejected it:
  `lineage deepseek exited 0 but is not complete: iteration 3 (line 4, 2026-11-20T19:19:57.592Z) is
  stamped after the lineage process ended at 2026-11-20T19:30:20.065Z`, `failure_class: exit`,
  `retry_verdict: fatal`, `reason: stamped_after_completion`. The stderr line printed live.
- Cost, from `orchestration-summary.json`: **opus $20.507748**, deepseek $0.455302, total $20.96305.

### P2. The gateway clock and `claimedTimestamp`, live

- Deepseek wrote whole-minute stamps that march 10 minutes per pass: iteration 1 claimed 19:14:00 and
  committed 19:16:19.9; iteration 16 claimed **21:44:00** and committed 19:28:42.4. Every row's
  `timestamp` is the gateway's commit time and the model's value sits in `claimedTimestamp`
  (`R/lineages/deepseek/deep-review-state.jsonl`). Gen 2 P6's future-stamped rows no longer reach the
  row time.
- Opus's claims trail the gateway by 0.2 to 0.9 s on every row: honest.
- The completion check now judges the claim (`lineage-timestamp-window.ts:313`), which is what
  rejected deepseek. Correct by the commit's intent. **New defect:** the failure text names the row's
  gateway `timestamp`, 19:19:57.592, not the claim 19:34:00 that failed, because `describeRecord`
  prints `record.timestamp` (`lineage-timestamp-window.ts:266`). The message reads as a contradiction.

### P3. Pass evidence and unexamined flags (`D/partB/pass-evidence.tsv`)

The shipped `passEvidence` over each lineage's log and ledger frames, read-only:

| Lineage | Passes | Flagged | Reason | Tool calls per pass | Source reads per pass | Commit gap |
|---|---|---|---|---|---|---|
| opus | 24 | 0 | none | 21 at pass 1, 3 to 9 from pass 7 | 2 to 19 | 30 to 262 s |
| deepseek | 16 | 15 | `future_stamp` on passes 2 to 16 | 56 at pass 1, 6 to 24 after | 1 to 42 | 31 to 558 s |

- The flags are right for deepseek: skew grows from +329 s to +8,117 s.
- Opus's late passes (13 to 24) made 3 to 5 calls and 2 reads in 30 to 43 s with ratio 0 and are not
  flagged, because each read something. The rules catch fabrication, not shallowness.
- **How the merge weighs them: it does not.** `fanout-merge.cjs` reads neither pass evidence nor the
  runner's lineage status, so it merged deepseek's 9 P2 findings at full weight from a lineage the
  runner rejected and whose passes are 15/16 flagged (`merged_lineages: 2`). A gap, not a regression.

### P4. Claude stream-json: cost and tool calls are known now

- Opus's `logs/fanout-lineage.out` is 1,114 stream-json events. The last `result` event:
  `total_cost_usd 20.5077478`, `num_turns 196`, `duration_ms 2356271`, `subtype success`; 195 tool
  calls (167 Bash, 25 Write, 2 Edit, 1 Read); 169,820 output tokens (37,164 thinking), 53.4 M cache-read.
- The summary's 20.507748 equals that result event. Gen 3 and gen 4 had opus cost `unknown`. The figure
  includes two advisor-tool calls the lineage made (the config dir enables the advisor; the `result`
  usage lists an `advisor_message` iteration).
- Deepseek: 230 `step_finish` events summing to $0.455302, equal to the summary; 251 tool calls (168
  shell, 52 write, 21 read, 10 edit).

### P5. The runner-written lineage block

- Both lineage configs: `generation 1`, `parentSessionId 2026-11-20T19:05:10.000Z` (the root session),
  `lineageMode new`, session `fanout-<label>-1795201537192-sq1ivw`. Gen 4 P7 saw opus write
  `generation 1, parent null` and deepseek `generation 4`; the two runtimes now agree.

### P6. The review gateway mints identity

- Every frame sampled (iteration and `blocked_stop_recorded`, both lineages) carries producer
  `deep-loop-cli 1.0.0`, a minted `event-<uuid>` and an idempotency key `deep-review:input:<hash>`;
  the stored `record` keeps no event id, key, producer or epoch field.
- The reused-key-with-different-content refusal (exit 2) did **not** happen live: no "already names a
  ... event with other content" text appears in either log.

### P7. Blocked stops recorded by the script, and the stop loop they could not break

- Opus ran `convergence.cjs ... --record-blocked-stop` 14 times. Four `blocked_stop` rows exist
  (runs 17, 19, 21, 22), each committed through the gateway by the script (frames 20, 27, 33, 37).
- Each says `blockedBy: [dimensionCoverageGate]`, `missing: []`. The gate also needs
  `traceabilityCovered === true` (`convergence.cjs:968-973`), and opus's core `spec_code` protocol
  had failed (no packet requirement covers the range's code). **New defect:** the record names no
  reason, so `missing: []` reads as "nothing missing, still blocked".
- With traceability unpassable, opus ran stuck recovery five times and passes 17 to 24 at ratio 0
  until the 24 cap, about 10 minutes and a share of the $20.51 for no new finding. Its terminal gates:
  `scope` fail (`findings-out-of-scope`) and `coverage` fail (`traceability-incomplete`).
- The skipped-gate `unknown` (`91bcd050ee1`) did not show: on schema version 2 every gate was evaluated.

### P8. Frontier growth

- opus: F-2-006 (rotated lineage logs mixing timed and untimed output), admitted at iteration 1, all
  four dimensions. deepseek: F-2-007 (sandbox enforcement label matrix), admitted, four dimensions.
  Nothing pruned.

## Synthesis on the fan-out root

### Y1. Merge and verdict

- `fanout-merge.cjs --loop-type review` exit 0: 2 lineages, `merged_verdict: FAIL`, P0 0, P1 2, P2 19,
  search debt 0, `failed_required_gate_ids: [coverage, scope]`, partition guard passed.
- `review-verdict.cjs` with those bound values: `FAIL` (`D/partB/verdict.out`).
- Self-check (fan-out root, recorded in the report only): both P1s confirmed.
- Reading the FAIL: both failed gates share one cause. `spec_code` failed because no requirement in
  the packet governs this code (OPUS-F001-P2-004), and that finding cites a spec doc outside the
  code-only pathspec, which fails `scope`. FAIL here does not mean a P0 in the code.

### Y2. The refinement alarm stayed quiet

- Deepseek's registry logs 6 `Refinement of an earlier finding` transitions; 2 delta ids
  (`R3-P2-002`, `R15-P2-001`) fold into earlier ones. Both lineages and the root closed with
  `synthesis_complete`, not `synthesis_incomplete`. Gen 2 P7's false alarm is gone.

### Y3. Report, closeout, config, stage

- The conductor wrote `R/review-report.md` from the merged and lineage registries.
- `step_hydrate_summary_metrics` gave `iteration_count 40` (24 + 16) and `reason converged`: the root has
  no state log before closeout, so the rule falls to its frozen default although the only successful
  lineage stopped at `maxIterationsReached`. Friction: the root closeout row says `stopReason:
  converged`.
- `step_convergence_report`: closeout exit 0, one `synthesis_complete` row through the gateway, scoped
  to the root session `2026-11-20T19:05:10.000Z` (gen 2's root row said `runId: "review"`).
- `step_update_config_status`: root config `complete`.
- `step_stage_artifact_dir`: `git add R` **exit 0**, no warning (`D/partB/stage.out`).
- `orchestration-status.log` is staged and committed (69 rows); gen 4 found it ignored.
- Deepseek left `lineages/deepseek/.deep-review.lock` behind (ignored, so not committed).

### Y4. Deviations

- Skipped `phase_save` (`step_generate_context --full-auto`), because it writes continuity into packet
  docs outside `review/`. No spec writeback runs in review. The run is report only.
- `SPEC/description.json`, `graph-metadata.json` and `spec.md` hashed the same before the restart and
  after closeout: nothing outside `review/` was rewritten, so nothing was restored.
- The throwaway's spec folder is relative to `D/stoptest` rather than an absolute path under `D`,
  because the runner refuses an absolute spec folder outside the repo.
- The committed opus log holds the repository's git author line (a GitHub noreply address) ten times,
  from `git show` output the lineage ran. It is the same identity every commit object already
  carries. Flagged, not edited: whether to keep it is the operator's call (defect 11).
- Waiting: the conductor waited with foreground polling loops (a 15 s `perl select` until the exit
  file appeared) beside a Monitor on the ledger, and the stop-test script polled the ledger every 0.5 s
  for the `spawned` rows. The brief asked for no sleep polling.
- The conductor ended its own watchdog subshell 16371 and its `sleep` child 16372 after the runner
  exited, before 180 minutes. 16372 was found with `pgrep` at that moment, not captured at launch.
  No lineage or runner pid was signalled.
- The throwaway ran two lineages, not one: a one-lineage matrix is refused.
- Three of the six seed objects are 528 to 546 characters in full; every question field is under 500.
- The commit was amended to add the Commit section and the checks below it.

## Did the fixes behave live?

Rows: every non-merge commit in `17a9ddbcb68..555487146e2 -- .skilled/skills/system-deep-loop
.skilled/commands/deep`, plus `83800c3bfa2`, which the brief names.

| Fix | Result | Evidence |
|-----|--------|----------|
| Gateway clock for review rows, `claimedTimestamp` (`dfdd486fbe1`) | **Worked** | Deepseek claimed up to 21:44:00; rows carry gateway times to 19:28:42 (P2) |
| Timestamp window judged by the claim (`0e49309a701`) | **Worked**, message wrong | Rejected deepseek on a claimed future stamp; the text prints the gateway time (`lineage-timestamp-window.ts:266`) |
| Research iteration gateway clock (`0139027a3fc`), research pass by claimed stamp (`500ed459c99`) | **Not exercised** | Review only |
| Pass evidence, unexamined flags, progress rows, `--status`, stream-json (`87223d32b92`) | **Worked** | 15/16 deepseek passes flagged `future_stamp`, 0/24 opus; three `--status` calls; opus $20.507748 (P3, P4, B6) |
| Merge weighing of pass evidence | **Broke** (gap; no commit or doc claims it) | `fanout-merge.cjs` reads neither; the rejected lineage's 9 P2s merged at full weight (P3). No fan-out catalog or reference doc says the merge uses `unexamined` or flagged passes |
| Runner-written lineage block (merged in `bd5015b6603`) | **Worked** | Both lineages gen 1, parent = root session (P5); written by `writeLineageValues` after each attempt (`fanout-run.cjs:4924`), so the rejected lineage got it too |
| opencode `workspace-write` default, `compensating` (`040a5371fb3`) | **Worked** | Preview and invocation metadata (A2, B5). opencode takes no sandbox flag, so the argv cannot show it; the compensating side ran: a `containment/baseline` in each lineage and `completed_with_containment_advisory: 0` |
| Sandbox for every kind (`2b32f0d73c8`), capability record (`b8c96116192`), pi conformance test (`2e295fea62a`) | **Worked** for claude and opencode; **Not exercised** for codex, pi, dsh and harness | No such lineage in the matrix |
| `--stop`, SIGHUP, parent death (`a29a15210e7`) | `--stop` **Worked**; SIGHUP and parent death **Not exercised** | B7 |
| Review identity minting (`8170db46079`) | **Worked** | Minted ids, keys and producer on every sampled frame (P6) |
| Reused key with different content refused, exit 2 (`8170db46079`) | **Not exercised** | No collision happened live |
| Research identity minting (`1e2add8bab3`) | **Not exercised** | Review only |
| Blocked stop recorded by the script (`55e8a7c217f`) | **Worked** | 4 rows from `convergence.cjs --record-blocked-stop` (P7); the record omits the traceability reason |
| Skipped gate as unknown (`91bcd050ee1`) | **Not exercised** | No gate was skipped |
| Dry-run blocked-stop withheld (`47ba2a08a85`), `--read-only` binding (`555487146e2`) | Binding **Worked**; the call **Not exercised** | `convergence_write_arg = --read-only` bound; no dry run reaches the call (A4) |
| Folded refinement counted once (`c05fc2c0168`) | **Worked** | 6 refinements, `synthesis_complete` everywhere (Y2) |
| Source diversity `insufficient` on an empty graph (`40d7c32c20f`, `c7453b88d5f`) | **Not exercised** | Research only |
| Finding evidence from a pass that answered nothing (`b3ce85a3204`) | **Not exercised** | Research graph upsert |
| Research blocked stop and stage without ignored excludes (`0364ead58fb`) | **Not exercised** | Research only. The review stage step exited 0 (Y3) |
| `orchestration-status.log` committed (`83800c3bfa2`) | **Worked** | Staged and committed (Y3) |
| Root config at spawn, generation and parent | **Broke** (legacy input) | gen 1, parent null: gen 2's root had no config for `prior-lineage` to read (B1) |
| OpenCode 1 refusal dropped (`af2dd50a102`, `09a760a4763`) | **Worked** | opencode 2 lineages ran with no version refusal |
| Docs (`b961eb5e2d3`, `425fa04e7d3`, `3bfd7c36fe0`, `09ffdaa27d0`, `e2a32d7dea2`) | **Not exercised** live | Reviewed: R4-P2-001, R2-P2-001, OPUS-F005-P2-002 and R8-P2-001 name drift |
| Part A: zero writes, research and review | **Worked** | Empty status, identical checksums, nothing newer than the marker (A4) |

## Lineages side by side

| Aspect | opus (cli-claude-code, claude-opus-5-5, medium) | deepseek (cli-opencode, deepseek-v4.1-flash, max) |
|---|---|---|
| Wall clock | 39.5 min, 24 iterations | 24.7 min, 16 iterations |
| Per pass (commit gap) | 30 to 262 s | 31 to 558 s |
| Stop | `maxIterationsReached`, after 5 stuck recoveries and 4 blocked stops | own `converged`; runner rejected it (`stamped_after_completion`) |
| Terminal gates | scope fail, coverage fail | all pass |
| Stamps | honest, 0.2 to 0.9 s behind the gateway | fabricated, +10 min per pass, up to +2 h 15 min |
| Flagged passes | 0 of 24 | 15 of 16 |
| Findings | P1 2, P2 10 | P1 0, P2 9 (6 refinements) |
| Growth | F-2-006 | F-2-007 |
| Tool calls | 195 (167 Bash) | 251 (168 shell) |
| Cost | $20.51 | $0.46 |

## Top frictions

1. `--max-iterations` does nothing on a fan-out review: lineages run 24 (B3).
2. A lineage whose core traceability protocol fails cannot stop legally and burns to the cap, with a
   blocked-stop record that says `missing: []` (P7).
3. The merge ignores the runner's verdict on a lineage and its pass evidence (P3).
4. A stop leaves the summary saying `running`, and the runner prints no result (B7).
5. The stamp failure message names the wrong time (P2).
6. `--status` node counts never move for review (B6).
7. The fan-out root's hydrated stop reason defaults to `converged` (Y3).
8. The parent seed budget line ignores the flag value (B2).

## New defects

| # | Defect | Location |
|---|--------|----------|
| 1 | `--max-iterations` is not passed to a fan-out lineage; the presentation says a flag source is kept | `deep-review.yaml:452-464`, `fanout-run.cjs:31-38`, `:389-401`, `deep-review-presentation.txt:83` |
| 2 | The fan-out seed runs before the root config exists, so its budget line uses the default 7 | `deep-review.yaml:366-389` vs `:423`, `frontier-admit.cjs:503` |
| 3 | `stamped_after_completion` text prints the gateway time, not the failing claim | `lineage-timestamp-window.ts:266`, `:313` |
| 4 | Blocked-stop `dimensionCoverageGate` record omits the traceability cause | `convergence.cjs:968-973` |
| 5 | Stop summary keeps lineages `running`; runner-side `stopped` row has no label | `fanout-run.cjs:4405-4435` |
| 6 | The merge reads no pass evidence and no lineage status | `fanout-merge.cjs` |
| 7 | Review writes no `answered` node close, so `--status` shows 0 answered | `deep-review.yaml:1516`, `:1622` |
| 8 | Hydrated root stop reason falls to `converged` on fan-out | `deep-review.yaml` `step_hydrate_summary_metrics.reason` |
| 9 | `rerun_command` keeps relative paths from the stopped run's cwd | `fanout-run.cjs:1040-1049`, `:1450` |
| 10 | The review stage step names `{state_paths.artifact_dir}`, which `state_paths` does not define (research uses `packet_dir`); the conductor ran it as `git add review/` | `deep-review.yaml:2410` vs `:187-213`, `deep-research.yaml:2170` |
| 11 | A succeeded lineage's raw log is committed unredacted: redaction runs only for a failed lineage | `fanout-run.cjs:1083-1090`, `:4458` |

## Commit

- One commit on `worktrees/455-expansive-depth-integration` holds `review/` (root, both lineages, raw
  logs, the committed ledger), `review-archive/20261120T190404Z/` and this log: 481 files, nothing
  else. Not pushed.
- The pre-commit hook ran `template-phrase-lint` (86 staged Markdown files) and re-derived no metadata:
  `SPEC/graph-metadata.json` and `description.json` are not in the commit.
- The tree was clean after the commit.
