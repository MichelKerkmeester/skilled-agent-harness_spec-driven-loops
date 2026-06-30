# Iteration 4: design-audit expansion matrix

## Focus
`design-audit` is the densest expansion target. Ground its additions in the corpus: model-specific defect tells (07), remediation playbook (11), mock-content (N1), mechanical layout pre-flight gate (N2), visual-critique 7-lens (16), and transform verbs (04). Produce its matrix entry.

## Findings

### F4.1 — Audit has no AI-fingerprint / model-tell catalog; impeccable supplies a concrete one [confirmed; highest audit leverage]
`audit`'s current references cover the `/20`+P0–P3 contract, critique/cognitive-load/heuristics/persona/hardening/polish, CWV/a11y/perf, and clarify/pseudo-elements [SOURCE: design-audit/references/corpus_map.md:19-29]. None of them is a *model-specific defect catalog*. `impeccable` carries an unusually concrete one: **Codex tells** — display tracking too tight (-0.05 to -0.085em), ghost-card (`border:1px` + `box-shadow ≥16px`), over-rounding (32px+ radius), hand-drawn sketchy SVG (`feTurbulence`/`doodle`), `repeating-linear-gradient` stripes, meta-criticism copy; **Gemini tell** — hard ban on animating `<img>` on hover (incl. Tailwind `group-hover:scale` on images); **2026 general tells** — cream/sand/beige body bg (OKLCH L 0.84–0.97, C<0.06, hue 40–100; token names `--paper`/`--cream`/etc.), tiny uppercase tracked eyebrow on every section, uniform section-fade motion reflex [SOURCE: external/impeccable.md:42-44,69-70,78,96,100-108]. This is gap 07 (should-add) and the single highest-leverage audit addition — checkable, evidence-bearing, distinct from existing references.

### F4.2 — redesign-skill is a ready-made remediation playbook (11) carrying mock-content (N1) [confirmed]
`redesign-skill` is a Scan → Diagnose → Fix remediation sequence with an exhaustive generic-AI-pattern checklist by category (Typography, Color & Surfaces, Layout, Interactivity & States) — e.g. three-equal-card row, `100vh`→`min-height:100dvh`, AI-purple gradient, pure `#000`, equal-card-height, button bottom-alignment [SOURCE: external/redesign-skill.md:8-70]. It also carries the **mock-content / picsum-seed discipline** (placeholder image sourcing + "empty flat sections" remedy) which is the review-side of gap N1 [SOURCE: external/redesign-skill.md:43]. `critique_hardening.md` has a polish workflow but not this remediation *sequence* + AI-pattern checklist.

### F4.3 — Transform verbs (04) are register-gated directional operations [confirmed]
`bolder` (increase impact/personality), `quieter` (tone down without going generic), `distill` (strip to essence) are directional *transform* operations that each open with a "Register" section [SOURCE: external/bolder.md:1-12], [SOURCE: external/quieter.md:1-9], [SOURCE: external/distill.md:1-9]. gap-analysis routes 04 to "audit/interface mode (not new child)" and flags it as a dependent of the register prerequisite (05) [SOURCE: gap-analysis.md:18,41]. Audit gains a transform-verbs reference; interface shares it.

### F4.4 — Mechanical layout pre-flight gate (N2) is the review-side twin of the interface addition [confirmed]
Gap N2 (taste §14, gpt-taste §8, impeccable, redesign Layout) is a checkable pre-flight gate: hero line count, bento density, meta-label sweep, button contrast, equal-3-card detection, optical alignment [SOURCE: gap-analysis.md:27]. It appears in both audit (review) and interface (build) — a shared artifact, authored once and referenced by both.

### F4.5 — Audit's deliverable IS a report/score, yet it ships zero assets [inferred; strong]
`audit_contract.md` describes the 5-dimension `/20` + P0–P3 + findings schema in prose, but audit has **0 assets**. The audit output is a findings report — the mode most clearly benefiting from a fill-in artifact. A report template is a high-value first asset.

### F4.6 — visual-critique 7-lens (16) is a nice-to-have top-up [confirmed]
designer-skills `visual-critique` 7-lens folds into `critique_hardening.md`; nice-to-have [SOURCE: gap-analysis.md:32].

## Prioritized Additions (design-audit)

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|----|------|-------|--------------------------|----------------|--------|
| AU-R1 | reference | `references/ai_fingerprint_tells.md` — model-specific defect catalog | The highest-leverage audit addition: concrete, checkable Codex/Gemini/2026-general tells that the current references don't catalog. Turns "feels AI-made" into evidence-bearing P0–P3 findings. | impeccable (codex/gemini/general tells) | M |
| AU-R2 | reference | `references/remediation_playbook.md` — Scan→Diagnose→Fix remediation sequence | A structured remediation flow + generic-AI-pattern checklist for redesign/upgrade tasks; complements polish without duplicating it. | redesign-skill; taste §11 | M |
| AU-R3 | reference | `references/transform_verbs.md` — bolder / quieter / distill (register-gated) | Adds directional transform operations for "make it bolder/quieter/simpler" review-and-fix requests. **Depends on the register prerequisite (05).** Shared with interface. | bolder; quieter; distill; impeccable | S–M |
| AU-R4 | reference | mock-content / anti-AI-copy REVIEW check (fold into `anti_patterns_production.md`) | Review-side twin of interface IF-R2: flags lorem, AI-tell copy, implausible placeholder data, missing image-seed discipline. | redesign-skill; gpt-taste §7; impeccable | S |
| AU-R5 | reference | mechanical layout pre-flight gate (shared artifact with interface) | Checkable gate: hero line count, bento density, meta-label sweep, button contrast, equal-3-card, optical alignment. Author once; audit references the review view. | taste §14; gpt-taste §8; impeccable; redesign Layout | S–M |
| AU-A1 | asset | `assets/audit_report_template.md` — fill-in 5-dim `/20` + P0–P3 findings report | Operationalizes `audit_contract.md`; the audit deliverable is a report, so this is the highest-value first asset for the mode. | audit.md; audit_contract.md | M |
| AU-R6 | reference | visual-critique 7-lens top-up to `critique_hardening.md` | Marginal lens enrichment; nice-to-have. | designer-skills visual-critique | S |

## Do-NOT-add (design-audit)
- **Critique / cognitive-load / Nielsen heuristics / personas / hardening / polish** — already deep in `critique_hardening.md` [SOURCE: design-audit/references/critique_hardening.md:18-89].
- **CWV / a11y / performance** — already in `accessibility_performance.md`; do NOT revert INP→FID [SOURCE: design-audit/references/corpus_map.md:33].
- **Implementing fixes** — audit reports and scores; implementation is `sk-code` after the user accepts (boundary).
- **Elevating a11y to a standalone `design-a11y` child** — mimo's single-lineage stance; taxonomy is decided, out of scope.

## Sources Consulted
- `.opencode/skills/sk-design/design-audit/references/{corpus_map,critique_hardening}.md` (iter 1 + this)
- `external/redesign-skill.md` (lines 1–70), `external/impeccable.md` (model-tell grep), `external/{bolder,quieter,distill}.md` (heads)
- `gap-analysis.md` rows 07, 11, 04, N1, N2, 16

## Assessment
- **newInfoRatio: 0.7** — Audit is the densest target; the impeccable model-tell catalog (AU-R1) and the redesign remediation sequence (AU-R2) are genuinely new, concrete, high-value content, and the audit-report asset is a strong first-asset case. Some additions (N1, N2) are shared twins of interface findings, capping novelty.
- **Novelty justification:** Establishes AU-R1 (model-tells) as the highest-leverage single addition across the whole family and identifies the first shared artifacts (N1 mock-content, N2 layout gate) authored once and referenced by two modes.
- **Confidence:** High on AU-R1/R2/A1 (corpus read directly); Medium on effort.

## Reflection
- **Worked:** Grepping impeccable for model names surfaced the precise, checkable tell catalog; reading redesign top-to-bottom confirmed it is a turnkey remediation source.
- **Ruled out:** duplicating existing critique/CWV/a11y content; implementing fixes; a11y-as-child.
- **Failed:** nothing.

## Recommended Next Focus
Iteration 5: `design-md-generator` — test whether it is mature enough that expansion is mostly do-NOT-add, or whether real reference/asset gaps exist (and whether gap-10 forward-authoring belongs here or is out of scope).
