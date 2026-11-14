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

- [x] T001 Confirm the three hook lines that decide the id and that the hook and its test name no rebase (`HOOK`). Verify: the second, third and fourth commands of `spec.md` Measured Behavior print lines 125, 240 and 286, then nothing with exit 1 twice. Observed 2026-11-14: lines 125, 240 and 286 printed, and both rebase searches exited 1 with no output.
- [x] T002 List every sk-git document line that speaks of a rebase and an id (`SKG`). Verify: `rg -n -i 'rebase' .skilled/skills/sk-git --glob '*.md'` output is saved to `PHASE/scratch/rebase-lines.txt`, and each line that claims a rebase keeps an id is named in `goal.md`. Observed: `scratch/rebase-lines.txt` holds 87 lines, and only `SKILL.md:322` claimed a rebase keeps an id, so no other line needed the same edit.
- [x] T003 Read the reflog entries of the rebase on 2026-11-13 at 20:41 and check whether its 16 kept ids came from commits git did not replay (`.git`, read-only). Verify: `git reflog --date=iso` lines for that rebase are saved to `PHASE/scratch/reflog-2041.txt`, and `goal.md` records the cause or the open question with what was checked. Observed: the extract holds the 16 minute lines, 13 replayed picks kept their ids while their hashes changed, and 2549786f28 was not replayed. The backend is recorded as an open question.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the probe script from the setup of `prepare-commit-msg.test.sh`, with the four cases a pick onto a moved base, an unchanged leading commit in an interactive rebase, a reworded commit and `git rebase --apply` (`PHASE/scratch/rebase-probe.sh`). Verify: `bash -n` on the script exits 0. Observed: `bash -n` exited 0.
- [x] T005 Run the probe (`PHASE/scratch/rebase-probe.txt`). Verify: `bash PHASE/scratch/rebase-probe.sh > PHASE/scratch/rebase-probe.txt 2>&1` exits 0, and the file holds four blocks, each with the git version, the id before, the `CHERRY_PICK_HEAD` state and the id after. A block with no id stops the build. Observed: probe exit 0, git 2.50.1, four `CASE:` blocks, each with an id before and after.
- [x] T006 Rewrite the rebase sentence from the probe output (`SKG/SKILL.md`). Verify: `rg -c 'A rebase keeps an id only when the replayed message still carries one' .skilled/skills/sk-git/SKILL.md` prints nothing with exit 1, and each claim of the new sentence names a case of `scratch/rebase-probe.txt` in `goal.md`. Observed: the search exited 1 with no output, and `goal.md` maps each claim to a case.
- [x] T007 Bump the skill version (`SKG/SKILL.md`). Verify: `rg -n '^version:' .skilled/skills/sk-git/SKILL.md` prints `6:version: 1.11.12.0`. Observed: printed `6:version: 1.11.12.0`.
- [x] T008 Write the changelog entry through `/create:changelog` (`SKG/changelog/v1.11.12.0.md`). Verify: `ls .skilled/skills/sk-git/changelog/v1.11.12.0.md` exits 0 and `rg -c '1.11.12.0' .skilled/skills/sk-git/changelog/v1.11.12.0.md` prints 1 or more. Observed: `ls` exited 0, `rg -c` printed 5, and the shape check and HVR scan passed.
- [x] T009 Add a dated note to the Verification cell of AC-004 of phase 9 (`../009-document-corrections/acceptance-criteria.md`). Verify: `rg -c 'phase 18' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/acceptance-criteria.md` prints 1 or more and the row's status is still `Met`. Observed: `rg -c` printed 1 and the row stays `Met`.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the version check (`SKG`). Verify: `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-git` exits 0. Observed: `[verify] 78 files | ok=78`, exit 0.
- [x] T011 Run the skill package and document checks (`SKG`). Verify: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-git` and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-git/SKILL.md` both exit 0. Observed: the package check printed `PASS` with exit 0 and the document check printed `VALID` with 0 issues and exit 0.
- [x] T012 Confirm the hook and its test did not change (`.skilled/scripts/git-hooks`). Verify: `git diff --quiet HEAD -- .skilled/scripts/git-hooks` exits 0. Observed: exit 0.
- [ ] T013 Check the commit (`FIX`). Verify: `git show --stat FIX` lists `SKILL.md`, the new changelog file and the phase 9 criteria file, and `git show FIX | rg -c '^new file'` prints 1. Deferred to the orchestrator: the fix commit does not exist in this build.
- [x] T014 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence --strict` prints `RESULT: PASSED`. Observed: `RESULT: PASSED`, Errors 0, Warnings 0, exit 0. `scratch/validate.txt` holds the run.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`: T001 to T012 and T014 are done, and T013 is the orchestrator's after the fix commit.
- [x] No `[B]` blocked tasks remaining: no task carries `[B]`.
- [x] Manual verification passed: the new sentence was read against `scratch/rebase-probe.txt`, and each claim matches one of its four cases.
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

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 7. Observed: printed 7.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1. Observed: printed 1.
- [x] CHK-003 [P1] Every sk-git line on a rebase is listed before the edit (T002). Observed: `scratch/rebase-lines.txt` holds 87 lines, and only `SKILL.md:322` claimed a rebase keeps an id.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No code file changes: `git show --stat FIX` lists Markdown files only. Deferred with T013; the working tree diff lists Markdown files only.
- [x] CHK-011 [P0] The probe script parses and runs outside this repository's git state (T004, T005). Observed: `bash -n` exited 0, the probe exited 0, and every git write ran under `scratch/probe.*`.
- [x] CHK-012 [P1] The new sentence makes no claim the probe did not show. Observed: `goal.md` maps the pick, reword, unreplayed and `--apply` claims to the four probe cases.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their evidence. Observed: `scratch/red.txt` records the five failing checks before the edit and `scratch/green.txt` records 10 of 10 passing after it.
- [x] CHK-021 [P0] Each of the four probe cases printed an id before and after. Observed: the four blocks print `0000502` to `0000503`, `0000601` to itself, `0000701` to itself and `0000802` to itself.
- [x] CHK-022 [P1] The hook test is unchanged, and the reason no rebase case was added is in `spec.md`. Observed: `git diff --quiet HEAD -- .skilled/scripts/git-hooks` exited 0, and `spec.md` Out of Scope carries the reason.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `class-of-bug` within sk-git: every sk-git line that claims a rebase keeps an id is found in T002. Observed: `scratch/rebase-lines.txt` finds one such line, `SKILL.md:322`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n -i 'rebase' .skilled/skills/sk-git --glob '*.md'` saved in `scratch/rebase-lines.txt`. Observed: the file holds 87 lines.
- [x] CHK-FIX-003 [P0] Consumer inventory: N/A, agents read the sentence and no code parses it. Observed: no code path reads `SKILL.md`.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. Observed: the change is one Markdown sentence, one version line, one changelog file and one note.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: rebase kind crossed with id outcome, one probe case each. Observed: the four cases cover a moved-base pick, an unreplayed leading commit, a reword and `--apply`.
- [x] CHK-FIX-006 [P1] The probe records the git version it ran on. Observed: every block prints `git version: 2.50.1`.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4. Deferred with T013; the scoped diff is named in `goal.md` section 4 and the fix commit is the orchestrator's.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the probe uses a test identity and `GIT_CONFIG_GLOBAL=/dev/null`, as the hook test does. Observed: the probe exports `probe@example.com` and `/dev/null`, and no real config is read.
- [x] CHK-031 [P0] No git write reaches this repository. Observed: every git write runs in `mktemp -d` under `scratch/`, and the reflog read left the shared git dir unchanged.
- [x] CHK-032 [P1] N/A: no auth surface. Observed: no auth path is touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the probe and the four cases. Observed: each file names the four cases.
- [x] CHK-041 [P1] The changelog entry names the corrected sentence and nothing else changed in the skill. Observed: `changelog/v1.11.12.0.md` names the rebase rule and the version line is the only other skill edit.
- [x] CHK-042 [P2] AC-004 of phase 9 carries the dated note (T009). Observed: the cell ends with `2026-11-14: the sentence this checked was wrong, and phase 18 replaces it with the hook's real condition` and the status is still `Met`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The probe script, its output, the rebase lines and the reflog extract live under `scratch/` only. Observed: `scratch/` holds `rebase-probe.sh`, `rebase-probe.txt`, `rebase-lines.txt`, `reflog-2041.txt`, `rebase-sentence-check.sh`, `red.txt`, `green.txt` and `verification.txt`.
- [x] CHK-051 [P1] The probe removes its temporary repository on exit. Observed: `trap 'rm -rf "$TMP"' EXIT` and no `scratch/probe.*` folder remains.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 11 | 10/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14. The two open items are `CHK-010` and `CHK-FIX-007`, both deferred to the orchestrator's fix commit (T013).
<!-- /ANCHOR:summary -->

---
