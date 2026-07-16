---
title: "Subsystem: Skill Interconnection — Advisor Routing Projection"
description: "The skill advisor's routing projection is hand-maintained and drift-prone: new deep-loop modes added to mode-registry.json are never automatically reflected in advisor alias tables or published as workflowMode in advisor_recommend responses."
trigger_phrases:
  - "advisor routing projection"
  - "skill interconnection"
  - "workflowMode publication"
  - "005 skill interconnection"
  - "mode registry drift guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/005-skill-interconnection"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored subsystem parent spec for 005-skill-interconnection"
    next_safe_action: "Phase complete; all sub-phases shipped"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Subsystem: Skill Interconnection — Advisor Routing Projection

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-system-spec-kit |
| **Successor** | 006-ux-observability-automation |
| **Handoff Criteria** | Child phase 001-advisor-routing-projection passes `validate.sh --strict`; implementation summary present |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the system-deep-loop/024-deep-loop-improved subsystem groups.

**Scope Boundary**: Advisor routing projection generator and `workflowMode` publication. No changes to the advisor's core scoring logic or to deep-loop-runtime.

**Dependencies**:
- Reads `mode-registry.json` from deep-loop-workflows skills (read-only; no runtime cross-skill calls).

**Deliverables**:
- Filled `001-advisor-routing-projection/spec.md` with plan + tasks + checklist authored and executed.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
New deep-loop lexical modes added to `mode-registry.json` are born inert: the advisor's alias tables and drift-guard test are not automatically regenerated, so the advisor scores against stale projections and `advisor_recommend` responses omit the resolved `workflowMode` field that callers need. The parent-skill scaffolder also fails to emit the projection for newly created mode packets.

### Purpose
Generate the deep-loop alias/mode projection automatically from `mode-registry.json` (generator + freshness-check test as the only readers), publish the resolved `workflowMode` in `advisor_recommend`, fold the projection hash into the advisor cache signature, and wire the parent-skill scaffolder to emit the projection so no new mode is born without routing coverage.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Projection generator reading `mode-registry.json` → updating `aliases.ts`
- Drift-guard test converted from content-equality check to hash-freshness check
- `workflowMode` field added to `advisor_recommend` response in both Python and TS handlers
- Projection hash folded into advisor cache signature
- Parent-skill scaffolder (`create_parent_skill_auto.yaml`) updated to emit projection on creation

### Out of Scope
- Changes to advisor scoring math or ranking logic — not in scope
- Runtime cross-skill reads (the generator is the only reader; no runtime dependency on deep-loop-workflows) — explicitly preserved

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Modify | Convert to projection hash freshness check |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Modify | Auto-generated projection from mode-registry.json |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Publish resolved workflowMode in advisor_recommend |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | Modify | Add workflowMode to response schema |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | Modify | Surface workflowMode from computed result |
| `.opencode/commands/create/assets/create_parent_skill_auto.yaml` | Modify | Emit routing projection on parent-skill scaffold |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detail lives in child phase `001-advisor-routing-projection/spec.md` | Child spec passes `validate.sh --strict` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | All child deliverables listed in the Phase Documentation Map reach Status: Complete | `validate.sh --recursive` on this folder exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Child phase 001-advisor-routing-projection passes `validate.sh --strict` with zero errors
- **SC-002**: Implementation summary is present and non-empty in the child phase folder
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Generator introduces a runtime cross-skill read | High — violates the no-runtime-cross-skill-read invariant | Generator runs only at build/scaffold time, never at advisor request time |
| Dependency | mode-registry.json schema stability | Medium — schema changes break the generator | Pin the generator to the schema version; add schema version check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the projection hash be versioned alongside `aliases.ts` or embedded in a separate sidecar file?
- Does `workflowMode` need to be nullable (for skills without mode-registry.json) or always present?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-advisor-routing-projection/` | Generate alias/mode projection from mode-registry.json; publish workflowMode; parent-skill scaffolder integration | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| (single phase — no handoffs) | | | |
<!-- /ANCHOR:phase-map -->
