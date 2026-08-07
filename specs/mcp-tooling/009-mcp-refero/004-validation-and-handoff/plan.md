---
title: "Implementation Plan: Phase 4: validation-and-handoff"
description: "Plan for the terminal gate phase: run the strict packet gate, the hub package validation, and the recursive spec-packet validation, iterate failures back to their owning phases, then close out with evidence-marked checklists, implementation summaries, parent status reconciliation, and a memory save."
trigger_phrases:
  - "mcp-refero validation plan"
  - "refero gates plan"
  - "refero handoff plan"
  - "phase 004 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/004-validation-and-handoff"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the terminal-gate implementation plan"
    next_safe_action: "Run the terminal gates once phase 003 hub integration lands"
    blockers:
      - "Phases 001-003 must complete first"
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/004-validation-and-handoff/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/004-validation-and-handoff/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/004-validation-and-handoff/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-validation-and-handoff"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: validation-and-handoff

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
| **Language/Stack** | Validation tooling (Python checkers, bash validator) over Markdown/JSON artifacts |
| **Framework** | System Spec Kit completion-verification flow |
| **Storage** | Gate evidence and closure docs inside this packet's phase folders |
| **Testing** | The gates ARE the tests: strict packet check, hub package validation, recursive spec validation |

### Overview
Run three gates in dependency order — packet strict check, hub package validation, recursive spec-packet validation — routing any failure back to the phase that owns the broken surface and re-running the whole gate after each fix. Then close out: mark checklists with evidence, write per-phase implementation summaries, reconcile the parent phase map, and save memory so the program is resumable and auditable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gate-and-closure: strict gates in dependency order → fix-loop routed to owning phases → evidence-backed closure.

### Key Components
- **Packet gate**: `package_skill.py --check --strict` on `.opencode/skills/mcp-tooling/mcp-refero/` — proves the phase 002 deliverable under the stricter flag set.
- **Hub gate**: `validate_skill_package.py` on `.opencode/skills/mcp-tooling/` — proves the four-mode hub as one package after phase 003.
- **Spec gate**: `bash validate.sh .opencode/specs/mcp-tooling/009-mcp-refero --strict --recursive` — proves this documentation packet, parent plus all children.
- **Closure writer**: Checklist evidence marks, implementation summaries per completed phase, parent phase-map reconciliation, memory save via the canonical flow.

### Data Flow
Gate outputs (recorded verbatim with exit codes and the hub git SHA) feed checklist evidence; checklist state feeds implementation summaries; summaries and reconciled statuses feed the memory save.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Packet + hub trees | Gate subjects | Read/validate only; fixes route to owning phases | Recorded gate outputs at exit 0 |
| This spec packet's phase folders | Closure surface | Evidence marks, summaries, status reconciliation | Recursive strict validation exit 0 after closure writes |

Required inventories:
- Same-class producers: the three gates are the complete gate set; no other completion claim is authoritative.
- Consumers of changed symbols: memory index and future resume sessions consume the closure artifacts.
- Matrix axes: gate × subject (3 rows) plus checklist × phase (002, 003) tracked in tasks.
- Algorithm invariant: after any fix, the WHOLE affected gate re-runs; partial re-runs are never reported as full passes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phases 001-003 report complete and the sibling serial queue is quiet enough for a stable hub gate
- [ ] Record the hub and packet git SHAs the gates will run against
- [ ] Locate the exact validator invocations and flags from the parent handoff criteria

### Phase 2: Core Implementation
- [ ] Run the packet gate, then the hub gate, then the spec gate, recording each output verbatim
- [ ] Route any failure to its owning phase, fix under that scope, and re-run the whole affected gate
- [ ] Mark phase 002/003 checklists with per-item evidence

### Phase 3: Verification
- [ ] Write implementation summaries for completed phases and reconcile the parent phase map statuses
- [ ] Re-run the spec gate after closure writes to confirm Errors: 0 end-state
- [ ] Save memory via the canonical flow and record the continuation pointer
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Strict packet check | mcp-refero skill packet | `package_skill.py --check --strict` |
| Hub package validation | mcp-tooling hub (4 modes) | `validate_skill_package.py` |
| Recursive spec validation | This packet, parent + 4 children | `validate.sh --strict --recursive` |
| Closure audit | Checklists, summaries, parent map | Manual cross-read: no claim conflicts with gate evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-003 complete | Internal | Red until predecessors close | Gates fail against missing content |
| Validation tooling (package_skill.py, validate_skill_package.py, validate.sh) | Internal | Green | No authoritative completion evidence |
| Memory save flow (generate-context.js / canonical save) | Internal | Green | Program closes without resumable continuity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate failure whose fix would exceed the owning phase's frozen scope, or closure writes that make validation regress.
- **Procedure**: Stop and escalate scope-exceeding findings as amendment decisions rather than working around them. For closure regressions, revert the closure edits in this packet (git checkout of the affected spec files) and redo them against the recorded gate evidence.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
