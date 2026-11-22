---
title: "Implementation Plan: Phase 2: schedule-predicates-and-checker"
description: "Builds the cron translator, label grammar and slot lister as callable predicates, then the definition checker that imports them. A hand-written weekday probe runs from day one and decides the weekday-only translator rule."
trigger_phrases:
  - "schedule predicates and checker plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: schedule-predicates-and-checker

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript library modules plus a `.cjs` checker script, as phase 1 decides the build (research.md §15 recommendation 6) |
| **Framework** | None. Node built-ins only |
| **Storage** | None. The probe writes one log file outside the checkout |
| **Testing** | The test runner phase 1 picks for the skill runtime, plus fixture runs of the checker |

### Overview
This phase adds three predicates under `.skilled/skills/system-skilled-bots/runtime/lib/` and one checker under the skill's `scripts/` folder. The translator comes first, because the label grammar, the slot lister and the checker all read it (research.md §15). A live `Weekday`-only probe starts on day one and decides one translator rule before the phase closes (research.md §16 Q1).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phase 1 has shipped the field predicates and identity resolver, checked by importing them in a scratch script before the checker work starts

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The skill runtime test suite exits 0, and `bot-check.cjs` on the clean fixture prints no `FAIL:` line and exits 0
- [ ] The probe record is in `decision-record.md` and `ls ~/Library/LaunchAgents | rg com.skilled.probe` prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Pure predicate library. Each module is a pure function with no I/O, and the checker is the only part that reads files.

### Key Components
- **Cron translator**: turns a cron string into an ordered list of calendar dictionaries, into `StartInterval 60`, or into a refusal with an invariant id. Without it nothing can install a cron bot exactly.
- **Label grammar**: builds and parses `com.skilled.bots.<identity>.<bot-id>.<schedule-index>`. Without it two repositories with the same bot id collide in `~/Library/LaunchAgents` (research.md §7).
- **Slot lister**: lists the calendar slots between two instants from the translator's dictionaries. Without it the runner cannot write `scheduled_at` or a skipped-slot summary at fire time (research.md §7).
- **Definition checker**: reads a `bots/` folder, runs every hard and advisory invariant and prints the §6 contract. Without it a bad `BOT.md` fails only at its first fire.

### Data Flow
The checker reads each `BOT.md` and parses it with the phase 1 parser. It passes fields to the phase 1 predicates and the cron string to the translator. A translation result feeds the label grammar for each schedule index. The slot lister takes the same translation result plus two instants and returns slot instants. It never parses cron itself.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

N/A: this phase adds new modules and fixes no reported finding. The one shared surface it reads is `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, as the model for the output contract and exit codes. It is not edited.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Source of the `PASS\|FAIL\|WARN\|INFO` line format and the 0, 1, 2 exits | unchanged | `git diff --stat` shows no change to it |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Owns the executor enum and budget bounds the checker validates | unchanged, imported through phase 1 | `rg -n 'cli-opencode' .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'StartCalendarInterval' .skilled` lists every existing plist writer before the translator lands.
- Consumers of changed symbols: none exist yet. Phase 6 and phase 8 become consumers.
- Matrix axes: cron field (minute, hour, day, month, weekday) by form (star, list, range, step, macro). The translator test lists the rows before it runs.
- Algorithm invariant: a translation is exact or refused. Never a superset or subset of cron's fire set.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup installs the weekday probe on day one and confirms the phase 1 predicates import. Implementation builds the translator, then the label grammar and the slot lister, then the checker and its fixtures. Verification reads the probe log, sets the weekday rule, runs the suite and the checker fixtures, and removes the probe.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The one gate command is the skill runtime test suite, and it must exit 0. The translator tests pin the dictionary cap of 128 and the interim single-day-field rule, refuse, until the probe decides it (decision-record.md ADR-001, ADR-002). The checker is proven by running it on each fixture and reading both its lines and its exit code.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Translator rows per field and form, refusals by id, cap, label round trip, slot lister on a fixture set with one daylight-saving boundary run under a fixed `TZ` | The phase 1 test runner |
| Integration | Checker over the clean fixture and each one-defect fixture, with and without the strict switch | `node bot-check.cjs <fixture>`, reading output and exit status |
| Manual | The live weekday probe across a matching and a non-matching day | `launchctl print gui/$(id -u)/com.skilled.probe.weekday` and the probe log |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 (`001-contracts-and-state-root`): parser, field predicates, config reader, identity | Internal | Yellow: planned, not built | Checker and label grammar wait. Translator, lister and probe do not |
| `launchctl` and `plutil` on macOS | External | Green: present on the build host | The probe cannot run |
| Phase 3 (`003-manual-runner`) | Internal | Not a dependency | Runs in parallel with this phase |
| Phase 4 (`004-worktree-isolation-and-delivery`) | Internal | Later | Adds the `isolation: worktree` invariant and fixture to this checker |
| Phase 6 (`006-launchd-installer`) | Internal | Consumer | Uses the translator, label and lister. Blocked until this phase closes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: the probe fires on a non-matching day or more than once per matching day, a translator test shows a fire set that differs from cron, or the probe must stop early.
- **Procedure**: remove the probe with `launchctl bootout gui/$(id -u)/com.skilled.probe.weekday` and `rm ~/Library/LaunchAgents/com.skilled.probe.weekday.plist`, then confirm `launchctl print gui/$(id -u)/com.skilled.probe.weekday` fails. Code changes are new files only, so reverting the phase commit removes them. Nothing outside the skill folder is edited.
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
| Setup (probe install, phase 1 import check) | Phase 1 shipped for the import check only | The weekday observation |
| Implementation (translator, label, lister, checker) | Setup. Translator before checker | Verification |
| Verification (probe read, weekday rule, suite, fixtures, probe removal) | Implementation and two observed days | Phase close and phase 6 |
<!-- /ANCHOR:phase-deps -->

---
