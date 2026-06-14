---
title: "Claude Design Parity Protocol"
description: "The shared cross-skill protocol that moves sk-interface-design (judgment) and mcp-magicpath (canvas/CLI) closer to Claude Design: ground in a design system, reuse before generating, iterate against a real render, and hand off cleanly, without becoming a templated generator."
trigger_phrases:
  - "claude design parity protocol"
  - "reuse before generate design system"
  - "design fidelity check loop"
  - "design handoff manifest"
importance_tier: normal
contextType: implementation
---

# Claude Design Parity Protocol

The connective protocol these skills share so their output approaches Claude Design's quality without cloning a hosted product. `sk-interface-design` owns the judgment, `mcp-magicpath` owns the canvas and CLI, and `mcp-open-design` owns the Open Design terminal transport. This reference is the seam between them. Read it when producing or iterating on real UI, in addition to `design_principles.md` (the authority on the look) and `ux_quality_reference.md` (the objective floor).

These skills consume this file. `mcp-magicpath` and `mcp-open-design` reference it cross-skill because they integrate with `sk-interface-design`.

---

## 1. OVERVIEW

### Core Principle

Claude Design's advantage is that context, iteration, and handoff are visible, continuous workflow objects, and that generation is grounded in a real design system so output does not drift into AI defaults. The local analog is a loop, not a product: **ground -> reuse -> render -> check the real render -> revise -> hand off.** Every step uses tools both skills already have. The anti-default mandate is never relaxed: this protocol must not introduce a style chooser or preset menu.

### When to Use

- Whenever UI is being produced or reshaped through these skills (canvas authoring, repo recreation, post-install adaptation, or a design direction headed for code).
- After `design_principles.md` has set the direction and you need a repeatable path from intent to a verified, handed-off result.

### The loop

1. **Ground** in the design context and system (Section 2).
2. **Reuse before generate** from the system's registered components and tokens (Section 3).
3. **Render** via the build/canvas surface.
4. **Check the real render** with the fidelity check (Section 5), gated on the quality floor and the anti-default critique.
5. **Revise** with the element-target grammar (Section 4); broad feedback re-plans, targeted feedback scopes one edit.
6. **Hand off** with the manifest (Section 6).

---

## 2. DESIGN-CONTEXT SNAPSHOT (intake)

Before choosing anything, capture what grounds the work. This is intake, never a chooser. Capture only what is present.

- Subject, audience, and the page's single job (from `design_principles.md` Step 0).
- An existing design system if present: brand colors, typography, component patterns, semantic tokens. For `mcp-magicpath`, read these via `get-theme` and from the repo during import. For an installed Open Design app, read a matching system via `mcp-open-design` (`od mcp` get_file/search_files, or `od tools design-systems read`): its DESIGN.md for direction, tokens.css for the paste-ready tokens, components.html for reusable markup.
- Reference material if supplied: screenshots, competitor examples, wireframes, a codebase. Treat references as inherit-from or critique-against inputs, never copy.
- Target viewport and output target.

If a persisted project design brief exists, read it at the start to ground work across sessions. Do not author a brief that fixes a style independent of the subject.

---

## 3. DESIGN-SYSTEM ADHERENCE AND REUSE-BEFORE-GENERATE

The strongest move toward parity, and anti-default by construction: when a design system is present, build from it rather than inventing.

- **Reuse before generate.** Before authoring net-new markup, search the active system for a component or token that fits. For `mcp-magicpath`, `search`/`inspect` the theme's registered components first; author net-new only when nothing fits. When an Open Design system is the ground, reuse its `tokens.css` tokens and `components.html` components (read live via `mcp-open-design`, never copied into the repo) before authoring net-new.
- **Adherence check.** When a system exists, treat these as violations to flag and fix: raw color values instead of semantic tokens, arbitrary one-off spacing, inline style overrides, and bypassing a system component with a hand-rolled one. For `mcp-magicpath` this is a mechanical scan of generated output; for `sk-interface-design` it is a critique question ("am I reinventing something the system already has?").
- **Inherit-if-present.** When a token system exists, ground in it and spend the one justified aesthetic risk within it.

This does not override `design_principles.md`. On a free axis with no system, the anti-default process still governs; reuse applies only to what the system actually provides.

---

## 4. ELEMENT-TARGET REVISION GRAMMAR

Make feedback precise and auditable instead of a vague reprompt.

A revision names: the target element or component, the visual evidence (what is wrong, with the render or a region), the requested change, the scope, the expected verification, and whether the feedback is broad or targeted.

- **Broad feedback re-plans** the direction (back to `design_principles.md`).
- **Targeted feedback scopes one edit.** For `mcp-magicpath`, route it to `code start --component <id> --revision <selectedRevisionId>` (`selection -o json` supplies the id). There are no inline comment threads in the CLI; this grammar is the agent classifying feedback, not reading MagicPath comments.

---

## 5. FIDELITY CHECK (does the render match intent)

Both skills today treat "done" as compiles plus responsive, never matches-intent. Close that gap by checking the real render, with the right mechanism and the right bar.

- **Mechanism (mcp-magicpath):** use `previewImageUrl`, the backend-rendered screenshot of the latest revision returned by `list-components`/`search`. It is already authenticated and needs no browser. The helper `mcp-magicpath/scripts/design_fidelity.py --project <id> [--component <name>]` fetches and downloads that preview for you. Pair it with `code status` for build pass or fail. **Do not** drive `mcp-chrome-devtools` against a `view`/`share` canvas URL: that URL is session-gated and redirects to sign-in, and CLI auth does not carry to a fresh browser.
- **Mechanism (local render):** for a dev-server UI the agent controls (sk-code), `mcp-chrome-devtools` screenshotting works and is the right tool. Never point it at the MagicPath hosted canvas.
- **Pass/fail bar:** the render must clear the `ux_quality_reference.md` floor AND survive the anti-default critique from `design_principles.md`. "Looks roughly like the brief" is a weaker bar than the skill already enforces, so it is not sufficient.
- **Caveat:** automated screenshot comparison is unreliable for subtle visual and color differences. The fidelity check is judgment over a render, not pixel diffing. Do not claim completion from a screenshot alone.
- **Build-error self-healing (mcp-magicpath):** after `code submit --wait`, if the build is not `completed`, read the error, fix within the editable boundary (`src/App.tsx`, `src/index.css`, `src/components/generated/**`), and resubmit. Cap retries at two, then surface the failure.

---

## 6. GENERATED-VS-PRESENTATIONAL BOUNDARY AND HANDOFF

- **Boundary (mcp-magicpath):** keep generated component source, the wrapper or adaptation files, and business logic distinct. Installed components are imported, not copied; never paste generated markup in place of importing. Treat generated source as one-way: re-generation overwrites it, so app logic lives in the wrapper.
- **Handoff manifest (optional, one block):** at the end, emit a small structured block, not a heavy schema: the token system and theme variables, files changed, key interactions, the quality-floor and anti-default checks run, open risks, and the next `sk-code` steps. Keep iteration itself in thinking; this is the durable handoff, not a per-revision ledger.

---

## 7. PRE-BUILD DIRECTION GATE (guarded, optional)

For open-ended visual work, it can help to sketch two or three brief-specific directions, critique each against the AI-default looks, and recommend one before building. This is allowed only when each direction is grounded in the subject. It is never a menu of reusable styles or palettes. If the directions could be reused across briefs, it has become a preset and must not ship.

---

## 8. WHAT THIS PROTOCOL DOES NOT ADD (guardrails)

- No style presets, no pick-a-vibe or theme-swap menu, no named aesthetic dials (boldness/density/motion). A choosable style axis is the templated default the skill exists to resist.
- No converting the `design_inventory.md` data into a generator; it stays critique-against.
- No multi-format export (PDF, PPTX, Canva), no hosted canvas, no live comment threads.
- No writing themes back to MagicPath (there is no `create-theme`); token export is local files only.
- No full-stack or backend generation, no Git branch/PR ownership (route to `sk-git`), no deploy or publishing.
- No heavyweight visual-regression engine; judgment over a render is the gate.

---

## 9. RELATED RESOURCES

- [design_principles.md](./design_principles.md) sets the look and owns the anti-default mandate.
- [ux_quality_reference.md](./ux_quality_reference.md) is the objective floor the fidelity check gates on.
- [design_inventory.md](./design_inventory.md) is the critique-against catalog (never a generator).
- `.opencode/skills/mcp-magicpath/SKILL.md` is the canvas/CLI consumer of this protocol.
- `.opencode/skills/mcp-open-design/SKILL.md` is the Open Design terminal consumer of this protocol.
- Research basis: packets `005-claude-design-parity-research` (hardened) and `006-competitor-design-tools-research`.
