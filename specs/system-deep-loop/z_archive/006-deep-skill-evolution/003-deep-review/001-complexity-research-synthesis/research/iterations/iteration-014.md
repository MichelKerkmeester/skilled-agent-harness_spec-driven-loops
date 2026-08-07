# Iteration 014: Stress-test graph vocabulary and convergence gates: candidate saturation, BUG_CLASS/INVARIANT/PRODUCER/CONSUMER/TEST nodes, graphless fallback, and STOP_BLOCKED behavior.

## Focus

This pass stress-tested recommendations R5 and R6 from the synthesis: expand review graph vocabulary after ledger semantics stabilize, then add candidate-saturation convergence gates. The goal was to find where graph vocabulary, graphless fallback, and `STOP_BLOCKED` behavior could become either checkbox theater or a false blocker.

## Actions Taken

1. Re-read the current synthesis recommendation list, focusing on R5/R6 and the stated implementation order.
2. Inspected the current review coverage-graph schema, valid node kinds, relation kinds, upsert validation, and review convergence signal code.
3. Checked the deep-review iteration prompt, workflow graph-upsert step, graph convergence step, and blocked-stop persistence path.
4. Compared graph-aware review convergence docs against the live YAML behavior for empty or absent graph events.
5. Checked current test surface and fixtures for candidate-saturation, graph vocabulary, and `STOP_BLOCKED` coverage.

## Findings

### F014-001: The proposed review graph vocabulary would be silently dropped unless the workflow and graph schema change together

The current review graph node kinds are limited to `DIMENSION`, `FILE`, `FINDING`, `EVIDENCE`, and `REMEDIATION`; `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` are not valid kinds. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:137]

The deep-review workflow also normalizes graph events and explicitly keeps only the current five review kinds, discarding malformed or unknown graph events instead of failing the review iteration. [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:981] [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:985]

That makes R5 correct but underconstrained. Adding prompt text that asks agents to emit `BUG_CLASS` or `INVARIANT` graph events would not create graph coverage today; those events would be filtered out before upsert. The implementation slice must update the TypeScript graph kinds, workflow transform allow-list, graph-event docs, prompt pack, and tests in one change. Otherwise graph vocabulary expansion becomes invisible ceremony.

### F014-002: Current review graph signals cannot measure candidate saturation

Review graph convergence currently scores `dimensionCoverage`, `findingStability`, `p0ResolutionRate`, `evidenceDensity`, and `hotspotSaturation`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:44] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:67]

The signal implementation derives dimension coverage from `DIMENSION -> COVERS` edges, finding stability from absence of `CONTRADICTS`, P0 resolution from `RESOLVES`, evidence density from `EVIDENCE_FOR`, and hotspot saturation from repeated dimension coverage on hotspot files. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:418] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:436] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:454] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:480] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:487]

None of those signals answers whether required bug classes, invariants, producer/consumer paths, or negative tests were searched. Candidate saturation therefore needs a new ledger-derived `candidateCoverageGate` before or alongside graph expansion. The graph can mirror that gate later, but the initial source of truth should be `searchLedger`/`searchCoverage`, because graph nodes alone do not prove row evidence or disposition quality.

### F014-003: Graphless behavior has a live contract contradiction

The deep-review convergence reference says that when `graphEvents` are absent, the `graphEvidence` sub-check is omitted and existing sub-checks decide the gate. [SOURCE: .opencode/skills/deep-review/references/convergence.md:677]

The live workflow, however, calls graph convergence before the inline review vote and says final STOP is never legal unless the inline vote says STOP and `graph_decision == "STOP_ALLOWED"`. [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:418] [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:461] When the graph is empty, the handler returns `CONTINUE`, not an absent/skipped graph decision. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:168] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:171]

This is a migration hazard for R6. If graphless fallback remains valid, the workflow needs an explicit graph mode such as `graphCoverageMode:"graphless_fallback"` that lets a valid text/JSON ledger satisfy candidate coverage. If graph data is required for standard/complex reviews, then empty graph should produce a typed blocker, not a quiet `CONTINUE` that withholds `blocked_stop` detail.

### F014-004: `STOP_BLOCKED` can preserve blocker detail, but no current gate can name missing candidate classes

The review blocked-stop contract persists `blockedBy`, named `gateResults`, `graphBlockerDetail`, and a recovery strategy. [SOURCE: .opencode/skills/deep-review/references/convergence.md:71] [SOURCE: .opencode/skills/deep-review/references/convergence.md:103] [SOURCE: .opencode/skills/deep-review/references/convergence.md:107]

The live workflow emits those same gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, and `fixCompletenessReplayGate`. [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:477] [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:558]

There is no `candidateCoverageGate`, `searchDebtGate`, `negativeTestGate`, or `graphlessFallbackGate`. That means a future shallow clean review can be blocked for dimensions, P0s, evidence density, hotspots, claim adjudication, or fix replay, but not specifically for "missing invariant coverage" or "unsearched producer/consumer path." R6 should add named candidate-search gates to `gateResults` before relying on graph blocker prose.

### F014-005: Empty or no-finding graph states can avoid both STOP_ALLOWED and STOP_BLOCKED, which is bad operator feedback

The graph convergence handler returns `STOP_BLOCKED` only when it has blocking blockers; otherwise it returns `STOP_ALLOWED` when every trace passes, or `CONTINUE` when traces fail without blocking blockers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:224] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:228] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:230]

For review mode, only unresolved P0s, incomplete dimension coverage, and contradiction-driven instability currently add blocking blockers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:559] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:572] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:582]

Candidate saturation gaps would likely land in the worst middle state unless implemented as explicit blockers: graph traces fail or remain empty, the loop continues, but the blocked-stop event does not tell the next agent which bug class or invariant is missing. The candidate gate should produce structured blockers with `missingBugClasses`, `uncoveredInvariants`, `unsearchedProducerConsumerPaths`, and `untestedNegativeCases`.

### F014-006: The seeded tests need to prove graph vocabulary, graphless equivalence, and blocked-stop semantics, not only schema shape

Current discovered test/fixture surfaces include archived coverage-graph tests and a blocked-stop session fixture, but the search did not surface active tests for `searchLedger`, `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST`, candidate saturation, or graphless fallback in the deep-review path. [SOURCE: .opencode/skills/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts]

The minimum seeded test set should fail the current workflow in four ways: new graph node kinds are discarded; clean standard/complex review without candidate rows can reach a severity-clean posture; empty graph returns generic `CONTINUE` instead of a candidate-search blocker or accepted fallback mode; and `blocked_stop` lacks a candidate/search gate when STOP is otherwise nominated.

## Questions Answered

- Which recommendation is likely to become checkbox theater unless constrained more tightly?
  Graph vocabulary expansion is the risky one in this cluster. Without schema, transform, reducer, convergence, and test updates, `BUG_CLASS` and `INVARIANT` nodes are words in prompt text, not persisted proof.

- What minimal schema proves real bug-search depth without overburdening trivial reviews?
  Keep the text/JSON ledger as the authority: `reviewDepthApplicability`, `targetSelection`, `searchLedger[]`, and `searchCoverage` with required candidate classes and dispositions. Graph events should be a derived/accelerating representation, not the only proof.

- Which validator checks should be hard errors versus warnings during rollout?
  Hard-error v2 standard/complex complete records when candidate-search gates are applicable but `searchCoverage` lacks required bug-class/invariant/negative-test coverage. Warn when graph events are absent but ledger fallback is complete. Exempt trivial/non-complete records through explicit applicability state.

- How should graphless runs prove equivalent search coverage?
  They need `graphCoverageMode:"graphless_fallback"` plus cited `targetSelection.discoveryMethods`, direct reads/exact searches, semantic-search or code-graph status, tested negative paths, producer/consumer paths, and ledger rows that cover or explicitly dispose each required candidate class.

- What seeded tests would fail on the current shallow workflow and pass after implementation?
  Tests for new graph kinds surviving upsert, candidate-search blockers entering `blocked_stop`, graphless fallback allowing STOP only with cited ledger coverage, and a zero-finding clean review failing candidate saturation until ruled-out/clean rows exist.

## Questions Remaining

- Should `candidateCoverageGate` live in the shared deep-loop graph handler, the deep-review YAML legal-stop bundle, or both with the YAML consuming reducer-owned `searchCoverage` first?
- What default required candidate classes should apply to `standard` reviews before risk-specific taxonomy matures?
- Should max-iteration terminal synthesis downgrade PASS to CONDITIONAL when candidate gates remain unsatisfied, even though max iteration bypasses legal-stop veto?

## Ruled Out

- Ruled out graph vocabulary first. The graph should follow stable ledger semantics; otherwise new node kinds lack enforceable meaning.
- Ruled out making graphEvents mandatory for all depth proof. The current prompt marks them optional, graphless fallback remains necessary, and existing convergence docs already describe graceful graph omission. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:70] [SOURCE: .opencode/skills/deep-review/references/convergence.md:677]
- Ruled out relying on existing review graph signals for candidate saturation. They measure dimensions, findings, P0 resolution, evidence, and hotspots, not searched bug hypotheses.

## Dead Ends

- Searching for existing `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, or `TEST` review graph support led back to recommendation text and generic test-generation docs, not live graph schema support.
- Treating empty graph `CONTINUE` as equivalent to graceful graphless fallback did not hold. It carries no accepted fallback proof and no blocked-stop detail.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/iterations/iteration-011.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/iterations/iteration-012.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/iterations/iteration-013.md`
- `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`
- `.opencode/skills/deep-review/references/convergence.md`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`

## Reflection

The graph recommendation should be sequenced as a projection of the ledger, not a replacement for it. The candidate ledger is where applicability, evidence refs, dispositions, and graphless fallback can be validated. The graph is useful once those semantics exist, because it can make saturation and blockers easier to compute and visualize.

The most important tightening is to add named candidate gates before expanding graph vocabulary. Otherwise the system can keep saying "dimension covered" while never saying "producer/consumer path unsearched."

## Recommended Next Focus

Final synthesis stress pass: turn iterations 11-14 into an implementation-ready rollout sequence with exact hard-error/warn phases, seeded tests, and acceptance thresholds for avoiding shallow PASS outcomes.
