# Lead steer: review charter

The bound review_target is the spec folder, and its scope is the file list in
`specs/sk-git/033-git-setup-customization/006-release-conformance-review/goal-file-manifest.txt`.
Read that manifest at init and review exactly those files. The spec folder's own scaffold
docs are not the review subject.

## What to judge

Review all work shipped for the v4.0.0.11 release (the `/doctor:git setup` command and its
hardening) for adherence to the repository's authoring standards and for correct
cross-repo references.

Judge each artifact against its sk-doc authoring mode contract, read from `.skilled/skills/sk-doc/`:
- `sk-create-command/` for the command router, presentation and YAML split (`git.md`, `doctor-git-setup.yaml`, `doctor-git-presentation.txt`, `_routes.yaml`)
- `sk-create-manual-testing-playbook/` for the playbook scenario and the playbook indexes
- `sk-create-feature-catalog/` for the catalog leaf, `feature-catalog.md` and the spec-kit doctor category overview
- `sk-create-readme/` for the READMEs
- `sk-create-skill/` for the SKILL.md sections, the sk-git `/doctor:git` section and the Hermes mirror
- `sk-create-changelog/` for both changelogs
- the Human Voice Rules in `sk-create-with-human-voice/` for all prose

Judge code against `.skilled/skills/sk-code/sk-code-opencode/`: SKILL.md section 3, the
JavaScript and shell checklists in `assets/checklists/`, and the shared references.

Check that every place in the repo that lists doctor commands, sk-git surfaces or the
`/doctor:git` targets names `setup` correctly (search the repo, not only the manifest), that
every path and command a doc cites exists and runs as written, and that the root README
points to it where a user would look.

Use the repo's own validators where they exist and cite their output:
- `python3 .skilled/skills/sk-doc/scripts/validate_document.py <file>`
- `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <file>`
- the playbook and catalog validators under `.skilled/skills/sk-doc/`
- `bash .skilled/commands/doctor/scripts/route-validate.sh`
- the sk-code drift guards under `.skilled/skills/sk-code/`
- `node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` and `bash .github/scripts/tests/check-gate-inputs.test.sh`

Run validators read-only. If one writes a cache or report, point its output into this lineage
directory or skip it. Never modify a reviewed file.

Dimensions: correctness, traceability, maintainability, standards conformance (record
standards conformance under maintainability or traceability as the dimension field allows).
Cite path:line for every finding with a concrete failure case. Spread the five iterations
across the scope: code first, then the command surface, then skill docs, then cross-repo
references, then changelogs and a final cross-check.
