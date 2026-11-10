---
title: "Implementation Plan: Review agent and dispatch"
description: "Point the review agent at the mode's floor, lens and severity verdict, give the orchestrator the CODE-REVIEW marker, teach the checkers the Recommendation line and give the canary a mode-only run."
trigger_phrases:
  - "review agent and dispatch plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Review agent and dispatch

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent and skill doctrine, YAML command workflows, Node.js ESM checkers, bash test harness |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The bash rule-canary suite, `node:test` contract tests, the speckit and deep-loop contract suites |

### Overview
The `@review` agent loses its own checklist and score bands. It applies the review mode's floor and lens, reads its rules through the mode's resolver step and states one verdict in the mode's vocabulary, which severity alone decides. The speckit review steps and `@orchestrate` add the `CODE-REVIEW` marker. The two report checkers learn the `Recommendation:` line and the `Rule sources:` format, and the canary gains `--mode-only`.
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
The agent points at the mode, the mode owns the rules: no agent restates a rule the mode already defines, and the checkers enforce the agreement between a report's lines.

### Key Components
- **`review.md` sections 5 to 8**: the verdict table, the advisory score, the rules applied, the Review Gate Protocol and the one-vocabulary output formats.
- **`### Code Review Marker` in `orchestrate.md`**: the dispatcher that adds the marker. **`dispatch_prompt` in the two speckit YAMLs**: states the marker for any step that dispatches `@review`, and dispatches nothing itself.
- **`readRecommendations` and `checkRuleSources` in `check-review-final-line.js`**: the summary readers, exported to the findings checker.
- **`checkRecommendation` in `check-review-findings.js`**: the severity comparison.
- **`--mode-only` in `check-rule-copies.js`**: filters the pins to the skill's own and resolves them against the folder the script ships in.

### Data Flow
`@orchestrate` renders `CODE-REVIEW`, a blank line and the review prompt. The agent loads the mode, resolves each file's rules, classifies findings and derives the verdict. The final-line checker compares the summary lines with the status line, and the findings checker compares the `Recommendation:` with the findings' severities.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `@review` and its five mirrors | Own checklist, score blocker | update | dispatch contract test, mirror gate |
| `@deep-review` and its mirrors | Hard-coded skill paths | update | mirror gate, deep-review parity suite, contract drift check |
| `@orchestrate` and its mirrors | No marker, no Quality Gate reading | update | dispatch contract test |
| Speckit implement and complete YAMLs | Review entry without the marker | update, no new dispatch | dispatch contract test, speckit contract suites |
| Both report checkers | Missed `Recommendation:` and the status severity | update | canary suite, 28 new cases fail on `HEAD` |
| Shared rule-overrides linter | Kept `RULE_ID` private | export it | shared suites 18 of 18, quality runner 137 of 137 |
| `check-rule-copies.js` | Needed this repository's `AGENTS.md` | update | foreign-repository cases |
| CI canary step (`rule-canary-sync.yml`) | Full mode | unchanged | still calls `node "$CANARY"` |
| Deep-review compiled contract | Records the agent's digest | regenerate | `check-contract-drift.cjs` OK |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baselines, Implementation edits the checkers with their tests first, then the docs, agents and YAMLs, and Verification reruns every suite and the fail-before copies.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | The canary, both report checkers, `--mode-only` from a foreign repository | `bash sk-code-review/scripts/tests/check-rule-copies.test.sh` |
| Contract | The marker, the severity gate, the Quality Gate field | `node --test .opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs` |
| Regression | Speckit, deep-loop and mirror gates | the named test files in `tasks.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 005's review floor, lens and `Rule sources:` line | Internal | Green, in this worktree's base | The agent would have nothing to point at |
| The Codex and Pi mirror generators | Internal | Green | Mirrors would drift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A review report that used to pass a checker now fails it, or the orchestrator stops dispatching a review.
- **Procedure**: Revert the commit that carries the agents, their mirrors, the two YAMLs, the checkers, the fixtures, the tests and the three changelog entries, then rerun the mirror generators and the contract compiler.
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
