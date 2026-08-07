---
title: "Implementation Plan: Advisor Routing Projection Generator and workflowMode Publication"
description: "Documents the completed advisor alias projection, freshness guard, and workflowMode response publication work."
trigger_phrases:
  - "advisor routing projection"
  - "workflowMode publication"
  - "mode registry drift guard"
  - "advisor alias table"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/005-skill-interconnection/001-advisor-routing-projection"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts"
      - ".opencode/commands/create/assets/create_parent_skill_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Advisor Routing Projection Generator and workflowMode Publication

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript advisor MCP server, Python advisor CLI, YAML scaffolder asset |
| **Framework** | System Skill Advisor alias scoring and deep-loop mode registry projection |
| **Storage** | Generated alias projection and advisor cache signature hash |
| **Testing** | Vitest drift guard, advisor response schema check, projection freshness check |

### Overview
This completed work made deep-loop routing aliases generated from `mode-registry.json` rather than manually maintained in `aliases.ts`. It also converted the drift guard to projection hash freshness, surfaced `workflowMode` in advisor responses, and wired parent-skill creation to emit the projection when new modes are scaffolded.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: new deep-loop modes could be born inert without regenerated advisor aliases.
- [x] Success criteria measurable: drift guard fails on stale projection and advisor response includes `workflowMode`.
- [x] Dependencies identified: generator reads `mode-registry.json` at build or scaffold time only.

### Definition of Done
- [x] Alias projection is generated into `aliases.ts` from the mode registry.
- [x] Drift-guard test checks projection hash freshness rather than static content equality.
- [x] `advisor_recommend` publishes optional `workflowMode` through Python, schema, and handler surfaces.
- [x] Advisor cache signature changes when the projection changes.
- [x] Parent-skill scaffolder emits the projection during creation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-to-projection generation: `mode-registry.json` remains the source of truth, a build/scaffold step projects aliases into advisor-owned code, and hash freshness prevents stale checked-in projections.

### Key Components
- **`routing-registry-drift-guard.vitest.ts`**: Verifies the projection hash is fresh after mode registry changes.
- **`aliases.ts`**: Carries the generated advisor alias and mode projection used by scorer lanes.
- **`skill_advisor.py`**: Computes and returns the resolved `workflowMode` value.
- **Advisor schema and handler**: Declare and pass through the optional `workflowMode` response field.
- **`create_parent_skill_auto.yaml`**: Runs projection emission when a new parent skill or mode is scaffolded.

### Data Flow
The generator reads `mode-registry.json`, serializes a stable projection into `aliases.ts`, records a projection hash, and the drift-guard test compares the checked-in projection against the current registry. At recommendation time, the advisor resolves a matching mode and includes `workflowMode` in the response without runtime reads from the deep-loop skills.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | Source of deep-loop workflow modes | Read at generation time only | No runtime advisor import of registry |
| `aliases.ts` | Advisor lexical alias table | Receive generated projection and hash | Drift guard accepts fresh hash |
| `advisor_recommend` response | Caller routing output | Publish optional `workflowMode` | Deep-loop recommendation includes non-null mode |
| Parent-skill scaffolder | Creates new parent skills | Emit projection after scaffold | New mode has advisor coverage immediately |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm the no-runtime-cross-skill-read invariant.
- [x] Identify advisor scorer, schema, handler, CLI, test, and scaffolder surfaces.
- [x] Preserve advisor scoring math and daemon restart logic as out of scope.

### Phase 2: Core Implementation
- [x] Add the projection generator that derives advisor aliases from `mode-registry.json`.
- [x] Update `aliases.ts` with a generated projection section and freshness hash.
- [x] Convert the routing drift guard to a hash-freshness test.
- [x] Thread `workflowMode` through `skill_advisor.py`, schemas, and `advisor-recommend.ts`.
- [x] Fold projection hash into the advisor cache signature.
- [x] Add projection emission to `create_parent_skill_auto.yaml`.

### Phase 3: Verification
- [x] Verify the drift guard passes after generation and fails on a stale projection.
- [x] Verify a deep-loop recommendation response includes `workflowMode` when registry-backed.
- [x] Verify runtime advisor code does not read `mode-registry.json` directly.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Drift guard | Projection hash freshness | `routing-registry-drift-guard.vitest.ts` |
| Response schema | Optional `workflowMode` response field | Advisor schema and handler tests |
| Cache invalidation | Projection hash in signature | Advisor cache signature check |
| Scaffolder | Projection emitted on parent-skill creation | YAML scaffolder dry run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mode-registry.json` schema | Internal | Stable for generation | Generator cannot emit trustworthy aliases without a stable registry shape |
| Advisor response schema | Internal | Complete | Callers cannot consume `workflowMode` unless schema allows the field |
| Runtime no-cross-skill-read invariant | Architectural | Preserved | Violating it would couple advisor runtime to deep-loop skill files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Projection freshness fails, advisor runtime imports the registry, or `workflowMode` response breaks recommendation callers.
- **Procedure**: Revert the generator, generated alias section, schema and handler pass-through, cache-signature hook, and scaffolder step, then restore the previous manually maintained alias table.
<!-- /ANCHOR:rollback -->
