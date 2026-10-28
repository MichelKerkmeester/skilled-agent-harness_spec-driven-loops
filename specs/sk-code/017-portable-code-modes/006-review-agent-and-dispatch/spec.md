---
title: "Feature Specification: Review agent and dispatch"
description: "The review agent carries its own checklist, house rules and a score-70 blocker that contradict the review mode, the CODE-REVIEW marker has no dispatcher, and the checkers miss the agent's Recommendation line. This child aligns the agent, its dispatcher, the checkers and the canary with the mode."
trigger_phrases:
  - "review agent and dispatch"
  - "review agent verdict follows severity"
  - "code review marker dispatcher"
  - "check rule copies mode only"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Review agent and dispatch

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/250-review-agent-and-dispatch` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `@review` agent carries a second checklist with house rules (conventional commits, no merge commits, under 500 lines, cyclomatic below 10, browser-only checks) and fails a change that scores below 70 even with no P0 or P1, which contradicts the review mode's "P2 never blocks". The review mode promises a `CODE-REVIEW` marker that a dispatcher adds, and nothing adds it. The agent and `@deep-review` hard-code `.skilled/` skill paths, the two report checkers ignore the agent's `Recommendation:` line, and the rule canary exits 1 in any repository without this one's `AGENTS.md`.

### Purpose
The review agent applies the mode's floor and lens with a severity verdict, `@orchestrate` adds the marker and the speckit review entries state it, the checkers catch a contradicting `Recommendation:` line and the canary can check the mode's own pins anywhere.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured at `HEAD` `6615ae8dc7` of the worktree:

```text
$ git show HEAD:.skilled/agents/review.md | grep -n "threshold: 70\|< 10 cyclomatic\|No merge commits\|<500 lines\|Security issues are P0 by default\|### Quality Gate Protocol\|APPROVE/REQUEST CHANGES/BLOCK"
121:| **4: Gate Validation** | Orchestrator integration              | Pass/fail (threshold: 70), numeric score, circuit breaker state          | Gate Validation Result  |
198:[ ] Complexity reasonable (< 10 cyclomatic)
223:[ ] No merge commits in feature branch
229:[ ] File changes reasonable (<500 lines preferred)
252:### Quality Gate Protocol
286:`## PR Review: [Title]` → Summary (Recommendation: APPROVE/REQUEST CHANGES/BLOCK, Score: XX/100) → ...
441:- Security issues are P0 by default
$ git show HEAD:.skilled/commands/speckit/assets/speckit-implement.yaml | grep -c "CODE-REVIEW"
0
$ git show HEAD:.skilled/agents/orchestrate.md | grep -c "Quality Gate:"
0
$ cd <scratch repo outside the checkout> && node <HEAD canary> --mode-only
check-rule-copies.js: unknown option: --mode-only
exit=2
$ bash .skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh
89 PASS, All rule-canary test cases passed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `@review` so it drops its own checklist and house rules, applies the mode's floor and lens, derives pass or fail from severity, keeps the score advisory, uses the mode's one verdict vocabulary, takes PR rules from the repository's declared conventions, fixes its P0 hint and renames its gate.
- Give `@review` and `@deep-review` the loaded-skill path pattern `@code` uses.
- Make `@orchestrate` add the `CODE-REVIEW` marker when it dispatches a code review, state the same marker in the `/speckit:implement` and `/speckit:complete` review entries for any step that dispatches `@review`, reword the floor text to "a dispatcher adds" and make the integration sentences true. The speckit steps gain no dispatch: `agent_availability` is not instructions, and adding one would change workflow behavior beyond the approved plan.
- Make `@orchestrate` name and read `@code`'s `Quality Gate` RETURN field.
- Make both report checkers read the `Recommendation:` line, validate the `Rule sources:` line when present, and add `check-rule-copies.js --mode-only`.
- Regenerate every runtime mirror of the three agents.

### Out of Scope
- Playbooks, feature catalogs and the broad README sweep - child 010 owns them.
- The `/speckit:implement` dashboard's `pass` value - child 009 owns it.
- The CI canary step - it keeps the full mode, as the brief requires.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/review.md` | Modify | Verdict from severity, advisory score, rules applied, Review Gate Protocol, one vocabulary, loaded-skill paths |
| `.skilled/agents/deep-review.md` | Modify | Loaded-skill paths |
| `.skilled/agents/orchestrate.md` | Modify | Code Review Marker rule, Reading @code's Quality Gate |
| `.claude/agents/{review,deep-review,orchestrate}.md`, `.codex/agents/*.toml`, `.pi/agents/*.md` | Modify | Mirrors, the Claude fork by its path rule and the other two by their generators |
| `.skilled/commands/speckit/assets/speckit-implement.yaml`, `speckit-complete.yaml` | Modify | `dispatch_prompt` marker, severity `verdict`, `on_block` |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `README.md`, `references/review-core.md` | Modify | "A dispatcher adds", the create-workflow sentence, the checker notes |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js`, `check-review-findings.js` | Modify | `Recommendation:` and `Rule sources:` checks |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Modify | `--mode-only`, the reworded floor pin |
| `.skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh`, `review-output-fixture/*` | Modify/Create | 36 new cases, eight fixtures |
| `.skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs`, `shared/references/universal/rule-overrides.md` | Modify | Export `RULE_ID` and name the export |
| `.opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs` | Create | Pins the marker, the severity gate and the Quality Gate field |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Recompiled source digest |
| Four changelog entries, their carriers, seven Hermes copies | Create/Modify | sk-code-review v1.9.6.0, deep-review v1.11.9.0, system-spec-kit v2.12.14.0, sk-code v3.9.12.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `@review` keeps no checklist or house rule of its own, its pass or fail follows severity (any P0 or open P1 fails), its score is advisory and every format uses the mode's three status values |
| REQ-002 | `@orchestrate` adds the exact `CODE-REVIEW` line as the dispatcher, both speckit review entries state it for a step that dispatches `@review` without claiming to dispatch, and the floor text says a dispatcher adds it |
| REQ-003 | Both checkers fail a report whose `Recommendation:` contradicts its status line or its findings, the findings checker applies the same severity rules to the final status, and the final-line checker validates a `Rule sources:` line when present, with the id grammar read from the shared linter |
| REQ-004 | `check-rule-copies.js --mode-only` exits 0 from a scratch repository outside this one when the mode's pins hold, prints a `SKIPPED:` line, and CI keeps the full mode |
| REQ-005 | `check-agent-mirror-sync.cjs` passes after the mirrors are regenerated, and the canary suite, the speckit contract tests and the playbook ids do not regress |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `@review` and `@deep-review` name skill files by the loaded-skill path pattern |
| REQ-007 | `@orchestrate` names `@code`'s `Quality Gate` field and says what to do for each runner verdict |
| REQ-008 | `@review` takes PR rules from the repository's declared conventions, its P0 hint follows the reach rule and its gate is named apart from the quality runner's |
| REQ-009 | Changelog entries validate with 0 issues, the carriers are stepped and the Hermes copies are in sync |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The canary suite fails 28 of its new cases against the `HEAD` checkers and passes all 125 cases against the changed ones.
- **SC-002**: The new dispatch contract test fails 5 of 5 against the `HEAD` agents and YAMLs and passes 5 of 5 against the changed ones.
- **SC-003**: `check-rule-copies.js --mode-only` exits 0 from a scratch repository with the skill installed under another folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 005's floor, lens, resolver step and `Rule sources:` line | The agent applies them | Landed on main before this child, and the agent points at them rather than copying them |
| Risk | A new checker rule fails an old report | Med | A `Recommendation:` counts only when its whole value is a verdict token, template lines are skipped, severity is compared only with a `## Findings` section, and the suite's expectation for every old fixture holds |
| Risk | A gate that blocked on a low score now passes | Low | That is the intended change, and the changelog's Upgrade note says it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the checkers read one report file each, with no change in cost that matters.

### Security
- **NFR-S01**: A secret in the diff or the history stays a floor finding, whatever PR conventions a repository declares.
- **NFR-S02**: `--mode-only` reads only files inside the installed skill and writes nothing.

### Reliability
- **NFR-R01**: Without `--mode-only` the canary checks exactly what it checked before, and CI calls it without the flag.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a report with no `Recommendation:` or `Rule sources:` line is checked exactly as before, and `Rule sources: none` passes.
- Maximum input: every verdict-bearing `Recommendation:` line is compared, and a second `Rule sources:` line fails.
- Failure path: `--mode-only` with a reworded floor in the installed skill exits 1 with the `MISSING:` line and the `SKIPPED:` line.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three agents with nine mirrors, two YAMLs, three checkers and the shared linter export, eight fixtures, two test files and docs |
| Risk | 9/25 | Review gate semantics change for the agent. Status lines, finding schema and guards unchanged |
| Research | 8/20 | The mode contract, the mirror generators, the deep-loop contract compiler and the CI canary step |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The judgment calls are recorded in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---
