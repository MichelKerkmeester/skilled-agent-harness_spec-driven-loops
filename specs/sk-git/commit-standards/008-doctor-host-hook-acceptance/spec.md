---
title: "Feature Specification: Let the doctor git check accept a hand-over hook and a hook the host declares omitted"
description: "The doctor git battery accepts an installed hook only when its real path is a hook source, and it reports every absent hook source as not installed. A host that vendors Skilled installs small hooks of its own that hand over to Skilled's and leaves out post-commit on purpose, so its hooks row fails. A marker line and a local config key let the row accept both."
trigger_phrases:
  - "doctor host hook acceptance"
  - "let the doctor git check accept a hand"
  - "skilled-hook-handover"
  - "skilled.omitHook"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Let the doctor git check accept a hand-over hook and a hook the host declares omitted

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/368-host-tree-portability-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`checkHooks` in `.skilled/commands/doctor/scripts/git-setup-check.cjs` accepts an installed hook only when its real path equals a hook source file, and it reports `<name>: not installed` for every hook source name missing from the hooks folder. Barter vendors Skilled and installs hand-over hooks: small host-owned files that end in `exec bash "$SKILLED_HOOK" "$@"`, so their real path is the host file and the row prints `resolves to <path>, not a hook source`. Barter also installs no `post-commit` on purpose, so the row fails a second time on a hook the host chose to leave out. These Barter facts come from the operator's brief and were not rerun here.

### Purpose
A host can mark a hand-over hook and declare an omitted hook, and the hooks row then passes and names both, while a repository with neither marker nor declaration gets exactly today's verdict.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/doctor/scripts/git-setup-check.cjs
FAIL     hooks
      source: git rev-parse --git-path hooks + hook links
      commit-msg: resolves to /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/scripts/git-hooks/commit-msg, not a hook source
      post-commit: resolves to /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/scripts/git-hooks/post-commit, not a hook source
      post-merge: resolves to /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/scripts/git-hooks/post-merge, not a hook source
      post-rewrite: resolves to /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/scripts/git-hooks/post-rewrite, not a hook source
      pre-commit: resolves to /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/scripts/git-hooks/pre-commit, not a hook source
      pre-push: resolves to /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/scripts/git-hooks/pre-push, not a hook source
      prepare-commit-msg: resolves to /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/scripts/git-hooks/prepare-commit-msg, not a hook source
      repair: bash /Users/michelkerkmeester/worktrees/public/368-host-tree-portability-fixes/.skilled/scripts/install-git-hooks.sh
STATUS=FAIL failed=1 degraded=0 skipped=0 unknown=0
exit=1

$ node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs
tests 80
pass 80
fail 0
```

The run above was taken in this worktree, whose installed hooks link to the main checkout's hook sources, and only its hooks row and status line are shown. The other ten rows printed PASS.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept an installed hook whose real path is not a hook source when its body holds exactly one `# skilled-hook-handover: <dir>` line and an `exec`, and `<dir>/<name>` under the hook's real folder resolves to an accepted hook source.
- Treat an absent hook as not missing when its name is a value of the local multi-value key `skilled.omitHook`.
- Name each accepted hand-over hook and each omitted hook in the details of a passing hooks row.
- Add three cases to `git-setup-check.test.cjs` for a valid hand-over, a marker that points at a non-source and an omitted `post-commit` with and without its declaration.

### Out of Scope
- A host `pre-commit` that replaces Skilled's hook and never hands over - Barter's does, so its row still fails on that one hook until the host decides how to hand over.
- Any change in Barter, including adding the marker line to its hand-over hooks - Barter is a separate repository and owns its own hooks.
- The hooks of the 13 linked project repositories - each needs its own reading before anything is declared for it.
- An operator doc entry for the marker and the key - no list of `skilled.trustRepoHooks` style keys exists in the doctor command docs or the sk-git references, so there is no list to add to.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | Add `handoverTarget` and `omittedHooks`, use them in `checkHooks` and extend its header comment |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modify | Add the `linkOwnHooks` helper and three hooks cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A hand-over hook with a valid marker passes the hooks row | The new case `hooks accepts a host hook that hands over to a hook source through its marker line` passes and the row details hold `pre-commit: hands over to <source real path>` |
| REQ-002 | A marker that points at a folder without the hook source keeps today's failure | The new case `hooks refuses a marker line that points at a folder without the hook source` passes with the detail `pre-commit: resolves to <hook real path>, not a hook source` |
| REQ-003 | An absent hook declared in `skilled.omitHook` passes, and the same hook without the declaration still fails | The new case `hooks passes a hook the local config declares omitted and fails it without the declaration` passes |
| REQ-004 | A repository with no marker and no key gets today's verdict | `node .skilled/commands/doctor/scripts/git-setup-check.cjs` in this worktree prints the same hooks row and the same `STATUS=FAIL failed=1` line as the Measured Behavior block |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The battery suite passes with the new cases | `node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` reports `tests 83` and `fail 0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The battery suite reports 83 tests and `fail 0`, against a baseline of 80 tests that all pass.
- **SC-002**: The hooks row this worktree prints after the change matches the Measured Behavior block line for line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git config --local --get-all` | Without it the omitted set cannot be read and a declared hook still fails | It exits 1 with empty output when the key is absent, and the reader treats any non-zero exit as an empty set |
| Risk | A marker could let any host file pass as a hook | Med | The marker is accepted only when its folder resolves to a real path already in `accepted` and the body holds an `exec`, so it can only point at the same sources a link would |
| Risk | A host marks a hook that hands over but drops its arguments or exit code | Low | The row checks the hand-over shape, not its behavior. The hook's own commit run is where a broken hand-over shows |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What if a file holds two marker lines? Decision: it is not accepted, so the hand-over folder is never ambiguous.
- Does the word `exec` inside the marker's own path count? Decision: no, the body is checked with the marker line removed.
- `.skilled/commands/doctor/assets/doctor-git-setup.yaml` line 49 describes the hooks row as "every shipped hook is installed, resolves to this repository's or this checkout's hook source and is executable". After this change that sentence leaves out the hand-over and the omitted hook. The brief allows a doc entry only in a key list, so the sentence is left as it is until the operator says whether to extend it.
<!-- /ANCHOR:questions -->

---
