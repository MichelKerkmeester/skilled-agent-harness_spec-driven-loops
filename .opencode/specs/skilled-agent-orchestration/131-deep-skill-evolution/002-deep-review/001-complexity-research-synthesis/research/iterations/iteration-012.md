# Iteration 012: Stress-test post-dispatch validation: what must fail, warn, or pass for findingsNew, findingDetails, searchLedger rows, evidenceRefs, dispositions, and versioned enforcement.

## Focus

Stress-test the post-dispatch validation recommendation as an enforcement design, not just a schema wish list. The specific question was what a validator must fail, warn, or pass for `findingsNew`, `findingDetails`, `searchLedger` rows, `evidenceRefs`, dispositions, graphless fallback proof, and versioned rollout.

## Actions Taken

1. Re-read the synthesis recommendations for `searchLedger`, `targetSelection`, validator enforcement, reducer persistence, graph gates, and seeded tests.
2. Re-read the iteration 011 stress test to carry forward the tightened minimal schema, trivial-review exemptions, and graphless fallback constraints.
3. Inspected the live post-dispatch validator, deep-review workflow YAML, prompt pack, state-format reference, review agent contract, reducer surfaces, and validator tests.
4. Classified future validator behavior into hard errors, rollout warnings, and valid pass cases.

## Findings

1. **P1 - Warn-only rollout cannot be represented cleanly by the current validator result type.** The validator result is either `{ ok: true }` or `{ ok: false, reason, details }`, with a fixed failure reason union and no warnings payload [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:60] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:64]. The workflow's post-dispatch step also models validation as failure reasons that emit `schema_mismatch` conflict events [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:881] [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:889]. That means the recommended legacy warn-only policy needs a first-class warning surface, such as `ok: true, warnings: [...]` or typed advisory events. Otherwise implementers will either fail legacy packets too aggressively or silently ignore migration debt.

2. **P1 - `findingsNew` shape drift should become a hard error for versioned complete review records.** The deep-review prompt example still emits `"findingsNew":[]` [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:81], while the state-format reference defines `findingsNew` as a severity-count object with `P0`, `P1`, and `P2` keys [SOURCE: .opencode/skills/deep-review/references/state_format.md:217] [SOURCE: .opencode/skills/deep-review/references/state_format.md:451]. The live validator builds required-field presence but only type-checks `filesReviewed`, `dimensions`, `findingDetails`, and `newFindingsRatio` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:358] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:376]. For `reviewDepthSchemaVersion >= 2`, complete standard/complex records should fail when `findingsNew` or `findingsSummary` is not an object with finite numeric `P0`, `P1`, and `P2`; legacy records should warn.

3. **P1 - `findingDetails` validation must become item-level, but only for active or linked findings.** The validator currently accepts any array for `findingDetails` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:390]. The review agent and state reference require each active finding to carry id, severity, title, dimension, file or file:line, evidence, recommendation, disposition, `findingClass`, `scopeProof`, and `affectedSurfaceHints` [SOURCE: .opencode/agents/deep-review.md:181] [SOURCE: .opencode/agents/deep-review.md:213] [SOURCE: .opencode/skills/deep-review/references/state_format.md:219]. The hard error should trigger when severity counts or `searchLedger` finding rows claim active findings but details are missing, shallow, or unlinked. Empty `findingDetails` should pass for clean, error, timeout, and stuck iterations only when counts and ledger dispositions agree.

4. **P1 - `searchLedger` validation must reject checkbox rows, not merely require the field.** The current review required-field set does not include `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchLedger`, or `searchCoverage` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:112]. The workflow's asserted JSONL fields mirror the old shape [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:881] [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:885]. For versioned standard/complex complete records, the validator should fail rows missing `id`, `dimension`, `targetRefs`, `bugClass`, `hypothesis` or `invariant`, `searchActions`, non-empty `evidenceRefs`, supported `disposition`, and `rationale`. It should also fail disposition-specific gaps: `finding` without a matching `linkedFindingId`, `ruled_out` without `ruledOutReason`, `blocked` without `blockedReason`, `deferred` without `deferredReason`, and `not_applicable` without `notApplicableReason`.

5. **P1 - State-log and delta-file drift should fail, because the reducer reads both streams.** The deep-research prompt says the per-iteration delta file should contain the same iteration record as the state-log append [SOURCE: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/prompts/iteration-012.md:66]. The validator currently checks only that the delta file has some record with `type:"iteration"` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:421] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:423]. It does not compare iteration number, status, ratio, findings counts, executor provenance, or review-depth fields against the state-log record. Versioned enforcement should hard-fail mismatches for identity and core counters, because otherwise a shallow or malformed state-log row can be paired with a richer delta row and still pass post-dispatch validation.

6. **P2 - Graphless fallback should warn or pass based on cited search evidence, not on graph absence alone.** The convergence reference explicitly omits `graphEvidence` when `graphEvents` are absent [SOURCE: .opencode/skills/deep-review/references/convergence.md:677], and the workflow skips graph upsert when the latest iteration has no `graphEvents` array [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:979] [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:994]. That should pass only when `targetSelection.discoveryMethods` and `searchLedger.searchActions` cite direct reads, exact searches, semantic-search status, resource-map checks, or inspected tests. It should warn when graph is unavailable but fallback proof exists, and fail when both graph data and cited fallback searches are absent for a standard/complex clean PASS.

7. **P2 - Existing validator tests prove dispatch mechanics, not review-depth semantics.** Current tests cover happy-path required fields, missing iteration files, missing required fields, executor provenance, dispatch-failure events, malformed JSONL, optional code verification, and verification disabled behavior [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts:33] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts:116] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts:139] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts:279]. Reducer-schema tests pin reducer wiring and metrics but not candidate/search coverage [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:24] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:53]. Add seeded validator fixtures that fail the current workflow: array-shaped `findingsNew`, active counts with empty `findingDetails`, clean PASS without ledger rows, uncited `ruled_out` rows, invalid dispositions, broken `linkedFindingId`, mismatched delta/state records, and graphless clean PASS without fallback search rows.

## Questions Answered

- **Which recommendation is most likely to become checkbox theater?** `searchLedger` enforcement, if it only checks array presence. The row must prove hypothesis, target, action, evidence, disposition, and linkage.
- **What minimal schema proves real bug-search depth?** Top-level version/applicability/target/coverage fields plus row-level target refs, bug class, hypothesis or invariant, search actions, evidence refs, disposition, rationale, and disposition-specific reasons or links.
- **Which checks should be hard errors?** New versioned complete standard/complex records should fail on wrong `findingsNew` or `findingsSummary` shape, shallow active `findingDetails`, absent or empty ledger, unsupported dispositions, empty evidence refs, broken finding links, missing target selection evidence, and state/delta mismatch.
- **Which checks should warn?** Legacy unversioned rows, temporary alias fields such as `candidateMatrix`, graphless runs with valid fallback evidence, optional producer/consumer fields outside applicable bug classes, and trivial reviews with explicit `reviewDepthApplicability`.
- **Which cases should pass?** Clean v2 standard/complex records with cited null-search rows; finding rows linked to rich `findingDetails`; graphless records with cited fallback search proof; trivial reviews with explicit applicability evidence; and error/timeout/stuck records whose core JSONL counters are internally consistent.

## Questions Remaining

- Should the validator expose warnings in its return type, append advisory JSONL events, or both?
- What exact evidence-ref resolver should be used: strict `path:line`, artifact ids, ledger row ids, or a mixed resolver with warnings for non-file evidence?
- Should `reviewDepthSchemaVersion` start at `2` to avoid colliding with the existing `reviewModeVersion: 2`, or use a separate `reviewDepthSchemaVersion: 1` because it is a new sub-schema?
- Should mismatch between state-log and delta records compare the full object or only identity, counters, status, and review-depth fields?

## Ruled Out

- **Ruled out: fail every old review packet missing a ledger.** Current tests and fallback rows still contain legacy shapes, so fail-closed must start at explicit versioned complete records.
- **Ruled out: accept a ledger row with `evidenceRefs: []` as a clean-search proof.** That preserves checkbox theater and does not prove a search happened.
- **Ruled out: make graph events the only depth proof.** Graph checks are omitted when no graph data exists, and the current graph vocabulary still lacks bug-class and invariant semantics.

## Dead Ends

- Treating the current validator failure reason list as enough for rollout policy did not hold. It can fail or pass, but it cannot carry migration warnings today.
- Treating delta-file existence as a complete post-dispatch check did not hold. The validator only looks for any iteration record in the delta file, not that it matches the state-log append.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/iterations/iteration-011.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/deltas/iter-011.jsonl`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/prompts/iteration-012.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`
- `.opencode/skills/deep-review/references/state_format.md`
- `.opencode/agents/deep-review.md`
- `.opencode/skills/deep-review/references/convergence.md`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs`
- `.opencode/skills/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`

## Reflection

The validator recommendation is strongest if it separates three questions: is the record structurally valid, is the review-depth schema applicable, and is the search proof adequate for the claimed disposition. Collapsing those into a universal required-field list would be brittle. The more durable design is a versioned validator profile with explicit hard-error, warning, and pass outcomes, plus tests that prove a shallow clean review fails before it can become a PASS.

## Recommended Next Focus

Stress-test reducer, dashboard, registry, and report persistence: exact fields for `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `searchCoverage`, and how search debt should affect PASS, CONDITIONAL, blocked-stop, and final synthesis output.
