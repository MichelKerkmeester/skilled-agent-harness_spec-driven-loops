---
description: "Switch shipped git hook gates on or off, and change the commit, PR and branch rules in .sk-git/."
argument-hint: "<hooks|standards> [--dry-run] | list | ?"
allowed-tools: Read, Bash, Grep, Glob, Edit
---
<!-- skill_agent: sk-git -->

# /doctor:git Router

This command is a thin router. It resolves the target and setup values from `_routes.yaml`, then loads the target workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing startup questions, setup dashboards, change plans, approval prompts, result summaries, or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-git-presentation.txt` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest; this command owns the routes whose `command` is `/doctor:git`.
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
| `hooks` | `.skilled/commands/doctor/assets/doctor-git-hooks.yaml` |
| `standards` | `.skilled/commands/doctor/assets/doctor-git-standards.yaml` |

1. Read `.skilled/commands/doctor/assets/doctor-git-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:git` routes.
3. Parse the first positional token from `$ARGUMENTS` as `target`; support `list`, `?`, `--list`, and compatibility alias `--target=<name>`.
4. If target is unresolved, ask the presentation contract's target-resolution prompt and wait.
5. If target is unknown, render the presentation contract's unknown-target failure and stop.
6. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating`, `mcp_tools`, and script invocations from the route.
7. Parse remaining flags using only the resolved target's `allowed_flags`; reject cross-target flags using the presentation contract's error wording.
8. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.
9. Use the presentation contract, not this router, for user prompts, dashboards, result summaries, and next-step display.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/doctor/assets/doctor-git-presentation.txt`:

- Target-resolution menu, help text, accepted answers, and failure wording.
- Route manifest display for `list`, `?`, or `--list`.
- The gate table, the hand-off to `/doctor:env`, the standards status, and every change plan and approval prompt.
- Result templates, troubleshooting, and next-step display text.

---

## 6. WORKFLOW SUMMARY

The router resolves a `target` against the `/doctor:git` routes in `_routes.yaml` and executes its workflow under an always-interactive mode. `hooks` lists every optional gate in the shipped pre-commit, prepare-commit-msg and pre-push hooks with its saved setting, and switches one on or off in local or global git config behind an approval; the whole-hook kill switches stay with `/doctor:env`, and the per-push approvals are never saved. `standards` shows which commit, PR and branch rules the repository enforces and where they come from, copies the shipped sk-git templates into `.sk-git/` once, and then changes, removes or switches off a rule in those copies behind an approval, never in the sk-git skill itself. `list`, `?`, or `--list` render the route manifest instead of dispatching.
