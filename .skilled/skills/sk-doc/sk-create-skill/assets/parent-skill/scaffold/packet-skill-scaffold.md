---
name: "{{PACKET_NAME}}"
description: TODO — the primary workflow packet for the {{HUB_NAME}} hub (fill in ≤130 chars).
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.2.4.0
---

# {{PACKET_TITLE}}

Primary workflow packet for the `{{HUB_NAME}}` routing hub.

---

## 1. WHEN TO USE

Use this packet when the parent hub selects the `primary` workflow mode.

Do not invoke it as a separate advisor identity. Routing belongs to the parent hub.

---

## 2. SMART ROUTING

The parent hub resolves this packet through `mode-registry.json`: `hub-router.json` scores the
request, the winning `workflowMode` names this packet, and the hub loads this `SKILL.md` first.

The hub's root `ROUTER.md` stops at the packet: it names this packet and its first leaves, and the
packet's own `ROUTER.md` maps the intents that pick among the material this folder holds. That file,
not the hub router, is where a packet-local resource selection is decided.

A request that matches no registered mode returns `UNKNOWN_FALLBACK`, never a silent default.
That fallback asks for disambiguation instead of guessing a packet.
The machine router, its intent signals and its resource map live in
[`ROUTER.md`](./ROUTER.md). Read that file before loading a packet-local resource.

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

- `ROUTER.md`: this packet's machine router.
- `README.md`: packet overview.
- `../mode-registry.json`: authoritative packet registration.
- `../hub-router.json`: parent routing policy.

---

## 6. SUCCESS CRITERIA

- The selected workflow outcome exists.
- Required verification passes.
- Remaining uncertainty is reported.

---

## 7. INTEGRATION POINTS

- Input: requests routed from the `{{HUB_NAME}}` hub.
- Output: the verified primary workflow result.
