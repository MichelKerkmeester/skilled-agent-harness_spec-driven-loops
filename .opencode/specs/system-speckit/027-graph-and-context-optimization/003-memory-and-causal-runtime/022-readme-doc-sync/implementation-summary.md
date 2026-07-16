---
title: "Implementation Summary: Save-Handler README Doc-Sync"
description: "Synced handlers/save/README.md to packet 017's shipped behavior: post-insert enrichment is now documented as default-on and async/deferred-by-default, with SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true as the forced-sync escape hatch. Docs-only, three surgical edits, no code touched."
trigger_phrases:
  - "readme doc sync summary"
  - "post-insert enrichment default-on docs"
  - "async deferred enrichment readme synced"
  - "save handler readme updated"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/022-readme-doc-sync"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Applied 3 surgical README edits (§5/§6/§7); validated strict"
    next_safe_action: "Done. Committed 01d666985c"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-doc-sync-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-readme-doc-sync |
| **Completed** | 2026-06-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `handlers/save/README.md` now tells the truth about post-insert enrichment. It used to call
enrichment "optional" and imply it ran inline during the save. After packet 017 shipped, that
was wrong: enrichment is default-on and runs async/deferred by default. This sync brings the
README back in line with the code so anyone reading it builds the right mental model of when
graph and entity data actually appears.

### Default-on async enrichment, documented correctly

You can now read the save-handler README and know that a normal save returns immediately with
`enrichmentStatus: deferred`, and that a bounded background scheduler runs the enrichment steps
(causal links, entities, summaries, entity linking, graph lifecycle) after commit. The README
also tells you the escape hatch: set `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` to force
synchronous enrichment when you need the graph fresh inside the same save response. Three
sections were touched: §7 ENTRYPOINTS (the `runPostInsertEnrichment()` row), §6 main-flow box,
and the §5 KEY FILES `post-insert.ts` row.

Reconsolidation wording was deliberately left alone. The README already correctly calls it
"optional", and in the live code it stays opt-in via `SPECKIT_RECONSOLIDATION_ENABLED`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md` | Modified | §5/§6/§7 reworded to default-on async/deferred enrichment with the SYNC override |
| `.opencode/specs/.../022-readme-doc-sync/spec.md` | Created | Level 1 spec for the doc-sync |
| `.opencode/specs/.../022-readme-doc-sync/plan.md` | Created | Plan for the doc-sync |
| `.opencode/specs/.../022-readme-doc-sync/tasks.md` | Created | Task breakdown |
| `.opencode/specs/.../022-readme-doc-sync/implementation-summary.md` | Created | This summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Before editing, the flag defaults were re-confirmed directly in code (not assumed): grep +
read of `isPostInsertEnrichmentEnabled`, `isPostInsertEnrichmentAsync`,
`isReconsolidationEnabled`, `scheduleBackgroundEnrichment`, and `buildDeferredEnrichmentResult`
across `lib/search/search-flags.ts`, `handlers/save/post-insert.ts`, and
`handlers/memory-save.ts`. Then three surgical Edit-tool changes were applied to the README. The
§6 ASCII flow box was re-padded so the new two-line content aligns to the existing box border.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Left reconsolidation wording untouched | The README already correctly says "optional"; reconsolidation is opt-in (`SPECKIT_RECONSOLIDATION_ENABLED`) in code, so no change was warranted. |
| Did not document `enrichment-state.ts` | The unlisted-file gap is intentionally out of scope per the request; adding it would be scope creep. |
| Re-verified env-flag name in code before writing | Avoids inventing a flag name; `SPECKIT_POST_INSERT_ENRICHMENT_SYNC` is the exact name in `search-flags.ts`. |
| Scoped the graph-metadata backfill with `--root <packet>` | A global run throws on a pre-existing malformed sibling (`skilled-agent-orchestration/125-.../graph-metadata.json`); scoping keeps the backfill to this packet only. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Flag defaults confirmed in live code | PASS - `isPostInsertEnrichmentEnabled()` → `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` via `isFeatureEnabled` (default TRUE); `isPostInsertEnrichmentAsync()` = `!isOptInEnabled('SPECKIT_POST_INSERT_ENRICHMENT_SYNC')` (default async; SYNC=true forces sync) |
| Async wiring confirmed | PASS - `handlers/memory-save.ts` calls `scheduleBackgroundEnrichment(id, ...)` + `buildDeferredEnrichmentResult('async-background')` when async; bounded via `MAX_BACKGROUND_ENRICHMENTS` + queue, `setImmediate` |
| Reconsolidation untouched | PASS - no edits to reconsolidation wording; stays opt-in (`SPECKIT_RECONSOLIDATION_ENABLED`) |
| Scope lock | PASS - only `handlers/save/README.md` + packet docs changed; no code, no other READMEs, `enrichment-state.ts` untouched |
| §6 ASCII box alignment | PASS - new content lines padded to 45 codepoints matching the existing box border |
| `validate.sh --strict` | PASS - see VALIDATION EVIDENCE below |
<!-- /ANCHOR:verification -->

### VALIDATION EVIDENCE

`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/022-readme-doc-sync --strict`

Result: PASSED. Exit 0, Errors: 0, Warnings: 0 (all 11 checks green, including TEMPLATE_HEADERS and GRAPH_METADATA_PRESENT). The tasks.md Phase 1 header was restored to the canonical "Phase 1: Setup" to satisfy TEMPLATE_HEADERS (initial run flagged a renamed header as the only error).

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The unlisted `enrichment-state.ts` file is still not documented in this README.** That gap is intentionally out of scope for this packet; it remains a candidate for a future doc-sync.
2. **No code or test changes.** This packet only re-aligns documentation with already-shipped behavior (packet 017).
<!-- /ANCHOR:limitations -->
