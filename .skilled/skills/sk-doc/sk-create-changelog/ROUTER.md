---
title: "create-changelog Router"
description: "Sibling router for sk-create-changelog: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-changelog router"
  - "sk-create-changelog routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# create-changelog Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name a global component changelog, the `/create:changelog` command, release notes or the next four-part version, and when a changed spec folder, a component hint or recent git history needs resolving into a changelog target. A packet-local request also lands here, and the packet refuses it as deprecated and offers a global entry instead. It routes to two resource families: `assets/changelog-template.md`, which owns what an entry says and how it reads, and the flat `references/` set that `references/README.md` maps, carrying the worked examples, the version-bump rules and the topology edge cases.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`global_component`** (weight 4) fires on `global changelog`, `release notes`, `component`, `--release` and `--bump`; it loads `references/README.md` as the always-loaded default, then the flat markdown inventory under `references/` and `assets/`, which is `assets/changelog-template.md`, `references/worked-examples.md`, `references/version-bump-rules.md` and `references/topology-edge-cases.md`.
- **`packet_local`** (weight 4) fires on `packet-local changelog`, `nested changelog` and `--nested`; it loads nothing and writes nothing, returning the refusal with the offer of a global component entry, because packet-local changelogs are deprecated while the intent stays so a request that lands here is refused rather than silently routed.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail that does not fit the short summary: the family boundary, the router-resilience rules and the resource-discovery pseudocode.

### Family Boundary

This is a nested workflow packet under `sk-doc` and owns changelog authoring only. The single advisor identity lives at the `sk-doc` hub root, so never add a packet-local `graph-metadata.json`.

### Router Resilience

The packet has one output mode, the global component entry (section 6). The advisor does not guarantee that a packet-local request lands here. When one does, the router refuses it as deprecated and offers a global entry. Its references are flat, so it uses no `references/<key>/` discovery.

- Load an optional resource only after resolving it under this packet and confirming it exists.
- Treat `references/README.md` as the fallback route map when the topology or output mode is unclear.
- Ask for the missing source type, target or version intent instead of silently loading nothing.
- Add a `references/<key>/` runtime-key router only if the packet gains keyed subdirectories.

### Smart Router Pseudocode

The resilient router discovers resources at call time, loads only what exists, scores the global intent against the deprecated packet-local one, refuses a packet-local request without writing and returns a disambiguation checklist rather than loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Two intents, one output mode. Keywords come from this packet's activation triggers.
INTENT_MODEL = {
    "global_component": {"weight": 4, "keywords": ["global changelog", "release notes", "component", "--release", "--bump"]},
    # Deprecated: kept so a packet-local request that lands here is refused and offered a global entry.
    "packet_local": {"weight": 4, "keywords": ["packet-local changelog", "nested changelog", "--nested"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the change source (component hint, git history, or spec folder)",
    "Confirm the global component the change belongs to",
    "Confirm the four-part version and whether --bump/--release applies",
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

def route_changelog_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: unclear source/mode
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    output_mode = max(scores, key=scores.get)                # Tier 2: pick the intent
    if output_mode == "packet_local":                        # Deprecated: refuse and write nothing
        return {
            "output_mode": "refused",
            "writes": [],
            "message": "Packet-local changelogs are deprecated. Spec folders no longer get changelogs.",
            "offer": "Write a global component entry under .skilled/changelog/ instead (section 4)",
        }
    # Flat resource topology: no references/<key>/ subdirectories. The mode selects the
    # generator target documented above, not a keyed subtree; load the flat refs that exist.
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"output_mode": output_mode, "resources": loaded}
```
