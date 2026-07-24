# Iteration 10: Executor delegation branch coverage

## Focus

Quantify how many frozen executor-delegation cases take the injection path versus the existing-candidate path, select the explicit executor-ambiguity contract, and place the result in the advisor improvement order.

## Actions Taken

1. Read the append-only state, reducer-owned strategy, and iteration 9 evidence to preserve the active focus and avoid ruled-out directions.
2. Traced the frozen executor fixture, the metadata-derived resolver, and both branches of the post-fusion override.
3. Loaded the TypeScript scorer directly from source and classified every fixture row from final recommendation provenance: a synthetic executor has zero lane contributions and the dedicated synthesis reason; an existing candidate preserves fused lane contributions.
4. Ran the checked-in executor-delegation Vitest file to verify routing expectations and TS/Python parity against the current repository state.

## Findings

### 1. The intended positive fixture has an 8:0 injection-to-existing split

The frozen fixture contains eleven rows: eight positive executor routes, two negative-guard rows, and one intended suppressed-abstain row. All eight positive routes took injection-if-absent; none promoted an executor that already existed in the fused candidates. The source-loaded probe identified every routed top by zero lane contributions plus the synthesis-only reason, matching the branch implemented when `executorRec === null`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json:4-70] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:411-432] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:467-498]

This means the existing-candidate branch at lines 470-477 has zero end-to-end fixture coverage. The fixture description says it covers every resolver branch, but it covers detector branches, not both override application paths. A regression suite can remain green while existing-candidate threshold, ordering, and stale-attribution behavior changes. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json:2-3] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts:177-228]

### 2. Seven of eight intended route cases reproduce the ambiguity mismatch

Seven injected route cases returned `ambiguous: true` while the synthetic leading executor had no `ambiguousWith`; only `direct-alias-model-kimi-slug` returned `ambiguous: false`. The mismatch therefore affects 87.5% of intended positive fixture routes under the frozen native environment, not only the two orchestrator-cue examples. [SOURCE: source-loaded Node 22 TypeScript probe over executor-delegation-cases.json, 2026-07-16] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:839-868]

The breadth follows directly from synthesis: the executor inherits the pre-override maximum score, so it often score-ties the displaced fusion leader. Because ambiguity is recomputed after override while attribution is not, the injected executor becomes an unannotated member of a final ambiguous pair. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:420-428] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:843-868]

### 3. Current execution is 9:0 because the frozen Codex abstain row is stale

The hub now registers `cli-codex` as an active workflow executor and declares `delegate to codex` as an alias. Active aliases are checked before suppressed archive aliases, so the fixture's `suppressed-codex-abstain` prompt now routes to active `cli-codex`. On current repository state the eleven rows therefore execute as nine injections, zero existing-candidate promotions, and two negative-guard no-ops. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:27-64] [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:26-49] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:370-389]

The targeted test run confirmed three failures: the pure detector expected abstention, native top-1 expected `none`, and TS/Python parity expected `none`; both scorers returned `cli-codex`. The run had a `better-sqlite3` Node ABI mismatch and deliberately degraded to the filesystem projection, but that fallback is the path both the source probe and test exercised, and the failure is consistent with the checked-in hub metadata. [SOURCE: npm test -- --run tests/scorer/executor-delegation.vitest.ts --reporter=verbose, 2026-07-16] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts:165-170] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts:190-228]

### 4. A singly resolved executor should suppress public fusion ambiguity

The explicit contract should be: when the resolver returns one authoritative `route` decision, the public result is unambiguous, the selected executor is top-1, and final `ambiguousWith` attribution is empty. This follows the module's stated purpose to force the executor to the top and its constant-level requirement that the route sit clearly above the capped code hub as the “unambiguous top.” [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:5-22] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:34-48]

Fusion ambiguity remains useful when the resolver returns no decision. Multiple explicit executors or contradictory dispatch intent should be rejected or deferred by executor-resolution policy before this suppression applies; a single resolved alias should not expose displaced task-skill competition as route ambiguity. The implementation follow-up should make executor decision metadata available to one finalization boundary, clear stale attribution after any override, recompute threshold eligibility, and derive the result boolean from that final policy.

### 5. This moves output coherence ahead of calibration tuning

The immediate order within the existing improvement plan is:

1. Repair the stale Codex fixture or replace it with a genuinely retired executor alias so the targeted suite becomes green again.
2. Add explicit fixture coverage for both override application paths, with branch identity or provenance asserted rather than inferred only from top-1.
3. Enforce the resolved-executor ambiguity contract and final derived-field coherence in the same regression suite.
4. Continue the previously ranked transport-budget, diagnostic, vocabulary, and threshold-parity work.
5. Keep the shadow `0.80` floor and probability-calibration bins behind fresh joined evidence.

This is a correctness change, not numeric calibration: changing the `0.05` margin cannot repair two fields derived from different ranking snapshots.

## Questions Answered

- Intended frozen distribution: eight injection cases, zero existing-candidate cases, two negative-guard no-ops, and one intended abstain.
- Current repository distribution: nine injections, zero existing-candidate cases, and two negative-guard no-ops because `cli-codex` was revived.
- Seven of the eight intended positive routes reproduce result/local ambiguity incoherence.
- Contract selected: one authoritative executor route suppresses public fusion ambiguity after final threshold and attribution recomputation.

## Questions Remaining

- Add one deliberately constructed existing-candidate fixture and determine whether a natural production prompt can reach it without a seeded projection.
- Replace the obsolete Codex abstain example with a currently retired executor identity, if one remains part of the supported metadata contract.
- Run the separate shadow `0.80` task-intent floor experiment with reliability bins in an authorized implementation packet.

## Next Focus

The loop has reached iteration 10. Synthesis should convert the evidence into the final prioritized advisor improvement plan, with the red executor fixture and 8:0 branch-coverage gap treated as immediate correctness work.

## Ruled-Out Directions

- Counting detector branches as override-path coverage: detector labels do not reveal whether the resolved executor existed in the fused candidate list.
- Treating `laneContributions.length === 0` alone as universal proof: the classification was paired with the synthesis-only reason and the exact branch source.
- Changing ambiguity margins: the inconsistency is caused by post-attribution mutation, and seven mismatches persist under the frozen defaults.

## Assessment

- `newInfoRatio`: 0.81
- Novelty justification: the iteration quantified the unmeasured 8:0 branch split, established a 7/8 incoherence rate, and found active-metadata drift that makes the targeted parity suite red.
- Confidence: high for counts and mismatch rate from source execution plus targeted tests; high for suppression as the intended single-resolver contract from explicit source comments.

