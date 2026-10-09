# Docs audit findings for the spec-folder tooling epic

Source: a fresh read-only Opus audit on 2026-10-09 over phases 001 to 017. Six findings were rechecked by hand and hold (F01, F02, F03, F05, F07, F25). `R` is the repository root.

## P0

- F01 (016) `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-list.md:28,50,65` expect "twelve rows" and `STATUS=OK GATES=12`. The registry has 13 rows (`.skilled/scripts/git-hooks/lib/gates.tsv:8` adds `templatePhraseLint`). Fix: thirteen and 13.

## P1

- F02 (009) No playbook scenario for `/doctor:update compat`. `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:21` lists DOC-357 to DOC-361 only. Add a compat scenario (two approvals, move log, dirty-root refusal, interrupted-run recovery). It needs a v3 fixture.
- F03 (009) `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:27,46` name check, align and apply only. Name compat.
- F04 (009) `.skilled/skills/system-spec-kit/README.md:557` lists check, align, gated apply, rollback, record-base. Add compat.
- F05 (009) `.skilled/commands/README.txt:170` invocation `/doctor:update [check|align|apply|rollback|record-base]`. Add `|compat` and its purpose.
- F06 (009) `README.md:1283` same five-action invocation. Add compat and one line on the v3 to v4 path.
- F07 (016) `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:223-236` git-hook table lacks `SPECKIT_SKIP_PHRASE_LINT` (read at `.skilled/scripts/git-hooks/pre-commit:148`). `/doctor:env` builds from this file.
- F08 (009) `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` never mentions `upgrade-legacy.mjs --layout-map` (`upgrade-legacy.mjs:20-28`, `:1607`). Document the flag, its JSON fields and exit codes 0, 1 and 2, in KEY FILES (`:114`) and ENTRYPOINTS (`:272`).
- F09 (006, 008, 010, 011, 012, 015, 016, 013) No feature-catalog entry or playbook scenario covers: upgrade-legacy reversibility manifest, refusal without git, Downgrades section, grouped detail, lane-mode refusals; heal-spec-docs `--anchor-repair`, `--lane-modes`, exact-match header stamping; `repo-era.mjs`; the phrase lint gate; ANCHORS_VALID nesting errors. Add catalog entries and playbook scenarios.
- F10 (016) `template-phrase-cleanup.mjs` and `template-phrase-census.mjs` are missing from the spec/README topology (`:57-80`) and KEY FILES (`:98-114`). Add rows describing 18 kinds, the `routed` list with the `fill-frontmatter` command, and atomic writes.

## P2

- F11 (009) `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-check.md:28,56-60` (DOC-357) lacks the Spec Folder Compatibility block (`doctor-update-check.yaml:130-148`, presentation `:107-129`) and the read-only check of the two new commands.
- F12 (009, 017) `.skilled/commands/doctor/scripts/tests/README.md:40` says `doctor-update-compat.test.cjs` covers only the read-only phase; about half its cases test the compat action, including the one-key `on_step_failure` assertion.
- F13 (002, 016) spec/README.md create.sh row `:100` omits graph-metadata derivation for root and phase scaffolds and phrase seeding for 18 kinds (`create.sh:394`, `:1724`). Same gap in `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:33`. `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/phase-folder-creation.md` never checks metadata or a strict pass.
- F14 (008, 012) spec/README.md upgrade-legacy row `:114` omits the dry run's `repo era report:` block (`upgrade-legacy.mjs:1580`), the grouped `### <folder> / x <RULE> (<n>)` detail (`:520`), and the template-literal-first fill.
- F15 (008, 016, 011) spec/README.md topology `:57-80` lacks `repo-era.mjs` and `template-phrase-lint.mjs`; ENTRYPOINTS `:263-273` shows the healer only with `--lane-modes`, not the default heal or `--anchor-repair`.
- F16 (010) spec/README.md `:126` manifest field list omits `repoRoot` (`upgrade-legacy.mjs:471`), which `:130` refers to.
- F17 (008) spec/README.md Repo Era Report section `:277-291` sits after section 6's closing rule, outside a numbered section, and lacks the caveat at `doctor-update-check.yaml:139` (a v3 checkout whose `specs` is a symlink reads as v4).
- F18 (016) `.skilled/scripts/git-hooks/README.md:125` says a blocking gate with a missing script exits 1; the phrase lint gate warns and passes (`pre-commit:149-152`). Name the exception.
- F19 (016) `.env.example:405-411` lists every pre-commit bypass except `SPECKIT_SKIP_PHRASE_LINT`.
- F20 (016) `README.md:193` pre-commit bullet does not mention the phrase lint block.
- F21 (007) `.skilled/skills/system-spec-kit/runtime/cli/sweep/README.md:12` says a failure with no baseline record is `first-run`; the code returns `first-run` only when no baseline loaded, and a folder missing from a loaded baseline is `new-failure` (`strict-pass-freshness.ts:297-307`). `:26` omits that the workflow passes the previous report as `--baseline`.
- F22 (005, 008) `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md:21` says "All six modules"; the Imported-by table `:42-49` misses `phrase-judge.mjs` (package-exported with a `.d.mts`) and `repo-era.mjs` importing `corpus.mjs` and `normalize.mjs` (`repo-era.mjs:9-15`).
- F23 (013) `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/README.md` tree stops at 068-069 (070 to 080 missing, 078 to 080 are this epic's). `.skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md:82` describes ANCHORS_VALID as pair checking only, no nesting.
- F24 (014) `.skilled/skills/system-spec-kit/runtime/tests/hooks/README.md:51-60` omits `gate-3-menu-parity.test.mjs`.
- F25 (014) Gate 3 option C lacks "as an existing packet in the same track" (canonical `spec-gate-core.mjs:151`) in `.skilled/commands/speckit/assets/speckit-implement.yaml:52`, `.skilled/skills/system-spec-kit/references/workflows/worked-examples.md:60`, `.skilled/skills/system-spec-kit/references/memory/trigger-config.md:134`.

## Added by the operator

- F26 Release changelogs: `.skilled/changelog/skilled/v4.0.0.4.md` and the system-spec-kit `changelog/v2.7.0.0.md` mention nothing from this epic. Add one entry per changelog summarizing its user-facing changes.

## Checked and correct (no change)

The doctor command files (`update.md`, `_routes.yaml`, presentation, `doctor-update-check.yaml`, the compat YAML, `command-contract.json`), the runtime mirrors, the spec/README healer row and Heal Lane Modes table, `MIGRATION.md`, `validation-rules.md` section 6, `validator-registry.json:109`, `.github/workflows/README.md` and the git-hooks README at `:24`, `:92` and `:110`.
