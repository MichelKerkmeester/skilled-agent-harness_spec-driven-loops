---
title: "Token Library"
description: "Three-layer design-token library: frozen primitive palette, semantic roles, and per-surface component tokens read at runtime."
trigger_phrases:
  - "edit a design token"
  - "retint the design system"
  - "change the token library"
version: 1.0.0.0
---

# Token Library (token-library)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The app reads its design tokens from a three-layer library: frozen primitive sources, semantic roles, and per-surface component tokens.

All runtime styling resolves through `@theme` design-scale tokens and a semantic role layer backed by a guardrailed primitive palette. Operators retint the whole app by changing a semantic role, never by touching a frozen primitive.

Current status: shipped.

---

## 2. HOW IT WORKS

### The three layers

Tokens live in `apps/pi-remote-web/src/style.css`. A `@theme` block supplies the design scale the layout resolves against. Below it, a primitive source block holds the ink-on-parchment palette as raw `--pi-*` tokens, each marked with the `@ds guardrail` do-not-edit seam. The app reads the semantic role layer, and thin per-surface component tokens resolve to those roles. `tokens.md` is the human-readable reference documenting each layer and the editing rules.

### Retinting by role, not source

The primitive palette is frozen: bone `#f8f8f6` in the light surface, carbon ink, and clay `#d97757` as the accent. These are invariants the feature honors, never values an operator re-derives inline. Retinting the app means editing a semantic role — the resolution route between a component and its backing primitive — so a single role change cascades consistently without touching a guardrailed source token.

### Guarded editing surface

The `@ds` inline-comment grammar marks which seams may be touched and which are do-not-edit source. This keeps the frozen palette secure as the source of truth while still exposing the semantic and component layers as the editable surface for sustainment work.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `apps/pi-remote-web/src/style.css` | Shared | Three-layer token library, frozen palette, @ds guardrail/edit seams |
| `apps/pi-remote-web/src/design-system/tokens.md` | Shared | Token reference: the three layers and editing rules |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `apps/pi-remote-web/tests/contrast.test.tsx` | unit | Reads style.css and proves the applied palette pairs meet WCAG contrast by arithmetic |

---

## 4. SOURCE METADATA

- Group: design-system
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `design-system/token-library.md`
- Current status: shipped

Related references:

- [palette.md](palette.md) - the frozen ink-on-parchment color scheme the token roles resolve to

CONTENT RULES:
- Current-state only. Describe what SHIPPED. No roadmap, no "will", no "planned", no
  spec/phase/packet numbers (e.g. never write "added in phase 3" or "packet 007").
- Fill the SOURCE FILES tables ONLY from the provided impl/test anchors, verbatim paths.
- Weave the provided frozen-constraint notes into the HOW IT WORKS prose where relevant,
  but never describe changing a frozen token value or a security boundary — these are
  documented as invariants the feature honors.
- Keep HOW IT WORKS to 2-4 short H3 subsections. If it would run over three paragraphs in
  one subsection, split it.
- The `trigger_phrases`, title, and H1 must match the feature name given below.

Frozen invariants this app ships under (document as honored, never as changed):
- Design: ink-on-parchment palette; Inter + Source Serif 4; light + dark; WCAG AA; controls
  >=44px; clay is never the sole state signal.
- Security: read-only by default; mutations require a one-use, revision-bound ticket and are
  fail-closed; allowlist + structural redaction; content-free push; operator-only full-access
  the phone cannot enable.