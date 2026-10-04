---
description: "Diagnose deep-loop coverage graphs and convergence for research, review and council runs."
argument-hint: "[--scope=research|review|council|both|all]"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write
---
<!-- skill_agent: system-deep-loop -->

# /doctor:deep-loop Router

This command is a thin router. It binds the deep-loop diagnostic from `_routes.yaml`, then loads its workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing startup questions, setup dashboards, approval prompts, diagnostic dashboards, result summaries, or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-deep-loop-presentation.txt` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest; this command owns the route whose `command` is `/doctor:deep-loop`.
- `execution_mode` is always `INTERACTIVE`.
- The command takes no positional target. `--scope` is its only flag; any other argument fails before YAML load with the presentation contract's error.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `deep-loop` | `.skilled/commands/doctor/assets/doctor-deep-loop.yaml` |

1. Read `.skilled/commands/doctor/assets/doctor-deep-loop-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and select the `/doctor:deep-loop` route.
3. Parse `--scope`; when it is absent and the run needs a scope, ask the presentation contract's scope prompt.
4. Load `.skilled/commands/doctor/assets/doctor-deep-loop.yaml` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The scope prompt, argument failure wording, diagnostic dashboard, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-deep-loop-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

The workflow reads the deep-loop coverage graph through `status.cjs`, `query.cjs` and `convergence.cjs` in their read-only forms, classifies empty, stale or orphaned graphs and missing convergence signals, and recommends the repair. It writes only its state log to the active packet's scratch folder.
