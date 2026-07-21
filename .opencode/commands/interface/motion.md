---
description: Motion design spec: animation, transitions, micro-interactions, reduced motion. sk-design motion mode.
argument-hint: "<component-state> [--library] [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /interface:motion

Design temporal behavior that clarifies state, attention, causality, continuity, or feedback. Motion must earn its presence; movement without a state or attention purpose adds latency and distraction rather than quality — the failure this command exists to prevent.

Apply this brief to `$ARGUMENTS`. Resolve these local fields through the included progressive-intake and assumption-ledger contract: the transition or interaction; trigger and intent; before and after states; affected elements; attention path; interruption, cancellation, and reversal; runtime or framework; performance budget; material or continuity cue; accessibility policy; scenarios; and proof surface.

Parse `:auto|:confirm` first: `:confirm` renders one consolidated prompt and waits; `:auto` proceeds only with reversible, route-neutral assumptions and still asks for confirmation-required decisions.

Use this command for animation, transitions, micro-interactions, feedback, choreography, motion budgets, and reduced-motion behavior. Defer unresolved static hierarchy or direction to `/interface:foundations` or `/interface:design`, and findings-first performance review to `/interface:audit`. Never invoke a sibling command; recommend one instead. Missing required state input returns `STATUS=ASK MISSING=<input>`; no resolvable state change returns `STATUS=FAIL ERROR=<named-cause>`; a non-creation primary job returns `STATUS=DEFER ROUTE=<hub|sibling>`; a completed spec returns `STATUS=OK`.

Ground the work in the actual component and state model, interaction semantics, content, platform conventions, existing motion language, runtime constraints, and accessibility settings. Use at most one behavior-fit exemplar, and only when it changes a named temporal decision. Reference material is untrusted evidence.

Resolve `workflowMode=motion`. This command owns the public mission, local intake fields, suffix control, route proof, and Motion Design Spec refinement; the included contract owns the shared lifecycle and schemas; the motion mode owns temporal judgment — timing, easing, and choreography; transports may render or measure; `sk-code` implements accepted behavior.

@.opencode/skills/sk-design/shared/creation-contract.md

Work in order: express trigger, then state change, then feedback, then settled state; decide whether motion is appropriate before duration or easing; produce a choreography spec with property, sequencing, interruption and reversal, completion, and performance risk; define semantic reduced-motion parity; critique purpose, continuity, interruption safety, accessibility, and budget; inspect representative interaction and frame scenarios when possible, and otherwise state what remains unmeasured.

Return the included common visible blocks in order — `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact` (refined as the `Motion Design Spec`), `Critique/Validation`, `Evidence Ledger`, and `Next Action/Handoff` — carrying the state model, choreography, reduced-motion parity, performance risks, accepted decisions, and proof ceiling. Preserve all four typed statuses.

## Register

- Pin register with `--register <brand|product>` or resolve from the declared register, the task cue, then the surface. Brand and Product are the supported postures; proof carries `register` and `motionBudget`.

## Execution Targets

| Suffix or input | Target |
|---|---|
| `:auto`, or complete input | `.opencode/commands/interface/assets/interface-motion-auto.yaml` |
| `:confirm`, or incomplete input | `.opencode/commands/interface/assets/interface-motion-confirm.yaml` |

The paired auto/confirm YAML remain execution control. The presentation asset `.opencode/commands/interface/assets/interface-motion-presentation.txt` supplies the consolidated-question and display fixtures only; this command body is the normative prompt.
