---
description: "Tune and rebuild the skill advisor, and audit graph freshness, router reach, budgets and parent hubs."
argument-hint: "<tune|rebuild|skill-graph-freshness|router-reach|skill-budget|parent-skill> [flags] | list | ?"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write
---
<!-- skill_agent: system-skill-advisor -->

# /doctor:skill-advisor Router

This command is a thin router. It resolves the target and setup values from `_routes.yaml`, then loads the target workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing startup questions, setup dashboards, approval prompts, diagnostic dashboards, result summaries, or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest; this command owns the routes whose `command` is `/doctor:skill-advisor`.
- `execution_mode` is always `INTERACTIVE`.
- The positional target is parsed before any flag; global flag pre-parse is forbidden.
- Unknown or cross-target flags fail before YAML load.
- The YAML start condition is: target bound, workflow asset exists, presentation asset loaded, and every target setup variable resolved.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

---

## 4. EXECUTION TARGETS

These existing YAML assets are referenced only. The router must not modify them.

| Target | Workflow |
|--------|----------|
| `tune` | `.skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml` |
| `rebuild` | `.skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml` |
| `skill-graph-freshness` | `.skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml` |
| `router-reach` | `.skilled/commands/doctor/assets/doctor-router-reach.yaml` |
| `skill-budget` | `.skilled/commands/doctor/assets/doctor-skill-budget.yaml` |
| `parent-skill` | `.skilled/commands/doctor/assets/doctor-parent-skill.yaml` |

1. Read `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:skill-advisor` routes.
3. Parse the first positional token from `$ARGUMENTS` as `target`; support `list`, `?`, `--list`, and compatibility alias `--target=<name>`.
4. If target is unresolved, ask the presentation contract's target-resolution prompt and wait.
5. If target is unknown, render the presentation contract's unknown-target failure and stop.
6. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating`, `mcp_tools`, `cli_commands`, and script invocations from the route.
7. Parse remaining flags using only the resolved target's `allowed_flags`; reject cross-target flags using the presentation contract's error wording.
8. Resolve any missing setup variables using the presentation contract's per-target setup prompts.
9. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.
10. Use the presentation contract, not this router, for user prompts, dashboards, result summaries, and next-step display.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt`:

- Target-resolution menu, help text, accepted answers, and failure wording.
- Per-target setup prompts for unresolved fields.
- Route manifest display for `list`, `?`, or `--list`.
- The rebuild plan, approval prompt and result templates.
- Troubleshooting and next-step display text.

---

## 6. WORKFLOW SUMMARY

The router resolves a `target` against the `/doctor:skill-advisor` routes in `_routes.yaml`, binds that target's workflow YAML plus its setup variables, allowed flags, and mutation class, then executes it step by step under an always-interactive mode. `tune` re-tunes the scoring lanes with per-skill review, `rebuild` rebuilds `skill-graph.sqlite` through the advisor CLI behind a backup, and the four read-only targets report graph drift, router reach, description budgets and parent-hub structure. `list`, `?`, or `--list` render the route manifest instead of dispatching.
