# Third-Party Notices

`sk-interface-design` is a mixed-license skill.

| Component | License | Source | Files |
|-----------|---------|--------|-------|
| Design principles + skill guidance | Apache-2.0 | Vendored from [anthropics/skills · frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | `SKILL.md`, `references/design_principles.md`, `README.md` |
| Design data + search engine | MIT | Adapted from [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (c) 2024 Next Level Builder | `assets/data/*.csv`, `scripts/design_search*.py` |

- Apache-2.0 terms: [`LICENSE.txt`](LICENSE.txt).
- MIT terms (verbatim, with the upstream copyright): [`LICENSE-ui-ux-pro-max.txt`](LICENSE-ui-ux-pro-max.txt).

## MIT-licensed files adopted

Data (`assets/data/`), copied verbatim from the upstream repo:

- Quality floor: `ux-guidelines.csv`, `charts.csv`, `app-interface.csv`
- Aesthetic inventory: `styles.csv`, `colors.csv`, `typography.csv`, `ui-reasoning.csv`, `products.csv`, `landing.csv`

Scripts (`scripts/`), adapted (re-rooted data dir, trimmed config, generator/persistence and stack search removed):

- `design_search_core.py` (adapted from upstream `core.py`)
- `design_search.py` (adapted from upstream `search.py`)

The MIT permission notice is retained per its only obligation (notice retention). Adapted files carry an "adapted from ui-ux-pro-max (MIT)" provenance header. Counts in our docs are regenerated from the CSVs, not copied from upstream marketing figures.

Not adopted (left in the upstream repo): the npm CLI, marketplace plugin, platform-installer templates, sibling sub-skills, the `design_system.py` generator, the stack guides (`stacks/*.csv`), `google-fonts.csv`, `icons.csv`, `react-performance.csv` (React implementation perf — `sk-code`'s domain), and the scratch `design.csv` / `draft.csv`.
