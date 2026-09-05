# Iteration 13: Skipped successor and canonical-save tests

## Focus

Audit successor and canonical-save tests for disabled coverage, intentional
failure skips, stale exclusion paths, and fixtures that still encode the
retired memory surface. This pass isolates Vitest declarations and the stale
memory-save exclusion instead of repeating the functional folder-detector
runner's skip-accounting finding. The review was source-only.

## Findings

1. **LUNA-048 — Task-enrichment successor save assertions are disabled behind fixture TODOs. P1. CONFIRMED.** The task-enrichment suite leaves assertions for legacy-context filename absence, contamination auditing, provenance, stateless saves, and state-leak behavior disabled while compact-wrapper fixtures are unfinished. The file therefore does not provide active proof that the successor save path preserves those boundaries. Smallest fix: restore the compact-wrapper fixtures and re-enable the assertions, or replace each with an explicitly enforced successor equivalent. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:929-977] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1026-1089,1395-1458]

2. **LUNA-049 — The canonical-save validator's negative and drift contract is entirely `fails.skip`. P1. CONFIRMED.** The validator skips the principal checks for runtime regressions, missing root spec/source-doc inputs, lineage cutoffs, identity drift, freshness skew, and the full rule pack. A green test run can therefore omit the exact successor contract that would catch decommission drift. Smallest fix: repair the underlying runtime seams and re-enable the tests, or move them into a separately enforced blocking regression suite. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/canonical-save-validation.vitest.ts:125-215]

3. **LUNA-050 — Vitest excludes a nonexistent `runtime/tests/memory-save.vitest.ts` path. P2. CONFIRMED.** The runtime Vitest configuration retains an exclusion for a path that is absent from the bounded source inventory. The exclusion can hide a deleted or renamed test without causing configuration failure, and it gives no evidence that a current replacement covers the same behavior. Smallest fix: remove the dead exclusion or point it at the current replacement test and assert that special exclusions resolve. [SOURCE: .opencode/skills/system-spec-kit/runtime/vitest.config.ts:18-26] [INFERENCE: direct source-path inspection found no file at the excluded runtime/tests path]

## Ruled Out

- The prior functional folder-detector skip-accounting issue was not duplicated; this pass targets separate Vitest skip and exclusion mechanisms. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:81-95,1279-1346]

## Edge Cases

- Some skipped tests may be deliberate backlog markers rather than false assertions. That does not restore coverage: the smallest safe fix is either an active successor assertion or an explicitly owned, separately enforced backlog contract.
- The missing `memory-save` path may have been replaced elsewhere. The confirmed defect is the unresolved exclusion, not a claim that no replacement test exists.

## Questions Remaining

- Q4 gains expanded evidence that successor tests can pass while required checks remain skipped.
- Q7 gains expanded evidence that canonical-save gate coverage is not currently executable end to end.
- Q1-Q3, Q5-Q6 remain open for the remaining live surfaces, documentation, registrations, and successor retrieval/gate boundaries.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:929-977,1026-1089,1395-1458]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/canonical-save-validation.vitest.ts:125-215]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/vitest.config.ts:18-26]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/README.md:14-25,80-89]

## Assessment

- New information ratio: 0.84
- Questions addressed: Q4, Q7
- Questions answered: Q4 = expanded; Q7 = expanded
- Confidence: high for the skip/exclusion declarations; medium for the intended replacement of the missing test path

## Reflection

- What worked and why: reading the skip declarations and runner configuration exposed coverage gaps without treating every retained memory name as a live server.
- What did not work and why: source-only inspection cannot determine whether a skipped contract has an equivalent test under a different name.
- What I would do differently: next return to documentation and validation boundaries, checking whether their named test paths and completion signals are themselves executable.

## Recommended Next Focus

Continue with documentation and gate-integrity review, while keeping skipped successor tests and dead exclusions as separate debt items rather than folding them into the live database finding.
