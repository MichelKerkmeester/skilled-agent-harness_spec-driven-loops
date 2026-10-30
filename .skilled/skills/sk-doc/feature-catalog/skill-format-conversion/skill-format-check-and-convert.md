---
title: "Skill Format Check And Convert"
description: "Reports how far one skill, or the whole fleet, sits from the Skilled format row by row, then converts one skill after a plan and a yes."
trigger_phrases:
  - "skill format check and convert"
  - "how far is a skill from the skilled format"
  - "convert a skill in place"
  - "/doctor:sk-skill"
version: 1.0.2.0
---

# Skill Format Check And Convert (/doctor:sk-skill)

## 1. OVERVIEW

The `/doctor:sk-skill` command answers two questions about one skill: how far it sits from the current Skilled format, and what it takes to close that gap. The `check` target reads and writes nothing. The `convert` target prints a plan, writes only after an explicit yes, and refuses an input it should not convert.

`check` reads one skill or the whole fleet, and `convert` takes exactly one. The command is a doctor route rather than a create route because it reports before it writes, and because a conversion touches surfaces no create command owns: the advisor graph, the runtime mirrors, the changelog index and the regression corpus.

---

## 2. HOW IT WORKS

`check` binds by default, so a bare `/doctor:sk-skill` and `/doctor:sk-skill check` run the same read-only report. With no skill name or path it prints one row per direct child of `.skilled/skills`, each carrying the format verdict, the root metadata verdict, the codes behind them and one overall status. With a skill name or a path it prints rows `C1` to `C13`: location, input kind, format, root metadata, intent signals, derived freshness, router equivalence, advisor home, runtime mirrors, changelog, description budget, collisions and regression coverage. A row reports `PASS`, `FINDING`, `UNKNOWN`, `INFO` or `N/A`, and only a `FINDING` fails the run. A skill inside another repository's `.skilled/skills` is judged against that repository rather than the checkout that ran the command, so a skill freshly converted in a second Skilled repository is read against its own changelog index and mirrors, and each of its rows names the repository it read. `--json` prints the same report as one document and nothing else. `--into-hub <hub>` replaces the format rows with the eleven surfaces a skill or mode must land on under that hub, each row carrying the command it ran or the file it read, and it registers nothing and edits no hub surface. An `UNKNOWN` row means the question could not be answered, never that it passed, and a run that cannot start exits 2 with the provision command on its own line.

`convert` reduces the distance the check reported. It takes an older Skilled skill, whose machine router still sits in `SKILL.md`, or a plain agent skill, which the check recognises by having no four-part version, no root metadata and no `allowed-tools` field. Either input becomes a class S standalone root.

The plan comes first and names every write. It lists each file the run would create, each file it would overwrite, the gitignored backup directory at the skills root that receives the bytes it replaces, and the integration rows it would run. `--apply` prints the same plan and then writes, and `--dry-run` at the route ends after the plan instead.

Three follow-ups are questions rather than refusals, and each is asked with its own yes. A plain skill needs at least eight approved intent phrases before any plan prints, a description over 130 characters needs a trim, and a skill with no `allowed-tools` field needs a list. The approved value goes back to the plan as `--approved-phrase`, `--description-trim` or `--allowed-tools`, so the field appears as its own plan line before anything is written. The plan proposes `[Read, Grep, Glob]`, plus `Bash` when the skill folder holds a `scripts/` folder, and the question offers that list and no other. A field declared twice is a refusal instead, with `ALLOWED_TOOLS_DUPLICATE` naming the count.

For an older Skilled skill the write moves the trailing `MACHINE ROUTER` section, and any machine block left inside Smart Routing, verbatim into a sibling `ROUTER.md` under `## 3. MACHINE ROUTER`, and adds one link line to Smart Routing. Before editing it copies the pre-edit bytes to the backup, creates `ROUTER.md` with an exclusive create so an existing file is never replaced, and compares the parsed router before and after. A different intent set, resource map or default rolls the step back and restores the backup.

For a plain skill the run stages the source under its own frontmatter name, renders `ROUTER.md` from the router template with one intent and a resource map built from the `references/` links the body already carries, and lets the workflow reshape `SKILL.md` into WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES and REFERENCES. A preservation check then proves that every original non-blank, non-heading body line appears in the new `SKILL.md`, in `ROUTER.md` or in a reference file, and a lost line stops the run. The agent output, the preservation snapshot and the staging copy share one scratch root under `.skilled/skills/.state/`, in `doctor-sk-skill/<name>/scratch/`, which the run deletes when a question is declined and again once it has reported. The reference and asset markdown gain the five-field frontmatter plus a version, and a non-kebab path is renamed with its links rewritten. The root metadata comes from the scaffolder and is copied only where it is absent, so an authored file is never overwritten, and the intent signals are the phrases the operator approved rather than the slug defaults. Fewer than eight approved phrases stops the plan.

The last steps run the root metadata generator, regenerate the derived blocks, then run the strict format gate and the completion gate. Integration runs only after both gates pass: the advisor scan, the compiled skill graph, a warm routing probe on three approved phrases plus the description budget row, proposed regression rows, the Hermes skill mirror and the changelog file and link. A runtime directory that is absent reports `n/a` and is never created.

A conversion refuses a hub candidate rather than guessing. A `mode-registry.json` or `hub-router.json` declaration, a nested packet `SKILL.md`, a `local-` prefixed name, an `agent-` prefixed name, a name that collides with another root and a description past 130 characters each stop the run with its own reason and no write, and the hub refusal prints the `/create:skill-parent` line because hub structure belongs to that command. A skill whose `ROUTER.md` already declares the router skips the move entirely and receives the frontmatter normalization alone, and a run on an already converted skill reports that no conversion is needed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/doctor/sk-skill.md` | Command | Router, target table and argument handling for `check` and `convert` |
| `.skilled/commands/doctor/_routes.yaml` | Manifest | The `check` route as read-only and the `convert` route as mutating |
| `.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml` | Workflow | Runs the check engine and renders the fleet table or the deep report |
| `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` | Contract | Result tables, the JSON passthrough note, failures and next-step text |
| `.skilled/commands/doctor/scripts/sk-skill-check.cjs` | Script | Rows `C1` to `C13`, the fleet form, the JSON report and the exit status |
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Script | Plan, preserve, apply gate, backups, exclusive create, the router proof and the integration rows |
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Shared | Locate, classify, frontmatter read, collisions, the hub gap probes and spawn wrappers |
| `.skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` | Shared | Frontmatter normalization, the router move and the link line |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | Unit | Row coverage, the fleet form, the hub gap table, the JSON shape and the exit statuses |
| `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | Unit | Golden move, idempotence, refusals, no-replace, rollback and the plain-skill cases |
| `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | Unit | The route, the workflow statuses and the refusal strings |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/check-a-skill-against-the-skilled-format.md` | Manual playbook | Reads one skill and the fleet, and proves the report wrote nothing |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/convert-an-older-skilled-skill.md` | Manual playbook | Runs the plan, the apply gate, the backup, the router proof and the no-op rerun |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/convert-a-plain-skill.md` | Manual playbook | Runs the plain path through the preservation check and both gates |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/refuse-a-hub-candidate.md` | Manual playbook | Runs the refusals for a declared hub, a nested packet tree, a reserved prefix, a persona prefix and a name collision |

---

## 4. SOURCE METADATA

- Group: Skill Format Conversion
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `skill-format-conversion/skill-format-check-and-convert.md`

Related references:
- [packet-authored-registry-routing.md](../packet-authored-registry-routing/packet-authored-registry-routing.md) - how the hub routes an authoring request to the packet that owns the format these rows read
- [upgrading-a-skill-to-v4.md](../../sk-create-skill/references/skill/upgrading-a-skill-to-v4.md) - the count-distinct-jobs rule, and the parent-hub path a refused hub candidate follows
