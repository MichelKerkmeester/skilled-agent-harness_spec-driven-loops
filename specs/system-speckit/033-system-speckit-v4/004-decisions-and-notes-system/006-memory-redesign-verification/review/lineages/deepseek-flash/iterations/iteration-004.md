---
title: "Iteration 4: D2 Security — Input validation, path handling, secrets, boundaries"
trigger_phrases: []
---
# Iteration 4: D2 Security — Input validation, path handling, secrets, boundaries

## Focus
Security review of the deprecation-adjacent surfaces: path validation (`utils/validators.ts:createFilePathValidator`, `core/index.ts:ALLOWED_BASE_PATHS`, canonical-path resolution in `handlers/memory-save.ts`), bulk-delete safety gates, tenant boundaries in search, embedder key handling, strict-schema posture (`tool-schemas.ts:79`).

## Scorecard
- Dimensions covered: security
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.05

## Findings

### P2, Suggestion
- **F004**: `memory_index` tool exposes `excludePatterns` as raw user regexes applied to folder paths (`tool-schemas.ts:420`) without a documented complexity/time bound — ReDoS exposure is low-severity for a local-first MCP but unbounded. Also `specFolder` filters rely on canonical-path discipline rather than an explicit traversal guard in the search path (`handlers/memory-search.ts:673-675`, `lib/search/community-search.ts:295`) — acceptable today, worth a comment. [Evidence: tool-schemas.ts:420-423; memory-search.ts:673-675]
  - Dimension: security

## Confirmed-Good Checks (negative evidence)
- `createFilePathValidator` (`utils/validators.ts:115`) + `ALLOWED_BASE_PATHS` (`core/index.ts:31`) — file-path allow-list enforced in save/index handlers.
- `memory-save.ts:467,575` resolves canonical paths before persistence; spec-folder host-doc resolution is normalize-based (`memory-save.ts:1326-1341`).
- Bulk delete requires `confirm: true` (`memory-bulk-delete.ts:115-117`) and refuses critical-tier deletion without explicit `specFolder` scope (`memory-bulk-delete.ts:119-120`).
- Tenant filtering applied in search channels (`community-search.ts:295`, `memory-summaries.ts:299,380,460`).
- No API-key logging sites found in `lib/`; `hf-local.ts` contains no key material/logging.
- Default schema posture is strict: `ALLOW_UNKNOWN_PARAMETERS = (SPECKIT_STRICT_SCHEMAS === 'false')` (`tool-schemas.ts:79`) → `additionalProperties: false` by default.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | Security surface healthy; no deprecation-related security regressions found | F004 new P2 |

## Assessment
- New findings ratio: 0.05
- Dimensions addressed: security (D2 covered)
- Novelty justification: F004 is a hardening suggestion, not a regression.

## Ruled Out
- Path traversal via memory_save filePath: ruled out — canonical path + allow-list validation present.
- Unauthenticated bulk delete: ruled out — confirm gate + critical-tier scope guard.

## Dead Ends
- API key logging audit: no logging sites found; embedder keys not referenced in hf-local provider (env-based).

## Recommended Next Focus
Iteration 5 — D3 Traceability (spec_code core protocol): 003 REQ-001..005, 004 REQ-001..004, 006 REQ-001..005 vs shipped evidence; repo-wide constitutional reference census; constitutional/ dir presence vs 004 REQ-003.

Review verdict: PASS
