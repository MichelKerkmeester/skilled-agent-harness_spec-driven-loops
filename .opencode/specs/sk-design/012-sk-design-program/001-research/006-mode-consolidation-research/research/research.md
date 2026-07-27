---
title: "Deep Research: sk-design Mode Consolidation"
description: "Evidence-backed topology and migration plan for reducing the sk-design hub to four modes while preserving foundations, audit, and styles capabilities."
---

# sk-design Mode Consolidation

## 1. Executive Summary

The smallest supported topology is a four-mode `sk-design` hub containing `design-interface`, `design-motion`, `design-md-generator`, and `design-mcp-open-design`, plus two non-mode outcomes: foundations becomes an interface-owned subworkflow, and `styles/` remains a shared internal package. `design-audit` should not be folded into interface or shared doctrine; it should become a standalone advisor-visible skill while `/interface:audit` remains a measured transition alias. This preserves the requested four-mode hub, but it does not eliminate audit as a distinct capability. [SOURCE: lineages/sol/iterations/iteration-003.md:16-38] [SOURCE: lineages/sol/iterations/iteration-004.md:18-74] [SOURCE: lineages/sol/iterations/iteration-005.md:24-40]

The evidence supports consolidation based on executable routes, imports, command contracts, corpus tests, and owned behavior. It does not support claims about production invocation frequency because no usage telemetry was found. The implementation packet must therefore preserve aliases until observed traffic, not repository mention counts, justifies removal. [SOURCE: lineages/sol/iterations/iteration-001.md:17-27] [SOURCE: lineages/sol/iterations/iteration-002.md:24-26]

The recommended migration has six gated stages: baseline capture, foundations fold, audit extraction, discriminator repointing, styles-policy ratification, and optional alias retirement. Each topology-changing stage has a local rollback and must remain green before the next stage starts. [SOURCE: lineages/sol/iterations/iteration-005.md:121-182]

## 2. Research Question And Scope

The five-iteration lineage addressed six charter questions:

1. Which foundations capabilities are load-bearing, and where should they live?
2. Is audit a separate workflow, an interface gate, or shared procedure?
3. Where should the styles corpus, facade, adapter, and database lifecycle live?
4. What routing and executable evidence distinguishes used capability from dead weight?
5. Should the four survivors remain hub modes or become standalone skills?
6. What ordered migration, compatibility, rollback, and verification plan can a build packet execute?

The scope was research and planning only. No skill, command, adapter, corpus, or implementation file was moved or changed. The lineage completed exactly five evidence iterations under `stopPolicy=max-iterations`. [SOURCE: lineages/sol/deep-research-strategy.md:22-33] [SOURCE: lineages/sol/iterations/iteration-005.md:1-20]

## 3. Current-State Diagnosis

The current physical surface is six registered packets plus the shared styles tree: interface (62 files), foundations (48), motion (39), audit (70), md-generator (115), Open Design transport (43), and styles (7,812). The styles tree includes authored engine/adapter code, a committed generated corpus, and rebuildable database state. [SOURCE: lineages/sol/iterations/iteration-001.md:15-18] [SOURCE: lineages/sol/iterations/iteration-002.md:20-24]

All six packets are reachable through the hub registry and router, five have dedicated `/interface:*` commands, and Open Design is a paired transport with no command. Advisor routing currently exposes one `sk-design` identity and delegates packet choice to the hub. Reachability establishes maintained capability, not real-world frequency. [SOURCE: lineages/sol/iterations/iteration-001.md:19-23]

Two current contradictions should be corrected before structural migration:

- Hub documentation names `styles/_engine` and `styles/_db`, while executable consumers use `styles/lib/engine` and `styles/lib/database`.
- `hub-router.json` has `defaultMode: null`, while hub prose says generic prompts default to interface.

[SOURCE: lineages/sol/iterations/iteration-001.md:25-27]

## 4. Utilization Evidence And Confidence Ceiling

The strongest available utilization evidence is structural and executable:

- command wrappers and auto/confirm workflows prove distinct user jobs;
- registry/router rows prove reachability and current topology;
- imports and child-process calls prove styles consumers;
- corpus and contract tests prove behavior and compatibility coupling;
- direct facade execution proves query/hydration behavior against committed data.

[SOURCE: lineages/sol/iterations/iteration-001.md:17-27] [SOURCE: lineages/sol/iterations/iteration-002.md:7-24] [SOURCE: lineages/sol/iterations/iteration-003.md:16-38] [SOURCE: lineages/sol/iterations/iteration-004.md:18-74]

Repository-wide name counts are not utilization evidence because archived specs, generated reports, fixtures, and documentation dominate them. No production command or mode invocation telemetry was found. Conclusions about topology are high-confidence because they rest on owned contracts and executable edges; conclusions about frequency remain unknown. [SOURCE: lineages/sol/iterations/iteration-001.md:43-56] [SOURCE: lineages/sol/iterations/iteration-002.md:24-26]

## 5. Foundations Fate

Foundations is a real workflow with its own intake, artifact, procedure selection, validation, and handoff, but its three procedure cards and relationship corpus are selected by that workflow rather than ordinary interface work. It should survive as a named `design-interface/foundations/` subworkflow, not as a separate hub mode and not as flattened shared doctrine. [SOURCE: lineages/sol/iterations/iteration-003.md:16-30]

The ownership boundary is:

- interface-owned foundations leaf: static-system authoring, axes, examples, procedure cards, relationship corpus, and foundations-only validators;
- shared: mode-neutral lifecycle, vocabulary, evidence contracts, parsing helpers, and cross-mode proof gates;
- public compatibility: `/interface:foundations` forwards to `workflowMode=interface` plus a typed foundations leaf during migration.

[SOURCE: lineages/sol/iterations/iteration-003.md:24-38]

Current topology tests are migration consumers, not proof that foundations must remain a hub mode. Repoint the tests while preserving the independent corpus behavior. [SOURCE: lineages/sol/iterations/iteration-003.md:36-47]

## 6. Audit Fate

Audit is an independently invoked review-and-score workflow, not an automatic interface completion gate. It owns a P0-P3 severity model, five-dimension `/20` scoring rubric, evidence labels, report assets, an AI-fingerprint catalogue with parity checks, a comparison corpus, and deterministic Bash-dependent gates. Interface already owns a separate binary SHIP/FIX preflight. [SOURCE: lineages/sol/iterations/iteration-004.md:18-46]

Audit should become a standalone skill because its authority and executable surface do not fit an interface subworkflow or a shared procedure card. The cross-mode polish procedure should remain shared while preserving `design-audit` as the owning reviewer. `/interface:audit` should remain a forwarding alias during migration so sibling discriminators and transform-verb framing continue to work. [SOURCE: lineages/sol/iterations/iteration-004.md:48-70] [SOURCE: lineages/sol/iterations/iteration-004.md:83-85]

This is the one result that qualifies the original target: the hub reaches four modes, but the overall advisor surface includes a new standalone audit identity. Removing audit entirely would regress a distinct workflow and its owned proof model. [SOURCE: lineages/sol/iterations/iteration-005.md:28-38]

## 7. Styles Database And Facade Fate

Five executable consumers use one storage-neutral styles facade: interface, foundations, motion, audit, and md-generator STUDY. Four import `runQuery`/`runHydrate` directly; md-generator uses the same facade through a child process. Query and hydration counts are bounded per workflow, and byte caps can return a truncated first artifact rather than every requested include. [SOURCE: lineages/sol/iterations/iteration-002.md:14-20]

The stable ownership boundary is already clear:

- `styles/lib/`: authored facade, adapter, path seam, and database code;
- `styles/library/`: committed generated corpus and manifests, which remain authoritative;
- `styles/database/`: mutable, rebuildable projection used by persistent mode;
- `SK_DESIGN_STYLE_DB_MODE`: backend switch, defaulting to `legacy` when no explicit option is supplied.

[SOURCE: lineages/sol/iterations/iteration-002.md:20-24]

Keep `styles/` inside the hub as a shared non-mode package. Do not move it under md-generator, interface, or a fifth advisor-visible mode. Preserve the facade path, response contract, include ordering, truncation flags, byte caps, and backend default. A build packet may formalize a single shared manifest policy, but it should not introduce per-consumer or per-bundle compatibility shims. [SOURCE: lineages/sol/iterations/iteration-002.md:16-26] [SOURCE: lineages/sol/iterations/iteration-005.md:157-163]

## 8. Target Topology

| Current surface | Target destination | Identity | Public compatibility |
|---|---|---|---|
| `design-interface` | unchanged | `sk-design` hub mode | `/interface:design` unchanged |
| `design-foundations` | `design-interface/foundations/` | interface-owned subworkflow | keep `/interface:foundations` alias during transition |
| `design-motion` | unchanged | `sk-design` hub mode | `/interface:motion` unchanged |
| `design-audit` | standalone skill outside the hub | independent advisor identity | keep `/interface:audit` forwarding alias during transition |
| `design-md-generator` | unchanged | `sk-design` hub mode | `/interface:design-reference` unchanged |
| `design-mcp-open-design` | unchanged | paired hub transport mode | no command, unchanged |
| `styles/` | unchanged hub-shared package | non-mode, not advisor-visible | facade contract preserved |

[SOURCE: lineages/sol/iterations/iteration-005.md:24-40]

After Stage 1 the hub registry moves from six entries to five by removing foundations. After Stage 2 it moves from five to four by removing audit. The four survivors remain under the single `sk-design` advisor identity; only audit intentionally splits into another advisor identity. [SOURCE: lineages/sol/iterations/iteration-005.md:28-38] [SOURCE: lineages/sol/iterations/iteration-005.md:133-147]

## 9. Compatibility Consumers

The build packet must explicitly migrate these old-contract speakers:

| Consumer | Contract to preserve |
|---|---|
| `shared/scripts/interface-command-contract.test.mjs` | canonical commands, registry projection, eight visible output blocks, shared lifecycle and proof rules |
| `shared/scripts/design-command-surface-check.test.mjs` | exact sibling tokens, auto/confirm step parity, choreography shape, transport token validation |
| `command-metadata.json` | four `preferSiblingWhen` audit edges plus `acceptsFrom`, `nextCommands`, and sequence rows |
| `mode-registry.json` | transform-verb framing/application split while foundations and audit leave the mode list |
| `shared/procedures/polish-gate-orchestration.md` | `design-audit` remains the owning reviewer; foundations repair path moves |
| AI-fingerprint parity checks | catalogue, fixtures, and validation scripts move atomically with standalone audit |
| styles facade consumers | import/CLI path, result shape, include order, byte caps, truncation, and backend default |

[SOURCE: lineages/sol/iterations/iteration-005.md:42-119]

Compatibility aliases are concrete shipped behavior and justify temporary compatibility code. Alias removal is a separate, evidence-gated operation, not part of the initial folder moves. [SOURCE: lineages/sol/iterations/iteration-005.md:95-107] [SOURCE: lineages/sol/iterations/iteration-005.md:165-171]

## 10. Ordered Migration Plan

### Stage 0: Baseline

Capture the current registry, command, advisor, corpus, styles, and parity-test results. If the baseline is not green, stop before topology changes. This snapshot is the rollback anchor. [SOURCE: lineages/sol/iterations/iteration-005.md:125-131]

### Stage 1: Fold foundations into interface

Move foundations-owned procedures, references, assets, corpus, and validators under an interface-owned leaf. Keep `/interface:foundations` as an alias, update registry/router/metadata ownership, and repoint behavior tests rather than deleting them. Roll back to Stage 0 if alias parity, sibling discrimination, or the foundations corpus tests fail. [SOURCE: lineages/sol/iterations/iteration-005.md:133-139]

### Stage 2: Extract audit

Create a standalone audit skill carrying its references, assets, procedures, scripts, corpus, and parity tests. Keep a thin hub alias for `/interface:audit`, remove audit from the hub mode list, and move the AI-fingerprint catalogue and its checks atomically. Roll back to Stage 1 if alias routing, comparison-corpus tests, fingerprint parity, or reviewer identity fails. [SOURCE: lineages/sol/iterations/iteration-005.md:141-147]

### Stage 3: Repoint discriminator identity

Keep `/interface:audit` as the public sibling token while adding or updating the internal pointer to the standalone audit identity. Verify all four sibling discriminators and advisor routing. Roll back to Stage 2 if any discriminator loses a valid target. [SOURCE: lineages/sol/iterations/iteration-005.md:149-155]

### Stage 4: Ratify styles policy

Do not move the styles package. Document and verify the single shared facade/manifest policy while keeping all five consumers' observable behavior unchanged. Revert only the policy change if build, query, hydration, or corpus tests differ. [SOURCE: lineages/sol/iterations/iteration-005.md:157-163]

### Stage 5: Retire aliases only with traffic evidence

After an operator-selected minimum transition window, remove an alias only when observed usage is zero and no in-flight work depends on it. Otherwise extend the window. Alias retirement is independently reversible and should not block the first four stages. [SOURCE: lineages/sol/iterations/iteration-005.md:165-182]

## 11. Ranked Recommendations

| Rank | Recommendation | Why |
|---:|---|---|
| 1 | Keep a four-mode `sk-design` hub | Preserves one coherent design advisor while removing two mode identities |
| 2 | Fold foundations into an interface-owned subworkflow | Preserves a real workflow without preserving unnecessary hub-mode identity |
| 3 | Extract audit as a standalone skill | Preserves its distinct review, scoring, corpus, parity, and executable-gate authority |
| 4 | Keep styles hub-shared behind the existing facade | Maintains one storage-neutral contract for five consumers |
| 5 | Preserve both public aliases during migration | Protects existing commands, tests, sibling routing, and operator workflows |
| 6 | Require stage-local green gates and rollback | Keeps failures attributable and prevents topology changes from compounding |
| 7 | Defer alias removal to observed telemetry | Repository structure cannot prove production frequency |

[SOURCE: lineages/sol/iterations/iteration-005.md:244-256]

## 12. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Keep foundations as a hub mode because tests name it | Tests encode current topology and can be repointed; they do not prove future identity | Command and corpus contract analysis | 3 |
| Flatten foundations into shared doctrine | Shared doctrine cannot replace its intake, procedure selection, artifact, validation, and handoff | Foundations workflow trace | 3 |
| Fold audit into interface as a polish phase | Interface already owns binary preflight; audit owns a distinct graded review contract | Audit and interface contract comparison | 4 |
| Turn audit into a shared procedure | A procedure cannot carry the corpus, parity checks, catalogue, and Bash-dependent gates | Audit owned-surface inventory | 4 |
| Run audit automatically after interface work | Audit is recommend-only and separately invoked; automatic chaining changes user intent | Audit workflow contract | 4 |
| Reuse audit severity for interface preflight | Graded P0-P3 scoring and binary SHIP/FIX answer different decisions | Audit/preflight comparison | 4 |
| Move styles under md-generator or interface | Four or more sibling dependencies would invert or cross-wire | Five-consumer call graph | 1, 2 |
| Create a fifth styles mode | Styles is a shared data/service boundary, not a user workflow | Facade and ownership analysis | 2 |
| Dependency-inject styles into each consumer | Duplicates one storage-neutral contract and engine implementation | Ownership analysis | 2, 5 |
| Treat requested includes as fully hydrated | Byte caps can return only a truncated first artifact | Live facade probe | 2 |
| Use repository mention counts as frequency | Historical and generated files dominate those counts | Utilization baseline | 1, 2 |
| Combine foundations and audit moves in one stage | Different rollback and verification gates would lose failure attribution | Migration design | 5 |
| Remove aliases during the initial move | Existing commands, tests, and sibling routes are concrete compatibility consumers | Compatibility inventory | 5 |

## Divergence Map

The lineage used default convergence mode and a hard five-iteration cap, so no divergent Council pivots were emitted. Breadth came from sequential inventory, styles tracing, foundations tracing, audit tracing, and final migration planning. Saturated directions are represented in the Eliminated Alternatives table. The remaining frontier is implementation packaging and traffic measurement, not the core topology decision. [SOURCE: lineages/sol/iterations/iteration-001.md:89-95] [SOURCE: lineages/sol/iterations/iteration-005.md:271-319]

## 13. Open Questions

The six charter questions are answered at planning depth. These implementation or operational questions remain:

- What observed alias-use threshold and measurement window should authorize removal of `/interface:foundations` and `/interface:audit`?
- Should the AI-fingerprint path switch be protected only by one atomic move, or also by a temporary path-indirection mechanism?
- What exact alias representation is supported by the current registry/router schemas without adding an unsupported field?
- Which current styles manifest is the canonical place for a shared-policy declaration?
- Production invocation frequency remains unknown until external telemetry exists.

No evidence supports further structural separation between md-generator and interface beyond their current packet boundaries; keep the current separation unless implementation reveals a measured coupling defect. [SOURCE: lineages/sol/iterations/iteration-005.md:258-269]

## 14. Risks And Controls

| Risk | Control | Failure behavior |
|---|---|---|
| Foundations alias loses workflow parity | Preserve auto/confirm shape and run contract plus corpus tests | Roll back Stage 1 |
| Audit extraction splits catalogue from checks | Move catalogue, fixtures, and checks atomically | Roll back Stage 2 |
| Audit sibling routing disappears | Test all four discriminators and retain public alias token | Roll back Stage 2 or 3 |
| Transform framing/application split is lost | Preserve audit framing metadata independently of hub mode membership | Block Stage 2 completion |
| Styles facade behavior changes | Freeze import/CLI path, result shape, byte caps, include order, and backend default | Revert Stage 4 only |
| Alias retirement breaks active users | Require traffic observation and extend the window when use remains | Restore or retain alias |
| Structural reachability is overstated as frequency | Label frequency unknown and avoid utilization-based deletion claims | Block unsupported removal claim |
| Documentation path contradictions propagate | Correct `_engine`/`_db` and default-mode contradictions before moves | Block Stage 1 until canonical paths are chosen |

[SOURCE: lineages/sol/iterations/iteration-005.md:232-242] [SOURCE: lineages/sol/iterations/iteration-001.md:25-27]

## 15. Implementation Sequence

### Phase A: Plan and baseline

- Create a separate implementation packet with the topology table as frozen scope.
- Record stack-appropriate baseline tests and exact pass counts.
- Resolve the router default and documented styles-path contradictions.

### Phase B: Foundations migration

- Move the foundations-owned leaf surface.
- Add the forwarding alias before removing the hub mode.
- Repoint imports and tests, then run the full Stage 1 gate.

### Phase C: Audit migration

- Scaffold the standalone skill and advisor metadata.
- Move the audit surface and fingerprint parity contract atomically.
- Add the forwarding alias before removing the hub mode.
- Repoint sibling identity and run the full Stage 2-3 gates.

### Phase D: Styles policy and end-to-end verification

- Keep the package in place and document its shared non-mode ownership.
- Verify query/hydration compatibility and all consumer tests.
- Re-run command, hub, advisor, corpus, and strict packet validation.

### Phase E: Measured deprecation

- Observe alias traffic for the operator-selected window.
- Retain, warn, or remove each alias independently based on evidence.

## 16. References

### Iteration evidence

- `lineages/sol/iterations/iteration-001.md`: inventory, routing, advisor topology, styles consumers, and contradictions.
- `lineages/sol/iterations/iteration-002.md`: styles call cardinality, hydration behavior, adapter selection, and ownership.
- `lineages/sol/iterations/iteration-003.md`: foundations invocation and ownership boundary.
- `lineages/sol/iterations/iteration-004.md`: audit invocation, scoring, corpus, gates, and standalone-skill verdict.
- `lineages/sol/iterations/iteration-005.md`: target topology, compatibility consumers, staged migration, rollback, tests, and risks.

### Workflow outputs

- `findings-registry.json`: merged fan-out registry.
- `resource-map.md`: reducer-generated aggregation from all five lineage delta files.
- `deep-research-state.jsonl`: root synthesis state and terminal events.
- `lineages/sol/deep-research-state.jsonl`: immutable route-proof iteration state.

The generated resource map indexes 52 references and records all five lineage delta sources. Its status column is an aggregation aid, not a substitute for the iteration citations above. [SOURCE: resource-map.md:11-17] [SOURCE: resource-map.md:112-120]

## 17. Convergence Report

- Stop reason: `maxIterationsReached` under `stopPolicy=max-iterations`.
- Total iterations: 5 of exactly 5 required.
- Evidence sequence: inventory (1.00), styles (0.84), foundations (0.80), audit (0.78), migration plan (0.65).
- Convergence threshold: 0.05, telemetry-only before the hard cap.
- Charter coverage: all six research questions addressed at planning depth.
- Route proof: every iteration record identifies `target_agent: deep-research`, `agent_definition_loaded: true`, `resolved_route`, and `mode: research`.
- Resource aggregation: five lineage deltas consumed.
- Divergent pivots: none.
- Residual uncertainty: production invocation frequency, exact alias schema, fingerprint move indirection, and deprecation timing.
- Implementation status: not started; this packet produces research and a migration contract only.

[SOURCE: lineages/sol/deep-research-state.jsonl] [SOURCE: lineages/sol/iterations/iteration-005.md:303-319]
