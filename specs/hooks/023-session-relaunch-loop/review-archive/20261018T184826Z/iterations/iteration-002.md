# Review Iteration 2 - Security

## Dimension

Security (D2 of 4): killer process targeting and lock safety, handoff path containment, seed and manual-command shell escaping, relaunch state-directory trust, and the adapter payload surface.

## Dispatcher

Resolved route: mode=review, target_agent=@deep-review, single review iteration, state from externalized files. Run `2026-10-18T12:41:21.177Z`, generation 1, lineage `new`.

## Files Reviewed

| File | Anchors |
|---|---|
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | 105, 162, 191, 212, 231, 239-256, 322, 336, 368, 383 |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | 34, 41, 142-143, 519 |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | 71, 96, 106, 123, 190, 200 |
| `.skilled/bin/skilled-loop` | 42-46, 134, 152, 231, 440, 494 |
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | 206, 216, 257 |
| `specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md` | 22, 126, 129-130 |
| `.claude/hooks/`, `.codex/hooks/`, `.opencode/plugins/session-relaunch.js:250`, `.pi/extensions/session-relaunch.ts:265`, `.skilled/hooks/session-relaunch/hermes/` | static pattern sweep only, not a line audit |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Stale-lock takeover is not atomic; two killers can both supervise and double-signal** -- `.skilled/hooks/session-relaunch/lib/killer.cjs:250` -- On `EEXIST`, `acquireLock` reads the owner pid, decides the lock is stale, then calls `fs.unlinkSync(lockPath)` without confirming the path still names that stale lock before creating its own. A second killer that made the same decision in the same window unlinks the first killer's freshly created lock and creates its own, so both run `supervise()` for the same loop id.
   Case: two killer processes start within the takeover window while a dead killer's lock file remains; both read the dead owner, both pass `isProcessAlive`, and the second unlink removes the first fresh lock.
   Evidence: `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:250]`, `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:256]`; contract 9 line 129 prescribes the same remove-and-retry sequence.
   User impact: duplicate SIGTERM, duplicate `killer-lock-stale`/`killer-signal` log lines and duplicate desktop manual-claim notifications. No wrong-process signal: `isLoopAncestor` (line 322), the liveness re-check and the armed-record re-read still precede each kill, and the loser's `--target-pid` is the already-exiting runtime.
   Finding class: instance-only.
   Scope proof: `acquireLock` is the only stale-lock takeover site and `createLock` its only atomic primitive; no second lock producer exists in the lib.
   Affected surface hints: killer lock takeover, killer supervisor, relaunch log, manual-claim notification.

2. **Shared-temp state-directory fallback lets another local user pre-create the lock or record and suppress or spoof the killer** -- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:143` -- `stateDir` resolves to `XDG_RUNTIME_DIR || os.tmpdir()`; on a Linux host or container without `XDG_RUNTIME_DIR` that is shared `/tmp`. `prepare` fails closed because `ensureStateDir` chmods `0700` and loses to a foreign owner, but the killer's own `mkdirSync` at `killer.cjs:368` accepts a pre-existing attacker-owned directory, and `acquireLock` treats a fresh lock file as held. A pre-created `killer-<loopId>.lock` with a live owner pid makes the killer log `killer-lock-held` and exit without supervising.
   Case: another local user pre-creates `/tmp/skilled-relaunch` plus a fresh lock (and optionally `relaunch-<loopId>.json`) before the context-limit relaunch fires; the watchdog never signals and the timeout path can be fed a spoofed handoff path for the notification.
   Evidence: `[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:143]`, `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:368]`, `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:239]`; contract line 22 documents the fallback but not ownership verification.
   User impact: local denial of the relaunch watchdog (the session stops at the context limit instead of hopping) and spoofed manual-claim notifications. No code execution: the manual command escapes the path and re-validates `spec_folder`.
   Finding class: instance-only.
   Scope proof: `stateDir` is the sole producer of the directory; `ensureStateDir` is the only mode-enforcing writer, and the killer bypasses it.
   Affected surface hints: state-directory resolution, killer lock acquisition, relaunch record, manual-claim notification.

## Traceability Checks

- `spec_code` - partial. D2 verified the security behavior against contract section 9 anchors (state dir line 22, ancestry line 126, lock lines 129-130); sections 11.10-11.11 and the packet docs were not re-read this pass.
- `checklist_evidence` - not checked (deferred to D3).

## Integration Evidence

- `.skilled/bin/skilled-loop:231` produces `SKILLED_LOOP_MANUAL_TEMPLATE` and exports `SKILLED_LOOP_ID`/`SKILLED_LOOP_RUNTIME`; `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:71` validates the handoff path and writes the record; `killer.cjs` re-reads the record and calls `core.manualClaimCommand` for the timeout notification. The CLI printer and the killer are the two consumers of the same command builder.
- Contract section 9 (`interface-contract.md:126`, `:129`, `:130`) is the binding killer surface: ancestry anchor, lock takeover, and the 5-second creating window.

## Edge Cases

- Contract line 129 prescribes the non-atomic takeover, so finding 1 is both a code defect and a contract defect; a fix needs a contract amendment plus a compare-and-delete in `acquireLock`.
- Finding 2 applies only where `XDG_RUNTIME_DIR` is unset and `os.tmpdir()` is shared; macOS per-user `TMPDIR` and systemd `/run/user/<uid>` are unaffected.
- Adapter payload handling was covered by a static pattern sweep only. Two `spawn(` sites remain unaudited (`.pi/extensions/session-relaunch.ts:265`, `.opencode/plugins/session-relaunch.js:250`); carried to D3/D4.
- `consume` and `should-relaunch` do not require `SKILLED_LOOP_ID` to equal `--loop-id`; the same-user boundary makes this a robustness gap, not a security finding (recorded under Ruled Out).

## Confirmed-Clean Surfaces

- Manual-command escaping: `manualClaimCommand` escapes `\ " $ ` and `!` and validates `spec_folder`; the wrapper repeats the escape set and single-quotes every non-seed argument; the relaunch seed is passed as an argv element, never spliced into a shell string.
- Path containment: `handoffPathWithinRepo` rejects relative escape and realpaths the directory, the parent and the existing file.
- Kill targeting: `isLoopAncestor` (lines 162/322), `SKILLED_LOOP_ID` equality, `targetIsRunning` and the armed-record re-read compose the target gate; the ancestry refusal is exercised by `.skilled/hooks/session-relaunch/tests/killer.test.cjs:257`.
- Notification: `osascript` is spawned with an argv array and the notification text is `JSON.stringify`-quoted, so a handoff path cannot close the AppleScript string.
- Logging: `appendLog` validates the event name and strips whitespace and `=` from field values, blocking forged log lines.
- Adapter sweep: no `eval`, `new Function`, `exec*`, `shell: true` or direct `process.kill` in `.claude/hooks`, `.codex/hooks`, `.opencode/plugins/session-relaunch.js`, `.pi/extensions/session-relaunch.ts` or `.skilled/hooks/session-relaunch/hermes`.

## Ruled Out

- PID reuse between the ancestry check and SIGTERM: the window is one synchronous record read; SIGTERM is same-user-bounded and portable Node lacks a pidfd identity check. Residual risk accepted. `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:322]`, `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:336]`.
- `SKILLED_LOOP_MANUAL_TEMPLATE` injection: wrapper-produced, exactly one `@@HANDOFF@@` token required, seed escaped before substitution.
- `osascript` notification injection: argv spawn plus JSON quoting.
- Library-level `claimHandoff`/`completeHandoff` without containment: the exported core functions are reached through the CLI that validates first, and the state record's handoff path was validated at `prepare`.
- Adapter shell injection: the static sweep found no shell/eval surface; the two `spawn(` sites are the killer launch path.
- `targetIsRunning` EPERM behavior: unchanged from the D1 rule-out (no observable outcome change).

## Next Focus

- Dimension: traceability (D3).
- Focus area: `spec_code` and `checklist_evidence` against `spec.md`, `tasks.md` and `acceptance-criteria.md`; reconcile the section 7 consume/cd ordering self-inconsistency; verify runtime parity claims (Claude settings, Codex hooks.json, Pi extension, OpenCode plugin, Hermes plugin) against the hook registry and the feature catalog/playbook entries.
- Required evidence: interface-contract sections 4/7/9/11.5-11.11, `spec.md`, `tasks.md`, `acceptance-criteria.md`, `hook-registry.json`, `feature-catalog/context-preservation/session-relaunch-loop.md`, manual-testing-playbook `session-relaunch-*` pages.
- Carry-forward: adapter payload line-audit for `.pi/extensions/session-relaunch.ts:265` and `.opencode/plugins/session-relaunch.js:250`.

## Verdict

PASS. No active P0 or P1; two new P2 advisories (R2-P2-001, R2-P2-002). The three D1 P2 findings remain open and unchanged.

Review verdict: PASS
