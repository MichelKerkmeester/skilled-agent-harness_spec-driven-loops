---
title: "Tasks: end-to-end validation & benchmark regression proof"
description: "Task breakdown for the packet gate: baseline, strict recursion, link guard, path tests, benchmark delta, guard proof."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/005-validate-and-rebenchmark"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase tasks authored"
    next_safe_action: "Capture baseline before Phase 004"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: End-to-End Validation & Benchmark Regression Proof

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Capture the Lane C baseline on the to-be-touched skills BEFORE Phase 004 runs.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Recursive `validate.sh --strict` across the parent + every touched skill; Errors 0.
- [ ] Leaf-classification spot-check per family (catalog/playbook leaves not downgraded to readme).
- [ ] Run the whole-workspace markdown-link guard + the hard-coded-path tests.
- [ ] Re-run Lane C on affected skills; compute the before/after delta.
- [ ] Guard proof: create a throwaway `NN--` folder → FAIL → remove → PASS.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] All gates green; benchmark delta explained; guard proof captured.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
Strict recursion Errors 0, links + path tests green, no benchmark regression, guard rejects new numbers.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Final gate for packet 025; consumes the outputs of Phases 002–004.
<!-- /ANCHOR:cross-refs -->
