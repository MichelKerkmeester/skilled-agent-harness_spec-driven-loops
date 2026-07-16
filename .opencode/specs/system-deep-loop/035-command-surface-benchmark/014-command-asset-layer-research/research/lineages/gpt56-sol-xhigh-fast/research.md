# Command Asset-Layer Research

## 1. Executive Synthesis

The 012 result holds: asset structure is the strongest command layer, and the shipped corpus is materially more consistent than the surrounding canon. The problem is not missing `_auto.yaml` / `_confirm.yaml` / `_presentation.txt` files at scale. The problem is that their relationships are duplicated as prose and validated only from references that still exist. That cannot detect a mode row and asset disappearing together, a presentation exception widening, an inert YAML comment becoming a false route edge, or a `.txt` asset being described as Markdown. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/research.md:117] [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:39] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:387]

The recommended design is one versioned command record consumed by four mechanisms:

1. A deterministic renderer for `OWNED ASSETS`, `PRESENTATION BOUNDARY`, mode/default, and `EXECUTION TARGETS` sections.
2. A semantic validator for mode completeness, typed presentation ownership/exceptions, media/path coherence, and generated-section freshness.
3. A schema-aware executable-edge extractor that traverses declared direct, subaction, manifest, and workflow fields, then runs full strongly connected component detection.
4. Existing runtime consumers, including the deep compiled-contract generator, which should import shared command fields instead of duplicating paths. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:61] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:32]

This is a schema-first change. Router cleanup comes last; otherwise the same authoring mechanism can regenerate the defects.

## 2. Scope and Method

Five forced-depth iterations each addressed one research question. The corpus covered `create`, `design`, `speckit`, `memory`, `doctor`, and `deep`; the canon templates; current reference and benchmark adapters; the doctor manifest validator; and the 012 baseline. Every iteration wrote a narrative, canonical state record, and structured delta under this lineage. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/spec.md:45] [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/spec.md:52]

The Spec Memory daemon was unavailable, so checked-in files were used as the authoritative fallback. A broad Ruby/Psych parse also failed on one deep YAML asset; the research did not infer that the asset is invalid, and instead used bounded line-oriented census plus representative structured reads. Parser compatibility remains an implementation check. [SOURCE: .opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml:214]

## 3. Baseline and Reproduced Defects

The 012 synthesis identified six asset-layer defects; this lineage reproduced and refined all six:

- Mode completeness is unchecked even though all 28 current workflow-backed routers are complete by inspection. The current adapter can detect a referenced target that is missing, but not paired deletion of a declared mode row and its asset. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:355] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:365]
- Default-mode policy is implicit and varies by command: create fixes confirm, design uses input completeness, deep and most speckit commands ask, and direct topologies use command-native policies. [SOURCE: .opencode/commands/create/agent.md:38] [SOURCE: .opencode/commands/design/interface.md:55] [SOURCE: .opencode/commands/deep/review.md:111] [SOURCE: .opencode/commands/speckit/resume.md:35]
- Presentation authority has no typed representation, so the legitimate `memory/search` inline retrieval envelope is distinguishable from a leak only through prose. [SOURCE: .opencode/commands/memory/search.md:137] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:40]
- Route-cycle inference scans raw text, so comments in doctor and create workflow YAMLs become false edges. [SOURCE: .opencode/commands/doctor/_routes.yaml:5] [SOURCE: .opencode/commands/create/assets/create_readme_auto.yaml:33] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:410]
- Doctor’s manifest-backed shape is not named in the authoring taxonomy even though the frozen benchmark taxonomy already recognizes subaction ownership. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/topology-taxonomy.md:22] [SOURCE: .opencode/commands/doctor/speckit.md:25]
- Ownership labels drift: create and doctor routers point to `.txt` files while calling them presentation Markdown. [SOURCE: .opencode/commands/create/command.md:22] [SOURCE: .opencode/commands/create/command.md:29] [SOURCE: .opencode/commands/doctor/update.md:22] [SOURCE: .opencode/commands/doctor/update.md:37]

## 4. RQ1 — Canonical Workflow Schema

The canonical schema should normalize semantics, not require one literal YAML layout.

- The triad is a topology convention, not a universal file schema. Create, design, speckit, and deep use mode pairs; doctor uses manifest/subaction workflows; memory intentionally has no workflow YAML. [SOURCE: .opencode/commands/memory/save.md:29] [SOURCE: .opencode/commands/doctor/_routes.yaml:243]
- Equivalent execution semantics use different YAML serializations. Design uses direct `workflow.step_N` mappings, create pairs a step-ID overview with detailed nodes, speckit mixes ID lists and dotted keys, and deep nests phase-local step maps. [SOURCE: .opencode/commands/design/assets/design_audit_auto.yaml:41] [SOURCE: .opencode/commands/create/assets/create_command_auto.yaml:247] [SOURCE: .opencode/commands/speckit/assets/speckit_plan_auto.yaml:378] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:127]
- The normalized execution unit needs stable node identity, kind, action/command, condition, inputs, outputs, approval, timeout, failure policy, and explicit order/branch edges. This is the smallest union that preserves the observed family serializations without selecting one as canonical. [INFERENCE: based on .opencode/commands/create/assets/create_command_auto.yaml:262 and .opencode/commands/deep/assets/deep_research_auto.yaml:178]
- Bindings need typed producers and consumers. External inputs, router-derived values, node outputs, runtime state paths, and display-only placeholders currently share textual substitution forms. [SOURCE: .opencode/commands/doctor/update.md:43] [SOURCE: .opencode/commands/design/assets/design_audit_auto.yaml:59] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:304]
- Topology must be a discriminated union. The minimum observed variants are mode-pair workflow, direct dispatch, inline subaction workflow, and manifest-backed subaction workflow. [SOURCE: .opencode/commands/doctor/mcp.md:44] [SOURCE: .opencode/commands/memory/save.md:35] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:114]

Contract implication: store a normalized graph and bindings alongside typed topology and assets; allow family-specific extension data rather than forcing YAML rewrites.

## 5. RQ2 — Presentation Ownership and Boundary

Presentation authority remains asset-owned across all six families.

- Each sampled family names one `_presentation.txt` asset in `OWNED ASSETS`; routing topology does not change display authority. [SOURCE: .opencode/commands/create/command.md:18] [SOURCE: .opencode/commands/design/interface.md:42] [SOURCE: .opencode/commands/speckit/plan.md:19] [SOURCE: .opencode/commands/memory/search.md:32] [SOURCE: .opencode/commands/doctor/update.md:18] [SOURCE: .opencode/commands/deep/command-benchmark.md:42]
- `PRESENTATION BOUNDARY` is a capability fence: it enumerates user-visible surfaces the asset owns and establishes load-before-render behavior. It is not a second ownership record. [SOURCE: .opencode/commands/create/command.md:33] [SOURCE: .opencode/commands/create/assets/create_command_presentation.txt:1] [SOURCE: .opencode/commands/deep/command-benchmark.md:72]
- `memory/search` is a legitimate bounded copy. Its router repeats the compressed retrieval envelope as a hard-render reminder, while startup, analysis, empty, error, vocabulary, and recovery displays stay in the asset. [SOURCE: .opencode/commands/memory/search.md:68] [SOURCE: .opencode/commands/memory/search.md:137] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:72]
- The typed model should preserve `presentation.owner.kind = asset` and represent copies in `presentation.inlineExceptions[]` with kind, router anchor, source anchor, allowed surfaces, and rationale. An exception is invalid if it widens beyond its declaration or cannot be traced to the owner asset. [INFERENCE: based on .opencode/commands/memory/search.md:137 and .opencode/skills/sk-doc/create-command/assets/command_router_template.md:17]
- Labels must be generated from `role` and `mediaType`; a `text/plain` `.txt` presentation asset renders as “presentation contract” or “presentation asset,” never “presentation Markdown.” [SOURCE: .opencode/commands/create/command.md:29] [SOURCE: .opencode/commands/doctor/update.md:37]

## 6. RQ3 — Mode Completeness and Default Policy

The current corpus is complete but not protected by a completeness invariant.

| Family | Suffix modes | Omitted/default policy | Asset topology |
|---|---|---|---|
| create | `:auto`, `:confirm` | fixed `confirm` | mode pair |
| design | `:auto`, `:confirm` | input-completeness: complete → auto, otherwise confirm | mode pair |
| speckit | `:auto`, `:confirm`, selected aliases | usually ask; command overrides allowed | mode pair with many-to-one aliases |
| memory | none | command-native direct policy | direct dispatch |
| doctor | none | subaction/flag policy | manifest or inline subaction workflow |
| deep | `:auto`, `:confirm` | ask | mode pair |

Evidence for the distinct policies is in create, design, speckit, memory, doctor, and deep routing clauses. [SOURCE: .opencode/commands/create/agent.md:38] [SOURCE: .opencode/commands/design/interface.md:54] [SOURCE: .opencode/commands/speckit/plan.md:33] [SOURCE: .opencode/commands/memory/save.md:41] [SOURCE: .opencode/commands/doctor/update.md:42] [SOURCE: .opencode/commands/deep/review.md:107]

The completeness invariant is bidirectional:

1. Every canonical declared mode has exactly one normalized route row.
2. Every route row resolves to an existing compatible asset.
3. Every mode asset is referenced or explicitly exempted.
4. Aliases may intentionally map many-to-one, but must name their canonical mode and additional metadata.
5. Non-pair topologies skip pair cardinality and validate their declared direct/subaction routes instead.

Reachability remains a separate check. This split is necessary because removing both an asset and its row leaves no dangling target for the current reference checker. [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:39] [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/research.md:129]

## 7. RQ4 — Doctor Route Manifest and Executable Edges

Doctor is best named a **manifest-backed subaction router**, not a fifth top-level topology.

- The frozen taxonomy already assigns subaction ownership to doctor commands; the missing discriminator is `routingSource: manifest | inlineTable`. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/topology-taxonomy.md:64] [SOURCE: .opencode/commands/doctor/mcp.md:38]
- The manifest-backed path is `router → owner-scoped route record → workflow target`. `routes[]` belongs to `/doctor:speckit`, `mcp_subroutes[]` to `/doctor:mcp`, and `standalone[]` to `/doctor:update`; foreign-owner sections must not create edges for the current command. [SOURCE: .opencode/commands/doctor/_routes.yaml:16] [SOURCE: .opencode/commands/doctor/_routes.yaml:208] [SOURCE: .opencode/commands/doctor/_routes.yaml:237]
- Loader gating must parse the target before flags, reject unknown or cross-target flags, resolve the selected record, verify assets, bind setup variables, and only then load the workflow. [SOURCE: .opencode/commands/doctor/speckit.md:25] [SOURCE: .opencode/commands/doctor/speckit.md:55]
- Current route parsing is raw-text extraction followed by immediate reverse-edge inspection. That admits comments and misses cycles longer than two nodes. [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:55] [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:185] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:410]
- The replacement should parse Markdown execution-target structures and YAML AST/CST fields through a schema registry, emit `{from,to,kind,ownerCommand,sourceLocation}`, and run strongly connected components over the complete executable graph. Comments, documentation paths, globs, presentation assets, and inert inventory sections emit no edges. [SOURCE: .opencode/commands/deep/assets/deep_command-benchmark_auto.yaml:28] [SOURCE: .opencode/commands/design/assets/design_interface_confirm.yaml:20] [INFERENCE: SCC traversal closes the longer-cycle gap in .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:410]

## 8. RQ5 — Generation and Router Ergonomics

One record should generate all repeated asset-layer prose.

- `OWNED ASSETS` projects `assets[]`; `PRESENTATION BOUNDARY` projects the authoritative presentation asset, owned surfaces, and bounded copies; mode/default prose projects `modes[]` plus `defaultPolicy`; `EXECUTION TARGETS` projects the same mode-to-asset references. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:61] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:80] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:89]
- Generated sections need stable replaceable markers and deterministic `--check` rendering. Frontmatter, Phase 0/mandatory-input gates, command-specific argument binding, and a short workflow summary remain authored. [SOURCE: .opencode/commands/deep/assets/compiled/README.md:51] [SOURCE: .opencode/commands/deep/assets/compiled/README.md:70]
- Router thinning is ownership-first. Literal prompts, reply formats, dashboards, checkpoint layouts, result/failure templates, and next-step wording belong in presentation assets. Dispatch, sequencing, writes, retries, transitions, and loop mechanics belong in workflow assets or scripts. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:320] [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:343]
- Size is a migration signal, not a correctness rule. Candidate warnings are router LOC above 120, `OWNED ASSETS` starting after line 60, or more than two manual subsections under `ROUTER CONTRACT`; extraction is required by any hard ownership trigger or two soft signals. The sampled thin reference has assets at line 42, while a fat deep router begins them at line 126. [SOURCE: .opencode/commands/deep/command-benchmark.md:42] [SOURCE: .opencode/commands/deep/model-benchmark.md:126]
- The existing deep compiler is a consumer seam. Its command map duplicates shared router/presentation/auto/confirm paths, while its compiled body carries broader executor authority; import shared fields from the command record, but keep executor-only metadata local. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:32] [SOURCE: .opencode/commands/deep/assets/compiled/README.md:19]

## 9. Unified Command Contract Proposal

Candidate shape:

```yaml
version: 1
id: deep/research
family: deep
topology:
  kind: mode-pair-workflow
  routingSource: inline-table
assets:
  - id: presentation
    role: presentation
    path: .opencode/commands/deep/assets/deep_research_presentation.txt
    mediaType: text/plain
    authority: source-of-truth
  - id: auto-workflow
    role: workflow
    path: .opencode/commands/deep/assets/deep_research_auto.yaml
  - id: confirm-workflow
    role: workflow
    path: .opencode/commands/deep/assets/deep_research_confirm.yaml
modes:
  - id: auto
    selectors: [":auto"]
    targetAssetRef: auto-workflow
  - id: confirm
    selectors: [":confirm"]
    targetAssetRef: confirm-workflow
defaultPolicy:
  kind: ask
presentation:
  assetRef: presentation
  surfaces: [startup, checkpoint, success, failure, next-steps]
  inlineExceptions: []
bindings: []
workflowGraph: { nodes: [], edges: [] }
router:
  manualBlocks: [dispatch-context, mandatory-input, argument-binding, summary]
```

The schema should permit per-command overrides and extension data, but fail closed on unknown topology discriminators, unbound executable placeholders, missing asset references, duplicate canonical mode routes, or incompatible media/path declarations.

## 10. Mode Completeness Algorithm

For a mode-pair contract:

```text
declared = canonical modes in contract
rows = normalized execution-target rows
assets = owned workflow assets

require keys(rows) == declared
for each mode in declared:
  require exactly one canonical row
  require row.targetAssetRef exists
  require referenced file exists
for each workflow asset with a mode role:
  require it is targeted or explicitly exempted
for each alias:
  require alias.canonicalMode exists
```

For direct and subaction topologies, validate the declared route registry instead. Do not invent `:auto` / `:confirm` assets for families that do not use suffix modes.

## 11. Executable-Edge Model

Normalized edge kinds:

| Kind | Source structure | Non-edges |
|---|---|---|
| `direct` | command execution-target row or explicit direct dispatch field | prose references, examples |
| `subaction` | inline action table or owner-scoped manifest record | foreign-owner manifest sections, triggers |
| `workflow` | schema-declared workflow-dispatch fields | presentation paths, inventories, comments |

Every edge records source location and owner command. After extraction, use SCC detection: fail a self-loop or any component with more than one node, and report the ordered typed edge path. This preserves genuine long cycles while eliminating the reproduced comment-only P0s.

## 12. Candidate Deltas

| Priority | Target path | Candidate delta | Acceptance criterion |
|---|---|---|---|
| P0 | `.opencode/skills/sk-doc/create-command/assets/command-contract.schema.json` (new; filename to ratify) | Version the discriminated command, topology, asset, mode/default, binding, presentation, and router records. | Fixtures for all six families validate; an unbound executable placeholder, unknown topology, missing owner asset, or `.txt`/Markdown media mismatch fails. |
| P0 | Contract records under `.opencode/skills/sk-doc/create-command/assets/` (new; layout to ratify) | Populate one record per command from the frozen census. | Every inventoried router has exactly one record; additions/deletions/renames require a manifest delta. |
| P0 | `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs` | Replace raw-text route inference with schema-aware typed edges and SCC traversal. | Comment-only doctor/create cases emit zero edges; genuine direct, inline-subaction, manifest-subaction, workflow, self, and >2-node cycles fail with field locations. |
| P0 | `.opencode/skills/sk-doc/create-command/scripts/render-command-sections.cjs` (new) | Deterministically render four generated sections and support `--check`. | Two renders are byte-identical; one asset-path change updates ownership and target sections together; stale committed text fails check mode. |
| P1 | `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Compose command-contract and mode-completeness validation into the canonical command gate. | Missing asset, missing row, wrong default, orphan asset, invalid exception, and stale generated-section mutations fail independently. |
| P1 | `.opencode/commands/scripts/validate-command-references.cjs` | Replace three-family hard-coding with contract-driven six-family discovery; separate lexical references from executable edges. | Coverage reports all six families; direct-route exemptions and valid aliases pass; orphan mode assets and media-label drift fail. |
| P1 | `.opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/` | Add independent mutation fixtures for asset, mode, presentation, and route-edge invariants. | Each invalid invariant has one deterministic failing fixture; valid many-to-one alias and non-pair topology fixtures pass. |
| P1 | `.opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/topology-taxonomy.md` | Add `routingSource: manifest | inlineTable` beneath subaction router; name doctor subtypes. | The census stays at four top-level topology classes; `/doctor:speckit` and `/doctor:mcp` resolve to deterministic subtypes. |
| P1 | `.opencode/commands/doctor/_routes.yaml` and `.opencode/commands/doctor/scripts/route-validate.py` | Version owner/dispatch-role fields and expose validated route records to edge parsing. | Missing/unknown ownership fails before load; `/doctor:speckit` emits only `routes[*]` edges; current loader assertions remain green. |
| P1 | `.opencode/commands/memory/search.md` and `.opencode/commands/memory/assets/search_presentation.txt` | Add paired stable anchors for the bounded hard-render reminder and declare its allowed surfaces. | The exact retrieval envelope passes; widening into startup/error/analysis surfaces or losing either anchor fails. |
| P2 | `.opencode/skills/sk-doc/create-command/assets/command_router_template.md` and `command_template.md` | Replace handwritten table bodies with generated markers and document hard/soft extraction triggers. | No independently maintained mode/asset rows remain; generated markers are ordered; hard ownership leakage cannot be waived by LOC. |
| P2 | `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Import shared command paths from versioned records and keep executor-only metadata local. | Compiled semantic output and digest validation remain unchanged; shared presentation/auto/confirm paths are no longer redeclared. |
| P2 | `.opencode/commands/deep/{research,review,alignment,ai-council,model-benchmark,agent-improvement,skill-benchmark}.md` plus owned assets | Move presentation/workflow hard leaks first, then use soft signals for remaining thinning; regenerate sections. | Routers retain gates, binding, mode/target selection, and summary; assets own listed surfaces; behavior snapshots remain unchanged. |
| P2 | `.opencode/commands/{create,doctor}/*.md` | Regenerate ownership prose from typed media metadata. | Exact “presentation Markdown owns” phrases fall to zero while referenced `.txt` files remain unchanged. |

These deltas refine the 013 contract, route-parser, semantic-validation, taxonomy, and generation phases; no delta was implemented in this research lineage.

## 13. Acceptance Test Matrix

| Invariant | Invalid mutation | Expected result |
|---|---|---|
| Mode asset completeness | Delete `_auto.yaml`, keep declared mode | Fail with command, mode, missing path |
| Mode row completeness | Delete `:confirm` target row, keep asset | Fail with missing canonical row |
| Paired deletion protection | Delete mode row and asset | Fail against declared contract mode |
| Alias cardinality | Map `:unattended` to canonical auto asset | Pass with canonical-mode metadata |
| Direct topology exemption | Memory command has no mode pair | Pass its direct-route invariant |
| Presentation authority | Router prompt block has no exception | Fail with leaked surface/anchor |
| Bounded exception | `memory/search` paired retrieval envelope | Pass only exact declared surfaces |
| Media coherence | `.txt` + `text/markdown` or Markdown label | Fail schema/render check |
| Comment-only route | YAML comment names owning router | Emit zero executable edges |
| Direct/subaction/workflow cycle | Typed executable path forms SCC | Fail with ordered kinds and locations |
| Longer cycle | Three-node typed component | Fail; proves SCC not reciprocal-only logic |
| Generated freshness | Edit one rendered asset path by hand | `--check` fails with deterministic diff |
| Router ownership | Add retry/state transition to router | Fail workflow-leak rule |
| Presentation ownership | Add result template to router | Fail presentation-leak rule |

## 14. Recommended Sequence

1. Ratify the contract filename/location and the command-record layout in the versioned-contract phase.
2. Freeze representative valid fixtures for the six families and invalid mutation fixtures before implementation.
3. Implement typed contract validation and mode completeness.
4. Implement schema-aware executable-edge parsing and SCC detection against the fixtures.
5. Build deterministic section rendering with `--check`.
6. Move existing deep compiler shared fields behind the record.
7. Regenerate labels and sections; then thin routers by hard ownership violations before soft size signals.

This sequence makes command-local cleanup a consumer of the new source of truth rather than another hand-maintained migration.

## 15. Risks and Confidence

- **High confidence:** presentation ownership, current mode/default behavior, comment-derived false edges, doctor manifest ownership, and mislabeled `.txt` prose are directly reproduced in shipped files.
- **Medium-high confidence:** normalized contract fields cover the sampled family variants; fixture authoring may reveal additional optional extension fields.
- **Medium confidence:** the `120 LOC` and line-60 thresholds are triage heuristics derived from sampled thin/fat deep routers. They must remain warnings, never semantic gates.
- **Open implementation check:** use the repository’s canonical YAML parser against every asset, including `deep_model-benchmark_confirm.yaml`, before selecting AST/CST traversal details.
- **Open naming check:** ratify hyphenated schema/renderer filenames in the owning remediation phase; this research specifies roles and acceptance, not final filenames.

## 16. Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iterations |
|---|---|---|---|
| Universal `_auto` / `_confirm` triad | Memory and doctor intentionally use other topologies | `.opencode/commands/memory/save.md:29`; `.opencode/commands/doctor/_routes.yaml:243` | 1 |
| Literal YAML-key canonicalization | Equivalent semantics have different family serialization | `.opencode/commands/create/assets/create_command_auto.yaml:247`; `.opencode/commands/deep/assets/deep_research_auto.yaml:127` | 1 |
| Blanket inline-presentation ban | Rejects bounded `memory/search` hard-render reminder | `.opencode/commands/memory/search.md:137` | 2 |
| Router-owned `memory/search` presentation | Asset retains source-of-truth authority | `.opencode/commands/memory/assets/search_presentation.txt:3` | 2 |
| One global default mode | Contradicted by family and command policies | `.opencode/commands/design/interface.md:55`; `.opencode/commands/deep/review.md:111` | 3 |
| One mode per asset | Valid SpecKit aliases share auto workflow | `.opencode/commands/speckit/plan.md:37` | 3 |
| Reachability as completeness | Paired row/asset deletion leaves no dangling reference | `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:355` | 3 |
| Fifth route-manifest topology | Execution ownership remains subaction routing | `.opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/topology-taxonomy.md:64` | 4 |
| Comment stripping plus regex | Still lacks field and owner context | `.opencode/commands/scripts/validate-command-references.cjs:55` | 4 |
| Reciprocal-only cycle detection | Misses cycles longer than two nodes | `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:410` | 4 |
| Hand-authored generated tables | Preserves four drift surfaces | `.opencode/skills/sk-doc/create-command/assets/command_router_template.md:61` | 5 |
| LOC-only fat-router failure | Length is not execution/presentation ownership | `.opencode/skills/sk-doc/create-command/SKILL.md:320` | 5 |
| Compiled executor contract as router source | Aggregates broader runtime authority | `.opencode/commands/deep/assets/compiled/README.md:19` | 5 |

## 17. Divergence Map and Open Questions

No divergent pivots ran because the stop policy forced exactly five primary-question iterations. Each iteration materially expanded a separate frontier rather than revisiting a saturated direction:

- Iteration 1: semantic workflow schema and topology variants.
- Iteration 2: presentation owner versus bounded copy.
- Iteration 3: mode completeness versus reachability and per-command defaults.
- Iteration 4: manifest-backed subaction routing and typed SCC edges.
- Iteration 5: generation seams, router ownership, and label prevention.

All five research questions are answered. Remaining implementation questions are bounded:

1. Which exact filenames and record granularity should the owning remediation phase ratify?
2. Which canonical YAML parser preserves locations and comments robustly across the full asset corpus?
3. Do additional valid commands require topology extension fields beyond the sampled discriminators?
4. Which router behavior snapshots should be frozen before deep-router extraction?

### Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5
- Questions answered: 5 / 5
- `newInfoRatio` trend: `[0.90, 0.90, 0.90, 0.90, 0.90]`
- Rolling average: `0.90` → CONTINUE
- MAD noise floor: `0.00`; latest `0.90` → CONTINUE
- Question entropy coverage: `1.00` → STOP vote
- Composite stop score: `0.35` → no composite convergence candidate
- Hard cap: STOP and synthesize
- Quality gates: source diversity, focus alignment, and evidence density passed
