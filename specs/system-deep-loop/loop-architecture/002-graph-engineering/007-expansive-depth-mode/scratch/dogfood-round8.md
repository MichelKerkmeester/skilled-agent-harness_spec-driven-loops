# Dogfood log: live verification of rounds 8 to 10

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
| A7 one executor path | Single-executor Claude builds through the shared builder | Works (refusal row only, inferred) | Inferred from the `dispatch_failure` row: it carries `sandboxEnforcement: compensating`, a field only `buildLineageCommand`'s effective config supplies. The spawn itself was refused, see the next row |
| A7 containment | The Claude iteration runs under containment | Not exercised | `recursion-guard-ancestry`, exit 3: the conductor is a Claude process, so the guard refuses a Claude child. The guard was not worked around |
| A7 stdout log | Stdout streams to `iterations/iteration-NNN.out`, redacted | Works on dsh, pi and codex, not exercised on Claude | Each single-iteration probe wrote `iterations/iteration-001.out`. The Claude refusal happens before the spawn, so it writes no log |
| A7 cost sidecar | `iteration-NNN.cost.json` with real numbers | Not exercised | No Claude child was spawned |
| A7 audit label | The audit row records `workspace-write` and the compensating label | Works (refusal row only) | The row has `"sandboxMode":"workspace-write","sandboxEnforcement":"compensating"`. A completed Claude audit row was not produced |
| Stop signals | SIGHUP to the runner writes `stopped` rows | Works | `D/throwaway/a`, `a2`: SIGHUP to the bootstrap and to the tsx child both gave each lineage a `stopped` row with signal SIGHUP, `run_stopped` and `stopped:true`, exit 129 |
| Stop signals | Parent death writes `stopped` rows | Works | `D/throwaway/b1`: killing the watched bootstrap gave both lineages `stopped` rows within about 1 s. Killing a wrapper shell above it does nothing, because only the bootstrap is watched (`fanout-run.cjs:77`, `:667`) |
| A2 spared process | `--stop` leaves the spared process alive | Broke | See Broke 1 |
| Stopped rows | A `stopped` row means the lineage died | Broke | See Broke 2 |
| Gateway idempotency | A reused key with other content exits 2 | Works | `D/throwaway/d/summary.txt`: same key and content gives exit 0, same event id, one row. Same key, different content gives exit 2, `IDEMPOTENCY_CONFLICT` |
| r9 lane c resume | A resumed run that hit its cap keeps `maxIterationsReached` | Not exercised | The reason is a prose extract the conductor interprets (`deep-research.yaml:1971`, passed on at `:2075`). A live run would only prove the conductor's own reading, and two paid sessions did not fit the budget. Only the contract vitest ran |
| Sandbox pass-through | codex | Works | Live read-only dispatch: receipt argv `--sandbox read-only`, label `read-only` / `preventive`. The model declined the probe write and named the read-only workspace, so the OS denial itself was not observed |
| Sandbox pass-through | pi | Works | Live read-only dispatch: argv `--tools read,grep,find,ls --no-extensions --no-skills --no-prompt-templates`, label `compensating`. Preview: workspace-write reads `danger-full-access` with `sandboxWidenedFrom: workspace-write`, which matches the shared argv |
| Sandbox pass-through | DeepSeek harness | Works | Live read-only dispatch: the write tool returned `file access denied under read-only mode`, and a Bash redirect returned `Operation not permitted`. Label `preventive`. Preview: a `danger-full-access` request runs `--permission-mode workspace-write` with `sandboxNarrowedFrom` set |

Counts: 21 rows. 15 Works (2 of them on the refusal row only, and the stdout-log row on the
non-Claude kinds only), 2 Broke, 4 Not exercised.

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

### Broke 2: the runner writes `stopped` for lineages that survived

- Setup (`D/throwaway/c5`): a shim that ignores SIGTERM.
- Command: as in Broke 1, with a shim that ignores SIGTERM (`D/throwaway/c5/env.sh`).
- Output: the runner wrote `stopped` rows and `run_stopped` and exited 143 while both leaders and
  their children were still alive. `--stop` itself listed them as survivors and exited 2
  (`D/throwaway/c5/stop.out`: `{"status":"partial","stopped":[],"survivors":[slow-1, slow-2]}`).
  The leader pids in `D/throwaway/c5/pids` took `kill -9` afterwards.
- Suspected line: `writeStoppedSummary` (`fanout-run.cjs:5099-5120`) records a lineage as stopped
  without checking that it died.

## Found outside the fix table

- **An artifact dir outside the worktree spends first, then crashes.**
  `snapshotOutOfScopeDirtyPaths` returns an empty baseline when the scope does not resolve
  (`write-containment.ts:1270`), and only the post-dispatch check throws
  (`write-containment.ts:1322`, via `dispatch-iteration.cjs:405`). The first Claude attempt used a
  scratch dir outside the repo: the guard's exit 3 was replaced by exit 1 and a stack trace. A kind
  the guard allows would run its child before the crash.
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

## Runs

| Run | Command | Time | Cost |
|-----|---------|------|------|
| Fan-out research, 2 DeepSeek lineages | `frontier-admit.cjs seed --max-iterations-source default`, `fanout-run.cjs --depth-mode expansive --preview`, then the real run with matrix caps ds-a 3, ds-b 2, `fanout-merge.cjs`, `reduce-state.cjs --emit-resource-map`, `synthesis-closeout.cjs` | 14 min 17 s | $0.314642 (ds-a 0.165884, ds-b 0.148758), equal to each log's `step_finish` sum |
| Claude single-executor review | `dispatch-iteration.cjs --executor cli-claude-code --loop-type review --sandbox-mode workspace-write`, twice | under 2 s | none, refused before spawn |
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
