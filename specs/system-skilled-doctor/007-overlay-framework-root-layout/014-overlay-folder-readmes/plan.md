---
title: "Implementation Plan: Phase 14: engine support for overlay folder READMEs"
description: "Adds an advisory docs leg to status --audit that walks the overlay folder and runs sk-doc's validator on each README, keeps documentation-only READMEs out of every engine command, and refuses a layout-link path listed twice. The engine change lands first, then the docs that describe it."
trigger_phrases:
  - "overlay folder readmes plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: engine support for overlay folder READMEs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (the engine), Python 3 (sk-doc's validator, spawned) |
| **Framework** | None |
| **Storage** | None. The leg reads the overlay folder and writes nothing |
| **Testing** | `node --test` over the engine, guard and doctor overlay contract suites |

### Overview
The engine gains one pure classifier for README roles and one walk of the overlay folder that feeds a separate docs leg of `status --audit`. The leg spawns sk-doc's validator per README and stays out of the status result. The duplicate layout-link refusal joins the manifest checks that run before any write.
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
- [ ] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` prints `fail 0` with more than 294 tests
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: a single-file command-line engine with pure planners and one write path.

### Key Components
- **README classifier**: decides shipping or documentation-only from the manifest entries alone.
- **Docs leg**: walks the overlay folder, collects missing-readme findings, spawns the validator and builds the `docs` report.

### Data Flow
`commandStatus` loads the manifest, runs the existing analysis and, under `--audit`, the vendored-tree audit and the docs leg side by side. Only the vendored-tree audit feeds the result. The docs leg feeds its own lines, count and `--json` key.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `commandStatus` in `overlay-engine.cjs` | Builds the status lines and `--json` | Update: adds the docs leg beside `audit` | The new docs tests and an unchanged-exit test |
| `adopt`, `capture`, `apply`, `repin --stage`, `relayout`, `pre-commit` | Read or write overlay sources | Update only where a documentation-only README leaks in | One test per command |
| Manifest checks for `layoutLinks` | Refuse an invalid link before writes | Update: a path listed twice is refused | Red-first test from phase 012's case |
| `doctor-overlay-presentation.txt`, `overlays.md`, workflows | Read `status` output | Update: name the DOCS lines | The doctor overlay contract test and `route-validate.sh` |

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

Setup writes the README contract to the shared scratchpad. Implementation changes the engine and its tests, then the docs. Verification runs the four suites, the red-first run against `bf6806ad4b3`, and the review. `tasks.md` holds the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | README classifier, walk skip list, duplicate-path check | `node --test` |
| Integration | `status --audit`, apply, adopt, capture, `repin --stage`, relayout and pre-commit on fixture trees, one with the real sk-doc validator | `node --test` |
| Manual | `status --audit` on Barter's tree, read only, compared with the engine at `bf6806ad4b3` | shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc `validate_document.py` | Internal | Green | Validation is skipped with one line; missing-readme findings still print |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: an adopter's status result or exit code changes because of the docs leg, or an engine suite regresses.
- **Procedure**: revert this phase's engine and doc commits on main with `git revert`; the leg writes nothing, so no state needs repair.
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
| Setup: the README contract | Nothing | Implementation, and the ai-speckit session's READMEs |
| Implementation: engine, then docs | The contract | Verification |
| Verification: suites, red-first run, review | Implementation | The merge into main |
<!-- /ANCHOR:phase-deps -->

---

