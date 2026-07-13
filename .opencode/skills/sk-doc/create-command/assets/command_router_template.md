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

One router type; the variants differ only by hand-off, never by required sections.

| Variant | Hand-off | Example families | Notes |
|---------|----------|------------------|-------|
| Workflow-YAML-backed | Router routes modes into `_auto.yaml` / `_confirm.yaml` | speckit, create, deep-large | Keep `EXECUTION TARGETS` pointing at the YAML assets. |
| Direct-dispatch-script | Router dispatches straight to tools or scripts | memory, doctor, skill-benchmark | No workflow YAML; recommended sections may stay as warnings. |
| Compiled-stub | Contract rendered at invocation from a compiled source | — (retained; none active) | Carries a `render-command-contract` marker; exempt from authored section requirements — do not hand-write section headings. |

---

## 4. RELATED RESOURCES

- `command_template.md` - exhaustive command type templates and vocabulary.
- `command_presentation_template.md` - full `_presentation.txt` skeleton for the owned presentation asset.
- `../SKILL.md` Step 11 - the first-class router authoring workflow.
