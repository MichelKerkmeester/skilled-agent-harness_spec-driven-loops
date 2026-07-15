---
title: "Implementation Summary: Novel Embedding-Drift Monitoring plus Alerting [template:level_2/implementation-summary.md]"
description: "PLANNED scaffold for the embedding-drift monitor. No code is written yet. Records the planned regime fingerprint, the per-regime census and the report-only detector design."
trigger_phrases:
  - "embedding drift monitor status"
  - "mixed vector guard status"
  - "embedding regime fingerprint status"
  - "embedding context version status"
  - "embedding drift detector status"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/004-novel-research/002-novel-embedding-drift-monitor"
    last_updated_at: "2026-07-06T18:49:45.674Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded PLANNED status for the embedding-drift scaffold"
    next_safe_action: "Build the regime fingerprint field on the vector record"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-028-005-020-impl"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is the normalizer fingerprint a hash of the normalizer config or of the normalizer code version"
      - "Does the regime fingerprint share the embedding_context_version field with C1 one-to-one or as a composite component"
    answered_questions:
      - "The detector emits findings and alerts only and never re-embeds or mutates a vector"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-novel-embedding-drift-monitor |
| **Completed** | Not completed (PLANNED scaffold) |
| **Level** | 2 |
| **Status** | PLANNED |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does plus why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Nothing is built yet. This phase is a PLANNED scaffold with `spec.md` and `plan.md` and the Level 2 doc set in place and no code written. The sections below describe the planned capability so a builder can pick it up, not work that has shipped.

### Planned regime fingerprint and census

The plan stamps each chunk vector with a per-chunk regime fingerprint composed of `embedding_context_version` plus the model id plus a normalizer fingerprint, then counts chunks per live fingerprint so the corpus reads as single-regime or mixed-regime. This is the mixed-vector guard the re-index path never specified, and it protects every prod-mode completeRecall@3 read from a regime confound. None of it exists in code today.

### Planned report-only detector and backfill

The plan adds a standing detector that reads the census and fires a report-only finding plus an alert when more than one live regime is present, wired as a drift guard rather than a vector-producing change. A dry-run-then-apply backfill stamps the existing corpus through the additive write path so the census reads a real per-regime count. The detector emits findings and alerts only and never re-embeds or mutates a vector.

### Files Changed

No files are changed yet. The table lists the planned targets and their intended change class.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Planned modify | Add the regime fingerprint fields to the persistent vector record next to the existing PK |
| `.opencode/skills/system-spec-kit/shared/embeddings.ts` | Planned modify | Compute and surface the fingerprint at the embed seam so the stamp matches the cache identity |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/sweep/detect-embedding-drift.ts` | Planned create | The report-only detector that counts live regimes and alerts on a mixed corpus |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/sweep/backfill-embedding-regime.ts` | Planned create | The dry-run-then-apply backfill that stamps the existing corpus |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Not yet delivered. The planned rollout lands the fingerprint field default-off so the existing eval and prod read paths stay byte-identical until the column and census exist. The planned verification is a same-regime byte-identity test plus a seeded two-regime scratch corpus that must fire a mixed-regime alert while a single-regime corpus stays quiet. The backfill is planned to run dry-run first and apply only on an explicit flag.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Keep the detector report-only and floor-bypassing | It emits a census and an alert, not vector rows, so it carries no prod-mode completeRecall@3 claim of its own and is not C2-gated |
| Bind the fingerprint to the same regime inputs the cache key uses | Two chunks of one regime then stamp byte-identical, so the census counts regimes rather than cache-key noise |
| Land the field default-off | The existing read paths stay byte-identical until the column and census are trusted |
| Stamp legacy vectors through a dry-run-then-apply backfill | The additive write path avoids a destructive rewrite and the census reads a real per-regime count rather than a null column |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Strict doc validation (`validate.sh --strict`) | PASS for the doc set, this is the only check run at scaffold stage |
| Same-regime byte-identity test | Not run (PLANNED scaffold) |
| Two-regime scratch corpus alert | Not run (PLANNED scaffold) |
| Backfill dry-run then apply census | Not run (PLANNED scaffold) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Not implemented.** This is a PLANNED scaffold. No fingerprint field, no census, no detector and no backfill exist in code yet.
2. **Legacy corpus reads null until the backfill runs.** Until the planned dry-run-then-apply backfill stamps the existing corpus, the regime column is null and the census reads an unstamped bucket rather than a real per-regime count.
3. **Report-only by design.** The planned detector never re-embeds or remediates a mixed regime. The re-embed itself is the C1 surface at `014-chunk-prefix` behind its own coverage guard.
4. **Two open questions remain.** The normalizer fingerprint source and the one-to-one-versus-composite relationship with the C1 strategy version are unresolved and tracked in `spec.md`.
<!-- /ANCHOR:limitations -->
