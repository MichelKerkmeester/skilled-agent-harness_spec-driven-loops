---
title: "Implementation Plan: sk-vision 010 quality gate"
description: "Run every gate from the final state, record evidence, reconcile metadata, sweep for strays."
trigger_phrases:
  - "sk-vision quality gate"
  - "sk-vision conformance proof"
  - "sk-vision metadata reconciliation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/010-quality-gate"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 010 plan skeleton."
    next_safe_action: "Implement the gate sequence from spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-010-quality-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision 010 quality gate

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | Verification shell + metadata JSON |
| **Framework** | sk-create-skill / sk-doc validators + spec-kit validate.sh |
| **Storage** | None |
| **Testing** | The gates themselves |

### Overview
Execute the copy-pack gate sequence exactly once from the final state, capture every exit status, fix only stale metadata, and sweep the tree. Any other failure is reported, not silently repaired.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met — evidence: REQ-001..REQ-005 + REQ-P1..REQ-P3 satisfied; see `implementation-summary.md`
- [ ] Docs updated (spec/plan/tasks) — evidence: closeout refresh
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential gate sweep with evidence capture, then targeted metadata repair, then sweep.

### Key Components
- **Gates**: 8 groups (metadata, package, docs, package validators, DQI, runtime, advisor, packet).
- **Metadata repair**: stale continuity + last_active_child_id only.
- **Sweep**: strays, venv, hub JSON, context diff.

### Data Flow
Final state → gates → evidence table → metadata fix → sweep → verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 002-001 continuity | stale 0% | fix to 100 | grep completion_pct |
| parent graph-metadata | stale last_active | update | grep last_active_child_id |
| skill tree | final state | read-only | gate exits |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Gates
- [ ] Skill root metadata + package gates
- [ ] Doc validation (all authored docs)
- [ ] Catalog + playbook package validators

### Phase 2: DQI + runtime + advisor
- [ ] extract_structure DQI
- [ ] bun build + test regression
- [ ] advisor smoke (warm-only; note if cold)

### Phase 3: Packet + metadata + sweep
- [ ] parent validate.sh --recursive --strict
- [ ] metadata reconciliation
- [ ] stray-file sweep + context diff
- [ ] validate.sh --strict on this child
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | all skill docs | validate_document.py |
| Package | skill/catalog/playbook | three validators |
| Fleet | metadata | ci-skill-root-metadata.cjs |
| Regression | runtime | bun build + test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 006-009 | Internal | Required | Missing gate targets |
| validators | Internal | Available | No proof possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate fails; metadata repair turns out wrong.
- **Procedure**: Metadata edits are tiny and reversible (restore previous JSON values). No code/doc changes happen in this phase, so rollback is limited to the two metadata surfaces. Report, do not expand scope.
<!-- /ANCHOR:rollback -->
