---
title: "Tasks: Phase 18: sk-git-rebase-sentence"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk-git rebase sentence tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: sk-git-rebase-sentence

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Task variables**: `SKG` is `.skilled/skills/sk-git`. `HOOK` is `.skilled/scripts/git-hooks/prepare-commit-msg`. `PHASE` is this phase folder. `FIX` is the commit that lands this phase.

**Git boundary**: the probe runs every git write inside its own `mktemp -d` repository. Nothing in this phase writes to this repository's git state, and the reflog read in T003 is read-only.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the three hook lines that decide the id and that the hook and its test name no rebase (`HOOK`). Verify: the second, third and fourth commands of `spec.md` Measured Behavior print lines 125, 240 and 286, then nothing with exit 1 twice.
- [ ] T002 List every sk-git document line that speaks of a rebase and an id (`SKG`). Verify: `rg -n -i 'rebase' .skilled/skills/sk-git --glob '*.md'` output is saved to `PHASE/scratch/rebase-lines.txt`, and each line that claims a rebase keeps an id is named in `goal.md`.
- [ ] T003 Read the reflog entries of the rebase on 2026-11-13 at 20:41 and check whether its 16 kept ids came from commits git did not replay (`.git`, read-only). Verify: `git reflog --date=iso` lines for that rebase are saved to `PHASE/scratch/reflog-2041.txt`, and `goal.md` records the cause or the open question with what was checked.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the probe script from the setup of `prepare-commit-msg.test.sh`, with the four cases a pick onto a moved base, an unchanged leading commit in an interactive rebase, a reworded commit and `git rebase --apply` (`PHASE/scratch/rebase-probe.sh`). Verify: `bash -n` on the script exits 0.
- [ ] T005 Run the probe (`PHASE/scratch/rebase-probe.txt`). Verify: `bash PHASE/scratch/rebase-probe.sh > PHASE/scratch/rebase-probe.txt 2>&1` exits 0, and the file holds four blocks, each with the git version, the id before, the `CHERRY_PICK_HEAD` state and the id after. A block with no id stops the build.
- [ ] T006 Rewrite the rebase sentence from the probe output (`SKG/SKILL.md`). Verify: `rg -c 'A rebase keeps an id only when the replayed message still carries one' .skilled/skills/sk-git/SKILL.md` prints nothing with exit 1, and each claim of the new sentence names a case of `scratch/rebase-probe.txt` in `goal.md`.
- [ ] T007 Bump the skill version (`SKG/SKILL.md`). Verify: `rg -n '^version:' .skilled/skills/sk-git/SKILL.md` prints `6:version: 1.11.12.0`.
- [ ] T008 Write the changelog entry through `/create:changelog` (`SKG/changelog/v1.11.12.0.md`). Verify: `ls .skilled/skills/sk-git/changelog/v1.11.12.0.md` exits 0 and `rg -c '1.11.12.0' .skilled/skills/sk-git/changelog/v1.11.12.0.md` prints 1 or more.
- [ ] T009 Add a dated note to the Verification cell of AC-004 of phase 9 (`../009-document-corrections/acceptance-criteria.md`). Verify: `rg -c 'phase 18' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/acceptance-criteria.md` prints 1 or more and the row's status is still `Met`.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the version check (`SKG`). Verify: `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-git` exits 0.
- [ ] T011 Run the skill package and document checks (`SKG`). Verify: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-git` and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-git/SKILL.md` both exit 0.
- [ ] T012 Confirm the hook and its test did not change (`.skilled/scripts/git-hooks`). Verify: `git diff --quiet HEAD -- .skilled/scripts/git-hooks` exits 0.
- [ ] T013 Check the commit (`FIX`). Verify: `git show --stat FIX` lists `SKILL.md`, the new changelog file and the phase 9 criteria file, and `git show FIX | rg -c '^new file'` prints 1.
- [ ] T014 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the new sentence was read against `scratch/rebase-probe.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The sentence this replaces**: `../009-document-corrections/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T005 blocks T006, because the sentence is written only from the probe output.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 7.
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1.
- [ ] CHK-003 [P1] Every sk-git line on a rebase is listed before the edit (T002).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No code file changes: `git show --stat FIX` lists Markdown files only.
- [ ] CHK-011 [P0] The probe script parses and runs outside this repository's git state (T004, T005).
- [ ] CHK-012 [P1] The new sentence makes no claim the probe did not show.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 and AC-002 pass with their evidence.
- [ ] CHK-021 [P0] Each of the four probe cases printed an id before and after.
- [ ] CHK-022 [P1] The hook test is unchanged, and the reason no rebase case was added is in `spec.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `class-of-bug` within sk-git: every sk-git line that claims a rebase keeps an id is found in T002.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n -i 'rebase' .skilled/skills/sk-git --glob '*.md'` saved in `scratch/rebase-lines.txt`.
- [ ] CHK-FIX-003 [P0] Consumer inventory: N/A, agents read the sentence and no code parses it.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md: rebase kind crossed with id outcome, one probe case each.
- [ ] CHK-FIX-006 [P1] The probe records the git version it ran on.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets: the probe uses a test identity and `GIT_CONFIG_GLOBAL=/dev/null`, as the hook test does.
- [ ] CHK-031 [P0] No git write reaches this repository.
- [ ] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the probe and the four cases.
- [ ] CHK-041 [P1] The changelog entry names the corrected sentence and nothing else changed in the skill.
- [ ] CHK-042 [P2] AC-004 of phase 9 carries the dated note (T009).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The probe script, its output, the rebase lines and the reflog extract live under `scratch/` only.
- [ ] CHK-051 [P1] The probe removes its temporary repository on exit.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified. The build fills this in.
<!-- /ANCHOR:summary -->

---
