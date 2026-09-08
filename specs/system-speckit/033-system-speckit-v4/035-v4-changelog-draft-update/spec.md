---
title: "Feature Specification: v4 changelog draft update"
description: "Bring the v4.0.0.0 changelog draft in the parent folder into line with the repository, applying every confirmed drift row from the state inventory research and adding the late-cycle work the draft predates."
trigger_phrases:
  - "v4 changelog draft update"
  - "changelog rewrite from confirmed drift"
  - "release notes corrections"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/035-v4-changelog-draft-update"
    last_updated_at: "2026-09-08T20:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Applied the confirmed corrections to the draft and closed the packet"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-08-v4-state-inventory"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: v4 changelog draft update

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-system-speckit-v4 |
| **Phase** | 35 of 35 |
| **Predecessor** | 034-v4-state-inventory-research |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`../CHANGELOG-v4.0.0.0.md` described a memory engine, an `/interface:*` family, an alignment mode, a prompt hub and an owner-first branch grammar that the release does not ship, and said nothing about the memory decommission, the runtime rename, the simplification program, the recorded-findings closure or the CI hardening that landed after it was drafted.

### Purpose
Every row of `../034-v4-state-inventory-research/research/confirmed-drift.md` is applied to the draft at its cited line, the late-cycle work is described in the draft's own voice, and the unverified numbers it carried are removed rather than restated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Surgical replacements in `../CHANGELOG-v4.0.0.0.md` for the seventeen confirmed rows and the three dropped findings
- New paragraphs for the memory decommission, runtime rename, completion-gate coherence, simplification and closure programs, CI mirror parity, the goal-resync rule and the design commands
- Frontmatter trigger phrases for the draft

### Out of Scope
- Restyling the draft's existing prose or restructuring its sections
- Publishing the release or moving the file out of the parent folder

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../CHANGELOG-v4.0.0.0.md` | Modify | Corrections and additions from the confirmed drift table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | No stale name from the confirmed table survives in the draft except inside a sentence that describes its removal |
| REQ-002 | Every late-cycle packet from the parent timeline (017 to 034) is reflected in the draft |
| REQ-003 | Numbers the research could not reproduce are removed or softened |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg` for each stale name in the draft returns only lines that describe the removal
- **SC-002**: The parent validates strict with this child present
<!-- /ANCHOR:success-criteria -->
