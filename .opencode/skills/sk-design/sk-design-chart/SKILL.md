---
name: sk-design-chart
description: "Chart authoring for sk-doc: turn a reader's comparison into one catalog form, copy its file and ship a standalone HTML chart."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 2.1.0.0
metadata:
  packetKind: workflow
---

<!-- Keywords: create-chart, chart, data visualization, plot the data, treemap, waterfall chart, heatmap, box plot, histogram, chart catalog, colour system, standalone html chart -->

# Create Chart

`sk-design-chart` is the chart-authoring workflow packet of the `sk-design` parent hub. It produces a standalone HTML chart from a corpus of chart forms that lives inside this packet.

---

## 1. WHEN TO USE

### Activation Triggers

Use this packet when the request involves:

- Building a chart that plots data: a ranked comparison, a part-to-whole split, a time series, a distribution, a relationship or a matrix.
- Deciding which chart form answers the comparison a reader needs to make.
- Choosing or applying one of the packet's three stock colour systems, or a provenance-gated design-md delivery.
- Applying a local v3 `DESIGN.md` Style Reference to a chart delivery.
- Adding a chart form to the corpus, or checking that the corpus still renders.

Keyword triggers: `create a chart`, `plot the data`, `data visualization`, `treemap`, `waterfall chart`, `heatmap`, `box plot`, `histogram`, `chart catalog`, `chart colour system`, `standalone html chart`, `DESIGN.md`, `style reference`, `measured site's look`, `theme a chart`.

### When NOT to Use

Use another `sk-doc` packet when:

- The artifact explains a structure rather than plotting values. A flow, an architecture, a sequence or a state machine is `sk-design-diagram` work.
- The request is about the prose around a chart rather than the chart. That is `sk-create-readme` or `sk-create-quality-control`.
- The request asks to extract interface design values from a site. Extraction belongs to `sk-design-md-generator`; applying an already extracted local `DESIGN.md` stays here.

The boundary against `sk-design-diagram` is the one that actually gets tested, because that packet already names bar, line, scatter and radar in its own selection guide. The split is what the artifact carries. A diagram carries a structure a reader follows. A chart carries values a reader compares.

The hub router splits the two by name. `sk-design-diagram` keeps the bare type names it documents, which are `bar chart`, `line chart`, `scatter plot`, `radar chart`, `gantt chart` and `org chart`. This packet answers the form names that packet has no file for, such as `treemap`, `waterfall chart`, `heatmap`, `box plot` and `histogram`, plus the data-qualified phrasings `bar chart of`, `line chart of` and `scatter plot of`. A request that names a bare type and asks for a diagram reaches both, and the router asks which one rather than guessing.

`radar chart` is the one name where the split by name and the split by artifact disagree, and the
two documents used to answer it differently with nothing saying so. By name it goes to
`sk-design-diagram`, which has a radar file and a type reference for it. By artifact it is values a
reader compares, which is this side of the line, and `catalog.md` section 6 records why this corpus
draws no radar and what answers the same comparison instead: `parallel-axes`, one scale per axis
rather than every dimension normalised onto one radial scale. Both hold, in that order. The name
routes to the diagram packet; a reader who arrives here comparing entities across several measures
is handed `parallel-axes` rather than sent away. The disagreement is recorded rather than resolved,
because resolving it means moving a file between packets and that is a decision about the hub.

### Packet Boundary

This packet may create and edit chart artifacts, its own corpus and its own validator. It does not own the `sk-doc` hub identity, and it never carries its own `graph-metadata.json` or `description.json`.

---

## 2. SMART ROUTING

The hub resolves this packet through `mode-registry.json`. Routing below that point selects packet-local resources only.

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

### Resource Domains

| Domain | Where it lives | Use |
| --- | --- | --- |
| Chart lookup | `references/catalog.md` | Turn the comparison a reader needs into one chart form and the file that draws it |
| Chart forms | `assets/templates/` | One self-contained file per form, copied whole rather than extracted from |
| Colour systems | `assets/color/` | The three named stock systems, the palette source they read and their proof sheets |
| Stock Style Reference | `assets/style-reference/cursor/` | The reference the stock palette, typeface and corner ladder were derived from, and what `--default` themes to |
| Design Reference application | `scripts/apply-design-md.cjs`, `references/design-md-theming.md` | Derive a gated delivery palette from a local v3 `DESIGN.md` without fetching or changing stock forms; pass any other reference's path to override the stock one |
| Template contract | `references/template-contract.md` | What a form file has to contain before the corpus check passes it |
| Worked deliveries | `assets/examples/` | One finished delivery per family, read when a form file alone is unclear |
| Corpus validation | `scripts/` | Prove every form still renders after a change |

---

## 3. HOW IT WORKS

The workflow is template-first, and that is a constraint rather than a preference. A chart assembled from a form file renders the way that file already rendered. A chart written freehand does not, and the failure shows up in a browser rather than in a check.

1. Read the request and name the comparison the reader needs to make.
2. Open `references/catalog.md` and resolve that comparison to one row.
3. Copy the file that row names. Do not rewrite its render code.
4. Swap the data block for the reader's data.
5. Apply one colour system from `assets/color/`. One per artifact.
6. Keep the result a single self-contained file. It opens in a browser with no install step.
7. Run the corpus validator before reporting the result.

When the request names a `DESIGN.md`, a style reference or a measured site's look, route the
application branch to `scripts/apply-design-md.cjs`. It reads the v3 headings documented by
`references/design-md-theming.md`, derives both grounds from local values, and writes themed
copies only after the corpus gates pass. A request that asks for themed charts without naming a
reference runs it with `--default`, the `cursor` bundle from the style library. If the request asks to create the Style Reference itself,
route that extraction to `sk-design-md-generator`; this packet owns application, not extraction.

### What the corpus holds

Twenty-six chart forms across six question families: comparison, composition, time, distribution, relationship and matrix. `references/catalog.md` is the index and the corpus check reads it in both directions, so a row naming a missing file and a file carrying no row both fail. One form is one file. There are no gallery pages to lift a block out of, because what reaches a reader is a delivery and a gallery ships every other form's demo data alongside the one they asked for. When no row answers the question in front of you, report the gap rather than improvising a form.

The corpus shares a measured visual register for card anatomy, type scale, bare axes, bar and line geometry, positioned HTML tooltip cards and keyed legend chips. The gallery passes each frame's light or dark scheme through a `data-scheme` attribute because pinning an iframe's `color-scheme` does not change the `prefers-color-scheme` selectors the templates honour.

---

## 4. RULES

### ✅ ALWAYS

- Copy a form file that already renders, and change only its data block.
- Apply exactly one colour system per artifact; a `design-md` delivery is accepted only with its provenance comment and both inline gate checks.
- Produce a single self-contained file that opens with no install step.
- Run the corpus validator before reporting a result.
- Author every chart and every palette in this packet.

### ❌ NEVER

- Never copy a template, a fragment or a snippet from an outside chart library into this packet. The corpus is authored here, and content under a license this repository cannot grant onward must not enter the tree.
- Never write a chart freehand when a form for its question exists.
- Never mix two colour systems in one artifact.
- Never act as a separate advisor identity and never carry packet-level identity metadata.

### ⚠️ ESCALATE IF

- No row in `references/catalog.md` answers the comparison the reader needs.
- The request wants a structure rather than values, which puts it on the `sk-design-diagram` side of the boundary.
- The corpus validator fails on a form you did not change.

---

## 5. REFERENCES

- `README.md` - packet overview and navigation.
- `references/README.md` - the reference index, which routes to the catalog, the colour systems and the template contract.
- `../mode-registry.json` - authoritative packet registration.
- `../hub-router.json` - parent routing policy.
- `../ROUTER.md` - stage-two leaf selection.

---

## 6. SUCCESS CRITERIA

- The artifact is one self-contained file that opens in a browser.
- The file traces back to one named row in `references/catalog.md`.
- One colour system is applied throughout.
- A local `DESIGN.md` can produce a deterministic, provenance-bearing delivery without changing stock forms or palettes.
- The corpus validator exits clean.

---

## 7. INTEGRATION POINTS

- Input: chart requests routed from the `sk-doc` hub.
- Output: a standalone HTML chart.
- Neighbour: `sk-design-diagram` owns structural visuals, and the two are separated by what the artifact carries rather than by which one was asked first.

---

## 8. RELATED RESOURCES

- [`README.md`](./README.md) - what this packet is and how to navigate it.
- [`references/README.md`](./references/README.md) - the reference index for the catalog, the colour systems and the template contract.
- [`scripts/README.md`](./scripts/README.md) - what the corpus validator checks.
- [`../sk-design-diagram/SKILL.md`](../sk-design-diagram/SKILL.md) - the structural-visual packet on the other side of this boundary.
- [`../SKILL.md`](../SKILL.md) - the hub that routes here.
