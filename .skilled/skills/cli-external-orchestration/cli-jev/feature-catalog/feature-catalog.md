---
title: "cli-jev: Feature Catalog"
description: "Current-state inventory for the cli-jev transport: its hub registration as packetKind transport, the judgment primitives, the eight dispatch guards, and the surfaces it exposes."
trigger_phrases:
  - "cli-jev feature catalog"
  - "cli-jev capabilities"
  - "jev judgment primitives"
  - "jev transport classification"
  - "jev dispatch guards"
last_updated: "2026-09-20"
version: 1.0.0.0
---

# cli-jev: Feature Catalog

This catalog inventories the live `cli-jev` surface. `cli-jev` is the eighth mode of the
`cli-external-orchestration` hub and its only `packetKind: "transport"`: the hub resolves the mode
through the `transport-axis` extension, the dispatch hooks inspect and preflight the command, and the
`jev` binary turns a state and a question into one typed value.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the shipped `cli-jev` surface. The packet owns the
judgment contract; the hub owns routing; the dispatch hooks own enforcement. Each category file below
carries one layer's features with their implementation anchors, so a claim here is checkable at the
file it names.

---

## 2. CATEGORY INDEX

| Category | File | Covers |
|---|---|---|
| Transport classification | [`transport-classification/transport-classification.md`](./transport-classification/transport-classification.md) | `packetKind: "transport"`, the `transport-axis` registration, the forbidden tool surface, and the pairing rule |
| Judgment primitives | [`judgment-primitives/judgment-primitives.md`](./judgment-primitives/judgment-primitives.md) | `noul`, `choice`, `score`, `run` — inputs, outputs and cardinality |
| Dispatch guards | [`dispatch-guards/dispatch-guards.md`](./dispatch-guards/dispatch-guards.md) | The eight declared hard rules, their implementations, and the audit dispatch shape |
| Surfaces | [`surfaces/surfaces.md`](./surfaces/surfaces.md) | The CLI surface, the MCP surface, and the provider table |

---

## 3. WHAT IS NOT HERE

- **No executor kind.** `cli-jev` is absent from the deep-loop `EXECUTOR_KINDS` roster, because Jev
  has no file tools, no iteration model and no stop policy.
- **No MCP registration.** `jev-mcp` is documented and not wired; no repository MCP config carries it.
- **No write capability.** The mode forbids `Write`, `Edit` and `Task`, and declares
  `mutatesWorkspace: false`.
- **No repo-owned model roster.** The provider owns its model ids; this packet records defaults
  rather than pinning a closed allowlist.
