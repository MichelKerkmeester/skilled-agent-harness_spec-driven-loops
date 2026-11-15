---
title: "Goal: Phase 18: sk-git-rebase-sentence"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "sk-git rebase sentence goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence"
    last_updated_at: "2026-11-14T13:30:00Z"
    last_updated_by: "documentation-agent"
    recent_action: "Recorded fix commit 21ceaa9772 (Commit-Id 0014041) and its scoped file list"
    next_safe_action: "The operator decides the merge"
    blockers: []
    key_files: [".skilled/skills/sk-git/SKILL.md", ".skilled/skills/sk-git/changelog/v1.11.12.0.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-sk-git-rebase-sentence"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which backend the 2026-11-13 20:41 rebase used is not recorded. The apply backend reproduces the kept ids."
    answered_questions:
      - "Did the 16 kept ids come from commits git did not replay? No. The minute holds 16 reflog lines, not 16 commits. 13 replayed picks kept their ids and 2549786f28 was not replayed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 18: sk-git-rebase-sentence

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The sk-git skill says what the commit hook does to a `Commit-Id` during a rebase, backed by a saved throwaway-repository probe, and the change ships as sk-git `1.11.12.0` with its changelog entry.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The sentence is written from `scratch/rebase-probe.txt` and claims nothing the probe did not show. |
| D2 | The commit hook and its test do not change. No rebase case is added to the hook test, because the hook does not change and its cherry-pick case pins the branch a rebase pick takes. |
| D3 | A documentation fix is a `patch` bump under sk-doc's changelog rules: `1.11.11.0` becomes `1.11.12.0`, written through `/create:changelog`. |
| D4 | The probe writes git state only in its own temporary repository. The reflog read is read-only. |
| D5 | A document child, as children 009 and 014 are. No code changes, so parent D1's failing-first test does not apply, and the probe is the evidence. |
| D6 | Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/rebase-probe.txt` holds four blocks, a pick onto a moved base, an unchanged leading commit, a reword and `git rebase --apply`, each with the git version, the id before, the `CHERRY_PICK_HEAD` state and the id after. Observed 2026-11-14 on git 2.50.1: the four `CASE:` blocks print `0000502` to `0000503`, `0000601` to itself, `0000701` to itself and `0000802` to itself.
- [x] `rg -c 'A rebase keeps an id only when the replayed message still carries one' .skilled/skills/sk-git/SKILL.md` prints nothing with exit 1. Observed: exit 1 with no output.
- [x] `rg -n '^version:' .skilled/skills/sk-git/SKILL.md` prints `6:version: 1.11.12.0` and `ls .skilled/skills/sk-git/changelog/v1.11.12.0.md` exits 0. Observed: both.
- [x] `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-git` and `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-git` both exit 0. Observed: `78 files | ok=78` and `PASS`, both exit 0.
- [x] `git diff --quiet HEAD -- .skilled/scripts/git-hooks` exits 0. Observed: exit 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence --strict` prints `RESULT: PASSED`. Observed 2026-11-14: `RESULT: PASSED`, Errors 0, Warnings 0, exit 0. `scratch/validate.txt` holds the run.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Review findings | Done | 2026-11-14. Alignment run B-01, P1: the rebase sentence is false, with a probe that showed `0000002` become `0000004`, which the orchestrator reproduced. Alignment run C-1, P2: no version bump or changelog entry. Both independent reviews confirmed B-01, and review FH read 106 of 122 rebase picks re-minted and 16 kept |
| Code read | Done | 2026-11-14 at `99d197475d`: the hook re-mints on `CHERRY_PICK_HEAD` at lines 125, 240 and 286 and never names a rebase, and its test has no rebase case. The output is quoted in `spec.md` Measured Behavior |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written. `implementation-summary.md` is written after the build |
| Evidence | Done | `scratch/red.txt` records 5 failing checks with exit 1 before the edit. `scratch/green.txt` records 10 of 10 passing with exit 0 after it. `scratch/verification.txt` records the version, package, document and hook checks |
| Build | Done | 2026-11-14: tasks T001 to T012 and T014 ran. The probe saved four cases on git 2.50.1, the sentence and version changed, the changelog entry exists, and the checks passed |
| Fix commit | Done | 2026-11-14: `21ceaa9772`, Commit-Id 0014041. It changes `.skilled/skills/sk-git/SKILL.md`, adds `.skilled/skills/sk-git/changelog/v1.11.12.0.md`, edits the phase 9 acceptance row and its graph metadata, and carries this child's records. The changelog is the one new file outside the child. The new sentence was split at its semicolon into two sentences before the commit. Hooks unchanged. `frontmatter-version.mjs verify` printed 78 of 78 ok, the skill package check printed `PASS`, and the sentence check printed 10 of 10 |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| No hook test | The brief asked the restraint pass to decide whether a rebase case in the hook test is earned. It is not: the hook does not change, its cherry-pick case pins the same branch, and a rebase case would test git's behavior, which the saved probe records for this version |
| Phase 9 row | AC-004 of phase 9 was Met on a search for the sentence, not on the hook. It keeps its status and gains a dated note, because the criterion as written was met and the sentence it checked was wrong |
| 16 kept ids | Open, with the check done. `scratch/reflog-2041.txt` lists the 16 reflog lines of the 2026-11-13 20:41 rebase: one start, 13 picks and two finish lines. All 13 replayed picks kept their id while their hashes changed, and 2549786f28 was not replayed. The count 16 names reflog lines, not commits. Which backend that rebase used is not recorded, and the probe's `--apply` case reproduces the kept ids |
| Sentence claims | The new sentence maps to the probe. A moved-base pick re-mints because `CHERRY_PICK_HEAD` is set (case 1). A reword keeps the id because the hook runs with `source=commit` and no `CHERRY_PICK_HEAD` (case 3). A commit the rebase leaves in place keeps it because no hook runs (case 2). `git rebase --apply` keeps it because no hook runs (case 4). The repository asks for ids in every case through `skilled.trustRepoHooks true` and the copied allocator |
| Phase 9 metadata | The dated note changes `009-document-corrections/acceptance-criteria.md`, so that folder's `graph-metadata.json` fingerprint went stale. The fix commit `21ceaa9772` repairs it in the same change, and no other edit was made there |
<!-- /ANCHOR:log -->
