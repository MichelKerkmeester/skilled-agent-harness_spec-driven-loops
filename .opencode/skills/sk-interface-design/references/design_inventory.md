---
title: "Design Inventory (reuse-ground or critique-against)"
description: "How to use a real Open Design design system, read live via mcp-open-design when that app is installed, as either reuse-ground or the named default to critique against. Resolve one system from the subject, never a pick-a-vibe menu."
trigger_phrases:
  - "design inventory reuse ground critique against"
  - "open design system ground or deviate"
  - "name the default to deviate from"
  - "real design system reuse before generate"
  - "deviate from templated default"
importance_tier: normal
contextType: implementation
---

# Design Inventory (reuse-ground or critique-against)

How to put a real, fully-realized design system to work without letting it turn the skill into a chooser. When the Open Design app is installed, `mcp-open-design` can read one matching system live. That system is either the ground to reuse or the named default to deviate from. It is never a menu of vibes to pick.

---

## 1. OVERVIEW

### Core Principle

`design_principles.md` says a design that reads as a templated default has failed. A real design system helps two ways without breaking that rule. It can be the concrete ground a brief should reuse before generating anything net-new, and it can be the closest realized example of the generic default so a deliberate move off it reads as a choice. Resolve exactly one system from the subject and brief, the same way `design_principles.md` Step 0 grounds the subject. Surfacing a list of systems to choose from is itself the templated-default behavior this skill resists.

### When to Use

- When the brief names or strongly implies a brand or aesthetic that a real design system already realizes.
- When you need a concrete system to ground in and reuse before authoring net-new.
- When you want to name the expected look for a brief in one line so you can deviate from it deliberately.

### Source Of The Systems

- An Open Design design system, read live via `mcp-open-design` when that app is installed (`od mcp` get_file/search_files, or `od tools design-systems read`). Read `DESIGN.md` for direction, `tokens.css` for the paste-ready `:root` tokens, and `components.html` for reusable component markup.
- The read is live and never cached. Open Design content is never copied into this skill, which keeps the skill Apache-2.0 only and free of any new third party notice burden.
- `mcp-open-design` is optional and never required. When no real system fits, the free-axis anti-default process in `design_principles.md` governs exactly as before.

---

## 2. THE TWO ANTI-DEFAULT-SAFE USES

A resolved system is put to work in one of two ways, chosen by the brief.

### Reuse-ground (reuse before generate)

When a real brand or aesthetic fits the subject, treat its system as the ground. Reuse its `tokens.css` tokens and `components.html` components before authoring anything net-new, the same reuse-before-generate move the parity loop defines. Reuse is anti-default by construction, so grounding in a real system strengthens the mandate rather than diluting it. The one justified aesthetic risk is still spent, now within the grounded system.

### Critique-against (name the default, then move off it)

When the goal is a distinctive answer rather than reuse, resolve the one system that is the closest realized example of the generic default for the brief, then write one line naming it. That named look is now a constraint to push against. Take the one justified aesthetic risk away from it, and keep the quality floor (`ux_quality_reference.md`).

---

## 3. HOW TO USE IT IN THE PROCESS

This plugs into **STEP 2 (critique the plan against AI-default looks)** of the `design_principles.md` process:

1. Name the subject and brief (STEP 0-1).
2. Resolve one system from the subject and brief. If the brief fits a real brand, that brand is the reuse-ground. Otherwise name the single closest realized default.
3. For reuse-ground, reuse its tokens and components before generating. For critique-against, write one line: "the expected look here is X." That X is now a constraint to push against.
4. Take your one justified aesthetic risk grounded in the system or away from the named default. Keep the quality floor.

If a brief explicitly pins the direction, the brief wins (NEVER override a pinned brief), even if it asks for the expected look.

---

## 4. HARD RULES FOR THIS INVENTORY

- **NEVER surface a list of systems as a chooser.** Resolve exactly one system from the subject and brief. A pick-a-vibe menu is precisely the templated default the skill resists, and `claude_design_parity.md` Section 8 already forbids it.
- **NEVER wire a system into an auto-recommend or generator flow.** A real system is input to judgment, read only. Generation and handoff belong to `mcp-open-design` and `sk-code`.
- **NEVER present a reused or named system as the design decision.** It is the ground to reuse or the baseline to deviate from. The decision comes from the subject and the brief, per `design_principles.md`.
- **NEVER cache or copy a system into the skill.** Read it live via `mcp-open-design`. Copying its `DESIGN.md`, `tokens.css`, or `components.html` into the repo would attach that source's license and require a new third party notice.
- **The quality floor still applies.** A deviation that breaks contrast, touch targets, or motion sensitivity is not a bold choice, it is a defect (`ux_quality_reference.md`).

---

## 5. RELATED RESOURCES

- [design_principles.md](./design_principles.md) sets the aesthetic direction this inventory grounds in or helps you deviate from, and stays the authority.
- [ux_quality_reference.md](./ux_quality_reference.md) holds the quality floor every reuse and every deviation must still clear.
- [claude_design_parity.md](./claude_design_parity.md) is the shared loop where reuse-before-generate from a real system happens, and it owns the no-chooser guardrail.
