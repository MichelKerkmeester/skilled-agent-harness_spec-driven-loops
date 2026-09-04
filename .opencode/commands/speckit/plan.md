---
description: "Planning workflow, 8 steps: spec through plan only. Modes :auto, :confirm, :autopilot; :with-* modifiers."
argument-hint: "<feature-description> [:auto|:confirm|:autopilot|:unattended|--unattended] [:with-context] [:with-phases] [--level=N]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__system_spec_memory__memory_search, mcp__system_spec_memory__memory_save, opencode_goal, opencode_goal_status
---

# SpecKit Plan

Thin router for the SpecKit planning workflow. This command resolves the execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, checkpoints, dashboards, success output, failure output, or next-step prompts.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/speckit/assets/speckit-plan-presentation.txt` |
| Auto workflow | `.opencode/commands/speckit/assets/speckit-plan-auto.yaml` |
| Confirm workflow | `.opencode/commands/speckit/assets/speckit-plan-confirm.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto`, `:confirm`, `:autopilot`, `:unattended`, or `--unattended`.
2. Treat `:with-context`, `:with-phases`, `--intake-only`, `--phases`, `--phase-names`, `--phase-folder`, `--spec-folder`, `--level`, `--start-state`, `--repair-mode`, and relationship flags as workflow inputs, not execution modes.
3. If no mode suffix is present, use the presentation contract's startup prompt to ask for execution mode.
4. For `:auto`, resolve required setup inputs using the presentation contract's auto-resolution rules before loading YAML.
5. For `:autopilot`, `:unattended`, or `--unattended`, bind execution mode to `autopilot`; do not alias it to `:auto`.
6. Load the selected workflow asset and execute it step by step.

### Workflow Flag Surface

The argument hint names the invocation shape; the whole flag surface is here. Every entry below
is a workflow input, never an execution mode.

| Input | Value | Effect |
|-------|-------|--------|
| `:with-context` | no value | Loads a context package before planning. |
| `:with-phases` | no value | Decomposes the packet into phase children and plans the first one. |
| `--intake-only` | no value | Stops after the intake emit and never continues into the planning steps. |
| `--phases` | `N` | Number of phase children to decompose into. |
| `--phase-names` | comma-separated list | Names for those children, in order. |
| `--phase-folder` | `PATH` | Targets one existing child instead of decomposing. |
| `--spec-folder` | `PATH` | Binds the packet that owns this run's writes. |
| `--level` | `1` \| `2` \| `3` \| `3+` | Overrides the recommended documentation level. |
| `--start-state` | `empty-folder` \| `partial-folder` \| `repair-mode` \| `placeholder-upgrade` \| `populated-folder` | Declares the folder state instead of letting the workflow classify it. |
| `--repair-mode` | `MODE` | Selects the repair path when the folder needs metadata repair or an intake resume before planning. |
| `--record-relationships` | `yes` \| `no` | Gate on writing packet relationships. Default `no`. |
| `--depends-on`, `--related-to`, `--supersedes` | comma-separated packet ids | Seed the `depends_on`, `related_to` and `supersedes` lists, recorded only when `--record-relationships=yes`. |

Under `:auto` a `PRE-BOUND SETUP ANSWERS:` block in the prompt body binds the required setup
values without an interactive prompt.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.opencode/commands/speckit/assets/speckit-plan-auto.yaml` |
| `:autopilot`, `:unattended`, or `--unattended` | `.opencode/commands/speckit/assets/speckit-plan-auto.yaml` with unattended task metadata required |
| `:confirm` or interactive choice | `.opencode/commands/speckit/assets/speckit-plan-confirm.yaml` |

### UNATTENDED TASK METADATA

When planning for `:autopilot`, `:unattended`, or `--unattended`, every executable task row in `tasks.md` must carry unattended-ready metadata so later implementation can decide eligibility without asking the user.

Required fields:

- `agent`: the assigned executor or `direct`
- `deps`: zero or more prerequisite task ids
- `touched-files`: best-effort list of expected file paths or globs

Recommended inline form:

```markdown
<!-- agent: direct | deps: [] | touched-files: [".opencode/commands/speckit/complete.md"] -->
```

If the planner cannot assign one of these fields with at least medium confidence, the unattended terminal result must use `uncertainty_blocked` instead of emitting a prose-only stop.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/speckit/assets/speckit-plan-presentation.txt`:

- Startup-question wording and reply format.
- `:auto` pre-bound setup answer schema, default table, targeted-ask rules, and fail-fast display.
- Checkpoint and dashboard display templates, including phase-decomposition checkpoints.
- Success and failure result templates.
- Next-step suggestions and final user prompt wording.

---

## 6. WORKFLOW SUMMARY

The YAML workflow runs planning from intake through context refresh and terminates before implementation. If a user requests implementation after planning, route to `/speckit:implement`; do not start implementation from this command.
