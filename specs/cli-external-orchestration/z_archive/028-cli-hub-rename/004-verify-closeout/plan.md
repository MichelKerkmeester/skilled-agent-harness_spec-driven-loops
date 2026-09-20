---
title: "Implementation Plan: Phase 4 Verification Closeout"
description: "Run targeted rename gates, classify environment-blocked checks honestly, and defer final completion until authorized prerequisite repairs."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/028-cli-hub-rename/004-verify-closeout"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Finalized verification and blocker plan"
    next_safe_action: "Rerun blocked gates after authorized repairs"
    blockers:
      - "Stale compiled distributions"
      - "Unrelated missing graph key paths"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "135-cli-hub-rename-doc-finalization"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: verify-closeout

<!-- SPECKIT_LEVEL: 3 -->
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
| **Language/Stack** | TypeScript, Vitest, shell validation |
| **Framework** | OpenCode skill routing and system-spec-kit |
| **Storage** | Repository projections and packet docs |
| **Testing** | Sync, smoke, invariant, graph, executor, and strict packet checks |

### Overview
Execute every available targeted check, classify unexecutable broader gates by missing prerequisite, and keep P0 closeout items open until they can run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Verification scope documented.
- [x] PASS and blocked criteria defined.
- [x] External prerequisites identified.

### Definition of Done
- [ ] All P0 gates execute and pass.
- [x] All executable targeted checks pass.
- [x] Packet docs state blockers consistently.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence ledger with three states: PASS, FAIL, BLOCKED.

### Key Components
- **Targeted checks**: verify rename and routing behavior.
- **Broader gates**: verify executor, graph, and packet integration.
- **Packet docs**: preserve the status boundary.

### Data Flow
Command outputs become checklist and summary evidence; blocked results retain their prerequisite and rerun instruction.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Prompt and routing checks | Produce direct rename evidence | Execute | PASS outputs |
| Executor suite | Verifies delegation | Blocked | Missing stale shared dist |
| Skill graph validator | Verifies graph contract | Blocked | Four unrelated missing keys |
| Spec validator | Verifies packet contract | Blocked | Stale mcp-server dist |

Required inventories:
- Evidence classes: executed pass, executed fail, prerequisite-blocked.
- Consumer inventory: tasks, checklist, summary, graph metadata, and parent map.
- Invariant: blocked is never rendered as pass.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate verification gates.
- [x] Record no-rebuild constraint.
- [x] Define blocker ownership.

### Phase 2: Core Implementation
- [x] Run prompt, projection, advisor, and invariant checks.
- [x] Attempt broader gates without rebuilding.
- [x] Classify blocked results.

### Phase 3: Verification
- [x] Executed results recorded verbatim.
- [x] Blocked paths documented.
- [ ] Rerun blocked gates after repair.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Sync | Prompt-quality-card | Sync checker |
| Smoke | Advisor resolution | Local advisor runtime |
| Unit/integration | Rename and registry invariants | Vitest |
| Integration | Executor delegation and skill graph | Blocked suites |
| Packet | Recursive strict validation | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/shared` dist | Internal | Red | Executor suite import blocked |
| Graph key paths | Unrelated internal | Red | Skill graph validation blocked |
| mcp-server dist | Internal | Red | Strict validation blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Targeted checks reveal a rename regression.
- **Procedure**: Revert the rename workstream in dependency order; documentation-only closeout changes can be reverted independently.

## L2: PHASE DEPENDENCIES
Phases 1 through 3 supply evidence. External dist and graph owners control the remaining gate prerequisites.

## L2: EFFORT ESTIMATION
| Work | Complexity | Effort |
|---|---|---|
| Targeted checks | Medium | Complete |
| Blocked gate reruns | Medium | Pending prerequisite repair |

## L3: DEPENDENCY GRAPH
`phases 1-3` -> `targeted checks PASS` -> `blocked prerequisite repair` -> `broader gate rerun` -> `closeout`

## L3: CRITICAL PATH
1. Preserve exact targeted evidence.
2. Repair stale dist and unrelated graph prerequisites outside this task.
3. Rerun all blocked P0 gates.

## L3: MILESTONES
| Milestone | Success Criteria | Status |
|---|---|---|
| Targeted confidence | Four targeted check groups pass | Complete |
| Integrated confidence | Three blocked gate classes execute | Blocked |

## L3: ARCHITECTURE DECISION RECORD
See `decision-record.md` for the accepted blocked-state policy.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Documentation-and-config change only; no external build graph. The subskill `SKILL.md` edits are the single input the registry regeneration consumes.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Audit and fix-map, then the SKILL.md edits, then registry regeneration from the SKILL.md source of truth, then drift verification. Each step gates the next.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

M1: fix map complete and reviewed. M2: registry and hub-router regenerated with zero SKILL.md-to-registry drift and package validation green.
<!-- /ANCHOR:milestones -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
