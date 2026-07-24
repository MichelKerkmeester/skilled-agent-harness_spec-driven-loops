---
title: "Feature Specification: Post-019 Routing Conformance Alignment"
description: "Bounded deep-alignment run auditing the fleet against the authorities packet 019 established: the compiled serving contract, typed leaf identity, create-* packet canon, and hub routing metadata. Sealed at ten iterations with a CONDITIONAL verdict."
trigger_phrases:
  - "post-019 alignment run"
  - "routing conformance audit"
  - "compiled serving conformance"
importance_tier: "important"
contextType: "research"
parent: "sk-doc/019-skill-routing-refactor"
---

# Feature Specification: Post-019 Routing Conformance Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (sealed) |
| **Created** | 2026-07-24 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `016-documentation-quality-program` |
| **Successor** | `018-post-019-research` |
| **Executor** | cli-codex, GPT-5.6-SOL high |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 019 established authorities across the skill fleet — a compiled serving contract, typed
`(workflowMode, leafResourceId)` identity, `create-*` packet canon, and hub routing metadata — but nothing
had since re-checked whether the fleet still conforms to them. A survey of all twelve hubs proposed eleven
candidate conformance angles, each a hypothesis rather than a confirmed defect.

### Purpose
Run a bounded conformance audit over the highest-value lanes, so drift against those authorities is
surfaced with evidence instead of assumed present or assumed absent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Four lanes: the compiled-routing runtime (`sk-code`/code), hub feature catalogs plus `create-*` packets
  (`sk-doc`/docs), hub routing metadata (`sk-doc`/docs), and the design/transport surface
  (`sk-design`/designs).
- Ten iterations, convergence disabled so the run explores rather than stopping early.

### Out of Scope
- Remediating anything the run finds; findings hand off for separate triage.
- The research questions packet 019 left open, which belong to the sibling research phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Lanes resolve from an explicit config, never guessed | Lane config validates through the scoping script |
| REQ-002 | The run reaches synthesis and seals | Report states SEALED rather than PRELIMINARY |
| REQ-003 | Findings carry file-level evidence | Each finding names the artifact it was found in |
| REQ-004 | The run must not mutate anything outside its artifact directory | No containment violations against unrelated paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Ten iterations complete and the reducer seals an authoritative verdict.
- Every lane reports a verdict and an artifact count, so silence is distinguishable from conformance.
- Findings are actionable: each names an artifact and a drift class.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Low coverage makes a clean lane look conformant when it was barely sampled | Report artifact counts per lane; treat an unsampled lane as unknown, not passing |
| The write-containment gate collides with concurrent work in a shared tree | Run in a dedicated worktree; this run was restarted in isolation after exactly that collision |
| Reducer drops malformed finding records | Read the report rather than the findings registry when the two disagree |

**Dependencies:** the deep-alignment runtime, the lane scoping script, and a cli-codex executor.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. Coverage reached forty-nine of 1,794 discovered artifacts before the iteration ceiling stopped the run.
   Is the remaining corpus worth a longer run, or should lanes be narrowed to raise coverage per iteration?
2. The findings registry serialized empty while the report recorded ten P1 findings. The reducer's
   tolerance for malformed delta lines should be tightened so the two surfaces cannot disagree.
<!-- /ANCHOR:questions -->
