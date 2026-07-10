---
description: Rebuild spec-kit runtime databases in dependency-safe order through the interactive confirm workflow.
argument-hint: "[--force] [--no-snapshot] [--cleanup-legacy] [--migrate] [--keep-snapshots] [--resume-bootstrap]"
allowed-tools: Read, Bash, Grep, Glob, mcp__mk_code_index__code_graph_status, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context, mcp__mk_code_index__code_graph_scan, mcp__mk_code_index__code_graph_apply, mcp__mk_code_index__detect_changes, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_health, mcp__mk_spec_memory__memory_index_scan, mcp__mk_spec_memory__memory_drift_why, mcp__mk_spec_memory__memory_stats, mcp__mk_spec_memory__memory_causal_stats, mcp__mk_spec_memory__memory_causal_link, mcp__mk_skill_advisor__advisor_recommend, mcp__mk_skill_advisor__advisor_status, mcp__mk_skill_advisor__advisor_validate, mcp__mk_skill_advisor__advisor_rebuild, mcp__mk_skill_advisor__skill_graph_scan, mcp__mk_skill_advisor__skill_graph_query, mcp__mk_skill_advisor__skill_graph_status, mcp__mk_spec_memory__eval_run_ablation, mcp__mk_spec_memory__session_health
---
<!-- skill_agent: system-spec-kit -->

# /doctor:update Router

This command is a thin router. It resolves update flags and setup values, then loads the update workflow YAML and the presentation contract.

## Router Contract

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing startup questions, mid-run prompts, dashboards, validation displays, result summaries, or restart-required text.

## Owned Assets

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/doctor/assets/doctor_update_presentation.txt` |
| Update workflow | `.opencode/commands/doctor/assets/doctor_update.yaml` |

No workflow-asset gap exists for this command.

## Execution Order

1. Read `.opencode/commands/doctor/assets/doctor_update_presentation.txt`.
2. Parse `$ARGUMENTS` for supported flags: `--force`, `--no-snapshot`, `--cleanup-legacy`, `--migrate`, `--keep-snapshots`, and `--resume-bootstrap`.
3. Bind setup values: `execution_mode`, `intent`, `force`, `no_snapshot`, `cleanup_legacy`, `migrate`, `keep_snapshots`, `resume_bootstrap`, and internal `skip_status_check` (fixed `false`; no user flag).
4. If `--force` is absent, ask the presentation contract's initial confirmation prompt and wait.
5. If `--force` is present, auto-answer the initial confirmation as proceed; the active-MCP-client prompt still fires when the workflow detects active clients.
6. Load `.opencode/commands/doctor/assets/doctor_update.yaml` only after every setup value is bound.
7. Execute the YAML phase by phase.
8. Use the presentation contract, not this router, for user prompts, dashboards, result summaries, restart-required display, and next-step text.

## Routing Rules

- This command is always interactive; deleted mode suffixes are invalid.
- Snapshot every SQLite database before mutation unless `--no-snapshot` was explicitly passed.
- If runtime bootstrap changes layout or build artifacts, stop with `STATUS=RESTART_REQUIRED`; start a fresh OpenCode process and rerun with `--resume-bootstrap`.
- `--migrate` reads the migration manifest and refuses on gaps; this command does not create or edit that manifest.
- `--cleanup-legacy` prompts per manifest-listed legacy file; no silent deletion.
- Acquire the update flock before probes or mutations that can enter the database rebuild path.
- Every terminal path writes the update state log defined by the YAML workflow.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

## Presentation Boundary

The following content lives only in `.opencode/commands/doctor/assets/doctor_update_presentation.txt`:

- Initial confirmation and mid-run prompt catalog.
- Cross-subsystem health dashboard layout.
- Status output, state-log, snapshot, restart-required, and failure display templates.
- Related-command and next-step display text.

User request: $ARGUMENTS
