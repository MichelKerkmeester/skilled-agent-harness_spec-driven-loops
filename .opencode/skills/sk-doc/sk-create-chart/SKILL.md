---
name: sk-create-chart
description: "Chart and report authoring for sk-doc: pick a chart type, open its gallery, take its render block, assemble one standalone file."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
metadata:
  packetKind: workflow
---

<!-- Keywords: create-chart, chart, data visualization, bar chart, line chart, scatter plot, report template, color system, chart gallery, standalone html chart -->

# Create Chart

`sk-create-chart` is the chart-authoring workflow packet of the `sk-doc` parent hub. It produces a standalone HTML chart or report from a template corpus that lives inside this packet.

---

## 1. WHEN TO USE

### Activation Triggers

Use this packet when the request involves:

- Building a chart that renders data: a bar chart, a line chart, a scatter plot, a radar or a distribution.
- Assembling a multi-chart report page from a report template.
- Choosing or applying one of the packet's named color systems.
- Adding a chart type to the corpus, or validating that the corpus still renders.

Keyword triggers: `create chart`, `make a chart`, `data visualization`, `bar chart`, `line chart`, `scatter plot`, `report template`, `chart gallery`, `color system`, `standalone html chart`.

### When NOT to Use

Use another `sk-doc` packet when:

- The artifact explains a structure rather than plotting values. A flow, an architecture, a sequence or a state machine is `sk-create-diagram` work.
- The request is about the prose around a chart rather than the chart. That is `sk-create-readme` or `sk-create-quality-control`.
- The request asks for interface design values or a measured style reference. Those belong to `sk-design` and `sk-design-md-generator`.

The boundary against `sk-create-diagram` is the one that actually gets tested, because that packet already names bar, line, scatter and radar in its own selection guide. The split is what the artifact carries. A diagram carries a structure a reader follows. A chart carries values a reader compares.

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
| Chart lookup | `references/` | Find the chart type that answers the question and the gallery holding it |
| Chart templates | `assets/templates/` | The gallery pages and standalone charts a render block is taken from |
| Color systems | `assets/color/` | The named palettes and their token files |
| Report templates | `assets/reports/` | Multi-chart report pages and the index that lists them |
| Worked examples | `assets/examples/` | Whole pages built from the corpus, read when a template alone is unclear |
| Corpus validation | `scripts/` | Prove every template still renders after a change |

---

## 3. HOW IT WORKS

The workflow is template-first, and that is a constraint rather than a preference. A chart assembled from a template renders the way its gallery renders. A chart written freehand does not, and the failure shows up in a browser rather than in a check.

1. Read the request and name the comparison the reader needs to make.
2. Open the chart lookup in `references/` and resolve that comparison to one named chart type.
3. Open the gallery page the lookup names and find the card block for that type.
4. Take the render block from the card. Do not rewrite it.
5. Apply one color system from `assets/color/`. One per artifact.
6. Assemble a single self-contained file. The output opens in a browser with no install step.
7. Run the corpus validator before reporting the result.

### Current state of the corpus

The corpus directories exist and hold no charts yet. Until the chart lookup in `references/` names at least one chart type, this packet has nothing to serve. Defer the request and say the corpus is empty rather than writing a chart freehand, because a freehand chart is exactly what the template-first constraint exists to prevent.

---

## 4. RULES

### ✅ ALWAYS

- Take the render block from a template that already renders.
- Apply exactly one color system per artifact.
- Produce a single self-contained file that opens with no install step.
- Run the corpus validator before reporting a result.
- Author every chart and every palette in this packet.

### ❌ NEVER

- Never copy a template, a fragment or a snippet from an outside chart library into this packet. The corpus is authored here, and content under a license this repository cannot grant onward must not enter the tree.
- Never write a chart freehand when a template for its type exists.
- Never mix two color systems in one artifact.
- Never act as a separate advisor identity and never carry packet-level identity metadata.

### ⚠️ ESCALATE IF

- No chart type in the lookup answers the comparison the reader needs.
- The request wants a structure rather than values, which puts it on the `sk-create-diagram` side of the boundary.
- The corpus validator fails on a template you did not change.

---

## 5. REFERENCES

- `README.md` - packet overview and navigation.
- `references/README.md` - the reference index and the chart lookup once it is authored.
- `../mode-registry.json` - authoritative packet registration.
- `../hub-router.json` - parent routing policy.
- `../ROUTER.md` - stage-two leaf selection.

---

## 6. SUCCESS CRITERIA

- The artifact is one self-contained file that opens in a browser.
- Its render block traces back to a named template in the corpus.
- One color system is applied throughout.
- The corpus validator exits clean.

---

## 7. INTEGRATION POINTS

- Input: chart and report requests routed from the `sk-doc` hub.
- Output: a standalone HTML chart or report page.
- Neighbour: `sk-create-diagram` owns structural visuals, and the two are separated by what the artifact carries rather than by which one was asked first.

---

## 8. RELATED RESOURCES

- [`README.md`](./README.md) - what this packet is and how to navigate it.
- [`references/README.md`](./references/README.md) - the reference index for the chart lookup.
- [`scripts/README.md`](./scripts/README.md) - what the corpus validator checks.
- [`../sk-create-diagram/SKILL.md`](../sk-create-diagram/SKILL.md) - the structural-visual packet on the other side of this boundary.
- [`../SKILL.md`](../SKILL.md) - the hub that routes here.
