# Iteration 2 — Traceability + Maintainability (cli-devin swe-1.6)

## Summary

This iteration audited the deep-loop-runtime skill for traceability and maintainability issues following the 118 FULL_ISOLATE_NO_MCP arc. The review covered skill documentation (SKILL.md, README.md, changelog, feature_catalog, manual_testing_playbook, graph-metadata.json, references), test surface (unit, integration, lifecycle tests, spawn-cjs helper), and cross-skill consumer consistency (deep-review, deep-research, doctor, system-code-graph). Overall, the documentation surface is well-structured with accurate cross-references within the skill, and the test surface demonstrates good maintainability with reusable helpers and comprehensive coverage. However, two P1 issues were identified: (1) the system-code-graph feature catalog entries for the 4 deep_loop_graph_* tools still reference the old MCP handler paths instead of the new script entry points, creating a documentation drift that misleads operators about the current implementation, and (2) the manual_testing_playbook cross-reference index uses inconsistent file naming (001- vs 01-) that breaks the relative links to scenario files. Additionally, three P2 issues were identified: three TypeScript lib files are missing the standard MODULE header format used consistently across the rest of the codebase.

## Findings

### P0 (Blockers)
None found.

### P1 (Required)

- [F-005] System-code-graph feature catalog entries reference stale MCP handler paths — system-code-graph/feature_catalog/05--coverage-graph/01-deep-loop-graph-query.md:41-43, 02-deep-loop-graph-status.md:41-43, 03-deep-loop-graph-upsert.md:41-44, 04-deep-loop-graph-convergence.md:41-44 — The four deep_loop_graph_* feature catalog entries still reference the old MCP handler paths under `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/` instead of the new script entry points under `.opencode/skills/deep-loop-runtime/scripts/`, despite the main feature_catalog.md having the correct arc 118 supersession note.
  Evidence: `|| .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:42-120 | Handler | validates namespace fields and routes query types |` (01-deep-loop-graph-query.md:41-43) - references deleted MCP handler instead of `scripts/query.cjs`
  Recommended fix: Update the "Implementation" table in all four feature catalog entries to reference the new script paths: `scripts/convergence.cjs`, `scripts/upsert.cjs`, `scripts/query.cjs`, `scripts/status.cjs`, and remove references to the deleted MCP handlers and tool surface.

- [F-006] Manual testing playbook cross-reference index uses inconsistent file naming — manual_testing_playbook/manual_testing_playbook.md:398-414 — The cross-reference index in section 14 uses `001-executor-config.md` style naming but the actual scenario files use `01--executor/001-executor-config.md` path structure, breaking the relative links since the index omits the category directory prefix.
  Evidence: `| DLR-001 | [F001 Executor config](../feature_catalog/01--executor/01-executor-config.md) | [01--executor/001-executor-config.md](01--executor/001-executor-config.md) |` (manual_testing_playbook.md:398) - the scenario file link should be `01--executor/001-executor-config.md` not `001-executor-config.md`
  Recommended fix: Update all 17 scenario file links in the cross-reference index to include the category directory prefix (e.g., `01--executor/001-executor-config.md`, `02--prompt-rendering/004-prompt-pack.md`, etc.) to match the actual file structure.

### P2 (Suggestions)

- [F-007] Missing MODULE header in post-dispatch-validate.ts — lib/deep-loop/post-dispatch-validate.ts:1-2 — The post-dispatch-validate.ts file uses a single-line comment header instead of the standard boxed MODULE header format used consistently across all other lib files.
  Evidence: `// MODULE: Deep-Loop Post-Dispatch Validator` (post-dispatch-validate.ts:1-2) - single-line format instead of the standard boxed format with horizontal rules
  Recommended fix: Update the header to match the standard format: `// ───────────────────────────────────────────────────────────────\n// MODULE: Deep-Loop Post-Dispatch Validator\n// ───────────────────────────────────────────────────────────────`

- [F-008] Missing MODULE header in permissions-gate.ts — lib/deep-loop/permissions-gate.ts:1-2 — The permissions-gate.ts file uses a single-line comment header instead of the standard boxed MODULE header format used consistently across all other lib files.
  Evidence: `// MODULE: Deep-Loop Permissions Gate` (permissions-gate.ts:1-2) - single-line format instead of the standard boxed format with horizontal rules
  Recommended fix: Update the header to match the standard format: `// ───────────────────────────────────────────────────────────────\n// MODULE: Deep-Loop Permissions Gate\n// ───────────────────────────────────────────────────────────────`

- [F-009] Missing MODULE header in bayesian-scorer.ts — lib/deep-loop/bayesian-scorer.ts:1-4 — The bayesian-scorer.ts file has a boxed header but includes an extra blank line with horizontal rules, deviating from the consistent format used across other lib files.
  Evidence: `// ───────────────────────────────────────────────────────────────\n// MODULE: Deep-Loop Bayesian Scorer\n// ───────────────────────────────────────────────────────────────\n\n// ───────────────────────────────────────────────────────────────` (bayesian-scorer.ts:1-4) - extra blank line and horizontal rules after the header
  Recommended fix: Remove the extra blank line and horizontal rules to match the standard format used in other lib files.

## Dimensions Covered This Iter

- **traceability**: Verified all internal cross-references in SKILL.md, README.md, changelog/v1.0.0.md, feature_catalog/feature_catalog.md, manual_testing_playbook/manual_testing_playbook, graph-metadata.json, and references/*.md resolve correctly. Verified feature catalog entries match actual lib files and scripts (17 features × 7 categories). Verified manual_testing_playbook scenarios cite the right source files. Verified graph-metadata.json key_files and entities match actual content. Verified SKILL.md §7 INTEGRATION POINTS accurately reflects current arc 118 state. Verified changelog/v1.0.0.md references 118 commits and ADRs correctly. Found 2 P1 issues: system-code-graph feature catalog entries have stale MCP handler references, and manual_testing_playbook cross-reference index has inconsistent file naming.

- **maintainability**: Verified alignment-drift compliance: 10 of 13 TS files have proper MODULE headers, 3 files deviate (P2). All 4 CJS files have 'use strict' on line 2 as required. Test imports are correct after the migration (post-002 git-mv). spawn-cjs.ts helper is well-named with clear exports (ScriptName, ScriptResult, ScriptNamespace, uniqueNamespace, namespaceArgs, runScript, seedReviewNode, cleanupNamespace) and is reusable across all 4 script integration tests. DB lifecycle test (db-open-close.vitest.ts) covers all 4 scripts (convergence, upsert, query, status) and tests sequential invocations with proper cleanup. review-depth-*.vitest.ts files correctly import from the moved post-dispatch-validate.ts location. Found 3 P2 issues: missing/inconsistent MODULE headers in 3 TS files.

## Next-Iter Suggestions

- **cross-cutting**: Iteration 3 should verify that the skill's runtime behavior matches the documented contract by running the actual scripts and checking exit codes, stdout JSON shape, and error handling.
- **performance**: Iteration 3 should review the SQLite connection pooling and DB lifecycle patterns for potential resource leaks under high concurrency.
- **security**: Iteration 3 should audit the permissions-gate implementation for edge cases in path resolution and glob matching that could allow unauthorized access.

## Convergence Signal (self-report)

- newFindings: 5
- newFindingsRatio (vs iter-1): 5/4 = 1.25 (25% increase from baseline)
- evidence gate: PASS
- scope gate: PASS
- coverage gate: PASS (running tally: correctness ✓ security ✓ traceability ✓ maintainability ✓)
