# Deep Review Report - Feature Catalog + Testing Playbook Verification Slice

## Executive Summary

- Verdict: CONDITIONAL
- hasAdvisories: false
- Active findings: P0=0, P1=3, P2=1
- Iterations: 5
- Stop reason: converged
- Scope: representative audit of feature-catalog-to-code traceability and manual-testing-playbook coverage for the system-spec-kit catalog/playbook surfaces.

The review found no P0 release blockers. It did find three P1 defects that make the catalog/playbook verification surface unreliable as a release-readiness gate until fixed.

## Planning Trigger

`/speckit:plan` is required because the verdict is CONDITIONAL and active P1 findings remain.

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
      "title": "Master catalog overstates feature annotation coverage as every source file",
      "evidence": ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946"
    },
    {
      "id": "F002",
      "severity": "P1",
      "title": "Manual playbook deterministic count expects 380 files but current tree has 384",
      "evidence": ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166"
    },
    {
      "id": "F003",
      "severity": "P1",
      "title": "MODULE header scenario points to the old verifier path",
      "evidence": ".opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md:38"
    },
    {
      "id": "F004",
      "severity": "P2",
      "title": "Local-LLM category catalog points operators at 40*.md specs while the files are numbered 361-375",
      "evidence": ".opencode/skills/system-spec-kit/feature_catalog/local-llm-query-intelligence/category-overview.md:47"
    }
  ],
  "remediationWorkstreams": [
    "Correct catalog coverage language and keep master/feature-specific entries aligned.",
    "Refresh playbook scenario-count logic and expected count.",
    "Update verifier paths in feature catalog and playbook scenario 234.",
    "Align local-LLM catalog source-file patterns with actual scenario filenames or rename files consistently."
  ],
  "specSeed": [
    "State that the follow-up fixes documentation/playbook verification drift only.",
    "Require rerunning scenario-count, annotation-name validation, and MODULE-header validation after edits."
  ],
  "planSeed": [
    "Patch feature_catalog.md and feature-catalog-code-references.md wording/path references.",
    "Patch manual_testing_playbook.md deterministic count gate.",
    "Patch scenario 234 command to use ../sk-code/assets/scripts/verify_alignment_drift.py.",
    "Patch local-LLM category overview source-file row or scenario filenames."
  ],
  "findingClasses": [
    "doc_claim_drift",
    "stale_release_gate",
    "non_executable_validation_step",
    "stale_path_pattern"
  ],
  "affectedSurfacesSeed": [
    "feature_catalog",
    "manual_testing_playbook",
    "sk-code verifier reference"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

| ID | Severity | Title | Evidence | Impact | Fix |
|---|---|---|---|---|---|
| F001 | P1 | Master catalog overstates feature annotation coverage as every source file | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946` | Operators may assume universal code-to-catalog traceability when coverage is documented elsewhere as partial. | Reword master catalog to measured/current coverage and align with feature 214. |
| F002 | P1 | Manual playbook deterministic count expects 380 files but current tree has 384 | `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166` | Release-readiness check fails/stales before scenario verdicts can be trusted. | Recompute intended scenario count and update both prose and deterministic check. |
| F003 | P1 | MODULE header scenario points to the old verifier path | `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md:38` | Scenario 138 cannot execute as written even though the underlying verifier passes at its real path. | Replace stale `../sk-code/scripts/...` references with `../sk-code/assets/scripts/...` or restore a wrapper. |
| F004 | P2 | Local-LLM category catalog points operators at 40*.md specs while the files are numbered 361-375 | `.opencode/skills/system-spec-kit/feature_catalog/local-llm-query-intelligence/category-overview.md:47` | Catalog source-file row sends operators to a non-matching scenario pattern. | Align the source table with actual file names or rename scenario files to match scenario IDs. |

## Remediation Workstreams

1. Catalog wording and traceability truth: fix F001 and rerun annotation counts.
2. Playbook release gate: fix F002 and rerun the embedded deterministic count.
3. Playbook command executability: fix F003 and rerun scenario 234 with the documented command.
4. Advisory path cleanup: fix F004 while touching local-LLM catalog/playbook references.

## Spec Seed

- The follow-up scope is documentation and verification-surface repair.
- Acceptance should require all documented validation commands to execute from their stated working directories.
- Acceptance should require the playbook count and catalog source-file patterns to match the current tree.

## Plan Seed

- Update master catalog feature 214 prose from universal coverage to measured coverage.
- Update `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` count from 380 to the intended current value, or change the count script to exclude non-scenario support docs.
- Update scenario 234 and feature 214 verifier paths to `../sk-code/assets/scripts/verify_alignment_drift.py`.
- Update local-LLM category source rows from `40*.md` to the current path convention, or rename scenario files.
- Re-run the grep traceability sample, annotation-name validation, playbook count, and MODULE-header verifier.

## Traceability Status

### Core Protocols

| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | The slice objective was executed on a representative sample, but active findings show traceability gaps remain. |
| checklist_evidence | partial | No checklist.md exists in this Level 1 slice; success criteria were checked against spec.md. |

### Overlay Protocols

| Protocol | Status | Notes |
|---|---|---|
| feature_catalog_code | partial | Scenario 231/232 positive checks pass, but F001 and F004 show catalog drift. |
| playbook_capability | fail | F002 and F003 show stale release gate and non-executable documented command. |

## Deferred Items

- F004 is advisory but should be repaired with the P1 batch because it sits in the same catalog/playbook traceability surface.
- A broader full-corpus catalog/playbook reconciliation remains outside this representative slice.

## Search Ledger

- searchCoverage.graphCoverageMode: graphless_fallback
- candidateCoverage.covered: doc_claim_drift, stale_release_gate, non_executable_validation_step, stale_path_pattern
- searchDebt: none
- ruledOutCandidates:
  - Scenario 231 sample greps returned handler and lib hits for the three documented examples.
  - Scenario 232 annotation-name validation found 0 invalid annotation names.
  - Correct MODULE verifier path reports PASS with 0 findings.

## Audit Appendix

### Convergence

- Iteration ratios: 1.0000, 0.0000, 0.0625, 0.0000, 0.0000
- Dimension coverage: 4/4 plus stabilization
- Stop reason: converged
- Final verdict: CONDITIONAL

### Evidence Commands

- Counted current playbook files with the same glob shape as the root playbook: 384.
- Counted current feature catalog files: 318, matching the root playbook's feature-file count claim.
- Counted non-test `.ts` files under system-spec-kit `mcp_server`, `shared`, and `scripts`: 530 total, 530 with MODULE header in first five lines, 195 with feature annotations.
- Ran scenario 231 sample greps for `Hybrid search pipeline`, `Classification-based decay`, and `Prediction-error save arbitration`; all returned handler and lib hits.
- Ran corrected annotation-name validation: 126 unique annotations, 238 headings, 0 invalid annotations.
- Ran corrected MODULE verifier path: `[alignment-drift] PASS`, 0 findings.

### Sources Reviewed

- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skills/system-spec-kit/feature_catalog/FEATURE_CATALOG.md`
- `.opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/grep-traceability-for-feature-catalog-code-references.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/feature-catalog-annotation-name-validity.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/multi-feature-annotation-coverage.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md`
- `.opencode/skills/system-spec-kit/feature_catalog/local-llm-query-intelligence/category-overview.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/local-llm-query-intelligence/README.md`
