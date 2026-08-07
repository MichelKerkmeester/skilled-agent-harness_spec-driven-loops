# Root-Level Skill Metadata JSON Contract Research

## 1. Executive Summary

The 12 `.opencode/skills/` roots implement two consumer-defined classes, not eight independent presence patterns:

- **H: packet hubs** require root `SKILL.md`, `graph-metadata.json`, `description.json`, `mode-registry.json`, `hub-router.json`, and the generated `leaf-manifest.json` used by all seven current hubs.
- **S: standalone routed-resource skills** require root `SKILL.md`, `graph-metadata.json`, authored `leaf-manifest.config.json`, generated `leaf-manifest.json`, and authored `leaf-aliases.json` where current untyped replay needs an explicit workflow-mode mapping. All five current S roots have that replay requirement.

Seven roots conform to H. Four roots conform to S. `sk-git` is not a legitimate sparse third class: it behaves as an S router but lacks config, manifest, and aliases, making it the fleet's most non-conforming skill root. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-147] [SOURCE: .opencode/skills/sk-git/SKILL.md:42-95] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-71]

The phrase “five graph-only skills” is inaccurate. Five roots have `graph-metadata.json` without `description.json`; only `sk-git` is literally graph-only among the eight researched JSON types. The other four are conforming S roots. Adding `description.json` to those S roots would not directly change current advisor scoring because production advisor ingestion reads skill-shaped graph metadata, not root descriptions. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:946-1099] [INFERENCE: targeted production advisor searches found no skill-root `description.json` reader]

`leaf-aliases.json` is a durable authored compatibility contract and should not fold into registry/config. `command-metadata.json` should remain a documented `sk-design` extension: its current readers do not discover N skill roots, and generic command ownership is already represented in hub registries. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-180] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-65]

## 2. Scope and Method

Scope was limited to direct-child files named `description.json`, `graph-metadata.json`, `leaf-manifest.json`, `leaf-aliases.json`, `leaf-manifest.config.json`, `mode-registry.json`, `hub-router.json`, and `command-metadata.json` under the 12 skill roots. Nested packet/mode files were used only as producer or consumer evidence. Same-named files under `.opencode/specs/` were excluded because they implement a separate continuity schema.

Five focused iterations established: exact presence and producers; schemas and consumers for hub files; schemas and consumers for leaf/command files; consumer-derived classes and exceptional cases; canonical documentation, automation, and fleet enforcement. Exact Glob/Grep/Read evidence was used because the code graph was empty.

## 3. Fleet Census

| Skill root | description | graph | manifest | manifest config | aliases | registry | router | command metadata |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `cli-external-orchestration` | Y | Y | Y | - | - | Y | Y | - |
| `mcp-code-mode` | - | Y | Y | Y | Y | - | - | - |
| `mcp-tooling` | Y | Y | Y | - | - | Y | Y | - |
| `sk-code` | Y | Y | Y | - | - | Y | Y | - |
| `sk-design` | Y | Y | Y | - | - | Y | Y | Y |
| `sk-doc` | Y | Y | Y | - | Y | Y | Y | - |
| `sk-git` | - | Y | - | - | - | - | - | - |
| `sk-prompt` | Y | Y | Y | - | - | Y | Y | - |
| `system-code-graph` | - | Y | Y | Y | Y | - | - | - |
| `system-deep-loop` | Y | Y | Y | - | - | Y | Y | - |
| `system-skill-advisor` | - | Y | Y | Y | Y | - | - | - |
| `system-spec-kit` | - | Y | Y | Y | Y | - | - | - |

Fleet totals are description 7/12, graph 12/12, manifest 11/12, manifest config 4/12, aliases 5/12, registry 7/12, router 7/12, and command metadata 1/12. [INFERENCE: exact direct-child inventory recorded in `iterations/iteration-001.md:13-30`]

## 4. Consumer-Derived Class Taxonomy

| Root | Class | Required file set | Classification |
|---|---|---|---|
| `cli-external-orchestration` | H | SKILL, graph, description, registry, router, manifest | conforming |
| `mcp-code-mode` | S | SKILL, graph, config, manifest, aliases | conforming |
| `mcp-tooling` | H | SKILL, graph, description, registry, router, manifest | conforming |
| `sk-code` | H | SKILL, graph, description, registry, router, manifest | conforming |
| `sk-design` | H | SKILL, graph, description, registry, router, manifest | conforming; design command overlay |
| `sk-doc` | H | SKILL, graph, description, registry, router, manifest | conforming; shared-resource aliases |
| `sk-git` | S | SKILL, graph, config, manifest, aliases | defective: config, manifest, aliases missing |
| `sk-prompt` | H | SKILL, graph, description, registry, router, manifest | conforming |
| `system-code-graph` | S | SKILL, graph, config, manifest, aliases | conforming |
| `system-deep-loop` | H | SKILL, graph, description, registry, router, manifest | conforming; registry-owned commands |
| `system-skill-advisor` | S | SKILL, graph, config, manifest, aliases | conforming |
| `system-spec-kit` | S | SKILL, graph, config, manifest, aliases | conforming; commands do not imply command metadata |

H exists because packet registries and routers are consumed as a coupled declaration and hubs are subject to doctor identity/description checks. S exists because the manifest generator accepts a one-mode config instead of a registry. The class discriminator should be the complete registry/router pair: both means H, neither means S, and exactly one means invalid partial metadata. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:252-321] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127]

## 5. Producers and Ownership

| File | Producer/owner | Mutability |
|---|---|---|
| `description.json` | `init_skill.py --kind parent` scaffold | authored after scaffold; semantic text cannot be blindly backfilled |
| `graph-metadata.json` | parent scaffold today; standalone graph is authored | authored identity/scoring input; standalone initializer should gain a scaffold |
| `mode-registry.json` | parent scaffold | authored packet source of truth |
| `hub-router.json` | parent scaffold | authored routing policy |
| `leaf-manifest.config.json` | no writer; explicit standalone input | authored |
| `leaf-aliases.json` | no writer; explicit compatibility mapping | authored |
| `leaf-manifest.json` | `generate-leaf-manifest.cjs --write` | deterministic generated output; safely backfillable |
| `command-metadata.json` | hand-authored in introduction commit `2aa5fcff4a` | authored `sk-design` extension |

The parent scaffold writes description, graph, registry, and router together. The manifest generator is the sole deterministic writer among the eight file types. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:528-553] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:173-240]

## 6. Schemas

### `description.json`

Doctor requires `name`, `description`, `version`, and array-valued `keywords`; `modes` and `backend_kinds` are forbidden duplicate registry truth. Scaffold fields such as `importance_tier`, `trigger_examples`, and `lastUpdated` are recommended but not all doctor-required. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1020-1045] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-description-template.json:1-32]

### `graph-metadata.json`

Skill identity is discriminated by `skill_id`, `family`, or `edges`. Supported schema versions are 1 and 2; `skill_id` must match the folder, and family, category, domains, intent signals, derived data, and typed edges are validated. That content discriminator prevents spec-folder continuity metadata from entering skill-advisor ingestion. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:753-828] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:960-979]

### `mode-registry.json`

The root object owns `modes[]`; each mode carries `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, packet/name identity, aliases, `advisorRouting`, and declared extensions. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-registry-template.json:1-164]

### `hub-router.json`

Required top-level fields are `skill`, `version`, `routerPolicy`, `routerSignals`, and `vocabularyClasses`. Signal keys must match registry modes; classes/resources must resolve; tie-break must be a mode permutation; outcomes/default mode must conform. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-hub-router-schema.md:21-57] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-hub-router-schema.md:160-178]

### `leaf-manifest.config.json`

Requires a non-empty `workflowMode`; optional `packet` defaults to `.`, `leafRoots` defaults to `references`/`assets` and is restricted to four legal roots, `excludeIndexFiles` defaults true, and contract version defaults to 1. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127]

### `leaf-aliases.json`

Accepts either an array or `{aliases:[...]}`. Each authored row is `{workflowMode, leafResourceId, diskPath}`, and `diskPath` must be contained under the skill root. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299]

### `leaf-manifest.json`

Contract version 1 is `{resourceContractVersion, modes[]}`. Modes contain `{workflowMode, packet, leaves[]}`. Leaves are deduplicated, sorted, packet-relative paths under the four legal roots; modes sort by workflow mode; canonical JSON recursively sorts keys, uses two spaces, and ends with one newline. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:51-69] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:316-364]

### `command-metadata.json`

The executable schema is embedded in the design command-surface validator: exactly two `/interface:*` records, 27 named top-level fields, registry-matching owner modes/bindings, typed nested argument/choreography/policy/output structures, unique commands/aliases, and graph consistency. There is no shared JSON Schema or generator. [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:306-415]

## 7. Consumer Inventory

| File | Production consumers | Validation/test consumers |
|---|---|---|
| description | parent scaffold/doctrine and doctor | parent-check mutation fixtures |
| graph | advisor graph parser/indexer and scorer projection; doctor; benchmark vocabulary sync | advisor graph/scorer and parent-check tests |
| registry | manifest generator; doctor; advisor executor delegation/projection; benchmark replay/vocabulary sync; compiled-routing compilers | compiled-manifest, doctor, benchmark fixtures |
| router | benchmark router projection/vocabulary sync; doctor; compiled-route manifest/compilers; hub SKILL routers | compiled-manifest and doctor fixtures |
| manifest | doctor; fleet freshness CI; benchmark replay/playbook loader; compiled routing; topology/scenario validators | doctor guard, alias dual-read, routing-contract, compiled parity tests |
| manifest config | manifest generator directly; doctor/CI indirectly through regeneration | minimal accepted fixtures and generator tests |
| aliases | manifest generator; doctor resolution; benchmark replay | alias dual-read and routing-contract tests |
| command metadata | design command-surface validator | validator unit test, interface contract test, benchmark test, fixed-four-hub command-binding test |

Key call sites include the advisor graph indexer [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:946-1133], executor delegation [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-180], parent doctor [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:252-411] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:803-1233], benchmark replay/loaders [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:127-289] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:607-658], and compiled routing [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:400-434].

Tests verify consumers rather than becoming production consumers. Representative suites include parent fixture mutation tests [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/parent-skill-check-fixtures.vitest.ts:53-105], compiled manifest failure tests [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:49-79] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:191-229], doctor leaf guards [SOURCE: .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs:178-272], and benchmark leaf routing [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-doc-leaf-routing-contract.vitest.ts:84-159].

## 8. Description Backfill and Advisor Routing

`graph-metadata.json` is the advisor's root identity/scoring input. It supplies domains, intent signals, derived metadata, and graph edges persisted to SQLite. No production advisor read of skill-root `description.json` was found. Backfilling description on `mcp-code-mode`, `system-code-graph`, `system-skill-advisor`, or `system-spec-kit` therefore cannot directly shift current advisor routing; it would add unused duplicate prose and violate the proposed S forbidden-file rule. `sk-git` likewise does not need description. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:1037-1099] [INFERENCE: targeted production advisor search found graph/registry consumers but no root-description consumer]

## 9. Alias Contract Decision

Aliases must remain authored. Registry aliases identify modes, and standalone config identifies one mode/root set; neither expresses the three-way legacy mapping from raw resource identity to workflow mode and disk path. The resolver explicitly refuses to infer shared ownership. Hubs need aliases only for explicit relocated/shared compatibility. Current S roots need same-path mappings to attach a workflow mode to untyped replay input. Folding aliases into registry/config would either lose compatibility identity or silently infer policy. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:204-260]

## 10. Command Metadata Decision

Keep `command-metadata.json` `sk-design`-specific. Five direct reader files form four logical surfaces:

1. The design validator plus its unit test derive the enclosing `sk-design` root. [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:8-40] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:20-59]
2. The interface command contract test derives the same root. [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:5-49]
3. The skill benchmark test hardcodes `SKDESIGN`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:343-361]
4. The command-binding test loops a fixed four-hub allowlist, not N roots. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-65]

None handles arbitrary command-owning skills. `sk-doc` and `system-deep-loop` already declare commands in their registries; `system-spec-kit` is S and is excluded by the fixed hub test. Generalization requires a new shared schema and production consumer, not copying a design-specific singleton. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:20-76] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:35-76]

## 11. Canonical Contract and Enforcement

Canonical prose should live at `sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`, linked from `references/README.md` and both shape workflows in `create-skill/SKILL.md`. Parent companion policy should project that shared authority rather than redefine it. [SOURCE: .opencode/skills/sk-doc/create-skill/references/README.md:37-50] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:200-218] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:240-269]

A pure `scripts/lib/skill-root-metadata-contract.cjs` should own filenames, H/S classification, required/forbidden sets, and overlay predicates. This mirrors the existing split between filesystem generation and pure leaf normalization. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:26-28] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs:140-177]

The fleet gate must:

1. Discover every direct child skill root from root `SKILL.md`, before looking for generated outputs.
2. Require and validate one root skill-shaped graph identity; reject nested graph/description identities and never scan `.opencode/specs/`.
3. Classify H from a complete registry/router pair and S from neither; fail XOR/unknown roots.
4. Enforce required and forbidden files plus explicit overlays.
5. Dispatch each file to its schema owner.
6. Regenerate every class-required manifest even when absent; fail missing output or byte drift; allow `--fix` to write only manifests.
7. Emit stable JSON and fail on unclassified roots, missing/forbidden files, malformed schemas, nested identities, regeneration errors, or stale bytes.

The current freshness scanner starts from existing manifests, so it cannot detect a missing required manifest. Doctor guard 10 and benchmark replay similarly opt in only when manifests exist; package validation identifies a parent from registry presence alone. All must be fronted by the shared classifier. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-91] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1063-1081] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py:200-247] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:204-238]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Count nested packet JSON as fleet metadata | Scope is direct root contracts; nested identities are validation evidence only | direct-child census | 1 |
| Treat every filename mention as a consumer | Specs/docs/fixtures overwhelmed exact searches; executable reads define consumers | owner-scoped consumer traces | 2-3 |
| Treat descriptions as advisor inputs | No production advisor reader found; graph metadata drives scoring | advisor graph indexer | 2,4 |
| Treat manifests as authored truth | Generator canonicalizes bytes and CI/doctor regenerate | manifest generator/freshness gate | 1,3 |
| Fold aliases into registry/config | Neither carries workflow/resource/disk compatibility triples | leaf-resource contract | 3-4 |
| Generalize command metadata from command ownership | Current schema and production validation are design-specific; registries already own generic commands | design validator and registries | 3-5 |
| Create a sparse `sk-git` class | `sk-git` exposes the same routed resource behavior as S and is simply missing required leaf files | `sk-git` router/corpus | 4-5 |
| Extend only the manifest-first scanner | A scanner beginning from outputs cannot detect missing outputs | current CI discovery | 4-5 |
| Generate all eight files | Seven carry authored semantic identity, policy, or compatibility data | producer/ownership matrix | 5 |

## Divergence Map

No divergent pivots ran. Saturated directions were the eliminated alternatives above. The remaining implementation frontier is fixture-first validation of the H/S classifier and gate; it is outside this report-only research scope.

## 12. Open Questions

No key research questions remain. Implementation must still determine rollout sequencing and whether the proposed S alias requirement should eventually become capability-conditional after typed replay removes every current raw-string dependency.

## 13. Verification Plan

Add table-driven fixtures for all 12 mappings; missing S config/manifest/aliases; missing H description/router; XOR registry/router; stale manifest bytes; malformed each file type; forbidden H config/S hub files; nested identities; unknown roots; and command-overlay misuse. Retain deterministic-byte and doctor guard tests. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs:140-177] [SOURCE: .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs:175-272]

Run the class gate as a doctor fleet entry point, an explicit CI command, package-validation preflight, and benchmark D5 preflight. No current package script was found wiring the manifest freshness command, so CI wiring must be explicit. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/README.md:28-38] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:479-519]

## 14. Convergence Report

- Stop reason: `converged` via all key questions answered
- Total iterations: 5 of 10 maximum
- Questions answered: 5/5
- Remaining questions: 0
- Ratios: `1.00 -> 1.00 -> 1.00 -> 0.80 -> 0.90`
- Convergence threshold: `0.05`
- Minimum iteration floor: 3, passed
- Quality guards: source diversity passed; focus alignment passed; no weak single-source dominance detected
- The loop stopped on evidence-backed question completion, not low-novelty threshold crossing.

## 15. Recommended Implementation Order

1. Freeze H/S and overlay fixtures in the proposed pure contract library.
2. Add class-first root discovery and stable JSON output.
3. Reuse existing schema owners and manifest regeneration.
4. Integrate doctor and package validation.
5. Wire CI and benchmark D5 preflights.
6. Backfill only deterministic manifests automatically; require review for authored inputs.
7. Correct command-metadata doctrine and remediate `sk-git` as a separate implementation change.

## 16. Limitations

- Code graph evidence was unavailable; all claims were verified by exact local file search and reads.
- Git history was used only to identify the initial `command-metadata.json` authoring commit.
- No fixes or backfills were executed.
- The proposed gate and class library are designs, not implemented behavior.

## 17. References

- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py`
- `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-hub-router-schema.md`
- `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`
- Iteration evidence in `iterations/iteration-001.md` through `iteration-005.md`
