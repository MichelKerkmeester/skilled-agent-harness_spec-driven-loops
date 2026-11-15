# Iteration 2: The Prepare/Consume CLI and the Wrapper

## Focus

The command surface that turns a note into a relaunch: `bin/session-relaunch.cjs` (`prepare`,
`should-relaunch`, `consume`, `claim`, `complete`) and the `.skilled/bin/skilled-loop` wrapper that
calls it. Specifically, which duplicated decisions and which unverified assumptions survive the
phase 009 fixes here.

## Actions Taken

1. Read `bin/session-relaunch.cjs` end to end (626 lines), including the argument parser, the
   containment check and the shell-child refusal.
2. Read `skilled-loop`'s manual-command construction, template build and the post-runtime decision
   switch.
3. Compared the handoffs-directory layout against `nudge.handoffDir`, and the manual command
   against `core.manualClaimCommand`.
4. Traced `build_relaunch_arguments` through every runtime branch to see whether the manual
   template always carries the substitution token.

## Findings

1. **The handoffs directory is declared twice, and the CLI cannot import the nudge's copy.** The
   nudge builds the directory from `.skilled`/`skills`/`.state`/`session-relaunch`/`handoffs` at
   `[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:243]`, which is where
   `plannedNotePath` puts every note; the CLI declares the same five segments again as
   `HANDOFF_SEGMENTS` at `[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:128]`
   and rejects anything outside it at
   `[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:141]`. `nudge.handoffDir` is
   not exported (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:488]` lists
   `resolveRepoRoot` and `plannedNotePath` but not `handoffDir`), so the CLI has no way to share
   it. A layout change in one place makes every note the nudge planned invisible to `prepare`,
   `claim` and `complete`, which fail with "handoff path must be inside the session-relaunch
   handoffs directory" — a message that names containment while the real fault is a stale copy of
   the path. Fix: export `handoffDir` from `nudge.cjs` and derive the CLI's segments from it
   (`path.relative(nudge.resolveRepoRoot(process.env), nudge.handoffDir(root)).split(path.sep)`),
   deleting `HANDOFF_SEGMENTS`.

2. **`print_manual_command`'s fallback half is unreachable, and it carries the second and third
   copies of two shared contracts.** `build_manual_command_template` always embeds
   `@@HANDOFF@@` (`[SOURCE: .skilled/bin/skilled-loop:239]`) and every runtime branch of
   `build_relaunch_arguments` appends the seed and records its index
   (the `case` at `[SOURCE: .skilled/bin/skilled-loop:169]`, with `relaunch_seed_index` set at
   `[SOURCE: .skilled/bin/skilled-loop:175]` and again in every later branch through `:233`), so
   `SKILLED_LOOP_MANUAL_TEMPLATE` always holds exactly one token by the time the loop starts
   (`[SOURCE: .skilled/bin/skilled-loop:393]`). The `case` at
   `[SOURCE: .skilled/bin/skilled-loop:49]` therefore always takes the single-token branch and
   returns; the escaping block at `[SOURCE: .skilled/bin/skilled-loop:42]` and the runtime
   seed-option table at `[SOURCE: .skilled/bin/skilled-loop:59]` cannot run. Both duplicate
   contracts that already have an owner: the escape set is `core.manualClaimCommand`'s
   (`[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:584]`), and the seed-option
   table is `RUNTIME_SEED_OPTIONS`
   (`[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:26]`). Fix: delete the
   fallback, and make the unreachable case an explicit error — `printf 'warning: the manual
   command template is unusable\n' >&2; return 1` — so a future template change fails visibly
   instead of silently printing an unescaped command. Also note the stream split while there:
   the wrapper prints the manual command on stderr (`[SOURCE: .skilled/bin/skilled-loop:65]`)
   where the CLI's `printManualClaim` prints it on stdout
   (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:292]`).

3. **`refuseForShellChild` trusts `CLAUDE_PID` without the descent check the killer target
   resolution applies to the same variable.** `resolveKillerTarget` accepts `CLAUDE_PID` only
   while it descends from the loop (`[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:844]`),
   and `stop-arm` relies on that
   (`[SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:131]`). `prepare`'s shell-child
   check converts the same variable straight to a pid and inspects that subtree
   (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:265]`), never asking whether
   it belongs to this loop. A stale `CLAUDE_PID` inherited from an outer shell therefore makes
   `prepare` read an unrelated process's children: it can refuse a valid prepare with "still has
   a live shell child", or pass while the real runtime does have one. Fix: after parsing, require
   `core.findLoopChildPid(loopId, { pid: runtimePid, processTable }) !== null` and fall back to
   `runtimePidFromLoop` when it does not hold — the same two-step the core already implements, so
   a mismatch degrades to the walk instead of a wrong verdict.

4. **`main()`'s unknown-command message hardcodes the subcommand list that `SUBCOMMANDS` owns.**
   The module declares `SUBCOMMANDS` as "the only place its syntax is written" at
   `[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:24]`, and the default arm
   then spells the five names out again at
   `[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:605]`. A sixth subcommand
   added to `SUBCOMMANDS` would appear in `usageText()` and in `usageHint()`, and be missing from
   the one message a caller sees after typing a wrong command. Fix:
   `Object.keys(SUBCOMMANDS).join(', ')` in that message.

## Ruled Out

- Reporting `prepare`'s `cwd: process.cwd()` as losing the session directory: `arm()` overwrites
  the record's `cwd` from the live hook payload at
  `[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:364]`, so the pending value is
  only a fallback for command-only runtimes.
- Reporting the note's unused `cwd` and `loop_id` frontmatter fields
  (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:114]`) as a defect: they are
  provenance the protocol documents, not inputs any reader is told to consume.

## Dead Ends

- Auditing `handoffPathWithinRepo`'s symlink containment: phase 009's L1 fix holds — it compares
  the real handoffs directory against the real repository root
  (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:157]`) and then the real
  parent of the candidate (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:172]`).

## Edge Cases

- Ambiguous input: "the CLI surface" could include the wrapper's exit-code matrix. Read the
  matrix at `[SOURCE: .skilled/bin/skilled-loop:520]` to confirm the `stale` consequence claimed
  in iteration 1 but did not report it again.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the wrapper's dead fallback was established from control flow, not from a run.
  A runtime probe was out of scope because this lineage may not execute the loop.

## Sources Consulted

- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:24`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:128`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:141`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:157`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:172`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:265`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:292`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:605`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:243`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:488`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:26`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:364`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:584`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:844`
- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:131`
- `.skilled/bin/skilled-loop:42`
- `.skilled/bin/skilled-loop:49`
- `.skilled/bin/skilled-loop:59`
- `.skilled/bin/skilled-loop:65`
- `.skilled/bin/skilled-loop:169`
- `.skilled/bin/skilled-loop:175`
- `.skilled/bin/skilled-loop:239`
- `.skilled/bin/skilled-loop:393`
- `.skilled/bin/skilled-loop:520`
- `.skilled/commands/speckit/handoff.md:79`
- `.skilled/commands/speckit/handoff.md:93`

## Assessment

- New information ratio: 0.8
- Questions addressed: latent bugs and edge cases in the CLI and the wrapper
- Questions answered: latent bugs and edge cases in the CLI and the wrapper

## Reflection

- What worked and why: following one directory path and one command string across the two
  processes (wrapper and CLI) surfaced both duplications; the wrapper's control flow answered the
  reachability question without needing to run it.
- What did not work and why: reading the CLI's argument parser in detail produced nothing —
  phase 009's duplicate-option and missing-value handling is sound.
- What I would do differently: check reachability before reading duplicated blocks in full; the
  fallback's fate was decided by two lines in `build_manual_command_template`.

## Recommended Next Focus

The conformance suite and the per-adapter test suites: what each case actually asserts, which
shipped behaviour no case reaches, and where a fixture proves the test rather than the code.
