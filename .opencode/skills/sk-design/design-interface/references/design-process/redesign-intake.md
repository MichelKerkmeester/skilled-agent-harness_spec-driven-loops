---
title: Redesign Intake
description: Classifies existing-interface redesign work as greenfield, preserve or overhaul and protects approval-gated contracts before visual changes.
trigger_phrases:
  - "redesign intake"
  - "preserve overhaul greenfield"
  - "never silently change"
importance_tier: normal
contextType: reference
version: 1.0.0.1
---

# Redesign Intake

Use this before changing an existing interface. A redesign is not a blank page unless the brief says so.

---

## 1. OVERVIEW

### Purpose

Classifies existing-interface redesign work as greenfield, preserve, or overhaul before visual changes begin.

### When to Use

Use before changing layout, tokens, navigation, forms, content structure, or other visible behavior in an existing interface.

### Core Principle

Redesign starts by deciding what must remain stable; protected contracts need explicit approval before they move.

---

## 2. Classify The Redesign

Pick one lane before visual decisions:

| Lane | Use When | Output Shape |
| --- | --- | --- |
| Greenfield | The existing surface is absent, disposable or explicitly untrusted | Invent the structure from the brief, then run the normal design process |
| Preserve | The surface works but needs polish, clarity or freshness | Keep structure, content roles and user paths stable while improving expression |
| Overhaul | The surface blocks the task or no longer fits the brand | Rebuild structure only after naming what must stay recognizable |

When the lane is ambiguous, ask one focused question: `Should this preserve the existing user path, or may I restructure it?`

For work spanning more than one page, also declare whether the pages belong to one product system and which page-type family each page serves. Shared-system coherence is decided before page-level variation.

### Multi-Page Coherence Lock

Capture one lock ledger for the site or product, then keep page composition decisions separate from it.

| Axis | Lock | Rule |
| --- | --- | --- |
| Wordmark or logotype | MUST-SHARE | Preserve the same mark, construction, and placement logic across pages. |
| Accent colour and placement | MUST-SHARE | Keep the same accent role and cap its visible area at no more than 5% of each viewport unless an approved exception amends the lock. |
| Display and body fonts | MUST-SHARE | Keep the same role pairing and fallback strategy; page-level variation may change scale, not identity. |
| CTA voice | MUST-SHARE | Preserve action vocabulary, sentence style, and confidence level across flows. |
| Section-heading rhythm | MUST-SHARE | Preserve the relationship among kicker, heading, support copy, and surrounding space when those roles apply. |
| Macrostructure | MAY-DIFFER | Vary composition inside the page-type family so a landing page, index, detail page, and product workspace can solve different jobs. |
| Hero archetype | MAY-DIFFER | Choose a different brief-grounded hero within the page-type family; do not change the shared visual system to manufacture variety. |
| Marketing-only enrichment | MAY-DIFFER | Use or omit campaign media, authored craft, or promotional polish where the page job earns it. Product-task pages need not inherit it. |

**Amend; do not override.** If a page genuinely needs to break a MUST-SHARE axis, add an exception to the lock ledger with the page, axis, user or brand reason, scope, approver, and verification. Do not silently replace the shared value in a local file. The amendment becomes the visible contract for later pages; an unrecorded override is drift.

## 3. Audit Before Touching

Before changing layout or tokens, capture:

- Current URL paths and page titles.
- Navigation labels, order and destination targets.
- Form fields, field order, validation messages and required states.
- Legal, cookie, privacy, pricing and compliance copy.
- Locked brand tokens, logo use, typefaces and icon style.
- Existing IA, content blocks, reusable patterns and SEO-visible headings.
- Components to preserve, components to retire and components to rebuild.

## 4. Never Silently Change

These require explicit approval before changing:

- URL slugs, redirects and anchor ids.
- Navigation labels, nav order and destination meaning.
- Form field names, required fields, field order and validation language.
- Legal copy, privacy copy, cookie text, compliance text and pricing terms.
- Locked tokens, logo marks, typefaces, icon libraries and brand colors.
- Analytics ids, SEO titles, meta descriptions and structured data.

If a design improvement depends on one of these changes, state it as a required decision rather than hiding it inside the visual pass.

## 5. Lane-Specific Moves

### Greenfield

- Ground the page in subject, audience and one job.
- Run the normal token-system brainstorm.
- Mark all content assumptions as invented until real copy arrives.

### Preserve

- Keep the path, labels and content roles stable.
- Improve hierarchy, rhythm, type, color dosage and state clarity.
- Replace only patterns that create measurable friction.

### Overhaul

- Name the broken job before replacing structure.
- Keep recognizers users rely on, such as account areas, pricing labels or support paths.
- Provide a migration note for any approved URL, nav or form change.

## 6. Output Contract

Return a compact intake before design work:

```text
Redesign lane: greenfield | preserve | overhaul
Surface scope: single page | multi-page system
Preserve list: URLs, nav, forms, legal, locked tokens
Coherence lock: MUST-SHARE axes, MAY-DIFFER axes, approved amendments
Change candidates: layout, hierarchy, content order, visual system
Approval needed: any silent-change item that must move
Next step: design process, system pass or implementation handoff
```

This reference is an intake gate. It is not a visual style preset.
