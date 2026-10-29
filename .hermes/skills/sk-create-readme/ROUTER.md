---
title: "Create README (workflow) Router"
description: "Sibling router for sk-create-readme: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-readme router"
  - "sk-create-readme routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Create README (workflow) Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-doc/sk-create-readme/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name a README, a folder readme, a code-folder readme or `/create:readme`, and when they ask for developer orientation on a project, skill, feature, component or source-code directory. It routes to three artifact templates under `assets/`: `readme-template.md` for a general README, `readme-code-template.md` for a source-code folder and `architecture-template.md` for a skill package's `ARCHITECTURE.md`. It falls back to `references/README.md` and the `references/readme/` overflow group when the artifact type or folder purpose is unclear.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`readme`** fires on `readme`, `folder readme`, `create readme`, `write readme`, `project readme` and `skill readme` at weight 4. It selects `assets/readme-template.md`, and `assets/architecture-template.md` when the target is a skill package's `ARCHITECTURE.md`, then loads the flat markdown inventory under `references/` and `assets/`.
- **`code_readme`** fires on `code folder readme`, `source-code folder readme` and `source code readme` at weight 4. It selects `assets/readme-code-template.md` and loads the same flat inventory, with `references/readme/` carrying the extended code-folder voice and pattern detail.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's artifact table, its router resilience rules, its prompt-intent projection and its README decision tree.

Route by artifact type first, then by folder purpose.

| Request | Output | Primary Template |
| --- | --- | --- |
| Project, skill, feature or component README | `README.md` in the target folder | `assets/readme-template.md` |
| Source-code folder README | `README.md` in the source folder | `assets/readme-code-template.md` |
| Skill package architecture document | `ARCHITECTURE.md` at the skill package root | `assets/architecture-template.md` |

This packet uses simple artifact routing. It selects general README or code-folder README behavior from request intent and target-folder purpose. It does not use runtime keyed resource discovery by project, stack, mode or model. The only packet-local resource groups are `references/readme/` and `assets/`.

Router resilience rules:

- Load optional markdown resources only after resolving them under this packet and confirming they exist.
- Treat `references/README.md` as the fallback route map when artifact type or folder purpose is unclear.
- Ask for the missing artifact type, target folder or validation expectation instead of silently loading no resources.
- Do not add a full `references/<key>/` or `assets/<key>/` runtime-key router unless this packet gains real keyed resource subdirectories.

### Smart Router Pseudocode

For this flat-reference packet, the canonical resilient router discovers resources at call
time, guards and loads only what exists, scores the two artifact intents, and returns a
disambiguation checklist rather than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Two output artifacts; keywords come from this packet's activation triggers.
INTENT_MODEL = {
    "readme": {"weight": 4, "keywords": ["readme", "folder readme", "create readme", "write readme", "project readme", "skill readme"]},
    "code_readme": {"weight": 4, "keywords": ["code folder readme", "source-code folder readme", "source code readme"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the artifact type (general README vs code README)",
    "Confirm the target folder",
    "Confirm the validation expectation",
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

def route_readme_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: unclear artifact type
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    artifact_type = max(scores, key=scores.get)               # Tier 2: happy path
    # references/readme/ is an artifact group, not a runtime key-space: this packet does
    # not use runtime keyed resource discovery. The artifact type selects the template
    # already documented above; load the flat refs that exist.
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"artifact_type": artifact_type, "resources": loaded}
```

Use this README decision tree:

```text
Is this a project root?
+-- YES: write a general README using the sections the audience needs
`-- NO: is this a reusable component?
    +-- YES: write a component README trimmed to API, examples, configuration and known issues
    `-- NO: is someone likely to land here?
        +-- YES: write a focused README with overview plus needed navigation or usage
        `-- NO: skip README and use inline comments or parent documentation
```
