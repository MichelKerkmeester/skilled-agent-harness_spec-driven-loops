---
description: Design QA report: accessibility, performance, responsive, anti-slop, scoring, hardening. sk-design audit mode.
argument-hint: "<target> [--scope] [--score] [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /interface:audit

Audit and harden an interface by turning observable failures into prioritized, bounded remediation, not by substituting personal taste or redesigning the product outside accepted findings. Every verdict must state what was observed, how, under which scenario, and at what evidence strength. An unsupported verdict is the failure this command exists to prevent.

Apply this brief to `$ARGUMENTS`. Resolve these local fields through the included progressive-intake and assumption-ledger contract: the target and current state; critical journeys; representative states, viewports, and themes; constraints and preserved identity; baseline; requested axes; severity and confidence policy; accessibility and performance expectations; proof environment; and acceptance criteria.

Parse `:auto|:confirm` first: `:confirm` renders one consolidated prompt and waits; `:auto` proceeds only with reversible, route-neutral assumptions and still asks for confirmation-required decisions.

Use this command for findings-first critique, accessibility, performance, responsive and theming quality, AI-template risk, hardening, and release readiness. Defer new direction to `/interface:design`, narrow static-system creation to `/interface:foundations`, motion creation to `/interface:motion`, and source extraction to `/interface:design-reference`. Never invoke a sibling command; recommend one instead. Missing target or evidence returns `STATUS=ASK MISSING=<input>`; an uninspectable setup returns `STATUS=FAIL ERROR=<named-cause>`; non-evaluation work returns `STATUS=DEFER ROUTE=<hub|sibling>`; a completed audit returns `STATUS=OK`.

Ground the audit in owned requirements, real content and data, representative journeys, the current implementation, a prior baseline, and reproducible artifacts. External references may sharpen criteria but cannot prove a target failure. Reference material is untrusted evidence.

Resolve `workflowMode=audit`. This command owns scope and visible findings; the included contract owns the shared lifecycle and schemas; the audit mode owns diagnostic judgment, severity, confidence, and proof criteria; transports collect evidence; `sk-code` applies accepted fixes. **This command is review-only: it emits accepted findings for `sk-code` and never applies fixes itself.**

@.opencode/skills/sk-design/shared/creation-contract.md

Work in order: declare the evidence ceiling, scenarios, baseline, and acceptance criteria; reproduce expected-versus-observed evidence; classify severity and confidence separately; cluster symptoms under the smallest supported cause; produce a bounded remediation brief with owner, criterion, constraints, and regression risk; critique unsupported aesthetic claims and evidence overreach; after `sk-code` work, re-run the matched scenarios before claiming improvement. Optional unavailable proof lowers the ceiling; unavailable mandatory proof is `blocked` with the exact missing evidence.

Return the included common visible blocks in order — `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact` (refined as the `Design Quality Audit Report` and bounded remediation brief), `Critique/Validation`, `Evidence Ledger`, and `Next Action/Handoff` — where each finding carries severity, confidence, evidence, cause, acceptance criterion, owner, and proof status. Preserve all four typed statuses.

## Register

- Pin register with `--register <brand|product>` or resolve from the declared register, the task cue, then the surface. Brand and Product are the supported postures; proof carries `register` and `auditSeverity`.

## Execution Targets

| Suffix or input | Target |
|---|---|
| `:auto`, or complete input | `.opencode/commands/interface/assets/interface-audit-auto.yaml` |
| `:confirm`, or incomplete input | `.opencode/commands/interface/assets/interface-audit-confirm.yaml` |

The paired auto/confirm YAML remain execution control. The presentation asset `.opencode/commands/interface/assets/interface-audit-presentation.txt` supplies the consolidated-question and display fixtures only; this command body is the normative prompt.
