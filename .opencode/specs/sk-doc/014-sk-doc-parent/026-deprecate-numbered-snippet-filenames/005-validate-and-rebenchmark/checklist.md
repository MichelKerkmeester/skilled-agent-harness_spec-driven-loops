---
title: "Checklist: validate, re-benchmark Lane C, prove zero corpus loss"
description: "Verification checklist for the packet gate."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/005-validate-and-rebenchmark"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase checklist authored"
    next_safe_action: "Capture the Lane C baseline on the to-be-touched skills before Phase 004 executes the migration"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Validate, Re-Benchmark Lane C, Prove Zero Corpus Loss

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries command output (validate/link-guard/benchmark/vitest) as evidence; the benchmark item
carries a real pre-Phase-004 baseline, not a single post-hoc number.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] Lane C baseline (scenario count + D1-D5) captured on the 9 to-be-touched skill packets before Phase
      004 runs.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Measurement-only phase; no source or spec-doc content changed here beyond this phase's own docs.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Recursive `validate.sh --strict` Errors 0 across parent + all 9 touched skills.
- [ ] Whole-workspace markdown-link guard green; the 3 rewritten hub-routing root-index docs resolve.
- [ ] Lane C before/after delta captured: discovered scenario count unchanged, no D1-D5 regression.
- [ ] `feature-flag-reference-docs.vitest.ts` passes.
- [ ] `outsourced-agent-handback-docs.vitest.ts` passes.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] All 9 affected skill packets covered by the strict recursion + the Lane C re-run (not a subset).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] The no-new-numbered-snippet guard FAILS on a freshly created `NNN-*.md` scenario file and PASSES once
      it is removed — proof captured live.
- [ ] `workflow-invariance.vitest.ts:97-104` confirmed clear of the 7 dead allowlist entries.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] Lane C delta and any explained movement recorded in the implementation summary.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] Benchmark run artifacts stored under each affected skill's benchmark run directory (add-only, no
      overwrite of prior runs).
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Pending execution. All gates must be green with a real before/after baseline before the packet's completion
claim is made.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Packet 026 gate not yet run. Sign-off follows once strict recursion, the link guard, the Lane C delta, the
guard-fire proof, and both folded-in vitest suites are all green.
<!-- /ANCHOR:sign-off -->
