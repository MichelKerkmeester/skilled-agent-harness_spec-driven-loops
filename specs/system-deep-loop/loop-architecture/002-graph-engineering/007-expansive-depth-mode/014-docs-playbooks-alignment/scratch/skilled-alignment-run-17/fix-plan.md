# Fix plan

Target: HEAD; head: 9f456e735c2a901b1c643ed45325132ebd146d17

## In scope

### skill:.skilled/skills/system-deep-loop

- [ ] A1-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:797 The comment claims admission 'can only prune' a proposal under a closed node, but checkProposal (lines 525-527) prunes only a child of a missing or pruned parent. A child of a node closed as answered,
  fix: // A closed node's block would invite proposals admission can only prune. -> // A closed node gets no block, so no leaf is invited to propose under it.
- [ ] B3-3 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md:51 The Validation And Tests row types executor-audit-cli-branch-receipts.test.ts as 'Node test'. The file imports from 'vitest', and runtime/vitest.config.ts runs it through the tests/**/*.{vitest,test}.
  fix: | Node test | -> | Vitest |
- [ ] B4-1 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md:54 The entry claims (section 2, Attempt Identity) that runtime/scripts/divergent-pivot.cjs carries the attempt number and retry signal through its prepare and finalize subcommands, but its Validation And
  fix: | `.skilled/skills/system-deep-loop/runtime/tests/unit/divergent-pivot-seat-scope.vitest.ts` | Vitest | Seat-count scope -> | `.skilled/skills/system-deep-loop/runtime/tests/unit/divergent-pivot-seat-scope.vitest.ts` | Vitest | Seat-count scope
- [ ] B3-1 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md:31 DLR-060's Expected signals say 'the four prompt-pack cases pass', but no set of four exists. Command 3 runs all of tests/unit/prompt-pack.vitest.ts with no -t filter, and the 'research prompt pack and
  fix: the four prompt-pack cases pass -> every prompt-pack case passes
- [ ] B3-2 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:223 The root summary for DLR-060 repeats the stale 'the four prompt-pack cases passing' signal. The command it summarizes runs the whole prompt-pack suite, and the lockstep group holds five cases, so the 
  fix: the four prompt-pack cases passing -> every prompt-pack case passing
- [ ] C4-2 P2 .skilled/skills/system-deep-loop/README.md:31 The hub README's runtime summary lists what the shared runtime holds but leaves out the frontier node store this scope adds (runtime/scripts/frontier-admit.cjs, read by convergence.cjs for the frontie
  fix: The shared `runtime/` beneath both modes holds executor config, prompt-pack rendering, atomic state and the coverage gra -> The shared `runtime/` beneath both modes holds executor config, prompt-pack rendering, atomic state, the coverage graph 
- [ ] A1-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:216 dedupeKey's prefix regex /^[a-z]{1,2}-?\d+(?:-\d+)*\s*:\s*/ strips more than the question ids the comment at lines 210-213 promises (Q3, RQ-12, F-1-001). After lowercasing, ordinary technical tokens s
- [ ] A1-3 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:1016 readProposalRows swallows a JSON.parse error with an empty catch and no comment. A torn frontier_proposal line in the leaf's delta is dropped with exit 0: nothing goes to stderr, and no pruned row is 
- [ ] A1-4 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts:471 The new CLI's fail-closed paths have no test. These include exit 2 with '--known-texts must hold a JSON array' (frontier-admit.cjs:991), the non-array seed input (line 997), an unknown command (line 1
- [ ] A2-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1955 The review reducer leaves visits out of the frontier count when they failed (FRONTIER_FAILED_STATUSES, line 33, applied in reviewFrontierVisits at line 1955 and in buildReviewFrontier's covered-dimens
- [ ] A2-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1965 review.maintainability (repeated logic that behaves differently). The review and research reducers each hold their own copy of the frontier projection: the 50/35/15 band budget, the roll-down, FRONTIE
- [ ] A4-1 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:648 The new extension helpers readJson and stateRows return Record<string, any> (lines 648, 649, 652, 656). The resolver places this file in the SKILLED surface, whose universal checklist (Type Safety) sa
- [ ] A4-2 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts:182 researchPackPath reads process.env.DEEP_RESEARCH_PACK_TEMPLATE at module scope. The comment says the override exists for the lockstep case, but the same path feeds every research-pack case: the render
- [ ] B3-4 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:133 This change adds per-group test counts to the Validation And Tests rows: fanout-run.md:133 has '(13 tests ...)' and '(4 tests ...)', and fanout-merge.md:103 has '(7 tests)', '(6 tests)' and '(9 tests)
- [ ] C3-1 P2 .skilled/skills/system-deep-loop/changelog/v2.1.7.0.md:40 The shared runtime changed heavily in this range (23 files under system-deep-loop/runtime/lib and runtime/scripts, including the new frontier-admit.cjs, the divergent-pivot quorum retry, the landed-it

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B1-1 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:229 NEVER rule 7 says the leaf agent never edits research/research.md. That is the opposite of shipped behavior. This diff's prompt pack (assets/prompt-pack-iteration.md.tmpl ALLOWED WRITE PATHS) grants t
  fix: The leaf agent writes findings to its own iteration file and never edits `research/research.md`, which the workflow rebu -> The leaf agent writes findings to its own iteration file, adds to `research/research.md` only when `progressiveSynthesis
- [ ] B1-2 P2 .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:179 Iteration step 7 tells the leaf to leave research/research.md to the workflow. This diff's prompt pack and the agent definition allow a progressive synthesis write when progressiveSynthesis is true. T
  fix: 7. Leave `research/research.md` to the workflow, which owns it through synthesis -> 7. Add to `research/research.md` only when `progressiveSynthesis` is `true`; the workflow owns the file and finalizes it
- [ ] B1-3 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:172 'Without the flag, the prior budget carries over' reads as an unchanged duration budget. The shipped extend step adds the prior budget again: addedMinutes defaults to priorMaxDurationMinutes, so the n
  fix: Without the flag, the prior budget carries over. -> Without the flag, M defaults to the prior budget.
- [ ] B1-4 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:169 The state-file list adds frontier-nodes.jsonl for an expansive run but leaves out research/frontier-seed.json. The seed step writes that file on an expansive run as the input to frontier-admit.cjs see
  fix: plus `frontier-nodes.jsonl` on an expansive run. -> plus `frontier-nodes.jsonl` and `frontier-seed.json` on an expansive run.
- [ ] C1-2 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:150 The budget item states the floor only for a native fan-out lineage dealt no seed node. The shipped code and every other doc (README, loop-protocol.md, convergence.md) say a CLI lineage runs at 10. A C
  fix: - A native fan-out lineage dealt no seed node runs 12 iterations. -> - A fan-out lineage dealt no seed node runs at its floor: 12 iterations for a native lineage, 10 for a CLI one.
- [ ] C1-3 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:138 The list of stops the frontier veto never outranks leaves out the max-duration stop. SKILL.md, convergence.md and the expansive-depth-mode catalog entry all name it, so a reader of the changelog could
  fix: - Consecutive failures, stuck recovery and pause still win. -> - Consecutive failures, stuck recovery, pause and the max-duration stop still win.
- [ ] C1-5 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:75 'Its waiver awaits operator sign-off.' is process status, not a reader-facing change. sk-create-changelog SKILL.md section 8 item 2 says to drop process detail, and this sentence goes stale once the s
  fix: - That paragraph has no effect on a default run. - Its waiver awaits operator sign-off. -> - That paragraph has no effect on a default run.
- [ ] C1-1 P2 .skilled/skills/system-deep-loop/deep-research/README.md:109 The README's research-packet artifact table gained the two expansive files frontier-nodes.jsonl and frontier-seed.json, but not frontier-graph-events.json, which step_frontier_graph_upsert writes into
- [ ] C1-4 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:133 The scope changed how two opt-in modes combine, and no changelog entry says so: under --convergence-mode=divergent, an expansive run's pivot is eligible only once no frontier node is open or active. c

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] C2-1 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:197 How It Was Checked says the Review admission helper suite (tests/unit/frontier-admit-review.vitest.ts) ran 18 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite
  fix: - Review admission helper: 18 passed, 0 failed. -> - Review admission helper: 36 passed, 0 failed.
- [ ] C2-2 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:198 How It Was Checked says the Shared admission table suite (tests/unit/frontier-admit.vitest.ts) ran 24 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 58
  fix: - Shared admission table: 24 passed, 0 failed. -> - Shared admission table: 58 passed, 0 failed.
- [ ] C2-3 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:199 How It Was Checked says the Reducer suite (tests/unit/deep-review-state-reducer.vitest.ts) ran 32 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 35 pas
  fix: - Reducer: 32 passed, 0 failed. -> - Reducer: 35 passed, 0 failed.
- [ ] C2-4 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:200 How It Was Checked says the Stop decision suite (tests/unit/stop-decision.vitest.ts) ran 92 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 113 passed. 
  fix: - Stop decision: 92 passed, 0 failed. -> - Stop decision: 113 passed, 0 failed.
- [ ] C2-5 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:201 How It Was Checked says the Stop decision YAML contract suite (tests/unit/stop-decision-yaml-contract.vitest.ts) ran 34 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 
  fix: - Stop decision YAML contract: 34 passed, 0 failed. -> - Stop decision YAML contract: 57 passed, 0 failed.
- [ ] C2-6 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:202 How It Was Checked says the Divergent pivot suite (tests/integration/divergent-pivot.vitest.ts) ran 26 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 2
  fix: - Divergent pivot: 26 passed, 0 failed. -> - Divergent pivot: 28 passed, 0 failed.
- [ ] C2-7 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:203 How It Was Checked says the Fan-out runner suite (tests/unit/fanout-run.vitest.ts) ran 207 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 215 passed. g
  fix: - Fan-out runner: 207 passed, 0 failed. -> - Fan-out runner: 215 passed, 0 failed.
- [ ] C2-8 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:204 How It Was Checked says the Fan-out merge suite (tests/unit/fanout-merge.vitest.ts) ran 88 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 93 passed. gi
  fix: - Fan-out merge: 88 passed, 0 failed. -> - Fan-out merge: 93 passed, 0 failed.
- [ ] B2-1 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:1 The deep-review package bumped SKILL.md to 1.13.0.0 and in the same range made --extend=N and --extend-minutes=M live for review (SKILL.md argument-hint, completed-continue lifecycle mode no longer de

### unowned

- [x] BAT-01 P2 -:- S5-derived-counts failed (exit 1). [handed off]
- [x] BAT-02 P2 -:- S9-command-references failed (exit 1). [handed off]

### root:README.md

- [ ] X-1 P2 README.md:255 The root README's deep-loop section, added in this range, says the expansive frontier 'turns a stop into another pass while one stays open, though never past the iteration cap'. The iteration cap is n
  fix: turns a stop into another pass while one stays open, though never past the iteration cap. -> turns a stop into another pass while one stays open, though never past the iteration cap or the run's time budget.

### command:deep

- [ ] D-2 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:39 The PRE-BOUND SETUP ANSWERS example indents lineage_mode, extend and extend_minutes by one space while every other field uses two. The extend and extend_minutes lines are new in this diff and copy the
  fix: lineage_mode: auto # one of: auto | resume | restart | completed-continue (set by --extend=N) extend: "" # optional posi -> lineage_mode: auto # one of: auto | resume | restart | completed-continue (set by --extend=N) extend: "" # optional posi
- [ ] D-1 P2 .skilled/commands/deep/review.md:100 The --depth-mode row gives the caps as 'maxDepth 3, maxChildrenPerNode 6' with no root exception. A review root takes up to 8 depth-1 children: frontier-admit.cjs:61 sets ROOT_CHILDREN_FLOOR review: 8
- [ ] D-3 P2 .skilled/commands/deep/assets/deep-research.yaml:1793 The rewritten command_note says the check 'prints one machine reason (dispatch_failed|...|delta_file_missing|executor_missing)' and then exempts 'executor_missing, findings_not_enumerated and ledger_b
- [ ] D-4 P2 .skilled/commands/deep/assets/deep-review.yaml:1888 Same as D-3 on the review side: the rewritten command_note lists eight reasons (with iteration_verdict_missing) and then exempts findings_not_enumerated and ledger_backing_missing, which its list omit

## Pre-existing or outside the scope

### skill:.skilled/skills/system-deep-loop

- [x] C3-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/README.md:32 Section 3 FILES lists 26 of the folder's 35 .cjs scripts. These nine are missing: check-ledger-stem-producers.cjs, check-projection-coverage.cjs, iteration-graph-upsert.cjs, loop-heartbeat.cjs, review (pre-existing (critic)) [handed off]

### unowned

- [x] C4-1 P2 .skilled/changelog/skilled/v4.1.0.0.md:1 No open root release notes describe the user-visible deep-loop capabilities this scope ships. The newest root notes, v4.1.0.0, are already tagged, and the tag does not contain the scope's commits (the (unchanged in range) [handed off]

