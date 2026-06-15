---
title: "Design References (real-world critique-against via Mobbin and Refero)"
description: "How to read real-world shipped UI live via the Mobbin and Refero MCPs (Code Mode) to name the real-world default for a pattern and then deviate from it deliberately. Resolve one reference from the subject, never an inspiration menu, never copied into the repo."
trigger_phrases:
  - "mobbin refero design reference"
  - "real world ui reference critique against"
  - "name the real world default then deviate"
  - "shipped app screens reference mobbin"
  - "design references mcp code mode"
importance_tier: normal
contextType: implementation
---

# Design References (real-world critique-against via Mobbin and Refero)

How to put real-world shipped UI to work as judgment input without letting it turn the skill into a trend-copier or a chooser. Mobbin and Refero index hundreds of thousands of real app screens and flows. Read one matching reference live through Code Mode to see what the real-world default for a pattern actually is, so a deliberate move off it reads as a choice. It is never a gallery to copy from and never a menu of vibes to pick.

---

## 1. OVERVIEW

### Core Principle

`design_principles.md` says a design that reads as a templated default has failed, and the AI defaults are not the only defaults. The real-world median, what most shipped apps in a category already look like, is its own gravity well. Mobbin and Refero make that real-world median legible. Their value is to name the convention precisely so a deviation reads as a choice, the same critique-against move `design_inventory.md` makes with a design system. They are reference, not raw material: you read what the trend is, you do not paste it.

### When to Use

- When the brief sits in a crowded product category and you need to see the real-world default for a screen or flow so you can push off it.
- When a flow carries strong user-expectation conventions (checkout, onboarding, settings) and you want to honor the convention where it serves the user and break it only where breaking it earns its keep.
- When you want to name the expected real-world look for a brief in one line, then deviate deliberately.

### Source Of The References

- **Mobbin** (`mobbin.*` via Code Mode): real iOS and web app screens and flows. Two tools, `mobbin_search_screens` and `mobbin_search_flows`, take a natural-language `query` and a required `platform` of `ios` or `web`. Each result carries a `mobbin_url` worth citing back to the user.
- **Refero** (`refero.*` via Code Mode): shipped UI screens, flows, and styles. Tools include `refero_search_screens`, `refero_get_similar_screens`, `refero_get_screen`, `refero_get_screen_image`, `refero_search_flows`, `refero_get_flow`, `refero_search_styles`, and `refero_get_style`. Search styles for visual direction, screens for concrete UI, each with a `platform` of `ios` or `web`.
- Both are read live through Code Mode and need the user's own paid subscription and OAuth. Nothing is cached or copied into the skill, which keeps it Apache-2.0 only with no new third-party notice burden.
- Both are OPTIONAL and never required. When no real-world reference fits, or the subscription is not connected, the free-axis anti-default process in `design_principles.md` governs exactly as before.

### Code Mode Access Pattern

These are Code Mode (UTCP) manuals, not in-process tools. Discover first, then call:

1. `search_tools("mobbin app screens")` or `tool_info(...)` to resolve the exact tool name and arguments.
2. `call_tool_chain([...])` with the resolved call, for example `mobbin.mobbin_search_screens({ query, platform })` or `refero.refero_refero_search_screens({ query, platform })`. Call the tools synchronously (no top-level `await`); each returns the MCP content array, where the text block holds the JSON metadata (including a citable URL) and an image block holds the screenshot.

Newly-wired manuals load at Code Mode startup, so a reference that does not resolve usually means the session predates the wiring or the subscription is not yet authorized.

---

## 2. THE ANTI-DEFAULT-SAFE USE

A resolved reference is put to work as the named real-world default to push against, plus the conventions worth honoring.

### Critique-against (name the real-world default, then move off it)

Resolve the one reference (an app, a flow, a screen) that is the closest realized example of the real-world default for the brief, then write one line naming it: "the expected look for this category is X." That X is now a constraint to push against. Take the one justified aesthetic risk away from it, and keep the quality floor (`ux_quality_reference.md`).

### Honoring conventions (where the convention serves the user)

Some real-world patterns are conventions for good reason: users expect the cart top-right, the primary action within thumb reach on mobile. A reference can confirm a convention worth keeping so the deviation budget is spent where it matters, not on confusing the user. This is judgment informed by the reference, not the reference dictating the design.

### Not reuse-ground, not a copy source

Unlike a design system in `design_inventory.md`, which the user owns locally and can reuse tokens and components from, Mobbin and Refero are third-party records of other companies' shipped products. They are never reuse-ground. There are no tokens to paste, and reproducing their screens is both a quality failure, because it is the trend by definition, and a licensing one. The reference informs the decision. It never becomes the decision.

---

## 3. HOW TO USE IT IN THE PROCESS

This plugs into **STEP 2 (critique the plan against the defaults)** of the `design_principles.md` process, alongside `design_inventory.md`:

1. Name the subject and brief (STEP 0-1).
2. Resolve one real-world reference from the subject and brief through Code Mode. Name the single closest realized default for the category.
3. Write one line: "the real-world default here is X." That X is now a constraint to push against. Note any convention genuinely worth honoring.
4. Take your one justified aesthetic risk away from the named default. Keep the quality floor.

If a brief explicitly pins the direction, the brief wins (NEVER override a pinned brief), even when it asks for the real-world default look.

---

## 4. HARD RULES FOR THESE REFERENCES

- **NEVER surface a list of references as a chooser or inspiration menu.** Resolve exactly one reference from the subject and brief. A scroll-the-gallery-and-pick flow is precisely the templated-default behavior the skill resists.
- **NEVER copy a reference into the design or the repo.** Mobbin and Refero are read live and never cached. Reproducing a competitor's screen is the trend by definition, fails the anti-default mandate, and copies third-party IP.
- **NEVER let a reference become a copy-the-trend preset or an auto-recommend flow.** A reference is input to judgment, read only. It names the default to deviate from. It does not generate the design.
- **Grounding stays upstream and non-negotiable.** The subject, audience, and page job (`design_principles.md` STEP 0) come first. A reference is consulted only after the subject is grounded, never as a substitute for grounding.
- **The quality floor still applies.** A deviation that breaks contrast, touch targets, or motion sensitivity is not a bold choice, it is a defect (`ux_quality_reference.md`).

---

## 5. RELATED RESOURCES

- [design_principles.md](./design_principles.md) sets the aesthetic direction and the anti-default mandate this reference helps you deviate from, and stays the authority.
- [design_inventory.md](./design_inventory.md) is the sibling critique-against (and reuse-ground) path for a real design system read via `mcp-open-design`. Same one-reference, no-chooser, read-live discipline.
- [ux_quality_reference.md](./ux_quality_reference.md) holds the quality floor every deviation must still clear.
- [claude_design_parity.md](./claude_design_parity.md) owns the no-chooser guardrail across the design loop.
