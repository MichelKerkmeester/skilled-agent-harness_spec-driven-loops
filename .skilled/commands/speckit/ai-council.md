---
description: "AI Council, 3 steps: bind the spec folder, dispatch @ai-council once, report the plan. Modes :auto, :confirm."
argument-hint: "<question-or-task> [:auto|:confirm] [--spec-folder=PATH]"
allowed-tools: Read, Write, Edit, Grep, Glob, Task
---

# SpecKit AI Council

Thin router for the single-round AI Council workflow. This command resolves the execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML asset.

Load the presentation contract before showing startup questions, checkpoints, success output, failure output, or next-step prompts.

The council plans and never implements. Its only writes are `ai-council/**` artifacts inside the bound spec folder, and the `@ai-council` agent makes them.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/speckit/assets/speckit-ai-council-presentation.txt` |
| Workflow (all execution modes) | `.skilled/commands/speckit/assets/speckit-ai-council.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. Treat the question text and `--spec-folder` as workflow inputs, not execution modes.
3. If no mode suffix is present, use the presentation contract's startup prompt to ask for execution mode.
4. For `:auto`, resolve required setup inputs using the presentation contract's auto-resolution rules before loading YAML.
5. Load the workflow asset and execute it step by step.

### Workflow Flag Surface

The argument hint names the invocation shape. The whole flag surface is here.

| Input | Value | Effect |
|-------|-------|--------|
| `--spec-folder` | `PATH` | Binds the packet whose `ai-council/` folder receives this run's artifacts. |

Under `:auto` a `PRE-BOUND SETUP ANSWERS:` block in the prompt body binds the required setup
values without an interactive prompt.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.skilled/commands/speckit/assets/speckit-ai-council.yaml` with `execution_mode` auto: confirm-only checkpoint blocks skipped |
| `:confirm` or interactive choice | `.skilled/commands/speckit/assets/speckit-ai-council.yaml` with `execution_mode` confirm: every `applies_to: confirm` checkpoint runs |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/speckit/assets/speckit-ai-council-presentation.txt`:

- Startup-question wording and reply format.
- `:auto` pre-bound setup answer schema, default table, targeted-ask rules, and fail-fast display.
- Checkpoint display templates.
- Success and failure result templates.
- Next-step suggestions and final user prompt wording.

---

## 6. WORKFLOW SUMMARY

The YAML workflow runs one council run in three steps.
It binds the spec folder first, so nothing is written before the target is known.
It then dispatches `@ai-council` once with the question and the bound folder.
The agent deliberates, writes its artifacts under `[SPEC_FOLDER]/ai-council/` and returns the report.
The workflow ends by showing the recommended plan and the path of `council-report.md`.

A second run on the same spec folder continues with the next round, because the agent reads the state it wrote before.
The command does not loop over topics and does not implement the plan.
If the user wants the plan built, route to `/speckit:plan` or `/speckit:implement`.
