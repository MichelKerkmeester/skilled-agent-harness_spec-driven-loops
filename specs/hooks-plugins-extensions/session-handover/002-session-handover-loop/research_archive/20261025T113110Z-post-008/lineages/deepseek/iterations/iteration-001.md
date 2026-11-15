# Iteration 1: Core relaunch state machine and process-targeting seams

## Focus

Audit `.skilled/hooks/session-relaunch/lib/*.cjs`, the `session-relaunch` CLI, and the `skilled-loop` wrapper against their own documented contract. The aim was to find latent bugs at the seams where a hook process, the runtime process, the wrapper, and the killer exchange state rather than to re-review the decision logic phase 008 already hardened.

## Findings

1. **P1 — The Claude stop hook supervises the `bash -c` wrapper when `CLAUDE_PID` is unset.** `stop-arm.mjs` resolves the killer target as `process.env.CLAUDE_PID || String(process.ppid)` [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:131]. The generated Claude hook command runs through `bash -c 'cd ... && node ...'` [SOURCE: .claude/settings.json:192], so the Node hook's parent is the transient shell, not the Claude process. No producer of `CLAUDE_PID` exists in the repository; only tests set it [SOURCE: .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:315]. The core already carries the correct resolution — climb from the hook process to the direct child of `SKILLED_LOOP_ID` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:757] — and the CLI uses it for the same purpose [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:238]. The killer does not signal itself (it only handles `ESRCH`), so the result is a silent no-op: the shell exits, the record stays armed, and the original session keeps waiting for input instead of ending. Fix: in `stop-arm.mjs`, resolve `targetPid` with `findLoopChildPid(loopId)` before falling back to `process.ppid`, reject a non-integer result, and add a test that runs the hook through a shell with `CLAUDE_PID` removed.

2. **P2 — Context-window resolution silently doubles the fill ratio for sessions started in a repo subdirectory.** `resolveWindow` only checks `.claude/settings.local.json` and `.claude/settings.json` under the session `cwd` [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:173], and the Claude nudge passes the hook payload `cwd` unchanged [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:88]. This repository configures a 500000-token window [SOURCE: .claude/settings.json:25]. A session whose `cwd` is a package or skill subdirectory therefore misses that setting and falls through to the 200000-token model default [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:183], so a 35% real fill reads as 87.5% and nudges early. The same contract already resolves handoff paths from the repo root explicitly [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:203]. Fix: walk ancestors from `cwd` until a `.claude/settings.local.json` or `.claude/settings.json` is found (stopping at the repository boundary), then consult the home setting, and add a nested-cwd test to `context-usage.test.cjs`.

3. **P2 — `shouldRelaunch` approves an armed record without a usable handoff or cwd, and the wrapper turns that into exit 1.** The predicate checks only `status`, `armedAt` and `hops` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:404]. `should-relaunch` then copies `record?.handoff` and `record?.cwd` straight into its JSON [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:461]. When either is missing, `skilled-loop` prints "warning: could not read the relaunch record", consumes the record and exits 1 [SOURCE: .skilled/bin/skilled-loop:430], discarding the runtime's real exit code. A record can reach this state through a partial atomic write (impossible by design) or a hand-edited state file, but the documented decline contract says invalid relaunch state returns 1 only after a declined decision, not after an approved one. Fix: validate `typeof record.handoff === 'string' && record.handoff` and `typeof record.cwd === 'string' && record.cwd` inside `shouldRelaunch` and return `{relaunch:false, reason:'incomplete-record'}`; the wrapper then preserves the runtime exit and prints the manual claim only when a path is present.

4. **P2 — `updateFrontmatter` and `parseHandoff` disagree about whitespace before the colon, so a claim can create a duplicate key and fail.** `parseHandoff` trims the key and accepts `status : open` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:198]. `updateFrontmatter` looks for `line.startsWith(`${key}:`)` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:119], misses the spaced form, and appends a second `status:` line. The next `parseHandoff` then throws `duplicate frontmatter key`, so `claim` fails on a note the validator accepted. Fix: match `/^\s*${escapedKey}\s*:/` (or reuse the parse spans) and replace the original line in place, preserving indentation and spacing; add a claim test with `status : open`.

5. **P2 — A malformed-note fallback misreads `spec_folder: none` as invalid and drops the carried Gate 3 answer.** In `consume`, after `parseHandoff` throws, the fallback marks any non-empty `spec_folder` value invalid [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:530]. The literal `none` is a valid Gate 3 D) Skip answer [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:520], so a note with `spec_folder: none` plus any unrelated frontmatter defect loses the skip answer and logs `spec-folder-dropped`. Fix: treat the candidate as valid when it equals `none` or passes `validSpecFolder`, and only flag the invalid case otherwise; add a fallback test.

## Ruled Out

- Re-deriving the hop-cap logic: the wrapper, `prepare`, the killer and every adapter share one resolution path, and phase 008 tests cover zero, non-integer and over-cap values. No drift found.
- Treating `targetIsRunning`'s `EPERM` handling as a bug: for a target pid, `EPERM` means the pid was reused by another user, so "gone" is the correct reading.
- Rewriting the lock takeover algorithm: expiry, inode-checked release, and the 30 s/10 min sweeps match the README line for line.

## Dead Ends

- Looking for direct writes to `deep-research-state.jsonl` in the hook code: the relaunch hooks never touch the deep-research packet, so none exist.

## Edge Cases

- Ambiguous input: none. The wrapper's `$1` runtime detection and the CLI's `SKILLED_LOOP_RUNTIME` precedence were checked against each other and agree.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the stop-arm finding depends on Claude Code not exporting `CLAUDE_PID`; the repository contains no producer and the documented hook environment does not include it, but the claim is conditional on that external fact.

## Sources Consulted

- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
- .skilled/hooks/session-relaunch/lib/context-usage.cjs
- .skilled/hooks/session-relaunch/lib/nudge.cjs
- .skilled/hooks/session-relaunch/lib/killer.cjs
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs
- .skilled/hooks/session-relaunch/claude/stop-arm.mjs
- .skilled/hooks/session-relaunch/claude/context-nudge.mjs
- .skilled/bin/skilled-loop
- .claude/settings.json

## Assessment

- New information ratio: 1.0
- Questions addressed: core-vs-spec drift, core edge cases
- Questions answered: none fully; the core question is now partly covered with five concrete defects

## Reflection

- What worked and why: reading the generated hook command next to the hook source exposed the parent-process assumption that the tests hide by injecting `CLAUDE_PID`.
- What did not work and why: searching for a repo producer of `CLAUDE_PID` found only tests, which cannot settle whether Claude Code exports it; the finding records that dependency explicitly.
- What I would do differently: read the generated `.claude/settings.json` rows before the adapter sources, so process-parent assumptions are checked against the real invocation first.

## Recommended Next Focus

Adapter parity: OpenCode plugin, Pi, Codex and Hermes triggers, how each resolves its killer target and window, and whether their nudge/arm thresholds match the core contract.
