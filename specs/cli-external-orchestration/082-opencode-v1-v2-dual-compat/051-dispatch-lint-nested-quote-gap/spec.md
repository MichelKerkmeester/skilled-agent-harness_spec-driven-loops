---
title: "Feature Specification: Phase 51: dispatch-lint-nested-quote-gap"
description: "The Pi dispatch lint still let cli-devin through when the operator's text named it inside a substitution that held a quoted backtick, because the depth scan kept one flat backtick flag and let a quote inside the backtick close the double quote around it. One context-stack scanner that follows POSIX quoting replaces both scan helpers, and structure it cannot resolve is refused."
trigger_phrases:
  - "dispatch lint nested quote gap"
  - "phase 51 dispatch lint nested quote gap"
  - "pi dispatch lint context stack scanner"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 51: dispatch-lint-nested-quote-gap

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/195-dispatch-lint-nested-quote-gap` |
| **Parent Spec** | ../spec.md |
| **Phase** | 51 of 52 |
| **Predecessor** | 050-sk-doc-ci-outside-failures |
| **Successor** | None |
| **Handoff Criteria** | Every new deny row fails on the engine before this phase, the suites hold their baseline, and CI passes at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 51** of the OpenCode v1 and v2 dual compatibility packet. It closes the one P1 that phase 040 shipped as recorded, so 039's review holds no open P1.

**Scope Boundary**: The scan helpers in `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`, their rows in `dispatch-preflight-lint.test.ts`, the lint's row and totals in 039's `review.md`, the known-gaps list in 040's `implementation-summary.md`, the lint's row in the dispatch README, this phase's docs and two rows of `../spec.md`. The refusal policy, the reset forms and the retraction rule are unchanged.

**Dependencies**:
- Commit `6ff94ffe21`, which added quote and escape state to the depth scan and still leaked on a quoted backtick inside `$(`.
- The 040 corpus and mutation scripts, copied into `scratch/` with this phase's base `82df5375ba`.

**Deliverables**:
- One scanner, `isEnclosedOrUnresolved`, in place of `isInsideQuote` and `isInsideExpansion`.
- A deny table of nested-quote phrasings, each failing on the base engine, and allow rows that keep plain text authorizing.
- The review and known-gaps records updated so no P1 is recorded open.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Pi lint refuses an executor mention that sits inside a quote or a command substitution, because text there is shell syntax the operator quoted, not a request. The depth scan kept a single backtick flag, and inside a double quote it only toggled that flag. So in `$(echo "`printf ")"`" cli-devin)` the `"` inside the backtick closed the outer double quote, the quoted `)` closed the substitution, and the mention read as plain text: `cli-devin` was authorized. 040's round-10 review recorded this as an open P1, and the goal allows none.

### Purpose
A mention inside any quote, backtick or substitution never authorizes, and text whose structure the scan cannot resolve is refused rather than guessed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One scanner that walks the text once with a stack of contexts (`$(`, a bare `(` inside it, `${`, backtick, `"`, `'`) and the POSIX rules of each, including backslash escapes.
- Every reading the text could have: with and without shell comments, and with curly quotes as quotes and as literals. A mention any reading encloses is refused.
- A `case` inside a substitution is unresolvable, and only contraction endings count as in-word apostrophes.
- Fail closed when the stack goes deeper than 32, or when the text ends with a context still open, except one prose apostrophe that never closes.
- Deny rows for the known gap and its neighbours, allow rows for plain text after closed contexts.

### Out of Scope
- The refusal words, reset forms and next-sentence retraction - they read the sentence, not its quoting.
- The audit and rule-check engines in `dispatch/lib` - their recorded gaps stay recorded in 040.
- Here-documents in operator text - the lint never read them as enclosures, and a heredoc body in prose is not a dispatch request.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modify | `isEnclosedOrUnresolved` replaces the two scan helpers |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | Deny and allow rows in the refusal phrasings table |
| `../039-sk-code-opencode-alignment-audit/review.md` | Modify | The lint's row and the §2 totals record the P1 fixed |
| `../040-dispatch-lint-held-fixes/implementation-summary.md` | Modify | The known-gaps list drops the closed gap |
| `.skilled/hooks/dispatch/README.md` | Modify | The lint's row states the enclosure rule instead of the closed gap |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `scratch/` | Modify | This phase's packet and its evidence |
| `../spec.md` | Modify | The phase map row for 051 and its handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A mention inside a backtick or `$(` that sits inside double quotes inside a substitution is refused. | `$(echo "`printf ")"`" cli-devin)` denies, and every new deny row fails on the base engine. |
| REQ-002 | Unresolvable structure is refused. | A substitution left open, or nesting past 32, denies. |
| REQ-003 | Plain text after closed contexts still authorizes. | The allow rows pass, and the Pi corpus moves only rows this phase names. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Suites hold their baseline. | Hooks node 872, hooks vitest 401 plus the new rows, rule-checks 42, audit 620, plugins 516, battery 51. |
| REQ-005 | An independent review finds no leak. | A read-only review reports no P1, with up to three fix rounds. |
| REQ-006 | Recursive strict validation of the parent passes. | `validate.sh 082-opencode-v1-v2-dual-compat --recursive --strict` prints `RESULT: PASSED`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No phrasing in the deny table authorizes, and each one authorized on the base engine.
- **SC-002**: 039's review records zero open P1, and CI is green at the pushed commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fail-closed denies plain requests whose text leaves a quote open | Low | A lone prose apostrophe is exempt, and the corpus comparison lists every moved verdict; a false deny is P2 by policy |
| Risk | Shells disagree on quotes inside backticks | Med | The scanner nests a quote inside a backtick, which only lengthens an enclosure, so a disagreement denies |
| Dependency | The 040 corpus | Low | Copied into `scratch/` and run against base `82df5375ba` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The reviewer's findings are tracked as tasks.
<!-- /ANCHOR:questions -->

---
