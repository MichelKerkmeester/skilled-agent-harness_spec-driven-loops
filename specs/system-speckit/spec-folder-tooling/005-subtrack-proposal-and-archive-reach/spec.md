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
    last_updated_at: "2026-11-14T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Applied the 2026-11-14 plan verification to phases 006 to 010"
    next_safe_action: "Start phase 006-relocate-resume-and-preflight"
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
| **Status** | In Progress |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/364-subtrack-proposal-archive-reach` |
| **Parent Spec** | None. This packet sits directly in the declared subtrack `system-speckit/spec-folder-tooling` |
| **Parent Packet** | None |
| **Predecessor** | `004-create-path-track-refresh` |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict --recursive` prints `RESULT: PASSED` for this folder and all thirteen children |
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
- Close the in-scope findings of the two code reviews of 2026-11-14, in phases 006 to 010: reviewer A findings 1 to 12 and reviewer B findings 6, 7 and 8.
- Close every P1 and P2 finding of the two reviews of the finished packet, the DeepSeek deep review in `review/review-report.md` and the Fable 5.2 review in `review/fable-5-2-review.md`, in phases 011 to 013.

### Operator Decisions
These were taken in the planning session and bind every phase.

- This work is a new phased packet with five children. `recommend-level.sh --loc 2500 --files 35` returned Level 2 and `recommended_phases: false`. The operator approved five phases anyway.
- Archive search is opt-in and live. It uses ripgrep plus per-packet JSON. No archive index is committed and CI is unchanged.
- Mixed tracks stay forbidden. A subtrack proposal is a whole-track map.
- Renumbering is a deterministic tool that updates every store. No hand edits and no AI fix-up work.
- Next-number allocation counts archived packets.
- The review findings of 2026-11-14 are closed in new child phases 006 onward under this parent. Phases 001 to 005 stay Complete and are not edited. `recommend-level.sh` returned Level 1 for four of the five new phases and Level 0 for one, which the authoring card maps to Level 1. This is decision Q010 in `decision-record.md`.
- The remediation work happens in git worktree 375, created from `origin/main`. This is decision Q011.
- For the remediation phases, planning and plan verification are done by fresh Fable 5.2 instances at high effort through claude2, and implementation by DeepSeek V4.1 Flash at max reasoning through the dsh harness. This is decision Q012.
- The findings of the two reviews of the finished packet are closed in three new children: 011 for the code, 012 for the feature catalog and playbook, 013 for the skill documents, changelog and packet records. Decision Q016.
- This session writes the planning documents for phases 011 to 013, and a fresh Fable 5.2 instance verifies them. Decision Q017, which replaces Q012's planning clause for these three phases.
- Phase 013 adds the two phase 009 routing files to the review scope and reviews that change. Decision Q018.
- Amendment of 2026-11-14 to phase 001: phase 008 adds exit status 3 to `relocate.mjs`, for a run whose steps and sweep all passed and whose only failure is a moved packet's own validation. It amends REQ-001, which says 2 on any failure, and REQ-012, which says a failure leaves the report and exits 2, both in `001-relocation-engine/spec.md`. Phase 001 stays Complete and is not edited, so this line is the record. Statuses 0, 1 and 2 keep their meaning otherwise.

### Handed to the 008 session
Reviewer B findings 1 to 5 concern the hub vocabulary packet, which lives on another session's branch. They are handed to the 008 command surfacing session by decision Q013 and are not planned here.

- B1: `sk-doc/graph-metadata.json:329-334`, "confirm flag" and "agent definition" became advisor signals and pull non-doc prompts to sk-doc.
- B2: `system-deep-loop/graph-metadata.json:78-80`, bare words such as stop, several and models now count for system-deep-loop.
- B3: `local-native-approved-divergences.json:719`, the hand-written reason misstates why the prompt flipped.
- B4: the packet docs say the archived manifest was written by the same refresh, and it was not.
- B5: three smaller doc mismatches, a missing fixture path in T019, an untouched continuity block and a too-narrow statement about the check.

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
| `runtime/cli/spec/relocate.mjs` | Modify | 006, 007, 008 | Resume and preflight state, bare-name and pre-archive rewrites, one added exit status |
| `runtime/cli/spec/archive.sh`, `runtime/cli/spec/create.sh`, `runtime/cli/spec/README.md` | Modify | 008 | Restore verdict, mixed-track refusal, phase numbering that reads `z_archive/`, the exit codes stated in the `relocate.mjs` row |
| `runtime/cli/retrieval/rg-wrapper.mjs`, `runtime/cli/spec/suggest-subtracks.mjs` | Modify | 009 | Archived marker in the path record, proposals the preflight accepts |
| `graph-metadata.json`, and the advisor's generated `skill-graph.json` and `scorer-eval-baseline.json` | Modify | 009 | Reworded archive-search and sub-track signals, regenerated by the advisor's writers |
| `runtime/cli/tests/relocate.vitest.ts`, `archive-track.vitest.ts`, `archive-numbering.vitest.ts`, `rg-include-archive.vitest.ts`, `suggest-subtracks.vitest.ts` | Modify | 006 to 009 | One happy-path case and one edge case per changed surface |
| `runtime/cli/tests/relocate-real-pipeline.vitest.ts` | Create | 010 | A suite that runs the true writers |
| `runtime/cli/spec/relocate.mjs`, `runtime/cli/spec/archive.sh`, `runtime/cli/tests/relocate.vitest.ts`, `archive-track.vitest.ts` | Modify | 011 | Re-parent resume, exit 3 condition, bare-name boundary, case-fold probe, restore check without a dry run, help text |
| `feature-catalog/` and `manual-testing-playbook/` pages for relocation, lifecycle, archive search and the proposal | Modify | 012 | Describe the behavior of phases 006 to 011 |
| `SKILL.md`, `README.md`, `references/`, `runtime/cli/spec/README.md`, `changelog/v2.13.1.0.md` | Modify, Create | 013 | Describe the behavior of phases 006 to 011 and release it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-relocation-engine/ | `relocate.mjs`: move, renumber and re-parent packets and rewrite every store, plus `--declare-subtrack` | Complete. Code in `fc218a0d48` |
| 2 | 002-subtrack-proposal/ | `suggest-subtracks.mjs` and the wording and docs that raise a subtrack as a choice | Complete. Code in `b8912b831c` |
| 3 | 003-subtrack-archive-and-numbering/ | `z_archive/` on every declared subtrack and numbering that counts archived packets | Complete. Code in `5f3e19712e` |
| 4 | 004-archive-search-and-json/ | Opt-in archive search, recursive archive validation and archived JSON health | Complete. Code in `05a83a7d88`, metadata in `55e73d37b5`. All eight criteria `Met` |
| 5 | 005-tests-and-closeout/ | Vitest suites for phases 1 to 4, real-tree checks and packet closeout | Complete. Suites in `5fefd819e1` and `36b3a68ab7`. Ten criteria `Met`, AC-008 `Superseded` by ADR-001 |
| 6 | 006-relocate-resume-and-preflight/ | A rerun of the same map finishes any stopped step, and the preflight refuses a source that never existed and two spellings of one folder. Closes A1, A3, A4, A5 and B6 | Complete |
| 7 | 007-phase-map-and-prearchive-rewrites/ | Bare sibling names in a phase parent's documents and the id a packet had before it was archived are rewritten. Closes A2 and A8 | Complete |
| 8 | 008-restore-and-phase-numbering/ | The restore verdict, the mixed-track refusal on restore and phase numbering that counts archived phases. Closes A6, A7 and A9 | Complete |
| 9 | 009-proposal-search-and-routing/ | The archived marker in the path record, proposals the preflight accepts and two advisor signals. Closes A11, A12, B7 and B8 | Complete |
| 10 | 010-real-pipeline-tests/ | One suite that runs the true writers and the resume paths. Closes A10 | Complete |
| 11 | 011-relocate-and-restore-fixes/ | A stopped re-parent finished by a rerun, exit 3 only on `RESULT: FAILED`, the bare-name boundary and a restore check without a dry run. Closes Fable F1 to F4, F6 recorded as unreachable | Draft |
| 12 | 012-catalog-and-playbook-alignment/ | The feature catalog and playbook pages the DeepSeek review found stale | Draft |
| 13 | 013-skill-docs-and-housekeeping/ | `SKILL.md`, references, READMEs, a `v2.13.1.0` changelog entry, the packet records and a review of the phase 009 routing change. Closes Fable F5, F7, F8 and F9 | Draft |

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
| 005-tests-and-closeout | 006-relocate-resume-and-preflight | The two reviews of 2026-11-14 are stored in `scratch/` and each in-scope finding is assigned to one phase | `ls scratch/review-20261114-*.md` lists two files |
| 006-relocate-resume-and-preflight | 007-phase-map-and-prearchive-rewrites | After a late step fails once, a rerun of the same map finishes it | In a `mktemp` copy the second `relocate.mjs --apply` exits 0 and the third prints `relocate: nothing to do` |
| 007-phase-map-and-prearchive-rewrites | 008-restore-and-phase-numbering | A renumbered phase is named correctly in its parent's documents | After `relocate.mjs --renumber <phase parent> --apply`, `rg` for the old folder name in the parent's `spec.md` prints nothing |
| 008-restore-and-phase-numbering | 009-proposal-search-and-routing | A new phase is numbered above an archived one | With `001-alpha` live and `z_archive/002-gamma` archived, `create.sh --phase --parent` creates `003-*` |
| 009-proposal-search-and-routing | 010-real-pipeline-tests | The path record marks archived paths and a printed proposal passes the preflight | `rg-wrapper.mjs path <phrase> --include-archive --json` marks its archived paths, and `relocate.mjs --map <printed map>` exits 1 |
| 010-real-pipeline-tests | 011-relocate-and-restore-fixes | Both reviews of the finished packet are stored in `review/` | `ls review/review-report.md review/fable-5-2-review.md` lists both |
| 011-relocate-and-restore-fixes | 012-catalog-and-playbook-alignment | A stopped re-parent is finished by a rerun, and the suites pass | In a `mktemp` copy the second `relocate.mjs --apply` exits 0 and the third prints `relocate: nothing to do` |
| 012-catalog-and-playbook-alignment | 013-skill-docs-and-housekeeping | The catalog and playbook state exit 3, `archivedPaths` and the mixed-track refusal | `rg -n 'archivedPaths' feature-catalog/retrieval/rg-archive-search.md` prints a line |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Answered: which command regenerates `specs/descriptions.json`? None. The producer is `ensureDescriptionCache` in `runtime/lib/search/folder-discovery.ts`, called from the compiled module. Since phase 004 `archive.sh` calls it after each archive and each restore, on the operator's decision.
- Answered: `.skilled/commands/speckit/assets/speckit-implement.yaml` line 71 carried the same option C wording as the two presentation assets, and the approved plan named only the plan and complete assets. Phase 002 changed it with the others, by operator decision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Approved design**: See `scratch/approved-plan.md`
- **Review findings**: See `scratch/review-20261114-core-code.md` (reviewer A) and `scratch/review-20261114-merge-fixes-and-hub-vocabulary.md` (reviewer B)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
