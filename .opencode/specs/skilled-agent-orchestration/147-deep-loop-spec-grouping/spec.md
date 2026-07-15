---
title: "Feature Specification: system-deep-loop Spec Grouping [skilled-agent-orchestration/147-deep-loop-spec-grouping/spec]"
description: "Re-nest 18 standalone system-deep-loop packets as phase-children under four existing phase parents (054/038/052/030), reducing the linked top-level count from 29 to 11, repairing self-references, regenerating metadata, and updating each parent's phase-documentation map — without regressing validation or touching concurrent-session work."
trigger_phrases:
  - "system-deep-loop spec grouping"
  - "deep-loop packet re-nest"
  - "reduce deep-loop top-level packets"
  - "group deep-loop specs into phase parents"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-spec-grouping"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Grouping spec authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Feature Specification: system-deep-loop Spec Grouping

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
| **Branch** | `skilled/0053-deep-loop-spec-grouping` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-deep-loop` track had accumulated a large number of top-level packets — many of them small, single-purpose specs (6–18 files) that belong to a shared benchmark family or reliability workstream but sat as standalone siblings. This made the track's top-level index hard to read and obscured which packets are one coherent program. A read-only architecture analysis (GPT-5.6-LUNA MAX) over 29 operator-linked packets proposed grouping 18 of them into four existing phase parents.

### Purpose
Re-nest the 18 approved packets as independently-executable phase-children under four existing phase parents (`054-smart-routing-benchmark-program`, `038-deep-loop-runtime`, `052-deep-loop-unification`, `030-deep-loop-improved`), reducing the linked top-level count from 29 to 11. This is an ORGANIZATIONAL move, not a content rewrite: each packet keeps its docs and history; only its location, machine identity, and its new parent's phase-map change. Regression-neutral, concurrent-session-safe.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-nest 18 top-level packets → phase-children under 4 parents, renumbered into each parent's child sequence:
  - **054** ← 036,037,058,060,061,062 → children `013-018` (Lane-C routing-benchmark family).
  - **038** ← 039,040,045 → `008-010` (fan-out reliability); 041,042,043,044 → `011-014` (state/integrity).
  - **052** ← 034,051,053,064 → `009-012` (skill-family identity/parity; 053 & 064 are themselves phase parents, moved whole).
  - **030** ← 055 → `012` (divergent-convergence, a post-completion follow-up phase).
- Self-reference repair (qualified paths + the `Spec Folder` metadata row) within the 18 moved subtrees.
- Regenerate graph-metadata + description for every moved spec folder; recompute each parent's `children_ids`.
- Update the phase-documentation map in the three parents that carry one (030/038/052).

### Out of Scope
- **The 11 packets that stay standalone** (029, 031, 032, 033, 035, 038, 052, 054, 059, 063 + the 4 parents themselves) — kept as top-level per the analysis.
- **Out-of-scope newer packets** (065, 066, 067, 068) — not in the linked-29 set; untouched (065 is concurrently authored).
- **Packet content** — no spec/plan/tasks body rewrites; only identity, location, and parent phase-maps.
- **Cross-tree / historical references** to the old paths (reindex packet `019-deep-loop-036-037-reindex`, `topology-migration-backup`, `INCIDENT.md`, 065 research iterations/swarm logs, `descriptions.json` aggregate, standalone siblings 031/059) — left as deferred debt; rewriting historical records would falsify them.
- The memory/vector DB reindex — deferred.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/system-deep-loop/{18 old top-level}/** → {parent}/{new-child}/** | Rename | 18 packets re-nested via git-mv (whole subtrees; 053/064 carry their children) |
| .opencode/specs/system-deep-loop/{054,038,052,030}/{new-child}/**/*.md,*.json | Modify | Self-reference + Spec-Folder-row repair, identity/metadata regen |
| .opencode/specs/system-deep-loop/{030,038,052}/spec.md | Modify | Phase-documentation-map rows for the new children |
| .opencode/specs/system-deep-loop/{054,038,052,030}/graph-metadata.json | Modify | children_ids recomputed from on-disk children |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reduced top-level count | The 18 packets are phase-children under 054/038/052/030; linked top-level count is 11; no gaps/dups/temp folders |
| REQ-002 | No stale identity | Zero move-created old-path references remain in load-bearing .md/.json in the moved subtrees; each moved leaf's `Spec Folder` row equals its new leaf basename |
| REQ-003 | Rename history preserved | All folder moves land as `R` renames, not delete+add |
| REQ-004 | Regression-neutral validation | No new strict-validate errors vs the pre-move per-parent + per-packet baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Metadata regenerated | Every moved folder's graph-metadata (packet_id/parent_id/spec_folder) and description reflect the new nested path; parent children_ids recomputed |
| REQ-006 | Parent maps honest | Each parent with a phase-documentation map (030/038/052) lists its new children; children_ids match on-disk |
| REQ-007 | Concurrent-session safe | No move/edit touches another session's files (esp. `065-deep-loop-innovation`); isolated worktree; DB mtime unchanged |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The linked-29 top-level set is reduced to 11; the 18 absorbed packets resolve at their new nested paths with correct per-packet and parent metadata.
- **SC-002**: Migration-invariant validators (child-drift, disk-path-consistency, fingerprint integrity, folder-naming, spec-doc integrity) pass on the moved tree.
- **SC-003**: Strict-validate error delta across the four parent subtrees is ≤ 0 (regression-neutral or better) vs the pre-move baseline.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing a moved doc after regen | Stale generated metadata (GENERATED_METADATA_INTEGRITY) | Repair fully BEFORE regen; re-backfill any parent whose spec.md is edited afterward (canary-proven ordering) |
| Risk | Stale `Spec Folder` metadata row after re-nest | SPEC_DOC_INTEGRITY error | Repair the bare-leaf `Spec Folder` row to the new leaf basename (validated field) |
| Risk | Bare-token rewrite hitting a wrong slug | Corrupt unrelated packets | Rewrite only the qualified `system-deep-loop/<old-basename>` token (unique numeric prefixes); scoped to moved subtrees; residual sweep to zero |
| Risk | Falsifying historical records | Dishonest docs | Leave external/historical/concurrent references untouched; report the inventory as deferred debt |
| Dependency | Worktree off origin tip (60fd0301cb) | Rebase on landing | Moved paths disjoint from concurrent 065 work → conflict-free fast-forward |
| Dependency | Memory/vector DB (global) | Pollution from worktree | DB-free regen (mtime-verified `2026-07-02 08:59:29`); reindex deferred |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Regen batch completes unattended across the 27 moved spec folders + 4 parents.

### Security
- **NFR-S01**: No destructive operation on files outside the move path set.
- **NFR-S02**: No global-DB writes from the worktree (mtime-verified `2026-07-02 08:59:29`).

### Reliability
- **NFR-R01**: Every move preserves git rename history (`R`).
- **NFR-R02**: Deterministic, order-safe token map (unique numeric prefixes; single-scan rewrite).


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Two nested phase-parents absorbed**: `053-skill-frontmatter-standardization`→`052/011` and `064-deep-command-family-parity`→`052/012` are themselves phase parents; git-mv carries their whole child subtree, and regen refreshes every descendant's identity (deepest-first).
- **Leaf packets without a `Spec Folder` row**: three moved packets (039/040/041) carry no `| **Spec Folder** |` row — the integrity check skips an absent row, so no fix is needed.

### Error Scenarios
- **Stale generated fields**: `parent_id`, `folderSlug`, `source_fingerprint`, and the continuity `packet_pointer` go stale on re-nest; per-folder regen + the qualified-path repair refresh them.
- **Continuity freshness warning**: regen bumps `derived.last_save_at` while the continuity `last_updated_at` is unchanged (content not re-saved), raising a non-blocking `CONTINUITY_FRESHNESS` warning per moved packet — truthful, warning-tier, left as-is.

### Concurrent Operations
- **Parallel session on `065-deep-loop-innovation`**: isolated worktree + fast-forward push; the 4 `065` files referencing old paths are historical research artifacts, left untouched.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Which grouping scope? **RESOLVED: all 5 proposed groups (−18 → 11 linked top-level) (operator).**
- Delegate execution to LUNA? **RESOLVED: LUNA did the read-only grouping analysis; the delicate git-mv/repair/regen ran via deterministic scripts (reliable rename-history + scoped repair), LUNA reserved for the final verification pass.**
- Slug renaming for absorbed children? **RESOLVED: kept verbatim (minus number); child numbers assigned in dependency order (054 parser→scorer, 061 before 062).**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

---
