# Deep Review Report - gpt55-p017c004-2

## Executive Summary

Verdict: **CONDITIONAL**

This one-iteration fan-out lineage reviewed the correctness of the confidence calibration labeled-set implementation. It found one active P1: the shipped loader accepts only a top-level labeled-pair array, while the bundled starter labeled-set artifact is an object containing metadata and `pairs`. Active counts: P0=0, P1=1, P2=0. Stop reason: `maxIterationsReached`. `hasAdvisories=false`.

## Planning Trigger

Route to remediation planning for F001. The smallest safe fix is to either make `loadLabeledSet()` accept both `LabeledPair[]` and `{ pairs: LabeledPair[] }` with tests against the checked-in starter file, or change the generator/artifact to emit the exact array shape the loader requires.

## Active Finding Registry

| ID | Severity | Dimension | Status | Evidence | Summary |
|----|----------|-----------|--------|----------|---------|
| F001 | P1 | correctness | active | `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts:73-76`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/fit-calibration.mjs:168-181`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/confidence-labeled-set.starter.json:1-5` | Starter labeled set cannot be loaded by the shipped loader without manual unwrapping. |

## Remediation Workstreams

1. Align starter data shape and loader contract.
2. Add a regression test that parses `assets/confidence-labeled-set.starter.json` and passes the result through the supported loader path.
3. Re-run the confidence-calibration tests and the target spec validation after the fix.

## Spec Seed

- Clarify whether the canonical labeled-set file format is `LabeledPair[]` or an object with metadata plus `pairs`.
- If metadata is retained, document the loader accepting the wrapper shape.

## Plan Seed

- Update `loadLabeledSet()` or `fit-calibration.mjs` so the generated starter artifact and loader agree.
- Extend `confidence-calibration.vitest.ts` with a fixture read of the shipped starter asset.
- Re-run the confidence calibration unit tests and strict validation for the target packet.

## Traceability Status

| Protocol | Gate | Status | Notes |
|----------|------|--------|-------|
| spec_code | hard | partial | Rebalance/default-off wiring is present; starter-set loader path has F001. |
| checklist_evidence | hard | partial | Task rows are checked and target strict validation passed; full checklist evidence remains partial because this target is Level 1 and no checklist file exists. |
| feature_catalog_code | advisory | pending | Not covered before maxIterations. |
| playbook_capability | advisory | pending | Not covered before maxIterations. |

## Deferred Items

- Security, maintainability, and full traceability dimensions were not covered in this one-iteration lineage.
- No P2 advisories were recorded.
- No target `resource-map.md` existed at init, so the resource-map coverage gate was skipped.

## Audit Appendix

| Item | Result |
|------|--------|
| Iterations completed | 1 |
| Stop reason | maxIterationsReached |
| Dimensions covered | 1 of 4 |
| New findings ratio | 1.00 |
| Claim adjudication | passed for F001 |
| P0 replay | not applicable, no P0 findings |
| Target strict validation | PASS, 0 errors, 0 warnings |

Replay verdict: activeP0=0 and activeP1=1 maps to CONDITIONAL. The release-readiness state remains `in-progress` because coverage is incomplete and a P1 remains active.
