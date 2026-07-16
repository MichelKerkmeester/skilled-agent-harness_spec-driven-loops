---
title: "Continuity Memory Runtime Phase 004: Memory Save Planner-First Default"
description: "Made /memory:save planner-first (non-mutating) by default with explicit full-auto fallback via SPECKIT_SAVE_PLANNER_MODE. Retired the legacy [spec]/memory/*.md write path. Gated four default-on subsystems (Tier 3 routing, quality auto-fix, reconsolidation, enrichment) behind explicit env flags. Exposed freshness as three callable follow-up APIs. Closed 9 deep-review findings before closeout."
trigger_phrases:
  - "memory save rewrite changelog"
  - "planner-first save default"
  - "SPECKIT_SAVE_PLANNER_MODE full-auto"
  - "legacy memory file retirement 004"
  - "save flow trim opt-in flags"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/004-memory-save-rewrite` (Level 3+)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

`/memory:save` was mutating on every invocation even though v3.4.0.0 docs claimed the `[spec]/memory/*.md` artifact family was already retired. A 7-iteration audit produced 25 active findings (9 P0, 9 P1, 7 P2) proving the runtime was half-migrated. A 20-iteration relevance research classified 15 save-flow subsystems and concluded that four earned their cost on the default path (canonical atomic writer, routed record identity, content-router core, thin continuity validation) while four did not (Tier 3 routing, quality-loop auto-fix, reconsolidation-on-save, post-insert enrichment).

The implementation shipped 43 of 43 tasks under v3.4.1.0. `/memory:save` is now planner-first by default: the handler returns structured planner output (routes, legality blockers, advisories, follow-up actions) and mutates nothing. `SPECKIT_SAVE_PLANNER_MODE=full-auto` restores the canonical atomic writer with `POST_SAVE_FINGERPRINT` parity, same-path identity, promotion plus rollback. Freshness moved to three explicit follow-up APIs. A deep-review pass flagged 9 findings (3 P0, 5 P1, 1 P2) on router honesty, fallback safety parity, blocker classification plus doc drift. All 9 were resolved before closeout.

### Added

- Planner-first default path for `/memory:save` returning structured planner output with no file mutation
- `SPECKIT_SAVE_PLANNER_MODE=full-auto` fallback running the canonical atomic writer with `POST_SAVE_FINGERPRINT` parity
- Four per-subsystem env flags (all default OFF): `SPECKIT_ROUTER_TIER3_ENABLED`, `SPECKIT_QUALITY_AUTO_FIX`, `SPECKIT_RECONSOLIDATION_ENABLED`, `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED`
- Three explicit follow-up APIs: `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill`
- `hybrid` mode reserved under `SPECKIT_SAVE_PLANNER_MODE` (currently behaves like `plan-only`)
- Blocker/advisory separation in planner output with typed entries distinguishing must-fix from informational items
- Explicit `deferred` status for skipped helpers rather than success-shaped output
- Template-contract failures promoted from advisories to planner blockers

### Changed

- `/memory:save` default is now non-mutating planner output. Callers inspect routes, blockers plus advisories before committing.
- Tier 3 routing is now default-disable with a scoped manual-review guard inside `content-router.ts` (ADR-007)
- Quality-loop auto-fix retries removed from default path. Hard structural and legality blockers are preserved.
- Reconsolidation-on-save gated behind explicit opt-in or fallback. `SPECKIT_RECONSOLIDATION_ENABLED=false` is default.
- Post-insert enrichment moved to explicit follow-up or fallback. `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED=false` is default.
- Graph-metadata refresh and spec-doc reindex no longer run on every save. Callers invoke follow-up APIs when wanted.

### Fixed

- Legacy `[spec]/memory/*.md` write path retired runtime-wide. `workflow.ts`, `memory-indexer.ts` plus `memory-metadata.ts` no longer create, write, index or read that surface.
- Audit half-migration contradiction documented and resolved under v3.4.1.0 retirement claim.
- Deep-review findings F001-F009 closed. Includes `POST_SAVE_FINGERPRINT` restoration (F002), router honesty via ADR-007 scoped exception (F001), deferred status for skipped helpers (F004), template-contract blockers promoted (F003), env-reference drift corrected (F008) plus release-note accuracy aligned (F009).

### Verification

| Check | Result |
|-------|--------|
| 43 of 43 implementation tasks completed | PASS |
| Planner-default non-mutation tests | PASS |
| Full-auto fallback with atomic mutation, rollback, `POST_SAVE_FINGERPRINT` parity | PASS |
| Three real session transcripts validated planner-first behavior with no wrong-anchor or unsafe-target outcomes | PASS |
| Docs, `ENV_REFERENCE.md`, templates plus `v3.4.1.0.md` release notes aligned on default/opt-in vocabulary | PASS |
| `validate_document.py` for all six primary docs | PASS |
| `validate.sh --strict` | PASS |
| `description.json` and `graph-metadata.json` generated | PASS |
| All 9 deep-review findings (F001-F009) resolved before closeout | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/handlers/memory-save.ts` | Planner-first default handler with full-auto fallback routing |
| `mcp_server/lib/routing/content-router.ts` | Scoped Tier 3 default-disable and manual-review guard (ADR-007) |
| `mcp_server/handlers/quality-loop.ts` | Auto-fix retries removed from default path. Hard blockers preserved. |
| `mcp_server/lib/validation/save-quality-gate.ts` | Hard structural blocker preservation after quality-loop trim |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Gated behind explicit opt-in env flag |
| `mcp_server/handlers/save/post-insert.ts` | Enrichment deferred behind explicit opt-in env flag |
| `mcp_server/api/indexing.ts` (NEW) | Follow-up APIs: `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill` |
| `mcp_server/handlers/save/types.ts` | Planner response interfaces, blocker/advisory types, deferred status |
| `mcp_server/handlers/save/response-builder.ts` (NEW) | Planner response serialization helpers |
| `mcp_server/handlers/save/validation-responses.ts` | Template-contract failures promoted to planner blockers |
| `scripts/core/workflow.ts` | Legacy `[spec]/memory/*.md` write path removed |
| `scripts/core/memory-indexer.ts` | Legacy index path removed |
| `scripts/core/memory-metadata.ts` | Legacy read path removed |
| `mcp_server/ENV_REFERENCE.md` | All per-subsystem flags, planner modes plus reserved `hybrid` documented |
| `changelog/v3.4.1.0.md` (NEW) | Release notes covering scoped router exception and reserved `hybrid` state |

### Follow-Ups

- `hybrid` mode remains reserved. `SPECKIT_SAVE_PLANNER_MODE=hybrid` is accepted but behaves like `plan-only`. A future packet may define mixed-flow behavior.
- Historical `[spec]/memory/` cleanup has a dry-run path. Apply mode remains deferred with operator-gated reopen criteria.
- The four env flags are documented as orthogonal. A formal test suite validates no cascade behavior between them.
