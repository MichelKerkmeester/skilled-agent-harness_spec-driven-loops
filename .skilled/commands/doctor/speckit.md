---
description: "Diagnose spec-kit retrieval: the generated trigger index, its lookup and the ripgrep recipes."
argument-hint: "[speckit-retrieval] | list | ?"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write
---
<!-- skill_agent: system-spec-kit -->

# /doctor:speckit Router

This command is a thin router. It binds the spec-kit retrieval diagnostic from `_routes.yaml`, then loads its workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing startup questions, setup dashboards, approval prompts, diagnostic dashboards, result summaries, or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest; this command owns the routes whose `command` is `/doctor:speckit`.
- `execution_mode` is always `INTERACTIVE`.
- A bare invocation, or the explicit `speckit-retrieval` positional, binds the retrieval diagnostic.
- `list`, `?`, or `--list` render the route manifest display instead of dispatching.
- A positional that names a target another doctor command owns renders the presentation contract's moved-target notice and stops. The other doctor commands have their own routers: `/doctor:skill-advisor`, `/doctor:deep-loop`, `/doctor:runtime-mirrors`, `/doctor:update`, `/doctor:env` and `/doctor:mcp`.
- Any other positional or flag fails before YAML load.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

---

## 4. EXECUTION TARGETS

These existing YAML assets are referenced only. The router must not modify them.

| Target | Workflow |
|--------|----------|
| `speckit-retrieval` | `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` |

1. Read `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and select the `/doctor:speckit` route.
3. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating`, `mcp_tools`, and script invocations from that route.
4. Resolve any missing setup variables using the presentation contract's setup prompts.
5. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.
6. Use the presentation contract, not this router, for user prompts, dashboards, result summaries, and next-step display.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`:

- The route manifest display for `list`, `?`, or `--list`.
- The moved-target notice and unknown-argument failure wording.
- Setup prompts for unresolved fields.
- Diagnostic dashboard and result-summary templates.
- Troubleshooting and next-step display text.

---

## 6. WORKFLOW SUMMARY

The router binds the `/doctor:speckit` route from `_routes.yaml`, which runs `doctor-speckit-retrieval.yaml` under an always-interactive mode: it checks that the generated trigger index is fresh, that its lookup runs, and that the ripgrep retrieval recipes return results, then reports staleness and the regeneration command. All visible wording is owned by the presentation contract.
