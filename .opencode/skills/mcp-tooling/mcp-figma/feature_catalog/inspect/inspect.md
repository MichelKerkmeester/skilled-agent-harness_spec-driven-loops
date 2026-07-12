---
title: "Inspect"
description: "Read the live Figma document without changing it: find and get nodes, walk the node tree and bindings, list collections and slots, emit specs."
trigger_phrases:
  - "figma inspect"
  - "figma find nodes"
  - "figma node tree"
  - "figma get node"
  - "read-only figma inspect"
version: 1.0.0.1
---

# Inspect (figma-ds-cli find / get / inspect / node tree)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Reads the live Figma document without changing it. These are the safe default and the input to design work and to any later gated verb: a caller inspects structure first, then decides whether a mutating verb is warranted.

Every verb in this area is READ-ONLY against the Figma document. A typical caller lists or finds nodes, gets a node's properties, or walks the tree before authoring anything. Nothing here writes to the document.

---

## 2. HOW IT WORKS

The inspect surface locates and reports structure from the open file. `figma-ds-cli find <query>` locates nodes matching a query and `figma-ds-cli get <node>` returns a node's properties; `figma-ds-cli inspect <node>` returns a node's full property set. `figma-ds-cli node tree [<node>]` prints the node hierarchy and `figma-ds-cli node bindings <node>` lists the variable bindings on a node. `figma-ds-cli canvas info | next` reports canvas state or the next placement slot, `figma-ds-cli spec [<node>]` emits a node or document spec, and `figma-ds-cli files` lists the known files in the session. For tokens, `figma-ds-cli slot list <component>` lists component slots and `figma-ds-cli bind list` lists existing variable bindings. None of these change the document, so they run without a confirmation gate, but they still require a live Desktop session and an established connection.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/figma_cli_reference.md` | Shared | Inspect verb surface and read-only classification |
| `references/tool_surface.md` | Shared | READ-ONLY gating taxonomy for the inspect verbs |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/read_only/read_only_inspect.md` | Manual playbook | An inspect verb returns structure without changing the document |

---

## 4. SOURCE METADATA

- Group: Inspect
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `inspect/inspect.md`

Related references:
- [connect-and-daemon.md](../connect_and_daemon/connect_and_daemon.md) covers the connection inspect depends on
- [export.md](../export/export.md) covers writing read-only assets out to explicit paths
