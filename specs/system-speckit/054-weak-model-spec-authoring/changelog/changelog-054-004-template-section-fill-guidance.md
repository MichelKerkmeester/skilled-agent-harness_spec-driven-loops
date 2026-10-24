---
title: "Changelog: Phase 4: template-section-fill-guidance [054-weak-model-spec-authoring/004-template-section-fill-guidance]"
description: "Chronological changelog for the Phase 4: template-section-fill-guidance phase."
trigger_phrases:
  - "weak model spec authoring template section fill guidance changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-24

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance` (Level 3)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Every `## ` section in the four core templates now carries one `<!-- FILL: ... -->` line with a good and a weak example about the `--quiet` flag, and so does every content section in the ten addon templates. Seven anchor placements that crossed a level gate are repaired, 14 hand-written examples are aligned with the template contract, and two guards stop the result from drifting.

### Added

- Refresh the golden snapshots ($S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap). Run cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts -u, then run the same command without -u. Then prove the test notices a render change. The mutation adds one Level 1-only line, so exactly one of the 12 tests fails. Verify: the first two runs print Tests 12 passed (12), grep -F 'Tests 1 failed | 11 passed (12)' "$PHASE/scratch/test/golden-mutation.txt" prints that line, tail -1 "$PHASE/scratch/test/golden-mutation.txt" prints exit=1, the final run prints Tests 12 passed (12), and git -C "$WORKTREE" diff --name-only -- "$S/runtime/cli/tests/snapshots/" prints exactly one path.
- Compare the anchor counts with the baseline (scratch/baseline/anchor-counts-after.txt). Run the T003 loop again, writing to the new file, then diff "$PHASE/scratch/baseline/anchor-counts.txt" "$PHASE/scratch/baseline/anchor-counts-after.txt". Verify: diff prints nothing and exits 0, and wc -l on the new file prints 16.
- Close the phase (this folder, goal.md, acceptance-criteria.md, implementation-summary.md). Fill implementation-summary.md, mark each acceptance-criteria.md row, and write the close entry in goal.md section 4. Verify: validate prints RESULT: PASSED, every acceptance row is Met, and git status --porcelain lists only the allowed paths.
- Commit locally. Add only this phase's paths, confirm git diff --cached --name-only holds nothing else, then commit with no pathspec. Never push. Verify: git log -1 --stat lists only allowed paths and git status --porcelain shows no phase 004 path dirty.
- CHK-051 The three new runtime files sit at the paths named in spec.md section 3
- CHK-131 No new dependency was installed

### Changed

- Check tools and the phase 003 result (scratch/baseline/locator-form.txt). Run mkdir -p "$PHASE/scratch/baseline" "$PHASE/scratch/briefs" "$PHASE/scratch/runs" "$PHASE/scratch/review" "$PHASE/scratch/test", node --version, cd "$S" && ./node_modules/.bin/vitest --version, which rg awk git, rg -c 'YOUR_VALUE_HERE' "$S/templates/core/spec.md.tmpl" || echo 0, then printf 'TOKEN=%s\n' "$(rg -c 'YOUR_VALUE_HERE' "$S/templates/core/spec.md.tmpl" || echo 0)" > "$PHASE/scratch/baseline/locator-form.txt". Verify: the first two lines hold a version, the next three hold a path, and cat "$PHASE/scratch/baseline/locator-form.txt" prints one TOKEN= line. A number above 0 selects the post-003 locator form in plan.md section 3 and 0 selects the pre-token form.
- Record the anchor baseline (scratch/baseline/anchor-counts.txt, scratch/baseline/anchor-lists.txt). Run this from $WORKTREE. Verify: wc -l < "$PHASE/scratch/baseline/anchor-counts.txt" prints 16, wc -l < "$PHASE/scratch/baseline/anchor-lists.txt" prints 16, grep -c '^1 spec 7$' "$PHASE/scratch/baseline/anchor-counts.txt" prints 1, grep -c '^3+ plan 17$' "$PHASE/scratch/baseline/anchor-counts.txt" prints 1, and grep -c '^1 spec: metadata problem questions requirements risks scope success-criteria$' "$PHASE/scratch/baseline/anchor-lists.txt" prints 1.
- Record the golden baseline (no file). Run cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts. Verify: the output contains Tests 12 passed (12).
- Write the two guards and the fill test ($S/runtime/cli/spec/check-example-drift.sh, $S/runtime/cli/tests/example-drift.vitest.ts, $S/runtime/cli/tests/template-fill-guidance.vitest.ts). Write the three files exactly as they appear in the code blocks below, then run chmod +x "$S/runtime/cli/spec/check-example-drift.sh". Verify: bash -n "$S/runtime/cli/spec/check-example-drift.sh" exits 0 and ls -1 "$S/runtime/cli/spec/check-example-drift.sh" "$S/runtime/cli/tests/example-drift.vitest.ts" "$S/runtime/cli/tests/template-fill-guidance.vitest.ts" prints the three paths.
- Record the failing-first result (scratch/test/failing-first.txt). Run the fill test before any template edit, then run the drift guard on a broken copy. Verify: cat "$PHASE/scratch/test/failing-first.txt" prints exactly two lines, fill test: 16 failed and drift guard: description holds an HTML comment tail, and tail -1 "$PHASE/scratch/test/drift-before.txt" is not guard exit=0.
- Run the fill test (no file). Run cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/template-fill-guidance.vitest.ts --config vitest.config.ts. Verify: the output contains Tests 16 passed (16).

### Fixed

- Record the start state (goal.md, scratch/baseline/status-start.txt, scratch/baseline/suite-start.txt). Run git -C "$WORKTREE" rev-parse HEAD, write the row | Start commit | Recorded | <hash> | into the Progress table in goal.md section 4 with <hash> replaced by that output, run git -C "$WORKTREE" status --porcelain > "$PHASE/scratch/baseline/status-start.txt", then run npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/baseline/suite-start.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/baseline/suite-start.txt". Verify: grep -c 'Start commit' "$PHASE/goal.md" prints 1 and tail -1 "$PHASE/scratch/baseline/suite-start.txt" prints an exit= line.
- [P] Lane A: fill spec.md.tmpl and plan.md.tmpl and repair the spec crossings ($S/templates/core/spec.md.tmpl, $S/templates/core/plan.md.tmpl). Write the brief to scratch/briefs/T007-A.txt from the skeleton in plan.md section AI EXECUTION PROTOCOL, then append the lane text below. Dispatch with the Task tool: subagent_type general, description T007-A, prompt = the full text of $PHASE/scratch/briefs/T007-A.txt. When the subagent returns, write its final reply verbatim to $PHASE/scratch/runs/T007-A.txt with the write tool. Verify: rg -c '<!-- FILL: ' on the two files prints 24 and 18, the awk crossing command from plan.md section 3 on the two files prints nothing, bash "$S/runtime/cli/templates/inline-gate-renderer.sh" --level 2 "$S/templates/core/spec.md.tmpl" | awk '/<!-- ANCHOR:/{o++} /<!-- \/ANCHOR:/{c++} END{print "open="o" close="c}' prints open=10 close=10, and the Level 1 and Level 3 anchor counts still match scratch/baseline/anchor-counts.txt.
- [P] Lane B: fill tasks.md.tmpl, implementation-summary.md.tmpl and every addon template, and repair the research crossings ($S/templates/core/tasks.md.tmpl, $S/templates/core/implementation-summary.md.tmpl, $S/templates/addons/*.tmpl). Write the brief to scratch/briefs/T008-B.txt, then dispatch with the Task tool: subagent_type general, description T008-B, prompt = the full text of $PHASE/scratch/briefs/T008-B.txt. When the subagent returns, write its final reply verbatim to $PHASE/scratch/runs/T008-B.txt with the write tool. Verify: rg -c '<!-- FILL: ' prints 22 for tasks, 6 for implementation-summary and these ten addon counts: acceptance 3, before-after 5, debug-delegation 5, decision-record 1, goal 4, handover 5, research 20, resource-map 11, roadmap 4, timeline 3. The awk crossing command on research.md.tmpl prints nothing, and bash "$S/runtime/cli/templates/inline-gate-renderer.sh" --level 2 "$S/templates/addons/research.md.tmpl" | awk '/<!-- ANCHOR:/{o++} /<!-- \/ANCHOR:/{c++} END{print "open="o" close="c}' prints open=9 close=9.
- [P] Lane C: align the 14 examples in the plan's alignment table ($S/templates/examples/level-/). Write the brief to scratch/briefs/T009-C.txt, then dispatch with the Task tool: subagent_type general, description T009-C, prompt = the full text of $PHASE/scratch/briefs/T009-C.txt. When the subagent returns, write its final reply verbatim to $PHASE/scratch/runs/T009-C.txt with the write tool. Phase 002 owns the 18 description repairs and must be closed first: on a pre-002 tree the guard reports 18 description failures, so EXAMPLE_DRIFT_OK is expected only on the post-002 tree. Verify: bash "$S/runtime/cli/spec/check-example-drift.sh" prints EXAMPLE_DRIFT_OK.
- Run the drift guard and its wrapper (no file). Run bash "$S/runtime/cli/spec/check-example-drift.sh" and cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/example-drift.vitest.ts --config vitest.config.ts. The guard passes only on the post-002 tree, because phase 002 repairs the 18 example descriptions. Verify: the first prints EXAMPLE_DRIFT_OK and the second prints Tests 1 passed (1).
- Run the full gate (no file). Run npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/baseline/suite-after.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/baseline/suite-after.txt", then bash "$S/runtime/cli/spec/validate.sh" "$PHASE" --strict, then git -C "$WORKTREE" status --porcelain. Verify: tail -1 suite-after.txt prints exit=0, the suite adds exactly 17 tests over suite-start.txt (16 fill tests and 1 drift test) and changes no existing test result, validate prints RESULT: PASSED with Errors: 0, and the status list holds only the paths named in spec.md section 3 plus this phase folder.

### Verification

- Strict validation of this phase folder - RESULT: PASSED
- Fill test, 16 renders - Tests 16 passed (16)
- Golden snapshots - Tests 12 passed (12) without -u, mutation probe 1 failed and 11 passed (12)
- Example drift guard - EXAMPLE_DRIFT_OK, wrapper Tests 1 passed (1)
- Anchor counts - diff of the 16-line baseline and after files printed nothing
- Crossing command - Printed nothing on every .tmpl
- Full suite - Start and end both exit=0. The second vitest run grew from 2067 to 2084 tests (17 added) and from 181 to 183 files. The first run is unchanged at 4162 tests
- Frontier review - 9 lines: 1 P1 and 1 P2 fixed, 7 P2 recorded in goal.md section 4

### Files Changed

| File | Action | What changed |
|---|---|---|
| `templates/core/*.md.tmpl (4)` | Modified | 70 fill lines and four spec anchor repairs |
| `templates/addons/*.md.tmpl (10)` | Modified | 61 fill lines and three research anchor repairs |
| `templates/examples/level-/.md (14)` | Modified | Anchors aligned, content kept |
| `runtime/cli/spec/check-example-drift.sh` | Created | Read-only example drift guard |
| `runtime/cli/tests/example-drift.vitest.ts` | Created | Wires the guard into the suite |
| `runtime/cli/tests/template-fill-guidance.vitest.ts` | Created | 16 renders, one fill line per section, anchor counts pinned |
| `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modified | Regenerated with -u after the template edits |
| `spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md, implementation-summary.md` | Modified | Plan rows B01, B02 and B21 follow the review fix, the rest records evidence |

### Follow-Ups

- One fill line per section, not per hint. A section with eight tokens has one governing instruction. The tokens stay field-level prompts.
- The drift guard checks anchors and descriptions, not prose quality. The frontier review read the prose at phase close.
- The packet types are out of scope. templates/packet-types serves research and review packets and keeps its current guidance.
- Only five sections carry the delete option. The contract marks 20 or more optional anchors. The review's six other P2 lines and the out of order sections in the Level 3+ implementation summary example are open for the operator.
- A leftover fill comment is not a placeholder. The gate does not count it, so a filled document can still carry the line.
