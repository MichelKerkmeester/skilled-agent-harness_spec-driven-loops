# Dogfood log: live verification of rounds 8 to 11

> Kept from the conductor's session scratchpad. Paths under `D/` name the scratch evidence
> directory `scratchpad/d-live/`, which was not kept. Packet paths (`SPEC/`) still resolve.

## Overview

Run on the integration worktree `455-expansive-depth-integration` at `88645b0150e`, clean at the
start and at the end. `SPEC` is `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode`.
The plan is section D of the round 8 plan. Every check ran the worktree's own scripts. Nothing in
`SPEC/research` or `SPEC/review` was read for writing, archived or restarted. Each paid run used a
throwaway pseudo spec folder under `SPEC/scratch/`, which was copied to `D/` and then deleted. The
shim runs for the stop signals and the gateway lived under `D/throwaway/` only.

## Fix-to-live table

| Fix | Check | Result | Evidence |
|-----|-------|--------|----------|
| A3 gateway identity | A caller row's identity and stamp do not reach a research row | Works | `D/fanout/a3-probe/`: a handed row with a 2020 stamp, stream id, sequence 99, correlation, causation and idempotency key came back with the gateway's own ids, `stream_sequence 5`, `causation_id null`, `occurred_at` inside the call window, and the stamp kept only as `claimedTimestamp`. The live lineages wrote no such keys at all, so the probe is the only proof |
| A4 budget table | Seed, root config and lineage caps agree | Works | Seed printed no budget line. Runner stderr: `budget table: ds-a 3, ds-b 2 iterations; root maxIterations 3, the largest lineage cap`. Root config went from 10 to 3. Lineage configs and iteration rows show 3 and 2 |
| A4 preview | `--preview` writes nothing | Works | `D/fanout/preview-before.txt` and `preview-after.txt` (find, sha256, mtime) are byte-identical, and so is `git status`. The same held for the three sandbox previews |
| A1 blocked stop | A run blocked by the same set ends with `blockedStop` | Not exercised | ds-a's graph guard said `STOP_BLOCKED` (source diversity) on every pass, but no pass was a stop candidate, so nothing was ever blocked. The decisions were `noStopCandidate`, `minIterationsNotReached`, then STOP on `maxIterationsReached` with `blockedBy []`. A grep for `blocked_stop` and `blockedStop` over both state logs found zero rows |
| r9 lane c stop reason | The synthesis reason is `maxIterationsReached` when the cap ends the run | Works | Both lineages' `synthesis_complete` rows and `research.md` say `maxIterationsReached`, which is the evidence. The root closeout row says the same (5 iterations), but the conductor passed that reason in as `--stop-reason`, so it proves nothing about the fix |
| r9 lane a, r10 lane a redaction | Lineage and iteration logs are masked | Works | No email-shaped string and no raw session id in either lineage log: 925 and 658 `"sessionID":"<redacted>"`. The dsh iteration log carries `"sessionId":"<redacted>"` |
| r9 lane b sandbox labels | The fan-out label matches what opencode runs | Works | Config `workspace-write`, enforcement `compensating`, permission `null`. The live child ran `opencode run --standalone -m ...#max --format json --auto` with `OPENCODE_CONFIG_CONTENT` denying `external_directory` (`D/fanout/lineage-env-argv.txt`) |
| A7 one executor path | Single-executor Claude builds through the shared builder | Works | Round 11: one live Claude iteration (`D/r11/claude/`). The completion receipt shows argv `claude -p ... --model claude-opus-4-8 --permission-mode acceptEdits --output-format stream-json --verbose` and an executor record with `sandboxEnforcement: compensating`, which only `buildLineageCommand`'s effective config supplies. Child exit 0 |
| A7 containment | The Claude iteration runs under containment | Works | Round 11, with `SPECKIT_ALLOW_HOST_SESSION_EXECUTOR=1`. The lane planted an untracked `containment-probe.txt` outside the artifact dir while the child ran. The state log gained a `containment_violation` row for it (`preserved_untracked`), and a quarantine copy landed under `review/containment/quarantine/1/` (`D/r11/claude/live/state-after.jsonl`). The probe appeared after the pre-dispatch snapshot, so the row shows that the post-dispatch check ran on a resolved scope. A check that never ran, or ran on an unresolved scope, would have recorded nothing. The child itself wrote nothing outside `review/` |
| A7 stdout log | Stdout streams to `iterations/iteration-NNN.out`, redacted | Works | dsh, pi and codex in round 8. Claude in round 11: `iteration-001.out` held 85 KB at 1 min 45 s into the run and 357 KB at the end, so it streamed. `D/r11/claude/live/redaction-grep.txt`: 0 emails, 198 `"session_id":"<redacted>"`, 0 token-shaped strings. The child's real session id, read from its transcript filename, occurs 0 times in the log, the receipt and the state log (`raw-session-id-counts.txt`) |
| A7 cost sidecar | `iteration-NNN.cost.json` with real numbers | Works | Round 11: `{"iteration":1,"providerCostUsd":2.1483145}`, equal to the stream's `result` row `total_cost_usd` |
| A7 audit label | The audit row records `workspace-write` and the compensating label | Works | Round 11 completion receipt (`review/dispatch-receipts/dispatch-review-i1-g1.completion.json`): `"sandboxMode":"workspace-write"`, `"sandboxEnforcement":"compensating"`, `"recursionGuardRelaxed":["ancestry","env"]`, `exitStatus 0` |
| Stop signals | SIGHUP to the runner writes `stopped` rows | Works | `D/throwaway/a`, `a2`: SIGHUP to the bootstrap and to the tsx child both gave each lineage a `stopped` row with signal SIGHUP, `run_stopped` and `stopped:true`, exit 129 |
| Stop signals | Parent death writes `stopped` rows | Works | `D/throwaway/b1`: killing the watched bootstrap gave both lineages `stopped` rows within about 1 s. Killing a wrapper shell above it does nothing, because only the bootstrap is watched (`fanout-run.cjs:77`, `:667`) |
| A2 spared process | `--stop` leaves the spared process alive | Works (FORGED identity) | Round 11, `D/r11/c2/`: a FORGED ledger start, as in Broke 1, against the live runner. `stop.out` lists the member under `spared`. `ps-after.txt` shows it alive after the stop while the three other members died. See Broke 1 |
| Stopped rows | A `stopped` row means the lineage died | Works | Round 11, `D/r11/c5-stop/` and `D/r11/c5-term/`: no `stopped` row for either surviving lineage, `run_stopped` and `orchestration-summary.json` list both under `survivors`, and `--stop` exits 2. Each label has 0 terminal rows (`terminal-counts.txt`). See Broke 2 |
| Gateway idempotency | A reused key with other content exits 2 | Works | `D/throwaway/d/summary.txt`: same key and content gives exit 0, same event id, one row. Same key, different content gives exit 2, `IDEMPOTENCY_CONFLICT` |
| r9 lane c resume | A resumed run that hit its cap keeps `maxIterationsReached` | Not exercised | The reason is a prose extract the conductor interprets (`deep-research.yaml:1971`, passed on at `:2075`). A live run would only prove the conductor's own reading, and two paid sessions did not fit the budget. Only the contract vitest ran |
| Sandbox pass-through | codex | Works | Live read-only dispatch: receipt argv `--sandbox read-only`, label `read-only` / `preventive`. The model declined the probe write and named the read-only workspace, so the OS denial itself was not observed |
| Sandbox pass-through | pi | Works | Live read-only dispatch: argv `--tools read,grep,find,ls --no-extensions --no-skills --no-prompt-templates`, label `compensating`. Preview: workspace-write reads `danger-full-access` with `sandboxWidenedFrom: workspace-write`, which matches the shared argv |
| Sandbox pass-through | DeepSeek harness | Works | Live read-only dispatch: the write tool returned `file access denied under read-only mode`, and a Bash redirect returned `Operation not permitted`. Label `preventive`. Preview: a `danger-full-access` request runs `--permission-mode workspace-write` with `sandboxNarrowedFrom` set |

Counts: 21 rows. 19 Works (the A2 spared-process row on a FORGED ledger identity), 0 Broke,
2 Not exercised.

## Broke rows

### Broke 1: `--stop` kills the process it reports as spared

- Setup (`D/throwaway/c2`): shim lineages whose leaders exit while their group members live on.
  The throwaway ledger's `process_start` for one lineage was set to the newer member's start, so
  `--stop` would spare that member.
  Command, run from the throwaway dir with a shim `opencode` first on PATH:
  `node fanout-run.cjs --spec-folder specs/test-dlive --loop-type research --fanout-config-json
  '{"executors":[{"label":"slow","kind":"cli-opencode","model":"llmgateway/deepseek-v4.1-flash-1017","count":2}],"concurrency":2,"maxRetries":0}'
  --base-artifact-dir <throwaway>/specs/test-dlive/research`, then the same arguments plus `--stop`.
- Output (`D/throwaway/c2/stop.out`): `{"status":"ok","stopped":[slow-1, slow-2],"survivors":[],
  "refused":[],"spared":[{"label":"slow-1",...}]}`. The lane saw with `ps -p` that the spared
  member was dead afterwards, but saved no file for that check. Only `ps-before.txt` and
  `tmp/members.txt` record the pid before the stop.
- Control (`D/throwaway/c3`): the same setup with the runner killed first. The spared member stayed
  alive.
- Suspected path: `--stop` sends SIGTERM to the live runner. The runner then runs
  `writeStoppedSummary` and `stopActiveLineageProcesses` (`fanout-run.cjs:984`), which calls
  `process.kill(-child.pid)` (`:1173`). The leader is still in `activeLineageProcesses`, because
  its members hold its stdout and `close` (`:3320`) never fired. `--stop` never rechecks that a
  spared pid is alive. The round 8 ledger rebutted A2 and named this edge as not built.
- Caveat: the identity was forged in a throwaway ledger to reach the spare branch. The group kill
  is real code on a live runner.
- Round 11: fixed. The runner's own stop path now signals an exited leader's members one by one
  and spares what `--stop` spares. Replay in `D/r11/c2/`, FORGED again: slow-1's spawned row start
  was moved 2 s forward to the newer member's start (`FORGED.txt`, `ledger-forged-rows.txt`).
  `--stop` exited 0 with the older `sleep 300` under `spared`. `ps-after.txt` shows that pid alive
  and the three other members gone. The spared pid took `kill -9` afterwards (`cleanup.txt`). The
  spare branch has no honest live trigger: every member descends from the setsid leader, and lstart
  counts whole seconds, so a real member never starts before the recorded start.

### Broke 2: the runner writes `stopped` for lineages that survived

- Setup (`D/throwaway/c5`): a shim that ignores SIGTERM.
- Command: as in Broke 1, with a shim that ignores SIGTERM (`D/throwaway/c5/env.sh`).
- Output: the runner wrote `stopped` rows and `run_stopped` and exited 143 while both leaders and
  their children were still alive. `--stop` itself listed them as survivors and exited 2
  (`D/throwaway/c5/stop.out`: `{"status":"partial","stopped":[],"survivors":[slow-1, slow-2]}`).
  The leader pids in `D/throwaway/c5/pids` took `kill -9` afterwards.
- Suspected line: `writeStoppedSummary` (`fanout-run.cjs:5099-5120`) records a lineage as stopped
  without checking that it died.
- Round 11: fixed. Two fresh runs with the same shim. `D/r11/c5-stop/` took `--stop`, which exited
  2 with both lineages under `survivors`. `D/r11/c5-term/` took a direct SIGTERM to the runner.
  In both, the runner waited out its grace, wrote `run_stopped` with both lineages under
  `survivors`, and wrote no `stopped` row. `orchestration-summary.json` carries the same
  `survivors`. Every lineage pid and its `sleep` child took `kill -9` afterwards (`cleanup.txt`).

## Found outside the fix table

- **Fixed in round 11: an artifact dir outside the worktree spends first, then crashes.**
  `snapshotOutOfScopeDirtyPaths` returns an empty baseline when the scope does not resolve
  (`write-containment.ts:1270`), and only the post-dispatch check throws
  (`write-containment.ts:1322`, via `dispatch-iteration.cjs:405`). The first Claude attempt used a
  scratch dir outside the repo: the guard's exit 3 was replaced by exit 1 and a stack trace. A kind
  the guard allows would run its child before the crash. Round 11: the pre-dispatch snapshot now
  throws first (`write-containment.ts:1128`). Live check in `D/r11/fix3/`: a research `cli-opencode`
  dispatch with the artifact dir outside a fresh git repo and a shim `opencode` that touches a
  marker file. Exit 1 with `artifact scope ... is outside the git worktree`, and no marker
  (`marker-check.txt`). `outside/` has no `iterations/` folder, which the stdout log creates
  before any spawn, so the dispatch never got past the snapshot. The refusal still surfaces as an uncaught stack trace.
- **Concurrent lanes trip each other's containment.** The fan-out lineages ended
  `completed_with_containment_advisory` because the sandbox lane deleted its own folder, and a dsh
  probe recorded the fan-out's root config as its own violation. Both were preserve-mode, so nothing
  was lost. This comes from running lanes in parallel in one worktree. It is not a code fault.
- ds-b's `synthesis_complete` row carries the root session id as `lineageId`. ds-a's carries its
  own lineage id. The round 8 plan rebutted the parent id as deliberate for closeout
  (`deep-research-reducer.ts:1819`), so ds-b may be the expected shape and ds-a the odd one. Not
  settled here.
- The lineage logs still hold opencode-local `msg_`, `prt_` and `call_` ids unmasked.
- The preview prints per-lineage budget lines, not the one budget-table line.

## Round 11 replay

Run on the same worktree at `3c8df597438`, clean at the start. Evidence lives under `D/r11/`.

- `c2`, FORGED: Works. See Broke 1.
- `c5`: Works under `--stop` and under a direct SIGTERM. See Broke 2.
- Claude review, one iteration: Works, with gaps named below. The repo root was a fresh throwaway
  git repo (`D/r11/claude/repo`) with one 28-line `src/paginate.js` and the `deep-review` persona
  file committed. The artifact dir was `repo/review`. The config came from the shipped template.
  The state log was opened with `workflow-steps.cjs run-open-review` piped to
  `append-mode-event.cjs`. The prompt was rendered with the real `renderPromptPack`, with the state
  summary written by hand. A dry run with the switch unset exited 3 on `recursion-guard-ancestry`
  and spawned nothing (`D/r11/claude/dry/`). With the switch set, the runner printed one stderr
  line, `relaxed the cli-claude-code recursion guard [ancestry, env]`, and spawned exactly one
  `claude` child. The log has one `init` row and one `result` row, and there is one receipt pair
  (`live/retry-check.txt`). The only other child it ran was a node process. `--model null` resolved to the
  builder default `claude-opus-4-8`.
- The child wrote `iteration-001.md` and `deltas/iter-001.jsonl`, and it found the planted bug as
  P0: a 1-based page used as a 0-based offset. It wrote no iteration record to the state log. The
  throwaway repo has no `append-mode-event.cjs`, and the child declined to write the projection by
  hand, as its contract says. This comes from the layout, not from the dispatch code.
- Open: the executor record says `model: null` while the argv runs `claude-opus-4-8`. The Claude
  log keeps per-message `uuid` and provider `request_id` values unmasked, like the opencode `msg_`
  ids above.

## Runs

| Run | Command | Time | Cost |
|-----|---------|------|------|
| Fan-out research, 2 DeepSeek lineages | `frontier-admit.cjs seed --max-iterations-source default`, `fanout-run.cjs --depth-mode expansive --preview`, then the real run with matrix caps ds-a 3, ds-b 2, `fanout-merge.cjs`, `reduce-state.cjs --emit-resource-map`, `synthesis-closeout.cjs` | 14 min 17 s | $0.314642 (ds-a 0.165884, ds-b 0.148758), equal to each log's `step_finish` sum |
| Claude single-executor review | `dispatch-iteration.cjs --executor cli-claude-code --loop-type review --sandbox-mode workspace-write`, twice | under 2 s | none, refused before spawn |
| Round 11 Claude review, 1 iteration | `SPECKIT_ALLOW_HOST_SESSION_EXECUTOR=1 dispatch-iteration.cjs --executor cli-claude-code --loop-type review --model null --sandbox-mode workspace-write --claude-config-dir ...`, after one dry run with the switch unset | 5 min 57 s (stream `duration_ms` 354938, 25 turns) | $2.1483145, from the stream's `total_cost_usd` and the sidecar |
| Round 11 shim replays | `c2` FORGED, `c5` under `--stop` and under SIGTERM, the fix 3 external-artifact check | about 3 min | none |
| Sandbox previews | `fanout-run.cjs --preview` with codex, pi and dsh in each of the three modes | seconds | none |
| Sandbox live probes | `dispatch-iteration.cjs --sandbox-mode read-only` on dsh, pi and codex | 16 to 25 s each | about 23k tokens each on dsh and pi (DeepSeek), 33k on codex |
| Throwaway signal and gateway runs | shim `opencode` on PATH, `fanout-run.cjs` with and without `--stop`, `append-mode-event.cjs` on a throwaway run dir | about 10 min | none |

Deviations:

- The real fan-out took its cap from the matrix `iterations` field, not `--max-iterations`. A
  defaulted research budget is at least 10 per lineage, which breaks the 4-iteration cap, and
  `--max-iterations` skips the root-config rewrite A4 changed. The defaulted path was checked by
  preview, which derived 10 and 10.
- The fan-out conductor wrote the root config with a node script and a short root `research.md`
  by hand. It skipped spec write-back, the config-status update and the memory save, because the
  pseudo folder was thrown away.

Every runner, re-exec child, lineage, shim and probe process the lanes started was captured and
swept with `ps -p`: none is alive. The shims that ignored SIGTERM took `kill -9`. The worktree
was clean after every lane.
