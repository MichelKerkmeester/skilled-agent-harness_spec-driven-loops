# Iteration 005 — Consolidated merge recommendation + concrete steps + cross-check framing (Q5)

**Lineage:** opus48 (claude-opus-4-8 xhigh) · **Iteration:** 5 of 5 · **Status:** complete · **newInfoRatio:** 0.35

## Focus

Consolidate the merge recommendation, attach one concrete first integration step per ADOPT/ADAPT class (R-success criteria), and frame the cross-lineage cross-check (Q5).

## Actions Taken

1. Synthesized findings F1–F17 across iterations 1–4 into a single per-asset-class verdict + integration + step table.
2. Identified where this lineage is high-confidence vs where the gpt55fast lineage is most likely to diverge, for the merge-stage reconciliation.

## Findings

**F18 — The merge is worth doing, but its value is asymmetric and its framing is the whole game.** The high-confidence win is the **objective quality-floor layer** (UX/chart/mobile-a11y rules) — it fills a real gap (`design_principles.md` compresses this to one sentence) with zero philosophical conflict. The recommendation/aesthetic data is worth adopting only when **reframed as an inventory to critique against** (F5); adopted naively it would actively damage the skill's distinctive-design purpose. The packaging (CLI, marketplace, platform configs, sibling skills, the published SKILL.md) is all SKIP.

### Consolidated Merge Recommendation (per asset class)

| Asset class | Verdict | Integration | Concrete first step |
|---|---|---|---|
| `ux-guidelines.csv` (98) | **ADOPT** | `assets/data/` + distilled `references/ux_quality_reference.md` | Copy CSV; generate a curated quality-floor checklist reference from the CRITICAL/HIGH-severity rows. |
| `charts.csv` (25) | **ADOPT** | `assets/data/` (queryable) | Copy CSV; add a "charts & data viz" routing line in SKILL.md. |
| `app-interface.csv` (29) + `react-performance.csv` (44) | **ADOPT (a11y/perf only)** | `assets/data/` | Copy CSVs; keep them as quality-floor data, not stack guidance. |
| `colors.csv` (160) | **ADAPT** | `assets/data/` + token-structure note in `references/design_inventory.md` | Adopt the shadcn-style semantic-token schema + WCAG-pair discipline; frame palettes as "common starts to deviate from." |
| `typography.csv` (73) | **ADAPT** | `assets/data/` (query) | Copy CSV; reference as a pairings inventory, not a chooser. |
| `styles.csv` (84) | **ADAPT** | `assets/data/` (query) | Copy CSV; cross-link to `design_principles.md` §4 default-avoidance. |
| `ui-reasoning.csv` (161), `products.csv` (161), `landing.csv` (33) | **ADAPT (cautious)** | `assets/data/` (query) + explicit "critique-against, not use-this" framing | Copy CSVs; in `design_inventory.md` state they list *expected* patterns to deviate from. |
| `icons.csv` (104) | **ADAPT (minor)** | `assets/data/` | Copy CSV; optional. |
| `core.py` + `search.py` | **ADAPT** | `scripts/design_search_core.py` + `scripts/design_search.py` | Rename, re-root `DATA_DIR`→`assets/data`, trim `CSV_CONFIG` to adopted domains, drop stack config, add MIT provenance header. |
| `design_system.py` (1148) | **SKIP** (revisit trimmed) | — | None; revisit only if a "show the cliché for X" helper is later needed, stripped of persist machinery. |
| `stacks/*.csv` (16) | **SKIP** | — (belongs to `sk-code`) | None. |
| `google-fonts.csv` (1922) | **SKIP from inline** | reference/query only if ever | None. |
| Published SKILL.md + Quick Reference | **SKIP as file** (reuse data) | — | None; the data behind it is adopted via the CSVs. |
| `templates/platforms/*.json` (18), `cli/`, `.claude-plugin/`, 6 sibling sub-skills, `docs/`, `design.csv`/`draft.csv` | **SKIP** | — | None. |

### Licensing (final)
Mixed-license skill: ship `LICENSE-ui-ux-pro-max.txt` (verbatim MIT) + `THIRD-PARTY-NOTICES.md` (MIT files vs Apache-2.0 files), per-file provenance headers on adapted scripts, update `license:` and `metadata.source` frontmatter. No relicensing; no copyleft. (F14–F17)

### SKILL.md discipline (final)
Add one compact routing section (~15-25 lines) pointing to `references/ux_quality_reference.md`, `references/design_inventory.md`, and the search script; keep SKILL.md under ~250 lines; note the Python3 prerequisite. (F10, F11)

**F19 — Cross-lineage cross-check framing (for the merge stage).**
- *High-confidence in this lineage (expect agreement):* quality-floor data = ADOPT; CLI/marketplace/platform/sibling-skills = SKIP; MIT⊕Apache-2.0 is clean; published SKILL.md not liftable; `assets/data/` over a new `data/` dir.
- *Likely divergence with gpt55fast (flag for reconciliation):* (1) how aggressively to adopt `ui-reasoning.csv`/`products.csv` (this lineage is cautious/inventory-only; a more literal lineage may recommend adopting the recommender outright — the philosophy tension is the crux to reconcile); (2) whether to keep any of `design_system.py` (this lineage SKIPs; another may keep a trimmed helper); (3) whether the quality-floor rules should be distilled into a curated `references/` doc (this lineage) vs shipped only as raw CSV queried by script (a leaner lineage). These three are the predicted disagreement points the merge synthesis should resolve.

## Questions Answered

- **Q5:** Negative knowledge consolidated (iter 4 table) and one concrete first step attached per ADOPT/ADAPT class; cross-lineage cross-check framed. (F18, F19)
- **Q1 (final):** Per-asset-class ADOPT/ADAPT/SKIP table complete.

## Questions Remaining

- None within this lineage's scope. (Cross-lineage reconciliation is the merge stage's job, not this lineage's.)

## Dead Ends / Ruled Out

- (No new ruled-out directions; consolidated table in iter 4 stands.)

## Next Focus

Convergence: all 5 key questions answered; newInfoRatio trend 1.0 → 0.7 → 0.6 → 0.5 → 0.35 (descending toward threshold) and maxIterations (5) reached. Exit to synthesis.
