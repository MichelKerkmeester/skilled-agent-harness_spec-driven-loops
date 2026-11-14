---
title: "Implementation Plan: Phase 19: workflow-outcome-measure"
description: "Measure the stored sessions first, then add one exported workflowPath classifier and a per-arm workflow block to the transcript scorer, tests first, reusing followedBeforeWrite and reading owners from the generated bridge table. Score the before and final arms with the committed script and record the shares."
trigger_phrases:
  - "workflow outcome measure plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 19: workflow-outcome-measure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES module (`score-command-transcripts.mjs`) and a TypeScript Vitest file. One Markdown README row |
| **Framework** | None. The scorer runs under plain `node` and imports the shared session readers |
| **Storage** | Reads stored sessions in each runtime's home store and the OpenCode and Devin SQLite files. Writes two JSON files under this folder's `scratch/` |
| **Testing** | Vitest in `.skilled/skills/system-skill-advisor/runtime`, `npm run typecheck` and the sk-code quality gate |

### Overview
The scorer gains one exported function, `workflowPath`, that sorts a run into `command`, `skill`, `improvised`, `none` or `noOwner`, and each per-arm summary block gains a `workflow` block with those counts and a share printed as `N of M`. The change sits in `score-command-transcripts.mjs` and its test file, with one README field added. It is proven by new test cases that fail before the code and pass after, by an equality check that every old summary field is unchanged and by the two `--summary` runs that write the before and final shares.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 018 is committed: `git -c core.fsmonitor=false log -1 --format=%h -- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/018-holdout-row-retirement/implementation-summary.md` prints a hash
- [ ] The scorer test file passes on the start commit: `env -u AI_SESSION_CHILD npx vitest run tests/command-transcript-score.vitest.ts` in `ADV` reports 0 failed
- [ ] T001 to T004 have written their readings, and T003 has decided the devin rule

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD npx vitest run tests/command-transcript-score.vitest.ts`, `npm run typecheck` and `env -u AI_SESSION_CHILD npx vitest run` in `ADV` report 0 failed and exit 0, and the quality gate over the two changed code files exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
One added classifier. The scorer's event stream stays as it is and one more fact is read from it.

### Key Components
- **`followedBeforeWrite` (reused, unchanged)**: decides `command` from the command document or a skill-tool load before the first write, with its confirm-workflow rule.
- **`hostExpanded` (reused, unchanged)**: decides `command` from the Claude command tag.
- **`workflowPath` (new, exported)**: takes the events, the expected command, the owner and whether the run wrote, and returns one of the five values. Without it no output separates a run that loaded a workflow from one that improvised.
- **Owner lookup (new, internal)**: reads `command-bridges.generated.json` once per summary and maps a command's namespace and name to its `skillId`, then falls back to `expected_top` when that value is a known `skillId`. Without it `skill` has no owner to match.
- **`rowLabel` and `startedLabel` (changed)**: keep `expected_top`, which the fallback needs and which `rowLabel` drops today.
- **`scoreRun`, `newTally`, `addScored`, `tallyBlock` and `writeSummary` (changed)**: carry `workflowPath` into the per-arm `workflow` block and print it on one text line.

### Data Flow
`summarize` reads the corpus labels and the owner table once. For each run line, `scoreRun` loads the session, `normalize` turns it into events, and `workflowPath` reads those events with the row's expected command, its owner and whether the run wrote, where a write is a write event or a non-empty `changedPaths`. `addScored` adds the value to the arm's `workflow` counts, `tallyBlock` adds the unscored count and the share, and `writeSummary` prints the block as JSON or as one `workflow:` line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

This phase answers a parent open question and changes a shared output, the summary block phase 007 reads, so the addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `score-command-transcripts.mjs` | Producer of every summary field | update | The scorer test file and the equality check in T018 |
| `command-transcript-score.vitest.ts` | Pins the scorer's facts | update: new cases only | Each new case fails at `BASE` and passes after T010 to T012 |
| `command-bridges.generated.json` | Holds `skillId` per command | unchanged, now read by the scorer | T004 checks it covers every expected command |
| `runtime/lib/command-attach.ts` | Holds the same owners as `ownerSkillId` | unchanged, not a consumer | T004 compares its values with the JSON |
| `.skilled/hooks/shared/session-readers/` | Load the stored sessions | unchanged, not a consumer | T019 diff over the folder prints nothing |
| `run-command-behaviour.mjs` | Exports `G2_ROWS` to the scorer | unchanged, not a consumer | T019 diff prints nothing for it |
| `command-prompts.jsonl` | The corpus labels | unchanged | T019 diff prints nothing for it |
| Routing-accuracy `README.md` | Lists the per-arm summary fields | update: one field and one sentence | T014 `rg` checks |
| Phase 007 numbers in `../007-per-runtime-behaviour-proof/` | Quote the old fields | unchanged, not a consumer | T018 shows the old fields did not move |

Required inventories:
- Same-class producers: `rg -n 'export function' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` lists the five exported facts today. `workflowPath` is the sixth.
- Consumers of changed symbols: `rg -ln 'score-command-transcripts' . --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/dist/**'` lists every file that runs or imports the scorer. T019 reruns it and checks each one is the test file, the README or a file that only names the script.
- Matrix axes: the expected command present or absent, the owner present or absent, a write event present or absent, `changedPaths` empty or not, and a load before, after or missing. The new cases cover each value of each axis once.
- Algorithm invariant: in every arm, `command + skill + improvised + none + noOwner` plus the runs unscored for this measure alone equals `scored`, and `share` never counts a `none`, `noOwner` or unscored run.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup is T001 to T004, run by the coordinator: capture the unchanged summaries, find the OpenCode database, measure whether devin keeps tool arguments and check the owner table. Implementation is T005 to T014: three test tasks first, then six code tasks and one README task. Each is one dispatch to a DeepSeek v4.1 flash max worker through OpenCode Go, and an Opus subagent checks each task's verify line before the next starts. Verification is T015 to T023, run by the coordinator: the gates, the two scoring runs, the equality and boundary checks and the close-out records.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `workflowPath`: one case per value, the ordering edge, a nested mode `SKILL.md`, a skill-tool load, a `compiled-route.cjs` call, a row with no owner and a run that wrote nothing | `env -u AI_SESSION_CHILD npx vitest run tests/command-transcript-score.vitest.ts` in `ADV` |
| Integration | The `--summary` front door over a built Claude transcript: the `workflow` block in `--json` and the `workflow:` text line, for an owned row and a no-owner row | The same Vitest file, through `runScorer` |
| Manual | The two `--summary` runs over the stored before and final arms, the sum check and the equality check against the T001 captures | `node` and `jq`, as `tasks.md` spells out |

The coverage floor is the happy path plus one edge case for the new public surface. Each new case earns its place by failing at `BASE` for a reason no current case catches, and the new unit block reads the scorer through a namespace import so a missing export fails only the new cases.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Stored sessions for claude, codex, pi and dsh in their home stores | Internal, on this machine | Green, found at planning | That runtime reports only unscored runs |
| The OpenCode database that holds the recorded sessions | Internal, on this machine | Yellow until T002 | OpenCode reports only unscored runs |
| Devin tool arguments in `sessions.db` | Internal, on this machine | Yellow until T003 | Devin is counted unscored for this measure under REQ-008 |
| `node:sqlite` in the local Node.js | External | Green, the readers already use it | OpenCode and Devin sessions cannot load |
| A new package | None | Not needed | Nothing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: an old summary field moves in T018, a gate fails in T015 or the operator withdraws the measure.
- **Procedure**: revert the phase commits with `git revert <sha>`, since nothing outside the scorer reads the new fields.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (T001 to T004) ──► Implementation (tests T005 to T007, code T008 to T013, README T014) ──► Verification (T015 to T023)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 018 committed and the scorer test file green | Every edit, because T001 captures the unchanged output |
| Implementation | T001 to T004, and T003's answer for T013 | Verification |
| Verification | T005 to T014 all ended | Close-out and the parent records |
<!-- /ANCHOR:phase-deps -->

---
