---
title: "Plan: sk-design unified sk-code handoff schema"
description: "Execution plan for the unified handoff schema: define one shared sk-code handoff schema, then apply it as an interface build manifest, a foundations handoff card, an audit backlog-handoff card, and a motion stack-boundary field. Not started."
trigger_phrases:
  - "sk-design handoff schema plan"
  - "design build manifest plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/019-handoff-card"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted the shared-schema approach across four modes"
    next_safe_action: "Define the shared handoff schema, then apply it per mode"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-019-handoff-card"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design unified sk-code handoff schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
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
| **Language/Stack** | Markdown schema and per-mode handoff cards (sk-doc) |
| **Framework** | sk-design shared layer plus four mode packets, `package_skill.py` check |
| **Storage** | `.opencode/skills/sk-design/shared/` and the interface, foundations, audit, and motion packets |
| **Testing** | `package_skill.py --check` on touched skills, `validate.sh --strict` |

### Overview
One schema, four applications. Define a shared sk-code handoff schema in the sk-design shared layer carrying the common fields (register posture, source evidence, output schema, reuse list, motion budget, open risks, do-not constraints). Then apply it as a required interface build manifest, a foundations handoff card, an audit backlog-handoff card that routes accepted findings without applying them, and a motion implementation-mechanism and stack-boundary field. The shared core keeps maintenance cheap while each mode adds its required extensions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The four-mode handoff recurrence and per-mode shapes read from the lineage research
- [ ] The live interface, foundations, audit, and motion packets confirmed for where each handoff artifact lives
- [ ] The audit-never-fixes boundary confirmed so the backlog card preserves it

### Definition of Done
- [ ] One shared sk-code handoff schema is defined in the shared layer
- [ ] Interface, foundations, audit, and motion each reference it with their required fields
- [ ] The audit backlog card routes findings without applying them
- [ ] `package_skill.py --check` passes on touched skills and `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared-core-plus-extensions: a single handoff schema in the shared layer, instantiated per mode as the card or field that mode needs, so the contract is consistent and maintained in one place.

### Key Components
- **shared handoff schema**: the common fields every design-to-build handoff carries.
- **interface build manifest**: required, with tokens, signature move, motion budget, reuse list, open risks.
- **foundations handoff card**: register, surface role, source evidence, output schema, CSS-var and breakpoint handoff.
- **audit backlog-handoff card**: id, severity, owner, target, one-line fix shape, verification, routed to sk-code without applying.
- **motion stack-boundary field**: which animation library to use, recorded on the motion cards for sk-code.

### Data Flow
`four-mode lineage handoff findings` -> define the shared schema -> apply it as the four per-mode artifacts -> `package_skill.py --check` on touched skills -> `validate.sh --strict` -> record the acceptance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds one shared schema and four per-mode handoff artifacts. It changes no scoring contract and no referenced design content.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design/shared/` handoff schema | absent | create | one shared schema with the common fields |
| `design-interface/` build manifest | optional manifest | edit | required manifest referencing the shared schema |
| `design-foundations/` handoff card | implicit handoff | edit | handoff card referencing the shared schema |
| `design-audit/` backlog handoff | owner mapping only | edit | backlog card routes findings without applying them |
| `design-motion/` motion cards | no stack-boundary field | edit | implementation-mechanism and stack-boundary field added |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the four-mode handoff recurrence and per-mode shapes from the lineage research
- [ ] Confirm the live interface, foundations, audit, and motion packets for each handoff artifact home
- [ ] Confirm the audit-never-fixes boundary so the backlog card preserves it

### Phase 2: Core Implementation
- [ ] Define the shared sk-code handoff schema in the sk-design shared layer
- [ ] Apply the required interface build manifest referencing the shared schema
- [ ] Apply the foundations handoff card referencing the shared schema
- [ ] Apply the audit backlog-handoff card that routes accepted findings without applying them
- [ ] Apply the motion implementation-mechanism and stack-boundary field on the motion cards

### Phase 3: Verification
- [ ] Confirm each mode references the shared handoff schema
- [ ] Run `package_skill.py --check` on every touched skill (exit 0)
- [ ] Run `validate.sh --strict` on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | The shared schema and four per-mode artifacts | sk-doc review plus shared-schema reference check |
| Packaging | Every touched sk-design skill | `package_skill.py --check` (exit 0) |
| Static | This packet's spec docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The four-mode lineage research | Internal | Green | The per-mode handoff shapes cannot be grounded |
| The live interface, foundations, audit, motion packets | Internal | Green | The handoff homes cannot be confirmed |
| `package_skill.py` packaging check | Internal | Green | The packaging acceptance cannot be recorded |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:phase-deps -->
## 7. PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 Setup | `../015-per-skill-improvement-research` | The handoff recurrence and per-mode shapes come from the lineages |
| Phase 2 Implementation | Phase 1 | The schema must be defined before the per-mode applications |
| Phase 3 Verification | Phase 2 | Packaging and validation need the artifacts in place |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 8. EFFORT ESTIMATE

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 Setup | S | Read four lineages and confirm the four packet homes |
| Phase 2 Implementation | M | One shared schema plus four per-mode applications |
| Phase 3 Verification | S | `package_skill.py --check` and `validate.sh --strict` |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 9. ROLLBACK PLAN

- **Trigger**: The shared schema fits no mode well, the audit card invites applying fixes, or packaging fails.
- **Procedure**: The schema and the four artifacts are additive. To revert, delete them and restore the interface manifest to optional. No scoring contract or referenced content is mutated.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Trigger | Detection | Action | Owner |
|---------|-----------|--------|-------|
| Shared schema too generic | A mode cannot express a required field | Add a per-mode required extension to the schema and reapply | implementing subagent |
| Audit card implies applying fixes | Review finds build-action language in the card | Reword the card to route findings only, restating the audit-never-fixes boundary | implementing subagent |
| Motion field read as a build instruction | Review finds the field directing a build | Reframe it as a record handed to sk-code, not a motion-owned action | implementing subagent |
<!-- /ANCHOR:enhanced-rollback -->
