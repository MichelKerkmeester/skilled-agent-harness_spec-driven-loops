---
title: "Feature Specification: Support git-ignored local-* commands in every runtime"
description: "A private command could not live in this repository: the command-catalog check reported any command missing from README.txt as drift, no ignore rule covered a command or its generated mirrors, and the pre-commit guard refused only local-* skills. This packet extends the local-* skill precedent to commands in three tracked files and two test files, so a git-ignored local command reaches every runtime through the existing generators and never reaches a commit."
trigger_phrases:
  - "local command support"
  - "private local command"
  - "local-* command"
  - "git-ignored command mirrors"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Support git-ignored local-* commands in every runtime

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
An operator who keeps a private command under `.skilled/commands/` breaks this checkout in three ways. `command-catalog-mirror-check.cjs` reports the command as drift because `README.txt` does not list it, which turns `/doctor:runtime-mirrors` red. No ignore rule covers the command or the mirrors the generators derive from it. And the pre-commit guard refuses only `local-*` skills, so one forced add publishes the command. The private-skill work in `specs/sk-code/013-private-surface-skills` solved the same three problems for skills, but not for commands.

### Purpose
A command named `local-*` stays on the operator's machine. It reaches Claude, Cursor, Codex, Pi, Hermes and OpenCode through the generators that already exist, and none of its copies can be staged by accident.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node --test <new catalog test file, run against the HEAD copy of command-catalog-mirror-check.cjs>
✖ a local-* command and namespace missing from every catalog are skipped, not drift (26.641083ms)
ℹ pass 12
ℹ fail 1

$ bash <pre-commit.test.sh with HOOK pointed at the HEAD copy of .skilled/scripts/git-hooks/pre-commit>
pre-commit gates: 136 passed, 9 failed
FAIL  a staged private command is refused: expected rc 1, got 0
FAIL  the refusal never named .skilled/commands/local-probe.md
FAIL  the refusal never named .skilled/commands/assets/local-probe/workflow.yaml
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add seven ignore rules: `/.skilled/commands/local-*`, `/.skilled/commands/assets/local-*`, and the Claude, Cursor, Codex, Pi and Hermes mirror roots, with no trailing slash, so each matches a file, a folder and a symlink.
- Skip a `local-*` root command or command family in `command-catalog-mirror-check.cjs`, the same way it already skips a `local-*` skill's command metadata.
- Refuse a staged `local-*` command, its assets folder and every mirror of it in the pre-commit guard, with no bypass variable, as the skill guard does.
- Add test cases for the skip, the refusal and the boundaries of both.

### Out of Scope
- Any private command's own content - it lives in ignored paths and never enters this packet.
- A change to the mirror generators - they already walk `.skilled/commands` and keep only real files, so a local command reaches every runtime without one.
- An install step for new worktrees - ignored files do not follow a worktree; copying them is the operator's step.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gitignore` | Modify | Seven `local-*` command rules in their own commented section |
| `.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | Modify | Skip a `local-*` root command or namespace |
| `.skilled/commands/doctor/scripts/tests/command-catalog-mirror-check.test.cjs` | Modify | The skip case and a non-local boundary case |
| `.skilled/scripts/git-hooks/pre-commit` | Modify | `PRIVATE_COMMAND_RE` beside the skill pattern |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | Case 82, every command root refused; case 83, a `local-` file inside a family allowed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `local-*` command, its assets folder and its five mirrors are ignored | `git check-ignore -v --no-index` on eight `local-probe` paths exits 0 and names a rule from `.gitignore:250` to `:256` for each |
| REQ-002 | A non-local name is not ignored | `git check-ignore --no-index .skilled/commands/doctor/local-notes.md .skilled/commands/localize.md .codex/prompts/create-local-x.md` exits 1 |
| REQ-003 | The catalog check skips a `local-*` command or family | The catalog test file prints `pass 13` and `fail 0`; against the `HEAD` checker the new case fails |
| REQ-004 | The pre-commit guard refuses a staged `local-*` command and each mirror of it | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` prints `pre-commit gates: 145 passed, 0 failed`; against the `HEAD` hook it prints `136 passed, 9 failed` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A local command reaches every runtime through the existing generators, and every mirror check stays green | With a local command present, each generator writes one mirror and every `--check` that `/doctor:runtime-mirrors` runs exits 0 |
| REQ-006 | The tracked change names no private command | `rg -n -i` for the private name over the five files and this folder prints nothing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The catalog tests print `pass 13` and `fail 0`, and the hook harness prints `pre-commit gates: 145 passed, 0 failed`.
- **SC-002**: With a local command present, `command-catalog-mirror-check.cjs` and all twelve mirror checks exit 0.
- **SC-003**: `git check-ignore -v --no-index` matches every `local-probe` path and none of the non-local boundary paths.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The mirror generators keep only real files and skip `assets/` | A symlinked command would reach OpenCode only | The local command's router must be a real file; the generators already skip `assets/`, so its workflow files stay out of every mirror |
| Risk | The widened guard blocks a legitimate commit | High: every commit that hits it stops | Case 83 pins a `local-` file inside a family as committable, and no tracked path matches the new pattern today |
| Risk | `git commit --no-verify` bypasses the guard | A private command could be published | The same recorded limit as the skill guard; the ignore rules are the first layer |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The guard keeps its `gate:private-skill` label so existing readers of the hook output still match; its message now says "skill or command".
<!-- /ANCHOR:questions -->

---
