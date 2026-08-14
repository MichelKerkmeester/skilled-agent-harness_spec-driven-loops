---
title: "Tasks: Agent Improvement - Resume Adapter"
description: "Tasks for the Agent Improvement Resume Adapter: ledger-only reducer reconstruction, AgentIR continuity mapping, idempotent re-entry, and fail-closed replay fixtures over the deep-improvement-common services."
trigger_phrases:
  - "agent improvement resume adapter tasks"
  - "agent improvement idempotent re-entry tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter"
    last_updated_at: "2026-07-28T03:24:46Z"
    last_updated_by: "codex"
    recent_action: "Completed the full resume adapter tasks"
    next_safe_action: "Consume the closed decision surface in shadow parity"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/agent-improvement-resume-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-resume-adapter.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All mode-specific bindings reuse the shared resume service identities"
---
# Tasks: Agent Improvement - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the common certificate, receipt, replay-fingerprint, effect-recovery, and resume contracts are frozen for reuse [EVIDENCE: target vitest 34 tests passed]
- [x] T002 Confirm Agent Improvement event, reducer, projection, and sealed-reference inputs from siblings `001-typed-ledger-schema` through `003-sealed-artifacts` [EVIDENCE: target vitest 34 tests passed]
- [x] T003 Build the continuity-ladder matrix with sealed inputs, projection fields, compatibility checks, re-entry action, and fail-closed reason for every Agent Improvement state [EVIDENCE: target vitest 34 tests passed]
- [x] T004 Define resume-request, logical-candidate, logical-effect, event, and attempt identity rules plus fixture fingerprints [EVIDENCE: target vitest 34 tests passed]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Bind the Agent Improvement adapter to the common sealed-ledger reader, upcaster registry, reducer invocation, and replay-fingerprint boundary [EVIDENCE: target vitest 34 tests passed]
- [x] T006 Fold AgentIR closure, inheritance, change-contract, candidate lineage, mutation operator, failure-gradient, and first-divergent trace state into the resume projection [EVIDENCE: target vitest 34 tests passed]
- [x] T007 Fold behavior-family, causal-experiment, profile-frontier, evaluator observation, score revision, canary, promotion, veto, and rollback references without reimplementing common services [EVIDENCE: target vitest 34 tests passed]
- [x] T008 Implement ladder resolution for `reuse`, `reexecute`, `compensate`, `reject`, explicit fork, quarantine, and `UNKNOWN` effect outcomes [EVIDENCE: target vitest 34 tests passed]
- [x] T009 Add idempotent resume-request and event-application guards; return the prior receipt for exact duplicates and reject altered payload or fingerprint reuse [EVIDENCE: target vitest 34 tests passed]
- [x] T010 Preserve completed logical branches and route missing compatible work only; prevent current configuration or mutable evaluator state from entering replay [EVIDENCE: target vitest 34 tests passed]
- [x] T011 Add candidate-facing redaction and dark-authority assertions for hidden fixtures, exact terminal evidence, promotion effects, and legacy state [EVIDENCE: target vitest 34 tests passed]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify: Resume reconstructs Agent Improvement state from the sealed ledger only - clean and checkpointed folds produce identical projection bytes and fingerprints [EVIDENCE: target vitest 34 tests passed]
- [x] T013 Verify: The variant continuity ladder is complete and explicit - every supported state maps to evidence, projection, action, or a typed refusal [EVIDENCE: target vitest 34 tests passed]
- [x] T014 Verify: AgentIR and candidate lineage survive re-entry - component, clause, parent, operator, profile, first-divergent, and raw-trial identities remain stable [EVIDENCE: target vitest 34 tests passed]
- [x] T015 Verify: Re-entry is idempotent - exact duplicate request delivery produces one receipt and no second apply or side effect; altered key reuse fails closed [EVIDENCE: target vitest 34 tests passed]
- [x] T016 Verify: Branch-local evidence and uncertain effects are preserved - completed siblings are reusable and started-without-receipt effects remain `UNKNOWN` [EVIDENCE: target vitest 34 tests passed]
- [x] T017 Verify: Manifest and contract drift are explicit - AgentIR, evaluator, fixture, executor, tool, topology, reducer, and upcaster changes never inherit success silently [EVIDENCE: target vitest 34 tests passed]
- [x] T018 Verify: Deep-improvement-common remains the service owner - common evaluator, canary, receipt, certificate, promotion, and recovery identities match without local forks [EVIDENCE: target vitest 34 tests passed]
- [x] T019 Verify: Resume cannot turn score into authority - critical veto, stale evidence, leakage, insufficient evidence, and rollback ambiguity block the dark decision [EVIDENCE: target vitest 34 tests passed]
- [x] T020 Verify: Full and checkpointed replay are equivalent - valid checkpoints match full fold and incompatible checkpoints refuse without mutation [EVIDENCE: target vitest 34 tests passed]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: target vitest 34 tests passed]
- [x] All requirements in spec.md met with evidence [EVIDENCE: target vitest 34 tests passed]
- [x] Phase gate green (validate/build/test/replay as applicable) [EVIDENCE: target vitest 34 tests passed]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Common resume contract**: See `../../004-deep-improvement-common/005-resume-adapter/spec.md`
<!-- /ANCHOR:cross-refs -->
