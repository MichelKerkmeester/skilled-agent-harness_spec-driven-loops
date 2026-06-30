# Deep-Research Synthesis: sk-design reference and asset expansion

> **Packet:** `154-sk-design-parent/009-reference-asset-expansion`
> **Run:** 2-lineage fan-out, 16 iterations total (opus48-claude2 converged at 6, gpt55fast ran the full 10), merged into this consolidated matrix.
> **Question:** Per sk-design sub-skill, what are the highest-leverage expansions to `references/` and `assets/`, grounded in the prior corpus research + gap-analysis and the 43-entry external corpus, honoring an "if effective" bar.
> **Status:** Findings only. Every addition is a scope decision; implementation is a separate, gated follow-up. Out of scope: taxonomy/architecture, net-new sub-skills, implementation.

The `Src` column records lineage agreement: **both** = both lineages independently proposed it (high confidence), **opus** / **gpt** = surfaced by one lineage.

---

## 1. Summary

1. **Both lineages independently ranked the same #1: a shared Brand-vs-Product operating register (`shared/register.md`).** Opus grounded it in `impeccable` + `bolder`/`quieter`/`distill`; GPT grounded it in `colorize` + `animate`. Independent convergence on the same must-add (gap 05) makes this the highest-confidence finding in the run.
2. **Four of five modes ship zero assets** (only md-generator has any). The highest-ROI first asset per mode is named below; the audit report template is the strongest case because the audit deliverable *is* a report.
3. **`design-audit` is the densest expansion target; `design-md-generator` is the leanest** (mostly do-NOT). Both lineages agree.
4. **The expansion is operational, not bulk import.** Both lineages explicitly reject importing the corpus wholesale; the leverage is in checklists, decision cards, and the register, not more style presets.
5. **One genuine divergence — md-generator forward-authoring — reconciles:** document the measured-vs-authored *boundary* (GPT's `authoring_boundary.md`) without building the forward-authoring *capability* (Opus routes that to the out-of-scope `design-spec` child). Both agree fidelity must not weaken.

---

## 2. Method

Two heterogeneous lineages over the same charter, fresh context per iteration, one mode-focus per pass:
- **opus48-claude2** (Claude Opus 4.8, cli-claude-code, xhigh): 6 iterations, converged (newInfoRatio 1.0 → 0.25; all key questions answered; quality guards passed). Produced the rigorous spine: cross-cutting prerequisites, priority ranking, negative-knowledge table.
- **gpt55fast** (openai/gpt-5.5-fast, cli-opencode, xhigh): 10 iterations, final newInfoRatio 0.03. Produced more granular per-mode assets (motion cards, audit evidence references, foundations adaptation matrix).

Grounding inputs (read-only): `001-corpus-research/research/research.md` (settled taxonomy + per-child corpus map), `001-corpus-research/research/gap-analysis.md` (current-state-validated severity table), the 43-entry `external/` corpus, and the live `sk-design/` tree.

**Inventory baseline (filesystem-confirmed):**

| Mode | references | assets | Maturity |
|---|---|---|---|
| design-interface | 13 | **0** | Vendored Anthropic base; no `corpus_map.md`; draws on none of the taste corpus |
| design-foundations | 5 | **0** | Well-covered static system; real holes in data-viz + adaptation |
| design-motion | 5 | **0** | Well-covered; gesture basics present; missing restraint gate + reusable cards |
| design-audit | 5 | **0** | Densest expansion target; deliverable is a report yet ships no template |
| design-md-generator | 8 (+4 examples) | 2 | Most mature; mostly do-NOT |

---

## 3. Per-Mode Expansion Matrix (primary deliverable)

Effort: **S** ≈ ≤0.5d · **M** ≈ 0.5–1.5d. Severity reflects the gap-analysis, re-validated against live state.

### 3.1 Shared base (cross-cutting prerequisite)

| ID | Type | Title | Why it raises usefulness | Sources | Src | Sev | Effort |
|----|------|-------|--------------------------|---------|-----|-----|--------|
| XC-1 | reference | `shared/register.md` — Brand-vs-Product operating register | The must-add prerequisite (gap 05). Gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity. Absent today. Unblocks the most downstream work. | impeccable; bolder/quieter/distill; colorize:14; animate:14 | **both** | must (05) | M |
| XC-2 | asset | `shared/assets/register_card.md` — one-page Brand/Product routing card | Operationalizes XC-1 with the Brand/Product questions + downstream defaults per mode. | anti_slop_principles; register sources above | gpt | should | S |

**Do-NOT (shared):** a sixth "intake/register" child (register is shared content, not a sub-skill); duplicating N1/N2 independently in interface + audit (author once, reference twice); re-litigating gap severities.

### 3.2 design-interface

Gaps: vendored base draws on none of the taste/craft corpus; zero assets; no mechanical layout pre-flight gate (N2); no mock-content discipline (N1).

| ID | Type | Title | Why | Sources | Src | Sev | Effort |
|----|------|-------|-----|---------|-----|-----|--------|
| IF-A1 | asset | `assets/interface_preflight_card.md` — fill-in mechanical pass/fail card | Converts the prose two-pass into a checkable gate: hero line count, eyebrow/meta-label sweep, gapless bento, real-imagery, button contrast, copy audit, motion motivation, reduced-motion, mobile collapse, AI tells. First asset for the mode. | taste-skill:919; gpt-tasteskill:67; impeccable | **both** | should (N2) | M |
| IF-R1 | reference | `references/design-process/brief_to_dials.md` — Design Read + three dials | Structured intake mapping variance/motion/density dials to layout/motion/density choices, with use-case presets. | taste-skill:43 | **both** | should (08t) | S–M |
| IF-R2 | reference | `references/design-process/mechanical_defaults.md` | The mechanical anti-default checklist the aesthetic calibration omits. **Shared N2 artifact with audit AU-R5 (author once).** | gpt-tasteskill §2–7; redesign; taste §14 | opus | should (09/N2) | M |
| IF-R3 | reference | `references/design-process/copy_and_mock_data.md` | Build-side N1: plausible names/numbers/copy, no lorem, no AI-tell phrasing, one-copy-register, image-seed discipline. Twin of audit AU-R4. | taste-skill:321; redesign; gpt-tasteskill §7 | **both** | should (N1) | S |
| IF-R4 | reference | `references/design-process/visual_asset_strategy.md` | When to require real images vs generated imagery vs Simple Icons/devicon logos, with explicit placeholder slots. | taste-skill:262 | gpt | nice | S |
| IF-R5 | subsection | AIDA + gapless-bento note (under `variation_diversity.md`) | Landing-page-only structure/bento math, explicitly NOT default for product UI. | gpt-tasteskill:22,42 | gpt | nice | S |

**Do-NOT:** more aesthetic preset files as the first expansion (already guarded critique-against-only); gpt-taste Python-RNG randomization as a mandate (redundant with `variation_diversity.md`); GSAP-first / static-forbidden as default behavior (landing-page-only); forward DESIGN.md authoring.

### 3.3 design-foundations

Gaps: no data-viz foundations; no adaptation matrix; no structured intake; zero assets. Gestalt/grid + OKLCH already covered (do-NOT line).

| ID | Type | Title | Why | Sources | Src | Sev | Effort |
|----|------|-------|-----|---------|-----|-----|--------|
| FN-R1 | reference | `references/data_viz.md` — data-visualization foundations | The clearest coverage hole: chart-type selection, axis/encoding, color-for-data (sequential/diverging/categorical), sparklines, table alignment beyond tabular-nums. | colorize:85; designer-skills ui-design; gap 14d | **both** | should (14d) | M |
| FN-R2 | reference | `references/layout/adaptation_matrix.md` | Device/input/context adaptation (mobile/tablet/desktop/print/constrained) as rethinking-for-context, not pixel scaling. | adapt:37 | gpt | should | S–M |
| FN-R3 | reference | `references/intake/design_read_dials.md` — density-dial intake | Foundations owns the density dial of the shared three-dial intake. **Coordinate ownership with interface (see Open Questions).** | taste-skill §0–1 | opus | should (08t) | S |
| FN-R4 | subsection | brand-seed color fold-in to `color/palette_theming.md` | Greenfield path: derive a palette from one brand seed when no system exists (gap N3). Keep small, no standalone file. | impeccable; gap N3 | **both** | nice (N3) | S |
| FN-A1 | asset | `assets/token_starter.md` — fill-in OKLCH ramp + type + spacing scaffold | First foundations asset; wires the static-system refs into a fill-in keyed to `design_token_vocabulary.md`. (GPT's `density_structure_matrix.md` folds in here.) | oklch-skill; layout:61,150 | **both** | nice | M |

**Do-NOT:** another OKLCH/contrast/dark-mode basics guide (already owned); splitting foundations into color/layout children (taxonomy); a heavy new Gestalt/grid reference (covered by `shared/cognitive_laws.md` + `layout_responsive.md`); taste-skill brief→design-system framework map (interface/sk-code concern).

### 3.4 design-motion

Gaps: gesture basics already covered, but the restraint gate is missing; emil advanced-craft not distilled; no reusable pattern/failure cards; zero assets.

| ID | Type | Title | Why | Sources | Src | Sev | Effort |
|----|------|-------|-----|---------|-----|-----|--------|
| MO-R1 | reference | `references/animation_decision_framework.md` — restraint gate | Strongest anti-slop motion lever: 100+/day = never animate, never animate keyboard-initiated actions, tens/day = reduce. Missing today. | emil-design-eng §1–2 | opus | should (08e) | S–M |
| MO-A1 | asset | `assets/motion_pattern_cards.md` — reusable pattern cards | Loading/feedback/state/page-transition/gesture/toast/drag-drop/hover/focus cards with owner + state fields. First motion asset. | interaction-design:10 | gpt | should | S–M |
| MO-A2 | asset | `assets/animate_presence_checklist.md` | Exit wrapper, exit prop, key, symmetry, presence hook, safeToRemove, mode, nested-exit checks. | mastering-animate-presence:21 | gpt | should | S |
| MO-A3 | asset | `assets/motion_performance_failure_card.md` | Failure-mode card: layout thrash, scroll polling, endless rAF, mixed systems, layer promotion, paint-heavy effects, blur. | fixing-motion-performance:52 | gpt | should | S |
| MO-R2 | subsection | advanced-craft + `polish_details` top-up to `micro_interactions.md` | popover transform-origin-from-trigger, `:active` scale(0.97), `scale(0.95)+opacity`, concentric radii, optical alignment, tabular nums. | emil-design-eng; make-interfaces-feel-better:19 | **both** | should (08e) | S |
| MO-R3 | reference | `references/advanced_rendering.md` — propose-first toolkit | View Transitions morph-from-trigger, virtual scroll, GPU/Canvas for data, spring drag-drop — bounded by overdrive's propose-before-building. | overdrive; emil | opus | nice (06) | M |

**Do-NOT:** gesture *basics* (already in `micro_interactions.md` §4); GSAP scroll paradigms as default mandates (admit only inside MO-R3); motion-performance *review* (audit's surface); a default "all interfaces must be motion-rich" rule; emil's "Initial Response" identity framing; a separate `design-interaction` child.

### 3.5 design-audit (densest)

Gaps: no AI-fingerprint/model-tell catalog; no evidence-capture model; no remediation/transform routing; no a11y/hardening quick-fix surface; no report template despite the deliverable being a report.

| ID | Type | Title | Why | Sources | Src | Sev | Effort |
|----|------|-------|-----|---------|-----|-----|--------|
| AU-R1 | reference | `references/ai_fingerprint_tells.md` — model-specific defect catalog | Highest-leverage single addition family-wide: concrete checkable Codex (tracking/ghost-card/over-round/sketchy-SVG/stripes), Gemini (img-hover), 2026-general (cream-bg/eyebrow-every-section/section-fade) tells. Turns "feels AI-made" into P0–P3 findings. | impeccable | opus | should (07) | M |
| AU-A1 | asset | `assets/audit_report_template.md` — fill-in 5-dim `/20` + P0–P3 report | The strongest first-asset case in the family: the audit deliverable IS a report. Findings-first skeleton with score, anti-pattern verdict, owner mapping, evidence caveats. | audit:12; audit_contract | **both** | should | M |
| AU-R2 | reference | `references/transform_remediation.md` — bolder/quieter/distill verbs (register-gated) | Maps directional transform verbs + redesign to findings, owner mode, accepted remediation path. **Depends on XC-1.** Shared with interface. | bolder; quieter; distill; redesign; gap 04/11 | **both** | should (04/11) | S–M |
| AU-R3 | reference | `references/evidence_capture.md` | Evidence model: file/source resolution, browser evidence, deterministic scans, screenshot/overlay notes, fallback labels. | critique:12 | gpt | should | M |
| AU-A2 | asset | `assets/a11y_quick_fixes.md` | Snippet-level fixes: accessible names, keyboard, focus/dialogs, semantics, forms/errors, announcements, contrast, motion. | fixing-accessibility:33 | gpt | should | S |
| AU-R4 | reference | `references/hardening_edge_cases.md` | Production-readiness matrix: extreme inputs, API/network errors, permissions, rate limits, concurrency, i18n/RTL, text expansion, CJK/emoji. | harden:14 | gpt | should | S–M |
| AU-R5 | reference | mock-content review check + mechanical layout gate (folded into `anti_patterns_production.md`) | Review-side N1 + N2 twins of interface IF-R3/IF-R2. Author the gates once, audit references the review view. | redesign; taste §14; impeccable | opus | should (N1/N2) | S |

**Do-NOT:** critique/cognitive-load/Nielsen/hardening/polish duplication (already in `critique_hardening.md`); CWV/a11y/perf duplication (already in `accessibility_performance.md`; do not revert INP→FID); implementing fixes (sk-code's boundary); full two-sub-agent critique orchestration (keep evidence principles only); elevating a11y to a standalone child.

### 3.6 design-md-generator (leanest — expansion mostly not effective)

Gaps: essentially none. The only skew: all 4 worked examples are SaaS-minimalist. The one genuine in-scope reference is the authoring boundary (the divergence, reconciled).

| ID | Type | Title | Why | Sources | Src | Sev | Effort |
|----|------|-------|-----|---------|-----|-----|--------|
| MD-R1 | reference | `references/authoring_boundary.md` — measured vs brief-authored vs inferred | Clarifies the fidelity boundary + source-of-truth labels WITHOUT building forward-authoring. Protects the cardinal fidelity rule against the design-spec pull. | md SKILL cardinal rule:248; stitch-skill:17 (boundary only) | gpt | should | S–M |
| MD-A1 | asset | `assets/source_of_truth_router_card.md` | Quick card: measured tokens / brief-provided / inferred / missing-backing? Prevents fabricated values. | design_md_format cardinal rules:27 | gpt | nice | S |
| MD-A2 | asset (example) | 5th DESIGN.md exemplar in a non-SaaS aesthetic (editorial / e-commerce / maximalist) | All 4 exemplars are SaaS-minimalist; one distinct aesthetic broadens format coverage. Requires a real extraction run, so only nice-to-have. | v3 format + fresh extraction | **both** | nice | S–M |

**Do-NOT (dominant verdict):** forward DESIGN.md/PRODUCT.md *authoring capability* (stitch, gap 10 — different input contract; routes to the net-new `design-spec` child; out of scope for 009); a second extraction backend/crawler (pipeline already extracts/writes/validates/reports); duplicate format/taxonomy references; inventing values or weakening `tokens.json` fidelity.

---

## 4. Family-Wide Priority Ranking

Should-adds by leverage (corpus strength × coverage hole × checkability × cross-lineage agreement):

1. **XC-1 `shared/register.md`** (must) — both lineages' #1; gates the most downstream work.
2. **IF-A1 + AU-A1 first assets** (both) — the two highest-ROI fill-in cards (preflight + audit report).
3. **AU-R1 model-tell catalog** (opus) — most concrete, highest checkable value, no current analog.
4. **N1/N2 author-once gates** (IF-R2 + IF-R3 + AU-R5, both) — convert the most common LLM defects into checkable gates.
5. **AU-R2 transform/remediation verbs** (both, register-dependent) + **AU-R3 evidence-capture** (gpt).
6. **FN-R1 data-viz** (both) + **FN-R2 adaptation matrix** (gpt) — the two real foundations holes.
7. **MO-R1 restraint gate** (opus) + the three motion asset cards MO-A1/A2/A3 (gpt).
8. **MD-R1 authoring-boundary** (gpt) — low effort, protects fidelity.

Nice-to-haves (IF-R4/R5, FN-R4/A1, MO-R2/R3, AU-R5 enrich, MD-A1/A2) rank below.

---

## 5. Recommended Implementation Sequence (gated follow-up)

1. **XC-1 `shared/register.md` + XC-2 card first** — unblocks AU-R1/R2 + IF-R1/R2.
2. **Interface + audit first-assets** (IF-A1, AU-A1) — highest operator leverage; converts the taste corpus into repeatable checks.
3. **Author N1 + N2 once** (interface owns, audit references) — prevents drift.
4. **Audit cluster** (AU-R1, AU-R2, AU-R3, AU-A2) — densest payoff, most concrete corpus.
5. **Foundations holes** (FN-R1 data-viz, FN-R2 adaptation) — without duplicating basics.
6. **Motion cards** (MO-R1 gate + MO-A1/A2/A3) — package known rules into reusable cards.
7. **md-generator authoring-boundary** (MD-R1) — adds the boundary while protecting cardinal fidelity. Treat md-generator as otherwise done.

---

## 6. Eliminated Alternatives (negative knowledge)

| Approach | Reason eliminated | Src |
|---|---|---|
| Bulk-import the external corpus | Leverage is operational refs + cards, not volume; both lineages reject it | both |
| gpt-taste Python-RNG "true randomization" as an interface mandate | Redundant with `variation_diversity.md`; contradicts grounding-first | opus |
| Aesthetic presets as a chooser in interface | Already guarded critique-against-only; must not become pick-a-vibe | both |
| Splitting foundations into color/layout children | Taxonomy, decided | both |
| Heavy new Gestalt/grid reference | Already covered by `shared/cognitive_laws.md` + `layout_responsive.md` | opus |
| Adding gesture basics to motion | Already in `micro_interactions.md` §4 | opus |
| Folding motion-performance *review* into motion | Owned by audit; build-vs-review boundary is correct | both |
| Overdrive/advanced rendering as core motion behavior | Nice-to-have only; propose-first, not default | both |
| Duplicating critique/CWV/a11y in new audit references | Already deep in `critique_hardening.md` + `accessibility_performance.md` | both |
| Implementing fixes inside audit | Audit reports/scores; implementation is sk-code | both |
| Forward DESIGN.md authoring *capability* in md-generator | Different input contract; routes to net-new `design-spec`; out of scope (boundary doc IS in scope) | both |
| A second extraction backend in md-generator | Pipeline already extracts/writes/validates/reports | gpt |
| `designer-skills-main` full process lifecycle, slides/canvas/poster, output-skill | Out-of-family / scope rulings in gap-analysis | gpt |
| A sixth intake/register child | Register is shared content, not a sub-skill | opus |

---

## 7. Open Questions / Divergences

1. **md-generator forward-authoring (the one real divergence).** Opus routes forward-authoring fully out of scope (to a net-new `design-spec` child); GPT proposes an `authoring_boundary.md` reference + source-of-truth router. **Reconciliation:** the boundary *documentation* (labels for measured / brief-provided / inferred / absent) is in-scope and low-risk; the forward-authoring *capability* stays out of scope. Both agree fidelity must not weaken.
2. **Three-dials ownership.** `VISUAL_DENSITY`→foundations, `DESIGN_VARIANCE`→interface, `MOTION_INTENSITY`→motion. gap-analysis routes the intake to foundations; an interface/shared home may fit better. Decide at build time (affects IF-R1 vs FN-R3).
3. **N1/N2 owning home.** `shared/` vs interface-owned-with-audit-reference. Either preserves "author once"; pick at build time.
4. **Effort estimates are coarse (S/M).** Calibrate against actual authoring + validation in the follow-up.
5. **Pre-existing defect to fix alongside:** `design-audit/SKILL.md §8` cites `changelog/v1.0.0.1.md`, which the v1.0.0.0 pre-release collapse removed. Repoint to `v1.0.0.0.md`.

---

<!-- ANCHOR:references -->
## 8. References

### This run (lineage artifacts)
- `research/lineages/opus48-claude2/research.md` + `iterations/iteration-00{1..6}.md` (converged)
- `research/lineages/gpt55fast/research.md` + `iterations/iteration-0{01..10}.md`
- `research/deep-research-findings-registry.json` (merged, 18 key findings) + `research/fanout-attribution.md`

### Grounding inputs (read-only)
- `001-corpus-research/research/research.md` (settled taxonomy + per-child corpus map)
- `001-corpus-research/research/gap-analysis.md` (current-state-validated severity table)
- `154-sk-design-parent/009-reference-asset-expansion/spec.md`

### Corpus sources cited (subset of the 43-entry external/)
- Interface/craft: `gpt-tasteskill`, `taste-skill`, `redesign-skill`, `bencium-innovative-ux-designer`, `design-lab`
- Foundations: `oklch-skill`, `layout`, `baseline`, `adapt`, `colorize`, `designer-skills-main` (ui-design data-viz)
- Motion: `emil-design-eng`, `overdrive`, `animate`, `interaction-design`, `mastering-animate-presence`, `fixing-motion-performance`, `make-interfaces-feel-better`
- Audit/transform: `impeccable`, `redesign-skill`, `bolder`, `quieter`, `distill`, `audit`, `critique`, `polish`, `harden`, `fixing-accessibility`
- Spec/authoring: `stitch-skill` (boundary only; forward-authoring routed out of scope)
<!-- /ANCHOR:references -->
