# Iteration 10: Final Coverage and Contradiction Audit

## Coverage Audit

The audit reconciles the complete inventory established in iteration 1—24 root references, two nested verb packets, four genre files, four detailed theme files plus the twenty-name catalog, 21 macrostructures, 50 component leaves in seven families, and the ROADMAP—against the file-level decisions from iterations 2–9. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-opencode/iterations/iteration-001.md:27-37] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:348-391]

Coverage is complete at the asset/family level: every root reference and verb has its own row; each genre and detailed theme file has a row; the twenty-name theme model has a separate row; all 21 macrostructure leaves are preserved in one enumerated family row; all 50 component leaves are preserved through seven cardinality-checked family rows; and every ROADMAP proposal has a row. Consolidation shares a disposition only where all named leaves have the same target and treatment; it does not turn catalogs into presets. [INFERENCE: based on the complete file inventory and the no-preset findings in iteration-003.md:25-37 and iteration-007.md:29-35]

## Reconciled Reuse Matrix

| Hallmark asset | exact sk-design target mode/command/reference | COPY / ADAPT / LEARN / INSPIRE-NEW / SKIP | concrete change | value | effort | licensing treatment |
|---|---|---|---|---|---|---|
| `LICENSE` [SOURCE: iteration-001.md:16-25] | Repository third-party notices plus provenance at any substantially reused target | LEARN | Treat MIT as reuse authority; retain copyright and permission notice for copies/substantial portions | Critical | Low | Notice required for substantial copied expression; not legal advice |
| `README.md` [SOURCE: iteration-001.md:20-25] | Research/implementation decision record only | SKIP | Do not use “use it, fork it, ship it” as the license contract | High risk avoided | None | `LICENSE` controls |
| `skills/hallmark/SKILL.md` core route [SOURCE: iteration-001.md:31-37] | `design-interface/SKILL.md`; `/interface:design`; existing conditional references | LEARN | Preserve load-by-job and index-then-pick efficiency, but keep sk-design's five-mode router | Medium | Low | Clean-room routing language; no Hallmark stamps/log schema |
| `anti-patterns.md` [SOURCE: iteration-002.md:35-53] | `design-audit/assets/ai-fingerprint-registry.json`; `references/ai-fingerprint-tells.md` | ADAPT | Add only evidence-backed structural/chrome/content tells with exceptions, owner and P0–P3 impact | High | Medium | Independent wording; copied entries/table require MIT notice |
| `assets.md` [SOURCE: iteration-009.md:16-18] | `design-interface/assets/interface-preflight-card.md`; `shared/sk-code-handoff.md` | ADAPT | Add provider-neutral asset origin/rights/hosting/accessibility receipt | High | Medium | Verify provider/asset rights separately; no volatile table copy |
| `color.md` [SOURCE: iteration-004.md:72-82] | `design-foundations/references/color/palette-theming.md`; `assets/token-starter.md` | ADAPT | Keep canonical roles opaque; model alpha in named overlay/scrim/shadow roles | Medium | Low | Clean-room rule; no palette recipes |
| `component-cookbook.md` index [SOURCE: iteration-003.md:35-37] | `design-interface/procedures/wireframe-exploration.md`; `variation-set.md` | LEARN | Separate whole-page shape from section-role decisions; no reusable chooser | High | Low | Do not copy routing tables, codes, sketches, or recipes |
| `contract.md` [SOURCE: iteration-009.md:20-22] | `shared/sk-code-handoff.md` | ADAPT | Record stylesheet entrypoints/import directives and explicit rewrite permission | Medium-high | Low | Independent wording; target stack remains authority |
| `copy.md` [SOURCE: iteration-004.md:28-32] | `design-interface/references/design-process/copy-and-mock-data.md`; preflight | LEARN | Add measured-latency loading/status copy; keep local cause/recovery semantics | Medium-high | Low | No quotation copying; third-party samples need separate rights |
| `custom-craft.md` [SOURCE: iteration-004.md:46-50] | `design-interface/references/design-process/real-ui-loop.md`; preflight | ADAPT | Permit brief-grounded CSS/SVG only with semantic, fallback, cost, motion and render proof | High | Medium | No recipe/vendor/support-table copy |
| `custom-theme.md` [SOURCE: iteration-004.md:40-44] | `design-interface/procedures/aesthetic-direction.md`; `real-ui-loop.md` | ADAPT | Use precedent-grounded, authored-tuned and authored-bespoke depth; label authored values | Very high | Medium | Native labels/logic; no catalog values or stamps |
| `design-md.md` portable schema [SOURCE: iteration-006.md:58-62] | `/interface:design-reference`; `design-md-generator/backend/scripts/schema-v3.ts` | SKIP | Keep uppercase measured `DESIGN.md`; authored systems use a distinct artifact | Critical boundary | None | No schema copy; MIT notice if substantial format text copied |
| `export-formats.md` [SOURCE: iteration-006.md:64-68] | optional post-validate exporter under `design-md-generator/backend/scripts/` | INSPIRE-NEW | Emit separate traceable DTCG/shadcn outputs; omit unsupported roles diagnostically | Medium-high | Medium | Implement standards independently; no examples/table copy |
| `floating-nav.md` [SOURCE: iteration-004.md:58-62] | `design-interface/procedures/prototype-flow-spec.md`; preflight | LEARN | Add geometry/property ownership, input, reduced-motion and performance proof for morphs | Medium | Low-medium | No exact timing/CSS/shadow recipe copy |
| `hero-enrichment.md` [SOURCE: iteration-004.md:52-56] | `design-interface/assets/interface-preflight-card.md`; `aesthetic-direction.md` | ADAPT | Replace mandatory imagery with a brief-grounded signature-role decision | Very high | Low-medium | No archetype catalog copy; media rights separate |
| `imagery-kit.md` [SOURCE: iteration-004.md:34-38] | `design-interface/references/design-process/real-ui-loop.md`; `shared/creation-contract.md` | INSPIRE-NEW | Optional owned-asset manifest with stable URI, rights, dimensions, role and fallback | Medium-high | Medium | Never hotlink/redistribute Hallmark-hosted binaries |
| `interaction-and-states.md` [SOURCE: iteration-005.md:40-44] | `design-motion/procedures/interaction-states-pass.md`; motion cards; Interface preflight | LEARN | Enumerate applicable states or explicit N/A; retain events/guards/recovery | Medium-high | Low | No eight-state table or CSS recipe copy |
| `layout-and-space.md` [SOURCE: iteration-003.md:43-45] | `design-foundations/references/layout/layout-responsive.md`; adaptation matrix | LEARN | Preserve stronger target/content/input/posture model; require narrow-context transformation | Medium | Low | No fixed width or collapse-recipe copy |
| `macrostructures.md` index [SOURCE: iteration-003.md:25-33] | `design-interface/procedures/wireframe-exploration.md`; `variation-set.md` | LEARN | Name and commit a subject-grounded whole-page composition before component styling | High | Low | Do not copy 21-name chooser/table |
| `microinteractions.md` [SOURCE: iteration-005.md:28-38] | `design-motion/assets/motion-pattern-cards.md`; Interface preflight | ADAPT | Propagate interruption/reversal/retrigger and safe async feedback checks | High | Low-medium | Target-derived values; no recipe/theme table copy |
| `motion.md` [SOURCE: iteration-005.md:16-26] | `design-motion/references/motion-strategy.md`; `shared/design-token-vocabulary.md`; Foundations artifact contract | ADAPT | Define semantic motion character and role tokens; Motion owns actual values | High | Medium | No Hallmark timing, curve, multiplier, or token-block copy |
| `preview-examples.md` [SOURCE: iteration-009.md:24-26] | Existing Interface presentation/proof artifacts | SKIP | Test existing fields; do not create a preview/preset catalog | Low incremental | None | Copying examples requires notice and imports presets |
| `responsive.md` [SOURCE: iteration-004.md:64-68] | Foundations responsive/adaptation references; Interface preflight | ADAPT | Add target-derived viewport/input/orientation/zoom/content-risk proof matrix | High | Medium | Independent matrix; fixed widths only labeled examples |
| `slop-test.md` 58-gate set [SOURCE: iteration-002.md:14-24] | `design-audit` registry, production hardening, edge cases and fixtures | ADAPT | Promote precise probes only; retain hypothesis posture, evidence labels and P0–P3 | High | Medium-high | No wholesale gate copy; detailed prose/tables require notice |
| `structure.md` six axes [SOURCE: iteration-003.md:31-33] | Interface variation/wireframe procedures | ADAPT | Add independently worded structural-completeness prompts | High | Low | Copying axis table requires MIT notice |
| `study.md` diagnosis schema [SOURCE: iteration-006.md:16-26] | `design-md-generator` extraction report/types; `/interface:design-reference` | ADAPT | Add measured-neutral provenance, composition and region summaries; inferred fields labeled | High | Medium-high | No Hallmark enums/templates; screenshot estimates never become token values |
| `typography.md` [SOURCE: iteration-004.md:22-26] | Foundations typography reference and token starter | ADAPT | Add source/rights/weights and fallback metric override proof | High | Low | Native fields; no font catalog/pairing copy |
| `verbs/audit.md` [SOURCE: iteration-002.md:20-24] | `/interface:audit`; `design-audit/references/audit-contract.md` | LEARN | Keep shipped evidence/impact/owner schema and severity; absorb only granular probes | High | Low | No report-shape or severity copy |
| `verbs/redesign.md` [SOURCE: iteration-003.md:9-19] | `/interface:design` redesign lane; `redesign-intake.md` | ADAPT | Add single- vs multi-surface scope and shared-system locks/deltas | Very high | Low | Independent intake language; no new command |
| `genres/editorial.md` [SOURCE: iteration-007.md:13-23] | optional post-retrieval explanatory lens in Interface corpus adapter | LEARN | Derive evidence labels only after rights-gated mode selection | Medium | High | Do not copy genre name/fixtures/rules as selector |
| `genres/modern-minimal.md` [SOURCE: iteration-007.md:13-23] | same Interface corpus explanatory layer | LEARN | Same evidence-only treatment; never silently choose taste | Medium | High | Independent taxonomy only |
| `genres/atmospheric.md` [SOURCE: iteration-007.md:13-23] | same Interface corpus explanatory layer | LEARN | Same evidence-only treatment; target brief/register remains authority | Medium | High | Independent taxonomy only |
| `genres/playful.md` [SOURCE: iteration-007.md:13-23] | same Interface corpus explanatory layer | LEARN | Same evidence-only treatment; no one-theme collapse | Medium | High | Independent taxonomy only |
| twenty-name theme catalog [SOURCE: iteration-007.md:17-35] | No generation target; optional independently authored evaluation taxonomy | SKIP | Do not ingest names, token combinations or selector behavior | High risk avoided | None | Direct reuse requires MIT notice and ingredient-rights review |
| `themes/carnival.md` [SOURCE: iteration-007.md:17-19] | no corpus bundle; evaluation fixtures only if independently authored | SKIP | Do not import rich theme spec | Low | None | No copy |
| `themes/cobalt.md` [SOURCE: iteration-007.md:17-19] | same | SKIP | Do not import rich theme spec | Low | None | No copy |
| `themes/hum.md` [SOURCE: iteration-007.md:17-19] | same | SKIP | Do not import rich theme spec | Low | None | No copy |
| `themes/lumen.md` [SOURCE: iteration-007.md:17-19] | same | SKIP | Do not import rich theme spec | Low | None | No copy |
| Macrostructure leaves `01-bento-grid`, `02-long-document`, `03-marquee-hero`, `04-stat-led`, `05-workbench`, `06-conversational-faq`, `07-manifesto`, `08-photographic`, `09-quote-led`, `10-specimen`, `11-catalogue`, `12-letter`, `13-index-first`, `14-narrative-workflow`, `15-split-studio`, `16-feature-stack`, `17-type-specimen`, `18-portfolio-grid`, `19-map-diagram`, `20-ecosystem-index`, `21-component-playground` [SOURCE: external/hallmark/skills/hallmark/references/macrostructures.md:25-49] | Interface wireframe/variation procedures | LEARN | Use only as evidence that whole-page composition should be explicit; generate subject-grounded alternatives | High method value | Low | No names, leaf prose, diagrams or recipes copied |
| Hero family: 9 `H*` leaves [SOURCE: external/hallmark/skills/hallmark/SKILL.md:356-358] | Interface signature-role and wireframe procedures | LEARN | Generate brief-specific hero role; typography-only may pass | High | Low | No archetype leaf copy |
| Section-head family: 5 `S*` leaves [SOURCE: external/hallmark/skills/hallmark/SKILL.md:356-358] | Interface variation procedures | LEARN | Test heading/body relationship and narrow collapse | Medium | Low | No leaf copy |
| Feature family: 6 `F*` leaves [SOURCE: external/hallmark/skills/hallmark/SKILL.md:356-358] | Interface variation procedures; Foundations responsive proof | LEARN | Vary section composition without a fixed feature preset | Medium | Low | No leaf copy |
| CTA family: 4 `C*` leaves [SOURCE: external/hallmark/skills/hallmark/SKILL.md:356-358] | Interface copy/preflight | LEARN | Choose action treatment from task hierarchy and state evidence | Medium | Low | No leaf copy |
| Testimonial/proof family: 4 `T*` leaves [SOURCE: external/hallmark/skills/hallmark/SKILL.md:356-358] | Interface copy/mock-data; Audit content-integrity | ADAPT | Require sourced proof; never fabricate metrics/logos/quotes | High | Low | Quote/logo rights separate; no leaf copy |
| Footer family: 8 `Ft*` leaves [SOURCE: external/hallmark/skills/hallmark/SKILL.md:290-294] | Interface wireframe; Audit fingerprint registry | ADAPT | Detect generic sitemap footer as hypothesis; choose brief/site-role structure | High | Medium | No catalog/routing-table copy |
| Navigation family: 14 `N*` leaves [SOURCE: external/hallmark/skills/hallmark/SKILL.md:290-294] | Interface wireframe; Audit fingerprint registry | ADAPT | Detect genre-blind SaaS nav as hypothesis; preserve real information architecture | High | Medium | No catalog/routing-table copy |
| ROADMAP Nanobanana hook [SOURCE: external/hallmark/ROADMAP.md:7-9] | Interface native-image branch + selected external transport | ADAPT | Provider-neutral gated generation plus asset receipt | High when image-led | Medium | Current terms, secrets, cost, input/output rights required |
| ROADMAP `Plate` theme [SOURCE: external/hallmark/ROADMAP.md:7-9] | none | SKIP | Derive image role per brief; no image-led preset | Negative | None | No copy |
| ROADMAP brand-first flow [SOURCE: iteration-008.md:22-24] | Interface-led new authored artifact; Foundations token support | INSPIRE-NEW | Persist validated authored system distinctly from measured `DESIGN.md` | Very high | High | Native schema preferred; imagery rights separate |
| ROADMAP theme-aware motion [SOURCE: iteration-008.md:26-28] | shared token vocabulary; Foundations starter; Motion strategy | ADAPT | Semantic character/rationale, target-derived values | High | Medium | No theme labels/multipliers copied |
| ROADMAP `hallmark variant` [SOURCE: iteration-008.md:18-20] | `/interface:design` `directions`; variation procedure | SKIP | Verify/expose structural deltas; no alias/command | High avoided duplication | Low | No copy |
| ROADMAP structural cookbook [SOURCE: iteration-008.md:30-32] | Interface wireframe/variation procedure | ADAPT | Optional abstract brief-bound decision card, never implementation catalog | Medium-high | Medium | Independently author; no sketches/HTML copy |
| ROADMAP tactile rebellion [SOURCE: iteration-009.md:32-34] | Interface aesthetic direction and preflight | ADAPT | Controlled-imperfection check with brief evidence and bounded roles | Medium | Low-medium | Generated texture rights/receipt; no trend preset |
| ROADMAP charts [SOURCE: iteration-009.md:28-30] | Foundations `references/data-viz.md`; Audit production checks | ADAPT | Add evidence-based 3D/perspective and dual-axis cautions | Medium | Low | Independent wording; no ban-list copy |
| ROADMAP multi-page coherence [SOURCE: iteration-008.md:38-40] | Interface real-UI loop; shared handoff | ADAPT | Explicit site locks versus page deltas | Very high | Low-medium | Clean-room concept |
| ROADMAP project-path study [SOURCE: iteration-008.md:34-36] | `/interface:design-reference`; md-generator extraction adapter | INSPIRE-NEW | Guarded project launcher resolves canonical render; static evidence segregated | High | High | Source attestation/security required; measurement remains rendered |
| ROADMAP explain [SOURCE: iteration-008.md:42-44] | Existing Interface proof/presentation | SKIP | Add nothing unless fixtures show missing rationale | Medium | None-low | No copy |
| ROADMAP negative capability [SOURCE: iteration-008.md:46-48] | Audit registry/tells; shared cognitive laws | ADAPT | Optional evidence-backed perceptual cause and user impact | High | Low-medium | No invented rationale; no anti-pattern prose copy |
| ROADMAP emotion-first prompting [SOURCE: iteration-008.md:50-52] | Interface brief-to-dials and aesthetic direction | LEARN | Capture desired/avoided audience feeling; translate through evidence | Medium-high | Low | No emotion themes/chooser |
| ROADMAP sound policy [SOURCE: iteration-009.md:44-46] | Motion micro-interactions; Audit accessibility/performance | ADAPT | Purpose, user control, alternative channel, frequency and rights proof | Medium-high for audio products | Low-medium | Audio rights/provenance separate |
| ROADMAP haptics [SOURCE: iteration-009.md:44-46] | future target-specific Motion reference only | SKIP | Reopen only for named runtime/API/product demand/device matrix | Unknown | Unknown | Privacy, permission and accessible fallback required |
| ROADMAP live-preview MCP [SOURCE: iteration-009.md:40-42] | existing Open Design preview, MD-GENERATOR proof, browser inspection | SKIP | At most normalize a read-only receipt after measured user pain | Low incremental | None-low | Sandbox untrusted renders; transport never owns acceptance |

No direct `COPY` row survives. The legal ability to copy is real, but clean-room adaptation into stronger native owners provides the value with less attribution drift; any later substantial textual, table, schema, example, code, or asset reuse still requires the Hallmark MIT notice. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:5-13]

## Contradictions Resolved

1. **Theme labels:** twenty named themes are not twenty equally specified assets; only four have detailed files. Final rule: no Hallmark label, genre or theme becomes a selector/facet/preset. Independently authored evidence lenses may explain a rights-gated, mode-selected exemplar only after selection. [SOURCE: iteration-007.md:17-35]
2. **Motion token placement:** Foundations/shared own portable semantic token fields; Motion owns behavior, duration/easing choice and proof. Interface may supply authored character, but no target owns Hallmark's theme multipliers. [SOURCE: iteration-005.md:16-20] [SOURCE: iteration-008.md:26-28]
3. **Brand-first artifact authority:** forward-authored brand systems are valuable, but must use a separately named Interface-led artifact; measured Style Reference `DESIGN.md` remains MD-GENERATOR-only. [SOURCE: iteration-008.md:22-24] [SOURCE: iteration-006.md:58-62]
4. **Images/providers:** imagery manifests and provider-neutral receipts merge into one asset receipt. Interface owns judgment; an explicitly selected transport owns generation; provider availability, cost, secrets, input sensitivity and output rights are runtime gates, never core provider tables. [SOURCE: iteration-004.md:34-38] [SOURCE: iteration-009.md:36-38]
5. **Route proof:** route-proof text in iterations 8–9 is dispatch metadata, not Hallmark evidence or research content. The canonical route belongs only in state/provenance, and no adoption is justified by it. [SOURCE: iteration-008.md:3-10] [SOURCE: iteration-009.md:3-8]
6. **Gate authority:** the current checklist is 58 checks (1–57 plus 38a), while README's 57 is stale; shipped Audit severity/evidence remains authoritative. [SOURCE: iteration-002.md:14-24]

## Ranked Adoptions

1. **Fix Interface hero/media and authored-depth contracts** — very high value, low-to-medium effort; removes mandatory decorative media and makes tuned/bespoke origin explicit. Dependency: updated preflight + aesthetic-direction fixtures. [SOURCE: iteration-004.md:40-56]
2. **Add multi-page locks/deltas** — very high value, low-medium effort; prevents site identity drift while preserving page variety. Dependency: shared handoff parity. [SOURCE: iteration-008.md:38-40]
3. **Add Audit content integrity, fake chrome, structural and responsive probes** — high value, medium effort; deterministic user-facing failures with existing severity authority. Dependency: registry/reference/self-defect/fixture parity and false-positive tests. [SOURCE: iteration-002.md:26-53]
4. **Add asset provenance/hosting receipt** — high value, medium effort; prerequisite for owned imagery and generated media. Dependency: rights-state vocabulary and unknown-rights block. [SOURCE: iteration-009.md:16-18]
5. **Add measured provenance + Motion projection to MD-GENERATOR** — high value, medium effort; exposes already-captured evidence without weakening tokens. Dependency: schema/formatter/validator/test parity. [SOURCE: iteration-006.md:34-38] [SOURCE: iteration-006.md:52-56]
6. **Add semantic motion character and card-level interruption/async proof** — high value, low-medium/medium effort. Dependency: cross-mode field ownership and reduced-motion invariants. [SOURCE: iteration-005.md:16-38]
7. **Add fallback-font metrics and target-derived responsive proof** — high value, low-to-medium effort; measurable stability gains. [SOURCE: iteration-004.md:22-26] [SOURCE: iteration-004.md:64-68]
8. **Pursue brand-first authored artifact only after surgical work** — very high potential, high effort and boundary risk. Dependency: distinct naming/schema/provenance/overwrite/validator/non-equivalence gates. [SOURCE: iteration-008.md:22-24]

## Phased Plan Inputs

- **Phase 1 — surgical existing-mode corrections:** hero signature role, authored depth, multi-page locks/deltas, fallback metrics, responsive proof, content-integrity/fake-chrome/input-geometry probes, stylesheet preservation, emotion intake, chart cautions, controlled imperfection and sound applicability. No new command or mode. [INFERENCE: consolidates high-value low/medium-effort rows above]
- **Phase 2 — shared evidence envelopes:** asset receipt; semantic motion character; interruption/async card propagation; measured provenance and conditional Motion section. Require cross-file parity tests before promotion. [INFERENCE: dependencies from iteration-005.md:28-38, iteration-006.md:52-56, and iteration-009.md:16-18]
- **Phase 3 — bounded reasoning/evaluation:** abstract structural decision cards and evaluation-only derived lenses, activated only after no-preset, no-rights-bypass and no-value-emission fixtures pass. [SOURCE: iteration-007.md:29-35] [SOURCE: iteration-008.md:30-32]
- **Phase 4 — optional new capabilities:** separately validated authored brand-system artifact, optional DTCG/shadcn exporters, then project-path render adapter. Each requires demonstrated product demand and must preserve measured-artifact authority. [SOURCE: iteration-006.md:64-74] [SOURCE: iteration-008.md:22-36]
- **Deferred evidence-triggered work:** preview normalization, haptics, automatic corpus promotion and screenshot diagnosis remain closed until concrete user pain/runtime evidence exists. [SOURCE: iteration-006.md:70-74] [SOURCE: iteration-009.md:40-46]

## Acceptance Gates

1. Hero/preflight fixtures prove typography-only can pass when grounded and decorative filler still fails; authored values carry origin. [INFERENCE: based on iteration-004.md:52-56]
2. Multi-page fixtures preserve shared type/color/spacing/navigation semantics while at least two pages retain distinct composition. [INFERENCE: based on iteration-008.md:38-40]
3. Every new Audit tell has positive, clean and legitimate-exception fixtures; registry/reference/self-defect/playbook remain in parity; no taste tell escalates without evidence and impact. [SOURCE: iteration-002.md:37-53]
4. Every asset receipt records origin, rights state, hosting, dimensions, alt/caption, unresolved risk and generation metadata; unknown rights block exact reuse. [SOURCE: iteration-009.md:70-77]
5. Motion fields cannot override register ceiling, frequency/keyboard gates or reduced-motion semantic parity; no named themes or fixed multipliers appear. [SOURCE: iteration-005.md:16-20]
6. MD-GENERATOR Motion/Provenance sections are deterministic projections of measured/report evidence; fabricated, missing-source and estimated-token fixtures fail. [SOURCE: iteration-006.md:34-38] [SOURCE: iteration-006.md:52-56]
7. Derived lenses never alter retrieval eligibility, ranking authority, target values, locks or `no-fit`; different briefs do not collapse to one label. [SOURCE: iteration-007.md:49-58]
8. Authored brand artifacts use a distinct name/schema and cannot enter measured `DESIGN.md`, `tokens.json`, or styles ingestion without explicit reviewed conversion. [SOURCE: iteration-008.md:22-24]
9. Project-path study measures only a launched canonical render; static code evidence is separately labeled, security-scoped and never upgraded to measured values. [SOURCE: iteration-008.md:34-36]
10. Substantial Hallmark expression triggers notice verification; external images/fonts/quotes/provider outputs require independent rights evidence. [SOURCE: external/hallmark/LICENSE:5-13] [SOURCE: iteration-004.md:84-86]

## Residual Unknowns

- **Legal/rights confirmation:** exact “substantial portions” threshold, repository notice placement, and rights for hosted imagery, attributed quotations, fonts, logos, reference images and generated outputs require counsel/owner confirmation. [SOURCE: iteration-001.md:81-85]
- **Product-demand confirmation:** brand-first persistence, DTCG/shadcn exporters, project-path study, preview normalization, sound and haptics need operator/user demand before scheduling beyond surgical phases. [INFERENCE: based on value/effort and deferral rows above]
- **Fixture precision:** proposed structural/nav/footer/fake-chrome tells may overlap legitimate brand patterns; precision and severity cannot be confirmed without implementation fixtures. [SOURCE: iteration-002.md:65-69]
- **Extractor feasibility:** robust neutral page-composition, texture and observed-risk extraction remains unproven and high effort. [SOURCE: iteration-006.md:103-114]
- **Corpus labels:** an independently authored taxonomy may not improve retrieval explanation enough to justify schema/index churn; evaluation-only experiment is required. [SOURCE: iteration-007.md:49-62]
- **Provider/runtime facts:** model availability, cost, terms, output rights and haptic API/device support are volatile and must be checked at implementation time. [SOURCE: iteration-009.md:115-120]

## Ruled Out

- Direct COPY as the default strategy; wholesale gates, catalogs, themes, recipes, tables, examples and schemas add attribution/preset risk without beating native owners. [SOURCE: iteration-002.md:55-57]
- New redesign, variant, study, explain, theme-motion, chart, tactile, hero, imagery, floating-nav or live-preview commands/servers. [SOURCE: iteration-008.md:106-114] [SOURCE: iteration-009.md:104-113]
- Hallmark themes/genres/macrostructures/components as presets, selectors, facets, bundles, enums or fallback values. [SOURCE: iteration-007.md:64-74]
- Lowercase `design.md`, screenshot-estimated canonical tokens, automatic styles ingestion, or authored values in measured Style Reference artifacts. [SOURCE: iteration-006.md:120-129]
- Provider locks/catalogs, prompt-hash caching of sensitive inputs, hotlinking, or treating watermark/URL/attestation as rights proof. [SOURCE: iteration-009.md:104-113]

## Dead Ends

- Name/filename parity repeatedly overstated gaps; behavioral owner mapping is final. [SOURCE: iteration-008.md:116-120] [SOURCE: iteration-009.md:115-121]
- Raw catalog/gate counts do not establish product value; only evidence-backed gaps with native owners survive. [SOURCE: iteration-002.md:77-80] [SOURCE: iteration-005.md:84-88]
- Route-proof wording is provenance metadata and cannot support a Hallmark adoption finding. [INFERENCE: based on iteration-008.md:3-10 and iteration-009.md:3-8]

## Sources Consulted

- All nine prior narratives and all nine deltas in this lineage. [SOURCE: research/lineages/sol-opencode/iterations/iteration-001.md:1-114] [SOURCE: research/lineages/sol-opencode/iterations/iteration-009.md:1-154]
- Hallmark complete routing/inventory contract and ROADMAP. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:230-391] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:1-39]
- Hallmark MIT license. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:1-21]
- Reducer-owned lineage strategy and findings registry, read only. [SOURCE: research/lineages/sol-opencode/deep-research-strategy.md:46-398] [SOURCE: research/lineages/sol-opencode/findings-registry.json:627-645]

## Assessment

- Status: complete for the final coverage/contradiction iteration.
- Findings: 6 synthesis findings (1 fully new coverage disposition; 5 materially reconciled/partially new).
- New information ratio: 0.68: `(1 + 5 × 0.5) / 6 = 0.583`, plus the `0.10` simplicity bonus for resolving five contradictions and reducing the implementation model, rounded to `0.68`.
- Questions addressed and answered: all five charter questions—license, complete asset mapping, gates/schema/motion/DNA gaps, theme/corpus coexistence, and ROADMAP disposition—now have final matrix rows and acceptance gates.
- Edge case: contradictory evidence resolved; residual legal/product-demand/fixture unknowns remain explicitly open rather than converted into completion claims.
- Route: `Resolved route: mode=research target_agent=deep-research` is recorded as provenance only.
