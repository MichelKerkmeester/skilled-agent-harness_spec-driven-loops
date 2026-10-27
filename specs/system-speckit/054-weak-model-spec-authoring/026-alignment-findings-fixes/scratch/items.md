# Phase 026 work items

Source: two runs of the operator-local alignment command on commit 5b9509576a (phase 025).
- DeepSeek run: `report.md` in the alignment run output (gitignored), run 20261027T154036Z
- Opus high run: `report.md` in the alignment run output (gitignored), run 20261027T171418Z

Every item was confirmed by a command in at least one run. Line numbers are as of 5b9509576a; re-read before editing.

## Lane 1: code (nested-changelog.ts, its tests, spec-root-registry.ts, a create.sh phase test)

- F1 (P1, CR-01 / C-1): `nested-changelog.ts` `--write` creates a new packet changelog when none exists (`writeNestedChangelog` mkdirs and writes with no existence check), while seven docs say the generator only re-renders existing files. Make `--write` refuse when the resolved output file does not already exist: throw an Error whose message says spec folders no longer get changelogs and to use /create:changelog. Update the existing vitest write case to seed the target file first, and add a test that `--write` on a packet with no changelog throws and writes nothing.
- F2 (P2, DeepSeek A-3): add a `@deprecated` TSDoc tag to the module header and the exported `main`, naming `/create:changelog` as the replacement.
- F3 (P2, A-1 / C-5 / CR-5): `runtime/cli/core/spec-root-registry.ts:79` points at `nested-changelog.ts:589`; set it to the real line of `function ensureApprovedSpecFolder` after F1 and F2. Check every other `nested-changelog.ts:` reference in that registry.
- F4 (P2, A-2): no test pins that `create.sh --phase` leaves the `**Changelog**:` line out of a new child. Add one assertion to an existing phase-scaffold test.

## Lane 2: system-spec-kit docs

- F5 (P1, B-1 / D1): `SKILL.md` is 5021 words, over the 5000 cap that `validate_skill_package.py` enforces. Cut it under 5000 (target at most 4990), starting with lines 102 and 105.
- F6 (P2, CR-04 / CR-3): the smart-router RESOURCE_MAP lists `references/workflows/nested-changelog.md` under COMPLETE, so every `/speckit:complete` loads the deprecated page. Move the leaf to a non-completion intent; SKILL.md requires every leaf-manifest leaf to sit under at least one intent.
- F7 (P2, CR-03 / CR-4 / C-3 / C-4): level-change notes still say "changelog": `SKILL.md:539`, `references/templates/template-guide.md:730` and `:892`, `references/workflows/quick-reference.md:314` and `:348`, `assets/template-mapping.md:282`. These meant an in-document change log, not a release entry. Point them at `implementation-summary.md`, or the spec.md change-log section where the level has one (check `templates/` for it). Never point them at `/create:changelog`.
- F8 (P2, B-2): `feature-catalog/feature-catalog.md:346-350` root entry must match the leaf `tooling-and-scripts/nested-changelog-generator.md` description (leaf starts with "Deprecated."). `validate_catalog_package.py --package system-spec-kit` must report no `root_leaf_description_mismatch`.
- F9 (P2, B-3): `manual-testing-playbook/retrieval/session-recovery-spec-kit-resume.md:49` step 7 and its Expected line: mirror the catalog leaf wording ("implementation-summary.md, plus its changelog/ when an older packet still has one").
- F10 (P2, CR-02): `references/workflows/nested-changelog.md:32,39` and `quick-reference.md:125` describe `--write`; make them match F1 (re-renders an existing packet changelog, refuses a packet that has none).
- F11: update the unreleased entry `changelog/v2.12.8.0.md` to cover F1 and the doc fixes, keeping its voice (no em dashes, no semicolons, no Oxford commas).

## Lane 3: sk-doc and the changelog command

- F12 (P2): `sk-doc/sk-create-changelog/SKILL.md`: line 248 mixes imperative and third person (B-5); line 345 NEVER rule conflicts with the re-render use (CR-02); the smart-router pseudocode returns `output_mode = packet_local` with no refusal branch (DeepSeek D3); line 51 claims a packet-local request reaches this mode, which the advisor does not guarantee (Opus D-1).
- F13 (P2, B-6): `references/worked-examples.md:8` keeps the trigger phrase `packet local changelog example` for an example that no longer exists. Remove it.
- F14 (P2, B-4): `manual-testing-playbook/version-and-format/choose-four-part-bump.md:63,67` still assumes nested output.
- F15 (P2, C-2 / CR-05): `.skilled/commands/create/assets/create-changelog-{auto,confirm}.yaml` keep `changelog_mode` (always global) and `IF changelog_mode = global:` guards. Drop the variable and unwrap the guards. Both files must still parse as YAML.
- F16 (P2, D-1): `sk-doc/changelog/v2.3.21.0.md:3,24` makes the same routing claim as F12 line 51; soften it. Update `sk-create-changelog/changelog/v1.3.6.0.md` if F12 changes what it says.

## Conductor

- F17 (P2, A-3): rebuild the trigger index (`generate-trigger-index.mjs`) after the doc edits so the `--check` passes.
- F18: Hermes mirror sync, hub check, full CLI suite against the 025 baseline (2241 passed, 20 skipped), strict recursive validation of 054, and a battery rerun of S1, S2, S3 and S4.

## Out of scope (recorded, not fixed here)

- The S5 README checkers read slash commands such as `/create:changelog` as missing file paths. Pre-existing, and the checker is sk-doc's.
- The advisor ranks system-spec-kit first for "packet-local changelog" requests. Pre-existing; no skill graph-metadata changed.
- The operator-local alignment command's tooling: the aggregator crashes on numeric finding ids and keeps findings at their severity after the critic overturns them.
