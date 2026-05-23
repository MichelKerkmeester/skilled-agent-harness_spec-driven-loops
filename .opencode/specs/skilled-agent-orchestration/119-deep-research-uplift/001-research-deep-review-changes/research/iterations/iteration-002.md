# Iteration 2 — Applicability Mapping (cli-devin swe-1.6)

## Summary
This iteration classified all 47 changes from iter-1 for deep-research applicability. The verdict distribution: 27 ALREADY-DONE (57%), 10 SKIP (21%), 3 APPLY (6%), 7 ADAPT (15%). Most bilateral runtime changes (deep-loop-runtime, MCP removal, workflow YAML cutover) already shipped for deep-research in arc 118 via v1.12.0.0. Deep-review-specific artifacts (review artifacts, 118 planning collateral, 117 AI Council artifacts) are SKIP. The primary APPLY candidates are canonical companions (feature_catalog/, manual_testing_playbook/, references/). ADAPT candidates focus on verification tasks (script invocation, state schema parity, path guards, DB lifecycle, lock infrastructure, executor config schema).

## Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|
| ALREADY-DONE | 27 | 57% |
| SKIP | 10 | 21% |
| APPLY | 3 | 6% |
| ADAPT | 7 | 15% |

## Mapping Table

| C-NNN | Type | Verdict | Priority | Effort | Deep-Research File(s) | Evidence |
|-------|------|---------|----------|--------|------------------------|----------|
| C-001 | RUNTIME-RELOCATION | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/ | deep-loop-runtime/ exists; deep-research v1.12.0.0 changelog confirms dependency rebind |
| C-002 | COLLATERAL | SKIP | - | - | - | 118 arc planning structure is deep-review-specific |
| C-003 | RUNTIME-RELOCATION | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/lib/ | deep-research v1.12.0.0 changelog: "Any deep-research-adjacent code that previously imported from system-spec-kit/mcp_server/lib/deep-loop/* now imports from deep-loop-runtime/lib/{deep-loop,coverage-graph}/*" |
| C-004 | SCRIPT-SHIM | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/scripts/ | deep-research YAMLs call deep-loop-runtime/scripts/*.cjs per grep output (lines 412, 863 in spec_kit_deep-research_auto.yaml) |
| C-005 | RUNTIME-RELOCATION | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/storage/ | deep-research v1.12.0.0 changelog: "SQLite database moved with the schema-owner code and now lives at .opencode/skills/deep-loop-runtime/storage/" |
| C-006 | MCP-REMOVAL | ALREADY-DONE | - | - | - | deep-research never used mcp_server/handlers/coverage-graph/*; v1.12.0.0 changelog confirms script cutover |
| C-007 | MCP-REMOVAL | ALREADY-DONE | - | - | - | deep-research never used deep_loop_graph_* MCP tools; v1.12.0.0 changelog confirms script cutover |
| C-008 | WORKFLOW-YAML | ADAPT | P1 | S | .opencode/commands/spec_kit/assets/spec_kit_deep-research_*.yaml | Already done per v1.12.0.0, but should verify that all 4 scripts (convergence, upsert, query, status) are invoked correctly |
| C-009 | COLLATERAL | ALREADY-DONE | - | - | .opencode/commands/doctor/_routes.yaml, .opencode/commands/doctor/update.md | doctor/_routes.yaml lines 88-99 include deep-loop target with script invocations; doctor/update.md lines 28, 130, 220, 254, 272, 336, 359, 374 reference deep-loop |
| C-010 | COLLATERAL | ALREADY-DONE | - | - | .opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md | File exists; system-code-graph feature_catalog.md line 38 notes deep_loop_graph_* tools removed in arc 118 and replaced by scripts |
| C-011 | COLLATERAL | ALREADY-DONE | - | - | .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md | Feature catalog entries for deep_loop_graph_* retained as historical reference per line 38 |
| C-012 | TEST-MIGRATION | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/tests/unit/ | Tests exist in deep-loop-runtime/tests/unit/; deep-research v1.12.0.0 changelog confirms test infrastructure migration |
| C-013 | TEST-MIGRATION | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/tests/integration/ | Integration fixtures exist in deep-loop-runtime/tests/integration/ |
| C-014 | TEST-MIGRATION | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/tests/integration/*.script.vitest.ts | Script integration tests exist in deep-loop-runtime/tests/integration/ |
| C-015 | TEST-MIGRATION | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/tests/lifecycle/db-open-close.vitest.ts | Lifecycle test exists in deep-loop-runtime/tests/lifecycle/ |
| C-016 | TEST-MIGRATION | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/tests/_helpers/spawn-cjs.ts | Helper exists in deep-loop-runtime/tests/_helpers/ |
| C-017 | TEST-MIGRATION | ALREADY-DONE | - | - | .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts | deep-research v1.12.0.0 changelog: "mcp_server/vitest.config.ts include glob extended to discover tests at ../deep-loop-runtime/tests/**/*.{vitest,test}.ts" |
| C-018 | DOC-COMPLIANCE | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/SKILL.md | deep-loop-runtime/SKILL.md exists; DQI improvement is runtime-internal, deep-research consumes the runtime |
| C-019 | DOC-COMPLIANCE | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/README.md | deep-loop-runtime/README.md exists; DQI improvement is runtime-internal, deep-research consumes the runtime |
| C-020 | CANONICAL-COMPANIONS | APPLY | P1 | M | .opencode/skills/deep-research/feature_catalog/ | deep-research has no feature_catalog/ folder (grep shows references to it but folder doesn't exist); deep-loop-runtime has 18 feature_catalog files |
| C-021 | CANONICAL-COMPANIONS | APPLY | P1 | M | .opencode/skills/deep-research/manual_testing_playbook/ | deep-research has manual_testing_playbook/ but it's older (pre-118 pattern); deep-loop-runtime has 18 playbook files with updated structure |
| C-022 | CANONICAL-COMPANIONS | APPLY | P1 | S | .opencode/skills/deep-research/references/ | deep-research has no references/ folder; deep-loop-runtime has 4 reference files (coverage_graph_schema.md, integration_points.md, script_interface_contract.md, state_format.md) |
| C-023 | CANONICAL-COMPANIONS | ALREADY-DONE | - | - | .opencode/skills/deep-research/graph-metadata.json | graph-metadata.json exists in deep-research/ (read confirmed) |
| C-024 | VERSION-BUMP | SKIP | - | - | - | deep-review version bump is deep-review-specific |
| C-025 | VERSION-BUMP | SKIP | - | - | - | deep-review changelog is deep-review-specific |
| C-026 | VERSION-BUMP | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/SKILL.md | deep-loop-runtime v1.0.0 shipped; deep-research consumes this runtime |
| C-027 | VERSION-BUMP | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/changelog/v1.0.0.md | deep-loop-runtime v1.0.0 changelog exists |
| C-028 | COLLATERAL | SKIP | - | - | - | 116 resource-map is deep-review-specific |
| C-029 | COLLATERAL | SKIP | - | - | - | 118 child description.json regenerations are deep-review-specific |
| C-030 | MCP-REMOVAL | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/scripts/*.cjs | MCP comment stripping is runtime-internal; deep-research consumes the scripts |
| C-031 | COLLATERAL | SKIP | - | - | - | 117 keyword/description restoration is deep-review-specific |
| C-032 | FIX-PACK | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts | executor-audit.ts exists in deep-loop-runtime/; deep-research consumes the runtime |
| C-033 | FIX-PACK | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts | Test exists in deep-loop-runtime/tests/unit/ |
| C-034 | REVIEW-ARTIFACTS | SKIP | - | - | - | 118 review artifacts are deep-review-specific |
| C-035 | REVIEW-ARTIFACTS | SKIP | - | - | - | 118 review artifacts are deep-review-specific |
| C-036 | FIX-PACK | ADAPT | P1 | S | .opencode/skills/deep-research/references/state_format.md | deep-loop-runtime/references/state_format.md has F-027/F-028 fixes; deep-research should reference this for schema parity |
| C-037 | DOC-COMPLIANCE | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/changelog/v1.0.0.md | Changelog DQI improvement is runtime-internal |
| C-038 | FIX-PACK | SKIP | - | - | - | 118 phase metadata bumps are deep-review-specific |
| C-039 | FIX-PACK | ADAPT | P1 | S | .opencode/skills/deep-research/scripts/_lib/ | cli-guards.cjs provides path validation; deep-research may need similar guards for research packet paths |
| C-040 | FIX-PACK | ADAPT | P1 | S | .opencode/skills/deep-research/scripts/reduce-state.cjs | DB lifecycle pattern in deep-loop-runtime scripts; deep-research reduce-state.cjs should follow same pattern |
| C-041 | FIX-PACK | ADAPT | P1 | S | .opencode/skills/deep-research/ | deep-loop-runtime has .deep-loop-graph-writer.lock; deep-research has .deep-research.lock |
| C-042 | FIX-PACK | ADAPT | P2 | S | .opencode/skills/deep-research/ | coverage-graph-db.ts uses prepared-statement reuse; deep-research typically accesses graph through scripts, not direct DB |
| C-043 | FIX-PACK | ADAPT | P1 | S | .opencode/skills/deep-research/assets/deep_research_config.json | executor-audit.ts and executor-config.ts hardening in runtime; deep-research executor config should follow same schema |
| C-044 | VERSION-BUMP | ALREADY-DONE | - | - | .opencode/skills/deep-research/SKILL.md | deep-research SKILL.md version is 1.12.0.0 (confirmed in read) |
| C-045 | VERSION-BUMP | ALREADY-DONE | - | - | .opencode/skills/deep-research/changelog/v1.12.0.0.md | v1.12.0.0 changelog exists (confirmed in read) |
| C-046 | FIX-PACK | ALREADY-DONE | - | - | .opencode/skills/deep-loop-runtime/changelog/v1.0.0.md | Changelog reference update is runtime-internal |
| C-047 | COLLATERAL | SKIP | - | - | - | 117 AI Council artifacts are deep-review-specific |

## High-Priority Uplift Candidates (APPLY + ADAPT, P0/P1)

### APPLY (P1)

**C-020: feature_catalog/ creation**
- Target: `.opencode/skills/deep-research/feature_catalog/`
- Effort: M (18 files to mirror from deep-loop-runtime structure)
- Evidence: deep-research has no feature_catalog/ folder; deep-loop-runtime has 18 feature_catalog files covering executor, prompt-rendering, validation, state-safety, scoring, coverage-graph, script-entry-points
- Recommendation: Create feature_catalog/ under deep-research/ mirroring the deep-loop-runtime structure but adapted for research-specific features (e.g., research-dimension coverage instead of review-depth)

**C-021: manual_testing_playbook/ update**
- Target: `.opencode/skills/deep-research/manual_testing_playbook/`
- Effort: M (deep-research has existing playbook but needs 118-era updates)
- Evidence: deep-research has manual_testing_playbook/ but it's older; deep-loop-runtime has 18 playbook files with updated structure
- Recommendation: Audit existing deep-research playbook against deep-loop-runtime structure; adopt 118-era patterns (graph-aware scenarios, script-invocation tests)

**C-022: references/ creation**
- Target: `.opencode/skills/deep-research/references/`
- Effort: S (4 files to mirror/adapt)
- Evidence: deep-research has no references/ folder; deep-loop-runtime has 4 reference files (coverage_graph_schema.md, integration_points.md, script_interface_contract.md, state_format.md)
- Recommendation: Create references/ under deep-research/ with research-specific adaptations: state_format.md should reference research JSONL schema, integration_points.md should document research-specific integration points

### APPLY (P1)

**C-020: feature_catalog/ creation**
- Target: `.opencode/skills/deep-research/feature_catalog/`
- Effort: M (18 files to mirror from deep-loop-runtime structure)
- Evidence: deep-research has no feature_catalog/ folder; deep-loop-runtime has 18 feature_catalog files covering executor, prompt-rendering, validation, state-safety, scoring, coverage-graph, script-entry-points
- Recommendation: Create feature_catalog/ under deep-research/ mirroring the deep-loop-runtime structure but adapted for research-specific features (e.g., research-dimension coverage instead of review-depth)

**C-021: manual_testing_playbook/ update**
- Target: `.opencode/skills/deep-research/manual_testing_playbook/`
- Effort: M (deep-research has existing playbook but needs 118-era updates)
- Evidence: deep-research has manual_testing_playbook/ but it's older; deep-loop-runtime has 18 playbook files with updated structure
- Recommendation: Audit existing deep-research playbook against deep-loop-runtime structure; adopt 118-era patterns (graph-aware scenarios, script-invocation tests)

**C-022: references/ creation**
- Target: `.opencode/skills/deep-research/references/`
- Effort: S (4 files to mirror/adapt)
- Evidence: deep-research has no references/ folder; deep-loop-runtime has 4 reference files (coverage_graph_schema.md, integration_points.md, script_interface_contract.md, state_format.md)
- Recommendation: Create references/ under deep-research/ with research-specific adaptations: state_format.md should reference research JSONL schema, integration_points.md should document research-specific integration points

### ADAPT (P1)

**C-008: Workflow YAML cutover (ADAPT for verification)**
- Target: `.opencode/commands/spec_kit/assets/spec_kit_deep-research_*.yaml`
- Effort: S (verification only)
- Evidence: Already done per v1.12.0.0, but should verify that all 4 scripts (convergence, upsert, query, status) are invoked correctly
- Recommendation: Verify that query.cjs and status.cjs are available for manual deep-research debugging (not auto-invoked but should be documented)

**C-036: state_format.md field name fixes (ADAPT for research schema)**
- Target: `.opencode/skills/deep-research/references/state_format.md` (to be created via C-022)
- Effort: S (adopt runtime schema with research extensions)
- Evidence: deep-loop-runtime/references/state_format.md has F-027/F-028 fixes; deep-research should reference this for schema parity
- Recommendation: When creating references/ via C-022, ensure state_format.md includes research-specific fields (researchQuestions, findingsRegistry, etc.) while adopting runtime fixes

**C-039: Path validation via cli-guards.cjs (ADAPT for research paths)**
- Target: `.opencode/skills/deep-research/scripts/_lib/` (if deep-research has local scripts)
- Effort: S (adopt pattern if applicable)
- Evidence: cli-guards.cjs provides path validation; deep-research may need similar guards for research packet paths
- Recommendation: Audit deep-research scripts for path validation needs; adopt cli-guards pattern if research packet path validation is missing

**C-040: DB lifecycle pattern alignment (ADAPT for research DB)**
- Target: `.opencode/skills/deep-research/scripts/reduce-state.cjs` (if it touches DB)
- Effort: S (verify pattern alignment)
- Evidence: DB lifecycle pattern in deep-loop-runtime scripts; deep-research reduce-state.cjs should follow same pattern
- Recommendation: Verify that deep-research reduce-state.cjs follows the same DB lifecycle pattern (open-close, error handling) as deep-loop-runtime scripts

**C-041: Writer-lock infrastructure (ADAPT for research lock)**
- Target: `.opencode/skills/deep-research/` (research packet lock)
- Effort: S (verify lock parity)
- Evidence: deep-loop-runtime has .deep-loop-graph-writer.lock; deep-research has .deep-research.lock
- Recommendation: Verify that deep-research lock implementation follows the same writer-lock pattern (advisory lock, timeout, error handling)

**C-042: coverage-graph-db.ts prepared-statement reuse (ADAPT for research queries)**
- Target: `.opencode/skills/deep-research/` (if deep-research has direct DB access)
- Effort: S (verify pattern if applicable)
- Evidence: coverage-graph-db.ts uses prepared-statement reuse; deep-research typically accesses graph through scripts, not direct DB
- Recommendation: No action needed unless deep-research adds direct DB access; script layer already benefits from this optimization

**C-043: executor-audit.ts + executor-config.ts hardening (ADAPT for research executor)**
- Target: `.opencode/skills/deep-research/assets/deep_research_config.json` (research executor config)
- Effort: S (verify config schema parity)
- Evidence: executor-audit.ts and executor-config.ts hardening in runtime; deep-research executor config should follow same schema
- Recommendation: Verify that deep_research_config.json follows the hardened executor-config schema (ENV_ALLOWLIST, validation rules)

## Already-Done Confirmations (with evidence)

**Runtime infrastructure (C-001, C-003, C-004, C-005)**: deep-loop-runtime/ exists and deep-research v1.12.0.0 changelog confirms dependency rebind.

**MCP removal (C-006, C-007)**: deep-research never used the removed MCP tools; v1.12.0.0 changelog confirms script cutover.

**Doctor collateral (C-009)**: doctor/_routes.yaml and doctor/update.md reference deep-loop scripts and targets.

**System-code-graph updates (C-010, C-011)**: feature_catalog.md and manual_testing_playbook/ retain deep_loop_graph_* entries as historical reference.

**Test migration (C-012 through C-017)**: All tests exist in deep-loop-runtime/tests/; v1.12.0.0 changelog confirms test infrastructure migration.

**DOC-COMPLIANCE (C-018, C-019, C-037)**: DQI improvements are runtime-internal; deep-research consumes the runtime.

**graph-metadata.json (C-023)**: File exists in deep-research/ (read confirmed).

**Runtime version bumps (C-026, C-027)**: deep-loop-runtime v1.0.0 shipped; deep-research consumes this runtime.

**MCP comment stripping (C-030)**: Runtime-internal; deep-research consumes the scripts.

**FIX-PACK hardening (C-032, C-033, C-046)**: All fixes are runtime-internal; deep-research consumes the hardened runtime.

**Deep-research version bump (C-044, C-045)**: deep-research SKILL.md version is 1.12.0.0; v1.12.0.0 changelog exists.

## Next-Iter Suggestions

- Verify the 18 bilateral changes from iter-1 actually landed for deep-research (iter-3 focus) — DONE in this iter: all 18 bilateral changes are ALREADY-DONE
- Identify deep-research-specific gaps not covered by 118 (iter-4) — focus on research-dimension coverage, research-specific state fields, research executor config parity
- Execute the APPLY/ADAPT candidates (C-020, C-021, C-022 plus ADAPT verifications) as a structured uplift packet
- Audit deep-research manual_testing_playbook/ against deep-loop-runtime structure to identify specific scenario gaps

## Convergence Signal

- newFindings (verdicts): N=47 (one per iter-1 C-NNN; all classified)
- coverage gate: PASS (all 47 mapped with evidence)
- bilateral verification: PASS (all 18 bilateral changes confirmed ALREADY-DONE for deep-research)
