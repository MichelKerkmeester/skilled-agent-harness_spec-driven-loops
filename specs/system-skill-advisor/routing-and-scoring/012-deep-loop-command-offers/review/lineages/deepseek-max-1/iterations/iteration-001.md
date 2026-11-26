# Iteration 1 - correctness

## Dispatcher

- Lineage: `deepseek-max-1`, generation 10, run `fanout-deepseek-max-1-1795556727682-axtzf8`
- Dimension: correctness
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Setup bindings:
  - `BINDING: target=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
  - `BINDING: maxIterations=7`
  - `BINDING: convergence=0.1`
  - `BINDING: mode=review`
  - `BINDING: dimensions=correctness,security,traceability,maintainability`
  - `BINDING: specFolder=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: the correctness pass reads the thirteenth fix round first (T115 to T120, REQ-054 to REQ-059) and the two gate copies together, before the traceability passes map every REQ to its code or decision.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:911` (`lowerFolded` and the zero-width class)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1000` (`hasLoopAsk`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1213` (`asksForLoopRun`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1278` (`QUESTION_CLAUSE_END`, `ITERATION_COUNT`, `LOOP_RUN_BY_PRONOUN`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1295` (`isLoopQuestion`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1694` (`attachCommand` deep-loop gate)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:184` (`ownedCommandRecommendation`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:452` (`passesAsked`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5120` (`_fold_quotes`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5338` (`_is_loop_question`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5346` (`_has_loop_ask`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5834` (`_apply_deep_loop_offer_gate`)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:288` (the T115 to T117 rows)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:686` (the compiled-name accounting)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:370` (`parseIterationFile`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2392` (`splitRuledOutEntry`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2409` (`buildExhaustedApproaches`)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A refused run ask in the question's later clause is read as the run the question asks for** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1303` -- `isLoopQuestion` asks whether any `run|start|do ... deep review` appears after the question, using the raw `LOOP_RUN_REQUESTED` pattern. That pattern has no negation check, while `hasLoopAsk` skips the same phrase through `runAskNegatedAt`. So a prompt that first asks about the loop and then refuses the run is read as an ask: "what is a deep review? don't run a deep review on the parser" returns `asksForLoopRun` true in both copies. On the fallback copy the observation is direct: `asks_for_loop_run` returns `True`, and `_apply_deep_loop_offer_gate` keeps the `system-deep-loop` row, which serves `/deep:review (ask)` for a run the reader refused. REQ-015 and REQ-023 say a spelled-out refusal withholds the command, and the question rule says a how-to question carries no command; the two rules are broken where they meet.
   - Finding class: `instance-only` for the combination, `class-of-bug` for the missing negation read in the question branch
   - Scope proof: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` and the fixture are on `review-scope-files.txt`. Both gate copies and `attachCommand` were read at this revision; no fixture row pairs a loop question with a negated run ask, which is why the shared suite stays green.
   - Affected surface hints: `isLoopQuestion`, `_is_loop_question`, `hasUnrefusedRunAsk`, `attachCommand`, `_apply_deep_loop_offer_gate`, and the served-head renderer in `render.ts`
   - Case: the prompt "what is a deep review? don't run a deep review on the parser" carries a question and an explicit refusal of the run; both copies answer that a run was asked for, so the reader is offered the command they refused.
   - Claim adjudication:
     - `type`: `refusal_ignored_in_question_branch`
     - `claim`: `isLoopQuestion` and `_is_loop_question` read a negated run phrase as an unrefused ask, so a question followed by a refusal yields a deep-loop offer in both copies.
     - `evidenceRefs`: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1303`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1010`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5357`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5398`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5771`
     - `counterevidenceSought`: checked whether `attachCommand` applies a whole-prompt refusal guard after `asksForLoopRun` (it does not on the general path; only the doctor branch reads `isRunRefused`), checked whether the question branch was meant to include refused asks (the adjacent comment says "a run the prompt asks for", and `hasLoopAsk` already excludes refusals), and searched the fixture for a question-plus-refusal row (none).
     - `alternativeExplanation`: the combination may be treated as outside the question rule's contract because the packet names a question followed by a use verb, not by a refusal; but REQ-015 and REQ-023 are general refusal rules, and the gate applies negation in one helper and not the other, so the mismatch is internal rather than a deliberate boundary.
     - `finalSeverity`: P1
     - `confidence`: 0.9
     - `downgradeTrigger`: if the packet explicitly rules that a refusal after a loop question does not withhold the offer, the finding becomes a P2 wording note on REQ-015; no such decision exists in `decision-record.md`.

### P2 Findings

1. **Two iterations that rule out one direction are written as two one-attempt directions** -- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2414` -- `buildExhaustedApproaches` groups entries by the full text of the line. Since the T120 fix taught `splitRuledOutEntry` to split "direction -- reason", the same direction ruled out by two iterations with two reasons becomes two keys (`X -- reason A`, `X -- reason B`), each with `attemptCount` 1. Both are written as `RULED OUT (iteration N, 1 attempt)` with a reopen condition, the direction appears twice in the strategy, and the two iterations' agreement never reaches the `BLOCKED` form the constant `MIN_BLOCKED_ATTEMPTS = 2` exists to produce.
   - Finding class: `class-of-bug`
   - Scope proof: `reduce-state.cjs` and its unit tests are on `review-scope-files.txt`; `splitRuledOutEntry` (line 2392), the grouping loop (line 2413) and the two render branches (lines 2440 to 2455) were read at this revision, and the T120 unit cases cover one entry at a time rather than two iterations with different reasons.
   - Affected surface hints: `buildExhaustedApproaches`, `splitRuledOutEntry`, `MIN_BLOCKED_ATTEMPTS`, the strategy's `Exhausted Approaches` section, the iteration test at `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:1704`
   - Case: iteration 3 records "Cloud API -- blocked by auth scope" and iteration 4 records "Cloud API -- rate limited". The projection writes two `RULED OUT` entries for Cloud API instead of one `BLOCKED` entry, so a reader sees a direction that may reopen even though two passes closed it.
   - Fix direction: group on `splitRuledOutEntry(entry).direction`, collect the distinct reasons and runs per direction, and count runs from the merged bucket.
   - Claim adjudication:
     - `type`: `projection_grouping_gap`
     - `claim`: the exhausted-approaches projection keys on the full ruled-out line, so reasons split a direction that two iterations agreed on and the BLOCKED branch is unreachable for it.
     - `evidenceRefs`: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2413`, `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2392`, `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2440`
     - `counterevidenceSought`: checked whether `extractListItems` normalizes two differently worded rows to one key (it does not), whether a later merge step regroups on the direction (none exists in `buildExhaustedApproaches` or its caller), and whether the "Why ruled out" branch keeps the second reason visible (it does, but under a second heading).
     - `alternativeExplanation`: the grouping may be intentional so each reason keeps its own line; if so, the `BLOCKED` threshold cannot be reached for any direction whose reasons differ, and the constant's comment about multiple iterations is then misleading.
     - `finalSeverity`: P2
     - `confidence`: 0.86
     - `downgradeTrigger`: if the packet states that each reason is its own exhausted direction, the finding drops to a wording note on the `MIN_BLOCKED_ATTEMPTS` comment.

## Traceability Checks

- `spec_code` — partial. The thirteenth-round slice is traced end to end: REQ-054 at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1285` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5328`; REQ-055 at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:849` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5283`; REQ-056 at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:917` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5124`; REQ-058 at `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:184`; REQ-059 at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:377` and `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2392`. REQ-001 to REQ-053 are not mapped yet, so the protocol stays `partial`.
- `checklist_evidence` — partial. AC-062 to AC-067 were read row by row and each cited line opens on the symbol it names (`command-attach.ts:1285` `questionClause`, `command-attach.ts:917` `lowerFolded`, `command-attach.ts:313` `trackedCommandForOwner`, `reduce-state.cjs:2392` `splitRuledOutEntry`). T115 to T121 were read against those symbols. The suite counts those rows state were not re-run in this iteration; the gate is therefore `partial`, not `pass`.

## Integration Evidence

- Command surface: `/deep:review` (`.skilled/commands/deep/review.md`) is the command that dispatches this lineage; no command file was read as changed by this pass.
- Hook surface: `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:184` is the brief path that renders a subprocess row, and the same `trackedCommandForOwner` is imported by `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:23`, so the two paths share one check.
- Reducer surface: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` owns the strategy projection this review reads, and the two functions the finding names are the ones that build `Exhausted Approaches`.

## Edge Cases

- A question followed by a non-negated run ask ("what is a deep review? run a deep review on the parser") is intended to offer the command; it returns true in both copies and is not part of the P1.
- `questionClause` ends at a comma as well as a sentence mark, so "how do I run a deep review, for 5 iterations, on the parser" stays a question and carries no command. The requirement says the count counts only inside the question's own clause; the comma reading is recorded here as a boundary a later pass may revisit, not filed as a defect.
- `LOOP_RUN_BY_PRONOUN` returns early without a refusal check, but the refusal word blocks the pronoun shape in the prompts tested ("don't run one", "skip running one"), so no second refusal path was filed.
- A defect outside the listed scope was not found; the whole `reduce-state.cjs` path read is on `review-scope-files.txt`.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:849` -- the clause mark now includes `\bthen\b`, and the fixture rows `past-report-then-run-review` and `past-research-then-run-research` both read true while `past-report-and-run-notes` reads false.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:917` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5124` -- both folds list U+200B, U+200C, U+200D, U+2060 and U+FEFF, and both collapse a whitespace run to one space.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:686` -- the accounting reads every `^_NAME = re.compile(` in the gate slice, and the reverse test reads every compared or excused name back out of the same slice.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227` -- `stripReviewVerdict` cuts a Next Focus section at the first `Review verdict:` line and leaves the line breaks above it intact.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2392` -- `splitRuledOutEntry` splits only a spaced `--` or an em dash and keeps a kebab name or an unspaced flag in the direction.

## Ruled Out

- "A typed run row on a stuck complaint is a bug": ruled out. ADR-005 makes the typed command outrank the diagnosis on the served head, and both copies keep the typed row (`.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1614`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5838`).
- "`LOOP_RUN_BY_PRONOUN` ignores a refusal": ruled out for the shapes tested, because the refusal word sits between the clause mark and the use verb, so the pattern does not match and the ordinary question branch decides.
- "The new `then` mark swallows an `and` join": ruled out. The clause search treats only punctuation and `\bthen\b` as marks, and the `and` fixture row reads false.
- "`splitRuledOutEntry` cuts a CLI flag": ruled out. The unspaced `--` branch is not a separator; only `\s+--\s+`, `\s+—\s+` or a bare `—` split an entry.
- "`extractSection` picks a `###` subsection instead of the `##` section": ruled out. The pattern requires `##` followed by whitespace, so `###` cannot match it.

## Next Focus

- Dimension: security
- Focus area: the gate as a trust boundary: the 10,000-character head both copies read, the bounded lead windows, the brief's subprocess command vetting, and the refusal/withhold paths that keep a prompt from forcing work.
- Reason: the correctness pass found a refusal that is not read; the next strongest risk is whether crafted prompt text or a compromised subprocess row can force a command, forge a command, or evade a withhold.
- Rotation status: correctness done; security, traceability and maintainability remain.
- Blocked/productive carry-forward: productive -- direct reads of both gate copies plus one direct fallback call. No blocked direction.
- Required evidence: file:line for each bound (`LEAD_WINDOW`, `ADVISOR_PROMPT_MAX_CHARS`, `_LEAD_WINDOW`) and for the subprocess ownership check.
- Recovery note: none; this pass is not a recovery iteration.

Review verdict: CONDITIONAL
