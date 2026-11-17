---
title: "Implementation Plan: Phase 22: workflow-measure-soundness"
description: "Extends the transcript scorer's load matchers to shell reads and prompt mirrors, adds two path values and a checkout-aware write boundary, adds a followed rate beside the load rate, which keeps every owned run in its denominator, tightens two readings in the offer module and rescores both stored arms with a written reason for every changed count."
trigger_phrases:
  - "workflow measure soundness plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 22: workflow-measure-soundness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ES modules on Node |
| **Framework** | The routing-accuracy scripts of the skill advisor runtime |
| **Storage** | Reads the stored session files and two run logs. Writes JSON and text under this phase's `scratch/` |
| **Testing** | Vitest, two probes in `scratch/planning/` and two summary runs over the stored arms |

### Overview
The classifier in `score-command-transcripts.mjs` learns two load shapes, two path values and a boundary that ignores writes outside the checkout, and the summary gains `asked`, `otherMode` and `followedRate` with every earlier field untouched. `command-offer.mjs` reports where an offered command sat and stops counting a tool result as a delivery. The proof is a failing-then-passing test per rule, a count identity over both rescored arms and a delta file that names the rule behind every changed count.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phases 019 and 021 read `Complete` and the five files are clean in `git status` (T001)
- [ ] `scratch/workflow-before-pre.json` and `scratch/workflow-before-final.json` exist (T001)
- [ ] `scratch/repro-before.txt` holds the probe outputs (T002)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD npx vitest run` in the advisor runtime reports 0 failed
- [ ] The count identity prints `true` over both after files
- [ ] `scratch/workflow-delta.txt` holds 11 runtime and arm lines
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Additive classifier fields.

### Key Components
- **`shellReadTargets` in the scorer**: without it a runtime that reads documents through the shell scores as loading nothing.
- **`insideCheckout` in the scorer**: without it a note written to a temp folder is the first write and the run is improvised.
- **`asked` and `otherMode`**: two values of the existing `workflowPath` result. Without them correct asking scores as nothing and a wrong-mode load scores as followed.
- **`offeredAs` in the offer module**: without it an offer on the partner side reads as the head's offer. No new file, option or dependency.

### Data Flow
`scoreRun` loads a session, normalizes it to events and passes the row's command, owner, mode, policy and checkout to `workflowPath`. The command load wins, then the owner load, then `otherMode`, then `asked`, then `improvised` for a write inside the checkout, then `none`. `addScored` counts the value and `tallyBlock` prints the counts and the three rates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `score-command-transcripts.mjs` `followedBeforeWrite` | Decides a command load, also used by `startState` | update (T003, T004, T005, T026) | Every existing `followedBeforeWrite` and `startState` case still passes |
| `score-command-transcripts.mjs` `ownerLoadedBeforeWrite`, `workflowPath` | Decide the owner load and the path value | update (T003, T006, T007, T024, T025) | `describe('workflowPath')` |
| `score-command-transcripts.mjs` `tallyBlock`, `writeSummary` | Print the summary | update, additive except the widened `loadRate` denominator (T009, T028) | `describe('run log summary')` and the count identity |
| `command-offer.mjs` `parseOffer`, `recordsHaveBrief` | Record the offer and the delivery on a run line | update (T011, T012) | `command-offer.vitest.ts` |
| `run-command-behaviour.mjs` | Spreads the replayed offer onto a run line | a consumer: a new line gains `offeredAs`. Unchanged | `command-behaviour-guards.vitest.ts` |
| Stored run logs | Hold `offeredCommand` and `offeredPolicy` with no `offeredAs` | unchanged. The summary reads the two old fields only | Both summary runs exit 0 |
| Phase 019's `scratch/workflow-pre.json` and `workflow-final.json` | The first recorded numbers | unchanged. This phase writes its own files | `git status` on that folder prints nothing |
| `README.md` in `routing-accuracy` | Lists the summary fields | update (T014) | `rg` for the four new names |

Required inventories:
- Same-class producers: `rg -n "event.kind !== 'read'|event.kind === 'read'" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`.
- Consumers of changed symbols: `rg -n "workflowPath|firstWritePosition|followedBeforeWrite|parseOffer|offeredAs" .skilled --glob '*.mjs' --glob '*.ts' --glob '!**/dist/**'`.
- Matrix axes: load shape (read tool, skill tool, shell read, prompt mirror, compiled route) by path value, write place (relative, inside checkout, outside checkout, temp with no checkout) and row policy (run, start, ask).
- Algorithm invariant: `command + skill + asked + otherMode + improvised + none` equals the owned scored runs for every runtime and arm, and no run moves from a loaded value to an unloaded one.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup confirms phases 019 and 021 are closed and scores both arms with the current scorer. Implementation changes `score-command-transcripts.mjs` and `command-offer.mjs`, test first, then the README. Verification rescored both arms, checks the count identity and writes the reason for every changed count.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `workflowPath`, `followedBeforeWrite`, `confirmStem`, `parseOffer`, `briefDelivered`, the summary block | Vitest, two existing files |
| Integration | Both stored arms through `--summary --json`, with the count identity | The committed scorer and `jq` |
| Manual | `node scratch/planning/probe-measure-units.mjs` prints `skill`, `command`, `command`, `command`, `otherMode`, `skill`, `asked` | The unit probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 019 closed and committed | Internal | In progress at planning | Lane S cannot start, because both phases edit the scorer |
| Phase 021 closed | Internal | Planned | T013 would state a rule that does not hold yet |
| The stored sessions and arenas | Internal | Readable at planning, approved for deletion after scoring | T016 cannot rescore. The unit tests still prove each rule |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: The count identity fails, or an earlier field prints a different value for the same log.
- **Procedure**: Revert the phase commit. The before files in `scratch/` keep the numbers the earlier scorer printed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation (lanes S and O in parallel, lane D after both) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 019 and 021 closed | Implementation |
| Implementation | Setup. Lane S runs its tasks in order | Verification |
| Verification | Every lane ended, and the stored sessions still readable | Close, the arena deletion and phase 023 |
<!-- /ANCHOR:phase-deps -->

---
