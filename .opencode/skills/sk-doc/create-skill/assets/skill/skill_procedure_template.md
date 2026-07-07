---
title: Skill Procedure Card Templates
description: Templates and guidelines for creating private procedure cards that give a skill or mode a repeatable, triggerable process without a new public identity.
trigger_phrases:
  - "skill procedure card templates"
  - "procedure card guidelines"
  - "private procedure card structure"
  - "when to use a procedure card"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Skill Procedure Card Templates - Creation Guidelines

Templates and guidelines for creating private procedure cards: repeatable, selectable processes bundled inside a skill or mode without becoming a new public identity.

## 1. OVERVIEW

### What Is a Procedure Card

A procedure card is a private markdown file that adds a repeatable, triggerable PROCESS to an existing skill or mode. It is not a public skill, not a public mode, and does not appear in any advisor routing table. A skill or hub always resolves its public identity first (through its own routing, or a parent hub's `mode-registry.json`); a procedure card is only ever selected AFTER that, from inside the already-chosen skill or mode, by matching the card's own `Trigger` field against the request. A card never grants tool permissions beyond what the owning skill or mode already has.

### Location & Naming

**Standalone skill**: `references/procedures/[procedure_name].md`

**Parent hub, packet-local**: `[packet-name]/procedures/[procedure_name].md`

**Parent hub, cross-packet shared**: `shared/procedures/[procedure_name].md` — only when the procedure genuinely coordinates two or more packets and cannot be owned by one packet without duplicating orchestration.

**Naming Convention**: snake_case with `.md` extension, same rule as `references/` and `assets/`.

| ✅ Valid Names | ❌ Invalid Names |
|---------------|-----------------|
| `sensitive_field_redaction.md` | `SensitiveFieldRedaction.md` (PascalCase) |
| `digital_signature_verification.md` | `digital-signature-verification.md` (kebab-case) |
| `batch_annotation_cleanup.md` | `batchAnnotationCleanup.MD` (wrong case) |

### When to Create a Procedure Card

**Create a procedure card when:**
- The skill or mode has multiple distinct, individually-triggered internal procedures, not one dominant workflow.
- Each procedure needs a strict, lint-able, consistent shape (required fields in a fixed order), not free-form prose.
- Fine-grained behavior selection matters, but creating N public skills or modes for what is really one skill or mode with N internal procedures would over-fragment the public surface.
- `SKILL.md`'s `HOW IT WORKS` section would otherwise balloon into several near-duplicate workflow write-ups.

**Keep it a plain reference (`skill_reference_template.md`) instead when:**
- There is only one dominant workflow — no selection step is needed.
- The content is general background knowledge or context, not an actionable process with its own trigger.
- The content always applies whenever the skill or mode runs, rather than only on a specific request shape.

---

## 2. DOCUMENT STRUCTURE

### Title and Intro

**CRITICAL: The intro after the H1 title must be 1-2 SHORT sentences only.**

```markdown
---
title: [Card Title]
description: One-line summary of the card's behavior.
trigger_phrases:
  - "[primary card trigger]"
  - "[alternate request phrasing]"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# [Card Title]

[1-2 SHORT sentences: what process this card adds and to which skill or mode.]

## 1. REQUIRED FIELDS

[table — see Section 3]

## N. PROCEDURE

[numbered operating steps]
```

Every card carries the same full 5-field frontmatter block used by references and assets: `title`, `description`, 3-8 lowercase multi-word `trigger_phrases`, `importance_tier` (`normal` unless the card is a formal cross-packet contract), `contextType` (`implementation` for nearly all procedure cards), plus `version`. See [frontmatter_templates.md](../../../shared/assets/frontmatter_templates.md) for field rules.

### Body Order

Every card follows this fixed order:

1. H1 title matching `title`.
2. One-sentence intro.
3. `## 1. REQUIRED FIELDS` — the seven fields below, in order, non-empty.
4. Optional numbered sections (placement rationale, related cards, conflict rule, read-only compatibility, tool boundary) only when applicable.
5. Numbered `## N. PROCEDURE` — the operating steps.

---

## 3. REQUIRED FIELDS

Every procedure card uses these seven fields in this order:

| Field | Requirement |
|---|---|
| Purpose | One sentence describing the behavior the card adds to the owning skill or mode. |
| Owning skill/mode | The standalone skill, or the parent-hub packet, that owns this card — or `shared` with an explicit owning reviewer for a card that coordinates multiple packets. |
| Source reference | External source filename only, if the card adapts an external skill, prompt, or spec — or `No external source` with rationale. Never paste source prose into the card. |
| Trigger | Concrete request patterns or conditions that make the card applicable, evaluated only after the public skill or mode has already been selected. |
| Output contract | The exact artifact, report, or handoff the procedure must produce. |
| Proof gate | The evidence required before the card can be considered followed. |
| Privacy rule | A statement that the card is private implementation guidance and does not create a public skill, command, or mode. |

---

## 4. OPTIONAL FIELDS

Use these only when they materially improve reviewability:

| Field | Use |
|---|---|
| Placement rationale | Required for any `shared/procedures/` card; optional for a packet-local card. |
| Related cards | Names of cards that may be loaded before or after this one. |
| Conflict rule | How to choose between overlapping cards inside the same skill or mode. |
| Read-only compatibility | Required when the owning skill or mode is read-only. States that the card may be cited to produce guidance or a handoff without writing files or running commands. |
| Tool boundary | Required when the owning skill or mode can mutate the workspace. States the mutating permission boundary and that the card does not widen it. |

---

## 5. COMPLETE WORKED EXAMPLE

```markdown
---
title: Sensitive-Field Redaction Pass
description: Private procedure card for the pdf-editor skill's redaction workflow across form fields, embedded metadata, and annotations.
trigger_phrases:
  - "redact sensitive fields"
  - "pdf redaction pass"
  - "remove pii from pdf"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Sensitive-Field Redaction Pass

Private procedure card for applying the pdf-editor skill's redaction workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Let `pdf-editor` remove sensitive form-field values, embedded metadata, and annotation text before a document is shared externally. |
| Owning skill/mode | `pdf-editor` |
| Source reference | No external source |
| Trigger | Use when the request asks to redact, sanitize, or remove PII or sensitive content from a PDF before sharing. |
| Output contract | A redacted PDF with confirmed-empty form fields, stripped metadata, and a redaction log listing every field and annotation touched. |
| Proof gate | The redaction log accounts for every form field and annotation in the source document; none are silently skipped. |
| Privacy rule | This is private redaction guidance and not a public redaction skill. |

## 2. TOOL BOUNDARY

`pdf-editor` may write the redacted output file. This card does not grant any permission beyond the skill's existing Write access to its own output directory.

## 3. PROCEDURE

1. Enumerate every form field, metadata key, and annotation in the source PDF before touching any of them.
2. Classify each as sensitive or not, using the request's stated redaction scope.
3. Clear sensitive form-field values and strip sensitive metadata keys; leave non-sensitive content untouched.
4. Remove or blank sensitive annotation text.
5. Write the redacted output and a redaction log naming every field, key, and annotation that was cleared.
6. Confirm the log's field count matches the enumeration from step 1 — no silent skips.
```

This example is deliberately self-contained: see [examples_and_maintenance.md](../../references/skill/examples_and_maintenance.md) for how it extends the PDF Editor skill layout into a multi-procedure shape.

---

## 6. SELECTION RULES

1. The public skill or mode is resolved first — through the skill's own routing, or a parent hub's `mode-registry.json`. A procedure card never changes that resolution.
2. The selected skill or mode evaluates only its own `procedures/` folder, plus (parent hubs only) shared cards under `shared/procedures/` whose trigger names it.
3. A skill/mode-local exact trigger beats a shared card.
4. When two local cards match, choose the card with the narrower output contract.
5. If no card matches, the skill or mode follows its existing `SKILL.md` behavior and states that no procedure card applied.
6. (Parent hubs only) If a request spans multiple packets, the hub still decides the bundle; cards never change public routing.

---

## 7. SOURCE ADAPTATION RULES

Use these when a card adapts an external skill, prompt, or spec into OpenCode-native process:

1. Cite only the external source's filename.
2. Preserve intent, not phrasing.
3. Rewrite the procedure steps in the owning skill or mode's own tool boundary and vocabulary.
4. Do not include long source excerpts, starter code, command snippets, or proprietary prompt text.
5. Review the card by comparing purpose, trigger, output contract, and proof gate against the source's theme, not by diffing prose.

---

## 8. PROCEDURE CARD CHECKLIST

**Before publishing or updating a card, verify:**

```markdown
Structure:
□ Frontmatter includes title, description, trigger_phrases, importance_tier, contextType, and version.
□ H1 title matches the card title; intro is 1-2 sentences with no subsections.
□ Required fields appear in the required order with non-empty values.
□ Optional sections and the PROCEDURE section are numbered sequentially.

Content:
□ Source reference uses filename-only citation, or "No external source" with rationale.
□ Output contract and proof gate are concrete enough to grade pass/fail.
□ A read-only owning skill/mode does not gain Write, Edit, Bash, or execution authority through the card.

Placement:
□ Card lives under references/procedures/, <packet>/procedures/, or shared/procedures/ per Section 1.
□ Shared cards name an owning reviewer and a placement rationale.
□ Related cards and conflict rules (if present) point to real neighboring cards.
```

---

## 9. REFERENCES AND RELATED RESOURCES

### Real-World Implementation

`sk-design` (`.opencode/skills/sk-design/`) runs this exact pattern in production at hub scale: one parent hub, five public modes, each backed by its own `procedures/` folder plus `shared/procedures/` for cross-mode coordination cards. `sk-design/shared/procedure_card_schema.md` is the schema this template generalizes from — read it for a second, hub-scale worked example.

### Templates
- [skill_reference_template.md](./skill_reference_template.md) - Reference file templates (use when no trigger-based selection is needed)
- [skill_asset_template.md](./skill_asset_template.md) - Asset file templates
- [frontmatter_templates.md](../../../shared/assets/frontmatter_templates.md) - Frontmatter by document type

### Standards
- [core_standards.md](../../../shared/references/core_standards.md) - Document type rules
- [creation_workflow.md](../../references/skill/creation_workflow.md) - Full skill creation workflow
- [examples_and_maintenance.md](../../references/skill/examples_and_maintenance.md) - Worked example skills, including the procedure-card layout
