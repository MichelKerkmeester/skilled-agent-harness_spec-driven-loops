# MiMo lineage synthesis — UX and measurement lens (round 2)

**Lineage:** `mimo` · **Executor:** cli-pi, `mimo-v2.6-pro`, high · **Session:** `fanout-mimo-1790457982528-yjdrdz`
**Iterations:** 5 of 5, angles `mimo-01` to `mimo-05` · **Stop reason:** `maxIterationsReached`
**Baseline:** `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md` (BASE). Every claim below is new, or a confirmation carrying new evidence; nothing is restated without either.

## What this lineage is for

One question under five angles: **what does the operator see, decide, type and pay** — in minutes, in calls, in visible lines — for the council-revised Jev recommendations, and does the measurement design actually measure what the decision needs?

## The five findings that matter

1. **R1 is bounded but its real constraint is the win rate, not the row count.** Committed fields bound movable rows to 0–55 across R1's 241 census rows (38 labeled + 17 holdout; the 13 scorer abstentions are provably all gold-none). The exact one-sided sign test then needs a true win rate of ~0.92 at 10 decided rows, ~0.80 at 20, ~0.68 at 55 for 80% power — and at n=6 one loss makes `keep` impossible. BASE's `underpowered` trigger (fewer than 5 movable rows) can therefore miss substantive underpower. The census must print `power: movable= need-wins= q80=` and the trigger must consult it. [mimo-01; `scorer-eval-baseline.json`, `ambiguity.ts:22-38`, `score-outcome-rerank.mjs:85-93`]

2. **One pre-registered rule is unmeasurable as written.** With 3 reruns and one modal pick, the per-row flip rate is in {0, 1/3}; BASE's "per-row flip rate of at most 0.10" is a unanimity test in disguise. Fix it before 002's spec freezes (aggregate over decided rows × reruns, or state unanimity). Pre-registration only binds while the text is unfrozen. [mimo-01]

3. **D5's base rate is one number with three definitions, and the labels must fix the rubric first.** A seeded stratified sample of 44 criterion lines (seed 20260926, population 1,313 lines in 308 goal.md files) scores 79.5% failing rule 4 strict (Wilson 95%: 65.5–88.8%), 45.5% lenient (31.7–59.9%), against the prior 1.5% (regex) and ~28% (one-lens). The violations are *referential* ("the run report", "every kept file", "the condition") — a class lexical proxies structurally miss. R20's bare 5% stop rule cannot fire under any semantic rubric; it needs a rubric-qualified replacement. The sample is listed `path:line` in `iterations/iteration-002.md` for relabeling. [mimo-02; `sk-create-goal/SKILL.md:121-122`, `check-goal.cjs:44-49,207-212`]

4. **D2 resolves: 003 stops at its zero-call slice.** Every goal state store the operator's configs resolve to holds zero verifier verdicts — 5 records, all `runtime: hermes`, all `not_evaluated`, zero OpenCode or Pi sessions, one shared store confirmed via the `.opencode/skills -> ../.skilled/skills` symlink. The Pi verify nudge is invisible (`display: false`), and `not_met` silently burns up to 8 continuation turns. Question 23 is unmeasurable live (0 evidence records); the closest proxy is 12.3% of 610 native `goal_status` reasons over the 1,200-char clamp. grok-05's kill line for the R2 Jev arm (`no recorded OpenCode or Pi verifier use`) fires today, by my count. [mimo-03; `opencode-goal.js:36-50,2429`, `goal-core.cjs:43,527,1305`, `goal-context.ts:233-237`]

5. **The program costs one operator day: 2–2.5 hours, two thirds of it 006's labels — and 002 is the only phase that survives zero labor.** Soonest usable number: 002's census, 5–10 minutes, and the line that decides is the power line. Kill criteria are pre-registered as one string family across 002/003/005/006. Three insertions into BASE's build order: the D5 rubric before 006's labels, the power line and flip clause before 002's arm interpretation, the recorded-use tripwire before anyone waits on R2's arm. [mimo-05]

## Answers to the questions this lineage owns

| Question | Answer | Where |
|---|---|---|
| 22 (criteria-lint base rate) | Method-dominated: 1.5% / 28% / 45.5–79.5% by failure definition; adopt a rubric before labeling; the sample is relabelable | iteration 2 |
| 19 (OpenCode/Pi verifier in use) | No. 0 verdicts in 5 records, zero OpenCode/Pi sessions; D2 resolves to "stop at the zero-call slice" | iteration 3 |
| 23 (evidence over 1,200 chars) | Unmeasurable live (0 records); proxy: 75/610 = 12.3% of native reasons over the clamp | iteration 3 |
| 21 (live `ambiguousWith` rate) | 0 recorded events; `shadow-deltas.jsonl` absent in both checkouts — R3's sizing starts from zero | iteration 1 |
| 29 (watched vs unattended compactions) | The within-a-minute rule is ill-posed (boundary stamps postdate the next user record by p50 −1.16 s); session shape: 209/209 main-thread, `userType` external, trigger auto 206/209, p50 104.2 s | iteration 4 |
| 30 (R1's keep rule, this family) | The keep rule's power constraint and the flip-rate clause both need repair before the arm runs; movable bound 0–55 | iteration 1 |
| RQ6 (missed seams) | The uncovered band is harness plumbing: AskUserQuestion (516 uses, 702 hook events), Monitor (273), ToolSearch (233, free self-labeled gold), SendMessage (108) | iteration 4 |

## New ideas minted (all `N-mimo-*`, traceable)

| Id | Idea | Verdict |
|---|---|---|
| N-mimo-01-1 | Aggregate (or unanimity) flip-rate clause | build-now as spec text |
| N-mimo-01-2 | R21 trigger widened to "power curve cannot reach 0.80" | next |
| N-mimo-02-1 | Two-stage labeling: rubric first, then ~100 labels | build-now as protocol text |
| N-mimo-02-2 | Lint prints in the criteria step, advisory, lexical on / Jev off | build-now with the lint |
| N-mimo-03-1 | Recorded-use tripwire line in 003's report | build-now in the slice |
| N-mimo-03-2 | `verifier_shadow` visible only on disagreement | next |
| N-mimo-04-1 | ToolSearch re-rank arm, self-labeled gold | later (after R1 keeps) |
| N-mimo-04-2 | AskUserQuestion question-quality lint | later (red-flag risk) |
| N-mimo-05-1 | Measurement-first order with the day priced | build-now as order |
| N-mimo-05-2 | One kill-line string family | build-now as spec text |

## Corpus facts this lineage counted (for the merge)

Compactions 209 (`compact_boundary`; `compact_file_reference` 279 is a decoy type) · `goal_status` records 757 (met false 695; reasons 610; 280 mention criterion wording) · goal-state records 5, verdicts 0 · criterion lines 1,313 in 308 files (sample 44, seed 20260926) · AskUserQuestion 516 · ToolSearch 233 · Monitor 273 · SendMessage 108 · Skill invocations 88 · hook_success attachments 175,678.

## Caveats

- Every base rate from this lineage is one model family (mimo) under one rubric; the rubric is written down so a second lens can disagree with it precisely.
- Dollar figures are arithmetic on vendor claims, labeled as such (claude-jev `README.md:30-31`).
- Transcript work was names, field names, counts and lengths only; no prompt, reply or tool text was read or copied.
- No `jev` command of either package was run, no repository module executed, no network call made, no `.env` opened.
