---
name: {{HUB_NAME}}
description: TODO hub description — routes the {{MODE}} workflow packet via mode-registry.json (fill in ≤130 chars).
allowed-tools: {{ALLOWED_TOOLS}}
version: 1.0.0.0
---

# {{HUB_TITLE}}

Routing hub for the `{{MODE}}` workflow packet.

---

## 1. WHEN TO USE

Use this hub when a request belongs to the `{{HUB_NAME}}` skill family. The hub selects a `workflowMode` through `mode-registry.json` and delegates execution to the matching packet.

Do not put packet-specific workflow logic in this hub.

---

## 2. SMART ROUTING

`mode-registry.json` defines the available workflow packets. `hub-router.json` supplies the routing policy and intent signals used to select a `workflowMode`.

> **Compiled routing (default-on fleet-wide, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .opencode/bin/compiled-route.cjs --hub {{HUB_NAME}} --prompt "<task>"
> ```
> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving authority. Compiled routing is now the default for the seven proven hubs (`sk-code`, `sk-design`, `sk-doc`, `sk-prompt`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`); `SPECKIT_COMPILED_ROUTING=0` is the fleet-wide kill-switch. A newly scaffolded `{{HUB_NAME}}` ships without a compiled activation manifest, so this directive stays inert (legacy sentinel) until `{{HUB_NAME}}` completes its own compiled-routing activation and is added to the default-on cohort.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
UNKNOWN_FALLBACK_CHECKLIST = [
    "Name the requested workflow outcome.",
    "Name the target component or document.",
    "Confirm whether the request may mutate workspace files.",
]
UNKNOWN_FALLBACK = {
    "load_level": "UNKNOWN_FALLBACK",
    "needs_disambiguation": True,
    "resources": [],
    "checklist": UNKNOWN_FALLBACK_CHECKLIST,
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
        raise ValueError("Only skill-local markdown resources are routable")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def route(request):
    registry = read_json(SKILL_ROOT / "mode-registry.json")
    router = read_json(SKILL_ROOT / "hub-router.json")
    workflow_mode = select_workflow_mode(request, router)
    entry = find_mode(registry, workflow_mode)
    if not entry:
        return UNKNOWN_FALLBACK
    resource = _guard_in_skill(f"{entry['packet']}/SKILL.md")
    return {"workflowMode": workflow_mode, "resources": [resource]}
```

The initial registry contains one mode, `{{MODE}}`, which routes to `{{PACKET}}/SKILL.md`.

---

## 3. HOW IT WORKS

1. Read `hub-router.json` and classify the request.
2. Resolve the selected `workflowMode` against `mode-registry.json`.
3. Load the registered packet's `SKILL.md`.
4. Execute the packet contract with its declared tool surface.
5. Ask for disambiguation when no registered mode is a safe match.

---

## 4. RULES

### ✅ ALWAYS

- Resolve workflow packets through `mode-registry.json`.
- Apply the routing policy from `hub-router.json`.
- Keep detailed workflow behavior inside the registered packet.

### ❌ NEVER

- Never create a second advisor identity for a nested packet.
- Never add packet-specific workflow logic to this hub.
- Never load resources outside the hub directory.

### ⚠️ ESCALATE IF

- The request does not map safely to a registered `workflowMode`.
- Registry and router metadata disagree.
- A packet requests tools outside its declared tool surface.

---

## 5. REFERENCES

- `mode-registry.json` — workflow packet registry and tool surface.
- `hub-router.json` — routing policy, signals, and vocabulary.
- `{{PACKET}}/SKILL.md` — the initial workflow packet contract.

---

## 6. RELATED RESOURCES

- `README.md` — short operator entry point.
- `graph-metadata.json` — hub discovery metadata.
- `description.json` — advisor-facing hub description.

---

## 7. INTEGRATION POINTS

- Inputs: requests routed to the `{{HUB_NAME}}` hub.
- Routing: `hub-router.json` selects a `workflowMode` registered in `mode-registry.json`.
- Outputs: the selected packet's workflow result.
