---
description: "Check, link or unlink the Skilled checkout in a project repo, plan first."
argument-hint: "[check|link|unlink] [--root <dir>] [--runtimes <list>] [--mode <shape>] [--plan-digest <digest>] [--run <dir>] [--yes] [flags]"
allowed-tools: Read, Bash
---
<!-- skill_agent: system-spec-kit -->

# /doctor:symlink Router

This command is a thin router. It binds the read-only `check` target or the writing `link` and `unlink` targets from `_routes.yaml`, then loads that target's workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command. Do not compose a link, remove one or hash a plan: the engine owns every read, every action and every write.

Load the presentation contract before showing the menu, a report, a plan, a digest, the safety rules, a result table, a failure summary or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-symlink-presentation.txt` |
| Symlink engine | `.skilled/commands/doctor/scripts/symlink-engine.cjs` |
| Entry manifest | `.skilled/commands/doctor/assets/symlink-manifest.json` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest, and this command owns the routes whose `command` is `/doctor:symlink`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- The first positional token of `$ARGUMENTS` is the target. With no token the target is `check`, the route marked `default_target` because it only reads, so `/doctor:symlink` and `/doctor:symlink check` both run it. A bare `/doctor:symlink` never reaches `link` or `unlink`, which write. `list`, `?` and `menu` show the presentation contract's startup menu instead of binding a target.
- `--json`, `--root <dir>`, `--runtimes <list>`, `--include <list>` and `--link-instructions` belong to `check`. `--root <dir>`, `--runtimes <list>`, `--mode`, `--include <list>`, `--link-instructions`, `--ignore`, `--dry-run` and `--plan-digest <digest>` belong to `link`. `--run <dir>`, `--yes` and `--dry-run` belong to `unlink`.
- `--plan-digest` takes the digest the same run's plan printed, and it is the only way `link` writes: the workflow never runs `apply` without the digest its own plan printed, and never runs a writing target without its yes.
- An unknown target, an unknown flag, a flag from another target, a value flag without its value, or a second positional fails before YAML load with the presentation contract's wording. The second positional's suggestion is the bound target's own invocation, not one target's invocation for all three.
- A `check` or `link` run with no `--root` asks for the repository path once, because the checkout cannot be linked into itself and the engine refuses it.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior. The presentation text owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `check` | `.skilled/commands/doctor/assets/doctor-symlink-check.yaml` |
| `link` | `.skilled/commands/doctor/assets/doctor-symlink-link.yaml` |
| `unlink` | `.skilled/commands/doctor/assets/doctor-symlink-unlink.yaml` |

| Argument | Applies to | Effect |
|----------|------------|--------|
| `--json` | `check` | Print the engine's JSON report and nothing else |
| `--root <dir>` | `check`, `link` | Work on that repository. Without it the run asks for the path rather than guess one |
| `--runtimes <list>` | `check`, `link` | Link only these runtimes, from `claude,opencode,codex,cursor,devin,pi,hermes`. `.skilled` is always included |
| `--include <list>` | `check`, `link` | Opt-in extras: `repo-rules`, `github`, `utcp`, `env` |
| `--link-instructions` | `check`, `link` | Link `AGENTS.md`, `CLAUDE.md` and `REPO RULES.md` too, instead of leaving them to `/doctor:agents-md` |
| `--mode <shape>` | `link` | `auto` decides per entry, `whole` links each name as one folder, `merge` builds the real folder and links each entry inside it |
| `--ignore <where>` | `link` | Where the ignore lines go: `exclude` for `<git-dir>/info/exclude`, `gitignore`, or `none`. Default `exclude` |
| `--dry-run` | `link`, `unlink` | Print the plan, and the digest on `link`, then ask nothing and write nothing |
| `--plan-digest <digest>` | `link` | The digest the plan printed, which the apply repeats before it writes anything |
| `--run <dir>` | `unlink` | The run directory one apply printed, whose `manifest.json` records what to remove |
| `--yes` | `unlink` | Take the confirmation as given, which the workflow passes only after its own yes |
| `list`, `?`, `menu` | the command | Show the startup menu and the route manifest, and load no workflow |

1. Read `.skilled/commands/doctor/assets/doctor-symlink-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:symlink` routes.
3. If the bound target is unknown, render the presentation contract's unknown-target failure and stop.
4. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating` and script invocations from the route, and reject a flag outside its `allowed_flags`, including a flag the other targets own.
5. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the startup menu, the safety rules, the check report, the link plan, the unlink plan, the digest line, the two questions, the refusals, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-symlink-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

1. Bind the target from the first positional token, `check` when there is none, then resolve its route from `_routes.yaml`.
2. When the bound target is `check` or `link` and the operator gave no `--root`, ask for the repository path once and pass the answer. The engine refuses a root that is the checkout, sits inside it, or holds it, so the command never guesses one.
3. `check` runs `symlink-engine.cjs check` once, adding `--root <dir>`, `--runtimes <list>`, `--include <list>`, `--link-instructions` and `--json` only when the operator passed them. It reports one line per entry with that entry's status and detail, then the repository-level warnings, and writes nothing. With `--json` it prints the engine's JSON and nothing else.
4. `link` runs `symlink-engine.cjs plan` once with the operator's `--root`, `--runtimes`, `--mode`, `--include`, `--link-instructions` and `--ignore` when they gave one. The plan resolves the actions, the ignore lines and the refusals in memory and prints them, and writes nothing. A repository already linked as asked prints `NOTHING TO DO`, so the run ends as unchanged and writes nothing.
5. The plan prints the plan digest, and the run shows that line in full immediately above the question. The digest the operator reads is the digest the apply repeats, so nothing else may stand in for it. With `--dry-run` the run ends here: the plan and its digest are shown, the dry-run line is printed, and nothing is asked and nothing is written.
6. `link` asks the link question once, against the plan the operator has just read, and states the safety rules before it. Any answer other than yes is a no: the run prints the cancelled result naming the declined link, states `Changed: none`, and ends the run as cancelled, so nothing is written.
7. `link` runs `symlink-engine.cjs apply --plan-digest <digest>` with the same flags, only after the link yes. The engine recomposes, refuses a digest the tree no longer matches and writes nothing in that case, then writes the run record to the checkout's `.skilled/output/doctor-symlink/<first 16 hex of the digest>/manifest.json` before the first action and after each one. When an earlier run of the same digest already holds that folder, as after an unlink and a relink, the record goes to the next free `<prefix>-2`, `<prefix>-3` folder instead, so every earlier record stays untouched. No real file and no real folder is overwritten, and the only removals are broken links whose text points into the Skilled checkout.
8. `link` prints the engine's own post-apply check summary and its undo line exactly as the engine printed it. The undo is that printed unlink command run with `--dry-run` first. The operator runs the undo, never this route.
9. `unlink` shows the plan the record describes, the engine's own `unlink --run <dir> --dry-run` output, asks once, and only then runs `unlink --run <dir> --yes`. A no prints the cancelled result naming the declined unlink and writes nothing. Unlink keeps the run directory, and a recorded path whose state no longer matches the record is skipped as `changed since apply`.
10. Render the result through the presentation contract, name the next command for the operator, and end with the result template's status line. The route stages nothing and commits nothing, so whoever ran it commits the change themselves.
