# Iteration 11: Deep-Review and AI-Council Fallback/Staleness Contracts

## Focus

This iteration broadened from iteration 10's `/deep:research`, `/speckit:resume`, and `/memory:save` reliability audit into sibling deep-loop modes: deep-review and deep-ai-council. It focused on graphless fallback gates, startup `memory_context` failure behavior, stale graph/status recovery payloads, and false-safe success prevention.

Ambiguity note: the full sibling-mode surface includes every review/council command, feature catalog, playbook, and runtime script. I selected the narrowest evidence-backed slice that directly followed iteration 10: startup memory context blocks plus review/council graph fallback and recovery contracts.

## Findings

1. Deep-review has the same startup memory-context ambiguity found in deep-research: the auto YAML calls `memory_context` before initialization and defines found/no-context behavior, but the inspected startup block does not specify an MCP error or timeout fallback. [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:43] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:47] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:51]
2. Deep-review is much stronger for stale/unavailable graph handling at stop time: `graphlessFallbackGate` blocks STOP when graph mode is `unavailable_blocked`, and in `graphless_fallback` mode it requires cited fallback ledger rows using direct read, exact grep, semantic-search status, code-graph status, producer/consumer trace, or negative-test inspection methods. [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:599] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:674]
3. The deep-review manual playbook mirrors the graphless gate contract and records the exact anti-false-safe scenario: an empty `searchLedger` with `graphCoverageMode: graphless_fallback` must emit a named `blocked_stop`/`graphlessFallbackGate`, and PASS requires recovery guidance naming fallback methods rather than generic graph failure. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/review-depth-v2-rollout/stop-gate-graphless-fallback.md:13] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/review-depth-v2-rollout/stop-gate-graphless-fallback.md:21] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/review-depth-v2-rollout/stop-gate-graphless-fallback.md:44]
4. Deep-ai-council has a thinner startup context-loading block than deep-review: the auto YAML calls `memory_context` for prior council context but the inspected block contains no found/no-context behavior and no MCP error/timeout fallback; this is a cross-mode startup reliability gap despite later graph recovery strength. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:30] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:34] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:37]
5. Deep-ai-council's graph status/convergence documentation is strong against false-safe success: status must return readiness, counts, schema version, signals, and a namespace-scoped recovery payload for empty/stale/corrupt states; convergence uses three buckets (`STOP_ALLOWED`, `CONTINUE`, `STOP_BLOCKED`) so non-converged or critically conflicted states do not collapse into successful stop. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:15] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:19] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/council-graph-integration/council-graph-convergence-three-state-decision-matrix.md:15] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/references/integration/graph_support.md:91]

## Ruled Out

- Treating deep-review as allowing clean STOP on unavailable graph was ruled out; the auto YAML explicitly fails `graphlessFallbackGate` for `unavailable_blocked` and requires cited fallback proof for `graphless_fallback`. [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:599]
- Treating AI-council graph status as a generic empty success was ruled out; both playbook and feature catalog require recovery payloads and distinguish empty/stale/corrupt/healthy states. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:19] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:31]

## Dead Ends

- Runtime implementation (`status.cjs`, `convergence.cjs`, and graph DB internals) was not read in this iteration; the focus was reference/playbook/command alignment. A future implementation pass should verify the documented contracts against code and tests before claiming runtime truth.

## Edge Cases

- Ambiguous input: Deep-review and AI-council have broad surfaces. I selected startup memory context and graph fallback/status contracts because those directly answer iteration 10's next-focus recommendation.
- Contradictory evidence: Startup context blocks are comparatively thin, while later graph fallback/status contracts are strong. This is a lifecycle-stage asymmetry, not a claim that the full workflows are unreliable.
- Missing dependencies: Code graph remained stale/untrusted; direct `Read`/`Grep` evidence was used. [SOURCE: .opencode/specs/system-speckit/004-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: The pass covered command/reference/playbook surfaces, not runtime code execution.

## Sources Consulted

- `.opencode/commands/deep/assets/deep_review_auto.yaml:43`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:47`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:51`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:599`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:674`
- `.opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/review-depth-v2-rollout/stop-gate-graphless-fallback.md:13`
- `.opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/review-depth-v2-rollout/stop-gate-graphless-fallback.md:21`
- `.opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/review-depth-v2-rollout/stop-gate-graphless-fallback.md:44`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:30`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:34`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:37`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:15`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:19`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/council-graph-integration/council-graph-convergence-three-state-decision-matrix.md:15`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/references/integration/graph_support.md:91`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which deep-loop sibling references describe outdated or missing behavior?
  - Where do workflow docs claim fallback coverage and where are startup failure policies missing?
  - Which misalignments affect command routing, MCP/tool contracts, code graph, or deep-loop workflows?
- Questions answered:
  - Deep-review and AI-council both have thin startup `memory_context` failure semantics in inspected auto YAML blocks.
  - Deep-review has strong graphless fallback stop-blocking semantics and manual-playbook coverage.
  - Deep-ai-council has strong graph status and convergence contracts against false-safe empty success.

## Reflection

- What worked and why: Targeted greps for `memory_context`, `graphlessFallbackGate`, `unavailable_blocked`, and `false-safe` quickly separated weak startup blocks from strong graph fallback contracts.
- What did not work and why: Broad sibling-mode searches produced many unrelated advisory references, so this pass stayed on the reliability/staleness axis.
- What I would do differently: Next pass should verify the implementation/runtime layer for these documented graph contracts: `status.cjs`, `convergence.cjs`, review-depth convergence tests, and council graph integration tests.

## Recommended Next Focus

Audit runtime implementation and tests for the documented deep-review and AI-council fallback contracts: review-depth graphless fallback tests, council `status.cjs` recovery payload assembly, `convergence.cjs` three-state decisions, and whether tests are active or still TODO/manual-only.
