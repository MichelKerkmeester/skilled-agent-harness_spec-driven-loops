---
title: "Implementation Plan: Phase 5: foldin-clickup-and-figma"
description: "Plan for git mv of the mcp-click-up workflow tree and the mcp-figma transport tree into the hub, with internal self-path rewrites and preservation of figma's no-Write/Edit transport surface and sk-design pairing."
trigger_phrases:
  - "clickup figma fold-in plan"
  - "mcp-figma transport move plan"
  - "mcp-click-up move plan"
  - "phase 005 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/005-foldin-clickup-and-figma"
    last_updated_at: "2026-07-16T16:55:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled fold-in plan to reflect the executed moves"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/005-foldin-clickup-and-figma/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/005-foldin-clickup-and-figma/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-clickup-and-figma"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: foldin-clickup-and-figma

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `git mv` relocation plus Markdown/script self-path edits |
| **Framework** | OpenCode parent-skill hub pattern (workflow packet + transport packet) |
| **Storage** | Skill-local files under `.opencode/skills/mcp-tooling/mcp-click-up/` and `.../mcp-figma/` |
| **Testing** | Grep for stale self-paths; figma `allowed-tools` diff; `git status` rename detection; `validate.sh` for this phase folder |

### Overview
This phase relocates the second workflow bridge (154 files) and the transport bridge (40 files), correcting internal self-paths and preserving figma's transport posture and `sk-design` pairing for phase 006's graph union.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two single-tree `git mv` relocations (one workflow, one transport) followed by internal self-path rewrites.

### Key Components
- **click-up move**: Relocate the 154-file workflow tree; rewrite internal self-paths; keep `version: 1.0.0.0`.
- **figma move**: Relocate the 40-file transport tree; rewrite internal self-paths; keep the no-Write/Edit `allowed-tools`, `version: 1.0.0.0`, and the `sk-design` pairing content.
- **Transport-axis handling**: figma's transport posture is preserved verbatim so phase 006 can union its outward `depends_on sk-design` edge into the hub graph identity.
- **Resolution-based move gate**: After the rewrite, resolve every rewritten relative link (`../mcp-click-up`, `../mcp-figma`, `../sk-*`) against its containing file's directory and confirm the target path exists on disk — a grep confirming the OLD path string is gone is necessary but not sufficient, since a broken rewrite can still pass that grep.

### Data Flow
Both moved packets become hub mode targets (click-up workflow, figma transport). Advisor and external-referrer wiring is deferred to phase 006, so nothing outside the two trees changes here.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-click-up/` tree | Flat workflow bridge | `git mv` under the hub; rewrite internal self-paths | Grep for the old path returns zero live hits inside the moved tree |
| `.opencode/skills/mcp-figma/` tree | Flat transport bridge | `git mv` under the hub; rewrite internal self-paths; preserve transport surface | figma `allowed-tools` byte-unchanged; grep for the old path returns zero live hits |
| External referrers + advisor graph | Point at old paths / hold child graph files | Unchanged in this phase | Deferred to phase 006 |

Required inventories:
- Same-class producers: `rg -n '\.opencode/skills/mcp-click-up/|\.opencode/skills/mcp-figma/|\.\./mcp-click-up|\.\./mcp-figma' .opencode/skills/mcp-tooling` (absolute AND relative forms).
- Consumers of changed symbols: deferred to phase 006's external sweep.
- Matrix axes: two trees (154 + 40 files), internal self-paths only, plus the figma transport-surface invariant.
- Algorithm invariant: figma's `allowed-tools` must grant no `Write`/`Edit` after the move; rewrite only LIVE self-paths.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 004 is complete and the hub has one packet already resolving
- [x] Inventory internal self-path references inside both trees before moving
- [x] Record figma's current `allowed-tools` to diff against after the move

### Phase 2: Core Implementation
- [x] `git mv .opencode/skills/mcp-click-up` into `.opencode/skills/mcp-tooling/mcp-click-up`
- [x] `git mv .opencode/skills/mcp-figma` into `.opencode/skills/mcp-tooling/mcp-figma`
- [x] Rewrite internal absolute and relative self-paths in both trees (including `../mcp-*` cross-skill forms); keep both versions and changelogs intact

### Phase 3: Verification
- [x] Grep both moved trees for their old paths; confirm zero live self-path hits
- [x] Resolve every rewritten relative link (`../mcp-click-up`, `../mcp-figma`, `../sk-*`) on disk from its containing file and confirm the target exists, not just that the old path string is grep-absent
- [x] Diff figma's `allowed-tools` before/after; confirm no `Write`/`Edit` and `mutatesWorkspace:false`
- [x] Confirm `git status` shows renames; run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Self-path audit | Both moved trees | `rg` for the old skill-folder paths |
| Link-resolution audit | Rewritten relative links | Resolve each `../mcp-click-up`/`../mcp-figma`/`../sk-*` target from its containing file's directory; confirm existence, not just grep-absence |
| Transport invariant | figma `allowed-tools` | Diff before/after; confirm no Write/Edit |
| Rename integrity | Move operations | `git status` rename detection |
| Template validation | Phase 005 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 complete | Internal | Green | The move procedure and hub packet resolution must be proven first |
| Phase 001 self-path inventory | Internal | Green | Needed to catch every live internal reference in both trees |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live self-path is missed, figma's transport surface changes, or a move is recorded as delete-plus-add.
- **Procedure**: Inverse `git mv` back to the flat locations before commit; after commit, `git revert` the move commit and re-plan the self-path rewrite.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
