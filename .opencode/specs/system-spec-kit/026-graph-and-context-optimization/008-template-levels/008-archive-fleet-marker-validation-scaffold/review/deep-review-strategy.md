---
title: Deep Review Strategy - 008 z-archive marker validation sweep
description: Runtime strategy for /spec_kit:deep-review:auto implementation-code audit.
---

# Deep Review Strategy - 008 z-archive marker validation sweep

## 1. OVERVIEW

### Purpose

Run the official /spec_kit:deep-review:auto workflow against the approved 008 phase child with review focus pinned to implementation code, not only spec cross-references.

## 2. TOPIC

Review target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-archive-marker-validation-unused-scaffold

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 implementation-spec-alignment - target packet, parent graph, and implementation ledger alignment
- [ ] D2 code-correctness - archive marker producers/consumers, path policy, and validator behavior
- [ ] D3 template-rendering-correctness - manifest templates, resolver, renderer, scaffold output, and marker placement
- [ ] D4 validator-coverage - strict validation, z_archive/z_future traversal, and tests
- [ ] D5 cross-runtime-mirror-consistency - command YAML, command docs, and deep-review agent mirrors
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Do not modify implementation or target spec docs during review.
- Do not review unrelated application code outside the declared scope.
- Do not treat docs-only cross-reference checks as sufficient when implementation files are in scope.

## 5. STOP CONDITIONS

Stop on maxIterations=5 unless convergence fires earlier under the YAML workflow gates.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated]

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: implementation-spec-alignment
- Focus area: Check the 008 packet against the 010 phase-parent graph, the scaffold marker intent, and the 003 implementation ledger before moving to implementation code.
- Required evidence: cite concrete file:line sources from the target packet, parent graph, and implementation files.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

- Setup command invoked as: /spec_kit:deep-review:auto /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-archive-marker-validation-unused-scaffold --max-iterations=5
- resource-map.md not present; skipping resource-map coverage gate.
- implementation-summary.md is a scaffold template; implementation scope was derived from the phase name, 010 parent context, 003 resource map, and adjacent 007 marker-sweep review surface.
- Primary implementation surface: scaffold marker production/consumption, validation scripts, template manifest/resolver/renderer, archive/index-scope policies, tests, and command/agent mirrors listed in config.reviewScopeFiles.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| spec_code | core | pending | - | implementation scope seeded from ledger fallback |
| checklist_evidence | core | pending | - | target checklist scaffold must be verified |
| skill_agent | overlay | pending | - | deep-review agent contracts in scope |
| agent_cross_runtime | overlay | pending | - | .opencode/.claude/.codex/.gemini mirrors in scope |
| feature_catalog_code | overlay | pending | - | archive/index-scope feature docs may support findings |
| playbook_capability | overlay | pending | - | not required unless cited by implementation evidence |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-archive-marker-validation-unused-scaffold/spec.md | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-archive-marker-validation-unused-scaffold/plan.md | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-archive-marker-validation-unused-scaffold/tasks.md | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-archive-marker-validation-unused-scaffold/checklist.md | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-archive-marker-validation-unused-scaffold/implementation-summary.md | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-archive-marker-validation-unused-scaffold/decision-record.md | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-archive-marker-validation-unused-scaffold/description.json | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-archive-marker-validation-unused-scaffold/graph-metadata.json | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/spec.md | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/description.json | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/graph-metadata.json | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/implementation-summary.md | - | - | - | pending |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/resource-map.md | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/spec/create.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/spec/validate.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/spec/archive.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/memory/backfill-frontmatter.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/.scan-validate-all.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/.scan-validate-all.py | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/rules/check-files.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/rules/check-sections.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/renderers/template-renderer.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/lib/template-utils.sh | - | - | - | pending |
| .opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json | - | - | - | pending |
| .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl | - | - | - | pending |
| .opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl | - | - | - | pending |
| .opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl | - | - | - | pending |
| .opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl | - | - | - | pending |
| .opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl | - | - | - | pending |
| .opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts | - | - | - | pending |
| .opencode/skills/system-spec-kit/mcp_server/tests/index-scope.vitest.ts | - | - | - | pending |
| .opencode/commands/spec_kit/deep-review.md | - | - | - | pending |
| .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml | - | - | - | pending |
| .opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml | - | - | - | pending |
| .opencode/commands/memory/manage.md | - | - | - | pending |
| .opencode/agents/deep-review.md | - | - | - | pending |
| .claude/agents/deep-review.md | - | - | - | pending |
| .codex/agents/deep-review.toml | - | - | - | pending |
| .gemini/agents/deep-review.md | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-05-04T09:01:21.816Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: deep-review-findings-registry.json
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec_folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-05-04T09:01:21.816Z
<!-- MACHINE-OWNED: END -->
