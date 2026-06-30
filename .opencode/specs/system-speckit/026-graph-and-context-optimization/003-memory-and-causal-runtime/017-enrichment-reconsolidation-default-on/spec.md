---
title: "Feature Specification: Enrichment + Reconsolidation Default-On (Async)"
description: "Flip the three save-time planner-first opt-in flags (post-insert enrichment, save reconsolidation, quality auto-fix) from default-OFF to default-ON with an opt-out env each, and run the post-insert enrichment bundle asynchronously (background) so saves stay fast. Enrichment is what populates the causal/entity graph; running it by default raises graph coverage organically while the async path keeps save latency flat."
trigger_phrases:
  - "post-insert enrichment default on"
  - "enrichment enabled by default"
  - "causal graph coverage low"
  - "async deferred enrichment"
  - "reconsolidation quality-auto-fix default"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on"
    last_updated_at: "2026-06-04T04:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented flags + async enrichment; live-verified"
    next_safe_action: "Validate strict; commit and push"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/post-insert.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "enrichment-default-on-session"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "User directive: all 3 flags default-on (enrichment + reconsolidation + quality-auto-fix), each with opt-out env."
      - "User directive: enrichment runs async/deferred (background) so saves stay fast."
---
# Feature Specification: Enrichment + Reconsolidation Default-On (Async)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three save-time "planner-first" features ship behind opt-in flags that default to OFF
(`isOptInEnabled`): post-insert enrichment (`SPECKIT_POST_INSERT_ENRICHMENT_ENABLED`),
save-time reconsolidation (`SPECKIT_RECONSOLIDATION_ENABLED`), and quality auto-fix
(`SPECKIT_QUALITY_AUTO_FIX`). Because post-insert enrichment is the only path that creates
causal edges + entities + summaries automatically, leaving it off means routine saves create
no graph edges — the causal graph sits at ~3.23% coverage (all 205 edges are `created_by =
'manual'`). The features were deferred for per-save latency (the enrichment bundle embeds a
per-doc summary) and as a staged-rollout gate, not because they are unsafe.

### Purpose
Flip all three flags to default-ON with an opt-out env each (`isOptInEnabled` →
`isFeatureEnabled`, which means "default-on, set `=false` to disable"), and run the post-insert
enrichment bundle **asynchronously** (background `setImmediate` after the commit) so the graph
populates moments after each save without adding latency to the save response. Crash safety is
already provided by `markEnrichmentPending` (written inside the commit transaction) plus the
existing replay/backfill repair path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `lib/search/search-flags.ts`: flip the 3 opt-in helpers to `isFeatureEnabled` + update docstrings.
- New `isPostInsertEnrichmentAsync()` helper (default TRUE; `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` forces synchronous when immediate freshness is required).
- `handlers/memory-save.ts`: run enrichment via background `setImmediate` when async; return the existing `deferred` enrichment status immediately.
- `handlers/save/post-insert.ts`: export a deferred-result builder for the async path.
- Test fallout: tests relying on default-off or synchronous enrichment results.
- Docs: README cluster, `ENV_REFERENCE.md`, skill docs, and feature catalog references to the flag defaults / "deferred by default".

### Out of Scope
- A one-time enrichment backfill of the existing 10,019 docs (separate follow-up; the graph will fill in as docs are re-saved, and the existing scan-lease/replay repair drains pending markers).
- Changing the enrichment algorithm or the decay/FSRS system.
- The z_archive indexing policy (decay already handles archive staleness).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: With no env set, a normal `memory_save` runs post-insert enrichment and quality auto-fix by default. Save reconsolidation stays **opt-in** (`SPECKIT_RECONSOLIDATION_ENABLED=true`) — post-review it was kept opt-in because it gates a destructive merge/deprecate path.
- R2: Each default-on feature is disabled by setting its env to `false`. Caveat: `plannerMode: full-auto` runs enrichment/reconsolidation regardless of the env (the gate is `full-auto || flag`), so the `=false` opt-out applies to the default (`plan-only`/`hybrid`) save path.
- R3: Enrichment does not block the save response; it runs in the background and the response reports `postInsertEnrichment.status = deferred` (executionStatus reason `async-background`).
- R4: A save followed by a crash leaves the row `post_insert_enrichment_status = pending`, recoverable by the existing replay/backfill repair.
- R5: `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` restores synchronous enrichment for callers needing immediate graph freshness.
- R6: Affected save/enrichment/flag suites green; comment hygiene clean; docs reflect default-on + async. (2 pre-existing `handler-memory-index` scan-fixture failures are unrelated — red on HEAD; the full suite was not run to completion.)
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With no env set, a normal `memory_save` runs enrichment + quality auto-fix (reconsolidation opt-in); each default-on feature disables with its `=false` env.
- **SC-002**: Enrichment runs async (response `enrichmentStatus = deferred`); the causal/entity graph gains non-`manual` edges/entities after real saves.
- **SC-003**: Build clean; affected test suites green; `validate.sh --strict` Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Per-save latency from synchronous enrichment | Slower saves | Async background execution (default); save returns immediately. |
| Risk | Lost enrichment if daemon dies before background run | Under-enriched row | `markEnrichmentPending` in the commit tx + existing replay/backfill repair. |
| Risk | Quality-auto-fix rewrites content unexpectedly | Surprising content edits | Documented opt-out env; logic unchanged — only the default flips. |
| Dependency | `isFeatureEnabled` (rollout-policy) for opt-out semantics | — | Already used by the graduated-flag family. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Default-on enrichment must not add latency to the save response — guaranteed by the async background path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

- Daemon recycle mid-enrichment → row stays `pending` → replay/backfill completes it. ✓
- `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` → enrichment runs synchronously (immediate freshness). ✓
- A read immediately after a save may not yet see the new edges (async window) → use SYNC if strict read-after-write graph freshness is required.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

Low. Three one-line flag-helper flips + one async branch (setImmediate) reusing the existing pending-marker/replay machinery; no new persistence or schema.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Resolved post-review: reconsolidation reverted to opt-in (it gates a destructive merge/deprecate path); enrichment + quality-auto-fix remain default-on; enrichment runs async/background.
<!-- /ANCHOR:questions -->
