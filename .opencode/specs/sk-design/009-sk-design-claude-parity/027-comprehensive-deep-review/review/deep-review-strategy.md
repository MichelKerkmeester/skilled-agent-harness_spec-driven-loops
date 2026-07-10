# Deep Review Strategy — sk-design Comprehensive Review

## Rotation Plan (20 iterations, 6 waves, parallel dispatch)

| Wave | Iterations | Parallel? | Areas | Dimensions |
|------|-----------|-----------|-------|------------|
| 0 | 1 | No (solo) | Inventory — confirm structure, finalize `design-md-generator` sampling strategy | n/a |
| 1 | 2-5 | Yes (4) | Hub tier (SKILL.md/mode-registry/hub-router/description/graph-metadata/README) + hub-level cross-cutting (`shared/`, `benchmark/`, `feature_catalog/`, `changelog/`, `manual_testing_playbook/`) | correctness+sk-doc conformance / security+traceability / shared+benchmark correctness+maintainability / feature_catalog+changelog+playbook correctness+traceability |
| 2 | 6-9 | Yes (4) | `design-interface` + `design-foundations` | correctness+security / traceability+maintainability+sk-doc, per packet |
| 3 | 10-13 | Yes (4) | `design-audit` + `design-motion` | correctness+security / traceability+maintainability+sk-doc, per packet |
| 4 | 14-17 | Yes (4) | `design-mcp-open-design` (combined, transport-exempt lighter pass) + `design-md-generator` backend (3 iterations: correctness+security / traceability+maintainability+sk-doc / non-backend docs) | see above |
| 5 | 18-20 | Yes (3) | `design-md-generator` remaining coverage (security+maintainability) + cross-hub routing consistency (correctness+traceability) + final sk-doc template sweep (all SKILL.md/README/changelog not yet directly checked) | see above |

## Dimension Coverage Tracking

| Area | Correctness | Security | Traceability | Maintainability | sk-doc conformance |
|------|:---:|:---:|:---:|:---:|:---:|
| Hub tier | pending | pending | pending | pending | pending |
| shared/benchmark/feature_catalog/changelog/playbook | pending | pending | pending | pending | pending |
| design-interface | pending | pending | pending | pending | pending |
| design-foundations | pending | pending | pending | pending | pending |
| design-audit | pending | pending | pending | pending | pending |
| design-motion | pending | pending | pending | pending | pending |
| design-mcp-open-design | pending | pending | pending | pending | pending |
| design-md-generator | pending | pending | pending | pending | pending |
| Cross-hub consistency | pending | n/a | pending | n/a | n/a |

## Non-Overlap Discipline

Each wave's concurrent agents are assigned disjoint file sets up front (in the dispatch prompt), since parallel agents cannot see each other's live findings within the same wave. No two concurrent iterations in the same wave review the same file.

## design-md-generator Sampling Disclosure

Iteration 1 corrected the sampling baseline: `design-md-generator/node_modules/` exists and is out of review scope; excluding it, `design-md-generator` has 172 in-scope files, not the draft 2847-file dependency-inclusive figure. Breakdown: `backend/` 113, `references/` 23, `manual_testing_playbook/` 19, `feature_catalog/` 9, `assets/` 3, `procedures/` 1, `changelog/` 1. Extension mix: `ts` 61, `md` 58, `js` 21, `map` 21, `json` 10, `.npmignore` 1.

Despite the corrected size, `design-md-generator` remains the highest-risk area because nearly all executable TypeScript lives under `backend/scripts/`, including the seven known-context files: `build-write-prompt.ts`, `extract.ts`, `guided-run.ts`, `report-gen.ts`, `preview-gen.ts`, `proof.ts`, and `css-analyzer.ts`. Keep the planned md-generator allocation, but treat it as depth for executable correctness/security rather than breadth over thousands of files. The non-backend docs/config surfaces can be representative-sampled after backend scripts receive direct coverage.

Prompt-data isolation looks mitigated in `build-write-prompt.ts` because scraped text is fenced as inert data and backticks are neutralized. Output-boundary risk still looks live in standalone artifact writers; iteration 1 recorded P1-001 for `preview-gen.ts`, `proof.ts`, and `report-gen.ts` bypassing `resolveOutputPath`/`requireOutputPath`.

## Wave 1 Non-Overlapping Assignments

Wave 1 can dispatch four parallel iterations without duplicate file ownership if prompts use these file sets:

- Iteration 2 — hub tier only: `.opencode/skills/sk-design/SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, `README.md`, `command-metadata.json`.
- Iteration 3 — hub shared and benchmark only: `.opencode/skills/sk-design/shared/**`, `.opencode/skills/sk-design/benchmark/**`.
- Iteration 4 — hub feature/changelog/playbook only: `.opencode/skills/sk-design/feature_catalog/**`, `.opencode/skills/sk-design/changelog/**`, `.opencode/skills/sk-design/manual_testing_playbook/**`.
- Iteration 5 — hub cross-cutting consistency only: references among the three prior file sets plus mode packet entrypoints for linkage checks, read-only sampling of mode entrypoint files only when needed to verify a hub claim. It must not re-review mode packet internals.

## Next Focus

Proceed with Wave 1 as planned using the non-overlapping assignments above. For Wave 4/5, preserve the md-generator backend emphasis even though the in-scope file count is smaller than drafted; the live P1 in standalone output writers confirms backend correctness/security deserves multiple passes. The single combined pass for `design-mcp-open-design` still looks acceptable for now because its executable surface at max-depth 2 is three shell scripts plus MCP transport docs, but the dedicated transport iteration should include `scripts/*.sh`, `mcp-servers/**`, and install/doctor contract checks.

## Log

- 2026-07-09: Strategy drafted at packet init, before iteration 1.
- 2026-07-09: Iteration 1 inventory completed. Corrected `design-md-generator` sampling baseline, confirmed Wave 1 non-overlap, and recorded one new P1 in standalone md-generator artifact writers.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 14
- P2 (Suggestions): 16
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `/design:foundations` command metadata: FAIL. It omits the packet's own `procedures/` surface from choreography, recorded as P1-009-001. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `/design:foundations` command metadata: FAIL. It omits the packet's own `procedures/` surface from choreography, recorded as P1-009-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `/design:foundations` command metadata: FAIL. It omits the packet's own `procedures/` surface from choreography, recorded as P1-009-001.

### `/design:interface command metadata`: PARTIAL. Command identity, argument grammar, tasks, handoff, proof fields, and procedure-family claims match the packet, but transform-verb projections do not reference the packet's transform-specific landing lane. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `/design:interface command metadata`: PARTIAL. Command identity, argument grammar, tasks, handoff, proof fields, and procedure-family claims match the packet, but transform-verb projections do not reference the packet's transform-specific landing lane.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `/design:interface command metadata`: PARTIAL. Command identity, argument grammar, tasks, handoff, proof fields, and procedure-family claims match the packet, but transform-verb projections do not reference the packet's transform-specific landing lane.

### `/design:motion` command metadata procedure surface: FAIL. The command entry identifies motion at `command-metadata.json:727` through `command-metadata.json:729`, but its choreography and task projections omit the packet's required procedure-card surface. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: `/design:motion` command metadata procedure surface: FAIL. The command entry identifies motion at `command-metadata.json:727` through `command-metadata.json:729`, but its choreography and task projections omit the packet's required procedure-card surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `/design:motion` command metadata procedure surface: FAIL. The command entry identifies motion at `command-metadata.json:727` through `command-metadata.json:729`, but its choreography and task projections omit the packet's required procedure-card surface.

### `agent_cross_runtime`: `design-mcp-open-design/scripts/install.sh:1` is shell automation and remains scoped to local readiness checks; deeper transport coverage is deferred. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime`: `design-mcp-open-design/scripts/install.sh:1` is shell automation and remains scoped to local readiness checks; deeper transport coverage is deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: `design-mcp-open-design/scripts/install.sh:1` is shell automation and remains scoped to local readiness checks; deeper transport coverage is deferred.

### `agent_cross_runtime`: N/A for this iteration. No agents were dispatched. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `agent_cross_runtime`: N/A for this iteration. No agents were dispatched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: N/A for this iteration. No agents were dispatched.

### `agent_cross_runtime`: N/A; no runtime agent definitions were reviewed or invoked in this iteration. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `agent_cross_runtime`: N/A; no runtime agent definitions were reviewed or invoked in this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: N/A; no runtime agent definitions were reviewed or invoked in this iteration.

### `agent_cross_runtime`: N/A. Backend scripts were reviewed directly; no runtime agent definitions were in scope. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `agent_cross_runtime`: N/A. Backend scripts were reviewed directly; no runtime agent definitions were in scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: N/A. Backend scripts were reviewed directly; no runtime agent definitions were in scope.

### `agent_cross_runtime`: N/A. The assigned target is a skill packet documentation/config surface, not a runtime agent definition. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `agent_cross_runtime`: N/A. The assigned target is a skill packet documentation/config surface, not a runtime agent definition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: N/A. The assigned target is a skill packet documentation/config surface, not a runtime agent definition.

### `agent_cross_runtime`: N/A. The target is a skill packet and backend scripts, not a runtime agent definition. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `agent_cross_runtime`: N/A. The target is a skill packet and backend scripts, not a runtime agent definition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: N/A. The target is a skill packet and backend scripts, not a runtime agent definition.

### `agent_cross_runtime`: N/A. The target is a skill packet; no runtime agent definitions were modified or dispatched. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `agent_cross_runtime`: N/A. The target is a skill packet; no runtime agent definitions were modified or dispatched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: N/A. The target is a skill packet; no runtime agent definitions were modified or dispatched.

### `agent_cross_runtime`: N/A. The target is skill hub metadata, not runtime agent definitions. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `agent_cross_runtime`: N/A. The target is skill hub metadata, not runtime agent definitions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: N/A. The target is skill hub metadata, not runtime agent definitions.

### `agent_cross_runtime`: N/A. This leaf review did not dispatch agents. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `agent_cross_runtime`: N/A. This leaf review did not dispatch agents.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: N/A. This leaf review did not dispatch agents.

### `agent_cross_runtime`: PARTIAL. Shared boundary and context-loading docs were sampled; mode-specific runtime agents were outside this iteration's assignment. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime`: PARTIAL. Shared boundary and context-loading docs were sampled; mode-specific runtime agents were outside this iteration's assignment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: PARTIAL. Shared boundary and context-loading docs were sampled; mode-specific runtime agents were outside this iteration's assignment.

### `agent_cross_runtime`: PASS for this iteration. No sub-agents were dispatched; direct-fallback playbook coverage at `.opencode/skills/sk-design/design-interface/manual_testing_playbook/14--procedure-card-contract/direct-fallback-without-subagents.md:41` requires Read/Glob/Grep only. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `agent_cross_runtime`: PASS for this iteration. No sub-agents were dispatched; direct-fallback playbook coverage at `.opencode/skills/sk-design/design-interface/manual_testing_playbook/14--procedure-card-contract/direct-fallback-without-subagents.md:41` requires Read/Glob/Grep only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: PASS for this iteration. No sub-agents were dispatched; direct-fallback playbook coverage at `.opencode/skills/sk-design/design-interface/manual_testing_playbook/14--procedure-card-contract/direct-fallback-without-subagents.md:41` requires Read/Glob/Grep only.

### `agent_cross_runtime`: PASS. No agents were dispatched. Transport docs distinguish opencode native wiring from this repo's Code Mode integration. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: `agent_cross_runtime`: PASS. No agents were dispatched. Transport docs distinguish opencode native wiring from this repo's Code Mode integration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: PASS. No agents were dispatched. Transport docs distinguish opencode native wiring from this repo's Code Mode integration.

### `agent_cross_runtime`: PASS. No sub-agents were dispatched; direct fallback is explicitly Read/Glob/Grep-only at `design-motion/SKILL.md:292`. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `agent_cross_runtime`: PASS. No sub-agents were dispatched; direct fallback is explicitly Read/Glob/Grep-only at `design-motion/SKILL.md:292`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: PASS. No sub-agents were dispatched; direct fallback is explicitly Read/Glob/Grep-only at `design-motion/SKILL.md:292`.

### `changelog_frontmatter`: FAIL. Four older changelog entries have `version:` frontmatter; `v1.1.0.0.md`, `v1.2.0.0.md`, and `v1.4.3.0.md` do not. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `changelog_frontmatter`: FAIL. Four older changelog entries have `version:` frontmatter; `v1.1.0.0.md`, `v1.2.0.0.md`, and `v1.4.3.0.md` do not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `changelog_frontmatter`: FAIL. Four older changelog entries have `version:` frontmatter; `v1.1.0.0.md`, `v1.2.0.0.md`, and `v1.4.3.0.md` do not.

### `changelog_frontmatter`: PASS. The assigned changelog has `version: 1.0.0.0` at `.opencode/skills/sk-design/design-md-generator/changelog/v1.0.0.0.md:3`. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `changelog_frontmatter`: PASS. The assigned changelog has `version: 1.0.0.0` at `.opencode/skills/sk-design/design-md-generator/changelog/v1.0.0.0.md:3`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `changelog_frontmatter`: PASS. The assigned changelog has `version: 1.0.0.0` at `.opencode/skills/sk-design/design-md-generator/changelog/v1.0.0.0.md:3`.

### `checklist_evidence`: N/A; this read-only review iteration produced review evidence artifacts only and did not update checklist completion. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `checklist_evidence`: N/A; this read-only review iteration produced review evidence artifacts only and did not update checklist completion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: N/A; this read-only review iteration produced review evidence artifacts only and did not update checklist completion.

### `checklist_evidence`: N/A. This leaf review produced evidence artifacts only and did not modify checklist completion state. -- BLOCKED (iteration 19, 2 attempts)
- What was tried: `checklist_evidence`: N/A. This leaf review produced evidence artifacts only and did not modify checklist completion state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: N/A. This leaf review produced evidence artifacts only and did not modify checklist completion state.

### `checklist_evidence`: N/A. This leaf review produced evidence artifacts only and did not update checklist completion state. -- BLOCKED (iteration 15, 2 attempts)
- What was tried: `checklist_evidence`: N/A. This leaf review produced evidence artifacts only and did not update checklist completion state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: N/A. This leaf review produced evidence artifacts only and did not update checklist completion state.

### `checklist_evidence`: N/A. This leaf review produced review evidence artifacts only and did not modify checklist completion state. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `checklist_evidence`: N/A. This leaf review produced review evidence artifacts only and did not modify checklist completion state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: N/A. This leaf review produced review evidence artifacts only and did not modify checklist completion state.

### `checklist_evidence`: N/A. This leaf review produced review evidence artifacts only and did not update checklist completion state. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `checklist_evidence`: N/A. This leaf review produced review evidence artifacts only and did not update checklist completion state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: N/A. This leaf review produced review evidence artifacts only and did not update checklist completion state.

### `checklist_evidence`: N/A. This leaf review wrote evidence artifacts only and did not update checklist completion. -- BLOCKED (iteration 8, 2 attempts)
- What was tried: `checklist_evidence`: N/A. This leaf review wrote evidence artifacts only and did not update checklist completion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: N/A. This leaf review wrote evidence artifacts only and did not update checklist completion.

### `checklist_evidence`: N/A. This review produced evidence artifacts only and did not update checklist completion. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: N/A. This review produced evidence artifacts only and did not update checklist completion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: N/A. This review produced evidence artifacts only and did not update checklist completion.

### `checklist_evidence`: No checklist completion was modified in this iteration; this pass produced review evidence only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: No checklist completion was modified in this iteration; this pass produced review evidence only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: No checklist completion was modified in this iteration; this pass produced review evidence only.

### `checklist_evidence`: Not applicable for this leaf review iteration; no checklist completion state was modified. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: Not applicable for this leaf review iteration; no checklist completion state was modified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Not applicable for this leaf review iteration; no checklist completion state was modified.

### `command-metadata pattern check`: FAIL with new systemic finding. The prior per-mode findings for foundations, audit, and motion are symptoms of a shared command metadata maintenance/generation gap, not isolated packet mistakes. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `command-metadata pattern check`: FAIL with new systemic finding. The prior per-mode findings for foundations, audit, and motion are symptoms of a shared command metadata maintenance/generation gap, not isolated packet mistakes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `command-metadata pattern check`: FAIL with new systemic finding. The prior per-mode findings for foundations, audit, and motion are symptoms of a shared command metadata maintenance/generation gap, not isolated packet mistakes.

### `description.json freshness`: PASS. The description includes all six modes, distinguishes five workflow modes from the Open Design transport, and includes Open Design keywords at `.opencode/skills/sk-design/description.json:3` and `.opencode/skills/sk-design/description.json:42` through `.opencode/skills/sk-design/description.json:46`. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `description.json freshness`: PASS. The description includes all six modes, distinguishes five workflow modes from the Open Design transport, and includes Open Design keywords at `.opencode/skills/sk-design/description.json:3` and `.opencode/skills/sk-design/description.json:42` through `.opencode/skills/sk-design/description.json:46`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `description.json freshness`: PASS. The description includes all six modes, distinguishes five workflow modes from the Open Design transport, and includes Open Design keywords at `.opencode/skills/sk-design/description.json:3` and `.opencode/skills/sk-design/description.json:42` through `.opencode/skills/sk-design/description.json:46`.

### `excludedAliases`: PASS. `mode-registry.json:33` through `mode-registry.json:35` excludes `typeset` and `colorize` from free-text foundations transform aliasing, while `mode-registry.json:27` explains explicit command task projections are a separate layer; `command-metadata.json:245` through `command-metadata.json:268` owns `typeset` and `colorize` only under explicit `/design:foundations` task projections. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `excludedAliases`: PASS. `mode-registry.json:33` through `mode-registry.json:35` excludes `typeset` and `colorize` from free-text foundations transform aliasing, while `mode-registry.json:27` explains explicit command task projections are a separate layer; `command-metadata.json:245` through `command-metadata.json:268` owns `typeset` and `colorize` only under explicit `/design:foundations` task projections.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `excludedAliases`: PASS. `mode-registry.json:33` through `mode-registry.json:35` excludes `typeset` and `colorize` from free-text foundations transform aliasing, while `mode-registry.json:27` explains explicit command task projections are a separate layer; `command-metadata.json:245` through `command-metadata.json:268` owns `typeset` and `colorize` only under explicit `/design:foundations` task projections.

### `feature_catalog_code`: Feature catalog directories exist at hub and mode levels; detailed catalog-to-code validation deferred to wave assignments. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: Feature catalog directories exist at hub and mode levels; detailed catalog-to-code validation deferred to wave assignments.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: Feature catalog directories exist at hub and mode levels; detailed catalog-to-code validation deferred to wave assignments.

### `feature_catalog_code`: N/A for final structural checker synthesis; content coverage belongs to prior iterations. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `feature_catalog_code`: N/A for final structural checker synthesis; content coverage belongs to prior iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: N/A for final structural checker synthesis; content coverage belongs to prior iterations.

### `feature_catalog_code`: N/A for this iteration's correctness/security backend-only scope; non-backend catalog surfaces are assigned to sibling iteration 17. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `feature_catalog_code`: N/A for this iteration's correctness/security backend-only scope; non-backend catalog surfaces are assigned to sibling iteration 17.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: N/A for this iteration's correctness/security backend-only scope; non-backend catalog surfaces are assigned to sibling iteration 17.

### `feature_catalog_code`: N/A. Feature catalog files are assigned to sibling iteration 4. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code`: N/A. Feature catalog files are assigned to sibling iteration 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: N/A. Feature catalog files are assigned to sibling iteration 4.

### `feature_catalog_code`: PARTIAL. Catalog-to-backend traceability was sampled. One catalog claim at `feature_catalog/05--report-preview/report-preview.md:59` corroborates existing active `P1-001` and is not counted as a new finding. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `feature_catalog_code`: PARTIAL. Catalog-to-backend traceability was sampled. One catalog claim at `feature_catalog/05--report-preview/report-preview.md:59` corroborates existing active `P1-001` and is not counted as a new finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PARTIAL. Catalog-to-backend traceability was sampled. One catalog claim at `feature_catalog/05--report-preview/report-preview.md:59` corroborates existing active `P1-001` and is not counted as a new finding.

### `feature_catalog_code`: PARTIAL. Catalog-to-code traceability is assigned to iteration 7; this pass only used catalog absence as supporting scope proof for the transform loading defect. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `feature_catalog_code`: PARTIAL. Catalog-to-code traceability is assigned to iteration 7; this pass only used catalog absence as supporting scope proof for the transform loading defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PARTIAL. Catalog-to-code traceability is assigned to iteration 7; this pass only used catalog absence as supporting scope proof for the transform loading defect.

### `feature_catalog_code`: PARTIAL. Feature catalog claims Read/Glob/Grep-only operation for procedure cards; that remains true for procedures but incomplete for mandatory contrast proof. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `feature_catalog_code`: PARTIAL. Feature catalog claims Read/Glob/Grep-only operation for procedure cards; that remains true for procedures but incomplete for mandatory contrast proof.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PARTIAL. Feature catalog claims Read/Glob/Grep-only operation for procedure cards; that remains true for procedures but incomplete for mandatory contrast proof.

### `feature_catalog_code`: PARTIAL. Feature catalog traceability is assigned to iteration 13; this correctness/security pass used packet assets/procedures/references only to validate command-surface completeness and unsafe-pattern risk. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `feature_catalog_code`: PARTIAL. Feature catalog traceability is assigned to iteration 13; this correctness/security pass used packet assets/procedures/references only to validate command-surface completeness and unsafe-pattern risk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PARTIAL. Feature catalog traceability is assigned to iteration 13; this correctness/security pass used packet assets/procedures/references only to validate command-surface completeness and unsafe-pattern risk.

### `feature_catalog_code`: PARTIAL. Feature catalog/report-preview corroboration of the existing output-boundary `P1-001` was already recorded in iteration 17 and was not re-counted. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `feature_catalog_code`: PARTIAL. Feature catalog/report-preview corroboration of the existing output-boundary `P1-001` was already recorded in iteration 17 and was not re-counted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PARTIAL. Feature catalog/report-preview corroboration of the existing output-boundary `P1-001` was already recorded in iteration 17 and was not re-counted.

### `feature_catalog_code`: PARTIAL. Hub feature catalog and manual testing playbook evidence corroborate that procedure-card selection is a live hub feature, but detailed feature-file review is outside this iteration's disjoint assignment. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `feature_catalog_code`: PARTIAL. Hub feature catalog and manual testing playbook evidence corroborate that procedure-card selection is a live hub feature, but detailed feature-file review is outside this iteration's disjoint assignment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PARTIAL. Hub feature catalog and manual testing playbook evidence corroborate that procedure-card selection is a live hub feature, but detailed feature-file review is outside this iteration's disjoint assignment.

### `feature_catalog_code`: PARTIAL. The procedure-card catalog accurately inventories two cards, but command metadata omits the procedure-card surface. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `feature_catalog_code`: PARTIAL. The procedure-card catalog accurately inventories two cards, but command metadata omits the procedure-card surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PARTIAL. The procedure-card catalog accurately inventories two cards, but command metadata omits the procedure-card surface.

### `feature_catalog_code`: PARTIAL/P2. Feature catalog capability grouping matches the packet surface, but its "always safe" read wording conflicts with the two-axis guarded-read policy recorded in P2-014-001. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: `feature_catalog_code`: PARTIAL/P2. Feature catalog capability grouping matches the packet surface, but its "always safe" read wording conflicts with the two-axis guarded-read policy recorded in P2-014-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PARTIAL/P2. Feature catalog capability grouping matches the packet surface, but its "always safe" read wording conflicts with the two-axis guarded-read policy recorded in P2-014-001.

### `feature_catalog_code`: PASS for the procedure-card inventory. The catalog enumerates the two procedure cards and their shared-card handoffs at `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:18` through `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:40`. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `feature_catalog_code`: PASS for the procedure-card inventory. The catalog enumerates the two procedure cards and their shared-card handoffs at `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:18` through `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:40`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PASS for the procedure-card inventory. The catalog enumerates the two procedure cards and their shared-card handoffs at `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:18` through `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:40`.

### `feature_catalog_code`: PASS with no finding. The sampled hub catalog describes five workflow/design mode packets while separately documenting the `design-mcp-open-design` transport separation; current `mode-registry.json` has five `packetKind: "workflow"` modes plus one `packetKind: "transport"` mode. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code`: PASS with no finding. The sampled hub catalog describes five workflow/design mode packets while separately documenting the `design-mcp-open-design` transport separation; current `mode-registry.json` has five `packetKind: "workflow"` modes plus one `packetKind: "transport"` mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PASS with no finding. The sampled hub catalog describes five workflow/design mode packets while separately documenting the `design-mcp-open-design` transport separation; current `mode-registry.json` has five `packetKind: "workflow"` modes plus one `packetKind: "transport"` mode.

### `full router-table re-check`: PASS. `hub-router.json` still has six router signal entries with resources for interface, foundations, motion, audit, md-generator, and design-mcp-open-design at `.opencode/skills/sk-design/hub-router.json:27` through `.opencode/skills/sk-design/hub-router.json:90`; the remaining vocabulary classes cover the assigned modes through `.opencode/skills/sk-design/hub-router.json:397` through `.opencode/skills/sk-design/hub-router.json:409` for the transport axis. No mode-level finding changed the hub routing correctness picture. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `full router-table re-check`: PASS. `hub-router.json` still has six router signal entries with resources for interface, foundations, motion, audit, md-generator, and design-mcp-open-design at `.opencode/skills/sk-design/hub-router.json:27` through `.opencode/skills/sk-design/hub-router.json:90`; the remaining vocabulary classes cover the assigned modes through `.opencode/skills/sk-design/hub-router.json:397` through `.opencode/skills/sk-design/hub-router.json:409` for the transport axis. No mode-level finding changed the hub routing correctness picture.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `full router-table re-check`: PASS. `hub-router.json` still has six router signal entries with resources for interface, foundations, motion, audit, md-generator, and design-mcp-open-design at `.opencode/skills/sk-design/hub-router.json:27` through `.opencode/skills/sk-design/hub-router.json:90`; the remaining vocabulary classes cover the assigned modes through `.opencode/skills/sk-design/hub-router.json:397` through `.opencode/skills/sk-design/hub-router.json:409` for the transport axis. No mode-level finding changed the hub routing correctness picture.

### `graph-metadata.json freshness`: PARTIAL existing advisory only. Derived trigger phrases and key topics still emphasize the five design/workflow modes and md-generator at `.opencode/skills/sk-design/graph-metadata.json:83` through `.opencode/skills/sk-design/graph-metadata.json:156`; this matches already-filed P2-003 and is not counted as a new finding. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `graph-metadata.json freshness`: PARTIAL existing advisory only. Derived trigger phrases and key topics still emphasize the five design/workflow modes and md-generator at `.opencode/skills/sk-design/graph-metadata.json:83` through `.opencode/skills/sk-design/graph-metadata.json:156`; this matches already-filed P2-003 and is not counted as a new finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `graph-metadata.json freshness`: PARTIAL existing advisory only. Derived trigger phrases and key topics still emphasize the five design/workflow modes and md-generator at `.opencode/skills/sk-design/graph-metadata.json:83` through `.opencode/skills/sk-design/graph-metadata.json:156`; this matches already-filed P2-003 and is not counted as a new finding.

### `maintainability_gapfill`: PASS with advisory. Existing maintainability findings cover SKILL.md size, backend bin/entrypoint drift, guided-run entrypoint discoverability, and stale reference count. No additional duplicate-logic or organization issue was confirmed beyond the new shared URL-policy recommendation. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `maintainability_gapfill`: PASS with advisory. Existing maintainability findings cover SKILL.md size, backend bin/entrypoint drift, guided-run entrypoint discoverability, and stale reference count. No additional duplicate-logic or organization issue was confirmed beyond the new shared URL-policy recommendation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `maintainability_gapfill`: PASS with advisory. Existing maintainability findings cover SKILL.md size, backend bin/entrypoint drift, guided-run entrypoint discoverability, and stale reference count. No additional duplicate-logic or organization issue was confirmed beyond the new shared URL-policy recommendation.

### `mandatory pairing`: PASS. `SKILL.md:20` through `SKILL.md:22`, `SKILL.md:245`, `SKILL.md:278`, and `SKILL.md:290` make `sk-design` pairing a hard precondition for design-affecting Open Design use; no standalone design-judgment path was found in the primary runtime contract. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: `mandatory pairing`: PASS. `SKILL.md:20` through `SKILL.md:22`, `SKILL.md:245`, `SKILL.md:278`, and `SKILL.md:290` make `sk-design` pairing a hard precondition for design-affecting Open Design use; no standalone design-judgment path was found in the primary runtime contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mandatory pairing`: PASS. `SKILL.md:20` through `SKILL.md:22`, `SKILL.md:245`, `SKILL.md:278`, and `SKILL.md:290` make `sk-design` pairing a hard precondition for design-affecting Open Design use; no standalone design-judgment path was found in the primary runtime contract.

### `mcp config traceability`: PASS with caveat. The packet documents this repo's Code Mode `.utcp_config.json` wiring as canonical at `mcp_wiring.md:146` through `mcp_wiring.md:163` and warns not to run native `od mcp install opencode` in this repo at `SKILL.md:235`. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: `mcp config traceability`: PASS with caveat. The packet documents this repo's Code Mode `.utcp_config.json` wiring as canonical at `mcp_wiring.md:146` through `mcp_wiring.md:163` and warns not to run native `od mcp install opencode` in this repo at `SKILL.md:235`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mcp config traceability`: PASS with caveat. The packet documents this repo's Code Mode `.utcp_config.json` wiring as canonical at `mcp_wiring.md:146` through `mcp_wiring.md:163` and warns not to run native `od mcp install opencode` in this repo at `SKILL.md:235`.

### `mode-registry packetSkillName`: PASS. `mode-registry.json:49` declares packet `design-interface`, `mode-registry.json:51` declares `packetSkillName: design-interface`, and `SKILL.md:2` has `name: design-interface`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `mode-registry packetSkillName`: PASS. `mode-registry.json:49` declares packet `design-interface`, `mode-registry.json:51` declares `packetSkillName: design-interface`, and `SKILL.md:2` has `name: design-interface`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode-registry packetSkillName`: PASS. `mode-registry.json:49` declares packet `design-interface`, `mode-registry.json:51` declares `packetSkillName: design-interface`, and `SKILL.md:2` has `name: design-interface`.

### `mode-registry parity`: PASS. `mode-registry.json` still enumerates five `packetKind:"workflow"` modes and one `packetKind:"transport"` mode at `.opencode/skills/sk-design/mode-registry.json:38` through `.opencode/skills/sk-design/mode-registry.json:163`; packet names, commands, procedure paths, and transport no-command status remain coherent. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `mode-registry parity`: PASS. `mode-registry.json` still enumerates five `packetKind:"workflow"` modes and one `packetKind:"transport"` mode at `.opencode/skills/sk-design/mode-registry.json:38` through `.opencode/skills/sk-design/mode-registry.json:163`; packet names, commands, procedure paths, and transport no-command status remain coherent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode-registry parity`: PASS. `mode-registry.json` still enumerates five `packetKind:"workflow"` modes and one `packetKind:"transport"` mode at `.opencode/skills/sk-design/mode-registry.json:38` through `.opencode/skills/sk-design/mode-registry.json:163`; packet names, commands, procedure paths, and transport no-command status remain coherent.

### `mode-registry proceduresPath`: PASS. `mode-registry.json:50` declares `design-interface/procedures`; the packet contains the six procedure cards listed in `SKILL.md:157` through `SKILL.md:162`, `README.md:108`, and the procedure inventory at `feature_catalog/03--procedure-cards/interface-procedure-card-inventory.md:28`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `mode-registry proceduresPath`: PASS. `mode-registry.json:50` declares `design-interface/procedures`; the packet contains the six procedure cards listed in `SKILL.md:157` through `SKILL.md:162`, `README.md:108`, and the procedure inventory at `feature_catalog/03--procedure-cards/interface-procedure-card-inventory.md:28`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode-registry proceduresPath`: PASS. `mode-registry.json:50` declares `design-interface/procedures`; the packet contains the six procedure cards listed in `SKILL.md:157` through `SKILL.md:162`, `README.md:108`, and the procedure inventory at `feature_catalog/03--procedure-cards/interface-procedure-card-inventory.md:28`.

### `mode-registry toolSurface`: PASS. `mode-registry.json:43` through `mode-registry.json:47` allows `Read`, `Glob`, and `Grep`, forbids `Write`, `Edit`, and `Bash`, and marks `mutatesWorkspace:false`; `SKILL.md:4` allows `Read`, `Grep`, and `Glob`, and `SKILL.md:171` states direct fallback uses Read/Glob/Grep only and cannot rely on Write/Edit/Bash/Task. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `mode-registry toolSurface`: PASS. `mode-registry.json:43` through `mode-registry.json:47` allows `Read`, `Glob`, and `Grep`, forbids `Write`, `Edit`, and `Bash`, and marks `mutatesWorkspace:false`; `SKILL.md:4` allows `Read`, `Grep`, and `Glob`, and `SKILL.md:171` states direct fallback uses Read/Glob/Grep only and cannot rely on Write/Edit/Bash/Task.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode-registry toolSurface`: PASS. `mode-registry.json:43` through `mode-registry.json:47` allows `Read`, `Glob`, and `Grep`, forbids `Write`, `Edit`, and `Bash`, and marks `mutatesWorkspace:false`; `SKILL.md:4` allows `Read`, `Grep`, and `Glob`, and `SKILL.md:171` states direct fallback uses Read/Glob/Grep only and cannot rely on Write/Edit/Bash/Task.

### `mode-registry transport entry`: PASS. `mode-registry.json:145` through `mode-registry.json:152` declares `packetKind:"transport"`, `backendKind:"od-cli-transport"`, allowed `[Read,Bash]`, forbidden `[Write,Edit,Task]`, and `mutatesWorkspace:false`, matching the packet's local scripts. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: `mode-registry transport entry`: PASS. `mode-registry.json:145` through `mode-registry.json:152` declares `packetKind:"transport"`, `backendKind:"od-cli-transport"`, allowed `[Read,Bash]`, forbidden `[Write,Edit,Task]`, and `mutatesWorkspace:false`, matching the packet's local scripts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode-registry transport entry`: PASS. `mode-registry.json:145` through `mode-registry.json:152` declares `packetKind:"transport"`, `backendKind:"od-cli-transport"`, allowed `[Read,Bash]`, forbidden `[Write,Edit,Task]`, and `mutatesWorkspace:false`, matching the packet's local scripts.

### `mode-registry.json` backend claim: PASS. `mode-registry.json:124` through `mode-registry.json:127` declares `workflowMode: md-generator` and `backendKind: playwright-extract`; backend docs describe Playwright extraction at `backend/README.md:20`, and package dependencies include Playwright at `backend/package.json:22`. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `mode-registry.json` backend claim: PASS. `mode-registry.json:124` through `mode-registry.json:127` declares `workflowMode: md-generator` and `backendKind: playwright-extract`; backend docs describe Playwright extraction at `backend/README.md:20`, and package dependencies include Playwright at `backend/package.json:22`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode-registry.json` backend claim: PASS. `mode-registry.json:124` through `mode-registry.json:127` declares `workflowMode: md-generator` and `backendKind: playwright-extract`; backend docs describe Playwright extraction at `backend/README.md:20`, and package dependencies include Playwright at `backend/package.json:22`.

### `mode-registry.json` packetSkillName parity: PASS. `mode-registry.json:91` through `mode-registry.json:93` declares packet `design-motion`, procedures path `design-motion/procedures`, and packet skill name `design-motion`; `SKILL.md:2` declares `name: design-motion`. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: `mode-registry.json` packetSkillName parity: PASS. `mode-registry.json:91` through `mode-registry.json:93` declares packet `design-motion`, procedures path `design-motion/procedures`, and packet skill name `design-motion`; `SKILL.md:2` declares `name: design-motion`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode-registry.json` packetSkillName parity: PASS. `mode-registry.json:91` through `mode-registry.json:93` declares packet `design-motion`, procedures path `design-motion/procedures`, and packet skill name `design-motion`; `SKILL.md:2` declares `name: design-motion`.

### `mode-registry.json` proceduresPath existence: PASS. `mode-registry.json:92` declares `design-motion/procedures`, and the packet contains `procedures/interaction_states_pass.md` with frontmatter at `procedures/interaction_states_pass.md:1`. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: `mode-registry.json` proceduresPath existence: PASS. `mode-registry.json:92` declares `design-motion/procedures`, and the packet contains `procedures/interaction_states_pass.md` with frontmatter at `procedures/interaction_states_pass.md:1`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode-registry.json` proceduresPath existence: PASS. `mode-registry.json:92` declares `design-motion/procedures`, and the packet contains `procedures/interaction_states_pass.md` with frontmatter at `procedures/interaction_states_pass.md:1`.

### `mode-registry.json` tool surface parity: PASS. `mode-registry.json:85` through `mode-registry.json:90` allows Read/Glob/Grep, forbids Write/Edit/Bash, and sets `mutatesWorkspace:false`; `SKILL.md:4` allows Read/Grep/Glob and `SKILL.md:292` says the direct fallback cannot rely on Write, Edit, Bash, or Task. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: `mode-registry.json` tool surface parity: PASS. `mode-registry.json:85` through `mode-registry.json:90` allows Read/Glob/Grep, forbids Write/Edit/Bash, and sets `mutatesWorkspace:false`; `SKILL.md:4` allows Read/Grep/Glob and `SKILL.md:292` says the direct fallback cannot rely on Write, Edit, Bash, or Task.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode-registry.json` tool surface parity: PASS. `mode-registry.json:85` through `mode-registry.json:90` allows Read/Glob/Grep, forbids Write/Edit/Bash, and sets `mutatesWorkspace:false`; `SKILL.md:4` allows Read/Grep/Glob and `SKILL.md:292` says the direct fallback cannot rely on Write, Edit, Bash, or Task.

### `packetSkillName` parity: PASS. All six registry `packetSkillName` values match the packet folder and frontmatter `name` values: `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, and `design-mcp-open-design`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `packetSkillName` parity: PASS. All six registry `packetSkillName` values match the packet folder and frontmatter `name` values: `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, and `design-mcp-open-design`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `packetSkillName` parity: PASS. All six registry `packetSkillName` values match the packet folder and frontmatter `name` values: `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, and `design-mcp-open-design`.

### `packetSkillName`: PASS. `mode-registry.json:72` says `design-foundations`; `SKILL.md:2` says `name: design-foundations`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `packetSkillName`: PASS. `mode-registry.json:72` says `design-foundations`; `SKILL.md:2` says `name: design-foundations`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `packetSkillName`: PASS. `mode-registry.json:72` says `design-foundations`; `SKILL.md:2` says `name: design-foundations`.

### `packetSkillName`: PASS. `mode-registry.json` declares `packet: "design-audit"` and `packetSkillName: "design-audit"` at `.opencode/skills/sk-design/mode-registry.json:112` and `.opencode/skills/sk-design/mode-registry.json:114`; packet frontmatter declares `name: design-audit` at `.opencode/skills/sk-design/design-audit/SKILL.md:2`. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `packetSkillName`: PASS. `mode-registry.json` declares `packet: "design-audit"` and `packetSkillName: "design-audit"` at `.opencode/skills/sk-design/mode-registry.json:112` and `.opencode/skills/sk-design/mode-registry.json:114`; packet frontmatter declares `name: design-audit` at `.opencode/skills/sk-design/design-audit/SKILL.md:2`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `packetSkillName`: PASS. `mode-registry.json` declares `packet: "design-audit"` and `packetSkillName: "design-audit"` at `.opencode/skills/sk-design/mode-registry.json:112` and `.opencode/skills/sk-design/mode-registry.json:114`; packet frontmatter declares `name: design-audit` at `.opencode/skills/sk-design/design-audit/SKILL.md:2`.

### `parent-skill-check`: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` ended with `OK: parent-skill-check — all hard invariants passed, 0 warnings`; no checker FAIL/WARN finding was recorded. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `parent-skill-check`: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` ended with `OK: parent-skill-check — all hard invariants passed, 0 warnings`; no checker FAIL/WARN finding was recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `parent-skill-check`: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` ended with `OK: parent-skill-check — all hard invariants passed, 0 warnings`; no checker FAIL/WARN finding was recorded.

### `playbook_capability`: Manual testing playbook directories exist at hub and mode levels; detailed playbook-to-capability validation deferred. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: Manual testing playbook directories exist at hub and mode levels; detailed playbook-to-capability validation deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: Manual testing playbook directories exist at hub and mode levels; detailed playbook-to-capability validation deferred.

### `playbook_capability`: N/A for final structural checker synthesis; playbook capability coverage belongs to prior iterations. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `playbook_capability`: N/A for final structural checker synthesis; playbook capability coverage belongs to prior iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: N/A for final structural checker synthesis; playbook capability coverage belongs to prior iterations.

### `playbook_capability`: N/A for this iteration's correctness/security backend-only scope; manual testing playbook surfaces are assigned to sibling iteration 17. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `playbook_capability`: N/A for this iteration's correctness/security backend-only scope; manual testing playbook surfaces are assigned to sibling iteration 17.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: N/A for this iteration's correctness/security backend-only scope; manual testing playbook surfaces are assigned to sibling iteration 17.

### `playbook_capability`: PARTIAL. Benchmark README ties reports to the manual testing playbook corpus at `.opencode/skills/sk-design/benchmark/README.md:18`; detailed playbook capability review is assigned elsewhere. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability`: PARTIAL. Benchmark README ties reports to the manual testing playbook corpus at `.opencode/skills/sk-design/benchmark/README.md:18`; detailed playbook capability review is assigned elsewhere.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PARTIAL. Benchmark README ties reports to the manual testing playbook corpus at `.opencode/skills/sk-design/benchmark/README.md:18`; detailed playbook capability review is assigned elsewhere.

### `playbook_capability`: PARTIAL. Guided-run and public-URL behavior are represented in docs/playbook surfaces, but this pass focused on executable trust-boundary enforcement rather than full playbook capability coverage. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `playbook_capability`: PARTIAL. Guided-run and public-URL behavior are represented in docs/playbook surfaces, but this pass focused on executable trust-boundary enforcement rather than full playbook capability coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PARTIAL. Guided-run and public-URL behavior are represented in docs/playbook surfaces, but this pass focused on executable trust-boundary enforcement rather than full playbook capability coverage.

### `playbook_capability`: PARTIAL. Manual playbook files were discovered and link-indexed during scope inspection, but detailed playbook capability review is assigned to iteration 13. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `playbook_capability`: PARTIAL. Manual playbook files were discovered and link-indexed during scope inspection, but detailed playbook capability review is assigned to iteration 13.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PARTIAL. Manual playbook files were discovered and link-indexed during scope inspection, but detailed playbook capability review is assigned to iteration 13.

### `playbook_capability`: PARTIAL. Manual playbook files were included in glob/grep coverage; no new mismatch was confirmed in the sampled report, extraction, and guided-run paths. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `playbook_capability`: PARTIAL. Manual playbook files were included in glob/grep coverage; no new mismatch was confirmed in the sampled report, extraction, and guided-run paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PARTIAL. Manual playbook files were included in glob/grep coverage; no new mismatch was confirmed in the sampled report, extraction, and guided-run paths.

### `playbook_capability`: PARTIAL. Manual playbook scope was sampled via catalog and README; detailed maintainability/sk-doc playbook validation is assigned to iteration 11. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `playbook_capability`: PARTIAL. Manual playbook scope was sampled via catalog and README; detailed maintainability/sk-doc playbook validation is assigned to iteration 11.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PARTIAL. Manual playbook scope was sampled via catalog and README; detailed maintainability/sk-doc playbook validation is assigned to iteration 11.

### `playbook_capability`: PARTIAL. Playbook procedure-card scenarios corroborate impact; no playbook files were reviewed for standalone findings in this cross-hub metadata pass. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `playbook_capability`: PARTIAL. Playbook procedure-card scenarios corroborate impact; no playbook files were reviewed for standalone findings in this cross-hub metadata pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PARTIAL. Playbook procedure-card scenarios corroborate impact; no playbook files were reviewed for standalone findings in this cross-hub metadata pass.

### `playbook_capability`: PARTIAL. The direct-fallback playbook supports the read-only boundary. Transform-specific playbook coverage was not found during this correctness/security pass and is covered by P1-006-001's resource reachability finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `playbook_capability`: PARTIAL. The direct-fallback playbook supports the read-only boundary. Transform-specific playbook coverage was not found during this correctness/security pass and is covered by P1-006-001's resource reachability finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PARTIAL. The direct-fallback playbook supports the read-only boundary. Transform-specific playbook coverage was not found during this correctness/security pass and is covered by P1-006-001's resource reachability finding.

### `playbook_capability`: PASS by sampled procedure-card scenario coverage. `README.md` points to the manual playbook at `.opencode/skills/sk-design/design-audit/README.md:102` through `.opencode/skills/sk-design/design-audit/README.md:109`; grep confirmed `manual_testing_playbook/05--procedure-card-contract/card-selection-proof.md` covers both cards. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `playbook_capability`: PASS by sampled procedure-card scenario coverage. `README.md` points to the manual playbook at `.opencode/skills/sk-design/design-audit/README.md:102` through `.opencode/skills/sk-design/design-audit/README.md:109`; grep confirmed `manual_testing_playbook/05--procedure-card-contract/card-selection-proof.md` covers both cards.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PASS by sampled procedure-card scenario coverage. `README.md` points to the manual playbook at `.opencode/skills/sk-design/design-audit/README.md:102` through `.opencode/skills/sk-design/design-audit/README.md:109`; grep confirmed `manual_testing_playbook/05--procedure-card-contract/card-selection-proof.md` covers both cards.

### `playbook_capability`: PASS with caveat. The color playbook expects contrast inventory before handoff and includes command-backed discovery/proof evidence, supporting the P1 classification rather than refuting it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `playbook_capability`: PASS with caveat. The color playbook expects contrast inventory before handoff and includes command-backed discovery/proof evidence, supporting the P1 classification rather than refuting it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PASS with caveat. The color playbook expects contrast inventory before handoff and includes command-backed discovery/proof evidence, supporting the P1 classification rather than refuting it.

### `playbook_capability`: PASS with no finding. Sampled root, Open Design transport, md-generator, and direct-fallback scenarios align with current mode-registry routing and tool-surface expectations. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability`: PASS with no finding. Sampled root, Open Design transport, md-generator, and direct-fallback scenarios align with current mode-registry routing and tool-surface expectations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PASS with no finding. Sampled root, Open Design transport, md-generator, and direct-fallback scenarios align with current mode-registry routing and tool-surface expectations.

### `playbook_capability`: PASS. `manual_testing_playbook.md:190` through `manual_testing_playbook.md:195` includes negative and positive tests for the mandatory `sk-design` gate. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: `playbook_capability`: PASS. `manual_testing_playbook.md:190` through `manual_testing_playbook.md:195` includes negative and positive tests for the mandatory `sk-design` gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PASS. `manual_testing_playbook.md:190` through `manual_testing_playbook.md:195` includes negative and positive tests for the mandatory `sk-design` gate.

### `procedure-card maintainability`: PASS. `README.md:106` through `README.md:108`, `SKILL.md:151` through `SKILL.md:165`, the feature catalog, and the manual testing scenario make the private procedure-card structure self-documenting. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `procedure-card maintainability`: PASS. `README.md:106` through `README.md:108`, `SKILL.md:151` through `SKILL.md:165`, the feature catalog, and the manual testing scenario make the private procedure-card structure self-documenting.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `procedure-card maintainability`: PASS. `README.md:106` through `README.md:108`, `SKILL.md:151` through `SKILL.md:165`, the feature catalog, and the manual testing scenario make the private procedure-card structure self-documenting.

### `proceduresPath` existence: PASS. The five workflow modes with `proceduresPath` entries each have the declared directory. The transport packet has no `proceduresPath` claim in `mode-registry.json`, so no missing path was counted. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `proceduresPath` existence: PASS. The five workflow modes with `proceduresPath` entries each have the declared directory. The transport packet has no `proceduresPath` claim in `mode-registry.json`, so no missing path was counted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `proceduresPath` existence: PASS. The five workflow modes with `proceduresPath` entries each have the declared directory. The transport packet has no `proceduresPath` claim in `mode-registry.json`, so no missing path was counted.

### `proceduresPath`: PASS for existence, FAIL for command projection. `mode-registry.json:113` declares `design-audit/procedures`, and the two cards exist at `.opencode/skills/sk-design/design-audit/procedures/accessibility_audit.md:1` and `.opencode/skills/sk-design/design-audit/procedures/ai_slop_check.md:1`; `/design:audit` command metadata omits them. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `proceduresPath`: PASS for existence, FAIL for command projection. `mode-registry.json:113` declares `design-audit/procedures`, and the two cards exist at `.opencode/skills/sk-design/design-audit/procedures/accessibility_audit.md:1` and `.opencode/skills/sk-design/design-audit/procedures/ai_slop_check.md:1`; `/design:audit` command metadata omits them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `proceduresPath`: PASS for existence, FAIL for command projection. `mode-registry.json:113` declares `design-audit/procedures`, and the two cards exist at `.opencode/skills/sk-design/design-audit/procedures/accessibility_audit.md:1` and `.opencode/skills/sk-design/design-audit/procedures/ai_slop_check.md:1`; `/design:audit` command metadata omits them.

### `proceduresPath`: PASS. `mode-registry.json:71` says `design-foundations/procedures`; the three procedure cards exist and are referenced from `SKILL.md:263` through `SKILL.md:266`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `proceduresPath`: PASS. `mode-registry.json:71` says `design-foundations/procedures`; the three procedure cards exist and are referenced from `SKILL.md:263` through `SKILL.md:266`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `proceduresPath`: PASS. `mode-registry.json:71` says `design-foundations/procedures`; the three procedure cards exist and are referenced from `SKILL.md:263` through `SKILL.md:266`.

### `scripts security`: PASS. `install.sh`, `doctor.sh`, and `_common.sh` use quoted local app paths, do not use remote `curl|wget` installers, and report/verify local readiness only. `install.sh:26` through `install.sh:28` and `doctor.sh:109` through `doctor.sh:110` state that they do not wire MCP, start daemons, or mutate state. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: `scripts security`: PASS. `install.sh`, `doctor.sh`, and `_common.sh` use quoted local app paths, do not use remote `curl|wget` installers, and report/verify local readiness only. `install.sh:26` through `install.sh:28` and `doctor.sh:109` through `doctor.sh:110` state that they do not wire MCP, start daemons, or mutate state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `scripts security`: PASS. `install.sh`, `doctor.sh`, and `_common.sh` use quoted local app paths, do not use remote `curl|wget` installers, and report/verify local readiness only. `install.sh:26` through `install.sh:28` and `doctor.sh:109` through `doctor.sh:110` state that they do not wire MCP, start daemons, or mutate state.

### `security_config`: PASS with caveat. No packet config or env-like file with secrets was found in the in-scope scan; the new advisory is URL trust-boundary enforcement, not secret leakage. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `security_config`: PASS with caveat. No packet config or env-like file with secrets was found in the in-scope scan; the new advisory is URL trust-boundary enforcement, not secret leakage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `security_config`: PASS with caveat. No packet config or env-like file with secrets was found in the in-scope scan; the new advisory is URL trust-boundary enforcement, not secret leakage.

### `sk-doc conformance`: PASS with warnings. `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-mcp-open-design --check` returned `Result: PASS` and seven warnings: `SKILL.md` exceeds the 3000-word recommendation, and six local changelog files are missing `version` frontmatter. These are recorded as conformance warnings, not counted as new blocking findings in this iteration. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: `sk-doc conformance`: PASS with warnings. `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-mcp-open-design --check` returned `Result: PASS` and seven warnings: `SKILL.md` exceeds the 3000-word recommendation, and six local changelog files are missing `version` frontmatter. These are recorded as conformance warnings, not counted as new blocking findings in this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `sk-doc conformance`: PASS with warnings. `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-mcp-open-design --check` returned `Result: PASS` and seven warnings: `SKILL.md` exceeds the 3000-word recommendation, and six local changelog files are missing `version` frontmatter. These are recorded as conformance warnings, not counted as new blocking findings in this iteration.

### `sk-doc-package-check`: PASS with warnings. Warnings recorded as P2 findings per the iteration charter. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `sk-doc-package-check`: PASS with warnings. Warnings recorded as P2 findings per the iteration charter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `sk-doc-package-check`: PASS with warnings. Warnings recorded as P2 findings per the iteration charter.

### `skill_agent`: Hub routing files reference all six mode packets and the spot-checked packet files exist. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: Hub routing files reference all six mode packets and the spot-checked packet files exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Hub routing files reference all six mode packets and the spot-checked packet files exist.

### `skill_agent`: PASS with no finding. The sampled playbook expects a single `sk-design` advisor identity with hub mode resolution, matching the registry description. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent`: PASS with no finding. The sampled playbook expects a single `sk-design` advisor identity with hub mode resolution, matching the registry description.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS with no finding. The sampled playbook expects a single `sk-design` advisor identity with hub mode resolution, matching the registry description.

### `skill_agent`: PASS; no sub-agents were dispatched, and the required `deep-review` skill and shared review doctrine were loaded. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `skill_agent`: PASS; no sub-agents were dispatched, and the required `deep-review` skill and shared review doctrine were loaded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS; no sub-agents were dispatched, and the required `deep-review` skill and shared review doctrine were loaded.

### `skill_agent`: PASS. `@deep-review` LEAF constraints followed; no sub-agents dispatched. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `skill_agent`: PASS. `@deep-review` LEAF constraints followed; no sub-agents dispatched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. `@deep-review` LEAF constraints followed; no sub-agents dispatched.

### `skill_agent`: PASS. No sub-agents were dispatched; review stayed within the LEAF assignment. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `skill_agent`: PASS. No sub-agents were dispatched; review stayed within the LEAF assignment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. No sub-agents were dispatched; review stayed within the LEAF assignment.

### `skill_agent`: PASS. No sub-agents were dispatched. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `skill_agent`: PASS. No sub-agents were dispatched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. No sub-agents were dispatched.

### `skill_agent`: PASS. No subagents were dispatched; the packet requires direct fallback with Read/Glob/Grep only at `.opencode/skills/sk-design/design-audit/SKILL.md:305`. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `skill_agent`: PASS. No subagents were dispatched; the packet requires direct fallback with Read/Glob/Grep only at `.opencode/skills/sk-design/design-audit/SKILL.md:305`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. No subagents were dispatched; the packet requires direct fallback with Read/Glob/Grep only at `.opencode/skills/sk-design/design-audit/SKILL.md:305`.

### `skill_agent`: PASS. Packet frontmatter and mode-registry agree at the coarse allowed-tool level, but the confirmed contrast proof path contradicts that shared declaration. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `skill_agent`: PASS. Packet frontmatter and mode-registry agree at the coarse allowed-tool level, but the confirmed contrast proof path contradicts that shared declaration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. Packet frontmatter and mode-registry agree at the coarse allowed-tool level, but the confirmed contrast proof path contradicts that shared declaration.

### `skill_agent`: PASS. Shared dispatch boundary documentation keeps agent/small-model proof mechanical and explicitly separates proof survival from design-quality claims at `.opencode/skills/sk-design/shared/design_dispatch_boundary.md:95` and `.opencode/skills/sk-design/shared/design_dispatch_boundary.md:115`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent`: PASS. Shared dispatch boundary documentation keeps agent/small-model proof mechanical and explicitly separates proof survival from design-quality claims at `.opencode/skills/sk-design/shared/design_dispatch_boundary.md:95` and `.opencode/skills/sk-design/shared/design_dispatch_boundary.md:115`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. Shared dispatch boundary documentation keeps agent/small-model proof mechanical and explicitly separates proof survival from design-quality claims at `.opencode/skills/sk-design/shared/design_dispatch_boundary.md:95` and `.opencode/skills/sk-design/shared/design_dispatch_boundary.md:115`.

### `skill_agent`: PASS. Stayed in `deep-review` leaf mode and did not dispatch sub-agents. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `skill_agent`: PASS. Stayed in `deep-review` leaf mode and did not dispatch sub-agents.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. Stayed in `deep-review` leaf mode and did not dispatch sub-agents.

### `skill_agent`: PASS. The packet entry point declares `allowed-tools: [Read, Grep, Glob]` at `.opencode/skills/sk-design/design-interface/SKILL.md:4`, and the direct-fallback contract repeats that no Write/Edit/Bash/Task is allowed at `.opencode/skills/sk-design/design-interface/SKILL.md:171`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `skill_agent`: PASS. The packet entry point declares `allowed-tools: [Read, Grep, Glob]` at `.opencode/skills/sk-design/design-interface/SKILL.md:4`, and the direct-fallback contract repeats that no Write/Edit/Bash/Task is allowed at `.opencode/skills/sk-design/design-interface/SKILL.md:171`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. The packet entry point declares `allowed-tools: [Read, Grep, Glob]` at `.opencode/skills/sk-design/design-interface/SKILL.md:4`, and the direct-fallback contract repeats that no Write/Edit/Bash/Task is allowed at `.opencode/skills/sk-design/design-interface/SKILL.md:171`.

### `skill_agent`: PASS. The packet frontmatter allows only `Read`, `Grep`, and `Glob` at `design-motion/SKILL.md:4`, matching `mode-registry.json:85` through `mode-registry.json:89`; no reviewed packet guidance required `Write`, `Edit`, `Bash`, or `Task` to apply motion judgment. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `skill_agent`: PASS. The packet frontmatter allows only `Read`, `Grep`, and `Glob` at `design-motion/SKILL.md:4`, matching `mode-registry.json:85` through `mode-registry.json:89`; no reviewed packet guidance required `Write`, `Edit`, `Bash`, or `Task` to apply motion judgment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. The packet frontmatter allows only `Read`, `Grep`, and `Glob` at `design-motion/SKILL.md:4`, matching `mode-registry.json:85` through `mode-registry.json:89`; no reviewed packet guidance required `Write`, `Edit`, `Bash`, or `Task` to apply motion judgment.

### `skill_agent`: PASS. The review stayed in the `deep-review` leaf workflow and did not dispatch sub-agents. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `skill_agent`: PASS. The review stayed in the `deep-review` leaf workflow and did not dispatch sub-agents.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. The review stayed in the `deep-review` leaf workflow and did not dispatch sub-agents.

### `spec_code`: Inventory confirmed the planned review target exists as the hub plus six mode packets. The strategy's `design-md-generator` file-count claim is stale when dependency files are excluded. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: Inventory confirmed the planned review target exists as the hub plus six mode packets. The strategy's `design-md-generator` file-count claim is stale when dependency files are excluded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Inventory confirmed the planned review target exists as the hub plus six mode packets. The strategy's `design-md-generator` file-count claim is stale when dependency files are excluded.

### `spec_code`: PASS for assigned scope. `deep-review-strategy.md:44-46` assigns iteration 3 to `shared/**` and `benchmark/**`; this pass did not review outside that scope. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: PASS for assigned scope. `deep-review-strategy.md:44-46` assigns iteration 3 to `shared/**` and `benchmark/**`; this pass did not review outside that scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS for assigned scope. `deep-review-strategy.md:44-46` assigns iteration 3 to `shared/**` and `benchmark/**`; this pass did not review outside that scope.

### `spec_code`: PASS for assigned scope. Review stayed inside `.opencode/skills/sk-design/design-interface/**` for target evidence and did not review sibling `design-foundations` or hub internals. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `spec_code`: PASS for assigned scope. Review stayed inside `.opencode/skills/sk-design/design-interface/**` for target evidence and did not review sibling `design-foundations` or hub internals.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS for assigned scope. Review stayed inside `.opencode/skills/sk-design/design-interface/**` for target evidence and did not review sibling `design-foundations` or hub internals.

### `spec_code`: PASS for this iteration's scope; structural checker output was tied back to mode packet files and registry state. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `spec_code`: PASS for this iteration's scope; structural checker output was tied back to mode packet files and registry state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS for this iteration's scope; structural checker output was tied back to mode packet files and registry state.

### `spec_code`: PASS with finding. The reviewed metadata matches the hub mode set, but command metadata fails the procedure-card projection contract. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `spec_code`: PASS with finding. The reviewed metadata matches the hub mode set, but command metadata fails the procedure-card projection contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS with finding. The reviewed metadata matches the hub mode set, but command metadata fails the procedure-card projection contract.

### `spec_code`: PASS with findings. `mode-registry.json` correctly declares `workflowMode: audit`, `proceduresPath: design-audit/procedures`, `packetSkillName: design-audit`, and a Read/Glob/Grep-only tool surface at `.opencode/skills/sk-design/mode-registry.json:103` through `.opencode/skills/sk-design/mode-registry.json:121`; findings identify docs/metadata that fail to match that contract. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `spec_code`: PASS with findings. `mode-registry.json` correctly declares `workflowMode: audit`, `proceduresPath: design-audit/procedures`, `packetSkillName: design-audit`, and a Read/Glob/Grep-only tool surface at `.opencode/skills/sk-design/mode-registry.json:103` through `.opencode/skills/sk-design/mode-registry.json:121`; findings identify docs/metadata that fail to match that contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS with findings. `mode-registry.json` correctly declares `workflowMode: audit`, `proceduresPath: design-audit/procedures`, `packetSkillName: design-audit`, and a Read/Glob/Grep-only tool surface at `.opencode/skills/sk-design/mode-registry.json:103` through `.opencode/skills/sk-design/mode-registry.json:121`; findings identify docs/metadata that fail to match that contract.

### `spec_code`: PASS. `SKILL.md`'s core extract-write-validate pipeline matches sampled backend script documentation: backend scripts own extract/cluster/write-prompt/validate/report at `backend/scripts/README.md:17` through `backend/scripts/README.md:23`, and `cli.ts` points users to `extract.ts` from repo root at `backend/scripts/cli.ts:13` through `backend/scripts/cli.ts:18`. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `spec_code`: PASS. `SKILL.md`'s core extract-write-validate pipeline matches sampled backend script documentation: backend scripts own extract/cluster/write-prompt/validate/report at `backend/scripts/README.md:17` through `backend/scripts/README.md:23`, and `cli.ts` points users to `extract.ts` from repo root at `backend/scripts/cli.ts:13` through `backend/scripts/cli.ts:18`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. `SKILL.md`'s core extract-write-validate pipeline matches sampled backend script documentation: backend scripts own extract/cluster/write-prompt/validate/report at `backend/scripts/README.md:17` through `backend/scripts/README.md:23`, and `cli.ts` points users to `extract.ts` from repo root at `backend/scripts/cli.ts:13` through `backend/scripts/cli.ts:18`.

### `spec_code`: PASS. Assigned packet exists and the reviewed evidence stays within `.opencode/skills/sk-design/design-foundations/**` except for required registry/state/doctrine comparison inputs. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `spec_code`: PASS. Assigned packet exists and the reviewed evidence stays within `.opencode/skills/sk-design/design-foundations/**` except for required registry/state/doctrine comparison inputs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. Assigned packet exists and the reviewed evidence stays within `.opencode/skills/sk-design/design-foundations/**` except for required registry/state/doctrine comparison inputs.

### `spec_code`: PASS. Review stayed inside `.opencode/skills/sk-design/design-motion/**` for target evidence, with only required doctrine/state and hub metadata comparison inputs outside the packet. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `spec_code`: PASS. Review stayed inside `.opencode/skills/sk-design/design-motion/**` for target evidence, with only required doctrine/state and hub metadata comparison inputs outside the packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. Review stayed inside `.opencode/skills/sk-design/design-motion/**` for target evidence, with only required doctrine/state and hub metadata comparison inputs outside the packet.

### `spec_code`: PASS. Reviewed executable backend code paths directly; no implementation files were modified. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `spec_code`: PASS. Reviewed executable backend code paths directly; no implementation files were modified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. Reviewed executable backend code paths directly; no implementation files were modified.

### `spec_code`: PASS. Reviewed only `.opencode/skills/sk-design/design-md-generator/**` plus required review state and review-core doctrine; no reviewed implementation files were modified. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `spec_code`: PASS. Reviewed only `.opencode/skills/sk-design/design-md-generator/**` plus required review state and review-core doctrine; no reviewed implementation files were modified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. Reviewed only `.opencode/skills/sk-design/design-md-generator/**` plus required review state and review-core doctrine; no reviewed implementation files were modified.

### `spec_code`: PASS. The assigned review target exists and all inspected files were under `.opencode/skills/sk-design/design-mcp-open-design/**` except the required `mode-registry.json` and `review_core.md` cross-checks. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: `spec_code`: PASS. The assigned review target exists and all inspected files were under `.opencode/skills/sk-design/design-mcp-open-design/**` except the required `mode-registry.json` and `review_core.md` cross-checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. The assigned review target exists and all inspected files were under `.opencode/skills/sk-design/design-mcp-open-design/**` except the required `mode-registry.json` and `review_core.md` cross-checks.

### `toolSurface`: PASS at coarse metadata level. `mode-registry.json:106` through `mode-registry.json:110` allows Read/Glob/Grep and forbids Write/Edit/Bash; packet frontmatter allows Read/Grep/Glob at `.opencode/skills/sk-design/design-audit/SKILL.md:4`. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `toolSurface`: PASS at coarse metadata level. `mode-registry.json:106` through `mode-registry.json:110` allows Read/Glob/Grep and forbids Write/Edit/Bash; packet frontmatter allows Read/Grep/Glob at `.opencode/skills/sk-design/design-audit/SKILL.md:4`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `toolSurface`: PASS at coarse metadata level. `mode-registry.json:106` through `mode-registry.json:110` allows Read/Glob/Grep and forbids Write/Edit/Bash; packet frontmatter allows Read/Grep/Glob at `.opencode/skills/sk-design/design-audit/SKILL.md:4`.

### `toolSurface`: PASS at coarse metadata level. `mode-registry.json:64` through `mode-registry.json:69` allows Read/Glob/Grep and forbids Write/Edit/Bash; `SKILL.md:4` allows Read/Grep/Glob. Existing tool-surface parity concern around script-backed contrast proof was already active from prior registry context and was not re-counted here. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `toolSurface`: PASS at coarse metadata level. `mode-registry.json:64` through `mode-registry.json:69` allows Read/Glob/Grep and forbids Write/Edit/Bash; `SKILL.md:4` allows Read/Grep/Glob. Existing tool-surface parity concern around script-backed contrast proof was already active from prior registry context and was not re-counted here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `toolSurface`: PASS at coarse metadata level. `mode-registry.json:64` through `mode-registry.json:69` allows Read/Glob/Grep and forbids Write/Edit/Bash; `SKILL.md:4` allows Read/Grep/Glob. Existing tool-surface parity concern around script-backed contrast proof was already active from prior registry context and was not re-counted here.

### Changelog frontmatter: PASS. `changelog/v1.0.0.0.md:1` through `changelog/v1.0.0.0.md:4` includes `version: 1.0.0.0`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Changelog frontmatter: PASS. `changelog/v1.0.0.0.md:1` through `changelog/v1.0.0.0.md:4` includes `version: 1.0.0.0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changelog frontmatter: PASS. `changelog/v1.0.0.0.md:1` through `changelog/v1.0.0.0.md:4` includes `version: 1.0.0.0`.

### Changelog frontmatter: PASS. `changelog/v1.0.0.0.md:1` through `changelog/v1.0.0.0.md:4` includes YAML frontmatter with `version: 1.0.0.0`. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Changelog frontmatter: PASS. `changelog/v1.0.0.0.md:1` through `changelog/v1.0.0.0.md:4` includes YAML frontmatter with `version: 1.0.0.0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changelog frontmatter: PASS. `changelog/v1.0.0.0.md:1` through `changelog/v1.0.0.0.md:4` includes YAML frontmatter with `version: 1.0.0.0`.

### Command metadata: `command-metadata.json` enumerates the five runnable `/design:*` commands (`audit`, `foundations`, `interface`, `md-generator`, `motion`) and repeatedly states `design-mcp-open-design` has no standalone command, matching `mode-registry.json:14` and `mode-registry.json:157`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Command metadata: `command-metadata.json` enumerates the five runnable `/design:*` commands (`audit`, `foundations`, `interface`, `md-generator`, `motion`) and repeatedly states `design-mcp-open-design` has no standalone command, matching `mode-registry.json:14` and `mode-registry.json:157`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command metadata: `command-metadata.json` enumerates the five runnable `/design:*` commands (`audit`, `foundations`, `interface`, `md-generator`, `motion`) and repeatedly states `design-mcp-open-design` has no standalone command, matching `mode-registry.json:14` and `mode-registry.json:157`.

### Dead-code/orphan check: PARTIAL. No genuinely dead backend file was proven; `guided-run.ts` is executable and tested, but its supported-entrypoint status is unclear and recorded as P2-016-002. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Dead-code/orphan check: PARTIAL. No genuinely dead backend file was proven; `guided-run.ts` is executable and tested, but its supported-entrypoint status is unclear and recorded as P2-016-002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dead-code/orphan check: PARTIAL. No genuinely dead backend file was proven; `guided-run.ts` is executable and tested, but its supported-entrypoint status is unclear and recorded as P2-016-002.

### Description metadata: `description.json:3` reflects the current five workflow modes plus one transport mode and does not look stale. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Description metadata: `description.json:3` reflects the current five workflow modes plus one transport mode and does not look stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Description metadata: `description.json:3` reflects the current five workflow modes plus one transport mode and does not look stale.

### Existing output-boundary issue: NOT RECOUNTED. Prior `P1-001` already covers standalone artifact writers bypassing the central output boundary in this directory. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Existing output-boundary issue: NOT RECOUNTED. Prior `P1-001` already covers standalone artifact writers bypassing the central output boundary in this directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing output-boundary issue: NOT RECOUNTED. Prior `P1-001` already covers standalone artifact writers bypassing the central output boundary in this directory.

### Maintainability duplication check: no new finding. The packet uses the shared register/context/handoff base by reference in `SKILL.md:99` through `SKILL.md:114`, and the only script-backed references found were discoverability aids or deterministic checks already referenced from packet docs. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Maintainability duplication check: no new finding. The packet uses the shared register/context/handoff base by reference in `SKILL.md:99` through `SKILL.md:114`, and the only script-backed references found were discoverability aids or deterministic checks already referenced from packet docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Maintainability duplication check: no new finding. The packet uses the shared register/context/handoff base by reference in `SKILL.md:99` through `SKILL.md:114`, and the only script-backed references found were discoverability aids or deterministic checks already referenced from packet docs.

### Optional report branch traceability: PARTIAL. Docs mention `report-gen.ts`, `preview-gen.ts`, and `proof.ts` at `backend/README.md:72`, while `guided-run.ts:164` through `guided-run.ts:166` only orchestrates `report-gen.ts`; this is acceptable as a guided-run limitation because report/preview/proof remain separately documented entrypoints, not a new finding. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Optional report branch traceability: PARTIAL. Docs mention `report-gen.ts`, `preview-gen.ts`, and `proof.ts` at `backend/README.md:72`, while `guided-run.ts:164` through `guided-run.ts:166` only orchestrates `report-gen.ts`; this is acceptable as a guided-run limitation because report/preview/proof remain separately documented entrypoints, not a new finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Optional report branch traceability: PARTIAL. Docs mention `report-gen.ts`, `preview-gen.ts`, and `proof.ts` at `backend/README.md:72`, while `guided-run.ts:164` through `guided-run.ts:166` only orchestrates `report-gen.ts`; this is acceptable as a guided-run limitation because report/preview/proof remain separately documented entrypoints, not a new finding.

### Orphan/dead-file scan: PASS for sampled packet structure. The root `feature_catalog.md` indexes the three feature files, the root `manual_testing_playbook.md` indexes all 13 scenario files, and grep confirmed procedure/assets references from SKILL.md, README, catalog, and playbook files. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Orphan/dead-file scan: PASS for sampled packet structure. The root `feature_catalog.md` indexes the three feature files, the root `manual_testing_playbook.md` indexes all 13 scenario files, and grep confirmed procedure/assets references from SKILL.md, README, catalog, and playbook files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Orphan/dead-file scan: PASS for sampled packet structure. The root `feature_catalog.md` indexes the three feature files, the root `manual_testing_playbook.md` indexes all 13 scenario files, and grep confirmed procedure/assets references from SKILL.md, README, catalog, and playbook files.

### Output boundary documentation: PASS. `output-policy.ts:5` through `output-policy.ts:9`, `output-policy.ts:44` through `output-policy.ts:46`, and `output-policy.ts:82` through `output-policy.ts:84` explain central write-location and overwrite rules clearly enough for future artifact writers. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Output boundary documentation: PASS. `output-policy.ts:5` through `output-policy.ts:9`, `output-policy.ts:44` through `output-policy.ts:46`, and `output-policy.ts:82` through `output-policy.ts:84` explain central write-location and overwrite rules clearly enough for future artifact writers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Output boundary documentation: PASS. `output-policy.ts:5` through `output-policy.ts:9`, `output-policy.ts:44` through `output-policy.ts:46`, and `output-policy.ts:82` through `output-policy.ts:84` explain central write-location and overwrite rules clearly enough for future artifact writers.

### Packet self-documentation: PASS with the command-metadata exception above. The root README, feature catalog, manual playbook, and procedure-card inventory all describe the private procedure card and read-only boundary. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Packet self-documentation: PASS with the command-metadata exception above. The root README, feature catalog, manual playbook, and procedure-card inventory all describe the private procedure card and read-only boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet self-documentation: PASS with the command-metadata exception above. The root README, feature catalog, manual playbook, and procedure-card inventory all describe the private procedure card and read-only boundary.

### Packet structure: PARTIAL. `feature_catalog/` and `manual_testing_playbook/` are indexed and frontmatter-versioned, but two validator scripts are not discoverable from `SKILL.md` or mode procedures, recorded as P2-009-002. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Packet structure: PARTIAL. `feature_catalog/` and `manual_testing_playbook/` are indexed and frontmatter-versioned, but two validator scripts are not discoverable from `SKILL.md` or mode procedures, recorded as P2-009-002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet structure: PARTIAL. `feature_catalog/` and `manual_testing_playbook/` are indexed and frontmatter-versioned, but two validator scripts are not discoverable from `SKILL.md` or mode procedures, recorded as P2-009-002.

### Pipeline documentation vs call graph: PASS for the documented core flow. `backend/scripts/README.md:17` documents extract/write/validate plus optional report artifacts; `guided-run.ts:157` through `guided-run.ts:166` plans `extract.ts`, `build-write-prompt.ts`, optional `validate.ts`, and optional `report-gen.ts` accordingly. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Pipeline documentation vs call graph: PASS for the documented core flow. `backend/scripts/README.md:17` documents extract/write/validate plus optional report artifacts; `guided-run.ts:157` through `guided-run.ts:166` plans `extract.ts`, `build-write-prompt.ts`, optional `validate.ts`, and optional `report-gen.ts` accordingly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pipeline documentation vs call graph: PASS for the documented core flow. `backend/scripts/README.md:17` documents extract/write/validate plus optional report artifacts; `guided-run.ts:157` through `guided-run.ts:166` plans `extract.ts`, `build-write-prompt.ts`, optional `validate.ts`, and optional `report-gen.ts` accordingly.

### prior findings registry: ACKNOWLEDGED. Existing P1-001 is in `design-md-generator` standalone artifact writers and was not recounted. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: prior findings registry: ACKNOWLEDGED. Existing P1-001 is in `design-md-generator` standalone artifact writers and was not recounted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: prior findings registry: ACKNOWLEDGED. Existing P1-001 is in `design-md-generator` standalone artifact writers and was not recounted.

### Procedure paths: the five workflow-mode `proceduresPath` entries resolve to existing procedure files. The transport entry has no `proceduresPath`; this matches the checked registry shape and was not classified as a bug because the parent checker does not require it and the transport has no procedure-path claim to verify. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Procedure paths: the five workflow-mode `proceduresPath` entries resolve to existing procedure files. The transport entry has no `proceduresPath`; this matches the checked registry shape and was not classified as a bug because the parent checker does not require it and the transport has no procedure-path claim to verify.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Procedure paths: the five workflow-mode `proceduresPath` entries resolve to existing procedure files. The transport entry has no `proceduresPath`; this matches the checked registry shape and was not classified as a bug because the parent checker does not require it and the transport has no procedure-path claim to verify.

### Registry-to-packet mapping: `mode-registry.json:38` through `mode-registry.json:164` declares six modes; `Glob` confirmed the six packet `SKILL.md` and `README.md` files exist; `Grep` confirmed each packet `SKILL.md` name matches its `packetSkillName`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Registry-to-packet mapping: `mode-registry.json:38` through `mode-registry.json:164` declares six modes; `Glob` confirmed the six packet `SKILL.md` and `README.md` files exist; `Grep` confirmed each packet `SKILL.md` name matches its `packetSkillName`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Registry-to-packet mapping: `mode-registry.json:38` through `mode-registry.json:164` declares six modes; `Glob` confirmed the six packet `SKILL.md` and `README.md` files exist; `Grep` confirmed each packet `SKILL.md` name matches its `packetSkillName`.

### Router table: `hub-router.json:27` through `hub-router.json:91` references all six workflow modes and resources; the checker confirmed router signal keys match the registry workflowMode set. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Router table: `hub-router.json:27` through `hub-router.json:91` references all six workflow modes and resources; the checker confirmed router signal keys match the registry workflowMode set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Router table: `hub-router.json:27` through `hub-router.json:91` references all six workflow modes and resources; the checker confirmed router signal keys match the registry workflowMode set.

### sk-doc package check: FAIL. `package_skill.py --check` reports `SKILL.md exceeds word limit (5759 words, max: 5000)` and `Result: FAIL`. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: sk-doc package check: FAIL. `package_skill.py --check` reports `SKILL.md exceeds word limit (5759 words, max: 5000)` and `Result: FAIL`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sk-doc package check: FAIL. `package_skill.py --check` reports `SKILL.md exceeds word limit (5759 words, max: 5000)` and `Result: FAIL`.

### sk-doc structural conformance: PASS with warning. `package_skill.py --check` reports the packet is valid, with one warning for `SKILL.md` size. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: sk-doc structural conformance: PASS with warning. `package_skill.py --check` reports the packet is valid, with one warning for `SKILL.md` size.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sk-doc structural conformance: PASS with warning. `package_skill.py --check` reports the packet is valid, with one warning for `SKILL.md` size.

### sk-doc structural conformance: PASS with warning. `package_skill.py --check` returned `Result: PASS`; warning recorded as P2-009-001. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: sk-doc structural conformance: PASS with warning. `package_skill.py --check` returned `Result: PASS`; warning recorded as P2-009-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sk-doc structural conformance: PASS with warning. `package_skill.py --check` returned `Result: PASS`; warning recorded as P2-009-001.

### sk-doc structural conformance: PASS. `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-motion --check` returned `Skill is valid` and `Result: PASS` with no warnings. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: sk-doc structural conformance: PASS. `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-motion --check` returned `Skill is valid` and `Result: PASS` with no warnings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sk-doc structural conformance: PASS. `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-motion --check` returned `Skill is valid` and `Result: PASS` with no warnings.

### tool-surface parity: PARTIAL. Entry-point frontmatter matches the registry at the coarse allowed-tool level, but `design-foundations` has a mandatory script-backed proof path despite read-only/no-Bash declarations. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: tool-surface parity: PARTIAL. Entry-point frontmatter matches the registry at the coarse allowed-tool level, but `design-foundations` has a mandatory script-backed proof path despite read-only/no-Bash declarations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: tool-surface parity: PARTIAL. Entry-point frontmatter matches the registry at the coarse allowed-tool level, but `design-foundations` has a mandatory script-backed proof path despite read-only/no-Bash declarations.

### transport-axis boundary: PASS. `design-mcp-open-design` is marked `packetKind:"transport"`, `backendKind:"od-cli-transport"`, `allowed:[Read,Bash]`, `forbidden:[Write,Edit,Task]`, and `mutatesWorkspace:false` in `mode-registry.json:145-152`. Its scripts are install/verify/report-only helpers, and its docs route mutating Open Design operations to the external Open Design project/global agent config surface with explicit gates. No path reviewed showed writes inside this repo by the transport packet. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: transport-axis boundary: PASS. `design-mcp-open-design` is marked `packetKind:"transport"`, `backendKind:"od-cli-transport"`, `allowed:[Read,Bash]`, `forbidden:[Write,Edit,Task]`, and `mutatesWorkspace:false` in `mode-registry.json:145-152`. Its scripts are install/verify/report-only helpers, and its docs route mutating Open Design operations to the external Open Design project/global agent config surface with explicit gates. No path reviewed showed writes inside this repo by the transport packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: transport-axis boundary: PASS. `design-mcp-open-design` is marked `packetKind:"transport"`, `backendKind:"od-cli-transport"`, `allowed:[Read,Bash]`, `forbidden:[Write,Edit,Task]`, and `mutatesWorkspace:false` in `mode-registry.json:145-152`. Its scripts are install/verify/report-only helpers, and its docs route mutating Open Design operations to the external Open Design project/global agent config surface with explicit gates. No path reviewed showed writes inside this repo by the transport packet.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->

## Wave Log (manual)

- 2026-07-09: Wave 1 (iterations 2-5, parallel, ~346s wall-clock) complete. 6 open findings total (4 P1, 2 P2). Proceeding to Wave 2.
