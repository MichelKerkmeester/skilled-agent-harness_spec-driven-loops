---
description: "Check, embed or restore the shipped AGENTS.md sections, plan first."
argument-hint: "[check|embed|restore] [--json] [--root <dir>] [--dry-run] [--plan-digest <digest>] [--run <dir>] [--yes]"
allowed-tools: Read, Bash
---
<!-- skill_agent: sk-doc -->

# /doctor:agents-md Router

This command is a thin router. It binds the read-only `check` target or the writing `embed` and `restore` targets from `_routes.yaml`, then loads that target's workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command. Do not compose an `AGENTS.md` byte, hash a plan or copy a file back: the two engines own every read, every composition and every write.

Load the presentation contract before showing the menu, a plan, a digest, a result table, a failure summary or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` |
| Check engine | `.skilled/commands/doctor/scripts/agents-md-check.cjs` |
| Embed and restore engine | `.skilled/commands/doctor/scripts/agents-md-embed.cjs` |
| Shipped template manifest | `.skilled/commands/doctor/assets/agents-md-manifest.json` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest, and this command owns the routes whose `command` is `/doctor:agents-md`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- The first positional token of `$ARGUMENTS` is the target. With no token the target is `check`, the route marked `default_target` because it only reads, so `/doctor:agents-md` and `/doctor:agents-md check` both run it. A bare `/doctor:agents-md` never reaches `embed` or `restore`, which write. `list`, `?` and `menu` show the presentation contract's startup menu instead of binding a target.
- `--json` and `--root <dir>` belong to `check`. `--dry-run`, `--root <dir>`, `--plan-digest <digest>`, `--keep-claude-md`, `--remove-claude-md` and `--create-router` belong to `embed`. `--run <dir>`, `--yes` and `--dry-run` belong to `restore`.
- `--plan-digest` takes the digest the same run's plan printed, and it is the only way `embed` writes: the workflow never runs `apply` without the digest its own plan printed, and never runs a writing target without its yes.
- An unknown target, an unknown flag, a flag from another target, a value flag without its value, or a second positional fails before YAML load with the presentation contract's wording. The second positional's suggestion is the bound target's own invocation, not one target's invocation for all three.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation text owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `check` | `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml` |
| `embed` | `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml` |
| `restore` | `.skilled/commands/doctor/assets/doctor-agents-md-restore.yaml` |

| Argument | Applies to | Effect |
|----------|------------|--------|
| `--json` | `check` | Print the engine's JSON report and nothing else |
| `--root <dir>` | `check`, `embed` | Classify or compose that repository instead of the one this command runs in |
| `--dry-run` | `embed`, `restore` | Print the plan and the digest, ask nothing and write nothing |
| `--plan-digest <digest>` | `embed` | The digest the plan printed; the apply refuses any bytes it does not match |
| `--keep-claude-md` | `embed` | Fold a divergent `CLAUDE.md` into the block and keep the file |
| `--remove-claude-md` | `embed` | Fold it and remove it, which is the default |
| `--create-router` | `embed` | Create `REPO RULES.md` from the shipped rows when it is missing |
| `--run <dir>` | `restore` | The backup directory one apply printed, whose `manifest.json` records what to put back |
| `--yes` | `restore` | Take the confirmation as given, which the workflow passes only after its own yes |
| `list`, `?`, `menu` | the command | Show the startup menu and the route manifest, and load no workflow |

1. Read `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:agents-md` routes.
3. If the bound target is unknown, render the presentation contract's unknown-target failure and stop.
4. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating` and script invocations from the route, and reject a flag outside its `allowed_flags`, including a flag the other targets own.
5. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the startup menu, the check table, the embed and restore plans, the digest line, the two questions, the refusals, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

1. Bind the target from the first positional token, `check` when there is none, then resolve its route from `_routes.yaml`.
2. `check` runs `agents-md-check.cjs` once, adding `--root <dir>` and `--json` only when the operator passed them. It reports twelve rows, A1 to A12, and writes nothing.
3. `embed` runs `agents-md-embed.cjs plan` once with the operator's `--root`, `--keep-claude-md` or `--create-router` when they gave one. The plan composes in memory, prints every target with its action, the diff, the new block, the budget, the survival ledger and the backup folder, and writes nothing. A repository already in its target state prints `NOTHING TO DO`, so the run ends as unchanged and writes nothing.
4. The plan prints the plan digest, and the run shows that line in full immediately above the question. The digest the operator reads is the digest the apply repeats, so nothing else may stand in for it. With `--dry-run` the run ends here: the plan and its digest are shown, the dry-run line is printed and nothing is asked and nothing is written.
5. `embed` asks the embed question once, against the plan the operator has just read, and names the plan digest in it. Any answer other than yes is a no: the run prints the cancelled result naming the declined embed, states `Changed: none`, and ends the run as cancelled, so nothing is written.
6. `embed` runs `agents-md-embed.cjs apply --plan-digest <digest>` with the same flags, only after the embed yes. The engine recomposes, refuses a digest that no longer matches and writes nothing in that case, backs up every path it will touch, writes only inside its own allowlist, then proves the composition against the bytes on disk. A dropped line restores from the backup automatically.
7. `embed` re-reads the written repository through `agents-md-check.cjs` and prints that verdict beside the engine's own `check-after` line, and prints the engine's undo block exactly as the engine printed it. The operator runs the undo, never this route.
8. `restore` shows the restore plan the engine's own `restore --run=<dir> --dry-run` printed, asks once, and only then runs `restore --run=<dir> --yes`. A no prints the cancelled result naming the declined restore and writes nothing.
9. Render the result through the presentation contract, name the next command for the operator, and end with the result template's status line. The route stages nothing and commits nothing, so whoever ran it commits the change themselves.
