---
title: "Implementation Plan: Run the advisor suite on hook-only changes and delete the production-dead advisor helpers"
description: "Widen the skill-advisor-stress workflow path filter to the advisor hooks, then delete four production-dead advisor helpers with their tests and doc rows. Typecheck, the full and stress suites and the doc validators prove nothing still used them."
trigger_phrases:
  - "advisor ci filter dead helpers plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Run the advisor suite on hook-only changes and delete the production-dead advisor helpers

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, GitHub Actions YAML, Markdown |
| **Framework** | Node advisor runtime |
| **Storage** | None |
| **Testing** | vitest, sk-doc validators |

### Overview
Add the two advisor hooks globs to both path filters of `.github/workflows/skill-advisor-stress.yml`. Delete `redirect-metadata.ts`, `rollback.ts`, `sanitizeEnvelopeSkillLabel` and `filterDefaultRoutable` with the assertions that exercise only them, and the doc rows that name them. Each change runs as a one-change cli-pi DeepSeek Flash brief.
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
- [ ] `npm run typecheck`, `npm test` and the stress suite in the advisor runtime exit 0, and the symbol `rg` prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Dead-code removal plus a CI filter edit

### Key Components
- **`skill-advisor-stress.yml`**: the only workflow that runs the advisor default suite
- **`runtime/lib/`**: the four helpers, none of which has a production caller

### Data Flow
No runtime data flow changes. A pull request whose diff matches a path filter triggers the suite.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.github/workflows/skill-advisor-stress.yml` | Decides when the advisor suite runs | update | a hooks path matches both filters |
| Advisor tests and docs naming the helpers | Exercise or describe the dead code | update | symbol `rg` prints nothing; suites pass |

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

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The trimmed lifecycle, route-exclusions and stress tests | vitest |
| Integration | Full advisor suite and build | `npm test`, `npm run build` |
| Manual | Glob match of a hooks path against the new filters | `git ls-files` against each glob |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi DeepSeek V4.1 Flash max | External | Green | Briefs fall back to Luna xhigh after the quota resets |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a gate stays red after three repairs, or a hidden consumer of a deleted export appears
- **Procedure**: the changes are uncommitted in worktree 537, so `git restore --staged --worktree -- <files>` reverts them; after landing, revert the one commit
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
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---

