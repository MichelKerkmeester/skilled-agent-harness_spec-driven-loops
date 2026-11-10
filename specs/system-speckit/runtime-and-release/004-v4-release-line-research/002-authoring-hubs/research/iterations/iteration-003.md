# Iteration 003 — Create-Command Contracts, Design Catalog Counts, and the Check-Mode Validators

## Focus

Key questions 5 and 6, plus a final check-mode run for question 3:

- Q5: Do the `/create:*` commands match the sk-doc mode contracts they route to, including flags, defaults and outputs?
- Q6: Do the `/design:*` commands and sk-design modes match their stated counts (29 chart forms, 27 diagram types) and catalog files?
- Q3 (already answered in iteration 2): re-run the sk-doc skill validator in check mode on the sk-code and sk-design roots and report any failing check with its output.

## Actions Taken

1. Enumerated the 13 command files under `.skilled/commands/create/` and extracted each `argument-hint`, then checked every referenced asset (`create-*-auto.yaml`, `create-*-confirm.yaml`, `create-*-presentation.txt`) on disk. All 39 assets exist.
2. Read `mode-registry.json` and compared its 13 `command` values with the 13 command files; the sets match exactly, and the two command-less modes (`sk-create-frontmatter`, `sk-create-quality-control`) are declared with `command: null`.
3. Read each packet `SKILL.md` and the bound presentation contract for the flags that the hints advertise, then grepped the assets for a consumer of each advertised flag.
4. Counted the sk-design chart catalog rows between its sentinels, the chart template files, the diagram catalog rows, the canonical diagram files and the full 38-form diagram library; read the `/design:chart` and `/design:diagram` command claims and the packet `SKILL.md` count statements.
5. Ran both corpus checks in check mode, and ran `validate_skill_package.py --strict` (text and `--json`) on `.skilled/skills/sk-code` and `.skilled/skills/sk-design`.
6. Checked the v4 baseline (`v4.0.0.0`) and every sampled tag through `v4.0.2.0` for the stale index and the two dead flags to date the defects.

## Findings

### F1 — The create-command index advertises 21 chart forms while the catalog ships 29 (drift, P2)

`.skilled/commands/create/README.txt:50` describes `/design:chart` as "a catalog of 21 forms". The chart catalog holds 29 data rows between its sentinels, 29 template files render them, `/design:chart` says "a catalog of 29 forms", and the packet `SKILL.md` says "twenty-nine chart forms". The stale count was already present at tag `v4.0.0.0` (2026-09-21), when the catalog already held 29 rows, and it is unchanged at `v4.0.2.0`; this is a baseline defect carried through the whole v4 line, not a regression from a later release.

- Type: drift
- Severity: P2
- Release: v4.0.0.0 baseline (present at the tag; still live at v4.0.2.0)
- Confidence: high
- Evidence:
  - [SOURCE: .skilled/commands/create/README.txt:50] "Author a standalone HTML chart from a catalog of 21 forms, one per reader question"
  - [SOURCE: .skilled/skills/sk-design/sk-design-chart/SKILL.md:114] "The corpus contains twenty-nine chart forms across six question families"
  - [SOURCE: .skilled/skills/sk-design/sk-design-chart/references/catalog.md:48] the `CHART_CATALOG:BEGIN` sentinel; the table runs to line 82 with 29 data rows
- Verify:
  ```bash
  awk '/CHART_CATALOG:BEGIN/{f=1;next}/CHART_CATALOG:END/{f=0}f&&/^\|/' \
    .skilled/skills/sk-design/sk-design-chart/references/catalog.md | wc -l   # 31 = header + separator + 29 rows
  ls .skilled/skills/sk-design/sk-design-chart/assets/templates/*.html | wc -l  # 29
  grep -n 'catalog of .* forms' .skilled/commands/create/README.txt              # 21
  ```

### F2 — The create-command index puts the two design commands inside the create tree (drift, P2)

Section 4 of `.skilled/commands/create/README.txt` draws `create/` as containing `chart.md` and `diagram.md`. Neither file exists there; both live under `.skilled/commands/design/`. The same index says "The table in section 3 lists every command in this folder", yet that table also carries the two `/design:*` rows, so the document mixes two command folders and then states a single-folder invariant it breaks. The same tree shape is present at `v4.0.0.0` and unchanged at `v4.0.2.0`.

- Type: drift
- Severity: P2
- Release: v4.0.0.0 baseline
- Confidence: high
- Evidence:
  - [SOURCE: .skilled/commands/create/README.txt:83] "├── chart.md                      # /design:chart command"
  - [SOURCE: .skilled/commands/create/README.txt:85] "├── diagram.md                    # /design:diagram command"
  - [SOURCE: .skilled/commands/create/README.txt:26] "The table in section 3 lists every command in this folder."
- Verify:
  ```bash
  test -f .skilled/commands/create/chart.md && echo present || echo missing    # missing
  test -f .skilled/commands/design/chart.md && echo present || echo present    # present
  ls .skilled/commands/design/
  ```

### F3 — `/create:readme` advertises `--output <path>` but no bound asset reads it (drift, P2)

The command hint offers `[--output <path>]`. The presentation contract's field table resolves `target_path`, `readme_type`, `existing_file`, `existing_file_action` and `execution_mode`; it has no output field, and no `--output` or `output_path` token appears anywhere in the three bound assets. A user who supplies the advertised flag gets the default behavior with no error, because the setup contract never looks for it.

- Type: drift
- Severity: P2
- Release: v4.0.0.0 baseline (the flag is in the `v4.0.0.0` command file)
- Confidence: high
- Evidence:
  - [SOURCE: .skilled/commands/create/readme.md:3] `argument-hint: "<target> [--type <project|component|feature|skill>] [--output <path>] [:auto|:confirm]"`
  - [SOURCE: .skilled/commands/create/assets/create-readme-presentation.txt:66] the resolution table ends at `execution_mode`; no output row follows
- Verify:
  ```bash
  rg -n -- '--output|output_path' .skilled/commands/create/assets/create-readme-* || echo NO_CONSUMER
  ```

### F4 — `/create:benchmark` advertises `--benchmark-id <id>` but no bound asset reads it (drift, P2)

The command hint and the index both offer `[--benchmark-id <id>]`. The presentation contract's field table lists `benchmark_family`, `operation`, `benchmark_date` (MCP only), `skill_path` and `execution_mode`; there is no `benchmark_id` field, and the token appears nowhere in the two workflow YAMLs or the packet. The flag is a no-op that the setup path silently ignores.

- Type: drift
- Severity: P2
- Release: v4.0.0.0 baseline
- Confidence: high
- Evidence:
  - [SOURCE: .skilled/commands/create/benchmark.md:3] `argument-hint: "<skill-or-mode> <spec-packet> [create|update] --family=<family> [--benchmark-id <id>] [--date YYYY-MM-DD] [--path <dir>] [:auto|:confirm]"`
  - [SOURCE: .skilled/commands/create/assets/create-benchmark-presentation.txt:60] the resolution table starts at `benchmark_family`; no `benchmark_id` row exists
- Verify:
  ```bash
  rg -n -i 'benchmark.id|benchmark_id' .skilled/commands/create/assets/create-benchmark-* || echo NO_CONSUMER
  ```

### F5 — `/create:changelog` narrows `--bump` to four values while the contract accepts five (drift, P2)

The command hint lists `--bump <major|minor|patch|build>`. The mode contract's `version_bump` row allows `major`, `minor`, `patch`, `build` **or `auto`**, and the auto workflow validates exactly that five-value set with `auto` as the default. The hint therefore hides a value the engine accepts. The practical cost is low because `auto` is the default, but an operator who wants to state `--bump auto` explicitly has to disbelieve the hint.

- Type: drift
- Severity: P2
- Release: v4.0.0.0 baseline
- Confidence: high
- Evidence:
  - [SOURCE: .skilled/commands/create/changelog.md:3] `argument-hint: "<spec-folder-or-component> [--bump <major|minor|patch|build>] [--release] [:auto|:confirm]"`
  - [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:64] "`major`, `minor`, `patch`, `build` or `auto`"
  - [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:139] `validation: "must be one of: major, minor, patch, build, auto"`
- Verify:
  ```bash
  grep -n 'bump' .skilled/commands/create/changelog.md
  grep -n 'version_bump' .skilled/skills/sk-doc/sk-create-changelog/SKILL.md
  sed -n '139p' .skilled/commands/create/assets/create-changelog-auto.yaml
  ```

### F6 — Extension: add a command-contract lint that cross-checks `argument-hint` against the bound assets (extension, P2)

Three of the 13 create commands advertise a flag that the bound assets do not consume (F3, F4) or a value set narrower than the mode contract (F5), and nothing in the current check set catches it. All 39 asset triples exist, so the command set is otherwise complete and a lint would run over a stable input. A `check-command-contract.cjs` under `sk-doc/shared/scripts/` could parse each `argument-hint` for `--flag` tokens and assert each token appears in the command's presentation contract or workflow YAMLs; it would have flagged F3, F4 and F5 without reading the mode contracts by hand. Nothing breaks if this extension is never built, but the three defects above stay invisible to CI.

- Type: extension
- Severity: P2
- Release: v4.0.2.0 (gap observable at the current tag)
- Confidence: high that the gap exists; medium that a token-presence lint is the right strictness (a presentation contract could legitimately mention a flag only in prose)
- Evidence:
  - [SOURCE: .skilled/commands/create/readme.md:3] the unread `--output` flag
  - [SOURCE: .skilled/commands/create/benchmark.md:3] the unread `--benchmark-id` flag
  - [SOURCE: .skilled/commands/create/changelog.md:3] the narrowed `--bump` value set
- Verify:
  ```bash
  rg -l 'argument-hint' .skilled/commands/create/*.md | wc -l   # 13 commands
  rg -n -- '--output|--benchmark-id' .skilled/commands/create/assets/ || echo NO_CONSUMER
  ```

## Observations (command evidence, no narrative finding)

- **O1 — Q6 counts are exact.** Chart: 29 data rows between `CHART_CATALOG:BEGIN` and `CHART_CATALOG:END`, 29 files in `assets/templates/`, six distinct families (`comparison` 6, `composition` 6, `time` 9, `distribution` 4, `relationship` 3, `matrix` 1), and the three `--system` values (`neutral` 14, `categorical` 11, `ordered` 4) cover every row. Diagram: 27 catalog rows, 27 canonical type files, and the `SKILL.md` 38-form library decomposes exactly as 27 canonical + 7 pattern variants + 4 skin starters. Both corpus checks return `RESULT: PASSED` with zero errors: chart `errors: 0`; diagram `38 files, 12 families`, `errors: 0`.
- **O2 — Q3 check-mode confirmation.** `validate_skill_package.py --strict` reports three passing checks for each root and exits 0: `package_skill.py --check --strict: PASS`, `compiled routing readiness: compiled-ready: PASS`, `parent-skill-check.cjs: PASS`. The `--json` form returns `{"valid": true}` for sk-code and the same shape for sk-design. No check fails.
- **O3 — the command set itself is complete.** All 13 command files resolve their three bound assets; `mode-registry.json` names exactly the 13 command files present and declares `command: null` for the two alias-routed modes. The defects are flag-level and index-level, not missing files.
- **O4 — the two dead flags are not consumed anywhere in the run directory either.** A repo-wide grep for `--benchmark-id`/`benchmark_id` finds only the command hint and the create index; a grep for `--output`/`output_path` across the readme assets finds nothing. Both were already present at `v4.0.0.0`.

## Questions Answered

- Q5: **Mostly, with three flag-level mismatches and a stale index.** The 13 command files, their 39 assets and the 13 registry command bindings are complete and consistent. Against the mode contracts, `/create:readme` advertises `--output` that nothing consumes (F3), `/create:benchmark` advertises `--benchmark-id` that nothing consumes (F4), `/create:changelog` narrows `--bump` to four of the five accepted values (F5), and the shared index claims 21 chart forms and puts the design commands in the create tree (F1, F2). Defaults and output paths otherwise match the presentation contracts.
- Q6: **Yes.** The 29 chart forms and 27 diagram types are exact in the catalogs, the template/example files and the `/design:*` command claims; the diagram packet's 38-form library is 27 canonical + 7 variants + 4 starters. Both corpus checks pass. The only count mismatch in this cluster is the create index's stale 21 (F1), which is a command-documentation defect, not a design-catalog defect.

## Questions Remaining

- Q7: Does sk-prompt match its v4.0.0.0 note, and do the cli-* skills consume `cli-prompt-quality-card.md` consistently?
- Q8: Did the v4.0.0.16 move Changelogs Live in Skills Only leave stale changelog paths or references in these four hubs?
- Q9: Do the manual testing playbooks touched in v4.0.1.0 point at files, commands and scenarios that exist?
- Q10: Which templates, references, assets or modes across the four hubs have no inbound route or duplicate another?
- Q11: What friction do the operator and the AI user hit?
- Q12: What concrete extensions would let the four hubs share validators, routing tests or templates?

## Next Focus

Iteration 4 should take Q7 and Q8: read the v4.0.0.0 sk-prompt note against `sk-prompt/SKILL.md`, `mode-registry.json` and `assets/cli-prompt-quality-card.md`, then compare how the cli-* skills reference that card. Q8 is a cheap adjacent sweep: search the four hubs for changelog paths outside `.skilled/changelog/` and each skill's own `changelog/`. Q9 can follow with the playbook file/command checks if budget remains.

## SCOPE VIOLATIONS

None. All research commands were read-only (`awk`, `grep`, `ls`, corpus checks in check mode, `validate_skill_package.py --strict`, `git show`/`git log`); writes were limited to this iteration's narrative, its delta file, the append-gateway event file and the gateway's own state-log refresh.
