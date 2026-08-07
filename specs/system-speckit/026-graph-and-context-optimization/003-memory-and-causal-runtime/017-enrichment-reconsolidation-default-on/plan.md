---
title: "Implementation Plan: Enrichment + Reconsolidation Default-On (Async)"
description: "Flip three save-time planner-first flags to default-on (opt-out env each) and run the post-insert enrichment bundle async/background so saves stay fast while the causal/entity graph populates."
trigger_phrases:
  - "enrichment default on plan"
  - "async enrichment implementation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on"
    last_updated_at: "2026-06-04T05:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented flags + async enrichment; live-verified"
    next_safe_action: "Validate strict; commit and push"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "enrichment-default-on-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Enrichment + Reconsolidation Default-On (Async)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Flip three save-time planner-first flags from default-OFF (`isOptInEnabled`) to default-ON
(`isFeatureEnabled`, i.e. set `=false` to disable), and run the post-insert enrichment bundle
asynchronously so saves stay fast. Net effect: routine `memory_save` now auto-populates the
causal/entity graph (raising coverage from the ~3.23% manual-only baseline) without a per-save
latency cost.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `npm run build` (tsc) clean.
- Full mcp_server vitest suite green (fix fallout from the default flip).
- Comment hygiene clean on changed code.
- Live: enrichment runs by default on a real save; save returns immediately (deferred status); causal edge appears moments later. Disable env restores opt-out.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- `lib/search/search-flags.ts` — `isSaveReconsolidationEnabled`, `isPostInsertEnrichmentEnabled`, `isQualityAutoFixEnabled` switch from `isOptInEnabled` → `isFeatureEnabled`. New `isPostInsertEnrichmentAsync` (`!isOptInEnabled('SPECKIT_POST_INSERT_ENRICHMENT_SYNC')`, default true).
- `handlers/save/post-insert.ts` — extend `PostInsertExecutionReason` with `async-background`; export `buildDeferredEnrichmentResult()`.
- `handlers/memory-save.ts` — at the enrichment call site, when `shouldRunPostInsertEnrichment(plannerMode) && isPostInsertEnrichmentAsync()`, schedule `runPostInsertEnrichment` via `setImmediate` (record result + invalidate entity cache in the callback) and return the deferred result immediately; else keep the synchronous path. Crash safety relies on the existing `markEnrichmentPending` (written inside the commit tx) + replay/backfill repair.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Flip the 3 flag helpers + add the async helper + update docstrings.
2. Add the deferred-result builder + reason variant.
3. Wire the async branch into the save path.
4. Build; fix test fallout (default-flip + async deferral).
5. Doc sweep (workflow) + apply doc updates.
6. Validate + commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `search-flags.vitest.ts`: assert the 3 flags default ON, disable on `=false`, and async default + SYNC override.
- Full suite: confirm no regression from default-on enrichment/reconsolidation/auto-fix or async deferral.
- Live MCP: save a real doc → response shows enrichment deferred; verify a causal edge / entity appears shortly after.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Existing enrichment lifecycle: `markEnrichmentPending`, `recordEnrichmentResult`, replay/backfill repair (`repairEnrichmentOnReplay`).
- `isFeatureEnabled` (rollout-policy) for opt-out semantics.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED=false`, `SPECKIT_RECONSOLIDATION_ENABLED=false`,
`SPECKIT_QUALITY_AUTO_FIX=false` on the daemon to restore the prior opt-out behavior without a
code change. Full revert = restore `isOptInEnabled` in the 3 helpers + remove the async branch.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phases are mostly linear: flags (1) → deferred-result builder (2) → async wiring (3) → build + test fallout (4) → doc sweep (5) → validate + commit (6). The doc sweep (5) runs in parallel with the test fallout (4).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Small. ~3 source files (search-flags, post-insert, memory-save) + 2 test files + ENV_REFERENCE/feature_catalog doc edits. No schema or new persistence.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Operational (no deploy):** set the three `SPECKIT_*=false` envs on the daemon to restore opt-out behavior; set `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` to fall back to synchronous enrichment.
- **Code revert:** restore `isOptInEnabled` in the three helpers and remove `isPostInsertEnrichmentAsync` + the async branch in memory-save.ts (the `buildDeferredEnrichmentResult` export is inert if unused).
- **Data:** no migration; existing `post_insert_enrichment_status` markers remain valid either way.
<!-- /ANCHOR:enhanced-rollback -->
