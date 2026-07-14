---
description: Implementation workflow (9 steps): execute pre-planned work. Requires plan.md. Modes :auto, :confirm, :autopilot/:unattended/--unattended.
argument-hint: "<spec-folder> [:auto|:confirm|:autopilot|:unattended|--unattended] [--phase-folder=<path>] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup; :autopilot/:unattended/--unattended preserves the branch on hard failure)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_save, mcp__mk_code_index__code_graph_query, mk_goal, mk_goal_status
---

# SpecKit Implement

Thin router for implementing an already planned SpecKit packet. This command resolves mode and target folder, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, implementation steps, debug offers, review gates, and context-save behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, checkpoints, dashboards, success output, failure output, or next-step prompts.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/speckit/assets/speckit_implement_presentation.txt` |
| Auto workflow | `.opencode/commands/speckit/assets/speckit_implement_auto.yaml` |
| Confirm workflow | `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml` |

No workflow-asset gap exists for this command.

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto`, `:confirm`, `:autopilot`, `:unattended`, or `--unattended`.
2. Treat `--phase-folder` and the positional spec-folder path as workflow inputs.
3. If no mode suffix is present, use the presentation contract's startup prompt to ask for execution mode.
4. For `:auto`, resolve required setup inputs using the presentation contract's auto-resolution rules before loading YAML.
5. For `:autopilot`, `:unattended`, or `--unattended`, bind execution mode to `autopilot`; do not alias it to `:auto`.
6. Validate that the target has the required planning artifacts before executing the workflow asset.
7. Load the selected workflow asset and execute it step by step.

---

## 4. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/speckit/assets/speckit_implement_auto.yaml` |
| `:autopilot`, `:unattended`, or `--unattended` | `.opencode/commands/speckit/assets/speckit_implement_auto.yaml` with branch-preserved failure semantics |
| `:confirm` or interactive choice | `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml` |

### UNATTENDED TERMINATION

`:autopilot`, `:unattended`, and `--unattended` must never end with prose-only failure output.

Terminal failure/no-op reason codes are exactly:

- `no_eligible_tasks`
- `retry_exhausted`
- `verification_failed`
- `uncertainty_blocked`

On any of those results, preserve the active branch, do not merge, and emit one machine-readable result line with prefix `SPECKIT_AUTOPILOT_RESULT`. Successful completion emits `reason: null`; it does not add a fifth terminal reason code.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/speckit/assets/speckit_implement_presentation.txt`:

- Startup-question wording and reply format.
- `:auto` pre-bound setup answer schema, default table, targeted-ask rules, and fail-fast display.
- Prerequisite, quality-gate, debug-offer, review, and closeout dashboards.
- Success and failure result templates.
- Next-step suggestions and final user prompt wording.

---

## 6. WORKFLOW SUMMARY

The YAML workflow requires prior planning artifacts, executes implementation tasks, verifies checklist evidence, writes completion artifacts, refreshes context, and closes the implementation pass.
