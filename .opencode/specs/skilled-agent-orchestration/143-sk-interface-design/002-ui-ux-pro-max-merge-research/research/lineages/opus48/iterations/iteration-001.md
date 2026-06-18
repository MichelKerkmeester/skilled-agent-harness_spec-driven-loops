# Iteration 001 — Asset inventory + first-pass ADOPT/ADAPT/SKIP

**Lineage:** opus48 (claude-opus-4-8 xhigh) · **Iteration:** 1 of 5 · **Status:** complete · **newInfoRatio:** 1.0

## Focus

Inventory every asset class in `ui-ux-pro-max-skill-main` and assign a first-pass ADOPT / ADAPT / SKIP verdict with a one-line reason, to satisfy R1 and frame the deeper dives in iterations 2–5.

## Actions Taken

1. Walked the external repo tree (excluding node_modules/.git) and the `src/ui-ux-pro-max/{data,scripts,templates}` layout. [SOURCE: external/ui-ux-pro-max-skill-main/CLAUDE.md] [SOURCE: file:external/.../src/ui-ux-pro-max/]
2. Measured real row counts of every data CSV with `wc -l`. [SOURCE: file:external/.../src/ui-ux-pro-max/data/*.csv]
3. Read the published skill SKILL.md, skill.json, LICENSE, and core.py/search.py/design_system.py headers. [SOURCE: file:external/.../.claude/skills/ui-ux-pro-max/SKILL.md] [SOURCE: file:external/.../skill.json] [SOURCE: file:external/.../LICENSE]
4. Read the target house skill (SKILL.md, design_principles.md, graph-metadata.json) to anchor the receiving structure. [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md]

## Findings

### Measured asset inventory (ground truth, not the marketing numbers)

| Asset class | Concrete artifact | Measured size | Marketing claim |
|---|---|---|---|
| UI styles | `data/styles.csv` | 84 rows | "50+"/"67" |
| Color palettes | `data/colors.csv` | 160 rows (full shadcn-style token sets) | "161" |
| Type pairings | `data/typography.csv` | 73 rows (Google Fonts + import/Tailwind) | "57" |
| Product-reasoning rules | `data/ui-reasoning.csv` | 161 rows (pattern + style priority + decision JSON + anti-patterns) | "161" |
| UX guidelines | `data/ux-guidelines.csv` | 98 rows (issue/Do/Don't/code/severity) | "99" |
| Chart guidance | `data/charts.csv` | 25 rows | "25" |
| Product types | `data/products.csv` | 161 rows | — |
| Landing patterns | `data/landing.csv` | 33 rows | — |
| Icons | `data/icons.csv` | 104 rows | — |
| Google Fonts index | `data/google-fonts.csv` | 1922 rows | — |
| React perf | `data/react-performance.csv` | 44 rows | — |
| App-interface (mobile a11y) | `data/app-interface.csv` | 29 rows | — |
| `design.csv` / `draft.csv` | working/aggregate CSVs | 1774 / 1777 rows | — (internal) |
| Stack guides | `data/stacks/*.csv` | 16 stacks | "10"/"15+" |
| Search engine | `scripts/core.py` | 262 L, zero-dep BM25+regex | — |
| Search CLI | `scripts/search.py` | 114 L | — |
| Design-system generator | `scripts/design_system.py` | 1148 L, multi-domain aggregate + Master/Overrides persist | — |
| Quick Reference (inline) | published SKILL.md | ~660 L, 10 priority categories | — (duplicates ux-guidelines.csv) |
| Platform installer configs | `templates/platforms/*.json` | 18 platforms | — |
| Base templates | `templates/base/{skill-content,quick-reference}.md` | 2 files | — |
| CLI installer | `cli/` (`uipro-cli`, TS) | npm package, ~564KB assets | — |
| Marketplace | `.claude-plugin/{marketplace,plugin}.json` | 2 files | — |
| Sibling sub-skills | `.claude/skills/{design,banner-design,ui-styling,brand,slides,design-system}` | 6 extra skills (symlinks to src) | — |
| Docs | `docs/三个 data-scripts-templates 的区别.md` | 1 file (Chinese) | — |

**F1 — Marketing numbers drift from the data and are internally inconsistent.** `skill.json` says "67 styles / 15+ stacks"; the published SKILL.md says "50+ styles / 161 palettes / 57 pairings / 161 products / 99 UX / 25 charts / 10 stacks"; the measured data is 84 styles / 160 palettes / 73 pairings / 161 products+reasoning / 98 UX / 25 charts / 16 stacks. Whatever we adopt, regenerate counts from the data; never copy the prose counts. [SOURCE: file:external/.../skill.json:4] [SOURCE: file:external/.../.claude/skills/ui-ux-pro-max/SKILL.md:3] [SOURCE: file:external/.../src/ui-ux-pro-max/data/styles.csv]

**F2 — The published SKILL.md is downstream-specialized, not house-neutral.** Its workflow section hardcodes "Stack: React Native (this project's only tech stack)" and the Available Stacks table lists only `react-native`, even though the data ships 16 stacks. The SKILL.md is a *consumer customization* of the data, not a portable artifact. We cannot lift it verbatim. [SOURCE: file:external/.../.claude/skills/ui-ux-pro-max/SKILL.md:360,469-471]

**F3 — The data layer is the asset of real value; everything else is packaging or consumer-specific.** The CSVs are structured, citable, framework-tagged (HIG/MD/WCAG), and zero-dependency to query. The scripts are small and stdlib-only. The CLI / marketplace / platform-configs / sibling sub-skills exist to *distribute* the skill to 18 IDEs — irrelevant inside one framework's single skill.

### First-pass ADOPT / ADAPT / SKIP

| Asset class | Verdict (provisional) | One-line reason |
|---|---|---|
| `ux-guidelines.csv` (+ react-performance, app-interface) | **ADOPT** | Objective, framework-cited quality-floor checks; complements (does not conflict with) the house anti-default philosophy. |
| `charts.csv` | **ADOPT** | Self-contained, objective chart-type guidance the house skill entirely lacks. |
| `colors.csv`, `typography.csv`, `styles.csv` | **ADAPT** | Valuable raw material, but must be framed as a *palette to react against / starting points*, not an authoritative "use this" — or it fights the anti-default stance (see iter 2). |
| `ui-reasoning.csv`, `products.csv`, `landing.csv` | **ADAPT (cautious)** | Strongest tension with "avoid templated defaults"; useful as inventory of common patterns, risky as a recommender. |
| `stacks/*.csv`, `icons.csv`, `google-fonts.csv` | **ADAPT / partial** | Overlaps `sk-code` (stacks) and is large (google-fonts 1922 rows); adopt selectively or by reference. |
| `core.py` + `search.py` | **ADAPT** | Good zero-dep retrieval over the data; rename/re-root paths; adds a Python3 prereq. |
| `design_system.py` | **ADAPT (cautious) / partial SKIP** | The "auto-pick a full design system" behavior is exactly the anti-default tension; the Master/Overrides persist idea is interesting but heavy (1148 L). |
| Published SKILL.md + inline Quick Reference | **SKIP (as-is)** / ADAPT content | RN-specialized and ~660 L; would blow the lean house SKILL.md budget; reuse the *data behind it*, not the file. |
| `templates/platforms/*.json` (18) | **SKIP** | IDE installer configs — pure distribution plumbing. |
| `cli/` (`uipro-cli`) | **SKIP** | npm installer for external distribution; the framework installs skills its own way. |
| `.claude-plugin/` marketplace | **SKIP** | Marketplace publishing metadata. |
| 6 sibling sub-skills (banner/brand/slides/…) | **SKIP** | Out of scope; separate concerns, would balloon one house skill into many. |
| `docs/` (Chinese) + `design.csv`/`draft.csv` | **SKIP** | Internal working docs/aggregates, not consumer assets. |

## Questions Answered

- **Q1 (first pass):** Every asset class now has a provisional ADOPT/ADAPT/SKIP verdict with a reason (table above). Refined in iterations 2–4.

## Questions Remaining

- Q2 (integration design), Q3 (licensing), Q4 (philosophy reconciliation — flagged as the central tension), Q5 (negative knowledge + steps).

## Dead Ends / Ruled Out

- **Lifting the published SKILL.md verbatim** — ruled out: it is React-Native-specialized and ~660 lines, violating the house lean-SKILL.md convention. [SOURCE: file:external/.../.claude/skills/ui-ux-pro-max/SKILL.md:360]
- **Trusting the repo's headline asset counts** — ruled out: they drift from the actual data and disagree with each other. Regenerate from CSVs. [SOURCE: file:external/.../skill.json:4]

## Next Focus

Iteration 2: Deep value assessment of the DATA assets (colors / styles / typography / ui-reasoning / ux-guidelines / stacks) — quality, format, and explicit reconciliation of the data-driven recommender with the house skill's anti-default philosophy (Q4). Decide ADOPT-as-what for each data class.
