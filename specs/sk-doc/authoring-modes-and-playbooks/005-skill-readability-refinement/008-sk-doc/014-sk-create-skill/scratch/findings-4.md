### .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:24 | 4 | The overview puts `**Core Principle**` (24-25) before `**When to Use**` (26-30), while the reference template and its skeleton order Purpose, When to Use, Core Principle. | Swap the two blocks: move lines 26-30 to where line 24 sits and lines 24-25 to where line 26 sat, so the overview reads purpose paragraph, When to Use, Core Principle, then the note at line 31. Both blocks move whole, so line 31 onward, including the citation target at line 101, keeps its number.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:81 | 9 | The body carries a spec packet path with phase and packet numbers: `sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification`. | Replace `and the standard was set in \`sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification\`.` with `and the metadata JSON unification change set that standard.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:137 | 7 | The `quality` block bullet packs nine separate validation rules (key set, row shape, `file` path rule, selector set, per-selector array rule, dot rule, key refusal, finding code, `surface_detection` dependency) into one block. | Replace line 137 with:
  ```markdown
  - **Optional quality block.** `graph-metadata.json` may carry a `quality` object naming the checklists the skill's surface applies. It holds one key, `checklists`, a non-empty array of rows. Each row:
    - names its checklist file in `file`, a relative `.md` path inside the skill root
    - scopes it with at least one selector: `paths`, `extensions` or `contentMarkers`. Every selector present must be a non-empty array of non-blank strings, and an `extensions` entry must start with a dot.
    - carries checklists only, because commands come from the repository's quality config and never from a skill, so any other key at block or row level is refused, `argv`, `command` and `run` included
  - Every broken rule reports one finding under the quality code in the table below, since the quality runner reads these rows for the files that resolve to the skill's surface, and a block the gate let through would otherwise cover no file, or the wrong one, without a word.
  - A block contributes nothing unless the same file also declares a `surface_detection`, because that surface is what resolves a file to these rows.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:138 | 7 | The signal-provenance bullet packs six interlocking rules about two lists and their interaction into one block. | Replace line 138 with:
  ```markdown
  - **Optional signal-provenance lists.** `graph-metadata.json` may carry `intent_signals_generated` and `intent_signals_keep`, each an array of non-blank strings.
    - `generate-router-intent-signals.cjs --write` appends every phrase it adds to `intent_signals_generated`, so an entry there that no router declares any more is an orphan: `--check` reports and counts it, and `--write` removes it from both arrays while keeping the order of what stays.
    - A phrase named in `intent_signals_keep` is left in place, which is how a generated phrase survives a router rename.
    - An `intent_signals` entry no router declares is hand-curated: it never appears in `intent_signals_generated`, so it is never an orphan.
    - A phrase a router does declare is recorded on the hub's first `--write`, so a later router rename prunes it unless `intent_signals_keep` pins it.
    - A present list that holds anything but non-blank strings reports one `GRAPH_METADATA_INVALID_SIGNAL_LIST` finding.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:175 | 1 | The scaffold location `create-skill/assets/` names no directory in the repo; the skill root is `sk-create-skill`, and the templates live under `sk-create-skill/assets/`. | Replace `` `create-skill/assets/` `` with `` `sk-create-skill/assets/` ``.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:167 | 1 | The new-hub instruction places the root `ROUTER.md` "outside the JSON matrix below", but the matrix is Section 3, above this section. | Replace `outside the JSON matrix below` with `outside the JSON matrix above`.

### .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:25 | 4 | The overview puts `**Core Principle**` (25-26) before `**When to Use**` (27-31), against the template order Purpose, When to Use, Core Principle. | Swap the two blocks: move lines 27-31 above line 25 and lines 25-26 below line 31, so line 32 onward keeps its number.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:33 | 1 | The commands and source labels mix bases, and two of them name files absent from the skill's `scripts/` directory: `quick_validate.py` and `extract_structure.py` live under `sk-doc/shared/scripts/`, so the label at line 34 and the command at line 132 fail as written, while line 93 already uses a repository-root path. | Replace the token `scripts/quick_validate.py` (line 33) with `.skilled/skills/sk-doc/shared/scripts/quick_validate.py`; `scripts/extract_structure.py` (lines 34 and 132) with `.skilled/skills/sk-doc/shared/scripts/extract_structure.py`; `scripts/validate_skill_package.py` (lines 35 and 47) with `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`; `scripts/package_skill.py` (lines 36, 55 and 144) with `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:52 | 2 | The Package Check section repeats the Completion Gate's Purpose verbatim (`Authoritative pre-completion gate. Run before claiming a skill is done.`), so two different gates claim the same authority. | Replace line 52 with `**Purpose**: The package validator the completion gate delegates to. Run it directly when you want the package checks without the standalone-versus-parent classification.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:82 | 7 | One paragraph carries the block definition, the five markers, the fence-closing rule, the section definition, the heading-alone rule and the stray-block rule. | Replace line 82 with:
  ```markdown
  A machine router **block** is a fenced block, or an unfenced run of lines such as an indented one, that holds one of these markers:
  - `INTENT_SIGNALS =`
  - `RESOURCE_MAP =`
  - `UNKNOWN_FALLBACK_CHECKLIST =`
  - `def discover_markdown_resources`
  - `def _guard_in_skill`

  A fence closes only on a run of the same character at least as long as the one that opened it. A `MACHINE ROUTER` **section** is an H2 heading that matches `## [N. ]MACHINE ROUTER` outside a fence. The heading alone is the finding, with or without a block below it, so a skill that kept only the prose still fails RS-002. A router block with no section around it reports the same code, because it declares routing in the same file.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:84 | 7 | The known-debt paragraph packs eight rules about the debt file into one block. | Replace line 84 with:
  ```markdown
  `--strict` promotes all five to errors. Known debt lives in `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json`, keyed by the skill's path relative to `.skilled/skills` (for example `sk-code/sk-code-review`).
  - A folder outside that root is never debt.
  - Each entry records `{"lines", "words", "machineBlocks", "codes"}`, and `machineBlocks` counts the RS-002 findings the entry tolerates, one per leftover section or stray block.
  - A listed skill fails when its line count, word count or number of RS-002 findings grows past the record, or when it shows a code the entry does not record.
  - An entry in any other form is ignored.
  - Remove the entry once the skill is migrated.
  - `/create:skill-parent` applies the same rule as `parent-skill-check.cjs` check `12b-routing-shape`.
  ```

### .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:25 | 4 | The overview puts `**Core Principle**` (25-26) before `**When to Use**` (27-31), against the template order Purpose, When to Use, Core Principle. | Swap the two blocks: move lines 27-31 above line 25 and lines 25-26 below line 31. The swap is line-count neutral, so the `creation-workflow.md:261` callout in `skill-smart-router.md` stays on line 261.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:122 | 1 | The doc says `--path` is optional and defaults to the current directory, but `init_skill.py` declares `--path` with `required=True`, so the command exits with an argument error when it is omitted. | Replace line 122 with `**Required flag**: \`--path\` names the parent directory the skill folder is created under. The script exits with an error when it is omitted.`
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:126 | 1 | Step 3 describes a scaffold the script no longer produces: `init_skill.py` creates no `scripts/`, `references/` or `assets/` example directories and no example files, and it does write `manual-testing-playbook/`, `benchmark/reports/`, `graph-metadata.json` and `leaf-manifest.config.json`, then runs the class gate for the manifest and alias files. | Replace lines 126-128 with `2. Generates SKILL.md template with proper frontmatter and TODO placeholders` / `3. Scaffolds \`manual-testing-playbook/\` and \`benchmark/reports/\` with their indexes` / `4. Writes \`graph-metadata.json\` and \`leaf-manifest.config.json\`, then runs the class gate to generate \`leaf-manifest.json\` and \`leaf-aliases.json\``; replace lines 145-147 with `# ├── graph-metadata.json and leaf-manifest.config.json` / `# ├── leaf-manifest.json and leaf-aliases.json (generated by the class gate)` / `# └── benchmark/reports/ and manual-testing-playbook/ (with their indexes)`. Both edits are line-count neutral.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:139 | 1 | The example passes `--path .skilled/skill`, which would create `.skilled/skill/markdown-optimizer/`, while the comment below it promises `.skilled/skills/markdown-optimizer/`. | Replace `--path .skilled/skill` with `--path .skilled/skills`.

### .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:25 | 4 | The overview puts `**Core Principle**` (25-26) before `**When to Use**` (27-31), against the template order Purpose, When to Use, Core Principle. | Swap the two blocks: move lines 27-31 above line 25 and lines 25-26 below line 31, so line 32 onward keeps its number.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:47 | 1 | All four example trees show a skill root with no `ROUTER.md`, although `init_skill.py` writes one and strict package validation fails RS-004 on a root without a sibling router, so a layout copied from these examples fails the gate. | Insert `├── ROUTER.md` immediately after each tree's `├── SKILL.md` row, in the four Directory Structure blocks at lines 47, 75, 103 and 126.
- [P1] .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:146 | 1 | The `sk-design` precedent is stale twice: its `mode-registry.json` declares four workflow modes and no transport packet, not "two workflow modes and one transport packet", and `sk-design/shared/procedure-card-schema.md` does not exist (that folder holds only `scripts/`); the cards live under `sk-design-md-generator/procedures/`. | Replace line 146 with `**Real-world precedent**: \`sk-design\` is an illustrative hub-scale example. Its current registry has four workflow modes and no transport packet; consult \`sk-design/mode-registry.json\` before copying its procedure-card topology. \`sk-design/sk-design-md-generator/procedures/\` holds the card layout this template generalizes from.`
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:181 | 7 | One paragraph carries four mechanisms: what `/create:changelog` does, the carrier list, the README and hub-router exceptions, and the hub confirmation command. | Replace line 181 with:
  ```markdown
  Bump with `/create:changelog`. It writes the changelog entry and sets the new version in every carrier the skill root already has:
  - SKILL.md
  - for a hub, description.json, hub-router.json and mode-registry.json

  README.md and a hub ROUTER.md keep their own document versions. For a hub, `node .skilled/commands/doctor/scripts/parent-skill-check.cjs <hub-root>` then confirms every copy matches.
  ```

### .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md

- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:25 | 4 | The overview puts `**Core Principle**` (25-26) between the purpose paragraph and `**When to Use**` (27-32), while the template order is Purpose, When to Use, Core Principle. | Swap the two blocks: move lines 27-32 above line 25 and lines 25-26 below line 32. The swap is line-count neutral, so the `upgrading-a-skill-to-v4.md:65` callout in `parent-skills-nested-packets.md` stays on line 65.
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:98 | 7 | The section-opening paragraph packs five mechanisms: existing tooling only, the scaffold, the no-overwrite guard, the missing `--convert` flag and why, and the single-skill alternative with its refusal rule. | Replace line 98 with:
  ```markdown
  Use existing tooling only.
  - `/create:skill-parent` is the scaffold.
  - `create` will not write on top of an occupied folder (`requires_existing_skill: false`).
  - There is no in-place `--convert` flag here, because converting a skill into a hub is a scaffold-then-move, not an edit.
  - A single skill does convert through `/doctor:sk-skill convert`, in place when it is an older Skilled skill and as a staged new root when it is a plain one, and that command refuses a hub candidate so a skill that really holds two jobs lands here.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:202 | 7 | The convert-in-place paragraph packs ten mechanisms into one block: the run condition, the command, the plan-and-yes behaviour, the version bump, the approved `allowed-tools` list, the verbatim router move, the Smart Routing link, the eight-phrase staging proof, the body-line proof and the restore-on-diff rule. | Replace line 202 with:
  ```markdown
  **Convert a single skill in place.** When the skill has one job and is still in a plain shape, or its machine router still sits inside `SKILL.md`, run `/doctor:sk-skill convert <name-or-path>`. It prints the plan first and writes only after your yes.
  - It adds the four-part `version`.
  - It writes an `allowed-tools` list only after you approve the list its plan proposes.
  - It moves the machine router section verbatim into the sibling `ROUTER.md` and links to it from Smart Routing.
  - It stages a plain skill under its own name as a new root once you approve at least eight intent phrases, and the workflow proves the reshaped prose kept every original body line.
  - It stops and restores the pre-edit bytes when the parsed router would come out different.

  Run `/doctor:sk-skill check <name-or-path>` first if you want the gap row by row without any write.
  ```
