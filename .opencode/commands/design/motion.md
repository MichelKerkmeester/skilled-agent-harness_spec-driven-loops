---
description: Motion design spec: animation, transitions, micro-interactions, reduced motion. sk-design motion mode.
argument-hint: "<component-state> [--library] [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /design:motion

Thin router for the sk-design `motion` mode. This command resolves the execution mode, loads the presentation contract, then applies the `motion` mode to `$ARGUMENTS`.

## 1. ROUTER CONTRACT

This command serves the user job: "design motion behavior", "plan micro interactions", "specify animation states".

Pin the `motion` mode of the `sk-design` parent hub to design purposeful animation and micro-interactions. The hub owns routing across modes; this command loads the `motion` mode directly. If the request spans more than `motion`, defer to the hub's routing instead of forcing this mode.

Do not embed workflow steps or presentation content in this file. Workflow steps live in the owned YAML assets; visible prompts, dashboards, and result templates live in the presentation asset.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/design/assets/design_motion_presentation.txt` |
| Auto workflow | `.opencode/commands/design/assets/design_motion_auto.yaml` |
| Confirm workflow | `.opencode/commands/design/assets/design_motion_confirm.yaml` |

---

<!-- ANCHOR:sibling-discriminator -->
## 3. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to design purposeful animation, transitions, or reduced-motion behavior.
- **Prefer `/design:audit` when** the request is findings-first quality review, release scoring, or motion-performance assessment.
- **Prefer `/design:foundations` when** the request is static color, type, layout, responsive, or theme-token work.
- **Prefer `/design:interface` when** the request is to invent the full visual direction or interface concept first.
- **Prefer `/design:md-generator` when** the request is to capture measured CSS or tokens from a live site.
- **Defer to the `sk-design` hub when** the request is primarily static visual-system design, interface direction, audit scoring, or measured CSS extraction.
<!-- /ANCHOR:sibling-discriminator -->

---

## 4. PRECONDITIONS

- **Requires:** a component or state transition to animate, plus an optional animation library.
- **Cannot-run:** when no component or state transition is named to animate, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the motion depends on an interface direction that has not been decided yet, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the request is static visual-system design, interface direction, audit scoring, or measured CSS extraction, return `STATUS=DEFER ROUTE=hub`.

Ask-first question wording lives only in the presentation asset's Consolidated Prompt Template.

<!-- ANCHOR:register -->
## REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) allows choreography when it earns the moment. Product (design SERVES the product) keeps motion to state, feedback, loading, and view changes.
- **This command's dials:** `register`, `motionBudget`.

Register Ask-first question wording lives only in the presentation asset.
<!-- /ANCHOR:register -->

---

## 5. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. If no suffix is present, check whether `$ARGUMENTS` already supplies the required input (a component or state transition). If complete, proceed autonomously; if incomplete, fall back to the `:confirm` consolidated prompt.
3. For explicit `:auto`, resolve setup through the presentation contract's Auto Resolution Table; if the component/state still cannot be resolved, use the Auto Fail-Fast Display.
4. For explicit `:confirm`, always show the consolidated setup prompt once, even when `$ARGUMENTS` is fully specified.
5. Load the selected workflow asset and execute it step by step.

---

## 6. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto`, or no suffix with complete `$ARGUMENTS` | `.opencode/commands/design/assets/design_motion_auto.yaml` |
| `:confirm`, or no suffix with incomplete `$ARGUMENTS` | `.opencode/commands/design/assets/design_motion_confirm.yaml` |

---

## 7. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/design/assets/design_motion_presentation.txt`:

- Consolidated setup prompt wording (component/state, library, register, execution-mode question).
- Auto Resolution Table and Auto Fail-Fast Display.
- STATUS result templates (`OK`/`ASK`/`FAIL`/`DEFER`).
- Next-step suggestions and handoff-grammar wording.
- Example usage.

---

## 8. WORKFLOW SUMMARY

Loads the `sk-design` hub and the `motion` mode packet, applies the mode to `$ARGUMENTS`, and returns a STATUS line naming the produced Motion Design Spec. Never auto-chains to a sibling command; next steps are recommend-only.
