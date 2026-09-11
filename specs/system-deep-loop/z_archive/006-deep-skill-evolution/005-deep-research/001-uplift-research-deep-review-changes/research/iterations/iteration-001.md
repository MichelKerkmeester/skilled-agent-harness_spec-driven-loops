# Iteration 1 — Survey of 118 Deep-Review Upgrades

## Summary
This iteration catalogued 47 distinct changes across 12 commits from arc 118 (deep-loop FULL_ISOLATE_NO_MCP) and the preceding 117 deliberation. Changes span runtime relocation, MCP surface removal, script shims, workflow YAML updates, collateral updates, test migration, documentation compliance, canonical companions, and fix-pack hardening. 18 changes are bilateral (affecting both deep-review and deep-research), while 29 are deep-review-specific.

## Inventory

### C-001 — Scaffold deep-loop-runtime/ skeleton
- Type: RUNTIME-RELOCATION
- Scope: deep-loop-runtime/ root folder structure
- Evidence: commit 8e09f1ec6b
- Deep-review-specific: no (bilateral foundation)

### C-002 — Scaffold 118 arc with 8 phase children
- Type: COLLATERAL
- Scope: 118 parent + 8 child spec folders
- Evidence: commit f41f5c9a5d
- Deep-review-specific: no (bilateral planning)

### C-003 — Lib runtime migration (13 .ts files)
- Type: RUNTIME-RELOCATION
- Scope: lib/deep-loop/ + lib/coverage-graph/ → deep-loop-runtime/lib/
- Evidence: commit 35503d4b78 phase 002
- Deep-review-specific: no (bilateral runtime)

### C-004 — Script shims (4 .cjs entry points)
- Type: SCRIPT-SHIM
- Scope: deep-loop-runtime/scripts/{convergence,upsert,query,status}.cjs
- Evidence: commit 35503d4b78 phase 003
- Deep-review-specific: no (bilateral scripts)

### C-005 — DB relocation
- Type: RUNTIME-RELOCATION
- Scope: deep-loop-graph.sqlite → deep-loop-runtime/storage/
- Evidence: commit 35503d4b78 phase 003
- Deep-review-specific: no (bilateral storage)

### C-006 — MCP handler removal (5 files)
- Type: MCP-REMOVAL
- Scope: mcp_server/handlers/coverage-graph/*.ts deleted
- Evidence: commit 35503d4b78 phase 004
- Deep-review-specific: no (bilateral MCP surface)

### C-007 — MCP tool schema removal (4 tools)
- Type: MCP-REMOVAL
- Scope: tool-schemas.ts + tools/index.ts deep_loop_graph_* entries
- Evidence: commit 35503d4b78 phase 004
- Deep-review-specific: no (bilateral MCP surface)

### C-008 — Workflow YAML cutover (4 files)
- Type: WORKFLOW-YAML
- Scope: spec_kit_deep-{review,research}_{auto,confirm}.yaml
- Evidence: commit 35503d4b78 phase 005
- Deep-review-specific: no (bilateral workflows)

### C-009 — /doctor collateral updates (3 files)
- Type: COLLATERAL
- Scope: doctor.md, doctor/_routes.yaml, doctor/update.md
- Evidence: commit 243369d358
- Deep-review-specific: no (bilateral collateral)

### C-010 — system-code-graph playbook update
- Type: COLLATERAL
- Scope: deep-loop-graph-convergence-yaml-fire.md
- Evidence: commit 243369d358
- Deep-review-specific: no (bilateral collateral)

### C-011 — system-code-graph feature_catalog update
- Type: COLLATERAL
- Scope: feature_catalog.md deep_loop_graph_* entries
- Evidence: commit 243369d358
- Deep-review-specific: no (bilateral collateral)

### C-012 — Test migration (13 unit tests)
- Type: TEST-MIGRATION
- Scope: mcp_server/tests/deep-loop/ → deep-loop-runtime/tests/unit/
- Evidence: commit 300bfe603a
- Deep-review-specific: no (bilateral tests)

### C-013 — Phase B fixture migration (4 fixtures)
- Type: TEST-MIGRATION
- Scope: integration fixtures → deep-loop-runtime/tests/integration/
- Evidence: commit 300bfe603a
- Deep-review-specific: no (bilateral tests)

### C-014 — Script integration tests (4 new tests)
- Type: TEST-MIGRATION
- Scope: deep-loop-runtime/tests/integration/*.script.vitest.ts
- Evidence: commit 300bfe603a
- Deep-review-specific: no (bilateral tests)

### C-015 — Lifecycle test creation
- Type: TEST-MIGRATION
- Scope: deep-loop-runtime/tests/lifecycle/db-open-close.vitest.ts
- Evidence: commit 300bfe603a
- Deep-review-specific: no (bilateral tests)

### C-016 — spawn-cjs.ts helper creation
- Type: TEST-MIGRATION
- Scope: tests/helpers/spawn-cjs.ts
- Evidence: commit 300bfe603a
- Deep-review-specific: no (bilateral tests)

### C-017 — vitest.config.ts cross-package discovery
- Type: TEST-MIGRATION
- Scope: mcp_server/vitest.config.ts include pattern
- Evidence: commit 300bfe603a
- Deep-review-specific: no (bilateral tests)

### C-018 — SKILL.md DQI improvement (74 → 95)
- Type: DOC-COMPLIANCE
- Scope: deep-loop-runtime/SKILL.md
- Evidence: commit c46c431a1b
- Deep-review-specific: no (bilateral docs)

### C-019 — README.md DQI improvement (42 → 98)
- Type: DOC-COMPLIANCE
- Scope: deep-loop-runtime/README.md
- Evidence: commit c46c431a1b
- Deep-review-specific: no (bilateral docs)

### C-020 — feature_catalog/ creation (18 files)
- Type: CANONICAL-COMPANIONS
- Scope: deep-loop-runtime/feature_catalog/
- Evidence: commit 07a159bac2
- Deep-review-specific: no (bilateral companions)

### C-021 — manual_testing_playbook/ creation (18 files)
- Type: CANONICAL-COMPANIONS
- Scope: deep-loop-runtime/manual_testing_playbook/
- Evidence: commit 07a159bac2
- Deep-review-specific: no (bilateral companions)

### C-022 — references/ creation (4 files)
- Type: CANONICAL-COMPANIONS
- Scope: deep-loop-runtime/references/
- Evidence: commit 07a159bac2
- Deep-review-specific: no (bilateral companions)

### C-023 — graph-metadata.json creation
- Type: CANONICAL-COMPANIONS
- Scope: deep-loop-runtime/graph-metadata.json
- Evidence: commit 07a159bac2
- Deep-review-specific: no (bilateral companions)

### C-024 — deep-review version bump (v1.3.3.0 → v1.4.0.0)
- Type: VERSION-BUMP
- Scope: deep-review/SKILL.md
- Evidence: commit ee78835faf
- Deep-review-specific: yes

### C-025 — deep-review changelog v1.4.0.0
- Type: VERSION-BUMP
- Scope: deep-review/changelog/v1.4.0.0.md
- Evidence: commit ee78835faf
- Deep-review-specific: yes

### C-026 — deep-loop-runtime version bump (v0.1.0 → v1.0.0)
- Type: VERSION-BUMP
- Scope: deep-loop-runtime/SKILL.md
- Evidence: commit ee78835faf
- Deep-review-specific: no (bilateral)

### C-027 — deep-loop-runtime changelog v1.0.0
- Type: VERSION-BUMP
- Scope: deep-loop-runtime/changelog/v1.0.0.md
- Evidence: commit ee78835faf
- Deep-review-specific: no (bilateral)

### C-028 — Resource-map creation
- Type: COLLATERAL
- Scope: 116-deep-review-complexity/008-playbooks-and-default-calibration/resource-map.md
- Evidence: commit ee78835faf
- Deep-review-specific: yes

### C-029 — Description.json regenerations (12 files)
- Type: COLLATERAL
- Scope: 118 child description.json files
- Evidence: commit ee78835faf
- Deep-review-specific: yes

### C-030 — Strip MCP comments (4 scripts)
- Type: MCP-REMOVAL
- Scope: deep-loop-runtime/scripts/*.cjs header comments
- Evidence: commit 3cc85ccfc0
- Deep-review-specific: no (bilateral)

### C-031 — Restore 117 keywords/description
- Type: COLLATERAL
- Scope: 117/description.json
- Evidence: commit 3cc85ccfc0
- Deep-review-specific: yes

### C-032 — executor-audit.ts ENV_ALLOWLIST hardening
- Type: FIX-PACK
- Scope: deep-loop-runtime/lib/deep-loop/executor-audit.ts
- Evidence: commit e5368e1448
- Deep-review-specific: no (bilateral)

### C-033 — executor-audit.vitest.ts test
- Type: FIX-PACK
- Scope: deep-loop-runtime/tests/unit/executor-audit.vitest.ts
- Evidence: commit e5368e1448
- Deep-review-specific: no (bilateral)

### C-034 — Review artifacts iters 1-2 (12 files)
- Type: REVIEW-ARTIFACTS
- Scope: 118/review/ config, strategy, state, iterations, deltas, prompts
- Evidence: commit e5368e1448
- Deep-review-specific: yes

### C-035 — Review artifacts iters 3-10 (24 files)
- Type: REVIEW-ARTIFACTS
- Scope: 118/review/ iterations, deltas, prompts, review-report
- Evidence: commit 6a2f5c5732
- Deep-review-specific: yes

### C-036 — state_format.md field name fixes (F-027, F-028)
- Type: FIX-PACK
- Scope: deep-loop-runtime/references/state_format.md
- Evidence: commit 3850237631
- Deep-review-specific: no (bilateral)

### C-037 — deep-loop-runtime/changelog DQI improvement (F-025)
- Type: DOC-COMPLIANCE
- Scope: deep-loop-runtime/changelog/v1.0.0.md
- Evidence: commit 3850237631
- Deep-review-specific: no (bilateral)

### C-038 — Phase metadata completion_pct bumps (F-014/015/016/017)
- Type: FIX-PACK
- Scope: 118 phase children tasks.md
- Evidence: commit 3850237631
- Deep-review-specific: yes

### C-039 — Path validation via cli-guards.cjs (F-001)
- Type: FIX-PACK
- Scope: deep-loop-runtime/scripts/lib/cli-guards.cjs
- Evidence: commit 3850237631
- Deep-review-specific: no (bilateral)

### C-040 — DB lifecycle pattern alignment (F-002)
- Type: FIX-PACK
- Scope: deep-loop-runtime/scripts/*.cjs
- Evidence: commit 3850237631
- Deep-review-specific: no (bilateral)

### C-041 — Writer-lock infrastructure
- Type: FIX-PACK
- Scope: .deep-loop-graph-writer.lock + DEEP_LOOP_SCRIPT_LOCK_HOLD_MS
- Evidence: commit 3850237631
- Deep-review-specific: no (bilateral)

### C-042 — coverage-graph-db.ts prepared-statement reuse
- Type: FIX-PACK
- Scope: deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts
- Evidence: commit 3850237631
- Deep-review-specific: no (bilateral)

### C-043 — executor-audit.ts + executor-config.ts hardening
- Type: FIX-PACK
- Scope: deep-loop-runtime/lib/deep-loop/executor-audit.ts + executor-config.ts
- Evidence: commit 3850237631
- Deep-review-specific: no (bilateral)

### C-044 — deep-research changelog version bump (F-026)
- Type: VERSION-BUMP
- Scope: deep-research/SKILL.md
- Evidence: commit 3850237631
- Deep-review-specific: yes

### C-045 — deep-research changelog v1.12.0.0 creation
- Type: VERSION-BUMP
- Scope: deep-research/changelog/v1.12.0.0.md
- Evidence: commit 3850237631
- Deep-review-specific: yes

### C-046 — deep-loop-runtime/changelog reference update
- Type: FIX-PACK
- Scope: deep-loop-runtime/changelog/v1.0.0.md
- Evidence: commit 3850237631
- Deep-review-specific: no (bilateral)

### C-047 — 117 AI Council deliberation artifacts
- Type: COLLATERAL
- Scope: 117/ai-council/ + ADR-001
- Evidence: commit 20527ff8a1
- Deep-review-specific: yes

## Type Distribution

| Type | Count | Bilateral? |
|------|-------|------------|
| RUNTIME-RELOCATION | 3 | Yes (3) |
| MCP-REMOVAL | 3 | Yes (3) |
| SCRIPT-SHIM | 1 | Yes (1) |
| WORKFLOW-YAML | 1 | Yes (1) |
| COLLATERAL | 7 | No (3 bilateral, 4 deep-review-specific) |
| TEST-MIGRATION | 6 | Yes (6) |
| DOC-COMPLIANCE | 3 | Yes (3) |
| CANONICAL-COMPANIONS | 4 | Yes (4) |
| FIX-PACK | 8 | No (6 bilateral, 2 deep-review-specific) |
| VERSION-BUMP | 6 | No (3 bilateral, 3 deep-review-specific) |
| REVIEW-ARTIFACTS | 2 | No (2 deep-review-specific) |

## Next-Iter Suggestions

- Probe FIX-PACK changes for deep-research applicability (cli-guards.cjs patterns, DB lifecycle, writer-lock infrastructure)
- Analyze CANONICAL-COMPANIONS structure for deep-research parity (feature_catalog, playbook, references, graph-metadata)
- Evaluate DOC-COMPLIANCE improvements (SKILL.md/README.md DQI patterns) for deep-research
- Assess VERSION-BUMP strategy for deep-research changelog alignment
- Review COLLATERAL changes for cross-consumer impact (resource-map, description.json patterns)

## Convergence Signal (self-report)

- newChanges catalogued: 47
- newChangesRatio (vs prior): N/A (baseline iter-1)
- coverage gate: PASS (all 12 commits surveyed)
