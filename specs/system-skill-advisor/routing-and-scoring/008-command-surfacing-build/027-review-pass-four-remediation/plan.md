---
title: "Implementation Plan: Phase 27: review-pass-four-remediation"
description: "Carries a decline lead over an or-list and reads the article before a questioned command in the mention reader, keeps offeredAs in both run-log writers, counts a shell read of a command document as a start, fixes the heredoc end word, the Codex read path, the live holdout guard and five documents, each test first, then rescores every stored arm, restates each moved start figure and closes review pass four with a confirming round and a synthesis."
trigger_phrases:
  - "review pass four remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 27: review-pass-four-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and JavaScript ES modules on Node, Markdown and one plain-text presentation file |
| **Framework** | The skill advisor runtime, its routing-accuracy scripts, the shared session readers and the doctor command assets |
| **Storage** | Reads the stored run logs of phase 007 and the sessions they name. Writes text and JSON under this phase's `scratch/`, and the review artifacts under `../review/` at build time |
| **Testing** | Vitest in five existing files, the Node test runner for the readers and the doctor scripts, the verifier's probes in `../review/verify-4/probes/` and three summaries over the stored arms |

### Overview
The mention reader carries a decline lead over an or-list and reads `the` after a bare ask word, the two run-log writers keep `offeredAs`, and the scorer's start check reads a shell read through the helper the load check already uses. Four smaller fixes close the heredoc end word, the Codex read path, the live holdout guard and five stale document lines. The proof is a failing-then-passing test per rule, floors equal to their before lines, the verifier's probes printing the fixed output, a delta file over every stored arm in which only start counts move, and a confirming review that ends with no adjudicated P1.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 024 reads `Complete`, no phase 026 task is `[x]` and the sixteen files are clean in `git status` (T001)
- [ ] `scratch/floor-before.txt`, `scratch/eval-before.txt` and `scratch/fit-before.txt` hold the floors (T001)
- [ ] `scratch/repro-before.txt` holds the probe outputs of the spec's Measured Behavior block (T002)
- [ ] The three stored summaries and the per-row files are recorded before any scorer edit (T003)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The advisor suite, the doctor tests, the reader tests, the history lookup tests, the plugin test and the typecheck report 0 failed (T018)
- [ ] The floor, eval and fit lines equal their before lines, or a recapture is recorded under the T019 rule
- [ ] `scratch/rescore-delta.txt` holds 23 start lines, 11 workflow lines and a reason for every moved run (T021)
- [ ] The confirming review closed and `../review/review-report.md` holds the pass-four synthesis (T025, T026)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Fix at the producer.

### Key Components
- **`COMMAND_OR_LIST` in `command-attach.ts`**: without it a decline lead reaches only the first command it names, because every lead must sit directly before the naming it marks. One constant used in the one place the decline leads are tested. All three callers of `commandOnlyMentioned` inherit it.
- **`offerLineFields` in `run-command-behaviour.mjs`**: without it the live writer cannot be tested. `runTurn` is not exported and a dry run is refused on a tree a worker has edited. It is one exported helper with one call.
- **One shell branch in `readDocument`**: without it `startState`, `takenLoop` and the `startedCommand` phase 026 builds on miss a run that read its command through the shell, while `followedBeforeWrite` already counts the same read. It reuses `shellReadTargets` and `tailMatches`, so the search, heredoc, `cd` and in-place `sed` rules hold for starts as they hold for loads.
- **`publishedHoldoutIds` in the slice test**: without it the guard can only read the committed baseline. It is a local function in the test file, called for the baseline and for the live capture.

No new file, module, option or dependency.

### Data Flow
A prompt reaches `commandOnlyMentioned` from the typed path, the hub path and the scorer's withhold step. A naming led by a decline lead, alone or through an or-list, reads as a mention and drops its command everywhere. After a turn the runner replays the offer, and both writers copy its command, policy and `offeredAs` onto the run line, which `offerOf` reads. The scorer normalizes a session into events, and `readDocument` now counts a `read`, a `skill` or a shell event whose read targets end in the command's document, so a start and a loop are found from the same reads a load is.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

The plan imports the verified verdicts of `../review/verify-4/report.md` and the finding text of the four pass-four lineages as data. No command copied from a finding is planned. Every verification below is a command this plan selected.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `command-attach.ts` `commandOnlyMentioned` | Decides whether a named command is asked for | update (T004, T005) | `command-attach-guards.vitest.ts`, the CLI probe and the 024 mention probe |
| `command-attach.ts` `typedCommandForTop` (`:256`), `attachCommand` (`:483`) | Callers of the mention reader on the typed and hub paths | unchanged, same signature and same meaning of `true` | The CLI probe over the three refusals in T020 |
| `fusion.ts` `withholdMentionedCommands` and two more call sites | Scorer callers of the mention reader | unchanged | `VALL`, the floors and the slice test |
| `command-routing-baseline.json`, the sealed fit block | Committed rows and counts the slice test compares whole | unchanged unless a row moves, then the T019 recapture rule | `cmp` of the floor, eval and fit files |
| `command-offer.mjs` `backfillRunLog` | Writer of backfilled run lines | update (T006) | `command-offer.vitest.ts` and the backfill probe |
| `run-command-behaviour.mjs` `runTurn` | Writer of live run lines | update through `offerLineFields` (T007) | `command-behaviour-guards.vitest.ts` |
| `command-offer.mjs` `parseOffer`, `replayOffer`, `failedOffer` | Producers of `offeredAs` | unchanged | `command-offer.vitest.ts` |
| `score-command-transcripts.mjs` `offerOf` | Consumer of `offeredAs` | unchanged. It starts reading real values once lines carry the field | The partner case of phase 024 |
| `score-command-transcripts.mjs` `readDocument` | Start and loop detector | update (T009) | `describe('startState')` and the loop case |
| `startState`, `takenLoop`, `loopCommandFor`, `startedOfOffered` | Consumers of `readDocument` | unchanged code, moved counts expected | `scratch/rescore-delta.txt` |
| `followedBeforeWrite`, `ownerLoadedBeforeWrite`, `workflowPath` | Load and path readers through `shellReadTargets` | unchanged, and no workflow count may move | The `WFROW` and `DEN` comparison in T021 |
| `score-command-transcripts.mjs` `HEREDOC_BODY` | Strips heredoc bodies for `shellReadTargets` | update (T008) | The `does not count $command as a load` table |
| `codex.mjs` `loadCodexSession` | Producer of Codex records for the scorer, the history lookup and four hooks | update (T010) | `RT` and `HT` |
| `command-routing-slice.vitest.ts` `publishes no holdout row` | Holdout publication guard | update (T011) | The new made-up capture case |
| Phase 026 `startedCommand` (planned T024) | Future consumer of `readDocument` | named in 026 T024 now | 026 strict validation |
| Phase 025 tasks T003, T012 and CHK-040 | Quote two lines this phase corrects | not changed here, assumption A13 | Coordinator amends 025 |
| Five documents | Describe the fixed behaviour | update (T012 to T017) | `rg` for each new sentence |

Required inventories:
- Same-class producers: `rg -n "offeredPolicy: offer\.offeredPolicy" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy` lists the two writers, and `rg -n "readFileSync\(transcriptPath" .skilled/hooks/shared/session-readers` lists only `codex.mjs`.
- Consumers of changed symbols: `rg -n "commandOnlyMentioned|readDocument\(|offerLineFields|offeredAs|HEREDOC_BODY" .skilled --glob '*.ts' --glob '*.mjs' --glob '!**/dist/**'`.
- Matrix axes: the join between two commands (`or`, `, or`, a second use verb, `not`, a comma then a use verb) by the lead before the first (decline, ask, none), the article before a questioned command (none, `the`), the read shape (read tool, shell reader, search, in-place `sed`, heredoc line) by the event that follows (write, none), and the offer place (head, partner, absent) by the writer (backfill, live).
- Algorithm invariant: the mention reader returns `true` only when every naming of the command is led, alone or through an or-list, and no later clause asks for it. `readDocument` counts a shell event only for a target `shellReadTargets` returns, so a start never rests on a read the load rule refuses. Adversarial cases: `use A or B`, `do not run A, run B or C`, `do not run A or run B`, `the next step is the /x command`, `rg -n x <document>`, `sed -i s/a/b/ <document>`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup checks the gate, records the floors, the probe outputs and every stored summary before any edit. Implementation runs six lanes on disjoint files, each task test first, then the README tasks after their code lanes. Verification runs every suite, compares the floors, reruns the probes, rescores the stored arms into `scratch/rescore-delta.txt`, commits the fix, runs the confirming review, writes the pass-four synthesis and closes the phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `commandOnlyMentioned`, `backfillRunLog`, `offerLineFields`, `startState`, the loop summary, `workflowPath`, `loadSession` for Codex and the holdout guard | Vitest and the Node test runner, six existing files |
| Integration | The floors, the scorer eval and the fit block through the committed captures, the three stored summaries, the doctor tests and the history lookup tests | The committed scripts and `jq` |
| Manual | `bash ../review/verify-4/probes/cli-rows.sh` over the review prompts prints no refused command, and `node ../review/verify-4/probes/offeredas-backfill.mjs <temp folder>` prints `HAS offeredAs` | The verifier's probes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 024 closed and committed | Internal | Complete, a1c31b6f38 | T001 stops the phase |
| Phase 026 not started | Internal | Planned, no task done | T001 stops the phase, because both phases edit the runner and the scorer |
| The stored run logs of phase 007 and the sessions they name | Internal | Readable at planning | T021 cannot rescore. The unit tests still prove each rule |
| `jq`, the `tsx` loader of the spec kit and the verifier's probes | Tool | Present | The floor check and the reproductions cannot run |
| DeepSeek v4.1 flash max on OpenCode Go and an Opus verifier per task | External | Named in D4 | A lane waits for its worker |
| `/deep:review` fan-out on `cli-opencode` | Internal | Used by pass four | The confirming round cannot run and the phase cannot close |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A floor or eval line moves without a recorded recapture, a workflow count, load rate, `unsafe` or loop count moves in the rescore, or the history lookup tests fail.
- **Procedure**: Before the fix commit, discard the lane's working changes to the files it owns, which no other lane touches. After it, revert the fix commit as a whole. The before files in `scratch/` keep the earlier numbers.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (T001 to T003) ──► lanes A, O, S, R, T and E in parallel ──► lane D after O and S ──► Verification
Verification: suites, floors, probes, rescore ──► fix commit ──► confirming review ──► synthesis ──► close
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 024 committed and phase 026 not started | Implementation |
| Implementation | Setup. T003 must end before T008, the first scorer edit | Verification |
| Verification | Every lane ended and the stored sessions still readable | Close, then phase 026 T001 |
<!-- /ANCHOR:phase-deps -->

---
