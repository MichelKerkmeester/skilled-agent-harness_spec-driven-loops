---
description: "Benchmark a model or prompt framework: fixtures, pattern, 5dim, or reviewer scoring; deterministic or graded runs. :auto/:confirm."
argument-hint: "<profile_path> [:auto|:confirm] [--spec-folder=PATH] [--scorer=pattern|5dim|reviewer] [--grader=noop|mock|llm] [--iterations=N] [--executor=NAME --model=NAME] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_search
---

# Deep Start Model Benchmark Loop

Thin router for the model-benchmark loop. This command verifies the runtime agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, artifact-writing behavior, benchmark execution, scoring, promotion, and state updates are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoint text, success output, failure output, examples, violation-recovery text, or next-step prompts.

> **EXECUTION PROTOCOL - READ FIRST**
>
> This command runs a structured workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: dispatch-context check (below)
> 2. Run Setup Phase through the presentation contract to gather or resolve inputs
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load matching YAML workflow and execute
>
> This command is **general-agent based** - orchestrates deep-improvement skill invocation in model-benchmark mode.
> This command is the dedicated Lane B entry. It sets `lane = model-benchmark` directly. It does NOT ask a lane question.

### PHASE 0: DISPATCH-CONTEXT CHECK

**STATUS: ☐ CHECKED**

```
This gate checks actual dispatch context, not self-reported capability -- the prior
self-assessment version of this check produced a confirmed false-positive block (a
capable agent judged itself "uncertain" on an abstract question and hard-stopped).

CHECK: was this file invoked directly as /deep:model-benchmark (typed by the user,
or an explicit Task delegation naming this exact command) -- as opposed to another
agent pasting this file's raw content into a Task-dispatch prompt as inline ad hoc
instructions for a worker to follow (that worker should follow its own dispatch
prompt, not re-run this command's full setup contract)?

├─ YES, or no concrete evidence of the pasted-inline case:
│   └─ general_agent_verified = TRUE → Continue to Setup Phase
│
└─ NO, with concrete evidence this file's content was pasted inline rather than
   invoked as the command itself:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ DIRECT INVOCATION REQUIRED                              │
    │   │                                                            │
    │   │ This command orchestrates the deep-improvement skill in    │
    │   │ model-benchmark mode and runs general-agent based.         │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:model-benchmark [arguments]                        │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="Must be invoked directly, not pasted as inline sub-agent instructions"

Default on ambiguity: PROCEED. Do not block on an inability to introspect abstract
capability (e.g. "can I orchestrate a workflow") -- that question is unanswerable
from the inside and is what caused the original false-positive block. Block only on
concrete evidence of the pasted-inline case above.
```

**Phase Output:**
- `general_agent_verified = ________________`

### MANDATORY INPUT GATE

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching and loop execution are handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `general_agent_verified`, `lane`, `profile_path`, `spec_folder`, `run_label`, `outputs_dir`, `execution_mode`, `scoring_method`, `grader`, `max_iterations`
  - `executor` and `model` only when `grader = llm`
- **LANE IS FIXED**: `lane = model-benchmark`; never ask a lane question.

For `:confirm` or no suffix, the consolidated setup prompt in the presentation contract MUST be the first visible response. For `:auto`, do not emit the consolidated setup prompt by default; use the auto setup resolution rules in the presentation contract and fail fast when required fields cannot be resolved.

### PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                  | REQUIRED      | YOUR VALUE | SOURCE                  |
| ---------------------- | ------------- | ---------- | ----------------------- |
| general_agent_verified | ✅ Yes         | ______     | Automatic check         |
| lane                   | ✅ Yes         | model-benchmark | Fixed by command   |
| profile_path           | ✅ Yes         | ______     | Q0, $ARGUMENTS, or default |
| spec_folder            | ✅ Yes         | ______     | Q1 or --spec-folder     |
| run_label              | ✅ Yes         | ______     | --run-label or Q1b      |
| outputs_dir            | ✅ Yes         | ______     | Derived from run_label  |
| execution_mode         | ✅ Yes         | ______     | Suffix or Q2            |
| scoring_method         | ✅ Yes         | ______     | Q3 or --scorer          |
| grader                 | ✅ Yes         | ______     | Q4 or --grader          |
| max_iterations         | ✅ Yes         | ______     | --iterations or 5       |
| executor               | Conditional   | ______     | Q5 (only when grader=llm) |
| model                  | Conditional   | ______     | Q5 (only when grader=llm) |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ grader == llm AND (executor missing OR model missing)?
│   │   └─ Re-prompt Q5 only
│   ├─ YES → Proceed to Mode Routing and the selected YAML workflow
│   └─ NO  → Re-prompt for missing values only
```

### ROUTING CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **DO NOT** ask a lane question - this command fixes `lane = model-benchmark`
- **DO NOT** infer the benchmark profile from context, screenshots, or conversation history
- **DO NOT** request executor/model unless `grader = llm`
- **DO NOT** start the loop without all setup values resolved
- **FIRST ACTION** is always: run Phase 0, run Setup, then load YAML workflow

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep_model-benchmark_presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml` |

No workflow-asset gap exists for this command.

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`; `:confirm` sets `execution_mode = INTERACTIVE`; no suffix sets `execution_mode = ASK`.
2. Treat profile paths, `--spec-folder`, `--run-label`, `--scorer`, `--grader`, `--iterations`, `--executor`, and `--model` as workflow inputs, not execution modes.
3. Set `lane = model-benchmark` directly. This command never asks a lane question and never routes to the agent-improvement lane.
4. For `:auto`, resolve setup from `$ARGUMENTS` flags, any `PRE-BOUND SETUP ANSWERS:` marker block, and the presentation contract's default resolution table. When all required fields are resolved, persist `{spec_folder}/improvement/model-benchmark-config.json`, bind runtime YAML placeholders, and load `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml`.
5. In `:auto`, ask targeted Tier-2 questions only for `spec_folder` or `run_label` when they are genuinely ambiguous and no default exists. `profile_path` uses the default profile when absent. `executor` and `model` are required only when `grader = llm`; missing conditional values re-prompt only that narrow field.
6. For `:confirm`, use the presentation contract's consolidated setup prompt to bind missing setup values, then load `.opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml`.
7. For no suffix, use the presentation contract's consolidated setup prompt to choose execution mode and bind missing setup values, then route the resolved interactive choice to the matching YAML.
8. Lightweight read-only discovery for available benchmark profiles or recent spec folders may support setup, but it must feed the single consolidated prompt and never split setup questions.
9. After the selected workflow asset is loaded, execute it step by step using the resolved setup values.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep_model-benchmark_presentation.txt`:

- Startup-question wording, consolidated setup prompt text, and reply format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display references.
- Benchmark purpose/contract display, scoring/grader reference tables, workflow overview display, and user-facing examples.
- Success and failure result templates, benchmark report display, reviewer mismatch wording, and violation-recovery wording.
- Next-step suggestions, promotion wording, related-command wording, and notes shown to users.

---

## 6. WORKFLOW SUMMARY

The selected YAML workflow invokes the deep-improvement model-benchmark lane, materializes benchmark fixtures before scoring, records mode-aware benchmark state, and writes benchmark outputs to `.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/`. This command never mutates canonical agent files and never loads the agent-improvement workflow.

Use `/deep:agent-improvement` to improve an agent definition. Related follow-on routes are `/speckit:complete` for full spec-driven development, `/prompt` for prompt improvement, and `/deep:review` for iterative code review.
