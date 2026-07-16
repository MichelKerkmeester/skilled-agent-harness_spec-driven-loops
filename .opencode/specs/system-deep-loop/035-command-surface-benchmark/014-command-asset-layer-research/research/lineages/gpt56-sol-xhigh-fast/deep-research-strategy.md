# Deep Research Strategy: Command Asset Layer

## 1. Research Topic

Deep-dive the command asset layer across `create/*`, `design/*`, `speckit/*`, `memory/*`, `doctor/*`, and `deep/*`: workflow YAML schemas, presentation ownership, mode completeness, route-manifest parsing, and generation ergonomics.

## 2. Known Context

- The 012 cross-model synthesis scored asset structure as the strongest layer: 35/35 sampled command routers expose OWNED ASSETS and PRESENTATION BOUNDARY structure.
- Six defects remain: unchecked mode completeness; invisible default-mode policy; untyped presentation ownership/exceptions; comment-derived false route cycles; unnamed doctor route-manifest topology; and mislabeled `.txt` ownership entries.
- The 013 remediation packet reserves a versioned command contract, executable-edge parsing, semantic validation, taxonomy, and generation phases; this research must provide contract-ready asset-layer detail.
- `resource-map.md` was not present at initialization; skipping its coverage gate.
- Spec Memory context refresh was unavailable; direct repository evidence is authoritative for this lineage.

### Bounded Context Snapshot

- Baseline: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/research.md`
- Target: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/spec.md`
- Contract consumers: `.opencode/skills/sk-doc/create-command/assets/command_router_template.md`, `.opencode/skills/sk-doc/create-command/assets/command_template.md`
- Route parser: `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs`
- Corpus roots: `.opencode/commands/{create,design,speckit,memory,doctor,deep}`

<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)

- [x] RQ1: What is the canonical schema of `_auto.yaml` / `_confirm.yaml`, where does it diverge by family, and what must the contract capture to prevent prose/YAML drift?
- [x] RQ2: Who owns `_presentation.txt`, when is inline router presentation legitimate, and how should typed exceptions represent it?
- [x] RQ3: How should completeness validation pair declared modes with both workflow assets and EXECUTION TARGETS rows, while representing family-specific defaults?
- [x] RQ4: How should the doctor route-manifest topology and executable YAML edges be named and parsed without comment-derived cycles?
- [x] RQ5: How should the contract generate asset/presentation/mode tables, thin fat routers, and prevent mislabeled `.txt` ownership?
<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- No implementation changes, runtime patches, schema authoring, command rewrites, or validator edits.
- No writes outside this lineage artifact directory.
- No early synthesis before iteration 5, even if convergence telemetry nominates a stop.

## 5. Stop Conditions

- Complete exactly five evidence iterations, one per primary RQ, then synthesize.
- Stop early only for unrecoverable state corruption or an attempted write outside the lineage boundary.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions

- RQ1: The canonical layer is a semantic execution graph plus typed bindings/placeholders behind discriminated topology variants; literal YAML key uniformity would be lossy. Evidence: `iterations/iteration-001.md`.
- RQ2: One presentation asset remains authoritative; inline router copies are bounded, typed exceptions that preserve asset ownership. Evidence: `iterations/iteration-002.md`.
- RQ3: Completeness is a declared-mode invariant independent of reachability; default resolution is a typed per-command policy, not one family-wide constant. Evidence: `iterations/iteration-003.md`.
- RQ4: Doctor is a manifest-backed subaction-router subtype; executable edges must come from schema-declared fields and complete SCC traversal, never raw text. Evidence: `iterations/iteration-004.md`.
- RQ5: One normalized record deterministically generates ownership, presentation, mode/default, and execution-target sections; hard ownership triggers control extraction, with size used only for triage. Evidence: `iterations/iteration-005.md`.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked

- Bounded corpus census plus representative line-level sampling separated common semantics from family-specific serialization (iteration 1).
- Treating the workflow contract as a normalized graph exposed producer/consumer relationships missing from prose asset tables (iteration 1).
- Pairing each router boundary with its named asset distinguished authority from a bounded hard-render reminder (iteration 2).
- An exhaustive line-oriented census proved current pair completeness while avoiding the brittle parser-first path (iteration 3).
- Reproducing the false cycles and comparing manifest versus inline subaction routing separated serialization from execution ownership (iteration 4).
- Comparing the authoring template, thin/fat deep routers, current compiler, and validator exposed generation seams and defensible extraction signals (iteration 5).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. What Failed

- Spec Memory context refresh: local daemon socket unavailable; direct-file fallback selected during initialization.
- Broad parser-first census was brittle: Ruby/Psych failed on one deep YAML asset, so the pass recovered with line-oriented evidence (iteration 1).
- A broad mode scan exceeded the display budget; bounded router and asset counts produced a usable census (iteration 3).
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches (do not retry)

- Memory-daemon lookup for startup context is unavailable for this lineage. Do not retry; use checked-in specs and source files.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled-Out Directions

- Implementing candidate deltas during research is out of scope.
- A universal triad requirement is invalid because memory intentionally has no workflow YAML and doctor uses manifest/subaction workflows (iteration 1).
- One family’s literal YAML keys cannot be the canonical schema; create, design, speckit, and deep serialize equivalent semantics differently (iteration 1).
- A blanket inline-presentation ban is invalid; `memory/search` has a narrow, source-linked retrieval-envelope copy (iteration 2).
- Router ownership is invalid for `memory/search`; the presentation asset remains the authority (iteration 2).
- Hand-authored media-type nouns drift from `.txt` paths and should be generated from typed metadata (iteration 2).
- A universal omitted-mode default is contradicted by create, design, speckit, deep, memory, and doctor behavior (iteration 3).
- One-mode/one-asset cardinality is invalid because SpecKit aliases intentionally share auto YAML (iteration 3).
- Reachability alone cannot detect simultaneous removal of a declared mode row and its asset (iteration 3).
- A fifth top-level route-manifest topology is unnecessary; routing source is a subtype of subaction ownership (iteration 4).
- Comment stripping plus regex remains context-blind and misses longer cycles (iteration 4).
- Immediate reciprocal-edge checks cannot detect components longer than two nodes (iteration 4).
- Foreign-owner `_routes.yaml` sections must not become `/doctor:speckit` edges (iteration 4).
- Hand-authored generated tables preserve multiple drift surfaces and are not the target architecture (iteration 5).
- LOC-only hard failures confuse legitimate gates with ownership leakage (iteration 5).
- Generating every router sentence would erase necessary command-specific gates and bindings (iteration 5).
- Compiled executor contracts aggregate broader authority and are not the router source of truth (iteration 5).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. Saturated Directions and Divergence Frontier

- Completed pivots: 0
- Failed pivots: 0
- Saturated: RQ1-RQ5 complete; contract schema, presentation exceptions, mode completeness, route parsing, and generation ergonomics all have candidate deltas and acceptance criteria
- Remaining frontier: implementation validation of parser compatibility and final schema filenames
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. Carried-Forward Open Questions

- Verify the canonical YAML parser’s handling of `deep_model-benchmark_confirm.yaml` during implementation; this research used line-oriented fallback evidence.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. Next Focus

Synthesis complete. Next implementation sequence: ratify contract location, add schema/mutation fixtures, build deterministic rendering, then migrate routers.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Research Boundaries

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: `max-iterations`
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: enabled, but final synthesis remains workflow-owned after iteration 5
- Allowed write root: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast`
- Session: `fanout-gpt56-sol-xhigh-fast-1784188142801-1m6wjy`
