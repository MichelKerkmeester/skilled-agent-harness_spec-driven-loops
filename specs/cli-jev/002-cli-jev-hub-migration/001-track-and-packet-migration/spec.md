---
title: "Feature Specification: Phase 1: track-and-packet-migration"
description: "The cli-jev creation packet sat inside the cli-external-orchestration family and its every generated surface pointed at that home. This phase moves the packet to its own track, authors the track metadata, repairs the derived facts a move invalidates, and repoints every live citation."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
  - "packet migration"
  - "cli-jev track"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/001-track-and-packet-migration"
    last_updated_at: "2026-09-20T13:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phase specification authored at closeout from the landed move"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-001-track-and-packet-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: track-and-packet-migration

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-hub-scaffold-and-mode-migration |
| **Handoff Criteria** | The packet lives at `specs/cli-jev/001-cli-jev-creation`, the track root declares both children, the recursive strict gate is green on both packets, and no live surface still cites the old path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the cli-jev hub migration program (packet `cli-jev/002-cli-jev-hub-migration`).

**Scope Boundary**: The spec-side home of the already-landed cli-jev creation history. The skill-side relocation is phase 002, the decoupling of the old hub is phase 003, fleet onboarding is phase 004, and the playbook re-run is phase 005. This phase moves documents and repairs the derived facts a move invalidates. It changes no product behavior.

**Dependencies**:
- The operator's decision that cli-jev becomes its own track with the program packet beside the migrated history
- `repair-derived.cjs`, the sanctioned fixer for derived facts after a move or renumber
- The blessed regenerators for the trigger index, the retrieval fixtures and the graph metadata

**Deliverables**:
- `specs/cli-jev/001-cli-jev-creation/` holding the moved packet, byte-identical apart from repointed citations
- Authored track metadata (`specs/cli-jev/description.json`, `specs/cli-jev/graph-metadata.json`) declaring both children
- A zero-hit census for the old spec path across every live tree, with the regenerated surfaces carrying the new one

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-jev creation packet (former `specs/cli-external-orchestration/074-cli-jev-creation`) records the history of a mode that is being promoted out of the cli-external-orchestration family into its own hub. A packet that keeps its old home keeps every derived surface wrong at once: the folder description cache, the graph metadata, the continuity pointers stamped into five documents per phase, the trigger index, the retrieval corpus manifest and the frontmatter version manifest all name a folder that no longer exists.

### Purpose
Make `specs/cli-jev/` a real track with its history and its program packet inside it, so every later phase can cite one stable home and no generated surface points at the retired path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The physical move of the packet by `git mv`, keeping every document's authored content and the recorded evidence inside it
- The track root metadata: `description.json` and `graph-metadata.json`, hand-authored because no scaffolder writes them
- The derived-fact repair the move invalidates: recorded folder names, packet pointers, declared levels and generated metadata fingerprints
- The citation rewrite across the moved packet, the skill-side cli-jev docs and the generated surfaces that embedded the old path
- The retrieval surfaces that must be regenerated rather than hand-edited (trigger index, retrieval fixtures)

### Out of Scope
- The skill-side hub relocation - phase 002, because the spec move must land before any phase cites the new home
- The old hub's decoupling and the routing/hook/roster rewiring - phase 003
- Compiled-fleet onboarding - phase 004; the playbook re-run and closeout - phase 005
- Any renumbering of JEV scenario ids or rewriting of recorded run verdicts - the identity pass changes paths and names only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/cli-external-orchestration/074-cli-jev-creation/**` | Move | Source of the packet, now empty of it |
| `specs/cli-jev/001-cli-jev-creation/**` | Move | The packet at its new numbered home |
| `specs/cli-jev/description.json` | Create | Track-root description (specId, level, keywords) |
| `specs/cli-jev/graph-metadata.json` | Create | Track-root graph metadata declaring both children |
| `specs/cli-jev/002-cli-jev-hub-migration/**` | Modify | Program packet whose docs cite the moved history |
| `.skilled/skills/cli-external-orchestration/cli-jev/**` | Modify | Skill-side docs citing the old spec path |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/**` | Modify | Regenerated trigger index and fixtures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet lives at `specs/cli-jev/001-cli-jev-creation` with the old path absent from disk and from git's index as a live file | `git status --porcelain` shows staged `R` entries for the move and `ls specs/cli-external-orchestration` no longer lists `074-cli-jev-creation` |
| REQ-002 | The track root describes itself and both children | `specs/cli-jev/description.json` carries `specId: cli-jev`, `level: track`; `specs/cli-jev/graph-metadata.json` declares `cli-jev/001-cli-jev-creation` and `cli-jev/002-cli-jev-hub-migration` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every derived fact the move invalidated is repaired through the sanctioned tool, not by hand | `repair-derived.cjs --roots specs/cli-jev --apply` reports inspected, repaired and failed counts, and a follow-up report-only run reports zero repairable |
| REQ-004 | No live surface cites the old spec path | A repo-wide census for `cli-external-orchestration/074-cli-jev-creation` over live trees returns zero hits after regenerating the trigger index and retrieval fixtures |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh specs/cli-jev/001-cli-jev-creation --strict --recursive` prints `RESULT: PASSED` for the packet and each of its five children, exit 0.
- **SC-002**: `validate.sh specs/cli-jev/002-cli-jev-hub-migration --strict --recursive` prints `RESULT: PASSED` for the program parent and each phase child, exit 0.
- **SC-003**: `sweep-track-roots.mjs` reports `cli-jev: declared=2 actual=2`, and the only drifted tracks are the pre-existing ones captured in the baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `repair-derived.cjs` refuses authored facts by design | Evidence, verdicts and decisions cannot be auto-fixed and must be hand-repaired | Hand-fixed the packet metadata (description `specFolder`/`parentChain`, goal and acceptance-criteria pointers) before the tool pass, then re-verified |
| Risk | A move leaves one citation behind and a generated surface keeps the dead path | High: later phases would cite a folder that does not exist | Ordered substitution pass over live trees plus a zero-hit census as the closing check |
| Risk | A concurrent session is editing this repository | Medium: an unscoped command could touch its work | Every command scoped to this program's paths, with `git status` re-read before writes |
| Risk | Editing a doc after the derived repair makes the stored fingerprint stale | Low: the next validate run fails with `SOURCE_FINGERPRINT_MISMATCH` | Re-ran `repair-derived.cjs --folder <packet> --apply` after the last doc edit, then validated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The three migration forks (hub name and mode name, fleet membership, playbook re-run) were settled by the operator before the program packet was scaffolded.
<!-- /ANCHOR:questions -->

---
