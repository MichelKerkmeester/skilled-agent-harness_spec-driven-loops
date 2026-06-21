# Iteration 003 — Integration design into the house structure (Q2)

**Lineage:** opus48 (claude-opus-4-8 xhigh) · **Iteration:** 3 of 5 · **Status:** complete · **newInfoRatio:** 0.6

## Focus

Concrete integration design for the ADOPT/ADAPT assets: directory placement, the `core.py`/`search.py` adaptation and Python prerequisite, advisor-routing edges, and SKILL.md word-budget discipline.

## Actions Taken

1. Enumerated which house skills ship `data/`, `scripts/`, `assets/` dirs. [SOURCE: file:.opencode/skills/ — `ls -d */{data,scripts,assets}`]
2. Measured house SKILL.md sizes for the budget envelope. [SOURCE: file:.opencode/skills/*/SKILL.md — wc -l]
3. Re-read `sk-design-interface/graph-metadata.json` routing surface (intent_signals, derived.trigger_phrases, key_files, edges). [SOURCE: file:.opencode/skills/sk-design-interface/graph-metadata.json]

## Findings

**F9 — Directory placement: `scripts/` is well-precedented, `assets/` is the bundled-file home, and `data/` is novel.** 16 house skills ship `scripts/` and 15 ship `assets/`; **zero ship a top-level `data/`**. So the convention-following home for the CSVs is **`assets/data/`** (not a new top-level `data/`), and the search code goes in **`scripts/`**. Proposed layout for the (follow-up) merge:

```
sk-design-interface/
  SKILL.md                      (+ ~20-line routing section, stays lean)
  references/
    design_principles.md        (unchanged authority)
    design_inventory.md         (NEW — how to use the data: critique-against framing)
    ux_quality_reference.md      (NEW — quality-floor checklist distilled/queryable)
  assets/data/                   (NEW — adopted CSVs, MIT)
    ux-guidelines.csv  charts.csv  app-interface.csv  react-performance.csv
    colors.csv  typography.csv  styles.csv  icons.csv
    ui-reasoning.csv  products.csv  landing.csv        (ADAPT-cautious, inventory)
  scripts/                       (NEW)
    design_search.py             (adapted search.py)
    design_search_core.py        (adapted core.py — BM25, zero-dep)
  LICENSE.txt                    (Apache-2.0, existing)
  NOTICE / THIRD-PARTY (MIT)     (NEW — see iter 4)
```

**F10 — SKILL.md budget forbids inlining; route instead.** House SKILL.md sizes: sk-design-interface 186, sk-code 287, mcp-magicpath 327, sk-git 465, sk-doc 466. The external published SKILL.md (~660 L) exceeds *all* of them, almost entirely because it inlines the 10-category Quick Reference (a copy of `ux-guidelines.csv`). Integration must **keep the data out of SKILL.md** and add only a compact routing block (~15-25 lines) pointing at `references/ux_quality_reference.md` + the search script. Target: SKILL.md stays well under ~250 lines. [SOURCE: file:.opencode/skills/*/SKILL.md sizes] [SOURCE: file:external/.../.claude/skills/ui-ux-pro-max/SKILL.md (~660L)]

**F11 — Script adaptation is small and clean.** `core.py` (262 L) is zero-dependency stdlib (csv, re, math, collections) BM25 + regex; `search.py` (114 L) is a thin CLI. Adaptation = (1) rename to avoid generic `core.py`/`search.py`, (2) re-root `DATA_DIR = Path(__file__).parent.parent / "data"` to the chosen `assets/data`, (3) drop the `design_system.py` import unless the trimmed helper is kept, (4) trim `CSV_CONFIG`/`STACK_CONFIG` to the adopted domains (remove the 16 stack entries — F7). Adds a **Python3 prerequisite**, which the framework already satisfies (`skill_advisor.py` and spec-kit scripts run Python3); note it in the skill's prerequisites. [SOURCE: file:external/.../scripts/core.py:14,75-92] [SOURCE: file:external/.../scripts/search.py:20]

**F12 — Advisor routing extends, but must not poach `sk-code`.** `graph-metadata.json` carries `intent_signals` + `derived.trigger_phrases` + `key_files` + edges. Safe additions: "color palette", "font pairing", "type pairing", "chart type", "ux checklist", "accessibility check", "design tokens". Must AVOID stack/implementation signals ("react performance", "swiftui", "tailwind config") that belong to `sk-code` (preserves the F7 boundary). `key_files` should add the new references + scripts; the `enhances sk-code` / `prerequisite_for mcp-magicpath` edges are unaffected. [SOURCE: file:.opencode/skills/sk-design-interface/graph-metadata.json:36-47,78-83]

**F13 — `design_system.py` (1148 L) is the weakest integration candidate.** Its core behavior (auto-aggregate searches → pick a full design system → persist Master/Overrides) is both the philosophy-conflicting "use-this generator" (F5) and the largest, heaviest file. If anything survives, it is a small, stripped "show common answer for product type X (so I can deviate)" helper — not the persistence machinery. Default disposition: **SKIP**, revisit only if a concrete need appears. [SOURCE: file:external/.../scripts/design_system.py:1-90]

## Questions Answered

- **Q2:** Integration design specified — `assets/data/` for CSVs, `scripts/` for adapted search, two new `references/` docs, lean SKILL.md routing block, scoped advisor-routing additions, Python3 prereq noted. (F9–F12)

## Questions Remaining

- Q3 (licensing/attribution path), Q5 (negative knowledge consolidation + concrete first steps).

## Dead Ends / Ruled Out

- **A new top-level `data/` dir** — ruled out: no house skill uses one; `assets/data/` follows the established convention. [SOURCE: file:.opencode/skills/ layout]
- **Inlining adopted rules into SKILL.md** — ruled out: would push SKILL.md past the largest house skill; route to references + script instead. [SOURCE: file:.opencode/skills/*/SKILL.md sizes]
- **Adopting `design_system.py` wholesale** — ruled out: 1148 L, philosophy-conflicting generator + persistence machinery far beyond a design skill's needs.

## Next Focus

Iteration 4: Licensing/attribution path (Q3) — combining MIT `ui-ux-pro-max` content into the Apache-2.0 house skill: compatibility, what notice/attribution is required, and where it lives. Plus consolidation of negative knowledge.
