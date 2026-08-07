# Iteration 001 — Inventory Pass

## Dimension

Inventory pass for the full `.opencode/skills/sk-design` skill family: hub, six modes, shared/cross-cutting directories, and `design-md-generator` sampling strategy.

## Files Reviewed

- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:1`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166`
- `.opencode/skills/sk-design/mode-registry.json:38`
- `.opencode/skills/sk-design/hub-router.json:1`
- `.opencode/skills/sk-design/design-interface/SKILL.md:49`
- `.opencode/skills/sk-design/design-mcp-open-design/scripts/install.sh:1`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:16`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts:44`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:259`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:136`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:254`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:307`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:642`

## Inventory Results

- Real top-level structure confirmed: hub files plus `benchmark/`, `changelog/`, `feature_catalog/`, `manual_testing_playbook/`, `shared/`, and six mode packets: `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, `design-mcp-open-design`.
- `design-md-generator/node_modules/` exists and is excluded from review scope as a dependency tree.
- Excluding `node_modules`, the whole `sk-design` tree contains 494 files by extension: `md=329`, `ts=61`, `json=24`, `js=21`, `map=21`, `html=20`, `py=9`, `mjs=4`, `sh=3`, plus one `.npmignore` and one `.txt`.
- Excluding `node_modules`, `design-md-generator` contains 172 files, not the strategy's initial 2847-file estimate. Breakdown: `backend=113`, `references=23`, `manual_testing_playbook=19`, `feature_catalog=9`, `assets=3`, `procedures=1`, `changelog=1`.
- Executable-looking reviewed-risk surface outside dependencies is concentrated in `design-md-generator/backend/scripts/*.ts` and `design-mcp-open-design/scripts/*.sh`.
- The seven known-context backend files all exist: `build-write-prompt.ts`, `extract.ts`, `guided-run.ts`, `report-gen.ts`, `preview-gen.ts`, `proof.ts`, and `css-analyzer.ts`.

## Findings by Severity

### P0

None.

### P1

#### P1-001 [P1] Standalone md-generator artifact writers bypass the central output boundary

- Claim: `preview-gen.ts`, `proof.ts`, and `report-gen.ts` can write generated artifacts to caller-supplied directories without validating the destination through the central spec-folder/sandbox output policy.
- EvidenceRefs: `.opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts:44` defines the positive allowlist policy; `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:254` accepts `outputDir`, builds `preview.html`, and writes it at lines 257-259 while importing only `ensureWritableFile` at line 12; `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:325` builds paths from `outputDir`, only checks overwrite at lines 327-328, and writes at lines 445 and 450 while importing only `ensureWritableFile` at line 13; `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:642` accepts `outputDir`, builds `report.html`, and writes at lines 661-664 while importing only `ensureWritableFile` at line 13.
- CounterevidenceSought: Checked the centralized policy and adjacent callers. `extract.ts` validates and replaces `options.output` through `resolveOutputPath` at `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:270` and `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:280`; `guided-run.ts` preflights `resolveOutputPath` at `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:140`. No equivalent boundary call was present in the three standalone generators' imports or write paths.
- AlternativeExplanation: If these scripts are intended to be callable only from `guided-run.ts`, the guided-run preflight reduces the risk for that path. The files expose standalone CLI entrypoints, so direct invocation remains a supported path and can bypass the boundary.
- FinalSeverity: P1.
- Confidence: 0.89.
- DowngradeTrigger: Downgrade to P2 or close if a later pass finds an upstream wrapper or CLI contract that makes direct invocation unsupported and unreachable, or if the generators are patched to resolve `outputDir` through `requireOutputPath`/`resolveOutputPath` before any mkdir/write.
- Finding class: cross-consumer.
- Affected surface hints: `preview-gen.ts`, `proof.ts`, `report-gen.ts`, `output-policy.ts`, `guided-run.ts`.
- Recommendation: Apply the same output-policy boundary to every standalone artifact writer before constructing output file paths, then keep `ensureWritableFile` as the overwrite guard.

### P2

None.

## Traceability Checks

- `spec_code`: Inventory confirmed the planned review target exists as the hub plus six mode packets. The strategy's `design-md-generator` file-count claim is stale when dependency files are excluded.
- `checklist_evidence`: No checklist completion was modified in this iteration; this pass produced review evidence only.
- `skill_agent`: Hub routing files reference all six mode packets and the spot-checked packet files exist.
- `agent_cross_runtime`: `design-mcp-open-design/scripts/install.sh:1` is shell automation and remains scoped to local readiness checks; deeper transport coverage is deferred.
- `feature_catalog_code`: Feature catalog directories exist at hub and mode levels; detailed catalog-to-code validation deferred to wave assignments.
- `playbook_capability`: Manual testing playbook directories exist at hub and mode levels; detailed playbook-to-capability validation deferred.

## Verdict

CONDITIONAL. One live P1 was confirmed in the `design-md-generator` backend sampling surface.

## Next Dimension

Wave 1 should proceed with four non-overlapping hub/cross-cutting assignments. Later waves should keep `design-md-generator` backend as the dominant risk surface, but the sampling plan should be corrected from the stale 2847-file non-dependency estimate to 172 in-scope files, with backend scripts still prioritized.

Review verdict: CONDITIONAL
