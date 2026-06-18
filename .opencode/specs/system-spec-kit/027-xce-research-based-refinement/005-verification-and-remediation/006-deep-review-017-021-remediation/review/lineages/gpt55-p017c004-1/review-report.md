# Deep Review Report - gpt55-p017c004-1

## Executive Summary

- Verdict: CONDITIONAL
- hasAdvisories: false
- Stop reason: maxIterationsReached
- Iterations: 1
- Active findings: P0=0, P1=1, P2=0
- Release readiness: in-progress
- Scope: confidence calibration labeled-set packet, implementation loader, flag wiring, tests, and starter assets.

The production search path remains safely inert for empirical calibration: calibration is opt-in and requires a configured model path. The blocking issue is in the offline/follow-up path: the shipped starter labeled-set file cannot be consumed by the shipped labeled-set loader without an undocumented unwrap step.

## Planning Trigger

`/speckit:plan` is required because the review has one active P1 finding.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "F001",
      "severity": "P1",
      "title": "Starter labeled-set file is not loadable by the shipped labeled-set loader",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/confidence-labeled-set.starter.json:1-5"
    }
  ],
  "remediationWorkstreams": [
    "Align starter labeled-set JSON shape with loadLabeledSet() or widen loadLabeledSet() to accept the shipped pairs[] wrapper.",
    "Add a regression that parses confidence-labeled-set.starter.json and verifies the loader returns 100 pairs."
  ],
  "specSeed": [
    "Clarify whether the canonical labeled-set artifact is a top-level pair array or a metadata wrapper with pairs[]."
  ],
  "planSeed": [
    "Choose the asset-shape or loader-widening path, implement the smallest change, then rerun confidence-calibration tests plus a starter-asset loader regression."
  ],
  "findingClasses": [
    "artifact-contract-mismatch"
  ],
  "affectedSurfacesSeed": [
    "offline calibration follow-up",
    "starter labeled-set asset",
    "loadLabeledSet consumer contract"
  ],
  "fixCompletenessRequired": false
}
```

## Active Finding Registry

| ID | Severity | Dimension | Finding | Evidence | Recommendation |
|----|----------|-----------|---------|----------|----------------|
| F001 | P1 | correctness | Starter labeled-set file is not loadable by the shipped labeled-set loader. | `confidence-calibration.ts:73-76`; `fit-calibration.mjs:5-6`; `fit-calibration.mjs:168-181`; `confidence-labeled-set.starter.json:1-5`; reproduction output `labeled set must be a JSON array of {query, memoryId, relevant}` | Make the starter JSON a top-level pair array, or make `loadLabeledSet()` accept the documented wrapper and validate `pairs[]`; add a regression against the shipped starter file. |

## Remediation Workstreams

1. Contract alignment: decide whether the durable format is top-level pair array or metadata wrapper with `pairs[]`.
2. Implementation/test: update either the asset generator/fixture or `loadLabeledSet()`, then add a shipped-starter regression.
3. Documentation: update implementation summary/spec wording if the metadata wrapper remains supported.

## Spec Seed

- The calibration starter labeled-set artifact must be directly consumable by the documented loader path, or the spec must name the required unwrap step and its owning helper.
- Acceptance criterion: parsing `assets/confidence-labeled-set.starter.json` and passing it through the intended labeled-set loader returns the expected 100 pairs.

## Plan Seed

- Add a test fixture that reads the shipped starter file.
- If choosing top-level array: modify `fit-calibration.mjs` to write `labeled` directly and move provenance to a separate sidecar or comments-free README.
- If choosing wrapper support: modify `loadLabeledSet()` to accept either an array or `{ pairs: [...] }`, then validate the `pairs` array with the existing strict entry checks.
- Re-run `confidence-calibration.vitest.ts` and the read-only starter loader reproduction.

## Traceability Status

### Core Protocols

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `confidence-calibration.ts:73-76`; `confidence-labeled-set.starter.json:1-5` | Loader and shipped starter asset disagree. |
| `checklist_evidence` | notApplicable | hard | target folder lacks `checklist.md` | Level 1 packet; no checklist evidence surface. |

### Overlay Protocols

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `feature_catalog_code` | pass | advisory | `search-flags.ts:613-644`; `confidence-scoring.ts:217-222` | Calibration remains opt-in and model-path gated. |
| `playbook_capability` | partial | advisory | F001 | The real-labeling follow-up path needs a loader-compatible starter artifact. |

`AC_COVERAGE`: exempt. The target is Level 1 and has no `checklist.md`.

## Deferred Items

- Security dimension was not separately covered because `maxIterations=1` stopped after the correctness pass.
- Maintainability dimension was not separately covered. Sibling lineage evidence already captured lower-severity model bloat and boolean-edge test gaps.

## Search Ledger

*No search-depth state captured (legacy v1 record)*.

## Audit Appendix

| Item | Result |
|------|--------|
| Iteration count | 1 |
| Dimension coverage | 1 / 4 (`correctness`) |
| Stop reason | maxIterationsReached |
| Code graph | blocked: stale graph required full scan; direct reads and exact Grep used instead |
| Memory context | blocked by `E_SESSION_SCOPE`; packet-local docs used instead |
| Reproduction | Parsed starter JSON and called `loadLabeledSet()`; observed `labeled set must be a JSON array of {query, memoryId, relevant}` |

### Sources Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/confidence-calibration.vitest.ts`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/implementation-summary.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/fit-calibration.mjs`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/confidence-labeled-set.starter.json`
