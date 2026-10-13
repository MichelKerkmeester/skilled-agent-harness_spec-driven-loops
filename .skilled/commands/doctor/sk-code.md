---
description: "Run the sk-code setup battery read-only and name the repair command for each failing leg."
argument-hint: "[setup] [--prompt=<text>]"
allowed-tools: Read, Bash, Grep, Glob
---
<!-- skill_agent: sk-code -->

# /doctor:sk-code Router

This command is a thin router. It binds the sk-code setup battery from `_routes.yaml`, then loads its workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing any dashboard, result summary, or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest; this command owns the route whose `command` is `/doctor:sk-code`.
- `execution_mode` is always `INTERACTIVE`.
- `setup` is the route's only target and its default: `/doctor:sk-code` and `/doctor:sk-code setup` both run it.
- `--prompt=<text>` is the only accepted flag, and the workflow passes it through to the route probe.
- Any other positional or flag fails before YAML load with the presentation contract's argument error.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `setup` | `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` |

1. Read `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and select the `/doctor:sk-code` route.
3. Load `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the per-leg result table, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

The workflow runs the read-only setup battery once (provisioning, parent-skill, root-metadata, guard, sync, drift-guards, derived-freshness and the route probe) and reports each leg as passing, failing with its repair command, or skipped. It writes nothing.
