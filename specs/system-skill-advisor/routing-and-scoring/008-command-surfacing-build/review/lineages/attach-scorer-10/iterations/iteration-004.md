# Review Iteration 004 - attach-scorer-10

## Dispatcher

- Mode: review, leaf iteration 4 of the `attach-scorer-10` fan-out lineage.
- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: the seven `attach-scorer` rows of `review/review-scope-10.txt`.
- Focus read first: `review/review-brief-10.txt`; this iteration answers its maintainability dimension and keeps the recorded limits (S9-P2-005 duplicate suffix vocabulary, F1 shared scratch pattern) out of the findings.
- Prior state read: state log (three iterations), registry (AC10-P1-001 and AC10-P2-001 open), strategy (next focus: maintainability).
- Holdout rule honoured: no prompt corpus was opened and no session text was printed.

## Files Reviewed

| File | Lines read | Dimension |
|------|-----------|-----------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | 405-455 | maintainability |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | 160-195 | maintainability |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | 600-745, 1495-1560 | maintainability |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | 1430-1460, 1490-1575 | maintainability |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | 1-60 | maintainability |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | 128-140 | maintainability |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | 20-45, 99-134 | maintainability |

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. AC10-P1-001 from iteration 1 stays active.

### P2 Findings

1. **The curly double quotes in the new strip have no test of their own** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:423` -- The strip adds `\u201c` and `\u201d` to the dropped set, and a typographic quote pair is a realistic paste from a word processor. The new markup table at `tests/command-attach-guards.vitest.ts:172-184` covers backticks, asterisks and a straight double quote only, so a later simplification of the class would drop the two curly members with every test still green. The behaviour is correct today: `commandOnlyMentioned("what does \u201c/create:readme\u201d do?", "/create:readme")` returns true.
   Finding class: changed character class without a regression case.
   Scope proof: the strip line at `:423` and the new markup table at `tests/command-attach-guards.vitest.ts:172-184` are this area's own changed surface.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:423`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:172`.
   Case: a later edit writes the strip as `` [`*"] `` only; every current case passes, and `what does “/create:readme” do?` starts attaching the command the reader only asked about.

2. **The comment says why `_` stays but not why `'` stays, and the obvious fix for AC10-P1-001 breaks the `what's` lead** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:416` -- The new comment explains the underscore exclusion ("a command name may hold one") and claims "quote marks around a name are dropped", but the strip leaves the apostrophe in place and the fold at `:424` turns both curly single quotes into it. Nothing in the comment says why, so the natural next edit (add `'` to the strip to close the single-quote P1) silently changes `what's` to `whats`; `COMMAND_ASK_LEADS` at `:399` holds `what's` and `what is`, not `whats`, so a question written with the contraction stops being withheld.
   Finding class: comment contract misses a load-bearing exclusion on a changed line.
   Scope proof: the comment at `:411-418`, the strip at `:423`, the apostrophe fold at `:424` and the ask-lead list at `:399` are the same changed function and its declared vocabulary.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:416`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:423`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:399`.
   Case: a maintainer adds `'` to the strip class; the suite stays green except for whatever single-quote case they add, and `what's /speckit:plan do?` (a question with the contraction) starts attaching the command.

## Traceability Checks

- `spec_code` -- pass for this dimension. The D-01 disposition owns the mention fix, and the code implements its backtick, asterisk and double-quote clauses; the two gaps above are comment and coverage debt on that same fix, not a requirement mismatch. `REQ-006`'s scorer clauses remain matched as recorded in iteration 3.
- `checklist_evidence` -- notApplicable; no `checklist.md` in this phase-parent packet.

## Integration Evidence

- The strip line and the comment sit at `command-attach.ts:411-424`; its two offer call sites are `:259` and `:501`, and the third consumer is `scorer/fusion.ts:1213`.
- The markup table is `tests/command-attach-guards.vitest.ts:172-184`; the transcript suite's new rows are `:1528-1554` and `:1438-1446`.
- `COMMAND_ASK_LEADS` at `:399` and `COMMAND_DECLINE_LEADS` at `:379-382` are the two lists that read the folded text; the decline list already holds `dont`, which is why the apostrophe strip would break only the ask side.

## Edge Cases

- The single-quote P1 and the apostrophe comment P2 are the same character from two directions: one asks for a better fix, the other asks that the constraint behind the current omission be written down.
- A fix for the P1 that strips only quotes adjacent to a slash command leaves `what's` and `don't` intact; a fix that strips the character everywhere does not.
- The reversed-order suffix test gap from iteration 3 stays open as AC10-P2-001 and is not re-counted here.

## Confirmed-Clean Surfaces

- The scorer comments match the code clause by clause: the route split, the linear pop, the head-only self-auto read and the shared scratch pattern.
- `WITH_MODIFIER` is defined once in the scorer and builds both `SUFFIX_WORD` and `SELF_AUTO`; the duplicate in `command-attach.ts` is the recorded S9-P2-005 trade-off.
- The bench row is the exhaustive-record consequence of the runtime tuple, and the test that walks `ADVISOR_RUNTIME_VALUES` keeps the next runtime addition honest.
- The README cell names the two backticked rows and the 3-of-8 ceiling, consistent with the captured totals.

## Ruled Out

- Re-reporting the duplicate suffix vocabulary: recorded S9-P2-005.
- Re-reporting the shared scratch pattern: recorded F1 in the open P2 list.
- The long README cell as a style defect: pre-existing table style, no new claim broken.
- A stale comment on `guardedWriteCounts`: its scratch list, `..` resolution and home-path clause each match the code.

## Verdict

Two new P2 findings and two active findings carried (P1 AC10-P1-001, P2 AC10-P2-001). CONDITIONAL by the active-finding mapping.

## Next Focus

- Dimension: confirmation
- Focus area: re-read the two open P2 and the P1 against the code, then take the convergence decision
- Reason: all four dimensions are now covered; one confirmation pass is the stabilization step before STOP
- Rotation status: D1-D4 complete, confirmation pending
- Required evidence: every carried finding keeps its original severity and evidence; no new direction is opened
- Recovery note: none

Review verdict: CONDITIONAL
