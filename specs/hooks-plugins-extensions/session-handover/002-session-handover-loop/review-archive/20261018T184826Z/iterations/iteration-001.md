# Review Iteration 1 - Correctness (inventory pass)

## Dispatcher

- Resolved route: mode=review, target_agent=deep-review, single review iteration, externalized state.
- Review target: `specs/hooks/023-session-relaunch-loop` (spec-folder).
- Dimension: correctness, inventory pass first: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`, `.skilled/hooks/session-relaunch/lib/killer.cjs`, `.skilled/bin/skilled-loop`, with their tests.
- Budget profile: scan/verify hybrid; discovery capped at 13 tool calls.

## Dimension

D1 Correctness: state transitions, invariants, edge cases and contract-observable behavior of the relaunch core, CLI, killer and wrapper.

## Files Reviewed

- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` (597 lines, full read)
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` (503 lines, full read)
- `.skilled/hooks/session-relaunch/lib/killer.cjs` (404 lines, full read)
- `.skilled/bin/skilled-loop` (507 lines, full read)
- `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` (test-name inventory plus appendLog and manual-command sections)
- `.skilled/hooks/session-relaunch/tests/killer.test.cjs` (test-name inventory plus lock, transcript and timeout sections)
- `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` (test-name inventory)
- `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` (test-name inventory)
- `specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md` sections 4, 7, 9 and 11.5-11.11 as the binding behavior source

## Findings by Severity

### P0 Findings

None. No active P0.

### P1 Findings

None. No active P1.

### P2 Findings

1. **appendLog is a whole-file rewrite, not an append, so concurrent writers lose a line** - [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:554] - `appendLog` reads the full `relaunch.log`, concatenates the new line and atomically renames the temp file over it. Two overlapping callers both read the same previous content; the later rename silently drops the earlier line. The killer is a detached concurrent writer ([SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:74]) while the CLI logs prepare, relaunch and decline from hooks inside the runtime ([SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:353]).
   Case: the killer logs `killer-signal` in the same second the CLI logs `relaunch` or `decline`; one of the two lines is missing from the operator-visible history.
   Finding class: concurrency lost-update.
   Scope proof: only the four declared core files; `appendLog` is the sole writer of `relaunch.log` and every caller passes through it.
   Affected surface hints: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, callers in `bin/session-relaunch.cjs`, `lib/killer.cjs`, and the claude/codex/hermes adapters.
   Evidence and counterevidence: the contract promises it "appends exactly one line" ([SOURCE: specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:68]); the lock-free IO posture only sequences writers of one relaunch file, not the log ([SOURCE: specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:88]). Only sequential appends are tested ([SOURCE: .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:554]). P2 because the log is diagnostic and no relaunch decision reads it.

2. **The Gate-3 Skip seed suffix has an unbalanced parenthesis and is duplicated across contract, both printers, README and tests** - [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:526] and [SOURCE: .skilled/bin/skilled-loop:98] - the suffix reads ` | Spec folder: none (Gate 3 answered D) Skip in the sending session)`, with a stray closing parenthesis after the sentence.
   Case: a handoff note with `spec_folder: none` produces that text in the manual claim command and in the relaunch seed; the stray `)` is copied into operator terminals and into the receiving session's prompt.
   Finding class: user-facing output text defect.
   Scope proof: two string literals plus their docs/tests; no control flow or state change.
   Affected surface hints: `manualClaimCommand` in relaunch-core.cjs, `print_manual_command`/`spec_folder_suffix` in skilled-loop, `README.md`, the CLI/killer test constants and the contract.
   Evidence and counterevidence: the malformed string is mandated by the contract ([SOURCE: specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:199]), so the code is faithful and the fix needs a contract amendment first. P2: cosmetic, behavior unchanged.

3. **The killer aborts on an unreadable transcript instead of failing open** - [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:113] - `transcriptMtime` calls `fs.statSync` with no ENOENT/EACCES handling, and `waitForIdle` calls it on every poll ([SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:130]).
   Case: the transcript path named in the hook payload is removed, rotated or made unreadable while the killer waits; the next poll throws, `main().catch` logs `killer-error` and exits 1 without unarming or notifying, so the armed record is never acted on and the context-limit hop falls back to compaction.
   Finding class: error handling, fail-open gap.
   Scope proof: only the killer transcript polling path inside the declared core scope.
   Affected surface hints: `lib/killer.cjs` waitForIdle/transcriptMtime; the claude, codex and pi spawners that pass `--transcript`.
   Evidence and counterevidence: the packet states an explicit fail-open posture for transcript reads in the sibling context path ([SOURCE: specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:88]) but does not require it here. During a live session the runtime normally owns and keeps the transcript, and auto-compaction remains the documented fallback when a hop fails, so this stays P2 rather than P1.

## Traceability Checks

- `spec_code` (core): partial. The four core files match interface-contract sections 4 (record transitions), 7 (wrapper argv/exit codes/130 and decline paths), 9 (killer anchors, lock, timeout) and 11.5-11.9 (manual command, model/provider/extension/name carry, spec-folder suffix, supersede) on every checked claim except the three findings above.
- Contract self-inconsistency (not a code finding): the section 7 opening says "consume, increments hops, cd to the recorded cwd" while the binding amendment says the wrapper changes to the recorded cwd before it consumes. The code follows the amendment; the opening sentence should be reconciled in the traceability iteration.
- `checklist_evidence` (core): not checked this iteration (deferred to D3).

## Integration Evidence

Named surfaces checked: `specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md` sections 4, 7, 9 and 11.5-11.11. No command, skill, agent or mirror traceability claim is made in this iteration.

## Edge Cases

- Killer lock TOCTOU: two killers that both observe a stale lock can interleave unlink/create; the 5 s fresh-lock window narrows but does not eliminate the race. Not raised as a finding yet because the second killer's armed-record re-read keeps the outcome at one effective SIGTERM in practice; carried to D2 process-safety review.
- `targetIsRunning` throws on EPERM while `isProcessAlive` treats EPERM as alive ([SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:103], [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:200]). A reused pid owned by another user would log `killer-error`, but the observed impact is a log line only because the runtime has already exited; ruled out as a finding.
- Relaunch argv intentionally carries only model/provider/extensions/name plus the seed, so first-launch flags are dropped after a hop. This is binding behavior per contract 11.6-11.7 and is asserted by the wrapper tests; ruled out as a defect.
- `manualClaimCommand` reads `process.env` for the manual template instead of an injected env, unlike the rest of the core API. Production callers run in-process so behavior is correct; recorded as a maintainability candidate for D4, not a correctness finding.

## Confirmed-Clean Surfaces

- Relaunch record lifecycle: preparePending pending write, arm pending-to-armed idempotence, unarm with expected status/handoff, and shouldRelaunch age/hop guards all match contract section 4 and their unit tests.
- Handoff lifecycle: validateHandoff open/session/section checks, claim open-to-claimed, complete claimed-to-done, and supersede excluding the current note and scoping by `claimed_by` match contract 11.8-11.9.
- CLI exit codes: prepare 3 outside the loop, 0 inside, 2 on refusal; should-relaunch 0/1 with one JSON line on every path; consume 0; wrapper preserves the runtime exit code except the documented invalid-state 1 and the 130 path.
- Killer safety anchors: loop id > 1, `SKILLED_LOOP_ID` must match, target must descend from the loop id, the armed record is re-read immediately before SIGTERM, ESRCH exits quietly, and the 5 s post-SIGTERM grace is independent of the 30 s idle deadline.
- Manual command quoting: backslash, double quote, dollar, backtick and bang escaping agree between core and wrapper, including the single-token template fill and the byte-equal test cases.

## Ruled Out

- Dropping non-carried argv on relaunch: documented intended behavior (contract 11.6-11.7); not a defect.
- `targetIsRunning` EPERM inconsistency: no observable outcome change (see Edge Cases).
- `appendLog` O(n) whole-file cost as a standalone finding: bounded by the 10-hop cap and event count; folded into finding 1.
- Shell-function ordering or `start_directory` timing in the wrapper: `start_directory` is set before any scan that resolves pi extensions; no defect found.

## Next Focus

- Dimension: security (D2).
- Focus area: killer process targeting and lock safety (ancestor check, pid reuse, stale-lock TOCTOU, state-dir permissions), handoff path containment and symlink handling, seed/manual-command escaping boundaries, and `SKILLED_LOOP_*` environment trust.
- Reason: D1 found no P0/P1; the strategy names the killer signalling path as the highest-risk remaining surface.
- Rotation status: D1 complete (PASS, 3 P2 advisories).
- Required evidence: `lib/killer.cjs`, `bin/session-relaunch.cjs` (`handoffPathWithinRepo`, `refuseForShellChild`), `lib/relaunch-core.cjs` (`stateDir`, `relaunchFilePath`, `manualClaimCommand`), contract sections 9 and 11.10-11.11.
- Blocked/productive carry-forward: lock TOCTOU and EPERM edge cases carried from D1.

Review verdict: PASS
