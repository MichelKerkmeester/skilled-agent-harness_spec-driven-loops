# Iteration 1: Canonical Workflow Schema and Family Divergence

## Focus

This iteration answered RQ1 by inventorying the shipped `_auto.yaml` / `_confirm.yaml` corpus, comparing representative create, design, speckit, and deep workflows with the doctor and memory exceptions, and translating the observed structures into a semantic command-contract model. “Canonical schema” is interpreted as the smallest machine-readable semantic model that can represent every family, not as one existing file’s literal YAML key layout.

## Findings

1. **The triad is a topology convention, not a universal file schema.** The 012 baseline correctly identifies the `_auto.yaml` + `_confirm.yaml` + `_presentation.txt` triad for create, design, speckit, and deep, while doctor uses a manifest plus route workflows and memory deliberately owns no workflow YAML. The current corpus scan found 56 mode YAML assets across the four triad families (create 22, design 10, speckit 8, deep 16), but that count cannot define completeness for doctor or memory. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/research.md:121] [SOURCE: .opencode/commands/memory/save.md:29] [SOURCE: .opencode/commands/doctor/_routes.yaml:243] [INFERENCE: based on the bounded file-list scan of the six dispatched corpus roots]

2. **The common executable envelope is semantic: metadata plus an ordered graph of work, not a stable set of YAML keys.** Representative assets share `role`, `purpose`, `action`, `operating_mode`, and workflow content, but serialize execution differently: design uses direct `workflow.step_N` mappings with singular `output`; create duplicates a `workflow_overview.steps[]` ID list and a detailed `workflow.step_N` map with plural `outputs`; speckit mixes ID-bearing lists with dotted step keys; deep nests phase-local `steps` maps. A canonical model should therefore normalize `nodes[]` with stable `id`, `kind`, `action/command`, `condition`, `inputs`, `outputs`, `approval`, `timeout`, `on_failure`, and explicit ordering/branch edges while retaining family-specific extension data. [SOURCE: .opencode/commands/design/assets/design_audit_auto.yaml:41] [SOURCE: .opencode/commands/create/assets/create_command_auto.yaml:247] [SOURCE: .opencode/commands/create/assets/create_command_auto.yaml:262] [SOURCE: .opencode/commands/speckit/assets/speckit_plan_auto.yaml:378] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:127] [INFERENCE: the normalized node fields are the union required to preserve the cited serializations without choosing one as canonical]

3. **Bindings and placeholders are implicit today and need first-class producer/consumer records.** Router-owned `$ARGUMENTS` parsing produces setup bindings before workflow load in doctor; design reads `$ARGUMENTS` inside a workflow action; deep uses braced runtime references such as `{state_paths.config}` and angle-bracket templates such as `<session-id>`, while node outputs are declared separately. The contract must distinguish external inputs, router-derived bindings, node outputs, runtime state paths, and display-only placeholders; each executable placeholder needs a declared producer, type, scope, and consumer, and validation must reject unbound or cross-mode-only references. [SOURCE: .opencode/commands/doctor/update.md:41] [SOURCE: .opencode/commands/doctor/update.md:43] [SOURCE: .opencode/commands/doctor/update.md:46] [SOURCE: .opencode/commands/design/assets/design_audit_auto.yaml:59] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:304] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:316] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1911] [INFERENCE: producer/type/scope/consumer are the minimum fields needed to validate the cited implicit dataflow]

4. **Topology and mode assets must be discriminated unions, not nullable triad fields.** The router template currently lists triad assets and classifies doctor with memory as direct dispatch, but doctor’s manifest rows bind concrete YAML workflows and `/doctor:mcp` selects different YAMLs by positional sub-action. Memory’s no-YAML state is intentional. The contract needs at least `mode-pair-workflow`, `route-manifest-workflow`, `subaction-workflow`, and `direct-dispatch` topology variants; each variant must require its own selectors, assets, bindings, and explicit absence reason. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:61] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:114] [SOURCE: .opencode/commands/doctor/mcp.md:18] [SOURCE: .opencode/commands/doctor/mcp.md:30] [SOURCE: .opencode/commands/doctor/mcp.md:44] [SOURCE: .opencode/commands/memory/save.md:35] [INFERENCE: the four variants are the smallest discriminated union covering the cited shipped shapes without treating intentional absence as missing data]

5. **The drift-prevention contract must be the source for both prose tables and executable validation.** Required contract fields are: command identity and family; topology discriminator; declared modes and default-resolution policy; owned assets with typed role/owner/path; router selectors and normalized bindings; normalized workflow nodes/edges; placeholder declarations; presentation owner/exception reference; and generated-section provenance. Rendering `OWNED ASSETS`, `MODE ROUTING`, `EXECUTION TARGETS`, and `PRESENTATION BOUNDARY` from that record, then structurally validating the referenced YAML against the same record, closes the current gap where the template specifies paths and prose sections but not their executable correspondence. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:29] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:61] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:80] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:89] [INFERENCE: one record feeding both rendering and validation prevents independent prose/YAML edits from silently diverging]

## Candidate Deltas

- **Target:** `.opencode/skills/sk-doc/create-command/assets/command-contract.schema.json` (new versioned contract). **Acceptance criterion:** representative create, design, speckit, deep, doctor-manifest, doctor-subaction, and memory-direct commands validate under discriminated topology variants; every executable placeholder resolves to a typed producer and every intentional missing workflow has an enumerated absence reason. [INFERENCE: based on Findings 2–4]
- **Target:** `.opencode/skills/sk-doc/create-command/assets/command_router_template.md`. **Acceptance criterion:** OWNED ASSETS, MODE ROUTING, EXECUTION TARGETS, and PRESENTATION BOUNDARY are generated from a contract fixture; changing an asset path, selector, or mode target in prose alone fails regeneration/validation. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:29] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:61]
- **Target:** `.opencode/skills/sk-doc/create-command/assets/command_template.md`. **Acceptance criterion:** workflow authoring guidance requires the normalized node/dataflow fields while permitting family-specific YAML serialization; a fixture with an unbound `$ARGUMENTS`, braced state path, or node output reference fails. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:43] [INFERENCE: based on Finding 3]
- **Target:** `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs`. **Acceptance criterion:** route extraction parses YAML structure and contract-declared selectors, emits only executable edges, and reports contract/prose/YAML disagreement with the command and field path. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-strategy.md:20] [INFERENCE: the adapter is the named contract consumer and must consume the same normalized model]

## Ruled Out

- Treating all six families as required `_auto.yaml` / `_confirm.yaml` triads: memory intentionally has no workflow YAML and doctor binds route/sub-action YAMLs.
- Promoting create’s `workflow_overview` or deep’s phase-local `steps` layout as the literal canonical schema: each would force lossy rewrites of other shipped families.
- Retrying Spec Memory context lookup: strategy marks the daemon path exhausted for this lineage.

## Dead Ends

No research direction was exhausted. Literal-key unification is eliminated as a design direction because the shipped families use materially different serializations for equivalent execution concepts.

## Edge Cases

- Ambiguous input: “canonical schema” could mean a literal YAML grammar or a semantic contract. The semantic interpretation was selected because no single literal key shape covers the corpus; literal normalization is deferred as an implementation choice.
- Contradictory evidence: the router template classifies doctor as direct dispatch with no workflow YAML, while shipped doctor routers and `_routes.yaml` bind workflow YAMLs. The corpus is better evidence for topology; the canon remains stale. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:115] [SOURCE: .opencode/commands/doctor/update.md:23] [SOURCE: .opencode/commands/doctor/_routes.yaml:246]
- Missing dependencies: Spec Memory was unavailable by lineage policy; checked-in source and the 012 baseline were used instead.
- Partial success: the first structural inventory command had a Ruby syntax error; the corrected pass then stopped when Psych reported a parse error around `deep_model-benchmark_confirm.yaml:214`. Line-oriented corpus searches recovered the evidence needed for RQ1, but canonical-parser portability of that asset remains unverified. [SOURCE: .opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml:214]

## Sources Consulted

- `.opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/research.md:117`
- `.opencode/skills/sk-doc/create-command/assets/command_router_template.md:29`
- `.opencode/skills/sk-doc/create-command/assets/command_template.md:43`
- `.opencode/commands/create/assets/create_command_auto.yaml:247`
- `.opencode/commands/create/assets/create_command_confirm.yaml:264`
- `.opencode/commands/design/assets/design_audit_auto.yaml:41`
- `.opencode/commands/design/assets/design_audit_confirm.yaml:31`
- `.opencode/commands/speckit/assets/speckit_plan_auto.yaml:378`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:127`
- `.opencode/commands/deep/assets/deep_research_confirm.yaml:139`
- `.opencode/commands/doctor/_routes.yaml:243`
- `.opencode/commands/doctor/update.md:18`
- `.opencode/commands/doctor/mcp.md:18`
- `.opencode/commands/memory/save.md:29`

## Assessment

- New information ratio: 0.90 (4 fully new findings + 1 partial refinement of the 012 triad baseline, divided by 5 findings)
- Questions addressed: RQ1
- Questions answered: RQ1

## Reflection

- What worked and why: pairing a bounded file census with representative line-level samples separated semantic invariants from family-specific serialization.
- What did not work and why: a broad recursive key inventory produced excessive output and encountered a parser failure, so it was unsuitable as the sole schema derivation method.
- What I would do differently: use the repository’s canonical YAML parser and emit a compact per-family signature table before sampling exact nodes.

## Recommended Next Focus

RQ2: inventory presentation ownership across all six topologies, especially memory/search’s intentional inline exception, then define the typed owner/exception fields referenced by this iteration’s contract model.

