# Iteration 004 - Maintainability

## Dispatcher
- Lineage opus-medium-3, inline executor. steer.md: not present.

## Dimension
maintainability: how cheaply the TS and Python deep-loop gates stay in sync, and whether the offer docs, the command step 0 and the 013 brief head say the same thing. Review focus applied: the gate in `command-attach.ts`, its Python mirror, and the typed-command head in `injection-contract.md`.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:277-312, 541-579`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4505-4537, 4625-4634`
- `.skilled/commands/deep/assets/deep-review-presentation.txt:1-40`
- `.skilled/commands/deep/review.md:81-87`
- `.skilled/hooks/injection-contract.md:56`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The Python gate hand-inlines the vocabulary lists that the TS gate keeps as data, so a list edit has to be retyped into a regex string** -- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4529 -- TS keeps `LOOP_WORDING`, `LOOP_NAMES` and `LOOP_WANT_LEADS` as one-phrase-per-line arrays "so the vocabulary a reviewer has to judge stays visible and cheap to correct" (`command-attach.ts:275-283, 346-350, 541-552`) and builds `LOOP_REQUEST` from them (`command-attach.ts:572-577`). Python spells the same phrases inline: `(?:deep research|deep-research|deep review|deep-review|multi-pass)` (`skill_advisor.py:4530`), `_LOOP_NAME = r"(?:deep loop|research loop|review loop)"` (`skill_advisor.py:4521`), and `_LOOP_WANT_LEAD` (`skill_advisor.py:4522`). The mode-suffix list is copied the same way (`command-attach.ts:212` vs `skill_advisor.py:4627`). Nothing generates one from the other. The shared fixture and the predicate comparison catch drift only on the prompts they hold, and iteration 1's typed-command drift sat outside both.
   Finding class: duplicated source of truth across languages.
   Scope proof: both files are in declared scope.
   Affected surface hints: command-attach.ts vocabulary arrays; skill_advisor.py _LOOP_REQUEST_RE, _LOOP_NAME, _LOOP_WANT_LEAD, _TYPED_DEEP_COMMAND_RE. A generated JSON vocabulary both read, or a test that compares the lists, would close it.
   Case: a maintainer adds "review sweep" to LOOP_NAMES in TS. Python never learns it, and no fixture prompt uses the phrase, so both suites stay green while the degraded path withholds the offer.

## Traceability Checks
- spec_code (pass): the presentation offer section (`deep-review-presentation.txt:13-40`) and step 0 (`review.md:81`) match REQ-005: one question, A `:auto` recommended with the Gate 3 spec folder, B `:confirm`, C no loop, and the offer is skipped on a typed command or an attached suffix. The brief head in `injection-contract.md:56` matches 013 REQ-001 and REQ-006 and the `render.ts:250` string.

## Edge Cases
- A typed `/deep:review` with no suffix prints `(ask)` with no options. The command doc then takes the no-suffix ASK path (`review.md:86`) and not the offer, so the doc and the head agree.

## Confirmed-Clean Surfaces
- Offer wording is the same across the presentation contract, step 0 and the injection contract.

## Ruled Out
- A doc-to-head mismatch on the option labels: all three surfaces use A `:auto` (Recommended), B `:confirm`, C no loop.

## Next Focus
- Dimension: correctness (second pass, cross-cutting). Focus: the deferred and clarify route path with mode cues (`deferredLoopCommand`, `NAMED_LOOP_MODE`), and the stage-one rule in `explicit.ts` against the gate's loop vocabulary.

Review verdict: CONDITIONAL
