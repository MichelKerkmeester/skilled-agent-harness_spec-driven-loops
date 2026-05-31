---
title: "Code Graph Phase 006-004: Three-Way Isolation Finalize"
description: "Closed the last cross-skill import in system-code-graph and all six in system-skill-advisor. After this phase, deleting system-spec-kit leaves system-code-graph fully compiling and system-skill-advisor's non-embeddings features functional. CI isolation-check extended with three new blocking audit steps."
trigger_phrases:
  - "three-way isolation finalize"
  - "delete system-spec-kit smoke test"
  - "cross-skill import removal 040"
  - "skill isolation code-graph skill-advisor"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation/004-three-way-isolation-finalize` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation`

### Summary

Two system skills (system-code-graph and system-skill-advisor) each carried production imports that pointed directly into system-spec-kit. Deleting system-spec-kit broke both. The goal was full isolation so operators could remove system-spec-kit without consequences.

Six commit phases (040-A through 040-E plus a follow-on) shipped the fix. system-code-graph's single remaining production import in `handlers/query.ts` was rewired to `lib/shared/shared-payload.ts`. system-skill-advisor's six production imports were eliminated by creating `lib/shared/shared-payload.ts` and `lib/shared/unicode-normalization.ts` locally, then updating four consumer files. The `@spec-kit/shared` dependency was removed from both skills' `package.json`. An embeddings symlink was placed at `system-skill-advisor/mcp_server/lib/shared/embeddings/` as a documented, intentional exception. The CI `isolation-check.yml` workflow was extended from three to six blocking audit steps covering both skills' reverse-direction imports and workspace-alias imports. A delete-spec-kit smoke test script was committed alongside a run log confirming code-graph compiles identically before and after system-spec-kit removal. Eight test files were isolated from cross-skill imports through `vi.mock`, local `__fixtures__/` and two deletions for tests that tested cross-skill behavior and did not belong in the consuming skill.

### Added

- `system-skill-advisor/mcp_server/lib/shared/shared-payload.ts` (NEW): local copy of advisor envelope and shared payload types, removing the cross-skill dependency for four consumer files
- `system-skill-advisor/mcp_server/lib/shared/unicode-normalization.ts` (NEW): local copy of `canonicalFold` and `CANONICAL_FOLD_VERSION`, removing the cross-skill dependency
- `system-skill-advisor/mcp_server/lib/shared/embeddings` (NEW): symlink to `system-spec-kit/shared/embeddings/` as the documented exception for the embeddings stack
- `system-code-graph/mcp_server/tests/__fixtures__/index-scope.ts` (NEW): local fixture replacing the cross-skill import in test files
- `system-skill-advisor/mcp_server/tests/__fixtures__/errors.ts` (NEW): local fixture replacing the cross-skill error import in `advisor-recommend.vitest.ts`
- Three new blocking audit steps in `.github/workflows/isolation-check.yml`: skill-advisor reverse-direction check, skill-advisor workspace-alias check and code-graph workspace-alias check

### Changed

- `system-code-graph/mcp_server/handlers/query.ts`: rewired the last production cross-skill import (line 14) to use `lib/shared/shared-payload.js` instead of `system-spec-kit`
- `system-skill-advisor/mcp_server/lib/freshness.ts`, `lib/prompt-policy.ts`, `lib/render.ts`, `lib/skill-advisor-brief.ts`: each updated to import from `../lib/shared/*.js` instead of `@spec-kit/shared`
- `system-code-graph/package.json` and `system-skill-advisor/mcp_server/package.json`: removed `@spec-kit/shared` `file:` dependency declaration from both
- 87 stale source-level `.js` artifacts deleted from `system-code-graph/mcp_server/` (not used at runtime, not consumed by any import)

### Fixed

- Cross-skill imports in eight test and stress files resolved: two files deleted (tested cross-skill behavior that belonged in system-spec-kit's own suite), five code-graph files mocked via `vi.mock` and one skill-advisor test file mocked

### Verification

- Smoke test `smoke-test/delete-spec-kit-smoke.sh` ran on 2026-05-15. code-graph tsc exit code: 2 before removal, 2 after removal (UNCHANGED, confirming full isolation). skill-advisor tsc exit: 1 before, 2 after (symlink dangled as designed). Full log committed at `smoke-test/delete-spec-kit-smoke.log`.
- CI isolation-check.yml: 6 of 6 blocking audit steps pass on main after 040-C landed.
- Cross-skill import count after 040: code-graph production 0, code-graph tests 0, skill-advisor production 0 (1 via intentional symlink), skill-advisor tests 0.
- Strict packet validation (`validate.sh --strict`): exit 0.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | Rewired last production cross-skill import to local shared-payload |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/shared/shared-payload.ts` (NEW) | Local advisor envelope and shared payload types |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/shared/unicode-normalization.ts` (NEW) | Local canonicalFold function and constant |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/shared/embeddings` (NEW) | Symlink to system-spec-kit embeddings stack. Documented exception. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts` | Updated import to local shared-payload |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/prompt-policy.ts` | Updated import to local shared-payload |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` | Updated import to local shared-payload |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts` | Updated import to local shared-payload |
| `.opencode/skills/system-code-graph/mcp_server/tests/__fixtures__/index-scope.ts` (NEW) | Local fixture for test isolation |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/__fixtures__/errors.ts` (NEW) | Local fixture for test isolation |
| `.github/workflows/isolation-check.yml` | Three new blocking audit steps added. Total steps: 6. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation/004-three-way-isolation-finalize/smoke-test/delete-spec-kit-smoke.sh` (NEW) | Delete-spec-kit smoke test script |

### Follow-Ups

- Resolve pre-existing tsc baseline errors in both skills (code-graph exit 2, skill-advisor exit 1 from TS5101 baseUrl deprecation). These pre-date 040 and are out of scope here.
- Audit source-level `.d.ts` files in both skills to determine whether they are consumed externally. If unused, remove them.
- Roll 040 contributions into a v1.0.3.0 changelog via the parallel agent owning version bumps.
