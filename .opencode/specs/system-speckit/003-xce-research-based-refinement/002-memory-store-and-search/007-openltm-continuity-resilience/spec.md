---
title: "009 — OpenLTM Continuity & Session Resilience"
description: "Add low-tech session-resilience surfaces from OpenLTM: a bounded startup restore panel with explicit restored/not-restored status, a PreCompact snapshot that refreshes authored continuity, and a goal/decision/progress/gotcha facet taxonomy — all in our markdown-native continuity ladder."
trigger_phrases:
  - "027 phase 009"
  - "openltm continuity resilience"
  - "bounded startup restore panel"
  - "precompact authored continuity snapshot"
  - "goal decision progress gotcha taxonomy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/007-openltm-continuity-resilience"
    last_updated_at: "2026-06-10T14:35:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented continuity resilience surfaces"
    next_safe_action: "Monitor opt-in snapshot rollout"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md", "mcp_server/tests/openltm-continuity-resilience.vitest.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-08-010-openltm-phase-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Derived from research/010-openltm-memory-architecture-teachings (corrected Priority 4)."
      - "Best architectural fit — OpenLTM's document-ish surfaces map to our markdown-native continuity ladder."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 009 — OpenLTM Continuity & Session Resilience

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 9 (OpenLTM-derived, continuity/resilience) |
| **Predecessor** | `008-openltm-retrieval-observability` |
| **Successor** | None |
| **Source** | `../research/010-openltm-memory-architecture-teachings/research.md` §8 + `sub-packet-proposals.md` (corrected Priority 4) |
| **Handoff Criteria** | Defined during planning; surfaces complement (never replace) the continuity ladder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

OpenLTM-derived continuity phase — the **highest architectural fit** of the OpenLTM study. OpenLTM's "document-ish" surfaces (its bounded startup context block, its PreCompact markdown snapshot, its goal/decision/progress/gotcha facets) map naturally onto our markdown-native continuity ladder (`handover.md`, `implementation-summary.md` `_memory.continuity` frontmatter, spec-folder docs). The critical reshaping from research phase 010: OpenLTM's snapshot is a DB-derived projection ("never the source of truth; the DB is"); ours must instead **refresh the authored continuity docs**, which already are the source of truth.

**Scope Boundary**: additive resilience surfaces over the existing session bootstrap/resume + continuity ladder. No new memory store; no row-based capture.

**Dependencies**: coordinates with `005-learning-feedback-reducers` (the reshaped opt-in doc-patch capture amendment) and the existing session bootstrap/resume hooks.

**Deliverables**: a bounded startup restore panel, an authored-continuity PreCompact snapshot, and a continuity-summary facet taxonomy.

**Changelog**: on close, refresh the matching `../changelog/` entry using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our continuity ladder is richer than OpenLTM's, but it lacks a few low-tech resilience surfaces. Session restore can return unbounded results without telling the user what was *not* restored; there is no durable, plain-markdown snapshot taken before context compaction or hook-cache loss; and continuity summaries have no consistent facet shape, which makes them harder to scan and to fold proposals into.

### Purpose
Make session recovery more trustworthy and crash-resistant by adding a bounded "restored / not-restored" startup panel, a PreCompact snapshot that refreshes the *authored* continuity docs, and a goal/decision/progress/gotcha facet taxonomy — all within the existing markdown continuity ladder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Bounded startup restore panel**: at session start, a fixed-budget summary that explicitly states what continuity was restored and what was omitted/not-restored (with counts), instead of dumping unbounded results.
- **Authored-continuity PreCompact snapshot**: before context compaction (or on hook-cache loss), write/refresh a plain-markdown continuity snapshot that updates the authored ladder docs — it summarizes existing state and mints no new memory.
- **Facet taxonomy**: a goal / decision / progress / gotcha shape for continuity summaries, used to organize the restore panel and any reshaped doc-patch proposals.

### Out of Scope
- Any DB-derived "source of truth" snapshot (OpenLTM's `context-summary.md` model) — rejected; our docs are the truth.
- Auto-minting memories from transcripts/git (row-coupled; see `005` amendment and research §8).
- Changes to retrieval ranking or the index (owned by `008` and `003`).

### Files Changed
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` | Modify | Bounded restore panel with restored/not-restored status + counts. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modify | Startup payload section for bounded restore panel. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` | Modify | Opt-in authored continuity snapshot refresh before compaction cache work. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts` | Modify | Goal/decision/progress/gotcha facet formatter. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/authored-continuity-snapshot.ts` | Create | Markdown-only authored snapshot refresh helper. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/openltm-continuity-resilience.vitest.ts` | Create | Targeted coverage for restore panel, snapshot, cache-loss recovery, facets, and disabled mode. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The startup restore panel is bounded and states what was not restored. | Restore output respects a fixed budget and lists restored vs omitted counts; it never dumps unbounded results. |
| REQ-002 | The PreCompact snapshot refreshes authored continuity docs, not a DB-derived truth surface. | The snapshot updates `handover.md` / `_memory.continuity` (authored ladder); it summarizes existing state and creates no new memory record. |
| REQ-003 | Resilience surfaces complement, never replace, the continuity ladder. | The ladder remains the source of truth; surfaces are additive and degrade safely if absent. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Adopt a goal/decision/progress/gotcha facet taxonomy for continuity summaries. | Restore panel and continuity summaries are organized by the four facets where applicable. |
| REQ-005 | The PreCompact snapshot is resilient to hook-cache loss. | If the richer hook cache is unavailable, the plain-markdown snapshot still provides session-recovery context. |
| REQ-006 | All surfaces are opt-in / safe-by-default. | Enabling the surfaces does not change memory content or the index; they can be disabled without data loss. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A session start produces a bounded restore panel showing restored and not-restored counts.
- **SC-002**: A PreCompact event refreshes the authored continuity snapshot without creating a new memory.
- **SC-003**: After a simulated hook-cache loss, the markdown snapshot still yields usable recovery context.
- **SC-004**: Continuity summaries render with the goal/decision/progress/gotcha facets.
- **SC-005**: Disabling the surfaces leaves the continuity ladder and index unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A snapshot could be mistaken for canonical memory. | Med | Snapshot refreshes authored ladder docs and is explicitly a recovery artifact, not a memory record. |
| Risk | Facet taxonomy could over-structure free-form continuity notes. | Low | Facets are an organizing aid, optional where content does not fit. |
| Dependency | Reshaped opt-in capture amendment in `005-learning-feedback-reducers`. | Low | Doc-patch proposals reuse the same review-at-save gate. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The PreCompact snapshot remains a recovery artifact inside authored ladder docs and does not create a memory row or index mutation.
<!-- /ANCHOR:questions -->
