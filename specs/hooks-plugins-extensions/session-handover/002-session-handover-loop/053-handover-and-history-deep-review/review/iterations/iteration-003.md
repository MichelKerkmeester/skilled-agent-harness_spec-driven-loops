# Iteration 3: Traceability

## Dispatcher

- Iteration 3 of 5, mode review, dimension traceability, run 3 of session `2026-11-17T06:46:29Z` (generation 3, lineage restart).
- Focus came from the strategy's Next Focus: `spec_code` and `checklist_evidence` for the hook docs against the code, plus the Codex `handover-prompt-seed.mjs` and `nudge.seedInstructions` note-path derivation that iteration 2 did not reach.
- Operator focus (handover logic and history search across every runtime): this pass checked the per-runtime withdraw, arm and seed paths of Claude, Codex, OpenCode, Pi and Vibe against `state-files.md` and `runtime-behavior.md`. History search was covered in iterations 1 and 2 and was not re-entered.

## Files Reviewed

- `.skilled/hooks/session-handover/state-files.md:27-104`
- `.skilled/hooks/session-handover/runtime-behavior.md:22-156`
- `.skilled/hooks/session-handover/codex/handover-prompt-seed.mjs:1-16`
- `.skilled/hooks/session-handover/codex/shared.mjs:55-108`
- `.skilled/hooks/session-handover/lib/withdraw.cjs:1-99`
- `.skilled/hooks/session-handover/lib/nudge.cjs:379-425`
- `.skilled/hooks/session-handover/lib/context-usage.cjs:372-379`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:38`
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:80-119`
- `.skilled/hooks/session-handover/opencode/session-handover.js:306-316,527`
- `.skilled/hooks/session-handover/pi/session-handover.ts:676-690`
- `.skilled/hooks/session-handover/claude/handover-context-nudge.mjs:66-77`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:711-713`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`state-files.md` leaves Vibe out of the runtimes whose operator prompt withdraws a record** -- .skilled/hooks/session-handover/state-files.md:43 -- The Relaunch Status section says a new turn ends an armed or deferred record with reason `user-message` "on Pi and OpenCode", and an operator prompt does the same "on Claude and Codex". Vibe is not named. Vibe does the same withdraw: `withdrawOnOperatorPrompt` calls `withdraw.withdrawHandOver` with `reason: 'user-message'` and the default deferred policy (`vibe/handover-parts.mjs:97-117`). The same document's Hop History section already lists Vibe for the `withdrawn` line (`state-files.md:100`), so the file contradicts itself. Someone who reads the disarm reasons to explain a Vibe `user-message` record finds no runtime that produces it.
   Finding class: doc-code drift, enumeration omission.
   Scope proof: one sentence in `state-files.md`; every adapter's withdraw call was read (`codex/shared.mjs:64-78`, `claude/handover-context-nudge.mjs:66-77`, `opencode/session-handover.js:306-316`, `pi/session-handover.ts:682-688`, `vibe/handover-parts.mjs:102-117`), and Vibe is the only runtime missing from line 43.
   Affected surface hints: `.skilled/hooks/session-handover/state-files.md:43`; cross-check `README.md` and `vibe` docs for the same list.
   Case: an operator types a prompt in a Vibe session under `skilled-loop` after a turn end armed the record, finds `disarmReason: user-message` in the relaunch record, and `state-files.md:43` names no Vibe path that writes it.

## Traceability Checks

- `spec_code` (partial): checked these doc claims against code, and each one held except the P2 above.
  - Withdraw writes a `withdrawn` hop-history line and grants one re-arm nudge (`state-files.md:67,100`), as `lib/withdraw.cjs:80-89` does.
  - `cancelled` and `user-message` map to `withdrawn` in `should-relaunch` (`state-files.md:45`), from `relaunch-core.cjs:38`.
  - Codex `UserPromptSubmit`: a seed prompt gets claim instructions, and any other prompt withdraws first, then runs the threshold check (`runtime-behavior.md:83`). This matches `codex/shared.mjs:103-108` and `codex/handover-prompt-seed.mjs:16`.
  - Codex fill: the numerator is `last_token_usage.input_tokens`, without `cached_input_tokens`. The window comes from the env first, then from `model_context_window` (`runtime-behavior.md:87`). This matches `context-usage.cjs:372-379`.
  - The deferred-Stop `systemMessage` text (`runtime-behavior.md:91`) is present in `codex/handover-stop-arm.mjs`.
  - OpenCode arms on `session.idle` (`state-files.md:39`), at `opencode/session-handover.js:527`.
  - Not reached: `handoff-protocol.md`, `goal-carry-over.md`, `troubleshooting.md`, and the per-runtime READMEs.
- `checklist_evidence` (notApplicable): the review target is a set of files with no checklist. Neither the hook folder nor this review packet holds a `checklist.md` or `acceptance-criteria.md`; the packet has `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`.
- `agent_cross_runtime` (partial): the withdraw path is one shared call (`withdraw.withdrawHandOver`) in all five adapters, with the same reason and the default `deferred` pending policy. The relaunch-log event name differs: Claude, Codex and Vibe log `withdrawn`, while Pi and OpenCode log `arm-cancelled` (`opencode/session-handover.js:315`, `pi/session-handover.ts:373`). The docs do not name these relaunch-log events, so this is not drift.

## Integration Evidence

- Seed path to the handoffs-dir gate, the item carried from iteration 2: `nudge.seedInstructions` (`nudge.cjs:403-412`) only parses the seed through `core.parseClaimSeed` and builds the claim command text. It reads no file. The path reaches the file system only when the model runs `claim`, and `claim` applies `handoffPathWithinRepo` to its positional path first (`bin/session-handover.cjs:711-713`). So the seed path goes through the same gate as every other note path.

## Edge Cases

- A seed whose note path does not parse yields `null`, and every adapter then adds nothing (`nudge.cjs:400-405`). That is a quiet no-op, not a misleading command.
- Pi and OpenCode use the relaunch-log name `arm-cancelled` where the other three use `withdrawn`. Anyone grepping `relaunch.log` for withdrawals across runtimes needs both names. This is recorded as an observation, not a finding, because no doc promises one name.

## Confirmed-Clean Surfaces

- `lib/withdraw.cjs`: the disarm is guarded and locked, and both follow-ups (re-arm, history) are best-effort, so neither can undo the withdrawal (`withdraw.cjs:64-90`).
- `codex/handover-prompt-seed.mjs`: a thin entry point over `runCodexAdapter('UserPromptSubmit')`, as `runtime-behavior.md:85` describes.

## Ruled Out

- Seed note path bypassing the handoffs-dir gate: the seed is text only, and `claim` gates the path (`session-handover.cjs:713`).
- Codex fill counting cached tokens twice: `cached_input_tokens` is not read (`context-usage.cjs:372`).

## Next Focus

- Dimension: maintainability
- Focus area: the size of `relaunch-core.cjs` and `nudge.cjs`, near-duplicate withdraw and log blocks in the five adapters, and `spec_code` for `handoff-protocol.md`, `goal-carry-over.md`, `troubleshooting.md` and the per-runtime READMEs, which this pass did not reach.
- Reason: three of four dimensions are done, and `spec_code` is still partial.
- Rotation status: correctness, security and traceability done (3/4).
- Blocked/productive carry-forward: productive = enumerate every adapter's call to one shared function, then diff the doc's runtime list against that inventory.
- Required evidence: file:line for every duplication claim and every doc claim checked.

Review verdict: PASS
