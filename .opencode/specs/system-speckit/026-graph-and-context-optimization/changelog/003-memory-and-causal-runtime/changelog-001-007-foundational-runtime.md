---
title: "Foundational Runtime Remediation: H-56-1 Canonical Save Metadata Fix and 27-Task Hardening Pass"
description: "Phase 017 closed 27 tasks across 4 waves: the H-56-1 canonical-save metadata no-op, code-graph sibling readiness propagation, Copilot compact-cache parity, NFKC unicode normalization, session-resume auth binding, retry-exhaustion budget and seven P2 maintainability extractions. Verdict transitions from CONDITIONAL to PASS."
trigger_phrases:
  - "H-56-1 canonical save metadata fix"
  - "foundational runtime phase 017 remediation"
  - "copilot compact-cache trustState parity"
  - "code-graph readiness-contract propagation"
  - "session-resume AsyncLocalStorage auth binding"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-17

> Spec folder: `026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/007-foundational-runtime` (Level 2)
> Parent packet: `026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

The default `/memory:save` canonical-save path had shipped with `workflow.ts:1259` hardcoding `ctxFileWritten = false`, making the 70-LOC `description.json` tracking block unreachable dead code. Combined with a `plannerMode === 'full-auto'` gate on `refreshGraphMetadata`, every `/memory:save` invocation produced zero metadata writes. All 16 sibling spec folders under the 026 tree had stale `description.json.lastUpdated` values as a deterministic result, not drift.

A 7-iteration deep-review (verdict CONDITIONAL, 10 P1 plus 18 P2 findings) and a subsequent 7-iteration Opus meta-research pass (14 new findings, 3 compound hypotheses confirmed) produced a 27-task consolidated backlog across 5 clusters (A scope normalization, B canonical-save hygiene, C NFKC sanitization, D code-graph sibling asymmetry, E Copilot observability gap).

Phase 017 shipped 25 commits across 4 waves on 2026-04-17. The H-56-1 `workflow.ts` 2-line fix cascaded a 38-folder `lastUpdated` refresh. Four architectural primitives landed: canonical-save metadata writer, code-graph `readiness-contract.ts`, MCP `caller-context.ts` via AsyncLocalStorage and `retry-budget.ts` for `partial_causal_link_unresolved`. All 27 tasks closed. Verdict transitions from CONDITIONAL to PASS with `hasAdvisories=true` for 8 plus 3 P2 parking-lot items deferred to Phase 019.

### Added

- `mcp_server/lib/code-graph/readiness-contract.ts` (NEW): 4 helpers extracted from `query.ts` and propagated to 5 sibling handlers (`scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts`)
- `mcp_server/lib/context/caller-context.ts` (NEW): `runWithCallerContext` via AsyncLocalStorage giving every MCP handler zero-churn caller identity
- `mcp_server/lib/enrichment/retry-budget.ts` (NEW): `(memoryId, step, reason)` tuple tracker capping retries at N=3 for `partial_causal_link_unresolved` outcomes
- `mcp_server/hooks/copilot/compact-cache.ts` (NEW): Copilot runtime compact-cache at parity with Claude and Gemini patterns, writing `trustState: 'cached'`
- `mcp_server/hooks/shared-provenance.ts` (NEW): canonical extraction of 3 provenance helpers from `hooks/claude/shared.ts`, eliminating re-inlining risk
- `scripts/validation/continuity-freshness.ts` (NEW): warns when `_memory.continuity.last_updated_at` lags `graph-metadata.derived.last_save_at` by more than 10 minutes, wired into `validate.sh --strict`
- `scripts/validation/evidence-marker-audit.ts` (NEW): bracket-depth state-machine parser (586 LOC) replacing regex for `[EVIDENCE:...]` marker correctness across 1962 markers in 16 folders
- 16 new vitest suites covering the Phase 017 scope (~280 new test cases total)

### Changed

- `scripts/core/workflow.ts`: `ctxFileWritten` changed from hardcoded `false` to `true`. `refreshGraphMetadata` gate changed from `plannerMode === 'full-auto'` to unconditional, making every `/memory:save` write `description.json.lastUpdated` and refresh `graph-metadata.json.derived`
- `shared/gate-3-classifier.ts`: `normalizePrompt` now applies `.normalize('NFKC')` plus zero-width and soft-hyphen stripping before classification, closing Cyrillic and Greek homoglyph bypass vectors
- `mcp_server/handlers/session-resume.ts`: `handleSessionResume` now binds `args.sessionId` to MCP transport-layer caller identity and rejects mismatched values by default (`MCP_SESSION_RESUME_AUTH_MODE=permissive` flag for canary rollout)
- `mcp_server/lib/governance/scope-governance.ts`: new `normalizeScopeValue` canonical export collapses 4 local duplicates across `reconsolidation-bridge.ts`, `lineage-state.ts`, `save/types.ts` and `preflight.ts`
- `mcp_server/handlers/save/post-insert.ts`: retry-budget integration for `partial_causal_link_unresolved`, `runEnrichmentStep` helper reduces `runPostInsertEnrichment` from 243 LOC to 32 LOC

### Fixed

- Every `/memory:save` invocation was a metadata-freshness no-op: `ctxFileWritten = false` dead-code guard plus `plannerMode === 'full-auto'` gate prevented `description.json.lastUpdated` and `graph-metadata.json.derived` from ever being written on the default path. Now fixed unconditionally.
- All 6 code-graph sibling handlers emitted zero readiness vocabulary tokens while `query.ts` emitted all 3. Fixed via shared `readiness-contract.ts` propagated to all siblings.
- Copilot hook runtime lacked `compact-cache.ts` entirely, causing trust-provenance loss across compaction. Compact-cache now writes and reads `trustState: 'cached'` at parity with Claude and Gemini.
- Unicode homoglyphs (Cyrillic `е`, Greek `Ε`) plus zero-width and soft-hyphen characters could bypass Gate 3 file-write detection and `sanitizeRecoveredPayload` system-role-prefix regex. NFKC normalization closes both vectors.

### Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` across `mcp_server/` and `scripts/` | PASSED (zero errors) |
| Wave A vitest (49 files) | PASSED |
| Wave B cross-lane sweep: code-graph + hooks + handler-save | PASSED (145 of 145) |
| Wave D targeted vitest (117 files) | PASSED |
| H-56-1 live proof: `/memory:save` cascaded `lastUpdated` refresh across 38 folders | PASSED (commit `8859da9cd`) |
| EVIDENCE marker audit: 1962 markers across 16 folders | PASSED (0 malformed after rewrap, commit `0acbe7bcce`) |
| `validate.sh --strict` on Phase 017 spec folder | PASSED (exit 0) |
| 16 pre-existing sibling folders refreshed to fresh `description.json.lastUpdated` | PASSED (commits `dcbdf20075` plus `176bad2b2f`) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modified | `ctxFileWritten` set to `true`. `refreshGraphMetadata` gate made unconditional. Closes H-56-1. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/readiness-contract.ts` | Added (NEW) | 4 readiness helpers extracted from `query.ts`. Propagated to 5 sibling handlers. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/caller-context.ts` | Added (NEW) | `runWithCallerContext` via AsyncLocalStorage. 12 propagation tests. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/retry-budget.ts` | Added (NEW) | Retry-exhaustion counter keyed on `(memoryId, step, reason)`. N=3 cap. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts` | Added (NEW) | Copilot compact-cache writing `trustState: 'cached'` at parity with Claude and Gemini. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts` | Added (NEW) | Canonical provenance helpers extracted from `hooks/claude/shared.ts`. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts` | Modified | Now reads `payloadContract?.provenance.trustState` via shared-provenance. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` | Modified | Retry-budget wired for `partial_causal_link_unresolved`. `runEnrichmentStep` extracts god-function body. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Modified | Session-ID auth binding via AsyncLocalStorage caller context. Strict by default. |
| `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` | Modified | `normalizePrompt` applies NFKC plus zero-width stripping. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Modified | `normalizeScopeValue` canonical export collapses 4 local duplicates. |
| `.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts` | Added (NEW) | Continuity freshness validator wired into `validate.sh --strict`. |
| `.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts` | Added (NEW) | Bracket-depth parser for EVIDENCE markers. 1962 markers audited. |

### Follow-Ups

- Verify `MCP_SESSION_RESUME_AUTH_MODE=permissive` canary flag on a test MCP session before enabling elsewhere. Default strict mode is untested at production load.
- Address pre-existing `qualityFlags` bug at `memory-save.ts:368` (`TypeError: parsed.qualityFlags is not iterable`) introduced in Phase 016 commit `104f534bd`. Defensive initialization needed before the `Array.from(new Set([...])` call.
- Investigate `description.json` rich-content overwrite risk: the H-56-1 fix triggers `generate-description.js` auto-regen which overwrites hand-authored cluster breakdowns and wave-structure fields. Either preserve non-autogen fields or opt rich-content folders out of regen.
- Resolve R55-P2-002 (underused `importance-tier` helper at `importance-tiers.ts:149`), R55-P2-003 (`executeConflict` precondition-block DRY opportunity) and R55-P2-004 (YAML `scalarsEqual` TRUE/FALSE coercion gap) deferred to Phase 019.
