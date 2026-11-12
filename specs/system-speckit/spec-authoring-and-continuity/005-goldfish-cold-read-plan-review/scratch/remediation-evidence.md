# Remediation evidence for child 007

Recorded by the orchestrating session on 2026-11-12. Every line is something that was run and read.

## The review this remediates

- `review/review-report.md`: five iterations through `/deep:review:auto`, executor `cli-pi` on `deepseek-v4.1-flash-1017` at max, walked by a fresh nested orchestrator session. Verdict CONDITIONAL, P0 0, P1 0, P2 12, two deferred security checks (SL-203, SL-204).
- Proof it ran as five processes: ten files in `review/dispatch-receipts/` (an intent and a completion for iterations 1 to 5), `deep-review-config.json` status `complete`, `executor.kind` `cli-pi`, no `fanout` key. Reported dispatch durations: 237, 116, 118, 87 and 84 seconds.

## Edit results (28 of 28 applied on the first attempt)

Each edit file was applied by one `pi -p` dispatch on `llmgateway/deepseek-v4.1-flash-1017` at `--thinking max`. "exact match True" means the file equals `before.replace(OLD, NEW)` byte for byte.

- 007-T002: applied, attempt 1, 9 s, exact match True, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- 007-T003: applied, attempt 1, 6 s, exact match True, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- 007-T004: applied, attempt 1, 6 s, exact match True, `.skilled/commands/deep/assets/deep-review-auto.yaml`
- 007-T005: applied, attempt 1, 11 s, exact match True, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`
- 007-T006: applied, attempt 1, 8 s, exact match True, `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md`
- 007-T007: applied, attempt 1, 8 s, exact match True, `.skilled/commands/deep/research.md`
- 007-T008: applied, attempt 1, 7 s, exact match True, `.skilled/commands/deep/review.md`
- 007-T009: applied, attempt 1, 9 s, exact match True, `.skilled/commands/deep/assets/deep-research-presentation.txt`
- 007-T010: applied, attempt 1, 6 s, exact match True, `.skilled/commands/deep/assets/deep-research-presentation.txt`
- 007-T011: applied, attempt 1, 5 s, exact match True, `.skilled/commands/deep/assets/deep-review-presentation.txt`
- 007-T012: applied, attempt 1, 5 s, exact match True, `.skilled/commands/deep/assets/deep-review-presentation.txt`
- 007-T013: applied, attempt 1, 5 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/spec.md`
- 007-T014: applied, attempt 1, 5 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/tasks.md`
- 007-T015: applied, attempt 1, 5 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/tasks.md`
- 007-T016: applied, attempt 1, 4 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md`
- 007-T017: applied, attempt 1, 6 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md`
- 007-T018: applied, attempt 1, 8 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md`
- 007-T019: applied, attempt 1, 5 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md`
- 007-T020: applied, attempt 1, 5 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`
- 007-T021: applied, attempt 1, 10 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`
- 007-T022: applied, attempt 1, 8 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`
- 007-T023: applied, attempt 1, 6 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`
- 007-T024: applied, attempt 1, 5 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`
- 007-T025: applied, attempt 1, 9 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/spec.md`
- 007-T026: applied, attempt 1, 5 s, exact match True, `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`
- 007-T027: applied, attempt 1, 15 s, exact match True, `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`
- 007-T028: applied, attempt 1, 5 s, exact match True, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`
- 007-T029: applied, attempt 1, 10 s, exact match True, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`

## Commands run after the 27 planned edits

```text
compile deep/research exit=0
compile deep/review exit=0
bash -n create.sh exit=0
deep-review-auto.yaml parses
check-card-sync.sh exit=0 | CARD SYNC OK
deep-loop full suite: exit=1 | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯ Test Files 1 failed | 172 passed (173) Tests 1 failed | 2883 passed | 8 skipped (2892)
spec-kit runtime/cli npm test: exit=0
spec-gate-core test: exit=0 | ℹ pass 110 ℹ fail 0
```

The one failing test was the new case "accepts only Claude config roots under home or the repository": `Error: configDir absolute path must stay inside the repository root`, thrown by the namespace guard at `cli-guards.cjs:106` before the root check. The validator is right and the test was wrong: it passed an absolute home path where the validator takes `~/...`.

## The correction (edit-T029)

- `scratch/edit-T029.txt` in child 007, written by the orchestrating session, changes only that test's inputs: `~/.claude-review-test`, the repo-relative `.claude-review-test`, a relative non-Claude directory that must throw "configDir must resolve under", and an absolute outside path that must throw.
- Applied by one DeepSeek dispatch (007-T029 above).
- `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts`: exit 0, 182 of 182 tests passed.
- In the full run before the correction the other 172 test files passed. Only `fanout-run.vitest.ts` changed after it.

## Not done

- Nothing on the suite side: the full deep-loop suite was rerun end to end after edit-T029, `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage`: exit 0, 173 of 173 files, 2,884 tests passed, 8 skipped.
- No iteration of the review executed a test suite. The suites above were run by the orchestrating session.
