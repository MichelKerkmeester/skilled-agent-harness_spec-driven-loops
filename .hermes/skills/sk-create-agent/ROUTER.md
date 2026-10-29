---
title: "Create Agent - Runtime Persona Authoring Router"
description: "Sibling router for sk-create-agent: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-agent router"
  - "sk-create-agent routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Create Agent - Runtime Persona Authoring Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-doc/sk-create-agent/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when a request names `create agent`, `/create:agent`, an OpenCode agent, a Claude Code agent, an agent file, a new agent, an agent persona, agent frontmatter, a permission object or an authority boundary, and when someone asks whether the component they want is an agent, a skill or a command. It routes to two resource families: `assets/agent-template.md`, the scaffold the creation workflow starts from, and the packet's flat `references/` group, where `references/README.md` is the route map and the fallback, with `references/agent-vs-skill-vs-command.md`, `references/permission-design.md` and `references/common-pitfalls.md` carrying the depth.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`opencode_agent`** fires on `opencode agent`, `permission object` and `.skilled/agents` at weight 4. It selects the `permission:` object schema and the OpenCode agent directory, then loads the packet's flat inventory: `references/README.md`, `references/agent-vs-skill-vs-command.md`, `references/permission-design.md`, `references/common-pitfalls.md` and `assets/agent-template.md`.
- **`claude_agent`** fires on `claude code agent` and `.claude/agents` at weight 4. It selects the `tools:` allow-list schema and the Claude Code agent directory, and loads the same five files.
- **`agent_authoring`** fires on `create agent`, `/create:agent`, `agent file`, `new agent`, `agent persona`, `agent frontmatter`, `authority boundary` and `agent template` at weight 4. It selects the authoring workflow and body shape rather than one runtime schema, and loads the same five files.

All three keys share one flat resource topology: the intent chooses the runtime schema and the body shape, never a keyed subtree. A request that scores below 4 on every key loads `references/README.md` alone and returns `UNKNOWN_FALLBACK` with the checklist below.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the packet's component decision, its smart-router pseudocode and its router resilience rules.

Decision rule:

```text
Need a named runtime persona with authority and tool policy?
  YES -> Create an agent
  NO  -> Use or create a skill, template, or command instead
```

### Smart Router Pseudocode

For this flat-reference packet, the canonical resilient router discovers resources at call
time, guards and loads only what exists, scores the runtime-target and agent-authoring
intents, and returns a disambiguation checklist rather than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Three routing targets; keywords come from this packet's activation triggers.
INTENT_MODEL = {
    "opencode_agent": {"weight": 4, "keywords": ["opencode agent", "permission object", ".skilled/agents"]},
    "claude_agent": {"weight": 4, "keywords": ["claude code agent", ".claude/agents"]},
    "agent_authoring": {"weight": 4, "keywords": ["create agent", "/create:agent", "agent file", "new agent", "agent persona", "agent frontmatter", "authority boundary", "agent template"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the runtime target directory (.skilled/agents/ or .claude/agents/)",
    "Confirm the permission or authority boundary the agent needs (tool access, task/orchestration authority)",
    "Confirm this needs a new agent rather than a skill, command, or an existing agent",
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

def route_agent_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: unclear component/runtime/authority
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    intent = max(scores, key=scores.get)                     # Tier 2: happy path
    # Flat resource topology: no references/<key>/ subdirectories. The intent selects the
    # runtime frontmatter schema and body shape already documented above, not a keyed subtree.
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"intent": intent, "resources": loaded}
```

### Router Resilience

This packet routes by component choice and runtime-persona requirements. It does not use runtime keyed resource discovery through `references/<key>/` because its references are flat.

- Load optional markdown resources only after resolving them under this packet and confirming they exist.
- Treat `references/README.md` as the fallback route map when the component choice or runtime-persona requirements are unclear.
- Ask for the missing component type, runtime profile, or authority requirements instead of silently loading no resources.
- Do not add a full `references/<key>/` or `assets/<key>/` runtime-key router unless this packet gains real keyed resource subdirectories.
