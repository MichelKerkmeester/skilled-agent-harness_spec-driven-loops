---
title: "Feature Specification: sk-code Routing-Efficiency and Usefulness Remediation"
description: "Remediate the two weak dimensions the live sk-code benchmark surfaced — D3 efficiency (over-routing: ~16-20 resources loaded vs ~5-8 gold) and D4 usefulness (task-dependent: helps on domain patterns, hurts on routine tasks) — by tightening how sk-code loads its resource slice, without regressing D1 routing or D2 discovery. Scoped to a 5-iteration MiniMax deep-research pass that designs the remediation before any code change."
trigger_phrases:
  - "sk-code routing efficiency remediation"
  - "sk-code over-routing"
  - "surface-slice loading"
  - "D3 D4 sk-code remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Created phase; framed the D3/D4 remediation research question from the live benchmark"
    next_safe_action: "Run 5-iteration deep research (MiniMax M2.7-highspeed) on the remediation approaches"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/smart_routing.md"
      - ".opencode/skills/sk-code/benchmark/live-final/skill-benchmark-report.md"
      - ".opencode/skills/sk-code/benchmark/live-final/d4-ablation.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-routing-efficiency-remediation"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Does tighter slicing regress D1/D2, and where is the recall/efficiency frontier?"
    answered_questions: []
---
# Feature Specification: sk-code Routing-Efficiency and Usefulness Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## OVERVIEW

The live sk-code benchmark (phase 010) showed strong routing (D1-intra 92, D2 87, surfaces correct 3/3) but two weak dimensions with converging evidence: D3 efficiency 42 (the model loads ~16-20 resources where the gold is ~5-8) and D4 usefulness about 49 (skill-on beat skill-off on a domain-pattern task but lost on a routine language refactor). Both point at the same behavior: sk-code loads a broad resource slice, which pays off when a domain pattern matters and adds noise on simple tasks.

This phase scopes a remediation: make sk-code load a tighter, task-appropriate slice without regressing D1 routing or D2 discovery. The first step is a 5-iteration MiniMax deep-research pass that designs the approach before any code change.

**Critical Dependencies**: the live benchmark evidence (`sk-code/benchmark/live-final/`), the machine-readable router (`smart_routing.md`), and the documented surface-flattening tradeoff in §11 of that router.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (research) |
| **Priority** | P2 |
| **Status** | Planned — research pending |
| **Created** | 2026-06-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code routes to the correct surface and resources, but over-loads: the live run read 2-4x the resources the scenario needed (D3 42), and the D4 ablation showed the broad load is net-negative on routine tasks (LS-001 skill-on 0.82 vs skill-off 0.95) even though it helps on domain-pattern tasks (CS-001 skill-on 0.88 vs skill-off 0.78). The likely cause is the flattened, intent-unioned resource map loading a whole surface slice when a narrow concern would do.

### Purpose
Reduce over-routing and lift routine-task usefulness while holding routing recall (D1/D2) and the D5 connectivity gate. Design the remediation with evidence before changing the router.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 5-iteration deep-research pass (MiniMax M2.7-highspeed) on remediation approaches: surface×concern slicing, phase-gated loading, lazy/progressive loading, and anti-over-routing heuristics.
- A recommended remediation design with an explicit recall-vs-efficiency frontier and a regression guard for D1/D2.

### Out of Scope
- The router code change itself (a follow-on phase, gated on the research recommendation).
- Re-running the full live benchmark (the research consumes the existing 010 evidence).

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

- **SC-001**: 5 research iterations complete (or converge earlier) with a ranked set of remediation approaches.
- **SC-002**: `research.md` recommends one approach with its tradeoff against the surface-flattening behavior and a D1/D2 regression guard.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tighter slicing regresses D1/D2 recall | High | research defines the frontier + a regression guard before any code change |
| Risk | D4 signal is thin (n=2, single grader) | Med | treat D4 as directional; corroborate with D3 over-routing evidence |
| Dependency | MiniMax Token Plan quota | Med | 5 iterations only; `minimax-coding-plan/MiniMax-M2.7-highspeed`, omit `--agent` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where is the recall-vs-efficiency frontier for sk-code, and can a phase-gated or lazy load hold D1/D2 while cutting D3 waste?
<!-- /ANCHOR:questions -->
