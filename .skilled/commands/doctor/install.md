---
description: "Get the ordered steps that put Skilled into your own project repo, ready to run."
argument-hint: "[--root <dir>] [--runtimes <list>] [--json] | list | ?"
allowed-tools: Read, Bash
---
<!-- skill_agent: system-skilled-doctor -->

# /doctor:install Router

This command is a thin router. It binds the read-only `guide` target from `_routes.yaml`, then loads that target's workflow YAML and the presentation contract. It writes nothing. Every step that writes is printed for the operator to run.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing the build check, the install prompt, the symlink check, the ordered steps, the caveat line or next-step text.

This command never runs a target that writes, and never adds an argument to a printed command beyond the values the operator gave: `--root`, `--runtimes`, the link shape and the instruction choice.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-install-presentation.txt` |
| Symlink engine | `.skilled/commands/doctor/scripts/symlink-engine.cjs` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest, and this command owns the route whose `command` is `/doctor:install`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- The route's target is `guide` and it is never typed: `/doctor:install` alone binds it. A second positional token is an argument failure.
- `--root <dir>` is the target repo's absolute path. `--runtimes <list>` is a comma list drawn from `claude`, `opencode`, `codex`, `cursor`, `devin`, `pi` and `hermes`; without it the engine keeps the runtimes its own detection finds in the root. `--json` prints one JSON object and nothing else.
- `list`, `?` and `menu` as the whole argument print the ordered steps from the presentation and stop, so no workflow loads and nothing is inspected.
- The link shape and the instruction choice have no flag, so both are always answered at the prompt. A `--root` or `--runtimes` already passed drops its own question and nothing else.
- The YAML owns workflow behavior; the presentation text owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `guide` | `.skilled/commands/doctor/assets/doctor-install.yaml` |

| Argument | Applies to | Effect |
|----------|------------|--------|
| `--root <dir>` | `guide` | The project repo to inspect and to print the steps for |
| `--runtimes <list>` | `guide` | Comma list of runtime folders to link; absent, the ones already in the root |
| `--json` | `guide` | Print one JSON object and nothing else |
| `list`, `?`, `menu` | the command | Print the ordered steps, and load no workflow |

1. Read `.skilled/commands/doctor/assets/doctor-install-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:install` route, plus the route that owns each command the checklist prints.
3. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating` and script invocations from the route, and reject a flag outside its `allowed_flags`. The class column of a printed step is the owning route's `mutating` value, verbatim.
4. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the build check, the install prompt, the accepted answers, the symlink check framing and status legend, the ordered steps, the caveat line, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-install-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

1. Check the two builds the runtimes load in this checkout, and carry the README's build commands into step 0 when one is missing.
2. Bind `--root` and `--runtimes`, then ask for every answer still missing in one prompt: the target repo, the runtimes, the link shape and the instruction file.
3. Run `symlink-engine.cjs check` once, in place and read-only, render its entry lines, then print the ordered steps with each command's class and one line of why.
4. Close on the fixed caveat line and the result summary. Every writing step is printed for the operator to run, and this command stops there.
