---
name: {{PACKET_NAME}}
description: TODO — the primary workflow packet for the {{HUB_NAME}} hub (fill in ≤130 chars).
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

# {{PACKET_TITLE}}

Primary workflow packet for the `{{HUB_NAME}}` routing hub.

---

## 1. WHEN TO USE

Use this packet when the parent hub selects the `primary` workflow mode.

Do not invoke it as a separate advisor identity; routing belongs to the parent hub.

---

## 2. SMART ROUTING

The parent hub resolves the packet through `mode-registry.json`. Packet-local markdown resources can be selected with the guarded pattern below when the workflow grows.

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
