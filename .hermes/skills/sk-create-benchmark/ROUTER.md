---
title: "create-benchmark Router"
description: "Sibling router for sk-create-benchmark: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-benchmark router"
  - "sk-create-benchmark routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# create-benchmark Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-doc/sk-create-benchmark/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name a benchmark report, a benchmark package or a behavior benchmark, and when they ask to promote a completed MCP bake-off or to author a scenario contract, a `behavior-benchmark.md` index or a `claude-baseline.md`. It routes to two families: `references/shared/` beside `assets/shared/` for MCP promotion, and `references/behavior-benchmark/` beside `assets/behavior-benchmark/` for behavior. It falls back to `references/shared/README.md` when the family is unresolved, and it never routes to the behavior measurement framework, which stays lane-owned in `system-deep-loop`.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`MCP_PROMOTION`** fires on `benchmark-report.md`, `source.md`, `mcp-server/benchmarks`, `mcp bake-off` and `mcp promotion` at weight 4. It selects `assets/shared/benchmark-report-template.md` and `assets/shared/source-template.md`, then loads `references/shared/README.md`, `references/shared/case-studies.md`, `references/shared/pitfalls.md` and `references/shared/worked-example.md`.
- **`BEHAVIOR_BENCHMARK`** fires on `behavior benchmark`, `behavior-benchmark.md`, `behavior_benchmark` and `scenario contract` at weight 4. It selects `assets/behavior-benchmark/behavior-benchmark-index-template.md`, `assets/behavior-benchmark/behavior-benchmark-scenario-template.md` and `assets/behavior-benchmark/behavior-benchmark-baseline-template.md`, then loads `references/behavior-benchmark/behavior-benchmark-guide.md` and the same four `references/shared/` files: `README.md`, `case-studies.md`, `pitfalls.md` and `worked-example.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's benchmark family table, routing decision, family boundary and the resilient router pseudocode that reads them.

### Benchmark Families

Route to the right family before authoring. The **OWNS** column is what this packet authors; **Routes to** names a lane-owned artifact (renderer, scoring contract, runner) for disambiguation only.

| Family | What it measures | Lives at | create-benchmark OWNS (here) | Routes to (lane-owned) | Section |
| --- | --- | --- | --- | --- | --- |
| MCP promotion (`shared`) | Retrieval / quality / runtime / throughput from a shipped MCP stack | `<skill>/mcp-server/benchmarks/benchmark-<YYYY-MM-DD>/` | `benchmark-report.md` + `source.md` templates and the report contract | Owned here | §3-8 |
| Behavior (`behavior_benchmark`) | Executor-model behavior at a deep-loop mode's invocation surface | `<mode>/behavior-benchmark/` | Index, scenario, and baseline templates + the authoring guide | Measurement contract → `system-deep-loop/shared/behavior-benchmark/framework.md` | §9 |

### Routing Decision

Route by the table. Never change lane-local scoring.

### Smart Router Pseudocode

Benchmark families are runtime keys. Use canonical `discover_markdown_resources()` and
`_guard_in_skill()` ([skill-smart-router.md](../../../.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md));
only family keys and tiered fallback vary:

```python
DEFAULT_RESOURCE = "references/shared/README.md"
FAMILIES = ["behavior_benchmark", "mcp_promotion"]
# Resource dirs are kebab-case; family keys remain snake_case machine identifiers.
# mcp_promotion templates live under shared/.
FAMILY_DISK_KEY = {"mcp_promotion": "shared"}

INTENT_MODEL = {
    "MCP_PROMOTION": {"weight": 4, "keywords": ["benchmark-report.md", "source.md", "mcp-server/benchmarks", "mcp bake-off", "mcp promotion"]},
    "BEHAVIOR_BENCHMARK": {"weight": 4, "keywords": ["behavior benchmark", "behavior-benchmark.md", "behavior_benchmark", "scenario contract"]},
}

# The family-keyed selection below resolves to exactly these sets. Enumerating
# them keeps the routed inventory legible to a reader and to the connectivity
# scan, which is what catches a new reference the keyed load silently picks up
# but no documented route names.
RESOURCE_MAP = {
    "MCP_PROMOTION": [
        "references/shared/README.md", "references/shared/case-studies.md",
        "references/shared/pitfalls.md", "references/shared/worked-example.md",
        "assets/shared/benchmark-report-template.md", "assets/shared/source-template.md",
    ],
    "BEHAVIOR_BENCHMARK": [
        "references/shared/README.md", "references/shared/case-studies.md",
        "references/shared/pitfalls.md", "references/shared/worked-example.md",
        "references/behavior-benchmark/behavior-benchmark-guide.md",
        "assets/behavior-benchmark/behavior-benchmark-index-template.md",
        "assets/behavior-benchmark/behavior-benchmark-scenario-template.md",
        "assets/behavior-benchmark/behavior-benchmark-baseline-template.md",
    ],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the benchmark family (MCP promotion, behavior)",
    "Confirm what is authored here vs lane-owned, then the storage location and run label",
]

def route_benchmark_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    routing_key = get_routing_key(request, FAMILIES)

    if routing_key == "unknown":                                 # Tier 1
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {"load_level": "UNKNOWN_FALLBACK",
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST, "resources": loaded}

    disk_key = FAMILY_DISK_KEY.get(routing_key, routing_key.replace("_", "-"))
    keyed = sorted(p for p in inventory if p.startswith(
        (f"references/{disk_key}/", f"assets/{disk_key}/", "references/shared/")))
    if not keyed:                                                # Tier 2
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {"routing_key": routing_key,
                "notice": f"'{routing_key}' guide only; fixtures/scoring stay lane-owned", "resources": loaded}

    for path in keyed:                                           # Tier 3
        load_if_available(path, inventory, loaded, seen)
    return {"routing_key": routing_key, "resources": loaded}
```

### Family Boundary

This packet owns authoring, not measurement contracts: rubrics, renderers, scorers, and evaluator/verdict contracts stay lane-local. The advisor identity lives at the `sk-doc` root; never add packet-local `graph-metadata.json`.
