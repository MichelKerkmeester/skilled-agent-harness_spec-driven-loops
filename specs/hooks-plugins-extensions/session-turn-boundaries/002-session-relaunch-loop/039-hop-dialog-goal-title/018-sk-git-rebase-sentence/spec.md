---
title: "Feature Specification: Phase 18: sk-git-rebase-sentence"
description: "The sk-git skill says a rebase keeps a Commit-Id when the replayed message still carries one. The commit hook re-mints every id on a pick, and a rebase pick is a pick, so the sentence is false, and the skill changed with no version bump or changelog entry."
trigger_phrases:
  - "sk-git rebase sentence"
  - "phase 18 sk git rebase sentence"
  - "rebase re-mints commit id"
  - "sk-git commit id rebase probe"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: sk-git-rebase-sentence

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | Not chosen yet. The operator picks a worktree or the current branch before the build |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 19 |
| **Predecessor** | 017-missing-transcript-notice |
| **Successor** | 019-relaunch-doc-coverage |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 018-sk-git-rebase-sentence --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the hop dialog, goal and title specification, in the third review round of 2026-11-14.

**Scope Boundary**: The `Commit-Id` paragraph at `.skilled/skills/sk-git/SKILL.md:322`, the skill's version, one new changelog file, a dated note on one acceptance row of phase 9 and a throwaway-repository probe saved under `scratch/`. Documents only. The commit hook and its tests do not change.

**Dependencies**:
- Phase 9 wrote the current sentence and closed its acceptance row AC-004 on a search for the sentence, not on the hook's behavior.
- The probe builds its repository the way `.skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh` does: a fresh `git init`, the allocator copied to the path the hook resolves and `skilled.trustRepoHooks` set.
- The changelog follows sk-doc's `sk-create-changelog` rules: a documentation change is a `patch` bump.

**Deliverables**:
- `scratch/rebase-probe.txt` with the id before and after each probed rebase case.
- A sentence in the sk-git skill that says what the probe showed.
- sk-git at version `1.11.12.0` with a changelog entry for it.
- An answer, or a recorded open question, for the 16 rebase picks that kept their id.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/skills/sk-git/SKILL.md:322` says a rebase keeps an id only when the replayed message still carries one. The `prepare-commit-msg` hook sets its pick flag whenever `CHERRY_PICK_HEAD` exists (`.skilled/scripts/git-hooks/prepare-commit-msg:125`), drops every copied `Commit-Id` line when the flag is set (`:240`) and then requires a fresh id (`:286`). The hook has no rebase branch. The alignment run's probe on git 2.50.1 showed a rebase pick with `CHERRY_PICK_HEAD` set and the id going from `0000002` to `0000004`, and the orchestrator reproduced it. Review FH read the reflog: of 122 rebase picks whose earlier copy carried an id, 106 got a new one and 16 kept theirs, all 16 in one rebase on 2026-11-13 at 20:41, cause unknown. The hook test has no rebase case. The alignment run raised this as P1 (B-01), and both independent reviews confirmed it.

The same edit changed the skill with no version bump and no changelog entry. sk-git is still at `1.11.11.0`, and that changelog file covers worktree provisioning (alignment finding C-1).

### Purpose
The sk-git skill says what the commit hook does to a `Commit-Id` during a rebase, backed by a saved probe, and the change carries a version and a changelog entry.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-14 at commit `99d197475d`. The first command prints the sentence. The second prints the three hook lines that decide the id. The third and fourth show the hook and its test never name a rebase. The last two show the version and the newest changelog file.

```text
$ rg -n -o 'A rebase keeps an id[^.]*' .skilled/skills/sk-git/SKILL.md
322:A rebase keeps an id only when the replayed message still carries one, and a replayed commit whose message lost its id gets a fresh one
exit=0

$ rg -n -o 'git rev-parse -q --verify CHERRY_PICK_HEAD|if \(\( CHERRY_PICK == 1 \)\) && \[\[ "\$line" = Commit-Id:\* \]\]|\(\( CHERRY_PICK == 1 \|\| HAS_COMMIT_ID == 0 \)\)' .skilled/scripts/git-hooks/prepare-commit-msg
125:git rev-parse -q --verify CHERRY_PICK_HEAD
240:if (( CHERRY_PICK == 1 )) && [[ "$line" = Commit-Id:* ]]
286:(( CHERRY_PICK == 1 || HAS_COMMIT_ID == 0 ))
exit=0

$ rg -c -i 'rebase' .skilled/scripts/git-hooks/prepare-commit-msg
exit=1

$ rg -c -i 'rebase' .skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh
exit=1

$ rg -n '^version:' .skilled/skills/sk-git/SKILL.md
6:version: 1.11.11.0
exit=0

$ ls .skilled/skills/sk-git/changelog | sort -V | tail -1
v1.11.11.0.md
exit=0
```

The hook re-mints on `CHERRY_PICK_HEAD` and names no rebase. Neither the hook nor its test mentions a rebase. That git sets `CHERRY_PICK_HEAD` during a rebase pick is shown by the alignment probe, not by a command run here. The probe this phase saves is what confirms it on this machine.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run a throwaway-repository probe with the real hook and save its output to `scratch/rebase-probe.txt`. It records the id before and after four cases: a pick onto a moved base, a leading commit an interactive rebase leaves unchanged, a reworded commit and `git rebase --apply`.
- Rewrite the rebase sentence at `.skilled/skills/sk-git/SKILL.md:322` so it says only what the probe showed.
- Bump the skill to `1.11.12.0` and add `changelog/v1.11.12.0.md` through sk-doc's changelog workflow.
- Read the reflog entries of the rebase on 2026-11-13 at 20:41 and record why its 16 picks kept their id, or record the question as open.
- Add a dated note to the Verification cell of AC-004 in phase 9 saying the sentence it checked was wrong and phase 18 replaces it.

### Out of Scope
- A rebase case in the hook test: the hook does not change, and the existing cherry-pick case (`prepare-commit-msg.test.sh:168` to `:199`) pins the branch a rebase pick takes. A rebase case would only fail if git stopped setting `CHERRY_PICK_HEAD` on a pick, which is git's behavior, and the saved probe records it for this git version. The restraint pass found no change to the hook that would earn it.
- Any change to the hook: the operator asked for the sentence to say what the hook does, not for the hook to keep ids.
- The other `Commit-Id` sentences in the paragraph: the amend and cherry-pick claims are not in any finding. The probe checks the rebase cases only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/SKILL.md` | Modify | The rebase sentence at line 322 and `version: 1.11.12.0` |
| `.skilled/skills/sk-git/changelog/v1.11.12.0.md` | Create | The changelog entry, written through `/create:changelog`. It must exist because sk-git keeps one file per version and the alignment run flagged the missing one |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/acceptance-criteria.md` | Modify | A dated note in the Verification cell of AC-004 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `scratch/rebase-probe.txt` holds, for each of the four cases, the id before, the id after, whether the hook saw `CHERRY_PICK_HEAD` and the git version, from a throwaway repository with the real hook installed. |
| REQ-002 | The rebase sentence at line 322 states the probe's results and nothing the probe did not show. `rg -c 'A rebase keeps an id only when the replayed message still carries one' .skilled/skills/sk-git/SKILL.md` prints nothing with exit 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `.skilled/skills/sk-git/SKILL.md` says `version: 1.11.12.0`, `changelog/v1.11.12.0.md` exists, and `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-git` exits 0. |
| REQ-004 | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-git` and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-git/SKILL.md` exit 0. |
| REQ-005 | The cause of the 16 kept ids is recorded in `goal.md`, or it is written there as an open question with what was checked. |
| REQ-006 | AC-004 of phase 9 carries a dated note naming phase 18, and its status is unchanged. |
| REQ-007 | The commit hook and its test do not change. `git diff --quiet HEAD -- .skilled/scripts/git-hooks` exits 0 at the end of the build. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/rebase-probe.txt` shows four cases, each with an id before and after.
- **SC-002**: The old rebase sentence is gone and the new one matches the probe.
- **SC-003**: `rg -n '^version:' .skilled/skills/sk-git/SKILL.md` prints `6:version: 1.11.12.0` and `ls .skilled/skills/sk-git/changelog/v1.11.12.0.md` exits 0.
- **SC-004**: `validate.sh 018-sk-git-rebase-sentence --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The probe repository finds the allocator at the path the hook resolves | The hook would leave the message unstamped and the probe would show nothing | The probe copies the allocator the way the hook test does, and a case that prints no id stops the build |
| Risk | Git behaves differently on another version or backend | Med | The probe records the git version, and the sentence names the default backend when the cases differ |
| Risk | The reflog check takes long and settles nothing | Low | It is bounded to the one rebase on 2026-11-13 at 20:41, and an unsettled result is written as an open question |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: documents only, no code path changes.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The probe runs in a temporary folder outside the repository and never writes to this repository's git state.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: The sentence is checked against saved probe output, not against a search for the sentence.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a probe case whose commit had no id before shows a fresh id after, and the sentence says nothing beyond that.
- Maximum input: a rebase of many commits behaves as one pick each, so the probe uses two commits.
- Failure path: a probe case that prints no id stops the build, because the hook did not run, and the sentence is not changed on that evidence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One sentence, one version line, one new changelog file and one note |
| Risk | 3/25 | A skill that agents read when they rebase |
| Research | 6/20 | A four-case probe and a bounded reflog check |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Why did 16 picks of the rebase on 2026-11-13 at 20:41 keep their id? Not known. Decision: task T003 reads that rebase's reflog entries. A plausible cause is that git did not replay those commits, because their parent had not changed, so no hook ran. That is inferred and the check confirms or refutes it.
- Does `git rebase --apply` keep ids? Not known. Decision: the probe's fourth case answers it, and the sentence says so only if the probe shows it.
<!-- /ANCHOR:questions -->

---
