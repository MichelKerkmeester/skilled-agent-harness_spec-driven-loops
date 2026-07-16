---
title: "Runtime Executor Hardening Phase 004/001: Foundational Runtime Remediation"
description: "25 commits shipped closing all 27 remediation tasks from a 7-iteration deep-review plus 7-iteration segment-2 deep-research. Four architectural primitives introduced. H-56-1 canonical-save metadata no-op eliminated. Six sibling code-graph handlers now emit readiness vocabulary. Copilot compact-cache at parity."
trigger_phrases:
  - "phase 004/001 changelog"
  - "foundational runtime remediation"
  - "h-56-1 canonical save fix"
  - "readiness contract propagation"
  - "copilot compact cache parity"
  - "async local storage caller context"
importance_tier: "critical"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/004-runtime-executor-hardening` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/004-runtime-executor-hardening`

### Summary

A 50-iteration foundational deep-research pass (Phase 016) and a 7-iteration deep-review scored **CONDITIONAL** with 10 P1 + 18 P2 findings. A subsequent 7-iteration segment-2 deep-research extended the inventory to 27 consolidated tasks across 5 clusters (A scope normalization, B canonical-save surface, C ASCII sanitization, D code-graph sibling asymmetry, E Copilot observability). The dominant finding was **H-56-1**: the default `/memory:save` canonical-save path was a structural metadata-freshness no-op because `workflow.ts:1259` hardcoded `const ctxFileWritten = false`, making the 70-LOC description.json update block unreachable.

Phase 017 shipped 25 commits across 4 waves (A/B/C/D) closing all 27 tasks. The H-56-1 fix was a 2-line change (`ctxFileWritten = true`, unconditional follow-ups) that cascaded `lastUpdated` across 38 folder metadata files. Five new architectural primitives landed: canonical-save metadata writes, readiness-contract module extraction, shared-provenance extraction, AsyncLocalStorage caller context, and retry-budget exhaustion tracking.

### Added

- `mcp_server/lib/code-graph/readiness-contract.ts` (4 helpers: `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildQueryGraphMetadata`, `buildReadinessBlock`). Propagated to 5 sibling handlers (`scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts`) in commit `f253194bf`. CCC trio ships stub rollout (`trustState: 'unavailable'`) where full readiness does not apply.
- `mcp_server/lib/context/caller-context.ts` exports `runWithCallerContext`, `getCallerContext`, `requireCallerContext`. Transport wraps each request dispatch in `context-server.ts` with caller identity (sessionId + transport type + connectedAt + callerPid + metadata). 12 tests cover propagation across `await`, `setTimeout`, `Promise.all`, nested runs, readonly immutability.
- `mcp_server/lib/enrichment/retry-budget.ts` tracks `(memoryId, step, reason)` tuples with attempt counts. `shouldRetry` skips after 3 failures. `recordFailure` updates state. `clearBudget` resets per-memory or globally. Consumed by `handlers/save/post-insert.ts` for `partial_causal_link_unresolved` outcomes.
- `hooks/copilot/compact-cache.ts` plus extended `session-prime.ts`. Copilot runtime now writes and reads `trustState: 'cached'`, matching Claude/Gemini patterns (commit `5923737c7`).
- `hooks/shared-provenance.ts` extracted from `hooks/claude/shared.ts:100-140`. All three runtimes import from one canonical source (commit `77da3013a`).
- `lib/governance/scope-governance.ts` new export `normalizeScopeValue(value: unknown): string | null` canonical normalizer. Collapses 4 local duplicates across `reconsolidation-bridge.ts`, `lineage-state.ts`, `save/types.ts`, `preflight.ts` (commit `b923623cc`).
- `scripts/validation/evidence-marker-audit.ts` (586 LOC) bracket-depth state-machine parser. Detects genuinely unclosed `[EVIDENCE:...]` markers, skipping fenced code blocks and inline backtick spans. 1962 markers across 16 folders audited.
- `scripts/validation/evidence-marker-lint.ts` CLI wrapper activating bracket-depth audit in strict mode (exits 1 on malformed markers). Wired into `validate.sh --strict`. 22 tests.
- `scripts/validation/continuity-freshness.ts` warns when `_memory.continuity.last_updated_at` lags `graph-metadata.derived.last_save_at` by more than 10 minutes. Wired into `validate.sh --strict`.
- `scripts/memory/backfill-research-metadata.ts` walks `research/NNN-*/iterations/` and auto-creates missing `description.json` + `graph-metadata.json` (commit `88063287b`).
- `scripts/tests/gate-3-classifier.vitest.ts` with 5+ unicode adversarial cases (Cyrillic `e`, soft hyphen, zero-width space, Greek `E`, combined).
- `mcp_server/lib/utils/exhaustiveness.ts` with `assertNever` helper applied to 8 typed unions.
- `DEPLOYMENT.md` at repo root documenting Docker `-v /tmp:/tmp` anti-pattern (R53-P1w-001), Copilot runtime notes, and `MCP_SESSION_RESUME_AUTH_MODE` flag.

### Changed

- `scripts/core/workflow.ts:1259` no longer hardcodes `const ctxFileWritten = false`. The 70-LOC description.json tracking block (lines 1261-1331) is now reachable and writes `lastUpdated` on every canonical save. `workflow.ts:1333` no longer gates `refreshGraphMetadata` on `plannerMode === 'full-auto'`. Follow-ups run unconditionally (commit `aaf0f49a8`).
- `handlers/code-graph/context.ts` replaces silent catch with explicit `reason: 'readiness_check_crashed'` surfacing via 4-state `trustState: 'unavailable'` (commit `db36c3194`).
- `shared/gate-3-classifier.ts:normalizePrompt` applies `.normalize('NFKC')` + strips `[\u00AD\u200B-\u200F\uFEFF]` zero-width/soft-hyphen characters before `.toLowerCase()`. Cyrillic `e` and zero-width characters no longer bypass Gate 3 file-write detection.
- `hooks/claude/shared.ts:sanitizeRecoveredPayload` mirrors the NFKC pass. Greek `E` (U+0395) no longer injects `SYST\u0395M:` past the system-role-prefix regex.
- `handlers/session-resume.ts` binds `args.sessionId` to the caller's MCP-transport-layer session identity via AsyncLocalStorage caller context. `MCP_SESSION_RESUME_AUTH_MODE=permissive` env flag for canary rollout. Default is strict (reject mismatch).
- `memory-context.ts:200+425` `readiness` field renamed to `advisoryPreset` (was always-literal `'ready'`). Name implied dynamism that did not exist.
- `runEnrichmentStep` extracted from `runPostInsertEnrichment`. `runPostInsertEnrichment` reduced from 243 LOC to 32 LOC coordinator. `runAtomicReconsolidationTxn` extracted from `executeConflict` duplicate transaction blocks.
- 38-folder `lastUpdated` cascade proven as side-effect of the H-56-1 fix (commit `8859da9cd`). 17 sibling 026-tree folders now have fresh `description.json.lastUpdated`.

### Fixed

- H-56-1 (compound P1, confidence 0.93): default `/memory:save` was a structural metadata-freshness no-op. Every invocation since the code shipped wrote zero metadata. Fixed by 2-line change in `workflow.ts`.
- 6:1 code-graph sibling asymmetry: `query.ts` was the only handler emitting `canonicalReadiness` + `trustState` + `lastPersistedAt`. All 5 other handlers now emit via shared readiness-contract.
- Copilot runtime missing compact-cache and provenance trust: `compact-cache.ts` now writes `trustState: 'cached'`. `session-prime.ts` reads `payloadContract.provenance.trustState`.
- Retry exhaustion on `partial_causal_link_unresolved`: retry-budget module prevents unbounded backfill scheduling on structurally non-retryable references.
- 1962 EVIDENCE markers audited. ~210 genuinely malformed markers rewound in-place. Future going forward enforced by `evidence-marker-lint.ts`.

### Verification

- Build: `tsc --noEmit` clean across `mcp_server/` + `scripts/`.
- Wave A: 49/49 test files pass. `workflow-canonical-save-metadata.vitest.ts` (4/4 + 1 skipped) confirms H-56-1 fix.
- Wave B: 145/145 code-graph + hooks + handler-save tests pass.
- Wave C: targeted vitest per commit green. 16-folder sweep verified on `001-research-graph-context-systems` (4-day-stale) before sweeping the remaining 11 folders.
- Wave D: 117/117 targeted tests pass. `assertNever` exhaustive checks across 8 unions.
- Total: ~280 new/modified test cases. Known pre-existing failure at `handler-memory-save.vitest.ts:3174` (orthogonal to Phase 017 scope).
- Deep-review pt-01: 7 iterations, verdict CONDITIONAL, 0 P0 / 10 P1 / 18 P2.
- Deep-review pt-02: 10 iterations, verdict CONDITIONAL, 0 P0 / 5 P1 / 15 P2. Two retracted findings (R17-P1-002 P1 to P2, C1 compound P0 retracted to P2).

### Files Changed

| File | What changed |
|------|--------------|
| `scripts/core/workflow.ts` | `ctxFileWritten = true` (was `false`). `refreshGraphMetadata` unconditional (was gated on `full-auto`). H-56-1 fix. |
| `mcp_server/lib/code-graph/readiness-contract.ts` (NEW) | 4 exported helpers extracted from `query.ts`. Canonical readiness-contract module. |
| `mcp_server/handlers/code-graph/scan.ts` | Reads readiness-contract. Emits `canonicalReadiness`, `trustState`, `lastPersistedAt`. |
| `mcp_server/handlers/code-graph/status.ts` | Same readiness-contract propagation. |
| `mcp_server/handlers/code-graph/context.ts` | Explicit error branch emitting `trustState: 'unavailable'` + reason. |
| `mcp_server/handlers/code-graph/ccc-status.ts` | Stub rollout: `trustState: 'unavailable'`, `reason: 'readiness_not_applicable'`. |
| `mcp_server/handlers/code-graph/ccc-reindex.ts` | Same stub rollout. |
| `mcp_server/handlers/code-graph/ccc-feedback.ts` | Same stub rollout. |
| `mcp_server/lib/context/caller-context.ts` (NEW) | AsyncLocalStorage caller-context module. 12 tests. |
| `mcp_server/context-server.ts` | Wraps dispatch in `runWithCallerContext`. |
| `mcp_server/lib/enrichment/retry-budget.ts` (NEW) | Retry-budget exhaustion tracker for `partial_causal_link_unresolved`. |
| `hooks/copilot/compact-cache.ts` (NEW) | Copilot compact-cache parity with Claude/Gemini. |
| `hooks/copilot/session-prime.ts` | Reads `payloadContract.provenance.trustState`. |
| `hooks/shared-provenance.ts` (NEW) | Extracted from `hooks/claude/shared.ts:100-140`. 3 functions. |
| `hooks/claude/shared.ts` | Re-imports from `shared-provenance.ts`. Transitive coupling broken. |
| `mcp_server/lib/governance/scope-governance.ts` | New `normalizeScopeValue` canonical export. Lint rule rejects duplicates outside this module. |
| `shared/gate-3-classifier.ts` | `normalizePrompt` applies NFKC + zero-width stripping. |
| `mcp_server/handlers/session-resume.ts` | Binds `args.sessionId` to caller-context identity. `MCP_SESSION_RESUME_AUTH_MODE` env flag. |
| `mcp_server/handlers/save/post-insert.ts` | Design-intent comments at rollup divergence sites. Retry-budget integration in `partial_causal_link_unresolved` path. |
| `scripts/validation/evidence-marker-audit.ts` (NEW) | Bracket-depth state-machine parser (586 LOC). |
| `scripts/validation/evidence-marker-lint.ts` (NEW) | CLI wrapper for strict mode. 22 tests. |
| `scripts/validation/continuity-freshness.ts` (NEW) | 10-minute divergence warning for `_memory.continuity` vs `graph-metadata.derived.last_save_at`. |
| `scripts/memory/backfill-research-metadata.ts` (NEW) | Auto-creates missing `description.json` + `graph-metadata.json` in research iteration folders. |
| `scripts/tests/gate-3-classifier.vitest.ts` (NEW) | 5+ adversarial unicode test cases. |
| `mcp_server/lib/utils/exhaustiveness.ts` (NEW) | `assertNever` helper + `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` clause. |
| `mcp_server/lib/search/folder-discovery.ts` | `StructuralRoutingNudgeMeta.readiness` renamed to `advisoryPreset`. |
| `DEPLOYMENT.md` (NEW) | Docker anti-pattern, Copilot concurrency, AsyncLocalStorage, session-resume auth. |

25 commits across 4 waves (A=5, B=10, C=4, D=3) plus 3 support and 5 finalization commits.

### Follow-Ups

- **cli-copilot autonomous execution verification**: Cluster E landed but end-to-end production-load exercise under cli-copilot-primary dispatch remains pending. Recommend canary verification before flipping defaults.
- **T-SRS-BND-01 canary rollout**: Default is strict mode. `MCP_SESSION_RESUME_AUTH_MODE=permissive` has not been canary-verified.
- **description.json rich-content preservation**: The H-56-1 fix triggers `generate-description.js` auto-regen that overwrites hand-authored rich content. Follow-up needed to preserve non-autogen fields.
- **pre-existing `qualityFlags` bug**: `handler-memory-save.vitest.ts:3174` TypeError orthogonal to Phase 017 scope.