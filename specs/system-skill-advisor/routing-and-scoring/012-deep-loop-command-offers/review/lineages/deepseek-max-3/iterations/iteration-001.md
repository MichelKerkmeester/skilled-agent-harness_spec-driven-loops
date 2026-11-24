# Review Iteration 1

## Dispatcher

- Resolved route: mode=review target_agent=deep-review
- Run: `fanout-deepseek-max-3-1795552859377-13gxwk`, lineage `deepseek-max-3`, generation 1
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Dimension: correctness
- Steer file: absent at dispatch time
- Operator review focus addressed: this iteration is the correctness pass the focus asks for within iterations 1 to 4. It read the two gate copies the focus's REQ set rests on (`REQ-035` to `REQ-053`) and reports the word-rule gap it found; the REQ-by-REQ trace and the `spec_code` / `checklist_evidence` protocols are scheduled for iterations 4 to 7, as the focus directs.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:205-330, 380-520, 580-1010, 1150-1781`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5200-5440, 5743-5860`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (`cases`, 359 rows)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1484-1600`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:200-240, 1000-1045, 2378-2420`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **A digit iteration count in an unrelated trailing clause turns a how-to question into a run ask** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1238` -- `isLoopQuestion` tests `ITERATION_COUNT` over the whole prompt before it reads the question grammar, so any `\d+ ... iterations` anywhere defeats the question reading even when the count is a separate statement about a past run.
Case: the prompt `how do I run a deep review on this? it took 5 iterations last time` is a how-to question plus a past fact; it reads `asksForLoopRun: true` in the Python copy, and the native gate follows the same branch.
- Finding class: class-of-bug
- Scope proof: `rg -n "ITERATION_COUNT|_LOOP_DIGIT_COUNT_RE"` finds exactly the two gate copies and no other reader; both run the count test before the how-to branch, so the same-class site is the Python mirror at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5063,5305`.
- Affected surface hints: ["command-attach.ts isLoopQuestion", "skill_advisor.py _is_loop_question", "shared fixture how-do rows", "command-attach-guards.vitest.ts"]
```json
{
  "type": "correctness",
  "claim": "A how-do/how-can question that also states a digit iteration count about a past or unrelated matter serves a /deep:* command, though REQ-036 says such a question carries none.",
  "evidenceRefs": ["command-attach.ts:1238", "command-attach.ts:1247", "skill_advisor.py:5063", "skill_advisor.py:5310"],
  "counterevidenceSought": "Read the code comment that says 'Only a digit count turns the question back into a request' and the fixture rows how-do-run-deep-review, how-can-research-loop-stop and how-do-then-run-deep-review; all three lack a trailing digit count, so no case pins the combined form.",
  "alternativeExplanation": "The count rule was written to recover requests such as 'how do I run a deep review for 5 iterations'. That reading survives if the count is scoped to the question's own clause; the current whole-prompt test also fires on a separate factual clause, which is not a request.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade to P2 if the operator rules that any prompt carrying a bare iteration count is a request regardless of clause, in which case REQ-036 should say so."
}
```

### P2 Findings

2. **The past-run outranking reads only punctuation as a clause break, so a run ask introduced by "then" is swallowed** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:828` -- `explicitRunOutranks` searches `[,.;!?\n]` for the clause mark after a past-run or writing-about reading; a bare `then`/`and`/`but` clause opener never counts, so an explicit run ask after it does not outrank the reading.
Case: `read the deep review report then run a deep review on the parser` reads `asksForLoopRun: false` in the Python copy, although the second clause asks for a run; the fixture's `summary-then-another-review` row carries a comma, which is why it passes.
- Finding class: instance-only
- Scope proof: `rg -n "clauseMark|clause_mark"` finds only these two implementations; the shared fixture has no punctuation-less "then" row, so no existing case contradicts the gap.
- Affected surface hints: ["command-attach.ts explicitRunOutranks", "skill_advisor.py _explicit_run_outranks", "past-run fixture rows"]

## Traceability Checks

No core or overlay protocol was completed in this iteration. `spec_code` and `checklist_evidence` start in iteration 4, per the operator focus.

## Integration Evidence

Not applicable: this iteration read the gate copies and the reducer only; no command, workflow, skill, MCP tool, caller agent, or mirror surface was claimed as covered.

## Edge Cases

- The review target's built `dist/` is absent from the tree (gitignored, rebuilt by `npm run build`), so the native gate was read from source and the Python fallback was executed in place with `PYTHONDONTWRITEBYTECODE=1`; no build was run and nothing outside the lineage was written.
- The fixture was checked for `asksForLoopRun`, `stuckRun`, and `writingAbout` parity against the Python copy: 359 cases, 0 mismatches. That confirms the pinned surface only; an unpinned input class can still drift, which is how finding 1 was found.
- Ambiguity: whether a bare "then" is a clause mark is a wording judgment, so finding 2 keeps P2 and states its reopen condition rather than being escalated.

## Confirmed-Clean Surfaces

- `typedCommandIn` / `typedCommandsIn` / `typedCommandForTop`: the longest-key and per-position rules match REQ-025's description, and the retired-name mapping is applied after selection (`command-attach.ts:250-314`).
- The degraded CLI path renders only commands the tracked table names for the row's skill, and an unknown or other-skill string collapses the row to its skill (`skill-advisor-cli.ts:1564-1595`); REQ-038 holds on the read.
- The reducer's `refinesSameLocation`, `stripReviewVerdict`, `replaceAnchorSection`, and `MIN_BLOCKED_ATTEMPTS` implementations match REQ-032, REQ-046, REQ-048 and REQ-052 as worded.
- `asksForLoopRun` over the whole 359-row fixture agrees with the Python copy, so none of the pinned REQ-015 to REQ-053 prompts regressed in this pass.

## Ruled Out

- A TypeScript/Python pattern divergence: the two copies use equivalent bounded-window searches (`LEAD_WINDOW`/`_LEAD_WINDOW` = 400, `endsBefore` vs `search(pos,end)`), and every fixture row agreed; no divergence was found.
- A prototype-pollution or inherited-key read in `modeCommands` / `commands`: both levels are read with `hasOwnProperty` before use (`command-attach.ts:1628-1630`).
- A quadratic prompt scan in `commandOnlyMentioned`: the occurrence positions are monotonic and `forwardSearch` caches each scan, so the path is linear in the number of namings.

## Next Focus

- Dimension: security
- Focus area: untrusted prompt and child-process text in `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `runtime/lib/render.ts`, `runtime/lib/subprocess.ts` and `runtime/skill-advisor-cli.ts`; the 10,000-character head and 400-character lead window as the cost and reach boundary
- Reason: the configured four dimensions must each be recorded, and security is the next risk-ordered dimension; iterations 4 to 7 then run the traceability protocols the operator focus leads with
- Rotation status: correctness reviewed once; security and maintainability remain unrecorded
- Blocked/productive carry-forward: the two gate copies were the productive read surface; the fixture parity check is worth repeating for the security pass
- Required evidence: file:line reads of every trust boundary that consumes prompt text or a child-supplied command string

Review verdict: CONDITIONAL
