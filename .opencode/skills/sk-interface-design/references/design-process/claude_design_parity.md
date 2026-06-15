---
title: "Claude Design Parity Protocol"
description: "The shared cross-skill protocol that moves sk-interface-design (judgment) and mcp-open-design (Open Design terminal transport) closer to Claude Design: ground in a design system, reuse before generating, iterate against a real render, and hand off cleanly, without becoming a templated generator."
trigger_phrases:
  - "claude design parity protocol"
  - "reuse before generate design system"
  - "design fidelity check loop"
  - "design handoff manifest"
importance_tier: normal
contextType: implementation
---

# Claude Design Parity Protocol

The connective protocol these skills share so their output approaches Claude Design's quality without cloning a hosted product. `sk-interface-design` owns the judgment and `mcp-open-design` owns the Open Design terminal transport. This reference is the seam between them. Read it when producing or iterating on real UI, in addition to `design_principles.md` (the authority on the look) and `ux_quality_reference.md` (the objective floor).

`mcp-open-design` references this file cross-skill because it integrates with `sk-interface-design`.

---

## 1. OVERVIEW

### Core Principle

Claude Design's advantage is that context, iteration, and handoff are visible, continuous workflow objects, and that generation is grounded in a real design system so output does not drift into AI defaults. The local analog is a loop, not a product: **ground -> reuse -> render -> check the real render -> revise -> hand off.** Every step uses tools these skills already have. The anti-default mandate is never relaxed: this protocol must not introduce a style chooser or preset menu.

### When to Use

- Whenever UI is being produced or reshaped through these skills (an Open Design generation run, repo recreation, post-build adaptation, or a design direction headed for code).
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
- An existing design system if present: brand colors, typography, component patterns, semantic tokens. For an installed Open Design app, read a matching system via `mcp-open-design` (`od mcp` get_file/search_files, or `od tools design-systems read`): its DESIGN.md for direction, tokens.css for the paste-ready tokens, components.html for reusable markup.
- Reference material if supplied: screenshots, competitor examples, wireframes, a codebase. Treat references as inherit-from or critique-against inputs, never copy.
- Target viewport and output target.

If a persisted project design brief exists, read it at the start to ground work across sessions. Do not author a brief that fixes a style independent of the subject.

---

## 3. DESIGN-SYSTEM ADHERENCE AND REUSE-BEFORE-GENERATE

The strongest move toward parity, and anti-default by construction: when a design system is present, build from it rather than inventing.

- **Reuse before generate.** Before authoring net-new markup, search the active system for a component or token that fits. When an Open Design system is the ground, reuse its `tokens.css` tokens and `components.html` components (read live via `mcp-open-design`, never copied into the repo) before authoring net-new.
- **Adherence check.** When a system exists, treat these as violations to flag and fix: raw color values instead of semantic tokens, arbitrary one-off spacing, inline style overrides, and bypassing a system component with a hand-rolled one. For `sk-interface-design` this is a critique question ("am I reinventing something the system already has?"). When an Open Design system is the ground, the same question applies to the reused tokens and components.
- **Inherit-if-present.** When a token system exists, ground in it and spend the one justified aesthetic risk within it.

This does not override `design_principles.md`. On a free axis with no system, the anti-default process still governs. Reuse applies only to what the system actually provides.

---

## 4. ELEMENT-TARGET REVISION GRAMMAR

Make feedback precise and auditable instead of a vague reprompt.

A revision names: the target element or component, the visual evidence (what is wrong, with the render or a region), the requested change, the scope, the expected verification, and whether the feedback is broad or targeted.

- **Broad feedback re-plans** the direction (back to `design_principles.md`).
- **Targeted feedback scopes one edit.** For `mcp-open-design`, route it as a follow-up message on the run conversation (`od run start --conversation <id>`) or an `od ui respond` answer that names the element and the single change. There are no inline comment threads, so this grammar is the agent classifying feedback, not reading app comments.

---

## 5. FIDELITY CHECK (DOES THE RENDER MATCH INTENT)

These skills today treat "done" as compiles plus responsive, never matches-intent. Close that gap by checking the real render, with the right mechanism and the right bar.

- **Mechanism (mcp-open-design):** a finished generation run is multi-turn. Turn 1 returns a discovery question-form with zero files. Answering it (`od ui respond` or a follow-up message) fires the build run that writes the design files (`index.html` and friends) and gives the project an `entryFile` and a `previewUrl`. Poll `get_run(runId)` (`od run watch`/`info`), fetch the written files with `get_artifact`, and open the `previewUrl` to inspect the render. Because Open Design is local-first, that `previewUrl` is local and is not gated behind a remote sign-in, so it is directly inspectable.
- **Mechanism (local render):** for a dev-server UI the agent controls (sk-code), `mcp-chrome-devtools` screenshotting works and is the right tool.
- **Pass/fail bar:** the render must clear the `ux_quality_reference.md` floor AND survive the anti-default critique from `design_principles.md`. "Looks roughly like the brief" is a weaker bar than the skill already enforces, so it is not sufficient.
- **Caveat:** automated screenshot comparison is unreliable for subtle visual and color differences. The fidelity check is judgment over a render, not pixel diffing. Do not claim completion from a screenshot alone.
- **Run self-healing (mcp-open-design):** a run left `awaiting_input` has produced no design and is not done, so answer the discovery form to fire the build. If the build run does not reach a completed state, read its status via `get_run` (`od run watch`), adjust the brief or the form answers, and re-run. Cap retries at two, then surface the failure.

---

## 6. GENERATED-VS-PRESENTATIONAL BOUNDARY AND HANDOFF

- **Boundary (mcp-open-design):** treat generated design files as one-way, because a re-run overwrites them, so application logic lives in a wrapper or adaptation rather than in the generated output. Reused Open Design tokens and components are read live and adapted, never copied into the repo as a source of truth.
- **Handoff manifest (optional, one block):** at the end, emit a small structured block, not a heavy schema: the token system and theme variables, files changed, key interactions, the quality-floor and anti-default checks run, open risks, and the next `sk-code` steps. Keep iteration itself in thinking. This is the durable handoff, not a per-revision ledger.

---

## 7. PRE-BUILD DIRECTION GATE (GUARDED, OPTIONAL)

For open-ended visual work, it can help to sketch two or three brief-specific directions, critique each against the AI-default looks, and recommend one before building. This is allowed only when each direction is grounded in the subject. It is never a menu of reusable styles or palettes. If the directions could be reused across briefs, it has become a preset and must not ship.

---

## 8. WHAT THIS PROTOCOL DOES NOT ADD (GUARDRAILS)

- No style presets, no pick-a-vibe or theme-swap menu, no named aesthetic dials (boldness/density/motion). A choosable style axis is the templated default the skill exists to resist.
- No converting a matched design system into a generator. It stays reuse-ground or critique-against, never a preset.
- No multi-format export (PDF, PPTX, Canva), no live comment threads.
- No unsanctioned write-back. Open Design's mutating verbs (`create_project`, `start_run`, the artifact writes) are STOP-and-confirm points, reuse stays read-only, and token export is local files only.
- No full-stack or backend generation, no Git branch/PR ownership (route to `sk-git`), no deploy or publishing.
- No heavyweight visual-regression engine. Judgment over a render is the gate.

---

## 9. RELATED RESOURCES

- [design_principles.md](./design_principles.md) sets the look and owns the anti-default mandate.
- [ux_quality_reference.md](./ux_quality_reference.md) is the objective floor the fidelity check gates on.
- [design_inventory.md](../design-grounding/design_inventory.md) frames how to use a real design system as reuse-ground or critique-against, never a generator.
- `.opencode/skills/mcp-open-design/SKILL.md` is the Open Design terminal consumer of this protocol.
- Research basis: the Claude Design parity and competitor design-tools research that informed this protocol.
