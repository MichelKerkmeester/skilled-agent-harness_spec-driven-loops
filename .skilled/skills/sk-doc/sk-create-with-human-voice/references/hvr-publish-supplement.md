---
title: "Human Voice Rules: Publish Supplement"
description: "Publish-side scoring, precedence, checklist and related resources for the Human Voice Rules, loaded after the wording standard and never alone."
trigger_phrases:
  - "publish readiness"
  - "score a document"
  - "document score"
  - "publish side"
  - "point table"
importance_tier: normal
contextType: general
version: 1.1.0.0
---

# Human Voice Rules: Publish Supplement

This supplement is loaded after the wording standard, `hvr-rules.md`, and never alone. The base is what a reply loads. This supplement is what a published document adds.

---

## 1. SCORING

- **Scoring:** Hard blockers cost -5 points. Soft deductions cost -2 or -1. Clean document starts at 100.

A document starts at 100 points. Hard blockers (-5 each) and soft deductions (-2 or -1 each) reduce the score. Below 70 is a failing grade. Below 85 needs revision before publishing. That subtraction is the whole arithmetic, and `references/scoring-and-verification.md` section 3 owns it.

### Where To Spend Attention

The shares below allocate a reader's attention across the standard. They are a rubric for the judgment pass, not a second way to compute a score: nothing multiplies a finding by a share, and no run combines them with the point arithmetic above.

| Category | Share of attention | Sections |
|----------|--------|----------|
| **Punctuation** | 15% | Section 3 |
| **Structure** | 25% | Section 4 (structural patterns, copula avoidance, synonym cycling) |
| **Content** | 25% | Section 4 (metaphors, generalisations, significance inflation, conclusions) |
| **Words** | 20% | Sections 6, 7 |
| **Voice** | 15% | Section 2 |

### Point Table

The point labels left the base's section titles. This table records what each finding costs.

| Finding | Section | Points |
|---------|---------|--------|
| Hard blocker word | 6. HARD BLOCKER WORDS | -5 |
| Phrase hard blocker | 7. PHRASE HARD BLOCKERS | -5 |
| Soft deduction, -2 tier | 8. SOFT DEDUCTIONS | -2 |
| Soft deduction, -1 tier | 8. SOFT DEDUCTIONS | -1 |

---

## 2. RULE PRECEDENCE

When a word or phrase appears in multiple categories, apply exactly one penalty using first-match-wins:

1. Phrase hard blocker (-5, Section 7)
2. Hard word blocker (-5, Section 6)
3. Context-dependent blocker (-5 metaphorical, 0 literal)
4. Soft deduction -2 (Section 8)
5. Soft deduction -1 (Section 8)
6. Context flag (0, advisory)

A term listed in both hard blocker and soft deduction is evaluated only as hard blocker. Context-dependent terms cleared as literal get no lower-tier penalty. Structural removal directives (cut_always modifiers in Section 4) are not scored penalties and apply independently.

---

## 3. PRE-PUBLISH CHECKLIST

### Scoring

A clean document starts at 100 points and every finding subtracts from it. The table below says where to look, in the order attention is worth spending, and it computes nothing.

| Category | Share of attention | What It Covers |
|----------|--------|----------------|
| **Punctuation** | 15% | Em dashes, semicolons, Oxford commas, ellipsis |
| **Structure** | 25% | Heading hierarchy, TOC format, section dividers, two-tier voice, subsection numbering |
| **Content** | 25% | Banned metaphors, generalisations, unnecessary modifiers, meta-commentary |
| **Words** | 20% | Hard blocker words, phrase hard blockers, context-dependent words |
| **Voice** | 15% | Active voice, direct address, sentence rhythm, hedging, certainty |

**Pass threshold:** 85+ (publish-ready). 70-84 (needs revision). Below 70 (failing, must rewrite).

- **Document scan:** Cover the body and read the headers alone. Each header is a label of content, not a sentence. A reader scanning them alone can tell what each section holds. The failure it prevents: a document that cannot be scanned.

### Checklist

```yaml
pre_publish_checklist:
  punctuation:
    - "No em dashes, semicolons or Oxford commas"
    - "No asterisks for emphasis. Max 1 ellipsis."

  structure:
    - "H2 sections numbered ALL CAPS, separated by `---` dividers"
    - "Numbered H3/H4 subsections use ALL CAPS"
    - "Unnumbered H3/H4 use Title Case"
    - "No Table of Contents and no `<!-- ANCHOR -->` navigation comments; navigate by the numbered H2 hierarchy"
    - "--- dividers between H2 sections"
    - "Blockquote tagline after H1 (if applicable)"
    - "No 'not just X, but also Y' patterns"
    - "No exactly 3-item inline enumerations"
    - "No exactly 3 H3 subsections under every H2"
    - "No setup language (Section 4)"
    - "No copula avoidance ('serves as', 'stands as' -- use 'is')"
    - "No synonym cycling (same entity = same word)"
    - "No false ranges ('from X to Y' without meaningful scale)"
    - "No fragmented headers (generic sentence restating heading)"
    - "Max 2 'Think of it as/like' per document"
    - "Max 1 analogy per concept, placed after technical statement"

  content:
    - "No banned metaphors or vague generalisations"
    - "No unnecessary modifiers"
    - "No meta-commentary, knowledge-cutoff disclaimers or training-data hedging"
    - "No significance inflation ('marks a pivotal moment', 'setting the stage')"
    - "No generic positive conclusions ('The future looks bright', 'Exciting times')"

  words:
    - "No hard blocker words (Section 6)"
    - "No phrase hard blockers (Section 7)"
    - "Context-dependent words checked"

  voice:
    - "Active voice throughout"
    - "Direct address where appropriate (you/your)"
    - "Varied sentence lengths"
    - "No hedging when certainty is possible"
    - "Claims backed by data or examples"
    - "Pronouns have clear antecedents"
    - "Writing has personality, not just correctness (Section 5)"
    - "Complexity acknowledged, not flattened into neat categories"
```

---

## 4. RELATED RESOURCES

### Templates That Apply HVR

| Template | Location | Focus |
|----------|----------|-------|
| Implementation Summary | `.opencode/skills/system-spec-kit/templates/*/implementation-summary.md` | Narrative prose, explain "why", direct address |
| Decision Record | `.opencode/skills/system-spec-kit/templates/level-3*/decision-record.md` | Clear rationale, no hedging, active voice |
| README | `.opencode/skills/sk-doc/sk-create-readme/assets/readme-template.md` | Welcoming tone, practical focus |
| Install Guide | `.opencode/skills/sk-doc/sk-create-readme/assets/install-guide-template.md` | Direct instructions, imperative mood |

### Standards
- [core-standards.md](../../shared/references/core-standards.md) - Document formatting standards
- [sk-doc SKILL.md](../../SKILL.md) - Parent skill with HVR enforcement rules

### Creation Guides
- [references/README.md](../../sk-create-readme/references/README.md) - README creation workflow and standards
- [references/README.md](../../sk-create-readme/references/README.md) - Install guide creation workflow
