---
title: "Create Chart Router"
description: "Sibling router for sk-design-chart: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-design-chart router"
  - "sk-design-chart routing"
importance_tier: normal
contextType: general
version: 1.0.1.0
router_state: active
skill_pointer: SKILL.md
---

# Create Chart Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-design/sk-design-chart/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when the artifact plots values rather than explains a structure: a ranked comparison, a part-to-whole split, a time series, a distribution, a relationship or a matrix, and when they name a form this corpus carries such as `treemap`, `waterfall chart`, `heatmap`, `box plot` or `histogram`. A request that names a `DESIGN.md`, a style reference or a measured site's look arrives on the same skill's theming branch. It routes to four resource families: the catalog that resolves a comparison to one form, the form files under `assets/templates/` copied whole, the style references under `assets/style-reference/` with the theming script that applies one, and the template contract with the corpus validator that proves every form still renders.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`CHART_FORM`** fires on "create a chart", "plot the data", "data visualization", a named form such as "treemap", "waterfall chart", "heatmap", "box plot" or "histogram", and a data-qualified phrasing such as "bar chart of". It loads `references/catalog.md` first, because that file resolves the comparison to one row, and then the form file the row names under `assets/templates/`, copied whole rather than extracted from.
- **`DESIGN_MD_THEME`** fires on "DESIGN.md", "style reference", "measured site's look", "theme a chart" and "chart colour system". It loads `references/design-md-theming.md` and runs `scripts/apply-design-md.cjs`, which reads the v3 headings that reference documents; a request naming no reference runs the same script with `--default`, the `assets/style-reference/evilcharts/` palette.
- **`CORPUS_MAINTENANCE`** fires on "add a chart form", "chart catalog", "check the corpus" and any change to a form file or the palette source. It loads `references/catalog.md` and `references/template-contract.md`, then runs `scripts/check-corpus.cjs`, because a row and a file have to name each other in both directions.

---

## 3. MACHINE ROUTER

The routing detail behind the intent model above, written as `## MACHINE ROUTER` so every reader
finds it. This section is the last in the file, and it holds the only pseudocode: a discovery sketch,
not a scored intent map.

This section holds the packet's resource domains and the discovery pseudocode that reads them.

The hub resolves this packet through `mode-registry.json`. Routing below that point selects packet-local resources only.

### Resource Domains

| Domain | Where it lives | Use |
| --- | --- | --- |
| Chart lookup | `references/catalog.md` | Turn the comparison a reader needs into one chart form and the file that draws it |
| Chart forms | `assets/templates/` | One self-contained file per form, copied whole rather than extracted from |
| Style References | `assets/style-reference/` | One directory per reference. Each owns its `DESIGN.md`, its `palettes.json` and its proof sheets, so adding a reference means deciding its colour rather than inheriting somebody else's |
| Stock colour | `assets/style-reference/evilcharts/palettes.json` | The default reference's own palette: the three named systems, the corner ladder and the type scale every stock form reads, and what `--default` themes to |
| Design Reference application | `scripts/apply-design-md.cjs`, `references/design-md-theming.md` | Derive a gated delivery palette from a local v3 `DESIGN.md` without fetching or changing stock forms; pass any other reference's path to override the stock one |
| Template contract | `references/template-contract.md` | What a form file has to contain before the corpus check passes it |
| Corpus validation | `scripts/` | Prove every form still renders after a change |

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
UNKNOWN_FALLBACK = {
    "load_level": "UNKNOWN_FALLBACK",
    "needs_disambiguation": True,
    "resources": [],
}

def discover_markdown_resources() -> set[str]:
    return {
        path.relative_to(SKILL_ROOT).as_posix()
        for path in SKILL_ROOT.rglob("*.md")
        if path.is_file()
    }

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError("Only packet-local markdown resources are routable")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def route_resources(request):
    inventory = discover_markdown_resources()
    selected = select_resources_for_request(request, inventory)
    if not selected:
        return UNKNOWN_FALLBACK
    return {
        "resources": [
            _guard_in_skill(path)
            for path in selected
            if _guard_in_skill(path) in inventory
        ]
    }
```
