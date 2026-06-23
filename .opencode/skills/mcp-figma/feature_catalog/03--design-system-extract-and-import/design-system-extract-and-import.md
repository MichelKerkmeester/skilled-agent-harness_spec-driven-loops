---
title: "Design-system extract and import"
description: "Move a design system out of Figma read-only to a DESIGN.md (11 sections + token JSON, auto-split), or import Tailwind/CSS/tokens.json/Storybook into Figma behind a gate."
trigger_phrases:
  - "figma extract design system"
  - "figma DESIGN.md"
  - "figma import tokens"
  - "figma import design system"
  - "design tokens json"
version: 1.0.0.2
---

# Design-system extract and import (figma-ds-cli extract / import)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Moves a design system out of Figma read-only, or into Figma behind a gate. Extract feeds design judgment in `sk-design-interface`; import changes the document and is gated. A typical caller extracts a `DESIGN.md` to ground later work, or imports an existing token source to populate Figma collections.

Extract is read-only against the Figma document but still writes a file, so it carries the local-export rule: an explicit output path and no silent overwrite. Import is MUTATING.

---

## 2. HOW IT WORKS

### Extract (read-only, explicit output)

`figma-ds-cli extract [output] [--pages --sections --selection --split/--no-split]` reads the design system and produces a `DESIGN.md` with 11 sections, including a machine-readable `design-tokens` JSON block. Very large structure auto-splits into a `DESIGN-structure/` folder, so callers handle multi-file output. Extract does not change the document, but because it writes a file it requires an explicit output path and must not silently overwrite an existing file.

### Import (gated)

`figma-ds-cli import <source> [-c <collection> --save --type <tailwind|css|tokens|storybook|designmd> --print-context]` ingests a Tailwind config, CSS variables, a W3C / Style-Dictionary `tokens.json`, or a Storybook source and writes the result into Figma collections. Because it changes the document, import is MUTATING and runs only behind confirmation with an explicit target.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/figma_cli_reference.md` | Shared | Extract and import verb surface and flags |
| `references/tool_surface.md` | Shared | Gating taxonomy (extract READ-ONLY with explicit output; import MUTATING) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--read-only/read-only-export.md` | Manual playbook | The explicit-output, no-overwrite rule that also governs extract |

---

## 4. SOURCE METADATA

- Group: Design-System Extract and Import
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--design-system-extract-and-import/design-system-extract-and-import.md`

Related references:
- [inspect.md](../02--inspect/inspect.md) covers the read-only inspect verbs that precede extract
- [render-and-create.md](../04--render-and-create/render-and-create.md) covers the gated authoring verbs that import joins
