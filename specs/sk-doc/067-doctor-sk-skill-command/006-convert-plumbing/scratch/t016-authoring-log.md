# Authoring log: the command surfaces came from the sk-create-command mode

The router, the presentation and the convert workflow were authored through the `sk-create-command` packet of the
`sk-doc` hub rather than hand-rolled, following the `/create:command` workflow at `.skilled/commands/create/command.md`.

## 1. What was read first

| Resource | Why |
|----------|-----|
| `.skilled/skills/sk-doc/sk-create-command/SKILL.md` | The authoring workflow: Step 11 for a first-class router, Step 13 for validation before delivery |
| `.skilled/skills/sk-doc/sk-create-command/ROUTER.md` | The intent model and the resource loading sequence |
| `.skilled/skills/sk-doc/sk-create-command/references/router-presentation-split.md` | What the router owns versus what the presentation owns, and the behavior-preserving rule |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-router-template.md` | The canonical numbered router skeleton |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-presentation-template.md` | The presentation skeleton |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-template.md` | Command types, section vocabulary and status patterns |
| `.skilled/commands/create/command.md` | The `/create:command` router that owns the workflow |

The existing family shape was kept: `sk-skill.md` gained the convert target in its own tables, the presentation gained
the plan, refusal and result states, and `doctor-sk-skill-convert.yaml` follows the `doctor-ci-scaffold.yaml` phase shape
(`mutation_boundaries`, plan and approval, statuses `OK`, `CANCELLED` and `FAIL`).

## 2. The `/create:command` run

| Step | Applied to this phase |
|------|-----------------------|
| Step 1, decide a command is correct | `/doctor:sk-skill` already exists; this adds a target to it, not a new command |
| Step 2, resolve invocation and path | No new `.md`; the target lands in the existing router and its owned assets |
| Step 3, read existing files first | `sk-skill.md`, `doctor-sk-skill-presentation.txt`, `doctor-sk-skill-check.yaml` and `doctor-sk-skill-convert.cjs` were read in full before any edit |
| Step 4, classify the command type | Router with a subaction route manifest, unchanged |
| Step 5, choose the package shape | Assets stay `doctor-sk-skill-<kind>`: `doctor-sk-skill-convert.yaml` joins `doctor-sk-skill-check.yaml` and `doctor-sk-skill-presentation.txt` |
| Step 6, author frontmatter first | `description` is 70 characters and action-oriented; `argument-hint` is 53 characters and lists both targets; `allowed-tools` stays `Read, Bash` |
| Step 7, mandatory input gates | `convert` needs a skill name and never infers one: the router's MODE ROUTING says so and the presentation carries the ask-once wording |
| Step 8, write the command body | The six canonical `## N.` sections are unchanged and no presentation text sits inline |
| Step 9, argument dispatch | The first positional token is the target; the flags are per-target, and a cross-target flag is refused before YAML load |
| Step 10, mode routing | No `:auto` or `:confirm`; `execution_mode` is always `INTERACTIVE` |
| Step 11, author the router first-class | The canonical vocabulary in the canonical order, from `command-router-template.md` |
| Step 12, destructive-action safety | The mutating target prints the whole plan first, asks once per write, backs up before writing, prints the undo, and ends `STATUS=CANCELLED` on any answer but yes |
| Step 13, validate before delivery | The two validators below |

## 3. Validation

```text
$ /usr/bin/python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/sk-skill.md --type command
✅ VALID: .skilled/commands/doctor/sk-skill.md
Document type: command
Total issues: 0
exit 0

$ /usr/bin/python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .skilled/commands/doctor/sk-skill.md
PASS: authored artifact name is kebab-case: .skilled/commands/doctor/sk-skill.md
exit 0
```

The command contract was checked against its schema with `/usr/bin/python3` and `jsonschema` (no repository script runs
that check today), and reported zero errors:

```text
$ /usr/bin/python3 - <<'PY'
import json
from jsonschema import Draft7Validator
base = '.skilled/skills/sk-doc/sk-create-command/assets/'
contract = json.load(open(base + 'command-contract.json'))
schema = json.load(open(base + 'command-contract.schema.json'))
errs = sorted(Draft7Validator(schema).iter_errors(contract), key=lambda e: list(e.path))
for e in errs:
    print('PATH', list(e.path), '::', e.message)
print('schema errors =', len(errs))
PY
schema errors = 0
exit 0
```

```text
$ node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check
command-router drift check

routers=36 clean=36 path-drift=0 shape-drift=0
exit 0
```
