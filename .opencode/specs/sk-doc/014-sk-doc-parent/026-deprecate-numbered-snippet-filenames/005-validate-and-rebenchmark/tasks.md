---
title: "Tasks: validate, re-benchmark Lane C, prove zero corpus loss"
description: "Task breakdown for the packet gate: baseline, strict recursion, link guard, Lane C delta, guard-fire proof, folded-in vitest suite fixes."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/005-validate-and-rebenchmark"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase tasks authored"
    next_safe_action: "Capture the Lane C baseline on the to-be-touched skills before Phase 004 executes the migration"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Validate, Re-Benchmark Lane C, Prove Zero Corpus Loss

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Capture the Lane C baseline (discovered scenario count + D1-D5 scores) on the 9 to-be-touched skill
      packets BEFORE Phase 004 runs, against the Phase 001 tolerant loader.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Recursive `validate.sh --strict` across the parent packet + every one of the 9 touched skills; Errors
      0.
- [ ] Run the whole-workspace markdown-link guard; confirm the 3 rewritten hub-routing root-index docs
      resolve every row.
- [ ] Re-run Lane C on the same 9 affected skills; compute the before/after delta on discovered scenario
      count and D1-D5 scores.
- [ ] Guard-fire proof: create a throwaway `feature_catalog|manual_testing_playbook/<cat>/NNN-*.md` file →
      confirm the Phase 001 guard FAILS → remove it → confirm PASS.
- [ ] Run `feature-flag-reference-docs.vitest.ts` and `outsourced-agent-handback-docs.vitest.ts`; confirm
      both pass.
- [ ] Re-check `workflow-invariance.vitest.ts:97-104`; confirm the 7 dead allowlist entries remain swept.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] All gates green; scenario count unchanged; D1-D5 delta explained; guard-fire proof captured; both
      vitest suites pass.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
Strict recursion Errors 0, link guard green, Lane C scenario count unchanged with no D1-D5 regression, the
no-new-numbered-snippet guard proven to fire and clear, and both folded-in vitest suites passing.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Final gate for packet 026; consumes the outputs of Phases 001-004 (loader-and-guard, generator-alignment,
migration-tooling, execute-migration).
<!-- /ANCHOR:cross-refs -->
