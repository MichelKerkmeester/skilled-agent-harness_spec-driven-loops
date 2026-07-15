---
title: "Feature Specification: system-code-graph Active-Packet Renumber [skilled-agent-orchestration/146-codegraph-active-renumber/spec]"
description: "Renumber the eleven active system-code-graph packets 001-011 to 025-035 so they continue after the archived 001-024 as one continuous sequence, normalize four codegraph->code-graph slugs, clarify the 027-tree scatter slug, repair all nested path references, regenerate metadata, and author the track root."
trigger_phrases:
  - "system-code-graph active renumber"
  - "code-graph packet renumber 025-035"
  - "codegraph slug normalization"
  - "system-code-graph track root"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/146-codegraph-active-renumber"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Renumber spec authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Feature Specification: system-code-graph Active-Packet Renumber

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
| **Branch** | `skilled/0052-codegraph-active-renumber` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-code-graph` track archived its history under `z_archive/` numbered `001-024`, but the active (root-level) packets ALSO started at `001` (`001-011`). Two sequences both beginning at `001` made the track read as two overlapping histories. Separately, four active packets carried an unhyphenated `codegraph` slug, one scatter parent embedded a foreign-looking `-027` number, and the track root had stale metadata (children_ids listing only `001-010`, no root `spec.md`, empty `source_docs`) that failed the enforced canonical-save root checks.

### Purpose
Renumber the eleven active packets `001-011` to `025-035` so they continue directly after the archive as one continuous `001-035` sequence; normalize the four `codegraph`→`code-graph` slugs; clarify `010-code-graph-scatter-027`→`034-code-graph-scatter-from-027` (a source-tree label, not a packet number); repair all nested path references; regenerate every affected folder's metadata; and author the track root — without regressing validation or touching concurrent-session work. Mirrors the completed system-speckit consolidation (packet 145).

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Renumber the 11 active packets `001-011` → `025-035` (single-phase git-mv; targets were empty).
- Normalize `codegraph`→`code-graph` on the four flagged parent slugs (026, 027, 028, 033).
- Clarify `010-code-graph-scatter-027` → `034-code-graph-scatter-from-027`.
- Repair nested path references (graph-metadata identity + children_ids, description.json, continuity pointers, bare parent-slug self-refs) within the renumbered tree.
- Regenerate every affected folder's graph-metadata + description; author the track-root `spec.md` + `graph-metadata.json` + `description.json` + `context-index.md`.

### Out of Scope
- **The archived `z_archive/001-024` packets** — not renumbered or moved.
- **Phase-child slugs** containing `codegraph` — only the four parent slugs were normalized; children keep their local numbering and slugs.
- **Pre-existing doc-quality debt** in the packets (template placeholders, generated-metadata integrity, spec-doc integrity) — present identically before the renumber; SCOPE LOCK.
- **Cross-tree references** from other tracks/skills to the old paths — left stale per the scoped-repair rule; a future reindex resolves them.
- The memory/vector DB reindex — deferred.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/system-code-graph/{001-011}/** → {025-035}/** | Rename | 11 packets renumbered via single-phase git-mv (2,033 files) |
| .opencode/specs/system-code-graph/025-035/**/*.md,*.json | Modify | Nested path-reference + identity repair + metadata regen |
| .opencode/specs/system-code-graph/{spec.md,graph-metadata.json,description.json,context-index.md} | Create/Refresh | Track-root purpose doc, metadata, and renumber bridge |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Continuous numbering | system-code-graph active packets are exactly `025-035`, continuing after `z_archive/001-024`, no gaps/dups/temp folders |
| REQ-002 | No stale identity | Zero renumber-created old-number/old-path references remain in load-bearing .md/.json in the renamed tree |
| REQ-003 | Rename history preserved | All folder moves land as `R` renames, not delete+add |
| REQ-004 | Regression-neutral validation | No new strict-validate errors vs the per-packet pre-renumber baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Metadata regenerated | Every affected folder's graph-metadata.json source_fingerprint refreshed; disk-path consistency holds |
| REQ-006 | Root authored | Track root exposes `spec.md` + `graph-metadata.json` children_ids listing `025-035` + z_archive + `context-index.md` |
| REQ-007 | Concurrent-session safe | No move/edit touches another session's files; isolated worktree; DB mtime unchanged |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system-code-graph` active packets form a contiguous `025-035` block after `z_archive/001-024`, with correct per-packet + root metadata.
- **SC-002**: Migration-invariant validators (child-drift, disk-path-consistency, fingerprint integrity, folder-naming) pass on the renamed tree.
- **SC-003**: Strict-validate error delta vs the per-packet baseline is ≤ 0 (regression-neutral or better); the track root improves from 4 errors to 2 inherent.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bare-token rewrite hitting a wrong slug | Corrupt unrelated packets | Full-slug tokens with unique numeric prefixes, qualified-before-bare ordering, `/`-excluded left boundary; residual sweep to zero |
| Risk | Stale source_fingerprint after content edits | Mass GENERATED_METADATA_INTEGRITY errors | Regenerate graph-metadata + description for every edited folder (120 folders) |
| Risk | Live root graph-metadata flips enforced canonical-save checks | Root gains errors | Author root spec.md + real source_fingerprint + populated source_docs |
| Dependency | Worktree based off origin tip (413f463c22b) | Rebase on landing | system-code-graph disjoint from concurrent work → conflict-free fast-forward |
| Dependency | Memory/vector DB (global) | Pollution from worktree | DB-free regen (mtime-verified `2026-07-02 08:59:29`); reindex deferred |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Regen batch completes unattended across the 120 affected folders.

### Security
- **NFR-S01**: No destructive operation on files outside the renumber path set.
- **NFR-S02**: No global-DB writes from the worktree (mtime-verified `2026-07-02 08:59:29`).

### Reliability
- **NFR-R01**: Every move preserves git rename history (2,033 `R`).
- **NFR-R02**: Deterministic, order-safe token map (unique numeric prefixes; no rewrite output equals another's input).


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Two scatter phase-parents**: `008`→`032` (026-tree) and `010`→`034` (027-tree) are phase parents with children; the parent-path rewrite carries their nested `children_ids` to the new numbers.
- **Metadata-only stub folders**: two folders under `031` carry a `graph-metadata.json` but no `spec.md`; regen correctly skips them (not spec folders) — no validation impact.

### Error Scenarios
- **Stale generated fields**: `folderSlug` and `source_fingerprint` on renamed folders go stale on rename; the per-folder regen refreshes them.
- **Child slugs with `codegraph`**: intentionally left unchanged — only the four parent slugs were in scope.

### Concurrent Operations
- **Parallel sessions on the shared tree**: isolated worktree + fast-forward push; never `git add -A` broadly; the concurrent session's work is in unrelated tracks.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Renumber vs leave? **RESOLVED: active `001-011` → `025-035`, continuing after archive `001-024` (operator).**
- Normalize `codegraph`→`code-graph` slugs? **RESOLVED: yes, same pass, on 026/027/028/033 (operator).**
- `010-code-graph-scatter-027` slug? **RESOLVED: `034-code-graph-scatter-from-027` (operator).**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

---
