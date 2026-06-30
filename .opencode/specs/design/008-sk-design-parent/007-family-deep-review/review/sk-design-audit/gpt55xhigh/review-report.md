# Deep Review Report: sk-design-audit

## Executive Summary

Verdict: **CONDITIONAL**

The `sk-design-audit` skill is broadly coherent and currently routes correctly for representative audit, critique, and accessibility/performance prompts. The release-readiness concern is metadata and validation traceability, not the core review guidance. One active P1 remains because advisor freshness depends on `derived.key_files`, and the target graph omits core/executable resource files that the skill and playbook rely on.

| Metric | Value |
| --- | --- |
| Target | `.opencode/skills/sk-design-audit` |
| Target type | `skill` |
| Iterations | 5 |
| Stop reason | `maxIterationsReached` |
| Active P0 | 0 |
| Active P1 | 1 |
| Active P2 | 3 |
| hasAdvisories | true |
| Release readiness state | `in-progress` |

## Planning Trigger

Run remediation planning before declaring the skill clean. The blocking lane is F001: update target graph freshness coverage so changes to core references, feature detail docs, and playbook scenarios trigger advisor reindexing. F002-F004 can be handled in the same metadata/docs pass.

## Active Finding Registry

### P1 - F001 - Advisor freshness key_files omit executable target resources

- Evidence: `.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/watcher.md:18-22`, `.opencode/skills/sk-design-audit/SKILL.md:92`, `.opencode/skills/sk-design-audit/SKILL.md:315-319`, `.opencode/skills/sk-design-audit/graph-metadata.json:66-75`, `.opencode/skills/sk-design-audit/manual_testing_playbook/manual_testing_playbook.md:13-17`.
- Impact: Edits to omitted core resources can leave live advisor metadata stale until a manual graph scan or another watched file changes.
- Recommended fix: Add every core reference, feature detail file, and manual playbook scenario file to `derived.key_files`, or change the watcher/indexer contract to recursively track skill package resource roots.
- Owner: `system-skill-advisor` if watcher semantics change; `sk-design-audit` if metadata is expanded.
- First seen: iteration 003.
- Status: active.

### P2 - F002 - Skill graph relationship metadata has reciprocal and weight drift

- Evidence: `.opencode/skills/sk-design-audit/graph-metadata.json:8-13`, `.opencode/skills/sk-design-audit/graph-metadata.json:27-53`, `.opencode/skills/sk-design/graph-metadata.json:6-64`, `.opencode/skills/sk-design-interface/graph-metadata.json:15-34`, `.opencode/skills/sk-design-md-generator/graph-metadata.json:15-33`.
- Impact: Skill graph validation remains warning-positive for this target, and graph traversals can under-represent reciprocal design-family relationships.
- Recommended fix: Align reciprocal relationship declarations and bring the `sk-design` sibling weight into the recommended sibling band or make the validator rule explicit for parent-router exceptions.
- Owner: `sk-design-audit` and sibling/parent graph metadata owners.
- First seen: iteration 003.
- Status: active.

### P2 - F003 - Manual playbook scenarios are not self-contained enough to execute release readiness

- Evidence: `.opencode/skills/sk-design-audit/manual_testing_playbook/manual_testing_playbook.md:19-34`, `.opencode/skills/sk-design-audit/manual_testing_playbook/01--score/findings-first-score.md:15-31`, `.opencode/skills/sk-design-audit/manual_testing_playbook/02--a11y-performance/accessibility-performance-gate.md:15-30`, `.opencode/skills/sk-design-audit/manual_testing_playbook/03--slop-hardening/anti-slop-production-hardening.md:15-30`.
- Impact: The scenarios cannot be repeated without inventing or externally supplying target artifacts, weakening release-readiness evidence.
- Recommended fix: Add minimal fixture targets or explicit target-slot instructions to each scenario, then define when SKIP is allowed.
- Owner: `sk-design-audit` manual testing playbook.
- First seen: iteration 003.
- Status: active.

### P2 - F004 - Feature catalog under-specifies responsive and theming audit capability

- Evidence: `.opencode/skills/sk-design-audit/SKILL.md:15`, `.opencode/skills/sk-design-audit/SKILL.md:247-252`, `.opencode/skills/sk-design-audit/feature_catalog/feature_catalog.md:16-31`, `.opencode/skills/sk-design-audit/references/audit_contract.md:33-39`.
- Impact: Catalog users cannot quickly discover where responsive and theming audit guidance lives, despite those being first-class scoring dimensions.
- Recommended fix: Add responsive/theming entries or expand the audit-contract capability entry so those dimensions are explicitly mapped.
- Owner: `sk-design-audit` feature catalog.
- First seen: iteration 004.
- Status: active.

## Remediation Workstreams

| Workstream | Findings | Action |
| --- | --- | --- |
| Advisor freshness metadata | F001 | Expand `derived.key_files` or broaden watcher scope for skill resource trees. |
| Skill graph hygiene | F002 | Reconcile reciprocal edges and weight-band exceptions for design-family parent/child links. |
| Manual validation repeatability | F003 | Add target fixture paths or explicit caller-supplied target fields to every scenario. |
| Catalog coverage | F004 | Make responsive and theming audit capabilities discoverable in the catalog. |

## Spec Seed

If this becomes a remediation packet, include these acceptance criteria:

- Changes to every core `sk-design-audit` reference, feature detail, and manual playbook scenario file trigger advisor freshness reindexing without editing `SKILL.md` or `graph-metadata.json`.
- `skill_graph_validate` has no target-specific reciprocal or weight-band warnings for `sk-design-audit`, or documented parent-router exceptions are encoded in the validator.
- Manual playbook scenarios identify concrete target artifacts or target input slots and remain executable without invented evidence.
- Feature catalog maps all five audit score dimensions to discoverable guidance.

## Plan Seed

1. Update `sk-design-audit/graph-metadata.json` `derived.key_files` to include `references/corpus_map.md`, all feature detail files, all manual scenario files, and the changelog if release notes are part of routing evidence.
2. Re-run `skill_graph_scan`, then `advisor_recommend` on audit/critique/a11y prompts and confirm freshness remains live after a detail-file edit.
3. Reconcile graph reciprocity with `sk-design`, `sk-design-interface`, and `sk-design-md-generator`; re-run `skill_graph_validate`.
4. Add fixture or input-slot guidance to the three manual scenarios.
5. Expand the feature catalog for responsive and theming audit capability.

## Traceability Status

| Protocol | Gate | Status | Evidence | Findings |
| --- | --- | --- | --- | --- |
| spec_code | hard | partial | `.opencode/skills/sk-design-audit/graph-metadata.json:66-75` | F001 |
| checklist_evidence | hard | partial | `.opencode/skills/sk-design-audit/manual_testing_playbook/manual_testing_playbook.md:32-34` | F003 |
| skill_agent | advisory | pass | `.opencode/skills/sk-design/SKILL.md:87-93`, `.opencode/skills/sk-design/SKILL.md:141-146` | None |
| feature_catalog_code | advisory | partial | `.opencode/skills/sk-design-audit/feature_catalog/feature_catalog.md:16-31` | F001, F004 |
| playbook_capability | advisory | partial | `.opencode/skills/sk-design-audit/manual_testing_playbook/manual_testing_playbook.md:19-34` | F003 |

## Deferred Items

- The current live advisor recommends `sk-design-audit` for full design audit, critique/hardening, and accessibility/performance prompts; no immediate routing outage was observed.
- No P0 or security findings were found.
- `resource-map.md` was absent in the spec folder at init, so no resource-map coverage gate section is required.

## Audit Appendix

### Scope Discovery

- Read target `SKILL.md`, `references/`, `feature_catalog/`, `manual_testing_playbook/`, `changelog/`, and `graph-metadata.json`.
- Target has no `assets/` or `scripts/` directories.
- Searched runtime agent and command entry points for `sk-design-audit`, `Design Audit`, `design-audit`, and `design audit`; no direct runtime agent/command entry point references were found.
- Read parent `sk-design` skill and graph metadata plus relevant sibling graph metadata.

### Iteration Replay

| Iteration | Focus | New Findings | Ratio | Verdict |
| --- | --- | --- | ---: | --- |
| 001 | correctness | none | 0.00 | PASS |
| 002 | security | none | 0.00 | PASS |
| 003 | traceability | F001, F002, F003 | 1.00 | CONDITIONAL |
| 004 | maintainability | F004 | 1.00 | PASS |
| 005 | stabilization | none | 0.00 | CONDITIONAL |

### Convergence Evidence

- Dimension coverage: 4/4.
- Required overlay coverage: `skill_agent`, `feature_catalog_code`, and `playbook_capability` executed.
- Stop reason: `maxIterationsReached`.
- PASS was not legal because active P1 count is 1.

### Validation Performed

- `skill_graph_validate` returned `isValid: true` with target-specific warnings for `sk-design-audit` relationship metadata.
- `advisor_recommend` returned `sk-design-audit` as top recommendation for full design audit, critique/hardening, and accessibility/performance prompts.
