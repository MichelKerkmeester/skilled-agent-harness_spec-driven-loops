---
title: "Tokens and variables"
description: "Manage Figma variables and collections, bind var:name references, and visualize tokens; reads are safe, create/bind/set are gated, and bulk deletes are destructive."
trigger_phrases:
  - "figma variables"
  - "figma var bind"
  - "figma tokens"
  - "figma var delete-all"
  - "var:name binding"
---

# Tokens and variables (figma-ds-cli var / bind / collections)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Manages Figma variables and collections, binds `var:name` references, and visualizes tokens. Reads and binds are read-only or gated; create, bind, set, rename, and visualize change the document; bulk deletes are destructive.

A typical caller lists variables read-only, then creates or binds tokens behind a gate. The dangerous part of this area is the destructive subset: deleting one variable, every variable, or a batch of variables requires an explicit target and a one-line rollback. Token binding uses `var:name` (for example `bg="var:card"`), `var:collection:name` to pin a collection, or `render --collection <name>`.

---

## 2. HOW IT WORKS

### Read and bind

`figma-ds-cli var list | var find <q> | collections list` lists variables, collections, or finds a variable, and `figma-ds-cli tokens overlap` reports overlapping or conflicting tokens — all READ-ONLY. `figma-ds-cli var bind <node> <prop> <var> | bind <node> <var>` binds a variable to a node property and is MUTATING.

### Author tokens

`figma-ds-cli var create <name> <value>` creates a variable, `figma-ds-cli var set|rename <name> ...` sets a value or renames it, `figma-ds-cli var visualize` renders a token visualization, and `figma-ds-cli use|theme <name> [--dry-run]` applies a collection or theme. All of these are MUTATING; the `--dry-run` form of use/theme is a read-only preview.

### Destructive deletes

`figma-ds-cli delete|remove <node-or-var>` deletes a single variable, `figma-ds-cli var delete-all` deletes every variable, and `figma-ds-cli var delete-batch <ids>` deletes a batch by id. All three are DESTRUCTIVE: they require an explicit target, confirmation, and a one-line rollback, and they are never reached through an active-selection fallback.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/figma_cli_reference.md` | Shared | Variable, collection, and token verb surface |
| `references/tool_surface.md` | Shared | READ-ONLY / MUTATING / DESTRUCTIVE classification for tokens |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/04--safety-gate/destructive-verb-refused.md` | Manual playbook | Proves an unconfirmed destructive verb (e.g. `var delete-all`) is refused |

---

## 4. SOURCE METADATA

- Group: Tokens and Variables
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--tokens-and-variables/tokens-and-variables.md`

Related references:
- [render-and-create.md](../04--render-and-create/render-and-create.md) covers the authoring verbs tokens are bound into
- [export.md](../07--export/export.md) covers exporting token styles as CSS or Tailwind
