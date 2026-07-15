---
title: "Implementation Plan: Phase 3: scaffold-hub"
description: "Plan for the additive-only mcp-tooling hub skeleton: create routing metadata and a thin SKILL.md copied from the phase 002 frozen target, plus empty packet directories, without moving any content."
trigger_phrases:
  - "mcp-tooling hub scaffold plan"
  - "additive hub skeleton plan"
  - "mode-registry hub-router create"
  - "phase 003 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/003-scaffold-hub"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled scaffold-hub plan to reflect executed scaffold"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/003-scaffold-hub/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/003-scaffold-hub/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/003-scaffold-hub/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-hub"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: scaffold-hub

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
| **Language/Stack** | JSON routing metadata plus a thin Markdown SKILL.md |
| **Framework** | OpenCode parent-skill hub pattern (mixed workflow-plus-transport) |
| **Storage** | Skill-local files under `.opencode/skills/mcp-tooling/` |
| **Testing** | `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=0`; `validate.sh` for this phase folder |

### Overview
This phase copies the phase 002 frozen target into real hub files and creates empty packet directories, so phases 004-005 can relocate content against a stable, valid skeleton. Nothing moves in this phase.
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
Additive-only hub skeleton: create the routing layer first, move content later.

### Key Components
- **Thin hub `SKILL.md`**: Routing-only, `version: 1.0.0.0`, dispatches by `workflowMode` through `mode-registry.json`; holds no per-mode logic.
- **`mode-registry.json`**: Three modes (two workflow, one transport) plus the `transport-axis` extension listing `mcp-figma`.
- **`hub-router.json`**: Base three outcomes, `defaultMode: "mcp-chrome-devtools"`, tie-break ordering workflows before the transport.
- **Empty packet directories**: `mcp-chrome-devtools/`, `mcp-click-up/`, `mcp-figma/`, ready to receive content.

### Data Flow
The advisor routes to the single `mcp-tooling` identity; the hub reads `hub-router.json`, resolves a `workflowMode`, and would load the packet's `SKILL.md` once content is present in phases 004-005.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-tooling/` | New hub root | Create routing metadata and thin SKILL.md | `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=0` |
| The three source bridge trees | Current flat skills | Unchanged in this phase | Byte-identical git status for the three trees |

Required inventories:
- Same-class producers: `rg -n 'workflowMode|packetKind|transport-axis' .opencode/skills/sk-design/mode-registry.json`.
- Consumers of changed symbols: none yet; the hub is empty until phases 004-005.
- Matrix axes: three modes (two workflow, one transport) plus one extension.
- Algorithm invariant: no `git mv` runs in this phase; only new `mcp-tooling/` files are created.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the phase 002 frozen target is approved
- [x] Create the `.opencode/skills/mcp-tooling/` directory and empty packet subdirectories
- [x] Confirm no `git mv` will run in this phase

### Phase 2: Core Implementation
- [x] Create `mode-registry.json` from the phase 002 target (three modes plus transport-axis extension)
- [x] Create `hub-router.json` from the phase 002 target (base three outcomes, default mcp-chrome-devtools)
- [x] Create the thin hub `SKILL.md` (version 1.0.0.0) and `description.json`

### Phase 3: Verification
- [x] Run `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=0`; confirm structural checks pass with empty-packet warnings acceptable
- [x] Confirm the three source bridge trees are byte-unchanged
- [x] Run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Hub skeleton shape | `parent-skill-check.cjs` (`PARENT_HUB_CHECK_STRICT=0`) |
| Additive-only | Source trees unchanged | `git status` on the three bridge trees |
| Template validation | Phase 003 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 frozen target | Internal | Green | Cannot scaffold without an approved registry/router target |
| Parent-hub doctrine + sk-design precedent | Internal | Green | Needed to keep the skeleton canon-shaped |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The scaffold drifts from the frozen target, or a content move happens by mistake.
- **Procedure**: Delete the newly created `.opencode/skills/mcp-tooling/` files and empty dirs; the three source trees are untouched, so no restore is needed.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
