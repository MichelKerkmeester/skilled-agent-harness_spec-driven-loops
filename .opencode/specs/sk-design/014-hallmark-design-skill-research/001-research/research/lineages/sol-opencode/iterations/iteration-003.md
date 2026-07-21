# Iteration 3: Build, Redesign, And Structural Catalogs

## Focus

Compare Hallmark's default `build` and explicit `redesign` paths, especially its whole-page, component, layout, responsive, and preview catalogs, with shipped `design-interface`, `design-foundations`, `/interface:design`, and `/interface:foundations`. The dispatch focus takes precedence over the reducer-owned strategy's stale MIT-notice next-focus line; this iteration does not revisit the completed gate-count work.

## Findings

### 1. Hallmark redesign is an intake and preservation branch, not a second design engine

Hallmark's default path invents a new page, while `redesign` preserves content intent, brand, information architecture, routes, and component ownership, then replaces structural fingerprint, component voice, reveal, and rhythm. Both paths reuse the same structural references and quality rules. The explicit verb changes scope and invariants more than design methodology. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:21-30] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/verbs/redesign.md:232-269]

### 2. Shipped interface already has the redesign equivalent

`design-interface` activates for reshaping existing generic surfaces, conditionally loads `redesign-intake.md`, and classifies work as greenfield, preserve, or overhaul while protecting URLs, navigation, forms, legal copy, and locked brand tokens. `/interface:design` publicly exposes a `redesign` task lane and names "redesign ui surface" as a core job. This is behaviorally equivalent to Hallmark's explicit verb and has a stronger protected-contract inventory. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:24-32] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:80-87] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md:35-70] [SOURCE: .opencode/commands/interface/design.md:11-15] [SOURCE: .opencode/commands/interface/design.md:55-59]

### 3. A separate redesign command is unjustified

A `/interface:redesign` command would duplicate the stable `workflowMode=interface`, its redesign lane, context/proof contract, and conditional intake reference. Hallmark benefits from a verb because it has one monolithic skill; `sk-design` already has an explicit command lane inside a mode router. The smallest improvement is to deepen `redesign-intake.md`, not add a mode or command. [INFERENCE: based on .opencode/commands/interface/design.md:46-59 and .opencode/skills/sk-design/design-interface/SKILL.md:43-93]

### 4. A separate variant command is also unjustified

`/interface:design` already exposes `directions`; `design-interface` has a conditional seed-of-thought reference for two or more directions plus private `variation-set` and `wireframe-exploration` cards. Those contracts require meaningful structural divergence and a recommendation, while explicitly keeping private cards out of the public route surface. A new `/interface:variants` command would weaken that ownership boundary. [SOURCE: .opencode/commands/interface/design.md:55-59] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:21-46] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:19-39] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/wireframe-exploration.md:19-39]

### 5. Hallmark's strongest reusable idea is index-then-pick whole-page structure

Hallmark names 21 page shapes and requires choosing one before code, then loading only the selected leaf. This reduces independent-axis drift and makes page shape an explicit decision. Shipped interface already asks for a one-sentence layout concept and ASCII wireframes, but it has no compact, subject-neutral page-shape vocabulary or requirement to name the whole-page composition before component styling. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/macrostructures.md:1-11] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/macrostructures.md:25-49] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/design-principles.md:62-68]

The catalog itself should not be copied wholesale. Shipped interface requires subject-grounded candidates and says reusable presets must not ship; a fixed 21-name chooser can become exactly that. The transferable mechanism is: name the median page shape, generate a bounded set of subject-grounded whole-page alternatives, commit one, and load/detail only that choice. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:38-46] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:111-116]

### 6. Structural axes are useful diagnostic vocabulary, not a public catalog

Hallmark's six axes cover heading placement, body composition, divider language, CTA voice, image treatment, and reveal. Shipped variation guidance currently says pick 2-4 meaningful axes but does not provide a structural completeness check. Independently worded axis prompts would improve `wireframe-exploration.md` and `variation-set.md`; directly copying the table would import substantial MIT-licensed expression. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/structure.md:9-81] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:33-39] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/wireframe-exploration.md:33-39]

### 7. The component cookbook's role decomposition is useful; its 50 presets are not

The cookbook usefully separates page shape from section-level composition and indexes heroes, section heads, feature blocks, CTAs, proof, footers, and navigation. It also records within-archetype variation knobs. Shipped interface has strong anti-repetition checks but no generation-time section-role inventory. Adopt the role-and-variation method in a small procedure addition, not Hallmark's names, codes, DOM sketches, or routing tables. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/component-cookbook.md:1-16] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/component-cookbook.md:91-148] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical-defaults.md:101-115]

### 8. Multi-page coherence is the one meaningful redesign gap

Hallmark explicitly splits single-page from multi-page work and inverts diversification for a product family: shared theme, accent, typography, and CTA voice become mandatory while page shapes may vary within declared families. Shipped redesign intake inventories existing contracts but does not classify single-surface versus multi-surface scope or require a shared-system coherence decision. This is a surgical addition to `redesign-intake.md`, not a new command. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/verbs/redesign.md:15-33] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/verbs/redesign.md:209-228] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md:35-57]

### 9. Foundations already owns the stronger generic layout and responsive model

Hallmark supplies a 4-point scale, asymmetry tactics, explicit mobile widths, and per-archetype collapse recipes. Shipped foundations already owns a 4-point rhythm, grid contract, container queries, content-driven breakpoints, input capability, safe areas, and a four-dimension context adaptation matrix. Its model is broader than Hallmark's width-centric checks. The useful addition is only to require each proposed structural option to state its narrow-context transformation; that proof should be produced by interface and validated against foundations, not copied as 50 fixed collapse recipes. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/layout-and-space.md:5-40] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/component-cookbook.md:205-263] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout-responsive.md:35-50] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout-responsive.md:73-116] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation-matrix.md:35-60]

### 10. Preview examples do not justify another output mode

Hallmark's examples teach a concise pre-code preview of macrostructure, theme, enrichment, sections, motion, quality status, and diversification. `/interface:design` already requires a visible Resolved Brief, Context Manifest, Grounding Record, Interface Direction Spec, Critique/Validation, Evidence Ledger, and handoff. Copying Hallmark's stamped examples would add product-specific ceremony and a premature quality claim (`58 / 58` before the documented post-build gate). The only reusable idea is that the direction artifact should name structure, section order, and narrow-context behavior before implementation. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/preview-examples.md:1-49] [SOURCE: .opencode/commands/interface/design.md:69-86]

## Candidate Matrix

| # | Exact target | Verdict | HOW | Value | Effort | MIT copy-vs-learn treatment |
|---|---|---|---|---|---|---|
| 1 | `.opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md` | ADAPT | Add a scope classification (`single surface` / `multi-surface`) before preserve/overhaul; for multi-surface work require shared-system invariants and explicitly separate what all routes share from what may vary. | High | Low | Independently restate the scope/coherence concept; no notice. Copying Hallmark's flow or `design.md` template substantially requires its MIT notice. |
| 2 | `.opencode/skills/sk-design/design-interface/manual-testing-playbook/redesign-intake/redesign-intake-classification.md` | ADAPT | Add a multi-page case proving shared identity/system decisions remain stable while page-level structures may differ. | High | Low | Native test scenario; no Hallmark wording needed. |
| 3 | `.opencode/skills/sk-design/design-interface/procedures/wireframe-exploration.md` | ADAPT | Require each option to name a whole-page composition, section order, dominant hierarchy, one structural departure from the median, and the decision it tests. | High | Low | Learn the index-then-pick mechanism; do not copy the 21-name catalog. |
| 4 | `.opencode/skills/sk-design/design-interface/procedures/variation-set.md` | ADAPT | Extend meaningful axes with independently worded structural prompts: heading/body relationship, section rhythm, action treatment, media role, separation language, and reveal stance. | High | Low | Idea-level adaptation; copying Hallmark's six-axis table requires MIT notice. |
| 5 | `.opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md` | LEARN | Keep subject-grounded median exclusion as authority; add only a note that whole-page composition is the preferred diversity axis when structural sameness is the failure. | Medium | Low | No copied catalog or prose; no notice. |
| 6 | `.opencode/skills/sk-design/design-interface/references/design-process/design-principles.md` | LEARN | Add a short generation-time distinction between whole-page composition and section-level component treatment; commit the former before styling the latter. | Medium | Low | Independently worded principle; no notice. |
| 7 | `.opencode/skills/sk-design/design-interface/references/design-process/mechanical-defaults.md` | SKIP | Do not add another anti-repetition catalog. Existing checks already cap repeated layout families, zigzags, default split headers, uniform bento cells, and missing mobile collapse. | None | None | Redundant; no reuse. |
| 8 | `.opencode/skills/sk-design/design-foundations/references/layout/layout-responsive.md` | ADAPT | Add a handoff table field requiring each named page/section composition to declare its narrow-context transformation and preserved hierarchy, without fixed device recipes. | Medium | Low | Learn from per-archetype collapse coverage; do not copy the 50-row matrix. |
| 9 | `.opencode/skills/sk-design/design-foundations/references/layout/adaptation-matrix.md` | SKIP | Keep the existing four-dimension context model; it is more general than Hallmark's fixed 320/375/414/768 width suite. | None | None | Redundant/inferior as a replacement; no reuse. |
| 10 | `.opencode/commands/interface/design.md` | SKIP | Do not add `/interface:redesign` or `/interface:variants`; retain `redesign`, `directions`, and existing private procedures as lanes under stable `workflowMode=interface`. | Avoids route fragmentation | None | No reuse. |
| 11 | `.opencode/commands/interface/foundations.md` | SKIP | Do not add structural chooser or variant lanes. Foundations should systematize accepted interface direction and validate static adaptation, not select page archetypes. | Preserves mode boundary | None | No reuse. |

## Ruled Out

- **Separate redesign mode or command.** Existing interface triggers, redesign lane, and preserve/overhaul intake already provide the equivalent; the observed gap is multi-surface coherence inside the existing reference. [SOURCE: .opencode/commands/interface/design.md:55-59] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md:35-70]
- **Separate variant command.** Existing `directions`, seed-of-thought, wireframe, and variation-set contracts already own it, and the procedure cards explicitly remain private. [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:19-27] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/wireframe-exploration.md:19-27]
- **Copying the 21 macrostructures or 50 component archetypes as sk-design presets.** This conflicts with subject grounding and the no-reusable-preset guard. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:111-116]
- **Replacing foundations responsive guidance with fixed viewport recipes.** Existing foundations adapts across viewport, input, capability, and posture, which is the stronger abstraction. [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation-matrix.md:35-60]

## Dead Ends

- A brace glob for the named Hallmark files returned no matches, repeating the repository glob limitation noted in iteration 2. Exact paths from iteration 1's inventory were readable and supplied complete evidence; no scope expansion was needed.
- Searching shipped interface/foundations for `macrostructure` found no native catalog, but absence alone did not justify importing Hallmark's catalog because shipped guidance explicitly rejects reusable presets. The useful comparison therefore moved from name parity to behavioral mechanisms. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:111-116]

## Edge Cases

- **Ambiguous input:** Strategy `Next Focus` names MIT-notice placement, while the explicit iteration dispatch names structural build/redesign comparison. The explicit dispatch is narrower and current, so it governed this iteration; MIT treatment remains a required matrix column.
- **Contradictory evidence:** Hallmark's `H8` cookbook entry permits browser-framed mockups, while its global discipline forbids hand-built fake browser chrome. This internal Hallmark inconsistency reinforces learning from structural roles rather than copying catalog leaves. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/component-cookbook.md:26-28] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:50-54]
- **Missing dependencies:** None. All named comparison sources were available by exact path.
- **Partial success:** None. The comparison resolves the redesign/variant-command question and produces exact target rows; implementation is intentionally out of scope.

## Sources Consulted

- Hallmark core behavior and default build flow. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:19-38] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:145-175] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:264-290]
- Hallmark structural and responsive references. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/macrostructures.md:1-89] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/structure.md:1-160] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/component-cookbook.md:1-265] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/layout-and-space.md:1-112] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/responsive.md:1-138]
- Hallmark redesign and previews. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/verbs/redesign.md:1-269] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/preview-examples.md:1-49]
- Shipped interface behavior and structural procedures. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:20-93] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/design-principles.md:21-78] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md:13-104] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:21-124] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/wireframe-exploration.md:13-43] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:13-44] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical-defaults.md:15-147]
- Shipped foundations and public commands. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:19-101] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout-responsive.md:14-174] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation-matrix.md:14-130] [SOURCE: .opencode/commands/interface/design.md:7-86] [SOURCE: .opencode/commands/interface/foundations.md:7-80]

## Assessment

- **Status:** complete for iteration 3's bounded focus.
- **findingsCount:** 11 candidate rows.
- **newInfoRatio:** 0.86 (`8` fully new + `3` partially new, divided by `11`).
- **Novelty justification:** Eight rows establish new redesign, route, scope, and structural-catalog decisions; three refine previously inventoried interface/foundations overlap into exact surgical targets.
- **Questions addressed:** Does shipped sk-design already have a redesign equivalent? Is a separate redesign or variant command justified? Which structural heuristics and catalogs are reusable without importing presets?
- **Questions answered:** Yes, `/interface:design` plus `design-interface` already provide redesign and multi-direction equivalents; no separate command is justified; multi-surface coherence and generation-time structural option framing are the high-value surgical additions.
- **Convergence:** Do not stop. The max-iterations policy requires iteration 10; newInfoRatio remains well above the telemetry threshold.

## Reflection

- **What worked and why:** Comparing route, intake, generation, and adaptation contracts separately exposed that Hallmark's verb is mostly a scope switch, while its real novelty lies in explicit whole-page structural vocabulary.
- **What did not work and why:** Name-parity searching for a shipped macrostructure catalog produced no equivalent, but a catalog absence was not itself a product gap because shipped interface forbids reusable presets.
- **What I would do differently:** The next structural pass should sample a few Hallmark leaf files only if testing whether their content adds more than the index; broad catalog ingestion is unnecessary.

## Recommended Next Focus

Compare Hallmark's curated genres/themes and theme-specific files with the shipped styles corpus and relational-exemplar authority model. Decide whether a small curated anti-default seed layer can coexist with provenance-aware corpus retrieval without becoming a preset chooser.
