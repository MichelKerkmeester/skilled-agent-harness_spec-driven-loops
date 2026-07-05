# Iteration 015: Final continuation convergence: refine implementation order, seeded behavior tests, rollout thresholds, residual risks, and exact follow-up acceptance criteria across all recommendations.

## Focus

Final convergence pass over the continuation findings. The goal was not to add a new recommendation category; it was to make the existing `searchLedger`, `targetSelection`, validator, reducer/dashboard/report, graph/convergence, seeded-test, rollout-threshold, and sequencing recommendations implementation-ready enough that the follow-up packet cannot drift into checkbox theater.

## Actions Taken

1. Re-read the current synthesis recommendation list and implementation order.
2. Re-read iterations 011-014 to preserve the tightened ledger schema, validator rollout profile, reducer survivability requirement, and ledger-led graph sequencing.
3. Re-inspected current source for prompt contract, state schema, post-dispatch validation, reducer/dashboard persistence, workflow convergence, graph upsert/convergence, and active tests.
4. Reduced the follow-up work into staged implementation gates, seeded behavior tests, rollout thresholds, residual risks, and acceptance criteria.

## Findings

### F015-001: The synthesis order is directionally right, but seeded tests must move from a late step to a gate on every slice

The synthesis currently lists seeded behavior tests after schema, validation, reducer/report, candidate-saturation blockers, and graph vocabulary work [SOURCE: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md:166] [SOURCE: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md:171]. That order is risky because the live validator tests still prove dispatch mechanics, missing fields, executor provenance, malformed JSONL, and optional code verification rather than review-depth semantics [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts:33] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts:116] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts:139].

Refined implementation order: write failing seeded fixtures before each production slice, not after all slices. Validator fixtures should fail first; reducer/dashboard fixtures should fail before persistence work; convergence fixtures should fail before gates; graph fixtures should fail before vocabulary expansion. The final step should be manual playbook coverage, not the first proof that behavior changed.

Acceptance criterion: every stage has at least one fixture that fails against today's shallow workflow and passes only when that stage's semantics are wired through its owner.

### F015-002: The recommendation most likely to become checkbox theater is the ledger unless `searchCoverage` defines obligations, not just rows

The synthesis names the right fields for a versioned ledger and row-level evidence [SOURCE: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md:91] [SOURCE: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md:93]. The current prompt/state contract, however, has no `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchLedger`, or `searchCoverage`; the prompt only requires the old iteration record shape [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:78] [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:81].

The tight version is: `searchCoverage.requiredBugClasses[]` states the candidate obligations for the iteration, and each obligation must be satisfied by one or more `searchLedger[]` rows with cited search actions and a disposition. Without that coverage map, agents can emit one plausible ledger row and leave the highest-risk bug class unsearched.

Acceptance criterion: a v2 standard/complex clean iteration fails if any required bug class, invariant target, negative-test target, or selected high-risk target is absent from `searchCoverage.covered[]`, `searchCoverage.ruledOut[]`, `searchCoverage.deferred[]`, or `searchCoverage.blocked[]` with cited ledger row IDs.

### F015-003: The minimal schema should be small but relational

The current state-format reference already requires severity-count objects and rich `findingDetails` [SOURCE: .opencode/skills/deep-review/references/state_format.md:217] [SOURCE: .opencode/skills/deep-review/references/state_format.md:219], but the validator only checks `findingDetails` is an array and `newFindingsRatio` is numeric [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:390] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:397]. The follow-up should avoid a huge always-required schema, but it must require relationships that prove search depth.

Minimal v2 top-level fields:

- `reviewDepthSchemaVersion: 2`
- `reviewDepthApplicability: { scopeClass, enforcement, reason, evidenceRefs }`
- `targetSelection: { selectedTargets, selectionReason, discoveryMethods, omittedHighRiskTargets, graphStatus, semanticSearchStatus, evidenceRefs }`
- `searchCoverage: { requiredBugClasses, covered, ruledOut, deferred, blocked, graphCoverageMode }`
- `searchLedger[]`

Minimal ledger row fields:

- `id`, `dimension`, `targetRefs`, `bugClass`
- `hypothesis` or `invariant`
- `searchActions[]`, each with `method`, `queryOrPath`, `result`, and `evidenceRefs[]`
- `disposition`, `rationale`, and disposition-specific linkage: `linkedFindingId`, `ruledOutReason`, `deferredReason`, `blockedReason`, or `notApplicableReason`

Acceptance criterion: active finding rows must link to rich `findingDetails`; clean rows must cite the search evidence that supports absence of a finding; deferred/blocked rows must become `searchDebt`.

### F015-004: Rollout needs a warning surface before hard enforcement expands

The current validator result type can only return `{ ok: true }` or `{ ok: false, reason, details }` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:60] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:64]. The workflow likewise treats post-dispatch validation as a list of failure reasons that emit schema conflicts [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:881] [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:889].

That is too binary for migration. Add `warnings` or typed advisory events first, then use a three-phase rollout:

- Phase A: warn on legacy/unversioned rows missing ledger fields; hard-fail only internal inconsistency such as malformed JSONL, wrong canonical type, wrong `findingsNew` shape in explicit v2 records, or delta/state identity mismatch.
- Phase B: hard-fail v2 `status:"complete"` standard/complex rows missing `targetSelection`, `searchCoverage`, cited `searchLedger`, valid dispositions, and rich linked `findingDetails`.
- Phase C: wire search debt into legal-stop gates and verdict posture; hard-fail or block STOP for v2 reviews whose required candidate coverage is unresolved.

Acceptance criterion: old packets remain readable with warnings; newly versioned complete standard/complex records cannot pass with uncited, unlinked, or obligation-free ledger rows.

### F015-005: Graphless equivalence must be explicit because empty graph currently yields neither proof nor blocker

The live workflow calls graph convergence before the inline vote and says final STOP is legal only when graph convergence returns `STOP_ALLOWED` [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:418] [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:461]. The graph handler returns `CONTINUE` when the graph has zero nodes, with no blockers [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:168] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:171]. Separately, graph upsert currently accepts only `DIMENSION`, `FILE`, `FINDING`, `EVIDENCE`, and `REMEDIATION` review nodes [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:137].

The follow-up should add `searchCoverage.graphCoverageMode` with values such as `graph`, `graphless_fallback`, and `unavailable_blocked`. `graphless_fallback` is valid only when direct reads, exact searches, semantic-search/code-graph status, producer/consumer traces, and negative-test searches are cited in ledger rows. Otherwise the STOP blocker should be named `graphlessFallbackGate` or `candidateCoverageGate`, not a generic graph `CONTINUE`.

Acceptance criterion: a graphless v2 standard/complex review can stop only when text/JSON fallback coverage satisfies the same candidate obligations, and a missing fallback produces a `blocked_stop` event with a named candidate/search gate.

### F015-006: Search debt must affect dashboard/report posture, otherwise a clean PASS can still hide shallow review

The reducer registry currently returns findings, blocked-stop history, dimension coverage, severity buckets, convergence scores, and graph blockers, but no candidate coverage or search debt fields [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:903] [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:921]. Dashboard verdict is still derived from active severity counts only [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1074], and the Active Risks fallback says there are no active risks when there are no errors, active severities, claim-adjudication failures, blocked stops, or P2 advisories [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1215] [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1258].

The report and dashboard must show search debt as first-class state before v2 enforcement is considered complete. A no-finding PASS with unresolved required search coverage should become `CONDITIONAL` or `PASS hasSearchDebt=true` during rollout, then tighten to STOP_BLOCKED for Phase C standard/complex reviews.

Acceptance criterion: reducer output includes `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage`; dashboard shows Search Ledger/Search Debt next to severity debt; final report includes a Search Ledger section before appendices.

### F015-007: Graph vocabulary belongs after ledger semantics, but its acceptance criteria must be exact now

The workflow currently filters review graph events to the existing five node kinds and eight relations, discarding unknown graph events rather than failing the iteration [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:981] [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:985]. The graph upsert handler also validates node kind and relation against the loop type allow-lists [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:53] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:57].

So graph vocabulary should remain after ledger/reducer/convergence work, as the synthesis says [SOURCE: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md:127] [SOURCE: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md:170]. But the acceptance criteria should be decided up front: new `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` nodes must survive prompt rendering, workflow transform, MCP upsert validation, convergence signal computation, and tests.

Acceptance criterion: emitting a valid candidate graph event creates persisted nodes/edges and changes candidate convergence signals; emitting an unknown candidate graph event is either a validator warning during rollout or a hard error after the graph schema version is enabled.

## Questions Answered

- Which recommendation is likely to become checkbox theater unless constrained more tightly?
  The ledger, followed by graph vocabulary. The ledger becomes theater if it only requires rows; graph vocabulary becomes theater if new node names are requested before the workflow and MCP schema can persist them.

- What minimal schema proves real bug-search depth without overburdening trivial reviews?
  A relational v2 schema: `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger[]`. Trivial reviews can declare `scopeClass:"trivial"` with cited scope proof. Standard/complex reviews need required candidate obligations and rows that cite searches, link findings, or record explicit ruled-out/deferred/blocked dispositions.

- Which validator checks should be hard errors versus warnings during rollout?
  Hard errors: malformed v2 severity-count shapes, absent target selection, missing/empty ledger for complete standard/complex rows, uncited search actions, invalid dispositions, broken `linkedFindingId`, shallow active `findingDetails`, and state/delta identity mismatch. Warnings: legacy unversioned packets, temporary alias fields, graphless runs with valid fallback proof, and explicit trivial/non-complete exemptions.

- How should graphless runs prove equivalent search coverage?
  Through `graphCoverageMode:"graphless_fallback"` plus cited direct reads, exact searches, semantic-search or code-graph status, producer/consumer trace evidence, inspected negative tests, and ledger rows covering every required candidate obligation.

- What seeded tests would fail on the current shallow workflow and pass after the follow-up implementation?
  A v2 clean standard review with no ledger should fail validation; an uncited `ruled_out` row should fail; a `finding` row without a matching rich `findingDetails` item should fail; a graphless clean run without fallback rows should block STOP; a reducer fixture with deferred search debt should surface Search Debt in dashboard/report; and a candidate graph event using `BUG_CLASS` should persist after graph vocabulary is enabled.

## Questions Remaining

- Exact `scopeClass` thresholds still need implementation-packet calibration. Suggested starting point: `trivial` means one or two low-risk files, no security/persistence/public-schema surface, no resource-map gap, and no prior active P0/P1; everything else is standard or complex.
- Whether unresolved search debt should immediately downgrade PASS to CONDITIONAL in Phase B or only set `hasSearchDebt=true` until Phase C.
- The default candidate taxonomy for standard reviews needs a small initial set: state mutation, boundary validation, producer/consumer drift, negative-test gap, traceability mismatch, and security-sensitive path when applicable.

## Ruled Out

- Ruled out "add the ledger field, then test at the end." That lets schema work merge before behavior proves shallow PASS is impossible.
- Ruled out graph vocabulary before ledger semantics. Current workflow and MCP validation would drop or reject the candidate node kinds.
- Ruled out treating max-iterations synthesis as a clean PASS when candidate gates remain unsatisfied. Max iterations may stop dispatch, but report posture should carry unresolved search debt.
- Ruled out making every producer/consumer/negative-test field mandatory for every row. Applicability and bug class should decide which subfields are hard requirements.

## Dead Ends

- Searching for existing live `searchLedger` or candidate graph support led back to recommendation text rather than implementation surfaces.
- Treating current `filesReviewed` or strategy scope discovery as equivalent to `targetSelection` did not hold. They show what could be reviewed, not why this iteration selected the riskiest targets.
- Treating empty graph `CONTINUE` as a valid graphless fallback did not hold. It has no accepted fallback proof and no actionable blocker.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/iterations/iteration-011.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/iterations/iteration-012.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/iterations/iteration-013.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/iterations/iteration-014.md`
- `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`
- `.opencode/skills/deep-review/references/state_format.md`
- `.opencode/skills/deep-review/references/convergence.md`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts`

## Reflection

The recommendation set has converged. The remaining risk is not diagnosis; it is implementation posture. The follow-up should treat "less surface-level" as an enforceable chain: prompt asks for candidate search, validator rejects fake rows, reducer preserves rows, dashboard/report expose search debt, convergence blocks shallow STOP, and graph vocabulary mirrors the ledger only after that chain exists.

The cleanest acceptance sentence is: a standard or complex deep-review run may claim no findings only after it can show what risky targets were selected, which bug classes were searched, what evidence supports each clean or finding disposition, and what search debt remains.

## Recommended Next Focus

Open a follow-up implementation packet for `deep-review` review-depth v2. Start with failing seeded validator and reducer fixtures, add the v2 schema/prompt contract, implement warn-capable validation, persist search coverage in reducer/dashboard/report, then add candidate STOP gates and graph vocabulary in separate gated slices.
