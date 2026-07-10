# Deep Review Iteration 017

## Dimension

- correctness
- traceability
- Target: `design-md-generator` non-backend surfaces only (`SKILL.md`, `README.md`, `assets/**`, `procedures/**`, `references/**`, `feature_catalog/**`, `manual_testing_playbook/**`, `changelog/**`).

## Files Reviewed

- `.opencode/skills/sk-design/design-md-generator/SKILL.md:12` through `.opencode/skills/sk-design/design-md-generator/SKILL.md:414`
- `.opencode/skills/sk-design/design-md-generator/README.md:26` through `.opencode/skills/sk-design/design-md-generator/README.md:155`
- `.opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:39` through `.opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:98`
- `.opencode/skills/sk-design/design-md-generator/feature_catalog/05--report-preview/report-preview.md:20` through `.opencode/skills/sk-design/design-md-generator/feature_catalog/05--report-preview/report-preview.md:91`
- `.opencode/skills/sk-design/design-md-generator/changelog/v1.0.0.0.md:1` through `.opencode/skills/sk-design/design-md-generator/changelog/v1.0.0.0.md:35`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/README.md:17` through `.opencode/skills/sk-design/design-md-generator/backend/scripts/README.md:23` as backend cross-check only, not reviewed scope.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:13` through `.opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:18` as backend cross-check only, not reviewed scope.
- Glob coverage confirmed assigned markdown surfaces under `assets/**`, `procedures/**`, `references/**`, `feature_catalog/**`, `manual_testing_playbook/**`, and `changelog/**`; targeted grep sampled backend-file references, report/proof claims, example assets, and changelog frontmatter.

## Findings By Severity

### P0

- None.

### P1

- None new.

Existing-finding corroboration, not recounted: `.opencode/skills/sk-design/design-md-generator/feature_catalog/05--report-preview/report-preview.md:59` claims `report-gen.ts`, `preview-gen.ts`, and `proof.ts` all resolve output directories through shared `output-policy` and refuse overwrites without `--force`. The prior registry already has active `P1-001` for standalone md-generator artifact writers bypassing the central output boundary, so this is supporting evidence for that active finding rather than a new finding.

### P2

#### P2-017-001 [P2] Resource-domain reference count is stale after adding `guided_run.md`

- File: `.opencode/skills/sk-design/design-md-generator/SKILL.md:89`
- Claim: The resource-domain summary says the router discovers "nine reference docs" plus examples and assets.
- Evidence: The same resource block lists `references/guided_run.md` at `.opencode/skills/sk-design/design-md-generator/SKILL.md:103`, in addition to the nine established top-level reference docs listed at `.opencode/skills/sk-design/design-md-generator/SKILL.md:92` through `.opencode/skills/sk-design/design-md-generator/SKILL.md:100`.
- Counterevidence sought: Glob inventory for assigned `references/**` showed the current reference surface includes the guided-run reference and example files; no evidence found that `guided_run.md` is intentionally excluded from the resource-domain count.
- Alternative explanation: The "nine" count may have been correct before the guided-run wrapper contract was added and was not updated with that addition.
- Finding class: matrix/evidence
- Scope proof: The stale count is isolated to the summary sentence; the loading table and resource map still name `references/guided_run.md`, so routing is not blocked.
- Affected surface hints: [`SKILL.md`, `references/guided_run.md`, `resource loading docs`]
- Risk score: 2 (advisory only)
- Recommendation: Change the count to the current number or remove the hard-coded count so the summary does not drift again.
- Final severity: P2
- Confidence: 0.88
- Downgrade trigger: Downgrade to no finding if maintainers define "reference docs" as excluding guided-run wrapper docs despite listing `guided_run.md` in the same resource domain.

## Traceability Checks

- `spec_code`: PASS. `SKILL.md`'s core extract-write-validate pipeline matches sampled backend script documentation: backend scripts own extract/cluster/write-prompt/validate/report at `backend/scripts/README.md:17` through `backend/scripts/README.md:23`, and `cli.ts` points users to `extract.ts` from repo root at `backend/scripts/cli.ts:13` through `backend/scripts/cli.ts:18`.
- `checklist_evidence`: N/A. This leaf review produced evidence artifacts only and did not modify checklist completion state.
- `skill_agent`: PASS. The review stayed in the `deep-review` leaf workflow and did not dispatch sub-agents.
- `agent_cross_runtime`: N/A. The assigned target is a skill packet documentation/config surface, not a runtime agent definition.
- `feature_catalog_code`: PARTIAL. Catalog-to-backend traceability was sampled. One catalog claim at `feature_catalog/05--report-preview/report-preview.md:59` corroborates existing active `P1-001` and is not counted as a new finding.
- `playbook_capability`: PARTIAL. Manual playbook files were included in glob/grep coverage; no new mismatch was confirmed in the sampled report, extraction, and guided-run paths.
- `changelog_frontmatter`: PASS. The assigned changelog has `version: 1.0.0.0` at `.opencode/skills/sk-design/design-md-generator/changelog/v1.0.0.0.md:3`.

## Verdict

PASS. This iteration found one new P2 advisory and no new P0/P1 findings. Existing active `P1-001` remains corroborated but was not recounted.

## Next Dimension

Continue Wave 5 coverage for remaining `design-md-generator` security/maintainability and cross-hub routing consistency, preserving the current non-overlap boundaries.

Review verdict: PASS
