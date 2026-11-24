# Iteration 002 - Security

## Dispatcher
- Lineage opus-medium-3, inline executor. steer.md: not present.

## Dimension
security: consent boundaries on spend commands (refusals, the `run` policy of `/doctor:deep-loop`) and availability of the gate regexes. Review focus applied: the same deep-loop offer gate in `command-attach.ts` and its Python mirror, probed with refusal wording and long prompts.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:412-445, 516-525, 684-687, 827-858`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4640-4728`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:109, 125-127`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Common refusal verbs do not withhold the deep command** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:440 -- `RUN_ASK_NEGATED` knows `do not, don't, never, no need to, need not, without, not asking for, not looking for` and a bare `no`. It does not know `skip`, `avoid`, `instead of`, `rather than` or `refuse`, though the typed-command decline list in the same file treats `skip, avoid, instead of, rather than, stop` as refusals (`command-attach.ts:686`). Probes through the source: `skip the deep review and just answer` attaches `/deep:review`; `avoid deep research; answer from memory` attaches `/deep:research`; `do not even think about running a deep review` attaches `/deep:review` (the negation sits three words back, past the two-word gap); `I refuse a deep review here` attaches. The Python copy (`skill_advisor.py:4661`) carries the same list, and `asks_for_loop_run("skip the deep review and just answer")` returns True there too. REQ-015 states the rule generally ("A spelled-out refusal withholds the command") though its acceptance prompts are the six named ones, all of which pass.
   Finding class: incomplete refusal vocabulary, both implementations.
   Scope proof: both patterns are in declared scope files.
   Affected surface hints: RUN_ASK_NEGATED (TS), _RUN_ASK_NEGATED_RE (Python), deep-loop-offer-cases.json shared fixture.
   Case: the reader writes "skip the deep review and just answer", and the brief offers /deep:review with the A/B/C question.
2. **A stuck-run complaint starts the run-policy doctor even when the prompt says not to run anything** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:837 -- The stuck branch withholds `/doctor:deep-loop` only on `isNoEditRequest` or a led mention of the doctor command (`command-attach.ts:838`). `NO_EDIT_REQUEST` (`command-attach.ts:518`) covers change/edit/touch but not "run anything" or "don't want a fix". Probes: `the deep research run is stuck. please don't run anything` and `my deep research run is stuck and I don't want a fix` both attach `/doctor:deep-loop`, whose policy is `run` (start without asking) and whose class is `add-only` (`command-attach.ts:79`). Severity held at P2 rather than P1: the repository's Gate 2 says an explicit instruction outranks the policy, so a compliant session should still not run it; the brief is still telling it to.
   Finding class: consent guard gap on a run-policy command.
   Scope proof: in declared scope.
   Affected surface hints: attachCommand stuck branch; NO_EDIT_REQUEST; the Python stuck path drops run rows but has no doctor-row guard to compare.
   Case: the reader reports a stuck run and adds "please don't run anything", and the brief says /doctor:deep-loop (run).
3. **The Python loop-ask scan is quadratic and passes the 3 s fallback timeout on long prompts** -- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4718 -- `_has_loop_ask` slices `before`/`after` for every `_LOOP_REQUEST_RE` match and runs end-anchored searches over the whole prefix, so cost grows with matches times length. Measured on `"5 a-b-c-d iterations of " * n`: 12 000 chars 129 ms, 24 000 chars 421 ms, 48 000 chars 1 993 ms, 96 000 chars 6 258 ms. `DEFAULT_TIMEOUT_MS` is 3000 (`subprocess.ts:109`), so a long pasted log with many iteration phrases times the fallback out. The TypeScript gate ran the 48 000-char input in 37 ms.
   Finding class: availability, super-linear scan.
   Scope proof: in declared scope; measurement imported the module read-only from /tmp.
   Affected surface hints: _has_loop_ask; same loop shape in hasLoopAsk (TS) is fast today but has the same structure.
   Case: a 96 000-character prompt with repeated "N iterations of" text, and the degraded advisor returns a timeout instead of a recommendation.

## Traceability Checks
- spec_code (partial): NFR-S01 holds (both `/deep` rows keep `ask`, `command-attach.ts:136-137`); REQ-015's general statement is not met for skip/avoid wording (finding 1).

## Edge Cases
- `no deep-review` and `don't run a deep review, never` are withheld correctly.
- `my deep review run is stuck, no need for /doctor:deep-loop` is withheld (led mention).

## Confirmed-Clean Surfaces
- TS regex timing on 20-58K-char adversarial prompts: 2-37 ms, no catastrophic backtracking found.

## Ruled Out
- Catastrophic backtracking in the TS gate regexes: five adversarial shapes stayed under 40 ms.

## Next Focus
- Dimension: traceability. Focus: acceptance-criteria.md and tasks.md evidence against code and tests for REQ-015..REQ-021, the shared fixture, and packet 013 REQ-006/REQ-007 test pins.

Review verdict: PASS
