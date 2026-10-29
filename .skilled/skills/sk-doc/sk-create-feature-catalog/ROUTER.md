---
title: "Create Feature Catalog Router"
description: "Sibling router for sk-create-feature-catalog: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-feature-catalog router"
  - "sk-create-feature-catalog routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Create Feature Catalog Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when the `sk-doc` hub routes a current-state feature inventory here: the request names a feature catalog, a feature inventory, a catalog package or `/create:feature-catalog`, and the hub's `sk-create-feature-catalog` mode signal selects this packet, which it does only when the feature surface is too large for a trustworthy README summary and other docs need one stable list of feature names and links. It routes to two resource families: the scaffolds under `assets/`, where `assets/feature-catalog-template.md` builds the root catalog and `assets/feature-catalog-snippet-template.md` builds each per-feature file, and the overflow references under `references/`, where `references/README.md` is the route map, `references/examples.md` carries the worked live-catalog walkthrough and `references/common-pitfalls.md` the deep-dive pitfalls. `references/README.md` is the default resource and the fallback suggestion, and no other resource loads without an intent that selects it.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`root_catalog`** fires on `root catalog`, `feature catalog`, `capability inventory` and `catalog package` at weight 4. It selects `assets/feature-catalog-template.md` for the root catalog scaffold, then loads the flat markdown inventory under `references/` and `assets/`.
- **`per_feature_file`** fires on `per-feature files`, `source anchors`, `feature inventory` and `/create:feature-catalog` at weight 4. It selects `assets/feature-catalog-snippet-template.md` for each per-feature file, then loads the same flat inventory, with `references/examples.md` carrying the worked live-catalog walkthrough and `references/common-pitfalls.md` the deep-dive pitfalls and the template-versus-reference split.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's creation decision, family boundary, router resilience bullets and the resilient router pseudocode that reads them.

### Creation Decision

Create a feature catalog when the system needs a canonical capability inventory.

Strong signals:

- The feature surface is too large for a trustworthy README-only summary.
- Multiple docs need a stable source of truth for feature names and links.
- Reviewers or operators need one place to see what the system does now.
- Manual playbooks or specs need a canonical feature list to cross-reference.

Use a lighter alternative when:

- The system has only a handful of features.
- A README already provides a complete and stable inventory.
- The product is too volatile for a maintained catalog to stay accurate.

Decision rule:

```text
Need a stable, reviewable current-state inventory?
  YES -> Create a feature catalog package
  NO  -> Keep capability summary in README or install guide
```

### Family Boundary

This is a nested workflow packet under `sk-doc`. It carries its own `SKILL.md`, `README.md`, `references/`, `assets/`, and `changelog/`, but it must not define a packet-local `graph-metadata.json`; advisor identity lives at the `sk-doc` hub root.

### Router Resilience

This packet routes by whether the target needs a stable, reviewable current-state feature inventory. It does not use runtime keyed resource discovery through `references/<key>/` because its references are flat.

- Load optional markdown resources only after resolving them under this packet and confirming they exist.
- Treat `references/README.md` as the fallback route map when catalog necessity or target feature scope is unclear.
- Ask for the missing target system, feature scope, or inventory requirements instead of silently loading no resources.
- Do not add a full `references/<key>/` or `assets/<key>/` runtime-key router unless this packet gains real keyed resource subdirectories.

### Smart Router Pseudocode

For this flat-reference packet, the canonical resilient router discovers resources at call
time, guards and loads only what exists, scores the root-catalog vs per-feature-file intent,
and returns a disambiguation checklist rather than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Two routing targets; keywords come from this packet's activation triggers.
INTENT_MODEL = {
    "root_catalog": {"weight": 4, "keywords": ["root catalog", "feature catalog", "capability inventory", "catalog package"]},
    "per_feature_file": {"weight": 4, "keywords": ["per-feature files", "source anchors", "feature inventory", "/create:feature-catalog"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the target system, skill, or surface the catalog should cover",
    "Confirm whether the request needs the root catalog, per-feature files, or the full package",
    "Confirm where implementation source anchors and validation/test anchors live for the claimed features",
]

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, inventory, loaded, seen) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def score_intents(request) -> dict:
    text = request.text.lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw in cfg["keywords"]:
            if kw in text:
                scores[intent] += cfg["weight"]
    return scores

def route_feature_catalog_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: low confidence
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    intent = max(scores, key=scores.get)                      # Tier 2: happy path
    # Flat resource topology: no references/<key>/ subdirectories. The intent selects the
    # root-catalog or per-feature template already documented above, not a keyed subtree.
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"intent": intent, "resources": loaded}
```
