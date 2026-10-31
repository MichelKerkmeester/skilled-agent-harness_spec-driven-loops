---
title: "Implementation Plan: Support git-ignored local-* commands in every runtime"
description: "Extend the local-* skill precedent to commands: seven ignore rules, one skip in the command-catalog check and one extra pattern in the pre-commit guard, each pinned by test cases that fail against the HEAD file."
trigger_phrases:
  - "local command support plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Support git-ignored local-* commands in every runtime

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | gitignore patterns, Node.js CommonJS, Bash 3.2 for the pre-commit hook |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` for the catalog check, `pre-commit.test.sh` for the hook, the mirror `--check` scripts |

### Overview
Three tracked files gain `local-*` command support and two test files pin it, following the private-skill work in `specs/sk-code/013-private-surface-skills`. The generators need no change: they already walk `.skilled/commands`, skip `assets/` and keep only real files, so a git-ignored local command reaches every runtime and the new ignore rules keep every copy out of git. The proof is two green suites with a negative control each, all mirror checks at exit 0 with a local command present, and `git check-ignore` matching the probe paths but not the boundary paths.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented: the three failure points are in `spec.md` section 2
- [x] Success criteria measurable: SC-001 to SC-003 each name a command and its output
- [x] Dependencies identified: the mirror generators, unchanged

### Definition of Done
- [x] All acceptance criteria met: REQ-001 to REQ-006, evidence in `tasks.md`
- [x] `node --test .skilled/commands/doctor/scripts/tests/command-catalog-mirror-check.test.cjs` prints `pass 13` and `fail 0`, and the hook harness prints `pre-commit gates: 145 passed, 0 failed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Name-based exclusion: the `local-` prefix is the only signal, applied at three layers.

### Key Components
- **`.gitignore`**: keeps the router, its assets folder and the five generated mirror roots out of `git status`. `.opencode/commands` is a symlink to `.skilled/commands`, so it needs no rule.
- **`command-catalog-mirror-check.cjs`**: skips a `local-*` entry at the top of the command tree, so a private command is never expected in a tracked catalog.
- **`pre-commit` guard**: `PRIVATE_COMMAND_RE` matches `.(skilled|opencode|claude|cursor)/commands/(assets/)?local-*` and `.(codex|pi|hermes)/prompts/local-*`, beside the existing skill pattern.

### Data Flow
An operator adds `.skilled/commands/local-<name>.md` and its assets folder. The generators write one mirror per runtime, each ignored. The catalog check and every mirror `--check` pass, because the catalog skips the command and each mirror matches its source. A forced add of any of these paths stops at the pre-commit guard, which prints the path and the `git rm --cached -r` repair.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup records the baselines and confirms no tracked path matches the new pattern. Implementation lands the five file changes. Verification runs the negative controls, the mirror checks and the ignore probes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Each new case also ran against the `HEAD` file and failed there: the catalog skip case fails once against the `HEAD` checker, and the hook harness fails 9 checks against the `HEAD` hook. Boundary cases pin what must stay committable: `localize.md` at the command root and `local-notes.md` inside a family.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None new. The hook stays pure bash for `/bin/bash` 3.2, and the catalog check uses only Node built-ins.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: the guard blocks a legitimate commit, or a mirror check turns red. Before commit, `git checkout HEAD -- .gitignore .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs .skilled/commands/doctor/scripts/tests/command-catalog-mirror-check.test.cjs .skilled/scripts/git-hooks/pre-commit .skilled/scripts/git-hooks/tests/pre-commit.test.sh`; after commit, revert it. A rollback deletes no private file: ignored commands stay on disk and simply reappear in `git status`.
<!-- /ANCHOR:rollback -->

---
