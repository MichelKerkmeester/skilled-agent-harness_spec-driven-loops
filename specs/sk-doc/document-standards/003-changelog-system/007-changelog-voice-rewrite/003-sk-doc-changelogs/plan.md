---
title: "Implementation Plan: Phase 3: sk-doc-changelogs"
description: "Rewrite the 296 queued sk-doc changelogs with the phase 001 driver, retry any restored file, and check the wave against HEAD. A double-backtick span bug found on the way is fixed in the driver and the measure tool."
trigger_phrases:
  - "sk doc changelogs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: sk-doc-changelogs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown changelogs, the Node driver and wave check in `../scratch/`, Python measure and house checks |
| **Framework** | None |
| **Storage** | `../scratch/state.jsonl`, one record per dispatch |
| **Testing** | The driver's five gates, `wave-verify.cjs`, `measure-voice.py` |

### Overview
The phase 001 driver rewrites each queued changelog through DeepSeek Flash and keeps it only when all five gates pass. `wave-verify.cjs` then re-runs the gates against HEAD, and `measure-voice.py` gives the before and after numbers. A file that a gate rejects for a tool bug gets the tool fixed and a retry, never a hand edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `wave-verify.cjs` prints no problem for a file this phase rewrote, and `measure-voice.py` prints `sentences_over_22=0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: a gated batch rewrite. Nothing new is built in this phase.

### Key Components
- **`../scratch/rewrite-driver.cjs`**: dispatches each file and applies the five gates. Its code span pattern now pairs a backtick run with a closing run of the same length.
- **`../scratch/wave-verify.cjs`**: re-runs the gates and compares each record with HEAD before the commit.
- **`../scratch/measure-voice.py`**: counts sentence lengths. It carries the same span fix.

### Data Flow
The driver reads each original from HEAD, sends it to the worker, gates the result and writes a record to `state.jsonl`. A kept file stays in the worktree, and a failed one is restored.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The 296 queued changelogs | Skill release history | update | `wave-verify.cjs` keep 248, plus 48 unchanged |
| The structure lock's span matcher | Gate 1 in the driver | update | Same spans as the old pattern on 1,556 scope files without a double backtick |
| The measure tool's span matcher | Before and after numbers | update | Phase 002's baseline is unchanged under it |

Required inventories:
- Same-class producers: the driver and `measure-voice.py` both parse code spans. Both carry the fix.
- Consumers of changed symbols: `wave-verify.cjs` imports the driver's gates, so it uses the fixed matcher.
- Matrix axes: N/A, one input per file.
- Algorithm invariant: every fact of the original stays, checked by the fact check on each file.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup dry-runs the list and takes the baseline. Implementation runs the wave, fixes the span matcher and retries. Verification runs the wave check and the measure.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each file through the driver's five gates | `rewrite-driver.cjs` |
| Integration | The whole list against HEAD | `wave-verify.cjs`, `measure-voice.py` |
| Regression | Old and new span patterns over every scope file without a double backtick | A one-off node compare |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Mistral Vibe with `deepseek-flash` | External | Green | No rewrites |
| Codex with `gpt-6-luna` | External | Green | No fact check, so no file is kept |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a kept changelog turns out to change a fact, or the span fix lets a broken structure through.
- **Procedure**: revert the phase commit. That restores the changelogs and both scratch tools.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 002 committed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
