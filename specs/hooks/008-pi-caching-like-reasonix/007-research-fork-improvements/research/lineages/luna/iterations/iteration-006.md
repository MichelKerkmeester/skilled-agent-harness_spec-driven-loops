# Iteration 006 — Maintainability and integration boundaries

## Focus

Assess the smallest maintainable seams for ownership, lifecycle state, provider adapters, persistence, tests, and vendored-fork provenance.

## Actions Taken

- Compared the optimizer's single-file surface with DeepPi's modular extension layout.
- Traced where each fork declares ownership, resets state, builds reports, and exports test internals.
- Read package manifests, vendoring summaries, and provenance limitations from the sibling packets.
- Checked for stale naming and a repeatable source-drift guard.

## Findings

### F-022 — The optimizer's 8,390-line entry module couples unrelated contracts

`pi-cache-optimizer/index.ts` contains prompt rewriting, dozens of provider adapters, usage normalization, ownership guards, persistence migration, routing protocols, diagnostics, commands, and lifecycle hooks. Its test-only export also exposes a very large mixed helper surface. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1-115,2613-2640,6468-6705,7279-8386] [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:18-35]

Improvement opportunity: extract only the highest-churn seams first—provider adapter definitions/normalizers, persisted stats codec, and lifecycle accounting—behind small typed interfaces. Keep prompt transformation and router protocols separate. This reduces the chance that a pricing, persistence, or ownership change silently changes prompt behavior without requiring a risky full rewrite.

### F-023 — DeepPi's modular modules still rely on manual root-level state wiring

DeepPi has focused modules for eligibility, stability, storm-breaking, hashline edits, telemetry, and utilities, but the root entrypoint owns the reset list and manually selects which fields enter `/deeppi`. Adding a new counter requires edits in the module, session reset, report input, formatter, and likely tests; the current omission of `errorsEnhanced`, `prunedThinking`, and `preservedThinking` demonstrates the failure mode. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:1-7,42-80] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/stability.ts:140-155] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/stormbreaker.ts:25-52]

Improvement opportunity: give each subsystem a small `reset()` and `snapshot()` contract, then compose a report snapshot in one place. Keep runtime ownership in the modules, but make reset/report completeness mechanically visible through a typed aggregate rather than a growing hand-maintained parameter list.

### F-024 — Ownership is duplicated without a maintained contract artifact

DeepPi exports `DEEPPI_MODEL_IDS` and derives eligibility from it, while the optimizer repeats the two literal IDs in `isDeepPiOwned`. The sibling packet explicitly records that this ownership boundary was patched across six hooks and that the vendored copy is operational, but there is no generated contract or cross-package test that forces future edits to update both sides. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-17] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1275-1281,7279-7304,7540-7542] [SOURCE: specs/hooks/008-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:100-108]

Improvement opportunity: make the ownership matrix a first-class local artifact with exact provider/model IDs, owner, excluded hooks, and negative provider aliases. Test both extensions against it in the combined-host fixture from F-012. A small duplicated predicate is acceptable; silent drift is not.

### F-025 — Vendored fork provenance and synchronization are manual

The optimizer sibling packet records two byte-identical copies with no automatic synchronization, and says future upstream fixes must be manually diffed and reapplied. DeepPi's vendoring summary likewise records a byte-for-byte copy from its patched fork. The package manifests still point at their original repositories, so provenance and operational source are separate facts that can drift. [SOURCE: specs/hooks/008-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:137-143] [SOURCE: specs/hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/002-vendor-and-repoint/implementation-summary.md:48-65] [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:45-47] [SOURCE: .pi/extensions/deep-pi/package.json:7-14]

Improvement opportunity: record upstream repository, source commit, local patch purpose, and operational vendored path in one provenance file or package metadata block. Add a read-only drift check that compares the vendored tree with the recorded source snapshot when available; keep the local copy authoritative and require an intentional update review.

## Questions Answered

- Which maintainability boundaries should be shared, simplified, or documented across the forks? Answered: share the ownership/metric/report contracts and test fixtures; keep provider-specific transforms, routing protocols, and persistence implementations separate.
- Which implementation order gives the highest correctness reduction per unit of work? Partially answered: ownership matrix and lifecycle tests precede extraction; report/economics schema follows; broad optimizer modularization is later.

## Questions Remaining

- Which prior findings are already covered by sibling packet acceptance evidence versus still needing new tests?
- What final priority order balances correctness, observability, economics, and maintenance cost?

## Ruled Out Directions

- A full optimizer rewrite is ruled out as the first step; the evidence supports extracting narrow seams and adding lifecycle/contract tests before changing architecture. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1-115,7279-7643]
- Merging DeepPi and the optimizer into one implementation is ruled out; their provider scopes, prompt transforms, retry controls, and persistence contracts differ. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:1-80] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2613-2640]

## Next Focus

Final iteration: reconcile sibling acceptance evidence, classify findings by priority and confidence, and close remaining open questions without synthesizing until iteration 7 is complete.

## Scope Violations

None. Only lineage research artifacts were written.
