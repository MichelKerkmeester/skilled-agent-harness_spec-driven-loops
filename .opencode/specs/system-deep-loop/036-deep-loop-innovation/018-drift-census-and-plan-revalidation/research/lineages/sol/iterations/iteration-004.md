# Iteration 004: Provisional Verdict Matrix

## Focus

Reconcile iterations 001-003 with the current purpose of every phase from 003 through 017, producing one explicit provisional verdict per phase while keeping unresolved second-order premise checks visible.

## Verdict Matrix

The comparison head is `e4b242c3940c26b47950534e1a149c7e037e71fd`. A row marked provisional has passed the first-order resolution census but has not yet passed the named second-order capability or authority check. No row is `invalidated`: the available evidence does not show that any phase's core purpose is obsolete or contradicted.

| Phase | Verdict | Confidence | Commit evidence | Current path:line evidence | Smallest unresolved second-order gap |
|---|---|---:|---|---|---|
| 003 | **needs refinement** | High | `cc77a1e550a8dcd45c3b287ac604138987aea94e` renamed the runtime references and benchmark directories; `7f3216fc502420cb8aade4bbb639f9efe78b1ada` renumbered packet 033 to archived packet 027. | The census purpose remains current, but the active spec still names `behavior_benchmark/` at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census/spec.md:92-95`; its authoritative 5/7/8 purpose is at lines 60-65. | Re-run the eight-subsystem and JSONL producer/consumer census against HEAD to detect newly shipped surfaces beyond the confirmed path renames. |
| 004 | **still valid** | High | Verified no-drift comparison at `e4b242c3940c26b47950534e1a149c7e037e71fd`; container renumbers `7f3216fc5024` and `8d3b5b21d571` preserved all relative targets. | The frozen architecture, 178-row ledger, and transition-policy gate remain the declared handoff at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/spec.md:44-68`. | None for the provisional verdict; preserve this phase as the clean negative control unless later premise evidence contradicts it. |
| 005 | **still valid** | High | `e4b242c3940c26b47950534e1a149c7e037e71fd` enabled `cli-opencode` fan-out but left `cli-codex` `exec`-first and did not add the requested policy/compiler contract. | The unshipped typed policy, capability matrix, adapter fingerprint, `--search exec`, and Cartesian manifest remain explicit at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock/spec.md:60-65`. | None material: current schema, command construction, and tests already establish that the exact capability remains unshipped. |
| 006 | **needs refinement** | Medium | Verified no-drift comparison at `e4b242c3940c26b47950534e1a149c7e037e71fd`; `7f3216fc5024` and `8d3b5b21d571` only moved the container, so the malformed research-link depth is a baseline defect rather than post-baseline drift. | The dark ledger and fail-closed transition purpose remains coherent at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/spec.md:52-67`, but line 54 still contains the malformed `../../002-...` reference. | Determine whether any current runtime event envelope, append-only ledger, replay fingerprint, or authorization gateway already satisfies a child contract. |
| 007 | **still valid** (provisional) | Low | Verified first-order no-missing-target comparison at `e4b242c3940c26b47950534e1a149c7e037e71fd`. | The seven cross-mode services and their additive-dark boundary remain explicit at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/spec.md:50-70`. | Audit current runtime modules for already-shipped receipts/effect recovery, sealed artifacts, typed budgets, gauges, fencing, and continuity identities. |
| 008 | **still valid** (provisional) | Low | Verified first-order no-missing-target comparison at `e4b242c3940c26b47950534e1a149c7e037e71fd`. | Compatibility, shadow parity, in-flight classification, and rollback remain the no-cutover bridge at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/spec.md:50-70`. | Check whether current upcasters, projections, parity tooling, or rollback drills already satisfy one or more child purposes. |
| 009 | **still valid** (provisional) | Medium | `e4b242c3940c26b47950534e1a149c7e037e71fd` changed fan-out launch behavior but did not establish canonical ledger dispatch/result contracts. | The phase distinguishes the shipped capped pool from missing canonical receipts, results, and durable orchestration at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/spec.md:50-69`. | Inspect current fan-out state/events for canonical dispatch receipts, resumable result envelopes, branch leases/waves, and durable fan-in semantics. |
| 010 | **still valid** (provisional) | Low | Verified first-order no-missing-target comparison at `e4b242c3940c26b47950534e1a149c7e037e71fd`. | Concept novelty, contradiction/supersession, claim identity, next focus, and transactional projections remain the declared intelligence layer at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/spec.md:50-70`. | Compare current novelty, claim, and projection implementations against all five child contracts rather than assuming string-level dedup remains authoritative. |
| 011 | **still valid** (provisional) | Low | Verified first-order no-missing-target comparison at `e4b242c3940c26b47950534e1a149c7e037e71fd`. | The spec still contrasts council-local thresholds with cross-mode path coverage, cycles, clocks, allocation, and health at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/spec.md:50-68`. | Audit post-baseline convergence and degeneration changes for overlap with path coverage, cycle detection, stopping clocks, and health. |
| 012 | **still valid** (provisional) | Low | Verified first-order no-missing-target comparison at `e4b242c3940c26b47950534e1a149c7e037e71fd`. | The frozen shared interfaces, closures, mixed-version fixtures, and executable write-set graph remain the phase-013 handoff at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/spec.md:50-66`. | Verify whether newly authored phase-013 children already created de facto shared contracts or fixtures that should be hoisted rather than reimplemented. |
| 013 | **needs refinement** | High | Baseline `0ce43ff589` and comparison head `e4b242c3940c26b47950534e1a149c7e037e71fd` both expose seven public modes; `6cd8ab14e4e`, `708d25acf04`, and `908efde8d8f` changed routing semantics, not mode count. | The current parent still calls eight workstreams “modes” while listing shared `deep-improvement-common` at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/spec.md:50-71`. | Check each authored child against current mode contracts; the taxonomy correction itself is resolved: eight workstreams serve seven public modes. |
| 014 | **still valid** (provisional) | Low | Verified first-order no-missing-target comparison at `e4b242c3940c26b47950534e1a149c7e037e71fd`. | The only-authority-moving boundary and its three cutover children remain explicit at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/spec.md:50-68`. | Search current runtime authority selectors and state migration paths for any already-shipped per-mode cutover or certificate semantics. |
| 015 | **still valid** (provisional) | Medium | Verified first-order dependency comparison at `e4b242c3940c26b47950534e1a149c7e037e71fd`; no named dependency was removed by the packet renumbers. | Retirement remains gated on cutover evidence, zero-use telemetry, and archival-reader retention at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/015-legacy-writer-retirement/spec.md:50-72` and lines 116-125. | Determine whether any legacy writer has already been removed or any archival reader contract changed, then reconcile the delete/retain candidate set. |
| 016 | **still valid** (provisional) | Medium | Verified first-order dependency comparison at `e4b242c3940c26b47950534e1a149c7e037e71fd`; packet-033 provenance moved at `7f3216fc5024` while executable benchmark authority remains in active skill surfaces. | The exact-SHA, semantic parity, replay, recovery, health, and strict-validation gate remains defined at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/spec.md:49-69` and lines 151-155. | Refresh benchmark runner/package paths inherited from phase 003 and verify that the current gate inventory covers seven public modes through eight workstreams without conflation. |
| 017 | **still valid** (provisional) | High | Verified comparison head `e4b242c3940c26b47950534e1a149c7e037e71fd`; the post-baseline range itself demonstrates the moving-mainline condition this phase controls. | The clean-worktree integration, touched-contract recensus, reopen, final-SHA gate, and metadata reconciliation purpose is explicit at `.opencode/specs/system-deep-loop/036-deep-loop-innovation/017-integrate-latest-and-closeout/spec.md:48-69`. | At execution time only, identify the actual origin target/final SHA and touched contracts; this runtime fact does not undermine the phase premise. |

## First-Order Drift

- Confirmed positive drift remains confined to phase 003's underscored runtime-reference and benchmark paths after `cc77a1e550a`, plus the packet-033 to archived-packet-027 renumber after `7f3216fc5024`.
- Phase 006 has one real malformed relative link, but history places the defect before baseline; it is refinement work, not a post-baseline drift count.
- Phase 004 remains the clean negative control. Its relative parent, manifest, and child targets survived both packet-container renumbers.
- No genuinely missing current target was established for phases 005 or 007-017 after packet-root shorthand, authored children, and future execution outputs were normalized.

## Second-Order Drift

- Phase 005's exact live-web-search contract remains unshipped despite partial fan-out enablement in `e4b242c3940c`; its premise is still valid.
- Phase 013's “eight modes” wording is false as taxonomy: there are seven public modes, five implementation families, three improvement variants, and eight migration workstreams. The decomposition survives, so refinement rather than invalidation is required.
- Commits `6cd8ab14e4e`, `708d25acf04`, and `908efde8d8f` changed activation, typed leaf-resource routing, and zero-signal default behavior. These semantics must be consumed by migration planning, but they do not remove a phase.
- For phases 006-012 and 014-016, first-order survival is not promoted to second-order proof. Their verdicts remain provisional until the bounded capability or authority checks in the matrix are performed.

## Evidence Gaps

1. **Smallest high-value gap:** inspect the current runtime once for the phase-006 through phase-012 substrate stack, mapping already-shipped event, ledger, receipt, compatibility, fan-in, novelty, and convergence capabilities to child purposes.
2. Inspect current authority-selection, migration, and legacy-writer surfaces for phases 014-015; this determines whether either phase needs scope refinement rather than merely confirming unresolved work.
3. Refresh phase-016 benchmark inputs from active `behavior-benchmark/` paths and test its 7-public-mode/8-workstream language against the corrected taxonomy.
4. Check authored phase-013 children against current shared contracts to avoid implementing phase-012 hoisting after mode-local duplication has already landed.

## Questions Answered

- Every phase 003-017 now has an explicit provisional verdict, post-baseline or comparison commit, and current path:line evidence.
- Phase 004 remains the clean negative control.
- Packet 033 survives as archived packet 027 for provenance while active benchmark execution lives under current skill surfaces.
- No phase meets the invalidation bar; confirmed defects require refinement or bounded second-order follow-up.

## Questions Remaining

- Which phase-006 through phase-012 capabilities have already shipped partially or completely in the current runtime?
- Have any phase-014 authority semantics or phase-015 legacy retirements already landed?
- Does phase 016's executable gate inventory need only path/taxonomy refinement, or broader contract changes?

## Ruled Out/Dead Ends

- Ruled out treating all first-order-clean phases as fully validated; path survival does not prove premise survival.
- Ruled out invalidating phase 013 because of the seven-versus-eight taxonomy defect; its eight-workstream decomposition remains operationally meaningful.
- Ruled out counting phase 006's malformed link as post-baseline drift; the bad depth predates the baseline.
- Ruled out treating planned child artifacts or gate outputs as missing current dependencies.

## Sources Consulted

- Iterations 001-003 and their delta/state records.
- Current phase specifications 003-017.
- Baseline `0ce43ff589` and comparison head `e4b242c3940c26b47950534e1a149c7e037e71fd`.
- Post-baseline commits `cc77a1e550a`, `7f3216fc5024`, `8d3b5b21d571`, `6cd8ab14e4e`, `708d25acf04`, `908efde8d8f`, and `e4b242c3940c`.
- Current mode registry, router, executor configuration, fan-out command builder/tests, active benchmark framework, phase manifest, and phase child trees as cited by iterations 001-003.

## Assessment

`newInfoRatio: 0.46`. The iteration adds the first complete 15-row verdict surface and isolates one bounded second-order gap for every low-confidence row. Novelty is lower than prior iterations because most evidence is reconciled rather than newly discovered, but the matrix closes the phase-coverage gap without overstating premise validity. Convergence remains `CONTINUE`: the ratio trend is `0.90 -> 0.78 -> 0.64 -> 0.46`, and the second-order capability/authority gaps prevent final verdict confidence.

## Recommended Next Focus

Run one cross-cutting current-runtime capability census for phases 006-012, mapping each already-shipped event, ledger, receipt, compatibility, fan-in, novelty, and convergence surface to the corresponding child purpose.
