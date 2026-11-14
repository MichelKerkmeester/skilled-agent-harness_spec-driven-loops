---
title: "Implementation Plan: Phase 26: untuned-behaviour-arm"
description: "Adds off and on arms, a run number and a fresh set to the behaviour runner, a CLAUDE.md pointer to every arena and fresh labels, run-aware pairing, a pooled exact sign test and command-start counts to the transcript scorer, then writes 36 blind rows, runs 864 sessions on six runtimes and records the verdict against the target fixed before the first session."
trigger_phrases:
  - "untuned behaviour arm plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 26: untuned-behaviour-arm

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ES modules on Node, one JSON lines row file, six CLI runtimes |
| **Framework** | The routing-accuracy scripts of the skill advisor runtime |
| **Storage** | The committed row file. Run logs, the summary and evidence under this phase's `scratch/`. Six throwaway arenas under `$TMPDIR/skilled-behaviour-arenas/` |
| **Testing** | Vitest in two existing files, a hook probe, 12 smoke sessions and the scorer over 864 sessions |

### Overview
The runner gains arms `off` and `on` that set or strip the advisor switch on the turn's environment, a `--run` number on each line and a `fresh` set read from a new row file with its guards, and the arena builder leaves a `CLAUDE.md` pointer. The scorer gains labels for the fresh rows, a run number in its latest-line key, a delivery check per arm, pairing by followed counts, a pooled exact sign test and command-start counts on decline and skill-only rows. The proof is a failing-then-passing test per change, an unchanged summary of the stored arms, smoke rows whose delivery matches their arm, and one evidence file whose every number is a `jq` line over the scorer's output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The live brief cost is a number or a decline in the parent goal log (T001)
- [ ] Phases 023, 024 and 027 read `Complete` and the seven files are clean in `git status` (T002)
- [ ] `scratch/summary-before.json` and `scratch/summary-before-pair.json` exist (T002)
- [ ] `scratch/repro-before.txt` holds the Measured Behavior lines (T003)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD npx vitest run` in the advisor runtime reports 0 failed
- [ ] The stored arms summarize to their before values with the new fields stripped
- [ ] `scratch/arm-evidence.txt` holds the followed, paired, pooled, starts, delivery, floor and limit lines
- [ ] The parent goal log holds the arm verdict, the step reader and the B-5 rows
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Paired arm measurement.

### Key Components
- **Arms `off` and `on` in `childEnv`**: without them only the `pre`, `post`, `smoke` and `g2` arms exist, and the one prefix the design relied on passes no name an adapter reads. Extending `childEnv` in place is enough, because `spawnTurn` is its only caller in a run.
- **`--run <n>` and the run in the latest-line key**: without them the second run of a row replaces the first, as the Measured Behavior block shows, and the second run that removes limit 3 is lost.
- **The `fresh` set and `behaviour-fresh-prompts.jsonl`**: the runner reads `command-prompts.jsonl` only and refuses its `holdout` split, so the sealed rows cannot run, and a row added there would be published in the capture's per-row results. A separate file and one more set entry are the smallest place for 36 rows.
- **The `CLAUDE.md` pointer in `buildArena`**: without it Claude reads the home `CLAUDE.md`, which links to main's `AGENTS.md`. It goes in `.git/info/exclude`, so the runner's clean-tree check still passes and the arena head stays the source commit.
- **Count pairing, `unpaired`, `signTestP` and `pooled`**: the current pair map holds one boolean per row and prints no p, so the pre-registered target cannot be printed by a script (D6).
- **`startedCommand` and the start counts**: a decline row has no expected command, so `startState` reports no start whatever the run did, and the target's zero decline starts cannot be read.
- **The reserved arm `paired` and no `unscoredOnly` count**: deferred from review pass four (P046). An arm named `paired` overwrites the pair block, and the dead count adds 0 to `unscored`. Neither moves a stored number.
- **`SKILL_ADVISOR_FRESH_PROMPTS_PATH`, read by the scorer only**: without it no summary test can label a decline or skill-only row before the blind file exists.

No new dependency, module or file beyond the row file.

### Data Flow
The runner reads a fresh row, starts one turn in the runtime's arena with the advisor switched off or on, and appends a line with `arm`, `run`, the replayed offer and the delivery it read. The scorer joins each line to its fresh label, keeps the last line per runtime, arm, row and run, leaves a delivery contradiction unscored, sorts each owned run into its workflow path and counts command starts on decline and skill-only rows. With `--pair off,on` it pairs each owned row by followed counts per runtime and sums the pairs into `pooled` with its exact p. The coordinator turns the summary into evidence lines with the `jq` filters in `tasks.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

The change touches env precedence and a summary output shape, so the table is filled.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `run-command-behaviour.mjs` `childEnv`, `spawnTurn`, `ARMS`, `parseOptions`, `runTurn`, `armFor`, `findRow`, `SETS` | Builds the turn env, picks rows and writes the run line | update, additive (T004 to T013) | `command-behaviour-guards.vitest.ts` |
| `prepare-behaviour-arena.mjs` `buildArena` | Clones the arena and marks it | update, additive (T014) | A temp source repo through the builder in the guard test |
| `score-command-transcripts.mjs` `loadRowLabels`, `latestLines`, `scoreRun`, `addScored`, `project`, `summarize`, `tallyBlock`, `writeSummary`, `loadOwners` | Scores run logs and prints the summary | update, additive (T015 to T029) | `command-transcript-score.vitest.ts` and the stored-arm comparison in T031 |
| Advisor adapters: the Claude, Codex and Devin hooks, the Pi extension, the OpenCode plugin, the DSH advisor, the direct CLI | Read the advisor switch | not changed, consumers of the switch | T032 probe and the smoke rows in T041 |
| `command-offer.mjs` `replayOffer`, `briefDelivered` | Fill `offeredCommand` and `briefDelivered` on each line | not changed. The replay runs in the runner's own env, so the off arm's offer is what the head would have carried | Smoke lines in T041 |
| Phase 023's `FOLLOWED` and `PAIRED` filters | Walk every top-level summary key | not rerun. A filter that walks every key must skip `pooled`, which appears only with `--pair`. This phase's filters do | The filters in `tasks.md` |
| Phase 022's `SUMOK` and `WFROW` filters | Read a summary run without `--pair` | not a consumer: no `pooled` key without `--pair` | T031 comparison |
| `README.md` in `routing-accuracy` | Describes the scripts | update (T030) | `rg` for the new names |

Required inventories:
- Same-class producers: `rg -n "childEnv|CHILD_ENV_PREFIXES|SKILL_ADVISOR_" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy --glob '*.mjs'`.
- Consumers of changed symbols: `rg -n "pairRows|latestLines|loadRowLabels|summaryLogs|--pair" .skilled/skills/system-skill-advisor/runtime --glob '*.mjs' --glob '*.ts' --glob '!**/dist/**'`.
- Matrix axes: arm (`pre`, `post`, `off`, `on`) by inherited switch (none, a `SPECKIT_` or `MK_` alias, a master switch), and summary shape (one run or two, one arm or two, `--pair` given or not).
- Algorithm invariant: a one-run log summarizes as before, and for every runtime `gained + lost + bothFollowed + neitherFollowed` equals `rows`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup measures the live brief cost first, confirms phases 023, 024 and 027 are closed and captures the before numbers from the scorer phase 027 fixed. Implementation changes the runner, the arena builder and the scorer test first, gets a review, writes and freezes the 36 blind rows, checks the B-6 commit, builds the arenas, waits for the operator's Codex approval and runs the smoke rows, then the 864 sessions. Verification scores the arm, writes `scratch/arm-evidence.txt`, records the verdict, the step reader's judgment and the B-5 decision in the parent goal log and checks the scope.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The arm env, `--run`, the fresh set guards, the arena pointer, fresh labels, the run key, the delivery check, count pairing, `signTestP`, `pooled`, `startedCommand` and the start counts | Vitest, two existing files |
| Integration | The stored arms summarized before and after, the hook probe, 12 smoke sessions | The two scripts, `jq` and `cmp` |
| Manual | `jq -c '.pooled | [.from, .to, (.p | type)]'` over the arm summary prints `["off","on","number"]` | `jq` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 024 closed and committed | Internal | Complete, a1c31b6f38 | Lane S cannot start, because both phases edit the scorer |
| Phase 027 closed and committed | Internal | Planned | T002 stops, because phase 027 changes the start rule, both run-log writers and the stored start counts this phase freezes |
| The B-6 commit to `AGENTS.md` | Internal, the coordinator's | Not made at planning | The arena build waits (T038) |
| The operator's Codex hook approval | Operator | Approved in principle (Q061), the act is pending | No Codex session starts. The arm runs on five runtimes and Codex waits in the goal log |
| Free disk for six arenas | External | Unchecked | T039 stops below 45 GB free |
| The six CLIs and their accounts | External | Used by the last arm | A runtime that cannot start is logged and its sessions are not counted |
| DeepSeek v4.1 flash max on OpenCode Go, Opus verifiers, Fable 5.2 medium on the second account | External | Named in D4 | A lane waits for its worker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: The stored arms summarize to a different value for an earlier field (T031), or a smoke line's delivery contradicts its arm on a runtime that reads it (T041).
- **Procedure**: Before the freeze, revert the harness commit, which restores the runner, the builder, the scorer, the tests and the README together. After the freeze the rows are never edited: a harness fix lands as a new commit and new arenas, and any session already run on the old arenas is logged and left out of the scored logs. Arenas are deleted only on the operator's yes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation (lanes R and S in parallel, lane D after both, then the review, the rows, the freeze,
          the B-6 gate, the arenas, the Codex approval, the smoke rows and the 864 sessions) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 024 and 027 closed | Implementation |
| Implementation | Setup. Each lane runs its tasks in order. The run waits on the B-6 commit and the Codex approval | Verification |
| Verification | Every session scored or logged, the cap held | Close and phase 025 |
<!-- /ANCHOR:phase-deps -->

---
