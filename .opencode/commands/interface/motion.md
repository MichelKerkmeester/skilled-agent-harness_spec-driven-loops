---
description: Motion design spec: animation, transitions, micro-interactions, reduced motion. sk-design motion mode.
argument-hint: "<component-state> [--library] [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /interface:motion

Creation-template router for stable `workflowMode=motion`. Read `.opencode/skills/sk-design/shared/creation-contract.md`, resolve the execution mode, load the owned assets, and apply the motion mode to `$ARGUMENTS`.

<!-- Shared lifecycle contract, expanded once: -->
@.opencode/skills/sk-design/shared/creation-contract.md

## 1. ROUTER CONTRACT

This command serves the user job: "design motion behavior", "plan micro interactions", "specify animation states".

Use the shared nine-stage contract for public choreography. The `motion` mode owns temporal judgment; transports only render or measure; application-code mutation requires an accepted `sk-code` handoff. Do not copy mode taste or reference tables into this command.

<!-- ANCHOR:sibling-discriminator -->
### WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is purposeful animation, transitions, or reduced-motion behavior.
- **Prefer `/interface:audit` when** the request is motion-performance or quality assessment.
- **Prefer `/interface:foundations` when** the request is static system work.
- **Prefer `/interface:design` when** direction is undecided.
- **Prefer `/interface:design-reference` when** the request is measured source extraction.
- **Prefer the `sk-design` hub's `design-mcp-open-design` transport when** the request is transport operation rather than temporal design.
- **Defer to the `sk-design` hub when** another axis dominates or a bundle is required.
<!-- /ANCHOR:sibling-discriminator -->

### PRECONDITIONS

- **Requires:** trigger, intent, before/after state, affected elements, interruption/reversal, runtime, performance budget, material, accessibility policy, and proof surface as applicable.
- **Ask-first:** bundle only route-, identity-, access-, or acceptance-changing decisions.
- **Cannot-run:** when no state transition or attention purpose exists, return `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** when motion depends on an unaccepted interface direction, request the missing decision.
- **Route instead:** when static systems, direction, audit, or extraction dominate, return `STATUS=DEFER ROUTE=<hub|sibling>`.

## 2. OWNED ASSETS

| Purpose | Asset |
|---|---|
| Shared lifecycle | `.opencode/skills/sk-design/shared/creation-contract.md` |
| Presentation source of truth | `.opencode/commands/interface/assets/interface-motion-presentation.txt` |
| Auto workflow | `.opencode/commands/interface/assets/interface-motion-auto.yaml` |
| Confirm workflow | `.opencode/commands/interface/assets/interface-motion-confirm.yaml` |

## 3. MODE ROUTING

1. Parse `$ARGUMENTS`; resolve route proof and the context envelope.
2. Reject decorative behavior with no state or attention purpose.
3. Ground one behavior-fit exemplar when available; `no-fit` is valid.
4. Load `workflowMode=motion` and design behavior and mechanism before duration/easing.
5. Produce choreography, interruption/reversal, and semantic reduced-motion parity.
6. Prototype or inspect when available and label authored timing separately from measured runtime evidence.

<!-- ANCHOR:register -->
### REGISTER

- Pin with `--register <brand|product>` or resolve from the declared register, task cue, then surface.
- Brand and Product are the supported postures.
- Proof carries `register` and `motionBudget`.
<!-- /ANCHOR:register -->

## 4. VISIBLE OUTPUT CONTRACT

Return `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact` (Motion Design Spec), `Critique/Validation`, `Evidence Ledger`, and `Next Action/Handoff`.

## 5. EXECUTION TARGETS

| Mode | Target |
|---|---|
| `:auto`, or complete input | `.opencode/commands/interface/assets/interface-motion-auto.yaml` |
| `:confirm`, or incomplete input | `.opencode/commands/interface/assets/interface-motion-confirm.yaml` |

## 6. PRESENTATION BOUNDARY

The presentation asset owns prompts, visible blocks, typed status lines, and recommend-only next actions. The router owns route and asset selection only.

## 7. WORKFLOW SUMMARY

Resolve state purpose, ground the behavior, define narrative and mechanism before timing, specify interruption and reduced-motion parity, inspect available runtime evidence, then hand accepted behavior to `sk-code` only when requested. Never silently chains or invokes a sibling command.
