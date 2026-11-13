---
title: "Feature Specification: Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search"
description: "Nothing in system-spec-kit proposes a subtrack, moving or renumbering a packet is manual, and archives are only half supported. Five phases add a relocation engine, a subtrack proposal tool, an archive folder on every subtrack and an opt-in archive search."
trigger_phrases:
  - "subtrack proposal and archive reach phase parent spec"
  - "deterministic packet relocation"
  - "opt-in archive search"
  - "z_archive on every subtrack"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach"
    last_updated_at: "2026-11-13T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase-parent spec and the five phase plans"
    next_safe_action: "Start phase 001-relocation-engine"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/364-subtrack-proposal-archive-reach` |
| **Parent Spec** | None. This packet sits directly in the declared subtrack `system-speckit/spec-folder-tooling` |
| **Parent Packet** | None |
| **Predecessor** | `004-create-path-track-refresh` |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict --recursive` prints `RESULT: PASSED` for this folder and all five children |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Subtracks exist in system-spec-kit only as a hand-written declaration, one level deep, and three gaps follow from that. Nothing proposes a subtrack: the spec-folder question has no subtrack wording, `create.sh` hints only about series parents, and no tool detects a cluster in a flat track. Moving or renumbering a packet is manual, because `repair-derived.cjs` heals some stores and leaves the rest stale. Archives are half supported: no code guarantees a subtrack has a `z_archive/`, search skips archives at every depth, recursive validation never enters them and numbering ignores them.

### Purpose
An operator can accept a proposed whole-track subtrack map, apply it with one deterministic command that updates every store, and find and validate archived packets on request, with no hand edits.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build `relocate.mjs`, a dry-run-first tool that moves, renumbers and re-parents packets and rewrites every store that records a packet path.
- Build `suggest-subtracks.mjs`, a read-only tool that proposes a whole-track subtrack map for a flat track and names the best-fitting subtrack for a new packet.
- Raise the subtrack choice at the right moment in `create.sh`, the spec-folder question and the structure docs.
- Seed `z_archive/.gitkeep` in every declared subtrack and count archived packets when allocating the next number.
- Add an opt-in archive mode to search and to recursive validation, and repair archived JSON metadata.
- Cover all of it with vitest suites and close the packet.

### Operator Decisions
These were taken in the planning session and bind every phase.

- This work is a new phased packet with five children. `recommend-level.sh --loc 2500 --files 35` returned Level 2 and `recommended_phases: false`. The operator approved five phases anyway.
- Archive search is opt-in and live. It uses ripgrep plus per-packet JSON. No archive index is committed and CI is unchanged.
- Mixed tracks stay forbidden. A subtrack proposal is a whole-track map.
- Renumbering is a deterministic tool that updates every store. No hand edits and no AI fix-up work.
- Next-number allocation counts archived packets.

### Out of Scope
- Unifying the seven copies of the subtrack predicate. It is a separate change.
- The `hooks-plugins-extensions` track declaring identity `hooks` while its subtracks point at the folder name.
- The one undeclared packet in the `ai-systems` track of the operator's main working tree.
- Recursive validation not reaching phase children from a track root.
- A committed archive index, and any change to the default search behavior or the trigger index.
- Rewriting hard-coded packet paths in code and CI. The relocation engine reports them and stops.

### Files to Change
Audit summary only. Per-phase detail lives in each child's `plan.md`. Paths without a root are under `.skilled/skills/system-spec-kit/`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `runtime/cli/spec/relocate.mjs` | Create | 001 | Move, renumber and re-parent engine |
| `runtime/cli/spec/repair-derived.cjs` | Modify | 001 | Heal the pointer in four more documents |
| `runtime/cli/rules/check-metadata-disk-consistency-helper.cjs` | Modify | 001 | Gate the same documents |
| `runtime/cli/spec/archive.sh` | Modify | 001, 004 | Restore onto a taken number, refresh the description cache |
| `runtime/cli/spec/suggest-subtracks.mjs` | Create | 002 | Read-only proposal tool |
| `runtime/cli/spec/create.sh` | Modify | 002, 003 | Advisory subtrack line, archive-aware numbering |
| `runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | 002 | Subtrack clause in the spec-folder question |
| `AGENTS.md`, `.skilled/commands/speckit/assets/speckit-plan-presentation.txt`, `.skilled/commands/speckit/assets/speckit-complete-presentation.txt` | Modify | 002 | Subtrack clause in option C |
| `references/structure/folder-structure.md`, `references/structure/phase-definitions.md`, `SKILL.md`, `references/workflows/quick-reference.md` | Modify | 002 | When to propose a subtrack, `--track <track>/<sub>` |
| `runtime/cli/spec/refresh-track-roots.mjs`, `runtime/cli/spec/sweep-track-roots.mjs` | Modify | 003 | Seed and report subtrack archives |
| `runtime/cli/retrieval/rg-wrapper.mjs`, `runtime/cli/retrieval/lib/rg-lane.mjs` | Modify | 004 | `--include-archive` mode and JSON lane |
| `runtime/cli/spec/validate.sh` | Modify | 004 | `--recursive --include-archive` |
| `.skilled/commands/speckit/search.md`, `references/retrieval/retrieval-conventions.md` | Modify | 004 | Document the archive mode |
| `runtime/cli/tests/*.vitest.ts` | Create | 005 | Five new suites |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-relocation-engine/ | `relocate.mjs`: move, renumber and re-parent packets and rewrite every store, plus `--declare-subtrack` | Closeable. Code in `fc218a0d48` |
| 2 | 002-subtrack-proposal/ | `suggest-subtracks.mjs` and the wording and docs that raise a subtrack as a choice | Closeable. Code in `b8912b831c` |
| 3 | 003-subtrack-archive-and-numbering/ | `z_archive/` on every declared subtrack and numbering that counts archived packets | Closeable. Code in `5f3e19712e` |
| 4 | 004-archive-search-and-json/ | Opt-in archive search, recursive archive validation and archived JSON health | Open. Code in `05a83a7d88`, metadata in `55e73d37b5`. AC-002 waits for the trigger index |
| 5 | 005-tests-and-closeout/ | Vitest suites for phases 1 to 4, real-tree checks and packet closeout | Open. Suites in `5fefd819e1`. AC-008 and AC-009 are `Unmet` |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-relocation-engine | 002-subtrack-proposal | `relocate.mjs --map` preflight accepts a valid whole-track map and refuses a mixed one | `relocate.mjs --map <file>` dry run exits 1 on the valid map and 2 on the mixed map |
| 002-subtrack-proposal | 003-subtrack-archive-and-numbering | `suggest-subtracks.mjs` emits a map in the `relocate.mjs` format and writes nothing | `git status --porcelain` prints nothing after a run |
| 003-subtrack-archive-and-numbering | 004-archive-search-and-json | Every declared subtrack holds `z_archive/.gitkeep` | `sweep-track-roots.mjs` prints no missing-archive line |
| 004-archive-search-and-json | 005-tests-and-closeout | `--include-archive` works in search and in recursive validation, and the default paths are unchanged | `generate-trigger-index.mjs --check` exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which command regenerates `specs/descriptions.json`? Phases 001 and 004 both need it. The approved plan names the cache and not the command.
- `.skilled/commands/speckit/assets/speckit-implement.yaml` line 71 carries the same option C wording as the two presentation assets. The approved plan names only the plan and complete assets. Should phase 002 also change it?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Approved design**: See `scratch/approved-plan.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
