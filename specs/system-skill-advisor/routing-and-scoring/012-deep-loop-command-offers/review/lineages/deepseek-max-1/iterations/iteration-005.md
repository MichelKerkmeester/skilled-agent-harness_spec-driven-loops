# Deep Review Iteration 005 - Maintainability

## Dispatcher
- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Iteration: 5 of 5 (final iteration under the cap)
- Dimension: maintainability
- Operator review focus: The traceability focus is already complete (iterations 3 and 4). This iteration adds the maintainability judgment on the sixth-round surfaces the focus reads, so the final report can state all four dimensions with evidence.
- Scope: the sixth-round additions in the two gate copies, the shared fixture guard, and the closure docs.

## Files Reviewed
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:568]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:747]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1000]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1064]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4859]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4868]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4886]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:61]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:226]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:223]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:641]

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings

1. **The drift guard cannot see the sixth round's highest-churn vocabulary: the refusal-lead alternation is inline in both copies** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580 -- The round added `skip`, `skipping`, `avoid`, `avoiding`, `instead of`, `rather than`, `refuse`, `refused to` and `do not even think about` to `RUN_ASK_NEGATED_SOURCE`, a `String.raw` pattern stored inline. The Python copy repeats the same alternation inline inside `_RUN_ASK_NEGATED_RE` (`skill_advisor.py:4868`). The drift guard compares eleven list pairs (`deep-loop-offer-cases.vitest.ts:61`) and the test file states the reason: "a word added to one side alone still passes every case that never uses that word." That reasoning applies exactly as much to this inline alternation, which is not exported and not compared. The two command-lead groups follow the opposite pattern (`command-attach.ts:1000`, `:1064` build their patterns from exported word lists), so the round already has the better shape available.
Finding class: pattern-drift-risk
Scope proof: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580
Affected surface hints: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4868, .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:61, .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json
Case: a later round adds "refrain from" to the TypeScript alternation only; every fixture case that does not use the phrase still passes in both suites, and no parity test compares the two refusal patterns.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `checklist_evidence` | pass (complete) | specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:291, .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:206 | Completed in iteration 4; the two overstated claims it recorded are R1-P2-001 and R4-P2-001. |
| `spec_code` | pass (complete) | specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580 | Completed in iteration 3 for REQ-001 to REQ-034 and ADR-005/ADR-006. |

## Integration Evidence
- The two command-lead groups are exported lists with a shared parity pair (`command-attach.ts:1000`, `:1064`; `deep-loop-offer-cases.vitest.ts:70` to `:72`), which shows the maintainable shape the refusal leads did not take.
- `integer`-free reasoning notes stay short and durable in `attachCommand` (`:1254` to `:1273`), and no sixth-round comment embeds a REQ, AC, ADR or task id; the framework comment-hygiene rule is respected across the changed code.

## Edge Cases
- The refusal alternation's two-word gap is grammar, not vocabulary, and the comment explains why the gap stays; extracting only the words would leave the gap inline. The recommendation is therefore to export the word alternation, not to restructure the pattern.
- A shared exported list would still need a fixture case per entry to be complete, which is the same rule R1-P2-001 states for the two lists already exported.
- The Python copy's inline pattern uses `\Z` where the TypeScript copy uses `$`; both read at the bounded window's end, so no behavioural drift exists today.

## Confirmed-Clean Surfaces
- No sixth-round comment carries an ephemeral artifact label (REQ, AC, ADR, CHK, packet number or spec path) in `command-attach.ts`, `render.ts`, `advisor-recommend.ts`, `subprocess.ts`, `skill-advisor-cli.ts`, `explicit.ts`, `fusion.ts`, `skill_advisor.py` or `reduce-state.cjs`.
- The shared fixture header (`deep-loop-offer-cases.json:2`) documents each column's layer, which keeps the two-suite contract readable.
- `refinesSameLocation` (`reduce-state.cjs:995`) carries a comment stating the durable why (freed ids, overwritten wording), not a reference to the finding that prompted it.

## Ruled Out
- Duplicated `attachCommand`/Python gate logic as an unmanaged copy: the divergence is explicit in ADR-005 and limitation 8, and each side has a named layer contract.
- Comment-hygiene violations in the changed code: `rg` over the eight changed modules finds no REQ/AC/ADR/task id in a code comment; the only match is the hygiene directive text itself in `render.ts:131`.
- List re-declaration drift in `explicit.ts`: the stage-one rule imports its predicates from `command-attach.ts` rather than copying them.

## Next Focus
- Dimension: none (all four dimensions complete)
- Focus area: synthesis reads the three open P2s and the four protocol rows
- Reason: maxIterations=5 is reached; the next step is the workflow's synthesis phase
- Rotation status: correctness complete, security complete, traceability complete, maintainability complete
- Required evidence: none further under the cap

## Review Verdict
Review verdict: PASS
