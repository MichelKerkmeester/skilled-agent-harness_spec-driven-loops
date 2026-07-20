# Iteration 10: Adversarial Matrix Validation And Synthesis Corrections

## Focus

This final pass audited the iteration-009 reuse matrix against exact Hallmark and sk-design sources. It checked asset coverage, source and target validity, licensing language, duplicate implementation proposals, route ownership, effort, ranking dependencies, and whether the three remaining formal questions can close without inventing another capability category.

## Findings

1. **The matrix is source-complete, but its 53 rows are not 53 independent implementation changes.** The inventory contains all 24 top-level Hallmark references exactly once, all four verbs, `SKILL.md`, `LICENSE`, README, ROADMAP, the two nested catalogs, and each requested schema/gate/theme/roadmap idea. All 158 `file:line` citations in iteration 009 resolve to existing files and in-range lines. The repeated-looking rows are deliberate asset-versus-subasset distinctions—`slop-test.md` versus its gate set, `design-md.md` versus its schema, and `macrostructures.md` versus the nested catalog—but synthesis must group each pair under one implementation owner. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/iterations/iteration-009.md:25] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1] [INFERENCE: direct inventory and citation-range checks reported 24 top-level references, 21 macrostructure packets, 50 component packets, 53 matrix rows, and zero invalid citations]

2. **The copy-versus-learn verdict remains permissive but needs conservative wording.** Hallmark's MIT license permits use, modification, publication, distribution, sublicensing, and sale, while requiring the copyright and permission notice in all copies or substantial portions. Close text/code/table reuse is therefore `COPY`-eligible only with that notice; independent concepts and newly authored implementations remain `LEARN`/`ADAPT`, not a pretext for close unattributed paraphrase. The repository license does not establish redistribution rights for externally hosted images or attributed quotations, so those remain `SKIP` pending asset-specific provenance. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:5] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:12] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/imagery-kit.md:3]

3. **The `design-md.md` and portable-schema rows need a provenance correction.** Hallmark's portable file directly supports an opt-in lock, no-overwrite policy, canonical tokens, CTA voice, motion stance, and export pointers; it does not define `compositionDNA`. Composition fields come from `study.md` (`macrostructure`, hero/pitch/nav/footer archetypes, density, asymmetry, treatments, reveal). Synthesis should route opt-in/no-overwrite continuity to the authored brand-system contract and route `compositionDNA` to measured extraction only when captured page evidence supports it. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:35] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:47] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:93] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:191]

4. **Measured Motion output is a verified high-value gap, not a new detector.** sk-design already extracts transitions, animations, durations, easing, choreography, and a `MotionSystem`; schema-v3 already declares and detects a `motion` capability. Its section list and `design-md-format.md` omit a Motion section. Add one conditional Motion section across schema, formatter/prompt, validator, format docs, and tests, emitted only from existing measured evidence. This precedes composition-DNA work because the data path already exists and the omission is isolated to output consumers. [SOURCE: .opencode/skills/sk-design/design-md-generator/feature-catalog/extract/extract.md:49] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:258] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:134] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:151] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:200]

5. **A public `variant` alias is redundant and should leave the adoption list.** `/interface:design` already exposes a `directions` lane, while `variation-set.md` already triggers on options, alternatives, multiple directions, and comparison variants and requires 3–5 materially distinct options with axes, rationale, risk, and recommendation. Hallmark's useful lesson is behavioral—make structural difference and selection visible—not a new command or alias. Correct verdict: `LEARN`; tighten the existing visible directions contract only if tests show those fields are missing. [SOURCE: .opencode/commands/interface/design.md:55] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:17] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:19]

6. **Three motion/foundations proposals need narrowing because most behavior already ships.** `interaction-states-pass.md` already routes selected and covers success/failure, loading, focus, disabled, and applicability; `micro-interactions.md` already covers success/error, loading, rollback/Undo, repetition limits, and reduced motion. The actual delta is reasoned `N/A` plus empty-state coverage, and precise tooltip-delay, debounce, minimum-spinner-visibility, and command-palette guidance. Likewise `data-viz.md` already covers one-accent discipline and quiet gridlines; only explicit 3D-chart and unjustified dual-axis probes are missing from the proposed four. [SOURCE: .opencode/skills/sk-design/design-motion/procedures/interaction-states-pass.md:24] [SOURCE: .opencode/skills/sk-design/design-motion/procedures/interaction-states-pass.md:35] [SOURCE: .opencode/skills/sk-design/design-motion/references/micro-interactions.md:28] [SOURCE: .opencode/skills/sk-design/design-motion/references/micro-interactions.md:110] [SOURCE: .opencode/skills/sk-design/design-motion/references/micro-interactions.md:117] [SOURCE: .opencode/skills/sk-design/design-foundations/references/data-viz.md:24] [SOURCE: .opencode/skills/sk-design/design-foundations/references/data-viz.md:63]

7. **Multi-page coherence remains useful, but the gap is authored guidance rather than extraction detection.** The extractor already classifies relationships as `unified`, `shared-foundation`, or `independent`, scores six consistency dimensions, and records anomalies. The missing piece is an Interface/redesign coherence card separating locked system axes from page-level variation. Correct target: `redesign-intake.md` plus the real-UI handoff; `types.ts` proves measurement already exists, rather than being the primary file to change. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:307] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md:31] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:27]

8. **The dependency-aware order favors surgical shipped-owner changes before authored or source-expansion capabilities.** Corrected ranking: (1) seven priority anti-slop probes plus cognitive rationale; (2) conditional measured Motion output; (3) multi-page authored-coherence card; (4) measured `compositionDNA` plus evidence-derived retrieval facets; (5) semantic `motionCharacter`; (6) provider-neutral owned-asset manifest; (7) independently authored structural-fingerprint cards; (8) distinct brand-system authoring contract; (9) project-path extraction adapter. The former `variant` alias drops out. Brand work depends on a separate authored contract because MD-generator forbids forward-authoring; project-path extraction depends on safe intake and a canonical live render before values can be called measured. [SOURCE: .opencode/skills/sk-design/design-audit/references/audit-contract.md:36] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:86] [SOURCE: .opencode/commands/interface/design-reference.md:20] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:82]

## Synthesis-Ready Corrections To Iteration 009

| Prior proposal | Corrected verdict/target | Required correction |
|---|---|---|
| `design-md.md` adds composition DNA | ADAPT authored continuity; `study.md` owns composition fields | Separate opt-in/no-overwrite locking from measured composition extraction. |
| Portable schema adds composition DNA + Motion together | ADAPT as two dependent changes | Ship conditional measured Motion first; add composition DNA only with measured detectors and provenance. |
| `hallmark variant` adds argument alias | LEARN; existing `/interface:design directions` | No alias or command; verify the visible output exposes structural deltas, risk, and recommendation. |
| Interaction-state expansion | ADAPT narrowly in Motion | Add reasoned N/A and empty-state rows; selected/success/error/loading already have owners. |
| Microinteraction expansion | ADAPT narrowly in Motion | Add tooltip delay, debounce, spinner minimum visibility, and command-palette guidance only. |
| Four data-viz probes | ADAPT only two missing probes | Add 3D-chart and unjustified dual-axis checks; one-accent and quiet-gridline rules ship. |
| Multi-page coherence changes extractor types | ADAPT Interface/redesign guidance | Keep existing `DesignBoundary`; add authored locked-versus-variable axes to intake/handoff. |
| `variant` ranked fifth | Remove from adoption work | Treat as validation of shipped behavior, not implementation scope. |

## Corrected Phased Plan

### Phase A — low-blast audit and authored guidance

- Add the seven priority Hallmark-derived probes to the existing audit reference/registry/fixture parity chain, retaining sk-design evidence exceptions and P0–P3.
- Add cognitive/perceptual rationale to applicable fingerprint records.
- Add multi-page locked-versus-variable axes to redesign intake and real-UI handoff.
- Add only the two missing data-viz probes and the compact six-axis evidence row.
- Independently author wording and fixtures; include the full MIT notice if close Hallmark text/table/code is used.

### Phase B — measured output and retrieval

- Add conditional Motion to schema-v3, formatter/prompt, validator, format docs, and tests using existing `MotionSystem` data.
- Define measurable composition fields and source confidence before adding `compositionDNA`; do not transplant Hallmark archetype IDs.
- Materialize evidence-derived facets only after extraction supports them, using the existing styles database rather than a theme table.

### Phase C — cross-mode handoffs

- Add semantic `motionCharacter` mapped into existing duration/easing bands without named-theme multipliers.
- Add a provider-neutral owned-asset manifest with rights, attribution, hash, role, crop/aspect, fallback, and generation provenance.
- Narrow state/microinteraction updates to the verified missing fields.

### Phase D — independently authored decision support

- Author 6–8 small structural-fingerprint cards with regions, axes, responsive collapse, failure modes, and evidence requirements.
- Keep them private and load-on-demand; do not copy Hallmark's 21/50 recipe catalogs or HTML/CSS.

### Phase E — net-new contracts after surgical work

- Specify a separate brand-system authoring lane and artifact; never emit it as measured Style Reference `DESIGN.md` or index it without later measured capture.
- Prototype project-path extraction only after source attestation, safe launch detection, route selection, and canonical-render requirements are specified and tested.

## Ruled Out

- Retrying blocked directions: wholesale hub replacement, a sixth mode, standalone redesign/study/variant/explain commands, a named theme database, copied catalogs, Hallmark stamps/logs, or provider-specific Nanobanana wiring.
- Treating repeated conceptual rows as separate implementation packets.
- Inflating novelty by proposing another public capability category.
- Using README's “57 gates” count; the canonical reference states 58.

## Dead Ends

- A `variant` alias does not earn a public-surface change because directions and variation triggers cover it.
- Composition DNA cannot be attributed to `design-md.md`; its structured source is `study.md`.
- Multi-page coherence does not require a new extraction relationship type; `DesignBoundary` already models it.
- Broad state, microinteraction, and data-viz additions would duplicate shipped guidance.

## Edge Cases

- Ambiguous input: “appears once” means one row per requested asset or explicitly requested subasset. Conceptual subassets remain separate rows, but implementation is deduplicated by owner.
- Contradictory evidence: README says 57 gates while `slop-test.md` says 58. The canonical checklist wins because it enumerates 1–57 plus 38a.
- Missing dependencies: code graph remained unavailable; exact local files, range-checked citations, and direct inventory commands supplied the evidence.
- Partial success: effort remains a planning estimate because implementation spikes were outside this research iteration.

## Sources Consulted

- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:1-20`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:1-20`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:1-39`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:35-116`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:180-238`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1-184`
- `.opencode/skills/sk-design/SKILL.md:23-54`
- `.opencode/commands/interface/design.md:46-71`
- `.opencode/skills/sk-design/design-interface/procedures/variation-set.md:17-39`
- `.opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md:31-102`
- `.opencode/skills/sk-design/design-motion/procedures/interaction-states-pass.md:17-43`
- `.opencode/skills/sk-design/design-motion/references/micro-interactions.md:20-160`
- `.opencode/skills/sk-design/design-foundations/references/data-viz.md:20-120`
- `.opencode/skills/sk-design/design-md-generator/feature-catalog/extract/extract.md:47-60`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:258-325`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:134-215`
- `.opencode/skills/sk-design/design-md-generator/references/design-md-format.md:27-297`
- `.opencode/skills/sk-design/design-md-generator/references/authoring-boundary.md:73-98`
- Prior cited evidence: `iterations/iteration-002.md`, `iterations/iteration-007.md`, and `iterations/iteration-009.md`

## Assessment

- New information ratio: 0.48
- Novelty justification: One of eight findings is wholly new, four are partially new source-level corrections, and the 0.10 simplicity bonus applies because the pass closes the remaining questions while removing duplicate scope.
- Questions addressed: asset-to-owner/verdict mapping; extraction/motion/theme improvements; roadmap capability boundary and phased order.
- Questions answered: all three remaining formal key questions are closed with source-backed mappings, corrected deltas, and dependencies.
- Confidence: high for coverage, citation validity, license condition, owner routing, and overlap; medium-high for effort because no implementation spike ran.

## Reflection

- What worked and why: Exact inventory and citation-range checks separated coverage defects from implementation duplication; current owner files exposed repeated shipped contracts.
- What did not work and why: Broad grep over the 1,290-style corpus produced noisy generated content, so targeted schema/retrieval references and the corpus README were more reliable.
- What I would do differently: Convert each phase into file-specific acceptance tests before assigning LOC or calendar estimates.

## Recommended Next Focus

The max-iteration loop is synthesis-ready. Fold these corrections into the canonical matrix, licensing verdict, ranking, and phased plan; do not open another research category.

