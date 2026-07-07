---
title: "Feature Specification: Ablation sweep and promote semantic lane to live"
description: "Run eval_run_ablation across rebalanced weight vectors, pick the vector that lifts recall without regressing today's correct routings, promote the cosine lane to live."
trigger_phrases:
  - "advisor ablation sweep"
  - "semantic lane promote"
  - "lane weight rebalance"
  - "advisor evaluation harness"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/002-skill-advisor-scoring-engine/004-ablation-sweep-and-weight-promotion"
    last_updated_at: "2026-05-13T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded child 002 spec stack"
    next_safe_action: "Wait for child 001 to ship; then dispatch cli-codex"
    blockers:
      - "Depends on child 001-embed-cache-and-cosine-wiring being shipped first"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001502"
      session_id: "002-ablation-sweep-and-promote"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which weight vectors to sweep across; baseline expected at explicit 0.40 / lexical 0.25 / graph_causal 0.15 / derived 0.10 / semantic 0.10"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Ablation sweep and promote semantic lane to live

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Blocked — depends on 001 |
| **Created** | 2026-05-13 |
| **Branch** | `002-ablation-sweep-and-promote` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Child 001 wires the cosine lane shadow-only. With no weight, the lane produces match payloads but never affects which skill the advisor recommends. To actually optimize, the lane must promote to `live: true` with a non-zero weight, and the other four weights must rebalance so the total stays at 1.0. Naive choices risk flipping today's correct routings.

### Purpose
Use the existing `eval_run_ablation` harness to sweep a small set of candidate weight vectors against the gold battery, pick the vector that maximizes recall on intent-described prompts while keeping precision on the today-correct fixtures, then promote the lane to `live: true` with those weights and document the decision in this packet's decision-record.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define 5-8 candidate weight vectors (one no-change baseline + variations).
- Run `eval_run_ablation` for each vector against the existing skill-advisor gold battery.
- Compare overall pass rate, per-category breakdown, and routing diffs.
- Pick the vector that maximizes "intent-described" recall without regressions on today's correct fixtures.
- Edit `lane-registry.ts` to promote the cosine lane (`live: true`, chosen weight) and rebalance the other four.
- Document the chosen weights in a decision record entry.

### Out of Scope
- Adding new gold fixtures (use existing battery only).
- Changing the cosine math from phase 001.
- Touching other graph subsystems (deep-loop, council, coverage).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Run ablation for at least 5 candidate vectors. | Tool returns metrics for each. |
| REQ-002 | Compare results in a table inside the implementation-summary. | Table includes overall pass rate, per-category, and a "vs baseline" diff. |
| REQ-003 | Promote chosen vector to `lane-registry.ts`. | Lane now `live: true`; weights sum to 1.0. |
| REQ-004 | Existing Vitest tests still pass after promotion. | `vitest run skill_advisor` clean. |
| REQ-005 | Decision recorded as an ADR in this packet. | `decision-record.md` ADR-001 entry. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ablation results documented for all candidate vectors.
- **SC-002**: Chosen vector improves overall pass rate vs baseline, or holds steady on the gold battery with a documented expected lift on out-of-distribution intent prompts.
- **SC-003**: Strict spec validation passes.
- **SC-004**: Dist rebuilt; fresh cli-opencode probe confirms the lane is now live with non-zero weight.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Ablation says "no improvement" | Lane stays shadow-only | Document the negative result; close 002 with `status: complete` and a recommendation note |
| Risk | Chosen vector flips a today-correct routing | Regression on known-good prompt | Reject the vector; pick a more conservative one |
| Dependency | Phase 001 shipped | Lane must exist | Dispatch order enforced by the main agent |
| Dependency | `eval_run_ablation` tool functional | Sweep must complete | Already verified in prior packets |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Final candidate weight vectors to sweep (filled by 001's main agent before dispatching 002).
- Threshold for "no improvement" decision (set when 002 dispatch starts).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-P01 | Performance | Promoted lane does not regress recommend p50 latency by more than 50ms. |
| NFR-R01 | Reliability | Weights sum to 1.0 invariant enforced by Vitest. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Ablation shows no candidate improves over baseline: ship a "no-go" decision, leave lane shadow-only, close packet status=complete.
- Multiple candidates tie on overall pass rate: pick the vector with smaller deviation from baseline weights.
- Gold battery missing skill-advisor probes: surface as a blocker, do not promote.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 30-80 | Mostly weight-vector edit in lane-registry.ts plus ADR-001 |
| **Surface area** | Small | Single registry file + decision record |
| **Risk** | Medium | Weight change directly affects routing behavior |
| **Reversibility** | High | Single-commit revert restores prior weights |
<!-- /ANCHOR:complexity -->
