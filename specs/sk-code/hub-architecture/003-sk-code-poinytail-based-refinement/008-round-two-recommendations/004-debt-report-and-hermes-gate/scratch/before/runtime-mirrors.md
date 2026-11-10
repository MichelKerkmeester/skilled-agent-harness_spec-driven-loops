---
description: "Check that the agent, command, prompt and hook mirrors in each runtime directory match .skilled."
argument-hint: "(no arguments)"
allowed-tools: Read, Bash, Grep, Glob
---
<!-- skill_agent: system-spec-kit -->

# /doctor:runtime-mirrors Router

This command is a thin router. It binds the runtime-mirror diagnostic from `_routes.yaml`, then loads its workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing any dashboard, result summary, or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-runtime-mirrors-presentation.txt` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest; this command owns the route whose `command` is `/doctor:runtime-mirrors`.
- `execution_mode` is always `INTERACTIVE`.
- The command takes no arguments; any argument fails before YAML load with the presentation contract's error.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `runtime-mirrors` | `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` |

1. Read `.skilled/commands/doctor/assets/doctor-runtime-mirrors-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and select the `/doctor:runtime-mirrors` route.
3. Load `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the per-checker result table, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-runtime-mirrors-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

The workflow runs every mirror checker in its check-only form (runtime command and agent links, the Codex, Pi and Hermes prompt and agent mirrors, the agent roster, the command catalog, and the Codex hook install) and reports each surface as in sync, drifting with its repair command, or unable to run. It writes nothing.
