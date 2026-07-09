---
title: "Feature Specification: sk-code Routing-Efficiency and Usefulness Remediation"
description: "Remediate the two weak dimensions the live sk-code benchmark surfaced — D3 efficiency (over-routing: ~16-20 resources loaded vs ~5-8 gold) and D4 usefulness (task-dependent: helps on domain patterns, hurts on routine tasks) — by researching how to tighten sk-code's resource slice without regressing D1 routing or D2 discovery. A 3-iteration native-Opus deep-research pass designed the remediation before any code change."
trigger_phrases:
  - "sk-code routing efficiency remediation"
  - "sk-code over-routing"
  - "surface-slice loading"
  - "D3 D4 sk-code remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research converged on a surface-nested RESOURCE_MAP remediation"
    next_safe_action: "Implement the surface-nested router in BUILD phase 012"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/smart_routing.md"
      - ".opencode/skills/sk-code/benchmark/live-final/skill-benchmark-report.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-routing-efficiency-remediation"
      parent_session_id: null
    completion_pct: 60
    open_questions:
      - "Does tighter slicing regress D1/D2, and where is the recall/efficiency frontier?"
    answered_questions:
      - "Root cause = the intent-only cross-surface RESOURCE_MAP union; H1 surface-nesting is the primary fix"
---
# Feature Specification: sk-code Routing-Efficiency and Usefulness Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

## OVERVIEW

The live sk-code benchmark (phase 010) showed strong routing (D1-intra 92, D2 87, surfaces correct 3/3) but two weak dimensions with converging evidence: D3 efficiency 42 (the model loads ~16-20 resources where the gold is ~5-8) and D4 usefulness about 49 (skill-on beat skill-off on a domain-pattern task but lost on a routine language refactor). Both point at the same behavior: sk-code loads a broad resource slice, which pays off when a domain pattern matters and adds noise on simple tasks.

This phase researched the remediation: make sk-code load a tighter, task-appropriate slice without regressing D1 routing or D2 discovery. A 3-iteration native-Opus deep-research pass converged on a recommendation, captured in `research/research.md`. The implementation is a follow-on BUILD phase (012).

**Critical Dependencies**: the live benchmark evidence (`sk-code/benchmark/live-final/`), the machine-readable router (`smart_routing.md` §11), and the documented surface-flattening tradeoff in that block.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (research-then-remediate) |
| **Priority** | P2 |
| **Status** | Research complete — build deferred to phase 012 |
| **Created** | 2026-06-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code routes to the correct surface and resources, but over-loads: the live run read 2-4x the resources the scenario needed (D3 42), and the D4 ablation showed the broad load is net-negative on routine tasks (LS-001 skill-on 0.82 vs skill-off 0.95) while helping domain-pattern tasks (CS-001 skill-on 0.88 vs skill-off 0.78). The likely cause is the flattened, intent-unioned resource map loading a whole surface slice when a narrow concern would do.

### Purpose
Reduce over-routing and lift routine-task usefulness while holding routing recall (D1/D2) and the D5 connectivity gate. Design the remediation with evidence before changing the router.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 3-iteration deep-research pass (native Opus) on remediation approaches: surface×concern slicing, phase-gated loading, lazy/progressive loading, and anti-over-routing heuristics.
- A recommended remediation design with an explicit recall-vs-efficiency frontier and a regression guard for D1/D2.

### Out of Scope
- The router code change itself (the follow-on BUILD phase 012, gated on the research recommendation).
- Re-running the full live benchmark (the research consumed the existing 010 evidence).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `011-.../research/**` | Create | Deep-research state, iterations, and `research.md` |
| `011-.../spec.md` | Modify | Bounded findings anchor at convergence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Research the over-routing root cause | iterations cite the live evidence and the §11 flattening tradeoff |
| REQ-002 | Produce a remediation recommendation | `research.md` names a preferred approach with a recall-vs-efficiency frontier |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Define a D1/D2 regression guard | the recommendation states how to verify routing recall does not drop |
| REQ-004 | Keep the recommendation honest | call out where tighter slicing would hurt domain-pattern tasks |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 3 research iterations complete (or converge earlier) with a ranked set of remediation approaches.
- **SC-002**: `research.md` recommends one approach with its tradeoff against the surface-flattening behavior and a D1/D2 regression guard.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tighter slicing regresses D1/D2 recall | High | research defines the frontier + a regression guard before any code change |
| Risk | D4 signal is thin (n=2, single grader) | Med | treat D4 as directional; corroborate with D3 over-routing evidence |
| Dependency | The live benchmark baseline | — | the research consumes `sk-code/benchmark/live-final/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where is the recall-vs-efficiency frontier for sk-code, and can a phase-gated or lazy load hold D1/D2 while cutting D3 waste? (Handed to the BUILD phase.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The recommended remediation must not increase the number of router resources loaded for a correctly-detected single-surface task.

### Security
- **NFR-S01**: The research is read-only; no skill, router, or benchmark file is mutated outside this phase's own research artifacts.

### Reliability
- **NFR-R01**: The recommendation keeps the D5 connectivity hard gate at pass (no orphaned or dead routes).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Cross-surface tasks (a Webflow page using Motion) legitimately need more than one slice; the recommendation must not starve them.

### Error Scenarios
- A narrow task with an ambiguous surface should fall back to the always-loaded preamble, not the full union.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | research-only this phase; code change deferred to 012 |
| Risk | 16/25 | the eventual router change risks routing recall |
| Research | 18/20 | 3-iteration native-Opus deep research is the core of the phase |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
