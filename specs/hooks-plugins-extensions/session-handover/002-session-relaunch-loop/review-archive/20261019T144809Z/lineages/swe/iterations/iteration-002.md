# Iteration 2: Security — trust boundaries, process control, path containment, permissions

## Dispatcher

cli-devin `swe-2-max`, fan-out lineage `swe`, session `fanout-swe-1792349322065-8lohfl`. LEAF in-process iteration 2 of 3 (max-iterations stop policy). No steer.md present at iteration start.

## Dimension

**D2 Security** — trust boundaries between hook payloads, environment variables, the filesystem state, and the processes the feature signals or relaunches. Files re-read through the security lens after the correctness pass; adapters added to scope.

## Files Reviewed

- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` (1-160, 505-717)
- `.skilled/hooks/session-relaunch/lib/killer.cjs` (120-199, 415-530)
- `.skilled/hooks/session-relaunch/lib/context-usage.cjs` (1-236)
- `.skilled/hooks/session-relaunch/lib/nudge.cjs` (1-271)
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` (60-258)
- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` (1-140)
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` (223-359)
- `.skilled/bin/skilled-loop` (120-280, 385-507)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Ancestry check and SIGTERM are separated by a pid-reuse window** — `.skilled/hooks/session-relaunch/lib/killer.cjs:449-463` — `isLoopAncestor` walks a `ps` snapshot at :449, then the killer re-reads the relaunch record (:456-457) before `process.kill(options.targetPid, 'SIGTERM')` at :463. If the target exits inside that gap and the OS recycles its pid to an unrelated same-uid process, the signal lands on the innocent process. The liveness re-check at :454 only proves the pid exists, not that it is still the session child, and nothing re-binds ancestry to the pid after the record read.
   Finding class: race-toctou
   Scope proof: killer.cjs:449 (`isLoopAncestor` gate), :454 (`targetIsRunning` liveness only), :456 (`readRelaunchFile` in between), :463 (`process.kill`).
   Affected surface hints: the only SIGTERM the feature delivers; every adapter that spawns the killer inherits it.
   Case: Claude exits during the record read and a user-spawned process takes the pid before :463 executes — SIGTERM kills the replacement process.

2. **The handoff containment boundary follows `REPO_ROOT`, not the repository** — `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:72-82` and `.skilled/hooks/session-relaunch/lib/nudge.cjs:189` — `handoffPathWithinRepo` resolves the permitted tree as `<env.REPO_ROOT>/.skilled/skills/.state/session-relaunch/handoffs`, and `plannedNotePath` resolves the write location from the same variable. Both sides move together, so the pair stays self-consistent, but the "inside the repository" guarantee documented by the feature is really "inside whatever REPO_ROOT points at". An environment that exports an unintended `REPO_ROOT` relocates the nudge's planned note and the prepare/claim validation to a different tree, and `claim` then reads a note staged under that root into the session's prompt context.
   Finding class: trust-boundary
   Scope proof: session-relaunch.cjs:73 (`process.env.REPO_ROOT ||` fallback chain), :75-82 (boundary built from that root), :296/:397/:414 (prepare, claim, complete all gate on it); nudge.cjs:189 (same root for the planned write).
   Affected surface hints: every consumer of handoff notes — prepare, claim, complete, the printed manual command.
   Case: a hook environment carries `REPO_ROOT=/tmp/work` from unrelated tooling; `prepare`/`claim` validate and read `…/handoffs/*.md` under /tmp/work while the operator believes containment is the repo.

3. **The live-shell guard fails open on any shell outside a three-name list** — `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:190-198` — `refuseForShellChild` is the guard that stops a relaunch from killing a session with running work, and it detects "live shell child" by matching `comm` basenames against `['zsh','bash','sh']`. A session running `fish`, `dash`, `ksh`, `tcsh`, `nu`, or a `bash` binary invoked under a different name is invisible to the check, so `should-relaunch`/`prepare` proceeds and the killer SIGTERMs the runtime while real work is in flight — the exact loss the guard exists to prevent.
   Finding class: protection-bypass
   Scope proof: session-relaunch.cjs:195 (`['zsh','bash','sh'].includes(processInfo.command)`), :138-148 (`comm` basename parse), :200-228 (refusal only on match).
   Affected surface hints: `prepare`/`should-relaunch` refusal path; all runtimes on shells outside the list.
   Case: the user has an interactive `fish` running inside the runtime; the guard finds no match, the record arms, and the killer kills the session and the job.

## Traceability Checks

None this iteration (traceability dimension runs in iteration 3).

## Edge Cases

- `notifyManualClaim` interpolates the manual command into AppleScript via `JSON.stringify` inside `display notification "…"` (killer.cjs:425-429): JSON escaping of `"` and `\` is compatible with AppleScript string literals, and `spawnSync` argv mode keeps the `-e` program off a shell. A `"` inside the handoff path cannot break out of the literal. Ruled clean.
- `--transcript <path>` from the hook payload reaches the killer argv verbatim (stop-arm.mjs:46), but `waitForIdle` only calls `transcriptMtime` (killer.cjs:150,156) — a stat, never a read — so an arbitrary path can distort idle timing but discloses no content. Confirmed stat-only.
- `CLAUDE_PID` → `--target-pid` (stop-arm.mjs:131): `isProcessAlive` guards `Number.isSafeInteger && >0` (relaunch-core.cjs:612-613), so a malformed value makes the killer exit rather than signal. Fail-closed.
- `manualClaimCommand` escaping (relaunch-core.cjs:521-543): `\ " $ `` ` escaped, `!` moved outside quotes, `SKILLED_LOOP_MANUAL_TEMPLATE` requires exactly one `@@HANDOFF@@` — env is the operator's own; the printed command is display-only. Ruled clean.
- `atomicWriteFile` default 0600, `ensureStateDir` pins 0700, `appendLog` re-pins 0600 with `fchmod` each append (relaunch-core.cjs:42-77,567-570): state dir, records, nudge state and log all carry private modes; a foreign-owned `/tmp/skilled-relaunch` makes `chmodSync` throw — fail-closed. Confirmed clean.
- `hasAncestor` (killer.cjs:124-135) terminates on ppid cycles via `visited` — matches the cyclic-table tests at killer.test.cjs:346-349. Clean.

## Confirmed-Clean Surfaces

- Wrapper launch path (skilled-loop:393,463-466): `exec`-style argv expansion `"${launch_arguments[@]}"`, `cd --` for record-supplied cwd, line-break rejection on `relaunch_cwd`/`handoff_path` (:435-437) — no eval or unquoted interpolation anywhere on the exec path; `shell_quote_argument` feeds only the printed manual template.
- `context-usage.cjs` transcript parsing: per-line `JSON.parse` with null-on-error, only numeric token fields consumed, `readTail` bounds reads to `tailBytes` (236) — no prototype sink, no content reuse.
- `assertValidSessionId`/`validLoopId`/`validSpecFolder` (relaunch-core.cjs:35-40,123-131) bound every id that reaches a filename or frontmatter field; `stateFilePath` re-validates `SESSION_ID_PATTERN` before joining (nudge.cjs:219-226).
- Adapter spawn paths (`stop-arm.mjs:44-48`, `session-relaunch.ts:241-245`): `spawn(process.execPath, args, {detached, stdio:'ignore'})` — argv mode, no shell.
- `appendLog` field sanitization (relaunch-core.cjs:556-563): event name regex, key/value scrubbing — no log-injection line break possible.

## Ruled Out

- Hook-payload forgery to force `arm`: payloads arrive on hook stdin from the runtime process itself; `record.sessionId !== payload.session_id` gates every arm (stop-arm.mjs:90) and the record's session id was planted by the operator's own `prepare`. Not reachable from transcript content.
- `SKILLED_LOOP_MANUAL_TEMPLATE` as an injection channel: it is read from the operator's environment and rendered into a displayed string, never executed by the program. Out of threat scope.
- Killer self-signal: `loopId` is bound to `SKILLED_LOOP_ID` (killer.cjs:490-492) and `isLoopAncestor` requires descent from it; the killer cannot target itself or its wrapper.

## Next Focus

Iteration 3: traceability + maintainability — spec/checklist evidence vs. current files, protocol overlays (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`), doc/catalog consistency, and the phase-005 remediation claims against the code actually read.

Review verdict: PASS
