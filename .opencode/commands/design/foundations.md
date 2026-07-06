---
description: Visual system plan: color, typography, layout, spacing, tokens, theming. sk-design foundations mode.
argument-hint: "<axis> <target> [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /design:foundations

Thin router for the sk-design `foundations` mode. This command resolves the execution mode, loads the presentation contract, then applies the `foundations` mode to `$ARGUMENTS`.

## 1. ROUTER CONTRACT

This command serves the user job: "design visual system", "define design tokens", "plan static foundations".

Pin the `foundations` mode of the `sk-design` parent hub to design the static visual system - color, typography, layout, spacing, tokens. The hub owns routing across modes; this command loads the `foundations` mode directly. If the request spans more than `foundations`, defer to the hub's routing instead of forcing this mode.

Do not embed workflow steps or presentation content in this file. Workflow steps live in the owned YAML assets; visible prompts, dashboards, and result templates live in the presentation asset.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/design/assets/design_foundations_presentation.txt` |
| Auto workflow | `.opencode/commands/design/assets/design_foundations_auto.yaml` |
| Confirm workflow | `.opencode/commands/design/assets/design_foundations_confirm.yaml` |

---

<!-- ANCHOR:sibling-discriminator -->
## 3. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to design or correct the static visual system.
- **Prefer `/design:audit` when** the request is to review, score, accessibility-check, or harden a design surface.
- **Prefer `/design:interface` when** the request is to invent the overall interface direction, voice, or signature visual concept first.
- **Prefer `/design:md-generator` when** the request is to extract measured tokens from a live site into DESIGN.md.
- **Prefer `/design:motion` when** the request is animation, transition choreography, micro-interactions, or reduced-motion behavior.
- **Defer to the `sk-design` hub when** the request spans invention of the overall interface direction, motion choreography, or release-quality audit.
<!-- /ANCHOR:sibling-discriminator -->

---

## 4. PRECONDITIONS

- **Requires:** a design-system axis (color, type, layout, spacing, or tokens) plus the target surface or product context.
- **Cannot-run:** when no axis is named, or no target/product context is given to ground the system, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the request actually needs full interface invention, not a single static axis, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the work is overall interface direction, motion behavior, or release-quality audit, return `STATUS=DEFER ROUTE=hub`.

Ask-first question wording lives only in the presentation asset's Consolidated Prompt Template.

<!-- ANCHOR:register -->
## REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) lets color and token density carry identity. Product (design SERVES the product) keeps the system denser, clearer, and task-led.
- **This command's dials:** `register`, `colorStrategy`, `tokenDensity`.

Register Ask-first question wording lives only in the presentation asset.
<!-- /ANCHOR:register -->

---

## 5. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. If no suffix is present, check whether `$ARGUMENTS` already supplies the required input (an axis plus a target). If complete, proceed autonomously; if incomplete, fall back to the `:confirm` consolidated prompt.
3. For explicit `:auto`, resolve setup through the presentation contract's Auto Resolution Table; if axis or target still cannot be resolved, use the Auto Fail-Fast Display.
4. For explicit `:confirm`, always show the consolidated setup prompt once, even when `$ARGUMENTS` is fully specified.
5. Load the selected workflow asset and execute it step by step.

---

## 6. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto`, or no suffix with complete `$ARGUMENTS` | `.opencode/commands/design/assets/design_foundations_auto.yaml` |
| `:confirm`, or no suffix with incomplete `$ARGUMENTS` | `.opencode/commands/design/assets/design_foundations_confirm.yaml` |

---

## 7. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/design/assets/design_foundations_presentation.txt`:

- Consolidated setup prompt wording (axis, target, register, execution-mode question).
- Auto Resolution Table and Auto Fail-Fast Display.
- STATUS result templates (`OK`/`ASK`/`FAIL`/`DEFER`).
- Next-step suggestions and handoff-grammar wording.
- Example usage.

---

## 8. WORKFLOW SUMMARY

Loads the `sk-design` hub and the `foundations` mode packet, applies the mode to `$ARGUMENTS`, and returns a STATUS line naming the produced Visual System Foundations Plan. Never auto-chains to a sibling command; next steps are recommend-only.
