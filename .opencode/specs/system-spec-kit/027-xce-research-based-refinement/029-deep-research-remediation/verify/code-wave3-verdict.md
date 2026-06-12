# Code Wave 3 Verdict — tri-145, tri-186

Fresh Fable 5 verifier, 2026-06-12. Both fixes verified UNCOMMITTED against the original proofs in `verify/l2-still-real-batch.md` (lines 33, 40, 81, 91). All shell probes used per-run `mktemp -d` sandbox socket dirs (`SPECKIT_IPC_SOCKET_DIR`) and explicit `--timeout-ms`; no live daemon was contacted.

## Verdicts

- tri-145: CLOSED
- tri-186: CLOSED

## tri-145 — bare CLI apply mutation-intent guard

Original proof: `validateCommand` (code-index-cli.ts:583-605) enforced shared schema only; schema has `required: []`; bare `code-index.cjs code_graph_apply` defaulted to rescan → soft-stale incremental index mutation with no explicit operation.

Evidence:

- (a) **Diff confirmed.** `git diff .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` shows one hunk inside `validateCommand`: throws `CliUsageError` when `tool.name === 'code_graph_apply' && args.operation === undefined && args.dryRun !== true && process.env.MK_CODE_INDEX_CLI_ALLOW_DEFAULT_APPLY !== '1'`, with guidance naming all three escape hatches (`--operation=<op>`, `--dry-run=true`, `MK_CODE_INDEX_CLI_ALLOW_DEFAULT_APPLY=1`).
- (b) **Guard precedes IPC.** `runCodeIndexCli` calls `validateCommand(parsed)` (code-index-cli.ts:1146) before `callTool(...)` (:1151), which is the only IPC path (`ensureDaemonReady` → `JsonRpcSocketClient.connect`, :1104-1106). The guard throws inside `validateCommand`, so refusal happens before any socket touch. `exitCodeForError` maps `CliUsageError` → `EXIT_USAGE` = 64 (:34, :861).
- (c) **Doctor flows unaffected.** `doctor_code-graph.yaml` is diagnostic-only at the CLI layer: its sole shim invocation is `code_graph_status --warm-only` (:29); apply mode is explicitly gated behind separate confirm workflows (`phase_a_invariant`, `pass_policy.diagnostic_only_default: true`, NEVER `apply_recommendations_in_phase_a`). `doctor_update.yaml` contains zero `code_graph_apply` references. The `code_graph_apply` entries in doctor `allowed-tools` are the MCP transport (`mcp__mk_code_index__code_graph_apply`), not the CLI shim, so the CLI-layer guard cannot reach them. Repo-wide `rg` found NO production caller of a bare CLI-shim apply (only spec/research artifacts describing the finding).
- (d) **Dist carries the guard.** `dist/code-index-cli.js:503` contains the identical guard block including the guidance string `mutates via default rescan routing`.
- (e) **Sandbox runtime proof** (fresh `SPECKIT_IPC_SOCKET_DIR=$(mktemp -d)/sock` per run, `--timeout-ms 3000`):
  - Bare `code_graph_apply --format json` → **exit 64**, JSON error envelope carrying the full guidance string; sandbox socket dir stayed empty (0 entries) — no daemon spawned, nothing mutated.
  - `MK_CODE_INDEX_CLI_ALLOW_DEFAULT_APPLY=1` + `--warm-only` → passes the guard, fails at the warm-only probe: **exit 75**, `backend unavailable: connect ENOENT .../sock/daemon-ipc.sock`. Bypass works without mutation.
  - Hatch coverage: `--dry-run=true --warm-only` → exit 75 (passes guard); `--operation=rescan --warm-only` → exit 75 (passes guard). All three escape hatches reach dispatch; only the bare form is refused.

## tri-186 — exit-taxonomy smoke sibling

Original proof: `cli-offline-smoke.cjs:51-90` covers only `list-tools` count/freshness/daemonFree; no exit-75/64 or envelope taxonomy coverage; recommendation was a sibling script rather than bloating the fast offline smoke.

Evidence:

- (a) **Live run passes.** `node .opencode/bin/cli-exit-taxonomy-smoke.cjs --timeout-ms 30000` → 8/8 PASS, exit 0. Case set matches spec exactly: warm-only 75 × 3 shims (spec-memory `memory_stats`, code-index `code_graph_status`, skill-advisor `advisor_recommend`), unknown-command 64 × 3 shims, skill-advisor untrusted `skill_graph_scan` 64, code-index bare-apply guard 64 (regression-locks tri-145).
- (b) **Failure-detection paths are real** (script read in full, `.opencode/bin/cli-exit-taxonomy-smoke.cjs`):
  - Wrong exit → `exitOk = result.status === testCase.expectExit` (:87) → `ok` false (:94).
  - Stack-trace/garbage output on the 75 cases → `parseJson` returns null on unparseable AND on empty/whitespace input (:59-66), tried on stdout then stderr (:86, stderr-aware since failure envelopes route to stderr); the three 75 cases set `expectJsonStatus: 'error'`, so `payload?.status` undefined → `envelopeOk` false (:88-89).
  - Cold-spawned daemon → `daemonFree = !fs.existsSync(socketDir/daemon-ipc.sock)` (:90) ANDed into `ok`. Socket filename matches the real daemon socket observed in the tri-145 probe (`.../sock/daemon-ipc.sock`).
  - Aggregate: any case failure → `process.exit(1)` (:109, :120).
- (c) **Cannot touch live daemons.** Per-case `fs.mkdtempSync` sandbox (:69), `SPECKIT_IPC_SOCKET_DIR` pointed into it plus `SPECKIT_DAEMON_REELECTION: '0'` (:74-78), `finally` rmSync cleanup (:101-103). All three shim dists honor the env override (`rg -l SPECKIT_IPC_SOCKET_DIR`: spec-memory-cli.js, code-index-cli.js, skill-advisor-cli.js). Behavioral cross-check: the warm-only cases exited 75, which a live warm daemon would have answered with 0 had the override been ignored.
- (d) **Conventions match `cli-offline-smoke.cjs`.** Identical shebang + `'use strict'`, identical `repoRoot` resolution, verbatim-identical `parseArgs` (text/json + `--timeout-ms`, 20s default), same spawnSync options (encoding/timeout/maxBuffer/stdio ignore-pipe-pipe), same sandbox + env pattern, same `daemon-ipc.sock` daemon-free assertion, same finally cleanup and 0/1 exit semantics. Intentional deltas only: stderr-aware envelope parse and null-on-empty `parseJson` (required for failure-envelope cases), both motivated in the header comment, which names `cli-offline-smoke.cjs` as the sibling. Existing smoke untouched (not in `git status`).

## Residuals

None blocking. Note: the five 64-cases assert exit code only (`expectJsonStatus` unset → `envelopeOk` vacuously true); the spec's envelope claim is scoped to the 75 cases, which are fully asserted. Usage errors emit either JSON envelopes or usage text by design, so this is correct scoping, not a gap.
