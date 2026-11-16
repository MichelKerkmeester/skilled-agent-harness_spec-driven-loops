---
title: "Implementation Summary"
description: "The legacy git pre-commit folder and the unused TypeScript flags facade are gone from .skilled/hooks, and every test, gate list, CI step and doc line that named them is repaired."
trigger_phrases:
  - "dead hook file removal implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/001-dead-hook-file-removal"
    last_updated_at: "2026-11-15T16:34:12Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 1 after three review rounds and all eleven criteria Met"
    next_safe_action: "Run /speckit:plan on the 002-codex-hook-check-merge folder"
    packet_purpose: "Purpose: `.skilled/hooks/` holds no file that nothing installs or imports, and no test, list or doc still names one."
    blockers: []
    key_files:
      - "specs/hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/001-dead-hook-file-removal/implementation-summary.md"
      - "specs/hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/001-dead-hook-file-removal/tasks.md"
      - "specs/hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/001-dead-hook-file-removal/acceptance-criteria.md"
      - ".skilled/scripts/git-hooks/tests/pre-commit.test.sh"
      - ".github/scripts/check-gate-inputs.sh"
    session_dedup:
      fingerprint: "sha256:855b86068ac8fb5e2002fd86eedd14863b091269687596c22984bd649542d293"
      session_id: "scaffold-001-dead-hook-file-removal"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3ea54291-0b23-4abb-9332-032bf7c88ccf"
      workspace: "/Users/michelkerkmeester/worktrees/public/411-hook-library-cleanup"
      savedAt: "2026-11-15T16:34:12Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-dead-hook-file-removal |
| **Completed** | 2026-11-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`.skilled/hooks/` no longer holds the legacy `git/` pre-commit folder or the `shared/hook-flags.ts` facade. Nothing installed or imported either one. Every test, gate list, CI step and doc line that named them now names only files that exist.

### Phase 1: dead-hook-file-removal

You can now read `.skilled/hooks/` and trust that each file is live. The primary pre-commit in `.skilled/scripts/git-hooks/` is the only pre-commit, and `hook-flags.mjs` is the only ESM facade over `hook-flags.cjs`. The `git-commit-hooks` concern and `SYSTEM_GIT_COMMIT_HOOKS_DISABLED` still work, because the primary pre-commit reads them.

**Release note:** the standalone pre-commit at `.skilled/hooks/git/pre-commit` and its installer `.skilled/hooks/git/install-hooks.sh` are removed, so a repository that linked that hook must run `bash .skilled/scripts/install-git-hooks.sh` to install the primary hooks.

Five untracked stray paths under `.skilled/hooks/` on the main checkout are gone too. The one log among them was copied to the session scratchpad first.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/git/` (4 files) | Deleted | The legacy pre-commit, its installer, the installer test and the README. |
| `.skilled/hooks/shared/hook-flags.ts` | Deleted | The TypeScript facade that only its own test imported. |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modified | Three tests lost their `.ts` leg. Two assertions that only that leg held moved to the `.mjs` leg. |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified | The legacy section and its nine `run_legacy` cases are removed. |
| `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh` | Modified | Two list entries for the removed files are gone. |
| `.github/scripts/check-gate-inputs.sh` | Modified | The gate list drops the legacy pre-commit. |
| `.github/scripts/tests/check-gate-inputs.test.sh` | Modified | One list entry removed. Cases 14 and 43 to 47 use the fixture `bin/check-git-hooks.sh`. |
| `.github/scripts/tests/broken-move-drill.sh` | Modified | Three spots that ran the legacy pre-commit are removed. |
| `.github/workflows/opencode-plugin-tests.yml` | Modified | The installer test step is removed. The git identity step stays, because other hook suites commit in temporary repositories. |
| `.github/workflows/README.md` | Modified | The row for that workflow no longer names the installer test. |
| `.skilled/hooks/README.md`, `.skilled/hooks/shared/README.md` | Modified | Lines that named the removed files state current fact. |
| `.skilled/scripts/git-hooks/lib/README.md`, `ENV-REFERENCE.md`, `comment-hygiene-opencode-plugin.md`, `naming-and-commenting.md`, `sk-code-quality/SKILL.md` | Modified | Each line that named the legacy pre-commit or the facade is corrected. |
| `.skilled/commands/doctor/assets/doctor-env.yaml`, `.skilled/hooks/hook-flags.env.example` | Modified | The reader list `hook-flags.{cjs,mjs,ts,sh}` now reads `{cjs,mjs,sh}`. |
| `.skilled/scripts/git-hooks/tests/README.md` | Modified | The row for `pre-commit.test.sh` no longer says the legacy helper gets the same cases. |
| `README.md`, `.skilled/hooks/coverage-rationale.md` | Modified | The root README no longer lists `git` among the git cores, and the coverage notes lose their `git` section. |
| `durable-directory-manifest.json`, `baseline-readme-verdicts.json`, `trigger-index.json` and its three fixture files | Regenerated | Each pinned list was rebuilt with its own writer. |

### Deviations from the plan

1. `.github/workflows/README.md` is not in the `spec.md` file table. Its row for the edited workflow named the removed step, so the clause was removed.
2. `doctor-env.yaml` and `hook-flags.env.example` are not in the file table either. The second review found that both, and `ENV-REFERENCE.md`, named the deleted facade in brace form. The first reference search could not match that form, so it was widened in `tasks.md`, `spec.md` and `goal.md`.
3. `.skilled/scripts/git-hooks/tests/README.md` is not in the file table. The third review found a sentence there about the removed cases. No path search can match it, because it never names a path. The sentence was deleted.
4. The root `README.md` and `.skilled/hooks/coverage-rationale.md` are not in the file table. Both named the removed folder only as `git`. They were found after the phase closed, while phase 2 was being planned, and no review round caught them. Both mentions were removed. The same read found that `check_readme_references.py` failed on `.skilled/hooks/README.md`, because its `readme-check` block still allowed a reference the removed `git/` paragraph had held. The unused allow line was deleted.
5. The README verdict baseline holds `baseline_files=1142`, not 1136. The committed baseline lacked six READMEs that exist at the base commit, and the writer added them. AC-008 and the goal criterion were amended.
6. The manifest writer also re-sorted eight `session-handover` rows.
7. A trigger phrase in this phase's `spec.md` named the removed facade and reached a generated fixture. It was reworded and the index regenerated.
8. CHK-042 does not hold as written. The root README diff is 17 lines, not single-digit, because the title, the description and five other places named `git/`. Every changed line names the removed folder.
9. CHK-051 was reworded. `scratch/baseline/` keeps `baseline.sh` beside `summary.txt`, because later phases rerun that script.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline of every gate was captured in the worktree before the first edit. The deletions ran first, then the tests and gate lists, then CI, then the docs, and the pinned lists last. A negative control on re-pointed case 14 printed `60 passed, 1 failed` without its appended line and `61 passed, 0 failed` with it.

Every gate was rerun from the final state through `scratch/baseline/baseline.sh`, after the last review fix. The review gate ran three times and returned REQUESTED_CHANGES each time. No round found a fault in the code or the tests. Each found doc text that still described a removed file:

1. Round 1: two lines in `shared/README.md` said "ESM/TS facades".
2. Round 2: three lines named the facade in brace form.
3. Round 3: one sentence in `.skilled/scripts/git-hooks/tests/README.md` described the removed cases.

Each finding was confirmed with a command and fixed. The workflow allows two rounds. The operator approved a third, and then approved closing the phase on the fixed tree without a fourth. So this phase closes with no APPROVED verdict on record. After round 3, every doc line that describes an edited test, script or workflow was read, and none describes a removed case.

Nothing is committed, merged or pushed. The change lives in the worktree on branch `worktrees/411-hook-library-cleanup`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the legacy tests with the legacy hook | Each of the nine `run_legacy` cases has a counterpart that runs the primary pre-commit, so no live behaviour lost its only test. |
| Keep the git identity step in the workflow | Other hook suites make commits in temporary repositories and need an identity. |
| Move two assertions to the `.mjs` leg | `concernFlag` and the config-file form were asserted only on the `.ts` leg. Dropping them would have lost coverage of the facade that stays. |
| Re-point fixture cases, keep their labels | Cases 14 and 43 to 47 test the gate checker, not the legacy file. Only the fixture file name changed. |
| Leave two older playbook errors alone | `comment-hygiene-opencode-plugin.md` greps for `HYGIENE_HOOK` and credits the pre-commit with a doc-model-ref check. Both are older than this phase and are reported at packet close. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Acceptance: 11 criteria, 11 Met, none waived or superseded. See `acceptance-criteria.md`. Every P0 and P1 task in `tasks.md` is done.

| Check | Result |
|-------|--------|
| `git ls-files .skilled/hooks/git .skilled/hooks/shared/hook-flags.ts` | PASS. Prints nothing. It listed five files before the deletion. |
| Widened reference search (`SEARCH` in `tasks.md`) | PASS. Prints nothing. It prints 1 match on the base-commit `doctor-env.yaml` and 3 on the base-commit `shared/README.md`. |
| Hook Vitest tree | PASS. `Test Files 9 passed (9)`, `Tests 501 passed (501)`. Same as baseline. |
| Hook `node --test` suites | Same as baseline. `tests 1839`, `pass 1838`, `fail 1`. The one failure is the baseline case in `hook-stdin-deadline.test.mjs`. |
| OpenCode plugin tests | PASS. `tests 591`, `pass 591`, `fail 0`. |
| `node --test .skilled/hooks/shared/hook-flags.test.cjs` | PASS. `tests 31`, `fail 0`. |
| `check-gate-inputs.sh` | PASS. `files=46`, `RESULT: PASSED`. |
| `check-gate-inputs.test.sh` | PASS. `61 passed, 0 failed`. Baseline 61. |
| `pre-commit.test.sh` | PASS. `152 passed, 0 failed`. Baseline 163, minus the 11 assertions of the nine removed cases. |
| `source-root-selection.test.sh` | PASS. `56 passed, 0 failed`. Baseline 60, minus four checks on the two removed entries. |
| `sync-hook-registrations.cjs --check` | PASS. 4 registration files match the 35-hook registry. |
| `sync-runtime-mirrors.cjs --check` | PASS. 257 mirrors across 10 trees are in sync. |
| `test_readme_manifest.py` | PASS. `manifest=reproducible`. |
| `test_readme_verdict_parity.py` | PASS. `PARITY PASS`, `baseline_files=1142`. |
| `generate-trigger-index.mjs --check` | PASS. `trigger index matches the corpus`. |
| Hook READMEs, `validate_document.py` | PASS. 184 of 184. Baseline 185, minus the deleted `git/README.md`. |
| Hook READMEs, `hvr_scan.py` | Same as baseline. 157 pass and 27 fail. Phase 4 rewrites those READMEs. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **An outside repository may still link the removed pre-commit.** Git skips a dangling hook without a message. The release note above names the replacement installer.
2. **`broken-move-drill.sh` was not run end to end.** It clones the whole repository and runs locally only. `bash -n` passes. The review reported that it fails three pre-push cases at the base commit as well, which is outside this phase.
3. **The `hook-stdin-deadline.test.mjs` failure is older than this phase.** It failed in the baseline and is reported at packet close.
4. **A reworded mention of a removed file can still exist.** The reference search matches path forms only. Three review rounds each found one such line, and two more turned up after the phase closed. The workaround is a wording search, such as `legacy (hygiene )?helper`, when a doc looks wrong.
<!-- /ANCHOR:limitations -->
