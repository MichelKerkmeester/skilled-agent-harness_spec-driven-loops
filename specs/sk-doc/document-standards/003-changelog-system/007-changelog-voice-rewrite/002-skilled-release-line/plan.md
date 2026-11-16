---
title: "Implementation Plan: Phase 2: skilled-release-line"
description: "Rewrite the 60 queued Skilled release entries with the phase 001 driver, retry the restored files once, and check the wave against HEAD. Then sync the published release bodies from the new entry text."
trigger_phrases:
  - "skilled release line plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: skilled-release-line

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown entries, the Node driver and wave check in `../scratch/`, Python measure and house checks |
| **Framework** | None |
| **Storage** | `../scratch/state.jsonl`, one record per dispatch |
| **Testing** | The driver's five gates, `wave-verify.cjs`, `measure-voice.py`, a `gh release view` read-back |

### Overview
The phase 001 driver rewrites each queued entry through DeepSeek Flash and keeps it only when all five gates pass. `wave-verify.cjs` then re-runs the gates against HEAD, and `measure-voice.py` gives the before and after numbers. Last, each changed entry with a published release gets its body replaced, and a read-back proves the edit.
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
- **`../scratch/rewrite-driver.cjs`**: dispatches each file and applies the five gates, from phase 001.
- **`../scratch/wave-verify.cjs`**: re-runs the gates and compares each record with HEAD before the commit.

### Data Flow
The driver reads each original from HEAD, sends it to the worker, gates the result and writes a record to `state.jsonl`. A kept file stays in the worktree, and a failed one is restored. The sync builds each body from the kept entry, minus its frontmatter and H1, and keeps the footer the old body had.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The 60 queued entries | Release history | update | `wave-verify.cjs` keep 51, plus 9 unchanged |
| GitHub release bodies | Published copy of each entry | update | Read-back equals the text sent, 52 of 52 |

Required inventories:
- Same-class producers: N/A, no code changes.
- Consumers of changed symbols: N/A, no symbol changes.
- Matrix axes: N/A, one input per file.
- Algorithm invariant: every fact of the original stays, checked by the fact check on each file.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup dry-runs the list. Implementation runs the wave and the retry. Verification runs the wave check, the measure and the sync read-back.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each file through the driver's five gates | `rewrite-driver.cjs` |
| Integration | The whole list against HEAD | `wave-verify.cjs`, `measure-voice.py` |
| Manual | Each synced body read back | `gh release view --json body` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Mistral Vibe with `deepseek-flash` | External | Green | No rewrites |
| Codex with `gpt-6-luna` | External | Green | No fact check, so no file is kept |
| `gh` CLI with release write access | External | Green | No body sync |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a kept entry turns out to change a fact, or a synced body is wrong.
- **Procedure**: revert the phase commit for the entries. Restore a body with `gh release edit <tag> --notes-file scratch/release-bodies-before/<tag>.md`.
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
| Setup | Phase 001 committed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The release body sync and close |
<!-- /ANCHOR:phase-deps -->

---

