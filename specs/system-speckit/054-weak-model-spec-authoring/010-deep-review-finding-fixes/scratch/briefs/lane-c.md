# Lane C: playbook, records and review tooling

Read `common.md` in this folder first. This file adds what is specific to lane C.

## Skills to read

- `.skilled/skills/sk-doc/SKILL.md` and the references its router names for playbook scenarios, reference docs and benchmark reports. Apply its human voice rules to every sentence you write.
- `.skilled/skills/system-spec-kit/SKILL.md` for spec-doc records.
- `.skilled/skills/system-deep-loop/SKILL.md` before you edit the deep-review workflow assets.
- `.skilled/skills/sk-code/SKILL.md` and its Vitest references before you write the deep-loop test.

## Tasks

T070 to T100 in `$P/tasks.md`. Evidence goes to `$P/scratch/evidence/lane-c/`.

## Files you own

All 054 paths below sit under `specs/system-speckit/054-weak-model-spec-authoring/`.

- Playbook, in `$S/manual-testing-playbook/template-authoring/`: `level-1-packet-authored-from-card.md` (scenario 483), `example-drift-guard-catches-leak.md`, `authoring-card-sync-guard.md`.
- Reference docs: `$S/references/structure/sub-folder-versioning.md`, and in `$S/references/workflows/`: `auto-mode-contract.md`, `nested-changelog.md`, `worked-examples.md`, `intake-contract.md`.
- Benchmark: `$S/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md` and `source.md`.
- Parent `spec.md` (T082 to T085, T100).
- Closed phases: `005-weak-model-authoring-card/acceptance-criteria.md` (T086, T099), `006-speckit-command-and-agent-alignment/implementation-summary.md` (T087), `008-playbook-run-in-worktree/acceptance-criteria.md`, `tasks.md` and `plan.md` (T088 to T090), `009-authoring-benchmark-and-closeout/acceptance-criteria.md`, `spec.md` and `plan.md` (T091 to T093), and one log row in `009-authoring-benchmark-and-closeout/goal.md` written only by `node .skilled/hooks/goal/bin/goal.cjs packet-log` (T094).
- Deep review: `.skilled/commands/deep/assets/deep-review-auto.yaml`, `.skilled/commands/deep/assets/deep-review-confirm.yaml`, the compiled contracts in `.skilled/commands/deep/assets/compiled/` (written only by the compiler) and the new test `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-root-resource-map.vitest.ts`.

Never touch the parent `goal.md`: the conductor logs its row. Never run `repair-derived.cjs` or `generate-context.js`: the conductor refreshes derived metadata and continuity at close. You never build system-spec-kit.

## Facts the conductor checked on this tree

- Scenario 483 dispatches `AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 devin -p --model swe-2-max --permission-mode dangerous` (`level-1-packet-authored-from-card.md:92`). Its Pass rule (`:32`, `:129`) checks the reply, strict validation, the token count and that the track is gone, with no `git status` or diff. Its cleanup runs `rm -rf specs/zz-pb-card` (`:112`) and leaves the output pointer it printed in step 1 (`:118`). Its scaffold command at `:78` lacks `--with-goal`. Edit the document only. Never run the scenario or any CLI dispatch.
- `auto-mode-contract.md` is a whole-file digest source of the compiled deep contracts, so editing it makes them stale. After every source edit, run `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`, recompile each contract it names with `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command <deep/review|deep/research|deep/ai-council> --write`, and rerun the drift check until it exits 0 (T098).
- The tooling gap, from `../review/review-report.md:252`: `step_emit_resource_map` in `deep-review-auto.yaml` runs the reducer against `review/deep-review-state.jsonl`, which a fan-out root does not have before closeout, so the reducer exits with `ENOENT` and no root resource map is written. The review proposed: when `config.fanout` is present, skip the root reducer and point the report at the per-lineage resource maps. `step_convergence_report` works at the fan-out root. T095's test must fail on the unchanged YAML first. Other tests parse this YAML's text, so keep every step id and the structure they read: `rg -l deep-review-auto .skilled/skills/system-deep-loop/runtime/tests` lists them.
- The system-spec-kit vitest configuration already runs system-deep-loop unit tests: the baseline suite ran `../system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts`. Run your new test and `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts` through that configuration.
- `goal.cjs packet-log` is the only writer of a goal log row (`.skilled/hooks/goal/bin/goal.cjs:227`). Read its usage before you call it.

## Decisions you keep

- ADR-005: correct a closed phase's record with a dated note beside the original, never by rewriting the original text. The Verify lines in `tasks.md` name the phrases each note must carry: "Correction 2026-10-25", "Superseded 2026-10-25", "operator-directed push", "four final sets", "fresh2/delta.json", "12522be61c", "rev-list --count", "justified-anchors.sh", and for T099 a sentence that says "`$PHASE` is" the phase folder.
- Every fact a note states comes from a file or command you checked yourself. The ledger evidence names where to look. The packet's phases ran on `worktrees/217-weak-model-spec-authoring`, which merged to `main` on 2026-10-25. Confirm the merge with `git log --merges` before you write T100.
- T082 to T085 and T100 edit the live parent `spec.md`: keep its structure, and add notes rather than rewriting history.
- T075 to T079 replace the retired `/spec_kit:` prefix with `/speckit:`. Lane B fixes the same prefix in the phase-parent template.

## Checking your edits

You may run `bash $S/runtime/cli/spec/validate.sh <folder> --strict --no-recursive` on a folder you edited. Ignore GENERATED_METADATA_INTEGRITY and GENERATED_METADATA_DRIFT errors, because the conductor repairs derived metadata at close, and report any other new error. If `validate.sh` exits 3 for a stale build, lane A is mid-build: wait two minutes and retry once.

## P2 rows you own

The rows whose Lane column reads `C`, your part of `R1-P1-001` (T075 to T079), and your part of `R10-P1-001` (T085). The conductor writes T117.

## Acceptance rows you feed

AC-009, the fan-out part of AC-011, and your P2 rows for AC-010.
