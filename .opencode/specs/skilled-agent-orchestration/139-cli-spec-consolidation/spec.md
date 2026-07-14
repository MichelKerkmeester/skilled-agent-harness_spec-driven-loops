---
title: "Feature Specification: CLI Spec Consolidation into cli-external-orchestration [skilled-agent-orchestration/139-cli-spec-consolidation/spec]"
description: "Consolidate every external-CLI skill spec packet into one sequentially-numbered cli-external-orchestration track and repair all nested path references."
trigger_phrases:
  - "cli spec consolidation"
  - "cli-external-orchestration"
  - "spec folder renumber"
  - "consolidate cli specs"
  - "cli track migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/139-cli-spec-consolidation"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration spec authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Feature Specification: CLI Spec Consolidation into cli-external-orchestration

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
| **Created** | 2026-07-14 |
| **Branch** | `skilled/0043-cli-spec-consolidation` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
External-CLI skill spec packets were scattered: 23 lived under `cli-external-orchestration/` with gappy numbering (001–116) and stale self-identity metadata pointing at deleted `skilled-agent-orchestration/z_archive/<n>-<slug>` origins, while five more CLI-skill packets remained mis-filed under `skilled-agent-orchestration/` top-level. The split made the CLI family hard to browse and left graph metadata dangling.

### Purpose
Consolidate every CLI-skill spec into one `cli-external-orchestration` track, renumber it contiguously (chronological by original number), repair all nested path references, regenerate all packet + root category JSONs, and land it without regressing validation or touching concurrent-session work.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Renumber 23 existing `cli-external-orchestration` packets to a contiguous chronological sequence.
- Move 5 committed CLI-skill packets from `skilled-agent-orchestration/` into the track (120-glm-5-2-support, 122-cli-codex-deprecation, 125-cli-external-parent, 134-cli-codex-revival, 135-cli-hub-rename).
- Repair nested path references (graph-metadata identity + children_ids, description.json, continuity pointers, cross-doc links) within the migrated tree.
- Regenerate every packet's description.json + graph-metadata.json; create the CEO track-root JSONs; prune the movers from the SAO root children list.

### Out of Scope
- **Pre-existing doc-quality debt** in the migrated packets (template headers, anchors, spec-doc sufficiency) — present identically before the migration; SCOPE LOCK.
- **013-cmd-create-codex-compatibility / 030-cmd-spec-kit-codex-skill-routing** — deferred: uncommitted and owned by a concurrent session's in-flight z_archive un-archiving.
- OpenCode-runtime infra (127/129 plugins-hooks, 066, 079) and 086-opencode-auto-review (auto-review research, siblings 087/089) — not cli-X skill specs.
- The memory/vector DB reindex — deferred to MAIN after merge (single global instance).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/cli-external-orchestration/001-028/** | Rename | 28 packets renumbered/moved via two-phase git-mv |
| .opencode/specs/cli-external-orchestration/**/*.md,*.json | Modify | Nested path-reference + identity repair |
| .opencode/specs/cli-external-orchestration/{description,graph-metadata}.json | Create | Track-root category JSONs |
| .opencode/specs/skilled-agent-orchestration/graph-metadata.json | Modify | Prune 2 mover references from root children_ids |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Contiguous numbering | CEO track holds exactly 28 packets, 001–028, no gaps/dups/temp folders |
| REQ-002 | No stale identity | Zero `z_archive/<slug>` or moved-SAO paths remain in the CEO tree |
| REQ-003 | Rename history preserved | All folder moves land as `R` renames, not delete+add |
| REQ-004 | Regression-neutral validation | No new strict-validate error categories vs pre-migration baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Metadata regenerated | Every packet description.json + graph-metadata.json refreshed; integrity not regressed |
| REQ-006 | Root JSONs generated | CEO track root has description.json + graph-metadata.json listing all 28 children |
| REQ-007 | Concurrent-session safe | No move/edit touches another session's uncommitted files; explicit-path staging only |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cli-external-orchestration` is a single contiguous 001–028 track with correct per-packet + root metadata.
- **SC-002**: Migration-invariant validators (child-drift, disk-path-consistency, graph/description shape, folder-naming) pass for all packets.
- **SC-003**: Strict-validate delta vs baseline introduces zero new error categories and does not regress metadata integrity.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bare-token ref rewrite hitting z_archive twins | Corrupt unrelated packets | Category-qualified + CEO-tree-scoped rewrites only |
| Risk | Transient number collision on rename | git-mv failure | Two-phase temp→final rename |
| Dependency | Concurrent session dirty tree | Merge conflict / clobber | Isolated worktree, FF push, explicit-path staging |
| Dependency | Memory/vector DB (global) | Pollution from worktree | DB-free regen; reindex deferred to MAIN |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Regen batch completes without manual intervention (175 folder passes).

### Security
- **NFR-S01**: No destructive operation on files outside the migration path set.
- **NFR-S02**: No global-DB writes from the worktree (verified via mtime).

### Reliability
- **NFR-R01**: Every move preserves git rename history for provenance.
- **NFR-R02**: Deterministic, re-runnable rewrite (idempotent token map).


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Identically-named z_archive twins**: CEO packets share slugs with deleted z_archive originals; bare-token rewrites are unsafe, so only category-qualified + CEO-tree-scoped rewrites are used.
- **Multi-phase parents**: parents (026, 027, and existing 018/019/022/023) carry children_ids that must re-point to new CEO child paths.
- **Track root**: the category root is not a NNN-packet; its JSONs are authored to the track shape, not the packet shape.

### Error Scenarios
- **Uncommitted movers (013/030)**: absent from the branch tip; deferred rather than moved from either location.
- **Stale source_fingerprint**: path edits invalidate the stored fingerprint; graph-metadata regen recomputes it.

### Concurrent Operations
- **Parallel sessions on the shared tree**: isolated worktree + fast-forward push; never `git add -A`.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should 013/030 be folded in on a later pass once the concurrent session commits? **RESOLVED: Yes, deferred follow-up.**
- Group-by-tool vs chronological numbering? **RESOLVED: Chronological (operator choice).**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

---
