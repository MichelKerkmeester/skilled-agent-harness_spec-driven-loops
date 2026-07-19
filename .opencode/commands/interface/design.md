---
description: Interface direction: distinctive UI, palette, type, layout, motion. sk-design interface mode.
argument-hint: "<target> [--mode] [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /interface:design

Creation-template router for stable `workflowMode=interface`. Read `.opencode/skills/sk-design/shared/creation-contract.md`, resolve the execution mode, load the owned assets, and apply the interface mode to `$ARGUMENTS`.

## 1. ROUTER CONTRACT

This command serves the user job: "shape interface direction", "redesign ui surface", "make ui distinctive".

Use the shared nine-stage contract for public choreography. The `interface` mode owns design judgment; the ordered `foundations` build bundle supports UI production; transports only retrieve or render; application-code mutation requires an accepted `sk-code` handoff. Do not copy mode taste or reference tables into this command.

<!-- ANCHOR:sibling-discriminator -->
### WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to invent or reshape a distinctive interface direction.
- **Prefer `/interface:audit` when** the request is findings-first review, accessibility, performance, scoring, or production hardening.
- **Prefer `/interface:foundations` when** the request is static token work: color, typography, layout, spacing, responsive adaptation, or theming.
- **Prefer `/interface:design-reference` when** the request is extracting a live site's measured CSS into DESIGN.md.
- **Prefer `/interface:motion` when** the request is animation choreography, transitions, micro-interactions, or reduced-motion behavior.
- **Prefer the `sk-design` hub's `design-mcp-open-design` transport when** the request is to drive Open Design rather than decide direction.
- **Defer to the `sk-design` hub when** another axis dominates or a supporting bundle is required.
<!-- /ANCHOR:sibling-discriminator -->

### PRECONDITIONS

- **Requires:** an interface target; resolve subject, audience, one job, register, owned system, real content/data, preserve constraints, fidelity, output surface, and proof bar progressively.
- **Ask-first:** bundle only confirmation-required fields; always confirm preserved-identity changes or materially different direction families.
- **Cannot-run:** when no interface target is named, return `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** when accepted constraints conflict, request an explicit amendment.
- **Route instead:** when static systems, motion, audit, or extraction dominate, return `STATUS=DEFER ROUTE=<hub|sibling>`.

## 2. OWNED ASSETS

| Purpose | Asset |
|---|---|
| Shared lifecycle | `.opencode/skills/sk-design/shared/creation-contract.md` |
| Presentation source of truth | `.opencode/commands/interface/assets/interface-design-presentation.txt` |
| Auto workflow | `.opencode/commands/interface/assets/interface-design-auto.yaml` |
| Confirm workflow | `.opencode/commands/interface/assets/interface-design-confirm.yaml` |

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. Without a suffix, use auto when the target is present; otherwise use the confirm presentation once.
3. Resolve the context envelope and `Route Proof` before loading mode-specific references.
4. Ground the owned system first, then at most one brief-fit exemplar and one contrast; `no-fit` is valid.
5. Load `workflowMode=interface`; when producing UI, order the supporting foundations build bundle without invoking another command.
6. Execute the selected owned workflow and return every visible block.

### INTERFACE TASK LANES

- **direction** (default), **directions**, **redesign**, **preflight**, **handoff**, and **aesthetic** are selectable argument lanes.
- **quality** routes to `/interface:audit`.
- **register**, **copy-gate**, **grounding**, **transform**, and **reference** are internal or hidden: they are not surfaced and not selectable.

<!-- ANCHOR:register -->
### REGISTER

- Pin with `--register <brand|product>` or resolve from the declared register, task cue, then surface.
- Brand and Product are the supported postures.
- Proof carries `register`, `density`, `motionBudget`, and `colorStrategy`.
<!-- /ANCHOR:register -->

## 4. VISIBLE OUTPUT CONTRACT

Return `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact` (Interface Direction Spec), `Critique/Validation`, `Evidence Ledger`, and `Next Action/Handoff`.

## 5. EXECUTION TARGETS

| Mode | Target |
|---|---|
| `:auto`, or complete input | `.opencode/commands/interface/assets/interface-design-auto.yaml` |
| `:confirm`, or incomplete input | `.opencode/commands/interface/assets/interface-design-confirm.yaml` |

## 6. PRESENTATION BOUNDARY

The presentation asset owns consolidated prompt wording, progressive intake display, common output templates, typed status lines, and recommend-only next actions. The router owns route and asset selection only.

## 7. WORKFLOW SUMMARY

Resolve the brief, ground a decision, load the interface mode, create a token/layout/signature direction, critique it against the brief and defaults, inspect any available render, label proof honestly, and emit an accepted handoff only for requested implementation. Never silently chains or invokes a sibling command.
