---
description: "Evaluate and improve any agent: 5 dimensions, proposals, scoring, guarded promotion. Modes :auto, :confirm."
argument-hint: "<agent_path> [:auto|:confirm] [--spec-folder=PATH] [--iterations=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_search
---

# Deep Start Agent Improvement Loop

Thin router for the agent-improvement loop. This command verifies the runtime agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, candidate writing, scoring, promotion gating, and artifact-writing behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoint text, success output, failure output, examples, or next-step prompts.

> **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: dispatch-context check (below)
> 2. Run the Unified Setup Phase through the presentation contract
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load matching YAML workflow and execute
>
> This command is **general-agent based** — orchestrates deep-improvement skill invocation.

### PHASE 0: DISPATCH-CONTEXT CHECK

**STATUS: ☐ CHECKED**

```
This gate checks actual dispatch context, not self-reported capability -- the prior
self-assessment version of this check produced a confirmed false-positive block (a
capable agent judged itself "uncertain" on an abstract question and hard-stopped).

CHECK: was this file invoked directly as /deep:agent-improvement (typed by the user,
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
    │   │ This command orchestrates deep-improvement skill           │
    │   │ invocation and runs general-agent based.                   │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:agent-improvement [arguments]                     │
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
- **DO NOT** infer target agent from context, screenshots, or conversation history.
- **DO NOT** start the loop without all setup values resolved.
- **FIRST ACTION** is always: run Phase 0, run Setup, then load YAML workflow.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `general_agent_verified`, `lane`, `target_path`, `target_profile`, `spec_folder`, `execution_mode`, `scoring_mode`, `max_iterations`

For `:confirm` or no suffix, the consolidated setup prompt in the presentation contract MUST be the first visible response. For `:auto`, do not emit the consolidated setup prompt by default; use the auto setup resolution rules in the presentation contract and fail fast when required fields cannot be resolved.

### PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                  | REQUIRED      | YOUR VALUE | SOURCE                  |
| ---------------------- | ------------- | ---------- | ----------------------- |
| general_agent_verified | ✅ Yes         | ______     | Automatic check         |
| lane                   | ✅ Yes         | ______     | Step 1B / Q(lane)       |
| target_path            | ✅ Yes         | ______     | Q0 or $ARGUMENTS        |
| target_profile         | ✅ Yes         | ______     | Derived from target rules |
| spec_folder            | ✅ Yes         | ______     | Q1 or --spec-folder     |
| execution_mode         | ✅ Yes         | ______     | Suffix or Q2            |
| scoring_mode           | ✅ Yes         | ______     | Q3                      |
| max_iterations         | ✅ Yes         | ______     | --iterations or 5       |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to Mode Routing and the selected workflow asset
│   └─ NO  → Re-prompt for missing values only
```

### ROUTING CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **DO NOT** infer the target agent from context, screenshots, or conversation history
- **DO NOT** start the loop without all setup values resolved
- **RESOLVE `lane` FIRST** - an explicit `lane=model-benchmark` (via `--lane`, marker, `--profile`, or Q(lane)) hands off to `/deep:model-benchmark`; never ask the Lane A questions in that case
- **FIRST ACTION** is always: run Phase 0, run Setup, then load the YAML workflow

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep-agent-improvement-presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep-agent-improvement-auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep-agent-improvement-confirm.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`; `:confirm` sets `execution_mode = INTERACTIVE`; no suffix sets `execution_mode = ASK`.
2. Treat `--lane`, `--profile`, `--spec-folder`, `--iterations`, and any `PRE-BOUND SETUP ANSWERS:` marker block as workflow inputs, not execution modes.
3. Resolve `lane` before the agent-path check. Explicit `--lane` or marker `lane` signals are evaluated first. An explicit `lane=model-benchmark` that conflicts with a supplied agent path must fail fast with a one-line conflict error or ask one disambiguation question through the presentation contract.
4. If `lane=model-benchmark` is resolved by explicit lane, marker lane, `--profile`, benchmark-profile input, or Q(lane), hand off to `/deep:model-benchmark` and load `.opencode/commands/deep/assets/deep_model-benchmark_{auto,confirm}.yaml`; do not ask the Lane A Q0/Q1/Q3 questions.
5. For Lane A, resolve `target_path` from `$ARGUMENTS` or the presentation contract's Q0, derive `target_profile` from the target path, resolve `spec_folder` from `--spec-folder` or Q1, resolve `scoring_mode` as `dynamic`, and resolve `max_iterations` from `--iterations` or default `5`.
6. For `:auto`, resolve setup from `$ARGUMENTS` flags, the optional `PRE-BOUND SETUP ANSWERS:` marker block, and the presentation contract's default resolution table. When all required fields are resolved, persist `{spec_folder}/improvement/agent-improvement-config.json`, bind runtime YAML placeholders, and load `.opencode/commands/deep/assets/deep-agent-improvement-auto.yaml`.
7. In `:auto`, ask a targeted Tier-2 question only for `spec_folder` when that field is genuinely ambiguous and no default exists. Missing `target_path` is absence, not ambiguity; use the named-missing-inputs fail-fast format from the auto-mode contract and do not load YAML.
8. For `:confirm`, use the presentation contract's consolidated setup prompt to bind missing setup values, then load `.opencode/commands/deep/assets/deep-agent-improvement-confirm.yaml`.
9. For no suffix, use the presentation contract's consolidated setup prompt to choose execution mode and bind missing setup values, then route the resolved interactive choice to the matching YAML.
10. After the selected workflow asset is loaded, execute it step by step using the resolved setup values.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep-agent-improvement-auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep-agent-improvement-confirm.yaml` |

If Lane B is selected, auto-route to `/deep:model-benchmark` and its dedicated workflow assets instead of the agent-improvement YAMLs.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep-agent-improvement-presentation.txt`:

- Startup-question wording, consolidated setup prompt text, question text, and reply-format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display references.
- Dashboard/checkpoint layouts, purpose/contract displays, scoring reference tables, workflow-step displays, and artifact presentation wording.
- Success and failure result templates, example output, return-status formats, stop-reason wording, and violation-recovery display.
- Example invocations, notes, Lane B explanation, related-command wording, and next-step suggestion wording.

---

## 6. WORKFLOW SUMMARY

The selected YAML workflow runs a bounded evaluator-first loop that scans the target agent's integration surface, derives a dynamic scoring profile, writes packet-local candidates, scores them across five weighted dimensions, runs fixtures, and reduces the run into a dashboard plus registry. Promotion remains guarded by evidence, repeatability, and operator approval.

This command is the Lane A agent-improvement entry point. If setup resolves `lane=model-benchmark`, route to `/deep:model-benchmark`; related follow-on commands include `/speckit:complete`, `/prompt`, and `/deep:review`.
