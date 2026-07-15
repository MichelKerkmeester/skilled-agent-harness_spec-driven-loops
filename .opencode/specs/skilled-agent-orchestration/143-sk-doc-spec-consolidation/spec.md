---
title: "Feature Specification: sk-doc Spec Consolidation [skilled-agent-orchestration/143-sk-doc-spec-consolidation/spec]"
description: "Fold fifteen documentation-authoring packets from skilled-agent-orchestration into the sk-doc track and chronologically interleave-renumber the whole track 001-019 (plus the separate 999 preview), repairing all nested path references."
trigger_phrases:
  - "sk-doc spec consolidation"
  - "sk-doc track"
  - "sk-doc spec folder renumber"
  - "consolidate sk-doc specs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-doc-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration spec authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Feature Specification: sk-doc Spec Consolidation

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
| **Branch** | `skilled/0049-sk-doc-spec-consolidation` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-doc` documentation-authoring skill owns a long lineage of spec folders — the `create-*` authoring generators, the command/skill description trims, the README/anchor standardization passes, hub-doc conformance, benchmark-authoring centralization, router alignment, and the hyphen-naming convention. Fifteen of them were authored in the shared `skilled-agent-orchestration/` top-level before the skill had its own track, while only four packets plus the `999-create-diff-mode` preview lived under `sk-doc/`. A reader opening `sk-doc` saw an incomplete, non-chronological slice of the subsystem's history.

### Purpose
Fold the fifteen documentation-authoring packets into `sk-doc` at their true chronological positions, interleave-renumber the whole track contiguously `001`–`019`, keep `999-create-diff-mode` as a deliberately separate preview marker, repair all nested path references, regenerate all packet + root JSONs, and land it without regressing validation or touching concurrent-session work — mirroring the completed CLI, mcp-tooling, sk-prompt, and skill-advisor consolidations.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the 15 documentation-authoring packets from `skilled-agent-orchestration/` into `sk-doc` at their chronological slots.
- Interleave-renumber the whole track contiguously `001`–`019` by creation date; slugs preserved from source to minimize reference-repair surface.
- Keep `999-create-diff-mode` unchanged as a separate preview marker.
- Repair nested path references (graph-metadata identity + children_ids, description.json, continuity pointers, bare self-refs) within the migrated tree.
- Author the track-root `spec.md` + `graph-metadata.json` + `description.json` + `context-index.md`; prune the 15 movers from the SAO root children_ids.

### Out of Scope
- **Pre-existing doc-quality debt** in the packets (template headers, anchors, scaffold markers, section counts) — present identically before the migration; SCOPE LOCK.
- **017-cmd-create-prompt, 032, 077, 069, 072** — operator-excluded borderline/doc-adjacent packets kept in SAO; **112-advisor-doc-trigger-harvest** — advisor-owned, excluded.
- **Cross-tree references** to old track paths (frozen spec history + tolerant active fixtures) — left stale per the scoped-repair rule; a future reindex resolves them.
- The memory/vector DB reindex — operator-gated / skipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/sk-doc/001-019/** | Rename | 19 phase-parents renumbered via two-phase git-mv |
| .opencode/specs/sk-doc/**/*.md,*.json | Modify | Nested path-reference + identity repair + fingerprint regen |
| .opencode/specs/sk-doc/{spec.md,graph-metadata.json,description.json,context-index.md} | Create | Track-root purpose doc, metadata, and migration bridge |
| .opencode/specs/skilled-agent-orchestration/graph-metadata.json | Modify | Prune the 15 movers from root children_ids |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Contiguous numbering | sk-doc holds exactly 19 packets 001–019 plus the separate 999, no gaps/dups/temp folders |
| REQ-002 | No stale identity | Zero old-number/old-path references remain in load-bearing .md/.json in the tree |
| REQ-003 | Rename history preserved | All folder moves land as `R` renames, not delete+add |
| REQ-004 | Regression-neutral validation | No new strict-validate errors vs the combined pre-migration baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Metadata regenerated | Every affected folder's graph-metadata.json source_fingerprint refreshed; 0 mismatches |
| REQ-006 | Root JSON authored | Track root exposes spec.md + graph-metadata children_ids listing all 20 packets + z_archive |
| REQ-007 | Concurrent-session safe | No move/edit touches another session's files; explicit-path staging only |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sk-doc` is a single contiguous 001–019 track (plus 999) with correct per-packet + root metadata.
- **SC-002**: Migration-invariant validators (child-drift, disk-path-consistency, fingerprint integrity, folder-naming) pass.
- **SC-003**: Strict-validate error delta vs the combined baseline is ≤ 0 (regression-neutral or better).


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Interleave number collisions | Corrupt/overwrite a live packet | Two-phase git-mv (old → __mig_tmp_ → final) |
| Risk | Bare-token rewrite hitting a wrong slug | Corrupt unrelated packets | Full-slug tokens, qualified-before-bare ordering, `/`-excluded left boundary; residual sweep + self-identity detector to zero |
| Risk | Live root graph-metadata flips enforced canonical-save checks | Root gains errors | Author root spec.md + real source_fingerprint + populated source_docs (skill-advisor root pattern) |
| Dependency | Worktree based off a stale origin tip | SAO-root merge on landing | Origin left sk-doc untouched; SAO-root prune re-applied against current origin at landing |
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
- **Full-track interleave**: all four existing sk-doc packets change number; two-phase move via `__mig_tmp_` removes every transient collision.
- **999 marker**: `999-create-diff-mode` stays at 999 (operator); chronological interleave applies to 001–019 only.
- **Legacy dead-category refs**: moved packets carry `03--commands-and-skills/012-…` category paths (a dead category); the bare-rewrite left boundary excludes `/` so those stay intact.

### Error Scenarios
- **Session-log residuals**: old paths remain only in frozen `.out`/`.codexlog` agent transcripts — historical records, deliberately not rewritten.
- **perl slurp bug**: the first reference-repair pass used `perl -0`, which set `$/` to null and collapsed the substitution file into one record (0 subs); removing `-0` restored per-line reads.

### Concurrent Operations
- **Parallel sessions on the shared tree**: isolated worktree + fast-forward push; never `git add -A` broadly.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Scope: which documentation packets move? **RESOLVED: 15 clear movers; 017-cmd-create-prompt/032/077/069/072 stay in SAO, 112 excluded (operator).**
- Append vs interleave? **RESOLVED: Whole-track chronological interleave 001–019 (operator).**
- 999 slot? **RESOLVED: kept as 999, separate preview marker (operator).**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

---
