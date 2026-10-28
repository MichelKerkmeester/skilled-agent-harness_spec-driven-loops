---
name: "{{HUB_NAME}}"
description: TODO hub description — routes the {{MODE}} workflow packet via mode-registry.json (fill in ≤130 chars).
allowed-tools: "{{ALLOWED_TOOLS}}"
version: 1.2.3.0
---

# {{HUB_TITLE}}

Routing hub for the `{{MODE}}` workflow packet.

---

## 1. WHEN TO USE

Use this hub when a request belongs to the `{{HUB_NAME}}` skill family. The hub selects a `workflowMode` through `mode-registry.json` and delegates execution to the matching packet.

Do not put packet-specific workflow logic in this hub.

---

## 2. SMART ROUTING

Stage one picks the mode: `hub-router.json` scores the request and `mode-registry.json`
names the packet that `workflowMode` resolves to. Stage two picks the first leaves: the root
`ROUTER.md` maps the selected mode's intent to the packet-local resources it loads first.
The initial registry contains one mode, `{{MODE}}`, which routes to `{{PACKET}}/SKILL.md`.
A request no registered mode matches returns `UNKNOWN_FALLBACK`, never a silent default.
The agent runs the compiled-routing directive in the final MACHINE ROUTER section first.

---

## 3. HOW IT WORKS

1. Read `hub-router.json` and classify the request.
2. Resolve the selected `workflowMode` against `mode-registry.json`.
3. Load the registered packet's `SKILL.md`.
4. Execute the packet contract with its declared tool surface.
5. Ask for disambiguation when no registered mode is a safe match.

### Terms

This is the hub's only glossary. Its packets link here instead of defining routing terms.

| Term | Meaning |
|---|---|
| [TODO: Name a routing term this hub uses, e.g. `{{MODE}}` or `workflowMode`.] | [TODO: State what the term means in this hub.] |
| [TODO: Name a second routing term.] | [TODO: State what it means, in one sentence.] |

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

- `ROUTER.md`: stage-two control document, `stage1-only` on a fresh scaffold.
- `mode-registry.json`: workflow packet registry and tool surface.
- `hub-router.json`: routing policy, signals and vocabulary.
- `{{PACKET}}/SKILL.md`: the initial workflow packet contract.

---

## 6. RELATED RESOURCES

- `README.md`: short operator entry point.
- `graph-metadata.json`: hub discovery metadata.
- [`description.json`](../../../references/shared/skill-root-metadata-contract.md): hub-doctor metadata.

---

## 7. INTEGRATION POINTS

- Inputs: requests routed to the `{{HUB_NAME}}` hub.
- Routing: `hub-router.json` selects a `workflowMode` registered in `mode-registry.json`.
- Outputs: the selected packet's workflow result.

---

## 8. MACHINE ROUTER

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub {{HUB_NAME}} --prompt "<task>"
> ```
> Follow the returned decision: `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the registry routing in SMART ROUTING. The front door self-gates on serving-authority. Compiled routing is now the default for `{{HUB_NAME}}`. Set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide. That variable is the explicit kill-switch.

A fresh `{{HUB_NAME}}` ships without a compiled activation manifest, so the directive above returns the legacy sentinel until the hub is activated.

The compiled router reads the fallback checklist below. The hub's leaf routing lives in the root ROUTER.md.

```python
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
```
