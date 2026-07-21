# Iteration 8: Hallmark ROADMAP Versus Shipped sk-design

## Route Proof

`Resolved route: mode=research target_agent=deep-research`

- Execution: `single_iteration`
- State source: `externalized_files`
- Mode switch: prohibited
- Lineage: `research/lineages/sol-opencode`

## Focus

Evaluate the requested Hallmark ROADMAP proposals against the shipped five-mode `sk-design` hub and `/interface:*` commands. Classify each proposal as already shipped, a surgical strengthening of an existing owner, genuinely new, or a skip. Preserve the established boundaries: no separate redesign or variant command, no theme presets, measured extraction remains canonical, and semantic motion modifiers belong in existing shared and mode-owned assets.

## Findings

### 1. `hallmark variant` is already shipped as the `directions` lane

`/interface:design` already exposes `directions`, while Interface routes requests for variations and multiple directions to a private variation procedure. That procedure normally returns three to five options, requires differences in layout, hierarchy, interaction, type, density, copy, or tone, and ends with a recommendation. The seed-of-thought reference further prevents median variants without exposing a reusable chooser. No command, alias, or new capability is warranted; the only surgical improvement is to make structural deltas explicit in the existing output. [SOURCE: .opencode/commands/interface/design.md:55-59] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:19-27] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:23-35] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:111-116]

### 2. Brand-first flow is genuinely new, but generated brand guidance cannot be a measured Style Reference

Hallmark proposes inventing palette, type, voice, and imagery from a product description and persisting them as `design.md`. Shipped Interface already owns greenfield visual direction when no brand exists, and Foundations owns concrete static tokens, but no current artifact persists that authored system for page-after-page use. MD-GENERATOR is explicitly forbidden from filling this gap: its `DESIGN.md` values must come from `tokens.json`, and brief-only forward authoring must produce no partial Style Reference. The new capability therefore belongs as an Interface-led authored-system lane, supported by Foundations, with a distinctly named artifact and provenance contract that cannot be confused with extracted `DESIGN.md`. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:15-15] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/aesthetic-direction.md:19-27] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:29-37] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:86-98]

### 3. Theme-aware motion belongs in the existing semantic token handoff

The proposal's fixed per-theme duration values conflict with prior anti-preset findings. Shipped `/interface:motion` already resolves behavior and mechanism before duration/easing and carries register plus motion budget, while the shared vocabulary already defines duration, easing, delay, choreography, state, and reduced-motion concepts. Foundations also permits `--motion-*` and `--state-*` token names, but its starter does not yet carry a semantic motion-character handoff. Add evidence-derived character and rationale to the existing vocabulary/starter, then let Motion choose measured duration and easing tokens; do not copy Hallmark's multiplier table. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:17-17] [SOURCE: .opencode/commands/interface/motion.md:46-60] [SOURCE: .opencode/skills/sk-design/shared/design-token-vocabulary.md:81-88] [SOURCE: .opencode/skills/sk-design/design-foundations/references/design-system-artifact-contract.md:21-35]

### 4. The structural cookbook is partly shipped; decision-bearing fingerprints are the narrow gap

Interface already requires structurally distinct alternatives and rejects near-duplicates. The Hallmark proposal is valuable only as a worked reasoning format, not as twelve to twenty reusable HTML/CSS patterns. Add a small set of abstract fingerprint cards to the existing wireframe/variation lane, each recording region diagram, varied axes, brief-fit evidence, failure mode, and responsive collapse. Cards must be generated or selected as critique scaffolding, never exposed as presets or copied implementation sketches. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:21-21] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:33-39] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:38-46] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:111-116]

### 5. Codebase study is named in the shipped private procedure but not supported by the public command contract

The extraction procedure already recognizes `codebase` as a source type, yet `/interface:design-reference` still requires a canonical URL, access, route/state/viewport/theme coverage, and a captured source. This is a real contract mismatch, not grounds for a new `study` command. A future `--project <path>` input should resolve or launch a canonical rendered surface and feed the existing extract-write-validate pipeline. Static code inspection may identify candidate tokens and launch metadata, but it must be labeled separately and may not masquerade as rendered measurement. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:29-29] [SOURCE: .opencode/skills/sk-design/design-md-generator/procedures/design-system-extraction.md:33-39] [SOURCE: .opencode/commands/interface/design-reference.md:29-35] [SOURCE: .opencode/commands/interface/design-reference.md:46-53]

### 6. Multi-page coherence is measured in extraction but missing as an equally explicit authoring contract

MD-GENERATOR already classifies page groups as `unified`, `shared-foundation`, or `independent`, scores font/color/spacing/radius/component/shadow overlap, and reports anomalies. Interface's real-UI loop reads persisted briefs and existing systems, but it does not explicitly separate site-wide invariants from page-level expressive deltas. Add a coherence card to the existing loop and handoff: lock type/color roles, spacing rhythm, affordances, material/divider language, and navigation semantics; vary composition, heading placement, density, and one earned page signature. This is a high-value surgical addition, not a new extraction type or command. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:27-27] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:307-324] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/design-boundary-detect.ts:255-300] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:44-65]

### 7. `hallmark explain` is already covered by visible proof and rationale contracts

`/interface:design` already returns Route Proof, Resolved Brief, Grounding Record, Critique/Validation, Evidence Ledger, and Handoff. The shared context contract additionally blocks direction or handoff claims until decision, options, evidence, trade-offs, validation plan, and source proofs are recorded. A separate explain command would duplicate these artifacts. Strengthen existing presentation only if fixtures show that axis-level rationale is omitted; otherwise skip. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:35-35] [SOURCE: .opencode/commands/interface/design.md:69-71] [SOURCE: .opencode/skills/sk-design/shared/context-loading-contract.md:196-214] [SOURCE: .opencode/skills/sk-design/shared/context-loading-contract.md:266-279]

### 8. Negative capability deserves a surgical rationale field, not another rule catalog

The shared cognitive-law vocabulary already explains hierarchy, choice, targeting, feedback, salience, proximity, and grouping, and Audit consumes it when explaining findings. The gap is consistent attachment of perceptual or cognitive cause to anti-pattern records. Add an optional rationale and user-impact field to applicable audit/fingerprint records, backed by existing laws or cited evidence. Do not claim every taste failure has a cognitive-law explanation, and do not import Hallmark's anti-pattern prose wholesale. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:36-36] [SOURCE: .opencode/skills/sk-design/shared/cognitive-laws.md:22-28] [SOURCE: .opencode/skills/sk-design/shared/cognitive-laws.md:32-62] [SOURCE: .opencode/skills/sk-design/shared/cognitive-laws.md:66-71]

### 9. Emotion-first prompting is a missing intake signal, not a style system

Interface already resolves audience, desired adjectives, off-limits tropes, subject, posture, pinned axes, and existing system before selecting concrete type, color, density, imagery, and motion decisions. Its Design Read currently maps mostly style/use-case words to three dials. Add `desired audience feeling` and `avoid feeling` to the existing intake, then translate them through subject evidence into decisions. Emotion terms must never become a reusable theme menu or override pinned brand and accessibility constraints. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:37-37] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/aesthetic-direction.md:33-39] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/brief-to-dials.md:48-61] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/brief-to-dials.md:129-134]

## Roadmap Matrix

| Proposal | Shipped status | Verdict | Exact target paths | Surgical change | Value | Effort | Licensing | Phase / dependencies |
|---|---|---|---|---|---|---|---|---|
| `hallmark variant` | Already shipped as `directions` plus variation procedure | SKIP new command; LEARN in existing output | `.opencode/commands/interface/design.md`; `.opencode/skills/sk-design/design-interface/procedures/variation-set.md`; `.opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md` | Keep `directions`; expose structural delta, stable constraints, risk, and recommendation | High | Low | Clean-room wording; copying Hallmark command prose/examples requires MIT notice | Phase A; presentation and fixture updates only |
| Brand-first -> generated design artifact | Direction and tokens shipped separately; persistent authored artifact absent | INSPIRE-NEW | `.opencode/commands/interface/design.md`; `.opencode/skills/sk-design/design-interface/procedures/aesthetic-direction.md`; `.opencode/skills/sk-design/design-foundations/assets/token-starter.md`; new authored schema/validator under an Interface-owned path | Add an Interface-led authored-system lane and distinctly named artifact; never emit measured Style Reference `DESIGN.md` | Very high | High | Independent schema preferred; copied Hallmark text/schema requires MIT notice; imagery needs separate rights proof | Phase C; after Phase A rationale and Phase B handoff vocabulary; requires schema, provenance, overwrite, validation, and non-equivalence tests |
| Theme-aware motion tokens | Token vocabulary exists; semantic character handoff absent | ADAPT | `.opencode/skills/sk-design/shared/design-token-vocabulary.md`; `.opencode/skills/sk-design/design-foundations/assets/token-starter.md`; `.opencode/skills/sk-design/design-motion/references/motion-strategy.md` | Add evidence-derived motion character/rationale; Motion resolves durations/easing | High | Medium | Do not copy named themes or multipliers; native semantics avoid notice | Phase B; depends on agreed cross-mode envelope and tests |
| Structural cookbook | Distinct variation mechanics shipped; worked fingerprints absent | ADAPT | `.opencode/skills/sk-design/design-interface/procedures/wireframe-exploration.md`; `.opencode/skills/sk-design/design-interface/procedures/variation-set.md`; new asset under `.opencode/skills/sk-design/design-interface/assets/` | Add a bounded abstract fingerprint-card format, not implementation recipes | Medium-high | Medium | Independently author diagrams and prose; copied sketches/tables require MIT notice | Phase B; depends on no-preset fixtures and procedure routing |
| Codebase study | Private source-type mention shipped; public URL-only contract | ADAPT | `.opencode/commands/interface/design-reference.md`; `.opencode/skills/sk-design/design-md-generator/procedures/design-system-extraction.md`; `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts` | Add guarded `--project <path>` adapter that resolves a canonical render; segregate static evidence | High | High | Architecture can be native; copied Hallmark study flow requires MIT notice | Phase D; depends on launch detection, source attestation, local security, multi-route fixtures, and unchanged validators |
| Multi-page coherence | Measured detection shipped; authored invariants/deltas implicit | ADAPT | `.opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md`; `.opencode/skills/sk-design/shared/sk-code-handoff.md`; optional new Interface coherence card | Record site-wide locks separately from page-level variation | Very high | Low-medium | Idea-level clean-room adaptation; copied wording/tables require MIT notice | Phase A; should precede authored brand system and project adapter |
| `hallmark explain` | Visible explanation/proof artifacts shipped | SKIP command | `.opencode/commands/interface/assets/interface-design-presentation.txt`; `.opencode/skills/sk-design/shared/context-loading-contract.md` | Change only if behavioral fixtures show missing axis rationale | Medium | None-low | No Hallmark copying needed | Phase A verification first; no implementation without observed gap |
| Negative capability | Cognitive vocabulary shipped; record-level cause inconsistent | ADAPT | `.opencode/skills/sk-design/shared/cognitive-laws.md`; `.opencode/skills/sk-design/design-audit/assets/ai-fingerprint-registry.json`; `.opencode/skills/sk-design/design-audit/references/ai-fingerprint-tells.md` | Add optional perceptual/cognitive rationale plus user impact to applicable tells | High | Low-medium | Independently word and cite evidence; copied anti-pattern prose requires MIT notice | Phase A; depends on registry/reference/fixture parity checks |
| Emotion-first prompting | Adjectives and dials shipped; explicit emotional outcome absent | LEARN | `.opencode/skills/sk-design/design-interface/references/design-process/brief-to-dials.md`; `.opencode/skills/sk-design/design-interface/procedures/aesthetic-direction.md` | Capture desired/avoided audience feeling and map it to grounded decisions | Medium-high | Low | Generic concept can be independently authored; do not copy example sets | Phase A; depends on anti-preset and pinned-axis fixtures |

## Candidate Matrix

| Candidate | Classification | Why it survives | Acceptance gate |
|---|---|---|---|
| Multi-page invariants/deltas card | Surgical strengthening | Extraction proves the concept while Interface lacks an explicit authoring envelope | Different pages retain site identity without collapsing to one composition |
| Emotional-outcome intake fields | Surgical strengthening | Existing intake captures adjectives but not intended audience response | Terms produce evidence-grounded choices and never a chooser |
| Audit rationale/user-impact fields | Surgical strengthening | Existing cognitive vocabulary can support better explanations | Registry, prose catalog, and fixtures remain in parity; unsupported rationale stays absent |
| Semantic motion-character handoff | Surgical strengthening | Existing token names cover mechanics but not cross-mode character/rationale | No named themes or fixed multipliers; reduced-motion semantics remain intact |
| Structural fingerprint-card format | Surgical strengthening | Existing variation procedures need worked decision shape, not a catalog | Cards remain abstract, brief-bound, responsive, and non-reusable |
| Authored brand-system artifact | Genuinely new | Interface and Foundations can author a system, but no persistent validated artifact owns that job | Artifact name/schema/provenance cannot be mistaken for measured `DESIGN.md` |
| Project-path render adapter | Genuinely new input capability | Procedure mentions codebase but command/backend contract starts from renderable URL | Every measured value still comes from a launched canonical render and existing validator |

## Phased Dependencies

### Phase A: Existing-contract strengthening

1. Add multi-page locks/deltas to the Interface real-UI handoff.
2. Add emotional-outcome intake and negative-capability rationale fields.
3. Verify existing `directions` and explanation artifacts with fixtures before changing public command syntax.

### Phase B: Cross-mode semantics and worked reasoning

1. Add semantic motion character after the shared envelope is agreed.
2. Add abstract structural fingerprint cards after anti-preset fixtures exist.
3. Keep all values target-authored or measured; no Hallmark theme values enter either path.

### Phase C: Authored brand-system capability

1. Define an Interface-owned artifact name and schema distinct from Style Reference `DESIGN.md`.
2. Add Foundations token generation, origin/provenance fields, overwrite policy, validation, and page-coherence locks.
3. Prove the artifact never routes through MD-GENERATOR and cannot be represented as measured extraction.

### Phase D: Codebase source expansion

1. Add project launch/discovery and explicit source attestation.
2. Feed the launched canonical render into the unchanged extract-write-validate pipeline.
3. Add security, multi-route, no-render, static-evidence, and provenance fixtures before exposing `--project`.

## Ruled Out

- A separate `variant`, `redesign`, `study`, or `explain` command.
- A public `variant` alias: the shipped `directions` lane already names the job clearly.
- Treating a generated brand artifact as extracted `DESIGN.md`, or weakening measured extraction to admit brief-authored values.
- Hallmark theme names, curated themes, duration multipliers, or structural sketches as presets.
- A new multi-page extraction relationship type; `DesignBoundary` already represents the measured relationship.
- Emotion labels as themes, dials, or style choices.
- Cognitive-law rationales invented for every anti-pattern regardless of evidence.

## Dead Ends

- Filename parity overstates gaps. `variant`, `study`, and `explain` map to shipped directions, extraction, and proof artifacts under different names.
- One universal `design.md` contract cannot serve both measured extraction and forward authoring without destroying provenance semantics.
- A cookbook of copied HTML/CSS would create a parallel implementation library and reusable defaults; only the abstract decision-card shape survives.
- The sibling `sol-codex` lineage contains its own completed run 8, but it is independent evidence and was not used as a write target or state authority for this lineage.

## Sources Consulted

- [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:1-39]
- [SOURCE: .opencode/commands/interface/design.md:13-86]
- [SOURCE: .opencode/commands/interface/design-reference.md:13-80]
- [SOURCE: .opencode/commands/interface/motion.md:13-80]
- [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:20-227]
- [SOURCE: .opencode/skills/sk-design/design-interface/procedures/aesthetic-direction.md:13-44]
- [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:13-44]
- [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:15-124]
- [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/brief-to-dials.md:15-144]
- [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:14-131]
- [SOURCE: .opencode/skills/sk-design/design-md-generator/procedures/design-system-extraction.md:13-43]
- [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:16-121]
- [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:307-324]
- [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/design-boundary-detect.ts:228-310]
- [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token-starter.md:14-147]
- [SOURCE: .opencode/skills/sk-design/design-foundations/references/design-system-artifact-contract.md:13-88]
- [SOURCE: .opencode/skills/sk-design/shared/design-token-vocabulary.md:14-97]
- [SOURCE: .opencode/skills/sk-design/shared/context-loading-contract.md:196-214]
- [SOURCE: .opencode/skills/sk-design/shared/cognitive-laws.md:20-71]

## Assessment

- Status: complete for iteration 8's bounded focus.
- Findings: 9 roadmap decisions.
- New information ratio: 0.72.
- Novelty justification: Four findings establish genuinely new capability or contract boundaries and five materially refine already-shipped overlap into exact targets; `(4 + 5 x 0.5) / 9 = 0.72` after rounding.
- Confidence: high for command and ownership classifications; medium-high for implementation effort because no schemas, launch adapters, or behavioral fixtures were implemented in this research-only pass.

## Reflection

- What worked: comparing public commands, private procedures, artifact boundaries, and backend types separated user-visible capability gaps from naming differences.
- What failed: filename parity could not distinguish absent functionality from shipped behavior under another term.
- Licensing posture: all recommended wording and schemas should be independently authored. If implementation copies Hallmark prose, tables, examples, or substantial structure, preserve Hallmark's MIT copyright and permission notice; third-party imagery and quotations require separate rights evidence.

## Recommended Next Focus

Evaluate the remaining Hallmark ROADMAP proposals outside this iteration's named set, especially image-generation hooks, tactile rebellion, charts, sound/haptics, and live preview, then normalize all lineage verdicts into a synthesis-ready implementation order without duplicating existing owners.
