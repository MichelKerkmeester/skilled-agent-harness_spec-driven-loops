# Deep Review Report - Feature Catalog + Testing Playbook Verification Slice

## Executive Summary

Verdict: CONDITIONAL  
Release readiness state: in-progress  
Iterations: 5  
Scope: feature catalog code-reference traceability and manual testing playbook coverage, sampled per target spec.  
Active findings: P0=0, P1=5, P2=3.  
Advisories present: true.

The catalog/playbook pair has no confirmed P0 security or correctness blocker, but it is not release-ready as a verification surface. The active P1 findings all point at traceability drift: stale counts, orphan scenario/index mismatch, incomplete feature-to-scenario classification, broken links, and stale code-reference coverage numbers.

## Planning Trigger

Route to remediation planning before treating the feature catalog and playbook as verified. The trigger is active P1 coverage and traceability drift, not runtime behavior failure.

Primary trigger evidence:

- Root release-readiness count expects 380 scenarios, while the documented count rule currently returns 384.
- Root orphan scenario rule requires zero orphans, while direct path comparison found 90 scenario files not linked by Section 12.
- Feature catalog source-reference extraction found 48 feature files without direct scenario source references or explicit coverage classification.
- Root and scenario markdown link scans found 112 broken relative links total.

## Active Finding Registry

| ID | Severity | Category | Summary | Evidence |
|---|---|---|---|---|
| DR-CAT-P1-001 | P1 | catalog-code-traceability | Code-reference coverage claim is stale: docs claim `192/280` and about 69%, current non-test `.ts` sweep found `195/990` and 19.70%. | `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/feature-catalog-code-references.md:26` |
| DR-CAT-P1-002 | P1 | playbook-coverage | Release-readiness count hard-codes 380 scenario files, but the current tree counts 384 by the documented rule. | `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166` |
| DR-CAT-P1-003 | P1 | playbook-root-index | Root index does not link all scenario files despite the zero-orphan rule. | `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:142` |
| DR-CAT-P1-004 | P1 | feature-to-playbook-coverage | At least 48 catalog feature files lack direct scenario source references or explicit classification. | `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:172` |
| DR-CAT-P1-005 | P1 | link-integrity | Root playbook and scenario files contain broken relative links. | `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3682` |
| DR-CAT-P2-001 | P2 | portability | Validation docs use `FEATURE_CATALOG.md`, which is risky on case-sensitive filesystems. | `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/feature-catalog-annotation-name-validity.md:38` |
| DR-CAT-P2-002 | P2 | playbook-capability | Scenario 135 greps only `mcp_server/` while the catalog scope also names `shared/`. | `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/grep-traceability-for-feature-catalog-code-references.md:38` |
| DR-CAT-P2-003 | P2 | playbook-quality | Scenario 136 has malformed real-user-request and expected-signal text. | `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/feature-catalog-annotation-name-validity.md:18` |

## Remediation Workstreams

1. Regenerate playbook inventory and release-readiness counts.
2. Repair root Section 12 so every scenario file is linked or explicitly classified as non-scenario/supporting documentation.
3. Add a feature-to-scenario coverage ledger with direct, indirect, automated-only, operator-only, and gap states.
4. Add link-integrity validation for root playbook and per-scenario markdown.
5. Refresh item 214 code-reference coverage with an explicit audited-file selection rule and current numbers.
6. Clean up scenario 135/136 command text and path casing.

## Spec Seed

Goal: make feature catalog and manual testing playbook verification claims mechanically reproducible.

Acceptance criteria:

- Scenario count is derived from the filesystem and matches the root index.
- Orphan scenario count is zero after applying the declared scenario/support-file classification.
- Every feature catalog file has an explicit playbook coverage state.
- Link checker exits clean for root playbook and scenario files.
- Code-reference annotation coverage is recalculated from a committed file-selection rule.

## Plan Seed

1. Write a small inventory script that emits scenario files, root-index links, feature catalog files, feature-to-scenario references, and broken links.
2. Run it against current `feature_catalog/` and `manual_testing_playbook/`.
3. Update `manual_testing_playbook.md` Section 5 and Section 12 from script output.
4. Update item 214 with current annotation counts and an explicit exemption policy.
5. Repair broken links and stale scenario references surfaced by the script.
6. Re-run the script and record evidence in the remediation packet.

## Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| `spec_code` | partial | Target spec scope was honored; no reviewed files were modified. |
| `checklist_evidence` | partial | Target packet has no checklist; release-readiness rules were used as verification criteria. |
| `feature_catalog_code` | fail | Active P1 coverage-count drift. |
| `playbook_capability` | fail | Active P1 count/index/link/coverage findings. |
| `resource_map_coverage` | not applicable | Target packet had no `resource-map.md` at init. |

## Deferred Items

- P2 portability cleanup for `FEATURE_CATALOG.md` casing.
- P2 cleanup for scenario 135 root coverage wording.
- P2 cleanup for scenario 136 malformed request text.
- Full exhaustive feature-by-feature semantic review was out of scope; this lineage sampled across the named high-risk surfaces.

## Audit Appendix

Commands and checks run:

- `rg --files` for target packet shape: only `spec.md` was present before lineage init.
- `find .../review/lineages/codex-3`: lineage directory was empty before init.
- Annotation validity: 126 unique annotation names, 238 H3 headings, 0 invalid annotations.
- Feature-to-scenario source-reference extraction: 318 feature files, 276 directly linked by source refs, 48 unlinked.
- Scenario root-index extraction: 384 scenario-like files, 325 root links, 90 unlinked.
- Root scenario count rule: returned 384 while playbook expects 380.
- Markdown link validation: 83 broken root-playbook links, 29 broken scenario links, 0 broken sampled feature-catalog links.
- Code-reference coverage sweep: 990 non-test `.ts` files under audited roots, 195 annotated files, 19.70% coverage.

Convergence:

- Iteration 001 covered correctness and feature-catalog-code traceability.
- Iteration 002 covered spec alignment and playbook traceability.
- Iteration 003 covered security/integrity and portability.
- Iteration 004 covered completeness/maintainability with no new active findings.
- Iteration 005 stabilized with no new P0/P1 findings.

Final verdict: CONDITIONAL.
