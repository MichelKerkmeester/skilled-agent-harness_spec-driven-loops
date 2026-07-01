---
title: "Decision Record: Prior Research Evidence Base"
description: "Records the phase-001 decision for unrecovered prior research citations and the accepted axiom boundary."
trigger_phrases:
  - "prior research evidence base"
  - "operator asserted axioms"
  - "decision record"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/002-route-proof-validation"
    last_updated_at: "2026-06-30T19:40:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Accepted unrecovered prior research claims as explicit axioms"
    next_safe_action: "Implement route-proof validator fields"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-001-decision"
      parent_session_id: "031-001-phase-parent"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Prior research citations were not recoverable in the current worktree."
---
# Decision Record: Prior Research Evidence Base

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:decision -->
## Decision: Accept Missing Prior Research as Explicit Axioms

### Status

Accepted for phase 001.

### Context

The phase parent research references prior packets that are not present in the current worktree:

- `.opencode/specs/deep-loops/030-agent-loops-improved/010-gpt-deep-agent-routing/research/research.md`
- `../001-gpt-deep-agent-routing/research/research.md`
- `../002-gpt-routing-fixes`

The current phase depends on two claims from those missing packets: the GPT mis-route taxonomy and the relative fix ranking that makes route-proof validation the first acceptance gate.

### Decision

For phase 001, treat the following as operator-asserted axioms rather than independently recovered evidence:

- Mis-route mode A: the general/build agent absorbs the intended deep leaf role.
- Mis-route mode B: the leaf re-dispatches from injected prose rather than completing the assigned loop work.
- Mis-route mode C: the loop advances on fabricated or schema-only artifacts without a canonical narrative file proving target-mode work.
- The route-proof validator fix must land before downstream agent-dispatch and prompt-header phases because a schema-valid wrong-mode artifact can otherwise pass validation.

### Consequences

This phase can proceed without blocking on unrecovered files, but the evidence chain remains weaker than a recovered citation. Downstream phases must not claim the missing packets were read or verified. Verification for this phase must therefore rely on a direct falsification test: a schema-valid wrong-mode artifact is rejected by the route-proof validator.

### Revisit Condition

If the missing packets are recovered later, compare their taxonomy and fix ranking against the accepted axioms. If they conflict, open an amendment before changing downstream implementation behavior.
<!-- /ANCHOR:decision -->

---
