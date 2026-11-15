# Script Extraction Spec: Five Runtime Scripts for the Deep-Loop Workflows

Implementation spec for tasks T011 to T016 of phase 004. It tells a coding model how to write five CommonJS scripts under `.skilled/skills/system-deep-loop/runtime/scripts/` and how to replace each inline Node heredoc in the two auto workflows with one script call.

## 0. Conventions

### 0.1 Path shorthand

| Short | Full path (repo-relative) |
|---|---|
| `R:` | `.skilled/commands/deep/assets/deep-research-auto.yaml` |
| `V:` | `.skilled/commands/deep/assets/deep-review-auto.yaml` |
| `RT/` | `.skilled/skills/system-deep-loop/runtime/` |
| `S/` | `.skilled/skills/system-deep-loop/runtime/scripts/` |
| `L/` | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/` |
| `TU/` | `.skilled/skills/system-deep-loop/runtime/tests/unit/` |

Line numbers were read on 2026-11-14 in worktree `382-deep-loop-workflow-logic-hardening` before phases 001 to 003 land. They can drift by a few lines.

### 0.2 Shared rules for all five scripts

1. **Module form.** CommonJS with the `.cjs` extension, because `RT/package.json` declares `"type": "module"`. Start with `#!/usr/bin/env node` and `'use strict'`. Run `main()` only under `if (require.main === module)`, and export the testable helpers through `module.exports`.
2. **TypeScript loading.** The inline bodies load `.ts` modules through `node --import "$(node -p "require.resolve('tsx', ...)")" --input-type=module` (for example `R:606`). A `.cjs` script loads them with an unconditional `require('tsx/cjs')` placed before the first `.ts` require. This pattern exists at `S/fanout-salvage.cjs:14-18`. Probe run on 2026-11-14 from `RT/`: `require('tsx/cjs')` then `require` of `atomic-state.ts`, `divergent-pivot.ts`, `divergent-research-pivot.ts` and `divergent-review-pivot.ts` all returned functions (exit 0). A second probe showed `import.meta.url` and `createRequire(import.meta.url)('…/loop-lock.ts')` both work under `tsx/cjs`, which `L/write-containment.ts:398` needs.
   - Do NOT use the self-relaunch bootstrap of `S/append-mode-event.cjs:13-52`. It reads `process.env.DEEP_LOOP_TSX_LOADED` in the script itself, which no inline body does (section H rule).
   - Only `loop-heartbeat.cjs`, `dispatch-iteration.cjs` and `divergent-pivot.cjs` load tsx. `run-now-sentinel.cjs` and `iteration-graph-upsert.cjs` replace plain-node heredocs (`R:754` `node - "$EVENT_DIR"`, `R:2046` `node <<'EOF'`) and must not load tsx.
3. **Argument parser.** Every flag takes exactly one value: `--name value`. The token after a flag is always its value, even when it is empty (`""`) or starts with `-`. An unknown flag, a repeated flag or a flag with no following token is a usage error. Store values under camelCase keys (`--state-log` becomes `stateLog`). Do not borrow the parser of `S/fanout-run.cjs:107-125`, which turns a flag followed by another flag into `true`.
4. **Usage failure contract.** A missing required flag, an unknown flag, an unknown subcommand or a bad enum value prints the script's usage line (section G of each script) plus one reason line to stderr and exits **64**. Exit 64 is chosen because 0, 1, 2 and 3 already carry meaning in these bodies, and the gateway (`S/append-mode-event.cjs`) and `S/upsert.cjs` statuses pass through unchanged. No script falls back to a default path when a path flag is missing (NFR-R01).
5. **Unset sentinel.** The orchestrator renders an unset config value as the literal string `null`. Where an inline body maps `'…' === 'null' ? null : '…'`, the script applies the same mapping through one helper `nullable(value)`. Where an inline body passes the raw string, the script passes the raw string too (see 4.E, claude-code `model`).
6. **Temp directories.** Where an inline shell wrapper runs `mktemp -d "${TMPDIR:-/tmp}/<prefix>.XXXXXX"`, the script uses `fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', '<prefix>.'))`. Do not use `os.tmpdir()`, which also reads `TMP` and `TEMP` (section H rule).
7. **Child scripts by absolute path.** Spawn sibling scripts as `path.join(__dirname, '<name>.cjs')` with `process.execPath`. The inline wrappers resolved them relative to the working directory, with a fallback for the runtime directory (`R:751-752`). That fallback existed only so tests could run from `RT/` (see 8.I and Risk 2).
8. **Stdout discipline.** Where a later YAML key binds from stdout (the three pivot subcommands), the script writes exactly one JSON line to stdout and nothing else. Diagnostics go to stderr.
9. **Comments.** Keep the durable WHY comments from the inline bodies (for example `R:765-769`, `R:1858-1868`). Never put a spec path, phase number or task id in a code comment.

### 0.3 Census budget (REQ-011)

The census function `heredoc_bytes` in `$P/scratch/measure-workflows.sh:19-23` counts every line after a `<<TAG` header through the terminator, including indentation. Inline `node -e '…'` code (for example `R:453`) is not counted.

| File | Kept heredocs | Bytes |
|---|---|---|
| research single | none of the 18 auto heredocs, plus one record-seat stdin envelope (6.F) | about 364 |
| review single | `V:2096-2098` (759), `V:2120-2122` (335), `V:2136-2138` (402), plus one record-seat stdin envelope | about 1496 + 364 = 1860 |

Every other review heredoc must leave the file, including the 211-byte deepseek-harness body (`V:1277-1280`) and the 329-byte finalize body (`V:1102-1105`), or review exceeds 2000. The 364 figure was computed for the envelope in 6.F at 18 spaces of indentation. Rerun `bash $P/scratch/measure-workflows.sh --single` to get the real count.

### 0.4 Which scripts serve which command

| Script | Research source | Review source |
|---|---|---|
| `loop-heartbeat.cjs` | `R:606-644`, `R:2177-2244`, `R:2427-2501` | none. `grep -c status_ledger V:` prints 0 |
| `run-now-sentinel.cjs` | `R:750-821`, `R:1952-2002` | none. `grep -c run_now V:` prints 0 |
| `iteration-graph-upsert.cjs` | `R:2045-2125` | none. `V:2164-2182` has no heredoc, it uses a prose `transform:` plus a `bash:` line |
| `dispatch-iteration.cjs` | `R:1300-1896` | `V:1276-1994` |
| `divergent-pivot.cjs` | `R:950-1106` | `V:949-1105` |

Do not invent review logic for the three research-only scripts. They take no `--loop-type` flag.

---

## 1. Inventory check

`ls S/` on 2026-11-14 lists no script that wraps `preparePivotTransaction`, `recordPivotSeatResult` or `finalizePivotTransaction`. `.skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts` and `deep-review/scripts/divergent-review-pivot.ts` are libraries that build the prepare input and render seat prompts. They have no CLI. So the fifth script is new: **`divergent-pivot.cjs`** with subcommands **`prepare`**, **`record-seat`** and **`finalize`**. The name differs from `L/divergent-pivot.ts` by directory and extension only. A reader who wants no shared stem can use `pivot-transaction.cjs` with the same subcommands.

---

## 2. `loop-heartbeat.cjs`

### 2.A Source map

| Phase | Research heredoc | Step |
|---|---|---|
| `started` | `R:606-644` | `step_telemetry_heartbeat_started` (`R:601-647`) |
| `progress` | `R:2177-2244` | `step_telemetry_heartbeat_progress` (`R:2173-2247`) |
| `terminal` | `R:2427-2501` | `step_telemetry_heartbeat_terminal` (`R:2422-2504`) |

Review: none (0.4).

### 2.B Exact behavior

Modules: `appendJsonlIfChangedAtomic` from `L/atomic-state.ts` (inline ESM import at `R:609`, `.ts` through tsx) and the default export of `L/observability-events.cjs`, destructured to `appendObservabilityEvent` (`R:610-612`). The script uses `require('tsx/cjs')` then `require('../lib/deep-loop/atomic-state.ts')` and `require('../lib/deep-loop/observability-events.cjs')`.

Common steps for every phase:
1. Build `row` (table below).
2. `const appended = appendJsonlIfChangedAtomic(statusLedger, row, { diffData, diffField: 'state_hash' })`.
3. If `appended`, call `appendObservabilityEvent(observabilityPath, row, meta)` inside `try {} catch {}` that swallows every error (`R:633-643`). The inline path is the string `'{state_paths.packet_dir}/observability-events.jsonl'` (`R:617`). Build `observabilityPath` as `` `${packetDir}/observability-events.jsonl` `` to keep the same string.
4. Print nothing to stdout. Exit 0.

Phase-specific reads and values:

| Item | started (`R:613-632`) | progress (`R:2184-2232`) | terminal (`R:2434-2489`) |
|---|---|---|---|
| Reads config file | yes, `JSON.parse(readFileSync(config))`, a throw exits 1 | no | yes, same |
| Reads state log | no | yes, `readRecords` | yes, `readRecords` |
| `sessionId` | `String(config.lineage?.sessionId ?? <--session-id>)` | `<--session-id>` | `String(config.lineage?.sessionId ?? <--session-id>)` |
| `generation` | `Number(config.lineage?.generation ?? 1)` | `Number(<--generation>)` | `Number(config.lineage?.generation ?? <--generation>)` |
| `event` | `'started'` | `'progress'` | `terminalEvent(reason)` |
| `row` | `{ event, label:'single', at, duration_ms:0, loop_type:'research', sessionId, generation, gauges:{iterations:0, elapsed_ms:0, score:0} }` | `{ event, label:'single', at, duration_ms:elapsedMs, loop_type:'research', sessionId, generation, run, status, gauges:{iterations, elapsed_ms:elapsedMs, score} }` | `{ event, label:'single', terminal:true, reason, at, duration_ms:elapsedMs, loop_type:'research', sessionId, generation, gauges:{iterations, elapsed_ms:elapsedMs, score} }` |
| `diffData` | `{ event, label, sessionId, generation, gauges:{iterations:0, score:0} }` | `{ event, label, sessionId, generation, run, status, gauges:{iterations, score} }` | `{ event, label, reason, sessionId, generation, gauges:{iterations, score} }` |
| meta `subject` | `{ label, sessionId, generation }` | `{ label, sessionId, generation, run }` | `{ label, sessionId, generation, reason }` |
| meta `status` | `'running'` | `status` | `event` |

Keep key order as listed. Every meta object also carries `producer: 'deep-research-auto'`, `stream: 'single-loop-telemetry'` and `event: row.event` (`R:636-639`). Keep `producer: 'deep-research-auto'` verbatim even after the file rename. `rg -n "deep-research-auto" RT/lib RT/scripts --glob '!tests'` finds only workflow-path strings, and `rg "single-loop-telemetry|label: 'single'"` over `RT/lib`, `RT/scripts` and `RT/tests` finds only `TU/atomic-state.vitest.ts:411,468`, so no reader of the producer value was found. Changing it is out of scope.

Helpers, copied as written:
- `readRecords(path)` (`R:2190-2197`): missing file returns `[]`. Otherwise split on `/\r?\n/`, trim, drop empty, `JSON.parse` each line. A malformed line throws and the process exits 1.
- `elapsedSince(value)` (`R:2199-2204`): `Date.parse` of the start and of the `--timestamp` value. Either non-finite returns 0. Otherwise `Math.max(0, now - start)`.
- Progress and terminal: `iterations = records.filter(r => r.type === 'iteration')`, `latest = iterations.at(-1) ?? {}`, `startedAt` is the first record with a string `createdAt`, else the first with a string `timestamp`, else `--timestamp` (`R:2209-2211`). `score` is `Number(latest.newInfoRatio)` when finite, else 0.
- Progress only: `run` is `Number(latest.run)` when finite, else `Number(<--run>)` (`R:2214`). `status` is `latest.status` when a string, else `'unknown'` (`R:2215`).
- Terminal only: `terminalEvent(stopReason)` returns `'stopped'` for `manualStop` or `userPaused`, `'failed'` for `error`, else `'completed'` (`R:2458-2462`).

Files written: the status ledger and `<packet_dir>/observability-events.jsonl`. No child process. Exit codes: 0 on success, 1 on any uncaught throw (config parse, state log parse, ledger write), 64 on usage.

### 2.C Placeholders to arguments

| Placeholder | Flag | started | progress | terminal |
|---|---|---|---|---|
| `{state_paths.config}` | `--config` | required | not used | required |
| `{state_paths.state_log}` | `--state-log` | not used | required | required |
| `{state_paths.status_ledger}` | `--status-ledger` | required | required | required |
| `{state_paths.packet_dir}` | `--packet-dir` | required | required | required |
| `{ISO_8601_NOW}` | `--timestamp` | required | required | required |
| `{AUTO_SESSION_ID}` | `--session-id` | required (fallback) | n/a | n/a |
| `{config.lineage.sessionId}` | `--session-id` | n/a | required | required (fallback) |
| `{config.lineage.generation}` | `--generation` | not used | required | required (fallback) |
| `{current_iteration}` | `--run` | not used | required (fallback) | not used |
| `{reason}` | `--reason` | not used | not used | required |
| (none) | `--phase` | `started` | `progress` | `terminal` |

A flag passed for a phase that does not use it is a usage error, so the YAML stays honest.

### 2.D Research versus review

Research only. `loop_type: 'research'` and `producer: 'deep-research-auto'` are constants. No `--loop-type` flag.

### 2.F Replacement calls

Keep `action`, `skip_when`, `canonical_lifecycle_event` (started), `terminal_events` (terminal), `working_directory: "{repo_root}"` and `outputs` unchanged.

```yaml
      step_telemetry_heartbeat_started:
        command: |
          node .skilled/skills/system-deep-loop/runtime/scripts/loop-heartbeat.cjs --phase started --config "{state_paths.config}" --status-ledger "{state_paths.status_ledger}" --packet-dir "{state_paths.packet_dir}" --timestamp "{ISO_8601_NOW}" --session-id "{AUTO_SESSION_ID}"
```

```yaml
      step_telemetry_heartbeat_progress:
        command: |
          node .skilled/skills/system-deep-loop/runtime/scripts/loop-heartbeat.cjs --phase progress --state-log "{state_paths.state_log}" --status-ledger "{state_paths.status_ledger}" --packet-dir "{state_paths.packet_dir}" --timestamp "{ISO_8601_NOW}" --session-id "{config.lineage.sessionId}" --generation "{config.lineage.generation}" --run "{current_iteration}"
```

```yaml
      step_telemetry_heartbeat_terminal:
        command: |
          node .skilled/skills/system-deep-loop/runtime/scripts/loop-heartbeat.cjs --phase terminal --config "{state_paths.config}" --state-log "{state_paths.state_log}" --status-ledger "{state_paths.status_ledger}" --packet-dir "{state_paths.packet_dir}" --timestamp "{ISO_8601_NOW}" --session-id "{config.lineage.sessionId}" --generation "{config.lineage.generation}" --reason "{reason}"
```

### 2.G Usage line

```text
Usage: loop-heartbeat.cjs --phase started|progress|terminal --status-ledger <path> --packet-dir <dir> --timestamp <iso> --session-id <id> [--config <path>] [--state-log <path>] [--generation <n>] [--run <n>] [--reason <stopReason>]
```

Run with no argument: exit 64, the usage line names `--phase` (T011 verify).

### 2.H Environment variables

The three bodies read no `process.env` key. `rg -n process.env` over `L/observability-events.cjs` and `L/atomic-state.ts` prints nothing. The script reads none.

---

## 3. `run-now-sentinel.cjs`

### 3.A Source map

| Subcommand | Research | Step |
|---|---|---|
| `check` | wrapper `R:750-753`, heredoc `R:754-811`, drain `R:812-821` | `step_run_now_check` (`R:748-825`) |
| `restore` | wrapper `R:1952-1955`, heredoc `R:1956-1992`, drain `R:1993-2002` | `step_run_now_restore_check` (`R:1950-2004`) |

Review: none. The script replaces the whole `command:` block, wrapper and drain included, not only the heredoc.

### 3.B Exact behavior

Shared drain, one function used by both subcommands, exported as `drainStagedEvents({ eventDir, runDirectory, gatewayPath })`:
1. List `eventDir`, keep names ending in `.json`, sort lexicographically (the shell glob order of `"$EVENT_DIR"/*.json`, `R:812`).
2. For each file, `spawnSync(process.execPath, [gatewayPath, '--mode', 'research', '--run-directory', runDirectory, '--event-json', file], { stdio: 'inherit' })`. `runDirectory` is `path.dirname(stateLog)` (`R:814`). Inherit the environment (no `env` option).
3. On the first non-zero status, remove `eventDir` recursively and return that status (`R:815-819`). A `null` status (signal) returns 1.
4. After the loop, remove `eventDir` and return 0 (`R:821`).

`gatewayPath` is `path.join(__dirname, 'append-mode-event.cjs')`.

`check` (`R:755-810`):
1. `eventDir = mkdtempSync(<TMPDIR or /tmp>/deep-research-run-now.)` (`R:753`).
2. `scope = { runId: sessionId, lineageId: sessionId }` (`R:770`). `sequence = 0`.
3. `record(event, fields)` writes `<eventDir>/<NN>-<event>.json` with `NN = String(++sequence).padStart(2, "0")`, body `JSON.stringify({ stem: \`deep_research.${event}\`, scope, data: { mode: "research", run, sessionId, generation, ...fields } })` (`R:774-785`). Keep this exact shape. `S/check-ledger-stem-producers.cjs:83` credits an interpolated stem only in the form ``stem: `deep_research.${…}` `` and `:92-95` reads the event names from call sites shaped `record("name"`. Write every call as `record("run_now_requested", …)`, `record("run_now_rejected", …)` and `record("run_now_accepted", …)`.
4. If the sentinel exists: `record("run_now_requested", { sentinelPath })`. Then if the pause sentinel exists, `record("run_now_rejected", { sentinelPath, reason: "loop_paused", pauseSentinelPath })` and leave the sentinel in place. Otherwise rename the sentinel to `` `${sentinelPath}.consuming.${process.pid}.${Date.now()}` ``, unlink the claim path, then `record("run_now_accepted", { sentinelPath, dispatchEvent: "iteration_start" })`. An `ENOENT` from rename or unlink is swallowed (another consumer won) and nothing more is staged. Any other error is rethrown (`R:787-810`).
5. Drain, then exit with the drain status.

`restore` (`R:1957-1991`):
1. `eventDir = mkdtempSync(<TMPDIR or /tmp>/deep-research-run-now.)` (`R:1955`).
2. `hasAcceptedCurrentRun()`: missing state log returns false. Otherwise read, `trim()`, split on `/\r?\n/`, drop empty, walk from the last line back, `JSON.parse` each (a malformed line throws). Skip records where `record.run !== run || record.sessionId !== sessionId`. Return true at `event === "run_now_accepted"`, false at `"run_now_rejected"`, false when none match (`R:1967-1977`).
3. If the sentinel exists and `hasAcceptedCurrentRun()`, write `<eventDir>/01-run_now_restored.json` with `JSON.stringify({ stem: "deep_research.run_now_restored", scope: { runId: sessionId, lineageId: sessionId }, data: { mode: "research", run, sessionId, generation, sentinelPath } })` (`R:1982-1990`). Keep the stem as a whole literal so `S/check-ledger-stem-producers.cjs:72` sees it.
4. Drain, then exit with the drain status.

`run` and `generation` are `Number(...)` of the flag values (`R:762-763`, `R:1964-1965`). `sessionId` stays a string.

Exit codes and a deliberate decision:
- Inline, the shell block has no `set -e`, so a throw inside the heredoc (non-ENOENT rename error, malformed state log line) is lost. The block still drains whatever was staged and exits with the `rm -rf` status 0 (`R:811-821`).
- **Recommended:** catch the throw, still drain, then exit 1 when the drain returned 0. This turns a silent failure into a visible one. It is a behavior change and must be recorded in `scratch/merge-ledger.md`. If the orchestrator wants strict parity, exit with the drain status instead. NOT DECIDED here.
- Gateway non-zero status passes through unchanged. Usage error exits 64.

Stdout: the gateway's own output, inherited. Nothing else. The `outputs:` of both steps (`R:822-825`, `R:2003-2004`) describe events, not stdout fields.

### 3.C Placeholders to arguments

| Placeholder | Flag | check | restore |
|---|---|---|---|
| `{state_paths.run_now_sentinel}` | `--sentinel` | required | required |
| `{state_paths.pause_sentinel}` | `--pause-sentinel` | required | not used |
| `{state_paths.state_log}` | `--state-log` | required (run directory only, `R:814`) | required (read and run directory) |
| `{config.lineage.sessionId}` | `--session-id` | required | required |
| `{config.lineage.generation}` | `--generation` | required | required |
| `{current_iteration}` | `--run` | required | required |

A flag the subcommand does not use is a usage error. The JS fragments `${event}`, `${sentinelPath}` and `${process.pid}` inside the heredoc are template interpolations, not orchestrator placeholders.

### 3.D Research versus review

Research only. `--mode research`, stem prefix `deep_research.` and data `mode: "research"` are constants.

### 3.F Replacement calls

The step has no `working_directory` today. Add none (other commands also use repo-relative `.skilled/…` paths with no `working_directory`, for example `R:598` with `bash` and `R:1244` with `node`). Keep `action` and `outputs`.

```yaml
      step_run_now_check:
        command: |
          node .skilled/skills/system-deep-loop/runtime/scripts/run-now-sentinel.cjs check --sentinel "{state_paths.run_now_sentinel}" --pause-sentinel "{state_paths.pause_sentinel}" --state-log "{state_paths.state_log}" --session-id "{config.lineage.sessionId}" --generation "{config.lineage.generation}" --run "{current_iteration}"
```

```yaml
      step_run_now_restore_check:
        command: |
          node .skilled/skills/system-deep-loop/runtime/scripts/run-now-sentinel.cjs restore --sentinel "{state_paths.run_now_sentinel}" --state-log "{state_paths.state_log}" --session-id "{config.lineage.sessionId}" --generation "{config.lineage.generation}" --run "{current_iteration}"
```

Keep the `command: |` block form. `TU/run-now-yaml-control.vitest.ts:38` matches `\n        command: \|\n`.

### 3.G Usage line

```text
Usage: run-now-sentinel.cjs check|restore --sentinel <path> --state-log <path> --session-id <id> --generation <n> --run <n> [--pause-sentinel <path>]
```

No argument: exit 64, the line names `check` and `restore` (T012 verify).

### 3.H Environment variables

Body reads: none. Wrapper reads `TMPDIR` through `${TMPDIR:-/tmp}` (`R:753`, `R:1955`). The script reads `process.env.TMPDIR` only. The gateway child inherits the full environment, as the shell loop did.

---

## 4. `iteration-graph-upsert.cjs`

### 4.A Source map

`R:2046-2125` in `step_graph_upsert` (`R:2042-2125`). Review: none (0.4).

### 4.B Exact behavior

Copy `R:2047-2124` with these mappings:
1. `deltaPath = path.join(deltaDir, \`iter-${String(iteration).padStart(3, '0')}.jsonl\`)` (`R:2081`). Source is `deltaPath` when it exists, else the state log (`R:2082`). A missing source gives `[]`.
2. `parseJsonLines(raw, source)` skips a malformed line with stderr `deep-research graph upsert: skipped malformed line in <source>: <message>` (`R:2057-2069`).
3. `latestGraphEvents(records)` returns `graphEvents` of the last `type === 'iteration'` record, or `[]` (`R:2071-2079`).
4. Node events: `{ ...event, name: event.label ?? event.name ?? event.id }`. Edge events: `{ ...event, sourceId: event.sourceId ?? event.source, targetId: event.targetId ?? event.target, relation: String(event.relation ?? '').toUpperCase() }`. Non-objects are skipped (`R:2086-2100`).
5. No nodes and no edges: stdout `deep-research graph upsert: no graph events for iteration <n>; skipping\n`, exit 0 (`R:2102-2105`).
6. Otherwise `spawnSync(process.execPath, [path.join(__dirname, 'upsert.cjs'), '--spec-folder', specFolder, '--loop-type', 'research', '--session-id', sessionId, '--nodes', JSON.stringify(nodes), '--edges', JSON.stringify(edges)], { encoding: 'utf8' })`. Pass no `env` and no `cwd`, so the child inherits both. The inline path was the cwd-relative string `'.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs'` (`R:2110`). `TU/deep-research-graph-upsert.vitest.ts:158` sets `DEEP_LOOP_COVERAGE_DB_DIR` for the child, so env inheritance is load-bearing.
7. Spawn error: stderr `deep-research graph upsert: failed to spawn upsert.cjs: <message>`. Echo child stdout and stderr. Exit with `upsert.status`, or 1 when it is `null` (`R:2119-2124`).

`iteration` is `Number(<--iteration>)`.

### 4.C Placeholders to arguments

| Placeholder | Flag |
|---|---|
| `{state_paths.delta_dir}` | `--delta-dir` |
| `{state_paths.state_log}` | `--state-log` |
| `{current_iteration}` | `--iteration` |
| `{spec_folder}` | `--spec-folder` |
| `{config.lineage.sessionId}` | `--session-id` |

All five required. `${source}`, `${error.message}`, `${iteration}` and `${upsert.error.message}` are JS interpolations, not placeholders.

### 4.D Research versus review

Research only. `--loop-type research` to `upsert.cjs` and the `deep-research graph upsert:` message prefix are constants.

### 4.F Replacement call

Keep `action` and `note`. The step has no `working_directory` today. Add none.

```yaml
      step_graph_upsert:
        command: |
          node .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs --delta-dir "{state_paths.delta_dir}" --state-log "{state_paths.state_log}" --iteration "{current_iteration}" --spec-folder "{spec_folder}" --session-id "{config.lineage.sessionId}"
```

Use exactly these five placeholders and the `command: |` form (see 8.I).

### 4.G Usage line

```text
Usage: iteration-graph-upsert.cjs --delta-dir <dir> --state-log <path> --iteration <n> --spec-folder <path> --session-id <id>
```

### 4.H Environment variables

Body reads none. The child inherits the full environment, as `spawnSync` did inline with no `env` option.

---

## 5. `dispatch-iteration.cjs`

### 5.A Source map

| Executor | Research | Review |
|---|---|---|
| `cli-deepseek-harness` | `R:1301-1304` | `V:1277-1280` |
| `cli-claude-code` | `R:1311-1368` | `V:1287-1356` |
| `cli-cursor` | `R:1378-1470` | `V:1699-1791` |
| `cli-devin` | `R:1479-1571` | `V:1800-1892` |
| `cli-pi` | `R:1580-1673` | `V:1901-1994` |
| `cli-opencode` | `R:1692-1758` | wrapper `V:1371-1373`, heredoc `V:1374-1535`, drain `V:1536-1547` |
| `cli-codex` | `R:1771-1896` | `V:1561-1686` |
| `native` | no body, `if_native` is an orchestrator `dispatch:` (`R:1292-1298`, `V:1268-1274`) | same |

All inside `step_dispatch_iteration` (`R:1240`, `V:1211`).

### 5.B Exact behavior, common frame

Module loading, in this order: `require('tsx/cjs')`, then `const { EXECUTOR_KINDS, resolveClaudePermissionMode, resolveSandboxMode } = require('../lib/deep-loop/executor-config.ts')`, `const { runAuditedExecutorCommand, validateExecutorDispatchAllowed, formatRecursionGuardRefusal, RECURSION_GUARD_EXIT_CODE } = require('../lib/deep-loop/executor-audit.ts')`, `const { snapshotOutOfScopeDirtyPaths, enforceWriteContainment } = require('../lib/deep-loop/write-containment.ts')`, `const { buildLineageCommand, withAgentPersona, validateClaudeConfigDir } = require('./fanout-run.cjs')`. The inline bodies loaded `fanout-run.cjs` through `createRequire(import.meta.url)` (`R:1394-1395`). It exports all three (`S/fanout-run.cjs:4342-4370`). Requiring it does not run its main (`S/fanout-run.cjs:99`, `:4325`).

Main flow:
1. Read `--executor`. If missing, or not in `EXECUTOR_KINDS` (`L/executor-config.ts:11-20`), print the usage line plus `unknown executor kind '<value>'. Supported kinds: native, cli-codex, cli-claude-code, cli-opencode, cli-cursor, cli-devin, cli-pi, cli-deepseek-harness`, exit 64 (T014 verify).
2. `cli-deepseek-harness`: before any other validation, write to stderr exactly `cli-deepseek-harness runs only as a fan-out lineage; rerun with --count=2 or a second --executor group, or choose another executor kind` and exit **2** (`R:1302-1303`). No receipt, no other flag needed.
3. `native`: stderr `native dispatch runs through the orchestrator's if_native branch; dispatch-iteration.cjs has no native path`, exit 64.
4. Validate the remaining flags (5.C). Compute `dispatchId = \`${loopType}-i${iteration}-g${generation}\`` (`R:1354`, `V:1341`) and `receiptDir = \`${packetDir}/dispatch-receipts\`` (`R:1364`). Then run the kind handler.
5. Exit with the handler's status.

The prompt read is NOT part of the common frame. Each handler calls `readPrompt()` = `withAgentPersona(agent, readFileSync(promptFile, 'utf8'), repoRoot)` at the point its inline body did, where `agent` is `deep-research` or `deep-review` from `--loop-type`. `withAgentPersona` reads `.skilled/agents/<agent>.md` under `repoRoot` and throws when it is missing (`S/fanout-run.cjs:133-155`). For codex this matters: the inline body reads the prompt only after the binary check and the recursion guard (`R:1791-1826`), so a refused lineage exits 1 or 3 without touching the prompt or persona file. Reading it earlier would turn a guard refusal into exit 1. For review opencode the read comes before the prompt guard (`V:1399-1402`).

`runAuditedExecutorCommand` (`L/executor-audit.ts:1198-1290`) runs its own recursion guard and returns `RECURSION_GUARD_EXIT_CODE` (3, `:26`) on refusal after writing a `dispatch_failure` row. It writes INTENT and COMPLETION receipts. It spawns with timeout `max(1000, timeoutSeconds*1000 - 1000)` ms (`:1213-1215`) and env `buildExecutorDispatchEnv(executor, guardContext?.env ?? process.env)` (`:1220`). It echoes child stdout and stderr. It returns **0** after a spawn error, a timeout, a non-zero child status or a signal, each with a `dispatch_failure` row (`:1248-1288`). Do not "fix" those zeros.

Containment tail, shared by cursor, devin, pi and codex (`R:1430`, `R:1443-1469`, `R:1845`, `R:1869-1895`). Run `preDispatchDirtyPaths = snapshotOutOfScopeDirtyPaths({ repoRoot, artifactDir })` before `runAuditedExecutorCommand`. After it, run `containment = enforceWriteContainment({ repoRoot, artifactDir, preDispatchDirtyPaths, stateLogPath, iteration, label: dispatchId })`. Then print the two stderr advisories when `containment.violations.length > 0` and when `containment.contested.length > 0`, text copied from `R:1451-1468`, including `+ '\n' + containment.contestedNote`. Then exit with the dispatch status. Keep the literal shapes `containment.contested.length > 0`, `containment.contested.map(` and `containment.contestedNote` and the `stateLogPath:` key (see 8.I, the write-containment test).

Dead code to drop, not to wire in: `dispatchFacts` (`R:1343-1353`, `R:1731-1741`, `V:1330-1340`, `V:1508-1518`) is built and never passed. The `createHash` imports (`R:1313`, `R:1695`, `V:1289`, `V:1377`) are unused.

### 5.C Placeholders to arguments

| Placeholder (research) | Placeholder (review) | Flag | Used by |
|---|---|---|---|
| (branch key) | (branch key) | `--executor` | all. Inline cursor, devin and pi read `'{config.executor.kind}'` (`R:1397`). Pass the literal kind per branch |
| (constant) | (constant) | `--loop-type research\|review` | all but dsh |
| `{repo_root}` | `{repo_root}` | `--repo-root` | all but dsh |
| `{state_paths.prompt_dir}/iteration-{current_iteration}.md` | same | `--prompt-file` | all but dsh |
| `{state_paths.state_log}` | same | `--state-log` | all but dsh |
| `{state_paths.packet_dir}` | same | `--packet-dir` | receipts, review opencode artifact dir |
| `{artifact_dir}` | `{artifact_dir}` | `--artifact-dir` | cursor, devin, pi, codex containment |
| `{current_iteration}` | `{current_iteration}` | `--iteration` | all but dsh |
| `{config.lineage.generation}` | `{generation}` | `--generation` | dispatchId |
| `{config.lineage.sessionId}` | `{session_id}` | `--session-id` | review opencode baseline scope. Research uses it only in dead `dispatchFacts` |
| `{config.executor.model}` | same | `--model` | all but dsh |
| `{config.executor.reasoningEffort}` | same | `--reasoning-effort` | claude, pi, opencode, codex |
| `{config.executor.serviceTier}` | same | `--service-tier` | research claude, codex |
| `{config.executor.sandboxMode}` | same | `--sandbox-mode` | research claude, opencode |
| `{config.executor.timeoutSeconds}` | same | `--timeout-seconds` | all but dsh |
| (none) | `{optional_claude_config_dir}` | `--claude-config-dir` | review claude only, value may be `""` |
| `{config.executor.kind}` | same | (dropped) | only in dead `dispatchFacts` |
| `{spec_folder}` | same | (dropped) | only in dead `dispatchFacts` |

Required set for every kind except dsh and native: all flags in the table from `--loop-type` to `--timeout-seconds`. `--claude-config-dir` is required when `--executor cli-claude-code --loop-type review`, and rejected otherwise. Pass the full set on every branch so the eight `command:` texts differ only in `--executor` (and the review claude flag). `--timeout-seconds` becomes `Number(value)`. `--iteration` and `--generation` become `Number(value)` where the inline body used `Number(...)`, and stay strings inside `dispatchId`.

### 5.D Research versus review differences

| Line(s) | Difference | Kind of difference |
|---|---|---|
| `R:1331` vs `V:1311` and every persona call | `withAgentPersona('deep-research', …)` vs `'deep-review'` | argument (`--loop-type`) |
| `R:1354` vs `V:1341` and every dispatchId | `research-i…-g{config.lineage.generation}` vs `review-i…-g{generation}` | argument (`--loop-type`, `--generation`) |
| `R:1321-1328` vs `V:1299-1308` | claude `executor` object shape differs | behavior, branch on loop type |
| `R:1324-1326` vs `V:1298`, `V:1304-1305` | research claude reads `serviceTier` and `sandboxMode` from config, review sets both `null` | behavior |
| `R:1334-1335` vs `V:1314-1315` | research `--permission-mode resolveClaudePermissionMode(sandboxMode)`, review literal `'acceptEdits'` | behavior |
| `V:1295-1297`, `V:1325-1328`, `V:1351` | review claude validates `configDir`, sets `CLAUDE_CONFIG_DIR` in a copied env and passes `guardContext: { env: parentEnv }` | behavior, review only |
| `R:1716` vs `V:1494` | opencode route preamble `mode=research; target_agent=@deep-research; execution=single_iteration` vs `mode=review; target_agent=@deep-review; execution=single_review_iteration` | behavior, branch on loop type |
| `R:1722` vs `V:1404` | opencode `repoRoot` is the raw string vs `realpathSync(repoRoot)` | behavior, review only |
| `V:1400-1493`, `V:1371-1373`, `V:1536-1547` | review opencode preflight guards, recovery baseline staging and gateway drain (5.E.1) | behavior, review only |
| `R:1681-1689` | `record_executor_audit` sibling key exists in research only | YAML, keep as is |
| `R:1826`, `R:1842` vs `V:1616`, `V:1632` | codex differs only in persona and dispatchId | argument |
| cursor, devin, pi | differ only in persona and dispatchId (diffed `R:1376-1476` vs `V:1697-1797`, `R:1578-1680` vs `V:1899-2001`) | argument |
| notes text | `V:1558` adds the parallel-detached sentence, `R:1680` vs `V:2001` reword the dsh note | YAML, keep each file's notes verbatim |

The claude-code split looks like drift between commands. Preserve it in this phase, do not unify it.

### 5.E Per-executor behavior

Unset handling below uses `nullable()` from 0.2 rule 5.

| Kind | Builds argv with | Model | Sandbox | Executor object (key order) | stdin (`input`) | Containment | Extra |
|---|---|---|---|---|---|---|---|
| `cli-claude-code` research (`R:1321-1367`) | own argv | raw `--model` string, no null mapping (`R:1323`) | `nullable(--sandbox-mode)` mapped by `resolveClaudePermissionMode` | `{ kind:'cli-claude-code', model, reasoningEffort, serviceTier, sandboxMode, timeoutSeconds }` | none (omit `input`) | no | args `['-p', promptBody, '--model', model, '--permission-mode', perm, '--output-format', 'text']`, then `'--effort', reasoningEffort` when set (`R:1329-1341`). `command: 'claude'`, `cwd: repoRoot` |
| `cli-claude-code` review (`V:1294-1355`) | own argv | raw string (`V:1301`) | none, `'acceptEdits'` literal | `{ kind:'cli-claude-code', model, configDir: configDir \|\| null, reasoningEffort, serviceTier:null, sandboxMode:null, timeoutSeconds, governor:null }` | none | no | `configDir = input ? validateClaudeConfigDir(input) : ''` (`V:1296-1297`). `parentEnv = { ...process.env }`, plus `CLAUDE_CONFIG_DIR` when set. Pass `guardContext: { env: parentEnv }` |
| `cli-cursor` (`R:1394-1469`) | `buildLineageCommand` | `nullable` | constant `'workspace-write'` (`R:1403`) | `{ kind, model, configDir:null, reasoningEffort:null, serviceTier:null, sandboxMode, timeoutSeconds, governor:null }` | builder's `input` (cursor builder returns `undefined`, `S/fanout-run.cjs:2713`) | yes | `lineage = { kind, model, sandboxMode }`. Call `buildLineageCommand(lineage, promptBody, resolveSandboxMode(sandboxMode), resolveClaudePermissionMode(sandboxMode), { env: process.env, cwd: repoRoot })` (`R:1404-1416`). `cwd: repoRoot` to the runner |
| `cli-devin` (`R:1495-1570`) | `buildLineageCommand` | `nullable` | `'workspace-write'` | same as cursor | builder's (`undefined`, `:2823`) | yes | identical to cursor |
| `cli-pi` (`R:1596-1672`) | `buildLineageCommand` | `nullable` | `'workspace-write'` | as cursor but `reasoningEffort` from `nullable(--reasoning-effort)` | builder's (`''`, `:2930`) | yes | `lineage = { kind, model, sandboxMode, reasoningEffort }` (`R:1607`) |
| `cli-opencode` research (`R:1700-1757`) | `buildLineageCommand` | `nullable` | `nullable(--sandbox-mode) ?? 'danger-full-access'` (`R:1704`) | `{ kind:'cli-opencode', model, configDir:null, reasoningEffort, serviceTier:null, sandboxMode, timeoutSeconds, governor:null }` | builder's (`''`, closes stdin) | no | `message = preamble + '\n\n' + promptBody`. `lineage = { kind:'cli-opencode', model, reasoningEffort, sandboxMode }`. Call `buildLineageCommand(lineage, message, sandboxMode, resolveClaudePermissionMode(sandboxMode), { env: process.env, cwd: repoRoot, directoryRoot: repoRoot })`. Note the third argument is `sandboxMode` unmapped. Runner `cwd: cwd \|\| repoRoot` |
| `cli-opencode` review (`V:1384-1534`) | `buildLineageCommand` | as research | as research | as research | as research | no (own preflight) | see 5.E.1 |
| `cli-codex` (`R:1791-1895`) | own argv | `nullable` | constant `'workspace-write'` (`R:1810`) | `{ kind:'cli-codex', model, configDir:null, reasoningEffort, serviceTier, sandboxMode:'workspace-write', timeoutSeconds, governor:null }` | `promptBody` | yes | see below |
| `cli-deepseek-harness` | none | n/a | n/a | n/a | n/a | no | stderr line, exit 2, no receipts (`R:1302-1308`) |

`cli-codex` sequence, keep the order (`R:1791-1840`):
1. `execFileSync('/bin/sh', ['-c', 'command -v codex >/dev/null 2>&1'], { stdio: 'ignore' })` inside try. On failure, stderr `cli-codex executor unavailable: command -v codex failed`, exit 1.
2. Build the executor object.
3. `guardVerdict = validateExecutorDispatchAllowed(executor, { env: process.env })`. If not allowed, stderr `formatRecursionGuardRefusal(guardVerdict, executor)`, exit `RECURSION_GUARD_EXIT_CODE`. This runs before the snapshot, before any spawn and before any receipt, and unlike the runner's own guard it writes no `dispatch_failure` row (`R:1815-1822` vs `L/executor-audit.ts:1199-1207`).
4. Persona prompt.
5. `args = ['exec']`, then `'--model', model` only when `model` is non-null, then `'-c', 'model_reasoning_effort=' + (reasoningEffort || 'medium')`, then `'-c', 'service_tier=' + serviceTier` when set, then `'-c', 'approval_policy=never', '--sandbox', 'workspace-write', '-'` (`R:1832-1840`).
6. Snapshot, `runAuditedExecutorCommand({ command:'codex', args, cwd: repoRoot, …, input: promptBody })`, containment tail, exit.

What `buildLineageCommand` covers and what the script must carry:

| Concern | Covered by `buildLineageCommand` | Script carries |
|---|---|---|
| Binary preflight | cursor `:2640`, devin `:2774`, pi `:2887`, opencode `:2467-2472` | codex own `command -v` (step 1). Claude has none inline |
| Model allowlist and default | cursor, devin, pi allowlists (`:2562-2637`), opencode default `:2474` | nothing for claude and codex. Do NOT route them through the builder: it defaults the model (`CODEX_DEFAULT_MODEL :2602`, `CLAUDE_DEFAULT_MODEL :2603`), always passes `--model`, adds `--search` for live web search (`:2324`) and adds a claude binary check (`:2356`). Inline codex omits `--model` when null so `~/.codex/config.toml` applies (`R:1906`) |
| Write-mode flags | per kind from `resolvedSandbox` | claude permission mode, codex `--sandbox workspace-write` |
| OpenCode version argv, effort mapping, `--dir` or `cwd` | `:2487-2545` | nothing |
| Receipts | no | `runAuditedExecutorCommand` with `receiptDir` and `dispatchId` |
| Recursion guard | no | runner guard always, codex pre-guard |
| Write containment | no | cursor, devin, pi, codex tail |
| Persona | no | `withAgentPersona` |

#### 5.E.1 Review `cli-opencode`: preflight, recovery baseline and drain

The inline block is a shell wrapper around one heredoc. In order:

1. Wrapper (`V:1371-1373`): `GATEWAY` path with runtime-dir fallback, `EVENT_DIR="$(mktemp -d "${TMPDIR:-/tmp}/deep-review-baseline.XXXXXX")"`. The heredoc receives `$EVENT_DIR` as `process.argv[2]` (`V:1374`, `V:1481`).
2. Executor object and `promptBody` exactly as research opencode (`V:1384-1399`).
3. Prompt guard (`V:1400-1402`): throw `Unsafe cli-opencode dispatch: rendered prompt is missing required write-containment sections` unless `promptBody` contains both `BANNED OPERATIONS` and `ALLOWED WRITE PATHS`.
4. `repoRoot = realpathSync(--repo-root)`. `artifactDir = resolve(repoRoot, --packet-dir)`. Throw `… artifact directory must be a strict descendant of the worktree root` when `relative(repoRoot, artifactDir)` is `''`, starts with `..` or is absolute (`V:1404-1409`).
5. `git(args, cwd = repoRoot, trim = true)` runs `execFileSync('git', args, { cwd, encoding: 'utf8' })` (`V:1411-1414`). Resolve `git rev-parse --git-dir` and `--git-common-dir` through `realpathSync`. Throw `… --dir must point at an isolated linked worktree` when equal (`V:1415-1420`).
6. Parse `git worktree list --porcelain`, split on blank lines, find the block with `branch refs/heads/main` or `master`, take its `worktree ` line. Throw `… primary main/master worktree could not be resolved` when absent. Run `git status --porcelain=v1 --untracked-files=all` in the primary root and throw `… primary worktree must be clean before unrestricted execution` when non-empty (`V:1422-1433`).
7. `dirtyPaths` = NUL-split output of `git diff --name-only -z HEAD --` plus `git ls-files --others --exclude-standard -z`, untrimmed, empty dropped (`V:1435-1438`).
8. `canonicalLocation(p)`: `realpathSync(p)`, else realpath of the parent plus the leaf, and when the leaf is a dangling symlink resolve its target (`V:1439-1459`). `escapesArtifactDir(p)` is true when `p` escapes `artifactDir` lexically or `canonicalLocation(p)` escapes `canonicalLocation(artifactDir)` (`V:1460-1470`). Throw `… worktree changes outside the artifact directory: <comma list>` when any dirty path escapes (`V:1471-1474`).
9. `recoveryBaselineCommit = git(['rev-parse', '--verify', 'HEAD'])`. Write `<eventDir>/01-recovery_baseline.json` = `JSON.stringify({ stem: 'deep_review.recovery_baseline', scope: { runId: sessionId, sessionId }, data: { mode: 'review', iteration: Number(iteration), recoveryBaselineCommit, worktree: repoRoot } })` (`V:1476-1493`). Note the scope keys differ from run-now (`runId`, `sessionId`, not `lineageId`). Keep `stem: 'deep_review.recovery_baseline'` as a whole literal for `S/check-ledger-stem-producers.cjs:72`.
10. Review preamble message, `buildLineageCommand(lineage, message, sandboxMode, resolveClaudePermissionMode(sandboxMode), { env: process.env, cwd: repoRoot, directoryRoot: repoRoot })`, `runAuditedExecutorCommand` with `cwd: cwd || repoRoot` and the builder's `input` (`V:1494-1534`).
11. Drain (`V:1536-1547`), which runs whatever happened in steps 3 to 10: `NODE_STATUS` is the heredoc status (1 on any throw). For each staged `*.json` in sorted order, run the gateway with `--mode review --run-directory dirname(stateLog)`. On the first non-zero gateway status, remove the dir and exit with the gateway status. Otherwise remove the dir and exit `NODE_STATUS`.

Script mapping: create the event dir first (prefix `deep-review-baseline.`), run steps 2 to 10 inside `try`, record status 1 and print the error message to stderr on a throw, then always drain in `finally`. A throw before step 9 stages nothing. A throw after step 9 (for example `buildLineageCommand` finding no opencode binary) still appends the baseline, exactly as inline. Export `drainStagedEvents({ eventDir, mode, runDirectory, gatewayPath })` from this script for the rewritten drain test (8.I). `run-now-sentinel.cjs` carries its own copy (3.B). Two copies is below the threshold for a shared helper file.

### 5.F Replacement calls

Keep every sibling key verbatim: `working_directory: "{repo_root}"`, `timeout_seconds`, `wait_for_completion`, `render_hint` (review claude, `V:1360-1363`), every `notes:` list and `record_executor_audit` (research). The notes are load-bearing for tests (8.I).

Research branch template (shown for cursor, change only `--executor` per branch):

```yaml
        if_cli_cursor:
          command: |
            node .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs --executor cli-cursor --loop-type research --repo-root "{repo_root}" --prompt-file "{state_paths.prompt_dir}/iteration-{current_iteration}.md" --state-log "{state_paths.state_log}" --packet-dir "{state_paths.packet_dir}" --artifact-dir "{artifact_dir}" --iteration "{current_iteration}" --generation "{config.lineage.generation}" --session-id "{config.lineage.sessionId}" --model "{config.executor.model}" --reasoning-effort "{config.executor.reasoningEffort}" --service-tier "{config.executor.serviceTier}" --sandbox-mode "{config.executor.sandboxMode}" --timeout-seconds "{config.executor.timeoutSeconds}"
```

Review branch template: the same line with `--loop-type review`, `--generation "{generation}"` and `--session-id "{session_id}"`. The review `if_cli_claude_code` line ends with `--claude-config-dir "{optional_claude_config_dir}"`.

Deepseek-harness branch, both files:

```yaml
        if_cli_deepseek_harness:
          command: |
            node .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs --executor cli-deepseek-harness
```

`if_native` keeps its `dispatch:` block. The review opencode branch loses its `GATEWAY` and `EVENT_DIR` lines entirely, so no block in the file reads `$EVENT_DIR` (8.I, event-dir binding test).

### 5.G Usage line

```text
Usage: dispatch-iteration.cjs --executor native|cli-codex|cli-claude-code|cli-opencode|cli-cursor|cli-devin|cli-pi|cli-deepseek-harness --loop-type research|review --repo-root <dir> --prompt-file <path> --state-log <path> --packet-dir <dir> --artifact-dir <dir> --iteration <n> --generation <n> --session-id <id> --model <m|null> --reasoning-effort <e|null> --service-tier <t|null> --sandbox-mode <s|null> --timeout-seconds <n> [--claude-config-dir <dir>]
```

Build the kinds list from `EXECUTOR_KINDS.join('|')` so it cannot drift.

### 5.H Environment variables

No inline body reads a named `process.env` key. They pass the whole object:
- `buildLineageCommand(…, { env: process.env, … })` in cursor, devin, pi and opencode (`R:1415`, `R:1516`, `R:1618`, `R:1728`, `V:1505`, `V:1736`, `V:1837`, `V:1939`).
- `validateExecutorDispatchAllowed(executor, { env: process.env })` in codex (`R:1818`, `V:1608`).
- `{ ...process.env }` in review claude (`V:1325`).
- `runAuditedExecutorCommand` defaults to `process.env` (`L/executor-audit.ts:1220`).

Shell: `TMPDIR` in the review opencode wrapper (`V:1373`). Module load: requiring `fanout-run.cjs` reads `DEEP_LOOP_TSX_LOADED` (`S/fanout-run.cjs:64`, `S/fanout-salvage.cjs:14`), as it already did inline. The script itself may read `process.env` as a whole object for those same calls, and `process.env.TMPDIR`. It reads no other key.

---

## 6. `divergent-pivot.cjs` (fifth script)

### 6.A Source map

| Subcommand | Research | Review | Step |
|---|---|---|---|
| `prepare` | `R:951-982` | `V:950-981` | `step_prepare_divergent_pivot` |
| `record-seat` | `R:1023-1030`, `R:1056-1063`, `R:1089-1096` | `V:1022-1029`, `V:1055-1062`, `V:1088-1095` | `step_record_pivot_seat_001` to `_003` |
| `finalize` | `R:1103-1106` | `V:1102-1105` | `step_finalize_divergent_pivot` |

The three dispatch and record pairs collapse into one parameterized pair (REQ-012). That YAML restructuring belongs to T015 and T016. This script only replaces the record body.

### 6.B Exact behavior

Loads: `require('tsx/cjs')`, then `L/divergent-pivot.ts` (`preparePivotTransaction`, async, `:1179`, `recordPivotSeatResult` `:1344`, `finalizePivotTransaction` `:1387`), and for `prepare` the mode library: research `../../deep-research/scripts/divergent-research-pivot.ts` (`buildResearchPivotPreparationInput :323`, `renderResearchPivotSeatPrompt :293`), review `../../deep-review/scripts/divergent-review-pivot.ts` (`buildReviewPivotPreparationInput :329`, `renderReviewPivotSeatPrompt :296`), both resolved from `__dirname`. Wrap `main` as `main().then(code => process.exit(code), err => { stderr(err.message); process.exit(1) })` because CommonJS has no top-level `await`.

`prepare` (`R:960-981`):
1. `input = build<Mode>PivotPreparationInput({ artifactRoot, configPath, stateLogPath, strategyPath, registryPath, currentIteration: Number(…), maxIterations: Number(…), triggerReason })`.
2. `prepared = await preparePivotTransaction(input)`.
3. `seatPrompts = prepared.status === 'pending' ? Object.fromEntries(prepared.missingSeats.map(seat => [seat.id, render<Mode>PivotSeatPrompt(seat, prepared.dispatchContext)])) : {}`.
4. stdout one line: `JSON.stringify({ ...prepared, seatPrompts, boundaryRejections: input.boundaryRejections })`. Exit 0.

`record-seat` (`R:1024-1029`): read all of stdin, `JSON.parse` once into the envelope of 6.F. Then:

```js
const outcome = env.status === 'fulfilled'
  ? { status: env.status, output: env.output, startedAtIso: env.startedAtIso, completedAtIso: env.completedAtIso, durationMs: Number(env.durationMs) }
  : { status: 'rejected', error: env.error, startedAtIso: env.startedAtIso, completedAtIso: env.completedAtIso, durationMs: Number(env.durationMs) };
```

stdout one line: `JSON.stringify(recordPivotSeatResult({ paths: env.paths, pivotId: env.pivotId, seat: env.seat, outcome }))`. Exit 0. Empty or unparsable stdin exits 64 with `record-seat expects one JSON object on stdin`.

`finalize` (`R:1104-1105`): stdout one line `JSON.stringify(finalizePivotTransaction({ paths: JSON.parse(--paths-json), pivotId, resumed }))` where `resumed` is `true` for `true` and `false` for `false`, anything else a usage error. Exit 0.

Files: the three library calls read and write under `<artifactRoot>/divergent/pivots/<pivotId>/` (`L/divergent-pivot.ts:816-818`). No child process. Thrown errors exit 1.

### 6.C Placeholders to arguments

| Placeholder | Where | Carrier |
|---|---|---|
| `{state_paths.packet_dir}` | prepare | `--artifact-root` |
| `{state_paths.config}` | prepare | `--config` |
| `{state_paths.state_log}` | prepare | `--state-log` |
| `{state_paths.strategy}` | prepare | `--strategy` |
| `{state_paths.registry}` (research) / `{state_paths.findings_registry}` (review) | prepare | `--registry` |
| `{current_iteration}` | prepare | `--current-iteration` |
| `{max_iterations}` | prepare | `--max-iterations` |
| `{reason_detail}` | prepare | `--trigger-reason` |
| `{pivot_seat_00N_dispatch_status}` | record | envelope `status` |
| `{pivot_seat_00N_output_json}` | record | envelope `output` (raw JSON) |
| `{pivot_seat_00N_error_json}` | record | envelope `error` (raw JSON) |
| `{pivot_seat_00N_started_at_iso}`, `_completed_at_iso` | record | envelope strings |
| `{pivot_seat_00N_duration_ms}` | record | envelope `durationMs` string |
| `{pivot_paths_json}` | record, finalize | envelope `paths` (raw JSON), `--paths-json` |
| `{pivot_id}` | record, finalize | envelope `pivotId`, `--pivot-id` |
| `{pivot_seat_00N_json}` | record | envelope `seat` (raw JSON) |
| `{pivot_resumed}` | finalize | `--resumed` |

Inline, the record body interpolates both `{…output_json}` and `{…error_json}` as JS expressions in both ternary arms (`R:1027-1028`), so the orchestrator must already bind both to valid JSON (for example `null`). The envelope has the same requirement. The `00N` names become whatever loop variable the parameterized step introduces (for example `{pivot_seat_json}`).

### 6.D Research versus review

`prepare` only: library module and function names (`R:953-955` vs `V:952-954`), and `registryPath` placeholder (`R:965` `{state_paths.registry}` vs `V:964` `{state_paths.findings_registry}`). Both become `--loop-type` and `--registry`. `record-seat` and `finalize` bodies are byte-identical across modes (diff of `R:1000-1110` vs `V:999-1109` shows only `action:` text and `agent:` lines). They take no `--loop-type`. The seat dispatch steps differ in `agent: deep-research` vs `agent: deep-review` (`R:1006` vs `V:1005`), which stays YAML.

### 6.F Replacement calls

Keep `action`, `skip_when`, `working_directory: "{repo_root}"`, `outputs` and `short_circuit` unchanged.

```yaml
              step_prepare_divergent_pivot:
                command: |
                  node .skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs prepare --loop-type research --artifact-root "{state_paths.packet_dir}" --config "{state_paths.config}" --state-log "{state_paths.state_log}" --strategy "{state_paths.strategy}" --registry "{state_paths.registry}" --current-iteration "{current_iteration}" --max-iterations "{max_iterations}" --trigger-reason "{reason_detail}"
```

Review: `--loop-type review` and `--registry "{state_paths.findings_registry}"`.

Record, one parameterized step. The JSON blobs are raw model output, so they travel on stdin through a quoted heredoc, where the shell expands nothing:

```yaml
              step_record_pivot_seat:
                command: |
                  node .skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs record-seat <<'PIVOT_SEAT'
                  {"paths":{pivot_paths_json},"pivotId":"{pivot_id}","seat":{pivot_seat_json},"status":"{pivot_seat_dispatch_status}","output":{pivot_seat_output_json},"error":{pivot_seat_error_json},"startedAtIso":"{pivot_seat_started_at_iso}","completedAtIso":"{pivot_seat_completed_at_iso}","durationMs":"{pivot_seat_duration_ms}"}
                  PIVOT_SEAT
```

This is the one heredoc the research file keeps, about 364 census bytes (0.3).

```yaml
              step_finalize_divergent_pivot:
                command: |
                  node .skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs finalize --paths-json '{pivot_paths_json}' --pivot-id "{pivot_id}" --resumed "{pivot_resumed}"
```

Budget forces `finalize` onto argv. Its only JSON is `paths`, built by `buildPivotCouncilPaths` from canonical filesystem paths (`L/divergent-pivot.ts:807-822`), so single quotes break only when a path holds `'`. Fallback if that is unacceptable: `--artifact-root "{state_paths.packet_dir}"` and rebuild `paths` with `buildPivotCouncilPaths(artifactRoot, pivotId)`, the same call prepare makes at `L/divergent-pivot.ts:1188`. Research passes `artifactRoot` through unchanged (`divergent-research-pivot.ts:425`). Review pass-through is NOT CHECKED.

### 6.G Usage line

```text
Usage: divergent-pivot.cjs prepare|record-seat|finalize [prepare: --loop-type research|review --artifact-root <dir> --config <path> --state-log <path> --strategy <path> --registry <path> --current-iteration <n> --max-iterations <n> --trigger-reason <reason>] [record-seat: JSON envelope on stdin] [finalize: --paths-json <json> --pivot-id <id> --resumed true|false]
```

### 6.H Environment variables

The five bodies read no `process.env` key. The script reads none.

---

## 7. Other surfaces that change with the extraction

| Surface | Why | Change |
|---|---|---|
| `S/check-ledger-stem-producers.cjs:56-67` `PRODUCER_SURFACE` | `run_now_requested`, `run_now_rejected`, `run_now_accepted`, `run_now_restored` and `recovery_baseline` leave the YAML. The checker reports `SPOKEN_WITHOUT_EMITTER` (`:328-330`) | Add `S/run-now-sentinel.cjs` and `S/dispatch-iteration.cjs` |
| `RT/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:712-715` | census `producers:` names `deep-research-auto.yaml` | Name `…/run-now-sentinel.cjs` |
| `RT/lib/deep-review-ledger-schema/deep-review-ledger-types.ts:632` | same for `recovery_baseline` | Name `…/dispatch-iteration.cjs` |
| `.skilled/skills/system-deep-loop/deep-research/scripts/verify-yaml-script-paths.sh:33` | It only sees the literal form `node .skilled/…cjs` | Keep that literal form in every replacement call, so NFR-R02 really checks the five new paths |

`plan.md` Affected Surfaces lists these files only for the rename. The producer change for the new scripts is extra and must be added there.

---

## 8. Tests that pin inline text

`rg -l "deep-(research|review)-auto"` over `RT/tests` and `.skilled/skills/system-spec-kit/runtime/cli/tests` lists 31 files. Method:
1. A scratch scan matched every quoted string literal in those tests against heredoc line ranges. Regex literals were not scanned.
2. Each hit, and each file's step extraction helpers and `toContain`, `toMatch`, `toBe`, `toEqual`, `toStrictEqual` and `toHaveLength` assertions, were read by hand.
3. A second sweep listed every test that reads `commands/deep/assets` or `'commands', 'deep'`. It found readers the rg above misses because they build the file name from a template literal (8.II).

Most scan hits were noise: file-name arrays, `fanout-run.vitest.ts` builder tests whose literals (`--permission-mode`, `cli-claude-code`) also occur in the heredocs, and import strings. The table lists the files that break or constrain the extraction because of what they read. All of them also need the path repoint that `plan.md` already schedules.

### 8.I Breaking or constraining tests

| Test file | Assertion today | Effect | What it must assert after |
|---|---|---|---|
| `TU/check-ledger-stem-producers.vitest.ts:200-241` and its own `PRODUCER_SURFACE` at `:27-38` | committed tree passes with `spoken` 24 and the emitter list including the four `run_now_*` stems and `recovery_baseline` | **Breaks** unless section 7 lands | Same counts and list, with the new scripts in both surface lists. The script shapes in 3.B and 5.E.1 keep the stems detectable |
| `TU/run-now-yaml-control.vitest.ts:30-44`, `:90-98`, `:116-202` | extracts the `command: \|` block of both run-now steps, renders 7 placeholders, runs it with `/bin/sh` **from `cwd: runtimeRoot`** (`:91-95`), asserts state-log rows | **Breaks**: `node .skilled/…/run-now-sentinel.cjs` does not resolve from `RT/` | Change `cwd` at `:92` (`runCommand`, used by the three run-now cases) to the repo root. Leave `:102` (`runRenderedCommand`, used by the synthesis cases) alone. Keep the extraction and row assertions. The `{ISO_8601_NOW}` mapping becomes unused, which is harmless. The cwd change does not move the gateway's authority root: the hermetic env sets no `DEEP_LOOP_AUTHORITY_ROOT` (`RT/tests/helpers/spawn-cjs.ts:162-176`) and the root comes from `git rev-parse --show-toplevel` in the cwd (`RT/lib/authority-root/resolve-authority-root.ts:34-40`, `:63`), which is the same worktree from `RT/` and from the repo root |
| `TU/deep-review-recovery-baseline-drain.vitest.ts:36-66`, `:91-104` | finds `01-recovery_baseline.json` in the review YAML, walks up to `command: \|`, takes the shell after the `EOF` line, runs it with `EVENT_DIR` and `GATEWAY` in env | **Breaks**: marker, heredoc and drain all leave the YAML | Require `S/dispatch-iteration.cjs` and call the exported `drainStagedEvents({ eventDir, mode: 'review', runDirectory, gatewayPath })`. Keep both cases: happy path projects one `recovery_baseline` row and removes the dir, refused event returns the non-zero gateway status and removes the dir |
| `TU/stop-decision-yaml-contract.vitest.ts:72-76` | exactly one line containing `triggerReason:`, and it contains `'{reason_detail}'`, in all four files | **Breaks**: that line is inside the prepare heredoc (`R:968`, `V:967`) | Exactly one line containing `--trigger-reason "{reason_detail}"` in each single workflow |
| `TU/write-containment-yaml-call-sites.vitest.ts:30-64` | every workflow YAML holds at least one `enforceWriteContainment({`, and each call site up to `\n            EOF` contains `stateLogPath:`, `containment.contested.length > 0`, `containment.contested.map(` and `containment.contestedNote` | **Breaks**: no YAML holds the call | Read `S/dispatch-iteration.cjs`, find the call site(s) and end the slice at the function end instead of `EOF`. Keep the four pattern checks |
| `TU/executor-branch-contract.vitest.ts:42-58`, `:90-94` | each `if_cli_opencode:` block text contains `buildLineageCommand` | **Passes only through notes**: the heredoc mention leaves, but the notes at `R:1763-1767` and `V:1554-1557` still say `buildLineageCommand` | Keep the notes verbatim (5.F). Better: assert the branch calls `dispatch-iteration.cjs --executor cli-opencode` and that `dispatch-iteration.cjs` calls `buildLineageCommand` for that kind |
| `TU/deep-research-graph-upsert.vitest.ts:106-118`, `:125-149`, `:198-227` | extracts the `command: \|` block of `step_graph_upsert`, throws on any placeholder outside `state_paths.delta_dir`, `state_paths.state_log`, `current_iteration`, `spec_folder`, `config.lineage.sessionId`, runs it from the repo root, checks DB rows and stdout `skipping` | **Passes** if 4.F keeps the block form, exactly those five placeholders and the stdout text, and the child inherits env | No change beyond the path repoint |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts:58` | review YAML contains `this single-executor branch must only run from a non-OpenCode dispatch surface` | **Passes** if the opencode `notes:` stay verbatim (`V:1558`) | No change beyond the path repoint |
| `TU/workflow-event-dir-binding.vitest.ts:56-68` (not in the rg list, it globs every YAML in the assets dir) | any `command: \|` block that reads `$EVENT_DIR` must assign `EVENT_DIR=` | **Passes** if no replacement keeps `$EVENT_DIR`. A design that kept the shell drain in YAML would have to keep the assignment too | No change |

### 8.II Not affected by the extraction (path repoint only)

Each reads only non-heredoc YAML keys or its own fixtures: `deep-research-bookkeeping-emission` and `deep-review-bookkeeping-emission` (directive keys only, `rg -F "command: |"` finds nothing in either), `deep-research-convergence-floor`, `deep-research-lock-release`, `deep-research-marker-scan`, `deep-research-memory-upsert-yaml` (step order and `{lineage_context_prompt_line}` outside the heredocs, `:72-97`), `deep-research-run-open` (`step_create_state_log`, not a heredoc), `deep-review-lock-refresh`, `deep-review-marker-scan`, `deep-review-stage-skip`, `fanout-merge` (`step_convergence_report` only, `:81-88`), `fanout-root-resource-map`, `fanout-run` (review init steps only, `:559-599`), `lifecycle-taxonomy-yaml-parity` (read in full: it collects `stop_reasons_enum: [...]` arrays and `STOP_REASONS enum:` prose, both YAML keys, `:34-35`, `:50-62`), `render-command-contract` (fan-out spawn and gateway steps, `:214-259`, `:270-412`), `stop-policy-yaml-parity`, `workflow-lock-lifetime` (`if_native` and refresh-lock keys, `:135-157`), `workflow-max-duration`, `workflow-restart-lifecycle`, `workflow-session-id-parity`, and the spec-kit tests `deep-research-contract-parity`, `deep-review-contract-parity` and `deep-review-reducer-schema`.

Readers the rg in this section misses, because they build the name as `` `deep-review-${variant}.yaml` ``. Neither reads heredoc text, but both need the path repoint and are absent from the `plan.md` test inventory:
- `TU/deep-review-run-open.vitest.ts:29`, `:42`: reads `step_create_state_log`, `step_migrate_legacy_review_state`, `step_record_artifact_migration` and `step_classify_session` (`:28-31`, `:208-259`).
- `RT/tests/integration/review-depth-convergence.vitest.ts:19`: asserts `candidateCoverageGate`, `graphlessFallbackGate` and `"gateResults":{gate_results_array_json}` (`:27-29`), which sit in convergence steps (`V:851-912`), not in a heredoc.

Also swept and found not to read deep workflow content: `TU/speckit-autopilot-contract.vitest.ts` (reads `speckit-complete.yaml`, `:22`), `system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` (speckit assets, `:61-62`, `:117-121`) and `system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs` (command directories, `:53-78`).

---

## 9. Risks

1. **Argv quoting.** Inside `<<'EOF'` the shell expands nothing, so raw model output, prompts and JSON were safe as JS literals. On argv, a `"`, `$` or backtick inside a double-quoted value, or a `'` inside a single-quoted one, breaks or expands. 6.F moves every raw-output blob to a quoted stdin heredoc. The remaining argv values are paths, ids, enums, numbers and `{reason_detail}`. `--paths-json` keeps a small residual risk (6.F).
2. **Working directory.** `step_run_now_check`, `step_run_now_restore_check` and `step_graph_upsert` have no `working_directory` key. The run-now wrappers fall back to `scripts/append-mode-event.cjs` (`R:752`, `R:1954`) because `TU/run-now-yaml-control.vitest.ts:91-95` runs them from `RT/`. A literal `node .skilled/…` call fails there. The fix is the test cwd change in 8.I. A shell fallback (`S=…; [ -f "$S" ] || S=…; node "$S"`) would hide the call from `verify-yaml-script-paths.sh:33`. Inside the scripts, `__dirname` removes the cwd dependency for every child script.
3. **Producer census.** Moving the run-now and recovery-baseline stems out of the YAML fails `check-ledger-stem-producers` unless section 7 lands in the same change. The scripts must keep the exact emitter shapes (whole dotted literal, or ``stem: `deep_research.${event}` `` with `record("name"` call sites). A generalized `` `deep_${loopType}.${event}` `` defeats `S/check-ledger-stem-producers.cjs:83`.
4. **Census headroom.** Review lands near 1860 of 2000 bytes with one record envelope. Any heredoc left behind, a second envelope (for example on `finalize`) or longer placeholder names in the parameterized step can push it over REQ-011.
5. **Exit-code semantics.** The orchestrator and `verify-iteration.cjs` rely on today's codes: dispatch returns 0 after executor failure (failure lives in the state log), 1 on a throw or missing codex, 2 for deepseek-harness, 3 for the recursion guard, and the review opencode block returns the gateway status over the node status. The run-now block hides a node throw today (3.B decision).
6. **Silent behavior shifts through the builder.** Routing claude-code or codex through `buildLineageCommand` changes argv (default model, `--search`, binary check). 5.E forbids it.
7. **Shell state.** Only the review opencode block and the two run-now blocks read shell variables set earlier in the same `command:` (`GATEWAY`, `EVENT_DIR`, `NODE_STATUS`, `GATEWAY_STATUS`). The scripts absorb all of them. The three kept review `cat` heredocs still use `GATEWAY`, `EVENT_FILE` and `RECORD_STATUS` with their own assignments (`V:2093-2102`, `V:2117-2126`, `V:2133-2142`).
8. **Stdout binding.** `step_prepare_divergent_pivot` binds 13 outputs (`R:984-997`) and finalize binds `pivot_finalize_json` (`R:1108-1109`) by parsing stdout. Any extra stdout line from tsx registration or a library breaks that. Keep diagnostics on stderr.
9. **Confirm twins differ.** `deep-research-confirm.yaml:1313-1338` runs claude with a `-p "$(node --input-type=module <<'EOF' …)"` prompt and `--permission-mode acceptEdits`, with no audited runner and no receipts, and the confirm opencode bodies (`deep-research-confirm.yaml:1341-1430`, `deep-review-confirm.yaml:1428-1517`) differ from auto. This spec assumes the merge keeps the auto bodies. That choice belongs in `scratch/merge-ledger.md`.

---

## 10. NOT CHECKED

- Whether any code outside `RT/lib`, `RT/scripts` and `RT/tests` reads the heartbeat `producer: 'deep-research-auto'` value.
- Full env reads inside loaded libraries beyond `DEEP_LOOP_TSX_LOADED` (`S/fanout-run.cjs:64`, `S/fanout-salvage.cjs:14`) and the empty `process.env` grep of `L/observability-events.cjs` and `L/atomic-state.ts`. Includes `executor-audit.ts`, `write-containment.ts`, the pivot libraries and tsx itself.
- Whether the review pivot builder passes `artifactRoot` through unchanged (only research `:425` was read).
- Whether `--executor native` should instead exit 0 as a no-op. This spec chose 64.
- Runtime behavior of any script: none exists yet. Every behavior statement is from reading the inline bodies and the cited library lines.
- Census bytes for the merged files. 0.3 is arithmetic, not a census run.
