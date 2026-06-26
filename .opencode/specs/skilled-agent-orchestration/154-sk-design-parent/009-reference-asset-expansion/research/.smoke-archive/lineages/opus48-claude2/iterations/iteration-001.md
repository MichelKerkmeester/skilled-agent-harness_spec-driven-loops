# Iteration 1: Corpus-utilization gap map + per-mode expansion matrix

## Focus

Build a single corpus-utilization map across the live `sk-design` family, then derive — per mode — the inventory gaps (thin/stale/missing), a prioritized set of additions (type, title, why, corpus source, effort), and an explicit do-NOT-add list honoring the if-effective bar. Grounded in the 001 corpus research, its gap-analysis, the 43-entry external corpus, and the live mode packets.

## Findings

### F1 — Corpus utilization: ~10 high-value external entries are entirely un-distilled
Grepping the live tree for `external/` citations shows the only modes that cite the corpus are `foundations`, `motion`, and `audit` (each via a `corpus_map.md`). `interface` and `md-generator` carry NO `corpus_map.md` and cite no `external/` source. Diffing citations against the 43-entry corpus, the cited set is 21 entries; deliberately out-of-scope is ~12 (`output-skill`, `canvas-design`, `frontend-slides`, `slidev`, `ui-skills-root`, plus the aesthetic-preset sources already folded as `references/aesthetics/`). The **un-distilled high-value** set is: `impeccable`, `taste-skill`, `gpt-tasteskill`, `emil-design-eng`, `redesign-skill`, `bencium-innovative-ux-designer`, `design-lab`, `bolder`/`quieter`/`distill`, `overdrive`, `stitch-skill`. [SOURCE: file:.opencode/skills/sk-design/design-audit/references/corpus_map.md:19-29], [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/corpus_map.md:33-41], [SOURCE: file:.opencode/skills/sk-design/design-motion/references/corpus_map.md:35-44]

### F2 — The register switch is the single highest-leverage missing reference (cross-cutting)
The shared base (`anti_slop_principles.md`, `cognitive_laws.md`, `design_token_vocabulary.md`) has NO operating-register file. `impeccable` makes the brand-vs-product register a non-optional Setup step ("design IS the product" → `brand.md` vs "design SERVES the product" → `product.md`), and it gates motion budget, density, accent dosage, and the anti-slop bar. Every transform verb opens with `## Register`. This matches gap-analysis 05 (must-add) and is a dependency of 04/07/11/N1/N2. [SOURCE: file:.opencode/specs/.../external/impeccable.md:20], [SOURCE: file:.opencode/specs/.../external/bolder.md:12], [SOURCE: file:.opencode/specs/.../001-corpus-research/research/gap-analysis.md:16-49]

### F3 — interface: no `assets/`, no `corpus_map.md`, no mechanical pre-flight gate, no model-tells
`design-interface/SKILL.md` always-loads a single ref (`design_principles.md`). It has no `assets/` directory, so the mechanical pre-flight gate (hero ≤2–3 lines + wide container, gapless `grid-flow-dense` bento, no eyebrow-on-every-section / meta-labels, button-contrast, breakpoint overflow) has no home. The model-specific defect tells (Codex ghost-card/over-round/sketchy-SVG/stripes; Gemini image-hover) and the absolute-bans match-and-refuse list are absent from `design_principles.md` and the shared `anti_slop_principles.md`. The three-dials intake (`DESIGN_VARIANCE`/`MOTION_INTENSITY`/`VISUAL_DENSITY`) is also absent. [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:67-79], [SOURCE: file:.opencode/specs/.../external/gpt-tasteskill.md:67], [SOURCE: file:.opencode/specs/.../external/taste-skill.md:43], [SOURCE: file:.opencode/specs/.../external/impeccable.md:88-108]

### F4 — foundations: color-strategy already covered; data-viz and greenfield-seed are the genuine gaps
`palette_theming.md §2` already distills the Restrained/Committed/Full/Drenched commitment axis, 60-30-10, tinted neutrals, dark-mode surface scale, and token layers — so re-adding color strategy would be a duplicate. The genuine gaps are (a) data-visualization encoding depth (only touched as a quality-floor check in interface's `ux_quality_reference.md §7`, never as build-side encoding) and (b) a greenfield brand-seed color workflow for the no-existing-tokens cold start. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:35-47], [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:81-88], [SOURCE: file:.opencode/specs/.../external/impeccable.md:21,73-86]

### F5 — motion: gesture/spring/advanced-interaction depth is the biggest single gap
`micro_interactions.md §4 Gestures` is one shallow section. `emil-design-eng.md` — the corpus's deepest interaction-engineering doc (spring config, momentum dismissal, damping at boundaries, pointer capture, multi-touch, clip-path reveals, transform-origin/3D, `@starting-style` enter, blur-to-mask, asymmetric enter/exit, WAAPI) — is cited by NO motion reference. AnimatePresence and reduced-motion/performance are already well-distilled, so the gap is concentrated in advanced interaction craft. Motion also has no `assets/` (no easing/duration decision card). [SOURCE: file:.opencode/skills/sk-design/design-motion/references/micro_interactions.md:61-67], [SOURCE: file:.opencode/specs/.../external/emil-design-eng.md:147,444,398,324,592]

### F6 — audit: no `assets/`, generic anti-slop, no content-realism or model-tells dimension
`anti_patterns_production.md` (91 lines) covers anti-slop signals generically; it lacks the model-specific tells and the concrete 100-item detection catalog `redesign-skill` offers, and there is no content-realism audit (placeholder names, fake round numbers, AI-copy cliches, em-dash, Lorem). Audit has no `assets/` (no findings-report template). A detection-side remediation catalog keyed to owners + fix-priority is missing (gap 11), and must stay inside audit's report/score boundary. Minor: SKILL.md §8 points to `changelog/v1.0.0.1.md` but only `v1.0.0.0.md` exists (stale pointer). [SOURCE: file:.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md:18-83], [SOURCE: file:.opencode/specs/.../external/redesign-skill.md:78-131,159-169], [SOURCE: file:.opencode/skills/sk-design/design-audit/SKILL.md:350]

### F7 — md-generator: mature and fidelity-bound; expansion is mostly ineffective
md-generator carries 8 references + 4 gold-standard examples + the Playwright backend + 2 assets. Its identity is measured extraction ("captures what already exists"), bound by the cardinal fidelity rule. The stitch forward-authoring path (gap 10) was routed to a NEW `design-spec` child that was not built; adding it here would invert the skill's identity and is a net-new capability out of scope. The only genuine (low-priority) leverage is tightening the downstream consumer-handoff contract. [SOURCE: file:.opencode/skills/sk-design/design-md-generator/SKILL.md:14,250,338-352]

## Sources Consulted

- `001-corpus-research/research/research.md` (architecture synthesis), `gap-analysis.md` (16→15+N1–N3 gap map)
- Live family: `sk-design/SKILL.md`, `shared/{anti_slop_principles,cognitive_laws,design_token_vocabulary}.md`, all five mode `SKILL.md`, the `corpus_map.md` of foundations/motion/audit, and representative references (`palette_theming`, `typography_system`, `design_principles`, `ux_quality_reference`, `micro_interactions`, `anti_patterns_production`, `critique_hardening`)
- External corpus: `impeccable.md`, `gpt-tasteskill.md`, `redesign-skill.md`, `emil-design-eng.md` (headers), `taste-skill.md` (headers), `design-lab.md` (headers), `bolder.md` (headers), `palette_theming` cross-check
- Tooling: `grep` corpus-utilization scan over the live tree; `find`/`wc -l` inventory of authored references/assets

## Assessment

- **newInfoRatio: 1.0** — first and only pass for this lineage; the corpus-utilization map, per-mode inventory gaps, prioritized adds, and do-not-add lists are all new to this packet.
- **Novelty justification:** no prior lineage content exists in this artifact dir; every finding is original here.
- **Confidence:** High for the utilization map and the live-coverage assessment (read directly). High for the must-add register and motion/emil gap. Medium on effort sizing (estimates, not measured) and on the foundations data-viz home (interface vs foundations boundary call).

## Reflection

- **Worked:** corpus_map-first reading + a single grep utilization scan made coverage-vs-gap unambiguous.
- **Ruled out:** md-generator forward-authoring (identity inversion, net-new); foundations color-strategy (already covered); standalone overdrive motion ref (nice-to-have, slop-risk).
- **Failed:** sandbox blocked brace-regex/`-m`/`cd` compound bash; fell back to single-purpose calls.

## Recommended Next Focus

Lineage complete at `maxIterations: 1`. Hand the per-mode matrix (in `research.md`) to the fan-out merge for cross-lineage convergence against the sibling lineage(s).
