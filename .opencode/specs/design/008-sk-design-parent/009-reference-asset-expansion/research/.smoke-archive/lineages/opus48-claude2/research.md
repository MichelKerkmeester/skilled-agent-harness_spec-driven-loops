# Deep-Research Synthesis — sk-design sub-skill reference & asset expansion (lineage: opus48-claude2)

> **Packet:** `154-sk-design-parent/009-reference-asset-expansion` · **Lineage:** `opus48-claude2` (Claude Opus 4.8) · **Loop:** deep-research, `maxIterations: 1` (fan-out lineage; convergence evaluated at the merge step).
> **Question:** For each of the five live `sk-design` modes (`design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`), what are the **highest-leverage** expansions to their `references/` and `assets/` — grounded in the 001 corpus research + gap-analysis and the 43-entry external corpus — honoring an if-effective bar?
> **Status:** findings only. Implementation is a separate, gated follow-up. Taxonomy/architecture and net-new sub-skills are out of scope.

---

## 1. Summary

The live family is in good shape: `foundations`, `motion`, and `audit` each distil their corpus through an explicit `corpus_map.md`, and the distilled references are current (e.g. CWV already modernized FID→INP). The leverage is therefore **not** "add more of what's covered" — it is to close a small number of **specific, named** gaps that the corpus proves matter and the live packets demonstrably lack.

Three structural facts drive every recommendation:

1. **The register switch is the single highest-leverage missing reference.** The shared base has no brand-vs-product operating register, yet `impeccable` makes it a non-optional setup step that gates motion budget, density, accent dosage, and the anti-slop bar — and every transform verb opens on it. It is a dependency of the transform-verb, model-tells, remediation, mock-content, and pre-flight adds (gap-analysis **05, must-add**). It lands in `shared/` and is consumed by `interface` and `audit` foremost.
2. **`interface` and `md-generator` carry no `corpus_map.md`** (the other three do). `interface` also has **no `assets/` directory**, so the mechanical pre-flight gate the corpus repeatedly prescribes (`impeccable`, `gpt-tasteskill`, `taste-skill`) has nowhere to live. `audit` and `motion` likewise have no `assets/`.
3. **~10 high-value corpus entries are entirely un-distilled** — `impeccable`, `taste-skill`, `gpt-tasteskill`, `emil-design-eng`, `redesign-skill`, `bencium`, `design-lab`, `bolder`/`quieter`/`distill`, `overdrive`, `stitch-skill`. The effective additions all draw from this un-distilled set; the un-effective ones try to re-cover already-distilled sources.

The biggest **single-mode** depth gap is `motion` ↔ `emil-design-eng` (springs, gesture/drag, clip-path, `@starting-style`, WAAPI), where motion currently cites none of the corpus's deepest interaction-engineering doc. The biggest **do-not-add** is `md-generator` forward-authoring: it inverts the measured-extraction identity, contradicts the cardinal fidelity rule, and was routed in 001 to a `design-spec` child that was deliberately **not built**.

---

## 2. Method

Single iteration, grounded in three evidence sources:

- **Prior research** — `001-corpus-research/research/research.md` (architecture) and `gap-analysis.md` (the 16-gap baseline re-validated to **15 confirmed + N1–N3**, with severities: 05 register **must-add**; 04/07/08e/09/11/14d/N1/N2 **should-add**; 06/08b/12/16/N3 **nice-to-have**; 01/02/03/13 scope/family rulings).
- **Live packets** — every mode `SKILL.md`, the parent `SKILL.md` + `shared/`, the three `corpus_map.md` files, and representative references in each mode.
- **External corpus** — a `grep` utilization scan of the live tree for `external/` citations, diffed against the 43-entry corpus directory; then deep reads of the highest-signal un-distilled entries (`impeccable`, `gpt-tasteskill`, `redesign-skill`, `palette_theming` cross-check) and header surveys of `emil-design-eng`, `taste-skill`, `design-lab`, `bolder`.

**Corpus utilization map (43 entries):**

| Bucket | Count | Entries |
|---|---|---|
| **Cited / distilled** | ~21 | motion: animate, interaction-design, delight, morphing-icons, 12-principles, mastering-animate-presence, fixing-motion-performance, make-interfaces-feel-better · foundations: oklch-skill, colorize, layout, baseline, adapt, designer-skills(type) · audit: audit, critique, polish, harden, optimize, fixing-accessibility, clarify, pseudo-elements · interface(as aesthetics presets): brutalist, minimalist, soft, apple-bento |
| **Out of scope / family ruling** | ~12 | output-skill (sk-code), canvas-design, frontend-slides, slidev (presentation), ui-skills-root (meta), most designer-skills process plugins |
| **Un-distilled, high value** | ~10 | **impeccable, taste-skill, gpt-tasteskill, emil-design-eng, redesign-skill**, bencium, design-lab, **bolder/quieter/distill**, overdrive, stitch-skill |

Every "add" below draws from the third bucket; every "do-not-add" is either already covered (bucket 1) or out of scope (bucket 2 / net-new).

---

## 3. Cross-cutting prerequisite (lands in `shared/`, consumed by the modes)

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|---|---|---|---|---|---|
| **X1** | reference | `shared/register.md` — brand-vs-product **operating** register | The missing switch: "design IS the product" (marketing/landing/campaign → `brand`) vs "design SERVES the product" (app/admin/dashboard → `product`), gating motion budget, density, accent dosage, and the anti-slop bar. Without it, every mode applies one undifferentiated bar to a campaign hero and an admin table alike. Dependency of IF1–IF3, AU1, AU3, FO2 (gap **05 must-add**, the highest-leverage item in the whole phase). | `external/impeccable.md:20` (Setup step 4: brand.md/product.md), `external/bolder.md:12` (`## Register`), `gap-analysis.md:16,41` | **M** |

> Home note: a register is **shared vocabulary** the modes cite, so it belongs in the parent `shared/` base (alongside `anti_slop_principles.md`), not duplicated per mode. `interface` cites it at the grounding/critique step; `audit` cites it to set a register-aware scoring bar; the transform-verb behaviors (`bolder`/`quieter`/`distill`) depend on it. **Confirm at merge** whether the literal file is `shared/register.md` or split brand/product cards.

---

## 4. Per-mode expansion matrix

Effort key: **S** = one distilled reference (~80–120 lines) or a one-page asset card · **M** = substantial multi-section reference (~150–250 lines) · **L** = deep reference (250+ lines) or new capability.

### 4.1 `design-interface`

**Inventory gaps.** No `assets/` directory (the mechanical pre-flight gate has no home). No `corpus_map.md` (the only doc-mode missing provenance). `design_principles.md` is the single always-load reference and contains neither the per-model defect tells nor the absolute-bans match-and-refuse list. The three-dials intake is absent. `references/aesthetics/` carries 4 presets but not the "reflex-reject aesthetic lanes."

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|---|---|---|---|---|---|
| **IF1** | asset | `assets/preflight_checklist.md` — mechanical pre-flight gate | Converts scattered anti-default prose into a runnable pre-build gate: hero ≤2–3 lines + wide container, gapless `grid-flow-dense` bento, no meta-labels / eyebrow-on-every-section, button-contrast, breakpoint-overflow check. Catches the highest-frequency layout tells before code (gap **N2**). Interface's first `assets/` file. | `external/gpt-tasteskill.md:67` (§8 pre-flight), `external/taste-skill.md:910` (§14 final pre-flight), `external/impeccable.md:88-98` (absolute bans) | **S** |
| **IF2** | reference | `references/design-process/intake_dials.md` — three-dials brief read | Maps a free "make it look good" brief to explicit `DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY` values + a one-line "Design Read", so intensity is a tuned choice rather than a fixed median. Complements grounding; does not replace it (gap **08t/09**). | `external/taste-skill.md:43` (§1 dials), `external/taste-skill.md:13` (§0 brief inference), `external/gpt-tasteskill.md:13` | **M** |
| **IF3** | reference | `references/anti-defaults/model_tells.md` — per-model defect catalog (refuse-and-rewrite) | The generic slop list misses the per-model tells that dominate real output: Codex ghost-card / over-round / sketchy-SVG / diagonal-stripes; Gemini image-hover. Cheap, high-signal, and the rewrite guidance is interface-owned (gap **07**). Detection half is shareable with audit (AU1). | `external/impeccable.md:100-108` (`<codex>`), `external/impeccable.md:69-71` (`<gemini>`), `external/taste-skill.md:595` (§9 AI tells) | **S** |

**Do-NOT-add (interface).**
- **More aesthetic presets / bencium depth** — the 4 presets already serve the critique-against need and are explicitly "never a chooser"; more risks turning `aesthetics/` into a vibe menu (an anti-goal). Nice-to-have at best (gap 08b).
- **A standalone "writing in design" reference** — already covered well in `design_principles.md §6`.
- **Real-UI-loop / variation-diversity expansion** — `real_ui_loop.md` (119 lines) and `variation_diversity.md` (124 lines) are already substantial.
- **The `design-lab` variation+feedback harness** — its server/route/feedback machinery is process-heavy and overlaps deep-loop + `real_ui_loop`; gap-analysis rates it nice-to-have (gap 12).

### 4.2 `design-foundations`

**Inventory gaps.** No `assets/` directory. Data-visualization encoding guidance is absent (only touched as a quality-floor check in interface's `ux_quality_reference.md §7`, never as build-side encoding). No greenfield brand-seed color workflow for the no-existing-tokens cold start.

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|---|---|---|---|---|---|
| **FO1** | reference | `references/data-viz/data_visualization.md` — encoding + chart palettes | Data-viz is a real static-system surface foundations doesn't own. Interface checks chart quality at the floor; foundations should own how to **build** the encoding: chart-type by data relationship, encoding hierarchy (position > length > angle > color), categorical/sequential/diverging palettes, accessible chart color, axis/legend discipline (gap **14d**). | `gap-analysis.md:24` (designer-skills data-viz), `external/designer-skills-main/README.md`, cross-check `design-interface/.../ux_quality_reference.md:81-88` | **M** |
| **FO2** | reference | `references/color/greenfield_seed.md` — cold-start brand-seed workflow (or fold into `oklch_workflow.md`) | Foundations covers register/roles/dark-mode but assumes a palette already exists. The no-tokens seed path is missing: derive a primary brand hue, compose bg/surface/ink/accent/muted around it in OKLCH, decide theme via a physical-scene sentence (gap **N3**). | `external/impeccable.md:21` (palette seed step), `external/impeccable.md:73-86` (new-project color/theme), `gap-analysis.md:35` | **S** |

**Do-NOT-add (foundations).**
- **Color-strategy commitment axis** (Restrained / Committed / Full / Drenched) — **already** distilled in `palette_theming.md §2` (with 60-30-10 and dosage). Do not duplicate.
- **OKLCH channel depth** — `oklch_workflow.md` already covers channels / APCA-WCAG / gamut / Tailwind.
- **Typography expansion** — `typography_system.md` already covers roles / scale / pairing-on-contrast / 45–75ch measure / hierarchy.
- **Gestalt/grid top-up** — covered by `cognitive_laws.md` (proximity, common-region) + `layout_responsive.md`; nice-to-have (gap 14g).

### 4.3 `design-motion`

**Inventory gaps.** `micro_interactions.md §4 Gestures` is a single shallow section. `emil-design-eng.md` — the corpus's deepest interaction-engineering doc — is cited by **no** motion reference. No `assets/` directory (no easing/duration decision card). `overdrive.md` is un-distilled (intentionally; see do-not-add).

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|---|---|---|---|---|---|
| **MO1** | reference | `references/advanced_interaction_craft.md` — springs, gesture/drag, clip-path, `@starting-style`, WAAPI | The single biggest motion depth gap. Adds spring config (stiffness/damping, `bounce:0` for UI), gesture/drag (momentum dismissal, damping at boundaries, pointer capture, multi-touch protection), clip-path reveals, transform-origin/3D depth, `@starting-style` enter, blur-to-mask transitions, asymmetric enter/exit timing, WAAPI. Motion currently cites none of this; gesture coverage is one paragraph (gap **08e**). | `external/emil-design-eng.md:147` (springs), `:444` (gesture/drag), `:398` (clip-path), `:324` (@starting-style), `:592` (asymmetric timing) | **M–L** |
| **MO2** | asset | `assets/easing_duration_card.md` — one-page motion decision card | Motion has no `assets/`. A duration-by-interaction-type scale + ease-out-expo/quart curves + the never-patterns (no layout-prop animation, no `transition: all`, no `scale(0)`) + reduced-motion alternatives is the most-reached-for artifact during a build. | `external/emil-design-eng.md:62` (decision framework), `:482` (performance rules), `external/impeccable.md:56` (motion rules) | **S** |

**Do-NOT-add (motion).**
- **AnimatePresence depth** — `animate_presence_patterns.md` (102 lines) already distils `mastering-animate-presence` thoroughly.
- **Reduced-motion / performance** — `performance_reduced_motion.md` (100 lines) already covers FLIP, will-change, blur bounds, view transitions.
- **A standalone `overdrive` maximalist-rendering reference** — nice-to-have, high slop-risk, low everyday leverage; at most fold one or two materials into MO1 (gap 06).
- **12-principles re-distill** — already in `motion_strategy.md` + `micro_interactions.md`.

### 4.4 `design-audit`

**Inventory gaps.** No `assets/` directory (no findings-report template). `anti_patterns_production.md` (91 lines) is generic — it lacks the per-model tells and the concrete 100-item detection catalog `redesign-skill` offers. No content-realism dimension (placeholder names, fake round numbers, AI-copy cliches, em-dash, Lorem). Minor doc nit: `SKILL.md §8` points to `changelog/v1.0.0.1.md` but only `v1.0.0.0.md` exists (stale pointer).

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|---|---|---|---|---|---|
| **AU1** | reference | `references/mock_content_and_tells.md` — content-realism + per-model tells (detection) | Audit scores anti-slop generically and never checks content realism — the most common "obviously AI" tell. Adds detection for placeholder names, fake round-number stats, AI-copy cliches ("Elevate/Seamless/Unleash"), em-dash overuse, Lorem; plus the per-model visual tells as **detection** (the rewrite half is interface/IF3) (gap **N1 + 07**). | `external/redesign-skill.md:78-89` (content), `external/taste-skill.md:615` (§9.D), `:685` (§9.G em-dash), `external/impeccable.md:100-108` | **S–M** |
| **AU2** | asset | `assets/findings_report_template.md` — fill-in audit report skeleton | Audit's output contract is prose-only. A template (evidence table, P0–P3 findings, 5-dimension `/20` scorecard, owner-mapping column) makes every report consistent and is the artifact users copy — mirroring the `sk-code-review` findings-first contract. Audit's first `assets/` file. | `design-audit/references/audit_contract.md` (existing contract), `external/audit.md:8-10` | **S** |
| **AU3** | reference | `references/remediation_playbook.md` — detection-side anti-pattern catalog + fix-priority | Turns findings into a sequenced remediation backlog keyed to the owning sibling (typography/color/layout/state/component/iconography) with a fix-priority order. **Stays inside audit's report/score boundary** by pointing each fix at a sibling, never implementing (gap **11**). | `external/redesign-skill.md:17-131` (audit catalog), `:159-169` (fix priority) | **M** |

**Do-NOT-add (audit).**
- **a11y/perf reference expansion** — `accessibility_performance.md` already covers names/keyboard/focus/contrast, CWV (INP), and motion-perf, and is current.
- **A repair/implementation guide** — out of audit's boundary; `sk-code` owns repair. Keep AU3 detection + owner-mapping only.
- **Nielsen / persona / cognitive-load expansion** — `critique_hardening.md` already covers these.

### 4.5 `design-md-generator`

**Inventory gaps.** Few, and mostly by design. The mode is mature: 8 references + 4 gold-standard examples (stripe/vercel/linear/supabase) + the Playwright extraction backend + 2 assets (`cardinal_rules_card.md`, `design_md_prompt_template.md`). Its identity is **measured extraction** ("captures what already exists"), bound by the cardinal fidelity rule. No `corpus_map.md`, which is acceptable here (it is an extraction engine, not a corpus-distilled doc-mode).

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|---|---|---|---|---|---|
| **MD1** | reference | `references/consumer_handoff.md` — downstream read-contract **[LOW PRIORITY]** | The only genuine leverage for a fidelity-bound mode: tighten how `interface`/`sk-code` should **read** a v3 `DESIGN.md` — which sections are authoritative, stability-class (L1–L4) semantics, what to treat as fixed vs free. Sharpens the contract the other modes consume. | `design-md-generator/SKILL.md:338-352` (format spec), `external/stitch-skill.md:9-26` (consumer contract) | **S** |

**Do-NOT-add (md-generator) — strong.**
- **Forward-authoring / `DESIGN.md`-from-directives (stitch gap 10)** — inverts the measured-extraction identity, contradicts the cardinal fidelity rule ("every value copied verbatim from `tokens.json`"), and was routed in 001 to a **new `design-spec` child that was deliberately not built**. Adding it here is a net-new capability in disguise — out of scope.
- **More gold-standard examples** — 4 already span the format space; more is volume, not leverage.
- **Color / type / motion guidance** — belongs to foundations/motion/interface; md-generator only formats measured values.
- **Anti-slop / taste content** — md-generator is fidelity-bound; taste belongs to interface.

---

## 5. Prioritized sequencing (for the gated follow-up)

1. **X1 `shared/register.md`** (must-add) — build first; it gates IF1–IF3, AU1, AU3, FO2.
2. **Highest-leverage should-adds by mode:** MO1 (motion depth, biggest single gap) · AU1 + AU3 (audit detection breadth) · IF1 + IF3 (interface gate + tells) · FO1 (foundations data-viz).
3. **Cheap wins / assets:** IF1, MO2, AU2 (one-page artifacts, S effort) · FO2, IF3 (S references).
4. **Lower priority:** IF2 (M), MD1 (nice-to-have).
5. **Stop there.** Everything in the do-not-add lists is either already covered or out of scope; adding it would be volume, not leverage.

---

## 6. Open questions / boundary calls (for the fan-out merge)

1. **Register home** — literal `shared/register.md` vs split `brand`/`product` cards, and whether `interface`/`audit` each carry a register-aware wrapper. (Recommend: one shared file, per-mode citation.)
2. **Data-viz home** — foundations (FO1, build-side encoding) vs leaving it a quality-floor check in interface's `ux_quality_reference.md §7`. (Recommend: foundations for encoding depth; interface keeps the floor check.)
3. **AU3 boundary** — confirm the remediation playbook stays detection + owner-mapping and never crosses into implementation (sk-code's boundary).
4. **IF3/AU1 model-tells split** — the per-model defect catalog is shared substance; confirm whether the detection core lives once in `shared/` with interface (rewrite) and audit (detect) citing it, vs two copies.
5. **Effort estimates are judgment, not measured** — treat S/M/L as relative sizing for planning, not commitments.

---

<!-- ANCHOR:references -->
## 7. References

### Prior research (grounding)
- `001-corpus-research/research/research.md` — architecture synthesis (five-mode taxonomy decision).
- `001-corpus-research/research/gap-analysis.md` — 16→15 confirmed + N1–N3 gap map with validated severities (the spine of this matrix).

### Live family (expansion target)
- `sk-design/SKILL.md`, `sk-design/mode-registry.json`
- `sk-design/shared/{anti_slop_principles.md, cognitive_laws.md, design_token_vocabulary.md}` (no `register.md` — see X1)
- `sk-design/design-interface/SKILL.md` + `references/{design-process/*, aesthetics/*, design-grounding/*, mcp-tooling/*}` (no `assets/`, no `corpus_map.md`)
- `sk-design/design-foundations/SKILL.md` + `references/{corpus_map.md, color/*, type/*, layout/*}` (no `assets/`)
- `sk-design/design-motion/SKILL.md` + `references/{corpus_map.md, motion_strategy.md, micro_interactions.md, animate_presence_patterns.md, performance_reduced_motion.md}` (no `assets/`)
- `sk-design/design-audit/SKILL.md` + `references/{corpus_map.md, audit_contract.md, accessibility_performance.md, critique_hardening.md, anti_patterns_production.md}` (no `assets/`)
- `sk-design/design-md-generator/SKILL.md` + `references/*` + `assets/{cardinal_rules_card.md, design_md_prompt_template.md}` + `backend/`

### External corpus — un-distilled sources backing the adds
- `external/impeccable.md` (register, model tells, absolute bans, palette seed) — backs X1, IF1, IF3, AU1, FO2
- `external/taste-skill.md` (three dials, pre-flight, AI tells) — backs IF2, IF1, AU1
- `external/gpt-tasteskill.md` (AIDA, 2-line hero, gapless bento, pre-flight gate) — backs IF1, IF2
- `external/emil-design-eng.md` (springs, gesture/drag, clip-path, @starting-style, WAAPI) — backs MO1, MO2
- `external/redesign-skill.md` (100-item anti-pattern catalog, content realism, fix priority) — backs AU1, AU3
- `external/bolder.md` (`## Register` opener) — corroborates X1
- `external/stitch-skill.md` (consumer/author contract) — backs MD1 (and is the basis of the md-generator do-not-add)
- `external/designer-skills-main/README.md` (data-viz cluster) — backs FO1

### Lineage state (this artifact dir)
- `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `deep-research-findings-registry.json`, `deep-research-dashboard.md`, `iterations/iteration-001.md`
<!-- /ANCHOR:references -->

---

## 8. Convergence report

- **Stop reason:** `maxIterations` (lineage capped at 1; cross-lineage convergence is evaluated at the fan-out merge, not within this lineage).
- **Total iterations completed:** 1
- **Questions answered ratio:** 4/4 lineage questions resolved (2 boundary calls carried to merge).
- **Average newInfoRatio:** 1.0 (single first pass; all findings new to this packet).
- **Quality guards:** source diversity satisfied (prior research + live packets + external corpus, 3 independent classes); focus alignment held (per-mode matrix is the sole focus); no single-weak-source finding (every add cites ≥1 corpus source plus a live-packet gap).
