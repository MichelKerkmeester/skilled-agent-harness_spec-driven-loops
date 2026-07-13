---
title: sk-design Known-Deviation Suppression List
description: The seeded sk-design (static v1) known-deviation list for deep-alignment's ADR-005 suppression invariant, seeded from design_md_format.md's own documented conditional-omission rules, not invented.
trigger_phrases:
  - "sk-design known deviations"
  - "known deviation suppression list sk-design"
  - "shadows block omitted zero tokens"
  - "tailwind narrower token set"
importance_tier: important
contextType: reference
version: 1.0.0.2
---

# sk-design Known-Deviation Suppression List

The sk-design authority's known-deviation list (STATIC v1) for deep-alignment's ADR-005 suppression invariant: intentional `DESIGN.md` conventions the mode must never flag as drift.

---

## 1. OVERVIEW

### Purpose

ADR-005 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-005`) requires every authority adapter's `standardSource` to carry a known-deviation list so a real, documented convention is never flagged as drift. Every entry below traces to `design_md_format.md`'s own explicit, cited text: the same document `scripts/adapters/sk-design.cjs`'s structural checker is built against. None of it is a hypothetical.

### Source of Truth

This document is the single source of truth for sk-design's suppression rules. The fenced `json` block in Section 5 is parsed directly by `scripts/adapters/sk-design.cjs`'s `loadKnownDeviations()` at runtime. There is no separate, hand-synced copy of this list in code.

### All Three Entries Are Dormant By Construction, Not By Luck

Unlike sk-doc's known-deviation list (three of five entries dormant because the *external* wrapped tool structurally cannot produce that finding type) or sk-git's (structural pre-check exemptions, hard-coded to never produce a finding), every entry here is dormant for a third, distinct reason: `sk-design.cjs`'s own required-heading check (`REQUIRED_HEADINGS`, Section 6 of `sk_design_adapter.md`) operates at **top-level `##` heading granularity only** and never descends into sub-block-level presence/absence. The three conventions below all describe legitimate omissions **within** an otherwise-required section, not a top-level heading. So this checker was deliberately designed from the start to never need to suppress them, rather than flagging them and then filtering the flag out. They are documented here anyway, for the same reason sk-doc documents its dormant entries: to keep a reasoning-agent-layer reviewer (Section 7 of `sk_design_adapter.md`) from independently re-flagging them, and as a forward record if a future deterministic-layer extension ever descends to sub-block granularity.

---

## 2. SHADOWS SUB-BLOCK OMISSION (ZERO SHADOW TOKENS)

**Deviation name**: Missing `### Shadows` sub-heading under `Tokens — Spacing & Shapes`

**Why it is not a violation**: `design_md_format.md` Section 5 explicitly instructs: "(omit the whole Shadows block when 0 shadow tokens)." A flat design system with no shadow tokens correctly has no `### Shadows` sub-heading at all.

**Evidence**: `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md:141-145`, the `### Shadows` table template immediately followed by "(omit the whole Shadows block when 0 shadow tokens)".

**Live-Reality Check (2026-07-11)**: `sk-design.cjs`'s `REQUIRED_HEADINGS` list requires only `## Tokens — Spacing & Shapes` (the top-level heading). `### Shadows` is not, and was never, a separately-checked required sub-heading. **This entry is dormant by construction**: the checker cannot flag a missing Shadows sub-block because it never looks for one.

---

## 3. TAILWIND V4 BLOCK'S NARROWER TOKEN SET

**Deviation name**: Tailwind `@theme` block omitting `--surface-*` and `--page-max-width`

**Why it is not a violation**: `design_md_format.md` Section 14's own Tailwind v4 code comment states the block intentionally excludes two token categories the CSS Custom Properties block includes: "(no `--surface-*`, no `--page-max-width`)."

**Evidence**: `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md:268-276`, the `### Tailwind v4` fenced block's own `@theme { ... }` comment.

**Live-Reality Check (2026-07-11)**: `sk-design.cjs`'s `checkQuickStartConsistency()` only cross-checks `--color-*` declarations against the `Tokens — Colors` table (an intentional v1 narrowing to the one reliably backtick-parseable dimension, see `sk_design_adapter.md` Section 4.1's own "Quick-Start Consistency Is Colors-Only in v1" note). It never inspects `--surface-*`/`--page-max-width` presence in either code block, so it structurally cannot flag the Tailwind block's narrower set as "missing" tokens. **This entry is dormant by construction.**

---

## 4. STAMPED-ABSENCE CONVENTION (`_No <X> data was extracted._`)

**Deviation name**: A required section present as a heading with a stamped-absence body instead of real content

**Why it is not a violation**: `design_md_format.md` Section 0's Cardinal rule 6 states: "A section with no backing data is omitted (when conditional) or stamped `_No <X> data was extracted._` — never filled with invention." A required section whose heading is present but whose body is this exact stamp phrasing (rather than populated content) is the *correct*, documented behavior for absent data, not incompleteness.

**Evidence**: `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md:43-45`, Cardinal rule 6, and Section 10 (Imagery)'s own worked instance: "If no meaningful imagery signal was extracted, say so plainly rather than inventing a visual language."

**Live-Reality Check (2026-07-11)**: `sk-design.cjs`'s required-heading check (`REQUIRED_HEADINGS`) tests only for the heading's *presence* (a regex match against the `##`-line itself). It never inspects a required section's body content for "real" versus "stamped" data, so a stamped-absence body can never trip a `missing-required-section` finding for a section whose heading exists. The one section this checker treats as conditional at the *heading* level (Imagery, `imagery-section-unclear`, P2) already has its own softer, explicit handling, see `sk_design_adapter.md` Section 3. **This entry is dormant by construction** for every other required heading.

---

## 5. SCOPE OF THIS LIST

**In scope**: sk-design authority, STATIC v1 only. Live-render conventions (phase 010, ADR-009) are out of this list's scope entirely. That adapter owns its own known-deviation list once built. Each other authority adapter (sk-doc, sk-git, sk-code) owns its own list under its own `standardSource`, per ADR-005's per-authority requirement.

**Not a dumping ground**: every entry here traces to `design_md_format.md`'s own explicit, cited prose: the same document this authority's structural checker implements. It is not an invented convention. All three are labeled dormant-by-construction rather than presented as if they were actively firing and being suppressed.

---

## 6. MACHINE-READABLE DEVIATION LIST

`scripts/adapters/sk-design.cjs` parses this fenced block directly (see that file's `loadKnownDeviations()`). Keep it byte-consistent with Sections 2-4 above. All three `matchTypes` arrays are intentionally empty (see each section's own "Live-Reality Check", none of them corresponds to a finding type this checker can currently produce), mirroring sk-doc's own dormant-entry shape (`sk_doc_known_deviations.md` Section 8's `kebab-case-legacy-references`/`cli-family-hard-rules-frontmatter` entries).

```json
{
  "authority": "sk-design",
  "version": "1.0.0",
  "generatedFrom": "sk_design_known_deviations.md Section 6, hand-maintained alongside Sections 2-4",
  "deviations": [
    {
      "id": "shadows-block-omitted-zero-tokens",
      "name": "Missing Shadows sub-heading when 0 shadow tokens",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchArtifactKinds": ["design-doc"],
      "status": "dormant",
      "evidence": ["design_md_format.md:141-145"]
    },
    {
      "id": "tailwind-narrower-token-set",
      "name": "Tailwind v4 block omitting --surface-*/--page-max-width",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchArtifactKinds": ["design-doc"],
      "status": "dormant",
      "evidence": ["design_md_format.md:268-276"]
    },
    {
      "id": "stamped-absence-convention",
      "name": "Required section present with a stamped-absence body",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchArtifactKinds": ["design-doc"],
      "status": "dormant",
      "evidence": ["design_md_format.md:43-45"]
    }
  ]
}
```

---

## 7. REFERENCES AND RELATED RESOURCES

- [sk_design_adapter.md](./sk_design_adapter.md): the full `standardSource`/`discover`/`check` specification this list is loaded by.
- [sk-design.cjs](../../scripts/adapters/sk-design.cjs): the reference wiring script. `loadKnownDeviations()` parses Section 6's fenced block. `REQUIRED_HEADINGS`/`checkQuickStartConsistency()` are the deterministic-layer functions whose deliberate scope keeps all three entries dormant.
- `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md`: the live Style Reference format specification every entry here cites.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHORS `adr-005`, `adr-009`): the alignment contract this list satisfies, and the static/live-render boundary this authority's v1 scope stays inside.
