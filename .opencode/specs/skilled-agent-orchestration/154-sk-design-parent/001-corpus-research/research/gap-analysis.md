# Corpus Gap Analysis — content the sk-design family does not yet cover

> **Packet:** `154-sk-design-parent/001-corpus-research` · **Companion to** `research.md` (this folder's *architecture* synthesis). Different question.
> **Question:** Of the external design-skills corpus, what techniques / topics are MISSING or under-covered in the converted `sk-design` family (`design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`), and what should be added?
> **Status:** **CURRENT-STATE VALIDATED.** Severities are validated against the post-conversion `design-<mode>` family. **ADD decisions are GATED** — nothing here is implemented.
> **Provenance:** a 2-model fan-out produced a 16-gap baseline (recovered from a completed run's logs after an in-sandbox write-block); that baseline was then **re-validated by a current-state Opus-4.8 pass** against the converted family — it read all 5 packet SKILL.md + `shared/` + the corpus, confirmed 15/16, marked 0 now-covered, revised 5 severities/framings, reclassified 2 as scope rulings, and added 3 new gaps (N1–N3). The full per-gap prose lives in `scratchpad/gap-research/run2/opus.log`.

## Verdict

Baseline substantially correct: **15 confirmed, 0 now-covered, 5 revised, +3 new (N1–N3).** Two baseline items (13 process-lifecycle, 02 canvas) are **scope rulings**, not content gaps.

## Validated severity summary

| # | Gap | Source file(s) | Home | Severity (validated) |
|---|-----|----------------|------|----------------------|
| 05 | Brand-vs-Product **operating** register | impeccable, bolder, quieter | `shared/register.md` (new) | **must-add** ⬆ (was should) |
| 04 | Transform verbs (bolder/quieter/distill) | impeccable, bolder, quieter, distill | audit/interface **mode** (not new child) | should-add |
| 07 | Model-specific defect tells (Codex/Gemini) | impeccable | `shared/anti_slop` or audit | should-add |
| 08e | emil advanced interaction/gesture craft | emil-design-eng | `design-motion` | should-add |
| 09 | gpt-taste (AIDA, 2-line hero, gapless bento) | gpt-tasteskill | interface/foundations/motion | should-add |
| 10 | Forward DESIGN.md/PRODUCT.md authoring | stitch-skill, impeccable | **new `design-spec`** | should-add |
| 11 | Redesign/remediation playbook | redesign-skill, taste §11 | audit `remediate` **mode** | should-add |
| 15 | interaction-design breadth (forms/state/nav) | designer-skills interaction-design (16) | **new `design-interaction`** | should-add |
| 14d | data-visualization | designer-skills ui-design/data-viz | `design-foundations` | should-add |
| 08t | taste three-dials brief→config | taste-skill §1 | foundations/intake ref | should-add |
| N1 | Realistic mock-content / anti-AI-copy | redesign, gpt-taste, impeccable | audit + interface | **should-add (new)** |
| N2 | Mechanical layout pre-flight gate | taste §14, gpt-taste §8, impeccable, redesign | audit + interface | **should-add (new)** |
| 01 | Presentation / slide design | frontend-slides, slidev | new `design-slides` | should-add ⬇ + **scope ruling** |
| 13 | Whole design PROCESS lifecycle | designer-skills-main (41 skills) | **scope ruling** (boundary note) | should-add (note only) ⬇ |
| 06 | Advanced rendering / overdrive motion | overdrive, gpt-taste, emil | motion advanced ref | nice-to-have |
| 12 | design-lab variation+feedback loop | design-lab | interface real_ui_loop | nice-to-have |
| 16 | visual-critique 7-lens | designer-skills visual-critique | audit critique_hardening | nice-to-have |
| 14g | Gestalt/grid depth top-up | designer-skills ui-design | foundations | nice-to-have |
| 08b | bencium taste depth | bencium | interface/foundations | nice-to-have |
| N3 | Greenfield brand-seed color | impeccable | foundations (fold-in) | nice-to-have (new) |
| 03 | Anti-truncation full-output | output-skill | **sk-code** (out-of-family) | nice-to-have |
| 02 | Canvas/poster art | canvas-design | **out-of-scope** | nice-to-have |

## Key revisions vs baseline

- **05 register ⬆ should→must (highest leverage)** — dependency of 04/07/11/N1/N2. Reframed: it's *not* "0 hits" — a **color**-register exists in foundations; the impeccable **operating** register (Brand = design IS the product vs Product = design SERVES the product, gating motion budget / density / anti-slop bar) is the missing switch.
- **01 slides ⬇ must→should + scope ruling**; **02 canvas ⬇ → out-of-scope**; **03 output → out-of-family** (sk-code owns it).
- **08 SPLIT**: emil→motion (strong should-add), taste three-dials→config ref (should-add), bencium→nice. **14 SPLIT**: data-viz should-add, Gestalt/grid nice (already largely covered by `cognitive_laws.md` + `layout_responsive.md`).
- **13 process-lifecycle → SCOPE RULING** — recommend declaring out-of-scope + a boundary sentence in the parent `sk-design/SKILL.md` (the family is build-time craft; research/strategy/test/ops is a different discipline).
- **NEW**: N1 mock-content/anti-AI-copy discipline · N2 mechanical layout pre-flight gate · N3 greenfield brand-seed color.

## Recommended sequencing

1. **must-add first:** 05 register (`shared/register.md`) — it gates 04/07/11/N1/N2.
2. **Two scope rulings before building:** 13 (process → recommend out-of-scope + boundary note) and 01 (slides → in or out). These decide whether two large corpus blocks generate any work.
3. **should-adds by home:** `design-audit` gains the most (07, 11, 16, N1, N2); `design-motion` gains 08e/06; two candidate **new children** — `design-interaction` (15) + `design-spec` (10); `design-foundations` gains 14d + N3.

## New-children verdict

Fold where possible; reserve NEW children for genuinely-unowned surfaces. **New:** `design-spec` (10, forward-authoring) + `design-interaction` (15, forms/state/nav). **Fold as modes** (not new children): 04 transforms + 11 remediate into existing audit/interface. `design-slides` (01) only if the scope ruling puts presentation in-family. All new-child names use the `design-` prefix.

## Gate

Findings, not commitments. Each ADD is a scope decision — approve before implementation.
