---
title: "Implementation Plan: Phase 25: release-notes-and-doc-sync"
description: "Collects what phases 019 to 024 changed in one facts file, extends the open advisor changelog entry with three sections through the sk-doc changelog mode, corrects one statement in each of six reference pages and traces every added number back to a closed phase."
trigger_phrases:
  - "release notes and doc sync plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 25: release-notes-and-doc-sync

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | The `sk-doc` changelog, readme and feature catalog modes |
| **Storage** | Seven files under `.skilled/skills/system-skill-advisor/`. Working files under this phase's `scratch/` |
| **Testing** | `check_changelog_shape.py`, `validate_document.py`, `validate_catalog_package.py`, `hvr_scan.py` and a fact trace |

### Overview
The open changelog entry `v1.1.0.0.md` gains three sections for phases 019 to 024, and six reference pages each lose one stale statement. Every sentence is written from `scratch/release-facts.txt`, which the coordinator copies from the closed phases, so the plan and the workers carry no result number of their own. The proof is the shape check, the document check on all seven files and a trace of every added number to its source line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phases 019 to 024 read `Complete` and `origin/main` ships advisor version 1.0.0.0 (T001)
- [ ] `scratch/release-facts.txt` holds six phase blocks and a `checks` block (T002)
- [ ] `scratch/stale-before.txt` holds each stale statement (T003)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The changelog shape check prints `SUMMARY files=1 pass=1 fail=0`
- [ ] The document check exits 0 on all seven files and the catalog package check exits 0
- [ ] `scratch/fact-check.txt` holds no `UNTRACED` line and one `verifier: PASS` line
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
One facts source.

### Key Components
- **`scratch/release-facts.txt`**: the only new file, and it stays in this phase folder. Without it seven workers would each read six closing documents and could each carry a different number. It also lets the fact trace check a page against one file.
- **`changelog/v1.1.0.0.md`**: the open entry. It gains the sections `Command Fit`, `One Head on Every Runtime` and `Workflow Measure`. No new entry is written, because the version on `origin/main` shows this one has not shipped.
- **Six reference pages**: one statement each. No page is restructured.

### Data Flow
The coordinator copies lines from the six `implementation-summary.md` files and from phase 024's `scratch/` into the facts file, each with its source. A worker loads the `sk-doc` mode for its page, writes from the facts file alone and runs the page's check. The coordinator then lists every added number with the facts line behind it, and a verifier that did not write the lines repeats that for the changelog.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `changelog/v1.1.0.0.md` | The open release entry for the advisor | update (T004 to T008) | `check_changelog_shape.py` and `validate_document.py` |
| `runtime/lib/README.md` | Describes each module of the advisor library | update, one row (T009) | `validate_document.py` |
| `runtime/tests/README.md` | Lists each test file with its case count | update, one count (T010) | The count equals the test run's |
| `feature-catalog/cli-surface/advisor-recommend.md` | Describes the recommend command and its options | update, one sentence and one paragraph (T011) | `validate_catalog_package.py` |
| `feature-catalog/scorer-fusion/command-meaning-matching.md` | Describes the meaning pass | update, one count and one sentence (T012) | `validate_catalog_package.py` |
| `feature-catalog/scorer-fusion/doctor-command-routing.md` | Describes the doctor hand-off and its brief line | update, one line (T013) | `validate_catalog_package.py` |
| `runtime/scripts/command-bridges/README.md` | Describes the bridge table. `command-attach-guards.vitest.ts` reads it for the row field names | update, one line (T014) | That test file reports 0 failed |
| `README.md` of the advisor | Already shows the companion line with its policy word | unchanged. It is the wording T013 and T014 follow | `rg` in T003 |
| `SKILL.md`, `description.json` | Version carriers, already at 1.1.0.0 | unchanged | `git diff --quiet` in T017 |
| The root Skilled release note | A published release, amended once on this branch | unchanged. Waits on the operator | `git diff --name-only` in T017 |
| `routing-accuracy/README.md`, session readers `README.md` | Updated by phases 022, 023 and 024 | not in this phase | `git diff --name-only` in T017 |

Required inventories:
- Same-class producers: `rg -l -F '17 cases' .skilled/skills/system-skill-advisor --glob '*.md' --glob '!**/changelog/**'` and `rg -l -F 'Also: /doctor:' .skilled/skills/system-skill-advisor --glob '*.md' --glob '!**/changelog/**'`, so no third page keeps a stale copy.
- Consumers of changed files: `rg -n "command-bridges/README|lib/README|tests/README|v1\.1\.0\.0" .skilled --glob '*.{ts,mjs,cjs,py,json}' --glob '!**/node_modules/**' --glob '!**/dist/**'` lists every script or test that reads one of the seven files.
- Matrix axes: page by stale statement, as the table in `spec.md` lists them. Changelog section by closed phase, so each of the six phases lands in exactly one section.
- Algorithm invariant: N/A. No parser, path or resolver changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup confirms the six phases are closed and the entry is unshipped, then writes `scratch/release-facts.txt` and `scratch/stale-before.txt`. Implementation extends `changelog/v1.1.0.0.md` in one lane and corrects the six pages in six more, all in parallel. Verification runs the shape and document checks, traces every added number into `scratch/fact-check.txt` and checks that only the seven files changed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each page after its task | `validate_document.py`, and `check_changelog_shape.py` after each changelog task |
| Integration | The catalog package and the README test that reads the bridges page | `validate_catalog_package.py --package system-skill-advisor` and `npx vitest run tests/command-attach-guards.vitest.ts` |
| Manual | `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` prints `SUMMARY files=1 pass=1 fail=0`, and the fact trace by a verifier that did not write the lines | The shape check and `scratch/fact-check.txt` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 019 to 024 closed and committed | Internal | 019 to 021 Complete, 022 and 023 in progress, 024 planned | The facts file cannot be written, so no doc task starts |
| `origin/main` at advisor version 1.0.0.0 | Internal | True at planning | The entry would be shipped and a new one is needed. The phase stops and returns to the coordinator |
| `python3` and the three `sk-doc` check scripts | Tool | Present in the repository. Not runnable in the planning session, so their output lines are quoted from the scripts' own source | No page can be checked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: The fact trace finds a number with no source, or a check fails on a page and the page cannot be corrected in one more task.
- **Procedure**: Revert the phase commit. Documents only, so nothing else depends on it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation (lane C in order, lanes L, T, F1, F2, F3 and B beside it) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 019 to 024 closed | Implementation |
| Implementation | Setup. Lane C runs its five tasks in order | Verification |
| Verification | Every lane ended | Close, and the packet's closing alignment run |
<!-- /ANCHOR:phase-deps -->

---
