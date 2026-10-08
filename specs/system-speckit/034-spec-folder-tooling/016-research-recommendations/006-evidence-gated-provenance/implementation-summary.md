---
title: "Implementation Summary"
description: "Phase 6 is planned but not yet built."
trigger_phrases:
  - "evidence gated provenance implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "planning-author"
    recent_action: "Planned the phase"
    next_safe_action: "Build against goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-evidence-gated-provenance |
| **Status** | Planned |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status**: Planned but not yet built.

When built, this phase will make template version stamping evidence-gated so no document receives a stamp without an exact match against the anchor set rendered for its level. It will retire check-template-staleness.sh --auto-upgrade and remove the dead quality-audit.sh --fix call.

### Phase 6: evidence-gated-provenance

The implementation will modify four files to enforce the never-invent-history rule. check-template-staleness.sh replaces --auto-upgrade with a "removed, use upgrade-legacy" message and exit 2. quality-audit.sh drops its dead --fix call. heal-spec-docs.cjs requires an exact level match for stamping. MIGRATION.md states the policy. No marker is added to unknown-provenance documents.

### Files to be Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh` | Modify | Retire --auto-upgrade with a one-release loud failure |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh` | Modify | Remove the dead --fix call |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Exact match against the level's rendered anchor set |
| `.skilled/skills/system-spec-kit/templates/MIGRATION.md` | Modify | Document never-invent-history rule |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Will Be Delivered

When this phase is built, it will be verified through:
- Vitest tests for exact vs superset anchor matching
- Running `validate.sh --strict` on this spec packet
- A test that --auto-upgrade prints its removal message, exits 2 and writes nothing
- Manual tracing of a markerless document to verify unknown provenance is preserved
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Decisions

| Decision | Status |
|----------|--------|
| Retire or restrict --auto-upgrade | Decided 2026-10-08 by the operator: retire, with a one-release "removed, use upgrade-legacy" exit 2 |
| Marker for unknown provenance | Decided 2026-10-08 by the operator: none |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification Checklist

When complete, this phase will verify:

| Check | Target |
|-------|--------|
| Signature matching | Exact equality against the level's rendered anchor set |
| Auto-upgrade behavior | Prints the removal message, exits 2, writes nothing |
| Unknown provenance | Markerless and old documents stay unknown |
| Spec validation | validate.sh --strict passes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Not Yet Applicable

This is a planned phase. Limitations are tracked in spec.md and acceptance-criteria.md.
<!-- /ANCHOR:limitations -->

---

