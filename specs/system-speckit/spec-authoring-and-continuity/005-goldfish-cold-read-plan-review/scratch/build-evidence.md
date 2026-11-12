# Build evidence for phases 002 to 006

Recorded by the orchestrating session on 2026-11-12. Every line is something that was run and read.

## Who did what

- Each `edit-TNNN.txt` was applied by one `pi -p` dispatch on `llmgateway/deepseek-v4.1-flash-1017` at `--thinking max`, tools `read,edit,grep`, one edit per process.
- After each dispatch the orchestrator compared the file with `before.replace(OLD, NEW)`. "exact match True" means the file equals that result byte for byte.
- Commands that regenerate or test were run by the orchestrating session, not by a dispatched agent.

## Edit results (34 of 34 applied on the first attempt)

- 002-T002: applied, attempt 1, 10 s, exact match True, `.skilled/commands/deep/research.md`
- 002-T003: applied, attempt 1, 10 s, exact match True, `.skilled/commands/deep/review.md`
- 002-T004: applied, attempt 1, 9 s, exact match True, `.skilled/commands/deep/assets/deep-research-presentation.txt`
- 002-T005: applied, attempt 1, 8 s, exact match True, `.skilled/commands/deep/assets/deep-research-presentation.txt`
- 002-T006: applied, attempt 1, 9 s, exact match True, `.skilled/commands/deep/assets/deep-review-presentation.txt`
- 002-T007: applied, attempt 1, 8 s, exact match True, `.skilled/commands/deep/assets/deep-review-presentation.txt`
- 002-T008: applied, attempt 1, 6 s, exact match True, `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md`
- 003-T002: applied, attempt 1, 8 s, exact match True, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- 003-T003: applied, attempt 1, 10 s, exact match True, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- 003-T004: applied, attempt 1, 8 s, exact match True, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`
- 003-T005: applied, attempt 1, 12 s, exact match True, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`
- 003-T006: applied, attempt 1, 11 s, exact match True, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`
- 003-T007: applied, attempt 1, 17 s, exact match True, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`
- 003-T008: applied, attempt 1, 11 s, exact match True, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`
- 003-T009: applied, attempt 1, 4 s, exact match True, `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts`
- 003-T010: applied, attempt 1, 7 s, exact match True, `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts`
- 003-T011: applied, attempt 1, 9 s, exact match True, `.skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts`
- 003-T012: applied, attempt 1, 5 s, exact match True, `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/repin-runbook.md`
- 004-T002: applied, attempt 1, 12 s, exact match True, `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl`
- 004-T003: applied, attempt 1, 9 s, exact match True, `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`
- 004-T004: applied, attempt 1, 9 s, exact match True, `.skilled/skills/system-spec-kit/SKILL.md`
- 005-T004: applied, attempt 1, 12 s, exact match True, `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`
- 005-T005: applied, attempt 1, 10 s, exact match True, `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`
- 005-T006: applied, attempt 1, 8 s, exact match True, `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`
- 005-T007: applied, attempt 1, 8 s, exact match True, `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`
- 005-T009: applied, attempt 1, 13 s, exact match True, `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`
- 005-T010: applied, attempt 1, 13 s, exact match True, `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs`
- 005-T012: applied, attempt 1, 8 s, exact match True, `.skilled/skills/system-spec-kit/ROUTER.md`
- 005-T013: applied, attempt 1, 8 s, exact match True, `.skilled/skills/system-spec-kit/ROUTER.md`
- 006-T004: applied, attempt 1, 9 s, exact match True, `.skilled/commands/speckit/assets/speckit-implement.yaml`
- 006-T005: applied, attempt 1, 11 s, exact match True, `.skilled/commands/speckit/assets/speckit-implement.yaml`
- 006-T006: applied, attempt 1, 10 s, exact match True, `.skilled/commands/speckit/assets/speckit-implement.yaml`
- 006-T007: applied, attempt 1, 14 s, exact match True, `.skilled/commands/speckit/assets/speckit-complete.yaml`
- 006-T008: applied, attempt 1, 7 s, exact match True, `.skilled/commands/speckit/assets/speckit-plan.yaml`

## Commands run after the edits

- `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` and the same for `deep/review`: both exit 0. `git diff --stat` on the two compiled contracts: 12 insertions, 10 deletions.
- `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-golden-snapshots.vitest.ts --update`: "Snapshots 4 updated", 12 of 12 tests passed. `git diff --stat` on the snapshot file: 4 insertions, 4 deletions.
- `node --experimental-test-module-mocks --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs`: exit 0, `pass 110`, `fail 0`.
- js-yaml parse of `speckit-implement.yaml`, `speckit-complete.yaml` and `speckit-plan.yaml`: all three parse.
- One-lineage refusal: `node .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs --spec-folder <003 folder> --loop-type research --fanout-config-json '{"executors":[{"kind":"cli-pi","model":"llmgateway/deepseek-v4.1-flash-1017","iterations":1,"label":"probe"}]}' --base-artifact-dir <003 folder>/research` exits 3 and prints "fan-out refused: this research executor matrix expands to one lineage. Run the single-executor /deep:research workflow instead; it runs the packet init, synthesis and save phases, which this runner does not." No directory was created.
- Full deep-loop suite, `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage`: 173 files, 2,889 tests, 2,879 passed, 8 skipped, 2 failed. Both failures were `STALE_SOURCE_DIGEST` for `deep/ai-council`, caused by commit `ba2647e2c2` changing `.skilled/agents/ai-council.md` without recompiling. One of the two failed in the baseline taken before any edit.
- Deviation: the orchestrator ran `compile-command-contracts.cjs --command deep/ai-council --write` (1 line changed) so the suite can pass. Rerun of `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts`: 43 of 43 passed.
- Full spec-kit CLI suite, `cd .skilled/skills/system-spec-kit/runtime/cli && npm test`: exit 0.

## Baseline before any edit

- `npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts tests/unit/lineage-timestamp-window.vitest.ts tests/unit/render-command-contract.vitest.ts tests/stress/cli-adapter`: 375 tests, 366 passed, 8 skipped, 1 failed (the stale council contract).
- Scaffold snapshot test: 12 of 12 passed.

## Not done

- The full deep-loop suite has not been rerun end to end since the council contract was recompiled.
- The router keyword edit (005 T012, T013) changes what the router loads only for a session that opens system-spec-kit. The advisor still does not pick that skill for a plain write request.

## Focused runs after the build (2026-11-12, orchestrating session)

### `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts -t 'replays a native fanout cassette with a stable normalized run envelope'`
```text
 Test Files  1 passed (1)
      Tests  1 passed | 178 skipped (179)
```

### `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts -t 'rejects an unapproved single-lineage research or review run before side effects'`
```text
 Test Files  1 passed (1)
      Tests  1 passed | 178 skipped (179)
```

### `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts -t 'allows an explicitly opted-in single-lineage research or review run'`
```text
 Test Files  1 passed (1)
      Tests  1 passed | 178 skipped (179)
```

### `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts`
```text
 Test Files  1 passed (1)
      Tests  179 passed (179)
```

### `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/lineage-timestamp-window.vitest.ts`
```text
 Test Files  1 passed (1)
      Tests  5 passed (5)
```

### `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/stress/cli-adapter`
```text
 Test Files  8 passed (8)
      Tests  152 passed | 8 skipped (160)
```

### `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-golden-snapshots.vitest.ts`
```text
 Test Files  1 passed (1)
      Tests  12 passed (12)
```

### `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-passes-its-own-gate.vitest.ts`
```text
 Test Files  1 passed (1)
      Tests  6 passed (6)
```

Full deep-loop suite rerun from the final state, `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage`: exit 0, 173 of 173 files, 2,881 tests passed, 8 skipped.

## Pre-edit receipts, read from the last commit with `git show HEAD:<file>`

```text
.skilled/commands/deep/research.md | an `--executors` value -> 1
.skilled/commands/deep/review.md | an `--executors` value -> 1
.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl | Setup counts the archives. -> 1
.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | Setup counts the archives. -> 4
.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | echo "  Next steps:" -> 2
.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | 0. Read .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md -> 0
.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | detail: GATE_3_MUTATION_NOTICE -> 1
.skilled/skills/system-spec-kit/SKILL.md | before selecting skill-local resources -> 1
.skilled/commands/speckit/assets/speckit-implement.yaml | id: plan_clarity, points: 25 } -> 1
.skilled/commands/speckit/assets/speckit-implement.yaml | checks: { prerequisites: verified, blockers: none, environment: ready } -> 1
.skilled/commands/speckit/assets/speckit-implement.yaml | validation_error: "STOP and fix", system_error: -> 1
.skilled/commands/speckit/assets/speckit-complete.yaml | 2. plan.md exists → If not, return to Step 6 -> 1
.skilled/commands/speckit/assets/speckit-plan.yaml | Extract [NEEDS CLARIFICATION] markers (max 3) -> 1
```

Before the build the orchestrator also counted each edit file's OLD text in its target: 33 edits found it once and 003 T010 found it three times, as each edit file states.

The advisor check in 005 T003 was first run on 2026-11-11 before any edit and returned sk-code, sk-doc and mcp-tooling, with system-spec-kit absent (recorded in child 001 `scratch/trust-checks.md`).

005 T004 intermediate count: T004 and T005 each add the card line to one of the two Next steps blocks in create.sh. The count was 0 at HEAD and is 2 after both edits, so it was 1 between them. No separate reading was taken between the two dispatches.

006 CHK-012: `git diff -- .skilled/commands/speckit/assets` shows the only change inside a quality_gates block is the plan_clarity row that REQ-001 of that phase requires. No quality_gates, circuit_breaker or default_level entry was deleted.

Note on the focused runs above: the shell wrapper failed to capture each exit status, so none is quoted. Each summary shows every test file passed and no failed test. No `obsolete` or `written` snapshot line appeared in the snapshot run.

## Exit statuses captured on a rerun (2026-11-12)

```text
tests/scaffold-golden-snapshots.vitest.ts (no --update): exit=0 | Tests 12 passed (12) | obsolete-or-written lines: 0
tests/scaffold-passes-its-own-gate.vitest.ts (no --update): exit=0 | Tests 6 passed (6) | obsolete-or-written lines: 0
tests/unit/fanout-run.vitest.ts: exit=0 | Tests 179 passed (179)
tests/unit/lineage-timestamp-window.vitest.ts: exit=0 | Tests 5 passed (5)
tests/stress/cli-adapter: exit=0 | Tests 152 passed | 8 skipped (160)
```

## Receipts added for phase 005 (2026-11-12, orchestrating session)

- Adapter count: `rg -l -F 'spec-gate-core' .skilled/hooks/spec-gate/*/*enforce* .opencode/plugins/system-spec-gate.js | wc -l` prints 7. `git diff --quiet HEAD -- .skilled/hooks/spec-gate .opencode/plugins/system-spec-gate.js` exits 0, and the last commit touching those paths is `575ccff5d3`, which predates the build. The adapter files were not edited by any phase, so the count before the carrier edits was also 7.
- 005 T004 intermediate state: the build driver compared `create.sh` with `before.replace(OLD, NEW)` immediately after the T004 dispatch and before the T005 dispatch started. The result line "005-T004: applied, attempt 1, exact match True" in this file is that comparison. A file equal to the pre-edit file with exactly one OLD block replaced holds the card line exactly once, so the count between T004 and T005 was 1.
- Operator-level decision under goal D1: these two receipts are accepted as the evidence for 005 T001 to T004, CHK-023 and AC-001. Recorded by the orchestrating session, not by the operator in person.
