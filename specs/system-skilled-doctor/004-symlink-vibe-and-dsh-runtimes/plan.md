---
title: "Implementation Plan: Add the Mistral Vibe and DSH runtimes to the doctor link manifest and its runtime lists"
description: "Add two runtime entries to the doctor link manifest and name them in six runtime lists. A data change, proved by the link engine's tests."
trigger_phrases:
  - "symlink vibe and dsh runtimes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Add the Mistral Vibe and DSH runtimes to the doctor link manifest and its runtime lists

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON, Markdown and YAML, with Node.js tests |
| **Framework** | None |
| **Storage** | `symlink-manifest.json` |
| **Testing** | `node --test` |

### Overview
The link engine reads its runtimes from the manifest, so two new entries are the whole behavior change. Six documents repeat the runtime list and are edited to match. The link engine's test file proves both links.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [ ] The operator has said to start the build

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Change existing data.

### Key Components
- **`symlink-manifest.json`**: gains `vibe` and `dsh` under `runtimes`. No engine code changes, because the engine already takes its runtime names from this file.

### Data Flow
The engine loads the manifest, keeps the runtimes the caller named or the ones whose folder already exists in the target, and links each entry.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup captures the test baseline and reads `.vibe` and `.dsh` for a per-project file. Implementation adds the two entries to `symlink-manifest.json` and edits the six lists. Verification runs the doctor script tests and tries a linked project.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`node --test .skilled/commands/doctor/scripts/tests` must print `fail 0`, with one new test per runtime that fails before the manifest changes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None new.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a linked project shares a file between projects that must be its own. Revert the one commit. A link already made in a project is removed with `/doctor:symlink unlink`.
<!-- /ANCHOR:rollback -->

---

