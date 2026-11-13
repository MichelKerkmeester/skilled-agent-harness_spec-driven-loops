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
- [ ] T007 Run segment two against the built phases 005 to 008 and the phase 007 after-arm behaviour log until it converges (`research/`). Verify: the segment two synthesis under `research/` records its stop reason as converged.
- [ ] T008 Answer or carry forward each open question of `research/research.md` section 12 in the segment two synthesis (`research/`). Verify: each of the six questions is marked answered or carried forward with a reason.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Write the packet documents and register this child in the parent phase table (`spec.md`, `plan.md`, `tasks.md`, `../spec.md`). Verify: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
- [ ] T010 Fill the `Disposition` cell of every row in the table below (`tasks.md`). Verify: no row of the table has an empty `Disposition` cell.
<!-- /ANCHOR:phase-3 -->

---

### Disposition Table

The 14 ranked recommendations of `research/research.md` section 9, in rank order. A `Disposition` value is either `built in <phase>` or `declined: <reason>`.

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
