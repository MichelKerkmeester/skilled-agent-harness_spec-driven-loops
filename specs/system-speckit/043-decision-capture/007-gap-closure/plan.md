---
title: "Implementation Plan: Phase 7: gap-closure"
description: "Closes the decision-capture gaps the 2026-11-02 research ranked with one small change each: two sweep error paths, an orphan listing in the save step, a Pi nudge, and two duplicated code paths folded into their owners. Code changes go to Luna workers one change per brief; the orchestrator verifies each diff and runs the suites."
trigger_phrases:
  - "gap closure plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: gap-closure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), TypeScript (runtime and Pi extension), Markdown command docs |
| **Framework** | None; OpenCode plugins load under Bun, Pi extensions under Pi |
| **Storage** | The gitignored queue folder `.skilled/skills/.state/decision-capture/` |
| **Testing** | `node --test`, vitest (hooks config and runtime CLI project), a Bun import smoke check |

### Overview
Six changes, each against a seam that already exists: the Codex and Pi sweeps adopt the error convention the other three sweeps use; `save.md` runs the matcher's existing `--scan-orphans`; the Pi extension calls the existing `takeNudge`; the OpenCode sweep defers its SQLite import so the plugin can reuse `openCodeAnswerRecords`; the matcher reads `consumed.jsonl` through the writer's reader; and two docs lose or gain one section. No file is added.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/decision-capture/{lib,bin,claude,devin}/*.test.mjs` reports `fail 0`, and the Pi, OpenCode and runtime CLI suites report no failure
- [ ] `validate.sh specs/system-speckit/043-decision-capture --strict --recursive` prints RESULT: PASSED for every folder
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Reuse the owner. Each duplicated rule moves to the module that already owns it, and each new behavior calls a function that already exists.

### Key Components
- `bin/sweep-codex.mjs`, `bin/sweep-pi.mjs`: the read error now reaches `main()`, which prints `{"error": ...}` and returns 1.
- `pi/decision-capture.ts`: a `turn_end` handler calls `takeNudge` and `ctx.ui.notify`.
- `bin/sweep-opencode.mjs`: `node:sqlite` loads inside `loadOpenCodeParts` and `latestOpenCodeSession` only.
- `.opencode/plugins/decision-capture.js`: builds one completed tool part and passes it to `openCodeAnswerRecords`.
- `decision-record-writer.ts`: exports `readConsumedRows`, which `recordConsumedKeys` and the matcher CLI both use.

### Data Flow
Capture is unchanged: adapters append to the queue and the save writes the record. The save now also lists other sessions' pending answers before it writes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sweep-codex.mjs`, `sweep-pi.mjs` `main()` | Producers of the save-time pending list | update | Missing-transcript tests expect exit 1 and `error` |
| `pi/decision-capture.ts` | Imports `recoveredRecords` from `sweep-pi.mjs` | unchanged import; adds `turn_end` | Pi vitest |
| `save.md`, `save-workflow.md`, hooks README, feature catalog | Describe the Codex and Pi sweep output | update where they say a read failure is silent | `rg -n 'print nothing' .skilled/commands/speckit/save.md` reviewed |
| `openCodeAnswerRecords` | Called by the sweep, `capture-core.test.mjs` and the plugin test | unchanged signature | Existing callers' tests pass |
| `.opencode/plugins/decision-capture.js` | Live OpenCode producer | update | Plugin test's same-key case and a Bun import |
| `recordConsumedKeys` | Called by `workflow.ts:743` and the matcher CLI | unchanged signature | `decision-record-writer.vitest.ts` |
| `decision-capture-live-conversation.md` playbook | Checks the Pi nudge at S2 to S9 | update: Pi now expects the Claude Code nudge sequence. Missed by the first inventory and caught by the second live pass | Pi main `PASS 14/14` |
| `sweep-pi.mjs` `QUESTION_TOOLS`, `pi/decision-capture.ts` | Pi tool-name filter | update: accept pi-plan-build's `question`, found by the second live pass | Sweep and Pi vitest cases for `question` |
| `match-decision-table.ts` consumed reads | `--scan-orphans`, `--release`, matching | update to the writer's reader | `match-decision-table.vitest.ts` |

Inventories run for this plan:
- Same-class producers: the five sweeps; three already report a read error, two are updated here.
- Consumers: `rg -l 'sweep-(codex|pi)\.mjs'`, `rg -n 'openCodeAnswerRecords|answerMap'` and `rg -n 'readConsumedKeySet|recordConsumedKeys'`, all listed above.
- Matrix axes for the sweep error: transcript named or discovered, by readable or unreadable or empty. Named and unreadable errors; discovered and unreadable errors; none found stays silent; readable and empty stays silent.
- Invariant for the moved mapping: the plugin's records keep the same keys as the sweep's, which the plugin test's same-key case checks.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Sweep error paths, Pi nudge, consumed-log reader, matcher CLI | `node --test`, vitest |
| Integration | Plugin records against the sweep's for one answered part | `node --test .opencode/plugins/tests/decision-capture.test.cjs` |
| Manual | Plugin load under Bun | `bun -e "import('./.opencode/plugins/decision-capture.js')"` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../research/research.md` | Internal | Green | None; it only ranks the work |
| cli-codex with `gpt-6-luna` | External | Green | Fallback `deepseek-v4.1-flash-1017` through cli-pi, per the parent goal |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a save on Codex or Pi stops on a sweep error for a transcript that should read, or OpenCode stops capturing.
- **Procedure**: revert the 007 commit; no persisted format changes, so the queue and consumed log need no migration.
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
| Setup | Research ranking | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close-out and the parent's second live pass |
<!-- /ANCHOR:phase-deps -->

---

