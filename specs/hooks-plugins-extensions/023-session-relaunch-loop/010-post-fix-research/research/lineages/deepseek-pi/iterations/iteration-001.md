# Iteration 1: The Phase 009 Core Consolidation Against Its Adapter Call Sites

## Focus

What phase 009 moved into `lib/relaunch-core.cjs` and what each call site still decides for
itself. Phase 008's research named kill-target resolution, note-state classification,
spec-folder normalization and the constants each adapter copied (CLI path, section names, seed
phrase) as the consolidation set. This iteration checked which of those decisions now have one
owner, and which are still duplicated or still contradicted by a call site.

## Actions Taken

1. Read `lib/relaunch-core.cjs` end to end (881 lines) to inventory the exported decisions.
2. Read the four arm paths that consume them: `claude/stop-arm.mjs`, `codex/stop-arm.mjs`,
   `hermes/session-end-arm.mjs` and `opencode/session-relaunch.js`.
3. Read `lib/nudge.cjs` (509 lines), the largest core consumer, and `lib/killer.cjs`'s
   timeout branch, which builds the manual command.
4. Grepped every core export across the hook tree to find duplicated definitions and
   `process.env` reads that bypass the injected environment.
5. Read the `arm`, `shouldRelaunch` and manual-command tests to see what the suite pins.

## Findings

1. **`HANDOFF_SECTIONS` is still declared twice, so the nudge cannot promise the shape
   `validateHandoff` enforces.** The core freezes the required section list at
   `[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:22]` and validates against
   it at `[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:265]`; `nudge.cjs`
   declares a second, mutable copy at `[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:30]`
   and prints it to the model as "exactly this shape" at
   `[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:107]`. Adding a required section to
   the core alone makes every note written from the nudge fail `validateHandoff` with
   "handoff is missing a non-empty X section", and the model has no way to know the section
   exists. Phase 008 named section names as an F1 consolidation target, so this is drift the
   consolidation left behind rather than a new defect. Fix: export `HANDOFF_SECTIONS` from the
   core and have `nudge.cjs` require it, deleting its own `const`; add a nudge test that builds
   `handoffText()` and asserts every core section appears as a `## ` heading.

2. **Re-arming after a killer death keeps the original `armedAt`, so the wrapper consumes the
   record as `stale` and the hop is lost.** `arm()` returns an already-armed record verbatim at
   `[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:361]`, writing nothing. All
   four arm paths deliberately reach that branch once the killer is gone: `claude` at
   `[SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:100]`, `codex` at
   `[SOURCE: .skilled/hooks/session-relaunch/codex/stop-arm.mjs:107]`, `hermes` at
   `[SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:74]` and the OpenCode
   plugin at `[SOURCE: .skilled/hooks/session-relaunch/opencode/session-relaunch.js:284]`. Each
   then calls `arm(...)` and spawns a fresh killer, but the record still carries the timestamp
   from the first arm. `shouldRelaunch` measures from it
   (`[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:445]`) with a ten-minute
   default, returns `stale`, and the wrapper treats `stale` as "print the manual command and
   keep the runtime exit code" (`[SOURCE: .skilled/bin/skilled-loop:520]`) after `consume_record`
   has already deleted the record. A loop that armed at T, lost its killer, kept working past
   `SESSION_RELAUNCH_MAX_AGE_MIN` and stopped again therefore re-arms, spawns a killer, and then
   refuses its own relaunch. The suite pins the current behaviour — `assert.deepEqual(repeated,
   armed)` at `[SOURCE: .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:488]` — so
   the fix is a deliberate test change, not a regression. Fix: in the armed branch re-persist
   `{ ...record, armedAt: toIsoTimestamp(now), cwd }` with `atomicWriteFile`, and change that
   assertion to expect the refreshed `armedAt` and the new `cwd`. The adapters' own `now` is
   unset, so the refreshed stamp is wall-clock, which is what `shouldRelaunch` reads.

3. **`manualClaimCommand` reads `process.env` directly while the same function hands
   `environment` to `unarm`.** The lock-state and log helpers all take `env = process.env`, but
   `manualClaimCommand` reaches into the ambient environment at
   `[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:596]`. The killer's timeout
   branch injects one environment into `unarm`
   (`[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:499]`) and then builds the
   notification command from the process environment instead
   (`[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:516]`), so a killer started with a
   custom `env` — which `hermes` does at
   `[SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:106]` — unarms under one
   environment and notifies under another. The tests can only exercise the template path by
   mutating `process.env` around the call
   (`[SOURCE: .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:793]`). Fix: give
   `manualClaimCommand(runtime, handoffPath, specFolder, env = process.env)` a fourth parameter,
   pass `environment` from `notifyManualClaim`, and pass `process.env` where the CLI already
   calls it at `[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:292]`.

4. **The Pi adapter hand-declares the core's shape, so a core change compiles clean and fails at
   run time.** `pi/session-relaunch.ts` re-types four of the core's twenty-four exports in a
   local `CoreModule` at `[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:25]`
   (`appendLog`, `arm`, `readRelaunchFile`, `liveKillerPid`). The `.cjs` core carries no types, so
   nothing checks the mirror: renaming or re-signing any of the four leaves the TypeScript suite
   green and breaks the Pi runtime path that calls it at
   `[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:277]`. Fix: add one
   assertion in `pi/session-relaunch.test.ts` over `Object.keys(CoreModule)` — or over the four
   names — that the loaded `relaunch-core.cjs` actually exports each as a function, so the
   compiler-blind mirror has a runtime guard.

## Ruled Out

- Treating Claude's missing `record.loopId !== loopId` guard as a divergence: `readRelaunchFile`
  resolves the path from the same `loopId`, so a mismatched field cannot occur through the
  public API. Codex's extra check is redundant, not protective.
- Treating `resolveKillerTarget`'s refusal to arm when `ps` is unavailable as a defect. The
  killer validates ancestry before signalling, so an unverified target would be refused later
  anyway; failing before arming keeps the record pending.

## Dead Ends

- Looking for a phase 009 `noteState` inconsistency between the OpenCode plugin and the CLI:
  both read the single `core.noteState` rule (`opencode/session-relaunch.js:29,67,330`,
  `bin/session-relaunch.cjs:564`). That consolidation holds.

## Edge Cases

- Ambiguous input: "disagreement with an adapter's call site" could mean either a duplicated
  definition or a behavioural difference. Took both, and reported only the cases where the
  difference changes an outcome.
- Contradictory evidence: the `arm()` repeat test asserts the behaviour finding 2 calls a bug.
  Reported both, with the test cited as the thing to change.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:22`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:265`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:361`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:445`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:596`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:30`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:107`
- `.skilled/hooks/session-relaunch/lib/killer.cjs:499`
- `.skilled/hooks/session-relaunch/lib/killer.cjs:516`
- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:100`
- `.skilled/hooks/session-relaunch/codex/stop-arm.mjs:107`
- `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:74`
- `.skilled/hooks/session-relaunch/opencode/session-relaunch.js:284`
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:25`
- `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:488`
- `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:793`
- `.skilled/bin/skilled-loop:520`

## Assessment

- New information ratio: 0.85
- Questions addressed: core consolidation against adapter call sites
- Questions answered: core consolidation against adapter call sites

## Reflection

- What worked and why: reading the core before the call sites made the duplicates visible as
  soon as they appeared; grepping each export showed `HANDOFF_SECTIONS` had two definitions and
  that `manualClaimCommand` was the one export reading the ambient environment.
- What did not work and why: looking for `noteState` divergence across the plugin and the CLI
  produced nothing, because phase 009's B1 fix did land in every reader. Spending calls there
  was the iteration's main waste.
- What I would do differently: start from the arm paths' shared shape and diff them against
  each other first; three of the four findings sit on that path.

## Recommended Next Focus

The CLI surface: `bin/session-relaunch.cjs` (`prepare`, `should-relaunch`, `consume`, `claim`,
`complete`) and the `.skilled/bin/skilled-loop` wrapper, where the record is consumed and the
exit codes are decided.
