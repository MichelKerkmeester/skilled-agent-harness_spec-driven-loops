# Follow-ups from the spec-folder tooling epic

Collected on 2026-10-09 from the 017 and 018 builds and reviews. Each item states the evidence it rests on. `R` is the repository root.

## Docs

- U01 `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:76` and `:209` list `SYSTEM_SPEC_GATE_DISABLED` twice with conflicting default and type ("unset (enabled)", "truthy disable flag" against "(unset)", "flag"). `.skilled/commands/doctor/assets/doctor-env.yaml:42` stops the parse on conflicting duplicates, so `/doctor:env` refuses the file. Fix: keep one row that carries both descriptions, or make the two rows agree.
- U02 `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:132` manifest field list omits `completedAt` (`upgrade-legacy.mjs:494`).
- U03 Broken references reported by the 018 README lane, present at HEAD: `retrieval/lib/README.md:23` `../retrofit-convention.mjs` (the file is `ops/retrofit-convention.mjs`), `retrieval/lib/README.md` `../../vitest.config.ts`, `sweep/README.md` `.opencode/specs`, `test-fixtures/README.md` `../../templates/`, `runtime/tests/hooks/README.md` `lib/spec-gate/spec-gate-core.mjs`. Verify each resolves from its file, fix the ones that do not.
- U04 Two index READMEs fail `validate_document.py` on their auto-detected type at HEAD: `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` (3 missing sections) and `.skilled/commands/doctor/scripts/tests/README.md` (2 missing sections). Bring them to their type's required sections.

## Compat workflow (`.skilled/commands/doctor/assets/doctor-update-compat-action.yaml`)

- U05 The YAML does not say whether a step owed by an interrupted run (`phase_1_preflight.recovery`, :88) counts as a planned move for the dirty-roots check (`phase_4_move.dirty_refusal`, :121). After `move-tree` the layout map reads v4 with no steps (`phase_2_layout_preview.steps_rule`, :104), and the only owed step, `link-legacy-path`, creates a link outside `specs/`. Decision: an owed recovery step is not a planned move for this check, so a resume runs it without the refusal. State that in the YAML, and update the DOC-381 scenario to expect the resume to proceed.
- U06 Inferred, not run: the YAML appends `run-complete` only in phase 8, so a declined upgrade or other terminal stop may leave the move log looking interrupted to the next run's recovery. Read the YAML, confirm or reject. If confirmed, append `run-complete` on every terminal status after run-started.
- U07 Inferred, not run: phase 2 maps layout-map exit 1 to "collisions listed", and Node also exits 1 with empty stdout when the script is missing. Read the YAML, confirm or reject. If confirmed, require parseable JSON from the map and treat any exit without it as a failure.
- Each confirmed YAML change gets a contract assertion in `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs`, in the style of the existing ones.

## Tests and generated files

- U08 `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` lists 12 files in `GATE_3_MENU_FILES`. Add the three copies 018 aligned: `.skilled/commands/speckit/assets/speckit-implement.yaml`, `.skilled/skills/system-spec-kit/references/workflows/worked-examples.md`, `.skilled/skills/system-spec-kit/references/memory/trigger-config.md`, if the test's line matcher can read their format.
- U09 The CLI suite creates temporary folders in the real `specs/` root while it runs: `specs/.repair-fixture-*` from `runtime/cli/tests/repair-derived.vitest.ts`, and `specs/001-scaffold-gate-phase-probe/` from a test to be found. Move each fixture to an OS temp directory so no run writes under the real `specs/`.
- U10 The pre-push hub check reports `sk-code: leaf-manifest.json is stale`. Regenerate it with the generator `generate-leaf-manifest.cjs --write .skilled/skills/sk-code`, confirm `--check` passes, and confirm CI's routing checks stay green.

## Housekeeping

- U11 `specs/system-speckit/034-spec-folder-tooling/018-epic-docs-alignment/scratch/evidence/push.txt` is untracked. Commit it with the 018 evidence.

## Not actionable here

- About 27 temporary fixture folders were deleted by a reviewer's cleanup. They cannot be recovered, and nothing in the repository depends on them.
- The required commit-template status check is bypassed on pushes to `main` by the pushing account's ruleset rights. That is repository configuration, not a defect in this tooling.
