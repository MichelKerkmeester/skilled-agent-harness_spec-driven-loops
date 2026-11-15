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
- Topic: Review the decision-capture series before building its follow-ups. (1) What was built in 001-decision-capture-build (the PostToolUse capture hook, the transcript sweeps, the decision-record writer and save step, the Stop-hook nudge, the playbook scenarios): defects, weak spots, and what to improve. Known real-use gap: answers recorded by hand as table rows in another packet's decision record keep counting as pending. (2) The planned children 002-table-row-matching, 003-codex-and-pi-capture, 004-opencode-devin-live-capture, 005-chat-question-detection and 006-live-conversation-test: should any be changed, merged, split, re-ordered or planned differently? Is anything missing? (3) How 006 depends on the shared conversation runner planned in specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios, and whether the contract between them is right. Cite code and spec lines.
- Started: 2026-11-01T21:42:07.374Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Session ID: 2026-11-01T21:42:07.374Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | The 001 build: capture core, Claude PostToolUse hook, the three sweeps, decision-record-writer.ts with its tests, and the Stop-hook nudge, with a code-level trace of why hand-written table rows stay pending | decision-capture-001-audit | 0.87 | 18 | complete |
| 2 | Q4: how 006-live-conversation-test depends on the shared conversation runner in specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios, and whether that contract is right and complete | cross-packet-contract | 0.95 | 13 | complete |
| 3 | Q3: should children 002 to 005 be changed, merged, split, re-ordered or planned differently, and is any follow-up missing; Q5: do the three decision-capture playbook scenarios prove what 001 claims, and what must the 006 conversation scenario assert that they do not | series-shape-and-evidence-coverage | 0.92 | 20 | complete |

- iterationsCompleted: 3
- keyFindings: 51
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What defects or weak spots exist in the 001 build (capture core, Claude PostToolUse hook, transcript/OpenCode/Devin sweeps, decision-record writer and save wiring, Stop-hook nudge), and what should be improved?
- [x] Why do answers recorded by hand as table rows in another packet's decision record keep counting as pending, and is 002's planned matching the right fix?
- [x] Should any of the planned children 002 to 005 be changed, merged, split, re-ordered or planned differently, and is any follow-up missing?
- [x] How does 006 depend on the shared conversation runner in specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios, and is the contract between them right and complete?
- [x] Do the three decision-capture playbook scenarios prove what 001 claims, and what must the 006 conversation scenario assert that they do not?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▁▂▂▃▄▅▅▆▇███▇▇▇▆▆▆▆▅
- score sparkline: ▁▂▂▃▄▅▅▆▇███▇▇▇▆▆▆▆▅
- Last 3 ratios: 0.87 -> 0.95 -> 0.92
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.92
- coverageBySources: {"code":13,"other":65}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **A global (all-session) pending sweep.** No code enumerates the queue directory; the sweeps all take one session id from one transcript/db. A "the sweep already shows everything" assumption is ruled out. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:214] (iteration 1)
- **Assuming a table-row match path exists behind a flag.** No flag, no branch, no regex reads a decisions-table row's text anywhere in the writer. This is a capability gap, not a misconfiguration — a candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for it. (iteration 1)
- **Blame the hook for the 33.** The hook captured all 35 records (`sources: {"hook":30}` at 002's measurement, hook+capture for the rest); the failure is entirely downstream, at consumption. Capture is not the defective stage here. (iteration 1)
- **Reading pending from the decision record instead of the queue.** `pendingRecords` never opens a decision record; the only cross-check between record and log is the writer's own id-reuse during a save. Any theory that pending is computed by parsing records is ruled out by the code. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:334] (iteration 1)
- **Treating `consumed.jsonl` as a verifiable mapping.** It stores no answer text, so it cannot be validated after the fact. Any later iteration planning verification around that file must build the evidence itself. (iteration 1)
- **Any assumption that S12 can be expressed in the same `json conversation` block.** Two independent constraints close it (one `env` per script; second block invalid). No variation of the stage wording reopens it. Candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for a per-turn env hook. (iteration 2)
- **Any assumption that the runner writes per-stage rows.** The evidence list is exhaustive by enumeration and contains no stage verdict file. Same promotion candidate. (iteration 2)
- **Blaming 006 alone for the verdict mismatch.** Tried: classify DEVIATION/N/A as 006 inventing marks. Failed: 065's parent already logged it and assigned the correction to 043/006, so it is a shared, known, unresolved seam rather than a unilateral error. It is still unowned in practice. (iteration 2)
- **Reading 065 as an implementation dependency only.** Tried: treat the runner as an opaque command and check only that 006's stages call it. Failed: the format is a closed key set, so 006's stage semantics are constrained by `turns[].check` and `env` at authoring time, not at run time. The dependency is a design-time coupling. (iteration 2)
- **Treating the missing `checkpoints.tsv` as a 065 gap.** Tried: propose 065 emit it. Failed: 065's evidence contract is complete for its own purpose (per-runtime verdicts), and a decision-capture stage table is 006's private data shape. The gap is 006 not declaring the derivation, not 065 withholding a file. (iteration 2)
- **Any assumption that the writer scenario's `git status` proves the real repository was untouched.** `--untracked-files=no` over a gitignored state directory cannot fail on the write it names (finding 8). Do not build later verification on that command. (iteration 3)
- **Any attempt to make the playbook scenarios cover the consumption loop by adding a command.** The scenarios' contract is "run these commands, observe the signals"; the loop spans a save, a queue and a nudge across turns. A single-command assertion of it would be a worse 006, so the playbook should be corrected down to what it proves (a PASS on the record write) and the loop asserted in 006. Promotion candidate for "Exhausted Approaches". (iteration 3)
- **Assuming the four-mark verdict vocabulary spreads across the series.** Tried: take iteration 2's inference that 002 to 005 each inherit it. Failed on one grep: the only occurrence outside 006's prose is 006's own AC-005 (finding 12). (iteration 3)
- **Splitting 004's cross-runtime nudge into a new child.** Tried: read REQ-006 as a separate operator-surface change with its own evidence. Failed: it is the same Stop hook 001 shipped, widened by runtime, and its evidence is still a nudge count in 006's matrix — no independent artifact, so no child (finding 18, finding 20b). (iteration 3)
- **Treating 006's results matrix and 006's stages as interchangeable carriers of sibling evidence.** Tried: read REQ-011 as licence for siblings to add stages and matrix rows together. Failed: no sibling adds a stage, and AC-005 fixes the file at 13 rows, so the two mechanisms are mutually exclusive in practice (finding 11). (iteration 3)

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
