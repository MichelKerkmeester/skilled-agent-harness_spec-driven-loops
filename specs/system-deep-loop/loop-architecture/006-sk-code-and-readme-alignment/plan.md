---
title: "Implementation Plan: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard"
description: "Seven read-only folder lanes audit the skill against sk-code and sk-create-readme and class each finding as behaviour-neutral, behaviour-changing or undecided. Fourteen fix lanes then apply only the behaviour-neutral items, one code agent and one README agent per folder lane, so no two agents edit the same file. Commits land one lane at a time after every lane has finished."
trigger_phrases:
  - "sk code and readme alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS JavaScript, Bash |
| **Framework** | None; Node runtime scripts and libraries |
| **Storage** | None changed |
| **Testing** | Vitest, `tsc --noEmit`, sk-code quality gate, sk-create-readme checkers |

### Overview
Seven read-only folder lanes audit the skill against sk-code and sk-create-readme and class each finding as behaviour-neutral, behaviour-changing or undecided. Fourteen fix lanes then apply only the behaviour-neutral items, one code agent and one README agent per folder lane, so no two agents edit the same file. Commits land one lane at a time after every lane has finished.
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
- [ ] `bash scratchpad/gate.sh dlh` prints vitest 0 failed, three check exits of 0, 18 parity tests passed and `validate exit=0 passed=16 failed=0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: a documentation and comment hygiene pass over an existing library

### Key Components
- **Audit lanes**: read-only audits that write one finding table per lane to the scratchpad
- **Fix lanes**: code agents edit comment lines, README agents edit README files

### Data Flow
Audit tables feed the fix lanes, whose diffs are checked for comment-only code changes before each lane commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Code under the skill | Runtime behaviour | Unchanged | Comment-only diff check per lane |
| Code-folder READMEs | Describe the code | Update | The three sk-create-readme checkers |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup scaffolds this packet and records the checker and test baselines. Implementation runs the seven audit lanes and then the fourteen fix lanes. Verification runs the full gate and every checker from the final state. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The runtime vitest suite | Vitest |
| Integration | Contract parity and packet validation | Vitest, validate.sh |
| Manual | Spot-read of inserted doc comments | Reading |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-create-readme checkers | Internal | Green | READMEs cannot be proven valid |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A gate regression traced to a lane commit
- **Procedure**: `git revert` the lane commit; each lane is its own commit
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
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

