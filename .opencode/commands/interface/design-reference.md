---
description: Style Reference DESIGN.md extraction: live CSS and measured tokens. sk-design md-generator mode.
argument-hint: "<live-url> --output <dir> [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /interface:design-reference

Creation-template router for stable `workflowMode=md-generator`. Read `.opencode/skills/sk-design/shared/creation-contract.md`, resolve the execution mode, load the owned assets, and apply the md-generator pipeline to `$ARGUMENTS`.

<!-- Shared lifecycle contract, expanded once: -->
@.opencode/skills/sk-design/shared/creation-contract.md

## 1. ROUTER CONTRACT

This command serves the user job: "extract website css", "generate design reference", "capture design tokens".

Use the shared nine-stage contract for source-faithful extraction. The canonical website is the primary exemplar; `md-generator` owns extract-write-validate; transports only capture; no unrelated inspiration or invented fallback may replace missing source evidence.

<!-- ANCHOR:sibling-discriminator -->
### WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to extract a live source into a provenance-rich Style Reference DESIGN.md.
- **Prefer `/interface:audit` when** the request is quality review rather than extraction.
- **Prefer `/interface:foundations` when** the request is authored static-system direction.
- **Prefer `/interface:design` when** the request is a new direction.
- **Prefer `/interface:motion` when** the request is temporal design.
- **Prefer the `sk-design` hub's `design-mcp-open-design` transport when** the request is Open Design transport operation rather than website extraction.
- **Defer to the `sk-design` hub when** the request spans redesign, critique, or invention beyond source-faithful extraction.
<!-- /ANCHOR:sibling-discriminator -->

### PRECONDITIONS

- **Requires:** canonical URL, allowed origin, representative routes/states/viewports/themes, access, dynamic-loading behavior, output, overwrite policy, coverage, and validation bar.
- **Ask-first:** always confirm private access, authenticated capture, overwrite, and a missing canonical source.
- **Cannot-run:** when the canonical source cannot be captured or the output policy cannot be satisfied, return `STATUS=FAIL ERROR=<named-cause>` with diagnostics.
- **Escalate:** never invent around capture failure or label inferred semantics as measured.
- **Route instead:** when redesign, critique, or new system authorship dominates, return `STATUS=DEFER ROUTE=<hub|sibling>`.

## 2. OWNED ASSETS

| Purpose | Asset |
|---|---|
| Shared lifecycle | `.opencode/skills/sk-design/shared/creation-contract.md` |
| Presentation source of truth | `.opencode/commands/interface/assets/interface-design-reference-presentation.txt` |
| Auto workflow | `.opencode/commands/interface/assets/interface-design-reference-auto.yaml` |
| Confirm workflow | `.opencode/commands/interface/assets/interface-design-reference-confirm.yaml` |

## 3. MODE ROUTING

1. Parse `$ARGUMENTS`; resolve route proof, consent, source identity, and output policy.
2. Treat the source website as the primary exemplar; no `no-fit` fallback applies.
3. Load `workflowMode=md-generator` and its owned pipeline.
4. Capture provenance and the route/state/viewport/theme matrix.
5. Run extract, write, and validate; label inferred semantics and gaps.
6. Stop with diagnostics instead of generating a generic replacement when capture fails.

<!-- ANCHOR:register -->
### REGISTER

- Pin with `--register <brand|product>` or resolve from the declared register, task cue, then captured surface.
- Brand and Product are the supported postures.
- Proof carries `register`.
<!-- /ANCHOR:register -->

## 4. VISIBLE OUTPUT CONTRACT

Return `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact` (Style Reference DESIGN.md), `Critique/Validation`, `Evidence Ledger`, and `Next Action/Handoff`.

## 5. EXECUTION TARGETS

| Mode | Target |
|---|---|
| `:auto`, or complete input | `.opencode/commands/interface/assets/interface-design-reference-auto.yaml` |
| `:confirm`, or incomplete input | `.opencode/commands/interface/assets/interface-design-reference-confirm.yaml` |

## 6. PRESENTATION BOUNDARY

The presentation asset owns prompts, visible blocks, typed status lines, and recommend-only next actions. The router owns route and asset selection only.

## 7. WORKFLOW SUMMARY

Confirm source and overwrite policy, run the owned extract-write-validate pipeline, capture provenance and coverage, label inference and gaps, and return the validated artifact path. This is the only mutating design mode, and it mutates only through its owned pipeline. Never silently chains or invokes a sibling command.
