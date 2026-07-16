---
description: Resume or recover work on a spec folder: canonical continuity recovery with one next step.
argument-hint: "[spec-folder-path] [:auto|:confirm] [--phase-folder=<path>] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_match_triggers, mcp__mk_spec_memory__memory_list, mcp__mk_spec_memory__session_bootstrap, mk_goal_status
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
| Presentation source of truth | `.opencode/commands/speckit/assets/speckit_resume_presentation.txt` |
| Auto workflow | `.opencode/commands/speckit/assets/speckit_resume_auto.yaml` |
| Confirm workflow | `.opencode/commands/speckit/assets/speckit_resume_confirm.yaml` |

No workflow-asset gap exists for this command.

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. Treat `--phase-folder`, `--no-redirect`, and the positional spec-folder path as workflow inputs.
3. If no mode suffix is present, default to interactive mode unless the presentation contract's startup display says a confirmation is required.
4. For `:auto`, resolve required setup inputs using the presentation contract's auto-resolution rules before loading YAML.
5. Load the selected workflow asset and execute it step by step.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.opencode/commands/speckit/assets/speckit_resume_auto.yaml` |
| `:confirm` or default interactive choice | `.opencode/commands/speckit/assets/speckit_resume_confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/speckit/assets/speckit_resume_presentation.txt`:

- Startup-question wording and reply format.
- `:auto` pre-bound setup answer schema, default table, targeted-ask rules, and fail-fast display.
- Session-selection, memory-depth, progress, stale-session, and continuation dashboards.
- Resume brief and no-session result templates.
- Related-command and next-step suggestions.

---

## 6. WORKFLOW SUMMARY

The YAML workflow recovers the smallest safe continuation packet from canonical artifacts first, enriches only when needed, calculates progress, and presents one next safe action.
