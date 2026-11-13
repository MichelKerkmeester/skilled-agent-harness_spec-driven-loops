# Deep Review — Iteration 003

## Dispatcher

- Command: `/deep:review` (loop owner, `.skilled/commands/deep/review.md`), dispatching `@deep-review` once per iteration.
- Mode: `review`; execution: single review iteration; state source: externalized files.
- Session: `2026-11-13T04:30:08Z`, generation 1, lineage `new`; run 3 of max 3 (stop policy `max-iterations`).
- Review target: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume` (type `spec-folder`).
- Budget profile: `verify`; full reads of the three central modules plus the README, and an adversarial reread of the active P1's producer/consumer pair.
- Prior state: P0=0 P1=1 P2=6; correctness, security and traceability recorded, maintainability pending.
- Dimension note: the dispatch assigns maintainability (D4), the remaining correctness of `lib/nudge.cjs`, `bin/session-relaunch.cjs`, the test suites and the README, and an adversarial recheck of the active P1. No exhausted direction was re-entered.

## Dimension

Maintainability (D4) with a correctness closing pass: duplicated switch-resolution rules, documentation accuracy, the nudge/CLI/test surfaces, and the active P1's event-name inference.

## Files Reviewed

- `.skilled/hooks/session-relaunch/lib/nudge.cjs:1-800` (full read; command builders, frontmatter template, seed text, switch resolution, nudge decision, state and re-arm helpers).
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:1-940` (full read; parser, containment, prepare/keep/claim/complete/consume/cancel/history/window, help table).
- `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:1-232` (full read; start claim, compaction pointer, fork checks, emit envelope).
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:60-89,1465-1519` (event policy table, `payloadEventName`, entrypoint check; the P1 producer).
- `.skilled/hooks/session-relaunch/README.md:1-218` (trigger matrix, handoff protocol, goal carry, outside-loop behavior).
- `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` (startup/compact test inventory and fixtures; grep only, no suite executed).
- `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` (test inventory; grep only, no suite executed).
- `.claude/settings.json:165-206,254-290` (SessionStart and PostToolUse registration of `compact-pointer.mjs`; context evidence for the P1, not a review target).

Not read this iteration: `session-relaunch-cli.test.cjs`, the Pi/OpenCode suites, `commands/speckit/handoff.md`, the goal-hook playbook, and every `acceptance-criteria.md`. Those stay deferred, not passed.

## Findings - New

### P0 Findings

None.

### P1 Findings

**Carried forward, not new — R1-P1-001 remains active: the startup claim is emitted under an inferred, demonstrably wrong hook event name** -- `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:152-155` -- `claimAfterGoalStart` hands every emit to `payloadEventName(payload, { runtime: 'claude' })` with no `expected`. When the payload names no event, `payloadEventName` infers `UserPromptSubmit` for a string `prompt` and `PostToolUse` otherwise (`[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1493]`). A `source: 'startup'` payload therefore emits `hookEventName: 'PostToolUse'` even though the hook is registered under `SessionStart` (`[SOURCE: .claude/settings.json:165]`, `[SOURCE: .claude/settings.json:206]`). The startup test always includes `hook_event_name: 'SessionStart'` (`[SOURCE: .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1341]`), so the no-event branch is untested. The registry line `:198` is stale; the emitting code is now at `:152-155`.
Claim adjudication: `{"id":"R1-P1-001","type":"carried-forward-recheck","claim":"A Claude SessionStart payload with source=startup and no hook_event_name is emitted under the inferred PostToolUse name, so the fresh session never receives the claim instructions.","evidenceRefs":[".skilled/hooks/session-relaunch/claude/compact-pointer.mjs:152-155",".skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1493-1494",".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1341"],"counterevidenceSought":"Read the resolver, the startup branch and the startup fixture. The fixture always names the event, so neither the code nor the tests prove the no-event class unreachable; the only counterevidence is the possibility that Claude always sends hook_event_name.","alternativeExplanation":"Claude Code may always include hook_event_name, making the branch unreachable. The module's own MISSING_EVENT_POLICIES.claude=infer claims a no-event class for Claude, and no fixture or contract statement in the repository narrows that claim.","finalSeverity":"P1","confidence":0.6,"downgradeTrigger":"A Claude Code hook contract or captured payload set proving SessionStart always carries hook_event_name, together with deleting the infer policy for that event, downgrades this to P2 hardening."}`

### P2 Findings

8. **Switch-resolution and hop-cap rules are implemented twice, and already disagree on an invalid `SKILLED_LOOP_HOPS`** -- `.skilled/hooks/session-relaunch/lib/nudge.cjs:459-471` -- Description: the nudge module resolves the same `SESSION_RELAUNCH_*` switches as the CLI in a separate copy (`maxAgeMinutes` at `:428-439`, `switchNumber` at `:443-452`, `hopLimitReached` at `:459-471`), while the CLI owns `resolvedSwitches` and `numericSwitch` (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:131]`, `[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:135]`) and its own hop-cap block (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:526]`). The two parsers already differ on an invalid hop count: the nudge falls back to 0 and keeps prompting, while `prepare` throws and exits 2. The same duplication covers the age limit and the cap fallback, so a change to one copy silently changes the other side of the nudge/prepare pair.
   Finding class: cross-consumer
   Scope proof: `rg` over the two modules shows no shared switch helper; the nudge's `hopLimitReached` and `prepare`'s hop-cap block are the two consumers of the same `SKILLED_LOOP_HOPS`/`SESSION_RELAUNCH_MAX_HOPS` pair. `session-relaunch.cjs:131-153` and `nudge.cjs:428-471` are the only production implementations.
   Affected surface hints: ["nudge.hopLimitReached", "nudge.maxAgeMinutes", "CLI numericSwitch", "prepare hop-cap block"]
   Case: with `SKILLED_LOOP_HOPS=abc`, `hopLimitReached` falls back to 0 and the nudge asks for a handoff, while `prepare` throws `SKILLED_LOOP_HOPS must be a non-negative integer` and exits 2, so the model is prompted to run a command that can only fail.
   Claim adjudication: `{"claim":"The nudge and the CLI implement the same switch semantics twice and diverge on an invalid SKILLED_LOOP_HOPS value.","evidenceRefs":[".skilled/hooks/session-relaunch/lib/nudge.cjs:443-471",".skilled/hooks/session-relaunch/bin/session-relaunch.cjs:135-153",".skilled/hooks/session-relaunch/bin/session-relaunch.cjs:526-541"],"counterevidenceSought":"Looked for a shared helper or a re-export; none exists. Checked whether the wrapper can produce an invalid value; it exports an integer, so the divergence needs an operator-set or corrupted value.","alternativeExplanation":"The duplication may be deliberate because the nudge must never throw and the CLI must refuse. That explains the different failure mode but not the duplicated parsing rule that can drift independently.","finalSeverity":"P2","confidence":0.85,"downgradeTrigger":"If the two helpers are replaced by one shared resolver, close the finding; if an invalid value is shown to be impossible, keep P2 as a duplication-only follow-up."}`

9. **The README trigger matrix still describes `SessionStart` as compaction-only, omitting the new startup claim route** -- `.skilled/hooks/session-relaunch/README.md:19` -- Description: the Claude trigger list says `SessionStart` is used "after a compaction", while the same README later documents the `startup` source claim (`[SOURCE: .skilled/hooks/session-relaunch/README.md:183]`) and `compact-pointer.mjs` acts on `payload.source === 'startup'` before the enable check (`[SOURCE: .skilled/hooks/session-relaunch/claude/compact-pointer.mjs:169]`). The registration is one `SessionStart` entry (`[SOURCE: .claude/settings.json:206]`), so the summary and the detailed section now describe different trigger scopes.
   Finding class: instance-only
   Scope proof: `README.md:19` is the only trigger summary; `README.md:183-184` and `compact-pointer.mjs:169-174` are the only places that name the startup claim. No other doc line reconciles them.
   Affected surface hints: ["README runtime adapter matrix", "README Goal In A Claude Receiver", "compact-pointer startup branch"]
   Case: an operator who reads only the trigger matrix concludes `SessionStart` is post-compaction only and removes or ignores it while debugging compaction noise; a goal-command hop then starts with no claim context and the hand-over is lost.
   Claim adjudication: `{"claim":"The README's Claude trigger summary omits the startup-source use of SessionStart that the code and the later README section implement.","evidenceRefs":[".skilled/hooks/session-relaunch/README.md:19",".skilled/hooks/session-relaunch/README.md:183",".skilled/hooks/session-relaunch/claude/compact-pointer.mjs:169-174"],"counterevidenceSought":"Searched the README for another line naming the startup trigger; section 1's matrix is the only trigger list, and it attaches SessionStart to compaction only.","alternativeExplanation":"The summary may be intentionally compaction-focused because the startup claim is a narrow goal-command path. It still leaves the reader without the startup trigger, which is the documented route when the start prompt must be the goal command.","finalSeverity":"P2","confidence":0.8,"downgradeTrigger":"If the matrix is meant to list only the nudge triggers and a nearby sentence names the startup claim, close the finding."}`

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Iterations 1-2 checked 002/005/006 against code and found the SC-002 error-path contradiction (R2-P2-003). This iteration rechecked the Claude start-claim path against the README's goal-carry section: the code emits the claim only on `startup` and only while the master and concern kill switches allow it (`compact-pointer.mjs:169-174`), matching `README.md:183-184`. Child packets 001, 003, 004 and 007 remain unchecked. |
| `checklist_evidence` | core | deferred | No `acceptance-criteria.md` was opened this iteration, so no Met row is claimed. |
| `skill_agent` | overlay | deferred | `.skilled/commands/speckit/handoff.md` was not read; its note-shape claims stay unverified. |
| `agent_cross_runtime` | overlay | notApplicable | No agent definition is in the review scope. The runtime comparison that did run (Claude inference vs the other adapters' event policy) is recorded under `spec_code`. |
| `feature_catalog_code` | overlay | deferred | Not reached; no catalog entry is named in the dispatch. |
| `playbook_capability` | overlay | deferred | The goal-hook playbook was not read; its capability claims stay unverified. |

## Integration Evidence

- Loop owner: `.skilled/commands/deep/review.md` (`/deep:review`) — dispatcher; no file read beyond the rendered prompt.
- Append gateway: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` — the only writer of `review/deep-review-state.jsonl`; invoked with this iteration's single-record file.
- Reducer: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` — owns the findings registry, dashboard and report; not invoked by this agent.
- Reviewed integration surfaces: the Claude `SessionStart`/`PostToolUse` registration in `.claude/settings.json:165-206,254-290`; the `payloadEventName` producer in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1484-1497`; the `compact-pointer.mjs` consumer at `:152-155` and `:211-225`; the Claude adapter fixture at `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1341`; and the README trigger summary at `:19`.
- Nudge/prepare pair: `nudge.hopLimitReached` (`.skilled/hooks/session-relaunch/lib/nudge.cjs:459-471`) and `prepare`'s hop block (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:526-541`) are the producer/consumer pair behind finding 8.

## Edge Cases

- **P1 line drift**: the registry anchors R1-P1-001 at `compact-pointer.mjs:198`; the current emitting call is `:152-155`. The finding was re-anchored, not renumbered, and remains active.
- **P1 reach is still unproven**: no captured Claude payload in this review lacks `hook_event_name`. The code's own `infer` policy is the only evidence the class exists; the finding keeps P1 because the module claims to resolve that class and resolves it wrongly, and the confidence is recorded at 0.6.
- **Finding 8 reach is operator-induced**: the wrapper exports an integer `SKILLED_LOOP_HOPS`; the divergence needs an operator-set or corrupted value. It stays P2, and the duplication itself is the maintainability cost.
- **Finding 9 is documentation-only**: no runtime behavior changes; the fix is a README edit.
- **Tests not executed**: every code-reading claim in this iteration is static evidence. No `node --test` run, no `scratch/red.txt`/`green.txt` comparison.
- **v2 review-depth fields not emitted**: this run's two prior records are legacy unversioned and the reducer consumed them; changing record shape on the final iteration would risk a mid-run schema split. The legacy shape is kept deliberately, not by omission.
- **Coverage shortfall, recorded not masked**: traceability core remains partial and every overlay remains deferred at max iterations. Maintainability is covered by this iteration; the missing overlays are not a pass.

## Confirmed-Clean Surfaces

- `payloadEventName` returns an explicit `hook_event_name` unchanged (`[SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1488]`), and `emit` writes that name into the envelope (`[SOURCE: .skilled/hooks/session-relaunch/claude/compact-pointer.mjs:53]`). The named-event path is clean; only the no-event path is finding 1.
- `nudgeDecision` applies the documented order: child session, threshold, pending/armed handoff, hop cap, open note outside the loop, then the stored level (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:589]`). This matches `README.md:132-134`.
- `numericSwitch` rejects negative, non-numeric and, for hop counts, fractional values and falls back to the default (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:135]`); `prepare` separately refuses an invalid `SKILLED_LOOP_HOPS` (`:526-530`).
- `sessionIdFor` requires an id and names the exact source it accepts (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:358]`).
- `handoffPathWithinRepo` resolves the handoffs directory and the note through real paths, so a linked directory cannot widen the write location (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:155]`).
- `handoffText` step numbering was checked for all four spec-folder states (valid, `none`, empty, unknown); each state produces one monotonic sequence, and the existing tests assert the counts (`nudge.test.cjs:70-173`).
- The README's goal-carry section matches the code's switch order: the master and concern kill switches silence the hook before the startup branch, while the per-runtime enable switch does not (`[SOURCE: .skilled/hooks/session-relaunch/claude/compact-pointer.mjs:164]`, `[SOURCE: .skilled/hooks/session-relaunch/README.md:183]`).
- `claim`'s inline session-id resolution duplicates `sessionIdFor`, but the two are textually identical today and the seed always supplies `--session`; it was considered and ruled out as a finding.

## Ruled Out

- **`claim` duplicating `sessionIdFor`**: `claim` repeats the source selection and error text (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:661]`), but the two implementations agree and the seed always passes `--session`; no reachable wrong result today. It is a cleanup candidate, not an active finding.
- **`handoffText` step-numbering drift**: all four folder states were walked end to end (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:118]`); the `step` counter and the tests agree, so no duplicate or skipped step number exists.
- **`nudgeDecision` re-arm floor**: a pending grant writes the floor and stays quiet, and the delivered grant advances the level past the spent ceiling (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:620]`); the tests at `nudge.test.cjs:1502-1594` cover the pending, fixed and cap-behind cases.
- **`recordGoalPacket` mutating the note before a shell-child refusal**: the write is the idempotent, prepare-owned `goal_packet` field, and the refusal leaves the note as the sending session wrote it; no wrong result.
- **`parseArgs` rejecting a value that starts with `--`**: the CLI owns the note-path shape and the handoffs directory; a path beginning with `--` is outside the accepted invocation, not a hidden truncation.
- **README's "prepare exits 2 before reading the note when the concern is off"**: the flag decision runs at `session-relaunch.cjs:513` before `validatedNote` at `:516`, so the note is not read or mutated on that path. The statement is accurate.
- **Master/concern switch ordering for the startup claim**: the startup branch returns before `decision.enabled` (`compact-pointer.mjs:169-174`), which is the documented "claim survives the per-runtime switch" behavior; not a bypass of the master or concern kill switch.

## Next Focus

- Dimension: none remaining — maintainability (D4) completed this iteration; max iterations reached.
- Focus area: none for this run.
- Reason: `maxIterations: 3` is exhausted. The terminal synthesis should treat R1-P1-001 as open, finding 8 as the duplication follow-up, and finding 9 as the documentation follow-up.
- Rotation status: correctness `partial`; security `partial`; traceability `partial` (core); maintainability `covered` (this iteration).
- Blocked/productive carry-forward: productive = full reads of the nudge/CLI pair and the producer/consumer event-name path; blocked = none.
- Required evidence for a future run: the unchecked child packets 001/003/004/007, every `acceptance-criteria.md` row, `commands/speckit/handoff.md`, the goal-hook playbook, and a captured Claude startup payload set.
- Recovery note: the overlays and checklist evidence remain deferred rather than silently passed; a resumed run must start there, not at the dimensions already recorded.

Review verdict: CONDITIONAL
