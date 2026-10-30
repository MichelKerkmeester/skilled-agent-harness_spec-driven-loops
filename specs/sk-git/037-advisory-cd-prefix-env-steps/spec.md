---
title: "Feature Specification: Teach the git preflight advisory that environment assignments between cd and git keep the cd"
description: "A shell that exports a variable between `cd <dir> &&` and the git command lost the cd, so the advisory resolved the pathspec against the session checkout and warned that files in the target worktree matched nothing. The cd now survives an assignment-only step, and any other command in that position still breaks the chain."
trigger_phrases:
  - "advisory cd prefix env steps"
  - "environment step between cd and git"
  - "export between cd and git"
  - "false add-pathspec-matches-nothing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Teach the git preflight advisory that environment assignments between cd and git keep the cd

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/299-advisory-cd-prefix-env` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The preflight advisory resolves the directory a git command runs in, so a command typed against a worktree is judged by that worktree's state. Its `cd <dir> && git ...` pattern demanded the git word immediately after the `&&`, and a shell that exports a variable in between lost the cd entirely. The pathspec was then resolved against the session checkout, and `add-pathspec-matches-nothing` warned about files that were sitting in the target worktree, which trains the reader to ignore the advisory.

### Purpose
A cd that reaches the git command through an assignment-only environment step resolves the command in that directory, and every other command between the two still leaves the directory unproven.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Three shell shapes, checked against the pattern as it stood at HEAD and again after the change. `true` means the cd was recognised, so the pathspec resolved in the target directory.
```text
$ git show HEAD:.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs | node -e '...re.test(...)...'
"cd /wt && export A=1 B=2 C=3; git add f1" -> false
"cd /wt && export A=1 && git add f1" -> false
"cd /wt && A=1; git add f1" -> true

$ cat .skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs | node -e '...re.test(...)...'
"cd /wt && export A=1 B=2 C=3; git add f1" -> true
"cd /wt && export A=1 && git add f1" -> true
"cd /wt && A=1; git add f1" -> true
"cd /wt && echo hi; git add f1" -> false
```
The two `export` shapes were the defect. The bare assignment already worked, because the older pattern absorbed the `;` into the value, and it is kept in the test so a later tightening cannot drop it. The last line is the shape that must stay unrecognised.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend the cd pattern in the preflight rule checks so zero or more assignment-only steps may sit between `cd <dir> &&` and the git invocation, each step optionally behind `export` and closed by `;` or `&&`.
- Assert the three recognised shapes and one rejected shape in the test that already covers the effective directory, beside the existing `cd` and `-C` cases.
- Bump the skill version and add its changelog entry.

### Out of Scope
- Recognising any other command between the cd and the git command - an unread step leaves the directory unproven, and guessing would produce advisories about commands the operator did not type.
- Parsing shell redirection, subshells or command substitution around the cd - those shapes still keep the directory unknown and the checks stay silent.
- Changing any other advisory rule or its severity.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs` | Modify | Allow assignment-only steps between the cd and the git word, and say in the comment why an assignment does not move the directory |
| `.skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` | Modify | Four assertions beside the existing cd case |
| `.skilled/skills/sk-git/SKILL.md` | Modify | Version frontmatter to 1.11.7.0 |
| `.skilled/skills/sk-git/changelog/v1.11.7.0.md` | Create | Release note for the change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An assignment-only step between `cd <dir> &&` and the git word keeps the cd, with or without a leading `export`, and whether the step closes with `;` or `&&`. | The three shapes in Measured Behavior report no advisory, and `node --test .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` exits 0. |
| REQ-002 | Any other command between the cd and the git word still keeps the cd from counting. | `cd <worktree> && echo hi; git add <paths only in that worktree>` reports the advisory when the session checkout lacks those paths. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The skill release carries the change. | `version: 1.11.7.0` in `SKILL.md` frontmatter and `changelog/v1.11.7.0.md` present. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three assignment shapes yield no advisory and the non-assignment shape still warns, in one test file.
- **SC-002**: Every `*.test.mjs` under the skill's `scripts/lib/` and `scripts/hooks/` passes.
- **SC-003**: The packet passes `validate.sh --strict` with `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The test fixtures need a linked worktree whose contents differ from the session checkout | A fixture that shares state cannot tell the two directories apart, so the assertion proves nothing | The test builds a primary checkout plus a worktree and puts the files only in the worktree |
| Risk | A pattern loose enough to swallow one more command silently disables the directory resolution | The advisory would miss a real pathspec mismatch in a directory it never read | Each step must be assignments alone and closed by `;` or `&&`, and a rejected shape is asserted in the same test |
| Risk | Backtracking on a long chain of assignments | A slow advisory slows every git command the hook inspects | The pattern is anchored to a literal `cd` and a literal `git`, so no match is attempted without both |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
