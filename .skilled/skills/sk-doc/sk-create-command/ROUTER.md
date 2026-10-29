---
title: "Create Command Router"
description: "Sibling router for sk-create-command: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-command router"
  - "sk-create-command routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Create Command Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they ask to create an OpenCode slash command, refactor a command into a thin router plus an owned presentation asset, add or repair `argument-hint` and `allowed-tools`, design `$ARGUMENTS` handling or `:auto` and `:confirm` mode routing, author a namespace command, or check whether a workflow should be a command rather than a skill, agent or one-off task. It routes to two resource families: the flat single-concern files under `references/`, where `references/README.md` is both the route map and the fallback when the command purpose or component surface is unclear, and this packet's command templates under `assets/`, where `command-template.md`, `command-router-template.md` and `command-presentation-template.md` carry the skeletons and `command-contract.json` the machine-readable family contract.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`COMMAND_AUTHORING`** fires on `create command`, `slash command`, `OpenCode command`, `command template`, `argument-hint`, `allowed-tools`, `router presentation split`, `thin router`, `presentation contract` and `$ARGUMENTS`, and resolves the request through the command-authoring intent and the component surface it names. It selects this packet's flat markdown inventory, the single-concern files under `references/` and the command templates under `assets/`, and loads only the ones that exist.
- **`UNKNOWN_FALLBACK`** fires when no intent is selected, or the command purpose, invocation shape or component type is unclear. It loads `references/README.md`, the route map, and asks for the missing one rather than loading nothing.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the packet's router resilience rules and its resource loading sequence.

### Router Resilience

This packet routes by command-authoring intent and the requested component surface. It does not use runtime keyed resource discovery through `references/<key>/` because its references are flat.

- Load optional markdown resources only after resolving them under this packet and confirming they exist.
- Treat `references/README.md` as the fallback route map when command intent or component surface is unclear.
- Ask for the missing command purpose, invocation shape, or component type instead of silently loading no resources.
- Do not add a full `references/<key>/` or `assets/<key>/` runtime-key router unless this packet gains real keyed resource subdirectories.

### Resource Loading Sequence

The packet keeps its existing flat-resource routing while using the shared resilience call sequence:

```python
def discover_markdown_resources():
    return flat markdown resources under this packet's `references/` and `assets/` folders

def _guard_in_skill(relative_path):
    # Keep packet-local markdown paths in scope; retain explicitly documented shared routes.
    confirm the path is an allowed markdown resource for this packet

def load_if_available(relative_path, inventory, seen):
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        seen.add(guarded)

def route_create_command_request(request):
    inventory = discover_markdown_resources()
    intents = score_intents(request)  # command-authoring intent and component surface
    selected = select_intents(intents)
    routing_key = get_routing_key(request, selected)
    if not selected or the command purpose or component surface is unclear:
        load_if_available("references/README.md", inventory, seen)
        return UNKNOWN_FALLBACK
    return route by the existing command-authoring intent and component-surface rules
```

`UNKNOWN_FALLBACK` asks for the command purpose, invocation shape, or component type. The sequence discovers the current flat resources at routing time, guards and loads only available resources without duplicates, then applies the activation triggers and command-type rules already defined above.
