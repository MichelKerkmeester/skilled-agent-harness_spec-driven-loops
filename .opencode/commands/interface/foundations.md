---
description: Visual system plan: color, typography, layout, spacing, tokens, theming. sk-design foundations mode.
argument-hint: "<axis> <target> [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /interface:foundations

Creation-template router for stable `workflowMode=foundations`. Read `.opencode/skills/sk-design/shared/creation-contract.md`, resolve the execution mode, load the owned assets, and apply the foundations mode to `$ARGUMENTS`.

## 1. ROUTER CONTRACT

This command serves the user job: "design visual system", "define design tokens", "plan static foundations".

Use the shared nine-stage contract for public choreography. The `foundations` mode owns static-system judgment; transports only measure; application-code mutation requires an accepted `sk-code` handoff. Do not copy mode taste or reference tables into this command.

<!-- ANCHOR:sibling-discriminator -->
### WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to create or correct a static visual system.
- **Prefer `/interface:audit` when** the request is review, scoring, accessibility, or hardening.
- **Prefer `/interface:design` when** the request is overall interface direction or a signature concept.
- **Prefer `/interface:design-reference` when** the request is measured extraction from a live source.
- **Prefer `/interface:motion` when** the request is temporal behavior.
- **Prefer the `sk-design` hub's `design-mcp-open-design` transport when** the request is transport operation rather than static-system authorship.
- **Defer to the `sk-design` hub when** another axis dominates or a bundle is required.
<!-- /ANCHOR:sibling-discriminator -->

### PRECONDITIONS

- **Requires:** a static axis and target; resolve register, visual problem, density, existing tokens, accessibility target, viewport/theme matrix, preserve constraints, and output progressively.
- **Ask-first:** bundle only decisions that alter route, identity, overwrite, or acceptance.
- **Cannot-run:** when axis or target is missing, return `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** route dynamic behavior or measured browser diagnosis to the owning mode.
- **Route instead:** when full direction, motion, audit, or extraction dominates, return `STATUS=DEFER ROUTE=<hub|sibling>`.

## 2. OWNED ASSETS

| Purpose | Asset |
|---|---|
| Shared lifecycle | `.opencode/skills/sk-design/shared/creation-contract.md` |
| Presentation source of truth | `.opencode/commands/interface/assets/interface-foundations-presentation.txt` |
| Auto workflow | `.opencode/commands/interface/assets/interface-foundations-auto.yaml` |
| Confirm workflow | `.opencode/commands/interface/assets/interface-foundations-confirm.yaml` |

## 3. MODE ROUTING

1. Parse `$ARGUMENTS`; use confirm only for missing or confirmation-required inputs.
2. Resolve the context envelope and route proof.
3. Classify static axes and reject dynamic or measurement work owned elsewhere.
4. Ground an owned precedent or one named static principle; `no-fit` is valid.
5. Load `workflowMode=foundations` and only applicable references.
6. Build only applicable primitive, semantic, and component tokens plus type, spacing, grid, hierarchy, responsive, and theme deltas.

<!-- ANCHOR:register -->
### REGISTER

- Pin with `--register <brand|product>` or resolve from the declared register, task cue, then surface.
- Brand and Product are the supported postures.
- Proof carries `register`, `colorStrategy`, and `tokenDensity`.
<!-- /ANCHOR:register -->

## 4. VISIBLE OUTPUT CONTRACT

Return `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact` (Visual System Foundations Plan), `Critique/Validation`, `Evidence Ledger`, and `Next Action/Handoff`.

## 5. EXECUTION TARGETS

| Mode | Target |
|---|---|
| `:auto`, or complete input | `.opencode/commands/interface/assets/interface-foundations-auto.yaml` |
| `:confirm`, or incomplete input | `.opencode/commands/interface/assets/interface-foundations-confirm.yaml` |

## 6. PRESENTATION BOUNDARY

The presentation asset owns prompts, visible blocks, typed status lines, and recommend-only next actions. The router owns route and asset selection only.

## 7. WORKFLOW SUMMARY

Resolve constraints, ground static decisions in real content, create the applicable semantic scaffold, validate static gates, label authored versus measured evidence and the runtime ceiling, then hand accepted values to `sk-code` only when requested. Never silently chains or invokes a sibling command.
