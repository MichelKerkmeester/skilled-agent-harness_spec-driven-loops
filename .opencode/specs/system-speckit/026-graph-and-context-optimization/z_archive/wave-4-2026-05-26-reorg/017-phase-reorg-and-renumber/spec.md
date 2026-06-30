---
title: "Feature Specification: 026 Wave-4 Phase Reorg & Renumber [system-spec-kit/026-graph-and-context-optimization/017-phase-reorg-and-renumber/spec]"
description: "Meta-packet for the wave-4 reorganization that closes 026: 17 top-level phases consolidated into 7 themed parents (000-006), clean renumber, defer-in-place unfinished work, compliant root-doc rewrite."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
trigger_phrases:
  - "026 wave-4 reorg"
  - "026 phase renumber"
  - "026 close reorganization"
  - "017 phase reorg and renumber"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-phase-reorg-and-renumber"
    last_updated_at: "2026-05-26T16:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Stage 0-1 complete: worktree Public-026-reorg + DB snapshot taken; preflight baselines captured (ref-counts, JSON-parse 1177/0, strict baseline 1 pre-existing root error); rename-plan.json authored (46 moves, disjoint, naming-clean)."
    next_safe_action: "Stage 2: execute git mv moves per rename-plan.json (dependency-ordered: renames -> 005-children regroup -> top-level nests -> 004 split+archive)."
    blockers: []
    key_files:
      - "spec.md"
      - "scratch/rename-plan.json"
      - "scratch/build-rename-plan.js"
    completion_pct: 20
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: 026 Wave-4 Phase Reorg & Renumber

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

Final reorganization wave that closes `026-graph-and-context-optimization`. The packet had grown to 17 flat top-level phases across ~6 prior ad-hoc restructure waves, with systemic metadata drift (every phase `status:"planned"`, root `children_ids` missing 014/015/016, phantom `childTopology`) and a non-compliant root `spec.md` narrating migration history. This wave consolidates the 17 into 7 themed parents (000-006), renumbers cleanly, fixes all metadata, rewrites the root docs to spec-kit-compliant form, and records the full migration history in a new `context-index.md` — leaving 026 as the single most-effective historical record.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-26 |
| **Updated** | 2026-05-26 |
| **Branch** | `026-reorg` (worktree `Public-026-reorg`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
026 accumulated 17 flat top-level phases through repeated ad-hoc restructures. The root `spec.md` is stale and non-compliant (narrates merge history; references phases absent on disk), metadata drifted (all `status:"planned"`; root `children_ids` missing 014/015/016; phantom `childTopology`), and `005-code-graph` exceeds the 20-child phase-parent warning threshold (22 children). No root `context-index.md` exists.

### Purpose
Reorganize into 7 themed phase parents with clean sequential numbering, fix all metadata via regeneration, rewrite the root `spec.md` (compliant phase map) and a new `context-index.md` (migration bridge), defer unfinished work in place with explicit status, and close 026.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 46 folder moves consolidating 17 top-level phases -> 7 themed parents (000-006); see `scratch/rename-plan.json`.
- Clean sequential renumber + old->new migration bridge in `026/context-index.md`.
- Regenerate all `graph-metadata.json` / `description.json` under 026; fix systemic `status:"planned"` drift.
- Rewrite root `026/spec.md` to a compliant Phase Documentation Map (zero migration-history tokens).
- Defer-in-place: unfinished phases (004-children, 012, 015) stay within 026, marked `deferred`/`abandoned`.
- Archive leftover `scratch/` working files + dissolved `004-external-project-adoption` shell to `z_archive/wave-4-2026-05-26-reorg/`.

### Out of Scope
- Changing runtime code.
- Rewriting historical child packet narratives (spec/plan/tasks/implementation-summary/iterations preserved verbatim).
- Carving any work to a new spec 027 (defer-in-place decision).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `026/000-016/**` | Move | 46 subtree moves per rename-plan.json |
| `026/spec.md` | Rewrite | Compliant phase-parent map |
| `026/context-index.md` | Create | Full migration bridge (all waves) |
| `026/**/graph-metadata.json`, `**/description.json` | Regenerate | Path + status + topology refresh |
| `.opencode/specs/descriptions.json` | Regenerate | Registry path refresh (live external ref) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 7 themed top-level parents, contiguous 000-006. | `ls 026/[0-9][0-9][0-9]-*` shows exactly 000-006. |
| REQ-002 | No historical evidence lost. | rg historical-ref count == Stage-1 baseline; git mv preserves history. |
| REQ-003 | Metadata resolvable + accurate. | All JSON parses; children_ids<->parent_id reciprocity; status reflects real completion. |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Root spec.md compliant. | PHASE_PARENT_CONTENT passes (no migration tokens); strict validate exit 0. |
| REQ-005 | Migration bridge complete. | context-index.md maps every old top-level + 005/004 children + prior waves to new homes. |
| REQ-006 | Memory searchable post-move. | memory_search resolves 026 topics to new paths; zero hits on vanished paths. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh 026 --strict --recursive` exit 0, warnings <= baseline.
- **SC-002**: 7 contiguous top-level parents; all sub-wrappers <= 20 children; max depth <= 5.
- **SC-003**: All metadata regenerated; no `status:"planned"` on completed phases; no dangling depends_on/children_ids.
- **SC-004**: memory reindex + re-embed across all 4 vector DBs; memory_search verified.
<!-- /ANCHOR:success-criteria -->

---

## 6. EXECUTION REFERENCE

Authoritative move contract: `scratch/rename-plan.json` (generated by `scratch/build-rename-plan.js`).
Baselines: `scratch/baselines/` (ref-counts.tsv, json-parse, validate-strict-baseline-main.txt).
Full plan: `~/.claude/plans/i-want-to-re-organize-humble-clover.md`.
Rollback: filesystem DB snapshot at `Code_Environment/026-reorg-snapshots/20260526-162923/`; worktree discard.

## 7. OPEN QUESTIONS
- None blocking. Generator confirms 46 moves disjoint + naming-clean.
