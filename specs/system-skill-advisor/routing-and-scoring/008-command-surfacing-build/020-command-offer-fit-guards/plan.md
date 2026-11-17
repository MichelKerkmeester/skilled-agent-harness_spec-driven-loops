---
title: "Implementation Plan: Phase 20: command-offer-fit-guards"
description: "Adds one mention reader and one small-edit gate to the attach module and three gates to the scorer, so a command is withheld where the prompt refuses it, asks about it, wants a small edit, rules out a change or carries only a weak problem cue. Each gate is proven by a test written first and by a CLI probe rerun."
trigger_phrases:
  - "command offer fit guards plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 20: command-offer-fit-guards

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, ES modules |
| **Framework** | The skill advisor runtime under `.skilled/skills/system-skill-advisor/runtime` |
| **Storage** | None |
| **Testing** | Vitest, plus two CLI probes in `scratch/planning/` |

### Overview
The attach module gains `commandOnlyMentioned`, which reads a refusal or a question placed directly before a command name, and a small-edit gate for `/create:*` commands. The scorer gains an uncertainty bar on the meaning pass, a gate that stops a mentioned command's own row, a no-edit gate on every command that writes and a weak-cue bar on the doctor hand-off. The proof is a failing-then-passing test per gate, four unchanged floor lines and a probe rerun that drops from 26 command lines to 8.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `scratch/before.txt` holds the start commit, 0 failed and the five floor lines (T001)
- [ ] `scratch/repro-before.txt` holds 26 lines with `command=/` (T002)
- [ ] The files in the Affected Surfaces table are unchanged since `BASE`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD npx vitest run` in the advisor runtime reports 0 failed
- [ ] `scratch/after.txt` ends with `RESULT: every floor equals its before line`
- [ ] `scratch/repro-after.txt` holds 8 lines with `command=/`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Shared gate functions.

### Key Components
- **`commandOnlyMentioned` in `lib/command-attach.ts`**: one reader for the three paths that attach a command. Without it each path would need its own copy and they would drift, which is why `isNoEditRequest` already lives there.
- **`SMALL_EDIT_WORDING` in `lib/command-attach.ts`**: a data list beside `DEPTH_WORDING`. Without it a typo fix gets a creation workflow.
- **Three scorer functions in `lib/scorer/fusion.ts`**: the meaning pass, the command rows and the hand-off are decided there, so the gates sit where the pass is decided. No new file, option or dependency.

### Data Flow
`scoreAdvisorPrompt` ranks rows, applies the meaning pass with its new bar, orders doctor bridges, runs the hand-off with its new weak-cue bar, then withholds mentioned commands and writing commands on a no-edit request, then orders a typed command's owner. The recommend handler then calls `typedCommandForTop` and `attachCommand`, which read the same mention reader.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/command-attach.ts` `typedCommandForTop` | Delivers a typed command on the leading row | update (T004) | `command-attach-guards.vitest.ts` |
| `lib/command-attach.ts` `attachCommand` | Attaches the command a hub route names | update (T005, T006) | `command-attach-guards.vitest.ts`, `command-attach.vitest.ts` |
| `lib/scorer/fusion.ts` `requireCommandPhraseAnchor` | Decides which command rows pass | update (T007) | `command-meaning-anchor.vitest.ts` |
| `lib/scorer/fusion.ts` `applyDoctorHelperHandoff` | Adds a doctor command for a described problem | update (T010) | `scorer/doctor-handoff-command.vitest.ts` |
| `lib/scorer/fusion.ts` `scoreAdvisorPrompt` | Calls the gates in order | update (T007 to T009) | The full suite and the probe rerun |
| `handlers/advisor-recommend.ts` | Calls `typedCommandForTop` and `attachCommand` | unchanged, a consumer whose arguments do not change | `rg -n "typedCommandForTop\|attachCommand\(" .skilled/skills/system-skill-advisor/runtime/handlers` |
| `lib/scorer/text.ts` `isReadOnlyExplainer` | Reads `isNoEditRequest` | not a consumer of the new functions | `rg -n "commandOnlyMentioned" .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts` prints nothing |
| The hooks and the OpenCode plugin | Recompute passing from confidence and uncertainty | unchanged. T007 makes the scorer agree with them | `scratch/repro-after.txt` |
| `capture-command-routing-baseline.mjs` | Counts passing rows | unchanged. Its stand-in regime has no cosine, and its real-embedding count is recorded before and after (T001, T012) | `scratch/after.txt` |

Required inventories:
- Same-class producers: `rg -n "command:" .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` lists the typed path and the attach path, and the scorer's own command rows are the third producer.
- Consumers of changed symbols: `rg -n "requireCommandPhraseAnchor|typedCommandForTop|attachCommand\(|applyDoctorHelperHandoff" .skilled/skills/system-skill-advisor/runtime --glob '*.ts'`.
- Matrix axes: attach path (typed, hub route, own row) by reading (refused, asked about, requested), plus no-edit by command class (`read-only`, `add-only`, `mutates`) and cue (strong, weak, none) by ranker score (below 10, 10 or more).
- Algorithm invariant: a gate only ever turns a passing command row into a non-passing one or removes an attached command. It never adds a command and never changes a skill row.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the floor lines and the two probe outputs. Implementation adds the mention reader and the small-edit gate to `lib/command-attach.ts` and the three scorer gates to `lib/scorer/fusion.ts`, test first. Verification reruns the suite, the floors and both probes and checks the diff names six files.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `commandOnlyMentioned`, `typedCommandForTop`, `attachCommand`, `requireCommandPhraseAnchor`, `withholdMentionedCommands`, `withholdWritingCommandsOnNoEdit` | Vitest, three existing files |
| Integration | The doctor hand-off through the scoring helper, the five floor lines and the eval line | Vitest slice tests and the two capture scripts |
| Manual | `node scratch/planning/probe-offers.mjs` prints 8 lines with `command=/` | The advisor CLI against the live daemon |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The advisor daemon with its embedder | Internal | Green at planning | The probe rerun and the real-embedding count cannot be read. The unit tests still prove each gate |
| `/doctor:helper`'s ranker, `doctor-helper-match.cjs` | Internal | Green | The weak-cue cases read its scores. A changed route manifest moves them, and T002 records the scores the tests rely on |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A floor line differs from `scratch/before.txt` and the cause is a gate, or a typed request loses its command in real use.
- **Procedure**: Revert the phase commit. Each gate is also one line in `scoreAdvisorPrompt` or one `if` in the attach module, so a single gate can be removed without the others.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation (lane A ──► lane B from T008, lane C after T010) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | A green suite on the start commit | Implementation |
| Implementation | Setup. T008 depends on T003, and T017, T018 and T009 follow T008 in that order | Verification |
| Verification | Every lane ended | Close, and the offer-fit capture of phase 023 |
<!-- /ANCHOR:phase-deps -->

---
