# Iteration 9: Final implementability review and acceptance matrix

## Focus

Consolidate the complete sk-doc routing fix list into an implementation-ready handoff: one canonical normalization/generation contract, exactly one owner and one test layer per guard, the smallest safe mutation set, and row-level acceptance criteria for all 19 benchmark scenarios while preserving the two clean rows and current D5=100.

## Actions Taken

1. Re-read state, strategy, registry, and iterations 6-8; retained the settled `(workflowMode, leafResourceId)` namespace and did not re-enter saturated directions.
2. Re-verified the hub seams in `mode-registry.json`, `hub-router.json`, and `parent-skill-check.cjs`.
3. Re-verified the benchmark handoff from playbook loading through replay, dispatch, scoring, D5, and reporting.
4. Joined the 19-row loss classification to the proposed contract and produced an owner matrix, minimum file set, dependency order, and acceptance matrix.

## Findings

### 1. One shared library owns typed leaf and path semantics

Add a generic parent-hub resource-contract library under the sk-doc create-skill tooling, e.g. `create-skill/scripts/lib/leaf-resource-contract.cjs`. It owns pure operations only: normalize `workflowMode`; normalize and validate packet-local `leafResourceId`; form/parse composite keys; resolve a hub-contained target; canonical-sort entries; build canonical JSON bytes; compute source digests; and validate aliases, collisions, targets, and selected-pair reachability. The manifest CLI, parent checker, router replay, and benchmark preflight call this library instead of copying path rules. [SOURCE: file:.opencode/skills/sk-doc/mode-registry.json:18] [SOURCE: file:.opencode/commands/doctor/scripts/parent-skill-check.cjs:693] [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:396]

Keep orchestration outside it. A thin `generate-leaf-manifest.cjs` owns `--write`/`--check`; the parent checker owns hub enforcement; benchmark modules own fixture attribution, dispatch snapshots, scoring, and reports. Reverse physical-path lookup remains forbidden because many public pairs may legally share one target. [SOURCE: file:.opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-008.md:22] [SOURCE: file:.opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-008.md:59]

### 2. One owner and one test layer per guard

| Guard | Authoritative owner | Single test layer | Required assertion |
|---|---|---|---|
| Typed syntax, separators, containment, case-fold collisions, many-to-one aliases | `leaf-resource-contract.cjs` | Contract unit suite | Table-driven valid/invalid pairs and path/symlink escape fixtures |
| Byte-stable generation, digest, write/check, entry diff | `generate-leaf-manifest.cjs` using the library | Same contract unit suite | Registry/filesystem permutations are byte-identical; stale output fails without repair |
| Registry + alias + manifest targets/collisions + bidirectional reachability | `parent-skill-check.cjs` | Parent-check integration suite | Ordered guard codes; no duplicate normalization |
| Fixture schema, manifest resolution, selected-map join | New `validate-playbook-topology.cjs` using the library | Benchmark preflight integration suite | Invalid oracle blocks before dispatch with schema/topology/selection class |
| Deterministic selected-map union and bundle cap | `router-replay.cjs` | Router-replay block in benchmark suite | Typed, selected-map-ordered output never expands to discovered inventory |
| Immutable topology snapshot | `run-skill-benchmark.cjs` | Runner integration block | Digest mutation yields `topology_changed_during_run`; no score |
| Contract errors vs valid misses; denominator exclusion | `score-skill-benchmark.cjs` | Scorer/report block | Contract error and routing miss are disjoint; invalid rows never affect aggregates |
| Existing structural D5 | `d5-connectivity.cjs`, unchanged | One sk-doc end-to-end assertion | D5 remains exactly 100 and gate stays open |

Do not independently add manifest semantics to D5. Parent validation and benchmark preflight enforce the new topology contract; D5 keeps its current structural-score ownership and baseline. [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:146] [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:300]

### 3. Smallest safe file set

| Domain | Add/change | Why |
|---|---|---|
| Canonical contract | Add `create-skill/scripts/lib/leaf-resource-contract.cjs` and `create-skill/scripts/generate-leaf-manifest.cjs` | One normalization/generation/validation implementation |
| Hub topology | Change `sk-doc/mode-registry.json` for `resourceContractVersion`; add authored `leaf-aliases.json`; add generated `leaf-manifest.json` | Separate public version, semantic aliases, and generated topology |
| Hub enforcement | Change `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Enforce source, drift, targets/collisions, and bidirectional reachability |
| Packet routing | Change only `create-quality-control`, `create-flowchart`, `create-feature-catalog`, `create-agent`, `create-command`, `create-manual-testing-playbook`, `create-readme`, `create-skill`, and `create-changelog` SKILL files | These nine packets own the failing-row maps; `create-benchmark` and `create-diff` have no failing row |
| Benchmark preflight | Add `validate-playbook-topology.cjs`; change loader and runner | Validate typed oracle before dispatch and snapshot digests |
| Replay/observation | Change `router-replay.cjs` and `executor-dispatch.cjs` | Preserve mode ownership; dual-read legacy; single-write typed pairs |
| Scoring/reporting | Change scorer and `build-report.cjs` | Separate topology/contract failures from misses and report excluded rows |
| Corpus | Change all 19 sk-doc scenario frontmatters | Fixtures own explicit `expected_workflow_mode` and canonical leaf gold; no sidecar oracle |
| Tests | Add one contract unit, one parent-check integration, and one benchmark integration/acceptance file | Each guard has one test layer; 19-row matrix asserted once |

`hub-router.json` needs no parallel leaf map: replay resolves its existing public mode, then evaluates the packet router under that owner. This also preserves separate keys for `create-skill` and `create-skill-parent` despite their shared packet. [SOURCE: file:.opencode/skills/sk-doc/mode-registry.json:18] [SOURCE: file:.opencode/skills/sk-doc/mode-registry.json:30]

### 4. Fixed dependency order

1. Land the pure contract library and unit tests.
2. Add contract version, aliases, generator, and committed manifest; prove reproducibility.
3. Wire the parent checker; topology drift must fail before benchmark work.
4. Migrate all 19 fixtures to typed gold and add pre-dispatch validation.
5. Make replay/dispatch emit canonical pairs with dual-read/single-write migration behavior.
6. Correct only the nine affected packet maps for missing leaves and bundle caps.
7. Add runner digest recheck, scorer taxonomy, report fields, and the 19-row acceptance suite.

Preflight belongs before the dispatch loop, not inside `scoreScenario`; the current runner dispatches before scoring. [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:137] [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:162]

### 5. Acceptance matrix

| Group | Scenarios | Required post-change result | Regression fence |
|---|---|---|---|
| Wrong-root fixed | SD-007, SD-009, SD-003, SD-016, SD-011, SD-020 | Valid legacy/typed observations resolve to expected composite pairs; recall 1; no contract error; reports write typed pairs | Prefixes work only through declared mode/alias, never generic stripping |
| Missing-leaf fixed | SD-013, SD-005, SD-004, SD-001, SD-010, SD-018 | Expected pair is valid, selected, observed, and has no routing miss | Missing alias/target blocks pre-dispatch instead of scoring zero recall |
| Over-bundle fixed | SD-015, SD-014, SD-006, SD-017, SD-002 | Observed pairs equal selected-map union; zero unexpected pairs; D3=1 when applicable; SD-015 exposes only its explicit full-inventory selection | Deduplicate by composite pair, not leaf or physical target |
| Clean preserved | SD-008 | D1-intra=1, D2=1, D3 N/A, same first-failing-stage state | No invented positive leaf requirement |
| Clean preserved | SD-012 | Recall and D1/D2/D3 stay 1; zero waste; same first-failing-stage state | Typed migration cannot reduce score |
| Structural baseline | Entire run | Fresh D5=100; gate open | Do not copy the old report value |
| Invalid oracle | Synthetic malformed/stale fixtures | Zero dispatch; class count increments; excluded from recall/precision/waste/fitted/aggregate denominators | Report fixture/topology/selection counts separately |
| Reproducibility | Permuted registry and enumeration | Identical manifest bytes/digest; check accepts only canonical committed bytes | No timestamps, mtimes, locale order, absolute paths, or host separators |

The group membership is the frozen 19-row classification: six wrong-root, six missing-leaf, five over-bundle, and two clean. D5 is currently 100 and must be rerun. [SOURCE: file:.opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-003.md:52] [SOURCE: file:.opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-003.md:85]

### 6. Typed pairs are the sole write format

Migration may dual-read legacy root-relative, packet-prefixed, and shared-prefixed strings, but manifest, replay observations, scored rows, and reports write `(workflowMode, leafResourceId)` only. A temporary legacy-read counter is allowed; bridge removal is later policy. Generic prefix stripping remains ruled out. [SOURCE: file:.opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-007.md:35]

## Questions Answered

- Generator, drift guard, and replay share one pure contract library; callers retain enforcement policy.
- Every guard has one owner and one test layer.
- The safe set excludes unaffected packet routers and leaves D5 semantics unchanged while covering every boundary.
- Acceptance covers 6 wrong-root, 6 missing-leaf, 5 over-bundle, 2 clean, invalid-oracle attribution, reproducibility, and D5=100.

## Questions Remaining

No research question remains. Iteration 10 is a consistency audit only: preserve this mapping in synthesis and name exact implementation test commands without expanding scope.

## Sources Consulted

- Current sk-doc registry, hub router, packet routing contracts, and parent checker.
- Benchmark loader, replay, dispatch boundary, runner, scorer, reporter, D5 scanner, and tests.
- Iterations 3 and 6-8.

## Assessment

- New information ratio: **0.44**.
- Novelty justification: adds the single-owner architecture, removes an unnecessary hub leaf-map change, bounds packet edits to nine routers, and makes row-level gates executable.
- Status: **complete** for implementability review.
- Confidence: high on ownership, order, row coverage, and D5 non-duplication; medium-high on exact new filenames, which are implementation choices.

## Reflection

What worked: tracing enforcement and benchmark seams separated shared semantics from caller policy. What failed: placing manifest semantics in D5 would duplicate guards and threaten the preserved baseline.

Ruled out: copied normalization; reverse physical lookup; a second leaf-selection map in `hub-router.json`; a sidecar oracle; generic prefix stripping; independent D5 manifest rules; edits to unaffected packet routers.

## SCOPE VIOLATIONS

- All production, fixture, and test mutations above are outside this iteration's write fence; none were made.
- Reducer-owned strategy, registry, dashboard, synthesis, config, and spec files were not modified.

## Next Focus

Iteration 10: final consistency audit against the full registry and synthesis inputs. Do not reopen settled directions; confirm exact test-command coverage and preserve the owner/file/acceptance matrix.

