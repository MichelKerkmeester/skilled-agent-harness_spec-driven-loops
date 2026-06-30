---
title: "Advisor Routing Projection Generator and workflowMode Publication"
description: "New deep-loop lexical modes added to mode-registry.json are born inert: the advisor's alias tables are not regenerated, the drift-guard test is a stale content-equality check, and advisor_recommend responses omit the resolved workflowMode field that callers need for downstream routing."
trigger_phrases:
  - "advisor routing projection"
  - "workflowMode publication"
  - "mode registry drift guard"
  - "advisor alias table"
  - "001 advisor routing projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/005-skill-interconnection/001-advisor-routing-projection"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored leaf spec for 001-advisor-routing-projection"
    next_safe_action: "Author plan.md and tasks.md before implementation"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Advisor Routing Projection Generator and workflowMode Publication

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict` passes; plan.md and checklist.md authored; implementation summary present |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the single leaf phase within `005-skill-interconnection`. No handoffs to sister phases.

**Scope Boundary**: Skill advisor MCP server internals (`aliases.ts`, `skill_advisor.py`, `advisor-recommend.ts`, drift-guard test) and the parent-skill scaffolder YAML. No changes to deep-loop-runtime or the advisor's core scoring math.

**Dependencies**:
- Read-only access to `mode-registry.json` from deep-loop-workflows skills at build/scaffold time only (no runtime cross-skill reads).
- No blocking dependency on other implementation subsystems.

**Deliverables**:
- Projection generator that reads `mode-registry.json` → updates `aliases.ts`
- Drift-guard test converted to hash-freshness check
- `workflowMode` field added to `advisor_recommend` response
- Projection hash folded into advisor cache signature
- Parent-skill scaffolder emits projection on creation

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using `156-skill-interconnection-001`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When a new deep-loop mode is added to `mode-registry.json`, the advisor's alias tables in `aliases.ts` require a manual edit; the drift-guard test compares file content rather than a freshness hash, so it cannot detect stale aliases at build time. Additionally, `skill_advisor.py` already computes the resolved `workflowMode` internally but the TypeScript `advisor-recommend.ts` handler drops it from the response, leaving callers without the information they need to route invocations. New parent skills scaffolded by `create_parent_skill_auto.yaml` also lack a projection step, so newly created mode packets are born inert.

### Purpose
Generate the alias/mode projection automatically from `mode-registry.json`, convert the drift-guard to a hash-freshness check, surface `workflowMode` in advisor responses, and wire the scaffolder to emit the projection so every new mode immediately has routing coverage.

> **Reference**: `external/loop-cli-main/src/i18n/index.ts:1,3`; `config/constants.ts:29,38`; `ARCHITECTURE.md:213,216` — demonstrates generated projection tables from a central registry with hash-based freshness detection. (Research: research.md §5.4, iters 32, 38)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Projection generator script (reads `mode-registry.json`, outputs alias projection into `aliases.ts`)
- Drift-guard test refactored from content-equality to projection hash freshness check
- `workflowMode` field surfaced in `advisor_recommend` response (Python + TS handler)
- Projection hash included in advisor cache signature (cache key must change when projection changes)
- `create_parent_skill_auto.yaml` scaffolder step to emit projection on new parent-skill creation

### Out of Scope
- Changes to advisor scoring math, ranking algorithm, or threshold logic — not in scope
- Runtime cross-skill reads (generator runs only at build/scaffold time; runtime advisor never reads mode-registry.json directly) — this invariant is explicitly preserved
- Advisor daemon restart logic — not in scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Modify | Convert to projection hash freshness check |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Modify | Auto-generated projection section from mode-registry.json |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Publish resolved workflowMode in advisor_recommend response |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | Modify | Add optional workflowMode field to response schema |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | Modify | Pass workflowMode from computed result to response |
| `.opencode/commands/create/assets/create_parent_skill_auto.yaml` | Modify | Add projection-emit step after parent-skill scaffold |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Generator produces an `aliases.ts` projection that the drift-guard test accepts as fresh | `routing-registry-drift-guard.vitest.ts` passes after generator runs; fails when `mode-registry.json` changes without regenerating |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `advisor_recommend` response includes `workflowMode` when the skill has a matching mode-registry entry | Test: call `advisor_recommend` for a deep-loop skill → assert `workflowMode` is non-null in response |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Drift-guard test detects a stale projection (fails when `mode-registry.json` has a new mode but `aliases.ts` is not regenerated)
- **SC-002**: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Generator accidentally introduces a runtime cross-skill read | High — violates the no-runtime-cross-skill-read invariant | Generator is a standalone script; lint rule or CI check ensures it is never imported in runtime paths |
| Risk | Projection hash collides between mode-registry.json versions | Low — SHA-based hash collision is negligible | Use SHA-256 of canonical JSON serialization |
| Risk | `workflowMode` addition breaks existing advisor response consumers expecting a fixed schema | Medium — additive field may confuse strict deserializers | Mark as optional in schema; callers are backwards-compatible |
| Dependency | `mode-registry.json` schema must be stable during implementation | Medium | Read the file first; pin schema version before authoring generator |

> **Note**: Tagged `med/quick-win` in research §5.4. No deep-rewrite variant — this is purely additive. (Research: research.md §5.4, iters 32, 38)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `aliases.ts` contain a generated section that is overwritten by the generator, or should it be fully auto-generated (with a manual override section)?
- Is the projection hash stored in a sidecar file or embedded as a comment in `aliases.ts`?
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
