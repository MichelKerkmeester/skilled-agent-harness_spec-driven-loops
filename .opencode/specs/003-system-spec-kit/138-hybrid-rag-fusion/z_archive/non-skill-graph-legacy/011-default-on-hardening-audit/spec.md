<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: 011 - Default-On Hardening Audit (Specs 136/138/139)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## TABLE OF CONTENTS
- [1. OVERVIEW](#1--overview)

## 1. OVERVIEW

This document defines scope, requirements, and verification criteria for Child 011 hardening work.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This spec hardens the shipped implementations from specs 136, 138, and 139 so runtime behavior is stable, type-safe, and default-on by policy. The effort closes known defects (phase append map updates and SGQS skill-root resolution), removes dead-code drift, tightens shared-module boundaries, and restores full `npm run typecheck` compliance.

**Key Decisions**: default-on flags across covered features (only explicit `FLAG=false` opts out); shared SGQS and chunker modules moved to a workspace-shared runtime-safe location consumed by both `scripts` and `mcp_server`.

**Critical Dependencies**: existing implementations and tests in `.opencode/skill/system-spec-kit`; stable command behavior for `/spec_kit:phase` and `--phase-folder` paths.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 011 |
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-02-21 |
| **Branch** | `138-hybrid-rag-fusion` |
| **Parent** | `../spec.md` |
| **Hardening Targets** | 136, 138, 139 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Specs 136/138/139 delivered major capabilities, but the current codebase still has cross-boundary type/import failures, runtime-path inconsistencies, partial runtime integration for some graph/query features, and missing command-flow coverage. Current baseline on 2026-02-21: `npm run typecheck` fails, `npm run test --workspace=mcp_server` fails, and `npm test` fails.

### Purpose

Complete a full hardening pass so the 136/138/139 feature surface is default-on, runtime-coherent, test-covered on critical flows, and passing `typecheck` and test gates end-to-end.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. FROZEN SCOPE

### In Scope (Frozen)

- Enforce default-on behavior for covered feature flags; only explicit `FLAG=false` disables behavior.
- Fix known defects:
  - `scripts/spec/create.sh` phase append mode must update existing phase map rows, not only avoid duplicate map sections.
  - SGQS skill-root resolution in:
    - `mcp_server/context-server.ts`
    - `scripts/memory/reindex-embeddings.ts`
- Close dead-code gaps:
  - Wire semantic bridge expansion into runtime deep search path or explicitly scope it non-runtime and remove runtime claims.
  - Add SGQS handler runtime coverage (`handlers/sgqs-query.ts` path).
  - Resolve AST/chunker ambiguity by either runtime integration or explicit non-runtime scoping with docs/tests aligned.
- Moderate script reorganization:
  - Move `scripts/evals/generate-phase1-5-dataset.ts` under `scripts/tests/fixtures` (or sibling fixture-generator folder).
  - Move SGQS shared builder/types and structure-aware chunker to a shared workspace module consumed by both `scripts` and `mcp_server`.
  - Remove source-adjacent generated artifacts (`.js`, `.d.ts`, `.map`) outside `dist` for migrated modules.
- Add missing tests for `/spec_kit:phase` command flows and `--phase-folder` handling.
- Resolve all current `npm run typecheck` failures in system-spec-kit.

### Out of Scope

- New capabilities beyond 136/138/139 feature sets.
- Schema redesigns unrelated to hardening fixes.
- Feature additions in unrelated skills or non-system-spec-kit domains.
- Performance optimization work outside regressions introduced by this scope.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:inventory -->
## 4. FEATURE INVENTORY MATRIX (136/138/139)

| Source | Feature | Canonical Code Paths | Required Tests |
|--------|---------|----------------------|----------------|
| 136 | After-tool callback pipeline | `mcp_server/context-server.ts`, `mcp_server/lib/extraction/extraction-adapter.ts` | `mcp_server/tests/context-server.vitest.ts`, `mcp_server/tests/extraction-adapter.vitest.ts` |
| 136 | Token pressure policy (`tokenUsage` + overrides) | `mcp_server/tool-schemas.ts`, `mcp_server/handlers/memory-context.ts`, `mcp_server/lib/cognitive/pressure-monitor.ts` | `mcp_server/tests/handler-memory-context.vitest.ts`, `mcp_server/tests/pressure-monitor.vitest.ts` |
| 136 | Session boost post-search | `mcp_server/lib/search/session-boost.ts`, `mcp_server/handlers/memory-search.ts` | `mcp_server/tests/session-boost.vitest.ts`, `mcp_server/tests/handler-memory-search.vitest.ts` |
| 136 | Event-based working-memory decay | `mcp_server/lib/cognitive/working-memory.ts` | `mcp_server/tests/working-memory-event-decay.vitest.ts` |
| 136 | Extraction rules + provenance writes | `mcp_server/lib/extraction/extraction-adapter.ts`, `mcp_server/lib/cognitive/working-memory.ts` | `mcp_server/tests/extraction-adapter.vitest.ts`, `mcp_server/tests/phase2-integration.vitest.ts` |
| 136 | Redaction gate | `mcp_server/lib/extraction/redaction-gate.ts` | `mcp_server/tests/redaction-gate.vitest.ts` |
| 136 | Causal boost traversal | `mcp_server/lib/search/causal-boost.ts`, `mcp_server/handlers/memory-search.ts` | `mcp_server/tests/causal-boost.vitest.ts`, `mcp_server/tests/phase2-integration.vitest.ts` |
| 136 | Session lifecycle/resume semantics | `mcp_server/handlers/memory-context.ts`, `mcp_server/lib/cognitive/working-memory.ts` | `mcp_server/tests/session-lifecycle.vitest.ts`, `mcp_server/tests/handler-memory-context.vitest.ts` |
| 136 | Post-render quality validator | `scripts/memory/validate-memory-quality.ts`, `scripts/memory/generate-context.ts` | `scripts/tests/test-memory-quality-lane.js` |
| 136 | Contamination filter | `scripts/extractors/contamination-filter.ts` | `scripts/tests/test-memory-quality-lane.js` |
| 136 | Decision extractor hardening | `scripts/extractors/decision-extractor.ts`, `templates/context_template.md` | `scripts/tests/test-memory-quality-lane.js` |
| 136 | Quality score + retrieval filter | `scripts/extractors/quality-scorer.ts`, `mcp_server/handlers/memory-search.ts` | `mcp_server/tests/memory-search-quality-filter.vitest.ts`, `scripts/tests/test-memory-quality-lane.js` |
| 138 | Hybrid search orchestration + graph channel | `mcp_server/lib/search/hybrid-search.ts` | `mcp_server/tests/hybrid-search.vitest.ts`, `mcp_server/tests/integration-138-pipeline.vitest.ts` |
| 138 | MMR diversity reranker | `mcp_server/lib/search/mmr-reranker.ts` | `mcp_server/tests/mmr-reranker.vitest.ts` |
| 138 | TRM/evidence-gap gating | `mcp_server/lib/search/evidence-gap-detector.ts` | `mcp_server/tests/evidence-gap-detector.vitest.ts` |
| 138 | Weighted FTS5 BM25 | `mcp_server/lib/search/sqlite-fts.ts`, `mcp_server/lib/search/hybrid-search.ts` | `mcp_server/tests/sqlite-fts.vitest.ts` |
| 138 | Deep-mode multi-query expansion | `mcp_server/lib/search/query-expander.ts`, `mcp_server/handlers/memory-search.ts` | `mcp_server/tests/query-expander.vitest.ts`, `mcp_server/tests/handler-memory-search.vitest.ts` |
| 138 | Semantic bridge expansion | `mcp_server/lib/search/query-expander.ts`, `mcp_server/handlers/memory-search.ts` | `mcp_server/tests/semantic-bridge.vitest.ts`, `mcp_server/tests/deep-semantic-bridge-runtime.vitest.ts` |
| 138 | Unified graph adapter (causal + SGQS) | `mcp_server/lib/search/graph-search-fn.ts`, `mcp_server/lib/search/skill-graph-cache.ts` | `mcp_server/tests/graph-search-fn.vitest.ts`, `mcp_server/tests/graph-channel-benchmark.vitest.ts` |
| 138 | SGQS query handler runtime path | `mcp_server/handlers/sgqs-query.ts` | `mcp_server/tests/sgqs-query-handler.vitest.ts` |
| 138 | AST/structure-aware chunker | `shared/lib/structure-aware-chunker.ts`, `scripts/memory/ast-parser.ts` | `mcp_server/tests/structure-aware-chunker.vitest.ts` |
| 138 | Authority/PageRank scoring | `mcp_server/lib/manage/pagerank.ts`, `mcp_server/lib/search/graph-search-fn.ts` | `mcp_server/tests/pagerank.vitest.ts`, `mcp_server/tests/graph-channel-benchmark.vitest.ts` |
| 139 | Phase recommendation scoring | `scripts/spec/recommend-level.sh` | `scripts/tests/test-phase-system.js`, `scripts/tests/test-phase-validation.js` |
| 139 | Phase creation (`--phase`, `--phases`, `--phase-names`) | `scripts/spec/create.sh`, `templates/addendum/phase/*` | `scripts/tests/test-phase-system.js`, `scripts/tests/test-phase-validation.js` |
| 139 | Parent append map behavior | `scripts/spec/create.sh` | `scripts/tests/test-phase-system.js` (append row/handoff assertions) |
| 139 | `/spec_kit:phase` command workflow | `.opencode/command/spec_kit/phase.md`, `.opencode/command/spec_kit/assets/spec_kit_phase_*.yaml` | `scripts/tests/test-phase-command-workflows.js` |
| 139 | `--phase-folder` path handling across commands | `.opencode/command/spec_kit/{plan,research,implement,complete,resume}.md` | `scripts/tests/test-phase-command-workflows.js` |
| 139 | Recursive phase validation + phase-link rule | `scripts/spec/validate.sh`, `scripts/rules/check-phase-links.sh` | `scripts/tests/test-phase-validation.js` |
<!-- /ANCHOR:inventory -->

---

<!-- ANCHOR:baseline -->
## 5. BASELINE FINDINGS (2026-02-21)

### 5.1 Typecheck Failure Categories (`npm run typecheck`)

| Category | Representative Files | Notes |
|----------|----------------------|-------|
| Null/undefined strictness | `mcp_server/handlers/memory-search.ts`, `mcp_server/tests/unit-rrf-fusion.vitest.ts`, `mcp_server/tests/regression-010-index-large-files.vitest.ts` | `TS2345`, `TS18048` |
| Type incompatibility / unsafe casts | `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/storage/schema-downgrade.ts` | `TS2322`, `TS2352`, `TS2345`, `TS2484` |
| Cross-root module boundary violations | `mcp_server/lib/search/skill-graph-cache.ts`, `mcp_server/tests/structure-aware-chunker.vitest.ts`, `scripts/sgqs/graph-builder.ts` | `TS6059` rootDir leaks between `mcp_server` and `scripts` |
| Missing SGQS type module resolution | `mcp_server/tests/graph-search-fn.vitest.ts` | `TS2307` bad SGQS type import path |
| Test typing/mocking strictness | `mcp_server/tests/adaptive-fallback.vitest.ts`, `mcp_server/tests/fsrs-scheduler.vitest.ts` | `TS2345`, `TS7053` |

### 5.2 Test Baseline

| Command | Current Result |
|---------|----------------|
| `node scripts/tests/test-phase-system.js` | PASS (24 passed, 0 failed) |
| `node scripts/tests/test-phase-validation.js` | PASS (41 passed, 0 failed) |
| `npm run test --workspace=mcp_server` | FAIL (2 failed tests: timeout in `memory-save-extended.vitest.ts`, intent mismatch in `spec126-full-spec-doc-indexing.vitest.ts`) |
| `npm run typecheck` | FAIL (multi-category TypeScript errors listed above) |
| `npm test` | FAIL (propagates `test:mcp` failures) |

### 5.3 Known Test Gaps

- No command-flow suite currently validates `/spec_kit:phase` end-to-end behavior.
- No current automated coverage for `--phase-folder` path routing across command docs/flows.
- No runtime coverage for `handlers/sgqs-query.ts` execution path.
- Semantic bridge expansion has unit tests but no runtime deep-search integration test.
- `create.sh` append-mode tests assert "no duplicate phase-map section" but not "existing phase-map rows updated/appended correctly".

### 5.4 Post-Fix Verification State (2026-02-21)

| Command | Final Result |
|---------|--------------|
| `node scripts/tests/test-phase-system.js` | PASS (27 passed, 0 failed) |
| `node scripts/tests/test-phase-validation.js` | PASS (49 passed, 0 failed) |
| `node scripts/tests/test-phase-command-workflows.js` | PASS (40 passed, 0 failed) |
| `npm run test --workspace=mcp_server` | PASS (166 files, 4825 tests, 0 failed) |
| `npm run typecheck` | PASS |
| `npm test` | PASS |

Gap closure outcomes:
- `/spec_kit:phase` and `--phase-folder` command-flow coverage added.
- SGQS query runtime handler coverage added.
- Deep-mode semantic bridge runtime wiring now has dedicated tests.
- Shared SGQS/chunker placement and import boundaries verified type-safe.
<!-- /ANCHOR:baseline -->

---

<!-- ANCHOR:requirements -->
## 6. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Enforce default-on behavior for hardening target flags | Covered flags enabled when unset/empty/`true`; only explicit `false` disables |
| REQ-002 | Fix phase append map update behavior | Appending phases updates parent phase map rows and handoff rows without duplication drift |
| REQ-003 | Fix SGQS skill-root resolution | Unified graph/SGQS works from both server runtime and reindex script runtime |
| REQ-004 | Resolve SGQS/chunker/shared boundary type issues | No cross-root TS6059/TS2307 import failures remain |
| REQ-005 | Resolve all current `npm run typecheck` failures | `npm run typecheck` exits 0 |
| REQ-006 | Restore green MCP test gate | `npm run test --workspace=mcp_server` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Close semantic-bridge runtime gap | Runtime deep-search path either uses bridge expansion with tests, or feature is explicitly non-runtime-scoped with tests/docs aligned |
| REQ-008 | Add SGQS handler runtime tests | Dedicated tests exercise `handlers/sgqs-query.ts` success/failure paths |
| REQ-009 | Resolve AST/chunker ambiguity | Chunker is either runtime-integrated with explicit contracts or moved to explicit non-runtime fixture scope |
| REQ-010 | Reorganize scripts/shared placement | Dataset generator and SGQS/chunker shared modules moved to stable shared locations consumed by both scripts and MCP server |
| REQ-011 | Remove source-adjacent generated artifacts outside dist | No generated `.js/.d.ts/.map` remain for migrated modules outside `dist` |
| REQ-012 | Add phase command/path coverage | `/spec_kit:phase` and `--phase-folder` flows covered by automated tests |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

- **SC-001**: `npm run typecheck` passes with zero errors.
- **SC-002**: `npm run test --workspace=mcp_server` passes.
- **SC-003**: `npm test` passes.
- **SC-004**: Phase append behavior preserves a single map section and correctly appends new rows.
- **SC-005**: SGQS skill-root resolution is deterministic across server startup and reindex tooling.
- **SC-006**: No dead-code/runtime-claim mismatch remains for semantic bridge and chunker features.
- **SC-007**: Missing command-flow and SGQS-handler gaps are covered by tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:verification -->
## 8. VERIFICATION COMMANDS (MANDATORY)

```bash
node scripts/tests/test-phase-system.js
node scripts/tests/test-phase-validation.js
npm run test --workspace=mcp_server
npm run typecheck
npm test
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default-on regression risk | Behavioral change for users relying on implicit off | Roll out with explicit test matrix for unset/empty/true/false env values |
| Risk | Shared module move breaks imports | Runtime/type failures across scripts/server | Move with staged alias compatibility and update all imports in one change set |
| Risk | Performance-threshold test flakiness | Intermittent CI failures | Stabilize benchmark thresholds or isolate perf assertions from correctness suite |
| Dependency | Existing SGQS and phase fixtures | Required for non-regression proof | Extend existing `test-phase-*` suites and MCP Vitest suites |
<!-- /ANCHOR:risks -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
