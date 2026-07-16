# Iteration 4: Doctor Manifest-Backed Routing and Executable-Edge Traversal

## Focus

This iteration answered RQ4 by defining `/doctor` as a manifest-backed subtype of the existing `subaction router` topology, specifying the `_routes.yaml` record and loader gates, and replacing raw-text cycle inference with typed executable-edge traversal. The narrow interpretation is command dispatch edges; general documentation-link graphs are deferred because they are not execution semantics.

## Route Proof

- `target_agent: "deep-research"`
- `agent_definition_loaded: true`
- `resolved_route: "Resolved route: mode=research target_agent=deep-research"`
- `mode: "research"`

## Findings

1. Doctor is a **manifest-backed subaction router**, not a fifth top-level topology. The frozen taxonomy already classifies both `/doctor:speckit` and `/doctor:mcp` as `subaction router`; the differentiator is routing source. `/doctor:speckit` resolves a target through `_routes.yaml`, while `/doctor:mcp` owns an inline `install|debug -> workflow` table. The contract should therefore add `routing_source: manifest | inline_table` under `subaction router`, with `manifest-backed subaction router` as the human-readable subtype. This preserves the four execution-ownership classes and makes the currently unnamed doctor shape explicit. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/topology-taxonomy.md:22] [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/topology-taxonomy.md:64] [SOURCE: .opencode/commands/doctor/mcp.md:38]

2. The manifest-backed shape has three typed layers: `router -> manifest route record -> target workflow`. The executable `/doctor` records are only `routes[]`, whose fields bind target identity, workflow filename, setup variables, target-scoped flags, mutation class/location, required MCP tools, optional scripts, and descriptive triggers. `mcp_subroutes[]` belongs to `/doctor:mcp`, and `standalone[]` belongs to `/doctor:update`; neither is reachable from `/doctor:speckit`. Loader gating is ordered: parse target before flags, reject unknown/cross-target flags, resolve the selected record, verify the workflow and presentation assets, resolve setup variables, then load the workflow. [SOURCE: .opencode/commands/doctor/_routes.yaml:16] [SOURCE: .opencode/commands/doctor/_routes.yaml:33] [SOURCE: .opencode/commands/doctor/_routes.yaml:208] [SOURCE: .opencode/commands/doctor/_routes.yaml:237] [SOURCE: .opencode/commands/doctor/speckit.md:25] [SOURCE: .opencode/commands/doctor/speckit.md:55]

3. The current cycle detector is lexically unsound and graphically incomplete. `extractCommandTargets()` applies one global path regex to every byte of a document, so YAML comments and non-executable strings become targets; `checkRouteGraph()` then reads every target as raw text and reports a cycle on the first immediate back-reference. The reproduced P0s at `_routes.yaml:5` and `create_readme_{auto,confirm}.yaml` are comment-only references to their owning routers. Conversely, the implementation checks only a two-node back-edge and cannot detect a longer executable cycle. [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:55] [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:185] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:410] [SOURCE: .opencode/commands/doctor/_routes.yaml:5] [SOURCE: .opencode/commands/create/assets/create_readme_auto.yaml:33]

4. Executable edges should be extracted through a schema registry, not through comment stripping or a generic `*.yaml` string scan. Emit normalized records such as `{from, to, kind, ownerCommand, sourceLocation}` only from recognized structures: command execution-target rows (`direct`), inline subaction arrows or owner-scoped manifest records (`subaction`), and declared workflow-dispatch fields such as `execution_targets.*.workflow` (`workflow`). YAML must be parsed to an AST/CST so comments produce no nodes; documentation paths, globs, presentation sources, and inert inventory sections produce no executable edges. The deep command-benchmark workflow demonstrates a genuine structured workflow-to-workflow edge that must remain traversable. [SOURCE: .opencode/commands/doctor/mcp.md:44] [SOURCE: .opencode/commands/deep/assets/deep_command-benchmark_auto.yaml:28] [SOURCE: .opencode/commands/design/assets/design_interface_confirm.yaml:20] [INFERENCE: typed extraction follows the distinct executable and non-executable field contexts evidenced by these sources]

5. Cycle validation should run strongly connected components over the complete typed executable graph, failing a self-loop or any component with more than one node and reporting the ordered edge path with kinds and source locations. Acceptance fixtures need five cases: a comment-only back-reference that passes, plus genuine direct, inline-subaction, manifest-subaction, and workflow-dispatch cycles that fail. Doctor's existing loader validator supplies the fail-closed preconditions: safe YAML parse and schema version, required route keys, unique targets, existing assets, valid mutation classes, allowed-tool subsets, script existence, presentation parity, and read-only mutation policy. Those gates should run before graph traversal, not be reimplemented as path regexes. [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:193] [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:215] [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:252] [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:355] [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:382] [INFERENCE: SCC traversal is required because the current immediate reverse-edge test at sk-doc-command.cjs:410 cannot detect cycles longer than two nodes]

## Candidate Deltas

1. **Target:** `.opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/topology-taxonomy.md`
   **Delta:** Add `routing_source: inline_table | manifest` beneath `subaction router`, name `/doctor:speckit` `manifest-backed subaction router`, and name `/doctor:mcp` `inline-table subaction router`.
   **Acceptance criterion:** The frozen census remains exactly four top-level topology classes and 36 classified commands, while both doctor subaction routers have a deterministic routing-source subtype. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/topology-taxonomy.md:78]

2. **Target:** `.opencode/commands/doctor/_routes.yaml`
   **Delta:** Version the manifest contract so every section declares its owner command and dispatch role; retain `routes[]` as `/doctor:speckit` executable routes, bind `mcp_subroutes[]` to `/doctor:mcp`, and bind `standalone[]` to `/doctor:update`.
   **Acceptance criterion:** A loader starting at `/doctor:speckit` emits edges only for `routes[*].yaml`; comments and the two foreign-owner sections emit zero edges from that owner. [SOURCE: .opencode/commands/doctor/_routes.yaml:208] [SOURCE: .opencode/commands/doctor/_routes.yaml:237]

3. **Target:** `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs`
   **Delta:** Replace `workflowTargets()` plus immediate raw-text back-edge detection with schema-aware edge extraction and complete directed-cycle traversal.
   **Acceptance criterion:** Findings preserve `CMD-S3-ROUTE-CYCLE`, include the full typed edge path and locations, ignore YAML comments/non-executable strings, and fail self-loops and cycles of any length. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:355] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:387]

4. **Target:** `.opencode/commands/scripts/validate-command-references.cjs`
   **Delta:** Expose parsed command execution targets separately from lexical references and add comment-only/direct/subaction/workflow cycle fixtures to the self-test corpus.
   **Acceptance criterion:** The comment-only doctor and create/readme cases pass; deliberately cyclic direct, inline-subaction, manifest-subaction, and nested-workflow fixtures each fail deterministically. [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:369]

5. **Target:** `.opencode/commands/doctor/scripts/route-validate.py`
   **Delta:** Make owner/dispatch-role fields part of the required versioned manifest schema and expose validated route records to the command graph adapter.
   **Acceptance criterion:** Missing/unknown owner roles fail before asset load; all existing A-K assertions still pass; route records cannot escape `doctor/assets/` after canonical path resolution. [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:43] [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:192]

## Ruled Out

- **A fifth `route-manifest router` topology:** execution ownership is still subaction routing; a subtype captures the serialization difference without breaking the taxonomy's mutually exclusive four-class contract.
- **Strip `#` comments, then keep regex scanning:** this removes the reproduced comments but still treats documentation strings, globs, and presentation paths as executable and misses schema ownership.
- **Immediate reciprocal-edge detection:** it cannot detect cycles longer than two nodes.
- **Treat all `_routes.yaml` sections as `/doctor:speckit` routes:** the manifest explicitly assigns `mcp_subroutes` and `standalone` to companion commands.
- **Progressive `research.md` update:** config enables progressive synthesis, but the dispatch hard boundary authorizes only the iteration file, one state append, and one delta file; the narrower write boundary prevails.

## Dead Ends

Raw path-regex extraction is exhausted for execution-edge semantics. It remains suitable for referential-integrity inventory, but not for ownership-aware routing or cycle detection.

## Edge Cases

- Ambiguous input: `route-manifest topology` could mean a new top-level class or a subaction-router subtype. Execution ownership evidence supports the subtype; the top-level-class interpretation is ruled out.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none; RQ4 is answered with code, manifest, validator, taxonomy, and runtime reproduction evidence.

## Sources Consulted

- `.opencode/commands/doctor/_routes.yaml:16`
- `.opencode/commands/doctor/speckit.md:25`
- `.opencode/commands/doctor/mcp.md:38`
- `.opencode/commands/doctor/scripts/route-validate.py:193`
- `.opencode/commands/doctor/scripts/route-validate.sh:35`
- `.opencode/commands/scripts/validate-command-references.cjs:185`
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:387`
- `.opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/topology-taxonomy.md:22`
- `.opencode/commands/create/assets/create_readme_auto.yaml:33`
- `.opencode/commands/deep/assets/deep_command-benchmark_auto.yaml:28`

## Assessment

- New information ratio: 0.90
- Novelty basis: four of five findings are fully new contract/algorithm details; one formalizes the already known comment-cycle defect.
- Questions addressed: RQ4
- Questions answered: RQ4

## Reflection

- What worked and why: pairing a runtime reproduction with line-level inspection separated the observed false positive from the parser mechanism, while comparing doctor manifest and inline subaction forms produced a minimal subtype rather than taxonomy expansion.
- What did not work and why: broad path matching is useful for existence checks but loses YAML field context and ownership, so it cannot establish executable reachability.
- What I would do differently: implementation should start with fixtures for the four edge kinds and the comment-only negative case before replacing the extractor, preserving the current finding code while changing its evidence model.

## Recommended Next Focus

RQ5: define the single typed command-contract record that generates owned-asset, presentation, mode/default, and route tables; specify thin/fat router thresholds; and make media labels derive from asset metadata so `.txt` files cannot be called Markdown by hand-authored prose.
