---
title: "Feature Specification: Phase 2: worktree-relocation-restore"
description: "Stop the worktree wrapper from pinning the in-checkout default base, warn the doctor when the base sits inside the checkout, and move the existing worktrees out under operator control."
trigger_phrases:
  - "worktree relocation restore"
  - "phase 2 worktree relocation restore"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: worktree-relocation-restore

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-fsmonitor-daemon-lifecycle |
| **Handoff Criteria** | The wrapper and doctor suites pass with their new default-path cases, and the operator has recorded the migration decision in `acceptance-criteria.md`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the fsmonitor daemon leak and worktree relocation regression specification.

**Scope Boundary**: Layer 2 of the fix design in `001-deep-research/research/research.md` (section 6). It changes when the wrapper persists the worktree base, adds one doctor warning, and plans the operator move of the live worktrees. It does not touch the daemon reaper or the hook timeouts.

**Dependencies**:
- `001-deep-research/research/research.md` sections 4.2, 5 (Q1 and Q5), 6 (Layer 2), 7, 10 and 13.
- `scratch/findings.md` section 5 in the parent packet, which records the regression of sk-git/026.
- `specs/sk-git/026-worktree-hygiene-and-relocation/`, which set the base to `~/worktrees/public` and is now undone.

**Deliverables**:
- The write-back guard in `.skilled/bin/worktree-session.sh`, with a log line for the default path.
- The default-path cases in `.skilled/bin/tests/worktree-session.test.sh`.
- The in-checkout check in `checkWorktrees` in `.skilled/commands/doctor/scripts/git-setup-check.cjs`, with its tests.
- An operator-confirmed migration runbook in `tasks.md`, with its rollback in `plan.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The worktrees for this checkout sit under `.worktrees/`, inside the checkout. The research found that the main fsmonitor daemon then watches far more files through `.worktrees/` than through the checkout itself (research.md section 4.2). The wrapper also writes its resolved base into `speckit.worktreeBase` on any launch that lacks `SPECKIT_WORKTREE_BASE` (`.skilled/bin/worktree-session.sh:293-294`), so one launch without the variable pins the in-checkout layout until someone unsets the key.

### Purpose
After this phase, a launch with no explicit base leaves the config key unset, an explicit base still persists, and the doctor reports a base that sits inside the checkout. Existing worktrees move out only after the operator confirms each move.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git config --get speckit.worktreeBase; echo "exit=$?"
exit=1
$ git worktree list --porcelain | grep -c '^worktree .*/\.worktrees/'; echo "exit=$?"
4
exit=0
$ ls -d ~/worktrees/public; echo "exit=$?"
ls: /Users/michelkerkmeester/worktrees/public: No such file or directory
exit=1
```

Re-captured on 2026-10-27 at the start of the build, on `main`. The key is unset, the target folder does not exist, and 4 linked worktrees sit under `.worktrees/`: `145-sk-code-surface-consistency-research`, `217-weak-model-spec-authoring`, `218-ci-efficiency-build` and `231-repo-doc-debt`. The planning capture earlier the same day counted 11, and research.md section 4.2 counted 12. Other sessions removed the rest in between.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stop the wrapper from writing the in-checkout default into `speckit.worktreeBase` when the launch did not set `SPECKIT_WORKTREE_BASE`.
- Keep the write-back for a base set through `SPECKIT_WORKTREE_BASE`, so a reaper started on its own resolves the same folder.
- Add a doctor warning when the resolved base sits inside the checkout and more than three linked worktrees exist.
- Extend the wrapper test with a default-path case and the doctor suite with the new warning cases.
- Move the existing worktrees out of the checkout as an operator-confirmed step with a rollback.

### Out of Scope
- Daemon reaper - phase 003 owns it. This phase stops no fsmonitor daemon, including the daemon of a worktree it moves.
- Hook call timeouts - phase 004 owns them.
- Finding which action unset the key - UNKNOWN. research.md section 10 names the check (a backup of `.git/config`). The fix stops the re-pin, which does not need the cause.
- A `--base` flag - the wrapper has no flag today, so `SPECKIT_WORKTREE_BASE` is the only explicit source. research.md section 6 says "environment variable or a flag". Adding a flag waits until the operator asks for one.
- Turning fsmonitor off - research.md section 5 keeps that as the last resort.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/worktree-session.sh` | Modify | Record where the base came from (lines 219-227). Write the config key only when the source is `SPECKIT_WORKTREE_BASE` and the key is unset (lines 293-295). Log the in-checkout default otherwise. |
| `.skilled/bin/tests/worktree-session.test.sh` | Modify | Keep the env-base case (lines 146-167). Add the default-path case and the empty-variable case. |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | Add the in-checkout DEGRADED result to `checkWorktrees` (lines 677-725). |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modify | Add the in-checkout and outside-checkout cases beside the base tests (lines 1037-1090). |
| `.git/config` of this checkout, key `speckit.worktreeBase` | Operator run only | Set to `~/worktrees/public` after confirmation. Not a repository file. |
| The linked worktrees under `.worktrees/` | Operator run only | Move with `git worktree move`, then repair with `git worktree repair`. Not repository files. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With neither `SPECKIT_WORKTREE_BASE` nor `speckit.worktreeBase` set, a wrapper launch writes no `speckit.worktreeBase` key and still allocates its worktree under the resolved default base. |
| REQ-002 | A launch that falls through to the default base logs one line that names the in-checkout default and the variable that moves it. |
| REQ-003 | A launch with a non-empty `SPECKIT_WORKTREE_BASE` and no config key still persists that value, as the existing env-base case requires. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The doctor `worktrees` row reports DEGRADED when the resolved base sits inside the checkout and more than three linked worktrees exist, and its repair names the config key `speckit.worktreeBase` as the fix. |
| REQ-005 | Existing worktrees move outside the checkout only after the operator confirms each move, with `git worktree move` and `git worktree repair`, and a rollback is recorded before the first move. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/bin/tests/worktree-session.test.sh` prints a summary ending `FAIL=0`, and the default-path case is in that run.
- **SC-002**: `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` prints `# fail 0`, and the in-checkout case reports DEGRADED.
- **SC-003**: After the operator run, `git worktree list --porcelain | grep -c '^worktree .*/\.worktrees/'` prints `0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator confirmation for each worktree move (REQ-005) | Without it, REQ-005 closes only as a user-approved deferral. A deferral needs an ADR in `decision-record.md`, which this phase does not create. | Ask for the confirmation in one message with the worktree list from `tasks.md` T015. Record the answer. |
| Dependency | A same-volume target folder | A cross-volume move copies the tree instead of renaming it, which is slow and risky for a live worktree. | Check the device with `df -P` in `tasks.md` T017 before the first move. |
| Risk | Moving a worktree that a live session uses breaks that session's paths | High | Check for live session markers and confirm each idle worktree with the operator. Move one worktree at a time. |
| Risk | DEGRADED makes the doctor battery exit 3, which a CI caller may read as a failure | Med | Check CI for an exit-code gate on the battery (`tasks.md` T014). DEGRADED stays because the existing status vocabulary has no WARN. |
| Risk | Dropping the default write-back changes what a reaper started on its own resolves | Low | Both resolve the same default `.worktrees`. The env-base case still persists the explicit choice (REQ-003). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The doctor adds at most one `git worktree list --porcelain` call to the `worktrees` check. The check reads no index.
- **NFR-P02**: On the default path the wrapper makes one fewer `git config` call than today, because the source check runs before the config read at the write-back.

### Security
- **NFR-S01**: The doctor stays read-only. The battery route forbids config writes and worktree provisioning (`.skilled/commands/doctor/assets/doctor-git-setup.yaml`, line 28).
- **NFR-S02**: No script runs the migration. The operator runs each command in `tasks.md` T015 to T020, one at a time.

### Reliability
- **NFR-R01**: The config write stays non-fatal (`worktree-session.sh:294`, `|| true`). A failed write never fails a launch.
- **NFR-R02**: After `git worktree repair`, `git worktree list --porcelain` lists every moved path, and each moved worktree keeps its branch.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `SPECKIT_WORKTREE_BASE=""` counts as unset. The launch writes no config key and logs the in-checkout default.
- Maximum input: 4 linked worktrees at the start of the build, 12 at the research peak. The doctor reports one DEGRADED row for the base, not one row per worktree.
- Failure path: a config write that fails (for example, a read-only `.git/config`) leaves the key unset. The launch still succeeds, as it does today.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two shell or script files, two test files, and one operator-run move of 11 worktrees. |
| Risk | 16/25 | The move touches live worktrees and one shared config key. Rollback exists but does not undo what a session saw. |
| Research | 6/20 | The fix design is in `001-deep-research`. The unset action stays UNKNOWN. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Answered: "more than three linked worktrees" is the trigger for REQ-004. The operator confirmed it on 2026-10-27.
- Decision: no `--base` flag in this phase. `SPECKIT_WORKTREE_BASE` is the only explicit source. research.md section 6 names "environment variable or a flag", so that line needs the amendment below.
- Amendment to research.md section 6, Layer 2: `.skilled/bin/tests/worktree-session.test.sh` asserts persistence only in the env-base case (lines 146-167). That case stays, because the env base is explicit. The default path has no assertion today, so this phase adds a negative one. The research text says the test "asserts the write-back", which is true only for the env case.
- Answered 2026-10-27 (`tasks.md` T014): no CI step gates on the doctor battery's exit code. `grep -rln 'git-setup-check' .github` finds nothing.
- Closed as UNKNOWN: which action unset `speckit.worktreeBase`. It cannot be recovered from disk: the key is unversioned local config, and no shell history line or `.git/config` backup names it. The guard at `.skilled/bin/worktree-session.sh:314-315` prevents a repeat.
- Decided 2026-10-27: worktree 217 is not moved. Its session is live and its branch is unmerged, so AC-006 closes when each worktree is moved, or removed by the reaper after it merges. With `core.fsmonitor=false` kept in this checkout (`../005-reaper-hardening/spec.md` section 10), no main daemon watches 217 meanwhile.
<!-- /ANCHOR:questions -->

---
