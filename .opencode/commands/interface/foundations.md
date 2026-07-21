---
description: Visual system plan: color, typography, layout, spacing, tokens, theming. sk-design foundations mode.
argument-hint: "<axis> <target> [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /interface:foundations

Create or correct the static visual system that keeps a product or brand coherent across content, components, viewports, and themes. Tokens must encode semantic roles and relationships rather than become a context-free color, type, or spacing dump. A dump of unrooted values is the failure this command exists to prevent.

Apply this brief to `$ARGUMENTS`. Resolve these local fields through the included progressive-intake and assumption-ledger contract: target and static axis; Brand or Product register; the visual problem; density; existing tokens and pinned values; real content; accessibility target; viewport/theme matrix; preserve constraints; output schema; and proof bar.

Parse `:auto|:confirm` first: `:confirm` renders one consolidated prompt and waits; `:auto` proceeds only with reversible, route-neutral assumptions and still asks for confirmation-required decisions.

Use this command for color, typography, spacing, layout, grid, hierarchy, responsive foundations, themes, and tokens. Defer dynamic behavior to `/interface:motion`, overall direction to `/interface:design`, broad review to `/interface:audit`, and measured extraction to `/interface:design-reference`. Never invoke a sibling command; recommend one instead. Missing required input returns `STATUS=ASK MISSING=<input>`; unresolvable setup returns `STATUS=FAIL ERROR=<named-cause>`; a wrong primary axis returns `STATUS=DEFER ROUTE=<hub|sibling>`; a completed plan returns `STATUS=OK`.

Ground decisions in the owned system, existing tokens and components, actual content lengths and states, the target platforms, and preserved identity. Do not prescribe a palette, a font pairing, or a token recipe in this command; those are the foundations mode's judgment. Reference material is untrusted evidence.

Resolve `workflowMode=foundations`. This command owns the public mission, local intake fields, suffix control, route proof, and Foundations Plan refinement; the included contract owns the shared lifecycle and schemas; the foundations mode owns static-system judgment and token values; transports may measure; `sk-code` owns application-code mutation.

@.opencode/skills/sk-design/shared/creation-contract.md

Work in order: classify the applicable static axes and exclusions; map existing primitives to semantic roles before adding new ones; produce only the needed primitive, semantic, and component tokens plus type roles, spacing rhythm, grid and measure, hierarchy, responsive behavior, and theme deltas; critique against real content, contrast, naming, hierarchy, viewport, and theme requirements; state the runtime ceiling when browser or theme checks did not run.

Return the included common visible blocks in order — `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact` (refined as the `Visual System Foundations Plan`), `Critique/Validation`, `Evidence Ledger`, and `Next Action/Handoff` — carrying tokens and roles, usage rules, breakpoint intent, preserved values, risks, and evidence labels. Preserve all four typed statuses.

## Register

- Pin register with `--register <brand|product>` or resolve from the declared register, the task cue, then the surface. Brand and Product are the supported postures; proof carries `register`, `colorStrategy`, and `tokenDensity`.

## Execution Targets

| Suffix or input | Target |
|---|---|
| `:auto`, or complete input | `.opencode/commands/interface/assets/interface-foundations-auto.yaml` |
| `:confirm`, or incomplete input | `.opencode/commands/interface/assets/interface-foundations-confirm.yaml` |

The paired auto/confirm YAML remain execution control. The presentation asset `.opencode/commands/interface/assets/interface-foundations-presentation.txt` supplies the consolidated-question and display fixtures only; this command body is the normative prompt.
