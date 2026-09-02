---
name: sk-create-chart
description: "Chart authoring for sk-doc: turn a reader's comparison into one catalog form, copy its file and ship a standalone HTML chart."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
metadata:
  packetKind: workflow
---

<!-- Keywords: create-chart, chart, data visualization, plot the data, treemap, waterfall chart, heatmap, box plot, histogram, chart catalog, colour system, standalone html chart -->

# Create Chart

`sk-create-chart` is the chart-authoring workflow packet of the `sk-doc` parent hub. It produces a standalone HTML chart from a corpus of chart forms that lives inside this packet.

---

## 1. WHEN TO USE

### Activation Triggers

Use this packet when the request involves:

- Building a chart that plots data: a ranked comparison, a part-to-whole split, a time series, a distribution, a relationship or a matrix.
- Deciding which chart form answers the comparison a reader needs to make.
- Choosing or applying one of the packet's three colour systems.
- Adding a chart form to the corpus, or checking that the corpus still renders.

Keyword triggers: `create a chart`, `plot the data`, `data visualization`, `treemap`, `waterfall chart`, `heatmap`, `box plot`, `histogram`, `chart catalog`, `chart colour system`, `standalone html chart`.

### When NOT to Use

Use another `sk-doc` packet when:

- The artifact explains a structure rather than plotting values. A flow, an architecture, a sequence or a state machine is `sk-create-diagram` work.
- The request is about the prose around a chart rather than the chart. That is `sk-create-readme` or `sk-create-quality-control`.
- The request asks for interface design values or a measured style reference. Those belong to `sk-design` and `sk-design-md-generator`.

The boundary against `sk-create-diagram` is the one that actually gets tested, because that packet already names bar, line, scatter and radar in its own selection guide. The split is what the artifact carries. A diagram carries a structure a reader follows. A chart carries values a reader compares.

The hub router splits the two by name. `sk-create-diagram` keeps the bare type names it documents, which are `bar chart`, `line chart`, `scatter plot`, `radar chart`, `gantt chart` and `org chart`. This packet answers the form names that packet has no file for, such as `treemap`, `waterfall chart`, `heatmap`, `box plot` and `histogram`, plus the data-qualified phrasings `bar chart of`, `line chart of` and `scatter plot of`. A request that names a bare type and asks for a diagram reaches both, and the router asks which one rather than guessing.

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
| Colour systems | `assets/color/` | The three named systems, the palette source they read and their proof sheets |
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

### What the corpus holds

Twenty chart forms across six question families: comparison, composition, time, distribution, relationship and matrix. `references/catalog.md` is the index and the corpus check reads it in both directions, so a row naming a missing file and a file carrying no row both fail. One form is one file. There are no gallery pages to lift a block out of, because what reaches a reader is a delivery and a gallery ships every other form's demo data alongside the one they asked for. When no row answers the question in front of you, report the gap rather than improvising a form.

---

## 4. RULES

### ✅ ALWAYS

- Copy a form file that already renders, and change only its data block.
- Apply exactly one colour system per artifact.
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
- The request wants a structure rather than values, which puts it on the `sk-create-diagram` side of the boundary.
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
- The corpus validator exits clean.

---

## 7. INTEGRATION POINTS

- Input: chart requests routed from the `sk-doc` hub.
- Output: a standalone HTML chart.
- Neighbour: `sk-create-diagram` owns structural visuals, and the two are separated by what the artifact carries rather than by which one was asked first.

---

## 8. RELATED RESOURCES

- [`README.md`](./README.md) - what this packet is and how to navigate it.
- [`references/README.md`](./references/README.md) - the reference index for the catalog, the colour systems and the template contract.
- [`scripts/README.md`](./scripts/README.md) - what the corpus validator checks.
- [`../sk-create-diagram/SKILL.md`](../sk-create-diagram/SKILL.md) - the structural-visual packet on the other side of this boundary.
- [`../SKILL.md`](../SKILL.md) - the hub that routes here.
