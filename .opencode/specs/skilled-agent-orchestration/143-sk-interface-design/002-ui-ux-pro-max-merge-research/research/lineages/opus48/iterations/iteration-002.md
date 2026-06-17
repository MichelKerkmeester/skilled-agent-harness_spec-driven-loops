# Iteration 002 — Data-asset value + reconciling the recommender with the anti-default philosophy

**Lineage:** opus48 (claude-opus-4-8 xhigh) · **Iteration:** 2 of 5 · **Status:** complete · **newInfoRatio:** 0.7

## Focus

Assess the data assets on quality and format, and resolve the central tension (Q4): a data-driven "best-match" recommender vs. the house skill's "avoid templated defaults, make distinctive choices" stance. Decide *adopt-as-what* per data class.

## Actions Taken

1. Sampled `ux-guidelines.csv` rows — confirmed schema `Category, Issue, Platform, Description, Do, Don't, Code Good, Code Bad, Severity`. [SOURCE: file:external/.../data/ux-guidelines.csv:2-4]
2. Sampled `ui-reasoning.csv` decision-rule rows — confirmed a JSON micro-format `{"if_checkout":"emphasize-trust","if_hero_needed":"use-3d-hyperrealism"}`. [SOURCE: file:external/.../data/ui-reasoning.csv:5]
3. Sampled `colors.csv` — full shadcn-style semantic token rows with WCAG annotations (e.g. "Accent adjusted from #F97316 for WCAG 3:1"). [SOURCE: file:external/.../data/colors.csv:2]
4. Checked `sk-code` reference surfaces for overlap. [SOURCE: file:.opencode/skills/sk-code/references/ (motion_dev, webflow, opencode, stack_detection.md) + universal/]

## Findings

**F4 — Two distinct value classes hide inside "the data," and they reconcile with the house philosophy very differently.**

- **(a) Objective quality-floor / correctness rules** — `ux-guidelines.csv` (98), `charts.csv` (25), `app-interface.csv` (29 mobile a11y), `react-performance.csv` (44). These encode WCAG/Apple-HIG/Material-cited Do/Don't with code examples and severity. They are *orthogonal* to aesthetics: they do not push a look, they enforce correctness (contrast ≥4.5:1, touch ≥44pt, reduced-motion, CLS, legend/empty-states for charts). The house skill currently compresses this entire domain into one sentence ("responsive, visible focus, reduced motion respected"). **This is the cleanest, highest-value ADOPT** — it materially deepens the quality floor without any philosophical conflict. [SOURCE: file:external/.../data/ux-guidelines.csv:2-4]

- **(b) Best-match recommendation data** — `ui-reasoning.csv` (161), `products.csv` (161), `landing.csv` (33), and to a lesser degree `colors.csv`/`styles.csv`/`typography.csv`. `ui-reasoning.csv` is literally a templating engine: per product type it emits a recommended pattern + style priority + a decision-rule JSON. "E-commerce Luxury → Liquid Glass + Glassmorphism" is exactly the kind of templated default the house skill exists to resist. [SOURCE: file:external/.../data/ui-reasoning.csv:5] [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:59]

**F5 — The reconciliation (Q4 answer): invert the data's role from "answer" to "inventory + constraint."** The house skill's process is brainstorm → *critique against the AI-default looks* → revise. The recommendation data is most valuable precisely as **the catalog of common/expected answers the designer critiques against** — i.e. "for a luxury e-commerce brief, the cliché is glassmorphism + premium-minimal; therefore deviate deliberately." Adopted this way, the recommender *strengthens* the anti-default step instead of undermining it. The failure mode to avoid is wiring the recommender as an authoritative "use this" generator (the published skill's `--design-system` default), which would manufacture the exact defaults `design_principles.md` §4 names. [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:59,63]

**F6 — `colors.csv` carries reusable *structure* independent of the specific palettes.** Every row is a complete shadcn-style semantic token set (Primary/On-Primary/Secondary/Accent/Background/Foreground/Card/Muted/Border/Destructive/Ring) with foreground pairings and WCAG-contrast notes. The *token architecture and the contrast discipline* are objective and adoptable; the *specific per-product palettes* are the part to frame as "common starting points to react against." ADAPT cleanly splits along this seam. [SOURCE: file:external/.../data/colors.csv:2]

**F7 — Stack CSVs overlap `sk-code` and should NOT land in `sk-interface-design`.** `stacks/react.csv` is implementation guidance (`useState` Do/Don't, Docs URL). `sk-code` already owns stack detection (`references/stack_detection.md`), per-surface references, and implementation verification. Importing 16 stack CSVs into the *design* skill would duplicate and cross-cut `sk-code`'s ownership and contradict the house boundary "this skill owns the look, sk-code owns the build." **SKIP for this skill** (if wanted at all, they belong under `sk-code`). [SOURCE: file:external/.../data/stacks/react.csv:2] [SOURCE: file:.opencode/skills/sk-code/references/stack_detection.md] [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:170-178]

**F8 — `google-fonts.csv` (1922 rows) is too large to inline and is a lookup index, not design judgment.** Adopt only by reference/query if at all; not a SKILL.md or `references/` candidate. `icons.csv` (104) is small and objectively useful (library + import code) — minor ADAPT.

## Questions Answered

- **Q4:** Reconciled — adopt objective quality-floor data outright; adopt recommendation data only reframed as an *inventory to critique against*, never as an authoritative generator. (F4, F5, F6)
- **Q1 (refined):** Data classes split into ADOPT (quality-floor rules + charts), ADAPT (color-token structure, type pairings, styles, recommendation data as inventory), SKIP (stacks → sk-code; google-fonts inline; design.csv/draft.csv).

## Questions Remaining

- Q2 (integration design — directory placement, routing, SKILL.md budget, scripts/Python prereq), Q3 (licensing), Q5 (negative knowledge + steps).

## Dead Ends / Ruled Out

- **Wiring `design_system.py --design-system` as the house skill's default flow** — ruled out: it auto-emits a complete "use this" design system, manufacturing the templated defaults `design_principles.md` §4 explicitly resists. [SOURCE: file:external/.../data/ui-reasoning.csv:5]
- **Importing the 16 `stacks/*.csv` into sk-interface-design** — ruled out: overlaps and cross-cuts `sk-code`'s ownership of implementation/stack guidance. [SOURCE: file:.opencode/skills/sk-code/references/stack_detection.md]
- **Inlining `google-fonts.csv`** — ruled out: 1922-row lookup index, not design judgment; reference/query only.

## Next Focus

Iteration 3: Concrete integration design (Q2) — where each ADOPT/ADAPT asset lands in the house structure (`data/` vs `references/` vs `scripts/`), the `core.py`/`search.py` adaptation + Python3 prerequisite, advisor-routing edges, and the SKILL.md word-budget discipline.
