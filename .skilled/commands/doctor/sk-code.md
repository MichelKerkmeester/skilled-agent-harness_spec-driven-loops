---
description: "Run the sk-code setup battery, or check and create the repository quality config, naming each repair."
argument-hint: "[setup|quality] [--prompt=<text>] [--dry-run] | list | ?"
allowed-tools: Read, Bash, Grep, Glob
---
<!-- skill_agent: sk-code -->

# /doctor:sk-code Router

This command is a thin router. It binds one of two sk-code targets from `_routes.yaml`, the setup battery or the quality config, then loads that target's workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing the menu, a dashboard, a plan, an approval prompt, a result summary or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt` |
| Quality config script | `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest, and this command owns the routes whose `command` is `/doctor:sk-code`.
- `execution_mode` is always `INTERACTIVE`.
- The first positional token of `$ARGUMENTS` is the target. With no token the target is `setup`, the default, which only reads: `/doctor:sk-code` and `/doctor:sk-code setup` both run it. `list`, `?` and `menu` show the presentation contract's startup menu instead of binding a target.
- `--prompt=<text>` belongs to `setup`, and the workflow passes it through to the route probe. `--dry-run` belongs to `quality`, and it shows the init plan and stops before the write.
- `quality` writes `.sk-code/quality.json` only after the workflow prints its plan and the operator approves, and never over an existing file.
- An unknown target, an unknown flag or a flag that belongs to the other target fails before YAML load with the presentation contract's wording.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `setup` | `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` |
| `quality` | `.skilled/commands/doctor/assets/doctor-sk-code-quality.yaml` |

| Argument | Applies to | Effect |
|----------|------------|--------|
| `--prompt=<text>` | `setup` | Probe the compiled router with this prompt instead of the default |
| `--dry-run` | `quality` | Show the init plan and stop before writing |
| `list`, `?`, `menu` | the command | Show the startup menu and the route manifest, and load no workflow |

1. Read `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:sk-code` routes.
3. If the bound target is unknown, render the presentation contract's unknown-target failure and stop.
4. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating` and script invocations from the route, and reject a flag outside its `allowed_flags`.
5. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the startup menu, the per-leg result table, the quality status table, the init plan and prompt, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

1. Bind the target from the first positional token, `setup` when there is none, then resolve its route from `_routes.yaml`.
2. `setup` runs `doctor-sk-code-setup.yaml`: the read-only setup battery once (provisioning, parent-skill, root-metadata, guard, sync, drift-guards, derived-freshness, the route probe and quality), each leg reported as passing, as failing with its repair command or as skipped. It writes nothing in the repository.
3. `quality` runs `doctor-sk-code-quality.yaml`: report which quality config the gate reads and whether each tool it names is on PATH, report whether the repository's trust grant lets the config's commands run, check the config against the schema and, when none exists, create `.sk-code/quality.json` once from the shipped template after an approved plan. It never runs a command the config names and never writes git config, so the trust grant stays the operator's to set.
4. Render the result and next step from the presentation contract.
