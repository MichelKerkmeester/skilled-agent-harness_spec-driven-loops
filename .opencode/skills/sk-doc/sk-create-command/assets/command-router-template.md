---
title: Command Router Template
description: Canonical skeleton for thin router commands with owned assets and presentation boundaries.
trigger_phrases:
  - "command router template"
  - "thin router command"
  - "router presentation split"
  - "router command skeleton"
  - "owned assets presentation boundary"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Command Router Template

Canonical skeleton for a first-class **router** command: a thin dispatcher whose `.md`
verifies the orchestrating agent, resolves mode and arguments, then hands off to owned
assets (a presentation `.txt`, optional `_auto.yaml` / `_confirm.yaml`, or scripts). The
router carries no inline dashboards, prompts, or result templates.

---

## 1. OVERVIEW

Copy the skeleton below and fill the placeholders. Use it whenever `create-command`
Step 11 classifies the command as a router.

- **Blocking core (required):** `OWNED ASSETS` and `PRESENTATION BOUNDARY`.
- **Recommended (non-blocking warnings when absent):** `ROUTER CONTRACT`, `MODE ROUTING`,
  `EXECUTION TARGETS`, `WORKFLOW SUMMARY`.
- **Numbering:** H2 headers use `## N.` with full integers only, in the canonical order.
- **Vocabulary is fixed.** Do not substitute synonyms such as `Routing Assets`,
  `Workflow Routing`, or `Execution Order`; the validator alias-normalizes those as a
  safety net, but the authored end state is the canonical names below.

---

## 2. CANONICAL SKELETON

```markdown
---
description: <action-oriented single-line description, modes noted>
argument-hint: "<required> [:auto|:confirm] [optional] [--flag]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# <Command Title>

Thin router for <workflow>. This command verifies the orchestrating agent, resolves the
execution mode, loads the presentation contract, then executes the owned assets.

<!-- REQUIRED-ARGUMENT GATE: if argument-hint declares a required <argument>, add the mandatory
input gate here, before ROUTER CONTRACT — name the required input, forbid inference, and stop
until it is provided. The gate is router-owned; the workflow asset never asks for a required
input. Omit this block when the command takes no required argument. -->

## 1. ROUTER CONTRACT

Do not dispatch agents or write artifacts from this Markdown file; that behavior is owned
by the workflow/script assets. Load the presentation contract before showing any startup
question, checkpoint, dashboard, success output, failure output, or next-step prompt.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/<ns>/assets/<ns>_<action>_presentation.txt` |
| Auto workflow (workflow-YAML variant only) | `.opencode/commands/<ns>/assets/<ns>_<action>_auto.yaml` |
| Confirm workflow (workflow-YAML variant only) | `.opencode/commands/<ns>/assets/<ns>_<action>_confirm.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` / `:confirm` (and any command-specific mode suffixes).
2. Treat remaining flags as workflow inputs, not execution modes.
3. If no mode suffix is present, use the presentation contract's startup prompt to ask.
4. Load the selected execution target and run it step by step.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `<auto workflow YAML, or the script/tool the router dispatches>` |
| `:confirm` or interactive choice | `<confirm workflow YAML, or the interactive path>` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in the presentation asset, never inline in this router:

- Startup-question wording and reply format.
- Checkpoint and dashboard display templates.
- Success and failure result templates.
- Next-step suggestions and final user prompt wording.

---

## 6. WORKFLOW SUMMARY

A short, numbered recap of the end-to-end flow the router orchestrates, pointing at the
owned assets rather than restating their content.
```

---

## 3. VARIANTS

One router type; the variants differ only by hand-off, never by required sections. Which
family uses which topology is defined by the machine-readable command contract
([`command-contract.json`](command-contract.json), validated by
[`command-contract.schema.json`](command-contract.schema.json)); the contract is the source of
truth, and this table only describes the common hand-off shapes.

| Variant | Hand-off | Notes |
|---------|----------|-------|
| Workflow-YAML-backed | Router routes modes into `_auto.yaml` / `_confirm.yaml` | Keep `EXECUTION TARGETS` pointing at the YAML assets. |
| Direct-dispatch-script | Router dispatches straight to tools or scripts | No workflow YAML; recommended sections may stay as warnings. |
| Compiled-stub | Contract rendered at invocation from a compiled source | Carries a `render-command-contract` marker; exempt from authored section requirements — do not hand-write section headings. |

---

## 4. COMMAND CONTRACT

Every family's behavioral truth — topology, input and gate owner, execution targets, mode
matrix, owned assets, presentation ownership with typed exceptions, destructive policy, timeout
bounds, and invocation aliases — lives in the machine-readable contract
[`command-contract.json`](command-contract.json), validated against
[`command-contract.schema.json`](command-contract.schema.json). Read the contract for a family's
authoritative topology and mode default rather than re-deriving it from prose. A router's own
entry validates as one `familyContract`; the shape below is a copy-ready example:

<!-- contract-example -->
```json
{
  "topology": "mode-pair",
  "router_path": ".opencode/commands/<ns>/*.md",
  "input": { "required": true, "gate_owner": "router", "argument_hint": "<target> [:auto|:confirm]" },
  "execution_targets": [
    { "selector": ":auto", "target": ".opencode/commands/<ns>/assets/<ns>_<action>_auto.yaml" },
    { "selector": ":confirm | omitted", "target": ".opencode/commands/<ns>/assets/<ns>_<action>_confirm.yaml" }
  ],
  "mode_matrix": { "default_policy": "confirm", "supported_modes": [":auto", ":confirm"] },
  "owned_assets": [
    { "purpose": "presentation", "path": ".opencode/commands/<ns>/assets/<ns>_<action>_presentation.txt" },
    { "purpose": "auto_workflow", "path": ".opencode/commands/<ns>/assets/<ns>_<action>_auto.yaml" },
    { "purpose": "confirm_workflow", "path": ".opencode/commands/<ns>/assets/<ns>_<action>_confirm.yaml" }
  ],
  "presentation": { "owner": "presentation-asset", "exceptions": [] },
  "destructive_policy": { "has_destructive_ops": false },
  "invocation_aliases": ["/<ns>:<action>", ":auto suffix", ":confirm suffix"]
}
```

---

## 5. RELATED RESOURCES

- `command-template.md` - exhaustive command type templates and vocabulary.
- `command-presentation-template.md` - full `_presentation.txt` skeleton for the owned presentation asset.
- `command-contract.json` / `command-contract.schema.json` - the machine-readable behavioral contract and its schema.
- `../SKILL.md` Step 11 - the first-class router authoring workflow.
