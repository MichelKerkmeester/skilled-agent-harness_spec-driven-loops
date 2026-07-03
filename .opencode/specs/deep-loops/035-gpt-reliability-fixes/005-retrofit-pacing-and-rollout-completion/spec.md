---
title: "Spec: Retrofit, Pacing, and Rollout Completion"
description: "Phase 005 of packet 035 (unified command-contract architecture). Retrofit the remaining commands, the 3 sibling improvement lanes, and non-deep-loop surfaces to the phase-003 compiled contract; land the Gate-2 sub-threshold routing offer; land pacing/resume (design-first: resumable sub-invocations, cache, budget policy); land the council convergence rule (F-018); and flip the per-command feature flags on per the promotion rule. Closes F-018/023/024/026/032/033/034. Absorbs plan-review gaps GAP-11/33/41/44/54."
trigger_phrases:
  - "035 phase 005"
  - "retrofit pacing rollout completion"
  - "routing offer pacing resume"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/005-retrofit-pacing-and-rollout-completion"
    last_updated_at: "2026-07-03T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored: retrofit + pacing + rollout"
    next_safe_action: "Execute last; retrofit remaining commands and flip flags per promotion rule"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-005-restructure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Retrofit, Pacing, and Rollout Completion

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | ../ (035-gpt-reliability-fixes) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | [../004-dispatch-receipts-and-progress/spec.md](../004-dispatch-receipts-and-progress/spec.md) |
| **Closes findings** | F-018, F-023, F-024, F-026, F-032, F-033, F-034 |
| **Effort** | L |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The compiled contract (phase 003) is proven on the review command; this phase extends it everywhere and finishes the program. Three jobs: (1) retrofit the remaining deep commands, the three sibling improvement lanes (model-benchmark, skill-benchmark, ai-system-improvement), and the non-deep-loop command surfaces — all of which share the same machinery but had no coverage in the original plan; (2) land the Gate-2 sub-threshold routing offer + natural-phrasing boosters so vague asks route instead of being answered inline; (3) make the heaviest command survivable via resumable sub-invocations, caching, and a pacing/budget policy — design-first, since no 034 design iteration exists (GAP-54). Then flip the per-command feature flags on per the promotion rule.

Findings closed: F-018 (council convergence rule, moved here from progress per GAP-33), F-023, F-024, F-026 (routing), F-032, F-033, F-034 (pacing/resume). Absorbs plan-review GAP-11, GAP-33, GAP-41, GAP-44, GAP-54.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** retrofit of the remaining deep commands + 3 sibling improvement lanes + named non-deep-loop surfaces to the compiled contract; Gate 2 + `skill_advisor.py` routing offer + phrase boosters; the resumable-sub-invocation split + cache + pacing/budget policy for the heaviest command; the council two-of-three convergence rule (F-018); flipping feature flags on per the phase-001 promotion rule.

**Out of scope:** the contract compiler itself (phase 003); receipt/progress mechanisms (phase 004). Any non-deep-loop surface deemed out of scope is recorded with a written exclusion boundary rather than silently skipped.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Retrofit the remaining deep commands and the 3 sibling improvement lanes (model-benchmark, skill-benchmark, ai-system-improvement) to the compiled contract; each lane either gets a contract or a recorded deferral with a target date (GAP-41).
- **REQ-002**: Name the non-deep-loop command surfaces (doctor/, speckit/, memory/, create/, design/) that share the auto/confirm/Gate machinery; extend the contract to them or record a written exclusion boundary in this spec (GAP-44).
- **REQ-003**: Sub-threshold "offer the workflow" path in Gate 2 + noun-gated phrase boosters for the natural phrasings + down-weight path-derived tokens; verified against the post-001 path-free baseline, not the original 033 verdicts (F-023, F-024, F-026, GAP-11, GAP-14 handoff).
- **REQ-004 (design-first)**: Split the heaviest command into resumable sub-invocations (setup / work / synthesize) sharing session id + ledger, each emitting + consuming a phase-004 receipt; cache integration scan/profile; add a pacing contract (first-artifact deadline, budget-fraction checkpoints, pre-cap finalizer) + a conditional budget policy that extends only visible-progress runs (F-032/033/034, GAP-54). Per-sub-invocation acceptance cells + a cache-hit-rate metric.
- **REQ-005**: The council single bounded referee pass per round (two-of-three + max-round escape), adjudicator-stability math behind an optional flag (F-018, moved here from the progress phase per GAP-33); acceptance names ACB-005 hidden-loop avoidance.
- **REQ-006**: Flip each command's feature flag from fallback to fix per the phase-001 promotion rule (N consecutive green GPT-leg runs); the CI comparator gates each promotion.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Every deep command + sibling lane either carries a compiled contract or a recorded, dated deferral; non-deep-loop surfaces are extended or explicitly excluded in writing.
2. The routing offer flips the vague-ask cells against the post-001 baseline; path tokens down-weighted.
3. Resumable sub-invocations validate mid-run (each with a receipt); the pacing policy extends only visible-progress runs; the council referee pass is bounded.
4. All feature flags promoted per the rule with the comparator green.

**Acceptance harness (033 cells):** ACB-003, IMB-003, RSB-004 (routing, vs the post-001 baseline); IMB-001-high natural completion (pacing); ACB-005 hidden-loop (referee). Ship each behind its flag, promoted per rule.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| GAP-54 — pacing/resume has no design | Design-first REQ-004 + per-sub-invocation cells; carve into 036 if it grows |
| GAP-41/44 — sibling lanes + non-deep-loop surfaces uncovered | REQ-001/002 retrofit or written deferral/exclusion |
| GAP-11 — routing mis-serialized | Routing is here, correctly after 001/002, parallel-safe with 003 |
| GAP-33 — F-018 scope-creep | F-018 owned here (council rules), not in the progress phase |
| Depends on 003 contract + 004 receipts | Retrofit consumes the compiled contract; resumable runs consume receipts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether pacing/resume (REQ-004) stays in 035 or spins into a 036 design packet is decided at REQ-004 design time (GAP-54).
<!-- /ANCHOR:questions -->
