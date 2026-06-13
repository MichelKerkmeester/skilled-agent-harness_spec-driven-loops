---
title: "Research Synthesis — ui-ux-pro-max → sk-interface-design merge (opus48 lineage)"
description: "Merge recommendation for the vendored MIT ui-ux-pro-max-skill-main repo into the Apache-2.0 house sk-interface-design skill: per-asset ADOPT/ADAPT/SKIP, integration design, licensing path, and negative knowledge. claude-opus-4-8 fan-out lineage."
trigger_phrases:
  - "ui-ux-pro-max merge synthesis"
  - "sk-interface-design merge recommendation"
importance_tier: important
contextType: implementation
---

# Research Synthesis — ui-ux-pro-max → sk-interface-design merge (opus48 lineage)

**Lineage:** opus48 (cli-claude-code / claude-opus-4-8 xhigh) · **Session:** fanout-opus48-1781367602693-9nehlm
**Iterations:** 5/5 (converged at maxIterations) · **Stop reason:** max_iterations · **Questions answered:** 5/5
**Scope:** Research-only. Produces a recommendation; no edits to `sk-interface-design`.

> This is one of two parallel by-model lineages (`opus48`, `gpt55fast`). The merge stage reconciles both. §13 frames where this lineage expects agreement vs divergence.

---

## 1. Summary

The vendored `ui-ux-pro-max-skill-main` (MIT, NextLevelBuilder, v2.5.0) is worth merging into the house `sk-interface-design` skill (Apache-2.0, vendored Anthropic frontend-design) **asymmetrically and with careful framing**. Its value is concentrated in two layers that integrate very differently:

1. **A high-confidence win — the objective quality-floor data** (`ux-guidelines.csv`, `charts.csv`, `app-interface.csv`, `react-performance.csv`). These are WCAG/Apple-HIG/Material-cited Do/Don't rules with code examples and severity. The house skill currently compresses this entire domain into one sentence ("responsive, visible focus, reduced motion respected"). Adopting them fills a real gap with **zero philosophical conflict**.

2. **A conditional win — the aesthetic/recommendation data** (`colors`, `typography`, `styles`, `ui-reasoning`, `products`, `landing`). Valuable, but only when **reframed as an inventory of common/expected patterns to critique against**, never as an authoritative "use this" generator. Adopted naively (the upstream `--design-system` default) it would manufacture exactly the templated AI-default looks the house skill exists to resist.

Everything else — `design_system.py` (1148 L), the 16 stack CSVs (sk-code's territory), `google-fonts.csv` (1922-row index), the published ~660 L React-Native-specialized SKILL.md, and all distribution packaging (CLI, marketplace, 18 platform configs, 6 sibling sub-skills) — is **SKIP**. Licensing is clean: MIT combines into Apache-2.0 as a mixed-license skill with notice retention only.

---

## 2. Scope & Method

5-iteration single-lineage deep-research loop over local source only (no web). Each iteration took one focus, externalized findings to `iterations/iteration-NNN.md`, appended a JSONL record + delta. Foci: (1) inventory + first-pass verdicts, (2) data value + philosophy reconciliation, (3) integration design, (4) licensing + negative knowledge, (5) consolidation + cross-check.

**Inputs:** `external/ui-ux-pro-max-skill-main/` (data, scripts, templates, CLI, SKILL.md, skill.json, LICENSE, CLAUDE.md); `.opencode/skills/sk-interface-design/` (SKILL.md, design_principles.md, graph-metadata.json, LICENSE.txt); house conventions (`sk-code` references, skill-dir layout, SKILL.md sizes).

---

## 3. The two skills in one paragraph each

**Target — `sk-interface-design`** (Apache-2.0, ~186 L SKILL.md + 87 L `design_principles.md` + README + LICENSE.txt). Pure prose. Philosophy: distinctive, anti-default visual design via a brainstorm → critique-against-AI-defaults → build → self-critique process; one justified aesthetic risk; subject-grounded; restraint. No data, no scripts. graph-metadata: family `sk-code`; `enhances sk-code`; `prerequisite_for mcp-magicpath`. [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md] [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:59]

**Source — `ui-ux-pro-max`** (MIT, v2.5.0). Data-driven: 14 top-level CSVs + 16 stack CSVs, a zero-dependency BM25+regex search engine (`core.py` 262 L) with a thin CLI (`search.py` 114 L), a heavyweight design-system generator (`design_system.py` 1148 L), platform installer templates, an npm CLI, a Claude marketplace plugin, and 6 sibling sub-skills. The published SKILL.md (~660 L) inlines a 10-category Quick Reference duplicating `ux-guidelines.csv` and is specialized to one consumer's React-Native stack. [SOURCE: file:external/.../CLAUDE.md] [SOURCE: file:external/.../.claude/skills/ui-ux-pro-max/SKILL.md]

---

## 4. Measured asset inventory (ground truth)

| Asset | Artifact | Measured | Marketing claim |
|---|---|---|---|
| UI styles | `styles.csv` | 84 rows | "50+"/"67" |
| Color palettes | `colors.csv` | 160 rows | "161" |
| Type pairings | `typography.csv` | 73 rows | "57" |
| Product-reasoning rules | `ui-reasoning.csv` | 161 rows | "161" |
| UX guidelines | `ux-guidelines.csv` | 98 rows | "99" |
| Charts | `charts.csv` | 25 rows | "25" |
| Product types | `products.csv` | 161 rows | — |
| Landing patterns | `landing.csv` | 33 rows | — |
| Icons | `icons.csv` | 104 rows | — |
| Google Fonts | `google-fonts.csv` | 1922 rows | — |
| React perf | `react-performance.csv` | 44 rows | — |
| App-interface (mobile a11y) | `app-interface.csv` | 29 rows | — |
| Stacks | `stacks/*.csv` | 16 stacks | "10"/"15+" |
| Search engine | `core.py` | 262 L (zero-dep) | — |
| Search CLI | `search.py` | 114 L | — |
| DS generator | `design_system.py` | 1148 L | — |

**Note:** the repo's own headline counts disagree with each other (`skill.json` vs SKILL.md) and with the data. Any adoption must regenerate counts from the CSVs. [SOURCE: file:external/.../skill.json:4] [SOURCE: file:external/.../.claude/skills/ui-ux-pro-max/SKILL.md:3]

---

## 5. The central tension and its resolution (Q4)

`sk-interface-design`: "make deliberate, opinionated choices … a design that reads as a templated default has failed" and §4 names the three current AI-default clusters to avoid. `ui-ux-pro-max`: per-product-type best-match recommendations — `ui-reasoning.csv` literally emits `{"if_checkout":"emphasize-trust","if_hero_needed":"use-3d-hyperrealism"}`. A naive merge would bolt a default-generator onto an anti-default skill. [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:59] [SOURCE: file:external/.../data/ui-reasoning.csv:5]

**Resolution:** invert the data's role from *answer* to *inventory + constraint*. The house process already includes a "critique against the AI-default looks" step; the recommendation data is most valuable as **the catalog of common answers to critique against** ("the cliché for luxury e-commerce is glassmorphism + premium-minimal → deviate deliberately"). The objective quality-floor data, by contrast, is orthogonal to aesthetics and can be adopted directly. This split is the load-bearing insight of the whole recommendation.

---

## 6. Merge Recommendation (per asset class)

| Asset class | Verdict | Integration | Concrete first step |
|---|---|---|---|
| `ux-guidelines.csv` (98) | **ADOPT** | `assets/data/` + distilled `references/ux_quality_reference.md` | Copy CSV; generate a curated checklist from CRITICAL/HIGH rows. |
| `charts.csv` (25) | **ADOPT** | `assets/data/` (queryable) | Copy CSV; add a "charts & data viz" SKILL.md routing line. |
| `app-interface.csv` (29) + `react-performance.csv` (44) | **ADOPT (a11y/perf only)** | `assets/data/` | Copy CSVs as quality-floor data, not stack guidance. |
| `colors.csv` (160) | **ADAPT** | `assets/data/` + token note in `references/design_inventory.md` | Adopt the shadcn-style semantic-token schema + WCAG-pair discipline; frame palettes as "common starts to deviate from." |
| `typography.csv` (73) | **ADAPT** | `assets/data/` (query) | Copy CSV; reference as a pairings inventory, not a chooser. |
| `styles.csv` (84) | **ADAPT** | `assets/data/` (query) | Copy CSV; cross-link to `design_principles.md` §4. |
| `ui-reasoning.csv` (161), `products.csv` (161), `landing.csv` (33) | **ADAPT (cautious)** | `assets/data/` (query) + explicit "critique-against, not use-this" framing | Copy CSVs; document them as *expected* patterns to deviate from. |
| `icons.csv` (104) | **ADAPT (minor)** | `assets/data/` | Optional copy. |
| `core.py` + `search.py` | **ADAPT** | `scripts/design_search_core.py` + `scripts/design_search.py` | Rename; re-root `DATA_DIR`→`assets/data`; trim `CSV_CONFIG`; drop stack config; add MIT provenance header. |
| `design_system.py` (1148) | **SKIP** (revisit trimmed) | — | None; revisit only if a "show the cliché for X" helper is later wanted, stripped of persist machinery. |
| `stacks/*.csv` (16) | **SKIP** | belongs to `sk-code` | None. |
| `google-fonts.csv` (1922) | **SKIP from inline** | reference/query only if ever | None. |
| Published SKILL.md + Quick Reference | **SKIP as file** (reuse data) | — | None; data adopted via the CSVs. |
| `templates/platforms/*.json` (18), `cli/`, `.claude-plugin/`, 6 sibling sub-skills, `docs/`, `design.csv`/`draft.csv` | **SKIP** | — | None. |

---

## 7. Integration design (Q2)

**Proposed layout for the follow-up merge packet:**

```
sk-interface-design/
  SKILL.md                      (+ ~15-25-line routing section; stays < ~250L)
  references/
    design_principles.md        (unchanged authority)
    design_inventory.md         (NEW — critique-against framing for the aesthetic data)
    ux_quality_reference.md     (NEW — distilled quality-floor checklist)
  assets/data/                  (NEW — adopted CSVs, MIT)
  scripts/
    design_search.py            (adapted search.py)
    design_search_core.py       (adapted core.py — zero-dep BM25)
  LICENSE.txt                   (Apache-2.0, existing)
  LICENSE-ui-ux-pro-max.txt     (NEW — verbatim MIT)
  THIRD-PARTY-NOTICES.md        (NEW — MIT vs Apache file map)
```

- **`assets/data/` not `data/`:** 0 house skills ship a top-level `data/`; 15 ship `assets/`; 16 ship `scripts/`. Follow convention. [SOURCE: file:.opencode/skills/ layout]
- **SKILL.md budget:** house SKILL.md range 186–466 L; the external ~660 L exceeds all. Route to references + script; never inline the rules. [SOURCE: file:.opencode/skills/*/SKILL.md sizes]
- **Script adaptation:** small — rename, re-root `DATA_DIR`, trim `CSV_CONFIG` to adopted domains, drop the 16-stack config. Adds a Python3 prerequisite already met framework-wide (`skill_advisor.py`, spec-kit scripts). [SOURCE: file:external/.../scripts/core.py:14,75]
- **Advisor routing:** extend `graph-metadata.json` `intent_signals`/`derived.trigger_phrases` with "color palette", "font pairing", "chart type", "ux checklist", "design tokens"; add new `key_files`; **avoid** stack/implementation signals owned by `sk-code`. Keep the `enhances sk-code` / `prerequisite_for mcp-magicpath` edges. [SOURCE: file:.opencode/skills/sk-interface-design/graph-metadata.json:36-47]

---

## 8. Licensing & attribution path (Q3)

- **Compatible, no copyleft.** MIT material may be incorporated into the Apache-2.0 skill; the result is a **mixed-license skill** (MIT data+scripts, Apache-2.0 principles). No relicensing needed. [SOURCE: file:external/.../LICENSE:5-13] [SOURCE: file:.opencode/skills/sk-interface-design/LICENSE.txt:2]
- **MIT's only obligation is notice retention.** Ship `LICENSE-ui-ux-pro-max.txt` (verbatim MIT incl. the NextLevelBuilder copyright), a `THIRD-PARTY-NOTICES.md` mapping MIT vs Apache files, per-file provenance headers on the adapted scripts, and "adapted from" labels (MIT permits modification). [SOURCE: file:external/.../LICENSE:5-13]
- **Extend the existing precedent.** `sk-interface-design` is the only house skill already shipping `LICENSE.txt` + a `license:` frontmatter field. Update that frontmatter to declare the mix (`Apache-2.0 (principles) + MIT (data & search)`) and credit the upstream repo in `metadata.source`. No new framework mechanism. [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:6-9]
- **Low provenance risk:** CSV content is the upstream author's MIT-covered compilation; facts/standards within rows are not separately licensable; `google-fonts.csv` is SKIP-from-inline anyway.

---

## 9. Why the data is genuinely good (evidence)

- `ux-guidelines.csv` schema `Category, Issue, Platform, Description, Do, Don't, Code Good, Code Bad, Severity` — directly actionable, framework-cited. [SOURCE: file:external/.../data/ux-guidelines.csv:2-4]
- `colors.csv` rows are full shadcn-style semantic token sets with WCAG annotations (e.g. "Accent adjusted from #F97316 for WCAG 3:1"). [SOURCE: file:external/.../data/colors.csv:2]
- `core.py` BM25 is a clean, dependency-free retrieval layer reusable over any of the CSVs. [SOURCE: file:external/.../scripts/core.py:104-163]

---

## 10. Recommendations (actionable)

1. **Open a follow-up merge packet** scoped to the §6 ADOPT/ADAPT set only.
2. **Phase the merge:** (a) ship the quality-floor data + a distilled `ux_quality_reference.md` first (lowest risk, highest value); (b) then the adapted search script over `assets/data/`; (c) then the aesthetic data with the `design_inventory.md` critique-against framing.
3. **Regenerate all counts from the CSVs**; never copy the upstream headline numbers.
4. **Stand up the licensing artifacts** (`LICENSE-ui-ux-pro-max.txt`, `THIRD-PARTY-NOTICES.md`, frontmatter updates) in the same packet that first lands MIT files.
5. **Hold a hard line on SKIP** for `design_system.py`, stacks, packaging, and the published SKILL.md.

---

## 11. Eliminated Alternatives (negative knowledge)

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Lift the published SKILL.md verbatim | RN-specialized + ~660 L; breaks lean house convention | `external/.../.claude/skills/ui-ux-pro-max/SKILL.md:360` | 1 |
| Trust the repo's headline asset counts | Drift from data + internally inconsistent | `skill.json:4` vs `SKILL.md:3` vs CSVs | 1 |
| Wire `design_system.py --design-system` as the default flow | Auto-emits "use-this" systems = the templated defaults the skill resists | `data/ui-reasoning.csv:5` | 2 |
| Import the 16 `stacks/*.csv` into the design skill | Overlaps/cross-cuts `sk-code` ownership | `sk-code/references/stack_detection.md` | 2 |
| Inline `google-fonts.csv` (1922 rows) | Lookup index, not design judgment | `data/google-fonts.csv` | 2 |
| New top-level `data/` dir | No house skill uses one; use `assets/data/` | `.opencode/skills/` layout | 3 |
| Inline adopted rules into SKILL.md | Exceeds the largest house SKILL.md | `.opencode/skills/*/SKILL.md` sizes | 3 |
| Adopt `design_system.py` wholesale (1148 L) | Generator + persistence beyond a design skill; philosophy-conflicting | `scripts/design_system.py:1-90` | 3 |
| Adopt the 6 sibling sub-skills / CLI / marketplace / platform configs | Distribution/consumer packaging, out of scope | `external/.../CLAUDE.md` | 1 |
| Relicense Apache↔MIT | Unnecessary; permissive licenses coexist file-by-file | `external/.../LICENSE` | 4 |

---

## 12. Open Questions

- Within this lineage's scope: **none.** All five key questions answered.
- Deferred to the merge stage (not this lineage's job): final reconciliation with the `gpt55fast` lineage on the three divergence points in §13.

---

## 13. Cross-lineage cross-check framing (R4)

**High-confidence here (expect agreement with gpt55fast):**
- Quality-floor data (`ux-guidelines`/`charts`/`app-interface`/`react-performance`) = ADOPT.
- CLI / marketplace / 18 platform configs / 6 sibling sub-skills = SKIP.
- MIT ⊕ Apache-2.0 is clean; notice-retention only.
- The published SKILL.md is not liftable; `assets/data/` over a new `data/` dir.

**Predicted divergence (flag for merge reconciliation):**
1. **Recommender aggressiveness** — this lineage adopts `ui-reasoning.csv`/`products.csv` *cautiously, as inventory only*. A more literal lineage may recommend adopting the recommender (or `--design-system`) outright. **This is the crux; the philosophy tension must be resolved here.**
2. **`design_system.py` retention** — this lineage SKIPs it; another may keep a trimmed helper.
3. **Curated reference doc vs raw CSV** — this lineage distills a `references/ux_quality_reference.md`; a leaner lineage may ship the CSV queried by script only.

---

## 14. References

- External repo: `.opencode/specs/skilled-agent-orchestration/148-sk-interface-design/external/ui-ux-pro-max-skill-main/` (MIT) — `LICENSE`, `skill.json`, `CLAUDE.md`, `.claude/skills/ui-ux-pro-max/SKILL.md`, `src/ui-ux-pro-max/data/*.csv`, `src/ui-ux-pro-max/scripts/{core,search,design_system}.py`.
- Target skill: `.opencode/skills/sk-interface-design/` — `SKILL.md`, `references/design_principles.md`, `graph-metadata.json`, `LICENSE.txt`.
- House conventions: `.opencode/skills/sk-code/references/stack_detection.md`; `.opencode/skills/` directory layout; house `SKILL.md` sizes.
- Lineage iterations: `iterations/iteration-001.md` … `iteration-005.md`; state log `deep-research-state.jsonl`; deltas `deltas/iter-00N.jsonl`.

---

## 15. Convergence Report

- **Stop reason:** max_iterations (5 of 5). (newInfoRatio trend was descending toward the 0.05 threshold but had not crossed it.)
- **Total iterations:** 5, all `complete`.
- **Questions answered:** 5/5 (100%).
- **newInfoRatio trend:** 1.00 → 0.70 → 0.60 → 0.50 → 0.35 (monotonic descending).
- **Quality guards:** source diversity (≈10 distinct source files across both repos + house conventions); one focus per iteration; no single-weak-source finding. Stuck count 0; no guard violations.
