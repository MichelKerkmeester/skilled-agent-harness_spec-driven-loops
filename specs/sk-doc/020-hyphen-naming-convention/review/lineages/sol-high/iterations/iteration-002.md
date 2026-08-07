# Deep Review Iteration 002

## Dimension

Security — rename apply preconditions and option-like operands.

## Files Reviewed

- Policy decision record
- Rename-engine spec, decision record, and checklist
- Fixture-harness checklist
- Reference-rewrite executor spec and checklist

## Findings by Severity

### P0

None.

### P1

1. **F003 — Rename apply is not bound to the reviewed repository and map snapshot.** The dry-run plan records candidate/worktree identity, map identity, closure, and operation order [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77`], but neither the apply requirement nor its checklist requires revalidating those values, worktree/index cleanliness, sources, and targets immediately before the first `git mv` [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/checklist.md:57`]. The reference executor's blob CAS protects rewrites, not path moves.

2. **F004 — The declared leading-hyphen hazard lacks an executable rejection criterion.** Policy names leading-hyphen CLI hazards [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md:72`], while engine acceptance and the harness require leading/double-underscore and collision cases but no leading-hyphen source/target, argv rule, or option-termination check [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness/checklist.md:53`].

### P2

None.

## Claim Adjudication

- F003: counterevidence in the CAS executor was scoped to static reference blobs and does not bind `git mv`. Final P1. Downgrade when apply atomically revalidates plan/repository/map identity and cleanliness with stale-plan fixtures.
- F004: generic unsafe-boundary language is not testable against option-like paths. Final P1. Downgrade when reject-or-safe-argv behavior and fixtures are explicit.

## Traceability Checks

- `spec_code`: fail — reviewed-plan identity is not an apply precondition.
- `checklist_evidence`: fail — stale-plan and leading-hyphen negative cases are absent.
- Repository-boundary and rollback checks are present and were ruled out as gaps.

## Verdict

Two new P1 security findings.

## Next Dimension

Traceability — current numbering, parent/child handoffs, and requirement-to-verification coverage.

Review verdict: CONDITIONAL
