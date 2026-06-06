---
title: "Implementation Summary: Phase 2: idempotency-and-near-duplicate [template:level_1/implementation-summary.md]"
description: "PLANNED STUB — not started. Phase 2 will add a server-derived idempotency receipt + pre-mutation replay wrapper, an advisory near_duplicate_of, and a last_dedup_checked_at marker. Nothing is implemented yet; this summary is filled when work completes."
trigger_phrases:
  - "memory save idempotency receipt summary"
  - "retry-safe memory write replay"
  - "near_duplicate_of advisory hint"
  - "last_dedup_checked_at dedup marker"
  - "duplicate row on retried save"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate"
    last_updated_at: "2026-06-06T10:10:47Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffold Phase 2 planned-stub impl doc"
    next_safe_action: "Plan or implement T001 receipt table + schema columns"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-idempotency-and-near-duplicate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-idempotency-and-near-duplicate |
| **Status** | Planned (not implemented) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Nothing is implemented yet. This is a planned-stub summary for Phase 2; it is filled in once the work below ships. The plan is to make `memory_save`/`memory_update` retry-safe with a server-derived idempotency receipt, surface near-duplicates as a single non-blocking advisory hint, and stamp a `last_dedup_checked_at` marker so unchanged rows are not rescanned — all riding the existing response envelope with zero added friction.

### Planned: idempotency receipt + replay wrapper

A minimal SQLite idempotency receipt, keyed by a server-derived operation/content/request fingerprint, plus a pre-mutation replay wrapper for `memory_save`/`memory_update`. The intent: an identical retry will replay the prior response with `replayed:true` and create no duplicate row, while a same-key/changed-payload retry will fail closed instead of diverging. Not yet implemented.

### Planned: advisory near-duplicate + dedup marker

A deterministic advisory `near_duplicate_of` (with similarity metadata) computed against a fixed threshold only when an embedding already exists, surfaced as exactly one inline hint via the existing `response-builder.ts` advisory substrate — never a rejection or queue. A `last_dedup_checked_at` marker will short-circuit re-deduping rows whose content has not changed. Not yet implemented.

### Files Changed (planned)

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify (planned) | Add the idempotency-receipt table plus `near_duplicate_of` and `last_dedup_checked_at` columns on `memory_index` via idempotent numbered migrations. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify (planned) | Wire the pre-mutation receipt lookup/replay wrapper into the save path; emit `replayed:true` on identical retry. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modify (planned) | Apply the same receipt replay + fail-closed-on-mismatch behavior to `memory_update`. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts` | Modify (planned) | Add retry-vs-content classification on top of the existing `content_hash` / `checkExistingRow` / `checkContentHashDedup` checks. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | Modify (planned) | Suppress reconsolidation side effects on a replayed write. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts` | Modify (planned) | Record `last_dedup_checked_at` and skip rows unchanged since the marker. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | Modify (planned) | Carry `replayed:true` and the single `near_duplicate_of` hint on the existing response envelope. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify (planned) | Compute `near_duplicate_of` post-embedding and repair deferred vectors via the existing index-scan path; honor `last_dedup_checked_at`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Not started — plan only. The intended rollout puts the idempotency receipt behind a feature flag (default off until retry tests pass) and keeps the near-duplicate hint independently removable, so the write path can revert to pass-through at any point. Delivery details land here once Phase 2 ships.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Keep the receipt minimal (one SQLite table + one transaction, server-derived key only) | Avoids drifting toward HTTP idempotency semantics (sentinel/TTL/poll) that this local single-user phase does not need. |
| Near-duplicate stays advisory-only and deterministic | A fixed-threshold hint never gates a write, so it adds value without friction and needs no LLM judge or review queue. |
| Compute near-duplicate post-embedding only, gated by `last_dedup_checked_at` | Skipping rows without vectors and rows unchanged since the marker avoids noise and redundant rescans. |
| Sequence after Phase 1 and share its pre-mutation guard | Receipt lookup must run before the write; reusing Phase 1's write-ingress hook avoids adding a second hook (`mutation-hooks.ts` is post-write). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this spec folder | Not started — plan only |
| vitest: idempotency receipt replays identical retry (0 duplicate rows) | Not started — plan only |
| vitest: same-key with changed-payload retry fails closed | Not started — plan only |
| Manual: near-duplicate surfaces as one advisory hint, never a rejection | Not started — plan only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Not implemented.** This phase is planned only; nothing in the Files Changed table has been built. Treat every claim here as intended behavior, not shipped behavior.
2. **Depends on Phase 1.** The replay wrapper needs the pre-mutation write-ingress guard introduced in `001-provenance-and-audit`; Phase 2 cannot land cleanly before that hook point exists.
3. **Near-duplicate requires existing embeddings.** Rows without a vector yet are skipped silently; the advisory only appears once an embedding exists, and deferred vectors rely on the existing index-scan repair path.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

