---
title: "Implementation Plan: Phase 4: onboard-chrome-devtools"
description: "Plan for git mv of the mcp-chrome-devtools tree into mcp-tooling/mcp-chrome-devtools/ with internal self-path rewrites, keeping the packet version and changelog intact."
trigger_phrases:
  - "chrome-devtools onboarding plan"
  - "mcp-chrome-devtools move plan"
  - "self-path rewrite plan"
  - "phase 004 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-tooling-parent/004-onboard-chrome-devtools"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled onboarding plan to reflect the executed move"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/004-onboard-chrome-devtools/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/004-onboard-chrome-devtools/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-onboard-chrome-devtools"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: onboard-chrome-devtools

<!-- SPECKIT_LEVEL: 1 -->
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
| **Framework** | OpenCode parent-skill hub pattern |
| **Storage** | Skill-local files under `.opencode/skills/mcp-tooling/mcp-chrome-devtools/` |
| **Testing** | Grep for stale self-paths; `git status` rename detection; `validate.sh` for this phase folder |

### Overview
This phase relocates the smallest workflow bridge (41 files) into the hub and corrects its internal self-paths, exercising the move procedure on the simplest case before phase 005's larger moves.
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
Single-tree `git mv` relocation followed by internal self-path rewrite.

### Key Components
- **`git mv` move**: Relocate the full 41-file tree so git records renames.
- **Self-path rewrite**: Update internal absolute AND relative references (both `.opencode/skills/mcp-chrome-devtools/` and any `../mcp-chrome-devtools` / `../mcp-*` form) to the nested hub path, sparing historical changelog prose.
- **Identity preservation**: Keep `version: 1.0.8.0` and the packet `changelog/` untouched.
- **Resolution-based move gate**: After the rewrite, resolve every rewritten relative link (`../mcp-*`, `../sk-*`) against its containing file's directory and confirm the target path exists on disk — a grep confirming the OLD path string is gone is necessary but not sufficient, since a broken rewrite can still pass that grep.

### Data Flow
The moved packet becomes the hub's `mcp-chrome-devtools` workflow mode target. Advisor and external-referrer wiring is deferred to phase 006, so nothing outside the tree changes here.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-chrome-devtools/` tree | Flat workflow bridge | `git mv` under the hub; rewrite internal self-paths | Grep for the old path returns zero live hits inside the moved tree |
| External referrers (`doctor_mcp_install.yaml`, advisor corpus) | Point at the old path | Unchanged in this phase | Deferred to phase 006 |

Required inventories:
- Same-class producers: `rg -n '\.opencode/skills/mcp-chrome-devtools/|\.\./mcp-chrome-devtools' .opencode/skills/mcp-tooling/mcp-chrome-devtools` (absolute AND relative forms).
- Consumers of changed symbols: deferred to phase 006's external sweep.
- Matrix axes: one tree, ~41 files, internal self-paths only.
- Algorithm invariant: rewrite only LIVE functional self-paths; leave historical changelog narrative unchanged.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the hub skeleton and empty `mcp-chrome-devtools/` packet dir exist
- [x] Inventory internal self-path references inside the tree before moving
- [x] Confirm no external referrer will be touched in this phase

### Phase 2: Core Implementation
- [x] `git mv .opencode/skills/mcp-chrome-devtools` into `.opencode/skills/mcp-tooling/mcp-chrome-devtools`
- [x] Rewrite internal absolute and relative self-paths to the nested location
- [x] Confirm `version: 1.0.8.0` and the packet `changelog/` are intact

### Phase 3: Verification
- [x] Grep the moved tree for the old path; confirm zero live self-path hits
- [x] Resolve every rewritten relative link (`../mcp-*`, `../sk-*`) on disk from its containing file and confirm the target exists, not just that the old path string is grep-absent
- [x] Confirm `git status` shows renames, not deletes-plus-adds
- [x] Run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Self-path audit | Moved tree | `rg` for the old skill-folder path |
| Link-resolution audit | Rewritten relative links | Resolve each `../mcp-*`/`../sk-*` target from its containing file's directory; confirm existence, not just grep-absence |
| Rename integrity | Move operation | `git status` rename detection |
| Template validation | Phase 004 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 hub skeleton | Internal | Green | No target directory to move into |
| Phase 001 self-path inventory | Internal | Green | Needed to catch every live internal reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live self-path is missed, or the move is recorded as delete-plus-add instead of a rename.
- **Procedure**: Inverse `git mv` back to the flat location before commit; after commit, `git revert` the move commit and re-plan the self-path rewrite.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
