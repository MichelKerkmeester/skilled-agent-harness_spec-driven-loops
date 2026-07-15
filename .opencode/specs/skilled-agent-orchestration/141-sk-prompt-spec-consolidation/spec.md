---
title: "Feature Specification: sk-prompt Spec Consolidation [skilled-agent-orchestration/141-sk-prompt-spec-consolidation/spec]"
description: "Consolidate every sk-prompt skill spec packet into the sk-prompt track, interleave-renumber the whole track contiguously, and repair all nested path references."
trigger_phrases:
  - "sk-prompt spec consolidation"
  - "sk-prompt track"
  - "sk-prompt spec folder renumber"
  - "consolidate sk-prompt specs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/141-sk-prompt-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration spec authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Feature Specification: sk-prompt Spec Consolidation

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
| **Branch** | `skilled/0046-sk-prompt-consolidation` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-prompt skill specs were split across two locations: three already lived in the `sk-prompt` track (at non-contiguous numbers 003/068/105) while three sk-prompt-owned packets (testing-playbook + agent rename, sk-prompt-models rename, the parent-hub merge) were stranded in `skilled-agent-orchestration/` top-level. The `sk-prompt` track had no root category JSONs, so it was invisible to memory search and graph traversal as a unit, and its numbering was not browsable as a sequence.

### Purpose
Consolidate every sk-prompt-skill spec into the `sk-prompt` track, interleave-renumber the whole track contiguously (chronological by original number), repair all nested path references, regenerate all packet + root JSONs, and land it without regressing validation or touching concurrent-session work — mirroring the completed CLI and mcp-tooling consolidations.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the 3 sk-prompt-owned packets from `skilled-agent-orchestration/` into `sk-prompt` and interleave them with the 3 existing sk-prompt packets.
- Renumber the whole track contiguously `001`–`006`, chronological by original number, slugs preserved.
- Repair nested path references (graph-metadata identity + children_ids, description.json, continuity pointers, bare self-refs) within the migrated tree.
- Author the `sk-prompt` track-root JSONs (none existed); prune the movers' dangling references from the SAO root children_ids.

### Out of Scope
- **Pre-existing doc-quality debt** in the migrated packets (template headers, anchors, sufficiency) — present identically before the migration; SCOPE LOCK.
- **017-cmd-create-prompt** — a `/create:prompt` command packet (self-identifies under a commands-and-skills group), not sk-prompt-skill-owned; operator-excluded.
- **032-non-system-playbook-prompts** and **077-playbook-prompt-naturalness** — cross-cutting manual-testing-playbook / sk-doc-template prompt-content work, not sk-prompt-skill-owned; operator-excluded.
- The memory/vector DB reindex — operator-gated / skipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/sk-prompt/001-006/** | Rename | 6 packets moved/interleaved + renumbered via two-phase git-mv |
| .opencode/specs/sk-prompt/**/*.md,*.json | Modify | Nested path-reference + identity repair |
| .opencode/specs/sk-prompt/{description,graph-metadata}.json | Create | Track-root category JSONs |
| .opencode/specs/skilled-agent-orchestration/graph-metadata.json | Modify | Prune dangling mover references from root children_ids |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Contiguous numbering | sk-prompt holds exactly 6 packets, 001–006, no gaps/dups/temp folders |
| REQ-002 | No stale identity | Zero old-number/old-path references remain in the sk-prompt tree |
| REQ-003 | Rename history preserved | All folder moves land as `R` renames, not delete+add |
| REQ-004 | Regression-neutral validation | No new strict-validate errors on any packet vs pre-migration baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Metadata regenerated | Every packet description.json + graph-metadata.json refreshed |
| REQ-006 | Root JSONs generated | sk-prompt track root has description.json + graph-metadata.json listing all 6 children |
| REQ-007 | Concurrent-session safe | No move/edit touches another session's files; explicit-path staging only |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sk-prompt` is a single contiguous 001–006 track with correct per-packet + root metadata.
- **SC-002**: Migration-invariant validators (child-drift, disk-path-consistency, graph/description shape, folder-naming) pass for all packets.
- **SC-003**: Strict-validate error delta vs baseline is ≤ 0 (regression-neutral or better).


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Interleave number collisions | Corrupt/overwrite a live packet | Two-phase git-mv (old → __mig_tmp_ → final) |
| Risk | Bare-token rewrite hitting a wrong slug | Corrupt unrelated packets | Slug-qualified rewrites, scoped to the sk-prompt tree; qualified-before-bare ordering |
| Dependency | Concurrent session dirty tree | Merge conflict / clobber | Isolated worktree, FF push, explicit-path staging |
| Dependency | Memory/vector DB (global) | Pollution from worktree | DB-free regen; reindex gated/skipped |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Regen batch completes unattended across all sk-prompt folders.

### Security
- **NFR-S01**: No destructive operation on files outside the migration path set.
- **NFR-S02**: No global-DB writes from the worktree.

### Reliability
- **NFR-R01**: Every move preserves git rename history.
- **NFR-R02**: Deterministic, re-runnable rewrite (idempotent, order-safe token map).


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Interleave with existing packets**: three packets already lived in sk-prompt (003/068/105); the two-phase move renumbers them alongside the three movers without transient collisions.
- **Dangling SAO-root references**: the movers plus a stale `z_archive/003` reference were dangling entries in the SAO root children_ids; all three were pruned.

### Error Scenarios
- **Missing root JSONs**: `sk-prompt/` had no track-root description.json/graph-metadata.json; both were authored (track shape).
- **Stale source_fingerprint**: path edits invalidate the stored fingerprint; graph-metadata regen recomputes it.

### Concurrent Operations
- **Parallel sessions on the shared tree**: isolated worktree + fast-forward push; never `git add -A`.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Include 017-cmd-create-prompt / 032 / 077? **RESOLVED: Excluded all three (operator).**
- 2-digit vs 3-digit numbering? **RESOLVED: 3-digit (operator).**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

---
