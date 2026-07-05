---
title: "Feature Specification: Phase Documentation Map and Completion-Pct Sync"
description: "Backfill 40 stale Phase Documentation Map rows (stuck 'Draft' despite Complete children) across 6 phase-parents, and 40 stale completion_pct:0 continuity blocks (research had estimated 143; ground-truth file count at implementation time was 40), plus a reusable sync script to prevent recurrence."
trigger_phrases:
  - "phase documentation map sync"
  - "completion pct backfill"
  - "stale draft status rows"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/009-research-backlog-remediation/004-phase-doc-map-and-completion-pct-sync"
    last_updated_at: "2026-07-01T07:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from research.md F-001/G-001 and F-003 (Tier1 #6,#7)"
    next_safe_action: "Author plan.md and tasks.md, then dispatch implementation to MiMo v2.5 ultraspeed"
    blockers: []
    key_files:
      - "002-deep-loop-runtime/spec.md"
      - "003-deep-loop-workflows/spec.md"
      - "004-system-spec-kit/spec.md"
      - "005-skill-interconnection/spec.md"
      - "006-ux-observability-automation/spec.md"
      - "007-testing/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase Documentation Map and Completion-Pct Sync

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 |
| **Predecessor** | 003-runtime-hygiene-fixes |
| **Successor** | 005-packet-identity-cleanup |
| **Handoff Criteria** | All 40 Phase Documentation Map rows across phases 002-007 match their children's real status; all stale `completion_pct:0` continuity blocks backfilled; a reusable sync script exists |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every phase-parent 002-007 has a "Phase Documentation Map" table in its `spec.md` whose Status column still reads "Draft" for every child row, even though (a) the parent's own header METADATA claims Status=Complete/completion_pct=100, and (b) every child's own `spec.md` independently claims Status=Complete with a matching, verified `implementation-summary.md`. This was a one-time scaffold-generation default that was never synced after children shipped — confirmed across 40 total child rows in `research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-001/G-001). Separately, grandchild `spec.md` files carry a stale `_memory.continuity.completion_pct: 0` in frontmatter while the document body and `implementation-summary.md` say 100 — the same class of never-synced-after-completion drift, in a different field (§4.2, F-003). Research estimated this count at 143; the implementation's own scoped scan of the real file tree under phases 002-007 found the actual count to be 40 — the research estimate did not hold up against ground truth and was corrected during implementation rather than forced to match.

### Purpose
Backfill both classes of drift now, and add a small, reusable, idempotent script that reads each phase-parent's children `implementation-summary.md` for real completion state and syncs it into (a) the parent's Phase Documentation Map table and (b) each grandchild's own continuity `completion_pct` field — so this doesn't silently regress the next time a phase ships.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A script (e.g. `.opencode/skills/system-spec-kit/scripts/spec/sync-phase-map-status.ts` or similar, colocated with existing spec-kit scripts) that, given a phase-parent folder: (a) enumerates its `[0-9]{3}-*/` children, (b) reads each child's own Status (from its `spec.md` METADATA table or `implementation-summary.md` completion_pct), (c) rewrites the parent's Phase Documentation Map Status column to match, and (d) rewrites each child's own frontmatter `completion_pct` to match its actual `implementation-summary.md` value when they disagree.
- Run the script (or the manual equivalent) against phases 002, 003, 004, 005, 006, 007 now, backfilling all 40 rows.
- Backfill the remaining stale `completion_pct: 0` continuity blocks the script doesn't directly touch (e.g. non-phase-map-row files, if any) by direct edit.
- Idempotency: running the script twice in a row produces no further changes the second time.

### Out of Scope
- Building this as part of the formal Tier 3 `validate.sh --strict --semantic` check set (that's a separate, deferred phase) — this script is a one-off/rerunnable *fix* tool, not a *detection* gate. They can share logic later, but this phase only needs the fix.
- Touching phase 008 or 009's own phase-map (008 was already corrected during this remediation phase's own scaffolding; 009 is this phase itself and updates its own map as children complete).
- The root packet's own `completion_pct` rollup mismatch (that was already corrected as part of scaffolding this remediation phase).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/spec/sync-phase-map-status.ts` (new) | Create | Reusable sync script |
| `030-deep-loop-improved/{002..007}/spec.md` | Modify | Phase Documentation Map Status columns |
| `030-deep-loop-improved/{002..007}/**/spec.md` (143 grandchildren, revised count) | Modify | `completion_pct` frontmatter field |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 40 Phase Documentation Map rows across 002-007 match real child status | Manual/scripted diff shows zero "Draft" rows for any child whose own spec.md says Complete |
| REQ-002 | All stale `completion_pct: 0` continuity blocks backfilled | Grep for `completion_pct: 0` combined with a sibling `implementation-summary.md` showing 100 returns zero hits under 002-007 |
| REQ-003 | The sync script is idempotent | Running it twice in a row produces a no-op diff the second time |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The script handles a not-yet-complete child gracefully (doesn't force a false "Complete") | Test: a child whose own status is genuinely "In Progress" is left as "In Progress" in the parent map, not overwritten to Complete |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --recursive` on the root packet shows no new errors introduced by this backfill.
- **SC-002**: Script has at least one unit test covering the "leave in-progress children alone" case (REQ-004) and the "sync a stale Draft row" case (REQ-001).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Scope | 143 file edits is a wide blast radius for one phase | Higher chance of an unintended edit | Script-driven, idempotent, diffable before commit; spot-check a sample of edited files manually before calling this phase done |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by the confirmed drift in `research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-001/G-001, F-003).
<!-- /ANCHOR:questions -->
