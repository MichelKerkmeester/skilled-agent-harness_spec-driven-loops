---
title: "Onboarding flow"
description: "The style-guide gate before the first diagram in a project, plus agent-mediated skin extraction from a website URL, an installed skill, or a local folder that rewrites style-guide.md."
trigger_phrases:
  - "Onboarding flow"
  - "style guide gate"
  - "onboard style guide"
  - "extract palette from url"
  - "customize diagram skin"
version: 1.0.0.0
---

# Onboarding flow

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The style-guide gate before the first diagram in a project, plus agent-mediated skin extraction from a website URL, an installed skill, or a local folder that rewrites `style-guide.md`.

Before generating the first diagram in a project, the packet verifies the style guide has been customized so default-skinned diagrams are never silently shipped into a branded project. When customization is wanted, onboarding reads a design source, extracts the palette and typography, maps them to the semantic roles, and rewrites `style-guide.md` so every future diagram inherits the new skin. The typical caller is the agent about to draw the first diagram, and the main failure mode is a source that yields no usable tokens or ambiguous role mappings.

---

## 2. HOW IT WORKS

### Style-guide gate

Before the first diagram in a project, the agent opens `references/foundations/style-guide.md` and checks the default tokens. If the `accent` value is still the shipped default, the gate pauses and asks the user how to proceed: (a) pull from a website URL, (b) extract from an installed skill, (c) extract from a local folder or design-system directory, (d) paste tokens manually, or (e) proceed with the default for now. Once customized — or when the user explicitly opts for the default — the gate is skipped on subsequent runs; a simple detection treats an `accent` value that differs from the shipped default as custom.

### Extraction pipeline

All source methods follow the same flow: read the source, extract dominant colors and fonts, map them to semantic roles (`paper`, `ink`, `muted`, `accent`, `paper-2`, `rule`), run constraint checks, propose a `style-guide.md` diff, and write only after approval. The constraint checks are explicit: ink must hit WCAG AA contrast on paper, the accent must be the most saturated color, and paper must not be pure white. The diff preview shows only the tokens table, and low-confidence role guesses are flagged so the user can correct before anything is written. The write step is never automatic.

### Source methods and edge cases

URL onboarding asks the user for the site and lets the calling AI session's own tools fetch it (the packet declares no network-fetch tool), then prefers CSS custom properties, rendered `getComputedStyle` samples, or a screenshot color histogram. Skill and folder onboarding glob for CSS custom properties, Style Dictionary / Figma token JSON, Markdown token tables, and inline `<style>` blocks, then map variable names to roles by name heuristic. Ambiguity is surfaced rather than guessed: multiple accent candidates are listed for the user to pick, dark-mode-first sources ask whether to invert, and a source with no token files falls back to reading prose for hex values and showing the inferred table explicitly.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/foundations/onboarding.md` | Shared | The URL, skill, and folder extraction methods, role mapping heuristics, contrast checks, and diff-approval workflow |
| `references/foundations/style-guide.md` | Shared | The semantic role tables and constraints that onboarding rewrites after approval |
| `SKILL.md` (Style-guide gate) | Handler | The before-first-diagram gate, the five customization options, and the accent-based skip detection |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/diagram-generation/onboarding-flow.md` | Manual playbook | Scenario DIA-003 verifies the gate fires on the shipped default accent, extraction maps roles with confidence, and `style-guide.md` is written only after approval |
| `references/foundations/onboarding.md` | Reference | Anchor for the extraction flow the scenario exercises |

---

## 4. SOURCE METADATA

- Group: DIAGRAM GENERATION
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `diagram-generation/onboarding-flow.md`

Related references:
- [type-selection-and-routing.md](type-selection-and-routing.md) — the routing that precedes the style-guide gate on a generate request
- [primitive-variants.md](primitive-variants.md) — the terminal skin that intentionally is not affected by onboarding
