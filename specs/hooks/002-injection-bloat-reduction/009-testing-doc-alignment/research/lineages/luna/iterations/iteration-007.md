# Iteration 7 — old-contract negative controls

## Focus

Run exact negative controls for the old configured-receipt, epoch-zero, pre-emission, activation-matrix, and suppression wording across the complete target surface.

## Actions Taken

- Searched all 41 playbooks and all 1,498 catalogs for configured receipt, hostReceiptStatus, lifecycle epoch, epoch 0, observed receipt, post-emission, activation-matrix, policy-sink, and question-suppression phrases.
- Searched for changed export names in both target surfaces.
- Reviewed the broader “emission” hits to ensure they were not Gate-3 question emissions.

## Findings

### No old contract appears in target docs

The exact old-contract search returned no hits in either target surface. The changed export search also returned no target-doc hits. This means the corpus does not contain a stale explicit assertion such as:

- a configured/bare receipt confirms delivery;
- lifecycle epoch 0 confirms or seeds suppression;
- observation occurs before stdout emission;
- the default suppression flag is enabled;
- activation-matrix or policy-sink evidence accepts an unobserved receipt.

The many generic “emission” hits are unrelated deep-loop report/state emission, journal events, or generated-output wording. The only relevant delivery phrases remain the Cursor host-event summaries at feature-catalog.md:73, cursor-hooks-and-spec-gate.md:20,28,58-59, and the Cursor playbook's host-event table at manual-testing-playbook.md:444.

### Severity boundary remains stable

- P1 must-fix: detailed Cursor catalog omission, because the entry is the current-state authority for the exact adapter surface and omits invariants covered by the changed test suite.
- P2 optional: root Cursor catalog omission, because it is a high-level index that links to the detailed entry.
- No P0: no target document asserts a behavior that could confirm an unobserved or epoch-0 delivery.
- No playbook stale finding: no test command or expected PASS/FAIL output contradicts the changed contract.

## Questions Answered

- Exact old-contract negative controls are clean across both target surfaces.
- The review has not found a stale manual-testing-playbook snippet.

## Questions Remaining

- Check whether a catalog omission should mention all four stdout adapters and Pi, or only the Cursor adapter visible in the catalog.
- Perform a final scope and evidence audit for file:line precision.
- Continue iterations 8-10 as telemetry-only convergence checks, per the max-iterations policy.

## Next Focus

Review scope classification and file-line evidence, then use iterations 8-10 to challenge the two-catalog finding with alternative interpretations.

