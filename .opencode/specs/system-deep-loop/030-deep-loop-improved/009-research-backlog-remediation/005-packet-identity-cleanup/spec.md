---
title: "Feature Specification: Packet Identity Cleanup"
description: "Clean up live (non-historical) references to the packet's pre-migration names (123-agent-loops-improved, 156-agent-loops-improved) and remove the abandoned native review lineage's stale lock."
trigger_phrases:
  - "packet identity cleanup"
  - "old packet number cleanup"
  - "stale native review lock"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/005-packet-identity-cleanup"
    last_updated_at: "2026-07-01T07:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from research.md F-011, F-007 (Tier1 #8,#12)"
    next_safe_action: "Author plan.md and tasks.md, then dispatch implementation to MiMo v2.5 ultraspeed"
    blockers: []
    key_files:
      - "review/lineages/native/.deep-review.lock"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Packet Identity Cleanup

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 |
| **Predecessor** | 004-phase-doc-map-and-completion-pct-sync |
| **Successor** | 006-review-registry-and-metadata-backfill |
| **Handoff Criteria** | No live navigational field (Parent Spec/Successor/Predecessor) references the pre-migration packet names; the stale native lock is removed and the lineage archived |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet was migrated from `skilled-agent-orchestration/123-agent-loops-improved` to `system-deep-loop/030-deep-loop-improved` (with an intermediate/parallel name `156-agent-loops-improved` also in circulation per trigger_phrases and the native lock file). A repo-wide check (`grep -rl "123-agent-loops-improved"`, excluding the archived research snapshot) found **16 files** still referencing the old name — more than the 14 originally estimated, and confirmed to include the older `156-` variant too (`review/lineages/native/.deep-review.lock`'s `packet_id` field is literally `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved`, a name that doesn't exist anywhere in this repo anymore). Some of these are legitimate historical citations (changelog files documenting real commit history, `timeline.md`, the archived `review/lineages/glm/review-report.md`); others are live navigational fields (`Parent Spec`, `Successor`, `Predecessor` in phase `spec.md` files) that should point at the current packet name (`research/research_archive/20260701T071133Z-gen1/research.md` §4.2, F-011).

Separately, `review/lineages/native/.deep-review.lock` shows `last_heartbeat_iso == started_at_iso` (never re-heartbeated after acquisition — the review crashed after iteration 1) with a 5-minute TTL, now stale for well over a day. No TTL sweeper currently reclaims dead locks like this (§4.2, F-007).

### Purpose
Distinguish and fix the LIVE old-name references (navigational fields that should track the current packet) from the HISTORICAL ones (changelogs/timeline, which correctly document what actually happened and should NOT be rewritten); remove the stale native lock and archive that abandoned lineage.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all 16 files referencing `123-agent-loops-improved` and/or `156-agent-loops-improved`; classify each hit as LIVE (navigational field: `Parent Spec`, `Successor`, `Predecessor`, or any field a reader would use to navigate right now) or HISTORICAL (changelog entries, timeline.md, archived review reports documenting what a commit message or a prior session actually said).
- Fix every LIVE hit to reference the current packet path (`system-deep-loop/030-deep-loop-improved`).
- Leave every HISTORICAL hit untouched — do not rewrite history.
- Remove the stale `review/lineages/native/.deep-review.lock` and move/archive the `native/` lineage folder (it produced zero real output — one config file, one empty iteration, no findings — so nothing of value is lost).

### Out of Scope
- Building a general TTL-sweeper for future stale locks (that's Tier 2 hardening scope territory, not named as an item in this specific Tier 1 backlog entry — flag it as a related-but-separate idea in the implementation summary if it comes up, don't build it here).
- Any content changes to the changelog/timeline files themselves beyond confirming they should stay as-is.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `030-deep-loop-improved/{001,002,003,004,005,006,007}/spec.md` (LIVE hits only) | Modify | Fix navigational field references to the old packet name |
| `review/lineages/native/.deep-review.lock` | Delete | Stale, dead lock |
| `review/lineages/native/` | Move | Archive to e.g. `review/lineages_archive/native-abandoned-<date>/` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every LIVE old-name reference is fixed | `grep -rn "123-agent-loops-improved\|156-agent-loops-improved"` across all phase `spec.md` navigational fields (Parent Spec/Successor/Predecessor lines specifically) returns nothing |
| REQ-002 | Every HISTORICAL reference is explicitly left alone | Implementation summary lists each historical hit and states why it was NOT changed |
| REQ-003 | The stale native lock is gone and the lineage archived, not silently deleted | `review/lineages/native/.deep-review.lock` no longer exists at its original path; the `native/` folder's content is preserved somewhere under an `_archive`-style path |

### P1 — Required (complete OR user-approved deferral)

None beyond P0 for this small phase.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero LIVE-field hits for either old name variant.
- **SC-002**: `validate.sh` on each touched phase folder still passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Judgment call | LIVE vs HISTORICAL classification requires reading each hit in context | A miscategorized edit could rewrite legitimate history | Implementation summary must list every one of the 16 files with its classification and reasoning, not just a blind find-replace |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by `research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-011, F-007).
<!-- /ANCHOR:questions -->
