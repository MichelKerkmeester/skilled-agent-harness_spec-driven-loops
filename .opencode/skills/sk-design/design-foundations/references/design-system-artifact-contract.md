---
title: Design-System Artifact Contract
description: Naming and documentation-completeness contract for token, component, and library artifacts.
trigger_phrases:
  - "design-system artifact contract"
  - "token naming lint"
  - "design-system doc completeness"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Design-System Artifact Contract

Design-system artifacts are reusable system outputs: token sheets, component contracts, and library handoff docs. They need stricter names and headings than ordinary guidance pages because implementation code, Figma libraries, and later reviews may depend on the structure.

This contract is conditional. A document is lintable only when it declares itself with `artifactKind: token`, `artifactKind: component`, or `artifactKind: library`. Existing token scaffolds may also be linted when they contain both a markdown token table and the full token-artifact heading set. Skill docs, reference theory, screen notes, examples, and vocabulary pages are not design-system artifacts unless they use an artifact marker.

---

## 1. Token Tiers

All implementation tokens are lowercase CSS custom properties. Names are category-led, kebab-case, and role-based. Use hyphens, not underscores. Do not use camelCase, free-form abbreviations, or categories outside the tier allowlist.

| Tier | Purpose | Naming regex |
| --- | --- | --- |
| Neutral ramp | Lightness steps for background, surface, border, and text neutrals | `^--neutral-\d{2,3}$` |
| Color role | Accent, action, feedback, and on-fill roles | `^--color-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$` |
| Spacing base | Baseline and spacing scale tokens | `^--baseline$` or `^--space-[a-z0-9]+(?:-[a-z0-9]+)*$` |
| Surface | Canvas, raised, overlay, and elevation surfaces | `^--surface-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$` |
| Text | Foreground reading and emphasis roles | `^--text-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$` |
| Type | Type role, size, line-height, measure, and utility roles | `^--type-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$` |
| Elevation and shape | Radius, shadow, layer, stroke, and material tokens | `^--(?:radius|shadow|layer|stroke|material)-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$` |
| Motion and state | Duration, easing, delay, state, and reduced-motion tokens | `^--(?:motion|state)-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$` |

Numerals are allowed when they are part of a scale step, such as neutral ramp values or spacing steps like `2xs`. A token that starts with an unlisted category, such as `--clr-primary`, is invalid even if the rest of the name is kebab-case.

---

## 2. Required Headings

Heading checks are presence checks. They verify that the artifact exposes the sections downstream implementers expect; they do not certify that the content inside each section is complete or tasteful. Numeric prefixes are allowed, so `## 2. COLOR RAMP` satisfies `COLOR RAMP`.

| Artifact kind | Required headings |
| --- | --- |
| `token` | `COLOR RAMP`, `TYPE SCALE`, `SPACING SCALE`, `HAND OFF` |
| `component` | `COMPONENT CONTRACT`, `VARIANTS`, `STATES`, `TOKEN HOOKS`, `USAGE` |
| `library` | `LIBRARY SCOPE`, `FOUNDATIONS`, `COMPONENTS`, `HAND OFF` |

Allowed aliases are intentionally narrow. `COLOR TOKENS` or `COLOR SYSTEM` may stand in for `COLOR RAMP`; `HANDOFF` or `IMPLEMENTATION HANDOFF` may stand in for `HAND OFF`. Other headings should use the canonical labels.

---

## 3. Compliant Shape

```text
artifactKind: token

## 1. COLOR RAMP
--neutral-50
--color-primary
--color-on-primary

## 2. TYPE SCALE
roles, sizes, line heights

## 3. SPACING SCALE
--baseline
--space-2xs
--space-md

## 4. HAND OFF
implementation notes and checks
```

This shape is valid because the artifact is explicitly marked as a token artifact, every declared token uses an allowed tier regex, and every required token heading is present.

---

## 4. Anti-Examples

```text
--PrimaryColor
--color_primary
--clr-primary
```

These fail for different reasons: camelCase, underscore naming, and an off-allowlist category. A document with valid token names still fails if one of the required headings for its artifact kind is missing.
