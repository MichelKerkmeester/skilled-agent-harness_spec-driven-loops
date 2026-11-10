---
title: "Implementation Plan: Review floor, default lens and rule overrides"
description: "Mark every review rule as floor or default lens, fix the severity hints and the TODO rule, read each file's rules from the quality runner's --explain, and report the applied overrides on one Rule sources line."
trigger_phrases:
  - "review floor lens overrides plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Review floor, default lens and rule overrides

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown doctrine, Node.js test and canary scripts, bash test harness |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node:test` in `shared/scripts/tests`, the bash rule-canary suite |

### Overview
`review-core.md` gains a section 8 that names the floor ids, the default-lens ids and how an override reaches the review. Each checklist section cites its ids in a `Rule:` line. The review mode's SKILL.md replaces its detection pseudocode with one `--explain` call and a precedence step, and its output contract gains a `Rule sources:` line. A node suite checks the ids against the contract, and the canary pins the floor ids and the line format.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Each new test fails against the `HEAD` tree and passes against the changed one
- [x] Docs updated (spec, plan, tasks, review docs, changelogs)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One resolver, one contract: review reads what the quality runner resolves and the rows the shared linter accepts, and adds no reader of its own.

### Key Components
- **`review-core.md` section 8**: the floor table, the lens table, the seat-to-level map, the outcomes table, the hygiene mapping and the `Rule sources:` format.
- **`Rule:` lines**: one per checklist section, the machine-readable mark the new suite reads.
- **`resolve_rule_sources` and `applied_overrides`** in SKILL.md: the `--explain` call and the precedence step.
- **`review-lens-overrides.test.cjs`**: the ids against `rule-overrides.json`, the hygiene checker and the runner.

### Data Flow
Reviewed files go to `--explain`. Each file entry gives surfaces, skill folders and checklists with their seats and parsed overrides. Review ranks each row by seat, applies the winners, and writes the groups on the `Rule sources:` line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Review checklists and `review-core.md` | Mixed floor and house rules | update | the new suite, 6 of 6 |
| `sk-code-review/SKILL.md` | Detected surfaces itself | update | canary pins the resolver step |
| `check-rule-copies.js` and its suite | Pins review wording | update | 87 of 87, four new cases fail on `HEAD` |
| `check-review-final-line.js`, `check-review-findings.js` | Parse a report | unchanged | the `rule-sources-valid.md` fixture passes both |
| `quality-gate.cjs --explain` | The resolver | reused, unchanged | the disabled-hygiene case runs it |
| `stack-detection.md` reader table | Named review's pseudocode | update | no `detect_surface_evidence` outside archived specs |
| `@review` agent | Repeats one P0 hint | unchanged here, child 006 | named in the handback |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baselines, Implementation edits the doctrine and writes the tests, and Verification reruns every suite against the changed tree and the `HEAD` tree.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Review ids against the contract, the checker and the runner | `node --test shared/scripts/tests/review-lens-overrides.test.cjs` |
| Integration | The rule canary and both report checkers | `bash sk-code-review/scripts/tests/check-rule-copies.test.sh` |
| Manual | `--explain` on three fixture repositories | `node scratch/show-explain.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `quality-gate.cjs --explain` multi-file output | Internal | Green | No resolver |
| `check-rule-overrides.cjs` and `rule-overrides.json` | Internal | Green | No floor list or grammar |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A review report fails a checker, or a SKILLED review stops applying the TODO format.
- **Procedure**: Revert the commit that carries the review docs, the two test files, the SKILLED checklist row and the three changelog entries.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

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
