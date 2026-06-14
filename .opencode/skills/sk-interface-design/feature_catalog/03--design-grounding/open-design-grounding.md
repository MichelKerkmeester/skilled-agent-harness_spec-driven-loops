---
title: "Open Design grounding (reuse or critique-against)"
description: "Uses a real Open Design design system, read live via mcp-open-design, as either reuse-ground or the named default to deviate from, resolving one system from the subject rather than offering a chooser."
trigger_phrases:
  - "open design grounding"
  - "reuse ground or critique against"
  - "real design system read live"
  - "name the default to deviate from"
---

# Open Design grounding (reuse or critique-against)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Uses a real Open Design design system, read live via `mcp-open-design`, as either reuse-ground or the named default to deviate from, resolving one system from the subject rather than offering a chooser.

This is how the skill grounds in concrete, fully-realized design systems without becoming a templated generator. A matched system is read live when the Open Design app is installed, and it serves one of two anti-default-safe roles: the ground a brief should reuse before generating anything net-new, or the closest realized example of the generic default that a deliberate move pushes against. The aesthetic inventory is sourced live and is never cached into the skill, which keeps the skill Apache-2.0 only.

## 2. HOW IT WORKS

### The two anti-default-safe uses

A resolved system is put to work in one of two ways, chosen by the brief. As reuse-ground, when a real brand or aesthetic fits the subject, the skill reuses its `tokens.css` tokens and `components.html` components before authoring net-new, the same reuse-before-generate move the parity loop defines. As critique-against, when the goal is a distinctive answer, the skill names the one system closest to the generic default for the brief and treats that named look as a constraint to push against, taking its one justified aesthetic risk away from it.

### Hard rules

Five rules hold. Exactly one system is resolved from the subject and brief, never a list surfaced as a chooser. A system is read only and is never wired into an auto-recommend or generator flow, since generation and handoff belong to `mcp-open-design`, `mcp-magicpath`, and `sk-code`. A reused or named system is never presented as the design decision, since the decision comes from the subject and the brief. A system is never cached or copied into the skill, which would attach its license and require a new notice. The quality floor still applies, so a deviation that breaks contrast, touch targets, or motion sensitivity is a defect rather than a bold choice.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/design_inventory.md` | Shared | Defines the reuse-ground and critique-against uses, the process plug-in, and the no-chooser hard rules over a live-read Open Design system. |
| `references/claude_design_parity.md` | Shared | Sections 2 and 3 own the intake and reuse-before-generate steps where a live Open Design system grounds the work. |
| `references/design_principles.md` | Shared | Section 4 owns the authority that the grounding defers to during the critique. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `SKILL.md` | Manual playbook | Sections 2, 5, and 7 require an Open Design system to be optional, read live, and never a chooser, with `design_principles.md` as the authority. |

---

## 4. SOURCE METADATA

- Group: Design grounding
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--design-grounding/open-design-grounding.md`

Related references:
- [../02--quality-floor/objective-quality-floor.md](../02--quality-floor/objective-quality-floor.md) - Objective quality floor
- [../07--claude-design-parity/ground-and-reuse-before-generate.md](../07--claude-design-parity/ground-and-reuse-before-generate.md) - Ground and reuse before generate
