# Iteration 6: Maintainability and Fork Stewardship

## Focus

Reduce drift and make future upstream reconciliation auditable without coupling the two extensions at runtime or rewriting the cache optimizer wholesale.

## Findings

1. Both vendored forks still advertise upstream package versions and upstream issue/repository URLs despite local behavior changes. That makes a packed artifact operationally indistinguishable from upstream and sends defect reports to the wrong owners. Add explicit fork build metadata (for example `2.8.0-pi039.1` and `1.0.0-pi039.1`), local provenance metadata, upstream commit/tag, patch-series checksum, and a documented reconciliation command. [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:3] [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:45] [SOURCE: .pi/extensions/deep-pi/package.json:3] [SOURCE: .pi/extensions/deep-pi/package.json:7]
2. The ownership predicate is a cross-package contract but is duplicated in production code. A shared runtime module would create load-order and packaging coupling; the lower-risk solution is one canonical fixture matrix plus an integration test that invokes each package's exported predicate and asserts identical answers for provider, API, base URL, known ids, aliases, and future-id negatives. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1279] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:6508]
3. `pi-cache-optimizer` exposes a very large `__internals_for_tests` object from the production entry point, while almost all implementation remains in one 8,390-line module. Characterization tests should precede staged extraction at stable seams: eligibility/model families, adapter normalization, persistence/migrations, prompt transforms, compat diagnostics, and UI/hook wiring. Each extraction should preserve the existing public entry point and move tests to direct module imports. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:6471] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7280] [INFERENCE: named responsibility seams reduce merge conflicts and make fault tests possible without a behavioral rewrite]
4. DeepPi already has useful module seams, but duplicate declarations show local edits have accumulated without a structural hygiene gate: `HashlineStats` is declared twice in the same file. Add lint/type-aware duplicate-symbol checks, a source-file size budget, and package-content assertions that verify every script referenced by `package.json` exists and is included when required. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:165] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:183] [SOURCE: .pi/extensions/deep-pi/package.json:36] [SOURCE: .pi/extensions/deep-pi/package.json:56]
5. Fork maintenance needs a machine-readable patch ledger, not only sibling spec prose. Record upstream origin/ref, fork base commit, local patch identifiers with owned files and tests, last reconciliation date, and known conflicts. CI can then fetch/compare upstream optionally, while the default offline check validates that the declared base and patch checksum match the vendored tree. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md] [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi/spec.md] [INFERENCE: explicit provenance makes future rebases reviewable and prevents local safeguards from disappearing silently]

## Ruled Out

- One shared production eligibility module across separately packaged extensions. It reduces textual duplication but introduces runtime resolution and release coupling; share executable contract fixtures instead. [INFERENCE: both package manifests publish independent entry points]
- Splitting the cache optimizer into many files in one change. Without characterization coverage, a mechanical rewrite expands review surface across every model adapter and hook. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:6471]
- Replacing upstream history with a new clean fork. Preserve provenance and express local deltas as an auditable patch ledger. [INFERENCE: reconciliation depends on a stable upstream base]

## Dead Ends

- Package metadata alone cannot prove the vendored source matches its stated base. It needs a tree or patch checksum validated in CI. [INFERENCE: semantic version strings do not authenticate contents]

## Edge Cases

- Ambiguous input: local package versions may never be published, but unique build identity still matters in logs and packed verification artifacts.
- Contradictory evidence: TypeScript permits interface merging, so duplicate `HashlineStats` declarations compile; the issue is drift signal and review clarity, not current runtime failure.
- Missing dependencies: provenance and checksum validation can use Node and Git already present in the workspace.
- Partial success: modularization boundaries are evidence-based, but exact file names should be decided during implementation against the then-current upstream diff.

## Sources Consulted

- both package manifests and entry-point exports
- DeepPi hashline module and eligibility helper
- sibling fork specs and implementation summaries

## Assessment

- New information ratio: 0.75
- Novelty justification: Four concrete stewardship mechanisms are new; the shared ownership drift is refined into a low-coupling test design.
- Questions addressed: maintainability, ownership drift, fork provenance, and safe modularization.
- Questions answered: the maintainability path is a staged extraction plus executable contracts and patch provenance.

## Reflection

- What worked and why: packaging metadata exposed operational fork ambiguity that source-level review alone missed.
- What did not work and why: source size by itself does not identify safe modules; named exported internals and hook boundaries supplied the necessary seams.
- What I would do differently: generate an initial patch ledger from Git history before choosing version suffixes.

## Recommended Next Focus

Challenge all findings, rank them by evidence, impact, effort, and reversibility, and define a dependency-ordered improvement program.
