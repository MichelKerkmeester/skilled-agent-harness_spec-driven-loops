# Verification Checklist: 011 - Default-On Hardening Audit

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + checklist-extended | v2.2 -->

---

## TABLE OF CONTENTS
- [1. OVERVIEW](#1--overview)

## 1. OVERVIEW

This document tracks hardening verification checkpoints and evidence for Child 011 completion.

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR user-approved deferral |
| **[P2]** | Optional | Can defer with documented reason |

Evidence format: `[Evidence: command/file/result]`
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Scope frozen and documented in `spec.md` [Evidence: `spec.md` section 3]
- [x] CHK-002 [P0] Feature inventory matrix completed for specs 136/138/139 [Evidence: `spec.md` section 4]
- [x] CHK-003 [P0] Baseline findings recorded (typecheck + tests + gaps) [Evidence: `spec.md` section 5]
- [x] CHK-004 [P1] Mandatory verification command set documented exactly [Evidence: `spec.md` section 8, `plan.md` section 8]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Default-on behavior enforced (opt-out only `FLAG=false`) for covered features [Evidence: `mcp_server/lib/cognitive/rollout-policy.ts`, `mcp_server/lib/search/graph-flags.ts`, `mcp_server/lib/search/search-flags.ts`, `scripts/spec/recommend-level.sh`, `scripts/spec/validate.sh`, `npm run test --workspace=mcp_server -- tests/graph-flags.vitest.ts tests/search-flags.vitest.ts`]
- [x] CHK-011 [P0] `create.sh` append mode updates existing phase-map rows correctly [Evidence: `scripts/spec/create.sh`, `scripts/tests/test-phase-system.js` -> append row/handoff assertions PASS]
- [x] CHK-012 [P0] SGQS skill-root resolution fixed in both runtime and reindex script [Evidence: `mcp_server/context-server.ts`, `scripts/memory/reindex-embeddings.ts`, `npm run test --workspace=mcp_server -- tests/sgqs-query-handler.vitest.ts`]
- [x] CHK-013 [P0] Source/shared import boundaries clean (no TS6059/TS2307) [Evidence: `npm run typecheck` PASS; shared imports in `mcp_server/lib/search/skill-graph-cache.ts`, `mcp_server/lib/search/graph-search-fn.ts`, `scripts/memory/ast-parser.ts`]
- [x] CHK-014 [P1] Source-adjacent generated artifacts removed for migrated modules outside `dist` [Evidence: removed `scripts/sgqs/*.{js,d.ts,map}`, `scripts/lib/structure-aware-chunker*.{js,d.ts,map}`, `shared/{normalization,types}.{js,d.ts,map}`]
- [x] CHK-015 [P1] Semantic bridge + AST/chunker runtime contracts explicitly aligned (code + docs + tests) [Evidence: `mcp_server/handlers/memory-search.ts` deep bridge integration + `mcp_server/tests/deep-semantic-bridge-runtime.vitest.ts` PASS; chunker shared import in `scripts/memory/ast-parser.ts` + `mcp_server/tests/structure-aware-chunker.vitest.ts` PASS]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `node scripts/tests/test-phase-system.js` passes [Evidence: command PASS (27 passed, 0 failed)]
- [x] CHK-021 [P0] `node scripts/tests/test-phase-validation.js` passes [Evidence: command PASS (49 passed, 0 failed)]
- [x] CHK-022 [P0] `npm run test --workspace=mcp_server` passes [Evidence: command PASS (166 files, 4825 tests, 0 failed)]
- [x] CHK-023 [P0] `npm run typecheck` passes [Evidence: command PASS after shared build + strict checks]
- [x] CHK-024 [P0] `npm test` passes [Evidence: command PASS (`test:cli`, `test:embeddings`, `test:mcp`)]
- [x] CHK-025 [P1] `/spec_kit:phase` command-flow tests exist and pass [Evidence: `scripts/tests/test-phase-command-workflows.js` PASS]
- [x] CHK-026 [P1] `--phase-folder` path handling tests exist and pass [Evidence: `scripts/tests/test-phase-command-workflows.js` checks plan/research/implement/complete/resume docs + assets PASS]
- [x] CHK-027 [P1] SGQS handler runtime coverage exists and passes [Evidence: `mcp_server/tests/sgqs-query-handler.vitest.ts` PASS]
- [x] CHK-028 [P1] Deep-mode semantic bridge runtime decision is test-backed [Evidence: `mcp_server/tests/deep-semantic-bridge-runtime.vitest.ts` PASS]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security / Safety

- [x] CHK-030 [P0] Hardening changes introduce no path traversal regressions [Evidence: `npm run test --workspace=mcp_server` includes `tests/unit-path-security.vitest.ts` PASS]
- [x] CHK-031 [P1] Flag default-on change reviewed for unintended exposure risk [Evidence: explicit opt-out retained (`FLAG=false`) in `rollout-policy.ts`, `recommend-level.sh` (`--no-recommend-phases`), `validate.sh` (`--no-recursive`)]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md` synchronized with final implementation state [Evidence: current file updates in child 011 folder]
- [x] CHK-041 [P1] Baseline findings updated to final post-fix state [Evidence: `spec.md` section 5 post-fix verification note + passing gate commands]
- [x] CHK-042 [P1] Frozen scope and out-of-scope boundaries unchanged without approval [Evidence: scope in `spec.md` section 3 preserved]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Shared SGQS/chunker workspace placement consumed by both scripts and MCP server [Evidence: shared modules under `shared/sgqs` + `shared/lib/structure-aware-chunker.ts`; consumers in `scripts/sgqs/*.ts`, `scripts/memory/ast-parser.ts`, `mcp_server/lib/search/*.ts`]
- [x] CHK-101 [P1] Runtime claims match executable code paths (no dead feature claims) [Evidence: semantic bridge wired in `mcp_server/handlers/memory-search.ts`; SGQS runtime tests in `mcp_server/tests/sgqs-query-handler.vitest.ts`]
- [x] CHK-102 [P1] Import graph free of cross-rootDir leakage for migrated modules [Evidence: `npm run typecheck` PASS]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback path documented for default-on behavior changes [Evidence: `plan.md` section 7]
- [x] CHK-121 [P0] Final verification command suite recorded with pass output snippets [Evidence: this checklist testing section + `plan.md` section 8]
- [x] CHK-122 [P1] Known flaky/slow tests stabilized or documented with accepted mitigation [Evidence: repeated `npm run test --workspace=mcp_server` and `npm test` runs passed; spec126 intent misclassification fixed in `mcp_server/lib/search/intent-classifier.ts`]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:verification-commands -->
## Verification Commands (Must Execute)

```bash
node scripts/tests/test-phase-system.js
node scripts/tests/test-phase-validation.js
npm run test --workspace=mcp_server
npm run typecheck
npm test
```
<!-- /ANCHOR:verification-commands -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | [x]/16 |
| P1 Items | 12 | [x]/12 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-02-21
**Current Status**: Completed
<!-- /ANCHOR:summary -->
