---
title: "Implementation Summary"
description: "What the private-skill guard changes, how the harness and two probes proved it, and the limits it accepts."
trigger_phrases:
  - "ignore and commit guard implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/001-ignore-and-commit-guard"
    last_updated_at: "2026-10-23T16:45:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Landed the private-skill guard and its harness cases"
    next_safe_action: "Flip AC-015 after the phase commit is pushed"
    blockers: []
    key_files:
      - ".gitignore"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/scripts/git-hooks/tests/pre-commit.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-ignore-and-commit-guard"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-ignore-and-commit-guard |
| **Completed** | 2026-10-23 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A staged private skill now stops the commit, and the ignore layer keeps `local-*` skill paths out of `git status` in four roots. Before this phase the repository had no answer for those paths: `git check-ignore -v .skilled/skills/local-webflow/SKILL.md` exited 1. The phase closes that with four ignore rules and one blocking pre-commit guard that prints the repair it expects you to run.

### Phase 1: ignore-and-commit-guard

The guard reads the staged path names once and matches them against an anchored pattern covering eight skill roots. It refuses `.skilled/skills/local-probe/SKILL.md`, refuses a file nested inside a private skill, and stays quiet on a `local-` name that sits below the skill root. No bypass variable and no `lib/gates.tsv` row exists, because a switchable gate would defeat the only thing this gate does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.gitignore` | Modified | Four slash-less rules ignore `local-*` under `.skilled`, `.hermes`, `.codex` and `.cursor`. |
| `.skilled/scripts/git-hooks/pre-commit` | Modified | Blocks a staged private-skill path under any of eight skill roots before the comment-hygiene gate runs. |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified | Seven cases cover the block, the repair, the false-positive boundary, a renamed copy, a symlink and a gitlink. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Before the change the harness printed `pre-commit gates: 111 passed, 0 failed`. Seven new cases add 20 assertions, and the file now prints `131 passed, 0 failed` with no `FAIL` line. The diff is 3 files, 116 insertions and 2 deletions.

Proof beyond the harness came from two probes. A throwaway repository with `.skilled/skills/local-probe/SKILL.md` staged exits 1 and prints the gate name, the path and the `git rm --cached -r` repair. A real symlink named `local-probe` returns rc=0 from `git check-ignore -q` and resolves to `/.skilled/skills/local-*`. Review round 1 came back `VERDICT: PASS` at 94/100 with no P0 or P1 finding, and `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Eight guarded skill roots, with `.codex` and `.cursor` added to the original six (ADR-001) | Both roots are tracked today, so a six-root pattern would fail silently the first time someone creates `.cursor/skills`, which is exactly when the guard matters. |
| A blocking gate with no bypass variable and no `lib/gates.tsv` row (ADR-002) | A registry row is what makes a gate switchable, and staging a private skill is never the correct outcome. |
| Match the staged path name, and pin the renamed-copy limit in harness case 78 (ADR-003) | A content check needs a manifest of private bytes, which is a second artifact to keep current and a second place to leak. Case 78 holds the limit as an exit code so a later change cannot quietly claim more. |
| Pure bash with a NUL-separated `--diff-filter=ACMR` read under bash 3.2 (ADR-004) | The hook runs on every commit, so a `node` or `python3` dependency would inherit a runtime failure mode that skips the one check that must never skip. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Whole test harness (T016) | PASS: `pre-commit gates: 131 passed, 0 failed`, rc=0, zero `FAIL` lines |
| Throwaway-repository probe (T017) | PASS: rc=1, `BLOCKED [gate:private-skill]` plus the path and repair lines |
| Symlink probe (T018) | PASS: `git check-ignore -q` rc=0, rule `/.skilled/skills/local-*` named |
| Scope diff against `ac2be31e` (T020) | PASS: 3 files, 26 added lines naming `local-`, 0 naming `specs/`, `phase [0-9]` or `013-private` |
| Review round 1 (T022) | PASS: `VERDICT: PASS`, 94/100, no P0 or P1 finding, `git status --porcelain` byte-identical at 23 lines |
| `validate.sh --strict` (T023) | PASS: `RESULT: PASSED`, Errors 0, Warnings 1 |
| Phase base (T001) | `ac2be31ec60c3a15db527b3d8400ae68b373984a`, type `commit` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`git commit --no-verify` skips this guard.** It skips every gate in the hook, not this one alone, so the bypass is a property of the hook and not of the guard. `spec.md` records it in four places.
2. **Content that left the tree stays in git history.** No scrub runs inside this packet, and `spec.md` records that in four places.
3. **A renamed copy passes the guard.** The match is on the path name, so `.skilled/skills/private-copy/SKILL.md` commits. Harness case 78 pins exit code 0 for that case, and ADR-003 records why a content match would need a manifest this phase does not own.
4. **No recurring pre-push surface-token guard exists** after the one-time fresh-clone sweep. `spec.md` records the gap in three places and ADR-005 accepts it.
5. **The printed repair line interpolates the path inside double quotes.** A filename holding `$`, a backtick, a quote or a backslash breaks the pasted command, and in the worst case is evaluated on paste. The reviewer rated this P2 and left it as specified, because the expected output documented in `acceptance-criteria.md` pins the exact quoted form.
6. **A failing `git diff --cached` reads as an empty index.** The process-substitution exit status is discarded, so the guard cannot see the failure. The same idiom guards the comment-hygiene and mirror gates in this hook, and changing it here would need a new harness case and a new expected count.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:task-log -->
## Task Log

| Task | Result | AC | Key observation |
|------|--------|----|-----------------|
| T001 | pass | AC-013 | phase base `ac2be31ec60c3a15db527b3d8400ae68b373984a`, type `commit` |
| T002 | pass | AC-007 | line 96 is exactly `# --- Comment hygiene gate (blocking) ---`, count 1 |
| T003 | pass | AC-001 | lines 227 to 229 bracket `# Runtime state leaked into nested trees`, count 1 |
| T004 | pass | AC-012 | line 2 header sentence, line 929 doc-version case and line 999 summary echo all matched |
| T005 | pass-with-deviation | AC-012 | hook resolves inside this checkout, not SHADOWED |
| T006 | pass | AC-001, AC-002 | 4 rules, 4 check-ignore lines |
| T007 | pass | AC-003, AC-007, AC-008 | `bash -n` rc=0, `fi` last before the gate, `guard-before-hygiene`, constant count 1, `SPECKIT_SKIP_PRIVATE` 0, `private` in `gates.tsv` 0 |
| T008 | pass | AC-012 | header names the guard, the new cases land above the summary echo |
| T009 | pass | AC-003 | case 74 adds 3 assertions |
| T010 | pass | AC-004 | case 75 adds 1 assertion |
| T011 | pass | AC-005 | case 76 adds 10 assertions: 1 block, 8 root names, 1 nested file |
| T012 | pass | AC-006 | case 77 adds 2 assertions |
| T013 | pass | AC-011 | case 78 adds 2 assertions, the renamed copy exits 0 |
| T014 | pass | AC-009 | case 79 adds 1 assertion |
| T015 | pass | AC-010 | case 80 adds 1 assertion |
| T016 | pass | AC-012 | `pre-commit gates: 131 passed, 0 failed`, rc=0, zero `FAIL` lines |
| T017 | pass | AC-003 | throwaway repository: rc=1 with the block, path and repair text |
| T018 | pass | AC-002 | `git check-ignore -q` rc=0, rule `/.skilled/skills/local-*` named |
| T019 | pass | AC-002 | 1 hit for `local-probe` before removal, 0 after |
| T020 | pass | AC-013 | 3 files outside `specs/`, 26 added `local-` lines, 0 forbidden lines |
| T021 | pass | AC-014 | `spec.md` counts 4, 4, 3 and 5 |
| T022 | pass | AC-013 | review round 1 `VERDICT: PASS`, 94/100, status byte-identical |
| T023 | pass | AC-012, AC-013, AC-014 | `RESULT: PASSED`, Errors 0, Warnings 1 |
| T024 | pass | AC-015 | `scratch/` ends with `.gitkeep` alone |
| T025 | pass | AC-015 | one commit, subject `chore(git-hooks): block staged private skills and ignore local-* skill paths` |
| T026 | pass | AC-015 | pushed to `origin/main` with no force |
| T027 | pass | AC-015 | `worktree-clean` then `head-equals-origin-main` |
<!-- /ANCHOR:task-log -->

---

<!-- ANCHOR:deviations -->
## Deviations

| Deviation | Why it stands |
|-----------|---------------|
| The installed pre-commit hook is not shadowed in this checkout | `install-git-hooks.sh --status` reports `installed:` and `source:` both inside this checkout, so a local commit does exercise the edited file. The plan expected a shadowed copy and a count of 7 for the `SHADOWED:` line, and the search found no such line. The T005 stop condition, a missing `pre-commit` block, did not fire. |
| The legacy `.opencode/hooks/git/pre-commit` helper and `.skilled/scripts/git-hooks/README.md` still say "ten blocking sub-gates" | The README counts ten and this phase adds an eleventh. Both sit outside the phase's frozen three files, so they are recorded here for a docs phase rather than changed in this one. |
<!-- /ANCHOR:deviations -->
