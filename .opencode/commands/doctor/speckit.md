---
description: Router for /doctor <target>; dispatches subsystem diagnostics through _routes.yaml.
argument-hint: "<target> [flags] | list | ?"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write, mcp__mk_code_index__code_graph_status, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context, mcp__mk_code_index__detect_changes, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_health, mcp__mk_spec_memory__memory_drift_why, mcp__mk_spec_memory__memory_stats, mcp__mk_spec_memory__embedder_status, mcp__mk_spec_memory__memory_causal_stats, mcp__mk_spec_memory__memory_causal_link, mcp__mk_skill_advisor__advisor_recommend, mcp__mk_skill_advisor__advisor_status, mcp__mk_skill_advisor__advisor_validate, mcp__mk_skill_advisor__advisor_rebuild, mcp__mk_skill_advisor__skill_graph_scan, mcp__mk_skill_advisor__skill_graph_query, mcp__mk_skill_advisor__skill_graph_status
---
<!-- skill_agent: system-spec-kit -->

# /doctor Router

This command is a thin router. It resolves the target and setup values, then loads the target workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing startup questions, setup dashboards, approval prompts, diagnostic dashboards, result summaries, or next-step text.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.opencode/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt` |

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest.
- `execution_mode` is always `INTERACTIVE`.
- The positional target is parsed before any flag; global flag pre-parse is forbidden.
- Unknown or cross-target flags fail before YAML load.
- The YAML start condition is: target bound, workflow asset exists, presentation asset loaded, and every target setup variable resolved.
- If any referenced asset is missing, stop and report the missing path.
- Companion commands are not routed through this file: `/doctor:update` and `/doctor:mcp install|debug` have their own routers.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

## 4. EXECUTION TARGETS

These existing YAML assets are referenced only. The router must not modify them.

| Target | Workflow |
|--------|----------|
| `memory` | `.opencode/commands/doctor/assets/doctor_memory.yaml` |
| `embeddings` | `.opencode/commands/doctor/assets/doctor_embeddings.yaml` |
| `causal-graph` | `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` |
| `code-graph` | `.opencode/commands/doctor/assets/doctor_code-graph.yaml` |
| `deep-loop` | `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` |
| `skill-advisor` | `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml` |
| `skill-budget` | `.opencode/commands/doctor/assets/doctor_skill-budget.yaml` |
| `parent-skill` | `.opencode/commands/doctor/assets/doctor_parent-skill.yaml` |
| `skill-graph-freshness` | `.opencode/commands/doctor/assets/doctor_skill-graph-freshness.yaml` |
| `fable-mode` | `.opencode/commands/doctor/assets/doctor_fable-mode.yaml` |

No workflow-asset gap exists for this command.

1. Read `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt`.
2. Read `.opencode/commands/doctor/_routes.yaml`.
3. Parse the first positional token from `$ARGUMENTS` as `target`; support `list`, `?`, `--list`, and compatibility alias `--target=<name>`.
4. If target is unresolved, ask the presentation contract's target-resolution prompt and wait.
5. If target is unknown, render the presentation contract's unknown-target failure and stop.
6. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating`, `mcp_tools`, and script invocations from `_routes.yaml`.
7. Parse remaining flags using only the resolved target's `allowed_flags`; reject cross-target flags using the presentation contract's error wording.
8. Resolve any missing setup variables using the presentation contract's per-target setup prompts.
9. Load the resolved workflow YAML from `.opencode/commands/doctor/assets/<yaml>` and execute it step by step.
10. Use the presentation contract, not this router, for user prompts, dashboards, result summaries, and next-step display.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt`:

- Target-resolution menu, help text, accepted answers, and failure wording.
- Per-target setup prompts for unresolved fields.
- Subsystem manifest display for `list`, `?`, or `--list`.
- Diagnostic dashboard and result-summary templates.
- Troubleshooting and next-step display text.

## 6. WORKFLOW SUMMARY

The router resolves a subsystem `target` against `_routes.yaml`, binds that target's workflow YAML plus its setup variables, allowed flags, and mutation class, then loads and executes the resolved `doctor_<target>.yaml` step by step under an always-interactive mode. `list`, `?`, or `--list` render the subsystem manifest instead of dispatching. All visible wording is owned by the presentation contract; subsystem-specific behavior lives in each target workflow.

User request: $ARGUMENTS
