---
title: "Design-references grounding (Mobbin and Refero, initiative or ask)"
description: "Reads real-world shipped UI live via the Mobbin and Refero MCPs as the named real-world default to deviate from, deciding on its own initiative or by asking the user, resolving one reference from the subject rather than offering a chooser."
trigger_phrases:
  - "design references grounding mobbin refero"
  - "real world default initiative or ask"
  - "shipped ui reference read live"
  - "name the real world default then deviate"
version: 1.5.0.1
---

# Design-references grounding (Mobbin and Refero, initiative or ask)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Reads real-world shipped UI live via the Mobbin and Refero MCPs as the named real-world default to deviate from, deciding on its own initiative or by asking the user, resolving one reference from the subject rather than offering a chooser.

This is how the skill grounds in the real-world median, what most shipped apps in a category already look like, without becoming a trend-copier. Mobbin and Refero index hundreds of thousands of real app screens and flows; reading one matching reference live through Code Mode names the convention precisely so a deliberate move off it reads as a choice. The reference is third-party record, read live and never cached or copied into the skill, which keeps the skill Apache-2.0 only. It is reference, never raw material, and it never becomes the design decision.

## 2. HOW IT WORKS

### The anti-default-safe use

A resolved reference is put to work as the named real-world default to push against, plus the conventions worth honoring. The skill resolves the one reference closest to the real-world default for the brief, writes one line naming it ("the expected look for this category is X"), takes its one justified aesthetic risk away from that named default, and keeps the quality floor. A reference can also confirm a convention worth keeping (cart top-right, primary action within thumb reach) so the deviation budget is spent where it matters. Unlike a design system the user owns, Mobbin and Refero are never reuse-ground: there are no tokens to paste, and reproducing a competitor's screen is both a quality failure and a licensing one.

### The hybrid initiative/ask routing

At the critique step (STEP 2), after the subject is grounded, the skill judges whether a real-world reference would sharpen the work, then chooses how to act. A reference is worth pulling when the brief sits in a convention-heavy or crowded category where the real-world default is strong: checkout and payment, onboarding and auth, settings and account, dashboards and analytics, social feeds, pricing pages, data tables, calendars and scheduling, messaging and chat, search and filters. It helps little for a highly novel or bespoke brief, or when the brief already pins the direction. The decision then routes three ways: take the initiative and pull ONE reference when the category clearly benefits AND a Mobbin/Refero subscription is connected (name the default, cite the URL, say that you did it); ask the user first when it is borderline, when the subscription status is unknown, or when an unprompted paid lookup would be surprising; and fall back to the generic anti-default process when no subscription is connected or the user declines. This is never blocking.

### Picking the source and the hard rules

The source is picked by surface: Mobbin for native/iOS or in-app screens and flows, Refero for web marketing/product pages and visual-style direction (search styles first); when both could fit, match the design target's platform. Five rules hold. Exactly one reference is resolved from the subject and brief, never a list surfaced as a chooser or inspiration menu. A reference is read live and never copied or cached into the design or the repo. A reference is input to judgment only and never becomes a copy-the-trend preset or an auto-recommend flow. Grounding stays upstream and non-negotiable, consulted only after the subject is grounded. The quality floor still applies, so a deviation that breaks contrast, touch targets, or motion sensitivity is a defect rather than a bold choice. A pinned brief always wins, even when it asks for the real-world default look.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/design-grounding/design_references_mcp.md` | Shared | Defines the critique-against use, the initiative/ask/fall-back decision gate (Section 3), the Mobbin-vs-Refero source pick, and the no-chooser, read-live, never-copied hard rules. |
| `references/mcp-tooling/mobbin_tools.md` | Shared | Mobbin MCP tool catalog (`search_screens`, `search_flows`): arguments, the verified Code Mode call convention, result shape, and troubleshooting. |
| `references/mcp-tooling/refero_tools.md` | Shared | Refero MCP tool catalog (8 tools across styles, screens, flows): the styles-first model, the Code Mode call convention, result shape, and troubleshooting. |
| `references/design-process/design_principles.md` | Shared | Section 4 owns the authority and the anti-default mandate this reference helps you deviate from. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `SKILL.md` | Manual playbook | Section 2 (the INITIATIVE / ASK resource row) and the Section 4 ALWAYS rule 7 require deciding by initiative or ask, one reference, read live, never a chooser, never copied, with `design_principles.md` as the authority. |

---

## 4. SOURCE METADATA

- Group: Design grounding
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--design-grounding/design-references-grounding.md`

Related references:
- [design-system-grounding.md](design-system-grounding.md) - Design-system grounding
- [../01--design-process/critique-against-defaults.md](../01--design-process/critique-against-defaults.md) - Critique against AI-default looks
