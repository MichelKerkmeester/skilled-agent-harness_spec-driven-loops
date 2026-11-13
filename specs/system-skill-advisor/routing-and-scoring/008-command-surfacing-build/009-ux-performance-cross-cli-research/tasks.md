---
title: "Tasks: Phase 9: ux-performance-cross-cli-research"
description: "Ordered tasks for the two research segments on command surfacing and the disposition of each of the 14 ranked recommendations."
trigger_phrases:
  - "ux performance cross cli research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: ux-performance-cross-cli-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from this folder unless a task says otherwise.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Set the research question, the three lanes and the rules: no holdout rows, no CLI arm runs and read-only git (`research/research.md`). Verify: `rg -n 'no holdout corpus rows read' research/research.md` prints one line.
- [x] T002 Configure the fan-out with DeepSeek v4.1 flash at max effort through OpenCode Go and a cap of 5 iterations (`research/deep-research-config.json`). Verify: `jq -r '.executor.model, .executor.reasoningEffort, .maxIterations' research/deep-research-config.json` prints `opencode-go/deepseek-v4.1-flash`, `max` and `5`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Run segment one lineage `ux` (`research/lineages/ux/`). Verify: `ls research/lineages/ux/iterations | wc -l` prints 5.
- [x] T004 [P] Run segment one lineage `performance` (`research/lineages/performance/`). Verify: `ls research/lineages/performance/iterations | wc -l` prints 5.
- [x] T005 [P] Run segment one lineage `cross-cli` (`research/lineages/cross-cli/`). Verify: `ls research/lineages/cross-cli/iterations | wc -l` prints 3.
- [x] T006 Merge the three lineages into one ranked synthesis (`research/research.md`). Verify: `jq -c '{total, succeeded, failed}' research/orchestration-summary.json` prints `{"total":3,"succeeded":3,"failed":0}` and `rg -c '^\| [0-9]+ \| ' research/research.md` prints 14.
- [x] T007 Run segment two against the built phases 005 to 008 and the phase 007 after-arm behaviour log and merge it (`research/lineages/offer-reach/`, `research/lineages/cross-cli-2/`, `research/lineages/ux-cost-2/`, `research/research-segment-2.md`). Verify: the three lineages hold 4, 4 and 3 iterations and `rg -c '^\| [0-9]+ \| ' research/research-segment-2.md` prints 18. Done 2026-11-13: both printed as expected. The segment did not converge. Section 5 of the synthesis records that `offer-reach` and `cross-cli-2` stopped at their cap of 4 iterations and only `ux-cost-2` converged, so convergence moves to T012.
- [ ] T008 Answer or carry forward each open question of `research/research.md` section 12 in the segment two synthesis (`research/`). Verify: each of the six questions is marked answered or carried forward with a reason. Partly done 2026-11-13: questions 2, 5 and 6 are answered in `research/research-segment-2.md` and question 1 is carried as its open question 2. Questions 3 and 4 were carried by the `offer-reach` lineage and the synthesis does not answer them, so T013 takes them.
- [x] T011 Record a disposition for each of the 18 ranked items of segment two (`tasks.md`). Verify: the segment two disposition table below has 18 rows and none has an empty `Disposition` cell. Done 2026-11-13: 13 built in phases 012 and 013, both Complete, 1 waiting on the operator and 4 declined.
- [ ] T012 [B] Run segment three, continuing the `offer-reach` and `cross-cli-2` lanes against the measured gains of phases 012 and 013, until it converges (`research/`). Verify: the segment three synthesis under `research/` records its stop reason as converged. Blocked: the launcher is prepared and has not run. It starts after the branch is merged to main, by operator instruction of 2026-11-13.
- [ ] T013 Answer or carry forward in segment three the questions segment two left open (`research/`). Verify: each is marked answered or carried forward with a reason. The questions are: plain reach on the holdout split is 1 of 44 while the tune split reads 23 of 45, so the phase 012 gains do not transfer to unseen wording. Hook health shows in `/doctor:setup` only after a run with `SKILL_ADVISOR_DEBUG=1`. The fallback scorer loses the mode label, the doctor hand-off and plain offers when the daemon is unreachable (`../012-plain-offer-reach/scratch/live-heads.txt`). Claude Code sees 32 of 44 tracked commands. Questions 3 and 4 of `research/research.md` section 12 and rank 15 of segment two.
- [ ] T014 Take rank 14 of segment two, a Gate 2 clause for a brief that names a skill and no command, to the operator (`tasks.md`). Verify: the rank 14 row of the segment two disposition table reads built in a named phase or declined with a reason.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Write the packet documents and register this child in the parent phase table (`spec.md`, `plan.md`, `tasks.md`, `../spec.md`). Verify: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
- [ ] T010 Fill the `Disposition` cell of every row in the table below (`tasks.md`). Verify: no row of the table has an empty `Disposition` cell.
<!-- /ANCHOR:phase-3 -->

---

### Disposition Table

Segment one. The 14 ranked recommendations of `research/research.md` section 9, in rank order. A `Disposition` value is either `built in <phase>` or `declined: <reason>`.

| Rank | Recommendation | Disposition |
|------|----------------|-------------|
| 1 | Put Codex hook approval in the install path and add a doctor check | |
| 2 | Record the offer with `offeredCommand` and `offeredPolicy` in the diagnostic record and each arm run line | |
| 3 | Make the scorer report an attributable rate with capped runs excluded and a per-policy split | |
| 4 | Remove the cold-start fail-open with a SessionStart warm-up and a probe timeout below the hook budget | |
| 5 | Make DSH reachable in the install guide and default its prompt advisor on | |
| 6 | Check the target repository's hook wiring on first run | |
| 7 | Name the command document path in the head on hosts without a folder-style registry | |
| 8 | Bind the command's run or ask policy to the skill path that runs the same workflow | |
| 9 | Settle G5 on the real path and guard it with a per-runtime visibility count | |
| 10 | Fix the argued-route document lookup in the transcript scorer | |
| 11 | Thread the 750 ms embed deadline into the adapter as a real abort | |
| 12 | Surface hook health and add a prove-it install step | |
| 13 | Collapse the host-adapter spawn and the CLI spawn, only after the rank 4 cold-start measurement | |
| 14 | Small guards for spelling, the once-per-command clause, head length, brief cost, read cost and write targets | |

### Segment Two Disposition Table

The 18 ranked items of `research/research-segment-2.md` section 3, in rank order. The reasons are that section's.

| Rank | Recommendation | Disposition |
|------|----------------|-------------|
| 1 | Name the matched doctor command in the hand-off instead of the helper | built in 012 |
| 2 | Leave a Claude pointer on the default `embed` install and report a missing one | built in 013 |
| 3 | Make brief delivery a stored fact | built in 013 |
| 4 | Task-shaped paraphrase aliases on the `sk-doc` hub | built in 012 |
| 5 | Report brief delivery and hook approval in `/doctor:setup` | built in 013 |
| 6 | Label a deferring hub `(needs a mode)` in the brief head | built in 012 |
| 7 | Pair a deep scorer anchor with a deep hub alias per mode | built in 012 |
| 8 | Count offers apart from policy and cap and split the two unknowns | built in 013 |
| 9 | Preflight Codex hook approval and mark the runtime not measurable | built in 013 |
| 10 | Fold loop-without-init into the safety floor | built in 013 |
| 11 | Parse the three states of the `COMMAND:` line into `offerSeen` | built in 013 |
| 12 | One narrow explicit anchor per wrong-top create row | built in 012 |
| 13 | Relabel the capture's `offered` flag | built in 013 |
| 14 | One Gate 2 clause for a brief that names a skill and no command | waiting on the operator: the Gate 2 bullet is frozen at the text the operator approved |
| 15 | Enrich command intent signals and re-embed the skill graph | declined for this round: it moves no chat row today, needs its own real-embedding capture and carries the highest floor risk. Carried into segment three |
| 16 | Warm the embedder once at session start | declined: the cold first call measured 538.53 ms against the 750 ms deadline |
| 17 | Raise the `COMMAND:` line rate | declined: the line tracks neither offers nor starts and more wording costs brief bytes on every prompt |
| 18 | Hold the embed model warm with `keep_alive` | declined: about 320 MB resident for one saved 538 ms call per idle window |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every row of the disposition table has a value
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
