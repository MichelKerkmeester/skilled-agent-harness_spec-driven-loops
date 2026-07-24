# Iteration 10: Final Dependency-Ordered Resource Map and Implementation Handoff

## Focus

Produce a no-further-research implementation handoff that identifies the exact resource surfaces, dependency order, acceptance gates, and residual decisions for making the seven-row typed oracle executable without weakening fallback behavior. This is the final leaf iteration, not synthesis; `research.md`, the resource-map artifact, reducer-owned files, and researched targets remain untouched. Route proof: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/prompts/iteration-010.md:1-27]

## Actions Taken

1. Read the config, state log, strategy, registry, rendered prompt, and canonical agent definition before selecting the focus.
2. Verified that `iteration-010.md` and `iter-010.jsonl` did not exist and that the three allowed outputs remain inside the resolved packet.
3. Reused the established dependency plan, verification matrix, and seven-row oracle analysis rather than retrying saturated corpus or collision searches.
4. Joined those three evidence sets into one resource DAG with measurable state transitions and residual decision boundaries.

## Findings

1. **The implementation packet can proceed through one deterministic eight-gate DAG.** Each gate consumes evidence produced by the preceding gate; benchmark scoring is deliberately last.

   | Gate | Resource surface | Required result before continuing |
   |---:|---|---|
   | 0 | `benchmark/baseline/skill-benchmark-report.json`; benchmark runner | Capture a router-trace before report and preserve corpus count, D5, topology digest, oracle-fault count, D1-intra/D2/D3, and aggregate score. |
   | 1 | `deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`; loader regression tests | Adopt one indexed-corpus representation that preserves explicit workflow mode plus child-local leaf IDs, and prove both indexed rows and `DA-R01` are discoverable. |
   | 2 | `manual_testing_playbook/manual_testing_playbook.md`; six existing route files; new alignment route row | Repair hyphen/underscore index addresses, retain authored class boundaries, and make the seven seed rows loader-reachable. |
   | 3 | `mode-registry.json`; `generate-leaf-manifest.cjs`; `leaf-resource-contract.cjs`; generated `leaf-manifest.json` | Generate a byte-stable seven-mode manifest with unique `{workflowMode, leafResourceId}` composites and child-local leaf IDs. |
   | 4 | `MR-001..003`, `IL-001..003`, `DA-R01` | Author-review and commit the seven explicit typed-gold rows against manifest membership; do not infer gold for other files. |
   | 5 | `validate-playbook-topology.cjs`; manifest `--check`; normalized loader output | Prove fixture schema, topology, selected-map cap, manifest membership, 39/35/4 corpus counts, seven typed rows, and zero oracle-fault exclusions. |
   | 6 | hub `SKILL.md`; hub resource map/router; `router-replay.cjs`; Lane-C tests | Emit exact typed pairs for all seven modes while preserving explicit-hint precedence, `UNKNOWN_FALLBACK`, missing-mode/path failure, and containment. |
   | 7 | benchmark runner and before/after reports | Rerun with the same corpus and trace mode; accept score movement only after D5 passes and the typed diagnostics are valid. |

   Manifest generation precedes final gold authoring because manifest membership is the oracle boundary; it is regenerated with `--check` at gate 5 after gold is authored. [INFERENCE: based on .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-005.md:19-27, .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-006.md:16-34, and .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-009.md:32-36]

2. **Static and executable oracle validity have explicit transition points.** The seven rows are already statically mode-complete and cap-valid. They become loader-valid only after gates 1-2, manifest-checkable after gate 3, executable-oracle-valid after gates 4-5, observed-route-valid after gate 6, and score-comparable only after gate 7. This prevents a mode-complete table, a generated manifest, or a higher aggregate score from being misreported as end-to-end typed-routing success. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-009.md:16-36,74-91] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-006.md:20-34]

3. **The proposed seed has exact bounded acceptance numbers: seven rows, seven workflow modes, and 43 candidate typed pairs.** The row distribution is `research/deep-research=6`, `review/deep-review=6`, `ai-council/deep-ai-council=7`, `agent-improvement/deep-improvement=10`, `model-benchmark/deep-improvement=6`, `skill-benchmark/deep-improvement=6`, and `alignment/deep-alignment=2`. These 43 router-derived candidates become gold only through the gate-4 author review; the measurable corpus gate remains 39 normalized rows = 35 routing + 4 browser, with exactly seven typed seed rows and zero typed-fixture exclusions. [INFERENCE: summing the row-level candidate sets in .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-009.md:20-30] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-006.md:20-30]

4. **The acceptance bundle must combine structural, oracle, routing, safety, and scoring evidence.** Structural evidence is manifest byte stability, seven mode identities, no duplicate composites, D5 success, and unchanged topology during each run. Oracle evidence is loader reachability, manifest membership, selected-map validity, and zero exclusions. Routing evidence is exact typed-pair recall/precision with no unresolved or cross-mode output. Safety evidence is the five named fallback assertions. Scoring evidence is a same-corpus, same-trace before/after comparison of D1-intra, D2, D3, and aggregate score; no single layer substitutes for another. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-006.md:20-34] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-009.md:36]

5. **Only two residual decisions remain, and neither requires more routing research.** Implementation must choose the concrete indexed-corpus authoring representation that satisfies gate 1; fixture governance must explicitly approve the 43 candidate pairs before they become gold. Promotion of any of the 273 loader-ineligible files is optional, outside this critical path, and must not block or expand the seven-row slice. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-009.md:32-34,93-100] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-005.md:21,33-47]

## Questions Answered

- Which exact resource and dependency map gives the implementation packet a no-further-research execution order? **Answered by the eight-gate DAG, state transitions, exact seed counts, and acceptance bundle above.**

## Questions Remaining

- Research questions: none.
- Implementation decision: choose the loader-compatible indexed-corpus representation and lock it with gate-1 tests.
- Governance decision: approve or adjust the 43 proposed seed pairs; no loader-ineligible promotion is required.

## Ruled Out

- Running the scored benchmark before loader, manifest, topology, and fallback gates pass.
- Treating router-derived candidate leaves as author-approved fixture gold without review.
- Promoting loader-ineligible files to make the first slice appear broader.
- Embedding packet prefixes in canonical `leafResourceId` or inferring the three improvement modes from their shared packet.

## Dead Ends

- Further corpus-wide filename inference remains saturated and cannot authorize typed gold or loader-ineligible promotion.
- Aggregate-score-only acceptance remains invalid because it cannot distinguish oracle faults, routing defects, corpus drift, and fallback regression.

## Edge Cases

- Ambiguous input: none; the rendered prompt explicitly defines the final handoff focus despite the reducer strategy showing all charter questions resolved.
- Contradictory evidence: none newly introduced; manifest-before-final-gold ordering preserves the established oracle boundary, with a post-authoring manifest check at gate 5.
- Missing dependencies: executable validity still requires a committed manifest, loader support for indexed typed metadata, loader reachability for `DA-R01`, and fixture-author approval; these are implementation prerequisites, not missing research evidence.
- Partial success: none for this research question; the handoff is complete while implementation remains intentionally unperformed.

## SCOPE VIOLATIONS

None. No researched source, spec, reducer-owned file, synthesis file, or resource-map artifact was modified.

## Sources Consulted

- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/prompts/iteration-010.md:1-88`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-005.md:17-86`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-006.md:14-92`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-009.md:14-104`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:168-191,258-315,343-524`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88-161`
- `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:1-239`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:186-295`

## Assessment

- New information ratio: 0.80
- Novelty calculation: 2 of 5 findings were fully new and 3 partially new (`(2 + 0.5×3) / 5 = 0.70`), plus a 0.10 simplicity bonus for collapsing the remaining work into one dependency DAG with explicit validity transitions.
- Questions addressed: the exact resource and dependency map for implementation.
- Questions answered: the implementation packet has a no-further-research execution and acceptance order.

## Reflection

- What worked and why: joining the dependency plan, verification matrix, and oracle blockers by producer/consumer state exposed the earliest gate at which each validity claim becomes true.
- What did not work and why: treating the prompt's resource list as an unordered checklist would allow gold, routing, or benchmark work to run before its oracle prerequisites.
- What I would do differently: implementation should encode every gate as a separately failing test or machine-readable check so later benchmark movement cannot hide an earlier contract defect.

## Next Focus

YAML-owned synthesis should consolidate iterations 1-10 into `research.md` and the resource map; no additional leaf research iteration is scheduled.

## Recommended Next Focus

Synthesize, then hand the eight-gate DAG to the separate implementation packet. Do not perform implementation or reducer updates from this leaf.
