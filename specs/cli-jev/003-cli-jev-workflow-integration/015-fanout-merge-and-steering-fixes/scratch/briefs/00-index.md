# Brief index: fan-out merge under-count and per-iteration steering

`S` = `.skilled/skills/system-deep-loop/runtime`. `P` = `specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes`. Every command runs from the worktree root unless it starts with `cd S &&`. `BASE` is the SHA step 01 records (HEAD was `6f47c32dce` when these briefs were written).

| Order | Brief | Change | Executor, effort | Depends on | Files touched | Orchestrator verification | Expected |
|-------|-------|--------|------------------|------------|---------------|---------------------------|----------|
| 01 | ORCHESTRATOR | T001: record `BASE` and confirm both roster commits are in the tree | orchestrator | none | none | `git rev-parse --short HEAD; git merge-base --is-ancestor ac156a7112 HEAD && git merge-base --is-ancestor 9fe8526284 HEAD && echo both; git diff --stat main -- S/scripts/fanout-run.cjs` | a SHA, `both`, empty diff |
| 02 | ORCHESTRATOR | T002: baseline pass counts | orchestrator | 01 | none | `cd S && npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts`, then `cd S && npx vitest run --no-coverage` | Counts recorded. Not known at authoring |
| 03 | ORCHESTRATOR | T003 and T004: replay the current merge on temp copies and write the per-lineage diagnosis table into `P/implementation-summary.md` | orchestrator | 01 | `P/implementation-summary.md` | The replay loop in `P/acceptance-criteria.md` "Replay command". For the table, the read-only `node /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/17193ad8-031f-432d-a47f-2b525f70e851/scratchpad/p015/tab.cjs` prints registry count, count-only sum and markdown, graph and delta counts per iteration | `001-deep-research 85 0`, `004-deep-research-expansion 74 0`, `007-classifier-deep-research 65 0`. Unmatched totals 0, 13 and 38 (see the table below) |
| 04 | `04-merge-short-registry-gate-and-gap.md` | Reconstruct a short research registry and turn an unmatched iteration into a counted gap instead of a throw. Pinned by the "no iteration matches" test | codex gpt-5.5, `high` | 03 | `S/scripts/fanout-merge.cjs`, `S/tests/unit/fanout-merge.vitest.ts` | `cd S && npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts` and `... -t "no iteration matches"` | 0 failed, passed = baseline + 1; the filtered run shows 1 passed |
| 05 | `05-merge-delta-finding-source.md` | Read delta `type: "finding"` records as the third evidence source through the existing path guards. Pinned by the "short registry" test | codex gpt-5.5, `high` | 04 | `S/scripts/fanout-merge.cjs`, `S/tests/unit/fanout-merge.vitest.ts` | `cd S && npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts` and `... -t "short registry"` | 0 failed, passed = baseline + 2; the filtered run shows 1 passed |
| 06 | `06-loop-prompt-steer-line.md` | One conditional `steer.md` instruction in `buildLoopPrompt` for CLI lineages. Pinned by the "steer.md" test | codex gpt-5.5, `medium` | 02 (parallel with 04 and 05) | `S/scripts/fanout-run.cjs`, `S/tests/unit/fanout-run.vitest.ts` | `cd S && npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts -t "steer.md"`, then the whole file | 1 passed; the whole file is baseline + 1 with 0 failed |
| 07 | ORCHESTRATOR | AC-002: prove both new merge tests fail on the pre-fix script | orchestrator | 05 | none net | The step 07 block below | 2 failed on the pre-fix script. After the restore, `cmp` prints nothing |
| 08 | ORCHESTRATOR | T012: rerun the three files, then the full runtime suite | orchestrator | 04, 05, 06 | none | See phase-close gates 1 and 2 | Baseline + 3 passed, 0 new failures |
| 09 | ORCHESTRATOR | T013 and T014: replay the fixed merge and confirm no committed `research/` change | orchestrator | 05 | `P/implementation-summary.md` | The same replay loop, then `git status --short -- 'specs/cli-jev/003-cli-jev-workflow-integration/*/research'` | `001-deep-research 134 0`, `004-deep-research-expansion 105 13`, `007-classifier-deep-research 168 38`; git status prints nothing |
| 10 | ORCHESTRATOR | T015: comment hygiene on the four changed files | orchestrator | 04, 05, 06 | none | The step 10 block below | No output |
| 11 | ORCHESTRATOR | T016: fill `implementation-summary.md`, the `acceptance-criteria.md` rows, the `tasks.md` ticks and the `goal.md` log with observed evidence, then run the close gates | orchestrator | 07 to 10 | `P/implementation-summary.md`, `P/acceptance-criteria.md`, `P/tasks.md`, `P/goal.md` | Phase-close gates 4 and 5 | `RESULT: PASSED`; check-goal exit 0 |

Step 07 block. Run it before any commit of 04 or 05, or after; `BASE` predates both.

```bash
cd .skilled/skills/system-deep-loop/runtime
cp scripts/fanout-merge.cjs "$TMPDIR/merge-fixed.cjs"
git show BASE:.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs > scripts/fanout-merge.cjs
npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts -t "short registry|no iteration matches"
cp "$TMPDIR/merge-fixed.cjs" scripts/fanout-merge.cjs
cmp scripts/fanout-merge.cjs "$TMPDIR/merge-fixed.cjs"
```

Step 10 block. It prints any added comment line that names a spec path, a task, check or requirement id, or a phase or packet number.

```bash
git diff BASE -- \
  .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs \
  .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts \
  .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts \
  | grep -E '^\+' | grep -E '(//|/\*|^\+\s*\*)' | grep -E 'specs/|REQ-|CHK-|T0[0-9]{2}|[Pp]hase [0-9]|[Pp]acket [0-9]'
```

Brief count: 3, all codex (2 at `high`, 1 at `medium`). No pi brief: the phase's only doc edits are phase-doc updates, which stay with the orchestrator.

## Expected diagnosis (step 03)

A read-only simulation of D3's rule over the committed lineages, run while these briefs were written. The build's own table is the authority.

| Round | Lineage | Registry | Count-only sum | Unmatched iterations (findings) | After the fix |
|-------|---------|----------|----------------|---------------------------------|---------------|
| 1 | deepseek | 8 | 57 | none. Iteration 6 matches delta only, the rest markdown | rebuilt 57 |
| 1 | grok | 22 | 0 (structured records) | none | registry 22 |
| 1 | mimo | 55 | 55 | none, all delta | registry 55, gate not fired |
| 2 | deepseek | 21 | 41 | none, all delta | rebuilt 41 |
| 2 | grok | 7 | 21 | 1, 2, 3 (13). Iteration 4 delta, 5 markdown | rebuilt 8, gap 13 |
| 2 | mimo | 26 | 26 | none | registry 26 |
| 2 | swe | 20 | 30 | none. Iteration 1 markdown, 2 to 5 delta | rebuilt 30 |
| 3 | deepseek | 13 | 83 | 1 (12: delta holds 11) | rebuilt 71, gap 12 |
| 3 | glm | 25 (`metrics.sourceFindings` 24) | 0 | none | registry, counted as 24 |
| 3 | grok | 9 | 35 | all 10 (35) | registry 9 kept, gap 26 |
| 3 | mimo | 9 | 0 | none | registry 9 |
| 3 | swe | 10 | 55 | none, all delta | rebuilt 55 |

## Phase-close gates

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts`: 0 failed, baseline + 3 passed.
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage`: the step 02 count + 3, no new failure. It covers the other prompt and merge consumers: `tests/stress/cli-adapter/fanout.vitest.ts`, `tests/unit/workflow-session-id-parity.vitest.ts` and `tests/unit/result-envelopes.vitest.ts`.
3. `node --check .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs && node --check .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (CHK-010), then the step 09 replay and git status.
4. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes --strict`: `RESULT: PASSED`.
5. `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes`: exit 0.
6. CHK-051 asks for `scratch/` to be clean before completion, and this folder is in `scratch/`. Whether to delete it is the orchestrator's decision.

## Premises that no longer match the code

1. The 11-line `fanout-run.cjs` difference from `main` (spec.md:48 and :164, plan.md:42 and :134, goal.md:123) is gone. `ac156a7112` and `9fe8526284` are both ancestors of HEAD, and `git diff HEAD main -- S/scripts/fanout-run.cjs` is empty. T001 is now only a record.
2. The `buildLoopPrompt` call site cited as `fanout-run.cjs:3260` (spec.md:82, goal.md:110) is now at `:3267`. Every other anchor in `fanout-run.cjs` (`:1406-1525`, `:1431-1443`, `:1527`) and every `fanout-merge.cjs` anchor the phase cites still holds.
3. The convergence check cited at `deep-research-auto.yaml:2215-2216` and `deep-research-confirm.yaml:1683-1684` (spec.md:104, plan.md:79) is not there. Those lines hold `step_generate_context` and a summary template. `count_only_state_findings_not_reconstructed` is raised only at `S/scripts/synthesis-closeout.cjs:347-359`. This phase leaves that code as it is. After the fix, rounds 2 and 3 still raise `state_finding_reconstruction_gap` (`:357-358`), and round 3 still raises the count-only invariant because 168 < 173. That is expected, because the gap is named, not closed.
4. Spec.md:56 asks for a refresh of "the matching file in ../changelog/" when the phase closes. `specs/cli-jev/003-cli-jev-workflow-integration/changelog/` does not exist.

## Design choices the briefs make

- The "no iteration matches" test (brief 04) copies grok iterations 1 to 3 and the first 3 registry findings, so it expects gap 12 (15 counted, 3 kept). The whole lineage would give 26. Both follow AC-004's formula, and the smaller fixture keeps the test short. The "short registry" test (brief 05) copies deepseek iterations 1 and 6 only (11 delta findings against the 8-finding registry).
- T008 says to return the unmatched count "instead of throwing". Brief 04 keeps one throw: a structured-array count mismatch (`fanout-merge.cjs:1047-1049`). The existing test at `fanout-merge.vitest.ts:1293` depends on it for `lineage_reconstruction_failed`, and AC-005 requires that test to pass. Only markdown, graph and delta non-matches become a gap.
- REQ-002 says an empty or missing registry keeps today's behavior. That still holds when evidence matches. A missing-registry lineage whose iterations all go unmatched used to throw and be skipped with a warning. After brief 04 it merges with 0 findings and a counted gap, which is REQ-004's intent. Record this in the `goal.md` log.
- Round 3 grok's registry `keyFindings` are bare strings. `mergeResearchRegistries` (`fanout-merge.cjs:690-691`) drops them from the merged `keyFindings`, while `:761` still counts them in `sourceFindings`. The behavior predates this phase and is out of scope, so the no-match test asserts metrics only.

## Follow-up briefs after the build

Added by the orchestrator on 2026-09-27, after the full suite and the cross-family review. Each is one change, run on cursor Grok 4.7 xhigh fast (codex was at its usage limit).

| Brief | Why | Files | Order |
|-------|-----|-------|-------|
| `15-legacy-shaped-reconstruction-export.md` | The full suite failed one existing test, `result-envelopes.vitest.ts` "legacy shadow parity": brief 04 had added `sourceFindings` and `reconstructionGaps` to the exported `reconstructResearchRegistryFromState`, which the TypeScript shadow mirrors. The body becomes the internal `rebuildResearchRegistryFromState` that `main` calls, and the export becomes a legacy-shaped wrapper. The shadow is out of D2's file list, so it is not edited | `S/scripts/fanout-merge.cjs` | first, parallel with 14 |
| `14-symlinked-delta-test.md` | Review test gap: the delta symlink refusal had no test | `S/tests/unit/fanout-merge.vitest.ts` | parallel with 15 |
| `12-stale-merge-comments.md` | Review P2: the `main` comment still said markdown and graph mismatches throw | `S/scripts/fanout-merge.cjs` | after 15 |
| `13-gap-when-reconstruction-throws.md` | Review P2: REQ-004 says the gap is written "either way", but a throw left a kept registry with no gap | `S/scripts/fanout-merge.cjs`, `S/tests/unit/fanout-merge.vitest.ts` | after 12 and 14 |

Review findings not changed, because the frozen spec sets that behavior: a partial rebuild replaces the registry when it holds more (D3, REQ-004); the kept-registry gap is the count-only sum minus the registry count (AC-004), which undercounts only when structured and count-only records mix, and no committed lineage mixes them; and delta files are read only when a rebuild runs (brief 05's own rule). They are recorded as open items for the owner.
