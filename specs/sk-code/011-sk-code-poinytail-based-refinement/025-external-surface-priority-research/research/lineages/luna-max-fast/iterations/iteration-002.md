# Iteration 2: Compiled sk-code routing and canary order

## Focus

This pass investigates Q1 part 2: the compiled routing model, the source of its tie-break, surface-hint behavior, manifest freshness, route synchronization and sk-code canary coverage. The strategy names this as the next focus after the hub-level inventory. Deletion behavior and advisor, doctor, install-guide and release-note coverage remain for later passes.

## Actions Taken

- Read the lineage config, state log, strategy, registry, dashboard and iteration 1 before selecting the focus. The lineage has one prior iteration and no exhausted approach category.
- Inspected the compiled route front door, runtime engine, sk-code compiler inputs, manifest freshness checks, serving-closure sync, activation manifest, and canary fixture and tests.
- Read canary test sources without executing the tests. No throwaway deletion experiment was run because this iteration focuses on Q1 compiled routing; Q2 remains open.
- Kept writes to the iteration narrative, delta file and append gateway. The explicit write allowlist does not include progressive research.md, so it was not updated.
- durationMs reflects the summed command wall-time outputs available to this executor, not model-side reasoning time.

## Findings

| class | claim | evidence: repo path:line | severity |
|---|---|---|---|
| ORDER | The compiled sk-code policy takes bundle order from the hub router data. The compiler passes routerPolicy.tieBreak into bundleRules and copies it into the compiled model. The current list places quality, review, OpenCode, Obsidian and Webflow in that order. | [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:259-266]; [SOURCE: .skilled/skills/sk-code/hub-router.json:4-12] | P1 |
| ORDER | --surface-hint is a per-call reorder for a surface already present in the evaluated route. It promotes the hinted surface among surface targets only; an unmatched or unknown hint does nothing, and workflow modes retain their positions. | [SOURCE: .skilled/bin/compiled-route.cjs:47-59]; [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:98-107]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:251-268]; [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-98] | P1 |
| PRESENCE | The sk-code canary fixture pins Webflow and Obsidian ids in expected bundles and hint scenarios. The harness loads the fixture together with the current registry, router and skill text to compile its snapshot. | [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:107-175]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:50-69] | P1 |
| PRESENCE | The inspected surface-hint tests cover Webflow and Obsidian routes for sk-code. Their no-surface-packet case names sk-doc and mcp-tooling, so these cases do not establish sk-code behavior after the two example packets are deleted. This is a coverage gap, not an observed deletion failure. | [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-98] | P2 |
| OK | The promoted sk-code activation manifest stores the selected policy hash, generation and serving authority, not the surface order. Freshness rereads SKILL.md, hub-router.json and mode-registry.json, recompiles the policy and compares generation plus effectivePolicyHash. The separate serving-closure sync fingerprints its manifest and listed file paths, modes and contents. | [SOURCE: .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1]; [SOURCE: .skilled/bin/lib/compiled-route-manifest.cjs:432-465]; [SOURCE: .skilled/bin/lib/compiled-route-manifest.cjs:523-561]; [SOURCE: .skilled/bin/lib/compiled-route-manifest.cjs:570-602]; [SOURCE: .skilled/bin/compiled-route-sync.cjs:195-236] | P2 |

## Questions Answered

No strategy question is fully answered. This iteration establishes that compiled precedence comes from hub-router data and describes the surface-hint and freshness mechanisms. Q1 remains open for the remaining advisor, doctor, install-guide, release-note and absent-packet inventory.

## Questions Remaining

- Q1 remains open for the advisor, doctor, install guides, release note and runtime behavior when packets are absent.
- Q2 through Q6 remain open.

## Ruled Out

- No implementation or canary test execution was attempted. This pass read the canary fixtures and tests to identify their encoded expectations.
- No claim is made about deletion failures. The authorized throwaway-copy experiment is deferred to the Q2 focus.

## Dead Ends

None identified.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none in the compiled-runtime slice.
- Missing dependencies: none for the source inspection.
- Partial success: the compiled-routing slice is documented, but Q1 and Q2 through Q6 remain open.

## Sources Consulted

- .skilled/skills/sk-code/hub-router.json:4-12
- .skilled/bin/compiled-route.cjs:47-59
- .skilled/bin/compiled-route-guard.cjs:42-58,97-116
- .skilled/bin/compiled-route-manifest.cjs:29-30,110-120
- .skilled/bin/lib/compiled-route-manifest.cjs:432-465,523-561,570-602
- .skilled/bin/compiled-route-sync.cjs:195-236
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:247-267,277-307,320-350
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:50-69,101-134
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:251-268
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:107-175
- .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:98-120
- .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1
- .skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-110

## Assessment

- New information ratio: 1.00 (five of five findings are new in this lineage).
- Questions addressed: compiled-routing portion of Q1.
- Questions answered: none fully.

## Reflection

- What worked and why: reading compiler input and output paths showed that the tie-break is authored hub data copied into the compiled model. Reading the resolver, hint helper and canary assertions separated persistent precedence from a temporary session hint.
- What did not work and why: source inspection cannot establish runtime failures after packet deletion. That requires the Q2 copy experiment.
- What I would do differently: after finishing Q1's remaining source inventory, create the prescribed external copy and probe deletion plus a user-added surface without touching the worktree.

## Recommended Next Focus

Finish Q1's remaining advisor, doctor, install-guide and release-note inventory, then run the prescribed external-copy deletion and replacement-surface probes for Q2.
