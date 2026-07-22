---
description: Design QA report: accessibility, performance, responsive, anti-slop, scoring, hardening. sk-design audit mode.
argument-hint: "<target> [--scope a11y|performance|responsive|anti-slop] [--score] [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /interface:audit

Creation-template router for stable `workflowMode=audit`. Read `.opencode/skills/sk-design/shared/creation-contract.md`, resolve the execution mode, load the owned assets, and apply the audit mode to `$ARGUMENTS`.

<!-- Shared lifecycle contract, expanded once: -->
@.opencode/skills/sk-design/shared/creation-contract.md

## 1. ROUTER CONTRACT

This command serves the user job: "audit design quality", "critique ui surface", "score design readiness".

Use the shared nine-stage contract for evidence-first audit and bounded remediation. The `audit` mode owns findings, severity, confidence, and proof; transports only observe or measure; accepted fixes mutate only through `sk-code`. Do not copy mode taste or reference tables into this command.

<!-- ANCHOR:sibling-discriminator -->
### WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to review, score, or harden an existing design surface.
- **Prefer `/interface:foundations` when** the request is static-system authorship.
- **Prefer `/interface:design` when** the request is a new direction.
- **Prefer `/interface:design-reference` when** the request is measured source extraction.
- **Prefer `/interface:motion` when** the request is temporal design.
- **Prefer the `sk-design` hub's `design-mcp-open-design` transport when** the request is transport operation rather than audit judgment.
- **Defer to the `sk-design` hub when** another axis dominates or a bundle is required.
<!-- /ANCHOR:sibling-discriminator -->

### PRECONDITIONS

- **Requires:** target state, user journeys, viewports, constraints, baseline, axes, severity policy, mutation boundary, and proof environment.
- **Ask-first:** always confirm audit mutation; otherwise keep the workflow review-only.
- **Cannot-run:** when the target cannot be inspected or a mandatory evidence source is inaccessible, return `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** no baseline means no improvement claim; blocked scenarios retain explicit limitations.
- **Route instead:** when creation rather than review dominates, return `STATUS=DEFER ROUTE=<hub|sibling>`.

## 2. OWNED ASSETS

| Purpose | Asset |
|---|---|
| Shared lifecycle | `.opencode/skills/sk-design/shared/creation-contract.md` |
| Presentation source of truth | `.opencode/commands/interface/assets/interface-audit-presentation.txt` |
| Auto workflow | `.opencode/commands/interface/assets/interface-audit-auto.yaml` |
| Confirm workflow | `.opencode/commands/interface/assets/interface-audit-confirm.yaml` |

## 3. MODE ROUTING

1. Parse `$ARGUMENTS`; resolve route proof and the evidence ceiling.
2. Load `workflowMode=audit` and only the measurement transport needed for the declared scenarios.
3. Capture reproducible observations before findings.
4. Label severity and confidence, cluster root causes, and create bounded remediation acceptance criteria.
5. Hand accepted findings to `sk-code`; never apply fixes inside the audit command.
6. Re-test matched scenarios and report a baseline delta or state why none is possible.

<!-- ANCHOR:register -->
### REGISTER

- Pin with `--register <brand|product>` or resolve from the declared register, task cue, then surface.
- Brand and Product are the supported postures.
- Proof carries `register` and `auditSeverity`.
<!-- /ANCHOR:register -->

## 4. VISIBLE OUTPUT CONTRACT

Return `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact` (Design Quality Audit Report and bounded remediation brief), `Critique/Validation`, `Evidence Ledger`, and `Next Action/Handoff`.

## 5. EXECUTION TARGETS

| Mode | Target |
|---|---|
| `:auto`, or complete input | `.opencode/commands/interface/assets/interface-audit-auto.yaml` |
| `:confirm`, or incomplete input | `.opencode/commands/interface/assets/interface-audit-confirm.yaml` |

## 6. PRESENTATION BOUNDARY

The presentation asset owns prompts, visible blocks, typed status lines, and recommend-only next actions. The router owns route and asset selection only.

## 7. WORKFLOW SUMMARY

Declare the evidence ceiling, capture reproducible evidence, prioritize causes, define bounded remediation, route accepted fixes through `sk-code`, and re-test the same scenarios. Never silently chains, mutates, or invokes a sibling command.
