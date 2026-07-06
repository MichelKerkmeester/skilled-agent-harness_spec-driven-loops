# Iteration 7: Subskill / Procedure Content Strategy

## Focus

This iteration translated the public five-mode/private-procedure architecture into content-level transformation guidance for each current `sk-design` mode packet plus shared procedure assets. The state log has six prior iteration records, so this pass used iteration 7, and `iteration-007.md` did not exist before writing. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/research/deep-research-state.jsonl:7]

Selected interpretation: "Claude Design parity" means cloning the procedure choreography, evidence gates, and design-manager voice inside the existing OpenCode-native five-mode family, not creating 14 public modes or importing Claude-only agent fan-out mechanics. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/mode-registry.json:32] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:22]

## Findings

1. **`design-interface` should become the production-procedure host for greenfield direction, wireframes, variations, prototypes, tweak panels, and interface preflight.** Keep the current register-first/two-pass direction model, mechanical delivery gates, anti-default critique, and sk-code handoff, because the packet already grounds subject, tokens, critique, build, and self-critique before delivery. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:142] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:146] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:175] Import/adapt external `discovery-questions`, `frontend-aesthetic-direction`, `wireframe`, `generate-variations`, `make-a-prototype`, and `make-tweakable` as selectable procedure cards: ask only design-changing questions, commit to concrete axes when no brand exists, produce 3+ meaningfully distinct options, model real prototype screens/state, and expose only a small live-tweak surface. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/discovery-questions.md:38] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/frontend-aesthetic-direction.md:30] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/generate-variations.md:29] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/make-a-prototype.md:18] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/make-tweakable.md:19]
   - Keep: register/dials, anti-default critique, interface preflight, real-UI handoff.
   - Import/adapt: discovery, aesthetic commitment, low-fi wireframe exploration, variation ordering, prototype state map, tweak panel host protocol.
   - Transformation: split the current monolithic interface workflow into named cards (`discover`, `aesthetic-direction`, `wireframe`, `variation-canvas`, `prototype-flow`, `tweakable-controls`, `preflight`) selected by router intent after register/dials are loaded.
   - Negative knowledge: do not make every interface run ask questions or produce 3+ variants; external guidance itself says to skip asking when context is sufficient and to avoid padding question rounds. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/discovery-questions.md:27] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/discovery-questions.md:93]

2. **`design-foundations` should keep its static-system authority and absorb token/component/systemization procedures without taking over invention or live extraction.** Keep current ownership of color, typography, spacing, layout, responsive adaptation, data-viz, token vocabulary, contrast evidence, and sk-code handoff. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:240] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:252] Import/adapt external `design-system-extract` as a non-authoritative source-analysis procedure for source identification, gaps, and inconsistencies, and external `component-extract` as a component-inventory procedure with variants/states/tokens/accessibility notes. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/design-system-extract.md:7] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/design-system-extract.md:156] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/component-extract.md:28] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/component-extract.md:81]
   - Keep: OKLCH/color-system math, type/layout/data references, token starter, contrast calculator gate, foundation handoff.
   - Import/adapt: source token gap report, component inventory schema, hierarchy/rhythm scale checks as foundations review cards.
   - Transformation: add `system-source-read`, `component-inventory`, and `rhythm-scale-review` cards that emit token/component decisions into the existing foundations handoff rather than a new public mode.
   - Negative knowledge: do not make foundations invent the overall interface direction; the packet explicitly routes direction/voice/signature concept to `interface`, and measured live-site extraction to `md-generator`. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:36] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:39]

3. **`design-motion` should remain the temporal authority, but it needs a Claude-like interaction-state procedure lane.** Keep the current temporal-layer contract, restraint gate, motion-budget dial, pattern cards, `AnimatePresence` checklist, performance failure card, and sk-code stack-boundary handoff. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:99] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:257] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:272] Import/adapt `interaction-states-pass` for default/hover/active/disabled/focus/loading coverage, transition timing, feedback, and reduced-motion handling. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/interaction-states-pass.md:9] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/interaction-states-pass.md:23] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/interaction-states-pass.md:70] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/interaction-states-pass.md:88]
   - Keep: purpose-before-properties, motion budget, performance/reduced-motion gate, implementation mechanism boundary.
   - Import/adapt: interactive element inventory and six-state verification, action feedback matrix, transition timing normalization.
   - Transformation: add a `state-feedback-pass` card that consumes interface's state model and emits motion/state fixes or handoff rows, with `motion` owning transitions and `interface` owning broader flow/state structure.
   - Negative knowledge: do not turn this into "animate everything" or a prototype-builder clone; the current packet already rejects animation without a user/state/hierarchy/continuity reason. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:295]

4. **`design-audit` should become the Claude-like final aggregator, but expressed as evidence-backed review lanes rather than Claude-only parallel subagents.** Keep the current findings-first audit contract, register-weighted severity, evidence labels, five-dimension `/20` scoring, owner mapping, and audit-never-fixes boundary. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:271] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:274] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:280] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:284] Import/adapt Claude's `accessibility-audit`, `ai-slop-check`, `hierarchy-rhythm-review`, `interaction-states-pass`, and `polish-pass` as audit lanes: accessibility blockers, generic-AI fingerprints, hierarchy/rhythm, state feedback, aggregation/dedup/prioritization. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/accessibility-audit.md:21] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/ai-slop-check.md:25] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/hierarchy-rhythm-review.md:26] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:71]
   - Keep: P0-P3 severity, confirmed/inferred/not-assessed evidence, five dimensions, accepted-finding backlog handoff.
   - Import/adapt: four-lane final polish model, but collapse "fix directly" language into review recommendations unless the caller explicitly enters implementation.
   - Transformation: reorganize audit content into `a11y-perf`, `ai-slop`, `hierarchy-rhythm`, `interaction-states`, and `polish-aggregate` cards that feed the existing audit report template and owner map.
   - Negative knowledge: do not import Claude's required parallel `AGENT_TOOL_NAME` fan-out as a packet invariant; external review skills call for agents, but this OpenCode research iteration and the target route must stay leaf-safe and can express them as serial lanes/proof fields. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/accessibility-audit.md:15] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/hierarchy-rhythm-review.md:20] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:22]

5. **`design-md-generator` should preserve its unique measured Style Reference backend and only import source/gap vocabulary from external extraction procedures.** Keep the current live-URL Playwright extraction, five-viewport measured CSS capture, deterministic `tokens.json`, pre-rendered value sections, v3 `DESIGN.md` contract, cardinal fidelity rule, authoring boundary, and validation-before-completion rule. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:12] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:227] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:270] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:279] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:335] Import/adapt `design-system-extract` only as upstream source taxonomy and gap/inconsistency reporting, not as a replacement output format; external output is a tokens file, while current `md-generator` output is a publication-quality v3 Style Reference consumed by agents. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/design-system-extract.md:69] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/design-system-extract.md:156] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:344]
   - Keep: measured-only values, stability classes, source-of-truth router card, validate/proof/report scripts, study examples.
   - Import/adapt: source identification checklist, token category taxonomy, gaps/inconsistencies report language.
   - Transformation: add a short `Claude-procedure bridge` section that maps external "design-system-extract" to `EXTRACT_WRITE` / `VALIDATE` / `STUDY` phases while emphasizing the stricter current fidelity contract.
   - Negative knowledge: do not loosen authoring boundaries for brief-only design-system docs; current mode explicitly routes brief-only Style Reference authoring out of scope. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:46] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:281]

6. **Shared/procedure assets should be a private procedure layer under the existing hub, not a sixth mode or another advisor identity.** Keep the hub's single advisor-routable identity, five registry modes, `workflowMode`/`backendKind` discriminator, build-bundle rule, shared register, and context/proof gates; the hub must stay routing-only and shared files must remain vocabulary, not workflow owners. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:58] [SOURCE: .opencode/skills/sk-design/SKILL.md:82] [SOURCE: .opencode/skills/sk-design/shared/register.md:24] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:31]
   - Keep: single `sk-design` identity, registry mode resolution, shared register/dials, context manifest, proof fields, hard gates, transport boundary.
   - Import/adapt: a private procedure index that maps the 14 external Claude procedures to mode-local cards and shared proof schemas (`discovery`, `aesthetic-direction`, `variation`, `prototype`, `component-inventory`, `polish-aggregate`, etc.).
   - Transformation: add shared assets for `procedure_card_schema`, `procedure_index`, and `procedure_selection_rules`; each row should name owning mode, trigger, required context/proof fields, output shape, and negative rules.
   - Negative knowledge: do not put procedure logic in the parent hub, do not add graph metadata inside procedure folders, and do not expose 14 public modes; current hub rules explicitly forbid per-mode logic in the hub and extra discoverable skill identities. [SOURCE: .opencode/skills/sk-design/SKILL.md:89] [SOURCE: .opencode/skills/sk-design/SKILL.md:96] [SOURCE: .opencode/skills/sk-design/SKILL.md:118]

## Ruled Out

- **Literal 14-mode clone:** ruled out because the current hub is intentionally one skill with five modes and registry resolution. [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/mode-registry.json:32]
- **Claude parallel-agent mechanics as required packet content:** ruled out for this strategy because external review procedures call for agent fan-out, while the desired OpenCode packet content can express those as audit lanes and proof fields. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:22] [INFERENCE: based on the leaf-only dispatch constraint plus current audit evidence/proof contracts]
- **Replacing `md-generator` with generic token extraction:** ruled out because the existing mode is stricter and more valuable: measured CSS to v3 Style Reference plus validation, not only a tokens file. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:270] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/design-system-extract.md:69]

## Dead Ends

- A shared `procedures/` folder that owns workflows independently of modes is a dead end; shared files are explicitly vocabulary/proof contracts, not a sixth mode. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:16] [SOURCE: .opencode/skills/sk-design/shared/register.md:28]
- Turning audit into an implementation fixer by default is a dead end; current audit ends with recommended next actions and never applies fixes in review-only mode. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:282] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:286]

## Edge Cases

- Ambiguous input: The dispatch included both leaf-only/no-Task constraints and a final sentence requesting Task/subagent dispatch. I selected the stricter LEAF interpretation and performed the iteration directly; the deferred alternative is no action because nested dispatch is out of scope for this agent. [INFERENCE: based on the dispatch constraints and final sentence conflict]
- Contradictory evidence: External Claude review skills require parallel agents, while the current OpenCode research route and target content strategy must be leaf-safe. The resolution is to preserve review coverage as lanes/cards/proof fields, not required nested agents. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/accessibility-audit.md:15] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:22]
- Missing dependencies: none; required state, current packets, shared references, and external procedure files were readable.
- Partial success: none; all requested per-mode areas received cited content guidance.

## Sources Consulted

- `.opencode/specs/sk-design/009-sk-design-claude-parity/research/deep-research-config.json:15`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/research/deep-research-state.jsonl:7`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/research/deep-research-strategy.md:45`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/research/deep-research-findings-registry.json:12`
- `.opencode/skills/sk-design/SKILL.md:15`
- `.opencode/skills/sk-design/mode-registry.json:32`
- `.opencode/skills/sk-design/design-interface/SKILL.md:142`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:240`
- `.opencode/skills/sk-design/design-motion/SKILL.md:257`
- `.opencode/skills/sk-design/design-audit/SKILL.md:271`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:227`
- `.opencode/skills/sk-design/shared/register.md:24`
- `.opencode/skills/sk-design/shared/context_loading_contract.md:31`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/discovery-questions.md:38`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/frontend-aesthetic-direction.md:30`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/wireframe.md:34`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/generate-variations.md:29`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/make-a-deck.md:21`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/make-a-prototype.md:18`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/make-tweakable.md:57`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/design-system-extract.md:7`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/component-extract.md:28`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/accessibility-audit.md:21`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/ai-slop-check.md:25`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/hierarchy-rhythm-review.md:26`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/interaction-states-pass.md:23`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:71`

## Assessment

- New information ratio: 0.93
- Questions addressed: Q2 external taxonomy mapping, Q3 OpenCode feature preservation, Q4 parent/mode contract, partial Q5 verification proof shape.
- Questions answered: per-mode content transformation strategy for `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, and shared/procedure assets.

## Reflection

- What worked and why: Reading the current mode packets beside all 14 Claude procedure cards made the transformation target concrete: most change should be content reorganization into mode-owned procedure cards, not new public identities.
- What did not work and why: External review procedures assume Claude's parallel-agent runtime, which conflicts with the LEAF/OpenCode route; treating agent fan-out as a coverage pattern rather than a transport requirement resolved the conflict.
- What I would do differently: Next iteration should convert this strategy into a benchmark/acceptance matrix so implementation can prove the packets feel Claude-like without validating by vibe alone.

## Recommended Next Focus

Draft verification scenarios and acceptance criteria for the refactor: one greenfield interface run, one token/component systemization run, one interaction-state/motion run, one audit/polish run, and one measured `DESIGN.md` extraction run, each with expected loaded procedures, proof cards, and negative checks.
