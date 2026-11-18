# Fix plan

Target: HEAD; head: 6675f479b647233d4737e2bee384a2a2d84e2b50

## In scope

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] C-01 P1 .skilled/skills/system-deep-loop/deep-research/README.md:223 The VERIFICATION table's expected output is contradicted by the command it documents. The row says the script prints `PASS checked 24 script references across 2 workflow YAMLs`; it prints 27 (14 uniqu
  fix: PASS checked 24 script references across 2 workflow YAMLs -> PASS checked 27 script references across 2 workflow YAMLs
- [ ] A-2 P2 .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2465 The comment above frontierNodeVisits states the frontier focus "never repeats its question text", but pickFrontierFocus at line 2491 appends "): ${chosen.question}" after the marker. What actually kee
  fix: // The frontier focus names the node and never repeats its question text: a // question resolves when an iteration's foc -> // The frontier focus starts with the node marker and a question resolves only when // an iteration's focus equals its t
- [ ] B-1 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md:102 The scenario still declares it has no catalogue entry, but the curated entry `deep-research/feature-catalog/state-management/focus-hijack-guard.md` names DR-066 as the scenario that proves it, and thi
  fix: - Feature catalog status: this scenario does not cite a specific catalog entry. -> - Feature catalog status: `feature-catalog/state-management/focus-hijack-guard.md` covers the Next Focus free-text guard
- [ ] C-02 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:186 The `## How It Was Checked` before-and-after row now records a number no run reproduces: `git grep -c -- '--depth-mode'` on `.skilled/commands/deep/research.md` returns 2, not the recorded 1. This sco
  fix: | `git grep -c -- '--depth-mode'` on the research command reference | No match, exit 1 | One match, the flag row | -> | `git grep -c -- '--depth-mode'` on the research command reference | No match, exit 1 | Two matches, the setup default 
- [ ] D2 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:57 The routing prose names 'a convergence check' as one of the requests that fires the hub's research signal, but the hub vocabulary carries 'research convergence', not 'convergence check', so the docume
  fix: the request names autoresearch, a deep research loop, iterative investigation, a convergence check or a research state p -> the request names autoresearch, a deep research loop, iterative investigation, a research convergence check or a researc
- [ ] A-4 P2 .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2484 One file, two definitions of a node visit. pickFrontierFocus (line 2484) and the dashboard Revisits metric (line 3097) count every iteration record whose focus carries the marker, while applyFrontierB
- [ ] X-2 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md:104 Phase 006's user-visible fix (the `findings_not_enumerated` gate and the `focusAlignment` guard read real leaf fields) is the only one of the 13 Feature to Playbook Map rows with no feature-catalog en
- [ ] X-3 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md:48 `--extend-minutes=M` is a new user-visible flag in phase 001 (command rows, both packet catalog entries, REQ-005/AC-005), but no manual scenario exercises it: both extend scenarios pass only `--extend

### unowned

- [ ] PRB-01 P1 -:- Probe P02 "Investigate the retry policy in expansive depth mode, three levels of follow-up questions deep" expected system-deep-loop/research; top-1 was nothing.
- [ ] PRB-02 P1 -:- Probe P03 "Extend a completed research run by three more iterations in the same session" expected system-deep-loop/research; top-1 was system-deep-loop.
- [ ] PRB-03 P1 -:- Probe P04 "Review the payments module in expansive depth mode with a frontier of review sub-targets" expected system-deep-loop/review; top-1 was sk-code/sk-code-review.
- [ ] PRB-04 P1 -:- Probe P07 "Review the release against custom dimensions beyond the four canonical ones" expected system-deep-loop/review; top-1 was sk-code/sk-code-review.
- [ ] BAT-01 P2 -:- S9-command-references failed (exit 1).

### skill:.skilled/skills/system-deep-loop

- [ ] A-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:532 renderFrontierBlock emits the research-only focus instruction ("Copy the Focus Area line exactly into this iteration record's \"focus\"") for the review target too, immediately before the review-speci
  fix: `Copy the Focus Area line exactly into this iteration record's "focus", so the run can tell which node this iteration wo -> ...(mode === 'review' ? [] : [`Copy the Focus Area line exactly into this iteration record's "focus", so the run can tel
- [ ] X-1 P2 .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:35 The hub playbook's coverage note pins the routing it validates to version `2.0.0.0`, but this branch bumps `mode-registry.json`, `hub-router.json`, `description.json` and `SKILL.md` to 2.1.6.0. A read
  fix: Coverage note: the playbook covers the hub's registry-driven routing at version `2.0.0.0`. -> Coverage note: the playbook covers the hub's registry-driven routing at version `2.1.6.0`.
- [ ] A-3 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts:167 The suite's stated invariant (header: "A run that never asks for it must render the same bytes") cannot fail for the one default-path behavior this branch changes. writeFixture writes spec.md, the con
- [ ] D1 P2 .skilled/skills/system-deep-loop/hub-router.json:33 The branch adds expansive depth mode, completed-run extension (completed-continue via --extend) and custom review dimensions, edits the convergence-mode docs, and documents them in the packet SKILL.md
- [ ] D4 P2 .skilled/skills/system-deep-loop/description.json:6 The hub's advisor-facing vocabulary carries no term for the branch's new features. The keywords here and graph-metadata.json's intent_signals - the array the advisor actually scores, per skill_advisor

### spec:specs/system-deep-loop/loop-architecture

- [ ] X-5 P2 specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/implementation-summary.md:157 The implementation summary still says "Pilot not run on the branch" and the completion row says "pilot and full suite open", but the committed goal log records two live target-2 runs: pilot-run-1 FAIL
- [ ] X-6 P2 specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/implementation-summary.md:119 The summary still says "Pilot not run" and its `_memory` block is the untouched scaffold (`completion_pct: 0`, `recent_action: Authored the planned phase docs`, `next_safe_action: Wait for phases 008-

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] X-4 P2 .skilled/skills/system-deep-loop/deep-review/SKILL.md:238 The review Expansive Depth Mode bullet lists `maxChildrenPerNode` 6 as the cap but omits the root seed floor: `frontier-admit.cjs` sets `maxRootChildren = max(6, 8)` for a review seed (`ROOT_CHILDREN_
  fix: `maxDepth` 3, `maxChildrenPerNode` 6, a `0.5/0.35/0.15` budget split across the depth bands -> `maxDepth` 3, `maxChildrenPerNode` 6 (the root seed is capped at 8, so a review seeds 3 to 8 depth-1 sub-targets), a `0.
- [ ] B-2 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md:99 Same stale exception on the review side: `deep-review/feature-catalog/state-management/focus-hijack-guard.md` names DRV-073 as its manual-playbook proof, so the scenario's claim that it cites no catal
  fix: - Feature catalog status: this scenario does not cite a specific catalog entry. -> - Feature catalog status: `feature-catalog/state-management/focus-hijack-guard.md` covers the review Next Focus free-tex
- [ ] C-03 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:174 Same drift as C-02 in the review entry: the before-and-after row states `--depth-mode` appears once in `.skilled/commands/deep/review.md`, and the scope's edit of review.md added a second occurrence a
  fix: | Count of `--depth-mode` in the review command reference | 0 matches at the baseline commit | 1 match, the flag row | -> | Count of `--depth-mode` in the review command reference | 0 matches at the baseline commit | 2 matches, the setup defa
- [ ] D3 P2 .skilled/skills/system-deep-loop/deep-review/SKILL.md:83 The routing prose names 'a spec-folder audit' as a request that fires the hub's review signal, but neither 'spec-folder audit' nor 'spec folder audit' is in review-aliases, so the documented phrase de
  fix: The signal fires when a request names a deep review, a convergence review, a review loop, a release readiness check or a -> The signal fires when a request names a deep review, a convergence review, a review loop or a release readiness check.

### command:deep

- [ ] D5 P2 .skilled/commands/deep/review.md:100 The --depth-mode row was rewritten on this branch (commit 8fda03e7135 introduced it) but kept a pilot-testing chore in shipped command text: '(record the pilot range SHA; ...)'. The command standard's
  fix: before iteration 1 (record the pilot range SHA; merges are pruned as `merge-no-own-diff` and index rebuilds as `generate -> before iteration 1 (merges are pruned as `merge-no-own-diff` and index rebuilds as `generated-artifact`),

## Pre-existing or outside the scope

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B-3 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:9 The root playbook was edited by this change but still lacks the result-persistence completion marker the playbook standard §4 anchors a run's PASS/FAIL/SKIP outcome, reason and evidence paths to; the  (pre-existing (critic))
  fix: # deep-research: Manual Testing Playbook > **EXECUTION POLICY**: -> # deep-research: Manual Testing Playbook <!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT --> > **Result persistence**: 

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] B-4 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:9 The deep-review root playbook has the same gap: no result-persistence marker, so the standard's run-record contract has no declared home in this package even though the shared benchmark tree and the t (pre-existing (critic))
  fix: # deep-review: Manual Testing Playbook > **EXECUTION POLICY**: -> # deep-review: Manual Testing Playbook <!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT --> > **Result persistence**: a 

### unowned

- [ ] D6 P2 .skilled/commands/scripts/validate-command-references.cjs:134 The S9 battery row is red because the checker resolves a runtime-generated path as a missing file. config.ts resolves TELEMETRY_STORE_DIR to <skill root>/runtime/database and access-telemetry.ts write (pre-existing (critic))
  fix: if (/^\.skilled\/skills\/system-deep-loop\/runtime\/database\/[^/]+\.sqlite$/.test(token)) continue; -> if (/^\.skilled\/skills\/system-deep-loop\/runtime\/database\/[^/]+\.sqlite$/.test(token)) continue; // The spec-kit acc

