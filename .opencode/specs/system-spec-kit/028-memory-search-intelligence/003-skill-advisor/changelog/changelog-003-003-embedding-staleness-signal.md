---
title: "Changelog: Skill Advisor Embedding-Staleness Signal (SA8) [003-skill-advisor/003-embedding-staleness-signal]"
description: "Chronological changelog for the Skill Advisor Embedding-Staleness Signal (SA8) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/003-embedding-staleness-signal` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

The staleness signal is implemented. The SQLite projection now computes an AdvisorEmbeddingSignature plus AdvisorEmbeddingStalenessVerdict from persisted vector model rows, compares that stored identity against the active embedder pointer, and keeps generatedAt as a back-compatible sibling field. Matching stored vectors yield stale:false; mismatched/mixed/missing model ids yield stale:true with a reason. Empty projections remain not-stale because there are no vectors to trust or serve.

### Added

- SA8 signature capture — derive a canonical (provider, name, dim) signature from the active-embedder pointer + providerModelId (skill-graph-db.ts:599-600) and attach it to the AdvisorProjection shape at build (projection.ts loadSqliteProjection, build site near :315) (REQ-001) [Evidence — AdvisorEmbeddingSignature/AdvisorEmbeddingStalenessVerdict added; SQLite projection carries embeddingSignature and embeddingStaleness; helper reuses exported providerModelId].
- SA8 back-compat retention — RETAIN the existing generatedAt stamp (projection.ts:315,328,375,413) as a sibling field; the signature is ADDED, not a replacement, so advisor_status/cache-keying consumers that read generatedAt are undisturbed (REQ-001) [Evidence — generatedAt remains on all projection constructors; tests assert it remains present].
- SA8 fail-closed on missing signature — a missing/null stored signature on an otherwise-populated projection ⇒ STALE (fail-closed, matching embedding-reconcile.ts default requireActiveShard), so a legacy signature-less projection is flagged for rebuild rather than silently trusted (REQ-002) [Evidence — unit test covers populated vectors with null model id returning stale:true, reason projection embedding model missing].
- Author plan.md, tasks.md, checklist.md, implementation-summary.md from the system-spec-kit Level-2 templates.
- Both candidates have a final status in spec.md section 10 (signal DONE; rebuild reuse PENDING with Memory 010 gate).
- The Memory-010 idempotent-async primitive is identified as the reuse target for facet #2 (the rebuild), and facet #1 (the signal) is recorded as independently shippable (no shared-infra gate).

### Changed

- Capture the current code-only baseline before any change (REQ-001 prep) [Evidence — npm run typecheck passed with 0 errors; broad related Vitest tests/scorer lib/scorer/lanes/__tests__ tests/handlers/advisor-status.vitest.ts passed 84/86 with 2 skipped. Live advisor_validate was not run per task constraint against live MCP work].
- SA8 compare-on-load verdict — in loadAdvisorProjection (projection.ts:388) compare the stored signature against the active embedder (read the pointer like embedding-reconcile.ts:139-142 reads active_embedder_*) and emit {stale:boolean, reason?:string} mirroring embedding-reconcile.ts:183-189 (verified:false, reason:"shard model X != active Y") (REQ-002) [Evidence — readAdvisorEmbeddingStaleness() compares stored vector model ids against the active pointer and returns a structured stale verdict].
- SA8 lane degrade — wire semantic_shadow (lanes/semantic-shadow.ts) to read the stale verdict; on stale, the lane degrades (elide / down-weight) rather than serving superseded cosine rows as fresh (REQ-003) [Evidence — semantic lane returns no cosine matches on stale verdict; fusion marks semantic_shadow runtime-degraded and removes its weight from normalization].
- SA8 report-only on unreadable pointer — if the active-embedder pointer is unreadable, report-only (degrade the lane, do NOT crash the load), mirroring embedding-reconcile.ts:34 providerFailurePolicy:"report-only" (REQ-003) [Evidence — staleness helper catches check failures into a stale/report-only verdict; missing active pointer with stored vectors is stale rather than fatal].
- Detection check — a projection built under embedder A, loaded while embedder B is active, yields {stale:true} with a reason string in the embedding-reconcile.ts shape; a matching signature yields {stale:false}; a null signature yields {stale:true} (fail-closed) (SC-001/SC-002; REQ-002). [Evidence — projection-embedding-staleness.vitest.ts covers match, mismatch, null model id, and empty-vector cases.]
- Author spec.md from the system-spec-kit Level-2 template (2-candidate pair, per-candidate PENDING status with research-cited acceptance criteria; seam + mirror cited).

### Fixed

- Degrade + idempotency check — the semantic_shadow lane degrades under a stale verdict (no superseded cosine rows ranked as fresh) vs unchanged under fresh (REQ-003); and (Phase D, gated) a rebuild interrupted mid-cursor resumes without re-applying completed rows, two concurrent stale loads launch one rebuild (SC-003; REQ-004). Re-run the WHOLE focused gate and report the delta vs the T001 baseline (no benefit number — correctness only). [Evidence — degrade verified in projection-embedding-staleness.vitest.ts; broad related gate passed 90/92 with 2 skipped vs baseline 84/86 with 2 skipped. Idempotent rebuild remains gated in T008-T009.]
- Run validate.sh --strict on this sub-phase and fix structure issues.
- CHK-FIX-001 Each candidate has a final disposition.
- CHK-FIX-002 The staleness signal targets the READ/projection boundary, not the write-path refresh guard (which already detects per-row drift).
- CHK-FIX-003 Building the shared idempotent-async primitive is OUT of scope; this sub-phase REUSES it.
- CHK-FIX-004 The fail-closed default and report-only-on-unreadable-pointer behaviors are named, not assumed away.

### Verification

- Tasks complete - 18 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-024 Rebuild idempotency (Phase D, gated on Memory 010): a rebuild interrupted mid-cursor resumes without re-applying completed rows; two concurrent stale loads launch a single rebuild.
- [B] Rebuild reuse — import the Memory 010-consolidation-cursor-clock durable-cursor + bounded-retry + idempotency-token primitive; route the stale-triggered projection rebuild through it (single in-flight via idempotency token, recoverable mid-rebuild via durable cursor, no double-apply) (REQ-004) [Pending/BLOCKED on Memory 010 landing — synthesis 04-sibling-and-cross-cutting.md:34; this is the SECOND consumer, do NOT stand up a second engine].
- [B] Rebuild thrash guard — a stale verdict that is ALREADY rebuilding does not re-trigger; two concurrent stale loads launch a single rebuild (idempotency token + cursor lock) (REQ-004) [Pending/BLOCKED on Memory 010 — spec §L2 EDGE CASES "Concurrent access"; risk R-004 thrash].
- No git commit. The code is implemented locally and verified; no commit or push was made.
- No measured benefit number. SA8 banked ZERO benchmarks; the M-H / S-M leverage/effort are structural inference (synthesis/01:36 Wave-1, roadmap GO-evidence caveat). The value is detection + repair of a silent staleness hole, not a benchmarked routing-quality delta.
- The rebuild leg is gated on a sibling subsystem. Facet #2 (Advisor-embedding-staleness-signal) cannot ship until Memory 010-consolidation-cursor-clock lands the idempotent-async primitive. The signal (facet #1) is independent and implemented.
