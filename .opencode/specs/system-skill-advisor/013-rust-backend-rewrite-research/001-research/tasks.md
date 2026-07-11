---
title: "Tasks: Phase 1 — Skill-Advisor Scoring Core Rust Rewrite Research"
description: "Execution checklist for the future 16-round deep-research pass over the system-skill-advisor scoring and ranking core: setup, smoke check, loop launch, synthesis, residency audit, and verification."
trigger_phrases:
  - "skill advisor scorer rust research tasks"
  - "013 phase 001 research checklist"
  - "advisor ranking deep research tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-rust-backend-rewrite-research/001-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the scoring-core research execution checklist; the loop remains unstarted"
    next_safe_action: "Execute T001 by confirming cli-codex authentication and GPT-5.6-sol availability"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-013-001-skill-advisor-scoring-rust-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "Will measured JS-resident scorer time clear the native-boundary overhead needed for a targeted module?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — Skill-Advisor Scoring Core Rust Rewrite Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `codex` authentication and `gpt-5.6-sol` xhigh/fast availability
- [ ] T002 Verify `research/deep-research-fanout-config.json` has one executor, 16 iterations, concurrency 1
- [ ] T003 Verify `research/deep-research-strategy.md` contains 12 angles, allocation, invariant, deliverables, non-goals, stop conditions, and evidence discipline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Smoke-test one round through `/deep:research:auto` and confirm iteration markdown + JSONL delta
- [ ] T005 Launch the 16-round single-lineage loop through the command workflow, following `plan.md` §3
- [ ] T006 Complete the survey band (Rounds 1–6) before accepting rewrite hypotheses
- [ ] T007 Complete deep validation or converge legally; synthesize `research/research.md`
- [ ] T008 Produce the improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify terminal stop reason and valid append-only state
- [ ] T010 Verify A1–A12 coverage with `[SOURCE: relative/path.ts:line]` or `[SOURCE: url]` citations
- [ ] T011 Verify current and scaled candidate/edge/vocabulary/work sizes are quantified
- [ ] T012 Verify every latency claim labels JS, native/FFI, mixed, or unmeasured residency
- [ ] T013 Verify no "big win" counts SQLite, ONNX, or other already-native work
- [ ] T014 Verify ranking parity covers order, rounding, thresholds, ambiguity, abstention, attribution, and delegation
- [ ] T015 Verify no embedder/vector-index/skill-graph-tool/transport implementation leaked into Phase 001 scope
- [ ] T016 Run `validate.sh --strict`; report parent-generated prerequisites; stop for human review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0/P1 requirements are satisfied or explicitly deferred by the user
- [ ] No `[B]` tasks remain
- [ ] Loop converged/capped and all four decision artifacts are review-ready
- [ ] Ranked recommendation names the smallest justified architecture and first falsifiable step
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md` (requirements and A1–A12)
- **Plan**: `plan.md` (16-round allocation)
- **Strategy**: `research/deep-research-strategy.md`
- **Config**: `research/deep-research-fanout-config.json`
<!-- /ANCHOR:cross-refs -->
