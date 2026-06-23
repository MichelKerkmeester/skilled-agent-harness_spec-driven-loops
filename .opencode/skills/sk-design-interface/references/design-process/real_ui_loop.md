---
title: "Real-UI Loop (ground, reuse, render, check, revise, hand off)"
description: "The loop for producing or iterating real UI from a design plan: ground in a design system, reuse before generating, check the real render against the quality floor and the anti-default critique, revise with a precise grammar, and hand off cleanly, without becoming a templated generator."
trigger_phrases:
  - "real ui loop"
  - "reuse before generate design system"
  - "design fidelity check loop"
  - "design handoff manifest"
importance_tier: normal
contextType: implementation
version: 1.5.0.8
---

# Real-UI Loop

The loop this skill follows so a design plan becomes a verified, handed-off render without drifting into AI defaults. `design_principles.md` owns the look and the anti-default mandate; `ux_quality_reference.md` owns the objective floor; this reference owns the path from an approved plan to a checked, handed-off result. Read it when producing or iterating on real UI.

This loop is transport-agnostic: it applies whether the render comes from code you control, a repo recreation, or a terminal-driven generation tool. A generation transport documents its own render and revision mechanics in its own reference; this loop owns the judgment those mechanics serve.

---

## 1. OVERVIEW

### Core Principle

Strong UI work treats context, iteration, and handoff as explicit objects, and grounds generation in a real design system so output does not drift into AI defaults. The shape is a loop, not a product: **ground -> reuse -> render -> check the real render -> revise -> hand off.** Every step uses tools the skill already has. The anti-default mandate is never relaxed: this loop must not introduce a style chooser or preset menu.

### When to Use

- Whenever UI is being produced or reshaped past a plan into a real render (a generation run, repo recreation, post-build adaptation, or a design direction headed for code).
- After `design_principles.md` has set the direction and you need a repeatable path from intent to a verified, handed-off result.

### The loop

1. **Ground** in the design context and system (Section 2).
2. **Reuse before generate** from the system's components and tokens (Section 3).
3. **Render** via the build or preview surface.
4. **Check the real render** with the fidelity check (Section 5), gated on the quality floor and the anti-default critique.
5. **Revise** with the element-target grammar (Section 4). Broad feedback re-plans, targeted feedback scopes one edit.
6. **Hand off** with the manifest (Section 6).

---

## 2. DESIGN-CONTEXT SNAPSHOT (INTAKE)

Before choosing anything, capture what grounds the work. This is intake, never a chooser. Capture only what is present.

- Subject, audience, and the page's single job (from `design_principles.md` Step 0).
- An existing design system if present: brand colors, typography, component patterns, semantic tokens. When you have access to a real design system you own, read it live (its direction, its paste-ready tokens, its reusable component markup) and never copy it into the repo. `design_inventory.md` owns how to put one real system to work as reuse-ground or critique-against.
- Reference material if supplied: screenshots, competitor examples, wireframes, a codebase. Treat references as inherit-from or critique-against inputs, never copy. Real-world shipped UI as a critique-against reference is owned by `design_references_mcp.md`.
- Target viewport and output target.

If a persisted project design brief exists, read it at the start to ground work across sessions. Do not author a brief that fixes a style independent of the subject.

---

## 3. DESIGN-SYSTEM ADHERENCE AND REUSE-BEFORE-GENERATE

The strongest move toward quality, and anti-default by construction: when a design system is present, build from it rather than inventing.

- **Reuse before generate.** Before authoring net-new markup, search the active system for a component or token that fits. When a real design system is the ground, reuse its tokens and components (read live, never copied into the repo) before authoring net-new.
- **Adherence check.** When a system exists, treat these as violations to flag and fix: raw color values instead of semantic tokens, arbitrary one-off spacing, inline style overrides, and bypassing a system component with a hand-rolled one. This is a critique question: "am I reinventing something the system already has?" The same question applies to reused tokens and components.
- **Inherit-if-present.** When a token system exists, ground in it and spend the one justified aesthetic risk within it.

This does not override `design_principles.md`. On a free axis with no system, the anti-default process still governs. Reuse applies only to what the system actually provides.

---

## 4. ELEMENT-TARGET REVISION GRAMMAR

Make feedback precise and auditable instead of a vague reprompt.

A revision names: the target element or component, the visual evidence (what is wrong, with the render or a region), the requested change, the scope, the expected verification, and whether the feedback is broad or targeted.

- **Broad feedback re-plans** the direction (back to `design_principles.md`).
- **Targeted feedback scopes one edit.** Route it through whatever revision channel the build surface provides: a scoped code edit, or a follow-up message to a generation transport that names the one element and the single change. The grammar is the agent classifying the feedback precisely, not reading app comment threads.

---

## 5. FIDELITY CHECK (DOES THE RENDER MATCH INTENT)

UI work often treats "done" as compiles plus responsive, never matches-intent. Close that gap by checking the real render, with the right mechanism and the right bar.

- **Mechanism depends on the build surface.** For a dev-server UI the agent controls (`sk-code`), `mcp-chrome-devtools` screenshotting works and is the right tool. For a terminal-driven generation transport, use that transport's own render/preview surface and its reference for the exact mechanics.
- **Pass/fail bar:** the render must clear the `ux_quality_reference.md` floor AND survive the anti-default critique from `design_principles.md`. "Looks roughly like the brief" is a weaker bar than the skill already enforces, so it is not sufficient.
- **Caveat:** automated screenshot comparison is unreliable for subtle visual and color differences. The fidelity check is judgment over a render, not pixel diffing. Do not claim completion from a screenshot alone.

---

## 6. GENERATED-VS-PRESENTATIONAL BOUNDARY AND HANDOFF

- **Boundary.** Treat generated design files as one-way, because a re-run overwrites them, so application logic lives in a wrapper or adaptation rather than in the generated output. Reused tokens and components are read live and adapted, never copied into the repo as a source of truth.
- **Handoff manifest (optional, one block):** at the end, emit a small structured block, not a heavy schema: the token system and theme variables, files changed, key interactions, the quality-floor and anti-default checks run, open risks, and the next `sk-code` steps. Keep iteration itself in thinking. This is the durable handoff, not a per-revision ledger.

---

## 7. PRE-BUILD DIRECTION GATE (GUARDED, OPTIONAL)

For open-ended visual work, it can help to sketch two or three brief-specific directions, critique each against the AI-default looks, and recommend one before building. This is allowed only when each direction is grounded in the subject. It is never a menu of reusable styles or palettes. If the directions could be reused across briefs, it has become a preset and must not ship.

---

## 8. WHAT THIS LOOP DOES NOT ADD (GUARDRAILS)

- No style presets, no pick-a-vibe or theme-swap menu, no named aesthetic dials (boldness/density/motion). A choosable style axis is the templated default the skill exists to resist.
- No converting a matched design system into a generator. It stays reuse-ground or critique-against, never a preset.
- No multi-format export (PDF, PPTX, Canva), no live comment threads.
- No unsanctioned write-back to a source system. Reuse stays read-only, and any mutating transport verb is a STOP-and-confirm point.
- No full-stack or backend generation, no Git branch/PR ownership (route to `sk-git`), no deploy or publishing.
- No heavyweight visual-regression engine. Judgment over a render is the gate.

---

## 9. RELATED RESOURCES

- [design_principles.md](./design_principles.md) sets the look and owns the anti-default mandate.
- [ux_quality_reference.md](./ux_quality_reference.md) is the objective floor the fidelity check gates on.
- [design_inventory.md](../design-grounding/design_inventory.md) frames how to use a real design system as reuse-ground or critique-against, never a generator.
- [design_references_mcp.md](../design-grounding/design_references_mcp.md) frames real-world shipped UI as a critique-against reference (Mobbin, Refero via Code Mode).
