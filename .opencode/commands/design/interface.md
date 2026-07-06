---
description: Interface direction: distinctive UI, palette, type, layout, motion. sk-design interface mode.
argument-hint: "<target> [--mode] [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /design:interface

Thin router for the sk-design `interface` mode. This command resolves the execution mode, loads the presentation contract, then applies the `interface` mode to `$ARGUMENTS`.

## 1. ROUTER CONTRACT

This command serves the user job: "shape interface direction", "redesign ui surface", "make ui distinctive".

Pin the `interface` mode of the `sk-design` parent hub to build or reshape a distinctive, intentional interface. The hub owns routing across modes; this command loads the `interface` mode directly. If the request spans more than `interface`, defer to the hub's routing instead of forcing this mode.

Do not embed workflow steps or presentation content in this file. Workflow steps live in the owned YAML assets; visible prompts, dashboards, and result templates live in the presentation asset.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/design/assets/design_interface_presentation.txt` |
| Auto workflow | `.opencode/commands/design/assets/design_interface_auto.yaml` |
| Confirm workflow | `.opencode/commands/design/assets/design_interface_confirm.yaml` |

---

## 3. INTERFACE TASK LANES

Pick the lane that matches the request; if none fits, defer to the `sk-design` hub.

- **direction** (default) -- invent a distinctive interface direction.
- **directions** (`--mode directions`) -- produce debiased options.
- **redesign** (`--mode redesign`) -- reshape an existing surface.
- **preflight** (`--mode preflight`) -- run the pre-ship mechanical gate.
- **handoff** (`--mode build`) -- run the real UI loop and emit the sk-code handoff manifest.
- **aesthetic** (`--mode aesthetic`) -- name a realized look.
- **quality** is not owned here; route accessibility, contrast, scoring, and hardening to `/design:audit`.
- **register**, **copy-gate**, **grounding**, and **reference** are internal or hidden lanes; they run inside the workflow and are not surfaced and not selectable tasks.

<!-- ANCHOR:sibling-discriminator -->
## 4. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to invent or reshape a distinctive interface direction.
- **Prefer `/design:audit` when** the request is findings-first review, accessibility, performance, scoring, or production hardening.
- **Prefer `/design:foundations` when** the request is static token work: color, typography, layout, spacing, responsive adaptation, or theming.
- **Prefer `/design:md-generator` when** the request is extracting a live site's measured CSS into DESIGN.md.
- **Prefer `/design:motion` when** the request is animation choreography, transitions, micro-interactions, or reduced-motion behavior.
- **Defer to the `sk-design` hub when** the request is primarily static tokens, motion behavior, audit findings, or measured CSS extraction.
<!-- /ANCHOR:sibling-discriminator -->

---

## 5. PRECONDITIONS

- **Requires:** an interface target (surface, screen, or component set) plus the register and any mode hint.
- **Cannot-run:** when no interface target is named to shape, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the register is genuinely mixed or unresolved and changes the design dials, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the request is primarily static tokens, motion behavior, audit findings, or measured CSS extraction, return `STATUS=DEFER ROUTE=hub`.

Ask-first question wording lives only in the presentation asset's Consolidated Prompt Template.

<!-- ANCHOR:register -->
## REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) gives the interface room for expression, identity, and a memorable move. Product (design SERVES the product) keeps the interface dense, predictable, and task-led.
- **This command's dials:** `register`, `density`, `motionBudget`, `colorStrategy`.

Register Ask-first question wording lives only in the presentation asset.
<!-- /ANCHOR:register -->

---

## 6. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. If no suffix is present, check whether `$ARGUMENTS` already supplies the required input (an interface target). If complete, proceed autonomously; if incomplete, fall back to the `:confirm` consolidated prompt.
3. For explicit `:auto`, resolve setup through the presentation contract's Auto Resolution Table; if the target still cannot be resolved, use the Auto Fail-Fast Display.
4. For explicit `:confirm`, always show the consolidated setup prompt once, even when `$ARGUMENTS` is fully specified.
5. Load the selected workflow asset and execute it step by step.

---

## 7. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto`, or no suffix with complete `$ARGUMENTS` | `.opencode/commands/design/assets/design_interface_auto.yaml` |
| `:confirm`, or no suffix with incomplete `$ARGUMENTS` | `.opencode/commands/design/assets/design_interface_confirm.yaml` |

---

## 8. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/design/assets/design_interface_presentation.txt`:

- Consolidated setup prompt wording (target, register, task-lane hint, execution-mode question).
- Auto Resolution Table and Auto Fail-Fast Display.
- STATUS result templates (`OK`/`ASK`/`FAIL`/`DEFER`).
- Next-step suggestions and handoff-grammar wording.
- Example usage.

---

## 9. WORKFLOW SUMMARY

Loads the `sk-design` hub and the `interface` mode packet, applies the mode to `$ARGUMENTS`, and returns a STATUS line naming the produced Interface Direction Spec. Never auto-chains to a sibling command; next steps are recommend-only.
