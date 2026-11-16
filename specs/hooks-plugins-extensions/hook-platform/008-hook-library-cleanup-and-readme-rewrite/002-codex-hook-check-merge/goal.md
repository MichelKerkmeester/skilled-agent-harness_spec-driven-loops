---
title: "Goal: Phase 2: codex-hook-check-merge"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "codex hook check merge goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/002-codex-hook-check-merge"
    last_updated_at: "2026-11-15T14:58:51Z"
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
# Goal: Phase 2: codex-hook-check-merge

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** One folder, `.skilled/hooks/codex-global-hooks-check/`, holds both checks that run `install-codex-hooks.mjs --check` at session start.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `codex-global-hooks-check/` takes the files of `codex-watchdog/` and `hook-install/`. No other folder moves. |
| D2 | The new folder has one feature README that covers both checks. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `ls -d .skilled/hooks/codex-global-hooks-check` exits 0, and `ls -d .skilled/hooks/codex-watchdog .skilled/hooks/hook-install` reports both as missing
- [x] `find .skilled/hooks/codex-global-hooks-check -type l` lists 4 links, the OpenCode plugin link and the Claude, Cursor and Devin links to `install-codex-hooks.mjs`, and `find .skilled/hooks/codex-global-hooks-check -type l ! -exec test -e {} \; -print` prints nothing
- [x] `rg -c 'install-codex-hooks.mjs --check' .skilled/hooks/codex-global-hooks-check/README.md` prints 1 or more, and `validate_document.py`, `hvr_scan.py` and `check_readme_references.py` pass on that README
- [x] `rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' 'hooks/(codex-watchdog|hook-install)|(codex-watchdog|hook-install)/' .` prints nothing
- [x] `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` each print PASS, and `git diff --stat HEAD` on `hook-flags.cjs`, the OpenCode plugin, the installer and `hook-registry.json` prints nothing
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
| Goal authored | Done | `/create:goal` run on 2026-11-15 from this phase's `spec.md` |
| Phase planning | Done | `/speckit:plan` run on 2026-11-15. `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` hold no unfilled token |
| Folder merge | Done | Four links resolve under `codex-global-hooks-check/`, both old folders are gone and the old-folder search printed nothing on 2026-11-15. It printed 42 lines before the move |
| Feature README | Done | Written from `hook-registry.json`, the plugin and the installer. `VALID`, `hard blockers: 0` and `SUMMARY files=7 pass=7 fail=0` |
| Gates and close | Done | Every baseline gate matched the phase 1 final counts. The review gate returned APPROVED on its first run, with three suggestions that were applied |

### Deviations and findings

| Item | Note |
|------|------|
| Criteria amended at planning | The search now also matches a bare `codex-watchdog/` or `hook-install/`. The link criterion adds a dangling-link check. The README criterion adds the three checkers. The sync criterion adds an empty diff on the plugin, the installer, the resolver and the registry |
| Goal authored before the phase was planned | The objective, decisions and criteria come from the Phase Context and Handoff Criteria in this phase's `spec.md`, because its scope sections and `acceptance-criteria.md` were still scaffolds. Amend this goal when the phase is planned |
<!-- /ANCHOR:log -->
