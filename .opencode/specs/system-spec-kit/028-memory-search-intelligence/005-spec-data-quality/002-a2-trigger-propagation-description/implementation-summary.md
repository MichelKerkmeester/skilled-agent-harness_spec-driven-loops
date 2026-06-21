---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will populate description.json trigger_phrases from curated frontmatter plus a derived extractive set, derive a real description over the title copy, and raise the derive cap to 12. No code change has landed."
trigger_phrases:
  - "trigger propagation description"
  - "extractive description derive"
  - "description json triggers"
  - "extractTriggersFromContent cap"
  - "subset coherence triggers"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/002-a2-trigger-propagation-description"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase impl doc for A2 trigger-propagation scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 002-a2-trigger-propagation-description |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Trigger propagation into description.json

The phase will populate the `trigger_phrases` field in `generatePerFolderDescription`, which today builds the record with `description` and `keywords` but never writes the curated triggers. It will merge the curated frontmatter `trigger_phrases` with the derived extractive set, deduplicate them, and cap the result at 12. The curated set fills first and the derived set fills the remaining slots, so no curated trigger is dropped under the cap. The retrieval and adherence readers then see the curated trigger vocabulary in the JSON instead of a missing field.

### Real derived description over the title echo

The phase will demote the verbatim title-copy in `extractDescription` Pass 1 to a last-resort fallback, so a Problem or Purpose line wins when present. Today the description is a byte copy of the first `# ` heading, which the live sibling `005/description.json` proves by reading back its own spec title. After the change a folder with a Problem Statement yields a description that is not byte-equal to its heading, and a folder with neither line still falls back to the documented title copy.

### Derive-cap alignment and subset coherence

The phase will raise the `extractTriggersFromContent` cap from 8 to 12 so the derive helper and the propagation cap agree on the same ceiling. It will also add a subset coherence check that asserts the curated set is a subset of the propagated set rather than byte equality, since the derived set is capped and the two sets may differ.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Planned modify | Populate `trigger_phrases` in `generatePerFolderDescription`, demote the title-copy in `extractDescription` to a fallback, read curated frontmatter triggers from spec.md |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts` | Planned modify | Raise the `extractTriggersFromContent` cap from 8 to 12 to match the propagation cap |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Planned confirm | Confirm `trigger_phrases` validation tolerates the populated capped array, no schema break since the field is already declared |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned rollout runs the derive and propagation inside the existing single spec.md read in `generatePerFolderDescription`, so it adds no extra file I/O per folder. The proof of confidence is a regeneration of `005/description.json` that shows a populated trigger superset and a non-title-echo description, plus an idempotence pass where a second regeneration over an unchanged spec.md yields identical output. A2 is a write-time metadata fix that bypasses the retrieval floor, so it makes no ranking or promotion claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fill curated triggers first, then the derived set | The curated set is the authority, so filling it first keeps every curated trigger under the cap while the derived set only fills the remainder |
| Demote the title-copy to a fallback rather than delete it | A folder whose only signal is its title still needs a description, so the title-copy stays as the documented last resort |
| Assert subset coherence rather than byte equality | The derived set is capped and may differ from the curated set, so equality would false-fire while subset coherence holds the real invariant |
| Keep the derive path in `generatePerFolderDescription` | The shared safe-fix engine reuses this logic, so a single home avoids validator-writer divergence |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet.

| Check | Result |
|-------|--------|
| Regenerating `005/description.json` writes a `trigger_phrases` superset of its curated set | PLANNED, not yet run |
| The regenerated description is not a verbatim copy of the first `# ` heading | PLANNED, not yet run |
| The derive cap and the propagation cap both read 12 | PLANNED, not yet run |
| The subset coherence assertion passes against a folder with curated triggers | PLANNED, not yet run |
| A second regeneration over an unchanged spec.md yields identical output | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Curated set at the cap.** A curated set already at 12 leaves no room for the derived contribution, so the propagated set is the curated set alone by design.
3. **Open ordering question.** Whether the curated triggers sort ahead of the derived set or interleave by relevance when both fit under the cap is unresolved.
<!-- /ANCHOR:limitations -->

---
