---
title: "Tasks: 011 - Default-On Hardening Audit [011-default-on-hardening-audit/tasks]"
description: "This document tracks execution tasks and completion criteria for Child 011 hardening."
trigger_phrases:
  - "tasks"
  - "011"
  - "default"
  - "hardening"
  - "audit"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 011 - Default-On Hardening Audit

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## TABLE OF CONTENTS
- [1. OVERVIEW](#1--overview)

## 1. OVERVIEW

This document tracks execution tasks and completion criteria for Child 011 hardening.

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Default-On Contract + Baseline Lock

- [x] T001 Document and freeze baseline failure evidence in spec/checklist (`specs/003-system-spec-kit/138-hybrid-rag-fusion/011-default-on-hardening-audit/*.md`)
- [x] T002 Define target default-on flag matrix for 136/138/139 features (`mcp_server/lib/search/graph-flags.ts`, `mcp_server/lib/search/search-flags.ts`, `mcp_server/lib/cognitive/rollout-policy.ts`)
- [x] T003 Implement/normalize default-on behavior (opt-out only on explicit `FLAG=false`) in covered flag reads (`mcp_server/lib/search/graph-flags.ts`, `mcp_server/lib/search/search-flags.ts`, related callers)
- [x] T004 [P] Add/adjust tests for unset/empty/true/false semantics (`mcp_server/tests/graph-flags.vitest.ts`, `mcp_server/tests/search-flags.vitest.ts`)
- [x] T005 Re-run targeted flag tests and record evidence (`npm run test --workspace=mcp_server -- tests/graph-flags.vitest.ts tests/search-flags.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Known Defect Fixes

- [x] T010 Fix append-mode phase map update so parent map rows/handoffs are updated for newly appended phases (`scripts/spec/create.sh`)
- [x] T011 [P] Extend append-mode tests to assert row updates, not only no-duplication (`scripts/tests/test-phase-system.js`, `scripts/tests/test-phase-validation.js`)
- [x] T012 Fix SGQS skill-root resolution in server initialization path (`mcp_server/context-server.ts`)
- [x] T013 Fix SGQS skill-root resolution in reindex script path (`scripts/memory/reindex-embeddings.ts`)
- [x] T014 [P] Add regression tests for root resolution from different working directories (`mcp_server/tests/graph-search-fn.vitest.ts` and/or script tests)
- [x] T015 Run phase script suites and capture evidence (`node scripts/tests/test-phase-system.js`, `node scripts/tests/test-phase-validation.js`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Runtime Gap Closure

- [x] T020 Wire semantic bridge expansion into deep-mode runtime path or explicitly de-scope runtime claims (`mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/query-expander.ts`)
- [x] T021 Add runtime deep-search test proving semantic bridge behavior decision (`mcp_server/tests/handler-memory-search.vitest.ts` and/or integration suite)
- [x] T022 Add SGQS handler runtime coverage (`mcp_server/handlers/sgqs-query.ts`, new/existing `mcp_server/tests/*sgqs*.vitest.ts`)
- [x] T023 Resolve AST/chunker ambiguity by explicit runtime integration or explicit non-runtime scoping (`scripts/lib/structure-aware-chunker.ts`, related callers/docs/tests)
- [x] T024 Align tests with chosen AST/chunker contract (`mcp_server/tests/structure-aware-chunker.vitest.ts`, related integration tests)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Reorganization and Boundary Cleanup

- [x] T030 Move phase dataset generator under test fixture tooling (`scripts/evals/generate-phase1-5-dataset.ts` -> `scripts/tests/fixtures` or sibling fixture-generator folder)
- [x] T031 Move SGQS shared builder/types to shared workspace location consumed by scripts and MCP server (`scripts/sgqs/*` -> shared workspace module)
- [x] T032 Move structure-aware chunker to shared workspace location consumed by scripts and MCP server (`scripts/lib/structure-aware-chunker.ts` -> shared workspace module)
- [x] T033 Update all import paths to new shared module locations (`mcp_server/lib/search/skill-graph-cache.ts`, `mcp_server/lib/search/graph-search-fn.ts`, `mcp_server/tests/*`, `scripts/*`)
- [x] T034 Remove source-adjacent generated artifacts for migrated modules outside `dist` (`scripts/sgqs/*.{js,d.ts,map}`, `scripts/lib/structure-aware-chunker*.{js,d.ts,map}`, related migrated artifacts)
- [x] T035 [P] Validate no TS6059/TS2307 regressions remain after module moves (`npm run typecheck`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Tests and Typecheck Closure

- [x] T040 Fix strict typing failures in `mcp_server/handlers/memory-search.ts`
- [x] T041 Fix strict typing failures in `mcp_server/lib/search/hybrid-search.ts`
- [x] T042 Fix strict typing failures in `mcp_server/lib/storage/schema-downgrade.ts`
- [x] T043 Fix strict typing failures in test files (`mcp_server/tests/adaptive-fallback.vitest.ts`, `mcp_server/tests/fsrs-scheduler.vitest.ts`, `mcp_server/tests/unit-rrf-fusion.vitest.ts`, `mcp_server/tests/regression-010-index-large-files.vitest.ts`)
- [x] T044 Fix SGQS test import path/type issues (`mcp_server/tests/graph-search-fn.vitest.ts`, shared SGQS types location)
- [x] T045 Add missing `/spec_kit:phase` command-flow tests (`scripts/tests` command-flow suite)
- [x] T046 Add missing `--phase-folder` path handling tests across plan/research/implement/complete/resume flows (`scripts/tests` command-flow suite)
- [x] T047 Stabilize currently failing MCP tests (`mcp_server/tests/memory-save-extended.vitest.ts`, `mcp_server/tests/spec126-full-spec-doc-indexing.vitest.ts`)
- [x] T048 Execute mandatory verification commands and collect evidence (`node scripts/tests/test-phase-system.js`, `node scripts/tests/test-phase-validation.js`, `npm run test --workspace=mcp_server`, `npm run typecheck`, `npm test`)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks complete
- [x] All P1 tasks complete or explicitly deferred by user
- [x] All mandatory verification commands pass
- [x] `checklist.md` evidence fields populated
- [x] No blocked tasks remain
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
