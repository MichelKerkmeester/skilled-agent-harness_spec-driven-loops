---
title: "Continuity Memory Runtime Phase 004: Memory save rewrite"
description: "Largest phase (572-line spec, Level 3+). Made /memory:save planner-first (non-mutating) by default with explicit full-auto fallback. Retired the legacy [spec]/memory/*.md write path. Gated four subsystems behind opt-in env flags."
trigger_phrases:
  - "phase 004 changelog"
  - "memory save rewrite"
  - "planner-first default"
  - "full-auto fallback"
  - "legacy memory file retirement"
  - "save flow trim"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-15

> Spec folder: `026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite` (Level 3+)
> Parent packet: `026-graph-and-context-optimization/003-continuity-memory-runtime`

### Summary

This was the largest phase in the track. A 7-iteration audit exposed that the runtime still created, wrote, indexed, and read [spec]/memory/*.md even though v3.4.0.0 docs claimed that surface was retired. 25 active findings (9 P0, 9 P1, 7 P2) proved a half-migrated system.

A 20-iteration relevance research classified 15 remaining save-flow subsystems. Four earned their cost on the default path (canonical atomic writer, routed record identity, content-router core, thin continuity validation). Four did not (Tier 3 routing, quality-loop auto-fix, reconsolidation-on-save, post-insert enrichment). The verdict: keep the writer, trim the oversized default-path stack.

The implementation shipped 43 of 43 tasks under v3.4.1.0. A deep-review pass flagged 9 findings (3 P0, 5 P1, 1 P2) on router honesty, fallback safety parity, blocker classification, and doc drift. All 9 resolved before closeout.

### Added

- Planner-first default path for /memory:save (returns structured planner output, mutates nothing).
- Full-auto fallback via SPECKIT_SAVE_PLANNER_MODE=full-auto with POST_SAVE_FINGERPRINT parity, same-path identity, promotion, and rollback.
- Four per-subsystem env flags (all default OFF): SPECKIT_ROUTER_TIER3_ENABLED, SPECKIT_QUALITY_AUTO_FIX, SPECKIT_RECONSOLIDATION_ENABLED, SPECKIT_POST_INSERT_ENRICHMENT_ENABLED.
- Three follow-up APIs: refreshGraphMetadata, reindexSpecDocs, runEnrichmentBackfill.
- Hybrid mode reserved as SPECKIT_SAVE_PLANNER_MODE=hybrid (currently behaves like plan-only).
- Blocker/advisory separation in planner output with typed entries.
- Deferred status for skipped helpers instead of success-shaped output.
- Template-contract failures promoted to planner blockers.

### Changed

- /memory:save default is now non-mutating planner output. Callers inspect routes, blockers, and advisories before committing.
- Tier 3 routing default-disable with scoped manual-review guard in content-router.ts.
- Quality-loop auto-fix retries removed from default path. Hard structural and legality blockers preserved.
- Reconsolidation-on-save gated behind explicit opt-in or fallback.
- Post-insert enrichment moved to explicit follow-up or fallback.
- Graph-metadata refresh and spec-doc reindex no longer run on every save.

### Fixed

- Legacy memory-file write path retired runtime-wide. workflow.ts, file-writer.ts, memory-indexer.ts, memory-metadata.ts, and directory-setup.ts no longer create, write, index, or read [spec]/memory/*.md.
- Audit contradiction resolved: the half-migrated state was documented and fixed.
- 9 deep-review findings (F001-F009) closed including POST_SAVE_FINGERPRINT restoration, router honesty, deferred status, coverage gaps, and env-reference drift.

### Verification

- 43 of 43 implementation tasks completed with 0 blocked.
- Planner-default runtime tests: PASS (non-mutating default).
- Full-auto fallback tests: PASS (atomic mutation + rollback + POST_SAVE_FINGERPRINT parity).
- Three real session transcripts validated planner-first behavior with no wrong-anchor or unsafe-target outcomes.
- Docs, ENV_REFERENCE.md, templates, and v3.4.1.0 release notes aligned on default/opt-in vocabulary.
- validate_document.py: PASS for all six primary docs.
- validate.sh --strict: PASS.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/handlers/memory-save.ts` | Planner-first default + full-auto fallback handler. |
| `mcp_server/handlers/content-router.ts` | Scoped Tier 3 default-disable + manual-review guard. |
| `mcp_server/handlers/quality-loop.ts` | Auto-fix retries removed from default path. Hard blockers preserved. |
| `mcp_server/handlers/save-quality-gate.ts` | Hard structural blocker preservation. |
| `mcp_server/handlers/reconsolidation-bridge.ts` | Gated behind explicit opt-in flag. |
| `mcp_server/handlers/post-insert.ts` | Enrichment deferred behind explicit opt-in flag. |
| `mcp_server/api/indexing.ts` (NEW) | Follow-up APIs: refreshGraphMetadata, reindexSpecDocs, runEnrichmentBackfill. |
| `mcp_server/lib/types.ts` | Planner response interfaces, blocker/advisory types, deferred status. |
| `mcp_server/lib/response-builder.ts` (NEW) | Planner response serialization. |
| `mcp_server/lib/validation-responses.ts` | Template-contract blockers promoted from advisory. |
| `mcp_server/scripts/core/workflow.ts` | Legacy memory-file write path removed. |
| `mcp_server/scripts/core/file-writer.ts` | Legacy write path removed. |
| `mcp_server/scripts/core/memory-indexer.ts` | Legacy index path removed. |
| `mcp_server/scripts/core/memory-metadata.ts` | Legacy read path removed. |
| `command/memory/save.md` | Updated for planner-first default. |
| `ENV_REFERENCE.md` | Documented all per-subsystem flags, planner modes, reserved hybrid. |
| `changelog/01--system-spec-kit/v3.4.1.0.md` (NEW) | Release notes with scoped exception and hybrid state. |
| Packet docs (6 primary files) | spec.md (572 lines), plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md. |

Implementation spanned M1-M10 milestones. Deep-review commit set closed all 9 findings. Packet-level reference: `7a987e8827`.

### Follow-Ups

- **Hybrid mode remains reserved.** SPECKIT_SAVE_PLANNER_MODE=hybrid is accepted but behaves like plan-only. A future packet may define mixed-flow behavior.
- **Historical memory-file cleanup.** PR-10 historical-migration dry-run exists. Apply mode remains deferred with operator-gated reopen criteria.
- **Feature-flag orthogonality tests.** The four env flags are documented as orthogonal. A formal test suite validates no cascade behavior.
