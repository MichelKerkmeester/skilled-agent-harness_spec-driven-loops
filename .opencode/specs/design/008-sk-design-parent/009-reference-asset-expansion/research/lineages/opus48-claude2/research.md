# Deep-Research Synthesis — sk-design reference & asset expansion (lineage opus48-claude2)

> **Packet:** `154-sk-design-parent/009-reference-asset-expansion` · **Lineage:** opus48-claude2 (Claude Opus 4.8, cli-claude-code) · **Loop:** deep-research, 6 iterations, converged.
> **Question:** For each of the five `sk-design` sub-skills, what are the highest-leverage expansions to their `references/` and `assets/`, grounded in the prior corpus research + gap-analysis and the 43-entry external corpus? Per mode: (a) inventory gaps, (b) prioritized additions (type / title / why / corpus sources / effort), (c) an explicit do-NOT-add list honoring the if-effective bar.
> **Status:** Findings only. Every addition is a scope decision; implementation is a separate, gated follow-up. Out of scope: taxonomy/architecture, net-new sub-skills, implementation.

---

## 1. Summary

Five points define the result:

1. **The gap-analysis is right; this lineage grounds and prioritizes it.** Each gap was re-checked against the *live* mode references and the corpus source, then typed (reference vs asset), scoped (in/out), and ranked. Nothing here re-litigates severities.
2. **The single highest-leverage finding is shared, not per-mode.** `shared/register.md` (Brand-vs-Product operating register, gap 05, must-add) is absent and gates interface + audit additions and all three transform verbs. It is recorded as a cross-cutting prerequisite (§4), not padded into one mode's column.
3. **The densest mode is `design-audit`; the leanest is `design-md-generator`.** Audit gains a model-tell catalog, a remediation playbook, transform verbs, and the strongest first-asset case (a fill-in findings report). md-generator is mature: its only in-scope addition is one nice-to-have worked example, and forward-authoring (gap 10) is the out-of-scope `design-spec` surface.
4. **Four of five modes ship zero assets** (only md-generator has any). The highest-ROI asset per reference-only mode is named below; audit's report template is the strongest.
5. **N1 (mock-content) and N2 (mechanical layout gate) are shared twins** — build-side in interface, review-side in audit. Author once, reference twice, to prevent drift.

Convergence: newInfoRatio 1.0 → 0.8 → 0.6 → 0.7 → 0.35 → 0.25; all six key questions answered; quality guards (source diversity, focus alignment, no single weak source) pass.

---

## 2. Method

Six fresh-context iterations, one focus each: interface (1), foundations (2), motion (3), audit (4), md-generator (5), cross-cutting synthesis + convergence (6). Each iteration: read the live mode SKILL + references + `corpus_map.md`, read the primary corpus source(s) for that mode's candidate additions, then produced a typed, scored matrix entry with a do-NOT list. Grounding inputs: `001-corpus-research/research/research.md` (settled taxonomy + per-child corpus map), `001-corpus-research/research/gap-analysis.md` (current-state-validated severity table), the 43-entry `external/` corpus, and the live `sk-design/` tree.

**Inventory baseline (confirmed via filesystem):**

| Mode | references | assets | Maturity |
|---|---|---|---|
| design-interface | 13 (vendored base + grounding/aesthetics/mcp) | **0** | Vendored from Anthropic `frontend-design`; no `corpus_map.md`; draws on none of the taste corpus |
| design-foundations | 5 (color/type/layout + corpus_map) | **0** | Well-covered for static systems; one real hole (data-viz) |
| design-motion | 5 (strategy/micro/presence/perf + corpus_map) | **0** | Well-covered; gesture basics present; missing the restraint gate |
| design-audit | 5 (contract/critique/a11y-perf/anti-patterns + corpus_map) | **0** | Densest expansion target |
| design-md-generator | 8 + 4 worked examples | 2 (+ feature_catalog, Playwright backend) | Most mature; mostly do-NOT |

---

## 3. Per-Mode Expansion Matrix (primary deliverable)

Effort key: **S** ≈ ≤0.5 day · **M** ≈ 0.5–1.5 day. "should" / "nice" reflect the gap-analysis severity, re-validated against live state.

### 3.1 design-interface

**Inventory gaps:** (a) vendored base draws on NONE of the assigned taste/craft corpus (taste-skill, gpt-tasteskill, bencium, emil, make-interfaces-feel-better, design-lab, redesign) — its anti-default calibration is *aesthetic* (three named looks) and misses the *mechanical* tells [SOURCE: design-interface/SKILL.md:120,154-167]; (b) **zero assets** — the STEP 0–4 two-pass process is prose only [SOURCE: design-interface/SKILL.md:99-118]; (c) no mechanical layout pre-flight gate (N2); (d) no mock-content / anti-AI-copy discipline (N1).

| ID | Type | Title | Why it raises usefulness | Corpus sources | Sev | Effort |
|----|------|-------|--------------------------|----------------|-----|--------|
| IF-A1 | asset | `assets/design_plan_preflight.md` — fill-in `<design_plan>` pre-flight card | Converts the prose two-pass into a checkable artifact gating the mechanical defects LLM UI ships (hero line count, bento density, meta-label sweep, button contrast). First asset for the mode. | gpt-tasteskill §3,4,7,8; taste §14; impeccable | should (N2) | M |
| IF-R1 | reference | `references/design-process/mechanical_defaults.md` | Adds the mechanical anti-default checklist (2–3 line hero + max-w fix, gapless bento, meta-label ban, button contrast, section spacing) that the aesthetic calibration omits. Shared N2 artifact with audit. | gpt-tasteskill §2–7; redesign; taste §14 | should (09/N2) | M |
| IF-R2 | reference | `references/design-process/mock_content.md` | Build-side N1: plausible names/numbers/copy, no lorem, no AI-tell phrasing, image-seed discipline. Twin of audit AU-R4. | redesign; gpt-tasteskill §7; impeccable | should (N1) | S |
| IF-R3 | reference | augment `real_ui_loop.md` with a design-lab variation+feedback loop note | Adds an explicit variation→feedback→refine micro-loop. | design-lab | nice (12) | S |
| IF-R4 | reference | bencium craft-depth top-up into `design_principles.md` | Marginal taste-depth enrichment. | bencium | nice (08b) | S |

**Do-NOT-add:** gpt-taste Python-RNG "true randomization" as a hard mandate (redundant with `variation_diversity.md`; contradicts grounding-first); aesthetic presets as a chooser (already guarded critique-against-only); forward DESIGN.md authoring (design-spec surface); gpt-taste GSAP paradigms (motion's boundary); taste-skill wholesale (distill only where each part lands).

### 3.2 design-foundations

**Inventory gaps:** (a) no data-visualization foundations — data is only touched as typographic tabular-nums [SOURCE: design-foundations/references/type/typography_system.md:44]; (b) no structured brief→config intake; (c) zero assets; (d) gestalt/grid already covered by `shared/cognitive_laws.md` + `layout_responsive.md` (near the do-NOT line).

| ID | Type | Title | Why it raises usefulness | Corpus sources | Sev | Effort |
|----|------|-------|--------------------------|----------------|-----|--------|
| FN-R1 | reference | `references/data_viz.md` — data-visualization foundations | Closes the only real coverage hole: chart-type selection, axis/encoding, color-for-data (sequential/diverging/categorical), sparklines, table alignment beyond tabular-nums. | designer-skills `ui-design` data-viz; baseline | should (14d) | M |
| FN-R2 | reference | `references/intake/design_read_dials.md` — Design Read + three dials | Structured intake gate before token decisions; foundations owns the density dial. **Cross-cutting** — coordinate ownership with interface/motion at build time. | taste-skill §0–1 | should (08t) | S |
| FN-R3 | reference | brand-seed color fold-in to `color/palette_theming.md` | Greenfield path: derive a palette from one brand seed when no system exists. | impeccable | nice (N3) | S |
| FN-A1 | asset | `assets/token_starter.md` — fill-in OKLCH ramp + type-scale + spacing-scale scaffold | First foundations asset; turns the static-system references into a fill-in wired to `design_token_vocabulary.md`. | oklch-skill; layout; shared/design_token_vocabulary | nice | M |

**Do-NOT-add:** splitting foundations into color+layout children (taxonomy, decided); a heavy new Gestalt/grid reference (already covered); taste-skill §2 brief→design-system map (Fluent/Carbon/Polaris — framework selection, interface/sk-code concern); re-deriving OKLCH/contrast/dark-mode.

> **Open ownership question (FN-R2):** the three dials are cross-cutting — `VISUAL_DENSITY`→foundations, `DESIGN_VARIANCE`→interface, `MOTION_INTENSITY`→motion. gap-analysis routes the intake to foundations; it may fit better as an interface/shared intake. Flag for the build phase.

### 3.3 design-motion

**Inventory gaps:** (a) gesture *basics* already covered (micro_interactions §4) — the real 08e gap is the missing restraint gate; (b) specific emil craft details not fully distilled; (c) no advanced-rendering reference; (d) zero assets.

| ID | Type | Title | Why it raises usefulness | Corpus sources | Sev | Effort |
|----|------|-------|--------------------------|----------------|-----|--------|
| MO-R1 | reference | `references/animation_decision_framework.md` (or a `motion_strategy.md` section) | Adds the missing restraint gate: 100+/day = never animate, never animate keyboard-initiated actions, tens/day = reduce. Strongest anti-slop motion lever. | emil-design-eng (Animation Decision Framework §1–2) | should (08e) | S–M |
| MO-R2 | reference | advanced-craft top-up to `micro_interactions.md` | popover transform-origin-from-trigger vs centered modals, `:active` scale(0.97), `scale(0.95)+opacity` over `scale(0)`, Before/After review-table format. | emil-design-eng | should (08e) | S |
| MO-R3 | reference | `references/advanced_rendering.md` — propose-first technique toolkit | View Transitions morph-from-trigger, virtual scroll, GPU/Canvas for data, spring drag-and-drop — bounded by overdrive's propose-before-building. | overdrive; gpt-taste; emil | nice (06) | M |
| MO-A1 | asset | `assets/motion_plan_card.md` — fill-in per-element motion plan | Operationalizes MO-R1: purpose + frequency-decision + timing/easing + reduced-motion fallback. First motion asset. | emil; motion_strategy | nice | M |

**Do-NOT-add:** gesture basics (already in micro_interactions §4); gpt-taste GSAP scroll paradigms as default mandates (admit only inside MO-R3 as optional); motion-performance *review* (audit's surface); emil's "Initial Response" identity framing; a separate `design-interaction` child (net-new, out of scope).

### 3.4 design-audit (densest)

**Inventory gaps:** (a) no AI-fingerprint / model-tell catalog; (b) no structured remediation sequence; (c) no directional transform verbs; (d) no mock-content review check / mechanical layout gate; (e) zero assets despite the deliverable being a report.

| ID | Type | Title | Why it raises usefulness | Corpus sources | Sev | Effort |
|----|------|-------|--------------------------|----------------|-----|--------|
| AU-R1 | reference | `references/ai_fingerprint_tells.md` — model-specific defect catalog | The highest-leverage single addition family-wide: concrete, checkable Codex (tracking/ghost-card/over-round/sketchy-SVG/stripes), Gemini (img-hover ban), 2026-general (cream-bg/eyebrow-every-section/section-fade) tells. Turns "feels AI-made" into P0–P3 findings. | impeccable | should (07) | M |
| AU-R2 | reference | `references/remediation_playbook.md` — Scan→Diagnose→Fix sequence | Structured remediation + generic-AI-pattern checklist for redesign/upgrade tasks; complements polish without duplicating. | redesign-skill; taste §11 | should (11) | M |
| AU-R3 | reference | `references/transform_verbs.md` — bolder / quieter / distill (register-gated) | Directional transform operations for "make it bolder/quieter/simpler" review-and-fix. **Depends on register (XC-1).** Shared with interface. | bolder; quieter; distill; impeccable | should (04) | S–M |
| AU-R4 | reference | mock-content review check (fold into `anti_patterns_production.md`) | Review-side N1 twin of interface IF-R2: lorem, AI-tell copy, implausible placeholder data, missing image-seed discipline. | redesign; gpt-taste §7; impeccable | should (N1) | S |
| AU-R5 | reference | mechanical layout pre-flight gate (shared artifact with interface) | Checkable gate: hero line count, bento density, meta-label sweep, button contrast, equal-3-card, optical alignment. Author once (with IF-R1); audit references the review view. | taste §14; gpt-taste §8; impeccable; redesign Layout | should (N2) | S–M |
| AU-A1 | asset | `assets/audit_report_template.md` — fill-in 5-dim `/20` + P0–P3 report | Operationalizes `audit_contract.md`; the audit deliverable IS a report, so this is the strongest first-asset case in the family. | audit.md; audit_contract.md | should | M |
| AU-R6 | reference | visual-critique 7-lens top-up to `critique_hardening.md` | Marginal lens enrichment. | designer-skills visual-critique | nice (16) | S |

**Do-NOT-add:** critique/cognitive-load/Nielsen/personas/hardening/polish (already in `critique_hardening.md`); CWV/a11y/perf (already in `accessibility_performance.md`; do not revert INP→FID); implementing fixes (sk-code's boundary); elevating a11y to a standalone `design-a11y` child (taxonomy, out of scope).

### 3.5 design-md-generator (leanest — expansion mostly not effective)

**Inventory gaps:** essentially none. 8 references + 4 worked examples + 2 assets + feature_catalog + Playwright backend; no thin/stale reference found. The only coverage skew: all 4 worked examples are SaaS-minimalist aesthetics.

| ID | Type | Title | Why it raises usefulness | Corpus sources | Sev | Effort |
|----|------|-------|--------------------------|----------------|-----|--------|
| MD-A1 | asset (worked example) | `references/examples/<distinct-aesthetic>/` — a 5th DESIGN.md exemplar in a non-SaaS aesthetic (editorial / e-commerce / maximalist) | All 4 current exemplars are SaaS-minimalist; a distinct aesthetic broadens format coverage for non-SaaS extractions. | v3 format + a fresh extraction run | nice | S–M |

**Do-NOT-add (dominant verdict):** forward DESIGN.md/PRODUCT.md authoring (stitch, gap 10) — different input contract (taste directive → DESIGN.md, no live site); routes to a net-new `design-spec` child per 001 research; **out of scope for 009**; new extraction-pipeline references (backend comprehensive); duplicate format/taxonomy references (already covered); a second prompt/cardinal asset (two already exist).

---

## 4. Cross-Cutting Prerequisites & Patterns

These gate or span the five modes; they are not a sixth mode.

| ID | Type | Scope | Title | Why | Sources | Effort |
|----|------|-------|-------|-----|---------|--------|
| XC-1 | reference | shared (parent) | `shared/register.md` — Brand-vs-Product operating register | The must-add prerequisite (gap 05); gates interface + audit additions and all three transform verbs; absent today. | impeccable; bolder/quieter/distill Register sections | M |
| XC-2 | pattern | family | First-asset per reference-only mode | 4 modes have zero assets; one fill-in artifact each (IF-A1 preflight / FN-A1 token-starter / MO-A1 motion-plan / AU-A1 audit-report) operationalizes their references. AU-A1 is the strongest. | mode references + gpt-taste preflight + audit_contract | per mode |
| XC-3 | authoring rule | shared/interface/audit | Author N1 + N2 once, reference twice | Prevents drift between build-side (interface) and review-side (audit) copies of mock-content and the layout gate. | gap-analysis N1/N2 | n/a |

**Cross-cutting do-NOT-add:** a sixth "intake/register" child (register is shared content, not a sub-skill); duplicating N1/N2 independently in interface and audit (author once); re-litigating the gap severities (the gap-analysis table is authoritative input).

---

## 5. Family-Wide Priority Ranking

Should-adds ordered by leverage (corpus strength × coverage hole × checkability):

1. **XC-1 `shared/register.md`** (must) — gates the most downstream work.
2. **AU-R1 model-tell catalog** — most concrete, highest checkable value, no current analog.
3. **N2 mechanical layout gate** (IF-R1 + AU-R5, shared) — converts the most common LLM layout defects into a checkable gate.
4. **AU-R2 remediation playbook** — turnkey from redesign-skill.
5. **MO-R1 motion frequency-decision gate** — strongest motion restraint lever.
6. **FN-R1 data-viz** — the only real foundations coverage hole.
7. **AU-R3 transform verbs + N1 mock-content** (both register-dependent).

First-assets rank with their modes (AU-A1 highest). md-generator's MD-A1 and the nice-to-haves (IF-R3/R4, FN-R3/A1, MO-R3/A1, AU-R6) sit below.

---

## 6. Recommendations

1. **Build XC-1 (`shared/register.md`) first** — it unblocks AU-R1/R3 and IF-R1/R3 and is the must-add.
2. **Then the audit cluster** (AU-R1, AU-R2, AU-A1) — densest payoff, most concrete corpus.
3. **Author N1 + N2 once each** (XC-3), referenced by interface and audit.
4. **Add one first-asset per reference-only mode** (XC-2), starting with AU-A1.
5. **Treat md-generator as done** — ship at most MD-A1 (nice-to-have); defer forward-authoring to the separate `design-spec` decision.
6. **Resolve the FN-R2 dials ownership** (foundations vs interface/shared) before authoring.

---

## 7. Eliminated Alternatives (negative knowledge — primary output)

| Approach | Reason eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| gpt-taste Python-RNG "true randomization" as a literal interface addition | Redundant with `variation_diversity.md` seed-of-thought debias; contradicts grounding-first | external/gpt-tasteskill.md:13-20 vs design-interface/SKILL.md:137 | 1 |
| Aesthetic presets as a chooser in interface | Already guarded as critique-against-only; must not become a pick-a-vibe axis | design-interface/SKILL.md:179 | 1 |
| Splitting foundations into color + layout children | mimo domain-pure taxonomy; taxonomy decided, out of scope | 001-corpus-research/research/research.md:88 | 2 |
| Heavy new Gestalt/grid reference (14g) in foundations | Already covered by `shared/cognitive_laws.md` + `layout_responsive.md` | gap-analysis.md:43 | 2 |
| taste-skill §2 brief→design-system map into foundations | Framework/package selection — interface grounding + sk-code, not static foundations | external/taste-skill.md:82-104 | 2 |
| Adding gesture basics to motion | Already covered in `micro_interactions.md` §4 | design-motion/references/micro_interactions.md:61-66 | 3 |
| Folding motion-performance review into motion | Owned by audit; motion build vs review boundary is correct | design-motion/references/corpus_map.md:46 | 3 |
| emil "Initial Response" identity framing into motion | Standalone-skill persona artifact, not transferable craft | external/emil-design-eng.md:8-14 | 3 |
| Duplicating critique/CWV/a11y in new audit references | Already deep in `critique_hardening.md` + `accessibility_performance.md` | design-audit/references/critique_hardening.md:18-89 | 4 |
| Implementing fixes inside audit | Audit reports/scores; implementation is sk-code after acceptance | design-audit/references/corpus_map.md:37 | 4 |
| Elevating a11y to a standalone `design-a11y` child | mimo single-lineage stance; taxonomy decided, out of scope | gap-analysis.md (a11y in audit) | 4 |
| Folding stitch forward-authoring into md-generator (gap 10) | Different input contract; routes to net-new `design-spec` child; out of scope for 009 | external/stitch-skill.md:7-21 vs design-md-generator/SKILL.md:44-45 | 5 |
| A sixth "intake/register" child | register is shared content, not a sub-skill; net-new children out of scope | gap-analysis.md:55 | 6 |
| Duplicating N1/N2 independently in interface and audit | Author once, reference twice to prevent drift | gap-analysis.md:26-27 | 6 |

---

## 8. Open Questions / Divergences

1. **FN-R2 dials ownership** — the three dials span density (foundations), variance (interface), motion (motion). gap-analysis routes the intake to foundations; an interface/shared home may fit better. Build-phase decision.
2. **register scope (XC-1)** — the family's single highest-leverage corpus finding lands in `shared/`, slightly adjacent to the per-mode brief. Recorded as a prerequisite, not a per-mode column entry.
3. **N1/N2 owning home** — `shared/` vs interface-owned-with-audit-reference. Either preserves "author once"; pick at build time.
4. **MD-A1 cost** — a 5th worked example requires a real extraction run; only nice-to-have, so it may not earn out.
5. **Effort estimates are coarse** (S/M) — confirm against the actual authoring during the gated follow-up.

---

<!-- ANCHOR:references -->
## 9. References

### Lineage state (this run)
- `research/lineages/opus48-claude2/iterations/iteration-00{1..6}.md`
- `research/lineages/opus48-claude2/deep-research-state.jsonl` (config + 6 iterations + converged event)
- `research/lineages/opus48-claude2/deep-research-findings-registry.json`

### Grounding inputs (read-only)
- `001-corpus-research/research/research.md` (settled taxonomy + per-child corpus-source map)
- `001-corpus-research/research/gap-analysis.md` (current-state-validated severity table; authoritative gap baseline)
- `154-sk-design-parent/009-reference-asset-expansion/spec.md`

### Live sk-design tree (expansion target)
- `sk-design/design-interface/SKILL.md` + `references/` (13 refs, 0 assets)
- `sk-design/design-foundations/{SKILL.md, references/corpus_map.md, references/{color,type,layout}/*}` (5 refs, 0 assets)
- `sk-design/design-motion/{SKILL.md, references/{corpus_map,motion_strategy,micro_interactions}.md}` (5 refs, 0 assets)
- `sk-design/design-audit/{SKILL.md, references/{corpus_map,critique_hardening}.md}` (5 refs, 0 assets)
- `sk-design/design-md-generator/{SKILL.md, references/, assets/, feature_catalog/, backend/}` (most mature)
- `sk-design/shared/{anti_slop_principles,cognitive_laws,design_token_vocabulary}.md` (register.md absent)

### Corpus sources cited (subset of the 43-entry external/)
- Interface/craft: `gpt-tasteskill`, `taste-skill`, `redesign-skill`, `bencium-innovative-ux-designer`, `design-lab`
- Foundations: `oklch-skill`, `layout`, `baseline`, `adapt`, `colorize`, `designer-skills-main` (ui-design data-viz)
- Motion: `emil-design-eng`, `overdrive`, `animate`, `interaction-design`, `make-interfaces-feel-better`
- Audit/transform: `impeccable`, `redesign-skill`, `bolder`, `quieter`, `distill`, `audit`, `critique`, `polish`, `harden`
- Spec/authoring: `stitch-skill` (forward-authoring, routed out of scope)
<!-- /ANCHOR:references -->
