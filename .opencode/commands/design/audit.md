---
description: Design QA report: accessibility, performance, responsive, anti-slop, scoring, hardening. sk-design audit mode.
argument-hint: "<target> [--scope] [--score] [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /design:audit

Thin router for the sk-design `audit` mode. This command resolves the execution mode, loads the presentation contract, then applies the `audit` mode to `$ARGUMENTS`.

## 1. ROUTER CONTRACT

This command serves the user job: "audit design quality", "critique ui surface", "score design readiness".

Pin the `audit` mode of the `sk-design` parent hub to audit and harden design quality. The hub owns routing across modes; this command loads the `audit` mode directly. If the request spans more than `audit`, defer to the hub's routing instead of forcing this mode.

Do not embed workflow steps or presentation content in this file. Workflow steps live in the owned YAML assets; visible prompts, dashboards, and result templates live in the presentation asset.

<!-- ANCHOR:sibling-discriminator -->
### WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to review, score, or harden an existing design surface.
- **Prefer `/design:foundations` when** the request is to create or repair a static token system, palette, typography, layout, or spacing plan.
- **Prefer `/design:interface` when** the request is to invent a new visual direction, interface concept, or signature surface.
- **Prefer `/design:md-generator` when** the request is to extract measured CSS from a live site into a Style Reference DESIGN.md.
- **Prefer `/design:motion` when** the request is to create animation choreography, transitions, or micro-interaction behavior.
- **Prefer the `sk-design` skill's `design-mcp-open-design` transport mode when** the request is to wire, read, or drive Open Design's MCP server rather than review an existing design surface. This is a nested mode reached through `sk-design`, not an independently dispatchable `/design:*` command.
- **Defer to the `sk-design` hub when** the request asks for new direction, static system design, or motion choreography rather than quality review.
<!-- /ANCHOR:sibling-discriminator -->

### PRECONDITIONS

- **Requires:** a concrete design target - a URL, component, screen, or file - to inspect.
- **Cannot-run:** when no target is given, or the named target cannot be opened or inspected, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the target needs build or run state the audit cannot reach to evidence a finding, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the ask is to create new direction, a static system, or motion rather than review existing quality, return `STATUS=DEFER ROUTE=hub`.

**Ask-first:** wording lives only in the presentation asset's Consolidated Prompt Template.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/design/assets/design_audit_presentation.txt` |
| Auto workflow | `.opencode/commands/design/assets/design_audit_auto.yaml` |
| Confirm workflow | `.opencode/commands/design/assets/design_audit_confirm.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. If no suffix is present, check whether `$ARGUMENTS` already supplies the required input (an audit target). If complete, proceed autonomously; if incomplete, fall back to the `:confirm` consolidated prompt.
3. For explicit `:auto`, resolve setup through the presentation contract's Auto Resolution Table; if the target still cannot be resolved, use the Auto Fail-Fast Display.
4. For explicit `:confirm`, always show the consolidated setup prompt once, even when `$ARGUMENTS` is fully specified.
5. Load the selected workflow asset and execute it step by step.

<!-- ANCHOR:register -->
### REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) weights distinctiveness and voice. Product (design SERVES the product) weights affordance, accessibility, and consistency.
- **This command's dials:** `register`, `auditSeverity`.

Register Ask-first question wording lives only in the presentation asset.
<!-- /ANCHOR:register -->

---

## 4. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto`, or no suffix with complete `$ARGUMENTS` | `.opencode/commands/design/assets/design_audit_auto.yaml` |
| `:confirm`, or no suffix with incomplete `$ARGUMENTS` | `.opencode/commands/design/assets/design_audit_confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/design/assets/design_audit_presentation.txt`:

- Consolidated setup prompt wording (target, scope/score, register, execution-mode question).
- Auto Resolution Table and Auto Fail-Fast Display.
- STATUS result templates (`OK`/`ASK`/`FAIL`/`DEFER`).
- Next-step suggestions and handoff-grammar wording.
- Example usage.

---

## 6. WORKFLOW SUMMARY

Loads the `sk-design` hub and the `audit` mode packet, applies the mode to `$ARGUMENTS`, and returns a STATUS line naming the produced Design Quality Audit Report. Never auto-chains to a sibling command; next steps are recommend-only.
