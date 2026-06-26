---
title: "Write DESIGN.md"
description: "Compose the v3 Style Reference DESIGN.md from tokens.json, pasting deterministic value sections (formatters-v3.ts) and writing prose only, under the cardinal fidelity rule."
trigger_phrases:
  - "write DESIGN.md"
  - "cardinal fidelity rule"
  - "verbatim value contract"
  - "6-digit lowercase hex"
  - "v3 Style Reference design system handoff"
importance_tier: "normal"
version: 1.0.0.9
---

# Write DESIGN.md (Phase 2)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Produces the v3 **Style Reference** `DESIGN.md` that AI agents consume as a hallucination-proof, ship-ready design-system handoff — named colour tokens, a semantic type scale, named components, Surfaces, Elevation, an Agent Prompt Guide, Similar Brands, and a copy-paste Quick Start (CSS + Tailwind). This is the highest-risk phase: an agent reading `tokens.json` must transcribe every value without estimating, rounding, normalizing, or inventing. The cardinal fidelity rule is the single non-negotiable contract of the skill. The writer loads the v3 section specification from `references/design_md_format.md` and the voice/tone rules from `references/writing_style_guide.md` before composing. The write-phase prompt template (`assets/design_md_prompt_template.md`) and the cardinal rules card (`assets/cardinal_rules_card.md`) front-load the fidelity contract.

To remove the AI from the highest-risk value surface, the phase runs `backend/scripts/build-write-prompt.ts` first: it pre-renders the deterministic value sections (Tokens — Colors, Tokens — Spacing & Shapes, Surfaces, Quick Start) directly from tokens via `backend/scripts/formatters-v3.ts` and assembles a FACTS block of locked values (type scale, shadow/gradient/motion/icon/focus counts) for the prose sections. The WRITE phase runs it first, pastes those pre-rendered tables unchanged, and writes prose only for the remaining sections — every value sourced from a pre-rendered section or the FACTS block.

---

## 2. HOW IT WORKS

### Cardinal fidelity rule

Every hex code, pixel value, font weight, box shadow, border radius, and spacing value in `DESIGN.md` must be copied verbatim from `tokens.json`. No estimation, no rounding, no invention, no close-enough substitution. If a value is not in `tokens.json`, it does not appear in the document. This rule is what makes `DESIGN.md` a trustworthy reference: every claim is traceable to a measured browser value.

### Doc-as-view value rendering

The value-bearing sections are rendered deterministically, not authored by the AI. `backend/scripts/formatters-v3.ts` renders Tokens — Colors, Tokens — Spacing & Shapes, Surfaces, and Quick Start straight from tokens — every hex, px, weight, radius, and `--page-max-width` value verbatim, L4 excluded, zero AI on the value surface. A deterministic hue+lightness colour namer assigns each colour an evocative-but-grounded Name and a matching `--color-<slug>` token, so the Name, the token slug, and the Quick Start stay mutually consistent without an AI naming pass. `backend/scripts/build-write-prompt.ts` pre-renders those sections plus a FACTS block of locked values; the WRITE phase runs it first and pastes the pre-rendered tables unchanged. The AI composes only the prose sections (intro, per-font Typography prose, Components, Do's and Don'ts, Elevation, Imagery, Layout, Agent Prompt Guide, Similar Brands), and never emits a value — every value it states comes from a pre-rendered section or the FACTS block.

### Hex format requirements

All hex codes must use 6-digit lowercase format. `#1a1a2e` is correct. `#1A1A2E` (uppercase), `#1a1a2` (3-digit), `#333` (3-digit shortcut), `rgb(26, 26, 46)`, and `hsl(240, 24%, 14%)` are all violations. The validator enforces this in Phase 3.

### Stability gating

L1 (permanent, brand-level) and L2 (system, component-level) colours populate the main Tokens — Colors table. L3 (campaign, temporary) colours appear only in the `Current Campaign Colors (Subject to change)` sub-table. L4 (content, image-derived, one-off) tokens are excluded entirely (and excluded from the Quick Start). Stability classes come from the cluster phase output in `tokens.json`.

### Elevation — flat when no shadows

The Elevation section renders either a per-component shadow list or, when there are 0 shadow tokens, a prose line stating the system is FLAT and HOW depth is achieved instead (border contrast, tonal difference, whitespace). This is the honest replacement for the old "gradient-as-depth" failure — never assert gradients are a depth system the tokens do not contain.

### Dark-mode gate

A dark-mode treatment appears only when `tokens.json` contains a detected dark-mode palette with populated `tokens.darkMode.variableDiff` entries (the FACTS block reports whether dark mode was detected). Never derive, infer, or fabricate a dark palette from the light tokens.

### Accessibility and focus provenance

Accessibility signals are drawn from `tokens.json` a11y data and surface in the Agent Prompt Guide and Do's and Don'ts where relevant. The focus-indicator claim is provenance-checked: `focusIndicator.captured` and `focusIndicator.consistent` must be true before the document may call focus "consistent." If the extractor captured no focus data, do not assert focus consistency.

### Confident, restrained, no false systems

The v3 voice is named, confident, and restrained: assign evocative colour names and roles, characterize components by function (Primary CTA, Ghost Link, Card, Badge — never "Variant-N"), and infer Similar Brands as grounded inference. But never assert a system the data contradicts — no "gradient-as-depth" when there are 0 shadow tokens, no "focus is consistent" when it was not captured. No frequency dumps, no "div"/"Variant-N" placeholders, and no extractor-internal var names. Conditional sections with no backing data are stamped ABSENT rather than invented. Anti-pattern AP-29 (Interpretive Fabrication) governs this contract.

### Header

The file opens with `# <Brand> — Style Reference`, an evocative one-line `> tagline`, and a `**Theme:**` line (light | dark | mixed), followed by an unlabeled 4–6 sentence intro paragraph, per `references/design_md_format.md`.

### Write-phase prompt

The WRITE phase runs `backend/scripts/build-write-prompt.ts` first; it pre-renders the deterministic value sections (Tokens — Colors, Spacing & Shapes, Surfaces, Quick Start) via `formatters-v3.ts`, assembles a FACTS block of locked values, and emits a complete v3 WRITE prompt with the hard rules inline (paste the pre-rendered sections unchanged, source every other value from the FACTS block, named/confident/restrained voice, no false systems). The prompt template in `assets/design_md_prompt_template.md` then provides a ready-to-fill composition prompt for the prose sections. Load the format spec (`design_md_format.md`) and writing style guide alongside, paste the pre-rendered tables unchanged, and hand to the writing agent.

### Pre-validate self-check

The cardinal rules card (`assets/cardinal_rules_card.md`) is a one-page checklist for a quick pre-validate self-check against the draft DESIGN.md. Every box must be checkable with evidence in `tokens.json`. Run this before `validate.ts`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `backend/scripts/build-write-prompt.ts` | Script | Pre-renders the v3 value sections, assembles the FACTS block, and emits the prose-only WRITE prompt; run first by the WRITE phase |
| `backend/scripts/formatters-v3.ts` | Script | Deterministic v3 emitters: hue+lightness colour namer, Tokens — Colors, Tokens — Spacing & Shapes, Surfaces, and Quick Start (every value verbatim from tokens, L4 excluded) |
| `assets/design_md_prompt_template.md` | Script | Write-phase prompt encoding the cardinal rules and the section contract |
| `assets/cardinal_rules_card.md` | Script | One-page fidelity checklist for pre-validate self-check |
| `references/design_md_format.md` | Shared | Authoritative v3 Style Reference section specification |
| `references/anti_patterns.md` | Shared | Authoring anti-patterns including AP-29 Interpretive Fabrication |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/03--fidelity/verbatim-value-fidelity.md` | Manual playbook | Cardinal verbatim-value rule enforcement — confirms every value is copied verbatim with no estimation |
| `backend/tests/formatters-v3.test.ts` | Automated test | v3 emitter unit tests: colour namer, Tokens — Colors, Spacing & Shapes, Surfaces, and Quick Start rendering |
| `backend/tests/build-write-prompt.test.ts` | Automated test | v3 pre-render and FACTS-block / prose-only prompt unit tests |

---

## 4. SOURCE METADATA

- Group: WRITE DESIGN.MD
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--write-design-md/write-design-md.md`

Related references:
- [references/writing_style_guide.md](../../references/writing_style_guide.md) — voice, tone, tense, and section-composition rules
- [references/anti_patterns.md](../../references/anti_patterns.md) — common DESIGN.md authoring mistakes
- [cluster-classify.md](../02--cluster-classify/cluster-classify.md) — the stability classes that gate token inclusion
- [validate.md](../04--validate/validate.md) — the hex-and-section validator that confirms fidelity
