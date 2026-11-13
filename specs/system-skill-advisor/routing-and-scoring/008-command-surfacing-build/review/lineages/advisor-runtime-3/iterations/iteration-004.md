# Review Iteration 004

- Dimension: traceability and maintainability
- Operator review focus: narrow pass three over the `advisor-runtime` area; this iteration closed the two remaining dimensions by checking every task line behind the area's changed files, the plugin removal and its consumers, and each changed test's failure mode. The focus's "does the change do what its task line says" question is answered in the table below.
- Budget profile: verify (11-13 calls)
- Base/HEAD: `ec1869dae8..1ca14a44988d3812ef18d968aba304ed31481648`

## Dispatcher

`@deep-review` LEAF iteration dispatched by the fan-out lineage `advisor-runtime-3`, session `fanout-advisor-runtime-3-1794593402980-zhrui5`, generation 1. Sources read this iteration: `017-review-pass-two-remediation/tasks.md` task lines T003 to T035 and T042 to T045, `git diff ec1869dae8..HEAD` for `.opencode/plugins/system-skill-advisor.js` and its test, the current plugin code at the removed function and at the status printer, the changed test files not read in earlier iterations, the comment-hygiene scan over the area diff, and `steer.md` (absent).

## Files Reviewed

- `.opencode/plugins/system-skill-advisor.js:585-655,1057-1062,1505-1530,1680-1690`
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:481-520`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:110-125`
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:47-66,505-540,735-745`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:67-105`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:25-75,123-140` (re-read for test quality)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:21-120` (re-read for test quality)
- `.skilled/skills/system-skill-advisor/runtime/tests/derive-command-bridges-strings.vitest.ts:1-33` (re-read for test quality)
- `git diff -U0` over every `advisor-runtime` area file for comment hygiene and the banned skill name.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Task-line conformance table below; every changed production file maps to a task line and the code does what the line says, with the one wording exception already recorded as AR3-P2-001 in iteration 1. |
| `checklist_evidence` | pass | Changed tests actually fail when their fix is removed: T045's owner assertion would change the label to `system-spec-kit → ...`; T027's label includes the policy; T028 asserts the three fields on the CLI path; T006 asserts the stored marker exists and the status text does not carry it; T007 deletes an assertion that never reached a gate. |
| `skill_agent` | pass | The plugin removal has no reader: `parseCliResponse` metadata consumers use `freshness` only (`system-skill-advisor.js:1522`), and no runtime file reads `metadata.compiledRouteSummary`. |
| `agent_cross_runtime` | notApplicable | No agent file in this area. |
| `feature_catalog_code` | notApplicable | Catalog pages naming `metadata.compiledRouteSummary` belong to other skills and are one of the four items the task block excludes from this pass. |
| `playbook_capability` | notApplicable | Playbook files belong to the `doctor-docs` area. |

### Task-line conformance

| Task | Files | Verdict |
|------|-------|---------|
| T003 shared no-edit helper | `command-attach.ts`, `command-attach-guards.vitest.ts` | Does what the line says; four endings, curly fold, scope-limiting cases present. One residual wording class recorded as AR3-P2-001. |
| T004 explainer through the helper | `scorer/text.ts`, `read-only-explainer.vitest.ts` | Holds: import present, old literal gone, four cases pass. |
| T005 scorer gates through the helper | `scorer/fusion.ts`, `command-meaning-anchor.vitest.ts` | Holds: two `isNoEditRequest(promptLower)` sites, curly case passes. |
| T006 privacy case stores a record | `handlers/advisor-status.vitest.ts` | Holds: record persisted under `SKILL_ADVISOR_DEBUG=1`, status text asserted clean, invocations 1. |
| T007 drop the unreachable attach assertion | `command-attach.vitest.ts` | Holds: line removed, remaining line proves the deep-loop gate. |
| T008 README names every row field | `command-attach-guards.vitest.ts` | Holds: interface fields read from source and README sentence checked. |
| T009 escape generated literals | `derive-command-bridges.cjs`, `derive-command-bridges-strings.vitest.ts` | Holds: export added, five round-trip cases. |
| T010 no code from untrusted backfill | `command-offer.mjs`, `command-offer.vitest.ts` | Holds: trust gate before warm/replay, untrusted test and marked-arena test present. |
| T011 NUL status | `worktree-restore.mjs`, `worktree-restore.vitest.ts` | Holds: `-z`, NUL split, rename source consumed, two new cases. |
| T012 arm from rows | `run-command-behaviour.mjs`, `command-behaviour-guards.vitest.ts` | Holds: default null, row-derived g2, mixed refusal. |
| T013 record and replay fixture | `run-command-behaviour.mjs`, `command-offer.mjs` | Holds: `lineFixture`, job fixture for g2, line writer, backfill lookup. |
| T014 restore caller env | `capture-command-routing-baseline.mjs`, `command-routing-slice.vitest.ts` | Holds: nine names saved and restored, slice test compares snapshots. |
| T015 measure without child flag | `measure-brief-cost.mjs`, `measure-brief-cost.vitest.ts` | Holds: `delete env.AI_SESSION_CHILD`, hook sees `<unset>`. |
| T016-T021 scorer and README text | `score-command-transcripts.mjs`, tests | Holds: session form refuses `--row-id`, usage lines updated, README rows are `doctor-docs` files. |
| T025-T026 plugin jsdoc and dead function | `system-skill-advisor.js` | Holds: option documented as status-only, function and metadata field removed, status printer still reports the field. |
| T027 plugin field test | `system-skill-advisor.test.cjs` | Holds: owner differs from skill, label asserts command, policy and owner. |
| T028 fallback field test | `skill-advisor-cli-fallback-envelope.vitest.ts` | Holds: three fields asserted and label asserted. |
| T029 busy scan past the cap | `subprocess.ts`, `subprocess-output-cap.vitest.ts` | Holds: pre-cap scan with carry, renamed case and split-write case. |
| T034-T035, T044-T045 | `doctor` scripts and plugin test | `doctor` files are the `doctor-docs` area; T045's owner change is present in the plugin test. |
| T042 narrow the no-edit pattern | `command-attach.ts`, tests | Partial: the three named cases hold, the `make no changes` variant still misfires (AR3-P2-001). |
| T043 end the `--row-id` sentence | `routing-accuracy/README.md` | `doctor-docs` area file; out of this lineage. |

## Integration Evidence

- The removed plugin metadata field has no consumer: `grep` over `.opencode` and the advisor runtime shows only the test-local fixture builder and `lib/skill-advisor-render.js` helpers, both of which serve the separate compiled-route renderer, not the plugin metadata.
- The status printer still reports `bounded_compiled_route_summary=${options.boundedCompiledRouteSummary}` at `system-skill-advisor.js:1684`, which is what the corrected jsdoc names.
- The plugin test's row now sets `skillId: 'system-spec-kit'` with `ownerSkillId: 'sk-doc'` (T045), so dropping the owner changes the rendered label.

## Edge Cases

- `NO_EDIT_REQUEST` stays exported while `isNoEditRequest` is the safe entry. No production caller reads the raw pattern; the test at `command-attach-guards.vitest.ts:49` keeps it alive for the legacy assertion. Recorded as a design edge; a future caller could bypass the fold, but no concrete current input does.
- The four catalog pages naming `metadata.compiledRouteSummary` are explicitly left by the task block's "Verifier follow-ups, coordinator" note, so they are not re-reported here.
- `git diff -U0` scans over the area found no added code comment naming a spec path, phase, task id, finding id, ADR or REQ id, and no added `/create:skill` or `/create:sk-skill` test input.

## Confirmed-Clean Surfaces

- Plugin suite: `env -u AI_SESSION_CHILD node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` reported `pass 43`, `fail 0`.
- Changed handler and hook suites: `env -u AI_SESSION_CHILD npx vitest run tests/handlers/advisor-status.vitest.ts tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` reported `2 passed (2)`, `36 passed (36)`.
- The area diff adds no comment with an ephemeral artifact label and no banned skill name.

## Ruled Out

- A plugin consumer broken by removing `compiledRouteSummary`: ruled out by grep and by reading the only metadata consumer (`freshness`).
- A test that cannot fail among the changed tests: ruled out for T006, T027, T028, T045 by naming the change each assertion would catch; the remaining changed tests assert concrete file or value outcomes.
- A comment-hygiene violation in the area: ruled out by the added-line scan.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: all four dimensions have at least one pass and the changed-line coverage is complete.
- Rotation status: complete.
- Blocked/productive carry-forward: none blocked.
- Required evidence: registry counts, iteration verdicts, and the synthesis report.

Review verdict: PASS
