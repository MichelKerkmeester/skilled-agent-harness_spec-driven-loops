---
description: "Improve or create AI prompts via sk-prompt: frameworks, DEPTH, CLEAR scoring. Modes :auto, :confirm."
argument-hint: "<prompt_or_topic> [:auto|:confirm] [$text|$improve|$refine|$short|$json|$yaml|$raw] [--agent]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# Prompt Improve

Thin router for the sk-prompt prompt-improvement workflow. This command verifies dispatch context, binds the required inputs and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

This Markdown owns dispatch-context verification, the blocking input gate, input binding, and execution-target selection. Agent dispatch (`@prompt-improver`), the DEPTH pipeline, CLEAR scoring, and prompt-file saving belong to the workflow YAML assets.

Load the presentation contract before showing any startup question, checkpoint, dashboard, success output, failure output, or next-step prompt.

### PHASE 0: DISPATCH-CONTEXT CHECK

Proceed when this file was invoked directly as the command, or by an explicit delegation naming this exact command. Stop only when there is concrete evidence that its raw contents were pasted into an unrelated worker prompt. Ambiguity is not evidence of a bad dispatch context.

### MANDATORY INPUT GATE

**STATUS: BLOCKED** until `prompt_input`, `enhancement_mode`, `save_choice`, `execution_mode`, and `dispatch_mode` are bound.

1. Parse `$ARGUMENTS`; remove the `:auto` / `:confirm` suffix, the `$mode` prefix, and the `--agent` flag before resolving the required prompt text.
2. Treat an absent or whitespace-only prompt as missing. Do not infer it from conversation history, open files, screenshots, or repository state.
3. When the prompt is missing, render the presentation contract's startup prompt (Q0), stop, and wait for an explicit reply. Use only `$ARGUMENTS` or that reply.
4. Bind `enhancement_mode` from the `$mode` prefix or `auto`; bind `dispatch_mode = AGENT` when `--agent` or resolved complexity `>= 7/10`, else `INLINE`. Never auto-select `save_choice`.
5. In `:confirm` or no-suffix mode, render the consolidated setup prompt and wait. In `:auto`, fail fast on a missing prompt and continue only when every field is valid.

| Field | Required | Source |
|---|---:|---|
| `dispatch_context_verified` | yes | Phase 0 |
| `prompt_input` | yes | explicit positional input or explicit reply |
| `enhancement_mode` | yes | `$mode` prefix or `auto` |
| `save_choice` | yes | setup prompt |
| `execution_mode` | yes | suffix or confirmed choice |
| `dispatch_mode` | yes | `--agent` / complexity or `INLINE` |

If any blocking phase was skipped, stop, report the skipped phase through the presentation contract, return to it, and complete it before loading YAML.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/prompt/assets/prompt_improve_presentation.txt` |
| Auto workflow | `.opencode/commands/prompt/assets/prompt_improve_auto.yaml` |
| Confirm workflow | `.opencode/commands/prompt/assets/prompt_improve_confirm.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` / `:confirm` execution-mode suffixes.
2. Treat the enhancement-mode prefixes (`$text`, `$improve`, `$refine`, `$short`, `$json`, `$yaml`, `$raw`), the `--agent` dispatch flag, and the remaining prompt text as workflow inputs, not execution modes.
3. If no execution-mode suffix is present, use the presentation contract's startup prompt to ask for it along with any other unresolved setup fields.
4. For `:auto`, resolve required setup inputs using the presentation contract's auto-resolution rules before loading YAML; fail fast if the required prompt input is missing.
5. Load the selected workflow asset and execute it step by step.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.opencode/commands/prompt/assets/prompt_improve_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/prompt/assets/prompt_improve_confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/prompt/assets/prompt_improve_presentation.txt`:

- Startup-question wording and reply format (the consolidated setup prompt).
- `:auto` pre-bound setup answer schema, default table, targeted-ask rules, and fail-fast display.
- Interactive framework-choice and simplification-choice templates, and the error-recovery table.
- The transparency report, success and failure result templates, and status lines.
- Next-step suggestions and final user prompt wording.

---

## 6. WORKFLOW SUMMARY

The YAML workflow verifies the orchestrating agent, resolves setup inputs, loads the `sk-prompt/prompt-improve` packet, then runs the DEPTH pipeline for the resolved enhancement mode (inline, or dispatched to `@prompt-improver` when `--agent` or high complexity is resolved), scores the result with CLEAR, delivers the enhanced prompt with a transparency report, and optionally saves it into a spec folder's `prompts/` directory. The confirm workflow pauses at the Discover, Prototype, and Test phases; the auto workflow runs end to end and stops only if CLEAR stays below threshold after three iterations.
