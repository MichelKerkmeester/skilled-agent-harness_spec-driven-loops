---
title: "Design-Generation Prompt Patterns - Grounded Briefs, Anti-Median Variation, Discovery-Form Pre-Answer"
description: "Prompt-craft patterns for the mcp-open-design start_run design-generation usecase. Covers the grounded anti-default generation brief, the String Seed of Thought anti-median variation technique, pre-answering a multi-turn discovery form, and the handoff to sk-code. Plugs into the existing DEPTH pass and CLEAR scoring, and owns the prompt only, never the design judgment or the run transport."
trigger_phrases:
  - "design generation prompt"
  - "open design start_run prompt"
  - "seed of thought variation"
  - "anti-default design brief"
  - "discovery form pre-answer"
importance_tier: normal
contextType: implementation
version: 2.3.0.5
---

# Design-Generation Prompt Patterns

Prompt-craft for the design-generation tool the framework drives from the terminal: `mcp-open-design` (headless `start_run` against the installed Open Design app). The visible design it emits is driven by the generation prompt, so the prompt is where quality is won or lost.

This reference owns the PROMPT only. The look and the anti-default mandate belong to `sk-design` (`design_principles.md`) and its `real_ui_loop.md`. The run mechanics and gating belong to `mcp-open-design`. Read this when a request is to write or improve a prompt that will be fed to that tool.

---

## 1. OVERVIEW

### Core Principle

A generic content brief asked of a design tool produces the median AI look: the centered hero with three feature cards, the default component-library surface, the generic gradient. That is exactly the templated default `sk-design` exists to resist. A design-generation prompt has to do three things a normal prompt does not: ground itself in the subject and any real design system, force genuinely distinct directions when variations are wanted, and front-load the answers a multi-turn tool will otherwise fill with its own defaults.

### When to Use

- The deliverable is a natural-language brief headed for `mcp-open-design` `start_run`.
- The user wants several distinct design variations rather than one safe answer.
- A generation run is multi-turn (Open Design's discovery form) and the prompt should pre-answer it.

### How It Plugs Into DEPTH and CLEAR

This is not a new pipeline. It selects a base framework and adds design-specific slots:

- **Framework selection:** COSTAR for a single audience-led screen, CRISPE when the brief is exploratory and wants distinct options, CRAFT for multi-screen or multi-constraint work. RCAF stays the floor for a trivial one-component ask.
- **DEPTH:** apply the grounded brief during Prototype, run the Seed of Thought during Discover and Engineer when variations are requested, and keep the anti-default critique inside the existing Perspective Inversion technique.
- **CLEAR weighting:** design generation is creative and precision-led at once. Use the `depth_framework.md` context-aware weighting to lift Expression (clarity of the visual intent) and Correctness (grounding in the real subject and tokens). Reusability stays low because a generation brief is usually a one-off.

---

## 2. THE GROUNDED ANTI-DEFAULT BRIEF

Layer these slots onto the chosen framework. Capture only what is present, never invent a brand.

| Slot | What it carries | Why it matters |
|---|---|---|
| Subject and single job | The product, and the one job this screen does (from `design_principles.md` Step 0) | An ungrounded brief defaults to a generic dashboard |
| Audience and context | Who uses it, on what device, in what moment | Drives density, tone, and motion |
| Design-system ground | Reuse the active system's tokens and components before inventing (`od tools design-systems read` for Open Design) | Reuse-before-generate is anti-default by construction |
| Anti-default constraints | An explicit avoid-list (generic SaaS gradient, centered hero plus three cards, untouched component-library surface) plus the one justified aesthetic risk to spend | Names the median so the tool steers away from it |
| Fidelity target | What "matches intent" means: clears the UX quality floor AND survives the anti-default critique | "Looks roughly like the brief" is too weak a bar |
| Output target | Viewport, stack or framework, single interactive screen | Keeps the generation buildable and scoped |

The avoid-list and the single aesthetic risk are the load-bearing additions. A COSTAR brief without them will faithfully produce the default look.

---

## 3. STRING SEED OF THOUGHT (ANTI-MEDIAN VARIATION)

### Why

Ask a model for N design variations and it tends to emit the most-probable look N times with cosmetic differences. The bias is in the first token of reasoning. Fix it by choosing the starting angle before reasoning begins, with a deterministic-random index so the model cannot drift back to the median.

### How

1. Set N to the number of variations wanted.
2. Generate a random 12-character alphanumeric string.
3. Sum the ASCII codes of its characters and take the sum modulo N to get an index.
4. Index into the brief-grounded direction set BEFORE any reasoning, commit to that angle, then reason within it.
5. For each additional variation, re-seed with a fresh string so each one starts from a different index.

### Guardrail (critical)

The indexed options MUST be directions grounded in this subject and brief (the `real_ui_loop.md` §7 pre-build direction gate: two or three brief-specific sketches, each grounded in the subject). They must NOT be a reusable style menu, a pick-a-vibe list, or named aesthetic dials such as boldness or density. If the option set could be reused across briefs unchanged, it has become a preset and must not ship (`real_ui_loop.md` §8). The seed picks which grounded angle to commit to first. It never picks a canned style.

---

## 4. PRE-ANSWERING A MULTI-TURN DISCOVERY FORM

### Why

Open Design's `start_run` is multi-turn. The first turn returns a GenUI discovery form that asks for fidelity, data, and behaviour with recommended defaults, and the run only builds design files after the form is answered (through `od ui respond` or a follow-up message). If the run falls back to the recommended defaults, the output drifts to the median. Because the visible output is prompt-driven, the prompt should leave the form nothing to default.

### How

Write the `start_run` prompt so it answers the discovery questions inline:

- **Fidelity:** state it explicitly (low-fidelity wireframe versus production-fidelity build) rather than accepting the default.
- **Data:** give the real or representative data shape and volume, not lorem placeholders.
- **Behaviour:** name the interactions and the states the screen must handle (loading, empty, error), not just the happy path.

If the form still surfaces, answer it with `od ui respond --run <runId> <surfaceId> --value …` carrying the same explicit answers. Do not `--skip` a design-shaping question into its default. The run itself is a mutating, STOP-and-confirm verb owned by `mcp-open-design`, and this reference only shapes the prompt that drives it.

---

## 5. HANDOFF TO sk-code

When a generated design heads into application code, the handoff is already owned: emit the handoff manifest in `real_ui_loop.md` §6 (token system, files changed, key interactions, checks run, open risks, next `sk-code` steps), and let `sk-code` govern how generated or installed source is wired, adapted, and verified. Do not duplicate a handoff schema in the prompt. The prompt's job ends at the brief.

---

## 6. GUARDRAILS

- No style presets, no pick-a-vibe menu, no named aesthetic dials. The Seed of Thought selects a grounded angle, not a canned style.
- This reference owns the prompt. It does not restate the design judgment (`sk-design`) or the run transport and gating (`mcp-open-design`).
- Respect the tools' gates. `start_run` and a canvas submit are mutating actions that the MCP skills hold as STOP-and-confirm points.
- Keep the anti-default mandate intact. A grounded brief plus a forced-distinct angle is the point. A reusable style chooser is the failure mode.

---

## 7. RELATED RESOURCES

- [patterns_evaluation.md](./patterns_evaluation.md) is the source of truth for COSTAR, CRISPE, CRAFT, and CLEAR scoring.
- [depth_framework.md](./depth_framework.md) owns the DEPTH pass and the context-aware CLEAR weighting this pattern leans on.
- `.opencode/skills/sk-design/references/design-process/real_ui_loop.md` owns the reuse-before-generate loop, the pre-build direction gate (§7), the handoff manifest (§6), and the no-preset guardrail (§8).
- `.opencode/skills/sk-design/references/design-process/design_principles.md` owns the look and the anti-default mandate.
- `.opencode/skills/mcp-open-design/SKILL.md` owns the run transport this brief feeds.
