# Iteration 1: Current-Contract Gap Map

## Focus

Compare phase 001's settled corpus-retrieval and consumption baseline with the current hub, interface, foundations, motion, audit, and Open Design contracts; identify each consumer's existing hook, missing integration, and forbidden coupling. The selected interpretation is contract architecture, not implementation design.

## Actions Taken

1. Read the phase-001 synthesis to recover the settled manifest, eligibility, candidate-card, mode-owned selection, bounded hydration, and proof pipeline. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:66-145]
2. Inspected the hub and registry for routing authority, intake, visible-plan, proof, mode-kind, backend, and tool-surface boundaries. [SOURCE: .opencode/skills/sk-design/SKILL.md:40-71] [SOURCE: .opencode/skills/sk-design/SKILL.md:155-184] [SOURCE: .opencode/skills/sk-design/mode-registry.json:39-164]
3. Inspected all four judgment-mode contracts for mode-owned decisions, existing context/proof hooks, fallback behavior, and handoff boundaries. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:71-92] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:85-103] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:97-113] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:95-117]
4. Inspected Open Design's mandatory-pairing, live-read, generation, and no-cache constraints, then synthesized a shared-plane gap matrix and integration backlog. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:20-24] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:123-152]

## Findings

1. **The phase-001 substrate is complete enough to reuse, but it deliberately stops before mode-specific workflow insertion.** It already defines canonical artifacts, a generation-checked manifest, deterministic eligibility, optional lexical ranking, bounded cards, mode-owned selection, bounded hydration, and `CORPUS_USE_PROOF v1`; its consumer table also says the hub receives cards but hydrates nothing. The present gap is therefore not another retriever but the contract by which each existing mode workflow requests, interprets, and proves corpus use. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:66-94] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:96-145]

2. **Responsibility and gap matrix.** The missing points are mode-local consumers plus one routing-only shared envelope; no consumer needs a second selection authority. [INFERENCE: based on the cited phase-001 consumer contract and current mode contracts]

   | Consumer | Current authority | Existing hook | Missing integration | Forbidden coupling |
   |---|---|---|---|---|
   | Hub | Intake, registry route, smallest useful mode, visible route/proof plan | Five-field manager intake; visible plan; hub names proof while modes supply it | A shared corpus-capability and use-plan envelope that the selected mode can fill and the hub can display | Hub-local taste policy, direct hydration, corpus-driven mode routing, or declaring proof itself [SOURCE: .opencode/skills/sk-design/SKILL.md:42-71] [SOURCE: .opencode/skills/sk-design/SKILL.md:155-184] |
   | Interface | Brief-specific visual direction, register/dials, justified risk, anti-default critique, and build handoff | Context manifest, variation-diversity lane, real-UI loop, preflight, `sk-code` envelope | Explicit anchor, contrast, and rejection-reference slots in the context manifest and proof line, with bounded rationale hydration | Style chooser, preset menu, exact-copy path, or corpus overriding pinned brief/system axes [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:14-32] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:71-92] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:169-209] |
   | Foundations | Static-system roles and token/handoff decisions | Axis router, token starter, context/proof basis, downstream verification-risk handoff | Axis compatibility map with one owner per independent axis, retained provenance, and explicit unverified contrast/accessibility fields | Averaging token values, synthetic style blending without owners, extraction truth, or accessibility proof [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:13-46] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:85-103] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:111-156] |
   | Motion | Whether motion exists, temporal purpose, restraint, pattern specification, reduced-motion path | Restraint gate, motion-budget dial, temporal router, pattern cards, performance-failure card | Motion-eligibility evidence and an explicit `no temporal evidence`/no-motion negative baseline before optional motion-section hydration | Inferring animation from static similarity, bypassing the restraint gate, or treating a corpus item as reduced-motion/performance proof [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:13-47] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:80-113] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:260-300] |
   | Audit | Evidence labels, severity, five-dimension score, owner mapping, release judgment | Evidence worksheet, audit report, target-resolution lane, findings backlog | A corpus-comparison evidence row for intended-anchor drift, similarity, and anti-default prevalence, kept separate from target and WCAG evidence | Corpus-derived severity, corpus-as-target evidence, corpus-as-WCAG proof, or automatic remediation [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:13-50] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:95-117] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:136-193] |
   | Open Design | Transport mechanics only; the paired judgment mode remains design authority | Mandatory `sk-design` gate, live design-system reads, multi-turn run, live-tool verification | A transport receipt carrying selected corpus IDs/generation, judgment-mode rationale, bounded brief fields, and returned artifact provenance without caching source payloads | Transport taste, repo caching/vendoring, unpaired design-bearing reads/runs, or unconfirmed mutation [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:20-24] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:123-152] |

3. **`CORPUS_CONTEXT_PLAN v1` is the smallest hub-level contract that answers the first key question without making the hub a taste authority.** Before routing, the hub may expose neutral capabilities (`generation`, available artifact/axis capabilities, card/hydration limits, degraded-state flag). After routing, the selected mode translates intake into the generic candidate request, owns facets/exclusions/selection, and returns selected IDs plus rationale. The hub only renders the plan: authority order `user brief and owned system > mode judgment > corpus reference evidence > transport output`, expected proof, fallback, and handoff. This reuses the hub's intake/visible-plan/proof cadence and phase 001's rule that modes submit generic needs and own selection. [SOURCE: .opencode/skills/sk-design/SKILL.md:44-71] [SOURCE: .opencode/skills/sk-design/SKILL.md:155-184] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:98-128] [INFERENCE: the envelope separates routing display from mode-owned judgment]

4. **Five shared-plane ideas extend beyond query/cards/hydration while preserving mode authority.** [INFERENCE: each idea attaches to an existing context, proof, comparison, or transport hook cited below]

   | Idea | Integration shape | Rough build cost | Main contract risk |
   |---|---|---:|---|
   | Corpus context/proof envelope | Add generation, selected IDs, rationale, rejection reason, fallback, and proof receipt to shared context/proof cards; modes fill judgment fields | Small (2-4 engineer-days) | Hub starts selecting rather than displaying [SOURCE: .opencode/skills/sk-design/SKILL.md:155-184] |
   | Relational exemplar sets | Let interface request one anchor, one deliberate contrast, and one rejected default so variation and anti-default critique operate on relationships, not a style menu | Medium (4-7 days) | “Three presets” behavior or copied signatures [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:80-89] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:195-205] |
   | Axis-compatibility graph | Record compatible color/type/spacing owners and explicit conflicts; foundations composes only with one owner per independent axis and emits verification risks | Medium (1-2 weeks) | Averaging, invented compatibility, or false accessibility confidence [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:113-156] |
   | Corpus-relative drift fingerprint | Audit compares target tokens/patterns with an intended anchor and corpus distribution, reporting similarity/drift as evidence—not severity or correctness | Medium (1-2 weeks) | Similarity mistaken for quality, WCAG evidence, or proof of copying [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:138-173] |
   | Transport grounding receipt | Put bounded selected-reference metadata and mode rationale into Open Design briefs; attach returned project/run/artifact provenance to the proof record, while reading source material live | Small-medium (3-6 days) | Caching corpus/Open Design content or letting transport output decide acceptance [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:123-152] |

5. **Recommended order is envelope first, mode-local consumers second, transport last.** The shared context/proof envelope has the lowest cost and creates a stable insertion point. Interface relational exemplars and audit drift evidence can then validate two distinct consumption shapes; foundations compatibility and sparse motion evidence need stronger schemas; Open Design should consume the settled receipt rather than define it. This sequence follows the registry's workflow-versus-transport boundary and the hub's prohibition on flattened mode behavior. [SOURCE: .opencode/skills/sk-design/mode-registry.json:39-164] [SOURCE: .opencode/skills/sk-design/SKILL.md:166-184] [INFERENCE: sequencing minimizes authority and schema rework]

6. **`md-generator` remains outside this lineage.** Its extraction/fidelity contract is phase-002-owned; this iteration neither inspected nor proposed changes to that consumer. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deep-research-strategy.md:27-31]

## Questions Answered

- What hub-level contract can expose corpus capabilities, task-derived queries, authority order, and proof requirements while keeping the hub routing-only? Answer: `CORPUS_CONTEXT_PLAN v1`, with neutral capability disclosure at intake, mode-owned request/selection after routing, and hub-rendered authority/proof/fallback fields.

## Questions Remaining

1. How should `design-interface` use coherent exemplars for grounding, anti-default critique, variation diversity, and handoff without becoming a chooser or copy path?
2. How should `design-foundations` turn token axes and relationships into safe starting systems and compatibility maps without averaging or false proof?
3. How should `design-motion` use sparse temporal evidence and safe no-motion inference under its restraint gate?
4. How should `design-audit` and Open Design operationalize drift, similarity, provenance, and transport grounding, and what should ship first after contract validation?

## Dead Ends

- **Hub-local taste policy:** rejected because the hub is registry/routing-only and the selected mode owns judgment. [SOURCE: .opencode/skills/sk-design/SKILL.md:40-71] [SOURCE: .opencode/skills/sk-design/SKILL.md:172-184]
- **Mode flattening into one corpus consumer:** rejected because current contracts preserve distinct interface, foundations, motion, and audit authorities and proof obligations. [SOURCE: .opencode/skills/sk-design/SKILL.md:166-184]
- **Corpus-driven routing:** rejected because routing follows user intent and the registry; the corpus is consulted only after a mode is selected. [SOURCE: .opencode/skills/sk-design/SKILL.md:42-71] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:98-128]
- **Caching corpus/Open Design payloads into the repository:** rejected because Open Design content must be read live and not vendored. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:145-152]

## Assessment

- New information ratio: 0.83
- Novelty calculation: 4 of 6 findings are fully new gap/integration syntheses and 2 partially refine the phase-001 baseline: `(4 + 0.5 × 2) / 6 = 0.83`.
- Questions addressed: all five at gap-map depth, with detailed resolution of the hub contract.
- Questions answered: 1 of 5.
- Edge cases: none; sources were available and current contracts were mutually consistent.

## Reflection

- What worked and why: comparing the phase-001 consumer table directly with each mode's current context, proof, and handoff hooks exposed missing insertion points without reopening retrieval architecture.
- What did not work and why: mode contracts alone cannot validate the proposed schemas against representative corpus bundles; that evidence belongs in focused mode iterations.
- What I would do differently: next iteration should test one complete interface exemplar flow—anchor, contrast, rejection, bounded hydration, critique, and handoff—against representative phase-001 card fields rather than broadening the matrix.

## Sources Consulted

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/research.md:37-145`
- `.opencode/skills/sk-design/SKILL.md:35-184`
- `.opencode/skills/sk-design/mode-registry.json:1-166`
- `.opencode/skills/sk-design/design-interface/SKILL.md:1-220`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:1-170`
- `.opencode/skills/sk-design/design-motion/SKILL.md:1-315`
- `.opencode/skills/sk-design/design-audit/SKILL.md:1-210`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1-155`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/deep-research-strategy.md:17-31`

## Recommended Next Focus

Define and evidence the `design-interface` corpus-consumption contract: anchor/contrast/rejection roles, query fields, hydration bounds, anti-copy rules, variation-diversity behavior, and the exact context/proof/handoff fields that carry the selection.
