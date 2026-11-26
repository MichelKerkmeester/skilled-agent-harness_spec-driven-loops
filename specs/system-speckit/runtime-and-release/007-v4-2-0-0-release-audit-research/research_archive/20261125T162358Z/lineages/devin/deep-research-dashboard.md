---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Audit the Skilled v4.2.0.0 release notes against the work shipped since v4.1.0.0, and report what is missing, what has drifted and what is broken.

Inputs, read-only:
- Release notes: .skilled/changelog/skilled/v4.2.0.0.md (926 lines, not tagged yet).
- Window: git range v4.1.0.0..HEAD. The 1084 non-merge commits, one per line as "hash date subject", are in specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt. Use git show, git log -- <path> and git diff on that range for detail.
- Recently touched packets: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt (21 spec folders; read their spec.md and implementation-summary.md).

Definitions:
- MISSING: a user-visible change in the window (a new or removed command, flag, skill, mode, hook, script, default or behavior) that the release notes never mention.
- DRIFT: a release-note claim (a flag, path, count, default, version, test number or behavior) that the current code or docs contradict.
- BUG: a defect in code changed in the window, shown by reading the code or running a read-only command.

Key questions:
1. Which commits in the window change user-visible behavior with no entry in the notes? Check each notes section in turn: Deep Loop, Fan-Out Runs, Dispatch and Safety, Skill Advisor, Installs and Overlays, OpenCode, Browser Use, Skills and Worktrees, How It Was Checked, Upgrade Notes.
2. Which of the 21 recent packets shipped work the notes do not cover, or describe the shipped work differently from the notes?
3. Which concrete claims in the notes (flags, paths, counts, test results, removed items) no longer match HEAD, including work that landed after a section was written?
4. Which changes in the window introduced a bug, a dead reference or a broken cross-link?

Rules: cite a commit hash and a file:line for every finding, plus the release-notes line it concerns. Mark each finding MISSING, DRIFT or BUG with a severity of P0, P1 or P2. Say when you could not confirm something. Do not edit any file outside your own research lineage folder.
- Started: 2026-11-25T08:05:26Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-devin-1795593886068-na5znl
- Parent Session: 2026-11-25T08:04:38Z
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Section-to-commit inventory for Deep Loop, Fan-Out Runs, Dispatch and Safety | release-notes-audit | 1.00 | 8 | complete |
| 2 | Remaining seven notes sections and the DRIFT candidates | release-notes-audit | 0.50 | 1 | complete |
| 3 | The 21 recent packets against the notes | release-notes-audit | 1.00 | 1 | complete |
| 4 | Defects in window code | release-notes-audit | 1.00 | 1 | complete |
| 5 | Remaining numeric claims | release-notes-audit | 1.00 | 1 | complete |
| 6 | Fix-commit sweep for user-visible changes | release-notes-audit | 1.00 | 3 | complete |
| 7 | Narrative claims, cited versions and the component list | release-notes-audit | 1.00 | 1 | complete |
| 8 | Overlay adopt, re-pin and doctor update paths | release-notes-audit | 0.10 | 0 | insight |
| 9 | Consolidated audit | release-notes-audit | 0.10 | 0 | insight |
| 10 | Audit completion and artifact confirmation | release-notes-audit | 0.00 | 0 | complete |

- iterationsCompleted: 10
- keyFindings: 17
- openQuestions: 0
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/4
- [x] Which commits in the window change user-visible behavior with no entry in the notes? Check each notes section in turn: Deep Loop, Fan-Out Runs, Dispatch and Safety, Skill Advisor, Installs and Overlays, OpenCode, Browser Use, Skills and Worktrees, How It Was Checked, Upgrade Notes.
- [x] Which of the 21 recent packets shipped work the notes do not cover, or describe the shipped work differently from the notes?
- [x] Which concrete claims in the notes (flags, paths, counts, test results, removed items) no longer match HEAD, including work that landed after a section was written?
- [x] Which changes in the window introduced a bug, a dead reference or a broken cross-link?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▆▅▆█████████▇▄▂▂▂▁▁
- score sparkline: █▆▅▆█████████▇▄▂▂▂▁▁
- Last 3 ratios: 0.10 -> 0.10 -> 0.00
- Stuck count: 1
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.00
- coverageBySources: {"code":86,"other":93}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Count drift.** "14 skills" matches the 14 tracked top-level `SKILL.md` files; "seventeen" doctor commands matches the 17 `*.md` files under `.skilled/commands/doctor/`; the `/doctor:setup` target table has exactly 26 rows; `/doctor:skill-advisor` lists 6 targets; the advisor lockfile has 111 packages and the spec-kit lockfile 313, matching the notes' cost block. (iteration 1)
- **Counting the Python scorer tests from source.** The fallback test file has 22 `def test_` functions but runs case tables, so 130 and 138 cannot be reconciled by counting. Deferred to a later iteration with a direct suite run or a test-record source. (iteration 1)
- **Deep Loop section drift.** Every sampled claim held: `--depth-mode=expansive` and both frontier cap flags are documented in `.skilled/commands/deep/research.md:3,109-111` and `review.md:3,102-104`; the frontier defaults are 3 deep and 6 children; the budget split is 50/35/15; the blocked thresholds are 2 for review and 3 for research (`convergence.cjs:1595`, `deep-review-config.json:23`, `deep-research-config.json:17`); `blockedStop` is emitted (`convergence.cjs:1177`); and the `blocked_stop` row exists (`convergence.cjs:1511`). (iteration 1)
- **Dispatch section drift.** The 20 MB cap and `ENOBUFS` verdict exist (`executor-audit.ts:1515`, `fanout-run.cjs:5853`); `iterations/iteration-NNN.cost.json` is written with `providerCostUsd` (`dispatch-iteration.cjs:451,472`); and `SPECKIT_ALLOW_HOST_SESSION_EXECUTOR` relaxes only ancestry and env (`executor-audit.ts:42`). (iteration 1)
- **Fan-Out section drift.** `--status`, `--stop` and `--only-lineage` exist (`fanout-run.cjs:37,1526,2021`); a one-lineage matrix is refused (`fanout-run.cjs:4944`); a native lineage is refused (`fanout-run.cjs:4649`); the stop grace is 2,500 ms (`fanout-run.cjs:1463`); `survivors` is returned (`fanout-run.cjs:1536`); and `provider_cost_usd` is emitted (`fanout-run.cjs:6142`). (iteration 1)
- **Removal drift.** `--allow-single-lineage` has no remaining reference; `opencode2` has no reference in the deep-loop runtime; `.skilled/skills/cli-orca` is gone; `dualPlugin` is gone from `v2-bridge.js` (`definePlugin` at line 327); `nativeDual` is gone from `plugin-inventory.json` (`selfRegistered` instead); `.skilled/manual-testing-playbook/` is gone. (iteration 1)
- **Treating the 10-folder "Spec folders" block as the coverage list.** It lists 10 packets while `recent-packets.txt` holds 21, but the block is metadata, not a coverage claim; the packet-coverage question needs the per-packet check scheduled for a later iteration. (iteration 1)
- **Anchor or component-list drift.** All 63 internal links resolve, and every named component has a release entry. (iteration 2)
- **Browser pin drift.** Bladebro v4.8.2, bdg 0.6.10, three modes and eight hubs all match. (iteration 2)
- **Doctor count drift.** 17 commands, 26 setup rows, 6 advisor targets, 5 install steps and 66 scenarios all match. (iteration 2)
- **OpenCode drift.** The major-2-only rule, the two-mode helper, the retired launcher names, the 18-subcommand shim and the v2 battery workflow all match HEAD. (iteration 2)
- **Overlay layout drift.** The notes' layout, relayout, sibling-folder, audit and cache claims match the engine and its reference doc line for line. (iteration 2)
- **Reconciling 2,450 and 3,557 advisor suite totals.** The rows are labelled differently ("Advisor runtime suite" vs "with the loop offers"), so they may be two suite configurations rather than a contradiction. No HEAD run exists in the packet to settle it; recorded as an observation, not a finding. (iteration 2)
- **Running the advisor or deep-loop suites to get HEAD counts.** Out of scope: a suite run writes test artifacts outside the lineage directory, which the dispatch forbids. (iteration 2)
- **`013-deep-loop-offer-in-hint` as a MISSING.** It is unlisted but its shipped behavior is described by the notes' "The Advisor Offers the Loop With Its Flags" section. (iteration 3)
- **A second sk-git version gap.** `v1.11.14.0` changes only the claim that `create` is idempotent; it is a documentation correction, not user-visible behavior. (iteration 3)
- **The eight unlisted packets that shipped nothing.** `005-skill-readability-refinement`, `001-hub-routing-quality`, `003-changelog-system`, `007-alignment-lane-runner`, `001-headless-bots-first-build`, `002-session-handover-loop` and `mcp-code-mode` have only `docs(specs)`, `chore(specs)` or `refactor(specs)` commits in the window, so their absence from the notes is correct. `001-headless-bots-first-build`'s own latest child states "Planned, not started." (iteration 3)
- **Using packet commit counts as a shipping signal without filtering commit types.** The first count said all 21 were touched and suggested several shipped; filtering `docs`/`chore`/`merge` reduced that to nine packets with shipped work. The unfiltered count would have produced false MISSING findings. (iteration 3)
- **A band budget that carries upward.** `carry` is set from the current band's remainder and applied to the next band only. (iteration 4)
- **A fan-out stop that records a live lineage as stopped.** The confirmation loop re-reads the process table and filters survivors on every pass until the grace expires. (iteration 4)
- **A gate that reads rows by the wrong id.** `_DEEP_LOOP_RUN_ROWS` maps only the bridge id, but the gate runs before `normalize_command_bridge_recommendations`, so that is the id the rows carry at that point; the ordering helper runs after and accepts both ids. (iteration 4)
- **A pass-evidence off-by-one on a same-millisecond commit.** The window uses an exclusive start and an inclusive end, which is correct for sequential commits; a same-millisecond pair yields an empty window, not a misattributed call. (iteration 4)
- **An incomplete cli-orca removal.** All runtime mirrors and live trees are clean. (iteration 4)
- **Running the advisor suite or the Python fallback to observe the gate.** Both would write outside the lineage directory (a test artifact or a SQLite file), which the dispatch forbids. The gate's behavior was established by reading the code instead. (iteration 4)
- **Finding the README-check script behind "79 of 79".** No script in the deep-loop tree reports that count, so the figure stays UNKNOWN. (iteration 5)
- **Pinned-file-count drift.** The 187-file figure is explicitly pinned to `46465394d97` and matches that commit. (iteration 5)
- **Plugin-count drift.** The plugin count is exactly 20. (iteration 5)
- **Running the advisor, deep-loop or doctor suites to settle their totals.** Each writes test artifacts or coverage databases outside the lineage directory, which the dispatch forbids. Those totals stay UNKNOWN with the exact command that would settle them. (iteration 5)
- **Shared-case drift.** 368 matches. (iteration 5)
- **The 595-file figure as a tree count.** It does not describe the whole tree, but the notes present it as a quality-gate scope, which the gate computes over a selected file set; calling it drift would be unsupported. (iteration 5)
- **Reading every one of the 165 `fix(system-deep-loop)` commits in full.** The subject filter plus the notes' folded blocks reduced the set to a handful of clusters; opening all of them would have consumed the budget without a better answer. (iteration 6)
- **The Pi fix as a DRIFT.** It restores a default the notes never state, so it is a MISSING entry rather than a contradiction. (iteration 6)
- **The sk-doc hub-vocabulary failure as a separate BUG.** The commit is itself the fix; at HEAD the router and the trigger line agree, so no defect remains. (iteration 6)
- **Treating every `fix` subject as a MISSING candidate.** Most fix subjects restate behavior the notes already describe in a folded "Smaller fixes" block; only three clusters survived the check against the notes' text. (iteration 6)
- **A breaking-change item that no longer holds.** All twenty were checked and hold at HEAD. (iteration 7)
- **A missing entry for a listed component.** Every one of the fourteen named components has changelog commits in the window. (iteration 7)
- **A wrong cited version.** Both cited versions exist exactly as named. (iteration 7)
- **Reproducing the "2 of 26 plain loop asks" routing-analysis figure.** No committed corpus carries that slice, so the number stays UNKNOWN rather than contradicted. (iteration 7)
- **A doctor update that cleans before rebuilding.** The phase order puts the cleanup last. (iteration 8)
- **A relayout that leaves a half state.** The restore path covers every move, the manifest write and each relink. (iteration 8)
- **An adopt path that ships a credential file.** Both the `.env` and the token-named refusals run per file before any copy. (iteration 8)
- **An adopt that writes outside the overlay folder.** The link guard resolves the source and refuses an escape. (iteration 8)
- **Executing an adopt or relayout against a real tree.** Both write outside the lineage directory, which the dispatch forbids; the refusals were read from the code instead. (iteration 8)
- Large suite totals (advisor 2,450/3,557, deep-loop 4,039, doctor 1,673+19) and the live cost figures remain UNKNOWN because reproducing them needs a suite run outside the lineage write boundary. (iteration 9)
- The "2 of 26 plain loop asks" analysis figure has no committed corpus and stays UNKNOWN. (iteration 9)
- **A missing or duplicated artifact.** Every iteration has exactly one narrative and one delta, and the state log has exactly one record per iteration. (iteration 10)
- **A stale registry.** The registry's counts match the iteration files. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
