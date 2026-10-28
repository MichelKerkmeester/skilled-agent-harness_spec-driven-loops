---
name: "{{PACKET_NAME}}"
description: TODO — the primary workflow packet for the {{HUB_NAME}} hub (fill in ≤130 chars).
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.2.1.0
---

# {{PACKET_TITLE}}

Primary workflow packet for the `{{HUB_NAME}}` routing hub.

---

## 1. WHEN TO USE

Use this packet when the parent hub selects the `primary` workflow mode.

Do not invoke it as a separate advisor identity; routing belongs to the parent hub.

---

## 2. SMART ROUTING

The parent hub resolves this packet through `mode-registry.json`: `hub-router.json` scores the
request, the winning `workflowMode` names this packet, and the hub loads this `SKILL.md` first.

The hub's root `ROUTER.md` names this packet's first leaves, so leaf selection stays in the hub
router rather than in this file. When the workflow grows, the packet's own `references/` and
`assets/` hold the optional material those leaves name, and nothing loads before a leaf selects it.

A request that matches no registered mode returns `UNKNOWN_FALLBACK`, never a silent default.
That fallback asks for disambiguation instead of guessing a packet.
The machine router is the final MACHINE ROUTER section.

---

## 3. HOW IT WORKS

1. Receive the request selected by the parent hub.
2. Confirm the requested outcome and applicable constraints.
3. Execute the smallest workflow that satisfies the request.
4. Run the relevant verification before returning the result.

---

## 4. RULES

### ✅ ALWAYS

- Follow the parent hub's selected workflow mode.
- Stay within the declared tool surface.
- Verify the result before reporting completion.

### ❌ NEVER

- Never act as a separate advisor identity.
- Never bypass the parent hub's routing decision.
- Never load resources outside this packet directory.

### ⚠️ ESCALATE IF

- The request conflicts with the packet's workflow boundary.
- Required tools are outside the declared tool surface.
- Verification fails or the expected outcome is unclear.

---

## 5. REFERENCES

- `README.md` — packet overview.
- `../mode-registry.json` — authoritative packet registration.
- `../hub-router.json` — parent routing policy.

---

## 6. SUCCESS CRITERIA

- The selected workflow outcome exists.
- Required verification passes.
- Remaining uncertainty is reported.

---

## 7. INTEGRATION POINTS

- Input: requests routed from the `{{HUB_NAME}}` hub.
- Output: the verified primary workflow result.

---

## MACHINE ROUTER

The router below selects packet-local resources when the workflow grows; it stays illustrative until the selection logic is authored.

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
