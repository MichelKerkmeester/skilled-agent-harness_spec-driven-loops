---
title: "Implementation Summary: Enrichment + Reconsolidation Default-On (Async)"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on"
    last_updated_at: "2026-06-04T04:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Flipped 3 flags default-on; added async enrichment; verified"
    next_safe_action: "Validate strict; commit and push"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/post-insert.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/search-flags.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "enrichment-default-on-session"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "All 3 flags default-on with opt-out env; enrichment async/deferred."
---
# Implementation Summary: Enrichment + Reconsolidation Default-On (Async)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Date** | 2026-06-04 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `lib/search/search-flags.ts`: `isSaveReconsolidationEnabled`, `isPostInsertEnrichmentEnabled`, `isQualityAutoFixEnabled` now use `isFeatureEnabled` (default-ON; set the env `=false` to disable). New `isPostInsertEnrichmentAsync()` (default true; `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` forces sync).
- `handlers/save/post-insert.ts`: `PostInsertExecutionReason` gains `async-background`; new exported `buildDeferredEnrichmentResult()` returns an all-deferred result for the async path.
- `handlers/memory-save.ts`: enrichment call site now branches — when enrichment should run AND async, it schedules `runPostInsertEnrichment` via `setImmediate` (records the result + invalidates the entity cache in the callback) and returns the deferred result immediately; otherwise the synchronous path is preserved.
- `tests/search-flags.vitest.ts`: updated to the opt-out contract (default-on, disable-on-false) + an async-default / SYNC-override test.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Inline implementation + a parallel doc-sweep workflow to locate stale doc references. Crash
safety reuses the pre-existing `markEnrichmentPending` (written inside the commit transaction)
plus the replay/backfill repair, so the async path needed no new persistence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Opt-out via `isFeatureEnabled`** rather than a bespoke default — matches the existing graduated-flag family, giving uniform `=false` disable semantics.
- **Async by default** — enrichment embeds a per-doc summary, so synchronous default-on would add real per-save latency; background `setImmediate` keeps saves fast. `SYNC` override retained for callers needing immediate freshness.
- **Quality-auto-fix included** per the user's explicit choice, despite it being the one feature that rewrites saved content; documented opt-out.
- **No bulk backfill** of the 10,019 existing docs in this packet — the graph fills in on re-save and via the existing pending-marker drain.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Build: `npm run build` clean (tsc).
- Flag test: updated `search-flags.vitest.ts` (default-on + async) — see Phase 3.
- Full suite: in progress (fix any default-flip / async-deferral fallout).
- Live: pending — default save defers enrichment; causal edge/entity appears shortly after; disable env opts out.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Existing docs remain unlinked until re-saved or drained by the pending-marker repair; a one-time bulk enrichment backfill is a separate follow-up.
- Async enrichment lands moments after the save, so a read immediately after a save may not yet see the new edges (use `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` if strict read-after-write graph freshness is required).
<!-- /ANCHOR:limitations -->
