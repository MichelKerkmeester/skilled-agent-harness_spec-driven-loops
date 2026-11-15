---
title: "Implementation Plan: Phase 6: cli-external-orchestration-changelogs"
description: "Rewrite the 210 queued cli-external-orchestration changelogs with the phase 001 driver, retry any restored file, and check the wave against HEAD. A spent API budget restored 180 files, so the driver now stops on it and the worker runs on the Vibe login key."
trigger_phrases:
  - "cli external orchestration changelogs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: cli-external-orchestration-changelogs

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
The phase 001 driver rewrites each queued changelog through DeepSeek Flash and keeps it only when all five gates pass. `wave-verify.cjs` then re-runs the gates against HEAD, and `measure-voice.py` gives the before and after numbers. A file that fails for a tool or account reason gets the cause fixed and a retry, never a hand edit.
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
- **`../scratch/rewrite-driver.cjs`**: dispatches each file and applies the five gates. Its limit pattern now also matches a spent API budget, and `runProcess` gains an `unsetEnv` option that drops `MISTRAL_API_KEY` from the worker.
- **`../scratch/measure-voice.py`**: counts sentence lengths. Its splitter now ends a sentence inside closing quotes or brackets.
- **`../scratch/wave-verify.cjs`**: re-runs the gates and compares each record with HEAD before the commit.

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
| The 210 queued changelogs | Skill release history | update | `wave-verify.cjs` keep 184, plus 26 unchanged |
| The driver's limit pattern | Stops a run on a usage limit | update | The pattern caught all 543 budget logs and no other log |
| The worker environment | Carries the Mistral key | update | An isolated call without `MISTRAL_API_KEY` finished at cost 0 |
| The measure splitter | Counts sentence lengths | update | Phases 002 to 005 still show 0 sentences over 22 words |

Required inventories:
- Same-class producers: the Codex fact check is the other external call. It never read `MISTRAL_API_KEY` and is unchanged.
- Consumers of changed symbols: `wave-verify.cjs` imports the driver's gates, which are unchanged. It never spawns a worker.
- Matrix axes: N/A, one input per file.
- Algorithm invariant: every fact of the original stays, checked by the fact check on each file.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup dry-runs the list and takes the baseline. Implementation runs the wave, finds the budget outage, changes the driver and retries. Verification runs the wave check and the measure.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each file through the driver's five gates | `rewrite-driver.cjs` |
| Integration | The whole list against HEAD | `wave-verify.cjs`, `measure-voice.py` |
| Regression | The new limit pattern over every run log, and the new splitter over phases 002 to 005 | `node -e`, `measure-voice.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Mistral Vibe with `deepseek-flash` on the Vibe login key | External | Green | No rewrites |
| Codex with `gpt-6-luna` | External | Green | No fact check, so no file is kept |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a kept changelog turns out to change a fact, or the wider limit pattern stops a healthy run.
- **Procedure**: revert the phase commit. That restores the changelogs, the driver and the measure script.
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
| Setup | Phase 005 committed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
