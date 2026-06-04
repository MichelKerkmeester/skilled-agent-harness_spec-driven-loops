# Deep Review Report

## Executive Summary

Verdict: CONDITIONAL.

The review converged after five iterations with all four dimensions covered. No P0 findings were found. Three active P1 findings block a clean pass: the root catalog overstates feature-annotation coverage, scenario 136 uses a wrong-case catalog filename, and scenario 138 invokes a stale verifier path. Two P2 advisories remain.

Scope: representative read-only audit of the feature catalog, code-reference traceability page, manual testing playbook root, scenarios 135-138, and sampled implementation annotations.

hasAdvisories: true.

## Planning Trigger

Route this to a small remediation packet before release. The fixes are documentation/playbook updates, but the current playbook cannot validate two of its own verification scenarios as written.

## Active Finding Registry

### F001 - P1 - Root catalog promises universal feature annotations even though current coverage is partial

Evidence:

- [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946] says inline traceability comments exist in every source file.
- [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/214-feature-catalog-code-references.md:26] says coverage is partial and measured as 192 of 280.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/api/eval.ts:1] shows a sampled source header with MODULE metadata but no feature annotation in the opened header block.

Observed count: 195 annotated non-test TypeScript files out of 437 under `mcp_server/` and `shared/` with the broad review filter used in this pass.

Fix: update root catalog wording to partial/measured coverage, refresh the metric, and either add annotations or document explicit exemptions.

### F002 - P1 - Annotation-name validity scenario uses the wrong-case catalog filename

Evidence:

- [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/232-feature-catalog-annotation-name-validity.md:38] tells operators to extract headings from `feature_catalog/FEATURE_CATALOG.md`.
- [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:13] is the actual root catalog file used by the package.

Observed check: exact-case discovery finds no `FEATURE_CATALOG.md` entry, while `feature_catalog.md` exists. The uppercase path can pass on case-insensitive macOS but is not portable to case-sensitive environments.

Fix: replace the uppercase filename in scenario 136 and related text with the actual lower-case root file.

### F003 - P1 - MODULE header compliance scenario invokes the verifier from a stale path

Evidence:

- [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/234-module-header-compliance-via-verify-alignment-drift-py.md:38] runs `python3 ../sk-code/scripts/verify_alignment_drift.py --root .`.
- [SOURCE: .opencode/skills/sk-code/SKILL.md:192] documents the canonical verifier under `assets/scripts`.
- [SOURCE: .opencode/skills/sk-code/references/opencode/shared/alignment_verification_automation.md:22] repeats the canonical path.

Observed check: the stale path fails with file-not-found; the canonical `../sk-code/assets/scripts/verify_alignment_drift.py --root .` path reports PASS with zero findings.

Fix: update scenario 138 and the linked catalog verification row to the canonical verifier path.

### F004 - P2 - Root playbook scenario count is stale by one file

Evidence:

- [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:140] says the playbook contains 380 scenario files.

Observed count: numbered scenario files under `manual_testing_playbook/` currently total 381.

Fix: refresh the root count while updating the broken scenarios.

### F005 - P2 - Representative implementation row cites a file that does not actually carry a feature annotation

Evidence:

- [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/214-feature-catalog-code-references.md:40] says `mcp_server/handlers/index.ts` shows both MODULE and Feature catalog conventions.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/index.ts:1] begins the file header; the opened header block has MODULE metadata but no feature annotation.

Fix: choose a representative annotated handler or narrow the row to say it demonstrates only the MODULE convention.

## Remediation Workstreams

1. Catalog wording and metrics: fix F001 and F005 together.
2. Playbook command repair: fix F002 and F003, then rerun scenarios 136 and 138.
3. Root playbook refresh: fix F004 as part of the same generated/index refresh pass.

## Spec Seed

Add a remediation spec for catalog/playbook verification drift:

- Correct feature catalog annotation coverage language and measured counts.
- Correct scenario 136 catalog filename references.
- Correct scenario 138 verifier path references.
- Refresh manual playbook scenario count.
- Verify corrected commands produce runnable evidence.

## Plan Seed

1. Update `feature_catalog.md` and `214-feature-catalog-code-references.md`.
2. Update playbook scenarios 136 and 138 plus root playbook snippets.
3. Run corrected annotation-name validation and verifier commands.
4. Recount feature and scenario files and update root counts.
5. Re-run this slice or a targeted follow-up review.

## Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| spec_code | pass | The read-only slice was executed against representative catalog/playbook files. |
| checklist_evidence | pass | No checklist exists for this Level 1 slice; not applicable. |
| feature_catalog_code | partial | F001 and F005 remain active. |
| playbook_capability | partial | F002, F003, and F004 remain active. |

## Deferred Items

- Exhaustive catalog-to-playbook 1:1 mapping was out of scope.
- Code Graph was unavailable; grep/read evidence was used instead.
- Continuity save was not run because the fan-out instruction constrained writes to the lineage artifact directory.

## Audit Appendix

Iterations:

| Iteration | Dimension | Result |
|---:|---|---|
| 1 | correctness | F001 |
| 2 | security | no finding |
| 3 | traceability | F002, F003, F005 |
| 4 | maintainability | F004 |
| 5 | stabilization | no new finding |

Command evidence:

- Suggested scenario 231 greps returned handler and lib hits for Hybrid search pipeline, Classification-based decay, and Prediction-error save arbitration.
- Corrected scenario 136 logic found 126 unique annotations, 238 root H3 headings, and 0 invalid names.
- Documented scenario 138 stale command failed with file-not-found.
- Corrected verifier command reported PASS, scanned 1497 files, and found 0 findings.
- `validate.sh <spec-folder> --strict` was attempted, but the validator exited before rule execution because the node orchestrator/TS loader path was unavailable in this worktree. JSON, JSONL, and iteration final-line contracts passed local validation.

Convergence replay:

- Last two new-finding ratios: 0.05, 0.00.
- Rolling average: 0.025, below 0.08 threshold.
- Dimension coverage: 1.0.
- Required protocols: covered or not applicable.
- Graph convergence fallback: STOP_ALLOWED.
- Final verdict: CONDITIONAL because active P1 findings remain.
