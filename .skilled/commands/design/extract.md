---
description: "Style Reference DESIGN.md extraction: live CSS and measured tokens. The sk-design-md-generator skill."
argument-hint: "<live-url> --output <dir> [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:extract

Creation-template router for stable `workflowMode=sk-design-md-generator`. Read `.opencode/skills/sk-design/sk-design-md-generator/references/creation-contract.md`, resolve the execution mode, load the owned assets, and apply the md-generator pipeline to `$ARGUMENTS`.

<!-- Shared lifecycle contract, expanded once: -->
@.opencode/skills/sk-design/sk-design-md-generator/references/creation-contract.md

### MANDATORY INPUT GATE

**STATUS: BLOCKED** until `live_url`, `output_dir`, and `execution_mode` are bound.

1. Parse `$ARGUMENTS`; strip the `:auto` / `:confirm` suffix and the `--register` flag before resolving the required canonical URL.
2. Treat an absent or whitespace-only `<live-url>` as missing. Do not infer it from conversation history, open files, screenshots, browser state, or repository contents.
3. When the URL is missing, ask for the canonical source URL and the `--output <dir>` destination, stop, and wait for an explicit reply. Use only `$ARGUMENTS` or that reply.
4. Bind `output_dir` from `--output`; never invent a destination or default to the working directory.
5. In `:confirm` or no-suffix mode, confirm the resolved URL and destination before capture. In `:auto`, fail fast on a missing URL and continue only when every field is valid.

| Field | Required | Source |
|---|---:|---|
| `live_url` | yes | explicit `<live-url>` positional or explicit reply |
| `output_dir` | yes | explicit `--output <dir>` or explicit reply |
| `execution_mode` | yes | suffix or confirmed choice |

If any blocking phase was skipped, stop, state the skipped phase, return to it, and complete it before capture.

## 1. ROUTER CONTRACT

This command serves the user job: "extract website css", "generate design reference", "capture design tokens".

Use the shared nine-stage contract for source-faithful extraction. The canonical website is the primary exemplar; `md-generator` owns extract-write-validate; transports only capture; no unrelated inspiration or invented fallback may replace missing source evidence.

<!-- ANCHOR:sibling-discriminator -->
### WHEN TO USE THIS

- **Use this command when** the request is to extract a live source into a provenance-rich Style Reference DESIGN.md.
- **This is the sole design command:** source-faithful extraction of measured CSS and tokens. It never invents a new direction or critiques a design from a brief.
- **When capture is impossible** (no reachable canonical source), it stops with diagnostics rather than generating a generic replacement.
<!-- /ANCHOR:sibling-discriminator -->

### PRECONDITIONS

- **Requires:** canonical URL, allowed origin, representative routes/states/viewports/themes, access, dynamic-loading behavior, output, overwrite policy, coverage, and validation bar.
- **Ask-first:** always confirm private access, authenticated capture, overwrite, and a missing canonical source.
- **Cannot-run:** when the canonical source cannot be captured or the output policy cannot be satisfied, return `STATUS=FAIL ERROR=<named-cause>` with diagnostics.
- **Escalate:** never invent around capture failure or label inferred semantics as measured.
- **Route instead:** when redesign, critique, or new system authorship dominates, return `STATUS=DEFER ROUTE=<hub|sibling>`.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---|---|
| Shared lifecycle | `.opencode/skills/sk-design/sk-design-md-generator/references/creation-contract.md` |
| Presentation source of truth | `.opencode/commands/design/assets/extract-presentation.txt` |
| Auto workflow | `.opencode/commands/design/assets/extract-auto.yaml` |
| Confirm workflow | `.opencode/commands/design/assets/extract-confirm.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS`; resolve route proof, consent, source identity, and output policy.
2. Treat the source website as the primary exemplar; no `no-fit` fallback applies.
3. Load `workflowMode=sk-design-md-generator` and its owned pipeline.
4. Capture provenance and the route/state/viewport/theme matrix.
5. Run extract, write, and validate; label inferred semantics and gaps.
6. Stop with diagnostics instead of generating a generic replacement when capture fails.

<!-- ANCHOR:register -->
### REGISTER

- Pin with `--register <brand|product>` or resolve from the declared register, task cue, then captured surface.
- Brand and Product are the supported postures.
- Proof carries `register`.
<!-- /ANCHOR:register -->

---

## 4. VISIBLE OUTPUT CONTRACT

Return `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact` (Style Reference DESIGN.md), `Critique/Validation`, `Evidence Ledger`, and `Next Action/Handoff`.

---

## 5. EXECUTION TARGETS

| Mode | Target |
|---|---|
| `:auto`, or complete input | `.opencode/commands/design/assets/extract-auto.yaml` |
| `:confirm`, or incomplete input | `.opencode/commands/design/assets/extract-confirm.yaml` |

---

## 6. PRESENTATION BOUNDARY

The presentation asset owns prompts, visible blocks, typed status lines, and recommend-only next actions. The router owns route and asset selection only.

---

## 7. WORKFLOW SUMMARY

Confirm source and overwrite policy, run the owned extract-write-validate pipeline, capture provenance and coverage, label inference and gaps, and return the validated artifact path. This is the only mutating design mode, and it mutates only through its owned pipeline. Never silently chains or invokes a sibling command.
