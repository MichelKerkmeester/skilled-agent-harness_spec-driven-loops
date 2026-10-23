---
title: "Tasks: Phase 4: private-local-skills"
description: "Task Format: T### [P?] Description (file path) - checkout - proof"
trigger_phrases:
  - "private local skills tasks"
  - "restore local skills tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/004-private-local-skills"
    last_updated_at: "2026-10-23T17:55:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Recorded the two-repository answer and the new tasks"
    next_safe_action: "Run T001, T002 and T002a, then the T005/T006 restore pair"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "acceptance-criteria.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-004-private-local-skills"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Folder mode: symlink to two external repositories (operator, 2026-10-23)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: private-local-skills

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[—]` | Not used under the recorded decision; never executed |

**Task Format**: `T### [P?] Description (file path)`

Every task carries seven fields in this order: **File**, **Anchor**, **Change**, **Proof**, **AC**,
**Rollback**, **Stop if**. A task changes one file, runs one command, or writes one artifact. Tasks run
in numeric order; a task that stops ends the run.

**Checkout rule.** The run splits by role, not by directory list.

- `OPERATOR` is `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`. Every command
  that creates, reads or edits `.skilled/skills/local-*` runs there, because an ignored link never
  travels between checkouts. T001, T002, T002a and T005 to T095 run in `OPERATOR`.
- `WORKTREE` is the checkout the orchestrator commits packet documents from. By default it is `OPERATOR`
  itself; if the orchestrator chose a separate worktree, it is that worktree's root. Set it once with
  `WORKTREE="$(git rev-parse --show-toplevel)"` from that checkout, after
  `git fetch origin && git merge --ff-only origin/main`, and let every command block below re-establish
  the same value the same way so a fresh shell cannot inherit a stale one. Every packet-document edit,
  the review report, the validator run and the commit run there. T096 to T109 run in `WORKTREE`.
- `TARGET-WEBFLOW` is `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com`, a private
  repository. T095a runs there.
- `TARGET-OBSIDIAN` is `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin`, a public
  repository. T095b runs there.
- `HOME` is the operator's home directory. T006b edits `~/.zshrc` there after an explicit operator yes.

**Branch rule.** No task switches branches. Content commands that write inside `OPERATOR` touch only ignored links and never the index, so they run with `main` checked out. T005 and T006 write the external target trees, T006a writes the ignored links, and T006b edits `~/.zshrc`. The single documents commit in T106 is made in `WORKTREE` on the checked-out branch, pushed with `git push origin HEAD:main` by T108. The target-repository commits in T095a and T095b run on each repository's current branch and push to `main` when that is the branch, or to the current branch when the operator confirms it is the repository's mainline.

**Target-repository rule.** Both external repositories carry unrelated uncommitted files. T095a and
T095b stage only `local-skills/<name>` by path, never `git add -A`, never `git add .`, and stop if
anything outside that path is staged. The Obsidian repository is public; its push publishes the skill
content and runs only after an explicit operator yes.

**Line-number rule.** The anchor quotes text that exists in the file at the time the task runs; a
writer that cannot find it re-reads the file once and stops if it is still missing. Line numbers were
checked against the files on disk when this plan was written, and the anchor text is what decides, not
the number: earlier tasks move later line numbers. The line number is only a locator, and the stop
condition fires only when the anchor text is not found exactly once.

**Anchor rule.** The Anchor field quotes the exact current text. The Change field replaces that exact
text. A block that does not match after a re-read stops the task; the implementer never edits by line
number alone.

**Rollback rule.** Every task names the command that undoes it, or `n/a` with the reason no undo is
needed. Rollback never uses `git checkout` on an ignored path, because git does not track those paths.

**Evidence-task rule.** T096 to T099 record readings that exist only after the run, so their Change
field states the exact sections, row labels and facts to write rather than a literal string. Every
other task carries the literal text it applies. A reading is never invented: if a value is missing, the
task stops instead of writing a guess.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Run this before every task, without exception.

- [ ] Read the task's File field. If it names a file, open that file and confirm the Anchor text is there.
- [ ] Confirm the Anchor text is present exactly once; the line number is only a locator.
- [ ] Confirm the task's checkout is the one the command block starts in.
- [ ] Confirm the previous task's proof printed its Expected value.
- [ ] If any answer is no, stop and report; do not adapt the task.

### Execution Rules

| Rule | Meaning |
|------|---------|
| `TASK-SEQ` | Run tasks in numeric order. Never start a task whose predecessor did not print its Expected value. |
| `TASK-SCOPE` | Change only the file named in the task. Never widen an edit to a neighbouring file. |
| `TASK-EXACT` | Replace the Anchor text exactly. Never use a tree-wide `sed` for a catalogue entry. |
| `TASK-ONE-BRANCH` | T005 and T006 run in Mode B; T003 and T004 are the recorded Mode A alternative, carry `[—]` and never run. Never run both pairs. |
| `TASK-REPO-STAGE` | T095a and T095b stage only `local-skills/<name>` by path and stop if anything else is staged. |
| `TASK-OPERATOR-YES` | T006b and each push in T095a and T095b wait for an explicit operator yes at run time; no yes stops the task. |
| `TASK-NO-STAGE` | Never run `git add`, `git add -f` or `git commit` in `OPERATOR` or `WORKTREE` before T106. T095a and T095b run their named `git add` and `git commit` only inside their target repositories. |
| `TASK-PROOF` | Run the Proof block and read its output. A task is done only when the output matches Expected. |

### Status Reporting Format

Report one line per task, in this shape:

```text
T### <DONE|BLOCKED> expected=<Expected value> observed=<observed value>
```

A run ends with one summary line:

```text
PHASE 4 <COMPLETE|BLOCKED> tasks=<done count>/114 criteria=<met count>/22
```

### Blocked Task Protocol

1. Stop at the failing task. Do not run later tasks.
2. Report the task id, the command, the observed output and the Expected value.
3. If the failure is a missing Anchor after one re-read, report `BLOCKED: anchor drift at T###`.
4. If the failure is the T001 gate, report `BLOCKED: phase 003 compiler skip is not on main`.
5. If the failure is the T002 gate, report `BLOCKED: ADR-001 does not record the two-repository symlink answer`.
6. If the failure is the T002a precheck, report `BLOCKED: a target path already exists or a repository .skilled is not a symlink`.
7. If the failure is the T006b environment task, report `BLOCKED: no explicit operator yes for ~/.zshrc`.
8. If the failure is a target-repository push, report `BLOCKED: no explicit operator yes for <repo> push`.
9. Leave the working tree as it is. Do not clean up with `git` commands; the rollback field of the failed task names the safe undo.
<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Gates

### T001 — Prove phase 003's compiler skip is on `main` and in the working copy

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only gate, no file edit.
- **Change:** n/a: read-only gate, no text changes.
- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git cat-file -t 42b41dd286
git fetch origin main
git show origin/main:.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py | grep -c 'if entry.startswith("local-"):'
grep -c 'if entry.startswith("local-"):' .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py
```

Expected: `commit`, then `1` and `1`.

- **AC:** AC-001
- **Rollback:** n/a: read-only.
- **Stop if:** `git cat-file` does not print `commit`, or either count is not `1`. Report `BLOCKED: phase 003 compiler skip is not on main` or `BLOCKED: restore commit missing`.

### T002 — Read ADR-001's recorded two-repository symlink answer

- **Status:** `[ ]`
- **File:** `specs/sk-code/013-private-surface-skills/004-private-local-skills/decision-record.md`
- **Anchor:** `decision-record.md` ADR-001 metadata — `| **Status** | Accepted: symlink to two external repositories |`
- **Change:** n/a: read-only gate, no text changes.
- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
awk '/<!-- ANCHOR:adr-001 -->/,/<!-- ANCHOR:adr-001-context -->/' specs/sk-code/013-private-surface-skills/004-private-local-skills/decision-record.md | grep -E '^[|] [*][*](Status|Folder mode|External repository roots)[*][*] [|]'
```

Expected: three lines. `Status` reads `Accepted: symlink to two external repositories`; `Folder mode` reads `symlink`; `External repository roots` names both `Obsidian Plugin/local-skills` and `Websites/anobel.com/local-skills`.

- **AC:** AC-002
- **Rollback:** n/a: read-only.
- **Stop if:** `Status` does not read `Accepted: symlink to two external repositories`, or either root is missing. Report `BLOCKED: ADR-001 does not record the two-repository symlink answer` and stop the run.

### T002a — Precheck both target repositories and their `local-skills/` targets

- **Status:** `[ ]`
- **File:** none: read-only precheck of two external repositories.
- **Anchor:** n/a: read-only precheck, no file edit.
- **Change:** n/a: read-only precheck, no text changes.
- **Proof:**

```bash
WEBFLOW_REPO="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
OBSIDIAN_REPO="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
test ! -e "$WEBFLOW_REPO/local-skills/local-webflow" && echo WEBFLOW_TARGET_FREE
test ! -e "$OBSIDIAN_REPO/local-skills/local-obsidian" && echo OBSIDIAN_TARGET_FREE
test -L "$WEBFLOW_REPO/.skilled" && echo WEBFLOW_SKILLED_SYMLINK
test -L "$OBSIDIAN_REPO/.skilled" && echo OBSIDIAN_SKILLED_SYMLINK
readlink "$WEBFLOW_REPO/.skilled"
readlink "$OBSIDIAN_REPO/.skilled"
```

Expected: `WEBFLOW_TARGET_FREE`, `OBSIDIAN_TARGET_FREE`, `WEBFLOW_SKILLED_SYMLINK`, `OBSIDIAN_SKILLED_SYMLINK`, then two absolute paths that resolve back into this checkout. Both targets sit under `local-skills/`, never under `.skilled`, `.opencode` or `.claude`.

- **AC:** AC-020
- **Rollback:** n/a: read-only.
- **Stop if:** either target path already exists, or either repository's `.skilled` is not a symlink, because a target under it would loop. Report `BLOCKED: a target path already exists or a repository .skilled is not a symlink`.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Restore

### T003 — Mode A (recorded alternative, not used): restore `local-webflow` as a real folder

- **Status:** `[—]` not used under ADR-001
- **File:** `.skilled/skills/local-webflow/` (new ignored tree)
- **Anchor:** new file: the folder does not exist yet.
- **Change:** n/a under the recorded answer. This is the recorded Mode A alternative: `mkdir -p .skilled/skills/local-webflow` and `git archive 42b41dd286 .skilled/skills/sk-code/sk-code-webflow | tar -x --strip-components=4 -C .skilled/skills/local-webflow`.
- **Proof:** n/a: never run under ADR-001's `Accepted: symlink to two external repositories`.
- **AC:** AC-003, AC-013
- **Rollback:** n/a: never run.
- **Stop if:** always: ADR-001 records Mode B, so this task must not be executed.

### T004 — Mode A (recorded alternative, not used): restore `local-obsidian` as a real folder

- **Status:** `[—]` not used under ADR-001
- **File:** `.skilled/skills/local-obsidian/` (new ignored tree)
- **Anchor:** new file: the folder does not exist yet.
- **Change:** n/a under the recorded answer. This is the recorded Mode A alternative: `mkdir -p .skilled/skills/local-obsidian` and `git archive 42b41dd286 .skilled/skills/sk-code/sk-code-obsidian | tar -x --strip-components=4 -C .skilled/skills/local-obsidian`.
- **Proof:** n/a: never run under ADR-001's `Accepted: symlink to two external repositories`.
- **AC:** AC-003, AC-013
- **Rollback:** n/a: never run.
- **Stop if:** always: ADR-001 records Mode B, so this task must not be executed.

### T005 — Mode B: restore `local-webflow` into its own repository

- **Status:** `[ ]`
- **File:** `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills/local-webflow/` (new tree in the private repository; the checkout link is created by T006a)
- **Anchor:** new folder: the target does not exist yet, proved by T002a.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
WEBFLOW_REPO="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
mkdir -p "$WEBFLOW_REPO/local-skills/local-webflow"
git archive 42b41dd286 .skilled/skills/sk-code/sk-code-webflow | tar -x --strip-components=4 -C "$WEBFLOW_REPO/local-skills/local-webflow"
```

- **Proof:**

```bash
WEBFLOW_REPO="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
test -f "$WEBFLOW_REPO/local-skills/local-webflow/SKILL.md" && echo OK
find "$WEBFLOW_REPO/local-skills/local-webflow/" -type f | wc -l
```

Expected: `OK` and `158` (the three workflow references are still symlinks at this point).

- **AC:** AC-003, AC-020
- **Rollback:** `rm -rf "$WEBFLOW_REPO/local-skills/local-webflow"`; the target was free before this task.
- **Stop if:** ADR-001's `Folder mode` is not `symlink`, either target path already exists, or the count is not `158`.

### T006 — Mode B: restore `local-obsidian` into its own repository

- **Status:** `[ ]`
- **File:** `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills/local-obsidian/` (new tree in the public repository; the checkout link is created by T006a)
- **Anchor:** new folder: the target does not exist yet, proved by T002a.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
OBSIDIAN_REPO="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
mkdir -p "$OBSIDIAN_REPO/local-skills/local-obsidian"
git archive 42b41dd286 .skilled/skills/sk-code/sk-code-obsidian | tar -x --strip-components=4 -C "$OBSIDIAN_REPO/local-skills/local-obsidian"
```

- **Proof:**

```bash
OBSIDIAN_REPO="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
test -f "$OBSIDIAN_REPO/local-skills/local-obsidian/SKILL.md" && echo OK
find "$OBSIDIAN_REPO/local-skills/local-obsidian/" -type f | wc -l
```

Expected: `OK` and `62` (the three workflow references are still symlinks at this point).

- **AC:** AC-003, AC-020
- **Rollback:** `rm -rf "$OBSIDIAN_REPO/local-skills/local-obsidian"`; the target was free before this task.
- **Stop if:** ADR-001's `Folder mode` is not `symlink`, either target path already exists, or the count is not `62`.

### T006a — Create the two symlinks in this checkout and prove both are ignored here

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow` and `.skilled/skills/local-obsidian` (new symlinks in the operator's checkout)
- **Anchor:** new paths: neither link exists yet, proved by T002a.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
ln -s "/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills/local-webflow" .skilled/skills/local-webflow
ln -s "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills/local-obsidian" .skilled/skills/local-obsidian
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
test -L .skilled/skills/local-webflow && echo LINK_WEBFLOW
test -L .skilled/skills/local-obsidian && echo LINK_OBSIDIAN
readlink .skilled/skills/local-webflow
readlink .skilled/skills/local-obsidian
git check-ignore -v .skilled/skills/local-webflow .skilled/skills/local-obsidian | grep -c '/.skilled/skills/local-\*'
git status --porcelain .skilled | wc -l || echo 0
```

Expected: `LINK_WEBFLOW`, `LINK_OBSIDIAN`, the two absolute target paths from ADR-001, `2` from `check-ignore`, and `0` from the status check.

- **AC:** AC-020, AC-013
- **Rollback:** `rm .skilled/skills/local-webflow .skilled/skills/local-obsidian`; the target folders stay intact.
- **Stop if:** either link already exists, either target folder is missing, either `readlink` does not match ADR-001, or the two counts are not `2` and `0`.

### T006b — Set `SPECKIT_PRIVATE_SKILL_ROOTS` durably after an explicit operator yes

- **Status:** `[ ]`
- **File:** `~/.zshrc` (the operator's shell profile, outside this repository)
- **Anchor:** no export line: `grep -c '^export SPECKIT_PRIVATE_SKILL_ROOTS=' ~/.zshrc` prints `0`, or exactly one line already holds the two-root value.
- **Change:** first run `grep -c '^export SPECKIT_PRIVATE_SKILL_ROOTS=' ~/.zshrc` and `zsh -lic 'printenv SPECKIT_PRIVATE_SKILL_ROOTS'`. If the line is absent, ask the operator `May I append the two-root SPECKIT_PRIVATE_SKILL_ROOTS export to ~/.zshrc?`, wait for an explicit yes, then append one quoted line. If the line already prints the two-root value, report `UNCHANGED` and do not edit. Any other answer or value stops the task.

```bash
printf '\nexport SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"\n' >> ~/.zshrc
```

- **Proof:**

```bash
zsh -lic 'printenv SPECKIT_PRIVATE_SKILL_ROOTS'
grep -c '^export SPECKIT_PRIVATE_SKILL_ROOTS=' ~/.zshrc
```

Expected: `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills` and `1`.

- **AC:** AC-022
- **Rollback:** delete the single appended `export SPECKIT_PRIVATE_SKILL_ROOTS=` line from `~/.zshrc`; no other line changes.
- **Stop if:** the line is absent and the operator does not answer yes, an existing value differs from the two-root value, or a fresh login shell does not print both roots joined by `:`.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Workflow references

### T007 — Replace the Webflow `workflow-implement.md` symlink with a real copy

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/references/workflow-implement.md`
- **Anchor:** `references/workflow-implement.md:1` — the path is a symlink to `../../shared/references/workflow-implement.md`; the file has no first line of its own yet.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rm .skilled/skills/local-webflow/references/workflow-implement.md
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-implement.md > .skilled/skills/local-webflow/references/workflow-implement.md
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
test ! -L .skilled/skills/local-webflow/references/workflow-implement.md && echo REGULAR
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-implement.md | cmp - .skilled/skills/local-webflow/references/workflow-implement.md && echo IDENTICAL
```

Expected: `REGULAR` and `IDENTICAL`.

- **AC:** AC-004
- **Rollback:** `rm .skilled/skills/local-webflow/references/workflow-implement.md` and re-run T005, which recreates the symlink from the archive.
- **Stop if:** `rm` reports the path missing, or `test ! -L` does not print `REGULAR`.

### T008 — Replace the Webflow `workflow-debug.md` symlink with a real copy

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/references/workflow-debug.md`
- **Anchor:** `references/workflow-debug.md:1` — the path is a symlink to `../../shared/references/workflow-debug.md`; the file has no first line of its own yet.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rm .skilled/skills/local-webflow/references/workflow-debug.md
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-debug.md > .skilled/skills/local-webflow/references/workflow-debug.md
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
test ! -L .skilled/skills/local-webflow/references/workflow-debug.md && echo REGULAR
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-debug.md | cmp - .skilled/skills/local-webflow/references/workflow-debug.md && echo IDENTICAL
```

Expected: `REGULAR` and `IDENTICAL`.

- **AC:** AC-004
- **Rollback:** `rm .skilled/skills/local-webflow/references/workflow-debug.md` and re-run T005.
- **Stop if:** `rm` reports the path missing, or `test ! -L` does not print `REGULAR`.

### T009 — Replace the Webflow `workflow-verify.md` symlink with a real copy

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/references/workflow-verify.md`
- **Anchor:** `references/workflow-verify.md:1` — the path is a symlink to `../../shared/references/workflow-verify.md`; the file has no first line of its own yet.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rm .skilled/skills/local-webflow/references/workflow-verify.md
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-verify.md > .skilled/skills/local-webflow/references/workflow-verify.md
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
test ! -L .skilled/skills/local-webflow/references/workflow-verify.md && echo REGULAR
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-verify.md | cmp - .skilled/skills/local-webflow/references/workflow-verify.md && echo IDENTICAL
```

Expected: `REGULAR` and `IDENTICAL`.

- **AC:** AC-004
- **Rollback:** `rm .skilled/skills/local-webflow/references/workflow-verify.md` and re-run T005.
- **Stop if:** `rm` reports the path missing, or `test ! -L` does not print `REGULAR`.

### T010 — Replace the Obsidian `workflow-implement.md` symlink with a real copy

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/references/workflow-implement.md`
- **Anchor:** `references/workflow-implement.md:1` — the path is a symlink to `../../shared/references/workflow-implement.md`; the file has no first line of its own yet.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rm .skilled/skills/local-obsidian/references/workflow-implement.md
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-implement.md > .skilled/skills/local-obsidian/references/workflow-implement.md
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
test ! -L .skilled/skills/local-obsidian/references/workflow-implement.md && echo REGULAR
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-implement.md | cmp - .skilled/skills/local-obsidian/references/workflow-implement.md && echo IDENTICAL
```

Expected: `REGULAR` and `IDENTICAL`.

- **AC:** AC-004
- **Rollback:** `rm .skilled/skills/local-obsidian/references/workflow-implement.md` and re-run T006.
- **Stop if:** `rm` reports the path missing, or `test ! -L` does not print `REGULAR`.

### T011 — Replace the Obsidian `workflow-debug.md` symlink with a real copy

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/references/workflow-debug.md`
- **Anchor:** `references/workflow-debug.md:1` — the path is a symlink to `../../shared/references/workflow-debug.md`; the file has no first line of its own yet.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rm .skilled/skills/local-obsidian/references/workflow-debug.md
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-debug.md > .skilled/skills/local-obsidian/references/workflow-debug.md
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
test ! -L .skilled/skills/local-obsidian/references/workflow-debug.md && echo REGULAR
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-debug.md | cmp - .skilled/skills/local-obsidian/references/workflow-debug.md && echo IDENTICAL
```

Expected: `REGULAR` and `IDENTICAL`.

- **AC:** AC-004
- **Rollback:** `rm .skilled/skills/local-obsidian/references/workflow-debug.md` and re-run T006.
- **Stop if:** `rm` reports the path missing, or `test ! -L` does not print `REGULAR`.

### T012 — Replace the Obsidian `workflow-verify.md` symlink with a real copy

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/references/workflow-verify.md`
- **Anchor:** `references/workflow-verify.md:1` — the path is a symlink to `../../shared/references/workflow-verify.md`; the file has no first line of its own yet.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rm .skilled/skills/local-obsidian/references/workflow-verify.md
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-verify.md > .skilled/skills/local-obsidian/references/workflow-verify.md
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
test ! -L .skilled/skills/local-obsidian/references/workflow-verify.md && echo REGULAR
git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-verify.md | cmp - .skilled/skills/local-obsidian/references/workflow-verify.md && echo IDENTICAL
```

Expected: `REGULAR` and `IDENTICAL`.

- **AC:** AC-004
- **Rollback:** `rm .skilled/skills/local-obsidian/references/workflow-verify.md` and re-run T006.
- **Stop if:** `rm` reports the path missing, or `test ! -L` does not print `REGULAR`.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Guardrail links

### T013 — Point the Webflow implement copy's guardrail link at the hub document

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/references/workflow-implement.md`
- **Anchor:** `workflow-implement.md:80` — `OpenCode work: see the implementation guardrails in [OpenCode workflow guardrails](../../sk-code-skilled/references/shared/workflow-guardrails.md#2-implementation-guardrails).`
- **Change:** replace the text `../../sk-code-skilled/references/shared/workflow-guardrails.md` with `../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md` on that line.
- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
grep -c -F '../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md' .skilled/skills/local-webflow/references/workflow-implement.md
grep -c -F '../../sk-code-skilled/references/shared/workflow-guardrails.md' .skilled/skills/local-webflow/references/workflow-implement.md || true
```

Expected: `1` and `0`.

- **AC:** AC-005
- **Rollback:** replace the new path back with `../../sk-code-skilled/references/shared/workflow-guardrails.md`.
- **Stop if:** the Anchor line is not at line 80 after a re-read.

### T014 — Point the Webflow verify copy's two guardrail links at the hub document

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/references/workflow-verify.md`
- **Anchor:** `workflow-verify.md:78` — `OpenCode work: see the verification reality, including the \`validate.sh\` pointer, in [OpenCode workflow guardrails](../../sk-code-skilled/references/shared/workflow-guardrails.md#3-verification-reality).` and `workflow-verify.md:82` — `OpenCode work: see the runtime build traps in [OpenCode workflow guardrails](../../sk-code-skilled/references/shared/workflow-guardrails.md#4-runtime-build-traps).`
- **Change:** replace every occurrence of `../../sk-code-skilled/references/shared/workflow-guardrails.md` with `../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md` in the file.
- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
grep -o -F '../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md' .skilled/skills/local-webflow/references/workflow-verify.md | wc -l
grep -c -F '../../sk-code-skilled/references/shared/workflow-guardrails.md' .skilled/skills/local-webflow/references/workflow-verify.md || true
```

Expected: `2` and `0`.

- **AC:** AC-005
- **Rollback:** replace the new path back with `../../sk-code-skilled/references/shared/workflow-guardrails.md`.
- **Stop if:** the two Anchor lines are not at lines 78 and 82 after a re-read.

### T015 — Point the Obsidian implement copy's guardrail link at the hub document

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/references/workflow-implement.md`
- **Anchor:** `workflow-implement.md:80` — `OpenCode work: see the implementation guardrails in [OpenCode workflow guardrails](../../sk-code-skilled/references/shared/workflow-guardrails.md#2-implementation-guardrails).`
- **Change:** replace the text `../../sk-code-skilled/references/shared/workflow-guardrails.md` with `../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md` on that line.
- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
grep -c -F '../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md' .skilled/skills/local-obsidian/references/workflow-implement.md
grep -c -F '../../sk-code-skilled/references/shared/workflow-guardrails.md' .skilled/skills/local-obsidian/references/workflow-implement.md || true
```

Expected: `1` and `0`.

- **AC:** AC-005
- **Rollback:** replace the new path back with `../../sk-code-skilled/references/shared/workflow-guardrails.md`.
- **Stop if:** the Anchor line is not at line 80 after a re-read.

### T016 — Point the Obsidian verify copy's two guardrail links at the hub document

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/references/workflow-verify.md`
- **Anchor:** `workflow-verify.md:78` — `OpenCode work: see the verification reality, including the \`validate.sh\` pointer, in [OpenCode workflow guardrails](../../sk-code-skilled/references/shared/workflow-guardrails.md#3-verification-reality).` and `workflow-verify.md:82` — `OpenCode work: see the runtime build traps in [OpenCode workflow guardrails](../../sk-code-skilled/references/shared/workflow-guardrails.md#4-runtime-build-traps).`
- **Change:** replace every occurrence of `../../sk-code-skilled/references/shared/workflow-guardrails.md` with `../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md` in the file.
- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
grep -o -F '../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md' .skilled/skills/local-obsidian/references/workflow-verify.md | wc -l
grep -c -F '../../sk-code-skilled/references/shared/workflow-guardrails.md' .skilled/skills/local-obsidian/references/workflow-verify.md || true
```

Expected: `2` and `0`.

- **AC:** AC-005
- **Rollback:** replace the new path back with `../../sk-code-skilled/references/shared/workflow-guardrails.md`.
- **Stop if:** the two Anchor lines are not at lines 78 and 82 after a re-read.

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Link audit harness

### T017 — Create the link audit script outside the repository

- **Status:** `[ ]`
- **File:** `/tmp/psurf-phase4/link-audit.sh` (new file, outside the repository tree)
- **Anchor:** new file.
- **Change:**

```bash
mkdir -p /tmp/psurf-phase4
cat > /tmp/psurf-phase4/link-audit.sh <<'SH'
fail=0
for f in $(find "$1/" -name '*.md' -not -path '*/changelog/*' -not -path '*/benchmark/reports/*'); do
  d=$(dirname "$f")
  for t in $(grep -o -E '\]\([^)]+' "$f" | sed 's/^](//' | sed 's/#.*$//' | grep -v -E '^(https?:|mailto:|$)' | sort -u); do
    case "$t" in /*) continue;; esac
    [ -e "$d/$t" ] || { echo "BROKEN $f -> $t"; fail=1; }
  done
done
echo "AUDIT_FAIL=$fail"
SH
```

- **Proof:**

```bash
test -f /tmp/psurf-phase4/link-audit.sh && echo CREATED
bash -n /tmp/psurf-phase4/link-audit.sh && echo SYNTAX_OK
```

Expected: `CREATED` and `SYNTAX_OK`.

- **AC:** AC-006, AC-007
- **Rollback:** `rm -rf /tmp/psurf-phase4`
- **Stop if:** the heredoc is interrupted or `bash -n` reports a syntax error.

### T018 — Take the intermediate Webflow audit reading

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow | grep -c BROKEN
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow | tail -1
```

Expected: `16` and `AUDIT_FAIL=1`. This reading proves the audit runs and shows the breakage the next phase repairs; it is not the pass condition.

- **AC:** AC-006
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `16`, because the escaping-link set would differ from the catalogue.

### T019 — Take the intermediate Obsidian audit reading

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-obsidian | grep -c BROKEN
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-obsidian | tail -1
```

Expected: `2` and `AUDIT_FAIL=1`.

- **AC:** AC-007
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `2`, because the escaping-link set would differ from the catalogue.

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:phase-6 -->
## Phase 6: Webflow relative links

### T020 — Rewrite the three escaping links in `references/shared/enforcement.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/references/shared/enforcement.md`
- **Anchor:** `enforcement.md:246` — `2. **Load** [`code-quality-checklist.md`](../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md)` and `enforcement.md:310` — `- [`../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`](../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md) — validation checklist`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("references/shared/enforcement.md")
s = p.read_text()
old = "../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md"
new = "../../../sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md"
assert s.count(old) == 3, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("references/shared/enforcement.md").read_text()
print("OLD", s.count("../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md"))
print("NEW", s.count("../../../sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md"))
PY
```

Expected: `OLD 0` and `NEW 3`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-code/sk-code-quality/assets/` back with `../../../sk-code-quality/assets/`.
- **Stop if:** the assert reports a count other than `3`.

### T021 — Rewrite the four escaping links in `references/shared/cross-language-rules.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/references/shared/cross-language-rules.md`
- **Anchor:** `cross-language-rules.md:47` and `cross-language-rules.md:173` — each line carries `../../../shared/references/universal/code-style-guide.md` twice, in the link text and the target.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("references/shared/cross-language-rules.md")
s = p.read_text()
old = "../../../shared/references/universal/code-style-guide.md"
new = "../../../sk-code/shared/references/universal/code-style-guide.md"
assert s.count(old) == 4, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("references/shared/cross-language-rules.md").read_text()
print("OLD", s.count("../../../shared/references/universal/code-style-guide.md"))
print("NEW", s.count("../../../sk-code/shared/references/universal/code-style-guide.md"))
PY
```

Expected: `OLD 0` and `NEW 4`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-code/shared/references/` back with `../../../shared/references/`.
- **Stop if:** the assert reports a count other than `4`.

### T022 — Rewrite the three escaping links in `references/javascript/quick-reference.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/references/javascript/quick-reference.md`
- **Anchor:** `quick-reference.md:55` and `quick-reference.md:68` — line 55 carries the path once, line 68 twice.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("references/javascript/quick-reference.md")
s = p.read_text()
old = "../../../shared/references/universal/code-style-guide.md"
new = "../../../sk-code/shared/references/universal/code-style-guide.md"
assert s.count(old) == 3, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("references/javascript/quick-reference.md").read_text()
print("OLD", s.count("../../../shared/references/universal/code-style-guide.md"))
print("NEW", s.count("../../../sk-code/shared/references/universal/code-style-guide.md"))
PY
```

Expected: `OLD 0` and `NEW 3`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-code/shared/references/` back with `../../../shared/references/`.
- **Stop if:** the assert reports a count other than `3`.

### T023 — Rewrite the two escaping links in `references/performance/interaction-gated-loading.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/references/performance/interaction-gated-loading.md`
- **Anchor:** `interaction-gated-loading.md:123` — the line carries `../../../shared/references/performance-loading-checklist.md` twice.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("references/performance/interaction-gated-loading.md")
s = p.read_text()
old = "../../../shared/references/performance-loading-checklist.md"
new = "../../../sk-code/shared/references/performance-loading-checklist.md"
assert s.count(old) == 2, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("references/performance/interaction-gated-loading.md").read_text()
print("OLD", s.count("../../../shared/references/performance-loading-checklist.md"))
print("NEW", s.count("../../../sk-code/shared/references/performance-loading-checklist.md"))
PY
```

Expected: `OLD 0` and `NEW 2`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-code/shared/references/performance-loading-checklist.md` back with `../../../shared/references/performance-loading-checklist.md`.
- **Stop if:** the assert reports a count other than `2`.

### T024 — Rewrite the escaping link in `references/shared/dev-workflow/common-commands.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/references/shared/dev-workflow/common-commands.md`
- **Anchor:** `common-commands.md:206` — `../../../../../mcp-tooling/mcp-chrome-devtools/SKILL.md`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("references/shared/dev-workflow/common-commands.md")
s = p.read_text()
old = "../../../../../mcp-tooling/mcp-chrome-devtools/SKILL.md"
new = "../../../../mcp-tooling/mcp-chrome-devtools/SKILL.md"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("references/shared/dev-workflow/common-commands.md").read_text()
print("OLD", s.count("../../../../../mcp-tooling/mcp-chrome-devtools/SKILL.md"))
print("NEW", s.count("../../../../mcp-tooling/mcp-chrome-devtools/SKILL.md"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../../mcp-tooling/` back with `../../../../../mcp-tooling/`.
- **Stop if:** the assert reports a count other than `1`.

### T025 — Rewrite the two escaping `SKILL.md` links in the snippets README

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/assets/animation/snippets/README.md`
- **Anchor:** `snippets/README.md:118` and `snippets/README.md:119` — `| [`sk-code/SKILL.md`](../../../../SKILL.md) | ... |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("assets/animation/snippets/README.md")
s = p.read_text()
old = "../../../../SKILL.md"
new = "../../../../sk-code/SKILL.md"
assert s.count(old) == 2, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("assets/animation/snippets/README.md").read_text()
print("OLD", s.count("](../../../../SKILL.md)"))
print("NEW", s.count("](../../../../sk-code/SKILL.md)"))
PY
```

Expected: `OLD 0` and `NEW 2`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../../sk-code/SKILL.md` back with `../../../../SKILL.md`.
- **Stop if:** the assert reports a count other than `2`, because this file's deeper paths make a substring rewrite unsafe.

### T026 — Rewrite the escaping template link in the snippets README

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/assets/animation/snippets/README.md`
- **Anchor:** `snippets/README.md:120` — `| [`sk-doc skill-readme-template.md`](../../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md) | ... |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("assets/animation/snippets/README.md")
s = p.read_text()
old = "../../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"
new = "../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("assets/animation/snippets/README.md").read_text()
print("OLD", s.count("../../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"))
print("NEW", s.count("../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../../sk-doc/sk-create-skill/assets/` back with `../../../../../sk-doc/sk-create-skill/assets/`.
- **Stop if:** the assert reports a count other than `1`.

### T027 — Rewrite the two escaping `SKILL.md` links in `assets/patterns/README.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/assets/patterns/README.md`
- **Anchor:** `patterns/README.md:112` and `patterns/README.md:113` — `| [`sk-code/SKILL.md`](../../../SKILL.md) | ... |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("assets/patterns/README.md")
s = p.read_text()
old = "../../../SKILL.md"
new = "../../../sk-code/SKILL.md"
assert s.count(old) == 2, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("assets/patterns/README.md").read_text()
print("OLD", s.count("](../../../SKILL.md)"))
print("NEW", s.count("](../../../sk-code/SKILL.md)"))
PY
```

Expected: `OLD 0` and `NEW 2`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-code/SKILL.md` back with `../../../SKILL.md`.
- **Stop if:** the assert reports a count other than `2`.

### T028 — Rewrite the two escaping `SKILL.md` links in `assets/integrations/README.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/assets/integrations/README.md`
- **Anchor:** `integrations/README.md:110` and `integrations/README.md:111` — `| [`sk-code/SKILL.md`](../../../SKILL.md) | ... |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("assets/integrations/README.md")
s = p.read_text()
old = "../../../SKILL.md"
new = "../../../sk-code/SKILL.md"
assert s.count(old) == 2, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("assets/integrations/README.md").read_text()
print("OLD", s.count("](../../../SKILL.md)"))
print("NEW", s.count("](../../../sk-code/SKILL.md)"))
PY
```

Expected: `OLD 0` and `NEW 2`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-code/SKILL.md` back with `../../../SKILL.md`.
- **Stop if:** the assert reports a count other than `2`.

### T029 — Rewrite the two escaping `SKILL.md` links in `assets/scripts/README.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/assets/scripts/README.md`
- **Anchor:** `scripts/README.md:112` and `scripts/README.md:113` — `| [`sk-code/SKILL.md`](../../../SKILL.md) | ... |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("assets/scripts/README.md")
s = p.read_text()
old = "../../../SKILL.md"
new = "../../../sk-code/SKILL.md"
assert s.count(old) == 2, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("assets/scripts/README.md").read_text()
print("OLD", s.count("](../../../SKILL.md)"))
print("NEW", s.count("](../../../sk-code/SKILL.md)"))
PY
```

Expected: `OLD 0` and `NEW 2`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-code/SKILL.md` back with `../../../SKILL.md`.
- **Stop if:** the assert reports a count other than `2`.

### T030 — Rewrite the two escaping `SKILL.md` links in `assets/templates/README.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/assets/templates/README.md`
- **Anchor:** `templates/README.md:113` and `templates/README.md:114` — `| [`sk-code/SKILL.md`](../../../SKILL.md) | ... |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("assets/templates/README.md")
s = p.read_text()
old = "../../../SKILL.md"
new = "../../../sk-code/SKILL.md"
assert s.count(old) == 2, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("assets/templates/README.md").read_text()
print("OLD", s.count("](../../../SKILL.md)"))
print("NEW", s.count("](../../../sk-code/SKILL.md)"))
PY
```

Expected: `OLD 0` and `NEW 2`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-code/SKILL.md` back with `../../../SKILL.md`.
- **Stop if:** the assert reports a count other than `2`.

### T031 — Rewrite the escaping template link in `assets/patterns/README.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/assets/patterns/README.md`
- **Anchor:** `patterns/README.md:114` — `| [`sk-doc skill-readme-template.md`](../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md) | ... |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("assets/patterns/README.md")
s = p.read_text()
old = "../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"
new = "../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("assets/patterns/README.md").read_text()
print("OLD", s.count("../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"))
print("NEW", s.count("../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-doc/sk-create-skill/assets/` back with `../../../../sk-doc/sk-create-skill/assets/`.
- **Stop if:** the assert reports a count other than `1`, or the file is the snippets README, which carries a deeper link.

### T032 — Rewrite the escaping template link in `assets/integrations/README.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/assets/integrations/README.md`
- **Anchor:** `integrations/README.md:112` — `| [`sk-doc skill-readme-template.md`](../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md) | ... |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("assets/integrations/README.md")
s = p.read_text()
old = "../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"
new = "../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("assets/integrations/README.md").read_text()
print("OLD", s.count("../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"))
print("NEW", s.count("../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-doc/sk-create-skill/assets/` back with `../../../../sk-doc/sk-create-skill/assets/`.
- **Stop if:** the assert reports a count other than `1`, or the file is the snippets README, which carries a deeper link.

### T033 — Rewrite the escaping template link in `assets/scripts/README.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/assets/scripts/README.md`
- **Anchor:** `scripts/README.md:114` — `| [`sk-doc skill-readme-template.md`](../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md) | ... |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("assets/scripts/README.md")
s = p.read_text()
old = "../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"
new = "../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("assets/scripts/README.md").read_text()
print("OLD", s.count("../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"))
print("NEW", s.count("../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-doc/sk-create-skill/assets/` back with `../../../../sk-doc/sk-create-skill/assets/`.
- **Stop if:** the assert reports a count other than `1`, or the file is the snippets README, which carries a deeper link.

### T034 — Rewrite the escaping template link in `assets/templates/README.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/assets/templates/README.md`
- **Anchor:** `templates/README.md:115` — `| [`sk-doc skill-readme-template.md`](../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md) | ... |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("assets/templates/README.md")
s = p.read_text()
old = "../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"
new = "../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("assets/templates/README.md").read_text()
print("OLD", s.count("../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"))
print("NEW", s.count("../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-006, AC-008
- **Rollback:** replace `../../../sk-doc/sk-create-skill/assets/` back with `../../../../sk-doc/sk-create-skill/assets/`.
- **Stop if:** the assert reports a count other than `1`, or the file is the snippets README, which carries a deeper link.

<!-- /ANCHOR:phase-6 -->
---

<!-- ANCHOR:phase-7 -->
## Phase 7: Webflow identity

### T035 — Rename the Webflow skill in its frontmatter

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/SKILL.md`
- **Anchor:** `SKILL.md:2` — `name: sk-code-webflow`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "name: sk-code-webflow"
new = "name: local-webflow"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("name: sk-code-webflow"))
print("NEW", s.count("name: local-webflow"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace `name: local-webflow` back with `name: sk-code-webflow`.
- **Stop if:** the assert reports a count other than `1`.

### T036 — Remove the surface metadata from the Webflow frontmatter

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/SKILL.md`
- **Anchor:** `SKILL.md:6` — `metadata:` / `  author: OpenCode` / `  family: sk-code` / `  packetKind: surface`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface"""
new = """metadata:
  author: OpenCode"""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("FAMILY", s.count("  family: sk-code"))
print("PACKET", s.count("packetKind"))
PY
```

Expected: `FAMILY 0` and `PACKET 0`.

- **AC:** AC-009
- **Rollback:** replace `metadata:\n  author: OpenCode` with the four-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T037 — Retitle section 1 of the Webflow skill

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/SKILL.md`
- **Anchor:** `SKILL.md:16` — `## 1. WHEN THE HUB BUNDLES THIS`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "## 1. WHEN THE HUB BUNDLES THIS"
new = "## 1. WHEN THIS SKILL APPLIES"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("## 1. WHEN THE HUB BUNDLES THIS"))
print("NEW", s.count("## 1. WHEN THIS SKILL APPLIES"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace `## 1. WHEN THIS SKILL APPLIES` back with `## 1. WHEN THE HUB BUNDLES THIS`.
- **Stop if:** the assert reports a count other than `1`.

### T038 — Rewrite the Webflow opening sentence fragment

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/SKILL.md`
- **Anchor:** `SKILL.md:14` — `and acts on the evidence gathered here when the hub detects a Webflow surface.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "and acts on the evidence gathered here when the hub detects a Webflow surface."
new = "and applies whenever a task matches the detection markers below."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("when the hub detects a Webflow surface"))
print("NEW", s.count("applies whenever a task matches the detection markers below"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new sentence with the old fragment.
- **Stop if:** the assert reports a count other than `1`.

### T039 — Rewrite the section 2b intro sentence in the Webflow skill

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/SKILL.md`
- **Anchor:** `SKILL.md:59` — `This block is the deterministic projection of sk-code-webflow's own reference/asset routing; keep it in sync with the parent hub union.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "This block is the deterministic projection of sk-code-webflow's own reference/asset routing; keep it in sync with the parent hub union."
new = "This block is the machine-readable form of this skill's own reference and asset routing."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("keep it in sync with the parent hub union"))
print("NEW", s.count("machine-readable form of this skill's own reference and asset routing"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new sentence with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T040 — Rewrite the section 2b routing comment in the Webflow skill

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/SKILL.md`
- **Anchor:** `SKILL.md:60` — the four-line comment that starts `# sk-code-webflow owns its intent -> reference/asset routing. Paths are relative to`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """# sk-code-webflow owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with sk-code-webflow/) and the sibling sk-code-skilled map plus the
# parent-owned universal/shared tier; a drift guard enforces that equality."""
new = """# local-webflow owns its intent -> reference/asset routing. Paths are relative to
# this skill root. It is the only routing map for this skill: nothing outside
# this folder projects it and no drift guard compares it to another skill."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("# sk-code-webflow owns its intent"))
print("NEW", s.count("# local-webflow owns its intent"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new comment with the four-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T041 — Rewrite the Webflow README description

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:3` — `description: Frontend evidence for Webflow and browser work in the sk-code hub: language standards, implementation and performance patterns, CDN deployment and browser debugging and verification, bundled with a workflow mode when the hub detects the surface, never a primary.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "description: Frontend evidence for Webflow and browser work in the sk-code hub: language standards, implementation and performance patterns, CDN deployment and browser debugging and verification, bundled with a workflow mode when the hub detects the surface, never a primary."
new = "description: Frontend evidence for Webflow and browser work: language standards, implementation and performance patterns, CDN deployment, and browser debugging and verification."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("work in the sk-code hub"))
print("NEW", s.count("description: Frontend evidence for Webflow and browser work: language standards"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new description with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T042 — Retitle the Webflow README

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:11` — `# webflow: Frontend Evidence (sk-code surface)`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "# webflow: Frontend Evidence (sk-code surface)"
new = "# local-webflow: Frontend Evidence"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("# webflow: Frontend Evidence (sk-code surface)"))
print("NEW", s.count("# local-webflow: Frontend Evidence"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new heading with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T043 — Rewrite the Webflow README opening blockquote

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:13` — `This read-only surface hands the working mode that evidence the moment the hub detects the surface, so nothing gets reinvented per task.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "This read-only surface hands the working mode that evidence the moment the hub detects the surface, so nothing gets reinvented per task."
new = "This read-only skill supplies that evidence directly, so nothing gets reinvented per task."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("the moment the hub detects the surface"))
print("NEW", s.count("This read-only skill supplies that evidence directly"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new sentence with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T044 — Rewrite the Webflow AT A GLANCE kind row

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:21` — `| **Kind** | Surface evidence packet (`packetKind: surface`, read-only, advisor-invisible) |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "| **Kind** | Surface evidence packet (`packetKind: surface`, read-only, advisor-invisible) |"
new = "| **Kind** | Standalone frontend evidence skill (read-only) |"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("Surface evidence packet"))
print("NEW", s.count("Standalone frontend evidence skill"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new row with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T045 — Rewrite the Webflow AT A GLANCE reached-by row

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:23` — `| **Reached by** | The hub bundling it with a workflow mode (implement, debug, verify) when it detects a Webflow surface. Never routed as a primary |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "| **Reached by** | The hub bundling it with a workflow mode (implement, debug, verify) when it detects a Webflow surface. Never routed as a primary |"
new = "| **Reached by** | A prompt that matches its trigger phrases; the local advisor returns `local-webflow` |"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("The hub bundling it with a workflow mode"))
print("NEW", s.count("the local advisor returns `local-webflow`"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new row with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T046 — Rewrite the Webflow AT A GLANCE mutates row

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:24` — `| **Mutates** | Nothing. The paired workflow mode owns all edits, tests and commits |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "| **Mutates** | Nothing. The paired workflow mode owns all edits, tests and commits |"
new = "| **Mutates** | Nothing: `allowed-tools` is read-only. The workflow applying the standards owns the edits, tests and commits |"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("The paired workflow mode owns all edits"))
print("NEW", s.count("The workflow applying the standards owns the edits"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new row with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T047 — Rewrite the Webflow QUICK START step 1

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:57` — `**Step 1: Let the hub detect the surface.** The hub watches for `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts. When one fires, it bundles this packet with the active workflow mode.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "**Step 1: Let the hub detect the surface.** The hub watches for `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts. When one fires, it bundles this packet with the active workflow mode."
new = "**Step 1: Confirm the task is Webflow frontend work.** The markers are `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts. When one of them appears, this skill's standards apply; when none does, a generic frontend task belongs to `sk-code`."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("Let the hub detect the surface"))
print("NEW", s.count("Confirm the task is Webflow frontend work"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new step with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T048 — Rewrite the Webflow HOW IT WORKS subsections

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:69` — the two subsections `### The Surface Axis` and `### Detection and Bundling`, through `The workflow mode pulls the references and assets on demand. The surface stays out of the way until the active phase needs a standard, a pattern, a checklist or a procedure.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = """### The Surface Axis

The sk-code hub splits frontend work along two axes. Workflow modes own the implement-to-verify process. Surface packets own the read-only evidence. This packet is `packetKind: surface` with a `toolSurface` of Read, Bash, Grep and Glob only. It mutates nothing. The paired workflow mode owns every edit and test. Each commit runs through that mode.

Because the packet is advisor-invisible, it never gets routed as a primary. A request naming frontend work lands on a workflow mode with this evidence attached. The mode acts on it.

### Detection and Bundling

Detection is deterministic. The hub matches `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts, then picks one surface by detection, so a task gets this packet or its sibling, not both.

The workflow mode pulls the references and assets on demand. The surface stays out of the way until the active phase needs a standard, a pattern, a checklist or a procedure."""
new = """### How Routing Works

`local-webflow` is a standalone skill. The local advisor scores a prompt against the trigger phrases and intent signals in its `graph-metadata.json` and returns it directly. No other skill detects it, bundles it or projects its routing map.

### Detection Markers

Detection is local and deterministic: `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts. When they appear, the standards here apply. When they do not, generic frontend work belongs to `sk-code`.

The references and assets are pulled on demand. The skill stays out of the way until the task needs a standard, a pattern, a checklist or a procedure."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("### The Surface Axis"))
print("NEW", s.count("### How Routing Works"))
print("BANNED", s.count("packetKind") + s.count("advisor-invisible") + s.count("parent hub"))
PY
```

Expected: `OLD 0`, `NEW 1` and `BANNED 0`.

- **AC:** AC-009
- **Rollback:** replace the two new subsections with the block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T049 — Rewrite the Webflow INTEGRATION & NAVIGATION subsections

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:83` — the two subsections `### When The Hub Bundles This Surface` and `### Related Skills`, through the four-row related table.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = """### When The Hub Bundles This Surface

Use this surface when the task touches Webflow-published pages or CDN-delivered client scripts, when the active workflow phase needs a frontend standard, an implementation pattern, a performance remediation, a deployment step or a browser debugging or verification procedure. Formal findings-first review hands off to `sk-code-review`. Author-side quality gates hand off to `sk-code-quality`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Parent hub that detects the surface and bundles it with the active workflow mode |
| `sk-code-skilled` | Sibling surface carrying `.skilled/` system-code evidence, picked by the same detection |
| `sk-code-review` | Owns formal findings-first review after the workflow phases |
| `sk-code-quality` | Owns author-side quality gates |"""
new = """### When This Skill Applies

Use it when the task touches Webflow-published pages or CDN-delivered client scripts, when the phase needs a frontend standard, an implementation pattern, a performance remediation, a deployment step or a browser debugging or verification procedure. Formal findings-first review hands off to `sk-code-review`. Author-side quality gates hand off to `sk-code-quality`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Generic code implementation workflow for work these markers do not match |
| `sk-code/sk-code-skilled` | `.skilled/` system-code evidence, for a task that is not frontend work |
| `sk-code-review` | Owns formal findings-first review after the workflow phases |
| `sk-code-quality` | Owns author-side quality gates |"""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("### When The Hub Bundles This Surface"))
print("NEW", s.count("### When This Skill Applies"))
print("BANNED", s.count("Parent hub that detects"))
PY
```

Expected: `OLD 0`, `NEW 1` and `BANNED 0`.

- **AC:** AC-009
- **Rollback:** replace the two new subsections with the block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T050 — Rewrite the Webflow FAQ first question and answer

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:100` — `**Q: Why is this packet read-only and advisor-invisible?**` with its answer paragraph.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = """**Q: Why is this packet read-only and advisor-invisible?**

A: It is evidence, not a worker. A surface that mutated would blur who owns the edit. A surface that routed as a primary could send a task to a packet that cannot act. The workflow mode owns the action. The surface supplies the standards."""
new = """**Q: Why is this skill read-only?**

A: It is evidence, not a worker. Evidence that mutated would blur who owns the edit. The workflow that applies the standards owns the action; this skill supplies the standards."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("Why is this packet read-only and advisor-invisible"))
print("NEW", s.count("Why is this skill read-only"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new question and answer with the block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T051 — Rewrite the Webflow FAQ second answer

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:106` — `A: The hub picks the surface by detection, so `.skilled/` system-code work matches `sk-code-skilled` instead. The workflow mode proceeds with the references the bundled surface carries.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "A: The hub picks the surface by detection, so `.skilled/` system-code work matches `sk-code-skilled` instead. The workflow mode proceeds with the references the bundled surface carries."
new = "A: `local-webflow` stays out of it. A `.skilled/` system-code task belongs to `sk-code/sk-code-skilled`; a generic frontend task belongs to `sk-code`."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("The hub picks the surface by detection"))
print("NEW", s.count("`local-webflow` stays out of it"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new answer with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T052 — Rewrite the Webflow RELATED DOCUMENTS `SKILL.md` row

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:126` — `| [`SKILL.md`](./SKILL.md) | Surface contract, full reference map and the non-negotiable standards |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "| [`SKILL.md`](./SKILL.md) | Surface contract, full reference map and the non-negotiable standards |"
new = "| [`SKILL.md`](./SKILL.md) | Skill contract, full reference map and the non-negotiable standards |"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("Surface contract, full reference map"))
print("NEW", s.count("Skill contract, full reference map"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-009
- **Rollback:** replace the new row with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T053 — Rewrite the Webflow README structure row before the path pass

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/README.md`
- **Anchor:** `README.md:114` — `validate_document.py .skilled/skills/sk-code/sk-code-webflow/README.md --type readme`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "validate_document.py .skilled/skills/sk-code/sk-code-webflow/README.md --type readme"
new = "validate_document.py .skilled/skills/local-webflow/README.md --type readme"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-webflow
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("sk-code/sk-code-webflow/README.md"))
print("NEW", s.count("validate_document.py .skilled/skills/local-webflow/README.md"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-008, AC-009
- **Rollback:** replace the new row with the old one.
- **Stop if:** the assert reports a count other than `1`, because T054's `sed` would have consumed the old path.

### T054 — Rewrite every absolute self-path in the Webflow skill

- **Status:** `[ ]`
- **File:** every `.md`, `.mjs`, `.js`, `.css` and `.html` file under `.skilled/skills/local-webflow/`, except `changelog/` and `benchmark/reports/`
- **Anchor:** the exact string `.skilled/skills/sk-code/sk-code-webflow` in each matching file.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
find .skilled/skills/local-webflow/ -type f \( -name '*.md' -o -name '*.mjs' -o -name '*.js' -o -name '*.css' -o -name '*.html' \) -not -path '*/changelog/*' -not -path '*/benchmark/reports/*' | while read -r f; do
  if grep -q '\.skilled/skills/sk-code/sk-code-webflow' "$f"; then
    sed -i '' 's|\.skilled/skills/sk-code/sk-code-webflow|.skilled/skills/local-webflow|g' "$f"
  fi
done
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rg -c 'sk-code/sk-code-webflow' .skilled/skills/local-webflow -g '!**/changelog/**' -g '!**/benchmark/reports/**' || echo 0
git show 42b41dd286:.skilled/skills/sk-code/sk-code-webflow/README.md | grep -c 'sk-code/sk-code-webflow'
```

Expected: `0` from the zero check and `1` from the positive control.

- **AC:** AC-008
- **Rollback:** re-run T005 and repeat T020 to T053; the pinned archive restores the original paths.
- **Stop if:** the zero check prints any file line, because a match would mean a file the loop skipped.

<!-- /ANCHOR:phase-7 -->
---

<!-- ANCHOR:phase-8 -->
## Phase 8: Obsidian relative links

### T055 — Rewrite the escaping code-style-guide link in the Obsidian `SKILL.md`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:226` — `../shared/references/universal/code-style-guide.md`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "../shared/references/universal/code-style-guide.md"
new = "../sk-code/shared/references/universal/code-style-guide.md"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("](../shared/references/universal/code-style-guide.md)"))
print("NEW", s.count("](../sk-code/shared/references/universal/code-style-guide.md)"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-007, AC-008
- **Rollback:** replace `../sk-code/shared/references/` back with `../shared/references/`.
- **Stop if:** the assert reports a count other than `1`.

### T056 — Rewrite the escaping stack-detection link in the Obsidian playbook

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/manual-testing-playbook/surface-detection/negative-control-non-obsidian.md`
- **Anchor:** `negative-control-non-obsidian.md:122` — `../../../shared/references/stack-detection.md`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("manual-testing-playbook/surface-detection/negative-control-non-obsidian.md")
s = p.read_text()
old = "../../../shared/references/stack-detection.md"
new = "../../../sk-code/shared/references/stack-detection.md"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("manual-testing-playbook/surface-detection/negative-control-non-obsidian.md").read_text()
print("OLD", s.count("../../../shared/references/stack-detection.md"))
print("NEW", s.count("../../../sk-code/shared/references/stack-detection.md"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-007, AC-008
- **Rollback:** replace `../../../sk-code/shared/references/stack-detection.md` back with `../../../shared/references/stack-detection.md`.
- **Stop if:** the assert reports a count other than `1`.

<!-- /ANCHOR:phase-8 -->
---

<!-- ANCHOR:phase-9 -->
## Phase 9: Obsidian identity

### T057 — Rename the Obsidian skill in its frontmatter

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:2` — `name: sk-code-obsidian`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "name: sk-code-obsidian"
new = "name: local-obsidian"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("name: sk-code-obsidian"))
print("NEW", s.count("name: local-obsidian"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace `name: local-obsidian` back with `name: sk-code-obsidian`.
- **Stop if:** the assert reports a count other than `1`.

### T058 — Remove the surface metadata from the Obsidian frontmatter

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:6` — `metadata:` / `  author: OpenCode` / `  family: sk-code` / `  packetKind: surface`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface"""
new = """metadata:
  author: OpenCode"""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("FAMILY", s.count("  family: sk-code"))
print("PACKET", s.count("packetKind"))
PY
```

Expected: `FAMILY 0` and `PACKET 0`.

- **AC:** AC-010
- **Rollback:** replace `metadata:\n  author: OpenCode` with the four-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T059 — Rewrite the Obsidian opening paragraph fragment

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:18` — `When the hub bundles this surface, a code workflow gains the plugin's Obsidian API`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "When the hub bundles this surface, a code workflow gains the plugin's Obsidian API"
new = "When a task matches its markers, this skill supplies the plugin's Obsidian API"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("When the hub bundles this surface"))
print("NEW", s.count("When a task matches its markers, this skill supplies"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new fragment with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T060 — Retitle section 1 of the Obsidian skill

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:25` — `## 1. WHEN THE HUB BUNDLES THIS`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "## 1. WHEN THE HUB BUNDLES THIS"
new = "## 1. WHEN THIS SKILL APPLIES"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("## 1. WHEN THE HUB BUNDLES THIS"))
print("NEW", s.count("## 1. WHEN THIS SKILL APPLIES"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new heading with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T061 — Rewrite the Obsidian section 1 detection sentence

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:29` — `The hub's surface detection resolves **OBSIDIAN**, at precedence` / `  \`SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN\`.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """The hub's surface detection resolves **OBSIDIAN**, at precedence
  `SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN`."""
new = "These markers are the whole detection rule; no surface id has to resolve."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("The hub's surface detection resolves"))
print("NEW", s.count("These markers are the whole detection rule"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new sentence with the two lines the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T062 — Rewrite the Obsidian section 1 fourth bullet

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:36` — the four-line bullet that starts `- This surface never owns edits, tests, or verification itself. The bundled workflow mode does the`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """- This surface never owns edits, tests, or verification itself. The bundled workflow mode does the
  work (for example, `sk-code-quality` or `sk-code-review`) and this packet supplies the evidence it
  must honor. A typical resolution is `[sk-code-quality, sk-code-obsidian]` or
  `[sk-code-review, sk-code-obsidian]`."""
new = """- This skill never owns edits, tests, or verification itself. The workflow that applies it, whether
  the implementation mode, `sk-code-quality` or `sk-code-review`, does the work and this skill
  supplies the evidence it must honor."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("This surface never owns edits"))
print("NEW", s.count("This skill never owns edits"))
print("RESOLUTION", s.count("A typical resolution is"))
PY
```

Expected: `OLD 0`, `NEW 1` and `RESOLUTION 0`.

- **AC:** AC-010
- **Rollback:** replace the new bullet with the four-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T063 — Rewrite the paragraph after the Obsidian section 1 bullets

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:40` — the two-line paragraph that starts `This packet is **advisor-invisible** (\`routingClass: metadata\`) and **read-only**. It never routes as a`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """This packet is **advisor-invisible** (`routingClass: metadata`) and **read-only**. It never routes as a
primary and mutates nothing. It supplies evidence while the acting workflow applies it."""
new = """This skill is **read-only**: `allowed-tools` is `Read`, `Bash`, `Grep` and `Glob`. The local advisor
routes it directly on a matching prompt, and it supplies evidence while the acting workflow applies it."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("This packet is **advisor-invisible**"))
print("NEW", s.count("The local advisor"))
print("PACKET", s.count("packet is"))
PY
```

Expected: `OLD 0`, `NEW 1` and `PACKET 0`.

- **AC:** AC-010
- **Rollback:** replace the new paragraph with the two-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T064 — Rewrite the section 2b intro in the Obsidian skill

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:67` — the two-line intro that starts `This block is the deterministic projection of \`sk-code-obsidian\`'s own intent → reference/asset`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """This block is the deterministic projection of `sk-code-obsidian`'s own intent → reference/asset
routing. Keep it in sync with the parent hub union."""
new = """This block is the machine-readable form of this skill's own intent → reference/asset routing."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("deterministic projection of"))
print("NEW", s.count("machine-readable form of this skill's own intent"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new sentence with the two-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T065 — Rewrite the section 2b routing comment in the Obsidian skill

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:70` — the four-line comment that starts `# code-obsidian owns its intent -> reference/asset routing. Paths are relative to`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """# code-obsidian owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with sk-code-obsidian/) and the sibling surface maps plus the
# parent-owned universal/shared tier. A drift guard enforces that equality."""
new = """# local-obsidian owns its intent -> reference/asset routing. Paths are relative to
# this skill root. It is the only routing map for this skill: nothing outside
# this folder projects it and no drift guard compares it to another skill."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("# code-obsidian owns its intent"))
print("NEW", s.count("# local-obsidian owns its intent"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new comment with the four-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T066 — Rewrite the Obsidian reference-map row for the workflow trio

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:58` — `The shared implement → debug → verify doctrine (symlinked from \`../../shared/references/\`).`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "The shared implement → debug → verify doctrine (symlinked from `../../shared/references/`)."
new = "The shared implement → debug → verify doctrine (copied from `../sk-code/shared/references/`)."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("symlinked from `../../shared/references/`"))
print("NEW", s.count("copied from `../sk-code/shared/references/`"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new row with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T067 — Rewrite the Obsidian RULES ALWAYS first bullet

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:252` — the two-line bullet that starts `- Follow the parent hub's selected workflow mode and apply this surface's standards as read-only`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """- Follow the parent hub's selected workflow mode and apply this surface's standards as read-only
  evidence."""
new = """- Apply this skill's standards as read-only evidence while the active workflow owns the edit."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("Follow the parent hub's selected workflow mode"))
print("NEW", s.count("Apply this skill's standards as read-only evidence"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new bullet with the two-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T068 — Rewrite the Obsidian RULES NEVER first bullet

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:261` — `- Never act as a separate advisor identity or route as a primary.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "- Never act as a separate advisor identity or route as a primary."
new = "- Never edit the plugin tree from this skill: `allowed-tools` is read-only."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("Never act as a separate advisor identity"))
print("NEW", s.count("Never edit the plugin tree from this skill"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new bullet with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T069 — Rewrite the Obsidian RULES NEVER metadata bullet

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:264` — the two-line bullet that starts `- Never carry a packet-level \`graph-metadata.json\` or \`description.json\` — either is a \`NESTED_IDENTITY\``
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """- Never carry a packet-level `graph-metadata.json` or `description.json` — either is a `NESTED_IDENTITY`
  violation at this hub."""
new = """- Never add a second `graph-metadata.json` below this skill root: the root carries exactly one, and a
  nested copy would register a second identity."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("NESTED_IDENTITY"))
print("NEW", s.count("nested copy would register a second identity"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new bullet with the two-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T070 — Rewrite the Obsidian INTEGRATION POINTS input bullet opening

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:286` — `- **Input:** requests routed to \`sk-code\` whose surface detects as OBSIDIAN — CWD or changed/target`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "- **Input:** requests routed to `sk-code` whose surface detects as OBSIDIAN — CWD or changed/target"
new = "- **Input:** requests the local advisor routes to `local-obsidian` — CWD or changed/target"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("whose surface detects as OBSIDIAN"))
print("NEW", s.count("requests the local advisor routes to `local-obsidian`"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new opening with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T071 — Rewrite the Obsidian INTEGRATION POINTS input bullet closing sentence

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:289` — `  \`.devin\` back to this hub. The hub bundles this surface behind the chosen workflow mode.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = "  `.devin` back to this hub. The hub bundles this surface behind the chosen workflow mode."
new = "  `.devin` back to this skills folder."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("back to this hub"))
print("NEW", s.count("back to this skills folder"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new closing sentence with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T072 — Rewrite the Obsidian INTEGRATION POINTS related bullet

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/SKILL.md`
- **Anchor:** `SKILL.md:299` — the three-line bullet that starts `- **Related:** \`../sk-code-webflow\` and \`../sk-code-skilled\` (sibling`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("SKILL.md")
s = p.read_text()
old = """- **Related:** `../sk-code-webflow` and `../sk-code-skilled` (sibling
  surfaces), `../../shared/` (the shared implement → debug → verify doctrine), `system-spec-kit` (spec
  folders), and `sk-git` (worktrees and commits)."""
new = """- **Related:** `../local-webflow` and `../sk-code/sk-code-skilled` (sibling evidence
  skills), `../sk-code/shared/` (the shared implement → debug → verify doctrine), `system-spec-kit`
  (spec folders), and `sk-git` (worktrees and commits)."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("SKILL.md").read_text()
print("OLD", s.count("`../sk-code-webflow` and `../sk-code-skilled` (sibling"))
print("NEW", s.count("`../local-webflow` and `../sk-code/sk-code-skilled` (sibling evidence"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new bullet with the three-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T073 — Rewrite the Obsidian README frontmatter trigger phrase

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:5` — `  - "sk-code-obsidian"`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = '  - "sk-code-obsidian"'
new = '  - "local-obsidian"'
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count('"sk-code-obsidian"'))
print("NEW", s.count('"local-obsidian"'))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new trigger phrase with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T074 — Retitle the Obsidian README

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:11` — `# sk-code-obsidian: Note Database Plugin Evidence (sk-code surface)`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "# sk-code-obsidian: Note Database Plugin Evidence (sk-code surface)"
new = "# local-obsidian: Note Database Plugin Evidence"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("# sk-code-obsidian: Note Database Plugin Evidence"))
print("NEW", s.count("# local-obsidian: Note Database Plugin Evidence"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new heading with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T075 — Rewrite the Obsidian AT A GLANCE packet-kind row

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:25` — `| **Packet kind** | \`surface\` (read-only domain evidence) |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "| **Packet kind** | `surface` (read-only domain evidence) |"
new = "| **Skill kind** | Standalone evidence skill (read-only domain evidence) |"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("| **Packet kind** |"))
print("NEW", s.count("| **Skill kind** |"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new row with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T076 — Rewrite the Obsidian AT A GLANCE advisor row

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:28` — `| **Advisor** | invisible (\`routingClass: metadata\`); reached only by hub bundling |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "| **Advisor** | invisible (`routingClass: metadata`); reached only by hub bundling |"
new = "| **Advisor** | routed directly; the local advisor returns `local-obsidian` on a matching prompt |"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("reached only by hub bundling"))
print("NEW", s.count("routed directly; the local advisor returns"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new row with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T077 — Rewrite the Obsidian AT A GLANCE bundled-with row

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:30` — `| **Bundled with** | a workflow mode, e.g. \`[sk-code-quality, sk-code-obsidian]\` |`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "| **Bundled with** | a workflow mode, e.g. `[sk-code-quality, sk-code-obsidian]` |"
new = "| **Applies with** | a code workflow, e.g. `sk-code-quality` or `sk-code-review` |"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("| **Bundled with** |"))
print("NEW", s.count("| **Applies with** |"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new row with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T078 — Rewrite the Obsidian OVERVIEW closing sentence

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:72` — `it is the source of truth. This surface is that repo's read-only convention mirror inside \`sk-code\`.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "it is the source of truth. This surface is that repo's read-only convention mirror inside `sk-code`."
new = "it is the source of truth. This skill is that repo's read-only convention mirror."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("convention mirror inside `sk-code`"))
print("NEW", s.count("This skill is that repo's read-only convention mirror."))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new sentence with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T079 — Rewrite the Obsidian HOW IT WORKS subsections

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:98` — the two subsections `### The Surface Axis` and `### Detection and Bundling`, through `surface after).`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = """### The Surface Axis

`sk-code` declares a `surface-axis` extension: `packetKind: "surface"` entries are read-only evidence
bases bundled alongside a workflow mode, never advisor identities of their own. This packet is the
third surface, beside `sk-code-webflow` and `sk-code-skilled`.

### Detection and Bundling

Surface detection (in `../shared/references/stack-detection.md`) resolves OBSIDIAN from the CWD and
changed/target files, at precedence **SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN**, SKILLED
still wins a genuinely resolved `.opencode/` target; OBSIDIAN catches the plugin repository's own
paths, which would otherwise fall to UNKNOWN as generic Node.js. The hub then bundles this surface
behind the chosen workflow mode via `routerPolicy.outcomes.surfaceBundle` (workflow ordered first,
surface after)."""
new = """### How Routing Works

`local-obsidian` is a standalone skill. The local advisor scores a prompt against the trigger phrases
and intent signals in its `graph-metadata.json` and returns it directly. No other skill detects it,
bundles it or projects its routing map.

### Detection Markers

Detection is local and deterministic: `manifest.json` carrying `minAppVersion`, `esbuild.config.mjs`,
`from "obsidian"` imports, and `.db-*` classes in `styles.css`, resolved against the CWD and the
changed or target files. A resolved-realpath check catches the plugin repository's own paths, which
would otherwise read as generic Node.js."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("### The Surface Axis"))
print("NEW", s.count("### How Routing Works"))
print("BANNED", s.count("packetKind") + s.count("surfaceBundle"))
PY
```

Expected: `OLD 0`, `NEW 1` and `BANNED 0`.

- **AC:** AC-010
- **Rollback:** replace the two new subsections with the block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T080 — Rewrite the Obsidian INTEGRATION & NAVIGATION subsections

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:115` — the two subsections `### When The Hub Bundles This Surface` and `### Related Skills`, through the four-bullet related list.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = """### When The Hub Bundles This Surface

`node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<obsidian plugin task>"` resolves the
workflow mode and appends `sk-code-obsidian` as read-only evidence, e.g. a quality gate on the plugin
returns `[sk-code-quality, sk-code-obsidian]`.

### Related Skills

- `../sk-code-webflow`, `../sk-code-skilled`: sibling read-only surfaces on
  the same axis.
- `../sk-code-quality`, `../sk-code-review`: workflow modes that bundle this surface.
- `../shared/`: the implement → debug → verify doctrine this surface folds in via symlink.
- `system-spec-kit` (spec folders + memory), `sk-git` (worktrees, commits, finish)."""
new = """### When This Skill Applies

Use it when the task works on the **Note Database** plugin's source tree, its `styles.css` class
grammar, its screenshot harness or its verification gate, and the phase needs the plugin's
design-system evidence. The workflow that applies it owns the edit; this skill supplies the evidence.

### Related Skills

- `../local-webflow`, `../sk-code/sk-code-skilled`: sibling read-only evidence skills.
- `../sk-code/sk-code-quality`, `../sk-code/sk-code-review`: workflows that apply this evidence.
- `../sk-code/shared/`: the implement → debug → verify doctrine this skill carries a copy of.
- `system-spec-kit` (spec folders + memory), `sk-git` (worktrees, commits, finish)."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("### When The Hub Bundles This Surface"))
print("NEW", s.count("### When This Skill Applies"))
print("BANNED", s.count("compiled-route.cjs") + s.count("../sk-code-webflow"))
PY
```

Expected: `OLD 0`, `NEW 1` and `BANNED 0`. This task also replaces the prose at O-30, O-31, O-32 and
O-33, so those four catalogue entries are not separate tasks: O-30 sits inside this file's earlier
HOW IT WORKS block, which T079 replaces, and O-31 to O-33 sit inside the related list this task
replaces.

- **AC:** AC-010
- **Rollback:** replace the two new subsections with the block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T081 — Rewrite the Obsidian FAQ advisor-routable question and answer

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:147` — the two-line block that starts `**Is it advisor-routable?** No. It is \`routingClass: metadata\` and advisor-invisible; the advisor routes`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = """**Is it advisor-routable?** No. It is `routingClass: metadata` and advisor-invisible; the advisor routes
the single `sk-code` identity and the hub bundles this surface."""
new = """**Is it advisor-routable?** Yes. The local advisor returns `local-obsidian` when a prompt matches its
trigger phrases or intent signals."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("**Is it advisor-routable?** No."))
print("NEW", s.count("**Is it advisor-routable?** Yes."))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new block with the two-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T082 — Rewrite the Obsidian VERIFICATION contract bullets

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:154` — the five-line block that starts `- Packet conforms to the surface contract: \`packetKind: surface\`, \`backendKind: evidence-base\`, read-only`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = """- Packet conforms to the surface contract: `packetKind: surface`, `backendKind: evidence-base`, read-only
  `toolSurface`, `routingClass: metadata`, `folder == packetSkillName`, no packet-level advisor metadata.
- Fleet gate: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` exits 0.
- Routing: `compiled-route.cjs --hub sk-code --prompt "code work on the Note Database plugin"` bundles
  this surface instead of returning `defer`."""
new = """- Skill shape: one skill-root `graph-metadata.json` with `skill_id: local-obsidian`, read-only
  `allowed-tools`, and no nested identity file below the root.
- Link audit: every relative link under this skill resolves.
- Routing: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"obsidian plugin code"}' --format json` returns `local-obsidian` first."""
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("Packet conforms to the surface contract"))
print("NEW", s.count("Skill shape: one skill-root"))
print("BANNED", s.count("compiled-route.cjs"))
PY
```

Expected: `OLD 0`, `NEW 1` and `BANNED 0`.

- **AC:** AC-010
- **Rollback:** replace the new block with the five-line block the Anchor quotes.
- **Stop if:** the assert reports a count other than `1`.

### T083 — Rewrite the Obsidian RELATED DOCUMENTS hub-routing bullet

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:167` — `- \`../ROUTER.md\`, \`../mode-registry.json\`, \`../hub-router.json\`: the parent hub's routing.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "- `../ROUTER.md`, `../mode-registry.json`, `../hub-router.json`: the parent hub's routing."
new = "- `../sk-code/`: the public hub, which no longer carries this skill's routing."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("mode-registry.json"))
print("NEW", s.count("no longer carries this skill's routing"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new bullet with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T084 — Rewrite the Obsidian RELATED DOCUMENTS `SKILL.md` bullet

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/README.md`
- **Anchor:** `README.md:163` — `- \`SKILL.md\`: the surface contract, reference map, machine-readable routing, and standards.`
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
p = Path("README.md")
s = p.read_text()
old = "- `SKILL.md`: the surface contract, reference map, machine-readable routing, and standards."
new = "- `SKILL.md`: the skill contract, reference map, machine-readable routing, and standards."
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/local-obsidian
python3 - <<'PY'
from pathlib import Path
s = Path("README.md").read_text()
print("OLD", s.count("the surface contract, reference map"))
print("NEW", s.count("the skill contract, reference map"))
PY
```

Expected: `OLD 0` and `NEW 1`.

- **AC:** AC-010
- **Rollback:** replace the new bullet with the old one.
- **Stop if:** the assert reports a count other than `1`.

### T085 — Rewrite every absolute self-path in the Obsidian skill

- **Status:** `[ ]`
- **File:** every `.md`, `.mjs`, `.js`, `.css` and `.html` file under `.skilled/skills/local-obsidian/`, except `changelog/` and `benchmark/reports/`
- **Anchor:** the exact string `.skilled/skills/sk-code/sk-code-obsidian` in each matching file.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
find .skilled/skills/local-obsidian/ -type f \( -name '*.md' -o -name '*.mjs' -o -name '*.js' -o -name '*.css' -o -name '*.html' \) -not -path '*/changelog/*' -not -path '*/benchmark/reports/*' | while read -r f; do
  if grep -q '\.skilled/skills/sk-code/sk-code-obsidian' "$f"; then
    sed -i '' 's|\.skilled/skills/sk-code/sk-code-obsidian|.skilled/skills/local-obsidian|g' "$f"
  fi
done
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rg -c 'sk-code/sk-code-obsidian' .skilled/skills/local-obsidian -g '!**/changelog/**' -g '!**/benchmark/reports/**' || echo 0
git show 42b41dd286:.skilled/skills/sk-code/sk-code-obsidian/README.md | grep -c 'sk-code-obsidian'
```

Expected: `0` from the zero check and `7` from the positive control.

- **AC:** AC-008
- **Rollback:** re-run T006 and repeat T055 to T084; the pinned archive restores the original paths.
- **Stop if:** the zero check prints any file line, because a match would mean a file the loop skipped.

<!-- /ANCHOR:phase-9 -->
---

<!-- ANCHOR:phase-10 -->
## Phase 10: Skill metadata

### T086 — Write the Webflow skill-root `graph-metadata.json`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-webflow/graph-metadata.json`
- **Anchor:** new file.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
cat > .skilled/skills/local-webflow/graph-metadata.json <<'JSON'
{
  "schema_version": 2,
  "skill_id": "local-webflow",
  "family": "sk-code",
  "category": "frontend",
  "edges": {
    "depends_on": [],
    "enhances": [],
    "siblings": [
      {
        "target": "sk-code",
        "weight": 0.5,
        "context": "frontend evidence applied by the generic code implementation workflow"
      }
    ],
    "conflicts_with": [],
    "prerequisite_for": []
  },
  "domains": [
    "webflow",
    "frontend",
    "css",
    "html",
    "javascript",
    "cdn-deployment",
    "browser-debugging"
  ],
  "intent_signals": [
    "html",
    "css",
    "javascript",
    "cdn",
    "gsap",
    "lenis",
    "swiper",
    "hls.js",
    "filepond",
    "intersectionobserver",
    "browser",
    "webflow implementation",
    "webflow frontend workflow"
  ],
  "derived": {
    "trigger_phrases": [
      "webflow implementation",
      "frontend implementation standards",
      "webflow frontend workflow",
      "webflow",
      "frontend",
      "webflow.js",
      "src/2_javascript",
      "motion.dev",
      "motion-dev",
      "motion_dev",
      "motion api",
      "motion snippets",
      "motion decision matrix",
      "cross-stack animation",
      "motion animation"
    ],
    "key_topics": [
      "webflow",
      "frontend",
      "css",
      "html",
      "javascript",
      "cdn-deployment",
      "browser-debugging"
    ],
    "intent_signals": [
      "implement webflow frontend",
      "debug browser javascript",
      "verify cdn deployment",
      "remediate core web vitals",
      "animate with motion.dev",
      "minify client scripts"
    ],
    "key_files": [
      ".skilled/skills/local-webflow/SKILL.md",
      ".skilled/skills/local-webflow/README.md",
      ".skilled/skills/local-webflow/references/css/style-guide.md",
      ".skilled/skills/local-webflow/references/javascript/quick-reference.md",
      ".skilled/skills/local-webflow/references/html/style-guide.md"
    ],
    "source_docs": [
      "SKILL.md",
      "README.md",
      "references/css/style-guide.md",
      "references/javascript/quick-reference.md",
      "references/html/style-guide.md"
    ],
    "entities": [
      {"name": "local-webflow", "kind": "skill", "path": ".skilled/skills/local-webflow/SKILL.md", "source": "derived"},
      {"name": "README", "kind": "reference", "path": ".skilled/skills/local-webflow/README.md", "source": "derived"},
      {"name": "css_style_guide", "kind": "reference", "path": ".skilled/skills/local-webflow/references/css/style-guide.md", "source": "derived"},
      {"name": "javascript_quick_reference", "kind": "reference", "path": ".skilled/skills/local-webflow/references/javascript/quick-reference.md", "source": "derived"},
      {"name": "html_style_guide", "kind": "reference", "path": ".skilled/skills/local-webflow/references/html/style-guide.md", "source": "derived"}
    ],
    "causal_summary": "Frontend evidence for Webflow-published pages and CDN-delivered client scripts, applied when a task matches its markers.",
    "created_at": "2026-10-23T00:00:00Z",
    "last_updated_at": "2026-10-23T00:00:00Z",
    "sanitizer_version": "sanitizeSkillLabel:v2"
  }
}
JSON
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node -e "const j=require('./.skilled/skills/local-webflow/graph-metadata.json');if(j.skill_id!=='local-webflow')process.exit(1);if(!['cli','mcp','sk-code','sk-hub','deep-loop','sk-util','system'].includes(j.family))process.exit(1);for(const k of ['trigger_phrases','key_topics','key_files','entities','source_docs'])if(!Array.isArray(j.derived[k])||j.derived[k].length===0)process.exit(1);if(!j.derived.causal_summary)process.exit(1);console.log('OK')"
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-webflow --write | grep -c -E '"status": "(written|unchanged)"'
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-webflow | grep -c -E '"status": "unchanged"'
find .skilled/skills/local-webflow \( -name graph-metadata.json -o -name description.json \) | wc -l
```

Expected: `OK`, `1`, `1`, `1`.

- **AC:** AC-011
- **Rollback:** `rm .skilled/skills/local-webflow/graph-metadata.json`
- **Stop if:** the `node -e` check exits non-zero, or either generator run reports `"status": "error"`, or the file count is not `1`.

### T087 — Write the Obsidian skill-root `graph-metadata.json`

- **Status:** `[ ]`
- **File:** `.skilled/skills/local-obsidian/graph-metadata.json`
- **Anchor:** new file.
- **Change:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
cat > .skilled/skills/local-obsidian/graph-metadata.json <<'JSON'
{
  "schema_version": 2,
  "skill_id": "local-obsidian",
  "family": "sk-code",
  "category": "plugin-evidence",
  "edges": {
    "depends_on": [],
    "enhances": [],
    "siblings": [
      {
        "target": "sk-code",
        "weight": 0.5,
        "context": "plugin design-system evidence applied by the generic code implementation workflow"
      }
    ],
    "conflicts_with": [],
    "prerequisite_for": []
  },
  "domains": [
    "obsidian-plugin",
    "note-database",
    "plugin-api",
    "css-class-grammar",
    "screenshot-harness",
    "verification-gate"
  ],
  "intent_signals": [
    "obsidian api",
    "itemview",
    "workspaceleaf",
    "manifest.json",
    "esbuild.config.mjs",
    "styles.css",
    ".db-",
    "vault",
    "metadatacache",
    "tfile",
    "screenshots:verify",
    "note database",
    "obsidian plugin implementation",
    "obsidian plugin code"
  ],
  "derived": {
    "trigger_phrases": [
      "obsidian plugin implementation",
      "obsidian plugin code",
      "note database plugin",
      "obsidian plugin surface",
      "db-* class grammar",
      "obsidian",
      "obsidian plugin",
      "note-database"
    ],
    "key_topics": [
      "obsidian-plugin",
      "note-database",
      "plugin-api",
      "css-class-grammar",
      "screenshot-harness",
      "verification-gate"
    ],
    "intent_signals": [
      "implement obsidian plugin view",
      "debug plugin api boundary",
      "verify screenshot harness",
      "review db class grammar",
      "run plugin source gates",
      "add plugin stylesheet class"
    ],
    "key_files": [
      ".skilled/skills/local-obsidian/SKILL.md",
      ".skilled/skills/local-obsidian/README.md",
      ".skilled/skills/local-obsidian/references/obsidian-plugin-api.md",
      ".skilled/skills/local-obsidian/references/db-class-naming.md",
      ".skilled/skills/local-obsidian/references/verification.md"
    ],
    "source_docs": [
      "SKILL.md",
      "README.md",
      "references/obsidian-plugin-api.md",
      "references/db-class-naming.md",
      "references/verification.md"
    ],
    "entities": [
      {"name": "local-obsidian", "kind": "skill", "path": ".skilled/skills/local-obsidian/SKILL.md", "source": "derived"},
      {"name": "README", "kind": "reference", "path": ".skilled/skills/local-obsidian/README.md", "source": "derived"},
      {"name": "obsidian_plugin_api", "kind": "reference", "path": ".skilled/skills/local-obsidian/references/obsidian-plugin-api.md", "source": "derived"},
      {"name": "db_class_naming", "kind": "reference", "path": ".skilled/skills/local-obsidian/references/db-class-naming.md", "source": "derived"},
      {"name": "verification", "kind": "reference", "path": ".skilled/skills/local-obsidian/references/verification.md", "source": "derived"}
    ],
    "causal_summary": "Design-system and source-convention evidence for the Note Database Obsidian plugin, applied when a task works on that plugin tree.",
    "created_at": "2026-10-23T00:00:00Z",
    "last_updated_at": "2026-10-23T00:00:00Z",
    "sanitizer_version": "sanitizeSkillLabel:v2"
  }
}
JSON
```

- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node -e "const j=require('./.skilled/skills/local-obsidian/graph-metadata.json');if(j.skill_id!=='local-obsidian')process.exit(1);if(!['cli','mcp','sk-code','sk-hub','deep-loop','sk-util','system'].includes(j.family))process.exit(1);for(const k of ['trigger_phrases','key_topics','key_files','entities','source_docs'])if(!Array.isArray(j.derived[k])||j.derived[k].length===0)process.exit(1);if(!j.derived.causal_summary)process.exit(1);console.log('OK')"
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-obsidian --write | grep -c -E '"status": "(written|unchanged)"'
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-obsidian | grep -c -E '"status": "unchanged"'
find .skilled/skills/local-obsidian \( -name graph-metadata.json -o -name description.json \) | wc -l
```

Expected: `OK`, `1`, `1`, `1`.

- **AC:** AC-012
- **Rollback:** `rm .skilled/skills/local-obsidian/graph-metadata.json`
- **Stop if:** the `node -e` check exits non-zero, or either generator run reports `"status": "error"`, or the file count is not `1`.

<!-- /ANCHOR:phase-10 -->
---

<!-- ANCHOR:phase-11 -->
## Phase 11: Verification

### T088 — Take the final Webflow link-audit reading

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
mkdir -p /tmp/psurf-phase4/control
printf '[x](missing.md)\n' > /tmp/psurf-phase4/control/broken.md
bash /tmp/psurf-phase4/link-audit.sh /tmp/psurf-phase4/control | grep -c BROKEN
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow | grep -c BROKEN
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow | grep 'BROKEN'
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow | tail -1
```

Expected: `1` from the positive control, `1` from the Webflow count, one line
`BROKEN .../references/javascript/quality-standards/shared-listener-and-weakmap.md -> target`, and
`AUDIT_FAIL=1`.

- **AC:** AC-006
- **Rollback:** n/a: read-only.
- **Stop if:** the Webflow count is not `1`, or the single `BROKEN` line names any file other than `shared-listener-and-weakmap.md`.

### T089 — Take the final Obsidian link-audit reading

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
bash /tmp/psurf-phase4/link-audit.sh /tmp/psurf-phase4/control | grep -c BROKEN
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-obsidian | grep -c BROKEN || true
bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-obsidian | tail -1
```

Expected: `1` from the positive control, `0` from the Obsidian count, and `AUDIT_FAIL=0`.

- **AC:** AC-007
- **Rollback:** n/a: read-only.
- **Stop if:** the Obsidian count is not `0` or the last line is not `AUDIT_FAIL=0`.

### T090 — Validate the Webflow README structure

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/local-webflow/README.md --type readme | grep -c 'VALID'
```

Expected: `1`.

- **AC:** AC-009
- **Rollback:** n/a: read-only.
- **Stop if:** the validator reports any issue.

### T091 — Validate the Obsidian README structure

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/local-obsidian/README.md --type readme | grep -c 'VALID'
```

Expected: `1`.

- **AC:** AC-010
- **Rollback:** n/a: read-only.
- **Stop if:** the validator reports any issue.

### T092 — Prove the Webflow skill carries no packet id

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
grep -c '013-private-surface-skills' specs/sk-code/013-private-surface-skills/004-private-local-skills/spec.md
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rg -c '013-private-surface-skills|004-private-local-skills' .skilled/skills/local-webflow || echo 0
```

Expected: at least `1` from the positive control and `0` from the zero check.

- **AC:** AC-016
- **Rollback:** n/a: read-only.
- **Stop if:** the zero check prints a file line.

### T093 — Prove the Obsidian skill carries no packet id

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
grep -c '013-private-surface-skills' specs/sk-code/013-private-surface-skills/004-private-local-skills/spec.md
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rg -c '013-private-surface-skills|004-private-local-skills' .skilled/skills/local-obsidian || echo 0
```

Expected: at least `1` from the positive control and `0` from the zero check.

- **AC:** AC-016
- **Rollback:** n/a: read-only.
- **Stop if:** the zero check prints a file line.

### T094 — Prove the advisor indexes both skills, real-folder mode (recorded alternative, not used)

- **Status:** `[—]` not used under ADR-001
- **File:** none
- **Anchor:** n/a: read-only command, except for the throwaway database it creates.
- **Change:** n/a under the recorded answer. This is the Mode A advisor probe.
- **Proof:** n/a: never run under ADR-001's `Accepted: symlink to two external repositories`.
- **AC:** AC-014
- **Rollback:** n/a: never run.
- **Stop if:** always: ADR-001 records Mode B, so this task must not be executed.

### T095 — Prove the advisor indexes both skills, two-repository symlink mode

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command, except for the throwaway database it creates.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
PRIVATE_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
export SPECKIT_PRIVATE_SKILL_ROOTS="$PRIVATE_ROOTS"
rm -rf /tmp/psurf-phase4/advisor-db
export SYSTEM_SKILL_ADVISOR_DB_DIR=/tmp/psurf-phase4/advisor-db
node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format json > /tmp/psurf-phase4/scan.json
sqlite3 /tmp/psurf-phase4/advisor-db/skill-graph.sqlite "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id;"
unset SYSTEM_SKILL_ADVISOR_DB_DIR SPECKIT_PRIVATE_SKILL_ROOTS
```

Expected: `local-obsidian` and `local-webflow`, one per line.

- **AC:** AC-014, AC-022
- **Rollback:** `rm -rf /tmp/psurf-phase4/advisor-db`
- **Stop if:** ADR-001's `Folder mode` is not `symlink`, `SPECKIT_PRIVATE_SKILL_ROOTS` does not hold both roots, the scan exits `75` twice, or the query prints no rows.

### T095a — Commit and push the Webflow repository

- **Status:** `[ ]`
- **File:** `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills/local-webflow/` and that repository's git index
- **Anchor:** `git -C "$WEBFLOW_REPO" status --porcelain local-skills/local-webflow` reports the restored tree as untracked before this task.
- **Change:** ask for an explicit operator yes before the push. Stage only the target path, and stop if anything else is staged.

```bash
WEBFLOW_REPO="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
test -z "$(git -C "$WEBFLOW_REPO" diff --cached --name-only)" && echo INDEX_CLEAN
git -C "$WEBFLOW_REPO" add local-skills/local-webflow
git -C "$WEBFLOW_REPO" diff --cached --name-only | grep -c '^local-skills/local-webflow/'
git -C "$WEBFLOW_REPO" diff --cached --name-only | grep -c -v '^local-skills/local-webflow/' || true
git -C "$WEBFLOW_REPO" commit -m "feat(skills): restore local-webflow"
BRANCH=$(git -C "$WEBFLOW_REPO" branch --show-current)
# Ask: May I push local-webflow to origin/$BRANCH? Wait for an explicit yes.
git -C "$WEBFLOW_REPO" push origin "HEAD:$BRANCH"
```

- **Proof:**

```bash
WEBFLOW_REPO="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
BRANCH=$(git -C "$WEBFLOW_REPO" branch --show-current)
git -C "$WEBFLOW_REPO" ls-files local-skills/local-webflow | wc -l
git -C "$WEBFLOW_REPO" show --name-only --format= HEAD | grep -c -v '^local-skills/local-webflow/' || true
test "$(git -C "$WEBFLOW_REPO" rev-parse HEAD)" = "$(git -C "$WEBFLOW_REPO" rev-parse "origin/$BRANCH")" && echo WEBFLOW_PUSHED
```

Expected: `162`, `0` and `WEBFLOW_PUSHED`.

- **AC:** AC-021
- **Rollback:** `git -C "$WEBFLOW_REPO" revert <commit>` creates a revert commit in that repository; if the commit was already pushed, push the revert after another explicit operator yes.
- **Stop if:** anything outside `local-skills/local-webflow/` is staged, the operator does not answer yes to the push, or `origin/$BRANCH` does not match `HEAD` after the push.

### T095b — Commit and push the Obsidian repository

- **Status:** `[ ]`
- **File:** `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills/local-obsidian/` and that repository's git index
- **Anchor:** `git -C "$OBSIDIAN_REPO" status --porcelain local-skills/local-obsidian` reports the restored tree as untracked before this task.
- **Change:** ask for an explicit operator yes before the push, because this repository is public and the push publishes the skill content. Stage only the target path, and stop if anything else is staged.

```bash
OBSIDIAN_REPO="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
test -z "$(git -C "$OBSIDIAN_REPO" diff --cached --name-only)" && echo INDEX_CLEAN
git -C "$OBSIDIAN_REPO" add local-skills/local-obsidian
git -C "$OBSIDIAN_REPO" diff --cached --name-only | grep -c '^local-skills/local-obsidian/'
git -C "$OBSIDIAN_REPO" diff --cached --name-only | grep -c -v '^local-skills/local-obsidian/' || true
git -C "$OBSIDIAN_REPO" commit -m "feat(skills): restore local-obsidian"
BRANCH=$(git -C "$OBSIDIAN_REPO" branch --show-current)
# Ask: May I publish local-obsidian by pushing to origin/$BRANCH? Wait for an explicit yes.
git -C "$OBSIDIAN_REPO" push origin "HEAD:$BRANCH"
```

- **Proof:**

```bash
OBSIDIAN_REPO="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
BRANCH=$(git -C "$OBSIDIAN_REPO" branch --show-current)
git -C "$OBSIDIAN_REPO" ls-files local-skills/local-obsidian | wc -l
git -C "$OBSIDIAN_REPO" show --name-only --format= HEAD | grep -c -v '^local-skills/local-obsidian/' || true
test "$(git -C "$OBSIDIAN_REPO" rev-parse HEAD)" = "$(git -C "$OBSIDIAN_REPO" rev-parse "origin/$BRANCH")" && echo OBSIDIAN_PUBLISHED
```

Expected: `66`, `0` and `OBSIDIAN_PUBLISHED`.

- **AC:** AC-021
- **Rollback:** `git -C "$OBSIDIAN_REPO" revert <commit>` creates a revert commit in that repository; if the commit was already published, push the revert after another explicit operator yes.
- **Stop if:** anything outside `local-skills/local-obsidian/` is staged, the operator does not answer yes to the publish, or `origin/$BRANCH` does not match `HEAD` after the push.

<!-- /ANCHOR:phase-11 -->
---

<!-- ANCHOR:phase-12 -->
## Phase 12: Evidence

### T096 — Record the two-repository mode and restore commands in the summary

- **Status:** `[ ]`
- **File:** `specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md`
- **Anchor:** `implementation-summary.md` — `[Opening hook: 2-3 sentences on what changed and why it matters. Lead with impact.]` and `implementation-summary.md` — `[What this feature does and why it exists. 1-2 paragraphs. Use direct address.` / `Explain what the user gains, not what files you touched.]`
- **Change:** replace the two placeholder blocks with prose that names the recorded folder mode as `Folder mode: symlink`, names both target repositories, and quotes the two `git archive` commands, and replace the `Files Changed` table body with two rows, one per link and its target repository. Quote paths and counts only.
- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
grep -c 'Folder mode' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
grep -c 'git archive 42b41dd286' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
grep -c 'Opening hook' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md || true
```

Expected: `1`, `2` and `0`.

- **AC:** AC-002, AC-015
- **Rollback:** restore the two placeholder blocks and the empty table row.
- **Stop if:** the summary would have to quote file content rather than a path or a count.

### T097 — Record the link-audit readings in the summary

- **Status:** `[ ]`
- **File:** `specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md`
- **Anchor:** `implementation-summary.md` — `[How was this tested, verified and shipped? What was the rollout approach?]`
- **Change:** replace the placeholder with the four readings: the intermediate Webflow `AUDIT_FAIL=1` with 16 broken links, the intermediate Obsidian `AUDIT_FAIL=1` with 2, the final Webflow `AUDIT_FAIL=1` with the one pre-existing link, and the final Obsidian `AUDIT_FAIL=0`.
- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
grep -c 'AUDIT_FAIL' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
grep -c 'How was this tested' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md || true
```

Expected: at least `4` and `0`.

- **AC:** AC-015
- **Rollback:** restore the placeholder line.
- **Stop if:** a reading is missing from the task's inputs, because the summary must quote observed output.

### T098 — Record the ignore evidence and the advisor scan in the summary

- **Status:** `[ ]`
- **File:** `specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md`
- **Anchor:** `implementation-summary.md` — `| [What was decided] | [Active-voice rationale with specific reasoning] |` and `implementation-summary.md` — `| [Validation, lint, tests, manual check] | [PASS/FAIL with specifics] |`
- **Change:** replace the decision table body with two rows, one for the two-repository symlink mode and one for the copy-before-edit rule, and replace the verification table body with rows naming `check-ignore`, the two `!!` entries, the audit results, the `skill_nodes` query, the two target-repository commits and the two-root environment value.
- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
grep -c 'check-ignore' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
grep -c 'skill_nodes' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
grep -c 'SPECKIT_PRIVATE_SKILL_ROOTS' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
grep -c '\[What was decided\]' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md || true
```

Expected: at least `1`, at least `1`, at least `1` and `0`.

- **AC:** AC-015
- **Rollback:** restore the two placeholder rows.
- **Stop if:** a row would have to quote private file content.

### T099 — Record the known limitations in the summary

- **Status:** `[ ]`
- **File:** `specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md`
- **Anchor:** `implementation-summary.md` — `1. **[Limitation]** [Specific detail with workaround if one exists.]`
- **Change:** replace the placeholder with two limitations: the pre-existing `-> target` link in `shared-listener-and-weakmap.md` stays broken by design, and the two external-repository links need both roots in `SPECKIT_PRIVATE_SKILL_ROOTS` for every advisor process.
- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
grep -c 'shared-listener-and-weakmap.md' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
grep -c '\[Limitation\]' specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md || true
```

Expected: at least `1` and `0`.

- **AC:** AC-015
- **Rollback:** restore the placeholder line.
- **Stop if:** the limitation would need a private path the operator has not recorded.

### T100 — Remove the temporary audit directory

- **Status:** `[ ]`
- **File:** `/tmp/psurf-phase4/` (temporary directory outside the repository)
- **Anchor:** new file: the directory was created by T017.
- **Change:**

```bash
rm -rf /tmp/psurf-phase4
```

- **Proof:**

```bash
test ! -e /tmp/psurf-phase4 && echo REMOVED
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git status --porcelain .skilled | wc -l || echo 0
```

Expected: `REMOVED` and `0`.

- **AC:** AC-013
- **Rollback:** n/a: the directory is temporary and is recreated by T017 if a later run needs it.
- **Stop if:** T088, T089, T095, T095a or T095b has not printed its Expected value, because the readings would be lost.

<!-- /ANCHOR:phase-12 -->
---

<!-- ANCHOR:phase-13 -->
## Phase 13: Review and close

### T101 — Run the independent review round through the OpenCode 2 `subagent` tool

- **Status:** `[ ]`
- **File:** `specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/review-round-1.md`
- **Anchor:** new file.
- **Change:** the runtime is OpenCode 2 with a DeepSeek orchestrator. Run the review through the `subagent` tool with agent `review` (agent `deep-review` for a multi-dimension pass), read-only by instruction: the prompt says it edits no file. The orchestrator captures `git status --porcelain` before and after in both the `OPERATOR` and the `WORKTREE` checkout, once for each when they are the same directory, and requires each pair to be identical. No CLI dispatch kit, kit branch or executor name (`deepseekpi`, `deepseekpihigh`, `dispatch.sh`, `cli-devin`, `cli-pi`) is used anywhere; work is done by the orchestrator itself or the `code` / `markdown` subagents. After the two status readings match, the orchestrator writes the seven-check report below from the reviewer's returned findings.

```text
| Check | Result | Evidence |
|-------|--------|----------|
| CHECK-1 | PASS or FAIL | git status --porcelain .skilled prints nothing |
| CHECK-2 | PASS or FAIL | git diff --cached --name-only has no line containing local- |
| CHECK-3 | PASS or FAIL | a find of both skill roots with -type l, piped to wc -l, prints 0 |
| CHECK-4 | PASS or FAIL | the Webflow audit ends AUDIT_FAIL=1 with one BROKEN line and the Obsidian audit ends AUDIT_FAIL=0 |
| CHECK-5 | PASS or FAIL | each SKILL.md has one name: local-* line and no packetKind |
| CHECK-6 | PASS or FAIL | each graph-metadata.json parses and its skill_id equals its folder name |
| CHECK-7 | PASS or FAIL | an rg for 013-private-surface-skills or 004-private-local-skills over both skill roots prints nothing |
```

- **Proof:**

```bash
OPERATOR="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
git -C "$OPERATOR" status --porcelain > /tmp/psurf-review-operator-before.txt
[ "$WORKTREE" = "$OPERATOR" ] || git -C "$WORKTREE" status --porcelain > /tmp/psurf-review-worktree-before.txt
# Dispatch the read-only `review` subagent here; its prompt says it edits no file.
git -C "$OPERATOR" status --porcelain > /tmp/psurf-review-operator-after.txt
[ "$WORKTREE" = "$OPERATOR" ] || git -C "$WORKTREE" status --porcelain > /tmp/psurf-review-worktree-after.txt
cmp -s /tmp/psurf-review-operator-before.txt /tmp/psurf-review-operator-after.txt && echo OPERATOR_STATUS_IDENTICAL
[ "$WORKTREE" = "$OPERATOR" ] || { cmp -s /tmp/psurf-review-worktree-before.txt /tmp/psurf-review-worktree-after.txt && echo WORKTREE_STATUS_IDENTICAL; }
rm /tmp/psurf-review-*.txt
test -f specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/review-round-1.md && echo REPORT_PRESENT
grep -c '^| CHECK-' specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/review-round-1.md
grep -c '^| CHECK-.*| PASS |' specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/review-round-1.md
```

Expected: `OPERATOR_STATUS_IDENTICAL`, then `WORKTREE_STATUS_IDENTICAL` only when `WORKTREE` is not `OPERATOR`, then `REPORT_PRESENT`, `7` and `7`.

- **AC:** AC-017
- **Rollback:** `rm specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/review-round-1.md` and remove any `/tmp/psurf-review-*.txt` file.
- **Stop if:** either checkout's before and after `git status --porcelain` outputs differ, which means the reviewer edited a file, or any row reports `FAIL`. Repair the finding, then re-run the review once; a second `FAIL` stops the phase.

### T102 — Run the strict packet validation

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/004-private-local-skills --strict | grep -c 'RESULT: PASSED'
```

Expected: `1`.

- **AC:** AC-018
- **Rollback:** n/a: read-only.
- **Stop if:** the validator prints `RESULT: FAILED`, or prints `RESULT: PASSED` with an error count above zero.

### T103 — Mark every acceptance criterion Met

- **Status:** `[ ]`
- **File:** `specs/sk-code/013-private-surface-skills/004-private-local-skills/acceptance-criteria.md`
- **Anchor:** the 22 rows of the criteria table, each ending `| Unmet | - |`
- **Change:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
python3 - <<'PY'
from pathlib import Path
p = Path("specs/sk-code/013-private-surface-skills/004-private-local-skills/acceptance-criteria.md")
s = p.read_text()
old = "| Unmet | - |"
new = "| Met | - |"
assert s.count(old) == 22, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
grep -c '^| AC-[0-9][0-9][0-9] |' specs/sk-code/013-private-surface-skills/004-private-local-skills/acceptance-criteria.md
grep -c '^| AC-[0-9][0-9][0-9] |.*| Met | - |' specs/sk-code/013-private-surface-skills/004-private-local-skills/acceptance-criteria.md
grep -c '| Unmet | - |' specs/sk-code/013-private-surface-skills/004-private-local-skills/acceptance-criteria.md || true
```

Expected: `22`, `22` and `0`.

- **AC:** AC-018
- **Rollback:** replace `| Met | - |` back with `| Unmet | - |`.
- **Stop if:** the assert reports a count other than `22`, or any criterion's proof has not printed its Expected value.

### T104 — Set the closure statement to closeable

- **Status:** `[ ]`
- **File:** `specs/sk-code/013-private-surface-skills/004-private-local-skills/acceptance-criteria.md`
- **Anchor:** `acceptance-criteria.md` closure section — `**Closeable:** No`
- **Change:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
python3 - <<'PY'
from pathlib import Path
p = Path("specs/sk-code/013-private-surface-skills/004-private-local-skills/acceptance-criteria.md")
s = p.read_text()
old = "**Closeable:** No"
new = "**Closeable:** Yes"
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new))
PY
```

- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
grep -c '^\*\*Closeable:\*\* Yes' specs/sk-code/013-private-surface-skills/004-private-local-skills/acceptance-criteria.md
```

Expected: `1`.

- **AC:** AC-018
- **Rollback:** replace `**Closeable:** Yes` back with `**Closeable:** No`.
- **Stop if:** T103 did not print `22`, `22` and `0`.

### T105 — Re-derive the phase metadata and re-run the strict validation

- **Status:** `[ ]`
- **File:** `specs/sk-code/013-private-surface-skills/004-private-local-skills/description.json` and `graph-metadata.json` (generated)
- **Anchor:** the `level` field in `description.json` and the `derived` block in `graph-metadata.json`.
- **Change:** the two status edits in T103 and T104 changed the phase documents, so the generated metadata is stale. Re-derive it, then validate.

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/sk-code/013-private-surface-skills/004-private-local-skills --apply
```

- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/004-private-local-skills --strict | grep -c 'RESULT: PASSED'
```

Expected: `1`, and the repair line reads `inspected=1 repaired=1 failed=0`.

- **AC:** AC-018
- **Rollback:** re-run the repair; the generated fields are recomputable from the documents.
- **Stop if:** the validator prints `RESULT: FAILED`, or the repair prints `failed=1`.

### T106 — Commit this phase's documents by name

- **Status:** `[ ]`
- **File:** `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md`, `goal.md`, `description.json`, `graph-metadata.json`, `scratch/review-round-1.md`
- **Anchor:** n/a: git command, no file edit.
- **Change:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
git add specs/sk-code/013-private-surface-skills/004-private-local-skills/spec.md
git add specs/sk-code/013-private-surface-skills/004-private-local-skills/plan.md
git add specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md
git add specs/sk-code/013-private-surface-skills/004-private-local-skills/acceptance-criteria.md
git add specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md
git add specs/sk-code/013-private-surface-skills/004-private-local-skills/decision-record.md
git add specs/sk-code/013-private-surface-skills/004-private-local-skills/goal.md
git add specs/sk-code/013-private-surface-skills/004-private-local-skills/description.json
git add specs/sk-code/013-private-surface-skills/004-private-local-skills/graph-metadata.json
git add specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/review-round-1.md
git diff --cached --name-only | grep -c 'skilled/skills/local-' || true
git commit -m "docs(sk-code): close phase 4 private local skills" -m "Restore both surfaces into two external repositories as gitignored links, record the link audits, the advisor scan and the target commits, and close the phase's criteria."
```

- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
git show --name-only --format= HEAD | grep -c '^specs/sk-code/013-private-surface-skills/004-private-local-skills/'
git show --name-only --format= HEAD | grep -c -v '^specs/sk-code/013-private-surface-skills/004-private-local-skills/' || true
git status --porcelain | wc -l || echo 0
```

Expected: at least `9` from the phase-folder control, `0` from the non-phase count, and `0` from the status check.

- **AC:** AC-019
- **Rollback:** `git reset --soft HEAD~1` returns the commit's content to the index without touching the two links or the target repositories.
- **Stop if:** the staged `skilled/skills/local-` count is not `0`, or T105 did not print `1`.

### T107 — Prove the commit holds no private path

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
git show --name-only --format= HEAD | grep -c '^specs/sk-code/013-private-surface-skills/004-private-local-skills/'
git show --name-only --format= HEAD | grep -c 'skilled/skills/local-' || true
```

Expected: at least `9` from the phase-folder control and `0` from the private-path check.

- **AC:** AC-019
- **Rollback:** n/a: read-only.
- **Stop if:** the first count is less than `9`, or the second count is not `0`.

### T108 — Push `HEAD:main`

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: git command, no file edit.
- **Change:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
git push origin HEAD:main
```

- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
git fetch origin main
git rev-list --count origin/main..HEAD
```

Expected: `0`.

- **AC:** AC-019
- **Rollback:** `git revert --no-edit HEAD` and push again; the commit contains only this phase's documents.
- **Stop if:** the push is rejected because the remote moved. Fetch, re-run T105, and retry once.

### T109 — Confirm the final state

- **Status:** `[ ]`
- **File:** none
- **Anchor:** n/a: read-only command.
- **Change:** n/a: read-only command.
- **Proof:**

```bash
WORKTREE="$(git rev-parse --show-toplevel)"
cd "$WORKTREE"
git status --porcelain | wc -l || echo 0
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" && echo HEAD_EQUALS_ORIGIN_MAIN
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git status --porcelain .skilled | wc -l || echo 0
git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian | grep -c '^!!'
WEBFLOW_REPO="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
OBSIDIAN_REPO="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
git -C "$WEBFLOW_REPO" ls-files local-skills/local-webflow | wc -l
git -C "$OBSIDIAN_REPO" ls-files local-skills/local-obsidian | wc -l
zsh -lic 'printenv SPECKIT_PRIVATE_SKILL_ROOTS'
grep -c '^export SPECKIT_PRIVATE_SKILL_ROOTS=' ~/.zshrc
```

Expected: `0`, `HEAD_EQUALS_ORIGIN_MAIN`, `0`, `2`, `162`, `66`, the two-root value, and `1`.

- **AC:** AC-019, AC-013, AC-021, AC-022
- **Rollback:** n/a: read-only.
- **Stop if:** any count differs from Expected.

---

<!-- /ANCHOR:phase-13 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every executed task from T001 to T109 and every added task (T002a, T006a, T006b, T095a and T095b) carries `[x]`; T003, T004 and T094 carry `[—]`
- [ ] No `[B]` blocked task remains
- [ ] Both target-repository commits exist, each holds only `local-skills/<name>`, and both roots are set in `SPECKIT_PRIVATE_SKILL_ROOTS`
- [ ] The reviewer report holds seven `PASS` rows
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
- [ ] The phase commit is on `main` and both working trees are clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available, including the T001 ordering gate
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Both `graph-metadata.json` files parse and pass the advisor's field validation, proven by T086 and T087
- [ ] CHK-011 [P0] The generator `--write` run, the confirming dry run and the advisor scan all exit 0
- [ ] CHK-012 [P1] The advisor scan has a retry path for exit 75, named in plan.md Step 9
- [ ] CHK-013 [P1] The metadata shape follows `.skilled/skills/sk-git/graph-metadata.json`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met, proven by the blocks in `acceptance-criteria.md`
- [ ] CHK-021 [P0] Manual testing complete: T088 and T089's link audits and T095's advisor scan
- [ ] CHK-022 [P1] Edge cases tested: the symlink mode and the pre-existing broken link are both covered
- [ ] CHK-023 [P1] Error scenarios validated: a failed ignore precondition stops the phase at T001
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each review finding has a class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed metadata files and the two skill roots
- [ ] CHK-FIX-004 [P0] Path fixes include adversarial cases: an escaping link, an inside-skill link, an already-broken link and a prose path mention
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] Hostile environment variant executed: the two-repository symlink scan exports both `SPECKIT_PRIVATE_SKILL_ROOTS` roots
- [ ] CHK-FIX-007 [P1] Evidence is pinned to commit `42b41dd286` and to the phase commit, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No path under `.skilled/skills/local-*` is staged, proven by T106 and T107, and each target repository stages only `local-skills/<name>`, proven by T095a and T095b
- [ ] CHK-032 [P1] Auth and authorization are not applicable: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and criteria are synchronized
- [ ] CHK-041 [P1] No comment names a spec path, a packet number or a phase number, proven by T092 and T093
- [ ] CHK-042 [P2] Both skill READMEs are rewritten by T041 to T053 and T073 to T084
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary files live outside the repository tree: `/tmp/psurf-phase4` holds the audit and the throwaway database
- [ ] CHK-051 [P1] `/tmp/psurf-phase4` is removed by T100 before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---

