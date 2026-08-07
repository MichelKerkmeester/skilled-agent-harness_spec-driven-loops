---
title: "Implementation Plan: Phase 8: cutover-and-rollout"
description: "Plan the terminal gate: strict parent-skill check, recursive strict spec validation, an active fail-open hook trigger test, the final stale-reference sweep, and the parent rollup executed only when the program runs."
trigger_phrases:
  - "cli-external cutover plan"
  - "terminal gate plan"
  - "fail-open hook trigger test plan"
  - "parent rollup plan"
  - "phase 008 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the terminal-gate closeout plan"
    next_safe_action: "Run the terminal gate after phase 007"
    blockers: []
    key_files:
      - "../graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: cutover-and-rollout

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
| **Language/Stack** | Shell + Node validation gates, a live hook trigger, JSON parent metadata |
| **Framework** | parent-skill-check plus system-spec-kit recursive validation |
| **Storage** | Parent packet metadata files |
| **Testing** | Strict parent-hub check, recursive strict spec validation, active hook trigger, stale-reference sweep |

### Overview
This phase runs the terminal gate for the constructed hub and rolls up the parent metadata. The defining difference from a normal closeout is the ACTIVE fail-open hook trigger test: because the hook fails open, only deliberately tripping a hard-rule violation proves the advisory still fires from the new path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001-007 completed with benchmark and review evidence
- [ ] The strict parent-skill check and recursive validation commands are confirmed
- [ ] A known dispatch hard-rule violation is prepared for the active hook trigger

### Definition of Done
- [ ] Strict parent-skill check passes with zero warnings
- [ ] Recursive strict spec validation passes for the whole packet
- [ ] The fail-open hook is actively proven to fire; stale-reference sweep clean; parent rolled up
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Terminal verification gate plus parent rollup, with an active liveness test for the fail-open hook.

### Key Components
- **Strict parent-hub check**: `PARENT_HUB_CHECK_STRICT=1 parent-skill-check.cjs` for the final layout.
- **Recursive spec validation**: `validate.sh --recursive --strict` for the whole packet.
- **Active hook trigger**: a deliberate hard-rule violation confirming the fail-open PreToolUse hook advisory.
- **Parent rollup**: parent `description.json` and `graph-metadata.json` (status complete, `last_active_child_id: 008`), executed only when the program runs.

### Data Flow
The gates and the active hook trigger emit pass/fail evidence; on all-pass, the parent metadata rolls up to complete. Until the program actually executes, the parent stays `Planned`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `parent-skill-check.cjs` (strict) | Parent-hub enforcement gate | Run against `cli-external` | Zero warnings, zero failures |
| `validate.sh --recursive --strict` | Recursive packet validation | Run against the parent packet | Passing result |
| Fail-open PreToolUse hook | Dispatch-rule linter on every Bash call | Actively trip a hard-rule violation | Advisory fires from the new hub path |
| Parent `description.json` / `graph-metadata.json` | Parent rollup metadata | Set complete + `last_active_child_id: 008` (execution-time only) | Metadata reflects closed packet |

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
- [ ] Confirm phases 001-007 completed with evidence
- [ ] Confirm the strict parent-skill and recursive validation commands
- [ ] Prepare a known dispatch hard-rule violation for the active hook trigger

### Phase 2: Core Implementation
- [ ] Run the strict parent-skill check and require zero warnings
- [ ] Run recursive strict spec validation for the whole packet
- [ ] Actively trip the hard-rule violation and confirm the hook advisory fires from the new path
- [ ] Run the final stale-reference grep sweep

### Phase 3: Verification
- [ ] Confirm all gates pass and the hook is actively proven live
- [ ] Roll up parent `description.json` and `graph-metadata.json` (execution-time only)
- [ ] Run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Strict parent-hub | Final hub layout | `PARENT_HUB_CHECK_STRICT=1 parent-skill-check.cjs` |
| Recursive validation | Whole parent packet | `validate.sh --recursive --strict` |
| Active hook liveness | Fail-open PreToolUse hook | A deliberate hard-rule violation |
| Stale-reference sweep | Live files | `grep -rl` for old flat paths |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `parent-skill-check.cjs` strict | Internal | Green | Cutover cannot be claimed canon-clean |
| Recursive spec validation | Internal | Green | Packet closeout cannot be claimed complete |
| Fail-open hook liveness | Internal | Green from phases 004/005 | Lost dispatch enforcement would go undetected without the active trigger |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any strict gate fails, the active hook trigger produces no advisory, or a live stale reference is found.
- **Procedure**: Do not roll up the parent; route the failure back to the owning phase (004/005 for the hook, 006 for references), fix, and rerun the terminal gate before rollup.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
