---
title: "Feature Specification: system-speckit Spec Consolidation [skilled-agent-orchestration/145-speckit-spec-consolidation/spec]"
description: "Fold ten spec-kit-subsystem packets from skilled-agent-orchestration into the system-speckit track and chronologically interleave-renumber the whole track 001-016, repairing all nested path references and regenerating metadata."
trigger_phrases:
  - "system-speckit spec consolidation"
  - "system-speckit track"
  - "speckit spec folder renumber"
  - "consolidate system-speckit specs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-speckit-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration spec authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Feature Specification: system-speckit Spec Consolidation

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
| **Branch** | `skilled/0051-speckit-spec-consolidation` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-speckit` spec-kit subsystem owns a long lineage of spec folders — the graph/context and memory-search optimization research, phased-spec preference, the Rust-backend rewrite research, vitest invariance maintenance, the memory command surface, the spec-mutation gate, the `/speckit:phase` merge, spec-kit UX upgrades and adoptions, the coco-index integration research, the auto-mode contract, sub-phase recatalog, base-file renumbering, and the speckit command-family rename. Ten of them were authored in the shared `skilled-agent-orchestration/` top-level, while only six packets lived under `system-speckit/` — and those six carried non-contiguous numbers (`026`-`031`). A reader opening `system-speckit` saw an incomplete, non-chronological slice of the subsystem's history.

### Purpose
Fold the ten spec-kit-subsystem packets into `system-speckit` at their true chronological positions, interleave-renumber the whole track contiguously `001`–`016`, repair all nested path references, regenerate all packet + root JSONs, and land it without regressing validation or touching concurrent-session work — mirroring the completed CLI, mcp-tooling, sk-prompt, skill-advisor, and sk-doc consolidations.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the 10 spec-kit-subsystem packets from `skilled-agent-orchestration/` into `system-speckit` at their chronological slots.
- Interleave-renumber the whole track contiguously `001`–`016` by creation date; slugs preserved from source to minimize reference-repair surface.
- Repair nested path references (graph-metadata identity + children_ids, description.json, continuity pointers, bare self-refs) within the migrated tree.
- Author the track-root `spec.md` + `graph-metadata.json` + `description.json` + `context-index.md`; prune the movers from the SAO root children_ids.

### Out of Scope
- **Pre-existing doc-quality debt** in the packets (template headers, anchors, scaffold markers, section counts) — present identically before the migration; SCOPE LOCK.
- **030-cmd-spec-kit-codex-skill-routing** — operator-kept in SAO (does not clearly belong to this track; pending separate triage). **No `system-code-graph` movers** — no SAO packet is code-graph-engine work.
- **Cross-tree references** to old track paths (frozen spec history + tolerant active fixtures) — left stale per the scoped-repair rule; a future reindex resolves them.
- The memory/vector DB reindex — operator-gated / skipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/system-speckit/001-016/** | Rename | 16 packets renumbered via two-phase git-mv |
| .opencode/specs/system-speckit/**/*.md,*.json | Modify | Nested path-reference + identity repair + fingerprint regen |
| .opencode/specs/system-speckit/{spec.md,graph-metadata.json,description.json,context-index.md} | Create | Track-root purpose doc, metadata, and migration bridge |
| .opencode/specs/skilled-agent-orchestration/graph-metadata.json | Modify | Prune the movers from root children_ids |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Contiguous numbering | system-speckit holds exactly 16 packets 001–016 plus z_archive, no gaps/dups/temp folders |
| REQ-002 | No stale identity | Zero migration-created old-number/old-path references remain in load-bearing .md/.json in the tree |
| REQ-003 | Rename history preserved | All folder moves land as `R` renames, not delete+add |
| REQ-004 | Regression-neutral validation | No new strict-validate errors vs the combined pre-migration baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Metadata regenerated | Every affected folder's graph-metadata.json source_fingerprint refreshed; 0 mismatches |
| REQ-006 | Root JSON authored | Track root exposes spec.md + graph-metadata children_ids listing all 16 packets + z_archive |
| REQ-007 | Concurrent-session safe | No move/edit touches another session's files; explicit-path staging only |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system-speckit` is a single contiguous 001–016 track (plus z_archive) with correct per-packet + root metadata.
- **SC-002**: Migration-invariant validators (child-drift, disk-path-consistency, fingerprint integrity, folder-naming) pass.
- **SC-003**: Strict-validate error delta vs the combined baseline is ≤ 0 (regression-neutral or better).


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Interleave number collisions | Corrupt/overwrite a live packet | Two-phase git-mv (old → __mig_tmp_ → final) |
| Risk | Bare-token rewrite hitting a wrong slug | Corrupt unrelated packets | Full-slug tokens, qualified-before-bare ordering, `/`-excluded left boundary; residual sweep to zero |
| Risk | Live root graph-metadata flips enforced canonical-save checks | Root gains errors | Author root spec.md + real source_fingerprint + populated source_docs (skill-advisor/sk-doc root pattern) |
| Dependency | Worktree based off origin tip | SAO-root merge on landing | SAO-root prune re-applied against current origin at landing |
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
- **Full-track interleave**: all six existing system-speckit packets change number; two-phase move via `__mig_tmp_` removes every transient collision.
- **Legacy ancient-path refs**: moved packets carry ancient self-identity forms (`z_archive/…`, `03--commands-and-skills/…`); the bare-rewrite left boundary excludes `/` so those stay intact (pre-existing debt, not migration-created).

### Error Scenarios
- **Session-log residuals**: old paths remain only in frozen `.out`/`.codexlog` agent transcripts — historical records, deliberately not rewritten.
- **Old hyphenated track name**: pre-existing `system-spec-kit/` (hyphenated) references are left untouched — the qualified pass matches only the current `system-speckit/` track name.

### Concurrent Operations
- **Parallel sessions on the shared tree**: isolated worktree + fast-forward push; never `git add -A` broadly.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Scope: which packets move? **RESOLVED: 10 clear movers to system-speckit; 030-cmd-spec-kit-codex-skill-routing stays in SAO (operator); no code-graph movers.**
- Append vs interleave? **RESOLVED: Whole-track chronological interleave 001–016 (operator).**
- 065 routing? **RESOLVED: system-speckit (operator), not code-graph/sk-code.**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

---
