---
description: "List every doctor target and run the read-only setup checks, naming the repair command for each failing leg."
argument-hint: "(no arguments)"
allowed-tools: Read, Bash, Grep, Glob
---
<!-- skill_agent: system-spec-kit -->

# /doctor:setup Router

This command is a thin, read-only router. It lists every doctor command and target with what each checks, runs the existing read-only checks once, and prints the runnable repair command for each failing leg. It writes nothing in the repository.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing any dashboard, result summary, or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Workflow | `.skilled/commands/doctor/assets/doctor-setup.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest. This command owns the route whose `command` is `/doctor:setup`.
- `execution_mode` is always `INTERACTIVE`.
- The command takes no positional target and no flag, so `/doctor:setup` alone runs it.
- Any positional or flag fails before YAML load with the presentation contract's argument error.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior. The presentation Markdown owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `setup` | `.skilled/commands/doctor/assets/doctor-setup.yaml` |

1. Read `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and select the `/doctor:setup` route.
3. Load `.skilled/commands/doctor/assets/doctor-setup.yaml` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the doctor target list, the per-leg result table, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

The workflow prints the doctor target list, then runs five read-only legs once (the sk-code setup battery, the sk-git setup battery, the trigger index freshness check, the runtime mirror check, and the advisor status probe with `--warm-only`) and reports each leg as passing, skipped, degraded or failing, naming the runnable doctor command that repairs a failing leg. The sk-git leg passes `--tool=<name>` for the AI tool running the command, and its exit 3 (an unknown check or a gate saved off) is degraded, not failing. After the legs it shows the last session hop from the session-relaunch hop history, as information that never changes the status. It writes nothing in the repository and never starts the advisor daemon. The only write outside it is the advisor CLI creating its socket directory, `/tmp/system-skill-advisor` by default, when that directory is absent. The advisor leg reports PASS when exit 0 has `data.freshness` set to `live`, DEGRADED when exit 0 has any other freshness value and names `/doctor:skill-advisor rebuild`, FAIL when exit 75 includes `staleDistWarning` in stderr JSON and names `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`, SKIP when exit 75 lacks that field because the daemon is stopped, and FAIL for any other exit with `/doctor:skill-advisor rebuild`.
