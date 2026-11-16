---
title: "Goal: Phase 1: dead-hook-file-removal"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dead hook file removal goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/001-dead-hook-file-removal"
    last_updated_at: "2026-11-15T14:58:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-hook-library-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: dead-hook-file-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** `.skilled/hooks/` holds no file that nothing installs or imports, and no test, list or doc still names one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `.skilled/hooks/git/` is deleted together with the test cases, the gate-list entry and the CI step that exist to prove it. |
| D2 | `hook-flags.mjs`, `hook-flags.cjs`, `hook-flags.sh`, the `git-commit-hooks` concern and `SYSTEM_GIT_COMMIT_HOOKS_DISABLED` stay, because live code reads them. |
| D3 | A re-pointed gate fixture case keeps its `expect` label and failure text shape. Only the file name changes. |
| D4 | READMEs change only on the lines that name a removed file. |
| D5 | The five untracked stray paths on the main checkout are removed only after the one log among them is backed up. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `git ls-files .skilled/hooks/git .skilled/hooks/shared/hook-flags.ts` prints nothing, and `rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' 'hooks/git($|[^-a-z])|hook-flags\.(ts|\{[^}]*\bts\b)' .` prints nothing
- [x] `bash .github/scripts/check-gate-inputs.sh` prints `files=46` and `RESULT: PASSED`, and `check-gate-inputs.test.sh`, `pre-commit.test.sh` and `source-root-selection.test.sh` each end with `0 failed`
- [x] The hook Vitest tree prints 501 passed, the OpenCode plugin tests print `fail 0`, the hook `node --test` suites fail only the `hook-stdin-deadline.test.mjs` case and `node --test .skilled/hooks/shared/hook-flags.test.cjs` prints `tests 31` and `fail 0`
- [x] `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` each print PASS
- [x] `test_readme_manifest.py`, `test_readme_verdict_parity.py` and `generate-trigger-index.mjs --check` each exit 0, with `baseline_files=1142`
- [x] `rg -c 'SYSTEM_GIT_COMMIT_HOOKS_DISABLED' .skilled/scripts/git-hooks/tests/pre-commit.test.sh` prints 4 or more, and `rg -c 'install-git-hooks.sh' implementation-summary.md` in this phase folder prints 1 or more
- [x] `ls` on the main checkout reports `.skilled/hooks/session-relaunch`, `decision-capture/.skilled`, `dispatch/node_modules`, `dispatch/lib/node_modules` and `dispatch/pi/node_modules` as missing, and the log among them has a backup
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | `/create:goal` run on 2026-11-15 from this phase's `spec.md` and `acceptance-criteria.md` |
| Stray paths removed | Done | AC-010 Met: the removal run printed `gone` for all five, and the log was copied to the session scratchpad first |
| Deletions and repairs | Done | The five tracked files are gone, the reference search is empty and every baseline gate matched its baseline from the final state on 2026-11-15 |
| Review and close | Done | Three review rounds each found stale doc text, all fixed. The operator approved closing without a fourth round. `implementation-summary.md` holds the release-note sentence |

### Deviations and findings

| Item | Note |
|------|------|
| Eleven acceptance rows, seven criteria | Rows that share a requirement were merged. The REQ-002 search is written out in full in place of the `SEARCH` reference in `tasks.md`, so the criterion needs no other file |
| Search criterion widened | The second review found the facade named in brace form, `hook-flags.{cjs,mjs,ts,sh}`. The search in the first criterion now matches that form |
| Criterion count amended from 1136 to 1142 | The committed README verdict baseline lacked six READMEs that exist at the base commit. Its writer added them, so the file count after removing one README is 1142 |
<!-- /ANCHOR:log -->
