---
title: "Plan: validate, re-benchmark Lane C, prove zero corpus loss"
description: "Capture a pre-migration Lane C baseline on the 9 affected skill packets, then after Phase 004 executes run recursive strict validation, the link guard, a Lane C re-run with delta, the no-new-numbered-snippet guard-fire proof, and the 2 folded-in vitest suite fixes."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/005-validate-and-rebenchmark"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan authored"
    next_safe_action: "Capture the Lane C baseline on the to-be-touched skills before Phase 004 executes the migration"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: Validate, Re-Benchmark Lane C, Prove Zero Corpus Loss

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
The packet's gate. Baseline the Lane C scenario count and D1-D5 scores on the 9 affected skill packets
before Phase 004 renames anything, then after execution run the full validation + link-guard +
benchmark-delta + guard-fire-proof + folded-in-test suite, and only then allow the completion claim.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
Recursive `--strict` Errors 0 across parent + all 9 touched skills; link guard green; Lane C discovered
scenario count unchanged with no D1-D5 regression versus the pre-Phase-004 baseline; the no-new-numbered-
snippet guard demonstrably FAILS on a new numbered file and PASSES once removed; both previously-failing
vitest suites pass; the 7 dead allowlist entries stay swept.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Reuses existing tooling unchanged — this phase is measurement, not new tooling: the Lane C smart-routing
harness (`run-skill-benchmark.cjs` or equivalent) for before/after scoring on the 9 affected packets, the
spec-kit `validate.sh --strict` for recursive validation, the whole-workspace markdown-link guard, the
Phase 001 no-new-numbered-snippet guard for the rejection proof, and the vitest suites named in decision B
(`feature-flag-reference-docs.vitest.ts`, `outsourced-agent-handback-docs.vitest.ts`,
`workflow-invariance.vitest.ts`).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: BEFORE Phase 004 runs: capture the Lane C baseline (discovered scenario count + D1-D5 scores) on the 9
   skill packets that Phase 004 will touch, against the Phase 001 tolerant loader.
### Phase 2: AFTER Phase 004 lands: recursive `validate.sh --strict` across the parent and every touched skill.
### Phase 3: Run the whole-workspace markdown-link guard, including the 3 rewritten hub-routing root-index docs.
### Phase 4: Re-run Lane C on the same 9 packets; compute and explain the before/after delta on scenario count and
   D1-D5 scores.
### Phase 5: Guard-fire proof: create a throwaway `feature_catalog|manual_testing_playbook/<cat>/NNN-*.md` file →
   expect the Phase 001 guard to FAIL → remove it → expect PASS.
### Phase 6: Run `feature-flag-reference-docs.vitest.ts` and `outsourced-agent-handback-docs.vitest.ts`; confirm both
   pass, and confirm the 7 dead `workflow-invariance.vitest.ts:97-104` allowlist entries remain swept.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`validate.sh --strict --recursive` (or an equivalent per-skill strict loop) over the parent + 9 touched
skills; the workspace link guard; the Lane C benchmark harness run before Phase 004 and again after, diffed
on scenario count and D1-D5; a scripted guard-fire create/remove cycle against the Phase 001 guard; a direct
run of the 2 named vitest suites plus a re-check of the swept allowlist.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Phases 001 (tolerant loader + guard), 002 (generator alignment), 003 (migration tooling), and 004 (executed
migration, folded-in vitest fixes) all complete; the Lane C harness, the spec-kit validator, and the
markdown-link guard used unchanged.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Measurement-only; nothing in this phase writes source or spec content, so there is nothing to roll back. A
failing gate (validation error, link break, scenario-count drop, D1-D5 regression, a guard that does not
fire, or either vitest suite still red) blocks the packet's completion claim and routes the fix back to the
owning phase (001-004), not to this one.
<!-- /ANCHOR:rollback -->
