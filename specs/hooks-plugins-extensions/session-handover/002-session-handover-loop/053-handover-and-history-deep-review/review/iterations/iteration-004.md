# Iteration 004: Maintainability

## Dispatcher

- Run: 4 of 5, session `2026-11-17T06:46:29Z`, generation 3, lineage `restart`.
- Dimension: maintainability. Executor: cli-claude-code, `claude-opus-5-5`.
- Iteration number derived from the state log: 3 distinct `type:"iteration"` records (1, 2, 3; iteration 1 recorded twice by its retry), so this is iteration 4, matching the dispatch.
- Operator focus: covered by enumerating the one call every runtime makes to the shared withdraw helper (Claude, Codex, OpenCode, Pi, Vibe and the `cancel` command), comparing how each adapter wraps it, and checking the protocol doc's withdrawal claims against those six call sites. History readers were covered in iterations 1-3 and not re-entered.

## Files Reviewed

- `.skilled/hooks/session-handover/lib/withdraw.cjs:21-91`
- `.skilled/hooks/session-handover/claude/handover-context-nudge.mjs:45-79`
- `.skilled/hooks/session-handover/codex/shared.mjs:48-80`
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:54-119`
- `.skilled/hooks/session-handover/opencode/session-handover.js:302-320`
- `.skilled/hooks/session-handover/pi/session-handover.ts:371-374,668-700`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:922`
- `.skilled/hooks/session-handover/handoff-protocol.md:111-181`
- `.skilled/hooks/session-handover/state-files.md:94-100`
- `.skilled/hooks/session-handover/codex/README.md:37`
- Line counts of `lib/`, `bin/`, the adapters, `history/lib/navigator.ts` and `.skilled/bin/skilled-loop`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The withdraw-on-prompt wrapper is hand-copied into five adapters, and the OpenCode and Pi copies drop the follow-up error reporting** -- .skilled/hooks/session-handover/opencode/session-handover.js:306 -- `withdrawHandOver` takes an `onError(stage, error)` callback so a failed `rearm` (the extra nudge) or `history` (the `withdrawn` hop line) follow-up is reported (`lib/withdraw.cjs:51-52,73-89`). The Claude, Codex and Vibe copies of the wrapper pass it and log `context-nudge-error` with the stage, and log a throw as `stage: 'withdraw'` (`claude/handover-context-nudge.mjs:68-74`, `codex/shared.mjs:69-76`, `vibe/handover-parts.mjs:108-114`). The OpenCode copy (`opencode/session-handover.js:308-319`) and the Pi copy (`pi/session-handover.ts:683-688,697-699`) pass no `onError` and swallow a throw with a bare `catch`, so on those two runtimes the same failure leaves no log line. The three Claude/Codex/Vibe bodies are near-identical (about 20 lines each), and Vibe passes `pending: 'deferred'`, which is already the helper default (`lib/withdraw.cjs:59`). The success log also splits by design: `withdrawn` on Claude/Codex/Vibe, `arm-cancelled` on OpenCode/Pi (documented at `handoff-protocol.md:115,177`). One shared wrapper, or an adapter-side reporter passed to every call, would keep the five in step.
   Finding class: cross-adapter duplication with divergent error reporting.
   Scope proof: every `withdrawHandOver` call site in the hook folder was enumerated (five adapters plus `bin/session-handover.cjs:922`); only OpenCode and Pi omit `onError`, and no doc promises error logging for them (`codex/README.md:37` documents it for Codex only).
   Affected surface hints: `.skilled/hooks/session-handover/opencode/session-handover.js:306-320`, `.skilled/hooks/session-handover/pi/session-handover.ts:683-699`, `.skilled/hooks/session-handover/lib/withdraw.cjs:55-91`.
   Case: on OpenCode or Pi under skilled-loop, an operator message withdraws an armed record but the hop-history append fails; the record is disarmed, the history has no `withdrawn` line, and the debug log holds only `arm-cancelled`, while the same failure on Claude logs `context-nudge-error stage=history`.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `handoff-protocol.md:115`, `handoff-protocol.md:177`, `bin/session-handover.cjs:922`, `opencode/session-handover.js:308`, `pi/session-handover.ts:683` | `handoff-protocol.md` withdrawal claims hold: all five adapters and `cancel` call `lib/withdraw.cjs`, `cancel` uses reason `cancelled` with `pending: 'any'`, Claude/Codex/Vibe log `withdrawn` and OpenCode/Pi log `arm-cancelled` as documented. `goal-carry-over.md`, `troubleshooting.md` and the per-runtime READMEs beyond `codex/README.md:37` were not reached; stays partial. |
| `checklist_evidence` | notApplicable | — | The target is source and hook docs, not a spec packet with a checklist. |

## Integration Evidence

- Shared helper `lib/withdraw.cjs` `withdrawHandOver`, called from `claude/handover-context-nudge.mjs:63`, `codex/shared.mjs:64`, `vibe/handover-parts.mjs:102`, `opencode/session-handover.js:308`, `pi/session-handover.ts:683`, `bin/session-handover.cjs:922`.

## Edge Cases

- Size: `lib/relaunch-core.cjs` is 2641 lines, `.skilled/bin/skilled-loop` 1635, `bin/session-handover.cjs` 1025, `lib/nudge.cjs` 985. Size alone names no failing case, so it is recorded here, not as a finding.
- The `withdrawn` vs `arm-cancelled` log split is documented, so it is not doc drift; it is folded into the finding only as a symptom of the copies.

## Confirmed-Clean Surfaces

- `handoff-protocol.md:115` runtime list against the six call sites.
- `withdraw.cjs` follow-ups: a failing `onError` cannot undo the withdrawal (`lib/withdraw.cjs:73-79`).

## Ruled Out

- Doc drift in the withdrawal log event names: documented at `handoff-protocol.md:115,177`.
- `cancel` bypassing the shared helper: it calls it (`bin/session-handover.cjs:922`).

## Next Focus

- Dimension: maintainability (second pass) or cross-reference fallback.
- Focus area: `spec_code` for `goal-carry-over.md`, `troubleshooting.md` and `claude/`, `pi/`, `bin/`, `lib/` READMEs against code.
- Reason: `spec_code` still partial; these docs are unread.
- Rotation status: all four dimensions now covered (4/4).
- Blocked/productive carry-forward: productive = enumerate every call site of one shared function, then diff the doc's claims against that inventory.
- Required evidence: file:line for every doc claim checked.

Review verdict: PASS
