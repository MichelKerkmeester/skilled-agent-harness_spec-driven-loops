---
description: "Resume or recover work on a spec folder: canonical continuity recovery with one next step."
argument-hint: "[spec-folder-path] [:auto|:confirm] [--phase-folder=<path>] [--no-redirect]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, opencode_goal_status
---

# SpecKit Resume

Thin router for resuming or recovering work on an existing SpecKit packet. This command resolves mode and target folder, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Session detection, continuity loading, progress calculation, recovery depth, and continuation behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, checkpoints, dashboards, resume briefs, stale-session warnings, or next-step prompts.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` |
| Workflow (both execution modes) | `.skilled/commands/speckit/assets/speckit-resume.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. Treat `--phase-folder`, `--no-redirect`, and the positional spec-folder path as workflow inputs.
3. If no mode suffix is present, default to interactive mode unless the presentation contract's startup display says a confirmation is required.
4. For `:auto`, resolve required setup inputs using the presentation contract's auto-resolution rules before loading YAML.
5. Load the workflow asset, bind `execution_mode` to the resolved mode and execute it step by step.

### Workflow Flag Surface

The argument hint names the invocation shape. The whole flag surface is here, and every entry
below is a workflow input, never an execution mode.

| Input | Value | Effect |
|-------|-------|--------|
| `<spec-folder>` | `PATH` | The packet to resume. Leave it out to open the packet the calling session owns. |
| `--phase-folder` | `PATH` | Targets one phase child of that packet and skips the phase redirect. |
| `--no-redirect` | none | Stays on a phase parent and shows its `spec.md` and child list in place of following the last-active pointer. |

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.skilled/commands/speckit/assets/speckit-resume.yaml` with `execution_mode` auto: confirm-only blocks skipped |
| `:confirm` or default interactive choice | `.skilled/commands/speckit/assets/speckit-resume.yaml` with `execution_mode` confirm: every `applies_to: confirm` block runs and `mode_overrides.confirm` wording applies |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/speckit/assets/speckit-resume-presentation.txt`:

- Startup-question wording and reply format.
- `:auto` pre-bound setup answer schema, default table, targeted-ask rules, and fail-fast display.
- Session-selection, memory-depth, progress, stale-session, and continuation dashboards.
- Resume brief and no-session result templates.
- Related-command and next-step suggestions.

---

## 6. WORKFLOW SUMMARY

The YAML workflow recovers the smallest safe continuation packet from canonical artifacts first, enriches only when needed, calculates progress, and presents one next safe action.
