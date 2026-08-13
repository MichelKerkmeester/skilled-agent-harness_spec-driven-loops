# Iteration 4: D4 Maintainability — doc hygiene, scaffold residue, sibling edges

## Focus
Dimension: maintainability. Independent audit of doc hygiene, scaffold residue, naming, sibling-edge parity between SKILL.md and graph-metadata.json, leaf-aliases parity, and follow-on change cost. Convergence is telemetry-only under `stopPolicy=max-iterations`, so this iteration broadens the maintainability angle rather than synthesizing.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.08

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
- **F007**: Benchmark README still contains scaffold TODO. `.opencode/skills/sk-communication/benchmark/README.md:19`, the OVERVIEW section reads `TODO describe what this skill is benchmarked on and by which harness.` The README is a create-skill scaffold leftover that was never filled in. The benchmark tree otherwise exists (`benchmark/reports/README.md`), so the TODO is the only unfinished piece. Dimension: maintainability. Recommendation: replace the TODO with a one-paragraph description of what sk-communication is benchmarked on (the manual-testing playbook corpus, per the Lane C harness reference at README.md:33-35) and by which harness (`run-skill-benchmark.cjs`).

- **F009**: Sibling-edge drift between SKILL.md and graph-metadata.json. `.opencode/skills/sk-communication/SKILL.md:183-185` (§5 Related Skills) and `SKILL.md:211-213` (§7 Related Workflows) list `sk-code`, `sk-design`, `sk-git`. `.opencode/skills/sk-communication/graph-metadata.json:11-25` (edges.siblings) lists `sk-code` (0.5), `sk-design` (0.3), `sk-doc` (0.3). The two lists disagree bidirectionally: `sk-git` appears in SKILL.md (twice) but is absent from graph-metadata siblings; `sk-doc` appears in graph-metadata siblings but is absent from SKILL.md §5/§7. The advisor reads graph-metadata for routing and operators read SKILL.md for handoff, so the drift can route to a sibling the docs do not mention and miss a sibling the docs do mention. Dimension: maintainability. Recommendation: reconcile the two lists — either add `sk-git` to graph-metadata siblings and `sk-doc` to SKILL.md §5, or rephrase SKILL.md §5 to match the graph-metadata sibling set, keeping the rationale for each edge.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | pass | advisory | feature-catalog.md vs package paths | 11 catalog features all backed; catalog claims match package paths |
| playbook_capability | partial | advisory | playbook.md vs feature-catalog.md | F008 coverage gaps (5 uncovered features) referenced from iteration 3 |

## Assessment
- New findings ratio: 0.08
- Dimensions addressed: maintainability
- Novelty justification: Maintainability dimension surfaces doc-hygiene and edge-parity findings. Verified:
  1. **leaf-aliases parity holds**: `leaf-manifest.json` carries 20 leaves; `leaf-aliases.json` carries 20 entries. Parity confirmed (20 vs 20).
  2. **Sibling-edge drift (F009)**: SKILL.md §5/§7 list sk-code, sk-design, sk-git; graph-metadata.json siblings list sk-code, sk-design, sk-doc. Bidirectional mismatch confirmed by `rg sk-(code|design|git|doc)` over SKILL.md (lines 183-185, 211-213) and graph-metadata.json (lines 11-25).
  3. **Benchmark README TODO (F007)**: `benchmark/README.md:19` carries an unfilled scaffold TODO. The rest of the benchmark tree (`reports/README.md`) is present.
  4. **Naming and structure**: skill uses class-S standalone structure consistently; leaf-manifest.config.json → leaf-manifest.json → leaf-aliases.json generation chain is coherent; graph-metadata.json schema_version 2 is consistent.
  5. **Follow-on change cost**: low for all findings — F007 is a one-paragraph edit; F009 is a list reconciliation; F002 (iter 1) is a one-line leafRoot removal; F003 (iter 2) is a date-pointer rephrase; F005 (iter 3) is a fingerprint recompute; F006/F008 (iter 3) are catalog/playbook doc additions.

## Ruled Out
- leaf-aliases parity: 20 aliases vs 20 leaves — parity holds.
- Missing benchmark tree: `benchmark/` and `benchmark/reports/` exist with READMEs.
- Inconsistent naming: class-S standalone structure is consistent across SKILL.md, leaf-manifest.config.json, graph-metadata.json.

## Dead Ends
- None this iteration.

## Recommended Next Focus
Iteration 5 stabilization / adversarial replay — re-verify the two P1 findings (F001, F004) against the cited evidence to confirm they are not false positives, and broaden to under-reviewed surfaces (description.json, leaf-aliases content, feature-catalog per-feature files, playbook per-scenario files) to ensure no missed P0/P1 before synthesis.

Review verdict: PASS
