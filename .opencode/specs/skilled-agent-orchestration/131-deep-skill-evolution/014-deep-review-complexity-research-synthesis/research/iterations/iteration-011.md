# Iteration 011: Stress-test the versioned searchLedger and targetSelection recommendation: required fields, naming, minimal row shape, trivial-review exemptions, and backwards compatibility.

## Focus

Stress-test the proposed `reviewDepthSchemaVersion`, `targetSelection`, `searchLedger`, and `searchCoverage` recommendation before it becomes implementation work. The goal was to find where the recommendation could collapse into checkbox theater, overburden trivial reviews, break legacy packets, or add validation without preserving real search depth.

## Actions Taken

1. Re-read the current synthesis and prior convergence pass, especially the R1/R4/R6 recommendations around `searchLedger`, `targetSelection`, graphless fallback, and validator enforcement.
2. Inspected the live deep-review iteration contract, agent instructions, state-format reference, workflow YAML, validator, reducer, graph-convergence hook, and tests.
3. Compared proposed fields against existing required JSONL fields, fallback/error records, legacy reducer fixtures, graphless behavior, and dashboard persistence.
4. Reduced the recommendation to a stricter minimal schema and a rollout split between hard errors, warnings, and explicit exemptions.

## Findings

1. **P1 - A version field alone will not prevent checkbox theater; enforcement must be versioned too.** The current validator's review field set is only `type`, iteration identity, severity summaries, `findingDetails`, ratio, lineage, and timing, with no search-depth fields [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:112]. It then validates `findingDetails` only as an array and `newFindingsRatio` only as a number [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:390]. The synthesis is right to recommend `reviewDepthSchemaVersion`, `targetSelection`, `searchLedger`, and `searchCoverage` [SOURCE: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md:91], but the required addition is a versioned enforcement profile: v1/legacy records are readable with warnings; v2 `complete` standard/complex review records fail when the ledger is absent, uncited, or unsupported.

2. **P1 - The existing prompt/state contract already has drift, so ledger rollout must first fix shape ambiguity.** The prompt-pack example emits `"findingsNew":[]` [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:81], while the state-format reference requires `findingsNew` to be an object with `P0`, `P1`, and `P2` counts [SOURCE: .opencode/skills/deep-review/references/state_format.md:218]. The reference validation rule repeats the object-key requirement [SOURCE: .opencode/skills/deep-review/references/state_format.md:451], but post-dispatch validation currently does not verify the severity-count object shape. Adding `searchLedger` on top of that without normalizing `findingsNew` first risks a v2 schema where the new field is strict and an older required field remains permissive.

3. **P1 - `targetSelection` must prove narrowing, not duplicate scope discovery.** The workflow already resolves a review target into all discovered files or cross-references by target type [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:227], and the strategy template already has a "Files Under Review" table populated from scope discovery [SOURCE: .opencode/skills/deep-review/assets/deep_review_strategy.md:134]. The missing proof is per-iteration selection: which subset was selected, why it outranked omitted high-risk targets, and which discovery methods were used. Minimal `targetSelection` should require `selectedTargets[]`, `selectionReason`, `discoveryMethods[]`, `omittedHighRiskTargets[]`, `graphStatus`, `semanticSearchStatus`, and `evidenceRefs`. Without those fields, a review can point at the full scope and still not show why it searched the highest-risk path.

4. **P1 - The recommended row-field list is directionally right but too heavy if every field is mandatory on every row.** The synthesis lists `dimension`, `bugClass`, `invariant`, `producer`, `consumer`, `negativeTestSearched`, `evidenceRefs`, `disposition`, `linkedFindingId`, and `ruledOutReason` [SOURCE: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md:93]. Make the mandatory minimal row shape: `id`, `dimension`, `targetRefs`, `bugClass`, `hypothesis` or `invariant`, `searchActions[]`, `evidenceRefs[]`, `disposition`, and `rationale`. Then conditionally require `linkedFindingId` for `disposition:"finding"`, `ruledOutReason` for `ruled_out`, `blockedReason` for `blocked`, `deferredReason` for `deferred`, and `notApplicableReason` for `not_applicable`. `producer`, `consumer`, and `negativeTestSearched` should be hard-required only for bug classes where they make sense, otherwise they become boilerplate.

5. **P1 - Trivial-review and error-record exemptions need first-class state, not prose.** The current missing-output fallback appends an `error` iteration with empty arrays and zero counts [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:934]. Existing reducer tests also use legacy iteration records without `findingDetails` even though the current contract requires it [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:119]. If v2 validation blindly requires ledgers, the workflow can fail its own fallback rows and old fixtures. Add `reviewDepthApplicability`: `{ "scopeClass": "trivial|standard|complex", "enforcement": "none|warn|error", "reason": "...", "evidenceRefs": [...] }`. Hard enforcement applies to v2 `status:"complete"` standard/complex records; `error`, `timeout`, `stuck`, and legacy unversioned records should be warn-only or exempt.

6. **P1 - Graphless runs need an explicit fallback, because current graph behavior silently omits the graph gate.** The convergence reference says that when `graphEvents` are absent, the graph evidence sub-check is omitted [SOURCE: .opencode/skills/deep-review/references/convergence.md:677]. The workflow also skips graph upsert when the latest iteration has no `graphEvents` [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:980]. That is acceptable only if `targetSelection.discoveryMethods` and `searchLedger.searchActions` prove equivalent direct coverage through reads, exact searches, resource-map checks, or semantic search. Otherwise "graph unavailable" remains a free pass.

7. **P2 - Reducer/dashboard/report persistence must ship with validation or the ledger becomes invisible debt.** The reducer registry currently returns findings, dimension coverage, graph convergence, blocked stops, and severity buckets, but no candidate coverage or search-debt state [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:903]. The dashboard progress table renders dimension, ratio, severity counts, and status [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1082], while active risks focus on errors, active severities, claim adjudication, and blocked stops [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1217]. A valid ledger should flow into `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, and a dashboard/report Search Ledger section; otherwise validation can pass while operators never see shallow clean-search debt.

8. **P2 - The seeded tests should fail the present shallow workflow, not only assert new fields exist.** Current validator tests prove appended JSONL fields, missing file behavior, missing field behavior, executor provenance, and dispatch-failure handling [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts:33]. The reducer-schema tests mostly assert workflow wiring and documentation/report markers [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:64]. Add tests where a review with zero findings and complete dimensions fails because it has no ledger rows; a bogus ledger row fails because `evidenceRefs` are empty; a `finding` row fails if `linkedFindingId` does not match `findingDetails`; a graphless run passes only with direct-search fallback rows; and a trivial one-file review passes only when `reviewDepthApplicability` documents the exemption.

## Questions Answered

- **Which recommendation is likely to become checkbox theater unless constrained more tightly?** The ledger itself. It prevents shallow reviews only if rows require a hypothesis/search action/evidence/disposition chain and if clean results count only when supported by cited null-search evidence.
- **What minimal schema proves real bug-search depth without overburdening trivial reviews?** Top-level `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchLedger`, and `searchCoverage`; row-level `id`, `dimension`, `targetRefs`, `bugClass`, `hypothesis` or `invariant`, `searchActions`, `evidenceRefs`, `disposition`, and conditional disposition-specific fields.
- **Which validator checks should be hard errors versus warnings during rollout?** Hard errors for malformed v2 standard/complex complete records, wrong `findingsNew` shape, absent `targetSelection`, missing/non-array `searchLedger`, invalid disposition, empty evidence refs, and broken `linkedFindingId`. Warnings for legacy unversioned records, `candidateMatrix` alias use during one migration version, missing graph data with a valid graphless fallback, and optional producer/consumer fields outside applicable bug classes.
- **How should graphless runs prove equivalent search coverage?** Through `targetSelection.discoveryMethods` and `searchLedger.searchActions` that cite direct reads, exact searches, semantic search status, resource-map checks, tests inspected, and omitted high-risk targets.
- **What seeded tests would fail on the current shallow workflow and pass after implementation?** A no-finding clean PASS without ledger rows; an uncited ruled-out row; a finding row with no linked `findingDetails`; a graphless clean run without fallback searches; and a trivial exemption lacking evidence.

## Questions Remaining

- What exact `scopeClass` thresholds define trivial versus standard versus complex: file count, changed LOC, target type, security sensitivity, resource-map presence, or a combined risk score?
- Should `producer`/`consumer` be top-level row fields or nested under `searchActions` for data-flow bug classes only?
- Should `searchCoverage.uncoveredBugClasses` block STOP immediately in v2, or start as dashboard/report debt until seeded tests calibrate false positives?
- Should `candidateMatrix` be accepted for exactly one version as an alias, or should migration normalize it to `searchLedger` before validation?

## Ruled Out

- **Ruled out: require every proposed row field for every review.** That overburdens trivial reviews and invites dummy `producer:"n/a"` fields. Conditional requirements are stricter where they matter.
- **Ruled out: make graphEvents mandatory as the proof of depth.** Current convergence intentionally omits graph checks when no graph events exist [SOURCE: .opencode/skills/deep-review/references/convergence.md:677], and graph node vocabulary is still too narrow for bug classes.
- **Ruled out: rely on a final report Search Ledger section without reducer-owned state.** Reports can only expose durable depth if iteration records and the reducer preserve the rows first.

## Dead Ends

- Searching for existing `searchLedger`, `targetSelection`, or `reviewDepthSchemaVersion` support found recommendation text and no live implementation path. That confirms this is a follow-up design/implementation packet rather than a hidden existing feature.
- Treating `Files Under Review` as `targetSelection` did not hold. It records scope coverage, not per-iteration risk-ranked selection.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/iterations/iteration-010.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/deltas/iter-010.jsonl`
- `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`
- `.opencode/skills/deep-review/references/state_format.md`
- `.opencode/skills/deep-review/references/convergence.md`
- `.opencode/skills/deep-review/assets/review_mode_contract.yaml`
- `.opencode/skills/deep-review/assets/deep_review_strategy.md`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts`

## Reflection

The synthesis recommendation is stable, but its first implementation draft should be narrower than the prose sounds. The dangerous version is "add a ledger field and require at least one row." The useful version is "make absence-of-finding claims auditable": why this target, what hypothesis, what was searched, what evidence supports the disposition, and what remains uncovered. That can be strict without being bloated if the schema uses conditional requirements and explicit trivial/error exemptions.

## Recommended Next Focus

Define the v2 `searchLedger`/`targetSelection` schema and validator rollout contract as an implementation-ready spec: exact JSON shapes, disposition enum, `reviewDepthApplicability`, legacy/warn/error behavior, and the first validator/reducer/prompt-pack tests.
