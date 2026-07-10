---
title: "Tasks: Deep-Loop Divergent Convergence Mode"
description: "Ordered planning and future implementation tasks for divergent convergence behavior across research and review. Planning tasks are complete; runtime implementation tasks remain pending and require /speckit:implement."
trigger_phrases:
  - "divergent convergence tasks"
  - "pivot adapter tasks"
  - "research review parity tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/055-deep-loop-divergent-mode"
    last_updated_at: "2026-07-10T09:43:07Z"
    last_updated_by: "opencode"
    recent_action: "Completed Spec Kit planning and native AI Council deliberation"
    next_safe_action: "Await approval, then invoke /speckit:implement"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "ai-council/council-report.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-055-deep-loop-divergent-mode"
      parent_session_id: null
    completion_pct: 18
    open_questions: []
    answered_questions:
      - "Architecture and implementation sequence are defined"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-Loop Divergent Convergence Mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the Level 2 packet from Spec Kit templates (`055-deep-loop-divergent-mode/`) - Evidence: canonical scaffold and generated metadata exist.
- [x] T002 Map architecture, analogous patterns, dependencies, and test infrastructure with four read-only context passes - Evidence: planning session context packages synthesized in `research/research.md`.
- [x] T003 Run a native three-seat Depth-1 AI Council and persist its complete artifact set (`ai-council/**`) - Evidence: `council_complete` and three `seat_returned` events in `ai-council/ai-council-state.jsonl`.
- [x] T004 Define requirements, architecture, implementation phases, rollback, and validation matrix (`spec.md`, `plan.md`, `checklist.md`) - Evidence: strict packet validation required before planning closeout.
- [ ] T005 Capture pre-change golden fixtures and non-consumer hashes (`runtime/tests/**`, compiled command contracts, hub/registry files).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Add four-value convergence-mode parsing and canonical nested config to both command presentations and wrappers (`.opencode/commands/deep/{research,review}.md`, presentation assets).
- [ ] T011 Add `divergent` validation/reporting without changing convergence decisions (`runtime/scripts/convergence.cjs`, parser tests).
- [ ] T012 Propagate the effective mode through research/review auto and confirm config/state/runtime calls (four YAML assets).
- [ ] T013 Implement stable pivot identity, lifecycle events, strict 3/3 return quorum, agreement, recursion/cost guards, and pivot-scoped persistence (new runtime divergent adapter and tests).
- [ ] T014 Implement evidence/boundary validation and exact/similarity candidate dedup (new shared mechanics helper and tests).
- [ ] T015 [P] Integrate research eligibility, candidate generation, reducer replay, strategy/dashboard/prompt state, and Divergence Map synthesis (`deep-research/**`).
- [ ] T016 [P] Integrate review eligibility, candidate generation, reducer replay, strategy/dashboard/prompt state, and Dimension Expansion Map synthesis while preserving verdict/security/read-only locks (`deep-review/**`).
- [ ] T017 Add confirm-mode choices and audited override/manual-stop behavior to research and review confirm workflows.
- [ ] T018 Regenerate compiled command contracts from canonical sources (`runtime/scripts/compile-command-contracts.cjs`).
- [ ] T019 Update convergence/state/loop references, feature catalogs, playbooks, and behavior benchmarks for both packet families.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Run parser/config and unchanged-mode golden fixtures.
- [ ] T021 Run four-workflow pivot and hard-stop parity tests.
- [ ] T022 Run strict quorum, agreement, recursion, budget, crash/replay, and artifact-collision tests.
- [ ] T023 Run research/review reducer idempotency and synthesis snapshot tests.
- [ ] T024 Run command compiler/render/drift and lifecycle taxonomy parity checks.
- [ ] T025 Run research/review manual divergent scenarios and unchanged behavior benchmarks.
- [ ] T026 Run full runtime package tests, typecheck, packet-specific suites, and strict Spec Kit validation.
- [ ] T027 Perform code-quality and post-implementation deep-review gates before any completion claim.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Planning artifacts and Council decision are complete and validated.
- [ ] All future implementation tasks are complete through `/speckit:implement`.
- [ ] All P0/P1 checklist items have evidence or approved P1 deferrals.
- [ ] No blocked tasks remain.
- [ ] Implementation summary and continuity reflect verified shipped behavior.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Research Evidence**: `research/research.md`
- **AI Council**: `ai-council/council-report.md`
<!-- /ANCHOR:cross-refs -->
