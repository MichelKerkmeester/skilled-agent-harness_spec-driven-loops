# Cross-repo zero-config compatibility sweep — 2026-08-24 (Tier 1)

Real public repos, cloned fresh, wrapped with `supercov -- <their test command>`
and no configuration. Every failure below was reproduced, root-caused, and
either fixed the same day or filed with evidence.

## Matrix

| repo | runner / layout | before fixes | after fixes |
| --- | --- | --- | --- |
| unjs/defu | Vitest, pnpm, unbuild | crash: `ENOTDIR … lib/defu.cjs/.supercov`; then zero evidence (`vite` unresolvable under pnpm) | ✅ 23/23, MC/DC 80%, measurement complete |
| unjs/ufo | Vitest 4, pnpm | one test timed out (5 s) in full runs; plain `vitest run` afterwards **double-counted the suite** (978 vs 489) | ✅ 489/489 pass; no pollution; overhead still high (see §perf) |
| vercel/ms | Jest, pnpm, edge env | exit 1: repo's own istanbul thresholds measured instrumented code; configs misclassified as ambiguous source | ✅ 167/167, MC/DC 100%, measurement complete |
| fastify/fastify-plugin | node:test via `c8 --100` | **40/43 tests failed**: `Cannot read private member #assert` | ✅ 43/43; c8 threshold advisory printed; exit 1 remains theirs (c8 measures instrumented code) |
| iamkun/dayjs | Jest config in package.json | crash (`node build` under ESM loader); then wrong test set (797 vs 794 — package.json jest config ignored); 15–20× slower | ✅ plain and Supercov both 93 suites / **794/794**; probe-v1 remains very slow; old Jest attribution deferred by user decision |
| debug-js/debug | Mocha (unsupported) | — | ✅ honest degradation: 16/16 pass, aggregate coverage, no per-test attribution |
| sindresorhus/p-limit | AVA (unsupported) | 1 test failed: wall-clock assertion (590–650 ms window) blown by overhead | degradation works; failure is the perf cliff |
| expressjs/express | Mocha, supertest | 1,205 pass / **55 fail** (baseline 1,260/0), then the process **never exited** | ✅ **1,260/1,260, exits cleanly** — one root cause behind both |

## Bugs found and fixed (all with regression coverage where practical)

1. **File entry targets crashed the direct instrumenter** — package.json
   `main`/`exports` targets are legitimate file-shaped source roots;
   `containedRuntimePath` did `mkdir <file>/.supercov`. Now maps file roots to
   their parent directory (`src/directInstrumenter.ts`).
2. **pnpm never hoists `vite`** — the generated vite/vitest configs imported
   `'vite'` bare and silently collected zero evidence. Now resolved through the
   project, then through vitest's own dependencies (`src/cli.ts`).
3. **Workspace residue corrupted the user's ordinary test runs** — the cached
   workspace's copied test files were discovered by a later plain `vitest run`
   (Vitest 4 default excludes are only `node_modules` and `.git`), doubling the
   suite. Two dead ends first: `.cache` naming (Vitest 4 ignores it) and a
   `node_modules` path segment (hides discovery but makes Vite treat workspace
   source as vendor code and Jest ignore it by absolute path). Final design:
   `pruneCachedWorkspaceSources` deletes copied source/test files at run end,
   keeping dependency symlinks + declared build artifacts at the stable path
   (`SUPERCOV_KEEP_WORKSPACE=1` opts out). Also auto-writes
   `.supercov/.gitignore`. The path itself moved later the same day for an
   unrelated and more serious reason — see the dotfile finding below.
4. **node:test context proxy broke `t.assert.*`** — property reads forwarded
   with the proxy as receiver, so TestContext accessors backed by private
   fields threw. Reads now use the real context as receiver
   (`src/nodeTest.ts`). This alone un-broke 40 fastify-plugin tests.
5. **Inner coverage tooling collided** — generated Jest config now forces
   `collectCoverage: false` (istanbul over instrumented code is meaningless and
   fails user thresholds); a CLI advisory prints when the wrapped command runs
   `c8`/`nyc`, which cannot be disabled from outside.
6. **package.json `jest` config was silently ignored** — generated config
   replaced it with `{}`, changing test discovery (dayjs: +3 tests that need
   built bundles; different roots/testRegex). Now inherited verbatim.
7. **Unnecessary project builds** — Jest/Vitest transform source in-process;
   running `npm run build` first (unbuild, `node build`, tsdown) added time and
   two distinct failure modes. `executesSourceDirectly` now covers jest/vitest.
8. **Root-level `*.config.ts` misclassified** as ambiguous first-party source
   (`tsdown.config.ts`, `lint-staged.config.ts`); CONFIG_PATTERN now treats any
   root-level `<tool>.config.*` as configuration.
9. **`SUPERCOV_DEBUG=1`** now prints error stacks from the CLI (added because
   finding #1 was undiagnosable from its one-line message).

## The headline finding: probe overhead is the launch blocker

Measured with the real instrumenter + collector runtime on a representative
per-character hot loop (`scratchpad` bench, 50k iterations):

- plain: **39 ms** — instrumented: **4,341 ms** (~110×)
- CPU profile self-time: `mcdcBegin` 2.5 s, `environmentRequestContext`
  (AsyncLocalStorage lookups) 3.1 s, `mcdcEnd` 0.9 s, `coverageHit` 0.7 s,
  `vectorKey` string building 0.4 s, object spreads 0.4 s
- ~670 ns per probe vs ~3 ns per plain operation

Real-world consequences observed: ufo test timeout (5 s limit), p-limit
wall-clock assertion failure, dayjs ~15–20× (317 s vs ~20 s), express > 1200×
(1 s baseline, 20+ min instrumented, supertest/HTTP-heavy). The published
"synthetic runtime overhead 1.14×" benchmark measures a workload that does not
resemble hot loops and must be replaced.

This is the strongest possible evidence for the probe-v2 phase of the engine
master plan (`progress/engine-master-plan-2026-08-24.md`): per-probe ALS
lookups, per-event allocations/spreads, and string vector keys must go
(segment-cached context, pooled frames, bitmask vectors). Target ≤1.05×; even
≤2× would have passed every suite above.

## FIXED: dot-prefixed workspace path broke static file serving

**Verified root cause.** `send` — the module behind `res.sendFile`,
`express.static` and `serve-static`, and therefore a large fraction of Node
web applications — treats *any* dot-prefixed path segment as a hidden dotfile
and, under its default `dotfiles: 'ignore'`, answers **404**. Our isolated
workspace lived at `.supercov/.cache/instrumented-workspace/<project>/`, so
from `send`'s perspective every file the application served was inside a
dotfile.

Minimal proof (identical file and content; only the ancestor differs):

```
200  /tmp/supercov-dotfile-probe/plain/sub/file.txt
404  /tmp/supercov-dotfile-probe/.dotted/sub/file.txt
```

This was **not** an instrumentation bug: the instrumented `res.sendFile`
output was read and is semantically correct, and a minimal routing repro
passed under instrumentation. It also predated the same day's `.cache` rename,
since `.supercov` was always a dotted ancestor.

**Fix.** The workspace moved out of the dotted store to
`supercov/workspace/<project>/`. The store (`.supercov/`) is unchanged —
applications never serve from it. The container writes its own `.gitignore`
containing `*` so it never reaches the user's diff, plus a marker file
`.supercov-workspace-store` so source copying can distinguish our directory
from a project that legitimately owns a `supercov/` directory (matched by
marker, never by name).

Only viable because `pruneCachedWorkspaceSources` (same day) removes copied
test files at run end, so hiding the workspace from runner discovery is no
longer the *path's* job. The two fixes compose; neither works alone.

**The hang was the same bug.** Express previously printed its summary and then
never exited — 51 minutes elapsed against 21 seconds of CPU, parked in
`uv__io_poll`/`kevent`. The 55 failing tests aborted mid-request and left
supertest's HTTP servers open, and mocha (correctly, without `--exit`) waited
for the event loop to drain. After the path fix: **1,260 passing, 0 failing,
exits cleanly** — identical to baseline.

Supercov now reports a sanitized descendant process tree every 60 seconds and
asks preloaded Node descendants for public active-resource counts. An explicit
`SUPERCOV_COMMAND_TIMEOUT_MS` terminates the whole process group and exits 124;
there is deliberately no universal deadline for arbitrary valid long suites.

Regression tests: the workspace path is asserted to contain no dot-prefixed
segment, and a project-owned `supercov/` directory is asserted to still be
copied while our own container is never nested into itself.

## Process lesson: `npm run check` is not the gate

Three integration scripts asserted "no project file changed outside
`.supercov`" and had to learn about the second owned directory; the packed-npx
snapshot needed the same. Every one of those failures was invisible to
`npm run check` (unit tests + types) and appeared only under
`npm run release:check`, which also runs isolation, packed-npx, the Clang
MC/DC oracle and the benchmarks.

`release:check` also surfaced a **pre-existing** break from earlier the same
day: making Jest/Vitest skip the production build turned the isolation
fixture's `vitest run tests/unit` into a `direct` adapter run, leaving no
instrumented build to reuse, so the build-cache assertion failed. That is
correct product behaviour — the vitest run passes without the build, which is
the dayjs lesson — so the fixture now exercises reuse with an opaque runner
that genuinely builds. Bisected by stashing the change, not guessed.

**Rule: run `release:check` before committing anything that touches the
workspace, the run lifecycle, or project discovery.**

## Design tightened: what a waiver may claim

Dogfooding the waiver file on this repository immediately produced the wrong
kind of waiver. Of eleven, three described browser-only and Windows-only
conditions — *unreachable in our CI matrix*, not *structurally impossible*.
Those three were removed. A waiver asserts that no satisfiable independence
pair exists; a platform we do not test is a coverage gap that Windows CI
(spike S3) will close, and marking it "reviewed" would hide exactly what the
mechanism exists to expose. Eight structural waivers remain: 8 applied,
0 contradicted, 0 unmatched.

The `line` disambiguator proved brittle precisely as designed. Editing
`workspace.ts` shifted two waived conditions and both were reported
`unmatched` — which is how the bad waivers were noticed. Prefer source-text
matching without `line`.

## FIXED: removing the run store took tens of minutes

`rm -rf .supercov` on the dayjs project ran **26+ minutes** in uninterruptible
I/O wait (state `U`, 1:03 CPU at 2% — slow progress, not spinning) and had
still not finished when killed. The project's `node_modules` was verified
intact afterwards (1,023 entries), so nothing followed symlinks out of the
store; the cost is the file and directory count of a full workspace copy plus
per-attempt evidence directories
(`server-evidence/<run>/<worker>/<testKey>/<retry>/`).

This was a product bug, not a test artifact. Removal now atomically renames
only Supercov-owned trees into `.supercov/.trash`; a single detached owner
unlinks them, and later commands recover abandoned trash. The actual old dayjs
cache disappeared from the foreground path in **0.09 s**. Attributed server
evidence is flat by attempt ID. Aggregate hot-loop evidence is de-duplicated
and buffered into bounded runtime batches instead of creating one file per
probe (the interrupted dayjs publication exposed millions of tiny files and a
multi-gigabyte publication process). Current and both legacy cache layouts are
removed by explicit `clean`; `prune` still preserves cache by contract.

The clean parity rerun completed the test phase at 93 suites / 794 tests. Jest
reported 451.65 s while old-cache reclamation competed for I/O, so that is not
a clean performance benchmark. Publication of the pre-fix one-file-per-probe
evidence was stopped at the user's request; the generic batching regression is
covered directly, and old Jest-specific follow-up is intentionally deferred.

## Remaining sweep findings (not yet fixed)

- **Assertion attribution is node:test-only in practice**: Vitest and Jest
  runs report 0 asserted lines; `t.assert.*` (node:test context API) also has
  no phase adapter. Confidence marketing depends on this working beyond
  imported `assert`/`expect`.
- **Unsupported-runner degradation is silent**: mocha/AVA runs report
  "0 test(s)" with coverage present; needs an explicit "unsupported runner:
  aggregate-only evidence" diagnostic naming the runner.
- **dayjs `Add` test off-by-one-second** under instrumentation — timing class,
  goes away with probe v2.
- Timing-window assertions in the wild (p-limit) put a hard ceiling on
  acceptable overhead; even 2× can flip them.
