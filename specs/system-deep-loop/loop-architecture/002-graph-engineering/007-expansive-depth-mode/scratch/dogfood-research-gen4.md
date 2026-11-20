# Dogfood log: /deep:research --depth-mode=expansive, fan-out opus + deepseek, generation 4

> Kept from the conductor's session scratchpad. Paths under `D/` name the conductor's scratch
> evidence, which was not kept; the packet paths (`R/`, `SPEC/`) still resolve.

Run on the integration worktree `/Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration`
at `b8003a7df42` (clean at start; `git merge-base --is-ancestor 07cf5f92b61 HEAD` exit 0). Spec folder
`specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode` (`SPEC`). `D`
is the scratch directory `scratchpad/dogfood-research3/`, `R` the packet's `research/` directory. The
model for this log is `SPEC/scratch/dogfood-research-gen3.md` (`GEN3`). The conductor followed
`.skilled/commands/deep/research.md` and `deep-research.yaml` step by step under `:auto`; deviations
are named where they happen.

The operator's requirement was that the run exercise the round 3 and round 4 fixes
(`adade6c293e..07cf5f92b61`) from this worktree's own scripts. It did: see "Setup" and the fix table.

## Setup and invocation

```
/deep:research:auto "<D/research-topic.txt>" --spec-folder=SPEC --restart --depth-mode=expansive \
  --executors='<D/fanout-config.json>' --concurrency=2
```

The matrix is gen 3's: opus = `cli-claude-code`, `claude-opus-5-5`, effort medium, configDir
`~/.claude-account2`, `sandboxMode: danger-full-access`; deepseek = `cli-opencode`,
`llmgateway/deepseek-v4.1-flash-1017` (LLM Gateway, because opencode-go had no usage left), effort max.
Budget left at its default.

### S1. Every script resolves inside the worktree

- `realpath` of `fanout-run.cjs`, `append-mode-event.cjs`, `frontier-admit.cjs`, `fanout-merge.cjs`,
  `workflow-steps.cjs`, `synthesis-closeout.cjs`, `dispatch-iteration.cjs`, `reduce-state.cjs` and
  `review-research-paths.cjs` all resolve under the worktree. The one symlinked dependency,
  `node_modules/@spec-kit/shared`, resolves to the worktree's `system-spec-kit/shared`.
- The live process tree confirmed it: the runner's re-exec child ran
  `node --import <worktree>/.skilled/skills/system-deep-loop/runtime/node_modules/tsx/dist/loader.mjs`.
- `resolveArtifactRoot` returned the worktree's `research/` and `research_archive/`.

### S2. The preview shows the fixed behaviour, from the script

`step_fanout_dry_run_preview` is enabled only under `--dry-run`, and this invocation has none. The brief
required a preview check, so the conductor ran the step's command once before the restart as a
pre-flight (`D/preview.out`, `D/preview.err`, exit 0, `git status` empty after). **Deviation:** the
preview inputs were written with `cp` and a heredoc, not the file-write tool. The real inputs in `R/`
were written with the file-write tool and `cmp` matched them byte for byte with the sources.

- **opencode `permissionMode` is `null`**, with `sandboxEnforcement: "none"` and `effortApplied: "flag"`.
  Claude shows `bypassPermissions`. Gen 3 printed `acceptEdits` for opencode.
- **No "FATAL" banner.** stderr says `WARN: lineage deepseek runs with --auto. The lineageDir write
  boundary is prompt-only, not sandbox-enforced.`
- **Cost units are labelled.** `aggregate_budget.units` explains `estimated_cost_units` (20, one attempt
  per lineage, the gated figure) against `per_lineage[].estimated_cost_units` (60, the worst case with
  retries, never gated).
- **`dry_run_halt` and `topic_digest` come from the script.** The halt names `step_fanout_spawn`,
  boundary `child-spawn`, and "spawned none and wrote nothing". The digest
  `71135d7e...0719b6f` equals the conductor's own SHA-256 of the topic with whitespace collapsed and
  trimmed. Gen 3 had to `echo` its halt line and render the prompts to see the topic.
- Oddity: before the archive, `frontier_scope` showed gen 3's partition (F-1-001/003/005 and
  F-1-002/004/006) read from the packet about to be archived. The docs say scopes are empty before the
  seed; that is true only for a fresh packet.

## Restart, seed and spawn

### S3. `--restart` archived gen 3 intact and handed the lineage on

- `bind_prior_lineage` ran `workflow-steps.cjs prior-lineage` (the YAML's call, not transcribed text)
  and returned `priorSessionId 2026-11-20T01:19:42.000Z`, `priorGeneration 3`,
  `priorTailDigest 9ea5deb4...` (`D/prior-lineage.json`). That is gen 3's late root config, as expected.
- `research/` moved to `SPEC/research_archive/20261120T125555Z/`. All 163 tracked gen 3 files exist
  there; the two older archives are untouched.
- The topic file, fan-out config and seed were written only after the archive step.

### S4. Seeds: 6 admitted, 0 pruned

- `R/frontier-seed.json` holds six sub-questions, Q1 to Q6 in order, 287 to 361 characters each.
  `frontier-admit.cjs seed` printed `admitted F-1-001..F-1-006, pruned []` (`D/seed.out`).
- **No reordering was needed.** Round-robin dealing gives opus F-1-001, F-1-003 and F-1-005, so Q5, the
  only web question, lands on opus, which has web tools. The deal confirmed it.
- `PREV`/gen 3 S5 is still open: the parent seed prints `budget after seed 16 iterations, 2 growth
  slots`, the single-executor figure, while each lineage runs 10.

### S5. Root config written at spawn, by the conductor, from the template

- `step_fanout_root_config` is a prose sub-step: the conductor writes the config from
  `step_create_config`'s template. The conductor wrote it at 12:56:45 UTC, 35 s before the runner
  started (12:57:20). It holds `generation: 4`, `parentSessionId: 2026-11-20T01:19:42.000Z` (gen 3's
  session), `lineageMode: restart` and the matrix. Its hash was unchanged when the runner exited:
  `fanout-run.cjs` neither reads nor writes it.
- **Judgment call on `maxIterations`:** the template binds `{max_iterations}`, 10, while the seed derived
  16. The fan-out skips `step_frontier_budget`, so the config says 10.
- Template oddity: `antiConvergence.stopPolicy` reads `fail-closed` beside the top-level
  `stopPolicy: convergence`.

### S6. Spawn

- Runner launched through `D/launch.sh` with `AI_SESSION_CHILD=1` and `</dev/null`.
- Process tree (`D/captured.pids`): runner 55167, re-exec TSX child 55170, claude 61009, opencode
  wrapper 61011 and its `opencode.exe` 61014.
- Both lineages spawned at 12:57:30.77Z. Per-lineage budget lines were right: `lineage opus budget 10
  iterations, derived from its seed share`.
- The 180-minute watchdog never fired. Every captured pid exited by itself; none was killed.

## Run progress

### P1. Both lineages ran clean on the first attempt (runner exit 0, `status: ok`)

- Runner 12:57:20 to 13:20:25 UTC, **23.1 min**.
- **deepseek**: 6 iterations, completed 13:13:21 (**16.0 min**), stop `converged`
  (`all_questions_answered`, graph `STOP_ALLOWED`).
- **opus**: 5 iterations, completed 13:20:25 (**23.1 min**), stop `converged`
  (`all_questions_answered`, graph `STOP_ALLOWED` on the first attempt).
- Setup, spawn to first state row: opus 1.6 min to its config row and 6.6 min to iteration 1;
  deepseek 1.7 min and 4.7 min.

### P2. Ground truth for Q1, per pass

Iteration file mtime, the ledger time of the state row, the gateway receipt, words, distinct cited
`file:line`, URLs, tool calls in the pass (log entries between the previous and this row's receipt) and
the self-reported ratio. "Row time" is the state row's `timestamp`, which here equals the frame's
`occurred_at` and `recorded_at`.

| Lineage | Pass | File mtime | Row time | Pass s | Words | file:line | URLs | Tool calls | Ratio |
|---|---|---|---|---|---|---|---|---|---|
| opus | 1 | 13:03:24 | 13:04:06.658 | 301 | 1411 | 24 | 0 | 41 | 0.89 |
| opus | 2 | 13:08:33 | 13:09:01.960 | 295 | 1400 | 20 | 0 | 33 | 0.81 |
| opus | 3 | 13:11:03 | 13:11:20.081 | 138 | 1373 | 1 | 17 | 13 | 0.71 |
| opus | 4 | 13:13:34 | 13:13:53.727 | 154 | 1450 | 9 | 0 | 12 | 0.75 |
| opus | 5 | 13:15:56 | 13:16:15.380 | 142 | 1246 | 26 | 1 | 16 | 0.79 |
| deepseek | 1 | 13:01:52 | 13:02:13.502 | 178 | 1568 | 31 | 0 | 55 | 0.79 |
| deepseek | 2 | 13:04:29 | 13:04:46.340 | 153 | 1449 | 17 | 0 | 35 | 0.70 |
| deepseek | 3 | 13:06:05 | 13:06:22.230 | 96 | 1391 | 14 | 0 | 24 | 0.75 |
| deepseek | 4 | 13:07:13 | 13:07:28.090 | 66 | 1011 | 10 | 0 | 13 | 0.60 |
| deepseek | 5 | 13:08:52 | 13:09:08.217 | 100 | 913 | 7 | 0 | 24 | 0.75 |
| deepseek | 6 | 13:10:00 | 13:10:14.411 | 66 | 952 | 10 | 0 | 15 | 0.75 |

- **Stamps.** Neither model wrote a `timestamp` into its iteration records: the twelve deepseek record
  writes in its opencode log carry none, opus's five gateway event files
  (`lineages/opus/.executor-state/event-00N.json`) carry none, and no delta carries one. The gateway minted every row time
  (`append-mode-event.cjs:298`, `:322-323`), and each frame's `receipt.committed_at` follows 0.27 to
  0.36 s later. Every iteration file's mtime precedes its row by 14 to 42 s. So this run has no
  model-written iteration stamp to check; the only model-written time was deepseek's lineage
  `createdAt`, first written in local time with a `Z` (58 min ahead) and corrected by deepseek itself.
- **Ratios moved** this time for both lineages (deepseek 0.60 to 0.79), unlike gen 3's constant 1.0.
- **Tool calls.** Deepseek's opencode JSON log: 184 steps, 233 tool calls (186 shell, 28 write,
  14 read, 5 edit), 569,440 input, 72,903 output, 33,024 reasoning and 35.9 M cache-read tokens. Opus's
  `--output-format text` log has none of this; the counts come from its Claude session transcript under
  the account's config dir: 142 tool calls (112 Bash, 20 Write, 8 WebSearch, 1 Edit, 1 ToolSearch),
  107,243 output tokens and 24.9 M cache-read tokens. Only counts were taken from the transcript.
- **Cost.** `orchestration-summary.json` reports `provider_cost_usd.by_lineage.deepseek: 0.342242`, which
  equals the conductor's own sum of `step_finish` cost over the same log. Opus and the total are `null`.
- No pass would be flagged by any rule the lineages proposed: the fastest pass (66 s) still made 13
  calls and cited 10 locations.

### P3. Frontier growth

- Each lineage proposed exactly two depth-2 children at iteration 1, both admitted, which filled its
  cap of 5. Nothing was pruned, so the `node-cap` reason never fired.
- opus: F-2-006 (per-runtime log shapes), F-2-007 (honesty thresholds). deepseek: F-2-007 (adapter
  stress-suite gating), F-2-008 (rerun identity).
- **Both lineages minted `F-2-007` for different questions.** The merge namespaces ids by lineage
  (`deepseek:F-2-007`), so the merged registry keeps both. The per-lineage stores and any tool that
  reads them side by side see the clash.

### P4. Node store and projection now agree

- Every node in both `R/lineages/*/frontier-nodes.jsonl` has an `answered` close row at the iteration
  that answered it, and both projections say 5 of 5 answered. Gen 3 P4's "every seed open" is gone.

### P5. No lineage left its partition

- Both lineages' key questions are exactly their five frontier rows (`keyQuestions` 5,
  `totalQuestions` 5); no topic-derived Q1-Q6 duplicates appeared.
- Every focus was a frontier node of the lineage's own share; deepseek's last pass recommended "None:
  this was the last open frontier node" and the lineage stopped. Gen 3 P5's drift into opus's
  questions did not recur.
- The stop formed as `all_questions_answered`, not as the new `frontier_drained` candidate: once the
  strategy holds only the share's questions, the older candidate forms first. `frontier_drained`
  appears in neither lineage's log or transcript except where a lineage read the code. The drain
  fix did not run in this stop; the frontier-only intake (`11575eaa812`) made it unnecessary.

### P6. Graph evidence: two paths, one gap, one unrecorded block

- **Opus fed the guards itself.** It wrote its own `graphEvents` in iterations 2 to 5 (40, 46, 49 and
  34 events), and its first stop attempt was allowed with no blocker. Because a leaf-declared FINDING
  skips derivation (`runtime/scripts/upsert.cjs:476-480`), opus's stop does not test the new
  derivation from finding rows.
- **Deepseek used the new path.** It wrote no `graphEvents` at all, so its guards were fed only by the
  derivation from its finding rows and answers, and they reached `STOP_ALLOWED`.
- **The derivation skips a pass with findings but no answer.** It runs only when
  `evidence.answeredQuestions.length > 0` (`upsert.cjs:481`). Iteration 1 answered nothing in both
  lineages, so opus's 9 and deepseek's 7 finding rows produced no graph nodes (opus's upsert printed
  `skipped: no graph events and no finding attached to a stored question`). The commit message for
  `aac9e434dbe` says it derives "one FINDING node per finding row"; live, that held only for passes
  that also answered a question.
- Deepseek's first attempt was blocked on `source_diversity_guard` and `uncovered_questions` because it
  had skipped the per-iteration graph upsert for iterations 4 and 5. It reran them, and the next
  attempt was allowed. No state row records the block (`blockedStopHistory` is empty); only deepseek's
  own report says so.

### P7. Lineage hygiene

- The two runtimes wrote different lineage blocks into their own configs: opus `generation 1,
  parentSessionId null`, deepseek `generation 4, parentSessionId <root session>`. The runner sets
  neither.
- Opus self-reported shell-redirect and `node -e` writes inside its lineage, and three scratch files
  under `/tmp`. Deepseek left `.event-iter-00N.json` and `.closeout-events/` in its lineage root.
- Opus ran the single-loop resource map with `--artifact-dir` and wrote `lineages/opus/resource-map.md`.
  Deepseek skipped the step, calling the map a root artifact.

## Synthesis on the fan-out root

### Y1. `step_fanout_merge` worked

- `fanout-merge.cjs --loop-type research` exit 0, 2 lineages, 268 key findings,
  `frontier_partition_guard.passed: true` (`D/merge.out`).
- The attribution now carries a cost table (deepseek 0.342242, opus unknown, total unknown). Its
  "Convergence" column still prints the last self-reported ratio (0.75, 0.79).
- The 268 overstates the evidence: opus's registry holds 238 key findings against 39 delta finding rows.

### Y2. `step_emit_resource_map` worked on the first try

- The fan-out branch command exited 0 and wrote `R/resource-map.md` (`D/resmap.out`), because the root
  config existed. Gen 3 failed here with ENOENT and needed a late hand-written config.
- Both resource maps are written with mode `0600`.

### Y3. Compile, closeout and config status

- The conductor wrote `R/research.md` from both lineage reports. Hydrated metrics: 11 iterations
  (5 + 6, summed across lineage logs as gen 3 did), 10 of 10 questions, reason `converged`.
- `step_convergence_report` ran as written: the closeout exited 0 and emitted
  `deep_research.synthesis_complete` (`totalIterations: 11`), and the gateway appended it with a receipt
  (`D/closeout.out`). No `synthesis_incomplete` fired.
- **The closeout `lineageId` is still the parent session.** The root row's scope is
  `runId 2026-11-20T12:56:45.419Z, lineageId 2026-11-20T01:19:42.000Z`, which is gen 3's session.
  `runScope` does this on purpose for research (`synthesis-closeout.cjs:291-294`), but inside deepseek's
  ledger the same rule scopes `run-initialized` and `synthesis-complete` to the root session while its
  six iteration frames use the lineage's own id.
- `step_update_config_status` set the root config to `complete`.
- The dashboard refresh and the terminal heartbeat skip on fan-out by design, so the root again has no
  dashboard.

### Y4. Deviations from the workflow (recorded)

- `step_fanout_dry_run_preview` ran without `--dry-run`, as a pre-flight the brief required (S2).
- `step_writeback_spec_findings` and its validation (they edit `SPEC/spec.md`) and `phase_save
  --full-auto` (it writes continuity into packet docs) were skipped: the run is report only.
- **No metadata restore was needed.** `SPEC/description.json` and `SPEC/graph-metadata.json` hashed the
  same before the restart and after the runner exited, and `orchestration-status.log` holds no
  `metadata_refresh` row.
- None of gen 3's hand workarounds was repeated: no echoed halt line, no late root config, no
  metadata restore, no hand-added `--artifact-dir`.

### Y5. `step_stage_artifact_dir` still fails

- The YAML's `git add` exited 1: `The following paths are ignored by one of your .gitignore files:
  .../research/.legacy-projection-watermarks` (`D/stage.out`). Everything else staged; the step's
  `on_fail` is a warning. Expected, and still broken.
- `orchestration-status.log` is ignored by `.gitignore:301` (`*.log`), so the root ledger that holds
  the spawn, progress and completion rows is never committed. Gen 3's archive has none either.

## Did the fixes behave live?

Scope (judgment call): the deep-loop fix and feature commits on the first-parent line from
`1eae8fb5aed` to `07cf5f92b61`. The range also carries a merge of main with skill-advisor, sk-doc,
doctor and cli-opencode fixes this run cannot exercise; they are left out.

| Fix | Result | Evidence |
|-----|--------|----------|
| Frontier share drain stops a lineage (`b3fea67595e`) | **Not exercised** | `all_questions_answered` formed first, because each strategy held only its share's questions; `frontier_drained` never appeared in a stop decision. No lineage drifted (P5) |
| Root config written at spawn (`019ac7911f3`) | **Worked** | Written 12:56:45, before the runner; gen 4, parent = gen 3's session; resource map and status update both worked. It is still a conductor-executed prose step (S5) |
| Per-lineage outcome and rerun command (`74cb6e919a7`) | **Worked** | `summary.lineages` in stdout and `orchestration-summary.json`: both `succeeded`, `rerun_command: null` as designed |
| Provider cost sum (`b1b27fdc7c7`) | **Worked** | deepseek 0.342242 equals the conductor's sum; opus and total `null` |
| Unreadable log as unknown cost (`958eb9ca1df`) | **Not exercised** | Both logs were readable; the summary was written |
| Graph stop guards read finding rows (`aac9e434dbe`) | **Broke** (partly) | Worked for deepseek, which wrote no `graphEvents` and reached `STOP_ALLOWED` on derived evidence. Broke for a pass with findings and no answer: iteration 1 derived 0 nodes from 9 (opus) and 7 (deepseek) finding rows, gated at `upsert.cjs:481`, against the commit's "one FINDING node per finding row". Opus's allowed stop used its own `graphEvents`, so it does not test the fix (P6) |
| `node-cap` prune reason (`c1832d283f1`) | **Not exercised** | No proposal past the cap; 0 pruned (P3) |
| Research does not rewrite metadata (`8a07b258821`, `4b0f31a0f3e`) | **Worked** | Both files' hashes unchanged; no `metadata_refresh` row |
| Node store records answered closes (`03211332919`) | **Worked** | 10 of 10 nodes have `answered` close rows (P4) |
| Frontier is the only question intake (`11575eaa812`) | **Worked** | 5 key questions per lineage, all frontier rows (P5) |
| Next Focus skips a close-only leaf focus (`965ce8901d3`) | **Not exercised** | No leaf recommended a close-only focus; every focus was a frontier node |
| `workflow-steps.cjs` called by the YAML (`d239dd6d2ae`, `a366360e192`) | **Worked** | `prior-lineage` at the restart (S3); both lineages called `run-open-research` once |
| Research per-node stuck count (`6a577bed5a9`) | **Not exercised** | No low-yield pass; `activeNodeId` is published and was null at the end |
| Known stop reason on closeout (`76c1b703657`) | **Worked** (pass branch) | Both closeouts carry `stopReason: converged`; the runner accepted them. The failure branches did not run |
| Opencode bypass banner not fatal (`77c596ef532`) | **Worked** | `WARN:` only (S2) |
| Cost units labelled (`d943e8729ec`) | **Worked** | `aggregate_budget.units` (S2) |
| Real permission flag per kind in preview (`7bd7f18aa2d`) | **Worked** | opencode `permissionMode: null` (S2) |
| Halt and topic digest from `--preview` (`f2c356b7f32`) | **Worked** | Script-emitted `dry_run_halt`; digest matches (S2) |
| Lineage resource map keeps `--artifact-dir` (`6e40b23884d`) | **Worked** (opus) | `lineages/opus/resource-map.md`; deepseek skipped the step (P7) |
| Skip finished lineages, rerun one by label (`af8fd8838c6`) | **Not exercised** | Fresh lineages under `--restart` |
| Cap-stop iteration count (`12242aa1f66`) | **Not exercised** | No `maxIterationsReached` stop |
| Finished-lineage stop-reason, topic and executor checks (`0bb07e14646`, `11f0939697a`, `a72a549366c`) | **Not exercised** | No finished lineage existed under `--restart` |
| Dry-run halt prose and refused-fan-out halt (`60abe47a997`, `2191e6d1e62`) | **Not exercised** | No dry run; the runner did not refuse |
| Claude permission on review dispatch (`1eae8fb5aed`) | **Not exercised** | Review only |
| Review contract digest covers step programs (`07cf5f92b61`) | **Not exercised** | Review only |
| Dead-lineage stderr line (`f2de4f588c5`) | **Not exercised** | No lineage failed |
| Log rotation on resume (`600d84b1677`) | **Not exercised** | No retry; one `fanout-lineage.out/.err` per lineage |
| Stage-step pathspec at `deep-research.yaml:2158` (not fixed) | **Broke**, as expected | `git add` exit 1 on the ignored exclude (Y5) |

## Lineage differences, side by side

| Aspect | opus (cli-claude-code, claude-opus-5-5, medium) | deepseek (cli-opencode, deepseek-v4.1-flash, max) |
|---|---|---|
| Wall clock | 23.1 min, 5 iterations | 16.0 min, 6 iterations |
| Per pass (receipt to receipt) | 138 to 301 s | 66 to 178 s |
| Stop | converged, first attempt allowed | converged, after one self-caused graph block |
| Ratio | 0.89, 0.81, 0.71, 0.75, 0.79 | 0.79, 0.70, 0.75, 0.60, 0.75, 0.75 |
| Growth | 2 proposed, 2 admitted | 2 proposed, 2 admitted |
| Partition discipline | stayed on its 5 nodes | stayed on its 5 nodes |
| Citations per pass | 1 to 26 file:line, 17 URLs on the web pass | 7 to 31 file:line |
| Tool calls | 142 (8 WebSearch), from the session transcript | 233, from the JSON log |
| Resource map | emitted in the lineage with `--artifact-dir` | skipped |
| Cost data | none (text output) | $0.342, 184 steps |
| Lineage block it wrote | generation 1, parent null | generation 4, parent = root session |
| Self-reported deviations | shell-redirect and `node -e` writes, three `/tmp` files | a wrong-timezone `createdAt`, two skipped upserts |

## Top frictions

1. The fan-out still leaves its live view out of git: `*.log` ignores the root status ledger, and the
   progress rows inside it carry no progress (Y5, backlog 5 and 15).
2. Cost and tool counts exist for opencode only; Claude's text log hides both (P2, backlog 3).
3. The commit step fails on every healthy run (Y5, backlog 8).
4. The closeout scopes its row to the parent session, and each lineage writes its own lineage block,
   so the lineage chain differs by runtime (Y3, P7, backlog 7 and 9).
5. The root config fix depends on the conductor executing a prose sub-step (S5, backlog 22).
6. A blocked stop leaves no state row, and a pass with findings but no answer adds no graph evidence
   (P6, backlog 13 and 14).
7. Lineage-local node ids collide across lineages (P3).

## Commit

- Committed on `worktrees/455-expansive-depth-integration` with `research/` (root, both lineages, raw
  logs, the backlog), `research_archive/20261120T125555Z/` and this log. Not pushed.
- `step_stage_artifact_dir` exited 1 on the ignored exclude, as recorded in Y5.
- The pre-commit gate `[gate:spec-remint]` re-derived `SPEC/graph-metadata.json` and staged it into
  the commit: one derived entity path moved from `research/research.md` to `spec.md`, and
  `last_save_at` changed. Unlike gen 3, no trigger phrase was dropped. `description.json` was not
  touched. The conductor accepted the hook's change. `template-phrase-lint` checked 49 Markdown files.
- The tree was clean after the commit.
