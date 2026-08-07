# Skill And Advisor JSON Optimization Research - sol-high

## 1. Executive Summary

The fleet is structurally healthy but not lifecycle-complete. All 11 current skill roots satisfy the H/S presence contract, and their generated manifests are byte-fresh; the largest gaps are therefore not missing files but conflicting source-of-truth definitions, incomplete create-to-route automation, and untested integration seams. [SOURCE: .opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:47-69] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:372-412]

The highest-leverage opportunity is to establish one canonical `graph-metadata.json.derived` schema and one production lifecycle owner. The TypeScript sync schema writes `keywords` plus provenance/lifecycle fields, the Python compiler requires `key_topics`, `entities`, `causal_summary`, and legacy timestamps, and the scorer consumes the Python-style vocabulary rather than the TypeScript writer's `keywords`. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts:35-55] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:300-325] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:658-685]

The second opportunity is to close the creation and integration journey. `init_skill.py` leaves required generated artifacts to a later manual step, the fleet gate does not prove advisor ingestibility, and no test joins scaffold, generated gate, advisor root selection, and compiled hub-mode routing. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:321-340] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:583-665] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:222-235] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/discovery-pipeline-parity.vitest.ts:47-85]

The third opportunity is effectiveness at the parent-selection boundary. Rich mode-registry/router vocabulary is compiled only after a parent hub wins, while normal root scoring consumes `SKILL.md` and graph projection fields. High-specificity mode language can therefore miss the correct parent before the compiled route runs. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:173-247] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:173-185] [SOURCE: .opencode/skills/sk-doc/hub-router.json:36-49]

## 2. Scope And Method

This five-iteration lineage covered inventory/current state, optimization, automation gaps, effectiveness, and testing/integration. It inspected all eight governed root JSON filenames, advisor graph/index and watcher projections, compiled route manifests, scaffolding/generation scripts, and their test/CI surfaces. Every evidence finding was recorded in one write-once iteration file and one structured delta, and all five mechanical route-proof gates passed.

No fixes were implemented, scorer weights were not redesigned, and the H/S class contract was treated as fixed. The research used checked-in source and tests plus targeted read-only fleet/advisor probes; sibling lineage artifacts were not used as evidence.

## 3. Inventory And Current State

| Surface | Class/role | Authorship | Current automation |
|---|---|---|---|
| `graph-metadata.json` | H and S root identity | Authored, with intended generated `derived` projection | Advisor compiler/sync paths exist but disagree on schema. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs:73-87] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:92-138] |
| `description.json` | H identity projection | Authored | Required/presence-validated; only four fields are enforced by the parent checker. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1022-1044] |
| `mode-registry.json` | H mode and delegation policy | Authored | Scaffolder seed, parent validation, and compiled-route input. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:453-572] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:391-424] |
| `hub-router.json` | H weighted routing policy | Authored | Scaffolder seed, parent validation, and compiled-route input. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:453-572] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:391-424] |
| `command-metadata.json` | H command ownership/choreography | Authored | Strong schema and root-gate validation. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:7-34] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:254-302] |
| `leaf-manifest.config.json` | S manifest-generation input | Authored | Generator supplies several defaults but the file remains required. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] |
| `leaf-manifest.json` | H and S leaf projection | Generated | Deterministic generation and byte freshness; root gate discovers missing adoption. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:173-208] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:74-86] |
| `leaf-aliases.json` | H relocation overlay or S identity projection | H optional/authored; S generated | Root gate preserves H overlays and deterministically creates S aliases. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:205-249] |
| Compiled activation `manifest.json` | Per-hub serving projection | Generated | Mint, freshness, lease, atomic refresh, generation, and serving-state preservation. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:600-637] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:650-753] |
| SQLite skill graph/index | Advisor runtime projection | Generated | Watcher/indexer ingest `graph-metadata.json` and associated paths. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:228-252] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:952-970] |

Seven direct roots are H and four are S. The root fleet gate currently reports all 11 compliant, so opportunity ranking should prioritize semantic ownership and lifecycle integration over file-presence remediation. [SOURCE: .opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:47-52] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:372-412]

## 4. Optimization Findings

1. `derived` schema v2 has incompatible TypeScript and Python definitions. This is the most dangerous drift surface because both claim schema ownership and the active scorer reads only part of their union. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts:35-55] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:300-325] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:658-685]
2. `routerPolicy.tieBreak` is a confirmed duplicate that has already drifted from the order the compiler actually derives from `routerSignals`. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-13] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:188-195]
3. Nested `advisorRouting.packetSkillName` duplicates the top-level packet identity; production delegation consumes the top-level field, while the nested copy has no verified production reader. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:19-40] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-174]
4. Standalone aliases persist identity mappings already derivable from manifests, while H aliases remain load-bearing for relocation. Optimization must be class-specific rather than deleting the common filename. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:205-249] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:249-277]
5. H `description.json` contains fields beyond the four-field identity checked in-repository. Those extras are candidates for external-consumer verification, not immediate deletion. [SOURCE: .opencode/skills/sk-doc/description.json:2-51] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1022-1044]

## 5. Automation Findings

1. New scaffolds do not complete the generated-file contract. Standalone creation omits the required manifest and aliases; parent creation omits its manifest; neither path invokes the canonical fleet producer before handoff. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:321-340] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:583-665] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:323-357]
2. `syncDerivedMetadata()` has deterministic, atomic behavior but no verified production invocation; watcher changes reindex rather than regenerate. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:92-145] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:425-426]
3. The root fleet gate validates class projections but not complete advisor graph ingestibility, edge targets, derived paths, or the canonical derived schema. The Python compiler validates those separately, leaving a green-root/downstream-failure seam. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:98-140] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:306-396]
4. S manifest config repeats conventional defaults that the generator already knows; defaults-plus-overrides could preserve policy while reducing mandatory hand synchronization. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:295-308] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127]
5. Compiled-route publication mechanics are automated, but registry/router source changes have no fleet-integrated freshness and explicit refresh owner in the routing drift workflow. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:650-753] [SOURCE: .github/workflows/routing-registry-drift.yml:109-110]

## 6. Effectiveness Findings

Normal root scoring consumes `SKILL.md` identity/description/keywords and graph domains, intent signals, derived terms, lifecycle, and edges. Hub `description.json`, mode registries, routers, leaf manifests, and aliases are not normal root-selection inputs. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:173-247] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts:315-343] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts:54-96]

The live lane registry gives authored exact signals the strongest metadata weight, followed by lexical, graph, and derived lanes. This makes complete, specific authored parent intent signals more load-bearing than descriptive hub JSON that never enters projection. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lane-registry.ts:8-13]

Rich per-mode vocabulary is compiled after the parent wins. Distinctive phrases present only in router/mode data cannot help root selection, so an automated high-specificity parent projection is the highest-value effectiveness improvement that stays within the existing scorer design. [SOURCE: .opencode/skills/sk-doc/hub-router.json:36-49] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:173-185]

Watcher effectiveness is incomplete: changes to a watched derived key file call the graph indexer, but the indexer hashes `graph-metadata.json` and skips unchanged metadata. A watch event can therefore perform work without changing candidate content. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:425-426] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:1071-1085]

Filesystem fallback preserves basic root text and derived fields but drops graph edges and document triggers, so availability does not imply effectiveness parity. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:563-720] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/derived.ts:21-71]

Executor delegation deliberately bypasses normal root selection and reads mode-registry aliases, but its workspace-keyed alias bundle lacks source-change invalidation. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-208] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:435-499]

## 7. Testing And Integration Findings

Stage-local tests are substantive. Generated manifests/aliases, command ownership, compiled freshness, atomic refresh, locking, rollback, and runtime fail-safe behavior have output/failure assertions rather than fixture-presence checks. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:296-359] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:406-479] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:967-1082]

No test joins scaffold, generated root gate, advisor ingest, advisor parent selection, and compiled mode selection. Each stage starts from an independent fixture or already-written artifact. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:222-235] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/discovery-pipeline-parity.vitest.ts:47-85] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:276-364]

Fallback tests assert source labels, reasons, warnings, and skill availability, but not recommendation or lane parity against SQLite. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-fallback-049-005.vitest.ts:45-106]

Compiled manifests have strong every-input invalidation coverage, but watcher key-file projection and delegation alias-cache invalidation lack equivalent mutation tests. [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:323-364] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:1118-1162] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/daemon-watcher-resource-leaks-049-005.vitest.ts:283-312]

The sk-doc canary behaviorally covers all command forms but only two positive natural-language routes; the advisor regression corpus has one generic sk-doc case, so no joined natural-language case proves every mode first selects the parent and then the intended compiled route. [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json:5-23] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/fixtures/skill-advisor-regression-cases.jsonl:30]

## 8. Lifecycle Integration Map

```text
init_skill.py
  -> authored H/S root JSON
  -> generated manifest / S aliases
  -> root fleet gate
  -> graph schema + ingest compiler
  -> watcher / SQLite projection
  -> advisor root selection
  -> compiled hub route
  -> executor or command dispatch
```

The first broken ownership seam is scaffold to generated projection; the second is root gate to advisor ingest; the third is watched source change to graph projection; the fourth is parent selection to compiled mode coverage. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:321-340] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:305-357] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:425-426] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:4-15]

## 9. Ranked Opportunity Map

| Rank | Opportunity | Dimensions | Leverage | Evidence |
|---:|---|---|---|---|
| 1 | Canonicalize `derived` v2 and assign one create/change/rebuild owner | Optimization, automation, effectiveness, integration | Very high: prevents schema-valid data loss and aligns generated vocabulary with the scorer | [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts:35-55] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:300-325] |
| 2 | Make scaffold-to-generated-gate-to-advisor-ingest one verified journey | Automation, testing, integration | Very high: closes incomplete-root and green-root/downstream-failure seams | [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:321-340] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:306-396] |
| 3 | Generate/validate high-specificity parent intent projection from mode vocabulary | Effectiveness, automation | High: activates existing authored mode intent before parent selection without changing scoring | [SOURCE: .opencode/skills/sk-doc/hub-router.json:36-49] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:173-247] |
| 4 | Add source-change invalidation for watched derived files and executor delegation caches | Effectiveness, testing, integration | High: makes edits effective without process restart or unrelated metadata rewrites | [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:1071-1085] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:435-499] |
| 5 | Add joined natural-language parent-to-mode cases for every hub mode | Testing, effectiveness | High: directly catches the observed activation boundary that command canaries miss | [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json:5-23] |
| 6 | Select one authority for tie-break order and packet identity; generate secondary projections | Optimization, automation | Medium-high: removes already-drifted and unconsumed duplicates | [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:188-195] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-174] |
| 7 | Add one canonical full graph-schema/ingest CI gate | Testing, integration | Medium-high: prevents root-contract success from hiding advisor compiler rejection | [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:98-140] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:306-396] |
| 8 | Convert S manifest configuration and identity aliases to defaults/derived projections where consumers permit | Optimization, automation | Medium: reduces hand-authored boilerplate while preserving H relocation policy | [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:205-249] |
| 9 | Add explicit SQLite/filesystem expected-degradation parity tests | Testing, effectiveness | Medium: turns silent channel loss into a governed fallback contract | [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-fallback-049-005.vitest.ts:45-106] |
| 10 | Retire duplicate output-first freshness and review unconsumed description extras after coverage/external-consumer migration | Optimization, testing | Lower: reduces maintenance noise after stronger gates own adoption and field retention | [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-84] [SOURCE: .opencode/skills/sk-doc/description.json:2-51] |

## 10. Prioritization Rationale

Ranks 1-2 address correctness and lifecycle ownership across multiple surfaces. Rank 3 addresses route quality using data already authored in the system. Ranks 4-5 make source edits and natural language behavior observable. Ranks 6-10 reduce drift and maintenance after the primary contract and integration boundaries are stable.

The ordering deliberately does not prioritize removing every duplicate field. Several apparent duplicates are load-bearing consumer projections: compiled manifests preserve serving authority, command metadata carries choreography, H aliases carry relocation, and explicit mismatch flags carry validator policy. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:650-735] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:7-34] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:409-425]

## 11. Recommendations

1. Treat canonical derived-schema ownership as the prerequisite for any field trimming or automatic parent projection.
2. Design one synthetic hub fixture that survives the entire create-to-route journey and supports both happy-path and seam-failure scenarios.
3. Keep human policy authored: mode semantics, weighted vocabulary, graph relationships, relocation aliases, command choreography, and serving authority.
4. Generate or reconcile only deterministic identity/projection fields after naming their source of truth.
5. Version routing evaluation numbers with exact corpus hashes; do not merge contradictory baseline narratives into one current accuracy claim. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:90-102] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation-baselines.md:43-59]

## 12. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iterations |
|---|---|---|---:|
| Use spec-folder description/graph generators for skill-root identity | Same filenames carry separate continuity and advisor identity schemas | [SOURCE: .opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:32] | 1, 3 |
| Delete compiled activation manifests as duplicate JSON | They preserve serving authority, policy generation, and atomic activation state | [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:650-735] | 2 |
| Collapse command metadata into mode registries without projection | Both serve distinct, verified consumers | [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:7-34] | 2 |
| Generate all H routing policy from folders | Weighted vocabulary, graph meaning, aliases, choreography, and authority are not derivable boilerplate | [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs:125-152] | 3 |
| Fix activation misses by changing lane weights | Missing mode intent is upstream of fusion and invisible until parent selection | [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lane-registry.ts:8-13] [SOURCE: .opencode/skills/sk-doc/hub-router.json:36-49] | 4 |
| Treat fixture presence as coverage | Existing stage tests assert behavior; the actual gap is semantic breadth and joined lifecycle seams | [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:455-479] | 5 |

## 13. Divergence Map

- Saturated directions: fleet inventory, field/consumer tracing, scaffold/generator ownership, metadata effectiveness, and stage-local versus joined testing.
- Productive pivots: filename inventory to consumer tracing; consumer tracing to lifecycle ownership; lifecycle ownership to phrase-level activation; activation to joined test scenarios.
- Failed pivots: none required.
- Remaining frontier: external consumers of optional H description fields and cross-hub breadth beyond the sk-doc worked example.

## 14. Open Questions

1. Do external runtime/package consumers use `description.json.trigger_examples`, `supported_surfaces`, or `opencode_languages`? The repository proves no verified local consumer, not universal non-use. [SOURCE: .opencode/skills/sk-doc/description.json:2-51]
2. Which derived-v2 producer is intended to be authoritative: TypeScript sync, Python compiler, or a new shared schema package? Current checked-in code supports conflicting answers. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts:35-55] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:300-325]
3. Should filesystem fallback preserve graph/doc parity or explicitly advertise reduced-quality behavior as part of the public trust state? Current projection intentionally drops those channels. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:563-720]

## 15. Risks And Constraints

- The H/S class split is structurally sound and was not redesigned.
- Generated-file freshness is healthy today; changing ownership without migration tests could regress a green fleet.
- Compiled routing and advisor root selection are separate stages; changes that conflate them can create hidden coupling.
- Baseline accuracy claims are version-sensitive and contradictory across checked-in sources, so this report does not state one current global percentage. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/scorer-eval-baseline.json:14-34] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation-baselines.md:43-59]

## 16. References

- Full source map: `resource-map.md`
- Inventory evidence: `iterations/iteration-001.md`
- Optimization evidence: `iterations/iteration-002.md`
- Automation evidence: `iterations/iteration-003.md`
- Effectiveness evidence: `iterations/iteration-004.md`
- Testing/integration evidence: `iterations/iteration-005.md`
- Structured findings: `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl`

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Stop policy: `max-iterations`; convergence telemetry never stopped the loop early
- Total iterations: 5/5
- Questions answered: 5/5
- Findings recorded: 30
- newInfoRatio trend: 1.00 -> 0.92 -> 0.83 -> 0.92 -> 0.92
- Mean newInfoRatio: 0.918
- Final three-iteration mean: 0.89
- Quality guards: source diversity passed; all five focus dimensions aligned; no final finding relies on one uncited weak source
- Result: the loop reached the hard iteration cap with a complete ranked opportunity map and no implementation changes
