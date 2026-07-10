---
title: "Implementation Plan: Phase 3: scaffold-hub"
description: "Plan the additive cli-external hub skeleton: five hub-root files plus two empty packet directories, with zero content relocation and zero scorer edits, verified against the non-strict parent-hub check."
trigger_phrases:
  - "cli-external scaffold plan"
  - "hub skeleton plan"
  - "mode-registry hub-router scaffold"
  - "phase 003 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/003-scaffold-hub"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the additive scaffold plan"
    next_safe_action: "Execute the additive scaffold after decision-gate approval"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/mode-registry.json"
      - ".opencode/skills/cli-external/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-hub"
      parent_session_id: null
    completion_pct: 0
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
| **Language/Stack** | JSON router artifacts plus a thin Markdown hub SKILL.md |
| **Framework** | OpenCode parent-skill hub pattern |
| **Storage** | Skill-local files only |
| **Testing** | `parent-skill-check.cjs` in non-strict mode plus `validate.sh` for this phase folder |

### Overview
This phase creates the additive `cli-external` hub skeleton so phases 004 and 005 have stable packet directories and a hub `mode-registry.json` to relocate into and to source the rewritten scorer from. No content moves and no runtime code changes in this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 decision gate approved with frozen registry/router/graph target
- [ ] Parent-skill templates identified
- [ ] Non-strict parent-hub check available as the scaffold gate

### Definition of Done
- [ ] Five hub-root files created carrying the single `cli-external` identity
- [ ] Two empty packet directories created
- [ ] Non-strict parent-hub structural checks pass with empty-packet warnings accepted
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive parent-hub skeleton, matching the pure two-tier sk-doc/sk-prompt shape.

### Key Components
- **Hub-root files**: `mode-registry.json`, `hub-router.json`, `description.json`, `SKILL.md`, `graph-metadata.json` under `cli-external/`.
- **Empty packet dirs**: `cli-opencode/` and `cli-claude-code/` reserved for relocation.
- **Single graph identity**: `cli-external/graph-metadata.json` with `family: cli`, shaped to absorb the folded children later.

### Data Flow
The hub-root files declare routing and identity but carry no packet-local content yet. Later phases relocate the two skills into the empty packet directories and dissolve their graph identities into the hub metadata.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/cli-external/` (new) | Future parent hub | Create five hub-root files and two empty packet dirs | Non-strict `parent-skill-check.cjs` structural pass |
| `.opencode/skills/cli-opencode/` and `.opencode/skills/cli-claude-code/` | Live flat dispatch skills | Unchanged this phase | Both remain the live skills until phases 004/005 |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the phase 002 frozen target shapes for registry, router, and graph identity
- [ ] Identify the parent-skill template files to copy from
- [ ] Confirm the non-strict parent-hub check as the scaffold gate

### Phase 2: Core Implementation
- [ ] Create `mode-registry.json` with two `packetKind: "workflow"` modes
- [ ] Create `hub-router.json` with base-three outcomes and `defaultMode: "cli-opencode"`
- [ ] Create `description.json`, thin `SKILL.md` at version 1.0.0.0, and the single `graph-metadata.json` with `family: cli`
- [ ] Create the two empty packet directories

### Phase 3: Verification
- [ ] Run the non-strict parent-hub check and accept empty-packet warnings
- [ ] Confirm zero content relocation and zero scorer edits occurred
- [ ] Run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural gate | Hub skeleton shape | `PARENT_HUB_CHECK_STRICT=0 parent-skill-check.cjs` |
| Template validation | Phase 003 spec docs | `validate.sh` against this phase folder |
| Diff audit | Additive-only guarantee | Confirm no files under the two flat skills changed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 decision gate | Internal | Yellow until approved | Scaffold shape is unbound without the frozen target |
| Parent-skill templates | Internal | Green | Hub files could drift from validator expectations |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The non-strict parent-hub check fails structurally, or content relocation is detected in this scaffold phase.
- **Procedure**: Delete the `cli-external/` skeleton files and empty directories; the two flat skills are untouched, so no skill-behavior rollback is needed.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
