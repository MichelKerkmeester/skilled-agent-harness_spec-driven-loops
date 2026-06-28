---
title: "Feature Specification: Phase 7: memory-reindex"
description: "Re-index spec-memory for packets 157 + 158 so the renamed-skill content is indexed under the new name and the 83 stale sk-prompt-small-model rows from the live packets clear (archived rows stay)."
trigger_phrases:
  - "memory reindex sk-prompt-models"
  - "stale spec-memory rename"
  - "memory_index_scan 157 158"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename/007-memory-reindex"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded; not started"
    next_safe_action: "Run memory_index_scan on 157 + 158"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/007-memory-reindex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: memory-reindex

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Not Started (Planned) |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 (review-remediation) |
| **Predecessor** | 006-regenerate-verify |
| **Successor** | 008-graph-symmetry-cleanup |
| **Handoff Criteria** | The live 157/158 packet docs are re-indexed under their renamed content; no live-packet memory row references the old skill name |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **review-remediation phase** of the sk-prompt-models-rename packet, addressing review rec **R1**. The 10-iteration MiMo deep review (`158/review/`) found that the spec-memory `context-index.sqlite` still holds **83 rows** referencing `sk-prompt-small-model`.

**Scope Boundary**: Re-index the LIVE packets whose content was renamed (157 + 158). Archived rows (the `z_archive/114-…` rename packet whose titles legitimately document the old-old → old rename) STAY as history — they are not re-indexed.

**Dependencies**:
- The rename (phases 2–6) is complete; the spec docs now say `sk-prompt-models`.
- `memory_index_scan` (Spec Kit Memory MCP) or `memory_save`.

**Deliverables**:
- 157 + 158 packet docs re-indexed so their stored memory rows reflect the renamed content.

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-memory index was built before the rename, so the live packets' rows (157 GLM-5.2, 158 rename) still carry pre-rename content / paths referencing `sk-prompt-small-model`. A memory search may surface stale old-name titles or miss the renamed docs. Phase 6 listed `memory_index_scan` as a deliverable but it was not actually executed (honest gap surfaced by review rec R1).

### Purpose
Refresh the spec-memory index for the live renamed packets so retrieval reflects `sk-prompt-models`, while leaving the archived rename-history rows untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `memory_index_scan` (or equivalent) on `157-glm-5-2-support` and `158-sk-prompt-models-rename`.
- Confirm the live-packet rows no longer reference the old name.

### Out of Scope
- The archived `z_archive/114-small-ai-model-optimization/**` rows — frozen history (they document the prior rename and correctly name the old skill).
- Any content edit (the docs are already renamed; this only refreshes the index).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/mcp_server/database/context-index.sqlite` (+ vectors) | Regenerate | Re-indexed via `memory_index_scan`; not hand-edited |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Re-index 157 + 158 | `memory_index_scan({ specFolder })` succeeds for both packets |
| REQ-002 | Live-packet rows refreshed | A memory query for 157/158 returns rows whose content says `sk-prompt-models`, not the old name |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Archived rows untouched | The `z_archive/114-…` rename-history rows still name the old skill (not re-indexed) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `context-index.sqlite` query scoped to the live 157/158 packets returns 0 rows referencing `sk-prompt-small-model`.
- **SC-002**: A `memory_search` for the renamed skill surfaces the new-name docs.
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** the re-index, **When** `context-index.sqlite` is queried for spec_folder LIKE '%157%' OR '%158%' with old-name content, **Then** 0 rows.
- **Given** a memory search for "sk-prompt-models", **When** run, **Then** the renamed profiles/registry docs surface.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Re-indexing the archived packets too | Falsifies history (old name should stay there) | Scope the scan to 157 + 158 only |
| Risk | Memory daemon unavailable | Cannot re-index | Use `memory_index_scan` MCP; exit 75 is retryable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm whether a packet-scoped `memory_index_scan` is sufficient or a broader rescan is wanted (default: packet-scoped to 157 + 158).
<!-- /ANCHOR:questions -->
