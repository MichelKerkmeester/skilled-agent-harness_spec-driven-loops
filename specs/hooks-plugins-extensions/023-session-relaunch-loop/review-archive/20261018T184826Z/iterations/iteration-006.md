# Iteration 006 -- Adversarial re-verification + residual registration surfaces

## Dimension

Adversarial re-verification of the eleven open P2 advisories (`correctness` + `traceability`), plus the residual surfaces no pass has read in full: the hook-registry rows and the generated Claude/Codex settings, `.skilled/hooks/hook-flags.env.example`, and the `ENV-REFERENCE.md` switch rows, each read against the code that consumes it.

Budget profile: `verify` (evidence rereads, no new discovery direction).

## Files Reviewed

- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:19,41-45,143,309,526,554-570`
- `.skilled/hooks/session-relaunch/lib/killer.cjs:113,143,148,250,256`
- `.skilled/hooks/session-relaunch/lib/context-usage.cjs:147,164`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:13`
- `.skilled/hooks/session-relaunch/claude/context-nudge.mjs:21,23,59`
- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:78-127`
- `.skilled/hooks/session-relaunch/codex/shared.mjs:31,57,65-78`
- `.skilled/hooks/session-relaunch/codex/stop-arm.mjs:90-100`
- `.skilled/hooks/session-relaunch/hermes/context-nudge.mjs:18,57,80-87`
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:80,81,140-146,167,189,194`
- `.skilled/hooks/session-relaunch/opencode/session-relaunch.js:56,152`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:372-373`
- `.skilled/hooks/session-relaunch/README.md:101`
- `.skilled/bin/skilled-loop:98`
- `.skilled/hooks/shared/hook-flags.cjs:201`
- `.skilled/hooks/hook-flags.env.example`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:68-70,98,108-111`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1035-1109`
- `.claude/settings.json:126,192,247`
- `.codex/hooks.json`
- `.codex/hooks/README.md:11,35,38`
- `specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:143-145`
- `specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:94-104`
- Test evidence: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:592`, `claude-adapters.test.cjs:227`, `nudge.test.cjs:25`, `skilled-loop.test.cjs:18`, `session-relaunch-cli.test.cjs:26`, `killer.test.cjs:20`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings (carried; re-verified, none re-filed)

No new finding is raised this iteration. Each open advisory was re-read at its cited location and attacked for a counterexample. Result: ten confirmed, one narrowed; none refuted, none promoted.

| Finding | Cited evidence | Re-verification outcome |
|---|---|---|
| R1-P2-001 `appendLog` read-modify-write drops concurrent log lines | `[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:554]` | Confirmed. The function reads the whole log at `:568` before writing; two processes appending in the same window each rebuild from the same previous content. |
| R1-P2-002 Gate-3 Skip suffix has an unbalanced parenthesis | `[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:526]` | Confirmed and wider than first recorded: the same stray `)` is reproduced in `nudge.cjs:13`, `skilled-loop:98`, `README.md:101` and six test files, so a fix must move all ten copies together. |
| R1-P2-003 Killer aborts on an unreadable transcript | `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:113]` | Confirmed. `transcriptMtime` is a bare `fs.statSync` and its call sites at `:143` and `:148` sit in the idle wait with no `try`, so a deleted or unreadable transcript rejects out of the killer and no relaunch is armed. |
| R2-P2-001 Stale-lock takeover is not atomic | `[SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:250]` | Confirmed. `unlinkSync` at `:250` is unconditional after the earlier staleness decision, and `createLock` at `:256` re-races only `EEXIST`; a second killer already past the check can delete the winner's fresh lock and create its own, leaving two supervisors. |
| R2-P2-002 Shared-temp state-dir fallback | `[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:143]` | **Narrowed.** Spoof limb refuted: `atomicWriteFile` creates with `wx` mode `0600` and renames over a planted path, and macOS `os.tmpdir()` is per-user. Suppression limb confirmed: the directory name is the fixed `'skilled-relaunch'` (`:19`) and `ensureStateDir` `chmod 0700`s after `mkdir` (`:41-45`), so on Linux with `XDG_RUNTIME_DIR` unset a pre-created world-writable `/tmp/skilled-relaunch` makes `chmodSync` throw `EPERM`, the arm path fails closed and no relaunch is armed. Severity unchanged (P2), scope narrowed. |
| M4-P2-001 `plannedNotePath` copied into five adapters | `[SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:65]` | Confirmed at five sites: `claude/context-nudge.mjs:59`, `codex/shared.mjs:65`, `hermes/context-nudge.mjs:70-77` (inline), `opencode/session-relaunch.js:56`, `pi/session-relaunch.ts:189` (inline). Root resolution already differs: Codex takes `REPO_ROOT || payload.cwd || cwd`, the others derive from the payload directory. |
| M4-P2-002 Pi adapter re-reads config and keeps a fourth threshold copy | `[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:140]` | Confirmed. `isEnabled()` calls `loadConfigFile(configPath())` on every invocation, and Pi carries its own `DEFAULT_THRESHOLD` at `:81` plus `relaunchThreshold()` at `:167`, the fourth copy after Claude, Codex and Hermes. |
| M4-P2-003 `notePathFromSeed` has three divergent parsers | `[SOURCE: .skilled/hooks/session-relaunch/hermes/context-nudge.mjs:80]` | Confirmed. Three definitions: Hermes `:80`, Pi `pi/session-relaunch.ts:194`, OpenCode `opencode/session-relaunch.js:152`. Hermes alone also requires `prompt.startsWith(SEED_COMMAND)` (`:81`); the other two accept the marker anywhere behind an `isSeedPrompt` gate. |
| M5-P2-001 Claude stop-arm re-arms an already-armed record | `[SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:90]` | Confirmed. The gate checks only `sessionId`; `arm()` returns the existing record untouched for `status === 'armed'` (`[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:309]`), and the only pending guard in the adapter is the background-task branch, so a second Stop spawns a second killer (bounded by the live lock). |
| T3-P2-001 Checklist evidence pointers name locations that do not exist | `[SOURCE: specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:144]` | Confirmed. CHK-031 cites `.skilled/hooks/session-relaunch/lib/killer.test.cjs`; the file is `.skilled/hooks/session-relaunch/tests/killer.test.cjs`. |
| T3-P2-002 Interface contract states two opposite relaunch orders | `[SOURCE: specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:97]` | Confirmed. `:97` orders consume, hops, `cd`; the binding amendment at `:103` orders `cd` before consume. The amendment block opens at `:99` and does not mark `:97` superseded. |

## Residual Surfaces (first full read)

- **Registry vs generated settings.** `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1035]` declares six `session-relaunch` bindings, every one with `"fallback": "none"`: Claude `PostToolUse` group 3 slot 0, `UserPromptSubmit` group 0 slot 2, `Stop` group 0 slot 2 async; Codex `UserPromptSubmit` group 2 slot 0, `PostToolUse` group 2 slot 0, `Stop` group 0 slot 2. The generated rows match by event, group, slot and async flag: `[SOURCE: .claude/settings.json:126]` (UserPromptSubmit), `[SOURCE: .claude/settings.json:192]` (Stop, async), `[SOURCE: .claude/settings.json:247]` (PostToolUse), and the three `.codex/hooks.json` commands (`prompt-seed.mjs`, `context-nudge.mjs`, `stop-arm.mjs`). The six rows are the only session-relaunch rows in either file and none adds or drops a hook.
- **Declared absence of the drift fallback.** Every other Codex/Claude hook row in those files wraps its command in `|| { printf ... mk-hook-drift ...; printf <additionalContext JSON>; }`. All six session-relaunch rows omit it. That is consistent with the registry's `"fallback": "none"` for exactly these bindings, so it is declared behavior (a fail-open hook must not inject drift text into the conversation), not generation drift.
- **Switch name derivation.** `[SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:21]` and `[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:80]` both declare `CONCERN = 'session-relaunch'`, and `hook-flags.cjs:201` derives `SYSTEM_<CONCERN>_DISABLED`, i.e. `SYSTEM_SESSION_RELAUNCH_DISABLED`. `.skilled/hooks/hook-flags.env.example` lists exactly that flag, `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:98]` documents it, and the example's header claim that the file is read by `hook-flags.{cjs,mjs,ts,sh}` is the shared loader the adapters call through `isHookEnabled`.
- **Documented tunables vs code.** `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:108]` states `SESSION_RELAUNCH_THRESHOLD` default `0.80`; the four `DEFAULT_THRESHOLD` constants are `0.8` (claude `:23`, codex/shared `:31`, hermes `:18`, pi `:81`). `:109` `SESSION_RELAUNCH_WINDOW_TOKENS` is read at `[SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:147]` and `:164` (and consumed by `resolveWindow` in every adapter), not only by tests. `:110` `SESSION_RELAUNCH_MAX_HOPS` default 10 and `:111` `SESSION_RELAUNCH_MAX_AGE_MIN` default 10 match `[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:372]` and `:373`.
- **Codex mirror documentation.** `.codex/hooks/README.md:35,38` lists the three session-relaunch adapters and the `--no-daemon` constraint; both match `.codex/hooks.json` and the wrapper behavior already reviewed in D5.

## Traceability Checks

- `agent_cross_runtime` (overlay): re-run at the row level (event, group, slot, async, fallback) rather than the index level used in D3 -- pass; the earlier pass is re-confirmed.
- `spec_code` (core): partial -- sections 11.10-11.11 of the interface contract remain unread; no code claim in this iteration depends on them.
- `checklist_evidence` (core): partial -- T3-P2-001 remains the standing pointer defect; the task lists were read only at `tasks.md:143-145`.
- `skill_agent`, `feature_catalog_code`, `playbook_capability` (overlays): carried partial; no new evidence this iteration.

## Edge Cases

- R2-P2-002's accepted evidence is the Linux path only; on macOS `os.tmpdir()` is per-user, so the finding is platform-conditional. Recorded rather than inflated to a platform-independent claim.
- `"fallback": "none"` is inferred to mean "no drift notification by design" from the registry's own row and the behavior of every other concern; if the generator cannot express a fallback for node hooks at all, the parity result still holds because the generated rows are byte-consistent with the declaration.
- T3-P2-001 and T3-P2-002 were re-confirmed but not repaired: review target is read-only and repair belongs to a follow-up pass.

## Confirmed-Clean Surfaces

Registry parity, generated-settings parity, the drift-fallback declaration, the derived kill-switch name across example/ENV-REFERENCE/code, and all four `SESSION_RELAUNCH_*` tunables documented against their read sites. `SESSION_RELAUNCH_WINDOW_TOKENS` is live in production code, not test-only.

## Ruled Out

- Generated settings drifting from the hook registry: refuted; all six rows match by event, group, slot and async, and the registry declares no other session-relaunch binding.
- The missing `mk-hook-drift` wrapper on the six session-relaunch rows being drift: refuted by `"fallback": "none"` on exactly those bindings.
- `ENV-REFERENCE.md` documenting a dead `SESSION_RELAUNCH_WINDOW_TOKENS` switch: refuted at `context-usage.cjs:147,164`.
- `hook-flags.env.example` naming a flag the code never derives: refuted; `CONCERN = 'session-relaunch'` derives the documented name.
- The `SESSION_RELAUNCH_THRESHOLD` documented default (0.80) disagreeing with code: refuted; four copies, all 0.8.

## Integration Evidence

Exact surfaces checked: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `.claude/settings.json`, `.codex/hooks.json`, `.codex/hooks/README.md`, `.skilled/hooks/hook-flags.env.example`, `.skilled/hooks/shared/hook-flags.cjs`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.skilled/hooks/session-relaunch/lib/context-usage.cjs`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`.

## Next Focus

- Dimension: synthesis / adjudication (all four dimensions are covered; this was the adversarial re-verification pass).
- Focus area: reconcile strategy section 14, the findings registry and the dashboard; no new code direction remains.
- Reason: zero new findings and zero severity changes give `newFindingsRatio` 0.0, below the 0.10 convergence threshold; no P0/P1 is active.
- Rotation status: post-coverage; dimension rotation complete.
- Blocked/productive carry-forward: T3-P2-001 and T3-P2-002 carried (packet docs re-read but not repaired); R2-P2-002 narrowed; SL-208 remains deferred.
- Required evidence: reducer-refreshed registry and dashboard, plus the two carried packet-doc findings.
- Recovery note: none; iteration state is coherent.

## Verdict

PASS with advisories: no P0, no P1, eleven P2 open (ten confirmed, one narrowed, none refuted, none re-filed).

Review verdict: PASS
