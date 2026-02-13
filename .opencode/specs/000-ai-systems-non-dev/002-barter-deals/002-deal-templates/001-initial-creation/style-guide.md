# Barter Deal Templates — Style Guide

| Field | Value |
|-------|-------|
| **Last Updated** | 2026-02-06 |
| **Applies To** | All deal template outputs |

---

## 1. Document Structure Standards

### Required Sections (Every Deal Template)

| Section | Required | Notes |
|---------|----------|-------|
| Title | Yes | "[Product/Service Name] (value)" format |
| Deal Description | Yes | Variable section, variation scaling applies |
| Creator Requirements | Yes | Fixed structure per deal type |
| Optional Add-ons | Conditional | Include when applicable |
| Value/Pricing | Yes | EUR only, explicit amounts |

### Section Order

1. Title (H2)
2. Deal Description (paragraph)
3. What You Receive (if complex)
4. Creator Requirements (H2 + bullet list)
5. Optional Add-ons (H2 + bullet list, if applicable)
6. Content Usage and Compensation (if applicable)

---

## 2. Voice and Tone Standards

### Terminology Table

| Always Use | Never Use | Reason |
|-----------|-----------|--------|
| Creators | Influencers | Core brand identity |
| Collaboration | Campaign | Partnership framing |
| Content | Posts | Platform-agnostic |
| Authentic | Organic | More specific |
| EUR / € | USD / $ | Market standard |

### HVR Hard Blockers (Immediate Rejection)

These trigger automatic rejection in any deal template:

| Blocker | Example | Fix |
|---------|---------|-----|
| Em dashes (—) | "The box—filled with products—arrives" | "The box, filled with products, arrives" |
| Semicolons (;) | "Great value; perfect for content" | "Great value. Perfect for content." |
| "Not just X, but also Y" | "Not just a box, but an experience" | "A box and an experience" |
| Hard blocker words | "delve into this collaboration" | "explore this collaboration" |
| Setup language | "In conclusion, this deal..." | State it directly |
| Exactly 3-item lists | "quality, value, and trust" | "quality and value" or "quality, value, trust and authenticity" |

### Tone per Deal Type

| Deal Type | Tone | Characteristics |
|----------|------|----------------|
| Product | Informative, benefit-driven | Focus on what the creator receives, product quality, use cases |
| Service | Experiential, atmospheric | Focus on the experience, setting, moments, shareability |

### General Voice Rules

- Short sentences preferred (under 20 words)
- Active voice always
- Second person ("you will receive", "your audience")
- Concrete over abstract ("€150 value" not "significant value")
- Numbers before claims ("12,000+ creators" not "many creators")

---

## 3. Template Structure Standards

### Fixed Sections

These sections follow standardized patterns and do not vary across description variations:

**Title Format:**
```
[Action verb] [Product/Service Name] ([value])
```
Examples:
- "Receive a Rituals Surprise Box (€150 value)"
- "Dinner for 4 at Spaghetteria + €50 Compensation"

**Creator Requirements Format:**
```
**What we ask in return:**
- 1x Instagram Reel or TikTok (minimum 30 seconds)
- Show the [product in use / experience clearly]
- Keep the content authentic and in your own style
- Tag @[brandhandle] in both caption and content
```

**Optional Add-ons Format:**
```
- **Spark Ads / Partnership Ads**
    [One-sentence explanation]

- **Content usage rights**
    [One-sentence explanation]
    *(We recommend receiving the content through WeTransfer to maintain the quality)*
```

### Variable Section (Deal Description)

The description section is where creative variation occurs. It should:
- Open with brand introduction (1-2 sentences)
- State what the creator receives (explicit, concrete)
- Explain why this is worth creating content for (benefit-driven)
- Keep total length between 50-150 words for standard deals

---

## 4. DEAL Scoring Integration

### How Scoring Affects Style

| DEAL Component | Style Implication |
|---------------|------------------|
| Description (6 pts) | Clear product/service intro, explicit value statement, brand context |
| Expectations (7 pts) | Specific creator requirements, defined deliverables, clear format |
| Appeal (6 pts) | Compelling language, creator benefit focus, engaging tone |
| Legitimacy (6 pts) | Transparent pricing, clear terms, HVR compliance (2 pts) |

### Common Score Deductions

| Issue | Component Affected | Fix |
|-------|-------------------|-----|
| Vague value ("great products") | Description -2 | State exact value ("€150 value") |
| Unclear deliverables | Expectations -3 | Specify format, duration, platform |
| No creator benefit stated | Appeal -2 | Add "perfect for [niche] content" |
| AI-sounding language | Legitimacy -2 | Run HVR check, replace flagged words |

---

## 5. Export Naming Convention

### File Pattern

```
/export/[###] - deal-[type]-[brand].md
```

### Rules

- `[###]`: Zero-padded sequential number (001, 002, 003...)
- `[type]`: `product` or `service`
- `[brand]`: Lowercase, hyphenated brand name
- Check existing files to determine next number

### Examples

| File Name | Type | Brand |
|----------|------|-------|
| `001 - deal-product-rituals.md` | Product | Rituals |
| `002 - deal-service-spaghetteria.md` | Service | Spaghetteria |
| `003 - deal-product-hema.md` | Product | HEMA |
| `004 - deal-service-foodhallen.md` | Service | De Foodhallen |

---

## 6. Cross-System Consistency

### Shared Elements with Copywriter

| Element | Copywriter | Deal Templates | Consistent? |
|---------|-----------|----------------|-------------|
| HVR v0.100 | Yes | Yes (copied) | Identical |
| Brand voice DNA | Yes | Yes (extended) | Core identical, deal additions |
| "Creators" terminology | Yes | Yes | Identical |
| EUR formatting | Yes | Yes | Identical |
| Export protocol | Yes | Yes (deal naming) | Pattern identical, naming differs |
| DEPTH methodology | 10 rounds fixed | 7/10/5/1-3 adaptive | Adapted, not identical |
| Scoring system | MEQT (25 pts) | DEAL (25 pts) | Different dimensions, same total |

### Voice Consistency Checks

When reviewing Deal Templates output against Copywriter output:
- Same sentence length patterns (short, punchy)
- Same use of action verbs ("receive", "create", "tag")
- Same trust builders ("no hidden fees", "authentic")
- Same empowerment language ("you choose", "your style")
- Different scoring system (DEAL not MEQT) but same quality threshold (19+/25)

---

## 7. Output Artifact Standards

### System Header (Required on Every Export)

```
<!-- Mode: $[mode] | Scoring: DEAL [score]/25 | Template: v1.0 -->
```

### Processing Summary (Chat Response After Export)

```
Deal template exported.

File: /export/[###] - deal-[type]-[brand].md
DEAL Score: [score]/25
  D: [x]/6 | E: [x]/7 | A: [x]/6 | L: [x]/6
HVR: CLEAN (0 violations)
Variations: [count] generated
```

### Command Shortcut Reference

| Command | Use When |
|---------|----------|
| `$product` | Creating a product-based deal |
| `$service` | Creating a service/experience deal |
| `$quick` | Fast draft, minimal questions |
| `$improve` | Refining an existing deal |
| `$score` | Scoring existing text only |
| `$hvr` | HVR compliance check only |

---

## 8. Interactive Mode Style

### Question Formatting

- Use numbered lists for required questions
- Use "Optional" label for non-required fields
- Bold the field name: **Brand name:**
- Keep questions to one line each
- Provide defaults in brackets: `[both]`, `[@brandname]`

### Tone in Interactive Mode

- Direct and helpful, not chatty
- "Before I create this deal template, I need a few details:"
- Never apologize for asking questions
- Acknowledge inline parameters: "Got it — HEMA, product deal. A few more details:"
