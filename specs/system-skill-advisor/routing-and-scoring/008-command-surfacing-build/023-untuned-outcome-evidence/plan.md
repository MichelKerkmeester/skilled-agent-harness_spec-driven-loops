---
title: "Implementation Plan: Phase 23: untuned-outcome-evidence"
description: "Adds a reach stage split and a sealed fit count to the command capture, appends 48 sealed fit rows, adds a range, an offered split and paired arm counts to the workflow summary, and records every evidence line from the two committed scripts with the limits of each."
trigger_phrases:
  - "untuned outcome evidence plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 23: untuned-outcome-evidence

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ES modules on Node, and one JSON lines corpus |
| **Framework** | The routing-accuracy scripts of the skill advisor runtime |
| **Storage** | The committed corpus and baseline. Reads the stored session files. Writes JSON and text under this phase's `scratch/` |
| **Testing** | Vitest, two captures and one summary run over the stored arms |

### Overview
The capture gains a per-split count of where each plain row fell out and a count of heads that carry a command on 48 new sealed rows that should carry none. The workflow summary gains a range on two rates, a split by offer and a `--pair` option that counts the rows that moved between two arms. The proof is a failing-then-passing test per field, a byte comparison showing no earlier metric moved, and one evidence file whose every number is a `jq` line over a script's output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phases 020, 021 and 022 read `Complete` and the seven files are clean in `git status` (T001)
- [ ] `scratch/capture-before-fixture.json` and `scratch/summary-before.json` exist (T001)
- [ ] `scratch/repro-before.txt` holds the four reproductions (T002)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD npx vitest run` in the advisor runtime reports 0 failed
- [ ] `cmp` of the earlier metrics before and after the recapture prints nothing
- [ ] `scratch/outcome-evidence.txt` holds 11 `followed` lines, 5 `paired` lines and 5 `limit:` lines
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Additive measurement fields.

### Key Components
- **`plain_stages` in the capture**: without it the sealed reach is one number, and nobody can tell a ranking miss from a route that attached nothing.
- **The fit rows and `fit`**: without them no sealed row tests silence, and the only silence count comes from rows visible during tuning.
- **`wilsonRange` in the scorer**: without it a rate over 16 runs is read as exact.
- **`--pair` in the scorer**: without it two arms are compared as two rates, and the rows that moved cannot be seen. It is the one new option. No new file, module or dependency.

### Data Flow
The capture scores every corpus row once. A plain row adds to its split's stage tally. A fit row adds to the `fit` tally and to nothing else. The summary scores each run line, keeps for each arm which owned rows followed, and with `--pair` compares the two named arms on the rows both scored. The coordinator turns both outputs into evidence lines with the `jq` filters in `tasks.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `capture-command-routing-baseline.mjs` `scoreCommandCorpus` | Scores the corpus and builds the baseline | update, additive (T003, T016, T005, T017) | The slice test and the `cmp` in T006 |
| `command-prompts.jsonl` | The command corpus, with 44 sealed plain rows | append 48 rows (T004) | `git diff --numstat` prints 48 and 0 |
| `command-routing-baseline.json` | The committed ratchet | recapture (T006) | Every earlier metric byte-equal |
| `command-routing-slice.vitest.ts` | Holds live scoring to the baseline and pins the corpus hash | update (T016, T005, T017) | 0 failed after T006 |
| `score-command-transcripts.mjs` `tallyBlock`, `addScored`, `project`, `parseArgs` | Print the summary | update, additive (T007, T008, T009, T018 to T021) | The scorer test file |
| `run-command-behaviour.mjs`, `measure-brief-cost.mjs`, `loadRowLabels` in the scorer | Read the corpus and refuse a `holdout` row by its split | a consumer. Unchanged, because a fit row is on the `holdout` split | The full suite |
| Phase 022's `SUMOK` and `WFROW` filters | Read a summary's arm blocks | not a consumer: `paired` appears only with `--pair` | T021's `has("paired")` check prints `false` |
| `README.md` in `routing-accuracy` | Describes both scripts | update (T010) | `rg` for the new names |

Required inventories:
- Same-class producers: `rg -n "row.row_type ===|row.split" .skilled/skills/system-skill-advisor/runtime/scripts --glob '*.mjs'`.
- Consumers of changed symbols: `rg -n "attachedMetrics|command-prompts.jsonl|tallyBlock|summaryLogs" .skilled/skills/system-skill-advisor/runtime --glob '*.mjs' --glob '*.ts' --glob '!**/dist/**'`.
- Matrix axes: row class (plain tune, plain holdout, typed, silence, skill-only, decline) by tally (earlier metrics, stages, fit), and summary shape (one arm, two arms, `--pair` given or not).
- Algorithm invariant: a fit row changes no earlier count, and for every split `own + ownerLed + neither` equals `total`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup confirms phases 020 to 022 are closed and captures the before numbers. Implementation changes `capture-command-routing-baseline.mjs`, `command-prompts.jsonl` and `score-command-transcripts.mjs`, test first, then recaptures the baseline and updates the README. Verification runs the suite, writes `scratch/outcome-evidence.txt` and hands the lines to the operator through the parent goal log.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `wilsonRange`, the offered split, the pairing and its usage errors, the stage identity, the fit counts | Vitest, two existing files |
| Integration | The recapture against the earlier metrics, and both stored arms through `--pair pre,post` | The two committed scripts, `jq` and `cmp` |
| Manual | `jq -c '.attachedMetrics | [.plain_stages.holdout.total, .fit.skillOnly.total, .fit.decline.total]'` over the baseline prints `[44,24,24]` | `jq` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 020 and 021 closed | Internal | Planned | The fit count would measure guards and heads that are about to change |
| Phase 022 closed and committed | Internal | Planned | Lane S cannot start, because both phases edit the scorer |
| The local embedder | External | Answered at planning | The real-regime lines read `embedder not live`. The fixture lines and the baseline are unaffected |
| The stored sessions and arenas | Internal | Readable at planning, approved for deletion after scoring | T012 cannot print the followed and paired lines over the real arms |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: The `cmp` in T006 prints a difference, or an earlier summary field prints a different value for the same log.
- **Procedure**: Revert the phase commit, which restores the corpus, the baseline and both scripts together. A reverted fit set is not reused: a later attempt writes new rows.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation (lanes R and S in parallel, the recapture after R, lane D after both) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 020, 021 and 022 closed | Implementation |
| Implementation | Setup. Each lane runs its tasks in order | Verification |
| Verification | Every lane ended, the recapture done and the stored sessions still readable | Close, the arena deletion and the operator's target decision |
<!-- /ANCHOR:phase-deps -->

---
