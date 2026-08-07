---
title: "Changelog: 027/002 Memory Write Safety"
description: "Three P0 correctness fixes (auto-provenance caps, manual-edge overwrite guard, retention tier basement) plus fail-closed pre-index secret redaction shipped with 60 focused passing tests."
trigger_phrases:
  - "027 phase 002/001 changelog"
  - "memory write safety shipped"
  - "auto-provenance cap changelog"
  - "manual-edge overwrite guard shipped"
  - "secret scrubber shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

Four P0 correctness gaps in the memory write path were closed before the learning reducers in `027/005` take a hard dependency on this phase. Three were structural: the automatic-edge strength cap only matched the literal string `auto` and therefore let any namespaced variant such as `auto-session` bypass it; the `insertEdge` conflict path could overwrite a curated manual edge with automatic provenance; and the retention sweep deleted constitutional or critical rows purely on TTL expiry without consulting tier metadata. The fourth fix — an OpenLTM amendment folded into this phase — adds a fail-closed secret scrubber at the head of the parse pipeline so API keys, tokens and JWTs never reach content-hash computation, embedding or FTS storage. All four protections ship inside existing modules with no feature flags and no new architecture.

### Added

- `mcp_server/lib/parsing/secret-scrubber.ts` — ordered, fail-closed regex scrubber; redacts AWS keys, GitHub/OpenAI/Anthropic/Google/Slack tokens, JWTs, bearer values, private-key blocks and credential assignments using typed `[REDACTED:<kind>]` markers; throws `SecretScrubberError` and refuses the write on internal failure
- `mcp_server/tests/causal-edges-write-safety.vitest.ts` — 15 focused tests covering the `isAutoEdgeCreator` predicate, all three cap sites, per-node edge bounds and the manual-edge overwrite guard
- `mcp_server/tests/secret-scrubber.vitest.ts` — 27 focused tests covering pattern correctness, false-positive guards, fail-closed behavior, parse-path integration and the health surface

### Changed

- `mcp_server/lib/storage/causal-edges.ts` — introduced shared `isAutoEdgeCreator` predicate (`createdBy === "auto" || createdBy.startsWith("auto-")`); all three cap sites (causal insert cap, per-node edge bound, and Hebbian strengthening cap via consolidation) now call it; `insertEdge` reads the existing row's `created_by` before its conflict update and skips the write when an automatic creator would overwrite a non-auto row, returning `null` to match the existing rejection convention
- `mcp_server/lib/storage/consolidation.ts` — Hebbian strengthening cap replaced its inline `createdBy === 'auto'` check with the shared `isAutoEdgeCreator` predicate so the two sites cannot drift
- `mcp_server/lib/governance/memory-retention-sweep.ts` — `RetentionExpiredRow` extended with `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count` and `last_accessed`; missing columns on legacy schemas selected as `NULL` via PRAGMA column probe; tier-aware deny-before-delete decision added so constitutional, critical and pinned rows record a `governance_audit` row (`decision='deny'`, reason `retention_tier_protected`) instead of being deleted; `protectedCount` and `protectedIds` returned alongside the deletion counts
- `mcp_server/handlers/memory-retention-sweep.ts` — surfaces `protectedCount` and `protectedIds` in the tool response summary
- `mcp_server/lib/parsing/memory-parser.ts` — `parseMemoryContent` calls the scrubber at its head before content-hash computation, embedding and FTS so secrets never reach durable storage
- `mcp_server/handlers/memory-crud-update.ts` — direct `title` and `triggerPhrases` writes scrubbed at entry; write refused with `SecretScrubberError` on scrubber failure
- `mcp_server/handlers/memory-crud-health.ts` — `memory_health` full report now surfaces a `redaction` block with total and per-kind redaction counts
- `mcp_server/tests/memory-retention-sweep.vitest.ts` — 8 new tier-basement tests added (18 total in file); fixture extended with opt-in `includeRetentionColumns` helper
- `mcp_server/tests/fixtures/memory-index-db.ts` — opt-in `includeRetentionColumns` columns added to the test fixture

### Fixed

- `auto-session` and any other `auto-*` namespaced edge creators now receive the same 0.5 automatic strength cap as `created_by='auto'`; the RQ-B3 provenance namespace that prompted the gap is now safe
- Reducer-style upserts can no longer silently replace a curated manual edge's `created_by`, strength or evidence; a preserved manual row returns `null` to the automatic caller
- Constitutional and critical memory rows with an expired `delete_after` are now denied by the retention sweep rather than deleted; the deny decision is recorded in `governance_audit` with reason `retention_tier_protected`

### Verification

| Check | Result |
|-------|--------|
| `npm run build` (mcp_server workspace) | PASS |
| `npx vitest run tests/causal-edges-write-safety.vitest.ts` | PASS (15/15) |
| `npx vitest run tests/memory-retention-sweep.vitest.ts` | PASS (18/18) |
| `npx vitest run tests/secret-scrubber.vitest.ts` | PASS (27/27) |
| Adjacent suites (causal-edges, causal-edges-unit, causal-fixes, memory-runtime-retention, memory-parser x4, handler-memory-crud, memory-crud-update-constitutional-guard, handler-memory-health-edge, handler-memory-save) | PASS (326 passed, 51 pre-existing skips) |
| Adjacent suites (atomic-index-memory, n3lite-consolidation, memory-save-extended, memory-save-integration) | PASS (102 passed, 2 pre-existing skips) |
| `validate.sh --strict` | PASS (exit 0) |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/storage/causal-edges.ts` | Modified | Shared `isAutoEdgeCreator` predicate; cap and edge-bound broadening; manual-edge overwrite guard |
| `mcp_server/lib/storage/consolidation.ts` | Modified | Hebbian strengthening cap uses the shared predicate |
| `mcp_server/lib/governance/memory-retention-sweep.ts` | Modified | Tier/usage fields on expired rows; tier-aware deny-before-delete; protected counts |
| `mcp_server/handlers/memory-retention-sweep.ts` | Modified | Surfaces `protectedCount` and `protectedIds` in the tool response and summary |
| `mcp_server/lib/parsing/secret-scrubber.ts` | Created | Ordered, fail-closed secret scrubber with typed markers and redaction telemetry |
| `mcp_server/lib/parsing/memory-parser.ts` | Modified | Scrubber call at the head of `parseMemoryContent`, before content-hash |
| `mcp_server/handlers/memory-crud-update.ts` | Modified | Scrubs direct `title` and `triggerPhrases` writes; fail-closed refusal on scrubber error |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | `redaction` counters added to the `memory_health` full report |
| `mcp_server/tests/fixtures/memory-index-db.ts` | Modified | Opt-in `includeRetentionColumns` fixture columns |
| `mcp_server/tests/causal-edges-write-safety.vitest.ts` | Created | 15 tests: predicate, caps, edge bounds, overwrite guard, Hebbian cap |
| `mcp_server/tests/memory-retention-sweep.vitest.ts` | Modified | 8 new tier-basement tests (18 total in file) |
| `mcp_server/tests/secret-scrubber.vitest.ts` | Created | 27 tests: pattern coverage, false-positive guards, fail-closed, parse integration, health surface |

### Follow-Ups

- Redaction counters are in-process only and reset on server restart; persisting them to the database is deferred out of this phase's scope.
- The scrubber covers the parse and update heads only; secrets persisted before this phase land remain in the index until rows are re-saved or re-indexed through the scrubbed path.
- The caura-memclaw `source_kind` enum (`human|agent|system|import|feedback`) and automated-mutation audit standardization are planned in `027/010/001` and `027/010/002`.
- Recency fields (`access_count` and `last_accessed`) are selected by the retention sweep for audit but do not confer protection; that policy decision is deferred to the learning-reducers phase.
- A `render.ts` uncertainty-check short-circuit for the skill advisor (high-uncertainty records rendering mandate wording) is a related correctness surface scoped to the next advisor contract packet, not this phase.
