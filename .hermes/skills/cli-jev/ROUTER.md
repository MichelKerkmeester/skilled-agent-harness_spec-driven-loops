---
title: "TypeSafe Jev CLI Transport - Typed Judgments for Dispatch Router"
description: "Sibling router for cli-jev: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-jev router"
  - "cli-jev routing"
importance_tier: normal
contextType: general
version: 1.0.1.0
router_state: active
skill_pointer: SKILL.md
---

# TypeSafe Jev CLI Transport - Typed Judgments for Dispatch Router

The machine router for [`SKILL.md`](../../../.skilled/skills/cli-classifier/cli-jev/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request reaches cli-jev when it needs a typed judgment rather than generated text: a yes/no
probability, one key from explicit options, an ordered score position, or several keyed answers in one
`run` call, and when it names `jev`, Jev, TypeSafe Jev, `noul`, `choice`, `score` or `jev-mcp` outright.
A script, hook or gate that needs a value it can compare is the same signal, because `--value` and the
exit code are then the whole interface. The router selects from three families: `references/` for the
CLI contract, the integration patterns, the provider setup and the MCP server, `assets/` for the
question-shaping card, and `feature-catalog/` plus `manual-testing-playbook/` only when a request names
them explicitly.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`JEV_JUDGMENT`** — "ask jev", "jev judgment", "jev noul", "jev choice", "jev score", "jev urgency check", "jev yes or no", "jev probability", "cli-jev" or "cli-usage" fires it, and the route loads `references/cli-reference.md` and `references/integration-patterns.md`.
- **`JEV_QUESTION`** — "jev pick one", "jev options", "jev question", "shape a jev question", "jev batch", "jev run", "several jev questions" or "jev question card" fires it, and the route loads `assets/question-shaping-card.md` on top of the `references/cli-reference.md` and `references/integration-patterns.md` baseline every scored route loads first.
- **`JEV_PROVIDER`** — "jev provider", "jev model id", "jev model", "jev openrouter", "jev official provider", "jev auth status" or "jev auth" fires it, and the route loads `references/providers-and-models.md` on top of the `references/cli-reference.md` and `references/integration-patterns.md` baseline every scored route loads first.
- **`JEV_MCP`** — "jev mcp", "jev mcp host", "jev mcp server" or "expose jev" fires it, and the route loads `references/mcp-server.md` on top of the same CLI baseline.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's deterministic routing detail: the prerequisite probe, the phase tree, the resource domains, the loading levels and the discovery pseudocode that reads them.

### Prerequisite Detection

Run these before constructing a command:

```bash
command -v jev && jev --version      # jev 0.6.2 at the pinned contract
jev auth status                      # {"ok": true, "stored": true, "store": "..."} or exit 3
```

`command -v jev` decides whether the route exists. `auth status` decides whether a judgment is
possible, and it never prints the key. Use `jev auth test` when the key must be proven accepted: it
sends a minimal request and reports `{"ok": true, "valid": true, "model": "..."}`.

### Phase Detection

```text
JEV TASK
    |
    +- STEP 0: Detect the intent: JEV_JUDGMENT, JEV_QUESTION, JEV_PROVIDER or JEV_MCP
    +- STEP 1: Score intents (top-2 when ambiguity is small)
    +- Phase 1: Availability (command -v jev and jev auth status before the first judgment)
    +- Phase 2: Judgment (one typed subcommand: noul, choice, score or run)
    +- Phase 3: Verification (read the exit code before trusting the payload)
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies
intent scoring from `INTENT_MODEL`.

```text
references/   one document per routed intent
assets/       the question-shaping card
```

- `references/` holds the CLI contract, the integration patterns, the provider setup and the MCP
  server, selected by intent.
- `assets/` holds the question-shaping card, loaded when the question itself needs drafting.
- `feature-catalog/` and `manual-testing-playbook/` hold the capability index and the deterministic
  scenarios, read only on explicit request.

### Resource Loading Levels

| Level | When to Load | Resources |
| ----------- | ------------------------ | ---------------------------- |
| ALWAYS | Every routed request (a no-match loads nothing) | `references/cli-reference.md`, `references/integration-patterns.md` |
| CONDITIONAL | If intent signals match | `references/providers-and-models.md`, `references/mcp-server.md`, `assets/question-shaping-card.md` |
| ON_DEMAND | Only on explicit request | `feature-catalog/feature-catalog.md`, `manual-testing-playbook/manual-testing-playbook.md` |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
# Baseline for every scored route, as in the hub ROUTER.md. A no-match loads nothing.
DEFAULT_RESOURCES = ["references/cli-reference.md", "references/integration-patterns.md"]

INTENT_MODEL = {
    "JEV_JUDGMENT": {"keywords": [("ask jev", 4), ("jev judgment", 4), ("jev noul", 4), ("jev choice", 4), ("jev score", 4), ("jev urgency check", 4), ("jev yes or no", 4), ("jev probability", 4), ("cli-jev", 4), ("cli-usage", 4)]},
    "JEV_QUESTION": {"keywords": [("jev pick one", 3), ("jev options", 3), ("jev question", 3), ("shape a jev question", 3), ("jev batch", 3), ("jev run", 3), ("several jev questions", 3), ("jev question card", 3)]},
    "JEV_PROVIDER": {"keywords": [("jev provider", 3), ("jev model id", 3), ("jev model", 3), ("jev openrouter", 3), ("jev official provider", 3), ("jev auth status", 3), ("jev auth", 3)]},
    "JEV_MCP": {"keywords": [("jev mcp", 3), ("jev mcp host", 3), ("jev mcp server", 3), ("expose jev", 3)]},
}

RESOURCE_MAP = {
    "JEV_JUDGMENT": ["references/cli-reference.md", "references/integration-patterns.md"],
    "JEV_QUESTION": ["references/cli-reference.md", "assets/question-shaping-card.md"],
    "JEV_PROVIDER": ["references/providers-and-models.md"],
    "JEV_MCP": ["references/mcp-server.md"],
}

LOAD_LEVELS = {
    "JEV_JUDGMENT": "ALWAYS",
    "JEV_QUESTION": "CONDITIONAL",
    "JEV_PROVIDER": "CONDITIONAL",
    "JEV_MCP": "CONDITIONAL",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the request is a judgment, a question to shape, a provider question or an MCP host question",
    "Confirm which judgment type is needed: noul, choice, score or run",
    "Confirm the question and the state the judgment is scored against",
    "Confirm a credential resolves for the selected provider before a judgment is expected",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def get_routing_key(task, intents: list[str]) -> str:
    override = str(getattr(task, "routing_key", "")).strip().lower()
    if override:
        return override
    return (intents[0] if intents else "unknown").lower()

def classify_intents(user_request, task=None):
    text = (user_request or "").lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for keyword, weight in cfg["keywords"]:
            if keyword in text:
                scores[intent] += weight

    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
    if primary_score == 0:
        return ("JEV_JUDGMENT", None, scores)

    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_jev_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    intents = [primary] + ([secondary] if secondary else [])
    routing_key = get_routing_key(task, intents)
    loaded, seen = [], set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for relative_path in DEFAULT_RESOURCES:
        load_if_available(relative_path)

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    return {
        "routing_key": routing_key,
        "intents": intents,
        "intent_scores": scores,
        "load_level": LOAD_LEVELS.get(primary, "CONDITIONAL"),
        "resources": loaded,
    }
```
