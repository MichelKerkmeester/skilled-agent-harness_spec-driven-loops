Thin router for the deep-review loop. This command verifies the orchestrating agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoints, success output, failure output, examples, or next-step prompts.

This command is **general-agent based**. Do not use the Task tool to spawn the general agent; in `opencode run --command`, the default primary agent is the command orchestrator when it has the tools listed below. Keep raw agent handles out of this command body because OpenCode parses them as delegation requests.

In `:auto` mode, an explicit `--restart` or `--lineage-mode=restart` flag is operator authorization to archive the resolved review packet before fan-out or phase init. Do not ask for a second confirmation; preserve rollback by moving the timestamped archive directory back to `review/` if needed.

### MANDATORY INPUT GATE

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, `lineage_mode`
  - `dry_run` (default false unless `--dry-run` is present)

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/deep/assets/deep-review-presentation.txt` |
| Workflow | `.skilled/commands/deep/assets/deep-review.yaml` (`execution_mode` binds to `auto` or `confirm`) |

No workflow-asset gap exists for this command.

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached command suffixes (`:auto` or `:confirm`). Canonical mode syntax is `/deep:review:auto` and `/deep:review:confirm`; keep AGENTS, skills, and quick references synchronized to this entrypoint.
2. Treat target text, `--max-iterations`, `--convergence`, `--lineage-timeout-hours`, `--stop-policy`, `--dry-run`, `--spec-folder`, lifecycle flags (`--restart`, `--lineage-mode`), executor flags, fan-out flags, the internal `--fanout-lineage-artifact-dir`, and pre-bound setup answers as workflow inputs, not execution modes.
3. If `:auto` is present, set `execution_mode = AUTONOMOUS` and resolve required setup inputs through the presentation contract's three-tier auto setup resolution before loading YAML.
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the presentation contract's consolidated setup prompt before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the presentation contract's consolidated setup prompt to ask for execution mode.
6. Load the selected workflow asset only after `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, `lineage_mode` and `dry_run` are bound.

### Lineage Timeout Flag

`--lineage-timeout-hours <N>` raises the per-lineage wall-clock timeout ceiling above the default 4 hours for long, high-effort, forced-depth fan-out runs; omit it to keep the 4h default.

### Stop Policy Flag

`--stop-policy <convergence|max-iterations>` selects whether convergence may stop the loop early. The default `convergence` stops at legal convergence or `config.maxIterations`, whichever comes first; `max-iterations` treats convergence as telemetry only and forces the loop to continue until `config.maxIterations`, which is useful for forced-depth runs.

### Dry-Run Flag

`--dry-run` is a first-class flag in both execution modes, not a third execution mode. It still performs real setup resolution, artifact-root resolution, focus selection, prompt rendering and convergence reads when those steps can run without side effects.

When `dry_run=true`, the workflow emits `dry_run_halt` JSONL preview lines to terminal output instead of appending to the live state log, and halts before executor dispatch, persistent state mutation, reducer refresh or child-lineage spawn.
Under dry run the setup phase binds its values in memory and does not persist `{artifact_dir}/deep-review-config.json`.
A fresh packet will stop at the first persistent state boundary.
An existing packet can read current state and convergence signals, render the next prompt for preview, then stop before dispatch.

---

## 4. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto` or `:confirm` | `.skilled/commands/deep/assets/deep-review.yaml`, with `execution_mode` bound to `auto` or `confirm` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/deep/assets/deep-review-presentation.txt`:

- Startup-question wording, consolidated setup prompt text, question text, and reply-format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display behavior.
- Dashboard/checkpoint layouts, workflow overview displays, mode behavior descriptions, and review reference displays.
- Success and failure result templates, error-handling displays, and verdict wording.
- Example invocations, fan-out explanation display, and next-step suggestion wording.

---

## 6. WORKFLOW SUMMARY


**Review path (findings):** `/deep:review` -> (if FAIL/CONDITIONAL) `/speckit:plan` -> `/speckit:implement`
**Review path (clean):** `/deep:review` -> (if PASS) `/create:changelog`
