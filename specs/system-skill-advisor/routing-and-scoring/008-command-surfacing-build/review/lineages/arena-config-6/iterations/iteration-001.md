# Review Iteration 001

## Dimension

Primary dimension: **correctness**. The pass read both changed behaviours end to end — the per-run temp folder in the vitest config and the raised git buffer in the arena builder — and asked what each does on the inputs its own contract allows.

Review focus addressed: the operator focus names `review-brief-6.txt` as the entry point, the `arena-config` label's three paths from `review-scope-6.txt`, the per-area diff command, the recorded limits and the holdout rule. This iteration read the brief and the scope file first, diffed exactly the three `arena-config` paths with the scope file's command for that area, and touched no other area's files except as evidence. The recorded limits were treated as out of scope; nothing found here restates one. No prompt corpus was opened and `.skilled/hooks/hook-flags.env` was not read.

## Dispatcher

- Mode: review, detached fan-out lineage `arena-config-6`.
- Session: `fanout-arena-config-6-1794815529929-dybl7p`, generation 1, lineage mode new.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/arena-config-6`.
- Budget: 60 tool calls, 10 minutes.
- Doctrine: `.skilled/skills/sk-code/sk-code-review/references/review-core.md` loaded before severity calls.
- Sources read for this pass: `review/review-brief-6.txt`, `review/review-scope-6.txt`, the three scope diffs (`ddb12a6852c..85550ee946e`), the three files at `85550ee946e`, `runtime/lib/metrics.ts`, `.skilled/bin/lib/launcher-ipc-bridge.cjs`, `035-suite-metrics-and-start-shape/{spec.md,acceptance-criteria.md,implementation-summary.md}`, `032-review-pass-five-remediation/tasks.md`, `.github/workflows/skill-advisor-stress.yml`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:5-18`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:142-152` (and `154-238`, `330-348`, `395-427` for the listing consumers)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:753-789` (and `471-509` for the block's helpers)
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:185` and `:308-310` (integration: the durable root the config redirects)
- `.skilled/bin/lib/launcher-ipc-bridge.cjs:31` and `:111-127` (integration: the socket-path limit a longer temp path could press on)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The per-run temp folder is removed on a clean exit only** -- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16-18` -- The cleanup is a `process.on('exit')` listener, and Node emits that event only when the event loop empties or `process.exit()` is called. A run terminated by a signal runs no listener, so the folder and the health records it holds stay behind. The comment above it says "the run removes it on exit", which reads as covering every ending.
   - Case: the stress job runs under `concurrency.cancel-in-progress: true`, so a superseded pull-request run receives a termination signal; the `sav-XXXXXX` folder from that run survives in the temp directory with every record it wrote. Observed on this machine: a Node process with an `exit` listener that was sent `SIGTERM` wrote no marker file, while the same script ending through `process.exit(0)` wrote it.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:14-18]`; `[SOURCE: .github/workflows/skill-advisor-stress.yml:38]` (`cancel-in-progress: true`); `node` documentation for the `'exit'` event ("emitted when the Node.js process is about to exit ... not emitted for ... `process.abort()`, or when the process receives a signal that is not handled").
   - User impact: a cancelled or timed-out suite leaves a directory of test health records in the operator's temp folder on every cancellation; nothing reads them, so the cost is litter rather than a wrong health figure.
   - Finding class: instance-only
   - Scope proof: the whole cleanup path is this one listener; `rg -n "RUN_TMPDIR|rmSync" vitest.config.ts` returns exactly these four lines, so no second cleanup covers the signal path.
   - Affected surface hints: ["vitest.config.ts: per-run TMPDIR", "test health records", "CI cancellation"]
   - Recommendation: also remove the folder from `process.once('SIGINT')` and `process.once('SIGTERM')` handlers that re-raise the signal, or accept the litter and say so in the comment.

2. **The suite isolation sets only the variable POSIX reads** -- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:14-15` -- `process.env.TMPDIR = RUN_TMPDIR` moves `os.tmpdir()` on macOS and Linux. Node's `os.tmpdir()` on Windows reads `TEMP`, then `TMP`, then `SystemRoot\Temp`, and never `TMPDIR`, so the durable metrics root would stay in the shared folder there. The comment states the move unconditionally.
   - Case: a Windows checkout runs `npm test` (or `npx vitest run`); `DURABLE_METRICS_ROOT` still resolves to `%TEMP%\speckit-skill-advisor-metrics`, and every health record the run writes counts as real use to the doctor readers.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:14-15]`; `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:185]` (`join(tmpdir(), 'speckit-skill-advisor-metrics')`); `node:os` `tmpdir()` platform rule.
   - User impact: on Windows the isolation quietly does nothing, and the packet's handoff criterion ("a full suite run leaves the shared metrics folder unchanged") would fail without any error.
   - Finding class: instance-only
   - Scope proof: no `win32` branch exists in the advisor runtime (`rg -n "win32" runtime/lib runtime/scripts` returns nothing), and no workflow runs on `windows-*`, so this is an uncovered platform rather than a live regression; that is why it stays P2 rather than P1.
   - Affected surface hints: ["vitest.config.ts: per-run TMPDIR", "lib/metrics.ts durable root", "Windows runtime support"]
   - Recommendation: set `TMPDIR`, `TMP` and `TEMP` together, the way `.skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:16` already does.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Phase 035's REQ-001 and AC-001 ask for a per-run temp folder that leaves the shared metrics folder unchanged; `vitest.config.ts:14-15` reaches `lib/metrics.ts:185` through `tmpdir()`, so the main path matches. The stress config's exclusion from the lever is left for iteration 2's traceability pass. |

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:185` — `DURABLE_METRICS_ROOT = join(tmpdir(), 'speckit-skill-advisor-metrics')`, computed at module load; `durableMetricsPath()` at `:308` is the only writer's path builder, so `TMPDIR` is the only switch the config needs.
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:451-466` — `persistAdvisorHookDiagnosticRecord` writes on every prompt; the per-run folder therefore has real content to delete.
- `.skilled/bin/lib/launcher-ipc-bridge.cjs:31` and `:111-127` — the 104-byte `sun_path` limit and `withinLimitOrRelocated`, which relocates a longer socket directory; a temp path made 11 bytes longer cannot push a bind past the limit unnoticed.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:154-238` — `gitText`, `headOf`, `isIgnored`, `sourceChanges` and `newestTrackedTime` all route through the changed `git()` helper, so the raised cap covers every listing consumer.

## Edge Cases

- The raised `maxBuffer` was reproduced rather than run through the builder: `spawnSync('git', ['ls-files', '-z'])` on the 6,000-file fixture the new test builds returned `{"status":null,"error":"ENOBUFS","stdoutBytes":1114112}` at the default cap and `{"status":0,"stdoutBytes":1116018}` at 512 MiB. That settles the fix's premise without a suite run. Building an arena in this lineage is impossible by design: the builder refuses a destination inside a repository (`dest_in_repo`), and this lineage lives inside one.
- The `exit`-listener limit is stated as litter, not as a health-figure defect: the surviving folder is a private `sav-*` directory, so the doctor readers never read it.
- The Windows limit is recorded as P2 because no Windows runner or `win32` branch exists in this runtime; the reach is a platform the project does not test, not a caller that sends a failing input today.
- `sourceChanges` and `staleBuilds` both keep their existing failure shape: `git()` throws on `result.error`, so an overflow above the new cap still aborts as `spawn_failed` rather than returning a short listing. That diagnosis cost is carried to the maintainability pass.

## Confirmed-Clean Surfaces

- The buffer fix reaches every git call in the builder: `git()` at `prepare-behaviour-arena.mjs:144-152` is the single spawn site, and `gitText`, `headOf`, `isIgnored`, `sourceChanges`, `newestTrackedTime`, `trackedDotenvFiles`, `cloneInto`, `checkoutDetached`, `removeRemotes` and `assertHead` all call it.
- No truncation can be read as success: `git()` throws `StepFailure('spawn_failed', …)` whenever `result.error` is set, so an `ENOBUFS` read never reaches `staleBuilds` or `trackedDotenvFiles` as a short list.
- The 6,000-file fixture clears the default cap by a measurable margin: 6,000 names of 180 characters plus `src.js` and `.gitignore` produce a 1,116,018-byte `git ls-files -z`, which is 67,442 bytes past the 1,048,576-byte default.
- The temp-folder lever reaches children of tests: the config is loaded in the runner's main process before any worker starts, and both pools pass the parent environment to a worker, so a test that spawns the advisor CLI or a daemon hands it the per-run `TMPDIR`.
- A longer temp path does not break the IPC socket: the default advisor socket directory is `/tmp/system-skill-advisor` (`launcher-ipc-bridge.cjs:24`), not `tmpdir()`, and a database-scoped directory above the 104-byte limit is relocated by `withinLimitOrRelocated`.
- The changed cap is not a copy or link boundary: `copyPath`, `escapingLinks`, `stampBuildTree` and `trackedDotenvFiles`' filter are untouched by the diff, so the only behaviour that moved is how many bytes a git call may print.
- No scope violation occurred: no file outside the lineage directory was created, modified or deleted; the only writes were this iteration's three artifacts and the append-gateway record.

## Ruled Out

- A listing truncated by the default buffer reaching a caller as a complete list: `git()` throws before returning.
- An overflow that silently becomes an empty copy plan: `copyPlan` does not use git; it walks the filesystem, and `isIgnored` asks `git check-ignore -q`, whose status is read directly.
- A temp-folder relocation that breaks `git`, `cp` or a spawned advisor process: none of them resolves a path through `TMPDIR` in a way the config changes, and the tests that do (`metrics-file-permissions.vitest.ts:33-50`) set and restore it themselves.
- A per-run folder that deletes a developer's real health records: `RUN_TMPDIR` is a fresh `mkdtempSync` directory, and `rmSync` is scoped to it.

## Next Focus

- Dimension: traceability
- Focus area: the spec, task and checklist claims behind both changes — phase 035's AC-001/AC-005, phase 032's T053 and T043 — and whether every suite entry point the packet claims is isolated actually is.
- Reason: iteration 1's two advisories are both about the *scope* of a claim (a cleanup that covers one exit path, a variable that covers one platform family); the claims themselves live in the packet docs.
- Rotation status: correctness complete for all three scope files; security, traceability and maintainability remain.
- Blocked/productive carry-forward: productive — direct reproduction settled the buffer premise in one probe.
- Required evidence: the two config files that define suite runs, the npm scripts that select them, and the workflow that runs each.
- Recovery note: none; no failed iteration.

Review verdict: PASS
