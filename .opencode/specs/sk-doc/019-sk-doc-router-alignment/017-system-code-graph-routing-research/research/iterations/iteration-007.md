# Iteration 7: Acceptance Matrix and Failure-Proof Implementation Boundary

## Route Proof
- Resolved route: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`.
- Agent definition loaded: `.opencode/agents/deep-research.md`; execution remained LEAF-only and dispatched no sub-agents.
- State source: packet-local config, state JSONL, strategy, registry, and `research/prompts/iteration-7.md`, read before focus selection or research.
- Packet root: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/`.
- Authorized writes: this narrative, exactly one iteration-7 state-log append, and `research/deltas/iter-007.jsonl`; progressive synthesis was not touched because the dispatch narrowed the write set to these three artifacts.

## Focus
Define a dependency-ordered acceptance matrix and risk boundary for implementing the proposed four-root contract, singleton mode, explicit map, package-index handling, full-inventory behavior, default-resource precision, guarded loading, ambiguity, and 23 typed-gold scenarios. The explicit iteration prompt supplies the current focus and supersedes the reducer's stale singleton-identity `Next Focus`; no blocked approach was reopened.

## Findings
1. **The implementation boundary must separate four resource channels, not merely replace selectors with paths.** Keep `resources` as the compatibility load trace; emit exact selected typed leaves through `leafResources`/`resourceContract`; keep always-loaded defaults in `supportResources`; and keep package indexes in `navigationResources`. If replay reconstructs typed pairs from the undifferentiated compatibility list, defaults reduce one-leaf D3 precision to `1/3` and excluded indexes become unresolved contract errors. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:260-299] [SOURCE: research/iterations/iteration-006.md:24-27] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1202-1257] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1343-1356] [INFERENCE: channel separation is the smallest model that preserves legacy loading, index navigation, and exact typed precision]

2. **Dependency-ordered acceptance matrix.** The matrix converts the target design into executable gates. “Atomic” means the named rows must become green in the same integration boundary; “staged” means the row may land independently after its prerequisite is green. [SOURCE: research/iterations/iteration-005.md:69-73] [SOURCE: research/iterations/iteration-006.md:13-27] [INFERENCE: ordering follows baseline -> contract/generation -> router/replay -> fixtures/gold -> benchmark promotion]

| ID | Dependency / boundary | Acceptance test and exact pass condition | Failure prevented | Delivery |
|---|---|---|---|---|
| A0 | Clean pre-change tree | Authorized router-mode baseline records command, tree identity, loaded/scored scenario count, parse warnings, D1/D2/D3/D5 coverage, and report digest; rerun is stable except timestamps. [INFERENCE: baseline evidence required by iteration 5's dependency step 0] | Aggregate-only or irreproducible comparison | Staged first; immutable evidence |
| A1 | Contract v2 root grammar | Unit table accepts contained Markdown IDs under exactly `references/`, `assets/`, `feature_catalog/`, and `manual_testing_playbook/`; still rejects empty IDs, absolute paths, `.`/`..`, empty segments, unknown roots, and empty modes with existing error classes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-126] [INFERENCE: add two roots without weakening containment negatives] | Root widening disables containment | Atomic with A2 and all version readers |
| A2 | Standalone manifest generation | No `mode-registry.json`; singleton `system-code-graph`; four-root Markdown-only walk; both package indexes excluded; deterministic sort; exactly 53 unique pairs (`7/0/18/28`); stable canonical digest. [SOURCE: research/iterations/iteration-006.md:13-18] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:133-183] [INFERENCE: cardinality and uniqueness prove topology] | Hub-only generation, index inflation, duplicate pairs | Atomic with A1 |
| A3 | Map/startup conformance | Every map value resolves through manifest, Markdown suffix, packet containment, index denylist, and duplicate check; proposal has 37 keys, 35 unique live leaves, zero dead values, and an explicit 18-leaf intentional-unmapped partition. Removing one mapped file fails startup before partial load. [SOURCE: research/iterations/iteration-006.md:20-23] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:184-232] [INFERENCE: dead-map and newly-unmapped drift need explicit set assertions] | Rename/addition drift and partial routing | Staged after A2; atomic with map activation |
| A4 | Legacy parity and ambiguity | Golden fixtures preserve two defaults first in `resources`, deterministic order, deduplication, no-score disambiguation, top-score selection, and at most two intents within delta 1. Exact-vs-generic ties choose exact specificity; equal-specificity winners remain ambiguous. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:251-299] [INFERENCE: specificity refines ties without erasing fallback/two-intent behavior] | Exact keys break fallback or genuine ambiguity | Atomic with selector activation |
| A5 | Typed channel precision | Exact route emits singleton mode; `resources` has two defaults plus selected leaf; `supportResources` has exactly defaults; typed pairs have exactly the selected leaf; unresolved is zero. Scorer reports recall `1/1` and D3 `1/1`, not `1/3`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1215-1257] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1311-1356] [INFERENCE: defaults are support context, not selector choices] | Defaults cap D3 or pollute every oracle | Atomic router + replay normalization |
| A6 | Navigation versus full inventory | `FEATURES`/`PLAYBOOK` place indexes only in navigation (and compatibility output if required), never typed pairs. Explicit `FULL_INVENTORY` emits all 53 pairs, sets `fullInventoryIntent: true`, excludes indexes, and has zero unresolved paths; plain navigation never expands to 53. [SOURCE: research/iterations/iteration-006.md:24-25] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1187-1195] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1231-1237] [INFERENCE: navigation and complete typed enumeration are distinct intents] | Index errors or accidental toolkit-wide loading | Atomic router + replay + broad fixtures |
| A7 | Exact-route corpus | Parameterized test covers all 23 eligible prompts: one expected selected pair, stable singleton mode, no ambiguity, no unresolved resources, and no sibling scenarios. Five non-routing files remain absent from positive typed gold. [SOURCE: research/iterations/iteration-005.md:42-66] [SOURCE: research/iterations/iteration-005.md:71-73] [INFERENCE: one table-driven test prevents row drift] | Broad expansion or fabricated gold | Staged after A3-A6 |
| A8 | Negative/missing-path guards | Test absolute/traversal/unknown-root IDs, non-Markdown files, resolved symlink escape, missing map path, stale manifest digest, duplicate pair, index injection, unknown intent, and map key with no load; all fail closed with no partial typed contract. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:79-126] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:227-232] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:276-293] [INFERENCE: filesystem existence and lexical containment both require coverage] | Escape, stale generation, partial success | Atomic before activation |
| A9 | Promotion benchmark | Post-change run has zero topology exclusions, zero `routing_contract_error`, 23/23 typed recall, selected-pair D3 1.0, unchanged fallback/ambiguity fixtures, and no compatibility-output regression; compare dimensions/error classes with A0, not aggregate alone. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287-1356] [INFERENCE: topology, accuracy, efficiency, and parity must pass together] | Green aggregate hides exclusions or over-routing | Final staged gate |

3. **Only three integration seams require atomic delivery.** Contract version/root grammar, standalone generation, validator readers, and the 53-leaf manifest must agree. Exact router emission and replay normalization must agree on the four channels. `FULL_INVENTORY`, index exclusion, and replay's full-inventory flag must agree. Baseline capture, map fixtures, typed-gold authoring, and final benchmark can be staged around those seams. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-48] [SOURCE: research/iterations/iteration-006.md:13-27] [INFERENCE: these seams cross producer/consumer contracts; staged steps consume stable artifacts]

4. **Selector-to-enumeration regression risks are finite and testable.** Highest risks are rename/addition drift, generic keywords outranking exact prompts, nondeterministic order, navigation/full-inventory confusion, and defaults scored as selected leaves. Manifest/map partition, tie-class fixtures, canonical digest, breadth fixtures, and typed-channel assertions directly detect them. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:113-202] [SOURCE: research/iterations/iteration-006.md:20-27] [INFERENCE: these regressions arise specifically from replacing dynamic selectors with enumerated identities]

5. **The matrix answers the optimization question without fabricating an executable baseline.** Implementation needs no further identity/root research: singleton `system-code-graph`, four legal roots, 53 non-index leaves, 23 positive rows, five excluded rows, explicit `FULL_INVENTORY`, and support/navigation separation all have testable pass conditions. Actual pre/post reports remain authorized implementation-packet actions. [SOURCE: research/iterations/iteration-005.md:71-73] [SOURCE: research/iterations/iteration-006.md:15-27] [INFERENCE: choices are bounded while the only missing evidence is execution output]

## Risk Analysis
| Risk | Likelihood / impact | Detection and mitigation |
|---|---|---|
| Four-root syntax without standalone discovery | Medium / High | A1 passes but A2 returns two roots or needs a registry; ship A1+A2 atomically. [SOURCE: research/iterations/iteration-006.md:13-14] [INFERENCE: producer and validator share one versioned domain] |
| Defaults poison typed precision | High / High | Exact row observes 3 pairs and D3 `1/3`; use support channel and explicit selected contract. [SOURCE: research/iterations/iteration-006.md:27] [INFERENCE: do not enlarge gold with defaults] |
| Indexes become unresolved typed resources | High / High | Broad navigation has unresolved > 0; separate navigation and deny indexes from pairs. [SOURCE: research/iterations/iteration-006.md:25] [INFERENCE: navigation docs are loadable but not identities] |
| Map drifts after file change | Medium / High | Partition differs from `35 + 18`; require explicit intentional-unmapped review. [SOURCE: research/iterations/iteration-006.md:20-23] [INFERENCE: additions matter as much as deletions] |
| Specificity suppresses real ambiguity | Medium / Medium | Equal-specificity fixture returns one intent; test exact/generic and exact/exact ties separately. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:272-298] [INFERENCE: specificity changes only cross-class ties] |
| Typed gold precedes router contract | Medium / High | Missing contract or excluded rows; stage A7 after A3-A6. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1215-1228] [INFERENCE: oracle must describe reachable behavior] |
| Aggregate hides topology exclusions | Medium / High | Scenario count drops; gate counts, exclusions, errors, recall, and D3 separately. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287-1299] [INFERENCE: denominator integrity precedes score comparison] |

## Ruled Out
- Treating support defaults as selected typed leaves or copying them into all 23 gold rows.
- Letting compatibility `resources` remain the sole source for benchmark contract inference.
- Landing typed gold or full-inventory behavior before producer/consumer seams are green.

## Dead Ends
- Aliases, parent-hub conversion, package-index leaves, selector identities, and a second active `RESOURCE_DOMAINS` authority remain blocked.
- A single aggregate threshold cannot replace A0-A9 because typed migration changes the oracle and dimensions.

## Edge Cases
- Ambiguous input: “Broad inventory” can mean navigation or complete enumeration; navigation and `FULL_INVENTORY` now have separate outputs/tests.
- Contradictory evidence: Legacy parity wants defaults/indexes visible in `resources`, while typed precision rejects treating them as selected leaves; the four-channel model preserves both.
- Missing dependencies: No authorized baseline report, real manifest, or typed report exists; A0/A9 are execution gates, not claimed results.
- Partial success: None; the requested research matrix and risk boundary are complete, while implementation remains out of scope.

## Sources Consulted
- `.opencode/agents/deep-research.md:24-313`
- `research/prompts/iteration-7.md:1-40`
- `research/iterations/iteration-005.md:1-108`
- `research/iterations/iteration-006.md:1-72`
- `.opencode/skills/system-code-graph/SKILL.md:57-306`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:37-286`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1160-1369`

## Assessment
- New information ratio: 0.80 (2 of 5 findings fully new and 3 partially new; `(2 + 0.5*3)/5 + 0.10` simplicity bonus = `0.80`).
- Questions addressed: selector-to-path breakage; parity/attribution tests; atomic versus staged changes; dependency-ordered optimizations.
- Questions answered: all three forced-depth questions and the dependency-order optimization question.

## Reflection
- What worked and why: Crossing heterogeneous legacy `resources` with typed precision exposed the missing support/navigation boundary and made atomic seams derivable.
- What did not work and why: Numeric baseline generation remains outside the three-artifact boundary and was not simulated.
- What I would do differently: Encode A0-A9 as named test groups while keeping production comments free of packet-local IDs.

## Recommended Next Focus
Synthesize the resource map and implementation handoff around A0-A9, carrying the four-channel contract and three atomic seams; do not reopen settled identity/root/index/scenario decisions without contradictory implementation evidence.
