# Iteration 4: Maintainability — comment hygiene, test coverage, playbook/catalog parity

## Focus

Dimension: Maintainability. Files: diffed engine sources (`semantics.ts`, `validator.ts`, `copy-editing-instruction.ts`, `contracts/projection.ts`) for D9 comment-hygiene; `test/fidelity/validator.test.ts`, `test/fidelity/*`, `test/config/copy-editing-instruction.test.ts` for coverage of the new veto/no-op logic; `.opencode/skills/sk-communication/feature-catalog/feature-catalog.md` and `.opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` for the `feature_catalog_code`/`playbook_capability` overlay protocols; `SKILL.md` section 3 for the single-exclusion claim consistency check flagged in iteration 1.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 9 (4 source + 4 test files/dirs + feature-catalog.md + manual-testing-playbook.md + SKILL.md)
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.45

## Findings

### P1, Required

- **F005**: The new claim-coverage fidelity veto and the no-op/reworded classification ship with zero test coverage anywhere in the package, `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/semantics.ts:130` (`compareClaimCoverage`, `extractClaimSentences`, `stemWord`) and `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:229,267` (`changeKind`). `grep -rln "compareClaimCoverage|extractClaimSentences|stemWord|changeKind" test/` across the whole package returns only `test/config/copy-editing-instruction.test.ts` (which tests instruction resolution, not the veto), and `test/fidelity/validator.test.ts` (314 lines, the file that would own this coverage) has zero references to `changeKind`, `claim`, `no-op`, or `CLAIM_OMITTED`. This is the package's second layer of defense against a rewrite that silently drops a claim, caveat, or requirement — untested logic in that path is exactly the "missing validation" the repo's own quality bar (changed behavior must get coverage) exists to catch, and `goal.md`'s LOG cites "82 files 455 tests exit 0" as the phase-004 quality evidence without this gap being visible in that count.

### P2, Suggestion

- **F006**: `manual-testing-playbook.md` has no scenario covering any of the phase-004 additions, `.opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` (all 9 scenarios COMM-001 through COMM-009, none mention `no-op`, `claim-omitted`, the single-instruction resolution, or the `thinkingMode: 'provider-default'` change). `feature_catalog_code` (the sibling overlay protocol) is current — `feature-catalog.md:119` accurately narrates the claim-omission check, the no-op recording, and the cached single-instruction resolution — so this is specifically a manual-playbook gap, not a catalog gap.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | pass | advisory | `.opencode/skills/sk-communication/feature-catalog/feature-catalog.md:119` | Catalog prose matches the actual shipped behavior (claim-omission check, no-op recording, cached single instruction) precisely |
| playbook_capability | fail | advisory | `.opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` (COMM-001..009) | No scenario exercises any phase-004 addition — F006 |

## Assessment

- New findings ratio: 0.45
- Dimensions addressed: maintainability
- Novelty justification: Grepped every diffed source file's comments for D9-forbidden ids (`ADR-`, phase numbers, `packet`, `REQ-`, `T[0-9]` task ids) — zero hits, D9 holds cleanly, worth recording as a verified pass rather than assumed. Confirmed the SKILL.md/command-doc "one part excluded" consistency flagged in iteration 1's diff read is accurate against the live `sk-doc` wording-standard exclusion table (`SKILL.md:176-180`, exactly one row, `VOICE PERSONALITY`). The test-coverage gap (F005) is the substantive new finding — found by grepping test/ for the new function/field names rather than trusting the "455 tests" headline count.

## Ruled Out

- D9 comment-hygiene violation in the diffed engine files: ruled out, targeted grep for `ADR-|phase [0-9]|packet|006-|004-|002-|spec/|REQ-|task T[0-9]` inside `//`/`*` comment lines across all 6 touched source files returned zero matches.
- `feature-catalog.md` staleness: ruled out, its phase-004 prose was read line-by-line against the actual `copy-editing-instruction.ts`/`validator.ts` behavior and matches.

## Dead Ends

None this iteration.

## Claim Adjudication Packets

```json
{
  "findingId": "F005",
  "claim": "compareClaimCoverage (the new claim-omission fidelity veto) and the AcceptedFidelityOutcome.changeKind no-op/reworded classification have no test anywhere in the package's test/ tree.",
  "evidenceRefs": [
    ".opencode/skills/sk-communication/cli-communication-projection/src/fidelity/semantics.ts:130",
    ".opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:229",
    ".opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:267",
    ".opencode/skills/sk-communication/cli-communication-projection/test/fidelity/validator.test.ts:1-314"
  ],
  "counterevidenceSought": "Ran grep -rln for compareClaimCoverage, extractClaimSentences, stemWord, and changeKind across the entire test/ directory (not just test/fidelity/); also checked test/config/copy-editing-instruction.test.ts in full on the chance it exercised the veto indirectly through an end-to-end prompt-profile test -- it only asserts instruction-string resolution and caching, never calls validateProjectionCandidate.",
  "alternativeExplanation": "The 82-file, 455-test count cited in goal.md's LOG could include tests added in a location this grep missed, e.g. a differently-named file or an inline test block. Rejected as the primary explanation: grep -rln for the four specific new identifiers across the whole test/ tree (not scoped to one subfolder) returned only the unrelated copy-editing-instruction.test.ts hit, and test/fidelity/validator.test.ts -- the file structurally responsible for this coverage, evidenced by it already covering every other fallback branch in the same function -- has none of the new branches.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If a test file outside the grepped identifiers exercises the same code paths by construction (e.g. a black-box fixture that happens to trigger CLAIM_OMITTED without naming it), downgrade to P2 once that fixture is identified and confirmed to assert on the reasonCode or changeKind fields.",
  "transitions": [
    { "iteration": 4, "from": null, "to": "P1", "reason": "Initial discovery: new safety-relevant veto and a new output field both ship with zero direct or indirect test coverage" }
  ]
}
```

## Recommended Next Focus

Iteration 5: Broaden. Do not synthesize yet (stopPolicy=max-iterations, 5 iterations required regardless of convergence telemetry). Widen scope to the remaining child phases not yet directly read (007-wording-standard-restructure's base+supplement split itself, 009-adjacent-surface-rules' two candidates, 005-verification-and-rollout's harness/baseline claims) and re-sweep correctness/security/traceability against them for anything the dimension-by-dimension pass on phases 003/004 missed. Also revisit F003 (goal.md checklist row) for a second, independent read in case new evidence changes the adjudicated severity.
