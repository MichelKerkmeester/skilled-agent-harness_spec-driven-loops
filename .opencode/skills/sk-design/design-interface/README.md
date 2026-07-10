---
title: interface
description: Aesthetic-direction skill for distinctive, intentional UI. Drives palette, typography, layout and motion choices that avoid templated AI defaults, then hands implementation to sk-code.
trigger_phrases:
  - "interface design"
  - "frontend design"
  - "make it look good"
  - "looks templated"
  - "redesign"
version: 1.6.1.0
---

# interface

> Design interfaces that could not be mistaken for anyone else's: deliberate palette, typography, layout and motion grounded in the brief, with a critique pass that kills templated AI defaults before a line of code is written.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Aesthetic direction when building or reshaping UI: palette, typography, layout, motion, signature element, and interface copy |
| **Invoke with** | "interface design", "make it look good", "redesign", "looks templated", "hero section" or auto-routing on design intent |
| **Works on** | Any front-end surface, pairing with `sk-code` for implementation and `mcp-chrome-devtools` for screenshot self-critique |
| **Produces** | A grounded design plan (token system + signature) critiqued against AI-default looks, then built to a responsive, accessible quality floor |

---

## 2. OVERVIEW

### Why This Skill Exists

AI-generated UI clusters around a handful of default looks that appear regardless of subject: cream-and-serif-and-terracotta, near-black-with-one-acid-accent, broadsheet-hairlines. They are safe, and they are why generated designs read as templated. A model building UI without explicit direction reaches for those defaults and for scattered motion that signals "AI made this." This skill gives the framework a reusable, advisor-routable point of view: ground the design in the subject, make deliberate choices, take one justified risk, and critique the plan before building.

### What It Does

The skill owns aesthetic direction, not implementation. It routes a design task through a two-pass process: ground the subject, brainstorm a compact token system (4-6 named colors, a display and body face, a layout concept, one signature element), then critique that plan against the known AI-default looks and revise anything generic with a stated reason. Only then does code get written, deriving every choice from the revised plan. It also carries interface-writing rules, because copy can make a design feel as templated as the visuals. Implementation is handed to `sk-code`, which builds and verifies against the detected web surface.

This is vendored from Anthropic's `frontend-design` skill (Apache-2.0). The full design guidance lives verbatim in `references/design-process/design_principles.md`, and the `SKILL.md` is a lean house-template router over it.

---

## 3. QUICK START

**Step 1: Let the advisor route a design task here, or read the skill directly.**

```bash
# The advisor surfaces this skill on design intent. To read it directly:
cat .opencode/skills/sk-design/design-interface/SKILL.md
```

**Step 2: Ground the subject and brainstorm a token system.**

Name one concrete subject, its audience, and the page's single job. Then draft a compact plan:

```text
Color:     4-6 named hex values drawn from the subject's world
Type:      a characterful display face (used with restraint) + a body face
Layout:    a one-sentence concept + an ASCII wireframe
Signature: the single element the page will be remembered by
```

**Step 3: Critique against the defaults, then build.**

```text
For each part of the plan, ask: would I produce this for any similar brief?
If yes, it is a default, not a choice. Revise it and say what changed and why.
Then build from the revised plan and hand implementation to sk-code.
```

Full guidance: [`references/design-process/design_principles.md`](./references/design-process/design_principles.md).

---

## 4. HOW IT WORKS

### Register And Dials First

Before the token system, the skill sets one posture and reads the brief into three working values. The shared [`../shared/register.md`](../shared/register.md) decides whether the surface is a Brand surface (design IS the product) or a Product surface (design SERVES the product), which gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity. Then [`references/design-process/brief_to_dials.md`](./references/design-process/brief_to_dials.md) reads the brief into the VARIANCE, MOTION, and DENSITY dials within that posture. The dials are the agent's internal calibration stated in a one-line Design Read, never a pick-a-vibe menu surfaced to the user.

### The Two-Pass Process

The skill never jumps straight to code. It grounds the subject, brainstorms a token system, and critiques that plan against three known AI-default looks before building. Anything that reads as a generic default gets revised with a stated reason, and every color and type decision in the build derives from the revised plan.

### Restraint Is The Mechanism

Boldness is spent in one place. The signature element is the one memorable move and everything around it stays quiet and disciplined. Decoration that does not serve the brief is cut, including numbered markers when the content is not actually a sequence, and motion that piles up rather than serving one orchestrated moment. The build meets a quiet quality floor: responsive to mobile, visible keyboard focus, reduced motion respected.

### Copy Is Design Material

Words exist to make an interface easier to use. The skill writes from the end user's side of the screen in active voice, keeps action names consistent across a flow, and treats errors and empty states as direction rather than mood.

### Producing Real UI

When the work moves past a plan into a real render, on a recreated repo, a generation run, or code, the skill follows the real-UI loop: ground in the design system, reuse components and tokens before generating, check the real render against the quality floor and the anti-default critique, then hand off cleanly. It stays a loop, not a product, and never adds a style-preset menu. The loop lives in [`references/design-process/real_ui_loop.md`](./references/design-process/real_ui_loop.md).

### Mechanical Delivery Gates

A taste read does not catch a four-line hero, a button the same color as its label, "Jane Doe" in a testimonial, or a visible em-dash. Two binary gates close that gap before delivery. The layout gate in [`references/design-process/mechanical_defaults.md`](./references/design-process/mechanical_defaults.md) counts the hero lines, the bento cells against content, and the eyebrows against a `ceil(sectionCount / 3)` ceiling, and computes button contrast against the real background. The content gate in [`references/design-process/copy_and_mock_data.md`](./references/design-process/copy_and_mock_data.md) sweeps for lorem, AI-tell phrasing, fake-precise numbers, a mixed copy register, and lazy image seeds. The checkable form of both, plus the dial calibration, is the fill-in [`assets/interface_preflight_card.md`](./assets/interface_preflight_card.md): every box is binary and a single fail means the surface is not done.

### Where The Detail Lives

`references/design-process/design_principles.md` holds the verbatim guidance: grounding, the full design principles, the two-pass process with the AI-default calibration, restraint and self-critique, and interface writing.

### Private Procedure Cards

The maintainer-facing cards in [`procedures/`](./procedures/) support mode-local context and proof selection after the public `interface` mode is chosen. The six cards are `aesthetic_direction.md`, `deck_direction_spec.md`, `discovery_question_round.md`, `prototype_flow_spec.md`, `variation_set.md` and `wireframe_exploration.md`. They are not user-selectable routes.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for it whenever a task has a visual surface and the look should feel intentional: a new page or component, a redesign, a section variation, or any "make it look good" request. Skip it for pure logic or back-end work, and defer to the brief when the brief already pins the visual direction.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns implementation. This skill sets the look, and sk-code builds it to the detected web surface's standards and verifies it. |
| `sk-code` (code-review mode) | Audits the built UI against the standards sk-code enforces. |
| `mcp-chrome-devtools` | Drives a real browser to screenshot the build for the self-critique step. |
| `mcp-code-mode` | Transport for the optional Mobbin/Refero real-world reference lookups (`mobbin.*` / `refero.*`). Co-load it before any lookup; this skill does not call Code Mode directly. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| The output still looks templated | The plan was not critiqued against the AI-default looks, or a free axis was spent on a default | Run the critique pass in `design_principles.md` Section 4, then revise each generic part with a stated reason |
| The design feels busy or "AI-made" | Boldness was spread across many elements, or motion piled up | Spend boldness on one signature element, cut one accessory, reduce to one orchestrated motion moment |
| Copy undercuts the design | Labels describe the system, not what the user controls | Apply `design_principles.md` Section 6: active voice, end-user vocabulary, consistent action names |
| The brief asked for a "default" look and the skill fought it | The brief's direction always wins | Follow the brief verbatim, since default-avoidance applies only to free axes |

---

## 7. FAQ

**Q: Does this skill write the code?**

A: No. It owns aesthetic direction and the design plan. `sk-code` owns implementation and verification for the detected web surface. The two pair: design here, build there.

**Q: What are the "AI-default looks" it avoids?**

A: Three clusters that appear regardless of subject: cream background with a high-contrast serif and terracotta accent, near-black with one bright acid accent, broadsheet hairlines with zero radius. They are legitimate for some briefs but are defaults, not choices. On a free axis, the skill does not spend it on one of these.

**Q: What if the brief already specifies the look?**

A: The brief wins, verbatim, even when it asks for one of the default looks. Default-avoidance only applies to axes the brief leaves free.

**Q: Where did this come from?**

A: It is vendored from Anthropic's official `frontend-design` skill under Apache-2.0. `LICENSE.txt` carries the full terms and attribution, and the guidance is preserved verbatim in `references/design-process/design_principles.md`.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| Skill structure | `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-interface/ --check` reports the skill valid (validation only; omit `--check` to also build a zip) |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design/design-interface/README.md --type readme` reports zero issues |
| Reference structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design/design-interface/references/design-process/design_principles.md --type reference` reports zero issues |
| Advisor discovery | `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"make this landing page look distinctive"}' --warm-only --format json` lists `interface` |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES (house template) |
| [`references/design-process/design_principles.md`](./references/design-process/design_principles.md) | Full verbatim guidance: grounding, design principles, two-pass process, restraint, interface writing |
| [`../shared/register.md`](../shared/register.md) | The shared Brand-vs-Product operating register, set first: it gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity |
| [`references/design-process/brief_to_dials.md`](./references/design-process/brief_to_dials.md) | The Design Read intake that reads a brief into the VARIANCE, MOTION, and DENSITY dials within the posture: internal calibration, never a chooser |
| [`references/design-process/mechanical_defaults.md`](./references/design-process/mechanical_defaults.md) | The mechanical layout gate: counted hero lines, gapless bento math, the eyebrow ceiling, button contrast, and section spacing |
| [`references/design-process/copy_and_mock_data.md`](./references/design-process/copy_and_mock_data.md) | The content gate: no lorem, no AI-tell phrasing, plausible names and numbers, one copy register, and image-seed discipline |
| [`assets/interface_preflight_card.md`](./assets/interface_preflight_card.md) | The binary fill-in PASS or FAIL pre-flight card: the checkable form of the layout gate, content gate, and dials, run as the last filter before delivery |
| [`procedures/`](./procedures/) | Six maintainer-facing procedure cards for aesthetic direction, deck direction, discovery questions, prototype flow, variation sets and wireframe exploration |
| [`references/design-process/ux_quality_reference.md`](./references/design-process/ux_quality_reference.md) | The objective quality floor (accessibility, motion, touch, responsive, forms, charts): the pass/fail gate after the direction is set |
| [`references/design-process/real_ui_loop.md`](./references/design-process/real_ui_loop.md) | The real-UI loop: ground in a system, reuse before generating, fidelity check, handoff |
| [`references/design-process/variation_diversity.md`](./references/design-process/variation_diversity.md) | Seed-of-thought debias for two or more directions: a non-median start in a grounded option space, spread to be distinct, never a style chooser |
| [`references/design-grounding/design_inventory.md`](./references/design-grounding/design_inventory.md) | A real design system you own, read live, as either reuse-ground or the named default to critique against. One system, never a chooser |
| [`references/design-grounding/design_references_mcp.md`](./references/design-grounding/design_references_mcp.md) | Real-world critique-against references (Mobbin, Refero via Code Mode through `mcp-code-mode`): name the category's real-world default, then deviate. One reference, read live, never copied. Tool catalogs in `references/mcp-tooling/` |
| [`LICENSE.txt`](./LICENSE.txt) | Apache-2.0 license and attribution for the vendored Anthropic content |
| [`sk-code`](../../sk-code/README.md) | Implementation partner: builds and verifies the design for the target web surface |
| [`mcp-figma`](../../mcp-tooling/mcp-figma/README.md) | Sibling transport (Figma Desktop). This skill judges the design decisions its reads and exports feed |
| [Skills Library](../../README.md) | The skill catalog and routing front door |
