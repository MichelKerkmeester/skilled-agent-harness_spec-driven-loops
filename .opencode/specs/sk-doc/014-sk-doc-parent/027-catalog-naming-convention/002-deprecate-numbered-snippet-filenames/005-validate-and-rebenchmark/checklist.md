---
title: "Checklist: validate, re-benchmark Lane C, prove zero corpus loss"
description: "Verification checklist for the packet gate."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/005-validate-and-rebenchmark"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recursive strict validate + independent review; Lane C re-run deferred"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Validate, Re-Benchmark Lane C, Prove Zero Corpus Loss

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Each item carries command output (validate / reference-sweep / vitest baseline) as evidence. Where a gate was
deferred rather than run, it is left unchecked with the reason, not falsely marked complete.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Pre-migration benchmark-corpus baseline captured (`playbook-mode` + `skill-benchmark` vitest: 10
      pre-existing failures / 74 passing) so corpus preservation could be proven by delta.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Measurement-only phase; no source or spec-doc content changed here beyond this phase's own docs and the
      two review-driven doc corrections (`sk-code/code-review/SKILL.md`, `create-feature-catalog/references/examples.md`).
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] Recursive `validate.sh --strict` Errors 0 across the 026 parent + all five children.
- [x] Reference integrity green: repo-wide `grep` sweep of the old numbered names found 0 broken references to
      any renamed snippet across all skills; the 3 rewritten hub-routing index docs resolve to existing files.
- [x] Corpus preservation proven: the loader discovers every renamed file and the `playbook-mode` +
      `skill-benchmark` vitest result is byte-identical to the pre-migration baseline (no scenario dropped).
- [ ] DEFERRED — formal Lane C D1-D5 re-benchmark not re-run; the `/deep:review` contract is mid-refactor by a
      concurrent session. Corpus-count preservation is proven above by the byte-identical vitest baseline.
- [ ] DEFERRED — `feature-flag-reference-docs.vitest.ts` / `outsourced-agent-handback-docs.vitest.ts` (ADR-007
      fold-in): they target system-spec-kit's own numbered docs and fail on content assertions beyond
      de-numbering; deferred to a system-spec-kit maintenance pass.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] Independent 6-dimension adversarial review (findings verified against `HEAD~2`) run over the change across
      all skills; every finding triaged, the two real doc inconsistencies fixed, all P0s verified pre-existing.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] The no-new-numbered-snippet guard FAILS pre-migration (`111 offenders`, exit 1) and PASSES post-migration
      (`0 offenders`, exit 0) — captured live.
- [ ] DEFERRED — `workflow-invariance.vitest.ts` allowlist sweep (ADR-007): investigation found the "7 dead
      entries" premise inaccurate (three files were renamed, not deleted, and still need allowlisting under new
      names); deferred to the same system-spec-kit maintenance pass.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] Verification evidence and the deferred items recorded in this phase's `implementation-summary.md`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] No benchmark run artifacts written (formal Lane C re-run deferred); no prior `runs/` overwritten.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Recursive `validate.sh --strict` is Errors 0 across the parent + five children; reference integrity is clean
(0 broken refs); the benchmark corpus is proven intact by a byte-identical vitest baseline; the guard fires
correctly before and after; and an independent multi-agent review confirmed no de-numbering regression. The
formal Lane C D1-D5 re-benchmark and the ADR-007 fold-in are explicitly deferred (see the unchecked items and
`decision-record.md`), not silently skipped.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
The de-numbering is validated and proven non-breaking. Phase complete as scoped, with the formal Lane C
re-benchmark and the ADR-007 system-spec-kit fold-in carried forward as documented deferrals.
<!-- /ANCHOR:sign-off -->
