# Iteration 001 - Correctness

## Dispatcher
- Lineage opus-medium-3, session fanout-opus-medium-3-1795495423434-9mvwzq, generation 2. Executor: this process (cli-claude-code, claude-opus-5-5), inline.
- steer.md: not present at iteration start.

## Dimension
correctness. Review focus applied: the deep-loop offer gate in `command-attach.ts` (routed and deferred paths), the Python mirror `_apply_deep_loop_offer_gate` in `skill_advisor.py`, and the typed-command hint path from packet 013 (`render.ts` `commandLabel`, `attachTypedCommand`).

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:195-283, 346-432, 610-941`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4625-4855`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:395-447`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:215-252`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:180-210, 331-410`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:360-400`
- Integration context (outside declared scope, cited only): `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1479-1529`
- `specs/.../012-deep-loop-command-offers/spec.md`, `specs/.../013-deep-loop-offer-in-hint/spec.md`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **A typed deep command is lost when the prompt also types a longer, different command** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:238 -- `typedCommandIn` keeps the longest tracked key across all commands, a rule meant for prefix collisions (`/group:name` vs `/group:name-parent`). The routed deep gate compares that single value with the attached command (`command-attach.ts:887`), and `typedCommandForTop` (`command-attach.ts:257-264`) uses the same value, so a prompt that types `/deep:research` and a longer unrelated command gets neither. Probe through the source module (node strip-types, `scratch/probe.mts`): `run /deep:research on caching, then /create:changelog` with a single research route returns `attach=undefined`, `typed=/create:changelog`, `typedTop=null`; `/deep:review the parser and then /doctor:deep-loop` returns `attach=undefined`, `typedTop=null`. The Python mirror only considers `/deep:*` keys (`skill_advisor.py:4826-4829`), so it keeps the typed row: the two gates disagree, which REQ-020 asks them not to do for typed rows.
   Finding class: cross-implementation drift / wrong selection rule.
   Scope proof: both functions are in the declared scope; the probe imports the committed source, not dist.
   Affected surface hints: command-attach.ts typedCommandIn, attachCommand routed deep branch, typedCommandForTop; skill_advisor.py _typed_deep_command; command-attach.vitest.ts typed cases.
   Case: the prompt types /deep:research and later types /create:changelog, and the brief carries no deep command although the reader typed one.
2. **The degraded (Python) path drops the `typed` flag, so a typed deep command still gets the three offer options** -- .skilled/skills/system-skill-advisor/runtime/lib/render.ts:250 -- `commandLabel` leaves the options off only when `recommendation.typed === true`. On the native path `attachTypedCommand` sets it (`advisor-recommend.ts:434-444`). On the degraded path, `degradedRecommendations` keeps a command row's command only when the prompt contains that command (`skill-advisor-cli.ts:1501-1510`), which is exactly the typed case, yet never sets `typed`; `parseRecommendations` (`subprocess.ts:200-209`) carries no command fields at all. So `/deep:review:confirm the auth module` served by the Python fallback prints `/deep:review (ask: A /deep:review:auto (Recommended), ...)`, the head packet 013 REQ-006 rules out. The CLI fallback reader would forward `typed` if present (`skill-advisor-cli-fallback.ts:393-395`), so the gap is at the producer.
   Finding class: missing field propagation on a fallback path.
   Scope proof: render.ts and the fallback reader are in scope; the producer `skill-advisor-cli.ts` is cited as integration evidence only.
   Affected surface hints: skill-advisor-cli.ts degradedRecommendations; render.ts commandLabel; command-brief-golden.vitest.ts has no degraded-path typed case.
   Case: the daemon is unavailable, the reader types /deep:review:confirm, and the head still offers A/B/C, inviting the session to ask a question the reader already answered.

## Traceability Checks
- spec_code (partial): REQ-001/REQ-006 of packet 013 hold on the native path (`render.ts:250`, `advisor-recommend.ts:434-444`, probe of `/deep:review:confirm the auth module` returns `typedTop=/deep:review`), but not on the degraded path (finding 2). REQ-020 of packet 012 holds for its four named prompts by design; finding 1 shows drift outside them.

## Integration Evidence
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1483-1529` (degradedRecommendations) produces the degraded rows that `render.ts` prints.

## Edge Cases
- Deferred route with a typed command: `attachCommand` returns undefined (`asksForLoopRun` does not read `/deep:review` as loop wording), and `attachTypedCommand` restores it on the top row. Correct on the native path; noted because it relies on the typed rescue running after attach.
- The `skill_advisor.py` CLI was not executed, because it may touch its own cache outside the lineage write surface; Python behaviour is read from source.

## Confirmed-Clean Surfaces
- Stuck-run counted-ask cancel: TS `isStuckRunComplaint` (`command-attach.ts:419-422`) and Python `is_stuck_run_complaint` (`skill_advisor.py:4640-4655`) apply the same counted-run-ask cancellation.
- Own-key lookups on `modeCommands` (`command-attach.ts:863-865, 904`) guard inherited names.

## Ruled Out
- Prototype-key command injection through `workflowMode`: ruled out by `Object.prototype.hasOwnProperty.call` at `command-attach.ts:865`.

## Next Focus
- Dimension: security. Focus: refusal/mention guards (`commandOnlyMentioned`, `RUN_ASK_NEGATED`) and the `run` policy path for `/doctor:deep-loop`, whether a prompt can start a command it refused; Python decline-lead parity. Rotation: correctness done.

Review verdict: PASS
