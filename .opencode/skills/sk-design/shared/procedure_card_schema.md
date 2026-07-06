---
title: Private Procedure Card Schema
description: Local schema for sk-design private procedure cards, including required-field lint and a worked example.
trigger_phrases:
  - "private procedure card schema"
  - "procedure card lint"
  - "sk-design procedure cards"
  - "procedure card worked example"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Private Procedure Card Schema

Private procedure cards are internal reference material for the existing `sk-design` modes. They add repeatable process without adding public skill identities, public modes, or tool requirements beyond the owning mode's allowed surface.

## 1. Card File Contract

Each card is a private markdown file under an owning mode's `procedures/` folder or under `shared/procedures/` when it coordinates multiple modes.

### Frontmatter

Every card must start with this frontmatter shape:

```yaml
---
title: Card Title
description: One-line summary of the card's behavior.
trigger_phrases:
  - "primary card trigger"
  - "alternate request phrasing"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---
```

### Body Structure

Every card must use this order:

1. H1 title matching `title`.
2. One short intro sentence.
3. `## 1. REQUIRED FIELDS` table containing the seven required fields below, in order.
4. Optional numbered sections for read-only compatibility, tool boundary, placement rationale, related cards, or conflict rules when applicable.
5. Numbered `PROCEDURE` section with the operating steps.

## 2. Required Fields

Every private card must use these fields in this order:

| Field | Requirement |
|---|---|
| Purpose | One sentence describing the behavior the card adds to the owning mode. |
| Owning mode | One of `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, or `shared` with an explicit owning reviewer. |
| Source reference | External source filename only, or `No external source` with rationale. Do not paste source prose. |
| Trigger | Concrete request patterns or mode conditions that make the card applicable after the public hub has already selected a mode. |
| Output contract | The exact advisory artifact, matrix, handoff, or extraction result the mode must produce. |
| Proof gate | Evidence required before the mode can say the card was followed. |
| Privacy rule | Statement that the card is private implementation guidance and does not create a public OpenCode skill or mode. |

## 3. Optional Fields

Use these only when they materially improve reviewability:

| Field | Use |
|---|---|
| Placement rationale | Required for cards under `shared/procedures/`; optional for mode-local cards. |
| Related cards | Names of cards that may be loaded before or after this one. |
| Conflict rule | How to choose between overlapping cards inside the same mode. |
| Read-only compatibility | Required for `design-interface`, `design-foundations`, `design-motion`, and `design-audit` cards. State that the mode may cite the card and return guidance or handoff content without writing files or running commands. |
| Tool boundary | Required for `design-md-generator` cards. State the mutating permission boundary and that the card does not grant those permissions to read-only modes. |

## 4. Required-Field Lint

Before publishing or updating a card, verify the card passes this local lint:

```text
For each procedure card:
1. Frontmatter exists and includes title, description, trigger_phrases, importance_tier, contextType, and version.
2. H1 title matches the card title.
3. A one-sentence intro appears between the H1 and the first H2.
4. The first H2 is exactly: ## 1. REQUIRED FIELDS
5. The required-fields table has header: | Field | Value |
6. The required-fields table rows appear in this exact order:
   Purpose, Owning mode, Source reference, Trigger, Output contract, Proof gate, Privacy rule.
7. Each required-field value is non-empty.
8. External sources are cited by filename only; no source prose, prompt body, starter code, or command snippet is copied into the card.
9. Every H2 section is numbered sequentially.
10. Read-only modes do not gain Write, Edit, Bash, or execution authority through the card.
```

## 5. Worked Example

```markdown
---
title: Accessibility Audit
description: Private procedure card for design-audit accessibility review across contrast, semantics, keyboard behavior, motion, and forms.
trigger_phrases:
  - "accessibility audit"
  - "wcag review"
  - "inclusive design review"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Accessibility Audit

Private procedure card for applying the existing design-audit accessibility review workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Let `design-audit` review a design for accessibility risks across contrast, semantics, keyboard behavior, motion, and forms. |
| Owning mode | `design-audit` |
| Source reference | `accessibility-audit.md` |
| Trigger | Use when the request asks for accessibility, WCAG, inclusive design, contrast, keyboard, focus, form, or release-readiness review. |
| Output contract | A findings-first accessibility report with evidence labels, severity, user impact, owner mapping, and what would confirm unresolved findings. |
| Proof gate | The report covers contrast/color, semantic structure, keyboard/focus, motion/forms/miscellaneous, and does not claim accessibility where evidence is missing. |
| Privacy rule | This is private audit guidance and not a public accessibility skill. |
```

## 6. Selection Rules

1. The public `sk-design` hub chooses a current mode first through `mode-registry.json`.
2. The selected mode evaluates only its own `procedures/` folder plus shared cards whose trigger names that mode.
3. A mode-local exact trigger beats a shared card.
4. When two mode-local cards match, choose the card with the narrower output contract.
5. If no card matches, the mode follows its existing `SKILL.md` behavior and states that no private procedure card applied.
6. If a request spans multiple modes, the parent hub still decides the bundle. Cards do not change public routing.

## 7. Source Adaptation Rules

1. Cite only the external source filename.
2. Preserve intent, not phrasing.
3. Rewrite procedure steps into OpenCode-native terms and the owning mode's tool boundary.
4. Do not include long source excerpts, starter code, command snippets, or proprietary prompt text from external files.
5. Review cards by comparing purpose, trigger, output contract, and proof gate against the source theme.

## 8. Shared Placement Rule

Use `shared/procedures/` only when the procedure genuinely coordinates two or more modes and cannot be owned by one mode without duplicating orchestration. Every shared card must name one owning reviewer who is responsible for keeping the card aligned with the mode contracts.

## 9. Publication Checklist

Before publishing or updating a card, verify:

```markdown
Structure:
- [ ] Frontmatter includes title, description, trigger_phrases, importance_tier, contextType, and version.
- [ ] H1 title and intro sentence are present.
- [ ] Required fields appear in the required order with non-empty values.
- [ ] H2 sections are numbered sequentially.

Content:
- [ ] Source reference uses filename-only citation or `No external source` with rationale.
- [ ] Output contract and proof gate preserve the owning mode's existing guidance.
- [ ] Read-only cards do not imply mutation or execution authority.

Quality:
- [ ] Related cards and conflict rules point to real neighboring cards when present.
- [ ] Shared cards name the owning reviewer and placement rationale.
```
