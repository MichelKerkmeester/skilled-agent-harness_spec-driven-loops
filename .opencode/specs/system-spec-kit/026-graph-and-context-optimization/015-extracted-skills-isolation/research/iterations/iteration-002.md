# Iteration 2: Documentation Cross-Reference Map

## Focus
Complete the documentation/playbook/feature-catalog cross-reference map. Enumerate every `.md` file in spec-kit that references extracted skills, classify each as OWNERSHIP residue vs cross-reference.

## Findings

### 2.1 feature_catalog/22--context-preservation-and-code-graph (24 files)

| # | File | Class | Summary |
|---|------|-------|---------|
| 1 | `01-category-overview.md` | **CROSS-REF** | Phase 005 split doc; source table split between spec-kit hooks and system-code-graph libs |
| 2 | `02-precompact-hook.md` | **SPEC-KIT** | PreCompact hook — all spec-kit owned |
| 3 | `03-session-start-priming.md` | **SPEC-KIT** | SessionStart priming — spec-kit owned |
| 4 | `04-stop-token-tracking.md` | **SPEC-KIT** | Stop hook tracking — spec-kit owned |
| 5 | `05-cross-runtime-fallback.md` | **CROSS-REF** | runtime-detection.ts lives in system-code-graph; spec-kit consumes it |
| 6 | `06-runtime-detection.md` | **OWNERSHIP-code-graph** | Implementation at `.opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts` |
| 7 | `10-budget-allocator.md` | **OWNERSHIP-code-graph** | Implementation at `.opencode/skills/system-code-graph/mcp_server/lib/budget-allocator.ts` |
| 8 | `11-working-set-tracker.md` | **OWNERSHIP-code-graph** | Implementation at `.opencode/skills/system-code-graph/mcp_server/lib/working-set-tracker.ts` |
| 9 | `12-compact-merger.md` | **OWNERSHIP-code-graph** | Implementation at `.opencode/skills/system-code-graph/mcp_server/lib/compact-merger.ts` |
| 10 | `14-query-intent-classifier.md` | **CROSS-REF** | Classifier in system-code-graph; consumer in spec-kit memory-context.ts |
| 11 | `16-mcp-auto-priming.md` | **SPEC-KIT** | All hooks/handlers spec-kit owned |
| 12 | `17-session-health-tool.md` | **SPEC-KIT** | All handlers/lib/session spec-kit owned |
| 13 | `18-session-resume-tool.md` | **CROSS-REF** | Split: spec-kit owns session-resume.ts; code-graph owns code-graph-db.ts |
| 14 | `19-query-intent-routing.md` | **CROSS-REF** | Integration point: spec-kit routes to code-graph backend |
| 15 | `20-passive-context-enrichment.md` | **SPEC-KIT** | All hooks spec-kit owned |
| 16 | `21-gemini-cli-hooks.md` | **SPEC-KIT** | All hooks/gemini spec-kit owned |
| 17 | `22-context-preservation-metrics.md` | **SPEC-KIT** | All lib/session spec-kit owned |
| 18 | `23-tool-routing-enforcement.md` | **SPEC-KIT** | Enforcement code spec-kit owned |
| 19 | `25-resource-map-template.md` | **SPEC-KIT** | Template docs spec-kit owned |
| 20 | `26-skill-graph-scan.md` | **OWNERSHIP-skill-advisor** | Marked "Owned by: mk_skill_advisor MCP server" |
| 21 | `27-skill-graph-query.md` | **OWNERSHIP-skill-advisor** | Marked "Owned by: mk_skill_advisor MCP server" |
| 22 | `28-skill-graph-status.md` | **OWNERSHIP-skill-advisor** | Marked "Owned by: mk_skill_advisor MCP server" |
| 23 | `29-skill-graph-validate.md` | **OWNERSHIP-skill-advisor** | Marked "Owned by: mk_skill_advisor MCP server" |
| 24 | `30-coverage-graph-query.md` | **SPEC-KIT** | All handlers/coverage-graph spec-kit owned |

**Summary:** 4 OWNERSHIP-code-graph, 4 OWNERSHIP-skill-advisor, 7 CROSS-REF, 9 SPEC-KIT

### 2.2 manual_testing_playbook/22--context-preservation-and-code-graph (19 files)

| # | File | Class | Notes |
|---|------|-------|-------|
| 1 | `248-precompact-hook.md` | SPEC-KIT | Validates via hook-precompact.vitest.ts (spec-kit test) |
| 2 | `249-session-start-compact.md` | SPEC-KIT | Validates via hook-session-start.vitest.ts |
| 3 | `250-session-start-startup.md` | SPEC-KIT | Validates session-start priming |
| 4 | `251-stop-hook-saves.md` | SPEC-KIT | Validates via hook-stop-token-tracking.vitest.ts |
| 5 | `252-cross-runtime-fallback.md` | SPEC-KIT | Test in spec-kit, impl in system-code-graph |
| 6 | `253-runtime-detection.md` | SPEC-KIT | Validates via runtime-detection.vitest.ts (spec-kit test) |
| 7 | `256-budget-allocator.md` | SPEC-KIT | Test in spec-kit, impl in system-code-graph |
| 8 | `257-working-set-compaction.md` | SPEC-KIT | Validates via compact-merger.vitest.ts |
| 9 | `258-compact-merger-assembly.md` | SPEC-KIT | Validates merger via spec-kit tests |
| 10 | `261-mcp-auto-priming.md` | SPEC-KIT | Validates memory_stats MCP tool |
| 11 | `262-session-health.md` | SPEC-KIT | Validates session_health tool |
| 12 | `263-session-resume.md` | SPEC-KIT | Validates session_resume tool |
| 13 | `264-query-intent-routing.md` | **CROSS-REF** | Tests cross-skill boundary (spec-kit routes to code-graph) |
| 14 | `267-tool-routing-enforcement.md` | SPEC-KIT | Enforcement spec-kit owned |
| 15 | `270-resource-map-template.md` | SPEC-KIT | Template rollout spec-kit |
| 16 | `283-skill-graph-status.md` | **OWNERSHIP-skill-advisor** | Marked "Owned by: mk_skill_advisor" |
| 17 | `284-skill-graph-query.md` | **OWNERSHIP-skill-advisor** | Marked "Owned by: mk_skill_advisor" |
| 18 | `285-skill-graph-validate.md` | **OWNERSHIP-skill-advisor** | Marked "Owned by: mk_skill_advisor" |
| 19 | `286-coverage-graph-query.md` | SPEC-KIT | deep_loop_graph_query spec-kit owned |

**Summary:** 3 OWNERSHIP-skill-advisor, 1 CROSS-REF, 15 SPEC-KIT

### 2.3 Other feature_catalog files

| File | Class | Detail |
|------|-------|--------|
| `03--discovery/04-detect-changes-preflight.md` | **OWNERSHIP-code-graph** | All source files under system-code-graph/ (detect-changes.ts, diff-parser.ts, code-graph-db.ts) |
| `04--maintenance/03-doctor-router-and-manifest-dispatch.md` | CROSS-REF | Router maps to 7 subsystems; code-graph and skill-advisor are extracted skill entries |
| `feature_catalog.md` | CROSS-REF | Master catalog references system-code-graph and system-skill-advisor sibling skills for 013/014 surfaces |

### 2.4 Other manual_testing_playbook files

| File | Class | Detail |
|------|-------|--------|
| `06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` | **OWNERSHIP-code-graph** | All commands target system-code-graph MCP tools (code_graph_scan, code_graph_query) |
| `14--pipeline-architecture/271-code-graph-phase-dag-runner.md` | **OWNERSHIP-code-graph** | All source files under system-code-graph/mcp_server/ |
| `16--tooling-and-scripts/279-graph-degraded-stress-cell-isolation.md` | CROSS-REF | Runs spec-kit test against system-code-graph DB |

### 2.5 Top-level docs

| File | Ref Count | Classification | Key observation |
|------|-----------|----------------|-----------------|
| `SKILL.md` | 2 | CROSS-REF | Line 375: names system-code-graph as owning skill for code_graph_* tools |
| `README.md` | ~20 | CROSS-REF+SPEC-KIT | Lines 64,106,111,114,116 declare ownership boundaries for both extracted skills |
| `ARCHITECTURE.md` | **66** | CROSS-REF+SPEC-KIT | §5 SKILL-ADVISOR SUBSYSTEM + §6 CODE-GRAPH SUBSYSTEM. **Stale claim at line 461**: "neither skill-advisor nor code-graph ships a SKILL.md" — both do now (v3.4.1.0) |

### 2.6 MCP/reference docs

| File | Refs | Classification |
|------|------|----------------|
| `mcp_server/ENV_REFERENCE.md` | 11 | CROSS-REF: documents SPECKIT_CODE_GRAPH_INDEX_* env vars, SPECKIT_PARSER (tree-sitter-parser.ts in code-graph) |
| `references/config/hook_system.md` | 9 | CROSS-REF: line 134 explicitly declares code-graph ownership; lines 142-144 reference skill-advisor bridge |
| `references/config/environment_variables.md` | 3 | CROSS-REF: line 198 documents SPECKIT_CODE_GRAPH_DB_DIR |
| `references/memory/memory_system.md` | 6 | CROSS-REF: line 143 declares code-graph ownership |

### 2.7 Changelogs

| File | Approx Refs |
|------|-------------|
| `changelog/v3.4.1.0.md` | ~15 (code-graph parser fix, /doctor:code-graph, skill-advisor daemon) |
| `changelog/v3.4.0.0.md` | ~8 |
| `changelog/v3.3.0.0.md` | ~10 (024-compact-code-graph program, skill advisor 5-dim routing) |
| `changelog/v3.2.1.0.md` | ~5 |
| `changelog/v3.2.0.1.md` | ~3 |
| `changelog/v3.2.0.0.md` | ~8 |
| `changelog/v2.2.29.0.md` | ~3 |
| `changelog/v1.2.6.0.md` | ~2 |
| Other pre-3.x changelogs | ~3 |

**8 changelog files, ~57 total references to extracted skills.** These are historical record — should NOT be modified (they document when features were in spec-kit).

### 2.8 OWNERSHIP vs CROSS-REF summary table

| Category | OWNERSHIP-code-graph | OWNERSHIP-skill-advisor | CROSS-REF | SPEC-KIT | Total |
|----------|---------------------|------------------------|-----------|----------|-------|
| feature_catalog/22-- | 4 | 4 | 7 | 9 | 24 |
| playbook/22-- | 0 | 3 | 1 | 15 | 19 |
| Other feature_catalog | 1 | 0 | 2 | 0 | 3 |
| Other playbook | 2 | 0 | 1 | 0 | 3 |
| Top-level docs | 0 | 0 | 3 | 0 | 3 |
| MCP/reference docs | 0 | 0 | 4 | 0 | 4 |
| **TOTAL** | **7** | **7** | **18** | **24** | **56** |

**Actionable items require moving to extracted skills:**
- 7 feature_catalog files (4 code-graph + 3 skill-advisor) + 3 playbook files (all skill-advisor) = **10 files with OWNERSHIP residue** that should be MOVED to the owning skill's docs
- These 10 files explicitly state "Owned by: mk_code_index" or "Owned by: mk_skill_advisor" in their content

**Items that can stay in spec-kit with updated language:**
- 18 CROSS-REF entries — these document the boundary; acceptable if reworded to note the extracted skill owns the implementation
- 24 SPEC-KIT entries — already correctly owned

## Sources Consulted
- [SOURCE: file] All 24 `feature_catalog/22--*/` .md files
- [SOURCE: file] All 19 `manual_testing_playbook/22--*/` .md files
- [SOURCE: file] `feature_catalog/03--discovery/04-detect-changes-preflight.md`
- [SOURCE: file] `feature_catalog/04--maintenance/03-doctor-router-and-manifest-dispatch.md`
- [SOURCE: file] `feature_catalog/feature_catalog.md`
- [SOURCE: file] `manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md`
- [SOURCE: file] `manual_testing_playbook/14--pipeline-architecture/271-code-graph-phase-dag-runner.md`
- [SOURCE: file] `manual_testing_playbook/16--tooling-and-scripts/279-graph-degraded-stress-cell-isolation.md`
- [SOURCE: file] `SKILL.md:375`
- [SOURCE: file] `README.md:64,106,111,114,116`
- [SOURCE: file] `ARCHITECTURE.md:§5,§6,line 461`
- [SOURCE: file] `mcp_server/ENV_REFERENCE.md`
- [SOURCE: file] `references/config/hook_system.md:134`
- [SOURCE: file] `references/config/environment_variables.md:198`
- [SOURCE: file] `references/memory/memory_system.md:143`
- [SOURCE: file] `changelog/v3.4.1.0.md`, `v3.4.0.0.md`, `v3.3.0.0.md`

## Assessment
- **New information ratio: 0.70**
  - 2 fully new (complete OWNERSHIP-vs-CROSS-REF classification of all 56 doc files; actionable OWNERSHIP count: 10 files to move, 18 cross-refs to update)
  - 1 refinement (exact reference counts for changelogs: 8 files, ~57 refs; stale ARCHITECTURE.md claim at line 461)
  - 0 redundant
- **Questions addressed**: Q3 (doc/playbook/feature_catalog cross-references)
- **Questions answered**: Q3 (complete)

## Reflection
- **What worked**: The explore agent efficiently read all 24 feature_catalog and 19 playbook files, producing accurate classifications. The top-level doc analysis found a stale claim (ARCHITECTURE.md line 461 says extracted skills lack SKILL.md, but both have them now).
- **What did not work**: Changelog references are voluminous but should NOT be modified (historical record). This means "zero references" is unrealistic for changelogs — the strategy should exempt changelogs from the purity target.
- **What I would do differently**: Iter-3 should focus on test coupling (Q4) before starting strategy evaluation, since the full picture is needed for accurate cost estimates.

## Recommended Next Focus
Iter-3: Complete the test coupling map (Q4). Distinguish tests that should be MOVED to extracted skills (they test extracted code directly) from tests that should be CONVERTED (they test spec-kit's integration with extracted skills through the boundary) from tests that are LEGITIMATE in spec-kit (they mock the boundary).
