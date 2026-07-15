---
title: "Feature Specification: system-skill-advisor Spec Consolidation [skilled-agent-orchestration/142-skill-advisor-spec-consolidation/spec]"
description: "Fold four stranded skill-advisor packets into the system-skill-advisor track and chronologically interleave-renumber the whole track 000-017, repairing all nested path references."
trigger_phrases:
  - "skill-advisor spec consolidation"
  - "system-skill-advisor track"
  - "skill-advisor spec folder renumber"
  - "consolidate skill-advisor specs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/142-skill-advisor-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration spec authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Feature Specification: system-skill-advisor Spec Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/0048-skill-advisor-spec-consolidation` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-skill-advisor` track was formed on 2026-07-07 by extracting skill-advisor phases out of `system-speckit` packets 026/027/028, but four skill-advisor-owned packets predating that extraction were left stranded in `skilled-agent-orchestration/` top-level: `004-skill-advisor-refinement` (created 2026-03-03), `051-skill-advisor-reindex-and-stress-test` (2026-05-03), `070-ambiguity-window-confidence-fix` (2026-05-06), and `112-advisor-doc-trigger-harvest` (2026-06-11). Three of them predate the earliest content in the current track, so a reader opening `system-skill-advisor` saw an incomplete, non-chronological history.

### Purpose
Fold the four stranded packets into `system-skill-advisor` at their true chronological positions, interleave-renumber the whole track contiguously `000`–`017`, repair all nested path references, regenerate all packet + root JSONs, and land it without regressing validation or touching concurrent-session work — mirroring the completed CLI, mcp-tooling, and sk-prompt consolidations.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the 4 skill-advisor-owned packets from `skilled-agent-orchestration/` into `system-skill-advisor` at their chronological slots.
- Interleave-renumber the whole track contiguously `000`–`017`; `000-migration-from-system-speckit` stays as the anchor; the four movers land at `001`/`002`/`003`/`012`; the 13 existing packets shift `001→004 … 013→017`.
- Repair nested path references (graph-metadata identity + children_ids, description.json, continuity pointers, bare self-refs) within the migrated tree.
- Refresh the track-root `graph-metadata.json` children_ids to `000`–`017`; prune the four movers from the SAO root children_ids.

### Out of Scope
- **Pre-existing doc-quality debt** in the packets (template headers, anchors, scaffold markers, section counts) — present identically before the migration; SCOPE LOCK.
- **030-cmd-spec-kit-codex-skill-routing, 069-skill-description-budget-trim, 072-skill-description-guardrails** — operator-excluded ("Core 4 only"); they stay in SAO.
- **Cross-tree references** to old track paths (frozen spec history + tolerant active fixtures) — left stale per the scoped-repair rule; a future reindex resolves them.
- The memory/vector DB reindex — operator-gated / skipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/system-skill-advisor/001-017/** | Rename | 18 phase-parents renumbered via two-phase git-mv |
| .opencode/specs/system-skill-advisor/**/*.md,*.json | Modify | Nested path-reference + identity repair + fingerprint regen |
| .opencode/specs/system-skill-advisor/graph-metadata.json | Modify | Track-root children_ids → 000-017 |
| .opencode/specs/skilled-agent-orchestration/graph-metadata.json | Modify | Prune the 4 movers from root children_ids |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Contiguous numbering | system-skill-advisor holds exactly 18 packets, 000–017, no gaps/dups/temp folders |
| REQ-002 | No stale identity | Zero old-number/old-path references remain in load-bearing .md/.json in the tree |
| REQ-003 | Rename history preserved | All folder moves land as `R` renames, not delete+add |
| REQ-004 | Regression-neutral validation | No new strict-validate errors vs the combined pre-migration baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Metadata regenerated | Every affected folder's graph-metadata.json source_fingerprint refreshed; 0 mismatches |
| REQ-006 | Root JSON updated | Track root children_ids lists all 18 packets 000–017 in order |
| REQ-007 | Concurrent-session safe | No move/edit touches another session's files; explicit-path staging only |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system-skill-advisor` is a single contiguous 000–017 track with correct per-packet + root metadata.
- **SC-002**: Migration-invariant validators (child-drift, disk-path-consistency, fingerprint integrity, folder-naming) pass.
- **SC-003**: Strict-validate error delta vs the combined baseline is ≤ 0 (regression-neutral or better).


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Interleave number collisions | Corrupt/overwrite a live packet | Two-phase git-mv (old → __mig_tmp_ → final) |
| Risk | Bare-token rewrite hitting a wrong slug | Corrupt unrelated packets | Full-slug tokens, qualified-before-bare ordering; residual sweep to zero |
| Risk | Stranded z_archive mover identity | Wrong packet_id after move | graph-metadata regen recomputes identity from disk location |
| Dependency | Worktree based off a stale origin tip | SAO-root merge on landing | Origin left system-skill-advisor untouched; SAO-root prune re-applied against current origin at landing |
| Dependency | Memory/vector DB (global) | Pollution from worktree | DB-free regen (mtime-verified); reindex gated/skipped |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Regen batch completes unattended across the affected folders.

### Security
- **NFR-S01**: No destructive operation on files outside the migration path set.
- **NFR-S02**: No global-DB writes from the worktree (mtime-verified `2026-07-02 08:59:29`).

### Reliability
- **NFR-R01**: Every move preserves git rename history.
- **NFR-R02**: Deterministic, order-safe token map (no rewrite output equals another's input).


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Full-track interleave**: all 13 existing packets change number; two-phase move via `__mig_tmp_` removes every transient collision.
- **000 anchor**: `000-migration-from-system-speckit` (a 2026-07-07 meta record) stays at 000; chronological interleave applies to 001+ only.
- **112 date placement**: `112-advisor-doc-trigger-harvest` (06-11) lands at 012, strictly before the 07-07 migrated-items hub (013), per operator.

### Error Scenarios
- **Session-log residuals**: old paths remain only in frozen `.out`/`.codexlog` agent transcripts — historical records, deliberately not rewritten.
- **Stale root/anchor fingerprint**: sed edits to the track-root and 000 spec.md invalidate stored fingerprints; recomputed via the validator's own `computeSourceFingerprintForFolder`.

### Concurrent Operations
- **Parallel sessions on the shared tree**: isolated worktree + fast-forward push; never `git add -A` broadly.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Scope: which advisor packets move? **RESOLVED: Core 4 only — 004/051/070/112 (operator); 030/069/072 stay in SAO.**
- Append vs interleave? **RESOLVED: Chronological interleave (operator).**
- 112 slot? **RESOLVED: 012, strictly by date, before migrated-items (operator).**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

---
