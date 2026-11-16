---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "literal hook renames implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/003-literal-hook-renames"
    last_updated_at: "2026-11-15T18:38:50Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 3 after the gates and the review passed"
    next_safe_action: "Plan phase 4 with /speckit:plan"
    packet_purpose: "Purpose: Each of the three folders and 16 files carries a name that states its feature, and every reference in the repository resolves to the new name."
    blockers: []
    key_files:
      - "specs/hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/003-literal-hook-renames/implementation-summary.md"
      - "specs/hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/003-literal-hook-renames/acceptance-criteria.md"
      - "specs/hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/003-literal-hook-renames/tasks.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json"
      - ".skilled/hooks/README.md"
    session_dedup:
      fingerprint: "sha256:f7ec95f899a3542b8dd7c6a41ecf6a220f2b0cebcb01e69b51331305f9b7fbd0"
      session_id: "scaffold-003-literal-hook-renames"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "4a67bb98-9b69-45ae-bf93-76571742e1b7"
      workspace: "/Users/michelkerkmeester/worktrees/public/411-hook-library-cleanup"
      savedAt: "2026-11-15T18:38:50Z"
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
| **Spec Folder** | 003-literal-hook-renames |
| **Completed** | 2026-11-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three folders and 16 files under `.skilled/hooks/` now carry names that state their feature. `dispatch/` is `cli-dispatch/`, `task-dispatch/` is `subagent-dispatch-guard/` and `completion/` is `completion-evidence/`. Every registration, mirror link, import, test, workflow and doc line that named an old path names the new one.

### Phase 3: literal-hook-renames

You can now tell the two dispatch guards apart by name. `cli-dispatch/` guards CLI dispatch commands and `subagent-dispatch-guard/` guards sub-agent dispatch. `completion-evidence/` says what its scripts are called.

The flat runtime mirrors say which feature owns a file. `.claude/hooks/` shows `handover-stop-arm.mjs`, `post-edit-quality.cjs` and `decision-capture-posttooluse.mjs` where it showed `stop-arm.mjs`, `claude-posttooluse.cjs` and `ask-capture-posttooluse.mjs`. A hook error that prints a basename now names the feature to switch off.

Operator config works as before. No kill switch, concern key, registry hook id or handover log event id changed. The concern keys `dispatch`, `task-dispatch` and `completion` therefore differ from their folder names. No hook changed what it does when it fires.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/` (34 files), `task-dispatch/` (18 files), `completion/` (19 files) | Moved | To `cli-dispatch/`, `subagent-dispatch-guard/` and `completion-evidence/`. |
| `post-edit-quality/claude/claude-posttooluse.cjs` | Moved | To `post-edit-quality.cjs` in the same folder. |
| Eight adapters in `session-handover/claude/` and `session-handover/codex/` | Moved | Each gained the `handover-` prefix. |
| `subagent-dispatch-guard/lib/dispatch-guard.cjs` | Moved | To `subagent-dispatch-guard.cjs`. |
| Six `ask-capture-*` files in `decision-capture/claude/`, `devin/` and `vibe/` | Moved | To `decision-capture-posttooluse.*` and `decision-capture-post-tool.*`. |
| `hook-registry.json` | Modified | 24 `script` fields. No `id`, `concern`, event or slot changed. |
| `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` | Regenerated | By `sync-hook-registrations.cjs`. |
| Mirror links under `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/`, `.devin/hooks/` and `.dsh/plugins/repo-guards/adapters/` | Regenerated | By `sync-runtime-mirrors.cjs`. 11 links have a new name. |
| `.opencode/plugins/*.js` (3), `.pi/extensions/*.ts` (3), `.vibe/plugins/repo-guards/*.mjs` (2), `.vibe/hooks.toml`, five `sk-git` files, three `system-spec-kit/runtime/hooks/` files | Modified | The import, re-export or command path on each matching line. |
| Test files in `.opencode/plugins/tests/`, `.skilled/hooks/`, `system-deep-loop/runtime/tests/unit/`, `system-spec-kit/runtime/`, `cli-opencode/scripts/tests/` and `doctor/scripts/tests/` | Modified | The path, file name or quoted path segment on each matching line. |
| `.github/workflows/dispatch-enforcement-guard.yml`, `opencode-dual-version.yml` | Modified | One suite path and two path filters. |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modified | The `path` of each `file_exists` row that names a moved file. |
| READMEs, playbooks, feature catalogs, `SECURITY.md`, `ENV-REFERENCE.md`, `injection-contract.md`, `coverage-rationale.md` and the root `README.md` | Modified | The path or file name on each matching line. |
| `specs/hooks-plugins-extensions/dispatch/001-dispatch-adapter-test-repair/` | Moved | To `specs/hooks-plugins-extensions/cli-dispatch/` by `relocate.mjs --apply`. |
| `relocation-ledger.json`, `specs/descriptions.json` | Modified | Written by `relocate.mjs`. Its apply output names both. |
| `cite-drift-redirects.json` | Modified | Its `commit` and `renameRecords` fields changed. `relocate.mjs` refers to this file, so the apply is the likely writer. The apply output does not name it. |
| `durable-directory-manifest.json`, `baseline-readme-verdicts.json`, `trigger-index.json` and its three fixture files | Regenerated | Each pinned list was rebuilt with its own writer. |

`scratch/review-artifacts.txt` lists all 290 paths, derived from the current diff and `scratch/pre-phase3.patch`.

### Deviations from the plan

1. `relocate.mjs` refuses a sub-track path with "is not NNN-slug". The dry run and the apply named the one packet inside the sub-track, and the tool declared the new sub-track itself.
2. The apply left the old sub-track as a container of three tracked files. `git rm -r -f` removed it and `refresh-track-roots.mjs --track hooks-plugins-extensions --apply` printed `remove dispatch (written)`. The first apply was refused because a saved dry-run output in the tree named the moved path.
3. The root `README.md` holds two mentions of a new folder name, not one. Line 1141 held "completion-evidence nudge" at `HEAD`.
4. Two sibling links were missed by the four searches, because they start with `../`. `permission-policy/README.md` linked `../dispatch/README.md` and `session-lifecycle/README.md` linked `../completion/README.md`. The README reference check found both and both now name the new folder.
5. `sync-runtime-mirrors.cjs` left 11 new mirror links untracked and 11 old ones deleted in the working tree only. Both sets are staged, so the index matches the tree.
6. Three test files outside the file counts in `spec.md` changed, because each names a renamed path: `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs`, `decision-capture/lib/capture-core.test.mjs` and `sk-code-quality/scripts/tests/claude-posttooluse.test.sh`.
7. The review prompt passed the artifact paths as a file of paths, not inline. The list holds 290 lines.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every baseline gate ran before the first rename, and the four search outputs, the hook id list and the working-tree patch were saved. The seven renames then ran in series. Each one moved the files with `git mv`, replaced the old path string in every hand-written file, rendered the registrations and the mirrors, and reran the three hook suites before the next one started. The suites printed the baseline counts after every rename.

The bare folder mentions were read by hand next. Four doc lines were judged to name a folder and were renamed. Every "Concern" table row and `isHookEnabled` argument stayed. Then the spec sub-track moved and the pinned lists were rebuilt.

Verification ran from the final state. Each of the ten Claude adapters whose path changed ran through the command `.claude/settings.json` registers for it. A registered command exits 0 even when its adapter is missing, because it falls back to a drift line. So the run added a control that names a path with no file. The control printed the drift line and the ten adapters did not. `scratch/baseline/baseline.sh` then reran every gate and each row matched the saved run.

The review gate ran once and returned APPROVED, with no P0 or P1 finding and two suggestions:

1. The three root files of the new `cli-dispatch` spec sub-track were untracked while the old ones were staged as deleted. They are staged now.
2. `coverage-rationale.md:47` opens with "Only concerns" and lists six names, two of which are now folder names and not concern keys. The line is not changed, because this phase replaces names only. It is reported at packet close.

Nothing is committed, merged or pushed. The change lives in the worktree on branch `worktrees/411-hook-library-cleanup`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One path-form replacement per rename | A failed suite then points at one rename, and the rollback is the same replacement with its strings swapped. ADR-001. |
| Recorded output keeps its old paths | A benchmark report or a captured screen that names a new path would show a command that never ran. ADR-002. |
| `subagent-guard.test.cjs` keeps its file name | A test file is not mirrored into a flat folder, and its folder already names the feature. ADR-003. |
| Log event ids and concern ids stay | Four runtimes emit the same event ids, three test files assert them and operator config holds the switch names. ADR-004. |
| Stage the mirror links and the sub-track root files | The moves were staged by `git mv`. A commit of the index alone would otherwise ship registrations that point at links the commit does not hold. |
| Judge an adapter run by its drift line, not its exit code | The registered command exits 0 on a missing adapter. Only the drift line differs between a resolved adapter and a missing one. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ls -d` on the three new folders, `git ls-files` on the three old ones | The three folders printed, exit 0. 0 lines for the old ones. |
| The three `find` commands of REQ-002 | 0 lines, 6 files and 8 files. |
| Old-name search (`SEARCH` in `tasks.md`) | 0 lines. It printed 558 lines before the first rename. |
| `REL`, `SEG` and `BARE` | 0 lines, 0 lines and 3 lines that hold `dispatch/spawn`. They printed 20, 7 and 34 lines before. |
| A search for `../<old folder>` and `./<old folder>` outside JSON | Nothing printed after the two link fixes. It printed the two lines before them. |
| `sync-hook-registrations.cjs --check` | `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` |
| `sync-runtime-mirrors.cjs --check` | `PASS: 257 mirrors across 10 trees are in sync.` |
| Dangling-link `find` (`LINKS`) | Nothing printed before its `LINKS_DONE` marker. |
| Hook Vitest tree | `Test Files 9 passed (9)`, `Tests 501 passed (501)`. The same before the first rename. |
| Hook `node --test` suites | `tests 1839`, `pass 1838`, `fail 1`. The failing case is "the Cursor preflight, MCP route and Task guards still answer a normal payload", with `0 !== 2` at `hook-stdin-deadline.test.mjs:200`, before and after. |
| OpenCode plugin tests | `tests 591`, `pass 591`, `fail 0`. The same before. |
| `check-gate-inputs.sh` and the three bash test files | `files=46` and `RESULT: PASSED`. Then 61, 152 and 56 passed, each with `0 failed`. |
| Hook id list against `scratch/hook-ids-before.txt`, `git diff --stat HEAD` on `hook-flags.cjs` | The `diff` printed nothing with 35 ids on each side. The stat printed nothing. |
| `git diff --stat HEAD` on benchmark reports and captured question screens | Nothing printed. |
| Ten registered Claude adapter commands with a payload on stdin | `registered=10 exit0_no_drift=10 control_exit=0 control_drift=true`. |
| `check_readme_references.py` over the 183 hook READMEs | `SUMMARY files=183 pass=88 fail=95`, the same as before the first rename. |
| Hook READMEs: `validate_document.py` and `hvr_scan.py` | 183 pass and 0 fail. 158 pass and 25 fail. The same before. |
| `test_readme_manifest.py` | `manifest=reproducible`. |
| `test_readme_verdict_parity.py` | `PARITY baseline_files=1141 post_files=1141 diff_entries=0` and `PARITY PASS`. |
| `generate-trigger-index.mjs --check` | `trigger index matches the corpus`, 0 stale documents and 0 obsolete paths. |
| `quality-gate.cjs --worktree` | `gate=NO_BLOCKER_FOUND`, exit 0, over 403 files. Limitations 5 and 6 below cover its two failed checks. |
| `actionlint` on the three changed workflow files | Exit 0 with no output. |
| Review gate | APPROVED on the first run. 0 P0, 0 P1 and 2 P2. One applied, one reported at close. |

Acceptance: 12 criteria, 12 Met, none waived or superseded. The tasks.md checklist holds 10 of 10 P0, 12 of 12 P1 and 2 of 2 P2 items. See `acceptance-criteria.md`.

The review reran the searches, both sync checks, the registration paths, the id list and a line-by-line comparison of the diff. It took the suite counts, the adapter runs and the README reference counts from the saved output in `scratch/`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three concern keys differ from their folder names.** `dispatch` and `dispatch-guard` belong to `cli-dispatch/`, `task-dispatch` to `subagent-dispatch-guard/` and `completion` to `completion-evidence/`. Phase 4 adds one table to the root hooks README that maps each key to its folder.
2. **Old paths remain where a decision keeps them.** `specs/`, changelogs, benchmark reports and three captured question screens still name the old folders and files. A repository-wide search for an old name finds those files.
3. **`coverage-rationale.md:47` calls folder names "concerns".** The sentence lists `completion-evidence` and `cli-dispatch`, which are folders. The keys are `completion` and `dispatch`. Reported at packet close.
4. **The tree in `subagent-dispatch-guard/README.md` section 4 lost its comment alignment.** The longer file name pushed one column. Phase 4 rewrites that README.
5. **The quality gate reports two `secret.private-key` findings.** Lines 885 and 889 of `cli-dispatch/lib/dispatch-audit.test.mjs` hold a fixture key header for a scrubber test. `HEAD` holds the same lines under the old folder. The gate lists them because the move marks the whole file as touched.
6. **The gate's `actionlint` check fails on a README.** Its path filter hands `.github/workflows/README.md` to `actionlint`, which cannot parse Markdown. Reported at packet close.
7. **Codex may ask for hook approval again.** The command text of the renamed Codex hooks changed. This is the review's inference and was not run on Codex.
8. **One `node --test` case still fails.** It failed before phase 1. The Cursor Task guard exits 0 where the test expects 2. Reported at packet close.
<!-- /ANCHOR:limitations -->

---
