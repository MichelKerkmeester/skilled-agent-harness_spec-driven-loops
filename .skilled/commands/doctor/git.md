---
description: "Switch shipped git hook gates on or off, and change the commit, PR and branch rules in .sk-git/."
argument-hint: "<hooks|standards> [--dry-run] | list | ?"
allowed-tools: Read, Bash, Edit
---
<!-- skill_agent: sk-git -->

# /doctor:git Router

Thin router for the git hook gate settings and the repository's sk-git rules. It resolves the target and setup values from `_routes.yaml`, loads the presentation contract, then executes the target's workflow YAML.

### MANDATORY INPUT GATE

**STATUS: BLOCKED** until `target` is bound.

1. Parse the first positional token of `$ARGUMENTS` as `target`, before any flag. `list`, `?` and `--list` render the route manifest instead of binding a target.
2. Treat an absent or whitespace-only target as missing. Do not infer it from conversation history, open files, earlier runs or repository state.
3. When it is missing, show the presentation contract's startup menu, stop, and wait. Use only `$ARGUMENTS` or that explicit reply.

If this gate was skipped, stop, say so, return to it, and bind the target before loading any workflow.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing the startup menu, a dashboard, a change plan, an approval prompt, a result summary, or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-git-presentation.txt` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest; this command owns the routes whose `command` is `/doctor:git`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- Unknown or cross-target flags fail before YAML load.
- The YAML start condition is: target bound, workflow asset exists, presentation asset loaded, and every target setup variable resolved.
- If any referenced asset is missing, stop and report the missing path.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `hooks` | `.skilled/commands/doctor/assets/doctor-git-hooks.yaml` |
| `standards` | `.skilled/commands/doctor/assets/doctor-git-standards.yaml` |

| Argument | Applies to | Effect |
|----------|------------|--------|
| `--dry-run` | `hooks`, `standards` | Show every plan and stop before any write |
| `list`, `?`, `--list` | the command | Render the route manifest; load no workflow |
| `--target=<name>` | the command | Compatibility alias for the positional target |

1. Read `.skilled/commands/doctor/assets/doctor-git-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:git` routes.
3. If the bound target is unknown, render the presentation contract's unknown-target failure and stop.
4. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating`, `mcp_tools`, and script invocations from the route.
5. Parse the remaining flags against that route's `allowed_flags`; reject a cross-target flag with the presentation contract's wording.
6. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/doctor/assets/doctor-git-presentation.txt`:

- The startup menu, help text, accepted answers, and failure wording.
- The route manifest display for `list`, `?`, or `--list`.
- The gate table, the hand-off to `/doctor:env`, the standards status, and every change plan and approval prompt.
- Success, cancelled and failure result templates, and next-step suggestions.

---

## 6. WORKFLOW SUMMARY

1. Bind the target through the input gate, then resolve its route from `_routes.yaml`.
2. `hooks` runs `doctor-git-hooks.yaml`: list the gates and their saved settings, then switch one in local or global git config per approved change.
3. `standards` runs `doctor-git-standards.yaml`: show the active rules, copy the shipped sk-git templates into `.sk-git/` once, then change those copies per approved change.
4. Render the result and next step from the presentation contract.
