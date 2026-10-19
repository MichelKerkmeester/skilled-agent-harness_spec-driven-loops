# Iteration 4: What Each Adapter Still Decides Alone

## Focus

Adapter parity after the shared helpers landed. Not "does each adapter work", but "which decision
does each of the five adapters still make in its own shape", where the shapes differ enough that a
change in one does not reach the others. The arm guard, the runtime identity and the entrypoint
convention are the three the earlier iterations kept running into.

## Actions Taken

1. Read the two remaining adapters not yet read end to end: `claude/context-nudge.mjs` and
   `hermes/context-nudge.mjs`, plus the two one-line Codex shims.
2. Tabulated the arm guard from all five arm paths and from `nudge.handoffPending`, condition by
   condition.
3. Compared the entrypoint convention across every adapter module.
4. Located where the runtime name is written down.

## Findings

1. **One decision — "is this record mine and still armable" — has six implementations and three
   different condition sets.** Every path asks the same questions: is there a record, is it this
   session's, is it this runtime's, is it this loop's, and may a killer be spawned for it.
   - Claude asks four of them: `[SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:96]`
     and `[SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:100]` — no runtime, no
     loop ownership.
   - Codex asks four, differently: `[SOURCE: .skilled/hooks/session-relaunch/codex/stop-arm.mjs:100]`
     checks `loopId` and the session but not the runtime; the status rule sits at
     `[SOURCE: .skilled/hooks/session-relaunch/codex/stop-arm.mjs:107]`.
   - Hermes, OpenCode and Pi ask five: `[SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:66]`,
     `[SOURCE: .skilled/hooks/session-relaunch/opencode/session-relaunch.js:279]`,
     `[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:271]` — session and runtime,
     no loop ownership, with the status rule repeated at
     `[SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:74]`,
     `[SOURCE: .skilled/hooks/session-relaunch/opencode/session-relaunch.js:285]`,
     `[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:275]`.
   - `nudge.handoffPending` asks a related question a sixth time
     (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:382]`).
   The visible consequence is that a record prepared for one runtime is refused by three arm
   paths and accepted by two. A record whose `loopId` disagrees is refused by Codex alone. Phase
   008 named note-state classification for consolidation and phase 009 delivered `noteState`, so
   the armable-record verdict is the same kind of decision still sitting in six places. Fix: one
   `core.armableRecord(record, { loopId, sessionId, runtime, env })` returning
   `{ armable, reason }` over the full five-condition set, called by all five arm paths; the
   status rule and the runtime and loop checks then have one owner, and every adapter's behaviour
   becomes checkable in one test.

2. **The runtime identity is a bare string in five files and an array in a sixth.** `prepare`
   validates against `LOOP_RUNTIMES`
   (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:17]`), while each arm path
   compares against a literal it writes itself — `'hermes'`
   (`[SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:70]`), `'opencode'`
   (`[SOURCE: .skilled/hooks/session-relaunch/opencode/session-relaunch.js:280]`), `'pi'`
   (`[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:272]`) — and each nudge
   passes the same literal as a `runtime` argument
   (`[SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:109]`,
   `[SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:113]`). `RUNTIME_SEED_OPTIONS`
   (`[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:26]`) keys on three of the
   seven names as object keys. So one rename has to be found in eight places, and the allowlist
   in the CLI is the only place that knows the full set. Fix: export a frozen `RUNTIMES` object
   from the core, build `LOOP_RUNTIMES` from `Object.keys(RUNTIMES)`, and have each adapter and
   nudge call site use `RUNTIMES.hermes` and so on.

3. **Three of the five entrypoints run on import, which is why the arm paths cannot be tested
   in-process.** `codex/stop-arm.mjs:141` and `hermes/session-end-arm.mjs:138` guard with
   `isMain()`; `claude/stop-arm.mjs:154`, `claude/context-nudge.mjs:120` and
   `hermes/context-nudge.mjs:109` call `main().catch(done)` at module scope, and the two Codex
   shims call `runCodexAdapter(...)` at module scope
   (`[SOURCE: .skilled/hooks/session-relaunch/codex/context-nudge.mjs:15]`,
   `[SOURCE: .skilled/hooks/session-relaunch/codex/prompt-seed.mjs:15]`). Importing
   `claude/stop-arm.mjs` therefore executes the hook and exits the process, which is the direct
   reason iteration 3's prescribed arm case has to spawn Claude as a child instead of driving its
   `armPendingRecord`. Fix: give `claude/stop-arm.mjs` the same `isMain()` guard the other two
   arm paths have and export `armPendingRecord(payload, dependencies)` shaped like Hermes'
   (`[SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:52]`); do the same for
   the two nudge entrypoints, which need it for the same reason.

4. **A payload with no event name is accepted by two adapters and dropped by one.** Claude infers
   the event from the payload's shape
   (`[SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:42]`) and Hermes treats an
   absent name as a match (`[SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:61]`),
   while the Codex shared adapter requires an exact match and returns silently when the field is
   missing (`[SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:69]`). Both policies are
   defensible — Codex hooks always send the field, Hermes' plugin bridge does not — but the
   policy is written in three places and stated in none, so the next adapter has no rule to
   follow. Fix: one `shared/hook-adapter-shared.cjs` predicate
   `hooksEvent(payload, expected, { inferFromPrompt = false })` that names the leniency as an
   argument, used by all three.

## Ruled Out

- Reporting `nudgeDecision` being called without `env` in the three spawned hooks: the default
  `process.env` is exactly the environment those hooks run in, and the two in-process adapters
  pass their own, which the conformance suite's `withProcessEnv` already exercises.
- Reporting the OpenCode plugin's silent `catch` around the arm path as a parity defect: the
  plugin has no log sink of its own, and the hooks' logging is best-effort by design.

## Dead Ends

- Looking for a runtime-name constant in `shared/`: `hook-flags` owns the enabled/disabled
  switches, not the runtime set, so there is no existing home to reuse.

## Edge Cases

- Ambiguous input: "parity" could mean identical behaviour or identical shape. Took shape, since
  identical behaviour is prevented by the hosts themselves.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the six-way guard table is read from source, condition by condition; no
  adapter was executed, so "accepted by two and refused by three" is a reading of the guards, not
  an observed run.

## Sources Consulted

- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:96`
- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:100`
- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:154`
- `.skilled/hooks/session-relaunch/claude/context-nudge.mjs:42`
- `.skilled/hooks/session-relaunch/claude/context-nudge.mjs:109`
- `.skilled/hooks/session-relaunch/claude/context-nudge.mjs:120`
- `.skilled/hooks/session-relaunch/codex/stop-arm.mjs:100`
- `.skilled/hooks/session-relaunch/codex/stop-arm.mjs:107`
- `.skilled/hooks/session-relaunch/codex/stop-arm.mjs:141`
- `.skilled/hooks/session-relaunch/codex/shared.mjs:69`
- `.skilled/hooks/session-relaunch/codex/shared.mjs:113`
- `.skilled/hooks/session-relaunch/codex/context-nudge.mjs:15`
- `.skilled/hooks/session-relaunch/codex/prompt-seed.mjs:15`
- `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:52`
- `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:61`
- `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:66`
- `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:70`
- `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:74`
- `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:138`
- `.skilled/hooks/session-relaunch/hermes/context-nudge.mjs:109`
- `.skilled/hooks/session-relaunch/opencode/session-relaunch.js:279`
- `.skilled/hooks/session-relaunch/opencode/session-relaunch.js:280`
- `.skilled/hooks/session-relaunch/opencode/session-relaunch.js:285`
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:271`
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:272`
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:275`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:382`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:26`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:17`

## Assessment

- New information ratio: 0.8
- Questions addressed: which behaviours still diverge across the five adapters
- Questions answered: which behaviours still diverge across the five adapters

## Reflection

- What worked and why: tabulating one decision across all five call sites at once, condition by
  condition, made the three condition sets visible; reading them one adapter at a time had
  already let the difference pass twice in earlier iterations.
- What did not work and why: looking for a shared runtime constant under `shared/`. The runtime
  set has never lived there, so the finding is that no home exists rather than that one is
  unused.
- What I would do differently: build the parity table in the first iteration and fill it as each
  adapter is read; three of this run's findings are gaps in that one table.

## Recommended Next Focus

Standards alignment: the sk-code-skilled surface checklist over the hook sources and the sk-doc
document standards over the READMEs, the command doc and the packet records.
