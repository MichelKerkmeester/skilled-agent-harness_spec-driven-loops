---
title: "Tasks: Phase 4: trigger-index-rebuild-hardening"
description: "The task list for Phase 4: trigger-index-rebuild-hardening, each task naming its file. The five build tasks are done and checked locally. The four verification tasks wait on a live run on GitHub."
trigger_phrases:
  - "trigger index rebuild hardening tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: trigger-index-rebuild-hardening

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Implementation

- [x] T001 [P0] Replace the subject-prefix loop guard (line 24) with an exact subject match or a marker trailer the commit step writes (`.github/workflows/trigger-index-rebuild.yml`). Done: the job `if:` is now `!endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci')` and both rebuild commits end with that trailer. Review round 1 changed `contains` to `endsWith`, so a human commit that only quotes the trailer in its body still runs. `startsWith` is gone
- [x] T003 [P0] Stage all four generator files and add a post-commit `--check` (lines 53-61) (`.github/workflows/trigger-index-rebuild.yml`). Done: a `FILES` array names the index and the three sidecars, the diff test and `git add` use it, and `generate-trigger-index.mjs --check` runs after the commit and before the push. Review round 1 added a presence check of all four files before staging, because `--check` reads the index alone
- [x] T004 [P0] On non-fast-forward: fetch, rebase to the tip, regenerate the index, run `--check`, then retry the push once (line 64) (`.github/workflows/trigger-index-rebuild.yml`). Done differently from the wording: the retry fetches the branch, resets to `origin/<branch>` with `git reset --hard` and does not rebase, then regenerates, runs `--check`, re-checks the four files, commits only if they differ from the tip and pushes once. The rejected commit holds only regenerated output, so a rebase would stop on a conflict whenever the new tip regenerated the same files (review round 1, accepted). The intent is unchanged: the pushed index is built on the tip it lands on and passes its own check
- [x] T005 [P0] Add distinct error messages for non-fast-forward vs auth vs other failures (line 65) (`.github/workflows/trigger-index-rebuild.yml`). Done: `classify_push_failure` sorts the push output into non-fast-forward, authentication or ruleset, and other, and `report_push_failure` prints a different `::error::` for each. Review round 1 dropped the bare `remote rejected` pattern and added `GH006` and `protected branch`. Six sample push outputs sort as intended in a lifted copy of the function
- [x] T006 [P1] Document the four generator files, the loop guard and the retry in the workflow README (`.github/workflows/README.md`). Done: one new `trigger-index-rebuild.yml` row names the four files, the trailer guard and the single reset-and-regenerate retry. Confirmed against `git diff` on the README
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Verification

- [ ] T007 [P0] Verify a commit whose subject only starts with the rebuild subject still runs the job, and the job's own rebuild commit does not. Open: needs one push of each kind on GitHub. Checked so far: the `if:` reads as intended and a suffix test on three sample messages skips only the message that ends with the trailer
- [ ] T008 [P0] Verify that all four files (`trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`) are staged and present in the commit. Open: needs a real rebuild commit to run `git ls-tree` against. Checked so far: the step names all four paths, checks each exists before `git add`, and passes `bash -n` and `shellcheck`
- [ ] T009 [P1] Verify the rebase retry logic by simulating a non-fast-forward race condition. Open: no race has been simulated or seen. Checked so far: the classifier sorts a `fetch first` rejection as non-fast-forward, and two review rounds read the retry path (round 1 four findings applied, round 2 none). The retry resets to the tip rather than rebasing
- [ ] T010 [P1] Verify a local index build produces the same output as a CI run on the same commit. Open: needs a CI run to compare against
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 tasks marked `[x]`
- [ ] All Phase 2 verification tasks marked `[x]`. Open: T007 to T010 need a live run on GitHub
- [ ] Acceptance criteria in `acceptance-criteria.md` show all rows passing. Open: AC-002, AC-003, AC-005 and AC-006 are Unmet until that run
<!-- /ANCHOR:completion -->

---



