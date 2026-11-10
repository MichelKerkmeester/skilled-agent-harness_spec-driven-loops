---
title: "Implementation Plan: Phase 13: addon-removal-and-speed-refinements"
description: "Delete three add-on templates with their wiring, tests and docs, then build six speed refinements to the card, two templates and the validator's repair hint. DeepSeek dispatches make the edits one change at a time and the conductor gates each diff."
trigger_phrases:
  - "addon removal and speed refinements plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 13: addon-removal-and-speed-refinements

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one output branch. Prove it with a line count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, TypeScript, Node ESM scripts, Markdown templates |
| **Framework** | system-spec-kit runtime and validator |
| **Storage** | None |
| **Testing** | vitest (CLI project), the strict and six-rule censuses, card-sync and example-drift guards |

### Overview
The three add-ons leave the manifest, `create.sh`, the phrase tools and the tests in one coordinated change, then the docs follow. The six refinements change the card, the spec and acceptance-criteria templates and the validator's repair hint. The censuses prove no existing packet changes verdict, and the CLI test project proves no new failure.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `rg -n 'quiet' recommend-level.sh` prints the new branch before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] The strict census, the six-rule census and the CLI test project have baselines in `scratch/baseline/`
- [x] The dependency maps for the three add-ons are recorded in `tasks.md`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met
- [ ] `validate.sh` on the 054 packet with `--strict --recursive` prints `RESULT: PASSED` for every folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `recommend-level.sh`. WEAK: Standard architecture. -->

### Pattern
Manifest-driven scaffolding: `templates/spec-kit-docs.json` names every document, and `create.sh`, the phrase tools and the tests read it.

### Key Components
- **`spec-kit-docs.json` and `create.sh`**: decide which add-ons exist and which `--with-lazy-addons` requests; they must change together, or `create.sh` exits 3.
- **`orchestrator.ts` `writeRepairHint`**: the text a model reads after a generated-metadata failure.

### Data Flow
`create.sh` reads the manifest and renders templates into a packet; `validate.sh` runs the compiled orchestrator, which prints the report and the repair hint the card tells a model to act on.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads the current output. Implementation adds the branch. Verification counts lines. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup takes the baselines, Implementation removes the add-ons and builds the refinements, and Verification reruns the censuses and the suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `--quiet` prints 1 line. The default prints 17. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The repair-hint order, the level contracts, the phrase tools, the golden snapshots | `npx vitest run --config vitest.config.ts --project cli` from the skill root |
| Integration | Throwaway packets at Levels 1, 2 and 3, with and without `--with-lazy-addons` | `create.sh` then `validate.sh --strict` |
| Regression | Every existing packet's verdict | `strict-census.mjs` and `rule-census.mjs` against the baselines |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| LLM Gateway, DeepSeek V4.1 Flash 1017 | External | Green | Rerun the brief on cli-codex Luna |
| The census tools in `../010-deep-review-finding-fixes/scratch/tools/` | Internal | Green | No regression proof |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: the default output changes. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a census row changes verdict, or `create.sh` fails at any level.
- **Procedure**: revert this phase's commits with `git revert`; the deleted templates come back with them.
<!-- /ANCHOR:rollback -->

---
