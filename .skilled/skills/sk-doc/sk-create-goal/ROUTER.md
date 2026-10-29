---
title: "Create Packet Goals Router"
description: "Sibling router for sk-create-goal: the intent model, the default resource and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-goal router"
  - "sk-create-goal routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Create Packet Goals Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request to author or revise a packet `goal.md` reaches sk-create-goal, whether it targets a top-level goal, a phase-parent goal, a nested phase-child goal, a packet that has none yet, a newly added phase or an over-budget parent that needs cutting. The same packet also answers `/create:goal` and a request to print a parent goal's chat slice, while a request to set, bind or resend a session objective leaves for the goal hooks. This router picks from the workflow reference, the authoring standards and exemplars, the per-kind templates and the budget-and-handoff reference rather than from the whole folder.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **GOAL_AUTHORING** — "top-level goal / phase-parent goal / nested phase-child goal / retrofit an existing packet / add a phase / amend the parent" requests load `references/parent-and-nested-goals.md` and follow the workflow for that goal kind.
- **CONTENT_STANDARDS** — every authoring or revision request also loads `references/authoring-standards.md`, `assets/goal-exemplars.md` and the template for the goal's kind: `assets/goal-top-level-template.md`, `assets/goal-phase-parent-template.md` or `assets/goal-phase-child-template.md`.
- **BUDGET_AND_HANDOFF** — "budget / 4,000 characters / cut order / chat slice / resend the parent" requests load `references/budget-and-handoff.md`, which also carries the projection distinction and the runtime matrix.
- **UNKNOWN_FALLBACK** — a request whose resources match no intent loads `references/parent-and-nested-goals.md` as the workflow default and reports `UNKNOWN_FALLBACK` with the disambiguation checklist instead of guessing a family.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's pre-write routing decisions, its resource discovery and fallback rule, and the router block that encodes them.

### Pre-Write Routing Decisions

Run these four decisions before writing:

1. **File content or session state?** A request to author or revise a packet's `goal.md` is file work. A request to set, bind, inject or resend a session objective belongs to the goal hooks or the host's native goal command. Redirect session-state requests without editing a packet goal.
2. **Does the packet exist? What role does it have?** Confirm the target directory exists. A nested phase child has a parent directory containing `spec.md`. A packet with direct phase-child directories is the phase parent. Otherwise, treat it as a top-level packet. If the packet is missing, route packet creation to system-spec-kit first.
3. **Does `goal.md` exist?** Revise an existing goal. Add one to an existing packet that has none. Do not treat a missing packet as a goal-file request.
4. **Does a child change alter a parent decision or criterion?** If it does, amend the parent first. Then print the updated parent chat slice for the operator to resend. Do not let a child goal override a parent decision.

### Resource Discovery And Fallback

Discover reference and asset documents at call time, and keep loads inside this packet.
- Top-level, phase-parent and nested-child authoring, retrofit, phase-add or parent amendment work: load [`references/parent-and-nested-goals.md`](references/parent-and-nested-goals.md) and follow the matching workflow.
- Every goal authoring or revision request: also load [`references/authoring-standards.md`](references/authoring-standards.md), [`assets/goal-exemplars.md`](assets/goal-exemplars.md) and the template for the goal's kind before drafting.
- A budget measurement or chat-slice handoff: load [`references/budget-and-handoff.md`](references/budget-and-handoff.md).

Fall back to the workflow reference when no specific resource applies:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/parent-and-nested-goals.md"
UNKNOWN_FALLBACK = {
    "load_level": "UNKNOWN_FALLBACK",
    "needs_disambiguation": True,
    "resources": [],
}

def discover_markdown_resources():
    documents = []
    for base in RESOURCE_BASES:
        if base.exists():
            documents.extend(path for path in base.rglob("*.md") if path.is_file())
    return {path.relative_to(SKILL_ROOT).as_posix() for path in documents}

def _guard_in_skill(relative_path):
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError("Only packet-local markdown resources are routable")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def route_references(selected):
    inventory = discover_markdown_resources()
    loaded = []
    seen = set()
    for relative_path in selected:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)
    if not loaded:
        fallback = _guard_in_skill(DEFAULT_RESOURCE)
        if fallback in inventory:
            load(fallback)
            loaded.append(fallback)
        return {**UNKNOWN_FALLBACK, "resources": loaded}
    return {"resources": loaded}
```
