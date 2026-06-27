---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Planned and scaffolded. A8 surfaces provenance governance fields in the two metadata JSONs and freshness-binds causal_summary to source_docs. Not yet built."
trigger_phrases:
  - "surface provenance fields summary"
  - "source kind json summary"
  - "content type freshness summary"
  - "causal summary source docs status"
  - "metadata json governance status"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/008-surface-provenance-fields"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded the A8 Level 2 docs"
    next_safe_action: "Plan the schema and write-path changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "a8-impl-summary-authoring"
      parent_session_id: "a8-spec-authoring"
    completion_pct: 0
    open_questions:
      - "Whether content_type and document_weight have a compute site to reuse or must be derived fresh"
    answered_questions:
      - "source_kind is already computed and persisted on the memory side"
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
| **Spec Folder** | 008-surface-provenance-fields |
| **Completed** | pending |
| **Level** | 2 |
| **Status** | PLANNED |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is planned and scaffolded only. Nothing has been built yet. The docs below describe the intended change so a later session can pick it up without re-deriving the seams from the research.

### Intended: Surfaced provenance fields

The memory side already computes `source_kind` and provenance for every saved row, but the two metadata JSONs never expose them. The intended change adds `source_kind`, a `provenance` block and `content_type` to the description schema, and `document_weight` plus a freshness block to the graph schema. The plan reads the persisted `source_kind` rather than recomputing it, so a logic and governance reader gains an honest provenance signal with no re-index.

### Intended: causal_summary freshness binding

The graph schema ships `causal_summary` and `source_docs` but does not couple them, so a summary can silently outlive its sources. The intended change binds freshness so a `causal_summary` older than the newest `source_docs` mtime is flagged stale, an empty `source_docs` is vacuously current, and an unavailable mtime is unknown not stale.

### Files Changed

No files changed yet. The table lists the planned targets.

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts | Planned Modify | Add source_kind, provenance, content_type optional fields |
| .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts | Planned Modify | Add document_weight and freshness fields, bind causal_summary to source_docs |
| .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts | Planned Modify | Populate the new fields at the atomicWriteJson write seam |
| .opencode/skills/system-spec-kit/scripts/validation/content-quality.ts | Planned Modify or Create | Add a warn-tier provenance coherence check |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The planned approach lands the fields additive and optional at the existing write seam, holds the warn-tier check default-off so the legacy corpus never breaks, and gates retrieval fusion out of scope behind the C2 prod-mode gate. Verification will run validate.sh strict plus a stale and fresh freshness fixture.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the persisted source_kind, never recompute it | The memory side already owns the compute, A8 only surfaces the value |
| Land fields additive, optional and warn-tier first | Keeps the legacy live-root corpus parsing without a new hard failure |
| Keep retrieval fusion out of scope | Any retrieval input must pass the C2 prod-mode gate first, which is a separate phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not run yet. This phase is a scaffold.

| Check | Result |
|-------|--------|
| validate.sh strict on the phase folder | PENDING |
| zod parse of generated and legacy JSON | PENDING |
| stale vs fresh causal_summary fixture | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This phase is planned and scaffolded only, no code or schema change exists yet.
2. **Open compute-site question.** Whether `content_type` and `document_weight` have a reuse compute site or must be derived on-write is unresolved, the plan derives on-write as the fallback.
<!-- /ANCHOR:limitations -->
