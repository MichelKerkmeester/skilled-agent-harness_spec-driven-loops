---
title: "Implementation Plan: Phase 24: fable-review-remediation"
description: "Keeps the body of a Codex custom tool call in the shared reader and reads its shell commands in the transcript scorer, changes five patterns of the mention reader, three rules of the shell-read helper and the offer reading, each test first, then rescores both stored arms with the committed scorer and restates the Codex start rate."
trigger_phrases:
  - "fable review remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 24: fable-review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ES modules and TypeScript on Node |
| **Framework** | The shared session readers, the skill advisor runtime and its routing-accuracy scripts |
| **Storage** | Reads the stored Codex rollouts and the run logs of phase 007. Writes text and JSON under this phase's `scratch/` |
| **Testing** | Vitest, the Node test runner for the readers, six probes in `scratch/planning/` and three summary runs over the stored arms |

### Overview
The Codex reader keeps the body of a custom tool call and the scorer reads the shell commands out of it, so a Codex run can show a load. The mention reader gains two refusal leads, loses the `why not` and the statement-then-request false refusals and ends a sentence at a question mark, and the scorer stops counting a search, a heredoc line and a partner-side command. The proof is a failing-then-passing test per rule, a mention probe at 46 of 46, floors equal to their before lines and a delta file that states the Codex start rate before and after.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phases 020 and 021 read `Complete` and the files of lanes A and R are clean in `git status` (T001)
- [ ] `scratch/repro-before.txt` holds the seven probe outputs (T002)
- [ ] Phases 022 and 023 read `Complete` and the scorer files are clean before lane S starts (T003)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD npx vitest run` in the advisor runtime reports 0 failed, and the reader tests and history lookup tests report 0 failed
- [ ] The five floor lines equal their before lines
- [ ] `scratch/rescore-delta.txt` holds 12 start lines and 11 workflow lines
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Producer fix first.

### Key Components
- **`recordsFromLines` in the Codex reader**: the producer. Without the body in the record no consumer can see what a Codex shell step ran.
- **`execBodyCommand` in the scorer**: without it the body is a JavaScript string the shell rules cannot read. It sits in the scorer and not in the reader, because what counts as a command is the scorer's question and the reader's record stays opaque.
- **`COMMAND_NOT_WORD` and `COMMAND_ASKED_BY_PRONOUN` in the mention reader**: without them `why not use` and `please start it` read as refusals.
- **`HEREDOC_BODY` in the scorer**: without it a data line that starts with `head` reads as a command. No new file, option or dependency.

### Data Flow
A Codex rollout line of type `custom_tool_call` becomes a tool call record whose `arguments` hold `{ input }`. `normalize` asks for a `command` key first and for the commands of the `exec` body second, joins them one per line and classifies the step as before: a redirect is a write, a patch is a write, the rest is a shell step. `shellReadTargets` strips heredoc bodies, splits the command, follows a `cd` and names the documents a reader verb opens. The mention reader runs before any offer: a led naming is a mention unless a later clause asks for it with a use verb and `it`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `codex.mjs` `recordsFromLines` | Producer of the Codex tool call record | update (T009) | `RT`, two new cases |
| `score-command-transcripts.mjs` `normalize` | Consumer through `loadSession`. Reads `arguments.command` | update (T011) | `describe('normalize')`, four new cases |
| `score-command-transcripts.mjs` `writePaths` | Consumer. Already reads a patch body under `input` | unchanged. A Codex `apply_patch` call now carries its paths | The existing patch cases pass |
| `command-offer.mjs` `recordsHaveBrief` | Consumer through `loadSession`. Reads roles and text blocks only | not a consumer of tool arguments | `command-offer.vitest.ts` |
| `run-command-behaviour.mjs` | Consumer through `loadSession`. Reads the first user record | not a consumer of tool arguments | `command-behaviour-guards.vitest.ts` inside `VALL` |
| History lookup, `system-spec-kit/runtime/hooks/lib/history/` | Consumer through `readSession`. Serialises tool arguments for search and collects file paths from them. Its schema calls them opaque | unchanged. A Codex custom call gains a searchable body where it held an empty object | `HT` |
| `session-prime.ts`, `user-prompt-submit.ts` (Devin), two `session-compact-context` hooks, `session-history-lookup.js` | Import the reader index for the history lookup and the capability list | unchanged | `HT` and `RT` |
| `command-attach.ts` `commandOnlyMentioned` | Decides whether a named command is asked for | update (T004 to T008) | `command-attach-guards.vitest.ts` and the mention probe |
| `fusion.ts`, three call sites of `commandOnlyMentioned` | Consumers. Withhold a command row, keep a typed command under no-edit wording and decide whether a typed command pulls its owner forward | unchanged. Same signature, same meaning of `true` | `VALL` and the floors |
| `attachCommand` | Consumer of `commandOnlyMentioned` | unchanged | The `offers no hub command for %s` cases |
| `score-command-transcripts.mjs` `shellReadTargets` | Names the documents a shell step read, for `followedBeforeWrite` and `ownerLoadedBeforeWrite` | update (T012 to T014) | `describe('workflowPath')` and the shell probe |
| `score-command-transcripts.mjs` `startState` | Consumer of `followedBeforeWrite`, so a start can move with the shell rules | unchanged. T021 writes every start rate before and after | `rescore-delta.txt` |
| `score-command-transcripts.mjs` `offerOf`, the tally | Read the offer on a run line | update (T015, T016) | `describe('run log summary')` |
| Phase 023's `followedOffered` split | Consumer of the `offered` fact | unchanged. It inherits the partner rule | `SUMOK` and the pair of summaries in T021 |
| Stored run logs | Hold no `offeredAs` | unchanged. No stored `offered` count moves | The start lines of every runtime other than Codex in `rescore-delta.txt` carry a reason when they differ |
| `command-prompts.jsonl`, `command-routing-baseline.json` | The corpus and its committed baseline | unchanged (T022). The relabel waits on the operator | `git diff --quiet` |
| Two README files | State the record and the summary rules | update (T010, T017) | `rg` for the new sentences |

Required inventories:
- Same-class producers: `rg -n "parseJsonObject\(payload\.arguments\)|payload\.input" .skilled/hooks/shared/session-readers`.
- Consumers of changed symbols: `rg -ln "session-readers|readSession|loadSession" .skilled .opencode --glob '*.{ts,mjs,js,cjs}' --glob '!**/dist/**' --glob '!**/node_modules/**'` and `rg -n "commandOnlyMentioned|offerOf\(|shellReadTargets\(|offeredAs" .skilled --glob '*.mjs' --glob '*.ts' --glob '!**/dist/**'`.
- Matrix axes: tool call type (function call, custom tool call) by argument source (`arguments`, `input`, neither). Naming of a command (refused, asked about, proposed, stated then requested, requested) by position of the lead. Shell shape (full path, search, heredoc line, `cd` then bare name, in-place `sed`, redirect target) by path value. Offer place (head, partner, absent) by the `offered` count.
- Algorithm invariant: the mention reader returns `true` only when every naming of the command carries a refusal or question lead and no later clause asks for it. Adversarial cases: `no need to ask, run`, `stop and run`, `I will run it`, `use that other one`, `is this right? run`. The count identity of phase 022 holds after every scorer edit, and no load-rate denominator moves.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the floors, the seven probe outputs and, once phase 023 is closed, the three summaries of the stored arms. Implementation changes `command-attach.ts` and `codex.mjs` in two parallel lanes, then `score-command-transcripts.mjs`, each test first, then the README. Verification runs every suite, compares the floors, reruns the probes and rescores both arms into `scratch/rescore-delta.txt`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `commandOnlyMentioned`, `recordsFromLines` through `loadSession`, `normalize`, `workflowPath`, the summary block | Vitest and the Node test runner, three existing files |
| Integration | The floors through the committed capture, both stored arms through `--summary --json`, the history lookup tests | The committed scripts and `jq` |
| Manual | `node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs scratch/planning/probe-mention-reader.mts` prints `SHIPPED: 46 of 46 agree` | The mention probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 020 and 021 closed and committed | Internal | Complete at planning | Lane A cannot start |
| Phases 022 and 023 closed and committed | Internal | In progress at planning | Lane S and lane D cannot start. Lanes A and R can |
| The stored Codex rollouts and the run logs of phase 007 | Internal | Readable at planning | T021 cannot rescore. The unit tests still prove each rule |
| `jq` and the `tsx` loader of the spec kit | Tool | Present | The probes and the floor check cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A floor line moves, the history lookup tests fail, or the count identity prints `false`.
- **Procedure**: Revert the commit of the lane that caused it. The three lanes touch disjoint code files, so each reverts alone. The before files in `scratch/` keep the earlier numbers.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (T001, T002) ──► lanes A and R in parallel ──┐
Setup (T003, after phase 023 closes) ──► lane S ──► lane D ──┴──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 020 and 021 closed for T001 and T002. Phases 022 and 023 closed for T003 | Implementation |
| Implementation | Setup. Lane S also needs T009 of lane R, because its first case reads the body the reader keeps | Verification |
| Verification | Every lane ended, and the stored sessions still readable | Close and phase 025 |
<!-- /ANCHOR:phase-deps -->

---
