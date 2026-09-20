---
title: "Feature Specification: Refero full-set extraction"
description: "Run the proven harness over the entire Refero sitemap to complete the styles library — 1,290 of 1,290 captured with 0 errors, all shape-validated and indexed."
trigger_phrases:
  - "refero full set extraction"
  - "all 1290 styles"
  - "complete styles library"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/010-sk-design-styles-from-refero/003-full-set"
    last_updated_at: "2026-07-18T10:25:46Z"
    last_updated_by: "claude"
    recent_action: "Extracted all 1,290 styles with 0 errors and re-indexed"
    next_safe_action: "Commit the library and sync to v4"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-styles-refero-010-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The full set extracted cleanly (1,290/1,290, 0 errors)."
---

# Feature Specification: Refero full-set extraction

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../002-pilot-batch/spec.md` |
| **Successor** | None; terminal phase of packet 010 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The pilot proved the harness on 50 styles and recorded GO. The remaining ~1,240 styles still needed extracting to make the library complete and useful across sk-design.

### Purpose
Run the harness over the full sitemap to completion — every published style captured in the Extended-only 6-file shape, shape-validated, indexed, and ready to commit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The full-set capture run over all pending styles.
- Final shape validation and a complete `styles/README.md` index.

### Out of Scope
- Harness or template changes (owned by 001/002).
- The utilization of the library (packet 011).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/<slug>/**` | Create | The remaining ~1,240 style folders |
| `.opencode/skills/sk-design/styles/README.md` | Modify | Full 1,290-style index |
| `.opencode/skills/sk-design/styles/_manifest.json` | Modify | All rows captured |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full set captured | All non-error sitemap styles captured; the manifest shows 1,290 `captured`. |
| REQ-002 | Every folder well-formed | Each folder holds the 6-file shape; `design-tokens.json` parses; no `compact/`/`README.md`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Indexed | `styles/README.md` lists all 1,290 with Refero links. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Manifest = 1,290 captured, 0 errors.
- **SC-002**: Shape sweep = 1,290/1,290 clean.
- **SC-003**: `styles/README.md` lists 1,290 styles.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Repo footprint | Medium | 129 MB / 7,744 files committed per the recorded storage decision; dropping `*-canonical.json` is a one-line harness change if size later matters. |
| Dependency | The child-001 harness | Low | Consumed as-is; resumable + idempotent. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; the set is complete. Long-term storage of the canonical JSON is a follow-up if the 129 MB footprint becomes a concern.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Predecessor**: `../002-pilot-batch/spec.md`
- **Library**: `.opencode/skills/sk-design/styles/`
