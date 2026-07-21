# Iteration 1: License, verb contract, asset inventory, and sk-design route map

## Focus

This iteration established the legal reuse boundary, corrected the supplied inventory/count assumptions against the checkout, inventoried Hallmark's top-level reference surface, and mapped Hallmark's four verbs onto the shipped sk-design hub. The narrower interpretation was deliberate: it establishes the comparison frame before later iterations compare individual gate text, schemas, motion values, and roadmap ideas in depth.

## Findings

1. **License verdict: direct copying and adaptation are permitted, including redistribution and sublicensing, but copied or substantially reused Hallmark material must retain the Hallmark copyright and MIT permission notice.** The license explicitly grants use, copy, modify, merge, publish, distribute, sublicense, and sale rights, then conditions copies or substantial portions on including the copyright and permission notice. A clean sk-design adoption therefore has two safe lanes: (a) `COPY`/close `ADAPT` with the MIT notice preserved in the affected vendored or attribution surface, or (b) `LEARN`/independent re-expression where no Hallmark text or substantial structure is copied. The warranty disclaimer should travel with copied/substantial portions as part of the full notice. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:5] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:12]

2. **The canonical Hallmark contract is four verbs, but sk-design already covers all four jobs without needing a sixth mode.** Hallmark defines default build, read-only audit, boundary-preserving redesign, and screenshot/URL study with optional portable `design.md` emission. sk-design routes invention/reshape/redesign to `interface`, static systems to `foundations`, critique to `audit`, interaction choreography to `motion`, and measured `DESIGN.md` extraction to `md-generator`; the canonical commands are `/interface:design`, `/interface:foundations`, `/interface:motion`, `/interface:audit`, and `/interface:design-reference`. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:19] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:25] [SOURCE: .opencode/skills/sk-design/SKILL.md:25] [SOURCE: .opencode/skills/sk-design/SKILL.md:36]

3. **Verb-to-mode map and immediate verdicts:** [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:25] [SOURCE: .opencode/skills/sk-design/SKILL.md:25]

   | Hallmark verb/job | sk-design target | Initial verdict | Concrete implication |
   | --- | --- | --- | --- |
   | default `build` | `interface` + `foundations`, with `motion` when choreography is material | ADAPT | Mine named structural fingerprints and the pre-emit critique as procedure-card/checklist inputs; do not replace the existing build bundle or five-mode router. |
   | `audit` | `audit`, especially `procedures/ai-slop-check.md`, anti-pattern references, fingerprint registry, and polish orchestration | ADAPT | Diff the 58 gates against existing checks and add only missing, testable fingerprints in a later pass. Preserve sk-design's broader accessibility/performance/responsive scope and P0-P3 evidence model. |
   | `redesign` | existing `/interface:design redesign` lane + `design-interface/references/design-process/redesign-intake.md` | LEARN | Do not add a new mode or a duplicate command merely to mirror Hallmark. Strengthen the existing lane only where Hallmark has sharper preservation or structural-divergence checks. |
   | `study` | `/interface:design-reference` + `md-generator`; optionally `interface` after extraction when the user asks to apply the DNA | ADAPT | Compare the structured-fields and portable `design.md` contract to the v3 `DESIGN.md` extraction schema; keep measured extraction and invention as separate phases. |

   Hallmark's redesign contract preserves routes, component ownership, copy intent, brand, and information architecture unless a rebuild is explicitly confirmed; sk-design already triggers redesign, has a dedicated redesign intake, and exposes a `redesign` argument lane. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:27] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:32] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:85] [SOURCE: .opencode/commands/interface/design.md:57]

4. **Hallmark's checked-in reference inventory is larger and more layered than “~29 docs,” while its top-level reference count is exactly 24.** The 24 top-level files are: [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/anti-patterns.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/typography.md:1]

   | Hallmark asset | Closest sk-design owner | Initial verdict |
   | --- | --- | --- |
   | `anti-patterns.md` | `design-audit/references/anti-patterns-production.md`, `ai-fingerprint-tells.md` | ADAPT |
   | `assets.md` | `design-interface` enrichment/grounding and image-generation handoff | LEARN |
   | `color.md` | `design-foundations/references/color/` | LEARN |
   | `component-cookbook.md` | `design-interface` procedures / structural procedure cards | ADAPT |
   | `contract.md` | shared creation contract + sk-code handoff | LEARN |
   | `copy.md` | `design-interface` writing and mock-data guidance | ADAPT |
   | `custom-craft.md` | `design-interface` craft/enrichment guidance | INSPIRE-NEW |
   | `custom-theme.md` | `foundations` theming + `interface` direction intake | LEARN |
   | `design-md.md` | `design-md-generator/references/design-md-format.md` | ADAPT |
   | `export-formats.md` | md-generator outputs + foundations token handoff | ADAPT |
   | `floating-nav.md` | interface component procedures + motion | LEARN |
   | `hero-enrichment.md` | interface hero design/craft guidance | ADAPT |
   | `imagery-kit.md` | image-generation integration / interface assets | SKIP direct asset reuse; LEARN sourcing contract |
   | `interaction-and-states.md` | motion `interaction-states-pass.md` | ADAPT |
   | `layout-and-space.md` | foundations layout/rhythm references | LEARN |
   | `macrostructures.md` | interface variation/procedure-card system | ADAPT |
   | `microinteractions.md` | motion micro-interactions and pattern cards | ADAPT |
   | `motion.md` | motion strategy and reduced-motion references | LEARN |
   | `preview-examples.md` | interface preview/proof card | LEARN |
   | `responsive.md` | foundations adaptation + audit responsive QA | ADAPT |
   | `slop-test.md` | audit slop procedure, rubric, registry | ADAPT |
   | `structure.md` | interface variation + foundations hierarchy/layout | ADAPT |
   | `study.md` | md-generator extraction workflow and source-attestation boundary | ADAPT |
   | `typography.md` | foundations type references | LEARN |

   Each file identifies its domain in its opening contract, so the map is grounded in the actual asset set rather than inferred names alone. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/anti-patterns.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/assets.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/color.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/component-cookbook.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/contract.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/copy.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-craft.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/export-formats.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/floating-nav.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/hero-enrichment.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/imagery-kit.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/interaction-and-states.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/layout-and-space.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/macrostructures.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/microinteractions.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/motion.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/preview-examples.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/responsive.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/structure.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/typography.md:1]

5. **The top-level list is not the complete recursive knowledge surface.** Hallmark also contains two verb packets (`audit`, `redesign`), 21 per-macrostructure packets, and 50 per-component packets, selected load-on-demand by `SKILL.md`; these subordinate catalogs need their own later matrix coverage rather than being collapsed into the 24 top-level rows. Hallmark explicitly instructs loading one chosen macrostructure file and only the chosen component archetypes, which is a useful context-budget pattern for sk-design's procedure-card system. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:264] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:290] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:478] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:484]

6. **The supplied “57 gates” figure is stale inside Hallmark itself.** `README.md` still says 57, but the canonical `slop-test.md` title says 58 and the operative `SKILL.md` preview/build contract repeatedly requires 58/58. Later gate comparison should therefore use `slop-test.md` as authority and treat README's 57 as documentation drift. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:419] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:470]

7. **Hallmark's curated-theme model complements rather than replaces sk-design's extracted corpus.** Hallmark uses 20 named themes plus a signal-gated custom branch and genre-scoped rotation; sk-design has 1,293 style directories and 1,290 canonical extracted bundles, while its interface mode treats corpus examples as bounded anchors rather than presets. The useful lesson is a small, curated decision layer or retrieval shortlist on top of corpus search—not copying 20 theme presets wholesale into a system that deliberately resists chooser/preset behavior. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:38] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:240] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:86] [INFERENCE: based on the checked-in `.opencode/skills/sk-design/styles/` inventory of 1,293 directories and 1,290 `*-canonical.json` files]

8. **Several Hallmark roadmap items already exist in sk-design, which changes their verdict from “new” to “gap-fill.”** sk-design already has a redesign lane, variation-set procedure and variant parameter contract, foundations data-viz guidance, live-site/code-backed md-generator extraction, and a large styles corpus. Candidate net-new or materially additive ideas are theme-aware motion tokens, stronger structural cookbook selection, brand-first authoring into a portable system, and an image-generation enrichment hook; each still needs detailed overlap analysis before adoption. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:15] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:17] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:19] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:25] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:29] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:80] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:28] [SOURCE: .opencode/skills/sk-design/shared/assets/variant-parameter-contract.md:15]

## Ruled Out

- **Wholesale replacement of sk-design with Hallmark:** rejected because sk-design's shipped hub has broader responsibilities, registry-driven routing, evidence contracts, accessibility/performance audit coverage, and a measured extraction backend. Hallmark is a source of surgical patterns, not a replacement architecture. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:80]
- **Adding a new `redesign` mode or standalone command solely for parity:** rejected because `interface` already owns reshaping/restyling, `/interface:design` has a `redesign` lane, and a dedicated redesign intake protects existing constraints. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:26] [SOURCE: .opencode/commands/interface/design.md:57] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:85]
- **Treating the README counts as canonical:** rejected due to the 57-versus-58 contradiction and the distinction between 24 top-level references and the deeper load-on-demand catalogs. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1]
- **Copying the hosted imagery kit into sk-design in this phase:** rejected pending asset-by-asset provenance and redistribution verification; the repository-wide MIT license is permissive, but hosted third-party assets may carry separate source terms. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/imagery-kit.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/assets.md:1]

## Dead Ends

- None. The initial inventory found a productive comparison structure.

## Edge Cases

- Ambiguous input: “~29 reference docs” could mean top-level references or all recursively nested packets. The checked-in source has 24 top-level reference files plus subordinate verb, macrostructure, and component packets; later iterations should matrix both levels.
- Contradictory evidence: README says 57 slop gates; the canonical checklist and operative skill contract say 58. Use 58 for all comparisons and record README drift.
- Missing dependencies: code graph and startup memory were unavailable, but both codebases are local and direct file reads provide authoritative evidence.
- Partial success: the inventory and route map are complete at the top-level asset/family level; individual contents, subordinate packets, and exact gap diffs remain intentionally deferred to focused later iterations. Status remains `complete` because the license question is answered and the requested first-iteration frame is established.

## Sources Consulted

- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:1-21`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:1-112`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:1-39`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:19-558`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/*.md`
- `.opencode/skills/sk-design/SKILL.md:15-194`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md:14-90`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:13-83`
- `.opencode/skills/sk-design/design-audit/SKILL.md:13-161`
- `.opencode/skills/sk-design/design-motion/SKILL.md:1-90`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:1-169`
- `.opencode/commands/interface/*.md`
- `.opencode/skills/sk-design/styles/` direct inventory

## Assessment

- New information ratio: 1.0
- Novelty justification: This first iteration established eight fully new findings, including the legal reuse rule, corrected asset/gate counts, the four-to-five route map, duplicate-capability eliminations, and the top-level per-asset owner map.
- Questions addressed: license and attribution; complete Hallmark inventory shape; verb-to-mode/command mapping; curated themes versus extracted corpus; roadmap overlap.
- Questions answered: What does Hallmark's license permit copying, adaptation, and redistribution to require?
- Confidence: high for license, checked-in counts, verb routing, and existing sk-design surfaces; medium for initial per-asset verdicts until the content-level diffs run.

## Reflection

- What worked and why: Direct recursive inventories plus line-numbered reads exposed both the legal contract and two source-of-truth mismatches early, preventing the rest of the loop from comparing against stale counts.
- What did not work and why: The initial shallow inventory hid nested verb, macrostructure, and component directories; a targeted recursive check corrected that interpretation.
- What I would do differently: For the next content-heavy pass, generate a machine-readable manifest of every nested reference path first, then mark coverage against it so no subordinate packet is lost behind a top-level index.

## Recommended Next Focus

Diff Hallmark's canonical 58-gate `slop-test.md`, named `anti-patterns.md`, six-axis pre-emit critique, and `references/verbs/audit.md` against sk-design's `design-audit` procedure, anti-pattern references, fingerprint registry, scoring rubric, and polish gate. Produce a gate-by-gate coverage table with `covered / weaker / missing / conflict`, concrete target files, and MIT copy-versus-re-expression treatment.
