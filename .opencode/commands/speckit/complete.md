---
description: End-to-end SpecKit workflow (14+ steps). Modes: :auto, :confirm, :autopilot/:unattended/--unattended, :with-research, :with-context, :with-phases.
argument-hint: "<feature-description> [:auto|:confirm|:autopilot|:unattended|--unattended] [:with-research] [:with-context] [:with-phases] [--phases N] [--phase-names list] [--phase-folder=<path>] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup; :autopilot/:unattended/--unattended runs branch-preserved unattended mode)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_save, mcp__mk_spec_memory__task_preflight, mcp__mk_spec_memory__task_postflight, mcp__mk_code_index__code_graph_query, mk_goal, mk_goal_status
---

# SpecKit Complete

Thin router for the end-to-end SpecKit workflow. This command resolves mode and optional workflow flags, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, research/context/phase insertion, artifact writing, validation, and context-save behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, checkpoints, dashboards, success output, failure output, or next-step prompts.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/speckit/assets/speckit-complete-presentation.txt` |
| Auto workflow | `.opencode/commands/speckit/assets/speckit-complete-auto.yaml` |
| Confirm workflow | `.opencode/commands/speckit/assets/speckit-complete-confirm.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto`, `:confirm`, `:autopilot`, `:unattended`, or `--unattended`.
2. Treat `:with-research`, `:with-context`, `:with-phases`, `--phases`, `--phase-names`, and `--phase-folder` as workflow inputs, not execution modes.
3. If no mode suffix is present, use the presentation contract's startup prompt to ask for execution mode.
4. For `:auto`, resolve required setup inputs using the presentation contract's auto-resolution rules before loading YAML.
5. For `:autopilot`, `:unattended`, or `--unattended`, bind execution mode to `autopilot`; do not alias it to `:auto`.
6. Load the selected workflow asset and execute it step by step.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.opencode/commands/speckit/assets/speckit-complete-auto.yaml` |
| `:autopilot`, `:unattended`, or `--unattended` | `.opencode/commands/speckit/assets/speckit-complete-auto.yaml` with `unattended_autopilot` enabled |
| `:confirm` or interactive choice | `.opencode/commands/speckit/assets/speckit-complete-confirm.yaml` |

### UNATTENDED RESULT CONTRACT

`:autopilot`, `:unattended`, and `--unattended` are a branch-preserved execution envelope, not a quieter spelling of `:auto`.

- Branch before any spec or implementation writes.
- Never prompt after startup parsing; halt with a terminal result instead.
- Merge only after clean verification on the autopilot branch.
- Preserve the branch and skip merge on every hard failure.
- Emit one machine-readable result line with prefix `SPECKIT_AUTOPILOT_RESULT`.

Terminal failure/no-op reason codes are exactly:

- `no_eligible_tasks`
- `retry_exhausted`
- `verification_failed`
- `uncertainty_blocked`

Successful completion emits `reason: null`; it does not add a fifth terminal reason code.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/speckit/assets/speckit-complete-presentation.txt`:

- Startup-question wording and reply format.
- `:auto` pre-bound setup answer schema, default table, targeted-ask rules, and fail-fast display.
- Research, phase-decomposition, planning-gate, implementation, checklist, and closeout dashboards.
- Success and failure result templates.
- Next-step suggestions and final user prompt wording.

---

## 6. WORKFLOW SUMMARY

The YAML workflow runs the full lifecycle from specification through implementation, validation, context refresh, and workflow closeout. Optional research, context, and phase-decomposition flows are routed through the selected workflow asset.
